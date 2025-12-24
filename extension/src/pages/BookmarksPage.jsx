import React, { useState, useEffect } from 'react';
import { Bookmark, Plus, LogOut, Loader2 } from 'lucide-react';
import { get, post, put, del } from '../services/api';
import { getToken, clearStorage, getUserData } from '../services/storage';
import Header from '../components/Header';
import BookmarkForm from '../components/BookmarkForm';
import BookmarkCard from '../components/BookmarkCard';
import FilterChips from '../components/FilterChips';
import CategoryForm from '../components/CategoryForm';
import ErrorNotification from '../components/ErrorNotification';
import ProfileMenu from '../components/ProfileMenu';
import Toast from '../components/Toast';

const BookmarksPage = ({ onLogout }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [error, setError] = useState('');
  const [errorNotification, setErrorNotification] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('compact'); // 'compact' or 'detail'
  const [deleteMode, setDeleteMode] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toast, setToast] = useState(null);
  const [defaultCategory, setDefaultCategory] = useState(null);
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date', 'alphabetical', 'url'
  const [activeFilters, setActiveFilters] = useState(['all']); // Array for multi-select

  useEffect(() => {
    fetchBookmarks();
    fetchCategories();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const userData = await getUserData();
    setUser(userData);
  };

  const fetchBookmarks = async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const token = await getToken();
      const data = await get('/api/bookmarks', token);
      setBookmarks(data.bookmarks || []);
      setError('');
    } catch (err) {
      const errorMsg = err.message === 'Failed to fetch' 
        ? 'Backend server is down. Please start the server.'
        : 'Failed to load bookmarks';
      setErrorNotification(errorMsg);
      console.error('Fetch error:', err);
    } finally {
      if (showLoading) setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = await getToken();
      const data = await get('/api/categories', token);
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchBookmarks(false);
  };

  const handleAddUrlInCategory = () => {
    // Set defaultCategory berdasarkan activeFilters (ambil yang pertama jika multi-select)
    if (activeFilters.length > 0 && !activeFilters.includes('all')) {
      setDefaultCategory(activeFilters[0]);
    }
    setShowForm(true);
  };

  const handleEditBookmark = (bookmark) => {
    setEditingBookmark(bookmark);
    setShowForm(true);
  };

  const handleAddBookmark = async (title, url, categoryId) => {
    try {
      const token = await getToken();
      
      // Jika sedang edit, update bookmark
      if (editingBookmark) {
        const updatedBookmark = await put(`/api/bookmarks/${editingBookmark.id}`, { title, url, categoryId }, token);
        setBookmarks(bookmarks.map(b => b.id === editingBookmark.id ? updatedBookmark.bookmark : b));
        setToast({ type: 'success', message: 'Bookmark updated successfully!' });
      } else {
        // Jika tidak, tambah bookmark baru
        const newBookmark = await post('/api/bookmarks', { title, url, categoryId }, token);
        setBookmarks([newBookmark.bookmark, ...bookmarks]);
        setToast({ type: 'success', message: 'Bookmark added successfully!' });
      }
      
      setShowForm(false);
      setDefaultCategory(null);
      setEditingBookmark(null);
      setError('');
    } catch (err) {
      const errorMsg = err.message === 'Failed to fetch'
        ? `Cannot ${editingBookmark ? 'update' : 'add'} bookmark. Backend server is down.`
        : `Failed to ${editingBookmark ? 'update' : 'add'} bookmark`;
      setErrorNotification(errorMsg);
      console.error(`${editingBookmark ? 'Update' : 'Add'} error:`, err);
    }
  };

  const handleAddCategory = async (name, color) => {
    try {
      const token = await getToken();
      const newCategory = await post('/api/categories', { name, color }, token);
      setCategories([...categories, newCategory.category]);
      setShowCategoryForm(false);
      setError('');
      setToast({ type: 'success', message: `Category "${name}" created!` });
      return newCategory.category; // Return the created category
    } catch (err) {
      const errorMsg = err.message === 'Failed to fetch'
        ? 'Cannot add category. Backend server is down.'
        : 'Failed to add category';
      setErrorNotification(errorMsg);
      console.error('Add category error:', err);
      return null;
    }
  };

  const handleDeleteBookmark = async (id, skipConfirm = false) => {
    try {
      const token = await getToken();
      await del(`/api/bookmarks/${id}`, token);
      setBookmarks(bookmarks.filter((b) => b.id !== id));
      setError('');
      setToast({ type: 'success', message: 'Bookmark deleted successfully!' });
    } catch (err) {
      const errorMsg = err.message === 'Failed to fetch'
        ? 'Cannot delete bookmark. Backend server is down.'
        : 'Failed to delete bookmark';
      setErrorNotification(errorMsg);
      console.error('Delete error:', err);
    }
  };

  const handleOpenBookmark = (url) => {
    // Buka URL di tab baru
    chrome.tabs.create({ url });
  };

  const handleLogout = async () => {
    await clearStorage();
    setToast({ type: 'success', message: 'Logged out successfully!' });
    setTimeout(() => onLogout(), 1000);
  };

  // Auto categorize bookmark berdasarkan domain
  const categorizeBookmark = (url) => {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      
      // Work related
      if (domain.includes('mail') || domain.includes('drive') || domain.includes('docs') || 
          domain.includes('slack') || domain.includes('zoom') || domain.includes('notion')) {
        return 'work';
      }
      
      // Social media
      if (domain.includes('facebook') || domain.includes('twitter') || domain.includes('instagram') || 
          domain.includes('linkedin') || domain.includes('tiktok') || domain.includes('youtube')) {
        return 'social';
      }
      
      // Development
      if (domain.includes('github') || domain.includes('stackoverflow') || domain.includes('dev.to') ||
          domain.includes('vercel') || domain.includes('netlify') || domain.includes('npm')) {
        return 'dev';
      }
      
      // Personal (shopping, entertainment, etc)
      if (domain.includes('amazon') || domain.includes('netflix') || domain.includes('spotify') ||
          domain.includes('steam') || domain.includes('reddit')) {
        return 'personal';
      }
      
      return 'other';
    } catch {
      return 'other';
    }
  };

  // Filter, Search, dan Sort bookmarks
  const filteredBookmarks = bookmarks
    // Filter by categories (multi-select)
    .filter(bookmark => {
      if (activeFilters.includes('all')) return true;
      if (activeFilters.includes(bookmark.categoryId)) return true;
      // Fallback to auto-categorize for old bookmarks without category
      if (!bookmark.categoryId) {
        return activeFilters.some(filter => categorizeBookmark(bookmark.url) === filter);
      }
      return false;
    })
    // Search by title or URL
    .filter(bookmark => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.url.toLowerCase().includes(query)
      );
    })
    // Sort bookmarks
    .sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'url':
          return a.url.localeCompare(b.url);
        case 'date':
        default:
          // Newest first (assuming bookmarks have createdAt or use array order)
          return bookmarks.indexOf(b) - bookmarks.indexOf(a);
      }
    });

  return (
    <div className="min-h-screen bg-neo-cream">
      {/* Error Notification */}
      <ErrorNotification 
        message={errorNotification}
        onClose={() => setErrorNotification('')}
      />

      {/* Header */}
      <Header 
        onProfileClick={() => setShowProfileMenu(!showProfileMenu)}
        onAddClick={() => setShowForm(!showForm)}
        viewMode={viewMode}
        onViewModeChange={() => setViewMode(viewMode === 'compact' ? 'detail' : 'compact')}
        deleteMode={deleteMode}
        onDeleteModeToggle={() => setDeleteMode(!deleteMode)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Profile Menu */}
      {showProfileMenu && (
        <ProfileMenu 
          user={user}
          onLogout={handleLogout}
          onClose={() => setShowProfileMenu(false)}
        />
      )}

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-4 border-red-600 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm font-bold text-center">{error}</p>
          </div>
        )}

        {/* Add Bookmark Form */}
        {showForm && (
          <div className="mb-6 fade-in">
            <BookmarkForm
              onSubmit={handleAddBookmark}
              onCancel={() => {
                setShowForm(false);
                setDefaultCategory(null);
                setEditingBookmark(null);
              }}
              categories={categories}
              onCreateCategory={handleAddCategory}
              defaultCategory={defaultCategory}
              editingBookmark={editingBookmark}
            />
          </div>
        )}

        {/* Add Category Form */}
        {showCategoryForm && (
          <div className="fade-in">
            <CategoryForm
              onSubmit={handleAddCategory}
              onCancel={() => setShowCategoryForm(false)}
            />
          </div>
        )}

        {/* Filter Chips */}
        {!isLoading && bookmarks.length > 0 && (
          <FilterChips 
            activeFilters={activeFilters}
            onFilterChange={setActiveFilters}
            categories={categories}
            onAddCategory={() => setShowCategoryForm(!showCategoryForm)}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-black animate-spin" strokeWidth={3} />
          </div>
        ) : bookmarks.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-neo-pink border-4 border-black shadow-brutal mb-6">
              <Bookmark className="w-12 h-12 text-black" strokeWidth={3} />
            </div>
            <h3 className="text-3xl font-black text-black mb-3">
              No bookmarks yet
            </h3>
            <p className="text-black font-semibold text-lg mb-8">
              Start saving your favorite links
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 bg-neo-blue text-black font-black px-8 py-4 rounded-xl border-4 border-black shadow-brutal hover:shadow-brutal-sm active:shadow-none transition-all"
            >
              <Plus className="w-6 h-6" strokeWidth={3} />
              Add Your First Bookmark
            </button>
          </div>
        ) : (
          /* Bookmarks Grid */
          <div className={`grid gap-3 ${
            viewMode === 'compact' ? 'grid-cols-6' : 'grid-cols-2'
          }`}>
            {filteredBookmarks.length === 0 ? (
              <div className={`text-center py-12 ${
                viewMode === 'compact' ? 'col-span-6' : 'col-span-2'
              }`}>
                <p className="text-black font-bold text-lg">
                  {searchQuery ? `No bookmarks found for "${searchQuery}"` : 'No bookmarks in this category'}
                </p>
                <button
                  onClick={() => {
                    setActiveFilters(['all']);
                    setSearchQuery('');
                  }}
                  className="mt-4 text-black font-bold underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                {/* Add URL Button - only show when filtering by category */}
                {!activeFilters.includes('all') && !searchQuery && (
                  viewMode === 'compact' ? (
                    <div className="flex flex-col items-center cursor-pointer group transition-all active:scale-95">
                      <button
                        onClick={handleAddUrlInCategory}
                        className="w-14 h-14 rounded-xl bg-neo-blue border-3 border-black shadow-brutal-sm hover:shadow-brutal flex items-center justify-center mb-1.5 transition-all"
                      >
                        <Plus className="w-8 h-8 text-black" strokeWidth={3} />
                      </button>
                      <p className="text-black font-semibold text-[10px] text-center leading-tight px-0.5">
                        Add URL
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={handleAddUrlInCategory}
                      className="bg-neo-blue rounded-xl p-3 border-3 border-black shadow-brutal hover:shadow-brutal-sm cursor-pointer transition-all active:shadow-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-white border-3 border-black flex items-center justify-center flex-shrink-0">
                          <Plus className="w-8 h-8 text-black" strokeWidth={3} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-black font-bold text-xs leading-tight">
                            Add URL
                          </h3>
                        </div>
                      </div>
                    </button>
                  )
                )}
                
                {filteredBookmarks.map((bookmark) => (
                  <BookmarkCard
                    key={bookmark.id}
                    bookmark={bookmark}
                    onOpen={handleOpenBookmark}
                    onDelete={handleDeleteBookmark}
                    onEdit={handleEditBookmark}
                    viewMode={viewMode}
                    deleteMode={deleteMode}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-neo-cream border-t-3 border-black py-2">
        <p className="text-center text-black font-bold text-sm">
          {bookmarks.length} saved
        </p>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default BookmarksPage;

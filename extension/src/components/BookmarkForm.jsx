import React, { useState, useRef, useEffect } from 'react';
import { Save, X, Link as LinkIcon, FileText, Tag, Sparkles, Plus, ChevronDown } from 'lucide-react';

const BookmarkForm = ({ onSubmit, onCancel, categories = [], onCreateCategory }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter categories based on search
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Get selected category name
  const selectedCategory = categories.find(cat => cat.id === categoryId);

  // Handle category selection
  const handleSelectCategory = (cat) => {
    setCategoryId(cat.id);
    setCategorySearch(cat.name);
    setShowCategoryDropdown(false);
  };

  // Handle create new category
  const handleCreateCategory = async () => {
    if (!categorySearch.trim()) return;
    
    const colors = ['neo-yellow', 'neo-pink', 'neo-blue', 'neo-green', 'neo-purple', 'neo-orange'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    if (onCreateCategory) {
      const newCategory = await onCreateCategory(categorySearch.trim(), randomColor);
      if (newCategory) {
        setCategoryId(newCategory.id);
        setCategorySearch(newCategory.name);
        setShowCategoryDropdown(false);
      }
    }
  };

  // Handle Enter key in category search
  const handleCategoryKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCategories.length === 0 && categorySearch.trim()) {
        handleCreateCategory();
      } else if (filteredCategories.length === 1) {
        handleSelectCategory(filteredCategories[0]);
      }
    }
  };

  // Auto-generate title from URL
  const handleGenerateTitle = async () => {
    if (!url.trim()) {
      alert('Please enter a URL first');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(url);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const pageTitle = doc.querySelector('title')?.textContent || '';
      
      if (pageTitle) {
        setTitle(pageTitle.trim());
      } else {
        // Fallback: generate from hostname
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.replace('www.', '');
        setTitle(hostname.charAt(0).toUpperCase() + hostname.slice(1));
      }
    } catch (error) {
      // Fallback: generate from hostname
      try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.replace('www.', '');
        setTitle(hostname.charAt(0).toUpperCase() + hostname.slice(1));
      } catch {
        alert('Please enter a valid URL');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !url.trim()) {
      return;
    }

    // Validasi URL
    try {
      new URL(url);
    } catch {
      alert('Please enter a valid URL');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(title.trim(), url.trim(), categoryId || null);
      setTitle('');
      setUrl('');
      setCategoryId('');
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border-4 border-black shadow-brutal fade-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-black text-black flex items-center gap-2">
          <Save className="w-6 h-6" strokeWidth={3} />
          Add New Bookmark
        </h3>
        <button
          onClick={onCancel}
          className="text-black hover:bg-neo-cream p-1 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" strokeWidth={3} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* URL Input - SEKARANG DI ATAS */}
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            URL
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" strokeWidth={2.5} />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-neo-purple text-black font-semibold pl-12 pr-4 py-3 rounded-lg border-3 border-black focus:border-black transition-all placeholder-gray-500"
              placeholder="https://example.com"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Title Input - SEKARANG DI BAWAH */}
        <div>
          <label className="block text-sm font-bold text-black mb-2">
            Title
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" strokeWidth={2.5} />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-neo-green text-black font-semibold pl-12 pr-4 py-3 rounded-lg border-3 border-black focus:border-black transition-all placeholder-gray-500"
                placeholder="Ma Awesome Website"
                required
                disabled={isSubmitting}
                maxLength={100}
              />
            </div>
            <button
              type="button"
              onClick={handleGenerateTitle}
              disabled={isGenerating || isSubmitting || !url.trim()}
              className="bg-neo-yellow text-black font-black px-4 py-3 rounded-lg border-3 border-black shadow-brutal hover:shadow-brutal-sm active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              title="Auto-generate title from URL"
            >
              <Sparkles className="w-5 h-5" strokeWidth={3} />
              {isGenerating ? '...' : 'Auto'}
            </button>
          </div>
        </div>

        {/* Category Selector - Searchable */}
        <div ref={dropdownRef}>
          <label className="block text-sm font-bold text-black mb-2">
            Category {!categoryId && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black z-10" strokeWidth={2.5} />
            <input
              type="text"
              value={categorySearch}
              onChange={(e) => {
                setCategorySearch(e.target.value);
                setShowCategoryDropdown(true);
              }}
              onFocus={() => setShowCategoryDropdown(true)}
              onKeyDown={handleCategoryKeyDown}
              className="w-full bg-neo-yellow text-black font-semibold pl-12 pr-10 py-3 rounded-lg border-3 border-black focus:border-black transition-all placeholder-gray-500"
              placeholder={selectedCategory ? selectedCategory.name : "Search or create category..."}
              disabled={isSubmitting}
            />
            <ChevronDown 
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black cursor-pointer"
              strokeWidth={2.5}
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            />

            {/* Dropdown */}
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border-3 border-black rounded-lg shadow-brutal max-h-48 overflow-y-auto z-20">
                {/* Filtered Categories */}
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleSelectCategory(cat)}
                      className="w-full text-left px-4 py-3 hover:bg-neo-cream transition-colors border-b-2 border-black last:border-b-0 font-semibold text-black flex items-center gap-2"
                    >
                      <div className={`w-4 h-4 rounded border-2 border-black bg-${cat.color || 'neo-yellow'}`}></div>
                      {cat.name}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-black font-semibold">
                    {categorySearch.trim() ? (
                      <button
                        type="button"
                        onClick={handleCreateCategory}
                        className="w-full flex items-center gap-2 bg-neo-green px-3 py-2 rounded-lg border-2 border-black hover:shadow-brutal-sm transition-all"
                      >
                        <Plus className="w-4 h-4" strokeWidth={3} />
                        Create "{categorySearch}"
                      </button>
                    ) : (
                      <span className="text-sm opacity-70">Type to search or create...</span>
                    )}
                  </div>
                )}

                {/* Create New Button (if search has results) */}
                {filteredCategories.length > 0 && categorySearch.trim() && 
                 !categories.find(cat => cat.name.toLowerCase() === categorySearch.toLowerCase()) && (
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="w-full flex items-center gap-2 bg-neo-green text-black font-black px-4 py-3 border-t-3 border-black hover:bg-opacity-80 transition-all"
                  >
                    <Plus className="w-4 h-4" strokeWidth={3} />
                    Create "{categorySearch}"
                  </button>
                )}
              </div>
            )}
          </div>
          {!categoryId && (
            <p className="text-xs text-black font-semibold mt-1 opacity-70">
              💡 Type to search, or press Enter to create new
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-neo-blue text-black font-black py-3 rounded-lg border-3 border-black shadow-brutal hover:shadow-brutal-sm active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" strokeWidth={3} />
            {isSubmitting ? 'Saving...' : 'Save Bookmark'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-white text-black font-black rounded-lg border-3 border-black shadow-brutal hover:shadow-brutal-sm active:shadow-none transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookmarkForm;

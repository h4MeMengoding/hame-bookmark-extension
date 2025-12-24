import React, { useState } from 'react';
import { ExternalLink, Trash2, X } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

const BookmarkCard = ({ bookmark, onOpen, onDelete, onEdit, viewMode = 'compact', deleteMode = false }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    setIsDeleting(true);
    try {
      await onDelete(bookmark.id, true);
    } catch (error) {
      console.error('Delete error:', error);
      setIsDeleting(false);
    }
  };

  const handleClick = () => {
    if (deleteMode) {
      handleDelete({ stopPropagation: () => {} });
    } else {
      onOpen(bookmark.url);
    }
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    if (!deleteMode && onEdit) {
      onEdit(bookmark);
    }
  };

  // Get favicon dengan service yang lebih akurat - try direct favicon first
  const getFavicon = (url) => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      const baseUrl = `${urlObj.protocol}//${domain}`;
      
      // Try to get the actual favicon from the site first
      return `${baseUrl}/favicon.ico`;
    } catch {
      return null;
    }
  };

  // Multiple fallback strategy untuk icon
  const handleFaviconError = (e, url) => {
    const img = e.target;
    const currentSrc = img.src;
    
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      
      // Fallback chain:
      // 1. Direct favicon.ico (already tried)
      // 2. DuckDuckGo
      // 3. Google
      // 4. Hide
      
      if (currentSrc.includes('favicon.ico')) {
        // Try DuckDuckGo
        img.src = `https://icons.duckduckgo.com/ip3/${domain}.ico`;
      } else if (currentSrc.includes('duckduckgo')) {
        // Try Google with larger size
        img.src = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      } else {
        // All failed, hide
        img.style.display = 'none';
      }
    } catch {
      img.style.display = 'none';
    }
  };

  const colors = ['neo-yellow', 'neo-pink', 'neo-blue', 'neo-green', 'neo-purple', 'neo-orange'];
  const randomColor = colors[bookmark.id.charCodeAt(0) % colors.length];

  // Detail View
  if (viewMode === 'detail') {
    return (
      <div
        onClick={handleClick}
        onContextMenu={handleRightClick}
        className={`
          bg-${randomColor} rounded-xl p-3 border-3 border-black 
          shadow-brutal hover:shadow-brutal-sm cursor-pointer 
          transition-all active:shadow-none
          ${deleteMode ? 'hover:bg-red-100' : ''}
        `}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-white border-3 border-black flex items-center justify-center flex-shrink-0 overflow-hidden">
            {getFavicon(bookmark.url) ? (
              <img 
                src={getFavicon(bookmark.url)} 
                alt="" 
                className="w-8 h-8"
                onError={(e) => handleFaviconError(e, bookmark.url)}
              />
            ) : (
              <ExternalLink className="w-6 h-6 text-black" strokeWidth={2.5} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-black font-bold text-xs leading-tight line-clamp-2 mb-0.5">
              {bookmark.title}
            </h3>
            <p className="text-black text-[10px] font-semibold truncate opacity-60">
              {new URL(bookmark.url).hostname.replace('www.', '')}
            </p>
            {/* Tags */}
            {bookmark.tags && bookmark.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {bookmark.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-2 py-0.5 bg-white rounded border-2 border-black text-[8px] font-bold"
                  >
                    {tag}
                  </span>
                ))}
                {bookmark.tags.length > 3 && (
                  <span className="inline-block px-2 py-0.5 bg-white rounded border-2 border-black text-[8px] font-bold">
                    +{bookmark.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
          {/* Icon tong sampah hanya muncul saat delete mode aktif */}
          {deleteMode && (
            <Trash2 className="w-5 h-5 text-red-600" strokeWidth={3} />
          )}
        </div>
      </div>
    );
  }

  // Compact View
  return (
    <div className="relative">
      <div
        onClick={handleClick}
        onContextMenu={handleRightClick}
        className={`
          flex flex-col items-center cursor-pointer group
          transition-all active:scale-95
          ${deleteMode ? 'animate-pulse' : ''}
        `}
      >
        {/* Icon Container */}
        <div className={`
          w-14 h-14 rounded-xl bg-${randomColor} border-3 border-black 
          shadow-brutal-sm hover:shadow-brutal 
          flex items-center justify-center 
          overflow-hidden mb-1.5
          transition-all
        `}>
          {getFavicon(bookmark.url) ? (
            <img 
              src={getFavicon(bookmark.url)} 
              alt="" 
              className="w-8 h-8"
              onError={(e) => handleFaviconError(e, bookmark.url)}
            />
          ) : (
            <ExternalLink className="w-6 h-6 text-black" strokeWidth={2.5} />
          )}
        </div>

        {/* Title - ukuran lebih kecil, lebih banyak text sebelum ... */}
        <p className="text-black font-semibold text-[10px] text-center leading-tight line-clamp-2 px-0.5 max-w-full break-words">
          {bookmark.title}
        </p>
      </div>

      {/* Delete Button (on hover) */}
      {showMenu && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 border-2 border-black flex items-center justify-center hover:bg-red-600 transition-all disabled:opacity-50 z-10"
          title="Delete bookmark"
        >
          <X className="w-4 h-4 text-white" strokeWidth={3} />
        </button>
      )}

      {/* Confirm Delete Dialog */}
      {showConfirm && (
        <ConfirmDialog
          title="Delete Bookmark"
          message={`Are you sure you want to delete "${bookmark.title}"?`}
          confirmText="Yes, Delete"
          cancelText="Cancel"
          type="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default BookmarkCard;

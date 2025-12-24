import React, { useState } from 'react';
import { ExternalLink, Trash2, X } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

const BookmarkCard = ({ bookmark, onOpen, onDelete, viewMode = 'compact', deleteMode = false }) => {
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

  const handleLongPress = (e) => {
    e.preventDefault();
    setShowMenu(!showMenu);
  };

  // Get favicon dari Google's favicon service
  const getFavicon = (url) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
      return null;
    }
  };

  const colors = ['neo-yellow', 'neo-pink', 'neo-blue', 'neo-green', 'neo-purple', 'neo-orange'];
  const randomColor = colors[bookmark.id.charCodeAt(0) % colors.length];

  // Detail View
  if (viewMode === 'detail') {
    return (
      <div
        onClick={handleClick}
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
                onError={(e) => e.target.style.display = 'none'}
              />
            ) : (
              <ExternalLink className="w-6 h-6 text-black" strokeWidth={2.5} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-black font-black text-sm truncate">
              {bookmark.title}
            </h3>
            <p className="text-black text-xs font-semibold truncate opacity-70">
              {new URL(bookmark.url).hostname.replace('www.', '')}
            </p>
          </div>
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
        onContextMenu={handleLongPress}
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
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <ExternalLink className="w-6 h-6 text-black" strokeWidth={2.5} />
          )}
        </div>

        {/* Title */}
        <p className="text-black font-bold text-xs text-center leading-tight line-clamp-2 px-1 max-w-full break-words">
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

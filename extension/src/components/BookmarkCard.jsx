import React, { useState, useEffect } from 'react';
import { ExternalLink, Trash2, X } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import { getFavicon, DEFAULT_FAVICON } from '../services/favicon';
import { ImageLoading } from './LoadingAnimation';

const BookmarkCard = ({ bookmark, onOpen, onDelete, onEdit, viewMode = 'compact', deleteMode = false, category = null }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [faviconUrl, setFaviconUrl] = useState(DEFAULT_FAVICON);
  const [faviconLoading, setFaviconLoading] = useState(true);

  // Load favicon secara otomatis dari backend
  useEffect(() => {
    let mounted = true;

    const loadFavicon = async () => {
      // If custom iconUrl is provided, use it directly
      if (bookmark.iconUrl) {
        console.log('[BookmarkCard] Using custom iconUrl:', bookmark.iconUrl);
        setFaviconUrl(bookmark.iconUrl);
        setFaviconLoading(false);
        return;
      }

      setFaviconLoading(true);
      try {
        console.log('[BookmarkCard] Loading favicon for:', bookmark.url);
        const url = await getFavicon(bookmark.url);
        console.log('[BookmarkCard] Favicon result:', url);
        if (mounted) {
          setFaviconUrl(url);
          setFaviconLoading(false);
        }
      } catch (error) {
        console.error('[BookmarkCard] Error loading favicon:', error);
        if (mounted) {
          setFaviconUrl(DEFAULT_FAVICON);
          setFaviconLoading(false);
        }
      }
    };

    loadFavicon();

    return () => {
      mounted = false;
    };
  }, [bookmark.url, bookmark.iconUrl]);

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

  const colors = ['neo-yellow', 'neo-pink', 'neo-blue', 'neo-green', 'neo-purple', 'neo-orange'];
  // Use category color if available, otherwise use random color based on bookmark id
  const cardColor = category?.color || colors[bookmark.id.charCodeAt(0) % colors.length];
  const isHex = typeof cardColor === 'string' && cardColor.startsWith('#');
  const bgClass = isHex ? '' : `bg-${cardColor}`;

  // Detail View
  if (viewMode === 'detail') {

    return (
      <div
        onClick={handleClick}
        onContextMenu={handleRightClick}
        className={
          `${bgClass} rounded-xl p-3 border-3 border-black shadow-brutal hover:shadow-brutal-sm cursor-pointer transition-all active:shadow-none ${deleteMode ? 'hover:bg-red-100' : ''}`
        }
        style={isHex ? { backgroundColor: cardColor } : undefined}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-white border-3 border-black flex items-center justify-center flex-shrink-0 overflow-hidden">
            {faviconLoading ? (
              <ImageLoading />
            ) : faviconUrl && faviconUrl !== DEFAULT_FAVICON ? (
              <img 
                src={faviconUrl} 
                alt="" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.target.src = DEFAULT_FAVICON;
                }}
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
        <div
          className={`w-14 h-14 rounded-xl ${bgClass} border-3 border-black shadow-brutal-sm hover:shadow-brutal flex items-center justify-center overflow-hidden mb-1.5 transition-all`}
          style={isHex ? { backgroundColor: cardColor } : undefined}
        >
          {faviconLoading ? (
            <ImageLoading />
          ) : faviconUrl && faviconUrl !== DEFAULT_FAVICON ? (
            <img 
              src={faviconUrl} 
              alt="" 
              className="w-8 h-8 object-contain"
              onError={(e) => {
                e.target.src = DEFAULT_FAVICON;
              }}
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

import React from 'react';
import { Plus, Grid3x3, List, Trash2, RefreshCw, User, DownloadCloud } from 'lucide-react';

const Header = ({ 
  onProfileClick, 
  onAddClick, 
  viewMode, 
  onViewModeChange,
  deleteMode,
  onDeleteModeToggle,
  onRefresh,
  onCheckUpdate = () => {},
  isRefreshing
}) => {
  return (
    <div className="sticky top-0 z-50 bg-neo-yellow border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-2.5 rounded-sm">
            <img 
              src="/icons/hame.png" 
              alt="Hame Bookmark" 
              className="h-8"
            />
          </div>

          {/* Spacer (search moved to FilterChips) */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <button
              onClick={onViewModeChange}
              className="p-2 bg-white text-black rounded-lg border-3 border-black shadow-brutal-sm hover:shadow-none active:shadow-none transition-all"
              title={viewMode === 'compact' ? 'Detail View' : 'Compact View'}
            >
              {viewMode === 'compact' ? (
                <List className="w-4 h-4" strokeWidth={3} />
              ) : (
                <Grid3x3 className="w-4 h-4" strokeWidth={3} />
              )}
            </button>

            {/* Delete Mode Toggle */}
            <button
              onClick={onDeleteModeToggle}
              className={`p-2 rounded-lg border-3 border-black shadow-brutal-sm hover:shadow-none active:shadow-none transition-all ${
                deleteMode ? 'bg-red-500 text-white' : 'bg-white text-black'
              }`}
              title="Toggle Delete Mode"
            >
              <Trash2 className="w-4 h-4" strokeWidth={3} />
            </button>

            {/* Check Update Button */}
            <button
              onClick={onCheckUpdate}
              className="p-2 bg-white text-black rounded-lg border-3 border-black shadow-brutal-sm hover:shadow-none active:shadow-none transition-all"
              title="Check for updates"
            >
              <DownloadCloud className="w-4 h-4" strokeWidth={3} />
            </button>

            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-2 bg-white text-black rounded-lg border-3 border-black shadow-brutal-sm hover:shadow-none active:shadow-none transition-all disabled:opacity-50"
              title="Refresh Bookmarks"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} strokeWidth={3} />
            </button>
            
            {/* Add Button */}
            <button
              onClick={onAddClick}
              className="flex items-center gap-1.5 bg-neo-blue text-black font-black px-3 py-2 rounded-lg border-3 border-black shadow-brutal-sm hover:shadow-none active:shadow-none transition-all"
              title="Add Bookmark"
            >
              <Plus className="w-4 h-4" strokeWidth={3} />
              <span className="text-xs">URL</span>
            </button>
            
            {/* Profile Button */}
            <button
              onClick={onProfileClick}
              className="p-2 bg-neo-pink text-black rounded-lg border-3 border-black shadow-brutal-sm hover:shadow-none active:shadow-none transition-all"
              title="Profile"
            >
              <User className="w-4 h-4" strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

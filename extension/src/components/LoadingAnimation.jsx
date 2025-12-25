import React from 'react';
import { Bookmark } from 'lucide-react';

/**
 * Cute bouncing bookmarks loading animation
 * Matches neobrutalism UI style
 */
const LoadingAnimation = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* Bouncing bookmarks */}
      <div className="flex items-end gap-2 mb-6">
        <div className="w-12 h-12 rounded-xl bg-neo-yellow border-3 border-black shadow-brutal flex items-center justify-center animate-bounce" style={{ animationDelay: '0ms', animationDuration: '600ms' }}>
          <Bookmark className="w-6 h-6 text-black" strokeWidth={3} fill="currentColor" />
        </div>
        <div className="w-12 h-12 rounded-xl bg-neo-pink border-3 border-black shadow-brutal flex items-center justify-center animate-bounce" style={{ animationDelay: '150ms', animationDuration: '600ms' }}>
          <Bookmark className="w-6 h-6 text-black" strokeWidth={3} fill="currentColor" />
        </div>
        <div className="w-12 h-12 rounded-xl bg-neo-blue border-3 border-black shadow-brutal flex items-center justify-center animate-bounce" style={{ animationDelay: '300ms', animationDuration: '600ms' }}>
          <Bookmark className="w-6 h-6 text-black" strokeWidth={3} fill="currentColor" />
        </div>
      </div>
      
      {/* Loading text */}
      <p className="text-black font-black text-lg animate-pulse">
        {message}
      </p>
    </div>
  );
};

/**
 * Small inline loading spinner for buttons and inline elements
 */
export const LoadingSpinner = ({ size = 'md', color = 'black' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className={`${sizeClasses[size]} relative inline-block`}>
      <div className={`absolute inset-0 rounded-full border-2 border-${color} border-t-transparent animate-spin`}></div>
    </div>
  );
};

/**
 * Cute loading for favicon/images
 */
export const ImageLoading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '500ms' }}></div>
        <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '100ms', animationDuration: '500ms' }}></div>
        <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '500ms' }}></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;

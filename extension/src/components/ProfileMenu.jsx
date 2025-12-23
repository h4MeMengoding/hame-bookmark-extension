import React from 'react';
import { User, LogOut } from 'lucide-react';

const ProfileMenu = ({ user, onLogout, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="absolute right-4 top-16 z-50 w-64 bg-white rounded-xl border-4 border-black shadow-brutal animate-slide-in">
        <div className="p-4">
          {/* User Info */}
          <div className="flex items-center gap-3 pb-4 border-b-3 border-black">
            <div className="w-12 h-12 rounded-lg bg-neo-pink border-3 border-black flex items-center justify-center">
              <User className="w-6 h-6 text-black" strokeWidth={3} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-black font-black text-sm truncate">
                {user?.name || user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-black text-xs font-semibold truncate opacity-70">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full mt-4 flex items-center gap-2 bg-red-500 text-white font-black px-4 py-3 rounded-lg border-3 border-black shadow-brutal-sm hover:shadow-none active:shadow-none transition-all"
          >
            <LogOut className="w-5 h-5" strokeWidth={3} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileMenu;

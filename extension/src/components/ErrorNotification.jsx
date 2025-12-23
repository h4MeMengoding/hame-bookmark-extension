import React from 'react';

const ErrorNotification = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-red-500 text-white px-6 py-4 rounded-xl border-4 border-black shadow-brutal max-w-md">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h4 className="font-black text-lg mb-1">Error</h4>
            <p className="font-bold text-sm">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-black transition-colors font-black text-xl leading-none"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorNotification;

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
  const colors = {
    danger: 'bg-red-500',
    warning: 'bg-neo-orange',
    info: 'bg-neo-blue',
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 animate-fade-in" onClick={onCancel} />
      
      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-xl border-4 border-black shadow-brutal p-6 max-w-sm w-full pointer-events-auto animate-scale-in">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className={`${colors[type]} w-12 h-12 rounded-lg border-3 border-black flex items-center justify-center flex-shrink-0`}>
              <AlertTriangle className="w-6 h-6 text-white" strokeWidth={3} />
            </div>
            <div className="flex-1">
              <h3 className="text-black font-black text-lg mb-1">
                {title}
              </h3>
              <p className="text-black text-sm font-semibold opacity-70">
                {message}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-black hover:bg-neo-cream p-1 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" strokeWidth={3} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-black font-black px-4 py-3 rounded-lg border-3 border-black shadow-brutal-sm hover:shadow-none active:shadow-none transition-all"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 ${colors[type]} text-white font-black px-4 py-3 rounded-lg border-3 border-black shadow-brutal-sm hover:shadow-none active:shadow-none transition-all`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;

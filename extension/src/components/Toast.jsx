import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ type = 'success', message, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-6 h-6" strokeWidth={3} />,
    error: <XCircle className="w-6 h-6" strokeWidth={3} />,
    info: <AlertCircle className="w-6 h-6" strokeWidth={3} />,
  };

  const colors = {
    success: 'bg-neo-green',
    error: 'bg-red-500',
    info: 'bg-neo-blue',
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className={`${colors[type]} text-black rounded-xl border-4 border-black shadow-brutal p-4 flex items-center gap-3 min-w-[300px]`}>
        <div className="flex-shrink-0">
          {icons[type]}
        </div>
        <p className="flex-1 font-bold text-sm">
          {message}
        </p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:bg-black/10 rounded-lg p-1 transition-colors"
        >
          <X className="w-5 h-5" strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default Toast;

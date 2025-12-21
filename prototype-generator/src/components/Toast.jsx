import { useEffect } from 'react';

/**
 * Toast Component - Notifications
 */
export default function Toast({
  message,
  type = 'success', // 'success' | 'error' | 'info' | 'warning'
  onClose,
  autoClose = 3000
}) {
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(onClose, autoClose);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const typeStyles = {
    success: 'bg-green-100 text-green-800 border-green-300',
    error: 'bg-red-100 text-red-800 border-red-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  };

  return (
    <div className={`
      fixed top-4 right-4 px-4 py-3 rounded-lg border
      shadow-lg z-50 animate-fade-in-down
      ${typeStyles[type]}
    `}>
      <div className="flex items-center gap-2">
        <span className="text-lg">{icons[type]}</span>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 font-bold hover:opacity-70"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

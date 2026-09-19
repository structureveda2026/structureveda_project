import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, message, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((msg: string, dur?: number) => showToast(msg, 'success', dur), [showToast]);
  const error = useCallback((msg: string, dur?: number) => showToast(msg, 'error', dur), [showToast]);
  const info = useCallback((msg: string, dur?: number) => showToast(msg, 'info', dur), [showToast]);
  const warning = useCallback((msg: string, dur?: number) => showToast(msg, 'warning', dur), [showToast]);

  const value = useMemo(
    () => ({ showToast, success, error, info, warning }),
    [showToast, success, error, info, warning]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Container */}
      <div
        className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => {
          let bg = 'bg-white border-cream-200 text-charcoal-800';
          let icon = <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />;

          if (toast.type === 'success') {
            bg = 'bg-white border-green-200 text-charcoal-800 shadow-elevated';
            icon = <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />;
          } else if (toast.type === 'error') {
            bg = 'bg-white border-red-200 text-charcoal-800 shadow-elevated';
            icon = <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />;
          } else if (toast.type === 'warning') {
            bg = 'bg-white border-amber-200 text-charcoal-800 shadow-elevated';
            icon = <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-xl border flex items-start justify-between gap-3 animate-slide-in shadow-card ${bg}`}
              role="alert"
            >
              <div className="flex items-start gap-3">
                {icon}
                <div className="text-sm font-medium leading-snug pt-0.5">{toast.message}</div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-charcoal-400 hover:text-charcoal-700 p-1 rounded-lg hover:bg-cream-100 transition flex-shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      showToast: (msg: string) => console.log('[Toast fallback]:', msg),
      success: (msg: string) => console.log('[Toast success]:', msg),
      error: (msg: string) => console.error('[Toast error]:', msg),
      info: (msg: string) => console.log('[Toast info]:', msg),
      warning: (msg: string) => console.warn('[Toast warning]:', msg),
    };
  }
  return ctx;
};

import { useCallback, useState } from "react";
import { CheckCircle2, X, XCircle } from "lucide-react";
import { ToastContext } from "./toastContext";

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = crypto.randomUUID();

    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div
        className="fixed left-1/2 top-1/2 z-[100] flex w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col gap-3"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const isError = toast.type === "error";

          return (
            <div
              key={toast.id}
              role="status"
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${
                isError
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-[#d6dfc4] bg-[#f5f8ed] text-[#4f6f37]"
              }`}
            >
              {isError ? (
                <XCircle size={20} className="shrink-0" />
              ) : (
                <CheckCircle2 size={20} className="shrink-0" />
              )}
              <p className="flex-1 text-[14px] font-medium">{toast.message}</p>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => dismissToast(toast.id)}
                className="rounded p-1 transition hover:bg-black/5"
              >
                <X size={17} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

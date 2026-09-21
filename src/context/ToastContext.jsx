import React, { createContext, useCallback, useContext, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((mensaje, tipo = "ok") => {
    setToast({ mensaje, tipo, key: Date.now() });
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => setToast(null), 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed bottom-4 left-1/2 z-[100] w-[92%] max-w-sm -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0">
          <div
            role="status"
            className={`rounded-xl2 px-4 py-3 text-sm font-medium shadow-lg ring-1 ${
              toast.tipo === "error"
                ? "bg-white text-terracotta-600 ring-terracotta-400/40"
                : "bg-sage-700 text-ivory ring-sage-800/30"
            }`}
          >
            {toast.mensaje}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider");
  return ctx;
}

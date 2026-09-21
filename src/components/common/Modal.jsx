import React, { useEffect } from "react";

export default function Modal({ titulo, onClose, children, ancho = "max-w-lg" }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-700/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
      <div
        className={`max-h-[92vh] w-full ${ancho} overflow-y-auto rounded-t-xl2 bg-white p-5 shadow-2xl sm:rounded-xl2 sm:p-6`}
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-ink-700">{titulo}</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="focus-ring rounded-full p-1.5 text-ink-500 hover:bg-sage-50 hover:text-ink-700"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

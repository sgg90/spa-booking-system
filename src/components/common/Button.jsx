import React from "react";

const ESTILOS = {
  principal: "bg-sage-600 text-ivory hover:bg-sage-700 disabled:bg-sage-200",
  secundario: "bg-sand-100 text-ink-700 hover:bg-sand-200 disabled:bg-sand-50 disabled:text-ink-300",
  peligro: "bg-terracotta-500 text-ivory hover:bg-terracotta-600 disabled:bg-terracotta-400/50",
  fantasma: "bg-transparent text-ink-500 hover:bg-sage-50 hover:text-ink-700",
};

export default function Button({ variante = "principal", className = "", children, ...props }) {
  return (
    <button
      className={`focus-ring inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${ESTILOS[variante]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

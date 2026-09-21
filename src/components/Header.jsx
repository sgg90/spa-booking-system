import React from "react";
import { CENTRO, NAV } from "../data/config";

const SECCIONES = [
  { id: "agenda", label: NAV.agenda },
  { id: "reservas", label: NAV.reservas },
  { id: "administracion", label: NAV.administracion },
];

export default function Header({ vista, onCambiarVista }) {
  return (
    <header className="sticky top-0 z-30 border-b border-sand-200 bg-ivory/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <span className="font-display text-lg text-sage-800 sm:text-xl">{CENTRO.nombre}</span>
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Navegación principal">
          {SECCIONES.map((s) => {
            const activa = vista === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onCambiarVista(s.id)}
                className={`focus-ring rounded-lg px-2.5 py-2 text-xs font-medium transition-colors sm:px-3.5 sm:text-sm ${
                  activa
                    ? "bg-sage-600 text-ivory"
                    : "text-ink-500 hover:bg-sage-50 hover:text-ink-700"
                }`}
                aria-current={activa ? "page" : undefined}
              >
                {s.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

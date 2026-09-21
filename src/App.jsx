import React from "react";
import Header from "./components/Header.jsx";
import AgendaView from "./components/views/Agenda/AgendaView.jsx";
import ReservasView from "./components/views/Reservas/ReservasView.jsx";
import AdministracionView from "./components/views/Administracion/AdministracionView.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { NavProvider, useNav } from "./context/NavContext.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";

function AppContent() {
  const { vista, irAVista } = useNav();

  return (
    <div className="min-h-full">
      <Header vista={vista} onCambiarVista={irAVista} />
      <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
        {/* La key fuerza a reiniciar el límite de errores al cambiar de vista. */}
        <ErrorBoundary key={vista} onReset={() => irAVista("agenda")}>
          {vista === "agenda" && <AgendaView />}
          {vista === "reservas" && <ReservasView />}
          {vista === "administracion" && <AdministracionView />}
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <NavProvider>
        <AppContent />
      </NavProvider>
    </ToastProvider>
  );
}

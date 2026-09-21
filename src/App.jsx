import React, { useState } from "react";
import Header from "./components/Header.jsx";
import AgendaView from "./components/views/Agenda/AgendaView.jsx";
import ReservasView from "./components/views/Reservas/ReservasView.jsx";
import AdministracionView from "./components/views/Administracion/AdministracionView.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";

export default function App() {
  const [vista, setVista] = useState("agenda");

  return (
    <ToastProvider>
      <div className="min-h-full">
        <Header vista={vista} onCambiarVista={setVista} />
        <main className="mx-auto max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
          {vista === "agenda" && <AgendaView />}
          {vista === "reservas" && <ReservasView />}
          {vista === "administracion" && <AdministracionView />}
        </main>
      </div>
    </ToastProvider>
  );
}

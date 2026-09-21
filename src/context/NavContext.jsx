import React, { createContext, useContext, useState } from "react";

// Contexto de navegación entre las tres vistas principales de la aplicación.
// Permite que una vista (por ejemplo, Reservas tras crear una reserva) pueda
// llevar al usuario a otra vista concreta, como la Agenda en su vista de Cabinas.

const NavContext = createContext(null);

export function NavProvider({ children }) {
  const [vista, setVista] = useState("agenda");
  const [agendaSubvistaInicial, setAgendaSubvistaInicial] = useState("cabinas");

  function irAVista(nuevaVista) {
    setVista(nuevaVista);
  }

  function irAAgendaCabinas() {
    setAgendaSubvistaInicial("cabinas");
    setVista("agenda");
  }

  const value = { vista, irAVista, agendaSubvistaInicial, irAAgendaCabinas };

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav debe usarse dentro de NavProvider");
  return ctx;
}

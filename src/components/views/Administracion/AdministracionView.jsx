import React, { useState } from "react";
import Tratamientos from "./Tratamientos";
import Terapeutas from "./Terapeutas";
import PoliticaCancelacion from "./PoliticaCancelacion";
import { TEXTOS } from "../../../data/config";

const TABS = [
  { id: "tratamientos", label: TEXTOS.administracion.tabTratamientos },
  { id: "terapeutas", label: TEXTOS.administracion.tabTerapeutas },
  { id: "politica", label: TEXTOS.administracion.tabPolitica },
];

export default function AdministracionView() {
  const [tab, setTab] = useState("tratamientos");

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-1 rounded-lg bg-sand-100 p-1 sm:inline-flex">
        {TABS.map((tabItem) => (
          <button
            key={tabItem.id}
            onClick={() => setTab(tabItem.id)}
            className={`focus-ring rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
              tab === tabItem.id ? "bg-white text-sage-700 shadow-sm" : "text-ink-500 hover:text-ink-700"
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      {tab === "tratamientos" && <Tratamientos />}
      {tab === "terapeutas" && <Terapeutas />}
      {tab === "politica" && <PoliticaCancelacion />}
    </div>
  );
}

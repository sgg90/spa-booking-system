import React from "react";
import { addDays, todayISO, formatDateLong } from "../../../utils/date";
import { TEXTOS } from "../../../data/config";
import Button from "../../common/Button";

export default function DateControls({ fecha, onCambiarFecha, subvista, onCambiarSubvista, onCompartir }) {
  const t = TEXTOS.agenda;
  return (
    <div className="mb-4 flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variante="secundario" onClick={() => onCambiarFecha(addDays(fecha, -1))} aria-label={t.anterior}>
            ←
          </Button>
          <Button variante="secundario" onClick={() => onCambiarFecha(todayISO())}>
            {t.hoy}
          </Button>
          <Button variante="secundario" onClick={() => onCambiarFecha(addDays(fecha, 1))} aria-label={t.siguiente}>
            →
          </Button>
          <input
            type="date"
            value={fecha}
            onChange={(e) => onCambiarFecha(e.target.value)}
            className="focus-ring rounded-lg border border-sand-200 bg-white px-2.5 py-2 text-sm text-ink-700"
          />
        </div>
        <Button variante="principal" onClick={onCompartir}>
          {t.compartirWhatsapp}
        </Button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-base font-semibold capitalize text-ink-700 sm:text-lg">{formatDateLong(fecha)}</p>
        <div className="flex gap-1 rounded-lg bg-sand-100 p-1">
          {[
            { id: "cabinas", label: t.vistaCabinas },
            { id: "terapeutas", label: t.vistaTerapeutas },
          ].map((op) => (
            <button
              key={op.id}
              onClick={() => onCambiarSubvista(op.id)}
              className={`focus-ring rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                subvista === op.id ? "bg-white text-sage-700 shadow-sm" : "text-ink-500 hover:text-ink-700"
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

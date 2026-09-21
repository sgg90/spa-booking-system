import React from "react";
import { timeToMinutes } from "../../../utils/date";
import { HORARIO } from "../../../data/config";

const PX_POR_MINUTO = 1.15;

export function minutosATop(hhmm) {
  const apertura = timeToMinutes(HORARIO.apertura);
  return (timeToMinutes(hhmm) - apertura) * PX_POR_MINUTO;
}

export function duracionAAltura(minutos) {
  return Math.max(minutos * PX_POR_MINUTO, 34);
}

function horasDelDia() {
  const horas = [];
  const [hInicio] = HORARIO.apertura.split(":").map(Number);
  const [hFin] = HORARIO.cierre.split(":").map(Number);
  for (let h = hInicio; h <= hFin; h++) {
    horas.push(`${String(h).padStart(2, "0")}:00`);
  }
  return horas;
}

// columnas: [{ id, nombre }]
// eventosPorColumna: { [columnaId]: Array<{ id, top, height, linea1, linea2, linea3, tipo, onClick }> }
export default function DayGrid({ columnas, eventosPorColumna, sinDatosTexto }) {
  const horas = horasDelDia();
  const alturaTotal = (timeToMinutes(HORARIO.cierre) - timeToMinutes(HORARIO.apertura)) * PX_POR_MINUTO;
  const hayColumnas = columnas.length > 0;

  if (!hayColumnas) {
    return <p className="py-10 text-center text-sm text-ink-500">{sinDatosTexto}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl2 border border-sand-200 bg-white">
      <div className="flex min-w-[640px]">
        <div className="w-14 shrink-0 border-r border-sand-100 sm:w-16">
          <div className="h-11 border-b border-sand-200" />
          <div className="relative" style={{ height: alturaTotal }}>
            {horas.map((h) => (
              <div
                key={h}
                className="absolute -translate-y-1/2 pr-2 text-right text-[11px] text-ink-300"
                style={{ top: minutosATop(h), right: 0 }}
              >
                {h}
              </div>
            ))}
          </div>
        </div>

        <div className="grid flex-1" style={{ gridTemplateColumns: `repeat(${columnas.length}, minmax(140px, 1fr))` }}>
          {columnas.map((col) => (
            <div key={col.id} className="border-r border-sand-100 last:border-r-0">
              <div className="flex h-11 items-center justify-center border-b border-sand-200 px-2 text-center text-xs font-medium text-ink-700 sm:text-sm">
                {col.nombre}
              </div>
              <div className="relative" style={{ height: alturaTotal }}>
                {horas.map((h) => (
                  <div
                    key={h}
                    className="absolute left-0 right-0 border-t border-sand-100"
                    style={{ top: minutosATop(h) }}
                  />
                ))}
                {(eventosPorColumna[col.id] || []).map((ev) => (
                  <button
                    key={ev.id}
                    onClick={ev.onClick}
                    className={`focus-ring absolute left-1 right-1 overflow-hidden rounded-lg border px-2 py-1 text-left text-[11px] leading-tight shadow-sm transition-transform hover:-translate-y-px sm:text-xs ${
                      ev.tipo === "bloqueo"
                        ? "border-terracotta-400/50 bg-terracotta-400/15 text-terracotta-600"
                        : "border-sage-300 bg-sage-50 text-sage-800 hover:bg-sage-100"
                    }`}
                    style={{ top: ev.top, height: ev.height }}
                  >
                    <div className="font-semibold">{ev.linea1}</div>
                    {ev.linea2 && <div className="truncate">{ev.linea2}</div>}
                    {ev.linea3 && <div className="truncate text-[10px] opacity-80">{ev.linea3}</div>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

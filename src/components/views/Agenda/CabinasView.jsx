import React, { useMemo, useState } from "react";
import DayGrid, { minutosATop, duracionAAltura } from "./DayGrid";
import BloqueoModal from "./BloqueoModal";
import ReservaModal from "./ReservaModal";
import Button from "../../common/Button";
import { useData } from "../../../context/DataContext";
import { TEXTOS } from "../../../data/config";
import { timeToMinutes } from "../../../utils/date";

export default function CabinasView({ fecha }) {
  const { cabins, reservations, treatments, therapists, blocks } = useData();
  const [reservaAbierta, setReservaAbierta] = useState(null);
  const [bloqueoAbierto, setBloqueoAbierto] = useState(false);

  const eventosPorColumna = useMemo(() => {
    const mapa = {};
    for (const cabina of cabins) {
      const eventos = [];

      reservations
        .filter((r) => r.cabinaId === cabina.id && r.fecha === fecha)
        .forEach((r) => {
          const tratamiento = treatments.find((t) => t.id === r.tratamientoId);
          const terapeuta = therapists.find((t) => t.id === r.terapeutaId);
          eventos.push({
            id: r.id,
            tipo: "reserva",
            top: minutosATop(r.horaInicio),
            height: duracionAAltura(timeToMinutes(r.horaFin) - timeToMinutes(r.horaInicio)),
            linea1: `${r.horaInicio}–${r.horaFin}`,
            linea2: tratamiento?.nombre,
            linea3: terapeuta ? `${terapeuta.nombre} ${terapeuta.apellidos}` : "",
            onClick: () => setReservaAbierta(r.id),
          });
        });

      blocks
        .filter((b) => b.cabinaId === cabina.id && b.fecha === fecha)
        .forEach((b) => {
          eventos.push({
            id: b.id,
            tipo: "bloqueo",
            top: minutosATop(b.horaInicio),
            height: duracionAAltura(timeToMinutes(b.horaFin) - timeToMinutes(b.horaInicio)),
            linea1: "Mantenimiento",
            linea2: `${b.horaInicio}–${b.horaFin}`,
            onClick: () => setBloqueoAbierto(true),
          });
        });

      mapa[cabina.id] = eventos;
    }
    return mapa;
  }, [cabins, reservations, blocks, treatments, therapists, fecha]);

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <Button variante="secundario" onClick={() => setBloqueoAbierto(true)}>
          {TEXTOS.agenda.bloquearCabina}
        </Button>
      </div>
      <DayGrid columnas={cabins} eventosPorColumna={eventosPorColumna} sinDatosTexto={TEXTOS.generales.sinDatos} />

      {reservaAbierta && <ReservaModal reservaId={reservaAbierta} onClose={() => setReservaAbierta(null)} />}
      {bloqueoAbierto && <BloqueoModal fecha={fecha} onClose={() => setBloqueoAbierto(false)} />}
    </div>
  );
}

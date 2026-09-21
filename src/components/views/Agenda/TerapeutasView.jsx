import React, { useMemo, useState } from "react";
import DayGrid, { minutosATop, duracionAAltura } from "./DayGrid";
import ReservaModal from "./ReservaModal";
import { useData } from "../../../context/DataContext";
import { TEXTOS } from "../../../data/config";
import { timeToMinutes } from "../../../utils/date";

export default function TerapeutasView({ fecha }) {
  const { therapists, reservations, treatments, cabins } = useData();
  const [reservaAbierta, setReservaAbierta] = useState(null);

  const columnas = therapists.map((t) => ({ id: t.id, nombre: `${t.nombre} ${t.apellidos}` }));

  const eventosPorColumna = useMemo(() => {
    const mapa = {};
    for (const terapeuta of therapists) {
      mapa[terapeuta.id] = reservations
        .filter((r) => r.terapeutaId === terapeuta.id && r.fecha === fecha)
        .map((r) => {
          const tratamiento = treatments.find((t) => t.id === r.tratamientoId);
          const cabina = cabins.find((c) => c.id === r.cabinaId);
          return {
            id: r.id,
            tipo: "reserva",
            top: minutosATop(r.horaInicio),
            height: duracionAAltura(timeToMinutes(r.horaFin) - timeToMinutes(r.horaInicio)),
            linea1: `${r.horaInicio}–${r.horaFin}`,
            linea2: tratamiento?.nombre,
            linea3: cabina?.nombre,
            onClick: () => setReservaAbierta(r.id),
          };
        });
    }
    return mapa;
  }, [therapists, reservations, treatments, cabins, fecha]);

  return (
    <div>
      <DayGrid columnas={columnas} eventosPorColumna={eventosPorColumna} sinDatosTexto={TEXTOS.generales.sinDatos} />
      {reservaAbierta && <ReservaModal reservaId={reservaAbierta} onClose={() => setReservaAbierta(null)} />}
    </div>
  );
}

import { timeToMinutes, addMinutesToTime, intervalsOverlap } from "./date";
import { HORARIO } from "../data/config";

// Reservas de un terapeuta en una fecha determinada (opcionalmente excluyendo una reserva, para modificaciones).
function reservasDeTerapeuta(reservations, terapeutaId, fecha, excludeId) {
  return reservations.filter(
    (r) => r.terapeutaId === terapeutaId && r.fecha === fecha && r.id !== excludeId
  );
}

// Reservas de una cabina en una fecha determinada.
function reservasDeCabina(reservations, cabinaId, fecha, excludeId) {
  return reservations.filter(
    (r) => r.cabinaId === cabinaId && r.fecha === fecha && r.id !== excludeId
  );
}

// Bloqueos de una cabina en una fecha determinada.
function bloqueosDeCabina(blocks, cabinaId, fecha) {
  return blocks.filter((b) => b.cabinaId === cabinaId && b.fecha === fecha);
}

export function terapeutaDisponible(terapeutaId, fecha, horaInicio, horaFin, reservations, excludeId) {
  const reservas = reservasDeTerapeuta(reservations, terapeutaId, fecha, excludeId);
  return reservas.every((r) => !intervalsOverlap(horaInicio, horaFin, r.horaInicio, r.horaFin));
}

export function cabinaDisponible(cabinaId, fecha, horaInicio, horaFin, reservations, blocks, excludeId) {
  const reservas = reservasDeCabina(reservations, cabinaId, fecha, excludeId);
  const sinSolapeReservas = reservas.every(
    (r) => !intervalsOverlap(horaInicio, horaFin, r.horaInicio, r.horaFin)
  );
  if (!sinSolapeReservas) return false;

  const bloqueos = bloqueosDeCabina(blocks, cabinaId, fecha);
  const sinSolapeBloqueos = bloqueos.every(
    (b) => !intervalsOverlap(horaInicio, horaFin, b.horaInicio, b.horaFin)
  );
  return sinSolapeBloqueos;
}

// Devuelve la primera combinación válida de terapeuta y cabina, según el
// orden definido en los datos de terapeutas y cabinas.
export function encontrarAsignacion({
  tratamiento,
  fecha,
  horaInicio,
  horaFin,
  therapists,
  cabins,
  reservations,
  blocks,
  excludeReservationId,
}) {
  const terapeutasCompatibles = therapists.filter((t) =>
    t.tratamientos.includes(tratamiento.id)
  );

  for (const terapeuta of terapeutasCompatibles) {
    if (!terapeutaDisponible(terapeuta.id, fecha, horaInicio, horaFin, reservations, excludeReservationId)) {
      continue;
    }
    const cabinasCompatibles = cabins.filter((c) =>
      tratamiento.cabinasCompatibles.includes(c.id)
    );
    for (const cabina of cabinasCompatibles) {
      if (cabinaDisponible(cabina.id, fecha, horaInicio, horaFin, reservations, blocks, excludeReservationId)) {
        return { terapeutaId: terapeuta.id, cabinaId: cabina.id };
      }
    }
  }
  return null;
}

// Calcula las horas de inicio disponibles para un tratamiento en una fecha dada.
export function calcularHorariosDisponibles({ tratamiento, fecha, therapists, cabins, reservations, blocks }) {
  const disponibles = [];
  const inicioApertura = timeToMinutes(HORARIO.apertura);
  const finCierre = timeToMinutes(HORARIO.cierre);
  const paso = HORARIO.intervaloSlotsMinutos;

  for (let minutos = inicioApertura; minutos + tratamiento.duracion <= finCierre; minutos += paso) {
    const horaInicio = minutesFmt(minutos);
    const horaFin = addMinutesToTime(horaInicio, tratamiento.duracion);
    const asignacion = encontrarAsignacion({
      tratamiento,
      fecha,
      horaInicio,
      horaFin,
      therapists,
      cabins,
      reservations,
      blocks,
    });
    if (asignacion) {
      disponibles.push(horaInicio);
    }
  }
  return disponibles;
}

function minutesFmt(mins) {
  const h = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

// Comprueba si existen reservas de una cabina que se solapen con un período (para bloqueos).
export function reservasSolapadasEnCabina(cabinaId, fecha, horaInicio, horaFin, reservations) {
  return reservasDeCabina(reservations, cabinaId, fecha).filter((r) =>
    intervalsOverlap(horaInicio, horaFin, r.horaInicio, r.horaFin)
  );
}

export { reservasDeTerapeuta, reservasDeCabina, bloqueosDeCabina };

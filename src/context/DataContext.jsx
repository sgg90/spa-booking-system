import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "../storage/storage";
import { CABINAS_SEED, TRATAMIENTOS_SEED, TERAPEUTAS_SEED } from "../data/seed";
import { TEXTOS } from "../data/config";
import { generateId } from "../utils/date";
import {
  encontrarAsignacion,
  terapeutaDisponible,
  cabinaDisponible,
  reservasSolapadasEnCabina,
} from "../utils/scheduling";

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [cabins] = useState(() => storage.read(storage.KEYS.cabins, CABINAS_SEED));
  const [treatments, setTreatments] = useState(() =>
    storage.read(storage.KEYS.treatments, TRATAMIENTOS_SEED)
  );
  const [therapists, setTherapists] = useState(() =>
    storage.read(storage.KEYS.therapists, TERAPEUTAS_SEED)
  );
  const [reservations, setReservations] = useState(() =>
    storage.read(storage.KEYS.reservations, [])
  );
  const [blocks, setBlocks] = useState(() => storage.read(storage.KEYS.blocks, []));
  const [cancellationPolicy, setCancellationPolicy] = useState(() =>
    storage.read(storage.KEYS.cancellationPolicy, TEXTOS.politicaCancelacion.textoInicial)
  );

  // Persistencia inmediata ante cualquier cambio.
  useEffect(() => {
    storage.write(storage.KEYS.cabins, cabins);
  }, [cabins]);
  useEffect(() => {
    storage.write(storage.KEYS.treatments, treatments);
  }, [treatments]);
  useEffect(() => {
    storage.write(storage.KEYS.therapists, therapists);
  }, [therapists]);
  useEffect(() => {
    storage.write(storage.KEYS.reservations, reservations);
  }, [reservations]);
  useEffect(() => {
    storage.write(storage.KEYS.blocks, blocks);
  }, [blocks]);
  useEffect(() => {
    storage.write(storage.KEYS.cancellationPolicy, cancellationPolicy);
  }, [cancellationPolicy]);

  // ---- Tratamientos ----
  function crearTratamiento(datos) {
    const nuevo = { id: generateId("trat"), ...datos };
    setTreatments((prev) => [...prev, nuevo]);
    return nuevo;
  }

  function modificarTratamiento(id, datos) {
    setTreatments((prev) => prev.map((t) => (t.id === id ? { ...t, ...datos } : t)));
  }

  function eliminarTratamiento(id) {
    const tieneReservas = reservations.some((r) => r.tratamientoId === id);
    if (tieneReservas) {
      return { ok: false, mensaje: TEXTOS.tratamientos.noSePuedeEliminar };
    }
    setTreatments((prev) => prev.filter((t) => t.id !== id));
    // Se retira también de la lista de tratamientos que puede realizar cada terapeuta.
    setTherapists((prev) =>
      prev.map((t) => ({ ...t, tratamientos: t.tratamientos.filter((tid) => tid !== id) }))
    );
    return { ok: true };
  }

  // ---- Terapeutas ----
  function crearTerapeuta(datos) {
    const nuevo = { id: generateId("ter"), ...datos };
    setTherapists((prev) => [...prev, nuevo]);
    return nuevo;
  }

  function modificarTerapeuta(id, datos) {
    setTherapists((prev) => prev.map((t) => (t.id === id ? { ...t, ...datos } : t)));
  }

  function eliminarTerapeuta(id) {
    const tieneReservas = reservations.some((r) => r.terapeutaId === id);
    if (tieneReservas) {
      return { ok: false, mensaje: TEXTOS.terapeutas.noSePuedeEliminar };
    }
    setTherapists((prev) => prev.filter((t) => t.id !== id));
    return { ok: true };
  }

  // ---- Política de cancelación ----
  function actualizarPoliticaCancelacion(texto) {
    setCancellationPolicy(texto);
  }

  // ---- Reservas ----
  function crearReserva({ nombre, apellidos, telefono, tratamientoId, fecha, horaInicio }) {
    const tratamiento = treatments.find((t) => t.id === tratamientoId);
    if (!tratamiento) return { ok: false, mensaje: TEXTOS.generales.errorGenerico };

    const horaFin = sumarMinutos(horaInicio, tratamiento.duracion);
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
    if (!asignacion) {
      return { ok: false, mensaje: TEXTOS.generales.errorGenerico };
    }

    const nueva = {
      id: generateId("res"),
      nombreCliente: nombre,
      apellidosCliente: apellidos,
      telefono,
      tratamientoId,
      fecha,
      horaInicio,
      horaFin,
      terapeutaId: asignacion.terapeutaId,
      cabinaId: asignacion.cabinaId,
    };
    setReservations((prev) => [...prev, nueva]);
    return { ok: true, reserva: nueva };
  }

  function modificarReserva(id, { fecha, horaInicio, terapeutaId, cabinaId }) {
    const actual = reservations.find((r) => r.id === id);
    if (!actual) return { ok: false, mensaje: TEXTOS.generales.errorGenerico };
    const tratamiento = treatments.find((t) => t.id === actual.tratamientoId);
    if (!tratamiento) return { ok: false, mensaje: TEXTOS.generales.errorGenerico };

    const nuevaFecha = fecha ?? actual.fecha;
    const nuevaHoraInicio = horaInicio ?? actual.horaInicio;
    const nuevaHoraFin = sumarMinutos(nuevaHoraInicio, tratamiento.duracion);
    const nuevoTerapeutaId = terapeutaId ?? actual.terapeutaId;
    const nuevaCabinaId = cabinaId ?? actual.cabinaId;

    const terapeuta = therapists.find((t) => t.id === nuevoTerapeutaId);
    const cabina = cabins.find((c) => c.id === nuevaCabinaId);
    const terapeutaCompatible = terapeuta && terapeuta.tratamientos.includes(tratamiento.id);
    const cabinaCompatible = cabina && tratamiento.cabinasCompatibles.includes(cabina.id);
    if (!terapeutaCompatible || !cabinaCompatible) {
      return { ok: false, mensaje: TEXTOS.gestionReserva.errorNoDisponible };
    }

    const terapeutaOk = terapeutaDisponible(
      nuevoTerapeutaId,
      nuevaFecha,
      nuevaHoraInicio,
      nuevaHoraFin,
      reservations,
      id
    );
    const cabinaOk = cabinaDisponible(
      nuevaCabinaId,
      nuevaFecha,
      nuevaHoraInicio,
      nuevaHoraFin,
      reservations,
      blocks,
      id
    );
    if (!terapeutaOk || !cabinaOk) {
      return { ok: false, mensaje: TEXTOS.gestionReserva.errorNoDisponible };
    }

    setReservations((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              fecha: nuevaFecha,
              horaInicio: nuevaHoraInicio,
              horaFin: nuevaHoraFin,
              terapeutaId: nuevoTerapeutaId,
              cabinaId: nuevaCabinaId,
            }
          : r
      )
    );
    return { ok: true };
  }

  function cancelarReserva(id) {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  }

  // ---- Bloqueos de cabinas ----
  function crearBloqueo({ cabinaId, fecha, horaInicio, horaFin }) {
    const afectadas = reservasSolapadasEnCabina(cabinaId, fecha, horaInicio, horaFin, reservations);
    if (afectadas.length > 0) {
      return { ok: false, mensaje: TEXTOS.bloqueo.errorSolapa };
    }
    const nuevo = { id: generateId("bloq"), cabinaId, fecha, horaInicio, horaFin };
    setBlocks((prev) => [...prev, nuevo]);
    return { ok: true, bloqueo: nuevo };
  }

  function eliminarBloqueo(id) {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }

  const value = useMemo(
    () => ({
      cabins,
      treatments,
      therapists,
      reservations,
      blocks,
      cancellationPolicy,
      crearTratamiento,
      modificarTratamiento,
      eliminarTratamiento,
      crearTerapeuta,
      modificarTerapeuta,
      eliminarTerapeuta,
      actualizarPoliticaCancelacion,
      crearReserva,
      modificarReserva,
      cancelarReserva,
      crearBloqueo,
      eliminarBloqueo,
    }),
    [cabins, treatments, therapists, reservations, blocks, cancellationPolicy]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

function sumarMinutos(hhmm, minutos) {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + minutos;
  const hh = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const mm = (total % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData debe usarse dentro de DataProvider");
  return ctx;
}

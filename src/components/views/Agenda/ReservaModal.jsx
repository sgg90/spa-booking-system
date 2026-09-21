import React, { useState } from "react";
import Modal from "../../common/Modal";
import ConfirmDialog from "../../common/ConfirmDialog";
import Button from "../../common/Button";
import { TextField, SelectField } from "../../common/Field";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";
import { TEXTOS } from "../../../data/config";

function sumarMinutosLocal(hhmm, minutos) {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + minutos;
  const hh = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const mm = (total % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export default function ReservaModal({ reservaId, onClose }) {
  const { reservations, treatments, therapists, cabins, modificarReserva, cancelarReserva } = useData();
  const { showToast } = useToast();
  const t = TEXTOS.gestionReserva;

  const reserva = reservations.find((r) => r.id === reservaId);
  const [confirmandoCancelacion, setConfirmandoCancelacion] = useState(false);

  const [fecha, setFecha] = useState(reserva?.fecha || "");
  const [horaInicio, setHoraInicio] = useState(reserva?.horaInicio || "");
  const [terapeutaId, setTerapeutaId] = useState(reserva?.terapeutaId || "");
  const [cabinaId, setCabinaId] = useState(reserva?.cabinaId || "");

  if (!reserva) return null;
  const tratamiento = treatments.find((tr) => tr.id === reserva.tratamientoId);

  const terapeutasCompatibles = therapists.filter((tr) => tr.tratamientos.includes(reserva.tratamientoId));
  const cabinasCompatibles = cabins.filter((c) => tratamiento?.cabinasCompatibles.includes(c.id));

  const horaFinCalculada = tratamiento && horaInicio ? sumarMinutosLocal(horaInicio, tratamiento.duracion) : reserva.horaFin;

  function handleGuardar() {
    const resultado = modificarReserva(reserva.id, { fecha, horaInicio, terapeutaId, cabinaId });
    if (!resultado.ok) {
      showToast(resultado.mensaje, "error");
      return;
    }
    showToast(TEXTOS.generales.cambiosGuardados);
    onClose();
  }

  function handleCancelar() {
    cancelarReserva(reserva.id);
    showToast(t.canceladaOk);
    setConfirmandoCancelacion(false);
    onClose();
  }

  return (
    <Modal titulo={t.titulo} onClose={onClose}>
      <div className="mb-4 space-y-1 rounded-lg bg-sand-50 px-3 py-3 text-sm">
        <p>
          <span className="text-ink-500">{t.cliente}: </span>
          <span className="font-medium text-ink-700">
            {reserva.nombreCliente} {reserva.apellidosCliente}
          </span>
        </p>
        <p>
          <span className="text-ink-500">{t.telefono}: </span>
          {reserva.telefono}
        </p>
        <p>
          <span className="text-ink-500">{t.tratamiento}: </span>
          {tratamiento?.nombre}
        </p>
        <p>
          <span className="text-ink-500">{t.horaFin}: </span>
          {horaFinCalculada}
        </p>
      </div>

      <div className="space-y-4">
        <TextField id="res-fecha" label={t.fecha} type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        <TextField
          id="res-hora"
          label={t.horaInicio}
          type="time"
          value={horaInicio}
          onChange={(e) => setHoraInicio(e.target.value)}
        />
        <SelectField id="res-terapeuta" label={t.terapeuta} value={terapeutaId} onChange={(e) => setTerapeutaId(e.target.value)}>
          {terapeutasCompatibles.map((tr) => (
            <option key={tr.id} value={tr.id}>
              {tr.nombre} {tr.apellidos}
            </option>
          ))}
        </SelectField>
        <SelectField id="res-cabina" label={t.cabina} value={cabinaId} onChange={(e) => setCabinaId(e.target.value)}>
          {cabinasCompatibles.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </SelectField>
      </div>

      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <Button variante="fantasma" onClick={onClose}>
          {t.cerrar}
        </Button>
        <Button variante="peligro" onClick={() => setConfirmandoCancelacion(true)}>
          {t.cancelarReserva}
        </Button>
        <Button variante="principal" onClick={handleGuardar}>
          {t.guardarCambios}
        </Button>
      </div>

      {confirmandoCancelacion && (
        <ConfirmDialog
          titulo={t.cancelarReserva}
          mensaje={t.confirmarCancelar}
          textoConfirmar={t.cancelarReserva}
          onConfirmar={handleCancelar}
          onCancelar={() => setConfirmandoCancelacion(false)}
        />
      )}
    </Modal>
  );
}

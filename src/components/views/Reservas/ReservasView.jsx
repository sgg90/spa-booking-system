import React, { useMemo, useState } from "react";
import { TextField, SelectField } from "../../common/Field";
import Button from "../../common/Button";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";
import { TEXTOS } from "../../../data/config";
import { todayISO } from "../../../utils/date";
import { calcularHorariosDisponibles } from "../../../utils/scheduling";

const CAMPOS_INICIALES = { nombre: "", apellidos: "", telefono: "", tratamientoId: "", fecha: todayISO() };

export default function ReservasView() {
  const { treatments, therapists, cabins, reservations, blocks, cancellationPolicy, crearReserva } = useData();
  const { showToast } = useToast();
  const t = TEXTOS.nuevaReserva;

  const [campos, setCampos] = useState(CAMPOS_INICIALES);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [errores, setErrores] = useState({});

  const tratamiento = treatments.find((tr) => tr.id === campos.tratamientoId);

  const horariosDisponibles = useMemo(() => {
    if (!tratamiento || !campos.fecha) return [];
    return calcularHorariosDisponibles({
      tratamiento,
      fecha: campos.fecha,
      therapists,
      cabins,
      reservations,
      blocks,
    });
  }, [tratamiento, campos.fecha, therapists, cabins, reservations, blocks]);

  function actualizarCampo(nombre, valor) {
    setCampos((prev) => ({ ...prev, [nombre]: valor }));
    setHoraSeleccionada("");
  }

  function validar() {
    const e = {};
    if (!campos.nombre.trim()) e.nombre = TEXTOS.generales.campoObligatorio;
    if (!campos.apellidos.trim()) e.apellidos = TEXTOS.generales.campoObligatorio;
    if (!campos.telefono.trim()) e.telefono = TEXTOS.generales.campoObligatorio;
    if (!campos.tratamientoId) e.tratamientoId = TEXTOS.generales.campoObligatorio;
    if (!campos.fecha) e.fecha = TEXTOS.generales.campoObligatorio;
    if (!horaSeleccionada) e.hora = TEXTOS.generales.campoObligatorio;
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function handleConfirmar() {
    if (!validar()) return;
    const resultado = crearReserva({
      nombre: campos.nombre.trim(),
      apellidos: campos.apellidos.trim(),
      telefono: campos.telefono.trim(),
      tratamientoId: campos.tratamientoId,
      fecha: campos.fecha,
      horaInicio: horaSeleccionada,
    });
    if (!resultado.ok) {
      showToast(resultado.mensaje, "error");
      return;
    }
    showToast(t.confirmadaOk);
    setCampos(CAMPOS_INICIALES);
    setHoraSeleccionada("");
    setErrores({});
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-5 font-display text-2xl text-ink-700">{t.titulo}</h1>
      <div className="space-y-4 rounded-xl2 border border-sand-200 bg-white p-5 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            id="res-nombre"
            label={t.nombre}
            value={campos.nombre}
            onChange={(e) => actualizarCampo("nombre", e.target.value)}
            error={errores.nombre}
          />
          <TextField
            id="res-apellidos"
            label={t.apellidos}
            value={campos.apellidos}
            onChange={(e) => actualizarCampo("apellidos", e.target.value)}
            error={errores.apellidos}
          />
        </div>
        <TextField
          id="res-telefono"
          label={t.telefono}
          type="tel"
          value={campos.telefono}
          onChange={(e) => actualizarCampo("telefono", e.target.value)}
          error={errores.telefono}
        />
        <SelectField
          id="res-tratamiento"
          label={t.tratamiento}
          value={campos.tratamientoId}
          onChange={(e) => actualizarCampo("tratamientoId", e.target.value)}
          error={errores.tratamientoId}
        >
          <option value="">—</option>
          {treatments.map((tr) => (
            <option key={tr.id} value={tr.id}>
              {tr.nombre} ({tr.duracion} min)
            </option>
          ))}
        </SelectField>
        <TextField
          id="res-fecha"
          label={t.fecha}
          type="date"
          value={campos.fecha}
          onChange={(e) => actualizarCampo("fecha", e.target.value)}
          error={errores.fecha}
        />

        <div>
          <p className="mb-2 text-sm font-medium text-ink-700">{t.tituloHorarios}</p>
          {!tratamiento || !campos.fecha ? (
            <p className="text-sm text-ink-500">{t.textoInicial}</p>
          ) : horariosDisponibles.length === 0 ? (
            <p className="text-sm text-ink-500">{t.sinHorarios}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {horariosDisponibles.map((h) => (
                <button
                  key={h}
                  onClick={() => setHoraSeleccionada(h)}
                  className={`focus-ring rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                    horaSeleccionada === h
                      ? "border-sage-600 bg-sage-600 text-ivory"
                      : "border-sand-200 bg-white text-ink-700 hover:border-sage-300"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          )}
          {errores.hora && <p className="mt-1 text-xs text-terracotta-600">{errores.hora}</p>}
        </div>

        <div className="rounded-lg bg-sand-50 p-3 text-xs text-ink-500">
          <p className="mb-1 font-medium text-ink-700">{t.politicaTitulo}</p>
          <p className="whitespace-pre-line">{cancellationPolicy}</p>
        </div>

        <div className="flex justify-end pt-1">
          <Button variante="principal" onClick={handleConfirmar}>
            {t.confirmar}
          </Button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import Modal from "../../common/Modal";
import ConfirmDialog from "../../common/ConfirmDialog";
import Button from "../../common/Button";
import { TextField, SelectField } from "../../common/Field";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";
import { TEXTOS } from "../../../data/config";
import { formatDateShort } from "../../../utils/date";

export default function BloqueoModal({ fecha, onClose }) {
  const { cabins, blocks, crearBloqueo, eliminarBloqueo } = useData();
  const { showToast } = useToast();
  const t = TEXTOS.bloqueo;

  const [cabinaId, setCabinaId] = useState(cabins[0]?.id || "");
  const [horaInicio, setHoraInicio] = useState("09:00");
  const [horaFin, setHoraFin] = useState("10:00");
  const [errores, setErrores] = useState({});
  const [aEliminar, setAEliminar] = useState(null);

  const bloqueosDelDia = blocks.filter((b) => b.fecha === fecha);

  function validar() {
    const e = {};
    if (!cabinaId) e.cabinaId = TEXTOS.generales.campoObligatorio;
    if (!horaInicio) e.horaInicio = TEXTOS.generales.campoObligatorio;
    if (!horaFin) e.horaFin = TEXTOS.generales.campoObligatorio;
    if (horaInicio && horaFin && horaFin <= horaInicio) {
      e.horaFin = "La hora de finalización debe ser posterior a la de inicio.";
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function handleCrear() {
    if (!validar()) return;
    const resultado = crearBloqueo({ cabinaId, fecha, horaInicio, horaFin });
    if (!resultado.ok) {
      showToast(resultado.mensaje, "error");
      return;
    }
    showToast(t.creadoOk);
    setHoraInicio("09:00");
    setHoraFin("10:00");
  }

  function confirmarEliminar() {
    eliminarBloqueo(aEliminar);
    setAEliminar(null);
    showToast(t.eliminadoOk);
  }

  return (
    <Modal titulo={t.titulo} onClose={onClose}>
      <div className="space-y-4">
        <SelectField
          id="bloqueo-cabina"
          label={t.campoCabina}
          value={cabinaId}
          onChange={(e) => setCabinaId(e.target.value)}
          error={errores.cabinaId}
        >
          {cabins.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </SelectField>

        <TextField id="bloqueo-fecha" label={t.campoFecha} type="date" value={fecha} readOnly disabled />

        <div className="grid grid-cols-2 gap-3">
          <TextField
            id="bloqueo-inicio"
            label={t.campoHoraInicio}
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            error={errores.horaInicio}
          />
          <TextField
            id="bloqueo-fin"
            label={t.campoHoraFin}
            type="time"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
            error={errores.horaFin}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variante="secundario" onClick={onClose}>
            {t.cancelar}
          </Button>
          <Button variante="principal" onClick={handleCrear}>
            {t.crear}
          </Button>
        </div>

        <div className="border-t border-sand-200 pt-4">
          <p className="mb-2 text-sm font-medium text-ink-700">Bloqueos del día ({formatDateShort(fecha)})</p>
          {bloqueosDelDia.length === 0 ? (
            <p className="text-sm text-ink-500">{TEXTOS.generales.sinDatos}</p>
          ) : (
            <ul className="space-y-2">
              {bloqueosDelDia.map((b) => {
                const cabina = cabins.find((c) => c.id === b.cabinaId);
                return (
                  <li
                    key={b.id}
                    className="flex items-center justify-between rounded-lg border border-sand-200 bg-sand-50 px-3 py-2 text-sm"
                  >
                    <span>
                      {cabina?.nombre} · {b.horaInicio}–{b.horaFin}
                    </span>
                    <Button variante="fantasma" onClick={() => setAEliminar(b.id)}>
                      {t.eliminar}
                    </Button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {aEliminar && (
        <ConfirmDialog
          titulo={t.eliminar}
          mensaje={t.confirmarEliminar}
          textoConfirmar={t.eliminar}
          onConfirmar={confirmarEliminar}
          onCancelar={() => setAEliminar(null)}
        />
      )}
    </Modal>
  );
}

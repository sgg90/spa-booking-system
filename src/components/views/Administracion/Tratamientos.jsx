import React, { useState } from "react";
import Modal from "../../common/Modal";
import ConfirmDialog from "../../common/ConfirmDialog";
import Button from "../../common/Button";
import { TextField, TextAreaField, CheckboxGroup } from "../../common/Field";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";
import { TEXTOS } from "../../../data/config";

export default function Tratamientos() {
  const { treatments, cabins, crearTratamiento, modificarTratamiento, eliminarTratamiento } = useData();
  const { showToast } = useToast();
  const t = TEXTOS.tratamientos;

  const [editando, setEditando] = useState(null); // null | "nuevo" | tratamiento
  const [aEliminar, setAEliminar] = useState(null);

  function handleEliminar() {
    const resultado = eliminarTratamiento(aEliminar);
    setAEliminar(null);
    if (!resultado.ok) {
      showToast(resultado.mensaje, "error");
    } else {
      showToast(TEXTOS.generales.cambiosGuardados);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink-700">{t.titulo}</h1>
        <Button variante="principal" onClick={() => setEditando("nuevo")}>
          {t.crearNuevo}
        </Button>
      </div>

      {treatments.length === 0 ? (
        <p className="text-sm text-ink-500">{TEXTOS.generales.sinDatos}</p>
      ) : (
        <ul className="space-y-3">
          {treatments.map((tr) => (
            <li
              key={tr.id}
              className="flex flex-col gap-3 rounded-xl2 border border-sand-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-ink-700">{tr.nombre}</p>
                <p className="text-sm text-ink-500">{tr.descripcion}</p>
              </div>
              <div className="flex gap-2">
                <Button variante="secundario" onClick={() => setEditando(tr)}>
                  {t.modificar}
                </Button>
                <Button variante="peligro" onClick={() => setAEliminar(tr.id)}>
                  {t.eliminar}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editando && (
        <FormularioTratamiento
          tratamiento={editando === "nuevo" ? null : editando}
          cabins={cabins}
          onGuardar={(datos) => {
            if (editando === "nuevo") {
              crearTratamiento(datos);
              showToast(t.creadoOk);
            } else {
              modificarTratamiento(editando.id, datos);
              showToast(t.actualizadoOk);
            }
            setEditando(null);
          }}
          onCancelar={() => setEditando(null)}
        />
      )}

      {aEliminar && (
        <ConfirmDialog
          titulo={t.eliminar}
          mensaje={t.confirmarEliminar}
          textoConfirmar={t.eliminar}
          onConfirmar={handleEliminar}
          onCancelar={() => setAEliminar(null)}
        />
      )}
    </div>
  );
}

function FormularioTratamiento({ tratamiento, cabins, onGuardar, onCancelar }) {
  const t = TEXTOS.tratamientos;
  const [nombre, setNombre] = useState(tratamiento?.nombre || "");
  const [descripcion, setDescripcion] = useState(tratamiento?.descripcion || "");
  const [duracion, setDuracion] = useState(tratamiento?.duracion?.toString() || "");
  const [cabinasCompatibles, setCabinasCompatibles] = useState(tratamiento?.cabinasCompatibles || []);
  const [errores, setErrores] = useState({});

  function validar() {
    const e = {};
    if (!nombre.trim()) e.nombre = TEXTOS.generales.campoObligatorio;
    if (!descripcion.trim()) e.descripcion = TEXTOS.generales.campoObligatorio;
    if (!duracion || Number(duracion) <= 0) e.duracion = TEXTOS.generales.campoObligatorio;
    if (cabinasCompatibles.length === 0) e.cabinasCompatibles = TEXTOS.generales.campoObligatorio;
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function handleGuardar() {
    if (!validar()) return;
    onGuardar({ nombre: nombre.trim(), descripcion: descripcion.trim(), duracion: Number(duracion), cabinasCompatibles });
  }

  return (
    <Modal titulo={tratamiento ? t.formTituloModificar : t.formTituloCrear} onClose={onCancelar}>
      <div className="space-y-4">
        <TextField id="tr-nombre" label={t.campoNombre} value={nombre} onChange={(e) => setNombre(e.target.value)} error={errores.nombre} />
        <TextAreaField
          id="tr-descripcion"
          label={t.campoDescripcion}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          error={errores.descripcion}
        />
        <TextField
          id="tr-duracion"
          label={t.campoDuracion}
          type="number"
          min="1"
          value={duracion}
          onChange={(e) => setDuracion(e.target.value)}
          error={errores.duracion}
        />
        <CheckboxGroup
          label={t.campoCabinas}
          help={t.ayudaCabinas}
          options={cabins}
          seleccionados={cabinasCompatibles}
          onChange={setCabinasCompatibles}
          error={errores.cabinasCompatibles}
        />
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <Button variante="secundario" onClick={onCancelar}>
          {t.cancelar}
        </Button>
        <Button variante="principal" onClick={handleGuardar}>
          {t.guardar}
        </Button>
      </div>
    </Modal>
  );
}

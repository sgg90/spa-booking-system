import React, { useState } from "react";
import Modal from "../../common/Modal";
import ConfirmDialog from "../../common/ConfirmDialog";
import Button from "../../common/Button";
import { TextField, CheckboxGroup } from "../../common/Field";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";
import { TEXTOS } from "../../../data/config";

export default function Terapeutas() {
  const { therapists, treatments, crearTerapeuta, modificarTerapeuta, eliminarTerapeuta } = useData();
  const { showToast } = useToast();
  const t = TEXTOS.terapeutas;

  const [editando, setEditando] = useState(null); // null | "nuevo" | terapeuta
  const [aEliminar, setAEliminar] = useState(null);

  function handleEliminar() {
    const resultado = eliminarTerapeuta(aEliminar);
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

      {therapists.length === 0 ? (
        <p className="text-sm text-ink-500">{TEXTOS.generales.sinDatos}</p>
      ) : (
        <ul className="space-y-3">
          {therapists.map((ter) => (
            <li
              key={ter.id}
              className="flex flex-col gap-3 rounded-xl2 border border-sand-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="font-medium text-ink-700">
                {ter.nombre} {ter.apellidos}
              </p>
              <div className="flex gap-2">
                <Button variante="secundario" onClick={() => setEditando(ter)}>
                  {t.modificar}
                </Button>
                <Button variante="peligro" onClick={() => setAEliminar(ter.id)}>
                  {t.eliminar}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editando && (
        <FormularioTerapeuta
          terapeuta={editando === "nuevo" ? null : editando}
          treatments={treatments}
          onGuardar={(datos) => {
            if (editando === "nuevo") {
              crearTerapeuta(datos);
              showToast(t.creadoOk);
            } else {
              modificarTerapeuta(editando.id, datos);
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

function FormularioTerapeuta({ terapeuta, treatments, onGuardar, onCancelar }) {
  const t = TEXTOS.terapeutas;
  const [nombre, setNombre] = useState(terapeuta?.nombre || "");
  const [apellidos, setApellidos] = useState(terapeuta?.apellidos || "");
  const [tratamientos, setTratamientos] = useState(terapeuta?.tratamientos || []);
  const [errores, setErrores] = useState({});

  function validar() {
    const e = {};
    if (!nombre.trim()) e.nombre = TEXTOS.generales.campoObligatorio;
    if (!apellidos.trim()) e.apellidos = TEXTOS.generales.campoObligatorio;
    if (tratamientos.length === 0) e.tratamientos = TEXTOS.generales.campoObligatorio;
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function handleGuardar() {
    if (!validar()) return;
    onGuardar({ nombre: nombre.trim(), apellidos: apellidos.trim(), tratamientos });
  }

  return (
    <Modal titulo={terapeuta ? t.formTituloModificar : t.formTituloCrear} onClose={onCancelar}>
      <div className="space-y-4">
        <TextField id="ter-nombre" label={t.campoNombre} value={nombre} onChange={(e) => setNombre(e.target.value)} error={errores.nombre} />
        <TextField
          id="ter-apellidos"
          label={t.campoApellidos}
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
          error={errores.apellidos}
        />
        <CheckboxGroup
          label={t.campoTratamientos}
          help={t.ayudaTratamientos}
          options={treatments}
          seleccionados={tratamientos}
          onChange={setTratamientos}
          error={errores.tratamientos}
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

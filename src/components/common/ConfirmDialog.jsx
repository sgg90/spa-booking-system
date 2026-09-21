import React from "react";
import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({ titulo, mensaje, onConfirmar, onCancelar, textoConfirmar = "Confirmar" }) {
  return (
    <Modal titulo={titulo} onClose={onCancelar} ancho="max-w-sm">
      <p className="mb-5 text-sm text-ink-500">{mensaje}</p>
      <div className="flex justify-end gap-2">
        <Button variante="secundario" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button variante="peligro" onClick={onConfirmar}>
          {textoConfirmar}
        </Button>
      </div>
    </Modal>
  );
}

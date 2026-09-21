import React, { useState } from "react";
import { TextAreaField } from "../../common/Field";
import Button from "../../common/Button";
import { useData } from "../../../context/DataContext";
import { useToast } from "../../../context/ToastContext";
import { TEXTOS } from "../../../data/config";

export default function PoliticaCancelacion() {
  const { cancellationPolicy, actualizarPoliticaCancelacion } = useData();
  const { showToast } = useToast();
  const t = TEXTOS.politicaCancelacion;

  const [texto, setTexto] = useState(cancellationPolicy);

  function handleGuardar() {
    actualizarPoliticaCancelacion(texto.trim());
    showToast(t.actualizadaOk);
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-1 font-display text-2xl text-ink-700">{t.titulo}</h1>
      <p className="mb-5 text-sm text-ink-500">{t.introduccion}</p>
      <div className="space-y-4 rounded-xl2 border border-sand-200 bg-white p-5 sm:p-6">
        <TextAreaField id="politica" label={t.campo} value={texto} onChange={(e) => setTexto(e.target.value)} />
        <div className="flex justify-end">
          <Button variante="principal" onClick={handleGuardar}>
            {t.guardar}
          </Button>
        </div>
      </div>
    </div>
  );
}

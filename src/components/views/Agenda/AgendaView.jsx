import React, { useState } from "react";
import DateControls from "./DateControls";
import CabinasView from "./CabinasView";
import TerapeutasView from "./TerapeutasView";
import { useData } from "../../../context/DataContext";
import { todayISO, formatDateShort } from "../../../utils/date";
import { compartirPorWhatsapp } from "../../../utils/whatsapp";
import { TEXTOS, formatoLineaReservaCompartida } from "../../../data/config";
import { useToast } from "../../../context/ToastContext";
import { useNav } from "../../../context/NavContext";

export default function AgendaView() {
  const { agendaSubvistaInicial } = useNav();
  const [fecha, setFecha] = useState(todayISO());
  const [subvista, setSubvista] = useState(agendaSubvistaInicial);
  const { reservations, treatments, therapists, cabins } = useData();
  const { showToast } = useToast();

  function handleCompartir() {
    const reservasDelDia = reservations
      .filter((r) => r.fecha === fecha)
      .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

    if (reservasDelDia.length === 0) {
      showToast(TEXTOS.agenda.sinReservas, "error");
      return;
    }

    const lineas = reservasDelDia.map((r) => {
      const tratamiento = treatments.find((t) => t.id === r.tratamientoId)?.nombre || "";
      const terapeuta = therapists.find((t) => t.id === r.terapeutaId);
      const cabina = cabins.find((c) => c.id === r.cabinaId)?.nombre || "";
      return formatoLineaReservaCompartida({
        hora: r.horaInicio,
        tratamiento,
        cliente: `${r.nombreCliente} ${r.apellidosCliente}`,
        telefono: r.telefono,
        terapeuta: terapeuta ? `${terapeuta.nombre} ${terapeuta.apellidos}` : "",
        cabina,
      });
    });

    const texto = [TEXTOS.agenda.tituloListaCompartida(formatDateShort(fecha)), "", ...lineas].join("\n");
    compartirPorWhatsapp(texto);
  }

  return (
    <div>
      <DateControls
        fecha={fecha}
        onCambiarFecha={setFecha}
        subvista={subvista}
        onCambiarSubvista={setSubvista}
        onCompartir={handleCompartir}
      />
      {subvista === "cabinas" ? <CabinasView fecha={fecha} /> : <TerapeutasView fecha={fecha} />}
    </div>
  );
}

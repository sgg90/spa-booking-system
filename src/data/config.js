// Archivo centralizado de contenidos y configuración de la aplicación.
// Todos los textos visibles y los parámetros generales del centro se definen aquí.

export const CENTRO = {
  nombre: "Centro de Estética y Spa",
};

// Horario de funcionamiento del centro (formato 24h "HH:MM").
export const HORARIO = {
  apertura: "09:00",
  cierre: "20:00",
  // Intervalo, en minutos, entre horas de inicio candidatas al calcular disponibilidad.
  intervaloSlotsMinutos: 15,
};

export const NAV = {
  agenda: "Agenda",
  reservas: "Reservas",
  administracion: "Administración",
};

export const TEXTOS = {
  agenda: {
    anterior: "Anterior",
    hoy: "Hoy",
    siguiente: "Siguiente",
    vistaCabinas: "Cabinas",
    vistaTerapeutas: "Terapeutas",
    compartirWhatsapp: "Compartir por WhatsApp",
    tituloListaCompartida: (fecha) => `Reservas del día ${fecha}`,
    sinReservas: "No hay reservas para el día seleccionado.",
    bloquearCabina: "Bloquear cabina",
  },
  bloqueo: {
    titulo: "Bloquear cabina",
    campoCabina: "Cabina",
    campoFecha: "Fecha",
    campoHoraInicio: "Hora de inicio",
    campoHoraFin: "Hora de finalización",
    crear: "Crear bloqueo",
    eliminar: "Eliminar bloqueo",
    cancelar: "Cancelar",
    errorSolapa:
      "No se puede crear el bloqueo porque existen reservas asignadas a esta cabina durante el período seleccionado. Reubica primero las reservas afectadas.",
    confirmarEliminar: "¿Deseas eliminar este bloqueo?",
    creadoOk: "Bloqueo creado correctamente.",
    eliminadoOk: "Bloqueo eliminado correctamente.",
  },
  nuevaReserva: {
    titulo: "Nueva reserva",
    nombre: "Nombre",
    apellidos: "Apellidos",
    telefono: "Teléfono de contacto",
    tratamiento: "Tratamiento",
    fecha: "Fecha",
    hora: "Hora",
    textoInicial:
      "Selecciona un tratamiento y una fecha para consultar los horarios disponibles.",
    tituloHorarios: "Horarios disponibles",
    sinHorarios:
      "No hay horarios disponibles para este tratamiento en la fecha seleccionada. Selecciona otra fecha.",
    confirmar: "Confirmar reserva",
    confirmadaOk: "Reserva creada correctamente.",
    politicaTitulo: "Política de cancelación",
  },
  gestionReserva: {
    titulo: "Gestión de reserva",
    cliente: "Cliente",
    telefono: "Teléfono",
    tratamiento: "Tratamiento",
    fecha: "Fecha",
    horaInicio: "Hora de inicio",
    horaFin: "Hora de finalización",
    terapeuta: "Terapeuta",
    cabina: "Cabina",
    guardarCambios: "Guardar cambios",
    cancelarReserva: "Cancelar reserva",
    cerrar: "Cerrar",
    confirmarCancelar: "¿Deseas cancelar esta reserva?",
    canceladaOk: "Reserva cancelada correctamente.",
    errorNoDisponible:
      "No se puede guardar la modificación porque el terapeuta o la cabina seleccionados no están disponibles durante el horario indicado.",
  },
  administracion: {
    tabTratamientos: "Tratamientos",
    tabTerapeutas: "Terapeutas",
    tabPolitica: "Política de cancelación",
  },
  tratamientos: {
    titulo: "Tratamientos",
    crearNuevo: "Crear nuevo tratamiento",
    modificar: "Modificar",
    eliminar: "Eliminar",
    formTituloCrear: "Nuevo tratamiento",
    formTituloModificar: "Modificar tratamiento",
    campoNombre: "Nombre del tratamiento",
    campoDescripcion: "Descripción",
    campoDuracion: "Duración (minutos)",
    campoCabinas: "Cabinas compatibles",
    ayudaCabinas: "Selecciona las cabinas en las que puede realizarse este tratamiento.",
    guardar: "Guardar tratamiento",
    cancelar: "Cancelar",
    creadoOk: "Tratamiento creado correctamente.",
    actualizadoOk: "Tratamiento actualizado correctamente.",
    confirmarEliminar: "¿Deseas eliminar este tratamiento?",
    noSePuedeEliminar: "No se puede eliminar este tratamiento porque existen reservas asociadas.",
  },
  terapeutas: {
    titulo: "Terapeutas",
    crearNuevo: "Crear nuevo terapeuta",
    modificar: "Modificar",
    eliminar: "Eliminar",
    formTituloCrear: "Nuevo terapeuta",
    formTituloModificar: "Modificar terapeuta",
    campoNombre: "Nombre",
    campoApellidos: "Apellidos",
    campoTratamientos: "Tratamientos que puede realizar",
    ayudaTratamientos: "Selecciona los tratamientos que puede realizar este terapeuta.",
    guardar: "Guardar terapeuta",
    cancelar: "Cancelar",
    creadoOk: "Terapeuta creado correctamente.",
    actualizadoOk: "Terapeuta actualizado correctamente.",
    confirmarEliminar: "¿Deseas eliminar este terapeuta?",
    noSePuedeEliminar: "No se puede eliminar este terapeuta porque existen reservas asociadas.",
  },
  politicaCancelacion: {
    titulo: "Política de cancelación",
    introduccion: "Esta información se mostrará durante el proceso de reserva.",
    campo: "Política de cancelación",
    textoInicial:
      "Las cancelaciones y modificaciones de las reservas deberán comunicarse al centro con la mayor antelación posible. Consulta con el centro las condiciones aplicables a tu reserva.",
    guardar: "Guardar política",
    actualizadaOk: "Política de cancelación actualizada correctamente.",
  },
  generales: {
    campoObligatorio: "Este campo es obligatorio.",
    cambiosGuardados: "Cambios guardados correctamente.",
    sinDatos: "No hay datos disponibles.",
    errorGenerico: "No se ha podido completar la operación. Inténtalo de nuevo.",
  },
};

// Formato del mensaje de una reserva compartida por WhatsApp:
// [HORA] — [TRATAMIENTO] — [NOMBRE DEL CLIENTE] — [TELÉFONO] — [TERAPEUTA] — [CABINA]
export function formatoLineaReservaCompartida({ hora, tratamiento, cliente, telefono, terapeuta, cabina }) {
  return `${hora} — ${tratamiento} — ${cliente} — ${telefono} — ${terapeuta} — ${cabina}`;
}

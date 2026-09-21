# Centro de Estética y Spa — Sistema de reservas y agenda

Aplicación web (SPA) para la gestión de reservas, agenda, terapeutas, cabinas
y política de cancelación de un centro de estética y spa. Desarrollada con
**React + Tailwind CSS**. Todos los datos se almacenan en el navegador
mediante **localStorage**: no hay servidor, backend ni base de datos externa.

## Puesta en marcha

Requisitos: Node.js 18 o superior.

```bash
npm install
npm run dev
```

La aplicación se abrirá en `http://localhost:5173`.

Para generar una versión de producción:

```bash
npm run build
npm run preview
```

## Estructura del proyecto

- `src/data/config.js` — nombre del centro, horario de funcionamiento y
  todos los textos visibles de la interfaz, centralizados en un único punto.
- `src/data/seed.js` — datos iniciales de cabinas, tratamientos y terapeutas
  (solo se cargan la primera vez que se abre la aplicación).
- `src/storage/storage.js` — capa de persistencia en localStorage.
- `src/context/DataContext.jsx` — estado global y reglas de negocio
  (asignación automática, disponibilidad, solapamientos, bloqueos).
- `src/utils/scheduling.js` — cálculo de disponibilidad y asignación
  automática de terapeuta y cabina.
- `src/components/views/` — las tres vistas principales: Agenda, Reservas y
  Administración.

## Guía de uso rápida

### Añadir un tratamiento

1. Ir a **Administración → Tratamientos**.
2. Pulsar **Crear nuevo tratamiento**.
3. Completar nombre, descripción y duración, y marcar las cabinas en las que
   puede realizarse.
4. Pulsar **Guardar tratamiento**.

El tratamiento aparecerá disponible de inmediato en el formulario de
**Reservas** y podrá asignarse a los terapeutas correspondientes desde
**Administración → Terapeutas**.

### Bloquear una cabina por mantenimiento

1. Ir a **Agenda → Cabinas** y seleccionar el día deseado.
2. Pulsar **Bloquear cabina**.
3. Elegir la cabina, la fecha, la hora de inicio y la hora de finalización.
4. Pulsar **Crear bloqueo**.

Si ya existen reservas de esa cabina que se solapan con el período indicado,
el sistema no permitirá crear el bloqueo: primero habrá que reubicar esas
reservas modificándolas desde la Agenda. Un bloqueo puede eliminarse en
cualquier momento desde el mismo panel, dentro de la vista de Cabinas.

### Qué ocurre si se borra el historial o los datos del navegador

Todos los tratamientos, terapeutas, reservas, bloqueos y la política de
cancelación se guardan únicamente en el almacenamiento local (localStorage)
del navegador y del dispositivo utilizado. Esto significa que:

- Los datos **no se sincronizan** entre distintos dispositivos o navegadores.
- No existe copia de seguridad externa.
- Si se borran los datos de navegación (caché, cookies y datos de sitios) o
  se desinstala/reinicia el navegador, **la información almacenada se
  perderá de forma permanente** y no podrá recuperarse.

Se recomienda utilizar siempre el mismo dispositivo y navegador para
gestionar la agenda del centro, y evitar borrar los datos de navegación de
este sitio.

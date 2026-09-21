// Utilidades de fecha y hora. Las fechas se manejan como cadenas "YYYY-MM-DD"
// y las horas como cadenas "HH:MM" en formato 24h.

export function todayISO() {
  return toISO(new Date());
}

export function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(iso, days) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return toISO(date);
}

export function formatDateLong(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
}

export function timeToMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(mins) {
  const h = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export function addMinutesToTime(hhmm, minutes) {
  return minutesToTime(timeToMinutes(hhmm) + minutes);
}

// Comprueba si dos intervalos [aInicio, aFin) y [bInicio, bFin) se solapan.
export function intervalsOverlap(aInicio, aFin, bInicio, bFin) {
  return timeToMinutes(aInicio) < timeToMinutes(bFin) && timeToMinutes(bInicio) < timeToMinutes(aFin);
}

export function generateId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

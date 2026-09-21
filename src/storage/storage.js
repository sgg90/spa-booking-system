// Capa de persistencia. Toda la información operativa se guarda en
// localStorage, sin servidor ni base de datos externa.

const KEYS = {
  treatments: "spa.treatments",
  therapists: "spa.therapists",
  cabins: "spa.cabins",
  reservations: "spa.reservations",
  blocks: "spa.blocks",
  cancellationPolicy: "spa.cancellationPolicy",
};

function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export const storage = {
  KEYS,
  read,
  write,
};

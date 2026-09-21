// Datos iniciales del sistema. Las cabinas son fijas (6). Terapeutas y
// tratamientos se cargan una única vez si no existen datos en localStorage,
// y a partir de ahí son completamente gestionables desde Administración.

export const CABINAS_SEED = [
  { id: "cabina-1", nombre: "Cabina 1" },
  { id: "cabina-2", nombre: "Cabina 2" },
  { id: "cabina-3", nombre: "Cabina 3" },
  { id: "cabina-4", nombre: "Cabina 4" },
  { id: "cabina-5", nombre: "Cabina 5" },
  { id: "cabina-6", nombre: "Cabina 6" },
];

export const TRATAMIENTOS_SEED = [
  {
    id: "trat-masaje-relajante",
    nombre: "Masaje relajante",
    descripcion: "Masaje corporal completo orientado a la relajación muscular.",
    duracion: 60,
    cabinasCompatibles: ["cabina-1", "cabina-2", "cabina-3", "cabina-4"],
  },
  {
    id: "trat-limpieza-facial",
    nombre: "Limpieza facial",
    descripcion: "Limpieza facial profunda con extracción e hidratación.",
    duracion: 45,
    cabinasCompatibles: ["cabina-1", "cabina-2", "cabina-5"],
  },
  {
    id: "trat-manicura",
    nombre: "Manicura",
    descripcion: "Manicura completa con esmaltado.",
    duracion: 30,
    cabinasCompatibles: ["cabina-5", "cabina-6"],
  },
  {
    id: "trat-piedras-calientes",
    nombre: "Masaje con piedras calientes",
    descripcion: "Masaje terapéutico con piedras volcánicas.",
    duracion: 75,
    cabinasCompatibles: ["cabina-3", "cabina-4"],
  },
  {
    id: "trat-envolvimiento",
    nombre: "Envolvimiento corporal",
    descripcion: "Tratamiento corporal envolvente con productos hidratantes.",
    duracion: 60,
    cabinasCompatibles: ["cabina-2", "cabina-3", "cabina-6"],
  },
];

export const TERAPEUTAS_SEED = [
  {
    id: "ter-1",
    nombre: "Camila",
    apellidos: "Soto Vega",
    tratamientos: ["trat-masaje-relajante", "trat-piedras-calientes", "trat-envolvimiento"],
  },
  {
    id: "ter-2",
    nombre: "Javiera",
    apellidos: "Muñoz Ríos",
    tratamientos: ["trat-limpieza-facial", "trat-manicura"],
  },
  {
    id: "ter-3",
    nombre: "Fernanda",
    apellidos: "Torres Bravo",
    tratamientos: ["trat-masaje-relajante", "trat-limpieza-facial", "trat-envolvimiento"],
  },
  {
    id: "ter-4",
    nombre: "Ignacio",
    apellidos: "Paredes Solís",
    tratamientos: ["trat-piedras-calientes", "trat-masaje-relajante"],
  },
  {
    id: "ter-5",
    nombre: "Antonia",
    apellidos: "Vidal Contreras",
    tratamientos: ["trat-manicura", "trat-limpieza-facial", "trat-envolvimiento"],
  },
];

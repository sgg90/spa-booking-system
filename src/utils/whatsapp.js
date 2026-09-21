export function compartirPorWhatsapp(texto) {
  const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

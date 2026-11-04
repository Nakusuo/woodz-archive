/**
 * Configuración del sitio.
 *
 * La web lee la hoja de Google publicada (Archivo → Compartir → Publicar en la web → CSV).
 * Es un enlace de SOLO LECTURA, distinto del de edición: se puede tener en el repo público.
 * Los cambios en la hoja aparecen en la web en unos 5 minutos (lo que tarda Google en actualizar).
 *
 * Cada pestaña se pide por su "gid" (el número que sale en la URL de la hoja al abrir esa pestaña).
 * Si una pestaña nueva no aparece, revisa su gid aquí.
 * Si Google falla, la web usa la última copia guardada en el navegador o la copia de web/datos/.
 */
const PUBLICADA = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSaS-mC20wE7-6juQkC-CP4TTFbs77NcYnhFG9jF3eCQBos8BGIw3SA7tldhwz5hRZ8SW2oFqjYkHKo/pub';

const GIDS = {
  portada: '1263190184',
  etapas: '1937436657',
  lanzamientos: '383599079',
  canciones: '1957839812',
  redes: '975322435',
  destacado: '1189167315',
  videos: '1694180006',
  creditos: '1678048681',
};

export const HOJAS = Object.fromEntries(
  Object.entries(GIDS).map(([clave, gid]) => [clave, `${PUBLICADA}?gid=${gid}&single=true&output=csv`]),
);

/** Tiempo máximo de espera por pestaña antes de usar una copia (CU-01, 2a). */
export const TIEMPO_ESPERA_MS = 8000;

/** Imagen de reserva para cualquier <img> que falle (RF-34). */
export const IMAGEN_RESERVA = 'img/placeholder.svg';

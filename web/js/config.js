/**
 * Configuración del sitio.
 *
 * Aquí van las URLs CSV de cada pestaña de la hoja de Google Sheets. Es el único sitio del código donde aparecen.
 * Cómo obtenerlas: en la hoja, Archivo → Compartir → Publicar en la web →
 * elegir la pestaña → "Valores separados por comas (.csv)" → Publicar → copiar el enlace.
 *
 * Mientras estén vacías, la web usa la copia local web/datos/<Pestaña>.csv (sale de contenido/).
 */
export const HOJAS = {
  portada: '',
  etapas: '',
  lanzamientos: '',
  canciones: '',
  redes: '',
  destacado: '',
  videos: '',
  creditos: '',
};

/** Tiempo máximo de espera por pestaña antes de usar la copia guardada (CU-01, 2a). */
export const TIEMPO_ESPERA_MS = 8000;

/** Imagen de reserva para cualquier <img> que falle (RF-34). */
export const IMAGEN_RESERVA = 'img/placeholder.svg';

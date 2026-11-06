/**
 * Arranque de WOODZ Archive (index.html): carga las pestañas y pinta cada sección.
 * Si una sección no pudo cargar, su botón "Reintentar" vuelve a pedir solo sus pestañas.
 */
import { cargar } from '../datos.js';
import { aplicarIdioma, recuperarScroll } from '../idioma.js';
import { activarCabecera, activarImagenesDeReserva, aparecer, pintarPie, seccion } from '../comun.js';
import { pintarPortada } from './portada.js';
import { pintarTimeline } from './timeline.js';
import { pintarDiscografia } from './vinilo.js';
import { pintarRedes } from './redes.js';

aplicarIdioma();
activarImagenesDeReserva();
activarCabecera();

document.addEventListener('DOMContentLoaded', async () => {
  aparecer();
  const datos = await cargar(['portada', 'videos', 'etapas', 'lanzamientos', 'canciones', 'redes', 'creditos']);
  pintarPortada(datos.portada, datos.videos);
  seccion(['etapas'], (d, reintentar) => pintarTimeline(d.etapas, reintentar))(datos);
  seccion(['lanzamientos', 'canciones'], (d, reintentar) => pintarDiscografia(d.lanzamientos, d.canciones, reintentar))(datos);
  pintarRedes(datos.redes);
  pintarPie(datos.creditos);
  recuperarScroll();
});

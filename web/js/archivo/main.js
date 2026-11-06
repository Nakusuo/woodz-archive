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

// Las pestañas se piden a la vez y cada sección se pinta en cuanto llegan las suyas,
// sin esperar a las demás (mientras tanto se ve su relleno de carga).
document.addEventListener('DOMContentLoaded', async () => {
  aparecer();
  await Promise.all([
    cargar(['portada', 'videos']).then((d) => pintarPortada(d.portada, d.videos)),
    cargar(['etapas']).then(seccion(['etapas'], (d, reintentar) => pintarTimeline(d.etapas, reintentar))),
    cargar(['lanzamientos', 'canciones']).then(seccion(['lanzamientos', 'canciones'], (d, reintentar) => pintarDiscografia(d.lanzamientos, d.canciones, reintentar))),
    cargar(['redes']).then((d) => pintarRedes(d.redes)),
    cargar(['creditos']).then((d) => pintarPie(d.creditos)),
  ]);
  recuperarScroll(); // con todo pintado, la página ya tiene su alto final
});

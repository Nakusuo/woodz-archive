/**
 * Arranque de WOODZ Archive (index.html): carga las pestañas y pinta cada sección.
 */
import { cargar } from '../datos.js';
import { activarCabecera, activarImagenesDeReserva, pintarPie } from '../comun.js';
import { pintarPortada } from './portada.js';
import { pintarTimeline } from './timeline.js';
import { pintarDiscografia } from './vinilo.js';
import { pintarRedes } from './redes.js';

activarImagenesDeReserva();
activarCabecera();

document.addEventListener('DOMContentLoaded', async () => {
  const datos = await cargar(['portada', 'videos', 'etapas', 'lanzamientos', 'canciones', 'redes', 'creditos']);
  pintarPortada(datos.portada, datos.videos);
  pintarTimeline(datos.etapas);
  pintarDiscografia(datos.lanzamientos, datos.canciones);
  pintarRedes(datos.redes);
  pintarPie(datos.creditos);
});

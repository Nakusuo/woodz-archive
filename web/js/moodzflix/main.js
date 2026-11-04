/**
 * Arranque de MOODZFLIX (moodzflix.html): carga las pestañas y pinta el destacado y las filas.
 */
import { cargar } from '../datos.js';
import { aplicarIdioma, recuperarScroll } from '../idioma.js';
import { activarCabecera, activarImagenesDeReserva, pintarPie } from '../comun.js';
import { pintarDestacado } from './destacado.js';
import { pintarFilas } from './filas.js';
import { prepararReproductor } from './reproductor.js';

aplicarIdioma();
activarImagenesDeReserva();
activarCabecera();
prepararReproductor();

document.addEventListener('DOMContentLoaded', async () => {
  const datos = await cargar(['destacado', 'videos', 'creditos']);
  pintarDestacado(datos.destacado);
  pintarFilas(datos.videos);
  pintarPie(datos.creditos);
  recuperarScroll();
});

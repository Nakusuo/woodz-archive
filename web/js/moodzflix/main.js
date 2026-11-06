/**
 * Arranque de MOODZFLIX (moodzflix.html): carga las pestañas y pinta el destacado, el buscador y las filas.
 * Canciones y Lanzamientos se leen solo para saber el álbum y el año de cada video (buscador).
 */
import { cargar } from '../datos.js';
import { aplicarIdioma, recuperarScroll } from '../idioma.js';
import { activarCabecera, activarImagenesDeReserva, aparecer, pintarPie, seccion } from '../comun.js';
import { pintarDestacado } from './destacado.js';
import { pintarFilas } from './filas.js';
import { crearCatalogo } from './catalogo.js';
import { prepararBuscador } from './buscador.js';
import { prepararReproductor } from './reproductor.js';

aplicarIdioma();
activarImagenesDeReserva();
activarCabecera();
prepararReproductor();

document.addEventListener('DOMContentLoaded', async () => {
  aparecer();
  const datos = await cargar(['destacado', 'videos', 'canciones', 'lanzamientos', 'creditos']);
  pintarDestacado(datos.destacado);
  seccion(['videos', 'canciones', 'lanzamientos'], (d, reintentar) => {
    const catalogo = crearCatalogo(d.videos, d.canciones, d.lanzamientos);
    pintarFilas(catalogo, d.videos, reintentar);
    prepararBuscador(catalogo);
  })(datos);
  pintarPie(datos.creditos);
  recuperarScroll();
});

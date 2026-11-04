/**
 * Piezas compartidas por las dos páginas: imágenes de reserva, cabecera, pie y avisos.
 */
import { IMAGEN_RESERVA } from './config.js';
import { el, urlSegura } from './seguro.js';

/** Cambia por la imagen de reserva cualquier <img> que falle, una sola vez (RF-34). */
export function activarImagenesDeReserva() {
  document.addEventListener('error', (evento) => {
    const img = evento.target;
    if (!(img instanceof HTMLImageElement) || img.dataset.reserva) return;
    img.dataset.reserva = 'si';
    img.src = IMAGEN_RESERVA;
  }, true); // los errores de imagen no burbujean: se escuchan en fase de captura
}

/** Da fondo a la cabecera al bajar, para que se lea sobre cualquier imagen. */
export function activarCabecera() {
  const cabecera = document.getElementById('cabecera');
  if (!cabecera) return;
  const actualizar = () => cabecera.toggleAttribute('data-solida', window.scrollY > 40);
  window.addEventListener('scroll', actualizar, { passive: true });
  actualizar();
}

export const reducirMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Pie (RF-33): créditos y año. */
export function pintarPie(creditos) {
  document.querySelectorAll('[data-anio]').forEach((n) => { n.textContent = String(new Date().getFullYear()); });
  const lista = document.getElementById('creditos');
  if (!lista) return;
  const filas = (creditos || []).filter((c) => c.nombre);
  if (!filas.length) {
    lista.closest('[data-creditos]')?.setAttribute('hidden', '');
    return;
  }
  lista.replaceChildren(...filas.map((c) => {
    const url = urlSegura(c.url);
    const nombre = url ? el('a', { href: url, target: '_blank', rel: 'noopener', class: 'underline decoration-linea underline-offset-4 hover:text-texto', texto: c.nombre }) : c.nombre;
    return el('li', {}, nombre, c.tipo && el('span', { class: 'text-texto-suave', texto: ` (${c.tipo.toLowerCase()})` }));
  }));
}

/** Mensaje amable dentro de una sección cuando su pestaña no cargó (RF-04). */
export function mensaje(texto, clases = '') {
  return el('p', { class: `text-sm text-texto-suave ${clases}`, texto });
}

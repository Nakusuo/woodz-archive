/**
 * Sigue a WOODZ (RF-15): enlaces de la pestaña Redes. La sección se esconde si no hay ninguno.
 */
import { icono } from '../iconos.js';
import { el, urlSegura } from '../seguro.js';

export function pintarRedes(redes) {
  const filas = (redes || []).filter((r) => r.nombre && urlSegura(r.url));
  if (!filas.length) return;
  document.getElementById('redes-lista').replaceChildren(...filas.map((r) =>
    el('li', {}, el('a', {
      href: urlSegura(r.url), target: '_blank', rel: 'noopener',
      class: 'inline-flex min-h-11 items-center gap-2 rounded-full border border-linea px-5 text-sm font-semibold transition hover:border-texto',
    }, icono(r.icono, 'size-4'), r.nombre))));
  document.getElementById('redes').hidden = false;
}

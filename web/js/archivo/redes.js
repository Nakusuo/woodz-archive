/**
 * Sigue a WOODZ / Escucha a WOODZ (RF-15): enlaces de la pestaña Redes agrupados por Seccion.
 * La sección se esconde si no hay ninguno.
 */
import { icono } from '../iconos.js';
import { el, urlSegura } from '../seguro.js';

const ICONOS = { instagram: 'instagram', youtube: 'youtube', spotify: 'musica', 'apple-music': 'musica', 'youtube-music': 'musica' };

export function pintarRedes(redes) {
  const filas = (redes || []).filter((r) => r.nombre && urlSegura(r.url));
  if (!filas.length) return;

  const grupos = [
    ['Sigue a WOODZ', filas.filter((r) => !/^escucha/i.test(r.seccion))],
    ['Escúchalo en', filas.filter((r) => /^escucha/i.test(r.seccion))],
  ].filter(([, lista]) => lista.length);

  document.getElementById('redes-lista').replaceChildren(...grupos.map(([titulo, lista]) =>
    el('div', {},
      el('h3', { class: 'font-mono text-xs uppercase tracking-[0.3em] text-texto-suave', texto: titulo }),
      el('ul', { class: 'mt-3 flex flex-wrap gap-2' }, lista.map((r) =>
        el('li', {}, el('a', {
          href: urlSegura(r.url), target: '_blank', rel: 'noopener',
          class: 'inline-flex min-h-11 items-center gap-2 rounded-full border border-linea px-5 text-sm font-semibold transition hover:border-texto',
        }, icono(ICONOS[r.icono] || 'web', 'size-4'), r.nombre)))))));
  document.getElementById('redes').hidden = false;
}

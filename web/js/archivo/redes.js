/**
 * Sigue a WOODZ / Escucha a WOODZ (RF-15): enlaces de la pestaña Redes agrupados por Seccion.
 * La sección se esconde si no hay ninguno.
 */
import { t } from '../idioma.js';
import { icono } from '../iconos.js';
import { el, urlSegura } from '../seguro.js';

const ICONOS = { instagram: 'instagram', youtube: 'youtube', spotify: 'musica', 'apple-music': 'musica', 'youtube-music': 'musica' };

export function pintarRedes(redes) {
  const filas = (redes || []).filter((r) => r.nombre && urlSegura(r.url));
  if (!filas.length) return;

  const grupos = [
    [t('sigue'), filas.filter((r) => !/^escucha/i.test(r.seccion))],
    [t('escucha'), filas.filter((r) => /^escucha/i.test(r.seccion))],
  ].filter(([, lista]) => lista.length);

  document.getElementById('redes-lista').replaceChildren(...grupos.map(([titulo, lista]) =>
    el('div', {},
      el('h3', { class: 'antetitulo', texto: titulo }),
      el('ul', { class: 'mt-3 flex flex-wrap gap-2' }, lista.map((r) =>
        el('li', {}, el('a', {
          href: urlSegura(r.url), target: '_blank', rel: 'noopener',
          class: 'boton boton-secundario',
        }, icono(ICONOS[r.icono] || 'web', 'size-4'), r.nombre)))))));
  document.getElementById('redes').hidden = false;
}

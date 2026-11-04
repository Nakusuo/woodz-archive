/**
 * Filas por categoría (CU-07): una fila horizontal por cada Categoria de la pestaña Videos.
 */
import { t } from '../idioma.js';
import { IMAGEN_RESERVA } from '../config.js';
import { normalizar } from '../datos.js';
import { mensaje } from '../comun.js';
import { icono } from '../iconos.js';
import { el, urlSegura } from '../seguro.js';
import { infoYouTube, miniaturaYouTube } from '../youtube.js';
import { reproducir } from './reproductor.js';

const ancla = (texto) => `fila-${normalizar(texto).replace(/[^a-z0-9_]/g, '').replace(/_/g, '-')}`;

export function pintarFilas(videos) {
  const contenedor = document.getElementById('filas');
  const validos = (videos || []).filter((v) => {
    const ok = v.titulo && v.categoria && urlSegura(v.url_video);
    if (!ok) console.warn('[WOODZ] Video ignorado (falta título, categoría o URL válida):', v); // RN-06
    return ok;
  });

  if (!validos.length) {
    contenedor.replaceChildren(mensaje(videos ? t('sinVideos') : t('errorVideos'), 'px-4 sm:px-10'));
    return;
  }

  // Agrupar por categoría, en el orden de Orden_Categoria y luego de aparición (RF-26).
  const grupos = new Map();
  validos.forEach((v, i) => {
    if (!grupos.has(v.categoria)) grupos.set(v.categoria, { orden: Number(v.orden_categoria) || 999, i, videos: [] });
    grupos.get(v.categoria).videos.push(v);
  });
  const categorias = [...grupos].sort(([, a], [, b]) => a.orden - b.orden || a.i - b.i);

  contenedor.replaceChildren(...categorias.map(([nombre, g]) => fila(nombre, g.videos)));
  pintarNavegacion(categorias.map(([nombre]) => nombre));
}

function tarjeta(v) {
  const url = urlSegura(v.url_video);
  const yt = infoYouTube(url);
  const imagen = urlSegura(v.url_miniatura) || miniaturaYouTube(yt) || IMAGEN_RESERVA;
  return el('li', { class: 'w-[72vw] max-w-80 sm:w-80' },
    el('button', {
      type: 'button', class: 'group/t block w-full text-left',
      onclick: () => reproducir(v.titulo, url),
    },
    el('span', { class: 'relative block overflow-hidden rounded-xl bg-superficie ring-1 ring-white/5 transition duration-300 group-hover/t:ring-white/40 group-focus-visible/t:ring-white/40' },
      el('img', { src: imagen, alt: '', loading: 'lazy', decoding: 'async', width: 480, height: 270, class: 'aspect-video w-full object-cover transition duration-500 group-hover/t:scale-[1.04]' }),
      v.duracion && el('span', { class: 'absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 text-xs font-semibold tabular-nums', texto: v.duracion })),
    el('span', { class: 'mt-2.5 line-clamp-2 block text-sm font-medium leading-snug text-texto/90 group-hover/t:text-texto', texto: v.titulo })));
}

function fila(nombre, videos) {
  const pista = el('ul', { class: 'carril scroll-px-4 gap-4 px-4 pb-2 sm:scroll-px-10 sm:px-10' }, videos.map(tarjeta));

  const flecha = (dir) => el('button', {
    type: 'button',
    'aria-label': dir < 0 ? t('anteriores', nombre) : t('siguientes', nombre),
    class: `absolute top-0 ${dir < 0 ? 'left-0' : 'right-0'} z-10 hidden aspect-video w-10 items-center justify-center text-texto/80 opacity-0 transition hover:text-white group-hover/f:opacity-100 focus-visible:opacity-100 sm:flex sm:w-10`,
    onclick: () => pista.scrollBy({ left: dir * pista.clientWidth * 0.85, behavior: 'smooth' }),
  }, el('span', { class: 'grid size-9 place-items-center rounded-full bg-black/70' }, icono(dir < 0 ? 'izquierda' : 'derecha', 'size-5')));

  const izq = flecha(-1);
  const der = flecha(1);
  const actualizar = () => {
    izq.hidden = pista.scrollLeft < 8;
    der.hidden = pista.scrollLeft + pista.clientWidth > pista.scrollWidth - 8;
  };
  pista.addEventListener('scroll', actualizar, { passive: true });
  new ResizeObserver(actualizar).observe(pista);

  const id = ancla(nombre);
  return el('section', { id, class: 'group/f scroll-mt-20', 'aria-labelledby': `${id}-titulo` },
    el('h2', { id: `${id}-titulo`, class: 'mb-3 px-4 text-lg font-semibold tracking-tight sm:px-10 sm:text-xl', texto: nombre }),
    el('div', { class: 'relative' }, izq, pista, der));
}

/** Pastillas de la cabecera: Inicio + una por categoría. */
function pintarNavegacion(categorias) {
  const nav = document.getElementById('navegacion');
  const enlace = (texto, href) => el('a', { href, class: 'shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-texto-suave transition hover:bg-superficie-alta hover:text-texto', texto });
  nav.replaceChildren(enlace(t('inicio'), '#'), ...categorias.map((c) => enlace(c.replace(/ y .*/, ''), `#${ancla(c)}`)));
}

/**
 * Filas por categoría (CU-07): una fila horizontal por cada Categoria de la pestaña Videos.
 * La tarjeta de video se usa también en los resultados del buscador.
 */
import { t } from '../idioma.js';
import { IMAGEN_RESERVA } from '../config.js';
import { normalizar } from '../datos.js';
import { aparecer, mensaje, mensajeError } from '../comun.js';
import { icono } from '../iconos.js';
import { el, urlSegura } from '../seguro.js';
import { miniaturaYouTube, ponerPortadaLista } from '../youtube.js';
import { reproducir } from './reproductor.js';

export const ancla = (texto) => `fila-${normalizar(texto).replace(/[^a-z0-9_]/g, '').replace(/_/g, '-')}`;

/** Tarjeta de un video del catálogo (catalogo.js). */
export function tarjeta(v, clases = 'w-[72vw] max-w-80 sm:w-80') {
  const propia = urlSegura(v.fila.url_miniatura);
  const esLista = v.yt?.tipo === 'lista';
  const img = el('img', {
    src: propia || miniaturaYouTube(v.yt) || IMAGEN_RESERVA,
    alt: v.titulo, loading: 'lazy', decoding: 'async', width: 480, height: 270,
  });
  // Las listas de YouTube no tienen una miniatura fija: se pide su portada (youtube.js).
  if (esLista && !propia) ponerPortadaLista(img, v.yt.id);

  const etiqueta = esLista
    ? el('span', { class: 'absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-fondo/85 px-1.5 py-0.5 text-xs font-semibold' }, icono('lista', 'size-3.5'), t('lista'))
    : v.fila.duracion && el('span', { class: 'absolute bottom-2 right-2 rounded-md bg-fondo/85 px-1.5 py-0.5 text-xs font-semibold tabular-nums', texto: v.fila.duracion });

  return el('li', { class: clases },
    el('button', {
      type: 'button', class: 'tarjeta',
      onclick: () => reproducir(v.titulo, v.url),
    },
    el('span', { class: 'tarjeta-imagen' }, img, etiqueta),
    // El nombre del botón ya lo da el texto alternativo de la imagen.
    el('span', { class: 'tarjeta-titulo', 'aria-hidden': 'true', texto: v.titulo }),
    v.album && el('span', { class: 'mt-1 block truncate font-mono text-xs text-texto-suave', 'aria-hidden': 'true', texto: [v.album, v.anio].filter(Boolean).join(', ') })));
}

/** Agrupa el catálogo por categoría, en el orden de Orden_Categoria y luego de aparición (RF-26). */
export function categoriasDe(catalogo) {
  const grupos = new Map();
  catalogo.forEach((v, i) => {
    if (!grupos.has(v.grupo)) grupos.set(v.grupo, { nombre: v.categoria, orden: Number(v.fila.orden_categoria) || 999, i, videos: [] });
    grupos.get(v.grupo).videos.push(v);
  });
  return [...grupos].sort(([, a], [, b]) => a.orden - b.orden || a.i - b.i).map(([grupo, g]) => ({ grupo, ...g }));
}

export function pintarFilas(catalogo, videos, reintentar) {
  const contenedor = document.getElementById('filas');
  contenedor.removeAttribute('aria-busy');

  if (!catalogo.length) {
    contenedor.replaceChildren(el('div', { class: 'px-4 sm:px-10' }, videos ? mensaje(t('sinVideos')) : mensajeError(t('errorVideos'), reintentar)));
    return;
  }

  const categorias = categoriasDe(catalogo);
  contenedor.replaceChildren(...categorias.map((c) => fila(c.grupo, c.nombre, c.videos)));
  pintarNavegacion(categorias);
  aparecer(contenedor);
}

function fila(grupo, nombre, videos) {
  const pista = el('ul', { class: 'carril scroll-px-4 gap-4 px-4 pb-3 pt-2 sm:scroll-px-10 sm:px-10' }, videos.map((v) => tarjeta(v)));

  const flecha = (dir) => el('button', {
    type: 'button',
    'aria-label': dir < 0 ? t('anteriores', nombre) : t('siguientes', nombre),
    class: `absolute top-2 ${dir < 0 ? 'left-0' : 'right-0'} z-10 hidden aspect-video w-10 items-center justify-center text-texto/80 opacity-0 transition hover:text-naranja group-hover/f:opacity-100 focus-visible:opacity-100 sm:flex`,
    onclick: () => pista.scrollBy({ left: dir * pista.clientWidth * 0.85, behavior: 'smooth' }),
  }, el('span', { class: 'grid size-9 place-items-center rounded-full bg-fondo/80 ring-1 ring-linea' }, icono(dir < 0 ? 'izquierda' : 'derecha', 'size-5')));

  const izq = flecha(-1);
  const der = flecha(1);
  const actualizar = () => {
    izq.hidden = pista.scrollLeft < 8;
    der.hidden = pista.scrollLeft + pista.clientWidth > pista.scrollWidth - 8;
  };
  pista.addEventListener('scroll', actualizar, { passive: true });
  new ResizeObserver(actualizar).observe(pista);

  const id = ancla(grupo);
  return el('section', { id, class: 'group/f scroll-mt-20', 'aria-labelledby': `${id}-titulo`, 'data-aparecer': '' },
    el('h2', { id: `${id}-titulo`, class: 'mb-1 flex items-baseline gap-3 px-4 text-lg font-semibold tracking-tight sm:px-10 sm:text-xl' },
      nombre, el('span', { class: 'font-mono text-xs font-normal text-texto-suave', texto: String(videos.length) })),
    el('div', { class: 'relative' }, izq, pista, der));
}

/** Pastillas de la cabecera: Inicio + una por categoría. */
function pintarNavegacion(categorias) {
  const nav = document.getElementById('navegacion');
  const enlace = (texto, href) => el('a', { href, class: 'shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-texto-suave transition hover:bg-superficie-alta hover:text-naranja', texto });
  nav.replaceChildren(enlace(t('inicio'), '#'), ...categorias.map((c) => enlace(c.nombre.replace(/ y .*/, ''), `#${ancla(c.grupo)}`)));
}

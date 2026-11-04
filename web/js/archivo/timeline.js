/**
 * Timeline horizontal (CU-03): una tarjeta por etapa y una ficha que se despliega debajo.
 */
import { mensaje, reducirMovimiento } from '../comun.js';
import { icono } from '../iconos.js';
import { el, urlSegura } from '../seguro.js';

export function pintarTimeline(etapas) {
  const pista = document.getElementById('timeline');
  const detalle = document.getElementById('etapa-detalle');
  const filas = (etapas || []).filter((e) => e.nombre);

  if (!filas.length) {
    pista.replaceChildren(el('li', {}, mensaje(etapas ? 'Todavía no hay etapas en la hoja.' : 'No pudimos cargar la historia ahora.')));
    return;
  }

  let abierta = null;

  const cerrar = () => {
    abierta?.setAttribute('aria-expanded', 'false');
    abierta = null;
    detalle.hidden = true;
    detalle.replaceChildren();
  };

  const abrir = (boton, etapa) => {
    if (abierta === boton) return cerrar();
    abierta?.setAttribute('aria-expanded', 'false');
    abierta = boton;
    boton.setAttribute('aria-expanded', 'true');
    detalle.replaceChildren(ficha(etapa, () => { const b = abierta; cerrar(); b?.focus(); }));
    detalle.hidden = false;
    detalle.setAttribute('aria-label', `Ficha de ${etapa.nombre}`);
    // Que la ficha se vea entera sin tener que buscarla.
    detalle.scrollIntoView({ block: 'nearest', behavior: reducirMovimiento() ? 'auto' : 'smooth' });
  };

  pista.replaceChildren(...filas.map((etapa) => {
    const boton = el('button', {
      type: 'button',
      class: 'etapa group block w-60 text-left sm:w-64',
      'aria-expanded': 'false',
      'aria-controls': 'etapa-detalle',
    },
    el('span', { class: 'etapa-punto', 'aria-hidden': 'true' }),
    el('span', { class: `block font-mono text-sm ${etapa.anio ? 'text-acento' : 'text-texto-suave'}`, texto: etapa.anio || 'Año pendiente' }),
    el('span', { class: 'mt-2 block font-display text-3xl uppercase leading-none transition group-hover:text-acento group-aria-expanded:text-acento', texto: etapa.nombre }),
    etapa.resumen && el('span', { class: 'mt-2 block text-sm text-texto-suave', texto: etapa.resumen }));
    boton.addEventListener('click', () => abrir(boton, etapa));
    return el('li', { class: 'pr-5 last:pr-0' }, boton);
  }));

  detalle.addEventListener('keydown', (e) => { if (e.key === 'Escape') { const b = abierta; cerrar(); b?.focus(); } });
  pista.addEventListener('keydown', (e) => { if (e.key === 'Escape' && abierta) cerrar(); });

  activarFlechas(pista);
}

function ficha(etapa, alCerrar) {
  const foto = urlSegura(etapa.url_foto);
  const enlaces = [1, 2, 3]
    .map((n) => ({ texto: etapa[`texto_enlace_${n}`], url: urlSegura(etapa[`url_enlace_${n}`]) }))
    .filter((e) => e.texto && e.url);

  return el('article', { class: 'animate-aparecer grid gap-6 rounded-xl border border-linea bg-superficie p-5 sm:p-8 md:grid-cols-[minmax(0,18rem)_1fr]' },
    foto
      ? el('img', { src: foto, alt: '', loading: 'lazy', width: 600, height: 750, class: 'blanco-negro aspect-[4/5] w-full rounded-lg object-cover md:row-span-2' })
      : null,
    el('div', { class: foto ? '' : 'md:col-span-2' },
      el('div', { class: 'flex items-start justify-between gap-4' },
        el('div', {},
          el('p', { class: 'font-mono text-sm text-acento', texto: etapa.anio || 'Año pendiente' }),
          el('h3', { class: 'mt-1 font-display text-4xl uppercase leading-none sm:text-5xl', texto: etapa.nombre })),
        el('button', {
          type: 'button', class: 'grid size-11 shrink-0 place-items-center rounded-full border border-linea transition hover:border-texto',
          'aria-label': 'Cerrar ficha', onclick: alCerrar,
        }, icono('cerrar', 'size-5'))),
      etapa.texto
        ? el('p', { class: 'mt-5 max-w-2xl whitespace-pre-line leading-relaxed text-texto/90', texto: etapa.texto })
        : el('p', { class: 'mt-5 max-w-2xl text-texto-suave', texto: 'El texto, la foto y los enlaces de esta etapa se añaden desde la hoja de contenido.' }),
      enlaces.length > 0 && el('div', { class: 'mt-6 flex flex-wrap gap-2' }, enlaces.map((e) =>
        el('a', { href: e.url, target: '_blank', rel: 'noopener', class: 'inline-flex min-h-11 items-center gap-2 rounded-full border border-linea px-5 text-sm font-semibold transition hover:border-texto' },
          e.texto, icono('externo', 'size-4'))))));
}

/** Flechas de la cabecera de la sección: avanzan casi una pantalla y se apagan en los extremos. */
function activarFlechas(pista) {
  const anterior = document.getElementById('timeline-anterior');
  const siguiente = document.getElementById('timeline-siguiente');
  anterior.replaceChildren(icono('izquierda', 'size-5'));
  siguiente.replaceChildren(icono('derecha', 'size-5'));
  anterior.onclick = () => pista.scrollBy({ left: -pista.clientWidth * 0.8, behavior: 'smooth' });
  siguiente.onclick = () => pista.scrollBy({ left: pista.clientWidth * 0.8, behavior: 'smooth' });
  const actualizar = () => {
    anterior.disabled = pista.scrollLeft < 8;
    siguiente.disabled = pista.scrollLeft + pista.clientWidth > pista.scrollWidth - 8;
  };
  pista.addEventListener('scroll', actualizar, { passive: true });
  new ResizeObserver(actualizar).observe(pista);
}

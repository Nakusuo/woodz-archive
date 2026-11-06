/**
 * Timeline (CU-03) como acordeón de paneles, según la referencia de Ange (Pinterest):
 * un panel abierto con la ficha y el resto como pestañas estrechas con el nombre en vertical.
 * En móvil los paneles van uno debajo de otro.
 */
import { campo, t } from '../idioma.js';
import { mensaje, mensajeError } from '../comun.js';
import { icono } from '../iconos.js';
import { el, urlSegura } from '../seguro.js';

export function pintarTimeline(etapas, reintentar) {
  const lista = document.getElementById('timeline');
  const filas = (etapas || []).filter((e) => e.nombre);
  lista.removeAttribute('aria-busy');

  if (!filas.length) {
    lista.replaceChildren(el('li', { class: 'md:flex-1' }, etapas ? mensaje(t('sinEtapas')) : mensajeError(t('errorEtapas'), reintentar)));
    return;
  }

  const paneles = filas.map((etapa, i) => panel(etapa, i, filas.length));
  const botones = paneles.map((p) => p.querySelector('.panel-pestana'));

  const abrir = (indice) => {
    paneles.forEach((p, i) => {
      p.toggleAttribute('data-abierto', i === indice);
      botones[i].setAttribute('aria-expanded', String(i === indice));
    });
  };

  botones.forEach((boton, i) => {
    boton.addEventListener('click', () => abrir(i));
    // Flechas del teclado: pasar de una etapa a otra (HU-04).
    boton.addEventListener('keydown', (e) => {
      const paso = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!paso) return;
      e.preventDefault();
      const siguiente = (i + paso + botones.length) % botones.length;
      abrir(siguiente);
      botones[siguiente].focus();
    });
  });

  lista.replaceChildren(...paneles);
  abrir(0);
}

function panel(etapa, i, total) {
  const foto = urlSegura(etapa.url_foto);
  const anio = etapa.anio || t('anioPendiente');
  const id = `etapa-${i}`;
  const resumen = campo(etapa, 'resumen');
  const texto = campo(etapa, 'texto');
  const enlaces = [1, 2, 3]
    .map((n) => ({ texto: campo(etapa, `texto_enlace_${n}`), url: urlSegura(etapa[`url_enlace_${n}`]) }))
    .filter((e) => e.texto && e.url);

  return el('li', {
    class: 'panel',
    // Cada panel con el brillo en otro sitio, como las superficies de la referencia.
    style: `--luz: ${Math.round(20 + (60 * i) / Math.max(1, total - 1))}%`,
  },
  foto && el('img', { src: foto, alt: etapa.nombre, loading: 'lazy', decoding: 'async', class: 'panel-foto' }),
  el('button', {
    type: 'button', class: 'panel-pestana group', 'aria-expanded': 'false', 'aria-controls': id,
    'aria-label': `${etapa.nombre}, ${anio}`,
  },
  el('span', { class: 'panel-nombre font-display text-base font-semibold uppercase tracking-[0.12em] transition group-hover:text-naranja', texto: etapa.nombre }),
  el('span', { class: `font-mono text-xs ${etapa.anio ? 'text-naranja' : 'text-texto-suave'}`, texto: etapa.anio || '?' })),
  el('div', { id, class: 'panel-cuerpo', role: 'region', 'aria-label': etapa.nombre },
    el('p', { class: 'font-mono text-sm text-naranja', texto: anio }),
    el('h3', { class: 'mt-2 font-display text-3xl font-semibold uppercase leading-none tracking-[0.08em] sm:text-5xl', texto: etapa.nombre }),
    resumen && el('p', { class: 'mt-3 text-texto-suave', texto: resumen }),
    texto
      ? el('p', { class: 'mt-4 max-w-xl whitespace-pre-line text-sm leading-relaxed text-texto/90 sm:text-base', texto })
      : el('p', { class: 'mt-4 max-w-md text-sm text-texto-suave', texto: t('fichaPendiente') }),
    enlaces.length > 0 && el('div', { class: 'mt-5 flex flex-wrap gap-2' }, enlaces.map((e) =>
      el('a', { href: e.url, target: '_blank', rel: 'noopener', class: 'boton boton-secundario' },
        e.texto, icono('externo', 'size-4'))))));
}

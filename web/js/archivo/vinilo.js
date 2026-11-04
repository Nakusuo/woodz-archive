/**
 * Music Vault (CU-04 y CU-05): lista de lanzamientos, vinilo que gira con la portada,
 * canciones y enlaces para escuchar.
 */
import { t } from '../idioma.js';
import { claveTexto } from '../datos.js';
import { mensaje } from '../comun.js';
import { icono } from '../iconos.js';
import { el, urlSegura } from '../seguro.js';

const TIPOS = { album: 'album', mini_album: 'miniAlbum', single: 'single' };
const nombreTipo = (tipo) => { const k = TIPOS[(tipo || '').toLowerCase().replace(/[\s-]+/g, '_')]; return k ? t(k) : tipo || ''; };
const anio = (fecha) => (fecha || '').slice(0, 4);

/**
 * Portada del disco o, si falta (RN-03), un cuadro con el título.
 * En miniatura (`mini`) el título no se leería: se dibuja un vinilo pequeño.
 */
function portada(disco, clases, { mini = false } = {}) {
  const url = urlSegura(disco.url_portada);
  if (url) return el('img', { src: url, alt: '', loading: 'lazy', decoding: 'async', width: 600, height: 600, class: `object-cover ${clases}` });
  if (mini) {
    return el('span', { class: `grid place-items-center bg-superficie-alta ${clases}`, 'aria-hidden': 'true' },
      el('span', { class: 'grid size-[70%] place-items-center rounded-full bg-[repeating-radial-gradient(circle,#0d0d0d_0_1px,#1c1c1c_1px_2px)]' },
        el('span', { class: 'size-[30%] rounded-full bg-acento/70' })));
  }
  return el('span', {
    class: `grid place-items-center bg-superficie-alta p-[8%] text-center font-display uppercase leading-none text-texto-suave ${clases}`,
    'aria-hidden': 'true',
  }, el('span', { class: 'line-clamp-3 text-[15cqw]', texto: disco.titulo }));
}

export function pintarDiscografia(lanzamientos, canciones) {
  const lista = document.getElementById('discos');
  const info = document.getElementById('disco-info');
  const plato = document.getElementById('plato');
  const etiqueta = document.getElementById('vinilo-etiqueta');

  const discos = (lanzamientos || [])
    .filter((d) => d.titulo)
    // Del más nuevo al más antiguo; los que no tienen fecha, al final (RF-16).
    .sort((a, b) => (b.fecha || '0').localeCompare(a.fecha || '0'));

  if (!discos.length) {
    lista.replaceChildren(el('li', {}, mensaje(lanzamientos ? t('sinDiscos') : t('errorDiscos'))));
    return;
  }

  // Canciones de cada disco, unidas por ID o por título (RN-01).
  const porDisco = new Map();
  for (const c of canciones || []) {
    const k = claveTexto(c.lanzamiento);
    if (!porDisco.has(k)) porDisco.set(k, []);
    porDisco.get(k).push(c);
  }
  const cancionesDe = (d) => {
    const lista = porDisco.get(claveTexto(d.id)) || porDisco.get(claveTexto(d.titulo)) || [];
    return lista.map((c, i) => ({ c, i })).sort((a, b) => (Number(a.c.numero) || 999) - (Number(b.c.numero) || 999) || a.i - b.i).map(({ c }) => c);
  };

  let elegido = null;
  const botones = new Map();

  const elegir = (disco) => {
    if (elegido === disco) return;
    elegido = disco;
    botones.forEach((b, d) => b.setAttribute('aria-pressed', String(d === disco)));

    // La portada nueva entra con un fundido corto; el disco sigue girando (CU-04, 3b).
    etiqueta.toggleAttribute('data-cambiando', true);
    setTimeout(() => {
      etiqueta.replaceChildren(portada(disco, 'size-full [container-type:inline-size]'));
      etiqueta.toggleAttribute('data-cambiando', false);
    }, plato.hasAttribute('data-girando') ? 200 : 0);
    plato.toggleAttribute('data-girando', true);

    info.replaceChildren(ficha(disco, cancionesDe(disco)));
  };

  lista.replaceChildren(...discos.map((disco) => {
    const meta = [nombreTipo(disco.tipo), anio(disco.fecha)].filter(Boolean).join(', ');
    const boton = el('button', {
      type: 'button', 'aria-pressed': 'false',
      class: 'group flex w-56 items-center gap-3 rounded-lg p-2 text-left transition hover:bg-superficie aria-pressed:bg-superficie-alta lg:w-full',
      onclick: () => elegir(disco),
    },
    portada(disco, 'size-12 shrink-0 rounded', { mini: true }),
    el('span', { class: 'min-w-0' },
      el('span', { class: 'block truncate font-semibold group-aria-pressed:text-acento', texto: disco.titulo }),
      el('span', { class: 'block truncate font-mono text-xs text-texto-suave', texto: meta || t('datosPendientes') })));
    botones.set(disco, boton);
    return el('li', { 'data-tipo': nombreTipo(disco.tipo) }, boton);
  }));

  pintarFiltros(lista, discos);

  // El vinilo se detiene cuando la sección sale de la pantalla (RF-22).
  new IntersectionObserver(([entrada]) => plato.toggleAttribute('data-pausado', !entrada.isIntersecting)).observe(plato);
}

function ficha(disco, canciones) {
  const meta = [nombreTipo(disco.tipo), disco.fecha].filter(Boolean).join(', ');
  return el('div', { class: 'animate-aparecer' },
    el('div', { class: 'flex items-center gap-4' },
      portada(disco, 'size-24 shrink-0 rounded-lg shadow-2xl shadow-black lg:size-28 [container-type:inline-size]'),
      el('div', { class: 'min-w-0' },
        el('h3', { class: 'font-display text-2xl font-semibold uppercase leading-tight tracking-[0.06em]', texto: disco.titulo }),
        el('p', { class: 'mt-2 font-mono text-sm text-texto-suave', texto: meta || t('tipoPendiente') }))),
    canciones.length
      // Con muchas canciones la lista se desplaza por dentro y no alarga la página.
      ? el('ol', {
        class: 'lista-canciones mt-6 max-h-[17rem] divide-y divide-linea overflow-y-auto overscroll-contain border-y border-linea pr-1 lg:max-h-[15rem]',
        tabindex: '0', 'aria-label': t('cancionesDe', disco.titulo),
      }, canciones.map((c, i) => cancion(c, i)))
      : el('p', { class: 'mt-6 border-y border-linea py-4 text-sm text-texto-suave', texto: t('cancionesPendientes') }),
    escuchar(disco));
}

function cancion(c, i) {
  const video = urlSegura(c.url_video);
  const principal = /^s[ií]$/i.test(c.principal || '');
  return el('li', { class: 'flex items-center gap-3 py-2.5' },
    el('span', { class: 'w-6 shrink-0 font-mono text-xs text-texto-suave', texto: String(c.numero || i + 1).padStart(2, '0') }),
    el('span', { class: 'min-w-0 flex-1 truncate' }, c.titulo,
      principal && el('span', { class: 'ml-2 rounded-sm border border-acento/50 px-1.5 py-px align-middle font-mono text-[0.6rem] uppercase text-acento', texto: t('principal') })),
    video && el('a', {
      href: video, target: '_blank', rel: 'noopener', class: 'grid size-9 shrink-0 place-items-center rounded-full text-texto-suave transition hover:bg-superficie-alta hover:text-texto',
      'aria-label': t('verVideo', c.titulo),
    }, icono('play', 'size-4')));
}

/** Reconoce la plataforma por la dirección, no por la columna (en la hoja a veces se cruzan). */
function plataformaDe(url) {
  const host = new URL(url).hostname;
  if (host === 'open.spotify.com') return 'Spotify';
  if (host === 'music.apple.com') return 'Apple Music';
  if (host === 'music.youtube.com') return 'YouTube Music';
  return '';
}

/** open.spotify.com/intl-es/album/ID → open.spotify.com/embed/album/ID (también sirve para canciones). */
function embedSpotify(url) {
  const m = new URL(url).pathname.match(/\/(album|track|playlist)\/([A-Za-z0-9]+)/);
  return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}` : '';
}

/** Escuchar (CU-05): reproductor de Spotify al pulsar, y enlaces a las demás plataformas. */
function escuchar(disco) {
  const enlaces = new Map();
  for (const url of [disco.url_spotify, disco.url_apple_music, disco.url_youtube_music].map(urlSegura).filter(Boolean)) {
    const plataforma = plataformaDe(url);
    if (plataforma && !enlaces.has(plataforma)) enlaces.set(plataforma, url);
  }
  const spotify = enlaces.has('Spotify') ? embedSpotify(enlaces.get('Spotify')) : '';

  if (!enlaces.size) return el('p', { class: 'mt-5 text-sm text-texto-suave', texto: t('escucharPendiente') });

  const caja = el('div', { class: 'mt-5' });
  const botones = el('div', { class: 'flex flex-wrap gap-2' });

  if (spotify) {
    botones.append(el('button', {
      type: 'button', class: 'inline-flex min-h-11 items-center gap-2 rounded-full bg-acento px-5 text-sm font-semibold text-fondo transition hover:brightness-110',
      onclick: (e) => {
        e.currentTarget.remove();
        caja.append(el('iframe', {
          src: spotify, title: t('enSpotify', disco.titulo), width: '100%', height: 152, loading: 'lazy',
          allow: 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture', class: 'mt-3 rounded-xl border-0',
        }));
      },
    }, icono('play', 'size-4'), t('escucharAqui')));
  }
  for (const [nombre, url] of enlaces) {
    botones.append(el('a', {
      href: url, target: '_blank', rel: 'noopener',
      class: 'inline-flex min-h-11 items-center gap-2 rounded-full border border-linea px-5 text-sm font-semibold transition hover:border-texto',
    }, nombre, icono('externo', 'size-4')));
  }
  caja.prepend(botones);
  return caja;
}

/** Filtro por tipo (RF-21): solo aparece si hay más de un tipo en la hoja. */
function pintarFiltros(lista, discos) {
  const tipos = [...new Set(discos.map((d) => nombreTipo(d.tipo)).filter(Boolean))];
  if (tipos.length < 2) return;
  const caja = document.getElementById('filtros');
  const todos = t('todos');
  const chips = [todos, ...tipos].map((tipo) => el('button', {
    type: 'button', 'aria-pressed': String(tipo === todos),
    class: 'min-h-10 rounded-full border border-linea px-4 text-sm transition hover:border-texto aria-pressed:border-texto aria-pressed:bg-texto aria-pressed:text-fondo',
    onclick: () => {
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c.textContent === tipo)));
      [...lista.children].forEach((li) => { li.hidden = tipo !== todos && li.dataset.tipo !== tipo; });
    },
  }, tipo));
  caja.replaceChildren(...chips);
  caja.hidden = false;
}

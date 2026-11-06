/**
 * Music Vault (CU-04 y CU-05): lista de lanzamientos, vinilo que gira con la portada,
 * canciones y enlaces para escuchar.
 */
import { t } from '../idioma.js';
import { claveTexto } from '../datos.js';
import { mensaje, mensajeError, reducirMovimiento } from '../comun.js';
import { icono } from '../iconos.js';
import { el, urlSegura } from '../seguro.js';

const TIPOS = { album: 'album', mini_album: 'miniAlbum', single: 'single' };
const nombreTipo = (tipo) => { const k = TIPOS[(tipo || '').toLowerCase().replace(/[\s-]+/g, '_')]; return k ? t(k) : tipo || ''; };
const anio = (fecha) => (fecha || '').slice(0, 4);

/**
 * Portada del disco o, si falta (RN-03), un cuadro con el título.
 * En miniatura (`mini`) el título no se leería: se dibuja un vinilo pequeño.
 */
function portada(disco, clases, { mini = false, alt = '' } = {}) {
  const url = urlSegura(disco.url_portada);
  if (url) return el('img', { src: url, alt, loading: 'lazy', decoding: 'async', width: 600, height: 600, class: `object-cover ${clases}` });
  if (mini) {
    return el('span', { class: `grid place-items-center bg-superficie-alta ${clases}`, 'aria-hidden': 'true' },
      el('span', { class: 'grid size-[70%] place-items-center rounded-full bg-[repeating-radial-gradient(circle,#0d0d0d_0_1px,#1c1c1c_1px_2px)]' },
        el('span', { class: 'size-[30%] rounded-full bg-naranja/80' })));
  }
  return el('span', {
    class: `grid place-items-center bg-superficie-alta p-[8%] text-center font-display uppercase leading-none text-texto-suave ${clases}`,
    'aria-hidden': 'true',
  }, el('span', { class: 'line-clamp-3 text-[15cqw]', texto: disco.titulo }));
}

/**
 * Giro del disco con la Web Animations API: al poner un disco acelera hasta 33⅓ rpm y al
 * pararlo frena poco a poco, como un tocadiscos de verdad. Con "reducir movimiento" no gira.
 */
function crearMotor(plato) {
  const piezas = [plato.querySelector('.vinilo'), document.getElementById('vinilo-etiqueta')];
  const giros = reducirMovimiento() || !piezas[0].animate
    ? []
    : piezas.map((n) => n.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], { duration: 1800, iterations: Infinity }));
  giros.forEach((g) => g.pause());

  let velocidad = 0;
  let objetivo = 0;
  let cuadro = 0;
  const paso = () => {
    // Acelera en ~0.9 s y frena en ~1.6 s.
    velocidad += objetivo > velocidad ? Math.min(0.03, objetivo - velocidad) : Math.max(-0.017, objetivo - velocidad);
    giros.forEach((g) => { g.playbackRate = Math.max(velocidad, 0.0001); });
    if (velocidad === objetivo) {
      if (velocidad === 0) giros.forEach((g) => g.pause());
      cuadro = 0;
      return;
    }
    cuadro = requestAnimationFrame(paso);
  };

  return {
    cambiar(nuevo) {
      objetivo = nuevo;
      if (objetivo > 0) giros.forEach((g) => { if (g.playState !== 'running') g.play(); });
      if (!cuadro) cuadro = requestAnimationFrame(paso);
    },
  };
}

export function pintarDiscografia(lanzamientos, canciones, reintentar) {
  const lista = document.getElementById('discos');
  const info = document.getElementById('disco-info');
  const plato = document.getElementById('plato');
  const etiqueta = document.getElementById('vinilo-etiqueta');
  const marcha = document.getElementById('plato-boton');
  lista.removeAttribute('aria-busy');

  const discos = (lanzamientos || [])
    .filter((d) => d.titulo)
    // Del más nuevo al más antiguo; los que no tienen fecha, al final (RF-16).
    .sort((a, b) => (b.fecha || '0').localeCompare(a.fecha || '0'));

  if (!discos.length) {
    lista.replaceChildren(el('li', { class: 'w-full' }, lanzamientos ? mensaje(t('sinDiscos')) : mensajeError(t('errorDiscos'), reintentar)));
    return;
  }

  // El motor y el botón de marcha se preparan una sola vez (el botón "Reintentar" vuelve a pintar).
  plato.motor ??= crearMotor(plato);
  const motor = plato.motor;
  const sonar = (si) => {
    plato.toggleAttribute('data-girando', si);
    motor.cambiar(si && !plato.hasAttribute('data-pausado') ? 1 : 0);
    marcha.setAttribute('aria-pressed', String(si));
    marcha.setAttribute('aria-label', t(si ? 'platoParar' : 'platoReproducir'));
    marcha.replaceChildren(icono(si ? 'pausa' : 'play', 'size-5'));
  };
  if (!marcha.dataset.listo) {
    marcha.dataset.listo = 'si';
    marcha.addEventListener('click', () => sonar(!plato.hasAttribute('data-girando')));
    // El vinilo se detiene cuando la sección sale de la pantalla (RF-22).
    new IntersectionObserver(([entrada]) => {
      plato.toggleAttribute('data-pausado', !entrada.isIntersecting);
      motor.cambiar(entrada.isIntersecting && plato.hasAttribute('data-girando') ? 1 : 0);
    }).observe(plato);
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
      etiqueta.replaceChildren(portada(disco, 'size-full [container-type:inline-size]', { alt: t('portadaDe', disco.titulo) }));
      etiqueta.toggleAttribute('data-cambiando', false);
    }, plato.hasAttribute('data-girando') ? 200 : 0);
    marcha.hidden = false;
    sonar(true);

    info.replaceChildren(ficha(disco, cancionesDe(disco)));
  };

  lista.replaceChildren(...discos.map((disco) => {
    const meta = [nombreTipo(disco.tipo), anio(disco.fecha)].filter(Boolean).join(', ');
    const boton = el('button', {
      type: 'button', 'aria-pressed': 'false',
      class: 'disco-boton group flex w-56 items-center gap-3 rounded-lg p-2 text-left hover:bg-superficie aria-pressed:bg-superficie-alta lg:w-full',
      onclick: () => elegir(disco),
    },
    portada(disco, 'disco-mini size-12 shrink-0 rounded', { mini: true }),
    el('span', { class: 'min-w-0' },
      el('span', { class: 'block truncate font-semibold group-aria-pressed:text-naranja', texto: disco.titulo }),
      el('span', { class: 'block truncate font-mono text-xs text-texto-suave', texto: meta || t('datosPendientes') })));
    botones.set(disco, boton);
    return el('li', { 'data-tipo': nombreTipo(disco.tipo) }, boton);
  }));

  pintarFiltros(lista, discos);
}

function ficha(disco, canciones) {
  const meta = [nombreTipo(disco.tipo), disco.fecha].filter(Boolean).join(', ');
  return el('div', { class: 'animate-aparecer' },
    el('div', { class: 'flex items-center gap-4' },
      portada(disco, 'portada-grande size-24 shrink-0 rounded-lg lg:size-28 [container-type:inline-size]', { alt: t('portadaDe', disco.titulo) }),
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
      principal && el('span', { class: 'ml-2 rounded-sm border border-naranja/60 px-1.5 py-px align-middle font-mono text-[0.6rem] uppercase text-naranja', texto: t('principal') })),
    video && el('a', {
      href: video, target: '_blank', rel: 'noopener', class: 'grid size-9 shrink-0 place-items-center rounded-full text-texto-suave transition hover:bg-superficie-alta hover:text-naranja',
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
      type: 'button', class: 'boton boton-principal',
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
      class: 'boton boton-secundario',
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
    class: 'chip',
    onclick: () => {
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c.textContent === tipo)));
      [...lista.children].forEach((li) => { li.hidden = tipo !== todos && li.dataset.tipo !== tipo; });
    },
  }, tipo));
  caja.replaceChildren(...chips);
  caja.hidden = false;
}

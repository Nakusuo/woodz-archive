/**
 * Idiomas: la web sale en inglés y un botón de la cabecera la pasa a español (y vuelta).
 * La elección se guarda en el navegador. Al cambiar, la página se recarga en el otro idioma
 * y vuelve al mismo punto del scroll.
 *
 * - Textos fijos del HTML: atributo data-t="clave" (y data-t-aria / data-t-titulo para atributos).
 * - Textos del JS: t('clave') o t('clave', valor).
 * - Textos de la hoja: las columnas normales son en español; si existe la columna <nombre>_EN,
 *   se usa en inglés (campo(fila, 'descripcion') → Descripcion_EN o Descripcion).
 */
const TEXTOS = {
  en: {
    saltar: 'Skip to content',
    saltarVideos: 'Skip to videos',
    idiomaBoton: 'Español',
    idiomaCorto: 'ES',
    idiomaAria: 'Ver la web en español',
    historia: 'History',
    discografia: 'Discography',
    archivoFan: 'Unofficial fan archive',
    conoce: 'Meet WOODZ',
    verMoodzflix: 'Watch MOODZFLIX',
    historiaSub: "WOODZ's career, stage by stage. Pick one to open it.",
    etapasAria: 'Career stages',
    discografiaSub: 'Pick a record to put it on the turntable.',
    eligeDisco: 'Pick a record',
    discoInfo: 'The tracks of the record you pick show up here.',
    lanzamientos: 'Releases',
    redes: 'Socials',
    sigue: 'Follow WOODZ',
    escucha: 'Listen on',
    aviso: "Made by fans. Not official and not affiliated with WOODZ or WOODZ's agency. Videos and music belong to their owners.",
    avisoFlix: "Made by fans. Not official and not affiliated with WOODZ or WOODZ's agency. Videos play from YouTube and belong to their owners.",
    creditos: 'Credits: ',
    volverInicio: 'Back to top',
    sinJs: 'This site needs JavaScript to show the history and the discography.',
    sinJsFlix: 'MOODZFLIX needs JavaScript to show the videos.',
    sinEtapas: 'No stages in the sheet yet.',
    errorEtapas: "We couldn't load the history right now.",
    anioPendiente: 'Year pending',
    fichaPendiente: 'The text, photo and links for this stage are added from the content sheet.',
    sinDiscos: 'No records in the sheet yet.',
    errorDiscos: "We couldn't load the discography right now.",
    datosPendientes: 'Details pending',
    tipoPendiente: 'Type and date pending',
    cancionesPendientes: 'Tracklist pending.',
    cancionesDe: (t) => `Tracks on ${t}`,
    principal: 'Title track',
    verVideo: (t) => `Watch the video for ${t} on YouTube`,
    escucharPendiente: 'Listening links pending.',
    escucharAqui: 'Listen here',
    enSpotify: (t) => `${t} on Spotify`,
    todos: 'All',
    album: 'Album',
    miniAlbum: 'Mini album',
    single: 'Single',
    loMasNuevo: 'Latest',
    reproducir: 'Play',
    verYoutube: 'Watch on YouTube',
    cerrar: 'Close',
    reproductor: 'Video player',
    inicio: 'Home',
    anteriores: (f) => `Previous in ${f}`,
    siguientes: (f) => `Next in ${f}`,
    sinVideos: 'No videos in the sheet yet.',
    errorVideos: "We couldn't load the videos right now.",
    categorias: 'Categories',
    secciones: 'Sections',
  },
  es: {
    saltar: 'Saltar al contenido',
    saltarVideos: 'Saltar a los videos',
    idiomaBoton: 'English',
    idiomaCorto: 'EN',
    idiomaAria: 'View the site in English',
    historia: 'Historia',
    discografia: 'Discografía',
    archivoFan: 'Archivo fan no oficial',
    conoce: 'Conoce a WOODZ',
    verMoodzflix: 'Ver MOODZFLIX',
    historiaSub: 'Su carrera, etapa por etapa. Elige una para verla.',
    etapasAria: 'Etapas de su carrera',
    discografiaSub: 'Elige un disco para ponerlo en el tocadiscos.',
    eligeDisco: 'Elige un disco',
    discoInfo: 'Aquí aparecen las canciones del disco que elijas.',
    lanzamientos: 'Lanzamientos',
    redes: 'Redes',
    sigue: 'Sigue a WOODZ',
    escucha: 'Escúchalo en',
    aviso: 'Sitio hecho por fans. No es oficial ni tiene relación con WOODZ ni con su agencia. Los videos y la música pertenecen a sus dueños.',
    avisoFlix: 'Sitio hecho por fans. No es oficial ni tiene relación con WOODZ ni con su agencia. Los videos se reproducen desde YouTube y pertenecen a sus dueños.',
    creditos: 'Créditos: ',
    volverInicio: 'Volver al inicio',
    sinJs: 'Esta web necesita JavaScript para mostrar la historia y la discografía.',
    sinJsFlix: 'MOODZFLIX necesita JavaScript para mostrar los videos.',
    sinEtapas: 'Todavía no hay etapas en la hoja.',
    errorEtapas: 'No pudimos cargar la historia ahora.',
    anioPendiente: 'Año pendiente',
    fichaPendiente: 'El texto, la foto y los enlaces de esta etapa se añaden desde la hoja de contenido.',
    sinDiscos: 'Todavía no hay discos en la hoja.',
    errorDiscos: 'No pudimos cargar la discografía ahora.',
    datosPendientes: 'Datos pendientes',
    tipoPendiente: 'Tipo y fecha pendientes',
    cancionesPendientes: 'Lista de canciones pendiente.',
    cancionesDe: (t) => `Canciones de ${t}`,
    principal: 'Principal',
    verVideo: (t) => `Ver el video de ${t} en YouTube`,
    escucharPendiente: 'Enlaces para escuchar pendientes.',
    escucharAqui: 'Escuchar aquí',
    enSpotify: (t) => `${t} en Spotify`,
    todos: 'Todos',
    album: 'Álbum',
    miniAlbum: 'Mini álbum',
    single: 'Single',
    loMasNuevo: 'Lo más nuevo',
    reproducir: 'Reproducir',
    verYoutube: 'Ver en YouTube',
    cerrar: 'Cerrar',
    reproductor: 'Reproductor de video',
    inicio: 'Inicio',
    anteriores: (f) => `Anteriores en ${f}`,
    siguientes: (f) => `Siguientes en ${f}`,
    sinVideos: 'Todavía no hay videos en la hoja.',
    errorVideos: 'No pudimos cargar los videos ahora.',
    categorias: 'Categorías',
    secciones: 'Secciones',
  },
};

function leerIdioma() {
  try {
    const guardado = localStorage.getItem('woodz:idioma');
    if (guardado === 'es' || guardado === 'en') return guardado;
  } catch { /* sin almacenamiento: inglés */ }
  return 'en';
}

const idioma = leerIdioma();
export const idiomaActual = () => idioma;

/** t('clave') o t('clave', valor) para los textos con un hueco. */
export function t(clave, valor) {
  const texto = TEXTOS[idioma][clave] ?? TEXTOS.en[clave] ?? clave;
  return typeof texto === 'function' ? texto(valor) : texto;
}

/** Valor de una columna de la hoja en el idioma actual: <columna>_en en inglés si existe. */
export function campo(fila, nombre) {
  if (!fila) return '';
  return idioma === 'en' ? fila[`${nombre}_en`] || fila[nombre] || '' : fila[nombre] || fila[`${nombre}_en`] || '';
}

/** Pone los textos fijos del HTML en el idioma actual y prepara el botón de cambio. */
export function aplicarIdioma() {
  document.documentElement.lang = idioma;
  document.querySelectorAll('[data-t]').forEach((n) => { n.textContent = t(n.dataset.t); });
  document.querySelectorAll('[data-t-aria]').forEach((n) => n.setAttribute('aria-label', t(n.dataset.tAria)));
  document.querySelectorAll('[data-t-titulo]').forEach((n) => n.setAttribute('title', t(n.dataset.tTitulo)));

  const boton = document.getElementById('boton-idioma');
  if (boton) {
    // En móvil solo "ES"/"EN" para que quepa la cabecera; desde sm, la palabra entera.
    const corto = document.createElement('span');
    corto.className = 'sm:hidden';
    corto.textContent = t('idiomaCorto');
    const largo = document.createElement('span');
    largo.className = 'hidden sm:inline';
    largo.textContent = t('idiomaBoton');
    boton.replaceChildren(corto, largo);
    boton.setAttribute('aria-label', t('idiomaAria'));
    boton.setAttribute('lang', idioma === 'en' ? 'es' : 'en');
    boton.addEventListener('click', () => {
      try {
        localStorage.setItem('woodz:idioma', idioma === 'en' ? 'es' : 'en');
        sessionStorage.setItem('woodz:scroll', String(window.scrollY));
      } catch { /* sin almacenamiento: no se puede recordar */ }
      location.reload();
    });
  }
}

/** Tras pintar los datos, vuelve al punto donde estaba la persona antes de cambiar de idioma. */
export function recuperarScroll() {
  try {
    const y = Number(sessionStorage.getItem('woodz:scroll'));
    sessionStorage.removeItem('woodz:scroll');
    if (y) window.scrollTo({ top: y, behavior: 'instant' });
  } catch { /* nada que recuperar */ }
}

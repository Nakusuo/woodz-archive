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
    sitio: 'Site',
    paginaArchivo: 'WOODZ Archive: the career and discography of WOODZ',
    descArchivo: 'Unofficial WOODZ fan archive: the career stage by stage, the discography on a turntable and the videos on MOODZFLIX.',
    paginaMoodzflix: 'MOODZFLIX: all the WOODZ videos',
    descMoodzflix: 'MOODZFLIX: all the WOODZ videos in one place, with search. Music videos, live clips, stages and vlogs. Unofficial fan project.',
    irArchivo: 'Go to WOODZ Archive',
    filtroTipo: 'Filter by type',
    platoReproducir: 'Play record',
    platoParar: 'Stop record',
    reintentar: 'Try again',
    cargando: 'Loading…',
    buscar: 'Search',
    buscarVideos: 'Search videos',
    buscarPista: 'Title, album, year or category',
    buscarAyuda: 'Results update as you type. Press slash or Control K to jump here.',
    limpiar: 'Clear search',
    filtroCategoria: 'Filter by category',
    filtroAnio: 'Filter by year',
    todosAnios: 'Any year',
    resultados: ({ n, q }) => `${n} ${n === 1 ? 'video' : 'videos'}${q ? ` for “${q}”` : ''}`,
    sinResultados: (q) => (q ? `No results for “${q}”` : 'No videos with these filters'),
    sugerencias: 'Check the spelling, try fewer words or look in a category:',
    quitarFiltros: 'Clear search and filters',
    lista: 'Playlist',
    portadaDe: (t) => `Cover of ${t}`,
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
    sitio: 'Sitio',
    paginaArchivo: 'WOODZ Archive: la carrera y la discografía de WOODZ',
    descArchivo: 'Archivo fan no oficial de WOODZ: su carrera etapa por etapa, la discografía en un tocadiscos y los videos en MOODZFLIX.',
    paginaMoodzflix: 'MOODZFLIX: todos los videos de WOODZ',
    descMoodzflix: 'MOODZFLIX: todos los videos de WOODZ en un solo lugar, con buscador. MVs, live clips, stages y vlogs. Proyecto fan no oficial.',
    irArchivo: 'Ir a WOODZ Archive',
    filtroTipo: 'Filtrar por tipo',
    platoReproducir: 'Poner el disco',
    platoParar: 'Parar el disco',
    reintentar: 'Reintentar',
    cargando: 'Cargando…',
    buscar: 'Buscar',
    buscarVideos: 'Buscar videos',
    buscarPista: 'Título, álbum, año o categoría',
    buscarAyuda: 'Los resultados cambian mientras escribes. Pulsa barra o Control K para venir aquí.',
    limpiar: 'Limpiar búsqueda',
    filtroCategoria: 'Filtrar por categoría',
    filtroAnio: 'Filtrar por año',
    todosAnios: 'Cualquier año',
    resultados: ({ n, q }) => `${n} ${n === 1 ? 'video' : 'videos'}${q ? ` para “${q}”` : ''}`,
    sinResultados: (q) => (q ? `Sin resultados para “${q}”` : 'No hay videos con estos filtros'),
    sugerencias: 'Revisa cómo está escrito, prueba con menos palabras o mira una categoría:',
    quitarFiltros: 'Quitar búsqueda y filtros',
    lista: 'Lista',
    portadaDe: (t) => `Portada de ${t}`,
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
  document.querySelectorAll('[data-t-placeholder]').forEach((n) => n.setAttribute('placeholder', t(n.dataset.tPlaceholder)));

  // Título de la pestaña y descripción en el idioma elegido.
  const pagina = document.documentElement.dataset.pagina === 'moodzflix' ? 'Moodzflix' : 'Archivo';
  document.title = t(`pagina${pagina}`);
  document.querySelector('meta[name="description"]')?.setAttribute('content', t(`desc${pagina}`));

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

/**
 * Utilidades de YouTube: reconoce enlaces de video o lista, miniaturas y URLs del reproductor (RF-30, RF-31).
 */

/** { tipo: 'video' | 'lista', id } o null si no es un enlace de YouTube que entendamos. */
export function infoYouTube(url) {
  let u;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  if (!/(^|\.)youtube\.com$|^youtu\.be$/.test(u.hostname)) return null;

  let id = u.searchParams.get('v');
  if (u.hostname === 'youtu.be') id = u.pathname.slice(1);
  const ruta = u.pathname.match(/^\/(shorts|live|embed)\/([\w-]{11})/);
  if (ruta) id = ruta[2];

  if (id && /^[\w-]{11}$/.test(id)) return { tipo: 'video', id };
  const lista = u.searchParams.get('list');
  if (lista) return { tipo: 'lista', id: lista };
  return null;
}

/** Miniatura 480×360 de un video. Las listas no tienen una URL fija, así que devuelven ''. */
export function miniaturaYouTube(info) {
  return info?.tipo === 'video' ? `https://i.ytimg.com/vi/${info.id}/hqdefault.jpg` : '';
}

/** Miniatura grande (1280×720) para fondos. */
export function miniaturaGrande(info) {
  return info?.tipo === 'video' ? `https://i.ytimg.com/vi/${info.id}/maxresdefault.jpg` : '';
}

/** URL del reproductor incrustado, sin cookies (RF-28). */
export function urlEmbed(info) {
  const base = 'https://www.youtube-nocookie.com/embed/';
  return info.tipo === 'video'
    ? `${base}${info.id}?autoplay=1&rel=0&playsinline=1`
    : `${base}videoseries?list=${info.id}&autoplay=1&rel=0&playsinline=1`;
}

/** Enlace para abrirlo en YouTube. */
export function urlYouTube(info) {
  return info.tipo === 'video' ? `https://www.youtube.com/watch?v=${info.id}` : `https://www.youtube.com/playlist?list=${info.id}`;
}

/*
 * Portada de una lista de reproducción. YouTube no tiene una URL fija para ellas, pero su
 * servicio oEmbed (público, sin clave) devuelve la miniatura que muestra la propia lista.
 * Se guarda en el navegador una semana para no preguntar en cada visita.
 */
const CLAVE_PORTADAS = 'woodz:portadas-listas';
const UNA_SEMANA = 7 * 24 * 60 * 60 * 1000;
const pendientes = new Map();

function leerPortadas() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_PORTADAS)) || {};
  } catch {
    return {};
  }
}

/** Promesa con la URL de la portada de la lista (o '' si YouTube no la da). */
export function portadaLista(id) {
  const guardada = leerPortadas()[id];
  if (guardada && Date.now() - guardada.fecha < UNA_SEMANA) return Promise.resolve(guardada.url);
  if (pendientes.has(id)) return pendientes.get(id);

  const lista = `https://www.youtube.com/playlist?list=${encodeURIComponent(id)}`;
  const promesa = fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(lista)}`)
    .then((r) => (r.ok ? r.json() : null))
    .then((datos) => {
      const url = /^https:\/\/i\d?\.ytimg\.com\//.test(datos?.thumbnail_url || '') ? datos.thumbnail_url : '';
      if (url) {
        try {
          const todas = leerPortadas();
          todas[id] = { url, fecha: Date.now() };
          localStorage.setItem(CLAVE_PORTADAS, JSON.stringify(todas));
        } catch { /* sin almacenamiento: se volverá a pedir */ }
      }
      return url;
    })
    .catch(() => '');
  pendientes.set(id, promesa);
  return promesa;
}

/** Pone en un <img> la portada de la lista cuando llegue (la imagen de reserva se queda si no hay). */
export function ponerPortadaLista(img, id) {
  portadaLista(id).then((url) => { if (url) img.src = url; });
}

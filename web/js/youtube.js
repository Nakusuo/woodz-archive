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

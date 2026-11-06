/**
 * Catálogo de MOODZFLIX: los videos de la pestaña Videos tal como llegan de la hoja, con lo
 * que hace falta para buscarlos (título, álbum, año y categoría).
 *
 * La hoja no cambia. El álbum y el año salen de las columnas que ya existen:
 *  - Si la pestaña Videos tiene columnas Album / Anio (o Año), se usan tal cual.
 *  - Si no, el álbum se deduce de la pestaña Canciones: por el mismo video de YouTube o porque
 *    el título del video empieza por el nombre de la canción ("CINEMA Live Clip" → Archive. 1).
 *  - El año: el que aparezca en el título (giras, festivales) o, si no, el del disco.
 */
import { campo } from '../idioma.js';
import { claveTexto } from '../datos.js';
import { urlSegura } from '../seguro.js';
import { infoYouTube } from '../youtube.js';

/** "Canción" → "cancion": minúsculas, sin acentos y sin signos (para buscar). */
export function plano(texto = '') {
  return String(texto)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/** Palabras extra por categoría, para que "mv", "en vivo" o "escenario" encuentren lo suyo. */
const SINONIMOS = [
  [/music video|^mv\b|\bmvs?\b/i, 'mv mvs music video videoclip video musical'],
  [/live/i, 'live en vivo directo concierto concert'],
  [/stage|perform/i, 'stage stages escenario presentacion performance actuacion'],
  [/vlog/i, 'vlog vlogs yowoodzm'],
  [/variety|show/i, 'variety programa show tv television'],
  [/fancam/i, 'fancam fancams camara fan'],
];

const anioDe = (texto) => (String(texto || '').match(/\b(19|20)\d{2}\b/) || [''])[0];

function indiceCanciones(canciones, lanzamientos) {
  const discos = new Map();
  for (const d of lanzamientos || []) {
    if (!d.titulo) continue;
    if (d.id) discos.set(claveTexto(d.id), d);
    discos.set(claveTexto(d.titulo), d);
  }
  const porVideo = new Map();
  const porTitulo = [];
  for (const c of canciones || []) {
    if (!c.titulo) continue;
    const disco = discos.get(claveTexto(c.lanzamiento));
    const info = {
      album: disco?.titulo || c.lanzamiento || '',
      anio: anioDe(disco?.fecha),
    };
    const yt = infoYouTube(urlSegura(c.url_video));
    if (yt?.tipo === 'video') porVideo.set(yt.id, info);
    // Nombre corto de la canción (sin "(feat. …)") para compararlo con el principio del título.
    const corto = plano(c.titulo.split(/\s[([]/)[0]);
    if (corto.length >= 3) porTitulo.push({ corto, info });
  }
  // Primero los nombres más largos: "Drowning" no debe ganar a "Drowning (Remix)".
  porTitulo.sort((a, b) => b.corto.length - a.corto.length);
  return { porVideo, porTitulo };
}

/** Lista de videos válidos con { titulo, categoria, url, yt, album, anio, texto } para buscar. */
export function crearCatalogo(videos, canciones, lanzamientos) {
  const { porVideo, porTitulo } = indiceCanciones(canciones, lanzamientos);

  return (videos || [])
    .filter((v) => {
      const ok = v.titulo && v.categoria && urlSegura(v.url_video);
      if (!ok) console.warn('[WOODZ] Video ignorado (falta título, categoría o URL válida):', v); // RN-06
      return ok;
    })
    .map((v) => {
      const url = urlSegura(v.url_video);
      const yt = infoYouTube(url);
      const titulo = campo(v, 'titulo');
      const categoria = campo(v, 'categoria');
      const tituloPlano = plano(`${v.titulo} ${v.titulo_en || ''}`);
      const cancion = (yt?.tipo === 'video' && porVideo.get(yt.id))
        || porTitulo.find((c) => tituloPlano === c.corto || tituloPlano.startsWith(`${c.corto} `))?.info;
      const album = v.album || v.album_en || cancion?.album || '';
      const anio = anioDe(v.anio || v.ano) || anioDe(v.titulo) || cancion?.anio || '';
      const sinonimos = SINONIMOS.filter(([re]) => re.test(v.categoria)).map(([, extra]) => extra);
      return {
        fila: v,
        titulo,
        categoria,
        // Clave fija de la categoría (la de la hoja, en español), para filtros y anclas.
        grupo: v.categoria,
        url,
        yt,
        album,
        anio,
        // Con un espacio delante: cada palabra buscada debe ser el principio de una palabra ("live" no encuentra "delivery").
        texto: ` ${plano([v.titulo, v.titulo_en, v.categoria, v.categoria_en, album, anio, ...sinonimos].filter(Boolean).join(' '))}`,
      };
    });
}

/** Videos con todas las palabras buscadas (en cualquier orden, sin acentos ni mayúsculas, también a medio escribir). */
export function buscar(catalogo, consulta, { categoria = '', anio = '' } = {}) {
  const palabras = plano(consulta).split(' ').filter(Boolean);
  return catalogo.filter((v) =>
    (!categoria || v.grupo === categoria)
    && (!anio || v.anio === anio)
    && palabras.every((p) => v.texto.includes(` ${p}`)));
}

// Al publicar (GitHub Actions y Vercel), mete en el HTML una versión sencilla del contenido
// de la hoja dentro de <noscript>: así la historia, la discografía y los videos se pueden leer
// sin JavaScript y los buscadores los encuentran (sección 10 de los requerimientos).
//
// Lee la hoja publicada (la misma de web/js/config.js) y, si Google falla, la copia de contenido/.
// Cambia web/index.html y web/moodzflix.html: no se ejecuta en local, solo en el despliegue.
import { readFileSync, writeFileSync } from 'node:fs';
import Papa from 'papaparse';
import { HOJAS } from '../web/js/config.js';

const NOMBRES = { etapas: 'Etapas', lanzamientos: 'Lanzamientos', videos: 'Videos' };

const normalizar = (texto = '') => String(texto)
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .trim().toLowerCase()
  .replace(/[\s-]+/g, '_');

const escapar = (texto = '') => String(texto)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

const httpsSegura = (url) => {
  try {
    const u = new URL(String(url || '').trim());
    return u.protocol === 'https:' ? u.href : '';
  } catch {
    return '';
  }
};

function parsear(texto) {
  const { data } = Papa.parse(texto, { header: true, skipEmptyLines: 'greedy', transformHeader: normalizar });
  return data
    .map((f) => Object.fromEntries(Object.entries(f).filter(([k]) => k && k !== '__parsed_extra').map(([k, v]) => [k, String(v ?? '').trim()])))
    .filter((f) => Object.values(f).some(Boolean) && normalizar(f.activo || 'si') !== 'no');
}

async function leer(clave) {
  try {
    const r = await fetch(HOJAS[clave], { signal: AbortSignal.timeout(15000) });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return parsear(await r.text());
  } catch (error) {
    console.warn(`prerender: "${NOMBRES[clave]}" desde la copia de contenido/ (${error.message})`);
    return parsear(readFileSync(`contenido/${NOMBRES[clave]}.csv`, 'utf8'));
  }
}

function insertar(archivo, marca, html) {
  const texto = readFileSync(archivo, 'utf8');
  const comentario = `<!-- prerender:${marca} -->`;
  if (!texto.includes(comentario)) throw new Error(`Falta ${comentario} en ${archivo}`);
  writeFileSync(archivo, texto.replace(comentario, html));
}

const [etapas, lanzamientos, videos] = await Promise.all(['etapas', 'lanzamientos', 'videos'].map(leer));

// WOODZ Archive: etapas y discos.
const archivo = [
  '<section class="mt-8"><h2 class="font-display text-2xl uppercase">History / Historia</h2><ol class="mt-3 space-y-3">',
  ...etapas.filter((e) => e.nombre).map((e) => `<li><strong>${escapar(e.nombre)}</strong>${e.anio ? ` (${escapar(e.anio)})` : ''}${e.resumen_en || e.resumen ? `: ${escapar(e.resumen_en || e.resumen)}` : ''}</li>`),
  '</ol></section>',
  '<section class="mt-8"><h2 class="font-display text-2xl uppercase">Discography / Discografía</h2><ul class="mt-3 space-y-1">',
  ...lanzamientos.filter((d) => d.titulo)
    .sort((a, b) => (b.fecha || '0').localeCompare(a.fecha || '0'))
    .map((d) => {
      const meta = [d.tipo, (d.fecha || '').slice(0, 4)].filter(Boolean).join(', ');
      const enlace = httpsSegura(d.url_spotify);
      const titulo = enlace ? `<a class="underline" href="${escapar(enlace)}">${escapar(d.titulo)}</a>` : escapar(d.titulo);
      return `<li>${titulo}${meta ? ` (${escapar(meta)})` : ''}</li>`;
    }),
  '</ul></section>',
  '<p class="mt-8"><a class="underline" href="moodzflix.html">MOODZFLIX</a></p>',
].join('\n');

// MOODZFLIX: videos por categoría con su enlace a YouTube.
const grupos = new Map();
for (const v of videos) {
  const url = httpsSegura(v.url_video);
  if (!v.titulo || !v.categoria || !url) continue;
  if (!grupos.has(v.categoria)) grupos.set(v.categoria, []);
  grupos.get(v.categoria).push(`<li><a class="underline" href="${escapar(url)}">${escapar(v.titulo)}</a></li>`);
}
const moodzflix = [...grupos].map(([categoria, items]) =>
  `<section class="mt-8"><h2 class="text-xl font-semibold">${escapar(categoria)}</h2><ul class="mt-3 space-y-1">\n${items.join('\n')}\n</ul></section>`).join('\n');

insertar('web/index.html', 'archivo', archivo);
insertar('web/moodzflix.html', 'moodzflix', moodzflix);
console.log(`prerender: ${etapas.length} etapas, ${lanzamientos.length} discos y ${videos.length} videos en el HTML`);

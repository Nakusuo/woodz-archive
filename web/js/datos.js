/**
 * Motor de datos (CU-01): lee las pestañas que pide cada página, las normaliza y guarda una copia.
 *
 * Origen de cada pestaña:
 *  1. La URL CSV publicada de Google Sheets (config.js), si existe.
 *  2. Si no hay URL, la copia local web/datos/<Pestaña>.csv (sale de contenido/).
 *  3. Si la petición falla, la última copia guardada en este navegador (localStorage).
 */
import { HOJAS, TIEMPO_ESPERA_MS } from './config.js';

const NOMBRES = {
  portada: 'Portada', etapas: 'Etapas', lanzamientos: 'Lanzamientos', canciones: 'Canciones',
  redes: 'Redes', destacado: 'Destacado', videos: 'Videos', creditos: 'Creditos',
};

/** "Título Álbum " → "titulo_album" (RF-02). */
export function normalizar(texto = '') {
  return String(texto)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .trim().toLowerCase()
    .replace(/[\s-]+/g, '_');
}

/** Para comparar títulos e IDs (RN-01): "OO-LI", "oo li" y "ooli" dan "ooli". */
export const claveTexto = (texto) => normalizar(texto).replace(/[^a-z0-9]/g, '');

async function pedir(url) {
  const control = new AbortController();
  const reloj = setTimeout(() => control.abort(), TIEMPO_ESPERA_MS);
  try {
    const respuesta = await fetch(url, { signal: control.signal, cache: 'no-cache' });
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    return await respuesta.text();
  } finally {
    clearTimeout(reloj);
  }
}

function parsear(texto) {
  const { data } = window.Papa.parse(texto, { header: true, skipEmptyLines: 'greedy', transformHeader: normalizar });
  const filas = data
    .map((fila) => Object.fromEntries(Object.entries(fila).map(([k, v]) => [k, (v ?? '').trim()])))
    .filter((fila) => normalizar(fila.activo || 'si') !== 'no'); // RF-03
  // Orden estable: las filas sin número quedan en el orden de la hoja.
  return filas
    .map((fila, i) => ({ fila, i }))
    .sort((a, b) => (Number(a.fila.orden) || 0) - (Number(b.fila.orden) || 0) || a.i - b.i)
    .map(({ fila }) => fila);
}

function guardarCopia(clave, filas) {
  try {
    localStorage.setItem(`woodz:${clave}`, JSON.stringify({ fecha: Date.now(), filas }));
  } catch { /* sin almacenamiento disponible: no pasa nada */ }
}

function leerCopia(clave) {
  try {
    return JSON.parse(localStorage.getItem(`woodz:${clave}`))?.filas ?? null;
  } catch {
    return null;
  }
}

async function cargarPestana(clave) {
  const nombre = NOMBRES[clave];
  const url = HOJAS[clave] || `datos/${nombre}.csv`;
  try {
    const filas = parsear(await pedir(url));
    guardarCopia(clave, filas);
    return filas;
  } catch (error) {
    const copia = leerCopia(clave);
    console.warn(`[WOODZ] No se pudo leer "${nombre}" (${error.message}).`, copia ? 'Uso la última copia guardada.' : 'Sin copia guardada.');
    return copia;
  }
}

/** cargar(['etapas', 'videos']) → { etapas: [...], videos: [...] }. Una pestaña que falló vale null (RF-04). */
export async function cargar(claves) {
  const resultados = await Promise.all(claves.map(cargarPestana));
  const datos = Object.fromEntries(claves.map((c, i) => [c, resultados[i]]));
  console.info('[WOODZ] Datos cargados:', Object.fromEntries(claves.map((c) => [c, datos[c]?.length ?? 'error'])));
  return datos;
}

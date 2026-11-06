/**
 * Motor de datos (CU-01): lee las pestañas que pide cada página, las normaliza y guarda una copia.
 *
 * Origen de cada pestaña:
 *  1. La URL CSV publicada de Google Sheets (config.js), si existe.
 *  2. Si no hay URL, la copia local web/datos/<Pestaña>.csv (sale de contenido/).
 *  3. Si la petición falla, la última copia guardada en este navegador (localStorage).
 *
 * Caché: si la última carga correcta tiene menos de COPIA_FRESCA_MS, la página abre al momento
 * con ella y pide la hoja por detrás para la próxima visita. Así abre rápido y, aun así,
 * lo que se cambie en la hoja aparece sin tocar el código.
 */
import { COPIA_FRESCA_MS, HOJAS, TIEMPO_ESPERA_MS } from './config.js';

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
    .map((fila) => Object.fromEntries(Object.entries(fila)
      .filter(([k]) => k && k !== '__parsed_extra') // columnas sin nombre o celdas de más
      .map(([k, v]) => [k, String(v ?? '').trim()])))
    .filter((fila) => Object.values(fila).some(Boolean)) // filas vacías
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

/** { fecha, filas } de la última carga correcta en este navegador, o null. */
function leerCopia(clave) {
  try {
    const copia = JSON.parse(localStorage.getItem(`woodz:${clave}`));
    return Array.isArray(copia?.filas) ? copia : null;
  } catch {
    return null;
  }
}

/** Pide la pestaña a la hoja y guarda la copia, sin esperar (para la próxima visita). */
function refrescarPorDetras(clave, url) {
  pedir(url).then((texto) => guardarCopia(clave, parsear(texto))).catch(() => { /* ya se usó la copia */ });
}

async function cargarPestana(clave, { forzar = false } = {}) {
  const nombre = NOMBRES[clave];
  const local = `datos/${nombre}.csv`;
  const url = HOJAS[clave] || local;

  const reciente = !forzar && leerCopia(clave);
  if (reciente && Date.now() - reciente.fecha < COPIA_FRESCA_MS) {
    refrescarPorDetras(clave, url);
    return reciente.filas;
  }

  try {
    const filas = parsear(await pedir(url));
    guardarCopia(clave, filas);
    return filas;
  } catch (error) {
    // 1º la última copia de este navegador; 2º la copia que va con la web (npm run hoja).
    const copia = leerCopia(clave)?.filas;
    if (copia) {
      console.warn(`[WOODZ] No se pudo leer "${nombre}" (${error.message}). Uso la última copia guardada.`);
      return copia;
    }
    if (url !== local) {
      try {
        console.warn(`[WOODZ] No se pudo leer "${nombre}" de la hoja (${error.message}). Uso la copia de la web.`);
        return parsear(await pedir(local));
      } catch { /* tampoco hay copia local */ }
    }
    console.warn(`[WOODZ] Sin datos para "${nombre}".`);
    return null;
  }
}

/**
 * cargar(['etapas', 'videos']) → { etapas: [...], videos: [...] }. Una pestaña que falló vale null (RF-04).
 * Con { forzar: true } (botón "Reintentar") no usa la copia reciente y vuelve a pedir la hoja.
 */
export async function cargar(claves, opciones) {
  const resultados = await Promise.all(claves.map((c) => cargarPestana(c, opciones)));
  const datos = Object.fromEntries(claves.map((c, i) => [c, resultados[i]]));
  console.info('[WOODZ] Datos cargados:', Object.fromEntries(claves.map((c) => [c, datos[c]?.length ?? 'error'])));
  return datos;
}

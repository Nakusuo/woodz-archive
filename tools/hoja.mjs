// Descarga el contenido de la hoja de Google a contenido/<Pestaña>.csv (npm run hoja).
//
// El ID de la hoja NO va en el código (el repo es público y el enlace da acceso a la hoja):
// se lee de la variable HOJA_ID o del archivo .hoja (está en .gitignore).
// Una pestaña sin filas en la hoja no pisa su CSV: se queda el contenido provisional.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const PESTANAS = ['Portada', 'Etapas', 'Lanzamientos', 'Canciones', 'Redes', 'Destacado', 'Videos', 'Creditos'];

const id = (process.env.HOJA_ID || (existsSync('.hoja') ? readFileSync('.hoja', 'utf8') : '')).trim();
if (!/^[\w-]{20,}$/.test(id)) {
  console.error('Falta el ID de la hoja: ponlo en el archivo .hoja o en la variable HOJA_ID.');
  process.exit(1);
}

const base = `https://docs.google.com/spreadsheets/d/${id}`;

// Cada pestaña tiene un "gid": se sacan de la vista HTML de la hoja.
const html = await (await fetch(`${base}/htmlview`)).text();
const gids = Object.fromEntries([...html.matchAll(/\{name: "([^"]+)"[^}]*?gid: "(\d+)"/g)].map((m) => [m[1], m[2]]));

let error = false;
for (const nombre of PESTANAS) {
  if (!gids[nombre]) {
    console.warn(`· ${nombre}: no existe en la hoja, se queda el CSV local`);
    continue;
  }
  const respuesta = await fetch(`${base}/export?format=csv&gid=${gids[nombre]}`);
  if (!respuesta.ok) {
    console.error(`✗ ${nombre}: HTTP ${respuesta.status}`);
    error = true;
    continue;
  }
  const texto = (await respuesta.text()).replace(/\r\n/g, '\n');
  const filas = texto.split('\n').slice(1).filter((l) => l.replace(/[",\s]/g, '') !== '');
  if (!filas.length) {
    console.warn(`· ${nombre}: vacía en la hoja, se queda el CSV local`);
    continue;
  }
  writeFileSync(`contenido/${nombre}.csv`, texto.endsWith('\n') ? texto : `${texto}\n`);
  console.log(`✓ ${nombre}: ${filas.length} filas`);
}
process.exit(error ? 1 : 0);

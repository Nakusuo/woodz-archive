/**
 * Buscador de MOODZFLIX (solo en esta página).
 *
 * - Busca por título, álbum, año y categoría mientras se escribe, sin recargar (catalogo.js).
 * - Ignora mayúsculas y acentos; vale en español y en inglés.
 * - Filtros por categoría (pastillas) y por año (lista), si la hoja da más de uno.
 * - Atajos: "/" o Ctrl+K (⌘K en Mac) llevan al buscador; Esc lo limpia.
 * - La búsqueda queda en la dirección (?q=…&cat=…&anio=…) para poder compartirla.
 * - Con búsqueda o filtro activos, los resultados sustituyen a las filas.
 */
import { t } from '../idioma.js';
import { reducirMovimiento } from '../comun.js';
import { el } from '../seguro.js';
import { buscar } from './catalogo.js';
import { categoriasDe, tarjeta } from './filas.js';

const $ = (id) => document.getElementById(id);

let catalogo = [];
const estado = { q: '', categoria: '', anio: '' };
let iniciado = false;

/** Prepara el buscador la primera vez y, si se vuelve a llamar (Reintentar), solo cambia los datos. */
export function prepararBuscador(nuevo) {
  catalogo = nuevo;
  pintarFiltros();
  if (!iniciado) {
    iniciado = true;
    leerDireccion();
    conectar();
  }
  aplicar({ guardar: false });
}

function leerDireccion() {
  const p = new URLSearchParams(location.search);
  estado.q = p.get('q') || '';
  estado.categoria = p.get('cat') || '';
  estado.anio = p.get('anio') || '';
  $('buscar').value = estado.q;
}

function guardarDireccion() {
  const url = new URL(location.href);
  for (const [clave, valor] of [['q', estado.q.trim()], ['cat', estado.categoria], ['anio', estado.anio]]) {
    if (valor) url.searchParams.set(clave, valor);
    else url.searchParams.delete(clave);
  }
  history.replaceState(null, '', url);
}

function pintarFiltros() {
  const categorias = categoriasDe(catalogo);
  // Una categoría de la dirección que ya no existe en la hoja se ignora.
  if (estado.categoria && !categorias.some((c) => c.grupo === estado.categoria)) estado.categoria = '';

  const chip = (texto, grupo) => el('button', {
    type: 'button', class: 'chip', 'aria-pressed': String(estado.categoria === grupo), 'data-grupo': grupo,
    onclick: () => { estado.categoria = estado.categoria === grupo && grupo ? '' : grupo; aplicar(); },
  }, texto);
  $('filtro-categorias').replaceChildren(chip(t('todos'), ''), ...categorias.map((c) => chip(c.nombre, c.grupo)));

  const anios = [...new Set(catalogo.map((v) => v.anio).filter(Boolean))].sort((a, b) => b.localeCompare(a));
  const selector = $('filtro-anio');
  if (estado.anio && !anios.includes(estado.anio)) estado.anio = '';
  selector.hidden = anios.length < 2;
  selector.replaceChildren(
    el('option', { value: '', texto: t('todosAnios') }),
    ...anios.map((a) => el('option', { value: a, texto: a })),
  );
  selector.value = estado.anio;
}

let espera = 0;
function conectar() {
  const campo = $('buscar');
  campo.addEventListener('input', () => {
    estado.q = campo.value;
    $('buscar-limpiar').hidden = !campo.value;
    clearTimeout(espera);
    espera = setTimeout(aplicar, 120); // espera a que se deje de teclear un momento
  });
  campo.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (campo.value) {
        e.preventDefault();
        limpiar({ todo: false });
      } else {
        campo.blur();
      }
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      clearTimeout(espera);
      aplicar();
      // En el móvil, cerrar el teclado para ver los resultados.
      if (matchMedia('(pointer: coarse)').matches) campo.blur();
    }
  });
  $('buscar-limpiar').addEventListener('click', () => limpiar({ todo: false }));
  $('filtro-anio').addEventListener('change', (e) => { estado.anio = e.target.value; aplicar(); });

  // "/" (fuera de un campo de texto) o Ctrl+K / ⌘K desde cualquier sitio.
  document.addEventListener('keydown', (e) => {
    const escribiendo = e.target.closest?.('input, textarea, select, [contenteditable="true"]');
    const atajoK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
    if (atajoK || (e.key === '/' && !escribiendo && !e.ctrlKey && !e.metaKey && !e.altKey)) {
      if (document.querySelector('dialog[open]')) return;
      e.preventDefault();
      enfocar();
    }
  });
  $('boton-buscar').addEventListener('click', enfocar);

  // Las pastillas de categoría de la cabecera llevan a su fila: hay que ver las filas.
  $('navegacion').addEventListener('click', (e) => { if (e.target.closest('a')) limpiar({ todo: true, enfocarCampo: false }); });
}

function enfocar() {
  const campo = $('buscar');
  $('buscador').scrollIntoView({ behavior: reducirMovimiento() ? 'auto' : 'smooth', block: 'start' });
  campo.focus({ preventScroll: true });
  campo.select();
}

function limpiar({ todo, enfocarCampo = true }) {
  estado.q = '';
  $('buscar').value = '';
  if (todo) {
    estado.categoria = '';
    estado.anio = '';
    $('filtro-anio').value = '';
  }
  aplicar();
  if (enfocarCampo) $('buscar').focus();
}

function aplicar({ guardar = true } = {}) {
  const q = estado.q.trim();
  const activo = Boolean(q || estado.categoria || estado.anio);

  $('buscar-limpiar').hidden = !estado.q;
  $('filtro-categorias').querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.grupo === estado.categoria)));
  $('filtro-anio').toggleAttribute('data-activo', Boolean(estado.anio));
  if (guardar) guardarDireccion();

  $('filas').hidden = activo;
  $('resultados').hidden = !activo;
  if (!activo) {
    $('buscar-estado').textContent = '';
    return;
  }

  const encontrados = buscar(catalogo, q, estado);
  const texto = encontrados.length ? t('resultados', { n: encontrados.length, q }) : t('sinResultados', q);
  $('resultados-titulo').textContent = texto;
  $('buscar-estado').textContent = texto;
  $('resultados-lista').replaceChildren(...encontrados.map((v) => tarjeta(v, 'min-w-0')));
  $('resultados-lista').hidden = !encontrados.length;
  $('resultados-vacio').hidden = Boolean(encontrados.length);
  if (!encontrados.length) pintarVacio();
}

/** Sin resultados: sugerencias de categorías y un botón para quitarlo todo. */
function pintarVacio() {
  const sugeridas = categoriasDe(catalogo).filter((c) => c.grupo !== estado.categoria).slice(0, 5);
  $('resultados-vacio').replaceChildren(
    el('p', { class: 'text-texto-suave', texto: t('sugerencias') }),
    el('div', { class: 'mt-3 flex flex-wrap gap-2' },
      sugeridas.map((c) => el('button', {
        type: 'button', class: 'chip',
        onclick: () => { estado.q = ''; $('buscar').value = ''; estado.anio = ''; $('filtro-anio').value = ''; estado.categoria = c.grupo; aplicar(); },
      }, c.nombre))),
    el('button', { type: 'button', class: 'boton boton-principal mt-5', onclick: () => limpiar({ todo: true }) }, t('quitarFiltros')),
  );
}

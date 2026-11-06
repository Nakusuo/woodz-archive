/**
 * Piezas compartidas por las dos páginas: imágenes de reserva, cabecera, pie y avisos.
 */
import { IMAGEN_RESERVA } from './config.js';
import { cargar } from './datos.js';
import { t } from './idioma.js';
import { el, urlSegura } from './seguro.js';

/** Cambia por la imagen de reserva cualquier <img> que falle, una sola vez (RF-34). */
export function activarImagenesDeReserva() {
  // Imagen lista: deja de verse el relleno de carga y la imagen aparece (styles.css).
  document.addEventListener('load', (evento) => {
    if (evento.target instanceof HTMLImageElement) evento.target.setAttribute('data-cargada', '');
  }, true);
  document.addEventListener('error', (evento) => {
    const img = evento.target;
    if (!(img instanceof HTMLImageElement) || img.dataset.reserva) return;
    img.dataset.reserva = 'si';
    img.src = IMAGEN_RESERVA;
  }, true); // los errores de imagen no burbujean: se escuchan en fase de captura
}

/** Da fondo a la cabecera al bajar, para que se lea sobre cualquier imagen. */
export function activarCabecera() {
  const cabecera = document.getElementById('cabecera');
  if (!cabecera) return;
  const actualizar = () => cabecera.toggleAttribute('data-solida', window.scrollY > 40);
  window.addEventListener('scroll', actualizar, { passive: true });
  actualizar();
}

export const reducirMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Pie (RF-33): créditos y año. */
export function pintarPie(creditos) {
  document.querySelectorAll('[data-anio]').forEach((n) => { n.textContent = String(new Date().getFullYear()); });
  const lista = document.getElementById('creditos');
  if (!lista) return;
  const filas = (creditos || []).filter((c) => c.nombre);
  if (!filas.length) {
    lista.closest('[data-creditos]')?.setAttribute('hidden', '');
    return;
  }
  lista.replaceChildren(...filas.map((c) => {
    const url = urlSegura(c.url);
    const nombre = url ? el('a', { href: url, target: '_blank', rel: 'noopener', class: 'underline decoration-linea underline-offset-4 hover:text-naranja', texto: c.nombre }) : c.nombre;
    return el('li', {}, nombre, c.tipo && el('span', { class: 'text-texto-suave', texto: ` (${c.tipo.toLowerCase()})` }));
  }));
}

/** Mensaje amable dentro de una sección cuando su pestaña no cargó (RF-04). */
export function mensaje(texto, clases = '') {
  return el('p', { class: `text-sm text-texto-suave ${clases}`, texto });
}

/**
 * Mensaje de error con botón "Reintentar" (sección 6 de los requerimientos).
 * alReintentar es una función async; mientras corre, el botón dice "Cargando…".
 */
export function mensajeError(texto, alReintentar, clases = '') {
  const boton = el('button', { type: 'button', class: 'boton boton-secundario mt-3', texto: t('reintentar') });
  boton.addEventListener('click', async () => {
    boton.disabled = true;
    boton.textContent = t('cargando');
    try {
      await alReintentar();
    } finally {
      // Si la sección se volvió a pintar, este botón ya no está en la página.
      boton.disabled = false;
      boton.textContent = t('reintentar');
    }
  });
  return el('div', { class: `rounded-xl border border-linea bg-superficie/60 p-5 ${clases}`, role: 'alert' },
    el('p', { class: 'text-sm text-texto-suave', texto }),
    alReintentar && boton);
}

/**
 * Une carga y pintado de una sección para que el botón "Reintentar" vuelva a pedir solo sus pestañas:
 *   seccion(['etapas'], (datos, reintentar) => pintarTimeline(datos.etapas, reintentar))(datos)
 */
export function seccion(claves, pintar) {
  const correr = (datos) => pintar(datos, async () => correr(await cargar(claves, { forzar: true })));
  return correr;
}

let observador = null;

/**
 * Aparición suave de las secciones al bajar. Marca la página con .con-aparicion (sin JS
 * no se esconde nada) y no hace nada con "reducir movimiento".
 * aparecer(nodo) sirve también para lo que se pinta después (filas de MOODZFLIX).
 */
export function aparecer(raiz = document) {
  if (reducirMovimiento() || !('IntersectionObserver' in window)) return;
  document.documentElement.classList.add('con-aparicion');
  observador ??= new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      e.target.setAttribute('data-visible', '');
      observador.unobserve(e.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  const nodos = raiz instanceof Element && raiz.hasAttribute('data-aparecer') ? [raiz] : raiz.querySelectorAll('[data-aparecer]:not([data-visible])');
  nodos.forEach((n) => observador.observe(n));
}

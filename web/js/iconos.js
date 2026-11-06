/**
 * Iconos SVG en línea (trazo de 2px, estilo Lucide). Mismo sistema que SVTFLIX.
 */
const TRAZOS = {
  play: ['M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5Z'],
  pausa: ['M9 5v14', 'M15 5v14'],
  buscar: ['M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z', 'm20 20-3.5-3.5'],
  lista: ['M3 6h12', 'M3 12h12', 'M3 18h8', 'm16 15 5 3-5 3z'],
  externo: ['M7 17 17 7', 'M8 7h9v9'],
  izquierda: ['m15 18-6-6 6-6'],
  derecha: ['m9 18 6-6-6-6'],
  volver: ['M19 12H5', 'm12 19-7-7 7-7'],
  arriba: ['M12 19V5', 'm5 12 7-7 7 7'],
  cerrar: ['M18 6 6 18', 'm6 6 12 12'],
  youtube: ['M2.5 17a24.1 24.1 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17', 'm10 15 5-3-5-3z'],
  instagram: ['M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z', 'M16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4Z', 'M17.5 6.5h.01'],
  web: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z', 'M2 12h20', 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z'],
  musica: ['M9 18V5l12-2v13', 'M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z', 'M21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z'],
};

const NS = 'http://www.w3.org/2000/svg';

/** icono('play', 'size-5') → <svg> decorativo (aria-hidden): el texto del botón ya lo describe. */
export function icono(nombre, clases = 'size-4') {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('class', `shrink-0 ${clases}`);
  const relleno = nombre === 'play';
  svg.setAttribute('fill', relleno ? 'currentColor' : 'none');
  svg.setAttribute('stroke', relleno ? 'none' : 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  for (const d of TRAZOS[nombre] || TRAZOS.web) {
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', d);
    svg.append(path);
  }
  return svg;
}

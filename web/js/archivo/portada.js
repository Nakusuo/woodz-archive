/**
 * Portada del Archivo (CU-02), según la referencia de Ange (TikTok):
 * dos filas de clips en blanco y negro que se deslizan, con el título y los botones en medio.
 * Los clips salen solos de la pestaña Videos (primero los MVs), sin trabajo extra en la hoja.
 */
import { idiomaActual } from '../idioma.js';
import { reducirMovimiento } from '../comun.js';
import { el, urlSegura } from '../seguro.js';
import { infoYouTube, miniaturaYouTube } from '../youtube.js';

const POR_FILA = 6;

export function pintarPortada(filas, videos) {
  const fila = filas?.[0];
  if (fila) {
    // "WELCOME TO WOODZ ARCHIVE" → antetítulo pequeño + título grande.
    const [, ante, titulo] = (fila.titulo || '').match(/^(welcome to)\s+(.+)$/i) || [];
    if (titulo) {
      document.getElementById('portada-antetitulo').textContent = ante;
      document.getElementById('portada-titulo').textContent = titulo;
    } else if (fila.titulo) {
      document.getElementById('portada-antetitulo').hidden = true;
      document.getElementById('portada-titulo').textContent = fila.titulo;
    }
    // Botones: en inglés solo se usa la hoja si tiene Texto_Boton_1_EN; si no, el texto del diccionario.
    const boton1 = idiomaActual() === 'en' ? fila.texto_boton_1_en : fila.texto_boton_1;
    const boton2 = idiomaActual() === 'en' ? fila.texto_boton_2_en : fila.texto_boton_2;
    if (boton1) document.getElementById('boton-conoce').textContent = boton1;
    if (boton2) document.getElementById('boton-moodzflix').textContent = boton2;
  }

  pintarClips(videos);

  // "Conoce a WOODZ": baja al timeline y deja el foco en la primera etapa (HU-02).
  document.getElementById('boton-conoce').addEventListener('click', (evento) => {
    evento.preventDefault();
    document.getElementById('historia').scrollIntoView({ behavior: reducirMovimiento() ? 'auto' : 'smooth' });
    document.querySelector('#timeline button')?.focus({ preventScroll: true });
    history.replaceState(null, '', '#historia');
  });
}

function pintarClips(videos) {
  // Primero los MVs, luego el resto; sin repetir video.
  const lista = [...(videos || [])]
    .map((v, i) => ({ v, i, mv: /music video|^mv/i.test(v.categoria) ? 0 : 1 }))
    .sort((a, b) => a.mv - b.mv || a.i - b.i)
    .map(({ v }) => infoYouTube(urlSegura(v.url_video)))
    .filter((yt) => yt?.tipo === 'video');
  const ids = [...new Set(lista.map((yt) => yt.id))].slice(0, POR_FILA * 2);
  if (!ids.length) return;

  const tesela = (id) => el('div', { class: 'tesela' },
    el('img', { src: miniaturaYouTube({ tipo: 'video', id }), alt: '', width: 480, height: 270, decoding: 'async' }));

  document.querySelectorAll('.portada-fila').forEach((filaClips, n) => {
    const propios = ids.filter((_, i) => i % 2 === n);
    const base = propios.length ? propios : ids;
    // La fila se repite dos veces para que el desplazamiento sea un bucle sin fin.
    filaClips.replaceChildren(...[...base, ...base].map(tesela));
  });

  if (reducirMovimiento()) return;
  // Cada pocos segundos, un clip visible recupera el color (como en la referencia).
  let actual = null;
  setInterval(() => {
    const ancho = window.innerWidth;
    const visibles = [...document.querySelectorAll('.tesela')].filter((t) => {
      const r = t.getBoundingClientRect();
      return r.left > ancho * 0.2 && r.right < ancho * 0.8 && r.bottom > 0 && r.top < window.innerHeight;
    });
    actual?.removeAttribute('data-color');
    actual = visibles[Math.floor(Math.random() * visibles.length)] || null;
    actual?.setAttribute('data-color', '');
  }, 3500);
}

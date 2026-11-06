/**
 * Reproductor emergente (CU-08): video o lista de YouTube sin cookies, con "Ver en YouTube".
 * El iframe de YouTube se crea solo al pulsar un video y se borra al cerrar (rendimiento).
 * Se abre con un zoom corto y se cierra con un fundido (sin animación con "reducir movimiento").
 * Pendiente (fase 6): detectar con la IFrame API los videos que no se pueden incrustar (RF-29).
 */
import { reducirMovimiento } from '../comun.js';
import { t } from '../idioma.js';
import { el } from '../seguro.js';
import { infoYouTube, urlEmbed, urlYouTube } from '../youtube.js';

let dialogo;
let marco;

function cerrar() {
  if (!dialogo.open || dialogo.hasAttribute('data-cerrando')) return;
  if (reducirMovimiento()) {
    dialogo.close();
    return;
  }
  dialogo.setAttribute('data-cerrando', '');
  const fin = () => {
    dialogo.removeAttribute('data-cerrando');
    dialogo.close();
  };
  dialogo.addEventListener('animationend', fin, { once: true });
  setTimeout(() => { if (dialogo.hasAttribute('data-cerrando')) fin(); }, 400); // por si no llega animationend
}

export function prepararReproductor() {
  dialogo = document.getElementById('reproductor');
  marco = document.getElementById('reproductor-marco');
  document.getElementById('reproductor-cerrar').addEventListener('click', cerrar);
  // Clic fuera del recuadro = cerrar.
  dialogo.addEventListener('click', (e) => { if (e.target === dialogo) cerrar(); });
  // Esc: cerrar con la misma animación.
  dialogo.addEventListener('cancel', (e) => {
    e.preventDefault();
    cerrar();
  });
  // Al cerrar se quita el video (el foco vuelve solo al botón que lo abrió).
  dialogo.addEventListener('close', () => marco.replaceChildren());
}

/** Abre el reproductor. Si el enlace no es de YouTube, lo abre en otra pestaña (RN-05). */
export function reproducir(titulo, url) {
  const info = infoYouTube(url);
  if (!info) {
    window.open(url, '_blank', 'noopener');
    return;
  }
  document.getElementById('reproductor-titulo').textContent = titulo;
  document.getElementById('reproductor-youtube').href = urlYouTube(info);
  marco.replaceChildren(el('iframe', {
    src: urlEmbed(info), title: `${t('reproductor')}: ${titulo}`, class: 'absolute inset-0 size-full',
    allow: 'autoplay; encrypted-media; picture-in-picture; fullscreen', allowfullscreen: true,
    referrerpolicy: 'strict-origin-when-cross-origin',
  }));
  dialogo.showModal();
}

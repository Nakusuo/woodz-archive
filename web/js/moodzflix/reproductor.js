/**
 * Reproductor emergente (CU-08): video o lista de YouTube sin cookies, con "Ver en YouTube".
 * Pendiente (fase 6): detectar con la IFrame API los videos que no se pueden incrustar (RF-29).
 */
import { infoYouTube, urlEmbed, urlYouTube } from '../youtube.js';

let dialogo;
let video;

export function prepararReproductor() {
  dialogo = document.getElementById('reproductor');
  video = document.getElementById('reproductor-video');
  document.getElementById('reproductor-cerrar').addEventListener('click', () => dialogo.close());
  // Clic fuera del recuadro = cerrar.
  dialogo.addEventListener('click', (e) => { if (e.target === dialogo) dialogo.close(); });
  // Al cerrar se para el video (el foco vuelve solo al botón que lo abrió).
  dialogo.addEventListener('close', () => video.removeAttribute('src'));
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
  video.title = titulo;
  video.src = urlEmbed(info);
  dialogo.showModal();
}

/**
 * Portada del Archivo (CU-02): clip o póster en blanco y negro, título y dos botones.
 */
import { reducirMovimiento } from '../comun.js';
import { el, urlSegura } from '../seguro.js';

export function pintarPortada(filas) {
  const fila = filas?.[0];
  const poster = document.getElementById('portada-poster');
  const mostrar = (nodo) => nodo.classList.replace('opacity-0', 'opacity-100');

  poster.addEventListener('load', () => mostrar(poster), { once: true });
  if (fila) {
    if (fila.titulo) document.getElementById('portada-titulo').textContent = fila.titulo;
    if (fila.texto_boton_1) document.getElementById('boton-conoce').textContent = fila.texto_boton_1;
    if (fila.texto_boton_2) document.getElementById('boton-moodzflix').textContent = fila.texto_boton_2;
    const urlPoster = urlSegura(fila.url_poster);
    if (urlPoster) poster.src = urlPoster;

    // El clip entra solo cuando el póster ya se ve y si de verdad arranca (RF-08).
    const urlVideo = urlSegura(fila.url_video_fondo);
    if (urlVideo && !reducirMovimiento()) {
      const video = el('video', {
        src: urlVideo, muted: true, loop: true, playsinline: true, autoplay: true, preload: 'auto',
        'aria-hidden': 'true', class: 'absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-700',
      });
      video.muted = true; // el atributo no basta en todos los navegadores para permitir el autoplay
      video.addEventListener('playing', () => mostrar(video), { once: true });
      document.getElementById('portada-medio').append(video);
    }
  }

  // "Conoce a WOODZ": baja al timeline y deja el foco en la primera etapa (HU-02).
  document.getElementById('boton-conoce').addEventListener('click', (evento) => {
    evento.preventDefault();
    document.getElementById('historia').scrollIntoView({ behavior: reducirMovimiento() ? 'auto' : 'smooth' });
    document.querySelector('#timeline button')?.focus({ preventScroll: true });
    history.replaceState(null, '', '#historia');
  });
}

/**
 * Banner destacado (CU-06): póster o video de fondo, título, descripción y botones.
 */
import { campo, t } from '../idioma.js';
import { reducirMovimiento } from '../comun.js';
import { icono } from '../iconos.js';
import { el, urlSegura } from '../seguro.js';
import { infoYouTube, miniaturaGrande } from '../youtube.js';
import { reproducir } from './reproductor.js';

export function pintarDestacado(filas) {
  const titulo = document.getElementById('destacado-titulo');
  const fila = filas?.find((f) => f.titulo); // RN-07: la primera activa
  if (!fila) {
    titulo.textContent = 'MOODZFLIX';
    return;
  }

  const principal = urlSegura(fila.url_boton_principal);
  const poster = document.getElementById('destacado-poster');
  poster.addEventListener('load', () => poster.classList.replace('opacity-0', 'opacity-100'), { once: true });
  poster.src = urlSegura(fila.url_poster) || miniaturaGrande(infoYouTube(principal)) || '';

  const urlVideo = urlSegura(fila.url_video_fondo);
  if (urlVideo && !reducirMovimiento()) {
    const v = el('video', { src: urlVideo, muted: true, loop: true, playsinline: true, autoplay: true, 'aria-hidden': 'true', class: 'absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-700' });
    v.muted = true;
    v.addEventListener('playing', () => v.classList.replace('opacity-0', 'opacity-100'), { once: true });
    document.getElementById('destacado-medio').append(v);
  }

  const logo = urlSegura(fila.url_logo);
  titulo.replaceChildren(logo
    ? el('img', { src: logo, alt: fila.titulo, class: 'max-h-32 w-auto max-w-[80vw] object-contain sm:max-h-44' })
    : fila.titulo);
  document.getElementById('destacado-descripcion').textContent = campo(fila, 'descripcion');

  const botones = document.getElementById('destacado-botones');
  if (principal) {
    botones.append(el('button', {
      type: 'button', class: 'inline-flex min-h-12 items-center gap-2 rounded-full bg-texto px-7 font-semibold text-fondo transition hover:bg-white active:scale-[.98]',
      onclick: () => reproducir(fila.titulo, principal),
    }, icono('play', 'size-5'), t('reproducir')));
  }
  const secundario = urlSegura(fila.url_boton_secundario);
  const textoSecundario = campo(fila, 'texto_boton_secundario');
  if (secundario && textoSecundario) {
    botones.append(el('button', {
      type: 'button', class: 'inline-flex min-h-12 items-center gap-2 rounded-full bg-white/15 px-7 font-semibold transition hover:bg-white/25 active:scale-[.98]',
      onclick: () => reproducir(textoSecundario, secundario),
    }, textoSecundario));
  }
}

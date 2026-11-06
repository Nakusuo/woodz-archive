/**
 * Banner destacado (CU-06) como carrusel al estilo Apple TV: una diapositiva por fila activa
 * de la pestaña Destacado. Pasa sola cada 8 s (no con "reducir movimiento"), se detiene al
 * pasar el ratón o con el foco dentro, y los puntos de abajo llevan a cada una.
 */
import { reducirMovimiento } from '../comun.js';
import { icono } from '../iconos.js';
import { campo, t } from '../idioma.js';
import { el, urlSegura } from '../seguro.js';
import { infoYouTube, miniaturaGrande, miniaturaYouTube, ponerPortadaLista } from '../youtube.js';
import { reproducir } from './reproductor.js';

const INTERVALO_MS = 8000;

/**
 * Imagen de fondo de una diapositiva. Las miniaturas de Google Imágenes (encrypted-tbn0.gstatic.com)
 * son demasiado pequeñas para un banner: si el botón principal es un video de YouTube, se usa su
 * miniatura grande.
 */
function fondoDe(fila) {
  const poster = urlSegura(fila.url_poster);
  const yt = infoYouTube(urlSegura(fila.url_boton_principal));
  if ((!poster || /(^|\.)encrypted-tbn\d*\.gstatic\.com$/.test(new URL(poster).hostname)) && yt?.tipo === 'video') {
    return { src: miniaturaGrande(yt), reserva: miniaturaYouTube(yt) };
  }
  return { src: poster, reserva: '' };
}

function capa(fila) {
  const urlVideo = urlSegura(fila.url_video_fondo);
  if (urlVideo && !reducirMovimiento()) {
    const v = el('video', { src: urlVideo, muted: true, loop: true, playsinline: true, autoplay: true, 'aria-hidden': 'true', class: 'absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-1000' });
    v.muted = true;
    return v;
  }
  const { src, reserva } = fondoDe(fila);
  const img = el('img', { src: src || null, alt: '', width: 1280, height: 720, class: 'absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-1000' });
  // Sin póster y con una lista de YouTube en el botón: la portada de la lista.
  const yt = infoYouTube(urlSegura(fila.url_boton_principal));
  if (!src && yt?.tipo === 'lista') ponerPortadaLista(img, yt.id);
  // YouTube responde con una imagen gris de 120×90 si un video no tiene miniatura grande.
  if (reserva) img.addEventListener('load', () => { if (img.naturalWidth <= 120) img.src = reserva; });
  return img;
}

export function pintarDestacado(filas) {
  const seccion = document.getElementById('destacado');
  const medio = document.getElementById('destacado-medio');
  const titulo = document.getElementById('destacado-titulo');
  const descripcion = document.getElementById('destacado-descripcion');
  const botones = document.getElementById('destacado-botones');
  const puntos = document.getElementById('destacado-puntos');

  const diapositivas = (filas || []).filter((f) => f.titulo);
  if (!diapositivas.length) {
    titulo.textContent = 'MOODZFLIX';
    return;
  }

  const capas = diapositivas.map(capa);
  medio.replaceChildren(...capas);

  let actual = -1;
  const mostrar = (i) => {
    if (i === actual) return;
    actual = i;
    const fila = diapositivas[i];
    capas.forEach((c, n) => {
      c.classList.toggle('opacity-100', n === i);
      c.classList.toggle('opacity-0', n !== i);
      if (c instanceof HTMLVideoElement) (n === i ? c.play() : c.pause())?.catch?.(() => {});
    });

    const logo = urlSegura(fila.url_logo);
    titulo.replaceChildren(logo
      ? el('img', { src: logo, alt: campo(fila, 'titulo'), class: 'max-h-32 w-auto max-w-[80vw] object-contain sm:max-h-44' })
      : fila.titulo);
    // Los títulos largos (programas de TV) bajan de tamaño para no ocupar media pantalla.
    titulo.classList.toggle('text-largo', fila.titulo.length > 32);
    descripcion.textContent = campo(fila, 'descripcion');

    const principal = urlSegura(fila.url_boton_principal);
    const secundario = urlSegura(fila.url_boton_secundario);
    const textoSecundario = campo(fila, 'texto_boton_secundario');
    botones.replaceChildren(
      principal && el('button', {
        type: 'button', class: 'boton boton-principal min-h-12 px-7 text-base',
        onclick: () => reproducir(fila.titulo, principal),
      }, icono('play', 'size-5'), t('reproducir')),
      secundario && textoSecundario && el('button', {
        type: 'button', class: 'boton boton-secundario min-h-12 px-7 text-base',
        onclick: () => reproducir(textoSecundario, secundario),
      }, textoSecundario),
    );

    // Texto nuevo con un fundido corto.
    const texto = document.getElementById('destacado-texto');
    texto.classList.remove('animate-aparecer');
    void texto.offsetWidth; // reinicia la animación
    texto.classList.add('animate-aparecer');

    [...puntos.children].forEach((p, n) => p.setAttribute('aria-current', String(n === i)));
  };

  // Puntos: solo si hay más de una diapositiva.
  if (diapositivas.length > 1) {
    puntos.replaceChildren(...diapositivas.map((fila, i) => el('button', {
      type: 'button', 'aria-label': fila.titulo, 'aria-current': 'false',
      class: 'h-1.5 w-6 rounded-full bg-white/30 transition-all duration-300 hover:bg-white/60 aria-[current=true]:w-10 aria-[current=true]:bg-naranja',
      onclick: () => { mostrar(i); reiniciar(); },
    })));
    puntos.hidden = false;
  }

  // Paso automático (no con "reducir movimiento"; se detiene con el ratón o el foco dentro).
  let reloj = null;
  let pausado = false;
  const reiniciar = () => {
    clearInterval(reloj);
    if (diapositivas.length < 2 || reducirMovimiento()) return;
    reloj = setInterval(() => { if (!pausado && !document.hidden) mostrar((actual + 1) % diapositivas.length); }, INTERVALO_MS);
  };
  seccion.addEventListener('mouseenter', () => { pausado = true; });
  seccion.addEventListener('mouseleave', () => { pausado = false; });
  seccion.addEventListener('focusin', () => { pausado = true; });
  seccion.addEventListener('focusout', () => { pausado = false; });

  mostrar(0);
  reiniciar();
}

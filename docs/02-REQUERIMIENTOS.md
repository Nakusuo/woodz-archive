# WOODZ Archive y MOODZFLIX — Requerimientos

> Versión 0.1 · 2026-11-03 · Ver también [01-PLAN](01-PLAN.md)
>
> Prioridad **MoSCoW**: **M** = imprescindible · **S** = debería · **C** = podría · **W** = no en esta versión

---

## 1. Actores

| Actor | Descripción |
|---|---|
| **Visitante (MOODZ)** | Cualquier persona que entra a la web. No se registra ni inicia sesión. |
| **Admin de contenido** | Personas del equipo de Ange con permiso de edición en la hoja. No necesita saber programar. |
| **Desarrollador** | Mantiene el código en GitHub y el despliegue. |
| *Google Sheets* (sistema) | Fuente de contenido: publica cada pestaña como CSV. |
| *YouTube* (sistema) | Aloja los videos y sirve las miniaturas. |
| *Spotify / Apple Music / YouTube Music* (sistema) | Donde se escucha la música. |
| *GitHub Pages / Vercel* (sistema) | Sirven la web. |

## 2. Requerimientos funcionales (RF)

### Datos (comunes a las dos páginas)
| ID | Requerimiento | Prio. |
|---|---|---|
| RF-01 | Al cargar cada página, pedir **en paralelo** solo las pestañas que esa página necesita (definidas en `config.js`). | M |
| RF-02 | Normalizar los encabezados igual que SVTFLIX: sin tildes, sin mayúsculas, sin espacios extra y con `_`. | M |
| RF-03 | Descartar filas vacías y filas con `Activo = No`, y ordenar por `Orden` cuando exista. | M |
| RF-04 | Si una pestaña falla, mostrar el resto de secciones con normalidad y un mensaje amable solo en la sección afectada. | M |
| RF-05 | Guardar en el navegador la última copia válida de cada pestaña y usarla si la red falla. | S |
| RF-06 | Mostrar esqueletos (*skeletons*) mientras llegan los datos. | S |

### Archivo: portada
| ID | Requerimiento | Prio. |
|---|---|---|
| RF-07 | La portada muestra el clip de `Portada` **silenciado, en bucle, sin controles**, a pantalla completa, en **blanco y negro** (filtro de grises con algo más de contraste). | M |
| RF-08 | Mientras carga el clip, si el autoplay falla o si está activado *reducir movimiento*, se muestra la imagen póster en B&N. | M |
| RF-09 | Título principal (por defecto *WELCOME TO WOODZ ARCHIVE*, editable en la hoja). | M |
| RF-10 | Botón **Conoce a WOODZ**: baja con desplazamiento suave al timeline. Con *reducir movimiento*, salta sin animación. | M |
| RF-11 | Botón **Ver MOODZFLIX** (texto editable): abre `moodzflix.html` en la misma pestaña. | M |

### Archivo: timeline
| ID | Requerimiento | Prio. |
|---|---|---|
| RF-12 | Timeline **horizontal** con una tarjeta por fila de `Etapas`, ordenada por `Orden`. Cada tarjeta muestra año (o rango) y nombre. | M |
| RF-13 | Se recorre con arrastre táctil, rueda, flechas laterales y teclado. Cada desplazamiento se ajusta a una tarjeta (*scroll-snap*). | M |
| RF-14 | Al pulsar una tarjeta se **despliega** su ficha: foto, texto largo y enlaces (`URL_Enlace_1..3`). Solo una ficha abierta a la vez. | M |
| RF-15 | Sección **Sigue a WOODZ / Escucha a WOODZ** con los enlaces de `Redes`, en pestaña nueva. | S |

### Archivo: Music Vault (tocadiscos)
| ID | Requerimiento | Prio. |
|---|---|---|
| RF-16 | Lista de todos los lanzamientos de `Lanzamientos` (portada pequeña, título, tipo y año), del más nuevo al más antiguo. | M |
| RF-17 | Al elegir uno, el vinilo muestra la portada en su etiqueta central y **empieza a girar**. Al elegir otro, cambia la portada sin cortes bruscos. | M |
| RF-18 | Junto al vinilo: portada grande, título, tipo, fecha y la lista de canciones (`Canciones` filtradas por `Lanzamiento`), marcando la canción principal. | M |
| RF-19 | Botón **Escuchar**: carga el embed de Spotify del lanzamiento (si hay `URL_Spotify`), y enlaces a Apple Music y YouTube Music si existen. El embed solo se carga al pulsar, no antes. | S |
| RF-20 | Si una canción tiene `URL_Video`, se puede abrir su MV en el reproductor. | C |
| RF-21 | Filtro por tipo: Todos, Álbum, Mini álbum, Single. | C |
| RF-22 | El vinilo deja de girar con *reducir movimiento* y cuando la sección sale de la pantalla. | M |
| RF-23 | Botón **Volver al inicio** al final de la página: sube a la portada. | M |

### MOODZFLIX
| ID | Requerimiento | Prio. |
|---|---|---|
| RF-24 | Cabecera fija con el logo MOODZFLIX y enlace **WOODZ Archive** para volver. Se oscurece al hacer scroll. | M |
| RF-25 | Banner **destacado** con los datos de `Destacado`: video de fondo silenciado en bucle (o póster), título, descripción corta, botón **Reproducir** y botón secundario opcional. | M |
| RF-26 | Una **fila** por cada `Categoria` de `Videos`, en el orden de `Orden_Categoria`. Tarjetas 16:9 con miniatura, título y duración. | M |
| RF-27 | Las filas se recorren con flechas laterales (escritorio), arrastre (móvil) y teclado. La flecha del extremo se oculta. | M |
| RF-28 | **Reproductor emergente**: incrusta el video o la lista desde `youtube-nocookie.com`, con título y botón **Ver en YouTube**. Se cierra con X, `Esc` o clic fuera, y el foco vuelve a la tarjeta. | M |
| RF-29 | Si YouTube da error de incrustación (101/150) o el video no existe (100), el reproductor lo dice y destaca *Ver en YouTube*. | M |
| RF-30 | Miniatura automática desde YouTube si `URL_Miniatura` está vacía. | M |
| RF-31 | Acepta los mismos formatos de URL de YouTube que SVTFLIX (`youtu.be`, `watch?v=`, `shorts`, `live`, `embed`, `playlist`). | M |
| RF-32 | Buscador por título sobre los videos cargados. | C |

### Comunes
| ID | Requerimiento | Prio. |
|---|---|---|
| RF-33 | Pie con aviso de sitio fan no oficial, créditos (`Creditos`) y año en curso, en las dos páginas. | M |
| RF-34 | Todas las imágenes tienen imagen de reserva (una sola vez, sin bucles), `loading="lazy"` fuera de pantalla y `width`/`height`. | M |
| RF-35 | La web sale en **inglés** y un botón de la cabecera la pasa a **español** (y vuelta). La elección se recuerda en el navegador. Los textos de la hoja usan la columna `<Nombre>_EN` en inglés si existe (ver `contenido/LEEME.md`). | M |

## 3. Requerimientos no funcionales (RNF)

| ID | Categoría | Requerimiento | Cómo se comprueba |
|---|---|---|---|
| RNF-01 | Coste | 0 €/mes: GitHub, GitHub Pages / Vercel Hobby, Google Sheets. | Revisión de servicios |
| RNF-02 | Arquitectura | Sin backend, sin base de datos, sin cuentas. | Revisión de código |
| RNF-03 | Rendimiento | LCP < 2,5 s y CLS < 0,1 en móvil 4G. Lighthouse móvil: Rendimiento ≥ 80, el resto ≥ 90. | Lighthouse |
| RNF-04 | Rendimiento | Clip de la portada ≤ 3 MB. Portadas en WebP ≤ 150 KB. Embeds de Spotify y YouTube solo al pedirlos. | Pestaña Network |
| RNF-05 | Responsive | De 360 px a 1920 px, probado en 1366×768. Botones táctiles de 44 px mínimo. | DevTools + móvil real |
| RNF-06 | Compatibilidad | Últimas 2 versiones de Chrome, Firefox, Edge y Safari (incluido iOS). | Pruebas manuales |
| RNF-07 | Accesibilidad | WCAG 2.2 AA básico: contraste ≥ 4.5:1, foco visible, `alt` en imágenes, modal con `role="dialog"`, `prefers-reduced-motion` respetado. | Lighthouse + axe + teclado |
| RNF-08 | Frescura | Un cambio en la hoja aparece en ≤ 10 min sin redesplegar. | Prueba manual |
| RNF-09 | Disponibilidad | Si Google no responde: última copia guardada o mensaje, nunca página en blanco. | Simular sin red |
| RNF-10 | Seguridad | Datos de la hoja como texto (`textContent`), solo URLs `https:`, CSP que permite frames solo de YouTube, Spotify y el propio sitio, `rel="noopener"` en enlaces externos. | Revisión de código + cabeceras |
| RNF-11 | Privacidad | Sin cookies propias ni analítica con rastreo. `youtube-nocookie`. | Revisión |
| RNF-12 | Mantenibilidad | URLs de las pestañas en un solo archivo. Módulos comunes compartidos por las dos páginas. Commits en español con Gitflow. | Revisión de código |
| RNF-13 | Usabilidad (admin) | Una persona no técnica añade un video en < 2 min y un lanzamiento con sus canciones en < 10 min con la guía. | Prueba con Ange |
| RNF-14 | Diseño | Archivo retro en B&N. MOODZFLIX tipo Apple TV con identidad propia. Un acento por página. Cumple las reglas anti AI-slop. | Revisión de diseño |
| RNF-15 | Veracidad | Cada fila de `Etapas`, `Lanzamientos` y `Canciones` tiene `Fuente`. | Revisión de la hoja |
| RNF-16 | Legal | Aviso de sitio fan y créditos visibles en las dos páginas. | Revisión |
| RNF-17 | SEO / compartir | `<title>`, descripción, Open Graph, favicon, `lang="es"` y contenido mínimo en `<noscript>`, en las dos páginas. | Previsualizar el enlace en WhatsApp o X |

## 4. Reglas de negocio (RN)

| ID | Regla |
|---|---|
| RN-01 | Las canciones se unen a su lanzamiento por la columna `Lanzamiento`, que puede ser el `ID` o el `Titulo` de `Lanzamientos`, comparados **normalizados** (sin tildes, mayúsculas, espacios ni signos). Así `OO-LI`, `oo li` y `ooli` coinciden. La admin escribe el título; el `ID` lo pone el equipo. |
| RN-02 | Un lanzamiento sin canciones se muestra igual, con el texto "Lista de canciones pendiente". |
| RN-03 | Un lanzamiento sin portada usa la imagen de reserva del vinilo, nunca se queda en blanco. |
| RN-04 | Al abrir el Music Vault no hay ningún disco elegido: el vinilo está quieto y se invita a elegir uno. |
| RN-05 | Una fila de MOODZFLIX sin videos válidos no se muestra. |
| RN-06 | Un video sin `Titulo` o sin URL válida se ignora y se avisa en consola con pestaña y fila. |
| RN-07 | Si `Destacado` tiene varias filas activas, se usa la primera. |
| RN-08 | En `Etapas`, una fila sin `Fuente` se muestra solo en la vista previa, no en la versión publicada. |

## 5. Modelo de datos (Google Sheets)

Una hoja con **8 pestañas**. Cada pestaña se publica como CSV (*Archivo → Compartir → Publicar en la web → [pestaña] → CSV*).

| Pestaña | La usa |
|---|---|
| `Portada`, `Etapas`, `Lanzamientos`, `Canciones`, `Redes` | WOODZ Archive |
| `Destacado`, `Videos` | MOODZFLIX |
| `Creditos` | Las dos |

**Columnas de imagen o video:** aceptan una ruta del sitio (`img/…`, `video/…`) o una URL `https://`.

Los ejemplos salen del PDF y de Telegram. **Los valores marcados "por verificar" no se publican hasta tener fuente.**

### 5.1 `Portada` (portada del Archivo)
| Columna | Tipo | Oblig. | Ejemplo |
|---|---|---|---|
| Titulo | Texto | Sí | WELCOME TO WOODZ ARCHIVE |
| URL_Video_Fondo | MP4 corto, sin audio | No | video/portada/fondo.mp4 |
| URL_Poster | Imagen 16:9 | Sí | img/portada/poster.webp |
| Texto_Boton_1 | Texto | Sí | Conoce a WOODZ |
| Texto_Boton_2 | Texto | Sí | Ver MOODZFLIX |
| Activo | Sí/No | No | Sí |

### 5.2 `Etapas` (timeline)
| Columna | Tipo | Oblig. | Ejemplo |
|---|---|---|---|
| ID | texto corto, sin espacios | Sí | uniq |
| Orden | Entero | Sí | 1 |
| Anio | Texto (año o rango) | Sí | 2014 (por verificar) |
| Nombre | Texto | Sí | UNIQ |
| Resumen | Texto corto (1 línea) | No | — |
| Texto | Texto largo | No | — |
| URL_Foto | Imagen | No | img/etapas/uniq.webp |
| Texto_Enlace_1 / URL_Enlace_1 | Texto / URL | No | — |
| Texto_Enlace_2 / URL_Enlace_2 | Texto / URL | No | — |
| Texto_Enlace_3 / URL_Enlace_3 | Texto / URL | No | — |
| Fuente | URL | Sí | — |
| Activo | Sí/No | No | Sí |

Etapas que nombran el PDF y Telegram: UNIQ, Luizy (solista), Produce X 101 / X1, Yuehua, EDAM Entertainment, WOODZ. Los años de la ilustración (2014, 2016, 2018) están **por verificar**.

### 5.3 `Lanzamientos` (Music Vault)
| Columna | Tipo | Oblig. | Ejemplo |
|---|---|---|---|
| ID | texto corto, sin espacios | Sí | oo-li |
| Titulo | Texto | Sí | OO-LI |
| Tipo | `Album` / `Mini album` / `Single` | Sí | Mini album (por verificar) |
| Fecha | AAAA-MM-DD | Sí | 2023 (por verificar) |
| URL_Portada | Imagen cuadrada | Sí | img/discos/oo-li.webp |
| URL_Spotify | URL del álbum en Spotify | No | — |
| URL_Apple_Music | URL | No | — |
| URL_YouTube_Music | URL | No | — |
| Fuente | URL | Sí | — |
| Activo | Sí/No | No | Sí |

Lanzamientos que nombra el PDF: EQUAL, WOOPS!, SET, COLORFUL TRAUMA (2022), OO-LI (2023). Ange pide **todos** los álbumes, mini álbumes y singles, así que la lista completa se arma en la fase 1.

### 5.4 `Canciones`
| Columna | Tipo | Oblig. | Ejemplo |
|---|---|---|---|
| Lanzamiento | Título (o ID) de `Lanzamientos` | Sí | OO-LI |
| Numero | Entero | Sí | 1 |
| Titulo | Texto | Sí | Drowning |
| Principal | Sí/No (canción principal) | No | — |
| URL_Video | URL YouTube (MV) | No | — |
| Fuente | URL | Sí | — |

### 5.5 `Redes`
| Columna | Tipo | Oblig. | Ejemplo |
|---|---|---|---|
| Seccion | `Sigue` / `Escucha` | Sí | Sigue |
| Nombre | Texto | Sí | Instagram |
| URL | URL | Sí | — |
| Icono | clave de icono (igual que SVTFLIX) | Sí | instagram |
| Orden | Entero | No | 1 |

### 5.6 `Destacado` (banner de MOODZFLIX)
| Columna | Tipo | Oblig. | Ejemplo |
|---|---|---|---|
| Titulo | Texto | Sí | Drowning |
| Descripcion | Texto corto | No | — |
| URL_Logo | Imagen transparente | No | — |
| URL_Video_Fondo | MP4 corto | No | video/moodzflix/destacado.mp4 |
| URL_Poster | Imagen 16:9 | Sí | img/moodzflix/destacado.webp |
| URL_Boton_Principal | URL YouTube | Sí | — |
| Texto_Boton_Secundario / URL_Boton_Secundario | Texto / URL | No | — |
| Activo | Sí/No | No | Sí |

### 5.7 `Videos` (filas de MOODZFLIX)
| Columna | Tipo | Oblig. | Ejemplo |
|---|---|---|---|
| Categoria | Texto | Sí | Music Videos y Performances |
| Orden_Categoria | Entero | No | 1 |
| Titulo | Texto | Sí | Drowning MV |
| URL_Video | URL (video o lista de YouTube) | Sí | — |
| Duracion | Texto `m:ss` | No | 4:05 (ejemplo del PDF, por verificar) |
| URL_Miniatura | Imagen 16:9 | No (sí para listas) | — |
| Orden | Entero | No | 1 |
| Activo | Sí/No | No | Sí |

Categorías iniciales (PDF): Music Videos y Performances, Programas de Variedades, YOON-LOGS, Conciertos y Live Stages.

### 5.8 `Creditos`
| Columna | Tipo | Oblig. | Ejemplo |
|---|---|---|---|
| Nombre | Texto | Sí | — |
| URL | URL | No | — |
| Tipo | `Creadora` / `Diseño` / `Contenido` / `Otros` | No | Creadora |
| Orden | Entero | No | — |

## 6. Trazabilidad

| RF | HU | CU |
|---|---|---|
| RF-01 a RF-06 | HU-24 | CU-01 |
| RF-07 a RF-11 | HU-01, HU-02, HU-03 | CU-02 |
| RF-12 a RF-15 | HU-04, HU-05, HU-06 | CU-03 |
| RF-16 a RF-22 | HU-07 a HU-11 | CU-04, CU-05 |
| RF-23 | HU-12 | CU-02 |
| RF-24, RF-25 | HU-13, HU-16 | CU-06 |
| RF-26, RF-27 | HU-14 | CU-07 |
| RF-28 a RF-31 | HU-15 | CU-08 |
| RF-32 | HU-17 | CU-09 |
| RF-33, RF-34 | HU-25 | CU-02, CU-06 |
| — (proceso) | HU-18 a HU-21 | CU-10 |
| — (calidad) | HU-22, HU-23, HU-26 | — |
| — (proceso) | HU-27 | CU-11 |

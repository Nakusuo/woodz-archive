# Especificación original (copia fiel)

Este archivo guarda, sin cambios de fondo, lo que se recibió al empezar el proyecto. Es la base de los demás documentos. Las decisiones y correcciones van en [01-PLAN](01-PLAN.md), no aquí.

Fuentes:
1. PDF `WOODZArchiveEspecificaciones.pdf` (2 páginas útiles).
2. Comentarios de Ange por Telegram (2026-11-03, de 5:49 p. m. a 6:10 p. m.).

---

## Parte A. PDF "WOODZ ARCHIVE & WOODZFLIX"

*Especificaciones Técnicas y Guía de Desarrollo Web Dual para Cho Seung-youn*

### 1. Resumen de arquitectura del proyecto

El proyecto se compone de **dos aplicaciones/páginas independientes** que se conectan entre sí mediante navegación directa.

**1.1 Página Principal de Archivo (`index.html`)**
- **Hero Section:** estética retro en escala de grises con videos de WOODZ en blanco y negro de fondo y el título principal `WELCOME TO WOODZ ARCHIVE`.
- **Botón 1:** `Conoce a WOODZ` → desplazamiento suave (smooth scroll) hacia el Timeline.
- **Botón 2:** `WATCH WOODZ CONTENT!` → abre la web independiente **WOODZFLIX**.
- **Timeline Horizontal:** recorrido por sus etapas (UNIQ → Luizy → Produce X 101/X1 → Yuehua → EDAM Ent.). Integración de ficha bio + enlaces a redes y streaming.
- **Music Vault (Vinyl Experience):** tocadiscos interactivo para escuchar y explorar su discografía (EQUAL, WOOPS!, SET, COLORFUL TRAUMA, OO-LI).

**1.2 WOODZFLIX App (`woodzflix.html`)**
- **Plataforma independiente:** interfaz estilo Netflix adaptada a WOODZ.
- **Hero Banner:** lanzamiento más reciente en reproducción automática (ej. MV de *Drowning*).
- **Carruseles horizontales:** filas categorizadas para Music Videos, Programas de Variedades, YOON-LOGS (Vlogs) y Conciertos/Live Stages.
- **Modal Player:** reproductor emergente de YouTube en HD sin publicidad externa.

### 2. Estructura de repositorio y archivos

```
woodz-archive/
├── index.html        # Página Principal (Hero B&N, Timeline, Vinilo)
├── woodzflix.html    # Página Independiente (Plataforma WOODZFLIX)
├── css/
│   ├── main.css      # Estilos generales del Archivo
│   └── woodzflix.css # Estilos UI estilo Netflix
├── js/
│   ├── main.js       # Smooth scroll, animaciones del vinilo
│   ├── woodzflix.js  # Modal player, carruseles de video
│   └── data.js       # Base de datos JSON (Discografía, Timeline, Videos)
└── assets/
    ├── images/       # Portadas de discos, thumbnails
    └── videos/       # Clips B&N para el fondo del hero
```

### 3. Especificaciones técnicas para la desarrolladora
- **Filtro B&N en portada:** aplicar `filter: grayscale(100%) contrast(110%);` al contenedor de videos del Hero en `index.html`.
- **Rotación del vinilo:** animación CSS `@keyframes spin { 100% { transform: rotate(360deg); } }` activada al seleccionar un disco en JS.
- **Timeline horizontal:** `overflow-x: auto; scroll-snap-type: x mandatory;` o la librería Swiper.js para un arrastre fluido en móviles y PC.
- **Carruseles WOODZFLIX:** disposición en Flexbox con scroll horizontal oculto o flechas de navegación lateral.

### 4. Estructura de datos en JavaScript (ejemplo)

```js
const woodzData = {
  albums: [
    { title: "OO-LI", year: 2023, cover: "oolicover.jpg", tracks: ["Drowning", "Journey", "Deep Deep Feeling"] },
    { title: "COLORFUL TRAUMA", year: 2022, cover: "colorful.jpg", tracks: ["I hate you", "Dirt on my leather"] }
  ],
  woodzflix: {
    mvs:       [{ id: "v1", title: "Drowning MV", youtubeId: "XXXXX", duration: "4:05" }],
    varieties: [{ id: "v2", title: "Lee Mujin Service Ep. 60", youtubeId: "YYYYY", duration: "25:10" }],
    vlogs:     [{ id: "v3", title: "YOON-LOG #15 UK Tour", youtubeId: "ZZZZZ", duration: "14:20" }]
  }
};
```

*Pie del PDF: "WOODZ ARCHIVE © Proyecto Web Fan-Made - Documento de Especificaciones Técnicas".*

---

## Parte B. Comentarios de Ange (Telegram)

Se copian tal cual, en orden.

| Hora | Mensaje | Imagen o enlace adjunto |
|---|---|---|
| 5:49 p. m. | "Primero tenemos la portada/home" | Ilustración 1: portada en B&N, título *WELCOME TO WOODZ ARCHIVE*, botón dorado *CONOCE A WOODZ* y botón rojo *WATCH WOODZ CONTENT!* |
| 5:49 p. m. | "Esta es una referencia" | TikTok: https://vt.tiktok.com/ZSpeNDyEe/ ("una así q tal") |
| 5:50 p. m. | "2 botones: 1 meet woodz y se abre un timeline :D horizontal con despliegue para más info" | Ilustración 2: timeline con tarjetas *2014 UNIQ*, *2016 Luizy (Solista)*, *2018 WOODZ* |
| 5:51 p. m. | "Si sigues bajando encuentras su discografía. deben de estar todos sus albumes + mini albumes + singles para presionar y que te de la info de canciones y salga un vinilo girando con la portada" | Ilustración 3: Music Vault con vinilo y *Álbum: OO-LI (2023)* con su lista de canciones |
| 5:51 p. m. | "y alli cierra abajo boton volver a inicio" | — |
| 5:51 p. m. | "2do boton watch woodz content q sea similar a la de svtflix pero más cool tipo que diga MOODZFLIX pq asi nos llamamos las fans :D" | Ilustración 4: WOODZFLIX con filas *Music Videos & Performances* y *Programas de Variedades* |
| 6:07 p. m. | "el vinyl player asi" | Diseño de reproductor de vinilo en rojo y negro (lista de canciones a la izquierda, vinilo al centro, portada y datos del álbum a la derecha) |
| 6:08 p. m. | "UN TIMELINE ASI EU" | Pinterest: https://www.pinterest.com/pin/650629477437898798/ |
| 6:08 p. m. | "o tmb asi para que no se vea muy cargade" | Pinterest: https://www.pinterest.com/pin/550213279497340614/ |
| 6:10 p. m. | "para el diseño de moodzflix si quiero algo más tipo apple tv" | Captura de Apple TV+ con *Silo* en portada y fila *Up Next on Apple TV+* |

> "svtflix" es el otro proyecto del equipo (SVTFLIX en Español, `~/Escritorio/SVTFLIX`). Ange lo pone como modelo de la plataforma de videos.

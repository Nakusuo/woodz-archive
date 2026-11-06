# WOODZ Archive y MOODZFLIX

Sitio fan (no oficial) de WOODZ con dos páginas:

- **WOODZ Archive** (`web/index.html`): portada en blanco y negro, timeline de su carrera y tocadiscos con la discografía.
- **MOODZFLIX** (`web/moodzflix.html`): videos por categorías con reproductor.

Web estática, sin backend. Colores de marca: azul (dominante) y naranja (acento), definidos como variables en `src/styles.css` (provisionales hasta acordarlos con MOODZ). El buscador está solo en MOODZFLIX. El contenido se edita en Google Sheets (plantilla en `contenido/`).

## Documentación
Todo el plan está en [`docs/`](docs/01-PLAN.md).

## Ramas (Gitflow)
- `main`: versión publicada.
- `develop`: integración. Cada push publica una vista previa en GitHub Pages.
- `feature/*`: una rama por tarea, sale de `develop` y vuelve a `develop`.

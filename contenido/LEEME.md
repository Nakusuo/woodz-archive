# Contenido

- `WOODZ-plantilla-contenido.xlsx`: la plantilla que llena Ange (formato oficial de la hoja).
- `*.csv`: copia de respaldo de cada pestaña. La web lee la hoja **en vivo** (enlace publicado en `web/js/config.js`); esta copia solo se usa si Google falla. Se actualiza con `npm run hoja`.

## De dónde salen los datos de la maqueta (2026-11-03)

Son **provisionales**, solo para maquetar. Se sustituyen por la hoja de Ange.

| Pestaña | Origen |
|---|---|
| Etapas, Lanzamientos, Canciones | PDF de especificaciones e ilustraciones de Telegram. **Sin verificar**: no hay tipos ni fechas completas a propósito. |
| Videos, Destacado | Videos reales buscados en YouTube (canal oficial de WOODZ y cadenas de TV). Títulos y duraciones tal como aparecen en YouTube. |
| Portada | Miniatura del video oficial 'Drowning' Live Clip (World Tour 'OO-LI' in Seoul), en blanco y negro desde CSS. |
| Redes | Canal oficial de YouTube (verificado). Faltan las demás redes. |
| Creditos | Ange, que pidió el proyecto. |

Nota: la serie de vlogs del canal oficial se llama **YOWOODZM** (el PDF decía "YOON-LOGS").

## Idiomas (2026-11-04)

La web sale en **inglés** y tiene un botón para pasarla a **español**.

- Los textos de la web (botones, títulos de sección, avisos) ya están traducidos en el código.
- Los textos que vienen de la hoja se muestran tal cual en los dos idiomas (títulos de discos, canciones y videos).
- Si un texto de la hoja está en español y se quiere su versión en inglés, se añade una columna con el mismo nombre y `_EN` al final. Sirve para:
  - `Etapas`: `Resumen_EN`, `Texto_EN`, `Texto_Enlace_1_EN` (2 y 3 igual).
  - `Destacado`: `Descripcion_EN`, `Texto_Boton_Secundario_EN`.
  - `Portada`: `Texto_Boton_1_EN`, `Texto_Boton_2_EN` (si no existen, en inglés se usan "Meet WOODZ" y "Watch MOODZFLIX").
- Si falta la columna `_EN`, en inglés se muestra el texto en español.

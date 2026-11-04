# WOODZ Archive y MOODZFLIX — Historias de usuario

> Versión 0.1 · 2026-11-03 · Ver también [02-REQUERIMIENTOS](02-REQUERIMIENTOS.md)
>
> Formato: **Como** [rol] **quiero** [acción] **para** [beneficio].
> Criterios en **Dado / Cuando / Entonces**. Prioridad MoSCoW (M/S/C). Puntos de esfuerzo en Fibonacci (1, 2, 3, 5, 8).

## Resumen

| Épica | HU | Puntos |
|---|---|---|
| E1 Portada del Archivo | HU-01 – HU-03 | 5 |
| E2 Timeline | HU-04 – HU-06 | 10 |
| E3 Music Vault | HU-07 – HU-12 | 16 |
| E4 MOODZFLIX | HU-13 – HU-17 | 19 |
| E5 Gestión de contenido | HU-18 – HU-21 | 9 |
| E6 Calidad y plataforma | HU-22 – HU-27 | 12 |
| **Total** | **27 HU** | **71** |

---

## E1 · Portada del Archivo

### HU-01 · Ver la portada en blanco y negro — M · 3 pts
**Como** MOODZ **quiero** que al entrar se vea un clip de WOODZ en blanco y negro con el título grande **para** sentir desde el primer segundo que es un archivo especial.
- **Dado** que `Portada` tiene un `URL_Video_Fondo`, **cuando** abro la web, **entonces** veo primero el póster en B&N y después el clip silenciado, en bucle y sin controles.
- **Dado** que el navegador bloquea el autoplay o tengo *reducir movimiento*, **entonces** se queda el póster y la página no se ve rota.
- **Dado** que el clip tarda, **cuando** aún no arranca, **entonces** el título y los botones ya se pueden usar.

### HU-02 · Ir al timeline con un botón — M · 1 pt
**Como** MOODZ **quiero** pulsar *Conoce a WOODZ* **para** llegar a su historia sin buscarla.
- **Dado** la portada, **cuando** pulso el botón, **entonces** la página baja suavemente hasta el timeline y el foco queda en su primera tarjeta.
- **Dado** que tengo *reducir movimiento*, **entonces** la página salta sin animación.

### HU-03 · Abrir MOODZFLIX desde la portada — M · 1 pt
**Como** MOODZ **quiero** un botón para ir a los videos **para** ver contenido de WOODZ.
- **Dado** la portada, **cuando** pulso *Ver MOODZFLIX*, **entonces** se abre `moodzflix.html` en la misma pestaña.

## E2 · Timeline

### HU-04 · Recorrer la carrera de WOODZ — M · 5 pts
**Como** MOODZ nueva **quiero** ver su carrera en orden, de una etapa a otra **para** entender de dónde viene.
- **Dado** `Etapas`, **cuando** llego al timeline, **entonces** veo las tarjetas en orden con año y nombre, sin textos largos.
- **Dado** que estoy en móvil, **cuando** deslizo, **entonces** el timeline se ajusta a una tarjeta.
- **Dado** que estoy en escritorio, **entonces** puedo usar flechas laterales, rueda o teclado, y la flecha del extremo se oculta.

### HU-05 · Desplegar la ficha de una etapa — M · 3 pts
**Como** MOODZ **quiero** tocar una etapa y ver más **para** conocer los detalles sin que el timeline se vea cargado.
- **Dado** el timeline, **cuando** pulso una tarjeta (o `Enter`), **entonces** se despliega su ficha con foto, texto y enlaces.
- **Dado** que hay otra ficha abierta, **cuando** abro una nueva, **entonces** la anterior se cierra.
- **Dado** que falta un dato, **entonces** esa línea no aparece, sin huecos ni "undefined".

### HU-06 · Ir a sus redes y plataformas — S · 2 pts
**Como** MOODZ **quiero** enlaces a sus redes y a las plataformas de música **para** seguirlo y escucharlo.
- **Dado** `Redes`, **entonces** veo los iconos agrupados en *Sigue a WOODZ* y *Escucha a WOODZ*, y cada uno abre en pestaña nueva.

## E3 · Music Vault

### HU-07 · Ver toda la discografía — M · 3 pts
**Como** MOODZ **quiero** ver todos sus lanzamientos en una lista **para** elegir cuál explorar.
- **Dado** `Lanzamientos`, **entonces** veo cada uno con portada pequeña, título, tipo y año, del más nuevo al más antiguo.
- **Dado** que una portada no carga, **entonces** aparece la imagen de reserva y el título sigue visible.

### HU-08 · Poner un disco en el tocadiscos — M · 5 pts
**Como** MOODZ **quiero** elegir un disco y verlo girar con su portada **para** sentir que lo estoy poniendo de verdad.
- **Dado** que no hay disco elegido, **entonces** el vinilo está quieto y hay un texto que invita a elegir uno.
- **Dado** la lista, **cuando** elijo un disco, **entonces** su portada aparece en el centro del vinilo y este empieza a girar.
- **Dado** un disco girando, **cuando** elijo otro, **entonces** la portada cambia sin saltos bruscos.
- **Dado** *reducir movimiento*, **entonces** el vinilo no gira, pero la portada sí cambia.

### HU-09 · Ver las canciones de un disco — M · 2 pts
**Como** MOODZ **quiero** ver la lista de canciones del disco elegido **para** saber qué incluye.
- **Dado** un disco elegido, **entonces** veo su portada grande, título, tipo, fecha y canciones numeradas, con la principal marcada.
- **Dado** que el disco no tiene canciones cargadas, **entonces** dice "Lista de canciones pendiente".

### HU-10 · Escuchar el disco — S · 3 pts
**Como** MOODZ **quiero** escuchar el disco desde la web **para** no tener que buscarlo aparte.
- **Dado** un disco con `URL_Spotify`, **cuando** pulso *Escuchar*, **entonces** se carga el reproductor de Spotify de ese disco.
- **Dado** que hay enlaces a Apple Music o YouTube Music, **entonces** aparecen como botones que abren en pestaña nueva.
- **Dado** que el disco no tiene ningún enlace, **entonces** el botón *Escuchar* no aparece.

### HU-11 · Filtrar por tipo de lanzamiento — C · 2 pts
**Como** MOODZ **quiero** filtrar por álbum, mini álbum o single **para** encontrar algo más rápido.
- **Dado** la lista, **cuando** elijo un tipo, **entonces** solo veo los lanzamientos de ese tipo, y *Todos* vuelve a mostrar la lista completa.

### HU-12 · Volver al inicio — M · 1 pt
**Como** MOODZ **quiero** un botón al final **para** subir a la portada sin hacer scroll.
- **Dado** que llegué al final, **cuando** pulso *Volver al inicio*, **entonces** la página sube a la portada.

## E4 · MOODZFLIX

### HU-13 · Ver el lanzamiento destacado — M · 5 pts
**Como** MOODZ **quiero** ver al entrar a MOODZFLIX lo más nuevo en grande **para** enterarme de lo último.
- **Dado** `Destacado`, **cuando** abro MOODZFLIX, **entonces** veo el póster y después el video de fondo silenciado, con título, descripción y botón *Reproducir*.
- **Dado** que pulso *Reproducir*, **entonces** se abre el reproductor con el video completo y sonido.

### HU-14 · Explorar los videos por categoría — M · 5 pts
**Como** MOODZ **quiero** ver los videos en filas por tipo **para** encontrar MVs, variedades, vlogs o conciertos.
- **Dado** `Videos`, **entonces** veo una fila por categoría, en el orden de la hoja, con tarjetas que muestran miniatura, título y duración.
- **Dado** escritorio, **cuando** paso el ratón por una fila, **entonces** aparecen flechas laterales. **Dado** móvil, **entonces** deslizo con el dedo.

### HU-15 · Ver un video sin salir de la web — M · 5 pts
**Como** MOODZ **quiero** que el video se abra encima de la página **para** seguir explorando al cerrarlo.
- **Dado** una tarjeta, **cuando** la pulso, **entonces** se abre el reproductor con el video y el botón *Ver en YouTube*.
- **Dado** que el video no se puede incrustar o no existe, **entonces** el reproductor lo dice y destaca *Ver en YouTube*.
- **Dado** el reproductor abierto, **cuando** pulso X, `Esc` o fuera, **entonces** se cierra, el video se detiene y el foco vuelve a la tarjeta.

### HU-16 · Volver al Archivo — M · 1 pt
**Como** MOODZ **quiero** volver a WOODZ Archive desde MOODZFLIX **para** no perderme entre las dos páginas.
- **Dado** MOODZFLIX, **cuando** pulso *WOODZ Archive* en la cabecera, **entonces** vuelvo a la página principal.

### HU-17 · Buscar un video — C · 3 pts
**Como** MOODZ **quiero** buscar por título **para** encontrar un video concreto.
- **Dado** el buscador, **cuando** escribo, **entonces** veo los videos que coinciden, sin importar tildes ni mayúsculas.

## E5 · Gestión de contenido

### HU-18 · Añadir un lanzamiento — M · 3 pts
**Como** admin **quiero** añadir un disco y sus canciones en la hoja **para** que aparezca en el tocadiscos sin pedir ayuda a nadie.
- **Dado** la hoja, **cuando** añado una fila en `Lanzamientos` y sus filas en `Canciones` con el mismo `ID`, **entonces** en ≤ 10 min el disco aparece en la web con sus canciones.

### HU-19 · Añadir un video — M · 2 pts
**Como** admin **quiero** pegar un enlace de YouTube en `Videos` **para** que aparezca en su fila.
- **Dado** una fila con `Categoria`, `Titulo` y `URL_Video`, **entonces** el video aparece con su miniatura automática.
- **Dado** una categoría nueva, **entonces** aparece una fila nueva sin tocar código.

### HU-20 · Editar el timeline — M · 2 pts
**Como** admin **quiero** corregir o añadir etapas en la hoja **para** mantener la historia al día.
- **Dado** `Etapas`, **cuando** cambio un texto o el `Orden`, **entonces** la web lo refleja en ≤ 10 min.

### HU-21 · Tener una guía de edición — S · 2 pts
**Como** admin no técnica **quiero** una guía corta con ejemplos **para** editar la hoja sin miedo a romper nada.
- **Dado** la guía, **entonces** explica cada pestaña con un ejemplo, qué columnas son obligatorias y que hay que poner `Fuente`.

## E6 · Calidad y plataforma

### HU-22 · Usarla bien en el celular — M · 3 pts
**Como** MOODZ **quiero** que todo funcione en el celular **para** verla desde donde esté.
- **Dado** un ancho de 360 a 1920 px, **entonces** nada se corta ni se solapa y los botones miden al menos 44 px.
- **Dado** el Music Vault en móvil, **entonces** lista, vinilo y canciones van uno debajo del otro.

### HU-23 · Usarla con teclado y sin animaciones — M · 3 pts
**Como** persona que usa teclado o es sensible al movimiento **quiero** poder recorrer todo **para** no quedar fuera.
- **Dado** el teclado, **entonces** llego a cada tarjeta, disco y botón con `Tab` y veo el foco.
- **Dado** *reducir movimiento*, **entonces** no hay giros, ni desplazamientos suaves, ni video de fondo.

### HU-24 · Que la web cargue aunque falle algo — M · 3 pts
**Como** MOODZ **quiero** que la web se vea aunque Google falle **para** no encontrarme una página en blanco.
- **Dado** que una pestaña no responde, **entonces** el resto de secciones se ve y la afectada muestra un aviso.
- **Dado** que ya entré antes, **entonces** se usa la última copia guardada.

### HU-25 · Ver el aviso de sitio fan y los créditos — M · 1 pt
**Como** equipo **queremos** un aviso claro **para** dejar ver que no es un sitio oficial.
- **Dado** cualquiera de las dos páginas, **entonces** el pie muestra el aviso de sitio fan, los créditos y el año.

### HU-26 · Compartir el enlace — S · 1 pt
**Como** MOODZ **quiero** que el enlace se vea bonito al compartirlo **para** invitar a otras fans.
- **Dado** el enlace de cualquiera de las dos páginas, **cuando** lo pego en WhatsApp o X, **entonces** sale con título, descripción e imagen.

### HU-27 · Publicar cambios de código — M · 1 pt
**Como** desarrollador **quiero** que un push publique la web sola **para** no subir archivos a mano.
- **Dado** un push a `develop`, **entonces** se actualiza la vista previa. **Dado** un merge a `main`, **entonces** se actualiza la versión final.

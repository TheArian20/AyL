# Qué suerte coincidir, Luz

Regalo de amistad con diez páginas: entrada, mapa y ocho capítulos. HTML, CSS y JavaScript, sin instalación ni compilación. Abre `index.html` o sirve esta carpeta con un servidor estático.

La fecha de entrada es **22/09/2026** (también acepta 22092026). Las puertas se desbloquean al avanzar y el progreso se guarda en el navegador. El capítulo de las estrellas requiere encender las tres.

## Personalizar

Los textos están en `app.js`, en `chapters`. La navegación y las actividades están en `experience.js`. El diseño está en `style.css` y `motion.css`. No se han inventado anécdotas. Los mensajes son un borrador para revisar antes de compartir.

## Música

`music.js` y `music.css` añaden un reproductor para el archivo proporcionado `assets/lover-remix.mp3`: Lover (Remix), Taylor Swift y Shawn Mendes. Incluye pausa, reproducción, volumen y repetición. Conserva la posición y las preferencias durante la sesión al cambiar de página. Puede haber una breve interrupción al navegar porque son documentos separados. La reproducción comienza tras un gesto del visitante; si el navegador bloquea retomarla, se puede usar el botón del reproductor.

Cada capítulo requiere descubrir su detalle antes de continuar: deslizador de fecha, palabras con mensajes, nota que gira, linterna, tres estrellas y sobre animado. El jardín responde al puntero y sus flores se encienden al tocarlas. Se respeta la preferencia de movimiento reducido. Las actividades también se pueden usar con teclado.

Verifica la lógica de acceso y las actividades con `node --test tests/experience.test.cjs`. Son comprobaciones de comportamiento con un DOM simulado; no sustituyen la revisión visual en un navegador.

## GitHub Pages

Crea un repositorio nuevo, sube estos archivos y activa Settings → Pages → Deploy from a branch → main → / (root). El sitio usa enlaces relativos y funciona dentro de un subdirectorio de GitHub Pages.

La fecha es una cerradura simbólica para la sorpresa, no autenticación segura. El código y los textos son visibles en un sitio estático; no incluyas información privada. Para privacidad real se necesita autenticación en servidor.

La tipografía se descarga de Google Fonts y tiene alternativas locales si no hay conexión.

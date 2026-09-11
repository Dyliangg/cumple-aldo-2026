# Acceso Nivel: Novio 💜

Página sorpresa de cumpleaños interactiva. HTML + CSS + JS puro, sin frameworks ni build step.

## Estructura

```
/novio-cumple
  ├── index.html      → estructura y contenido de todas las pantallas
  ├── styles.css      → variables de diseño y estilos
  ├── script.js       → lógica de la app + bloque CONFIG editable
  ├── assets/         → aquí van tus fotos (opcional)
  └── README.md
```

## Cómo personalizar el contenido

Todo lo editable está al principio de `script.js`, dentro del objeto `CONFIG`. Busca los campos marcados `PLACEHOLDER` y reemplázalos:

- **codeLength / accessCodes**: el candado ahora es un código numérico (con teclado en pantalla y cajitas de corazón). `codeLength` define cuántos dígitos tiene, y `accessCodes` es la lista de códigos válidos de esa misma longitud (ej. `"0214"`).
- **hints**: pistas que se desbloquean tras varios intentos fallidos (cada `attemptsPerHint`).
- **petMessages**: mensajes random que dice el gatito cuando el código falla.
- **anniversaryDate**: fecha en formato `YYYY-MM-DD` para el contador de días juntos.
- **gallery**: lista de fotos con su `caption`. Si dejas `img: ""` se muestra un fondo degradado; si pones una ruta (ej. `"assets/foto1.jpg"`) se muestra la foto real. Coloca tus imágenes dentro de `assets/`.
- **songs**: título + `youtubeId` (la parte de la URL después de `v=`, ej. en `https://www.youtube.com/watch?v=dQw4w9WgXcQ` el ID es `dQw4w9WgXcQ`).
- **letter**: texto de la carta (usa saltos de línea normales para separar párrafos).
- **outfits / decorItems / decorGoal**: opciones y meta del minijuego de vestuario y de decorar el pastel.
- **quiz**: preguntas y respuestas aceptadas (todo en minúsculas, comparación flexible).
- **catchTarget / catchSpeedMs**: dificultad del juego de atrapar corazones.
- **valeText**: el mensaje/regalo que se revela al completar todo.

No necesitas tocar nada más del archivo para personalizar el contenido.

## Cómo correrlo localmente

- **Opción rápida:** abre `index.html` haciendo doble clic (funciona con `file://`), salvo que los videos de YouTube pueden no cargar en algunos navegadores por restricciones de seguridad.
- **Recomendado:** usa la extensión "Live Server" de VS Code (clic derecho sobre `index.html` → "Open with Live Server"), o cualquier servidor estático:
  ```
  npx serve .
  ```

## Cómo publicarlo (deploy)

Es un sitio 100% estático, no necesita servidor ni build. Opciones más simples:

1. **Netlify Drop**: entra a [app.netlify.com/drop](https://app.netlify.com/drop) y arrastra la carpeta completa.
2. **Vercel**: `npx vercel` dentro de la carpeta del proyecto.
3. **GitHub Pages**: sube la carpeta a un repositorio y activa Pages apuntando a la rama principal.

Después de publicarlo, comparte el link (idealmente en privado, ¡es una sorpresa!).

## Notas técnicas

- No usa `localStorage`: el progreso del arcade se reinicia si recargas la página (intencional).
- Requiere navegador moderno (usa `aspect-ratio`, ES6+, etc.).
- El confetti es una implementación propia con `<canvas>`, sin librerías externas.

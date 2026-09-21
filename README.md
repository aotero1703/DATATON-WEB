# Datatón Nacional 2026

Micrositio informativo del Datatón Nacional 2026. Es una propuesta piloto no oficial; para las reglas del concurso se deben consultar las [bases publicadas por el MIMP](https://www.gob.pe/institucion/mimp/campa%C3%B1as/143857-dataton-nacional-concurso-de-soluciones-basadas-en-datos).

## Qué contiene

- Páginas HTML independientes para inicio, problema, ruta, formación, docentes, evaluación, premios, socios, fuentes de datos y contacto.
- `todo-en-uno.html`, una versión de una sola página.
- `script.js` y `map-data.js` para los contenidos dinámicos.
- `styles.css`, imágenes de docentes y socios, y material descargable de las sesiones.
- `build_pages.py`, que genera las páginas HTML a partir de las plantillas compartidas.

El sitio es estático: no necesita instalar dependencias para publicarlo. Las grabaciones se reproducen desde Drive MIMP y no están almacenadas en este repositorio.

## Código QR de la página de Formación

El QR está en [`qr-dataton-formacion.png`](qr-dataton-formacion.png) para compartir por pantalla o mensajería y en [`qr-dataton-formacion.svg`](qr-dataton-formacion.svg) para impresión. Ambos abren `https://dataton-mimp-2026.vercel.app/formacion.html`. Si la dirección pública cambia, hay que generar un QR nuevo.

## Ver el sitio en tu computadora

1. Descarga o clona este repositorio.
2. Abre PowerShell en la carpeta que contiene `index.html`.
3. Ejecuta `python -m http.server 8000` o `py -m http.server 8000`.
4. Abre `http://localhost:8000` en el navegador. Para detener el servidor, pulsa `Ctrl+C`.

## Editar el contenido

1. Cambia sesiones, grabaciones, docentes y sus fotos en `script.js` y `images/docentes/`.
2. Cambia colores y diseño en `styles.css`.
3. Para modificar el texto o la estructura de las páginas, edita `build_pages.py` y ejecuta `python build_pages.py` (o `py build_pages.py`). Esto regenera los archivos HTML. Si editas un HTML directamente, una ejecución posterior del generador puede reemplazar ese cambio.
4. Revisa el sitio en tu navegador antes de publicarlo.
5. Guarda los cambios en GitHub:

   ```powershell
   git add .
   git commit -m "Actualizar sitio del Datatón"
   git push
   ```

Los archivos `.env.local` y `.vercel/` son locales y no deben subirse a GitHub. El repositorio conserva el código y los archivos públicos del sitio.

## Publicar sin cambiar el enlace de Vercel

La dirección pública se mantiene si despliegas **el proyecto de Vercel que ya está vinculado a ese dominio**. Desde la carpeta que contiene `index.html`:

```powershell
Test-Path -LiteralPath '.\.vercel\project.json'
vercel --prod
```

Ejecuta el segundo comando solamente cuando la comprobación devuelva `True`. Si devuelve `False` —por ejemplo, después de clonar el repositorio en otra computadora— ejecuta `vercel link`, selecciona el **proyecto existente** de Vercel y comprueba de nuevo antes de desplegar. No crees un proyecto nuevo si quieres conservar el enlace.

Cada despliegue obtiene una URL propia para esa versión, pero el dominio de producción del proyecto apunta a la versión más reciente. Guardar cambios en GitHub y publicarlos en Vercel son pasos distintos, salvo que configures una integración automática entre ambos servicios.

## Estructura principal

```text
index.html, problema.html, ruta.html, formacion.html, docentes.html,
modulo.html, evaluacion.html, premios.html, socios.html, datos.html,
participa.html, todo-en-uno.html
styles.css
script.js
map-data.js
build_pages.py
images/
material/
```
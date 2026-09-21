# ✨ Datatón Nacional 2026 · Sitio web

**Datos, ideas y personas para imaginar soluciones frente a la violencia.** Este repositorio reúne las páginas, fotos, recursos de las sesiones y código del micrositio del Datatón.

🌐 **[Abrir la web](https://dataton-mimp-2026.vercel.app/)** · 🎓 **[Ir a Formación](https://dataton-mimp-2026.vercel.app/formacion.html)** · 📋 **[Consultar las bases del MIMP](https://www.gob.pe/institucion/mimp/campa%C3%B1as/143857-dataton-nacional-concurso-de-soluciones-basadas-en-datos)**

> [!NOTE]
> Este micrositio es una propuesta piloto no oficial. Las bases publicadas por el MIMP son la referencia para las reglas del concurso.

## 🚀 Quiero hacer un cambio. ¿Por dónde empiezo?

| Si quieres cambiar… | Abre… |
| --- | --- |
| Sesiones, enlaces de grabaciones, docentes y otros contenidos dinámicos | [`script.js`](script.js) |
| Fotos de docentes | [`images/docentes/`](images/docentes/) y las referencias en `script.js` |
| Colores, tamaños y apariencia | [`styles.css`](styles.css) |
| Texto o estructura de varias páginas | [`build_pages.py`](build_pages.py) |
| Datos del mapa | [`map-data.js`](map-data.js) |
| Presentaciones, datos y cuadernos de las sesiones | [`material/`](material/) |

Las páginas `.html` salen de `build_pages.py`. **Si cambias el generador, vuelve a ejecutarlo:** editar solo un HTML puede funcionar hoy, pero ese cambio se perderá al regenerar las páginas.

## 🧭 Paso a paso: cambiar algo desde GitHub

Para una corrección pequeña en un archivo que **no** sea una página HTML generada:

1. Entra a este repositorio y abre el archivo de la tabla anterior.
2. Pulsa el ícono del lápiz **Edit this file**.
3. Haz el cambio y revisa la pestaña **Preview** o **Diff**, si está disponible.
4. Pulsa **Commit changes**, escribe una descripción breve (por ejemplo, `Corregir enlace de sesión 2`) y confirma.
5. Revisa la [web publicada](https://dataton-mimp-2026.vercel.app/). **Guardar en GitHub no actualiza Vercel por sí solo**, salvo que ambos estén conectados para despliegue automático.

Para cambios en varias páginas o para probar antes de publicar, sigue el flujo local de abajo.

## 💻 Paso a paso: trabajar en tu computadora

### 1. Descarga el proyecto

Puedes pulsar **Code → Download ZIP** en GitHub y descomprimirlo. Si ya usas Git, abre PowerShell en la carpeta donde lo guardarás y ejecuta:

```powershell
git clone https://github.com/aotero1703/DATATON-WEB.git
Set-Location -LiteralPath '.\DATATON-WEB'
```

Si ya lo descargaste antes con Git, entra a esa carpeta y ejecuta `git pull` antes de editar, para traer los cambios recientes.

### 2. Abre una vista local

Desde la carpeta donde está `index.html`:

```powershell
py -m http.server 8000
```

Abre **http://localhost:8000**. Si `py` no está disponible, usa `python -m http.server 8000`. Para detener el servidor, vuelve a PowerShell y pulsa `Ctrl+C`.

### 3. Edita y comprueba

- Cambia el archivo correspondiente según la tabla inicial.
- Si modificaste `build_pages.py`, ejecuta `py build_pages.py` (o `python build_pages.py`) desde esta carpeta. El programa actualiza los HTML.
- Recarga el navegador y comprueba tanto la vista de computadora como la de celular. Abre los enlaces y, si cambiaste docentes, revisa sus fotos.

### 4. Guarda el cambio en GitHub

Si clonaste con Git:

```powershell
git status
git add .
git commit -m "Actualizar contenido del Datatón"
git push
```

Si descargaste un ZIP, esos comandos no funcionarán hasta inicializar y vincular Git; para un cambio pequeño puedes subir el archivo editado desde la interfaz de GitHub. Evita subir `.env.local` y `.vercel/`: son archivos de configuración local que están excluidos con [`.gitignore`](.gitignore).

## 🌍 Paso a paso: publicar sin cambiar la dirección

La web usa el proyecto de Vercel **`dataton-mimp-2026`**. Desde la carpeta que contiene `index.html`:

1. Comprueba si esta copia está vinculada al proyecto existente:

   ```powershell
   Test-Path -LiteralPath '.\.vercel\project.json'
   ```

2. Si aparece `False` (normal después de clonar GitHub), ejecuta `vercel link` y **elige el proyecto existente `dataton-mimp-2026`**. Repite la comprobación hasta obtener `True`.
3. Cuando hayas revisado los cambios, publícalos:

   ```powershell
   vercel --prod
   ```

Así se actualiza la dirección de producción del proyecto. Si GitHub y Vercel se conectan para despliegues automáticos, los cambios enviados a la rama de producción podrán publicarse sin ejecutar el último comando; comprueba esa configuración en Vercel antes de contar con ella.

## 📱 QR para compartir Formación

Este QR lleva a **https://dataton-mimp-2026.vercel.app/formacion.html**. Descarga el [PNG para compartir](qr-dataton-formacion.png) o el [SVG para imprimir](qr-dataton-formacion.svg).

![QR de la página de Formación](qr-dataton-formacion.png)

Si cambia la dirección de esa página, habrá que generar otro QR.

## 🗂️ ¿Qué hay dentro?

```text
index.html                Inicio
problema.html             El problema
ruta.html                 Ruta del Datatón
formacion.html            Formación y sesiones
docentes.html             Equipo docente
modulo.html               Módulos
evaluacion.html           Evaluación
premios.html              Premios
socios.html               Socios
datos.html                Fuentes de datos
participa.html            Participación y contacto
todo-en-uno.html          Versión de una sola página
script.js                 Contenidos y comportamiento
map-data.js               Datos del mapa
styles.css                Diseño
build_pages.py            Generador de páginas HTML
images/                   Fotos e imágenes
material/                 Recursos descargables
```

La web es estática: para verla o publicarla no necesitas instalar paquetes del proyecto. Las grabaciones se reproducen desde Drive MIMP; los videos no están guardados aquí.


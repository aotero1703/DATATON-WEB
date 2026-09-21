#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera las páginas estáticas del sitio del Datatón Nacional 2026 a partir de
un header/footer compartidos + el contenido propio de cada página. Se corre
una sola vez para producir los .html finales (no se ejecuta en el navegador).
"""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))

NAV_ITEMS = [
    ("index.html", "Inicio"),
    ("problema.html", "El problema"),
    ("ruta.html", "La ruta"),
    ("formacion.html", "Formación"),
    ("docentes.html", "Docentes"),
    ("evaluacion.html", "Evaluación"),
    ("premios.html", "Premios"),
    ("socios.html", "Socios"),
    ("datos.html", "Fuentes de datos"),
]

HEAD = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{description}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%230e7490'/%3E%3Ctext x='32' y='42' font-family='sans-serif' font-size='26' font-weight='800' fill='%23fff' text-anchor='middle'%3EDN%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="styles.css">
</head>
<body>

<canvas id="bgCanvas" aria-hidden="true"></canvas>

<div class="skip-note" role="note">
  Recurso informativo <strong>no oficial</strong>, elaborado por un equipo participante como propuesta piloto de apoyo para el Datatón Nacional 2026 del MIMP. No sustituye las bases oficiales.
</div>
"""

def build_header(current_file):
    links = []
    for href, label in NAV_ITEMS:
        cur = ' class="is-current"' if href == current_file else ""
        links.append(f'      <a href="{href}"{cur}>{label}</a>')
    nav_links = "\n".join(links)
    cur_cta = ' class="nav-cta is-current"' if current_file == "participa.html" else ' class="nav-cta"'
    return f"""<header class="site-header" id="top">
  <div class="wrap header-inner">
    <div class="brand">
      <a class="brand-mark" href="index.html" aria-label="Inicio del Datatón Nacional">DN</a>
      <span class="brand-text">
        <a class="brand-home" href="index.html">Datatón Nacional</a>
        <a class="brand-observatorio" href="https://www.gob.pe/institucion/mimp/tema/observatorio-nacional-de-la-violencia-contra-las-mujeres-y-los-integrantes-del-grupo-familiar" target="_blank" rel="noopener">2026 · Observatorio Nacional MIMP</a>
      </span>
    </div>
    <button class="nav-toggle" id="navToggle" aria-label="Abrir menú" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <nav class="site-nav" id="siteNav">
{nav_links}
      <a href="participa.html"{cur_cta}>Participa</a>
    </nav>
  </div>
</header>
"""

FOOTER = """<footer class="site-footer">
  <div class="wrap footer-inner">
    <div class="footer-partners">
      <div class="footer-partner-group">
        <span class="footer-partner-label">Organiza</span>
        <div class="footer-logos">
          <a class="footer-logo-chip" href="https://www.gob.pe/institucion/mimp/tema/observatorio-nacional-de-la-violencia-contra-las-mujeres-y-los-integrantes-del-grupo-familiar" target="_blank" rel="noopener"><img src="images/partners/observatorio.png" alt="Observatorio Nacional de la Violencia contra las Mujeres y los Integrantes del Grupo Familiar, MIMP" loading="lazy"></a>
        </div>
      </div>
      <div class="footer-partner-group">
        <span class="footer-partner-label">Aliados del ciclo de formación</span>
        <div class="footer-logos">
          <a class="footer-logo-chip" href="https://peru.unfpa.org/es" target="_blank" rel="noopener"><img src="images/partners/unfpa.png" alt="UNFPA" loading="lazy"></a>
          <a class="footer-logo-chip" href="https://www.ipsos.com/es-pe" target="_blank" rel="noopener"><img src="images/partners/ipsos.png" alt="Ipsos" loading="lazy"></a>
          <a class="footer-logo-chip" href="https://qlab.pucp.edu.pe/" target="_blank" rel="noopener"><img src="images/partners/qlab.png" alt="Q-LAB PUCP" loading="lazy"></a>
          <a class="footer-logo-chip" href="https://www.gob.pe/88809-laboratorio-estadistico-labstat" target="_blank" rel="noopener"><img src="images/partners/inei.png" alt="INEI · LabStat" loading="lazy"></a>
        </div>
      </div>
    </div>

    <div class="footer-contact">
      <span>¿Consultas? <a href="mailto:observatorioviolencia@mimp.gob.pe">observatorioviolencia@mimp.gob.pe</a> · Central telefónica MIMP: <a href="tel:+51016261600">(01) 626-1600, anexo 8503</a></span>
    </div>
  </div>
</footer>

<script src="map-data.js"></script>
<script src="script.js"></script>
</body>
</html>
"""

def page_header(eyebrow, title, lede):
    """Banner compacto para páginas internas (no-home)."""
    return f"""  <section class="hero hero--page" id="heroSection">
    <canvas id="heroCanvas" aria-hidden="true"></canvas>
    <div class="wrap page-header-inner">
      <a class="back-link" href="index.html">&larr; Inicio</a>
      <span class="eyebrow">{eyebrow}</span>
      <h1 class="page-title">{title}</h1>
      <p class="lede">{lede}</p>
    </div>
    <button class="scroll-cue scroll-cue--compact" id="scrollCue" aria-label="Bajar a la siguiente sección" type="button">
      <span></span>
    </button>
  </section>
"""

def wrap_page(current_file, title, description, main_html):
    return HEAD.format(title=title, description=description) + build_header(current_file) + "\n<main>\n" + main_html + "\n</main>\n\n" + FOOTER

def section_wrap(inner, wrap_class=""):
    """Envuelve el contenido interno (sin hero) de una sección en su
    <section class="section"><div class="wrap">…</div></section> — usado
    tanto por cada página independiente como por la versión "todo en una
    página" (con un encabezado propio en vez del hero de página completa).
    wrap_class añade una clase extra al div.wrap (p.ej. "participa-grid")."""
    cls = f"wrap {wrap_class}".strip()
    return f'\n  <section class="section">\n    <div class="{cls}">\n{inner}\n    </div>\n  </section>\n'

def onepage_section(anchor, eyebrow, title, lede, inner, wrap_class=""):
    """Misma sección pero con un encabezado ligero (en vez del hero de
    página completa) y un id de anclaje para la navegación por scroll."""
    cls = f"wrap {wrap_class}".strip()
    return f'''
  <section class="section onepage-section" id="{anchor}">
    <div class="{cls}">
      <span class="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p class="section-lede">{lede}</p>
{inner}
    </div>
  </section>
'''


# ---------------------------------------------------------------------------
# INDEX (home)
# ---------------------------------------------------------------------------
# Metadatos de cada módulo del ciclo de formación (fechas y temas reales,
# tomados de SESIONES) — se usan para las tarjetas de "elige tu módulo" del
# inicio y para la página modulo.html. El resumen ("desc") es una síntesis
# de los temas reales de cada módulo, no un dato nuevo.
MODULOS = [
    ("M1", "Fundamentos y problemática", "07–09 set.", 3,
     "Marco legal, enfoque de derechos humanos y los sistemas oficiales de información sobre violencia contra las mujeres."),
    ("M2", "Procesamiento y automatización", "11–16 set.", 3,
     "Manipulación y limpieza de microdatos, extracción de datos web y uso de IA para optimizar código, con Python."),
    ("M3", "Análisis cuantitativo y muestreo", "18–25 set.", 3,
     "Diseño muestral, análisis multivariado y visualización avanzada de datos (grafos y mapas)."),
    ("M4", "Charla magistral", "28 set.", 1,
     "Charla magistral sobre gestión de metadata y agentes de IA aplicados a la información pública."),
    ("M5", "Visualización y comunicación", "29 set.–02 oct.", 3,
     "Diseño de infografías de alto impacto, comunicación estratégica y el laboratorio final de soluciones."),
]
hub_html = "\n".join(
    f'''        <a class="hub-card module-card" href="modulo.html?mod={mid}">
          <span class="module-badge">Módulo {mid[1:]}</span>
          <strong>{name}</strong>
          <span class="module-desc">{desc}</span>
          <span class="module-meta">{rango} · {count} sesi{"ón" if count == 1 else "ones"}</span>
          <span class="hub-arrow">Ver módulo →</span>
        </a>'''
    for mid, name, rango, count, desc in MODULOS
)

def hero_home(version_link_html, hub_lede_extra=""):
    """El hero de portada + el hub de módulos. Se reutiliza tal cual en
    index.html (versión multi-página) y en todo-en-uno.html (versión de una
    sola página), con un único link distinto para saltar entre ambas
    versiones."""
    return f"""
  <section class="hero" id="heroSection">
    <div class="hero-photos" aria-hidden="true">
      <img class="hero-photo hero-photo--left" src="images/hero-programando.jpg" alt="" loading="eager">
      <img class="hero-photo hero-photo--right" src="images/hero-analisis.jpg" alt="" loading="eager">
    </div>
    <canvas id="heroCanvas" aria-hidden="true"></canvas>
    <div class="wrap hero-grid">
      <div class="hero-copy">
        <span class="eyebrow">Concurso de soluciones basadas en datos</span>
        <h1>Datatón Nacional 2026 <span>contra la violencia hacia niñas, adolescentes y mujeres</span></h1>
        <p class="lede">
          Convocado por el <strong>MIMP</strong>, a través del <a class="hero-observatorio" href="https://www.gob.pe/institucion/mimp/tema/observatorio-nacional-de-la-violencia-contra-las-mujeres-y-los-integrantes-del-grupo-familiar" target="_blank" rel="noopener">Observatorio Nacional de la Violencia contra las Mujeres y los Integrantes del Grupo Familiar</a>, con el ciclo de formación desarrollado junto a <strong>UNFPA</strong> e <strong>Ipsos</strong>. Este micrositio traduce las bases oficiales en un tablero de seguimiento vivo para el equipo.
        </p>
        <div class="hero-actions">
          <a href="ruta.html" class="btn btn-primary">Ver cronograma en vivo</a>
          <a href="evaluacion.html" class="btn btn-ghost">Cómo se evalúa</a>
        </div>
        {version_link_html}
        <div class="hero-status" id="heroStatus" aria-live="polite">
          <span class="dot"></span> <span id="heroStatusText">Calculando fase actual…</span>
        </div>
      </div>
      <div class="hero-panel" aria-hidden="true">
        <div class="panel-card">
          <div class="panel-row">
            <span>Progreso del concurso</span>
            <span id="progressPct">0%</span>
          </div>
          <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>
          <div class="panel-mini" id="panelMini">—</div>
        </div>
        <div class="panel-card panel-card--stat">
          <span class="mini-label">Próximo hito</span>
          <strong id="nextMilestone">—</strong>
          <span class="mini-sub" id="nextMilestoneDate">—</span>
        </div>
      </div>
    </div>
    <button class="scroll-cue" id="scrollCue" aria-label="Bajar a la siguiente sección" type="button">
      <span></span>
    </button>
  </section>

  <section class="section" id="hub">
    <div class="wrap">
      <h2>Explora por módulo</h2>
      <p class="section-lede">Elige un módulo del ciclo de formación para ver de qué trata, quién lo dicta y su material de clase.{hub_lede_extra}</p>
      <div class="hub-grid">
{hub_html}
      </div>
    </div>
  </section>
"""

index_main = hero_home(
    '<a href="todo-en-uno.html" class="hero-alt-link">Prefieres verlo todo en una sola página →</a>',
    " El resto de secciones (bases, evaluación, premios, fuentes de datos, contacto) están siempre arriba, en el menú.",
)

# ---------------------------------------------------------------------------
# PROBLEMA
# ---------------------------------------------------------------------------
PROBLEMA_EYEBROW = "El contexto"
PROBLEMA_TITLE = "Por qué este datatón"
PROBLEMA_LEDE = "Cifras oficiales citadas en las bases del concurso (ENDES 2025 y ENARES 2024) que sustentan la urgencia de generar evidencia aplicada bajo la Ley N.° 30364."

problema_inner = """      <div class="stat-grid">
        <div class="stat-card">
          <strong class="stat-number" data-count="49.1" data-suffix="%">0%</strong>
          <span class="stat-desc">de mujeres de 15 a 49 años sufrió violencia de su pareja alguna vez</span>
          <span class="stat-source">Fuente: ENDES 2025</span>
        </div>
        <div class="stat-card">
          <strong class="stat-number" data-count="8.6" data-suffix=" pp">0</strong>
          <span class="stat-desc">de reducción en ese mismo indicador (mujeres de 15 a 49 años víctimas de violencia de su pareja), entre 2019 y 2025</span>
          <span class="stat-source">Fuente: ENDES 2019-2025</span>
        </div>
        <div class="stat-card">
          <strong class="stat-number" data-count="75.7" data-suffix="%">0%</strong>
          <span class="stat-desc">de la población justificaba la violencia hacia las mujeres</span>
          <span class="stat-source">Fuente: ENARES 2024</span>
        </div>
        <div class="stat-card">
          <strong class="stat-number" data-count="69.7" data-suffix="%">0%</strong>
          <span class="stat-desc">de hombres mayores de 18 años justifica la violencia sexual contra mujeres</span>
          <span class="stat-source">Fuente: ENARES 2024</span>
        </div>
      </div>

      <div class="ecology">
        <h3>Modelo ecológico de la violencia</h3>
        <p>Toda infografía debe vincular al menos dos de estos niveles y explorar interacciones entre variables. Pasa el cursor (o toca en el celular) sobre cada nivel para ver ejemplos.</p>
        <div class="ecology-diagram ecology-diagram--wide">
          <svg viewBox="0 0 600 340" class="ecology-svg ecology-svg--wide" role="img" aria-label="Modelo ecológico de la violencia: los niveles social, comunitario, relacional e individual, uno dentro del otro. Interactivo: pasa el cursor sobre cada nivel para ver ejemplos.">
            <ellipse class="ecology-level" data-level="social" cx="305" cy="170" rx="255" ry="140" fill="#4c1d95" stroke="#f7f9fb" stroke-width="2" tabindex="0" role="button" aria-label="Nivel social. Ver ejemplos"></ellipse>
            <ellipse class="ecology-level" data-level="comunitario" cx="385" cy="170" rx="175" ry="115" fill="#6d28d9" stroke="#f7f9fb" stroke-width="2" tabindex="0" role="button" aria-label="Nivel comunitario. Ver ejemplos"></ellipse>
            <ellipse class="ecology-level" data-level="relacional" cx="450" cy="170" rx="110" ry="95" fill="#0891b2" stroke="#f7f9fb" stroke-width="2" tabindex="0" role="button" aria-label="Nivel relacional. Ver ejemplos"></ellipse>
            <ellipse class="ecology-level" data-level="individual" cx="505" cy="170" rx="55" ry="75" fill="#5eead4" stroke="#f7f9fb" stroke-width="2" tabindex="0" role="button" aria-label="Nivel individual. Ver ejemplos"></ellipse>
            <text x="128" y="170" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-family="Sora, sans-serif" font-weight="700" font-size="19" pointer-events="none">Social</text>
            <text x="272" y="170" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-family="Sora, sans-serif" font-weight="700" font-size="17" pointer-events="none">Comunitario</text>
            <text x="392" y="163" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-family="Sora, sans-serif" font-weight="700" font-size="15" pointer-events="none">Relacional</text>
            <text x="505" y="170" text-anchor="middle" dominant-baseline="middle" fill="#06333c" font-family="Sora, sans-serif" font-weight="700" font-size="14" pointer-events="none">Individual</text>
          </svg>
          <div class="ecology-panel" id="ecologyPanel">
            <strong id="ecologyPanelTitle">Pasa el cursor sobre un nivel</strong>
            <p id="ecologyPanelText">Cada nivel agrupa distintos factores asociados a la violencia contra las mujeres — desde lo más amplio (social) hasta lo más cercano a la persona (individual).</p>
          </div>
        </div>
        <p class="ecology-source">Fuente: adaptado de Bronfenbrenner (1979) y Krug et al. (2002) — citado en las Bases del Datatón Nacional 2026. Ejemplos ilustrativos del tipo de factores de cada nivel, no cifras oficiales.</p>
      </div>

      <div class="why-card">
        <h3>¿Por qué estas cifras llevan a un datatón?</h3>
        <p>
          Las bases oficiales señalan que la data presentada evidencia que, si bien la Ley N.° 30364 sí ha tenido impacto
          — el indicador principal bajó 8.6 pp entre 2019 y 2025 —, la magnitud del problema sigue siendo significativa
          y la sociedad peruana mantiene una alta tolerancia hacia la violencia contra las mujeres. Esa combinación es
          la que justifica el datatón: no basta con describir la problemática, hace falta <strong>generar conocimiento
          aplicado</strong> a partir del análisis de datos cuantitativos, para identificar patrones, factores asociados
          y brechas en la implementación de la Ley N.° 30364 y su Reglamento — evidencia que el Estado pueda usar para
          tomar decisiones más efectivas de prevención, atención, protección y sanción.
        </p>
      </div>

      <div class="map-card">
        <h3>Las cifras por departamento</h3>
        <p>El 49.1% y el 75.7% de arriba son promedios nacionales — varían bastante entre departamentos. Elige un indicador para ver el mapa.</p>
        <div class="map-toggle" role="group" id="mapToggle" aria-label="Elegir indicador del mapa">
          <button type="button" class="map-toggle-btn is-active" data-indicator="endes">Violencia de pareja<br><small>ENDES 2025</small></button>
          <button type="button" class="map-toggle-btn" data-indicator="enares">Tolerancia a la violencia<br><small>ENARES 2024</small></button>
        </div>
        <div class="map-layout">
          <div class="map-svg-wrap">
            <svg id="peruMap" role="img" aria-label="Mapa del Perú por departamento, coloreado según el indicador elegido"><!-- generado por script.js --></svg>
            <div class="map-tooltip" id="mapTooltip" hidden></div>
          </div>
          <div class="map-legend">
            <span class="map-legend-title" id="mapLegendTitle">% de mujeres de 15-49 años que sufrió violencia de su pareja alguna vez</span>
            <div class="map-legend-scale" id="mapLegendScale"></div>
            <div class="map-legend-minmax">
              <span id="mapLegendMin">—</span>
              <span id="mapLegendMax">—</span>
            </div>
            <p class="map-legend-note">Departamento más bajo: <strong id="mapLegendLowDept">—</strong>. Más alto: <strong id="mapLegendHighDept">—</strong>.</p>
          </div>
        </div>
        <p class="map-source">Fuente: ENDES 2025 y ENARES 2024 (INEI).</p>
      </div>"""

problema_main = page_header(PROBLEMA_EYEBROW, PROBLEMA_TITLE, PROBLEMA_LEDE) + section_wrap(problema_inner)

# ---------------------------------------------------------------------------
# RUTA
# ---------------------------------------------------------------------------
RUTA_EYEBROW = "Cronograma"
RUTA_TITLE = "La ruta del Datatón"
RUTA_LEDE = "Cada etapa se marca automáticamente como completada, en curso o próxima según la fecha de hoy — vuelve a esta página cuando quieras ver en qué punto va el concurso."

ruta_inner = """      <ol class="timeline" id="timeline"><!-- generado por script.js --></ol>

      <div class="chat-widget" id="chatWidget">
        <div class="chat-header">
          <span class="chat-avatar" aria-hidden="true">
            <svg viewBox="0 0 40 40" focusable="false">
              <defs>
                <linearGradient id="onitaGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stop-color="#a78bfa"/>
                  <stop offset="1" stop-color="#5eead4"/>
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="20" fill="url(#onitaGrad)"/>
              <circle cx="14" cy="19" r="2.3" fill="#0b2b33"/>
              <circle cx="26" cy="19" r="2.3" fill="#0b2b33"/>
              <path d="M13 25.5c2.5 3 11.5 3 14 0" stroke="#0b2b33" stroke-width="2.2" fill="none" stroke-linecap="round"/>
              <path d="M30 7.5l1.2 2.6 2.6 1.2-2.6 1.2-1.2 2.6-1.2-2.6-2.6-1.2 2.6-1.2z" fill="#fdba74"/>
            </svg>
          </span>
          <div>
            <strong>Onita</strong>
            <span>Tu asistente de la ruta — no es IA, son respuestas preparadas con la info del sitio</span>
          </div>
        </div>
        <div class="chat-messages" id="chatMessages">
          <div class="chat-bubble chat-bubble--bot">¡Hola! Soy Onita 👋 Elige una pregunta abajo para ver la respuesta al instante.</div>
        </div>
        <div class="chat-chips" id="chatChips"><!-- generado por script.js --></div>
      </div>"""

ruta_main = page_header(RUTA_EYEBROW, RUTA_TITLE, RUTA_LEDE) + section_wrap(ruta_inner)

# ---------------------------------------------------------------------------
# FORMACIÓN
# ---------------------------------------------------------------------------
FORMACION_EYEBROW = "30 horas lectivas"
FORMACION_TITLE = "Ciclo de formación"
FORMACION_LEDE = "Del 07 de septiembre al 02 de octubre de 2026, modalidad híbrida y virtual sincrónica (Zoom). Es el eje central de preparación para la entrega final."

formacion_inner = """      <div class="module-filter" id="moduleFilter" role="tablist"></div>
      <div class="schedule" id="schedule"><!-- generado por script.js --></div>
      <p class="fine-print">📄 = material de la sesión disponible para descargar (se va completando después de cada clase).</p>"""

formacion_main = page_header(FORMACION_EYEBROW, FORMACION_TITLE, FORMACION_LEDE) + section_wrap(formacion_inner)

# ---------------------------------------------------------------------------
# DOCENTES
# ---------------------------------------------------------------------------
DOCENTES_EYEBROW = "El equipo docente"
DOCENTES_TITLE = "Docentes del ciclo de formación"
DOCENTES_LEDE = "Especialistas de MIMP, UNFPA, Ipsos y LabStat-INEI a cargo de cada módulo. Pasa el cursor sobre una tarjeta (o tócala en el celular) para voltearla y ver su sesión. Iremos completando las biografías a medida que las recibamos del equipo."

docentes_inner = """      <div class="teacher-stats" id="teacherStats"><!-- generado por script.js --></div>
      <div class="module-filter" id="teacherFilter"></div>
      <div class="teacher-grid teacher-grid--grouped" id="teacherGrid"><!-- generado por script.js --></div>"""

docentes_main = page_header(DOCENTES_EYEBROW, DOCENTES_TITLE, DOCENTES_LEDE) + section_wrap(docentes_inner)

# ---------------------------------------------------------------------------
# MÓDULO individual (?mod=M1..M5) — vista combinada: de qué trata, sus
# sesiones con material descargable y sus docentes. Todo el contenido lo
# arma script.js leyendo el parámetro ?mod= de la URL.
# ---------------------------------------------------------------------------
modulo_main = """
  <section class="hero hero--page" id="heroSection">
    <canvas id="heroCanvas" aria-hidden="true"></canvas>
    <div class="wrap page-header-inner">
      <a class="back-link" href="index.html">&larr; Inicio</a>
      <span class="eyebrow" id="moduloEyebrow">MÓDULO</span>
      <h1 class="page-title" id="moduloTitle">Cargando módulo…</h1>
      <p class="lede" id="moduloLede"></p>
    </div>
    <button class="scroll-cue scroll-cue--compact" id="scrollCue" aria-label="Bajar a la siguiente sección" type="button">
      <span></span>
    </button>
  </section>
  <section class="section">
    <div class="wrap">
      <div class="teacher-stats" id="moduloStats"><!-- generado por script.js --></div>

      <h3>Sesiones y material</h3>
      <div class="schedule" id="moduloSessions"><!-- generado por script.js --></div>
      <p class="fine-print">📄 = material de la sesión disponible para descargar (se va completando después de cada clase).</p>

      <h3 style="margin-top:40px">Docentes de este módulo</h3>
      <div class="teacher-grid" id="moduloTeachers"><!-- generado por script.js --></div>
    </div>
  </section>
"""

# ---------------------------------------------------------------------------
# EVALUACIÓN
# ---------------------------------------------------------------------------
EVALUACION_EYEBROW = "Rúbricas oficiales"
EVALUACION_TITLE = "Evaluación y rúbricas"
EVALUACION_LEDE = "Tu nota final se arma en dos partes que se suman — así de simple: asistencia al ciclo de formación + tu entrega final."

evaluacion_inner = """      <div class="eval-flow">
        <div class="eval-flow-step">
          <span class="eval-flow-num">30 pts</span>
          <strong>Asistencia</strong>
          <p>Al ciclo de formación. Requisito: mínimo <strong>75%</strong> de asistencia de los integrantes del equipo a las sesiones virtuales o híbridas.</p>
        </div>
        <span class="eval-flow-plus" aria-hidden="true">+</span>
        <div class="eval-flow-step">
          <span class="eval-flow-num">70 pts</span>
          <strong>Proyecto final</strong>
          <p>Infografía + reporte, evaluados con la <strong>Rúbrica N.° 03</strong> (detalle abajo). Requisito: mínimo <strong>50 pts</strong> en el proyecto final.</p>
        </div>
        <span class="eval-flow-plus" aria-hidden="true">=</span>
        <div class="eval-flow-step eval-flow-step--total">
          <span class="eval-flow-num">100 pts</span>
          <strong>Puntaje total</strong>
          <p>Certificado de Curso a nombre de MIMP, UNFPA e IPSOS para quienes cumplan ambos requisitos.</p>
        </div>
      </div>

      <div class="eval-chart-card eval-chart-card--full">
        <h3 class="chart-title">¿Cómo se reparten los 70 pts del proyecto final? — Rúbrica N.° 03</h3>
        <div id="rubricChart" role="img" aria-label="Gráfico de barras con el puntaje máximo de cada criterio de la rúbrica de evaluación final"></div>
      </div>

      <div class="ai-note">
        <strong>Uso de IA generativa:</strong> permitido para exploración de ideas, redacción, código y visualizaciones — siempre que se declare la herramienta, la finalidad y el aporte propio del equipo en la sección de metodología del reporte final.
      </div>"""

evaluacion_main = page_header(EVALUACION_EYEBROW, EVALUACION_TITLE, EVALUACION_LEDE) + section_wrap(evaluacion_inner)

# ---------------------------------------------------------------------------
# PREMIOS
# ---------------------------------------------------------------------------
PREMIOS_EYEBROW = "Reconocimientos"
PREMIOS_TITLE = "Premios e incentivos"
PREMIOS_LEDE = "Los tres primeros puestos del Datatón Nacional 2026 reciben lo mismo — publicación, diploma y material bibliográfico — y el 1er puesto suma un reconocimiento adicional."

premios_inner = """      <div class="prize-shared">
        <h3>Para los 3 primeros puestos</h3>
        <ul class="prize-shared-list">
          <li>Publicación digital en el Repositorio del Observatorio Nacional</li>
          <li>Diploma de reconocimiento emitido por el MIMP</li>
          <li>Material bibliográfico especializado</li>
        </ul>
      </div>

      <div class="prize-grid">
        <div class="prize-card prize-gold">
          <span class="prize-medal">1</span>
          <span class="prize-rank">1er puesto</span>
          <p class="prize-extra"><strong>+ extra:</strong> evento de presentación de los trabajos seleccionados</p>
        </div>
        <div class="prize-card prize-silver">
          <span class="prize-medal">2</span>
          <span class="prize-rank">2do puesto</span>
          <p class="prize-extra">Recibe el reconocimiento compartido de arriba.</p>
        </div>
        <div class="prize-card prize-bronze">
          <span class="prize-medal">3</span>
          <span class="prize-rank">3er puesto</span>
          <p class="prize-extra">Recibe el reconocimiento compartido de arriba.</p>
        </div>
      </div>
      <p class="fine-print">El Comité Organizador puede anunciar premios adicionales tras el lanzamiento. Ceremonia de premiación prevista entre el 16 y el 20 de noviembre de 2026.</p>"""

premios_main = page_header(PREMIOS_EYEBROW, PREMIOS_TITLE, PREMIOS_LEDE) + section_wrap(premios_inner)

# ---------------------------------------------------------------------------
# SOCIOS
# ---------------------------------------------------------------------------
SOCIOS = [
    ("observatorio", "Observatorio Nacional de la Violencia", "Organiza", "teal",
     "Órgano del Ministerio de la Mujer y Poblaciones Vulnerables (MIMP) encargado de generar información y evidencia sobre la violencia contra las mujeres y los integrantes del grupo familiar. Convoca el Datatón Nacional 2026 y coordina el Comité Organizador."),
    ("unfpa", "UNFPA", "Aliado", "violet",
     "Fondo de Población de las Naciones Unidas. Agencia de la ONU dedicada a la salud sexual y reproductiva y a la igualdad de género; aporta al ciclo de formación especialistas en población, datos y comunicación estratégica basada en evidencia."),
    ("ipsos", "Ipsos", "Aliado", "orange",
     "Empresa global de investigación de mercados y opinión pública. Aporta al ciclo de formación su experiencia en diseño muestral, estadística y análisis multivariado de encuestas."),
    ("qlab", "Q-LAB PUCP", "Aliado", "brand",
     "Laboratorio de investigación aplicada en economía cuantitativa de la Pontificia Universidad Católica del Perú (PUCP). Contribuye con formación en programación y automatización de datos con Python."),
    ("inei", "LabStat · INEI", "Aliado", "pink",
     "Laboratorio de Estadística del Instituto Nacional de Estadística e Informática (INEI). Aporta especialistas en ciencia de datos, visualización avanzada, metadata y agentes de inteligencia artificial aplicados a información pública."),
]
socios_cards = "\n".join(
    f'''        <div class="socio-card accent-{accent}">
          <span class="socio-logo"><img src="images/partners/{slug}.png" alt="{name}" loading="lazy"></span>
          <span class="socio-role">{role}</span>
          <strong>{name}</strong>
          <p>{desc}</p>
        </div>'''
    for slug, name, role, accent, desc in SOCIOS
)
SOCIOS_EYEBROW = "Convenio"
SOCIOS_TITLE = "Socios del Datatón"
SOCIOS_LEDE = "El Datatón Nacional 2026 se hace posible gracias a la articulación entre el Observatorio Nacional (MIMP) y sus aliados del ciclo de formación."

socios_inner = f"""      <div class="socios-grid">
{socios_cards}
      </div>"""

socios_main = page_header(SOCIOS_EYEBROW, SOCIOS_TITLE, SOCIOS_LEDE) + section_wrap(socios_inner)

# ---------------------------------------------------------------------------
# DATOS
# ---------------------------------------------------------------------------
DATOS_EYEBROW = "Insumos"
DATOS_TITLE = "Fuentes de datos recomendadas"
DATOS_LEDE = "De acceso público, abierto y gratuito. No se aceptan propuestas basadas únicamente en análisis descriptivo (tablas, gráficos o mapas sin análisis explicativo)."

datos_inner = """      <div class="source-grid">
        <a class="source-card" href="https://proyectos.inei.gob.pe/endes/" target="_blank" rel="noopener">
          <strong>ENDES</strong><span>Encuesta Demográfica y de Salud Familiar</span>
        </a>
        <a class="source-card" href="https://proyectos.inei.gob.pe/microdatos/Consulta_por_Encuesta.asp" target="_blank" rel="noopener">
          <strong>ENARES</strong><span>Encuesta Nacional sobre Relaciones Sociales · microdatos INEI</span>
        </a>
        <a class="source-card" href="https://portalestadistico.warminan.gob.pe/banco-de-datos/" target="_blank" rel="noopener">
          <strong>Banco de datos · Warmi Ñan</strong><span>Sistema de Gestión de la Información contra la Violencia (SGIC), MIMP</span>
        </a>
        <a class="source-card" href="https://datacrim.inei.gob.pe/" target="_blank" rel="noopener">
          <strong>DataCRIM</strong><span>Estadísticas de criminalidad, INEI</span>
        </a>
        <a class="source-card" href="https://www.gob.pe/institucion/mimp/tema/observatorio-nacional-de-la-violencia-contra-las-mujeres-y-los-integrantes-del-grupo-familiar" target="_blank" rel="noopener">
          <strong>Observatorio Nacional</strong><span>Violencia contra las Mujeres y los Integrantes del Grupo Familiar · MIMP</span>
        </a>
        <a class="source-card" href="https://portal.mpfn.gob.pe/pedmp/index.php/indicador/fiscalias-especializadas/18" target="_blank" rel="noopener">
          <strong>Casos fiscales</strong><span>Indicador de fiscalías especializadas, Ministerio Público</span>
        </a>
        <a class="source-card" href="https://portalestadistico.pj.gob.pe/" target="_blank" rel="noopener">
          <strong>Portal estadístico</strong><span>Poder Judicial</span>
        </a>
        <div class="source-card source-card--muted">
          <strong>Otras fuentes</strong><span>Registros administrativos y datos abiertos complementarios, debidamente citados en APA 7</span>
        </div>
      </div>"""

datos_main = page_header(DATOS_EYEBROW, DATOS_TITLE, DATOS_LEDE) + section_wrap(datos_inner)

# ---------------------------------------------------------------------------
# PARTICIPA
# ---------------------------------------------------------------------------
PARTICIPA_EYEBROW = "Contacto"
PARTICIPA_TITLE = "¿Consultas?"
PARTICIPA_LEDE = "Para dudas técnicas o del proceso, contactar directamente al Comité Organizador del Observatorio Nacional."

participa_inner_full = """      <div>
        <ul class="contact-list">
          <li><span>Correo</span><a href="mailto:observatorioviolencia@mimp.gob.pe">observatorioviolencia@mimp.gob.pe</a></li>
          <li><span>Central telefónica MIMP</span><a href="tel:+51016261600">(01) 626-1600, anexo 8503</a></li>
          <li><span>Bases oficiales</span><a href="https://www.gob.pe/institucion/mimp/campa%C3%B1as/143857-dataton-nacional-concurso-de-soluciones-basadas-en-datos" target="_blank" rel="noopener">gob.pe/mimp — Datatón Nacional</a></li>
        </ul>
      </div>
      <div class="participa-card">
        <span class="mini-label">Periodo de postulación</span>
        <strong>22 jul — 23 ago 2026</strong>
        <p id="inscripcionEstado">—</p>
      </div>"""

participa_main = page_header(PARTICIPA_EYEBROW, PARTICIPA_TITLE, PARTICIPA_LEDE) + section_wrap(participa_inner_full, wrap_class="participa-grid")

PAGES = {
    "index.html": ("Datatón Nacional 2026 · Inicio", "Página informativa y dinámica sobre el Datatón Nacional 2026 del MIMP: cronograma en vivo, ciclo de formación, rúbricas de evaluación, premios y fuentes de datos.", index_main),
    "problema.html": ("El problema · Datatón Nacional 2026", "Cifras oficiales de violencia contra la mujer (ENDES, ENARES) y el modelo ecológico de la violencia.", problema_main),
    "ruta.html": ("La ruta del Datatón · Datatón Nacional 2026", "Cronograma en vivo del Datatón Nacional 2026 del MIMP.", ruta_main),
    "formacion.html": ("Ciclo de formación · Datatón Nacional 2026", "Sesiones del ciclo de formación del Datatón Nacional 2026, con material de clase descargable.", formacion_main),
    "docentes.html": ("Docentes · Datatón Nacional 2026", "Docentes del ciclo de formación del Datatón Nacional 2026.", docentes_main),
    "modulo.html": ("Módulo del ciclo de formación · Datatón Nacional 2026", "Sesiones, material y docentes de un módulo del ciclo de formación del Datatón Nacional 2026.", modulo_main),
    "evaluacion.html": ("Evaluación y rúbricas · Datatón Nacional 2026", "Rúbricas de evaluación del Datatón Nacional 2026 del MIMP.", evaluacion_main),
    "premios.html": ("Premios · Datatón Nacional 2026", "Premios del Datatón Nacional 2026 del MIMP.", premios_main),
    "socios.html": ("Socios · Datatón Nacional 2026", "El Observatorio Nacional del MIMP y sus aliados en el ciclo de formación del Datatón Nacional 2026: UNFPA, Ipsos, Q-LAB PUCP y LabStat-INEI.", socios_main),
    "datos.html": ("Fuentes de datos · Datatón Nacional 2026", "Fuentes de datos recomendadas y perfil de equipos para el Datatón Nacional 2026.", datos_main),
    "participa.html": ("Participa / Contacto · Datatón Nacional 2026", "Contacto y estado de la postulación del Datatón Nacional 2026 del MIMP.", participa_main),
}

for filename, (title, desc, main_html) in PAGES.items():
    html = wrap_page(filename, title, desc, main_html)
    with open(os.path.join(ROOT, filename), "w", encoding="utf-8") as f:
        f.write(html)
    print("wrote", filename)

# ---------------------------------------------------------------------------
# TODO-EN-UNO — versión alterna de una sola página: el mismo contenido de
# arriba, pero todo apilado en un único scroll largo, con el menú superior
# saltando a cada sección por ancla (#problema, #ruta, …) en vez de cambiar
# de archivo. La versión multi-página (esta misma info repartida en varios
# .html, con su propio menú superior de botones) sigue siendo la principal;
# esta es la alternativa "todo en una página" que pidió Alexandra.
# ---------------------------------------------------------------------------
ONEPAGE_NAV = [
    ("problema", "El problema"),
    ("ruta", "La ruta"),
    ("formacion", "Formación"),
    ("docentes", "Docentes"),
    ("evaluacion", "Evaluación"),
    ("premios", "Premios"),
    ("socios", "Socios"),
    ("datos", "Fuentes de datos"),
]

def build_onepage_header():
    links = "\n".join(f'      <a href="#{anchor}">{label}</a>' for anchor, label in ONEPAGE_NAV)
    return f"""<header class="site-header" id="top">
  <div class="wrap header-inner">
    <div class="brand">
      <a class="brand-mark" href="#top" aria-label="Inicio del Datatón Nacional">DN</a>
      <span class="brand-text">
        <a class="brand-home" href="#top">Datatón Nacional</a>
        <a class="brand-observatorio" href="https://www.gob.pe/institucion/mimp/tema/observatorio-nacional-de-la-violencia-contra-las-mujeres-y-los-integrantes-del-grupo-familiar" target="_blank" rel="noopener">2026 · Observatorio Nacional MIMP · todo en una página</a>
      </span>
    </div>
    <button class="nav-toggle" id="navToggle" aria-label="Abrir menú" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <nav class="site-nav" id="siteNav">
{links}
      <a href="#participa" class="nav-cta">Participa</a>
    </nav>
  </div>
</header>
"""

onepage_main = hero_home(
    '<a href="index.html" class="hero-alt-link">Prefieres verlo como varias páginas →</a>',
    "",
) + (
    onepage_section("problema", PROBLEMA_EYEBROW, PROBLEMA_TITLE, PROBLEMA_LEDE, problema_inner)
    + onepage_section("ruta", RUTA_EYEBROW, RUTA_TITLE, RUTA_LEDE, ruta_inner)
    + onepage_section("formacion", FORMACION_EYEBROW, FORMACION_TITLE, FORMACION_LEDE, formacion_inner)
    + onepage_section("docentes", DOCENTES_EYEBROW, DOCENTES_TITLE, DOCENTES_LEDE, docentes_inner)
    + onepage_section("evaluacion", EVALUACION_EYEBROW, EVALUACION_TITLE, EVALUACION_LEDE, evaluacion_inner)
    + onepage_section("premios", PREMIOS_EYEBROW, PREMIOS_TITLE, PREMIOS_LEDE, premios_inner)
    + onepage_section("socios", SOCIOS_EYEBROW, SOCIOS_TITLE, SOCIOS_LEDE, socios_inner)
    + onepage_section("datos", DATOS_EYEBROW, DATOS_TITLE, DATOS_LEDE, datos_inner)
    + onepage_section("participa", PARTICIPA_EYEBROW, PARTICIPA_TITLE, PARTICIPA_LEDE, participa_inner_full, wrap_class="participa-grid")
)

onepage_html = (
    HEAD.format(
        title="Datatón Nacional 2026 · Todo en una página",
        description="Versión de una sola página del Datatón Nacional 2026 del MIMP: el problema, la ruta, formación, docentes, evaluación, premios, socios y fuentes de datos, todo en un mismo scroll.",
    )
    + build_onepage_header()
    + "\n<main>\n"
    + onepage_main
    + "\n</main>\n\n"
    + FOOTER
)
with open(os.path.join(ROOT, "todo-en-uno.html"), "w", encoding="utf-8") as f:
    f.write(onepage_html)
print("wrote todo-en-uno.html")

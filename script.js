// =========================================================
// Datatón Nacional 2026 — recurso informativo (no oficial)
// Este mismo script.js se carga en TODAS las páginas del sitio.
// Cada bloque revisa primero si el elemento que necesita existe
// en la página actual antes de tocarlo, así no truena en las
// páginas que no tienen esa sección.
// Todas las fechas provienen de las Bases oficiales del
// concurso y de la sumilla del Ciclo de Formación (MIMP).
// =========================================================

const TODAY = new Date();

/* ---------- 1. Cronograma general (Tabla 05 de las Bases) ---------- */
const CRONOGRAMA = [
  { label: "Lanzamiento de la convocatoria", start: "2026-07-22", end: "2026-07-22" },
  { label: "Periodo de postulación", start: "2026-07-22", end: "2026-08-23" },
  { label: "Anuncio de equipos seleccionados", start: "2026-09-01", end: "2026-09-01" },
  { label: "Ciclo de formación", start: "2026-09-07", end: "2026-10-02" },
  { label: "Entrega final de la infografía", start: "2026-10-21", end: "2026-10-21" },
  { label: "Anuncio de equipos ganadores", start: "2026-11-09", end: "2026-11-13" },
  { label: "Ceremonia de premiación", start: "2026-11-16", end: "2026-11-20" },
];

function parseDate(d) { return new Date(d + "T00:00:00"); }
function fmtDate(d) {
  return parseDate(d).toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" });
}
function fmtRange(start, end) {
  if (start === end) return fmtDate(start);
  const s = parseDate(start), e = parseDate(end);
  const sameMonth = s.getMonth() === e.getMonth();
  const startStr = s.toLocaleDateString("es-PE", { day: "2-digit", month: sameMonth ? undefined : "long" });
  return `${startStr} — ${fmtDate(end)}`;
}
function statusOf(item) {
  const s = parseDate(item.start), e = parseDate(item.end);
  e.setHours(23, 59, 59, 999);
  if (TODAY > e) return "done";
  if (TODAY >= s && TODAY <= e) return "active";
  return "upcoming";
}

// Se calcula siempre (es barato y no toca el DOM) porque varias páginas
// distintas lo necesitan: la home (panel de progreso) y ruta.html (línea de tiempo).
let currentPhase = null, nextPhase = null;
CRONOGRAMA.forEach((item) => {
  const status = statusOf(item);
  if (status === "active") currentPhase = item;
  if (status === "upcoming" && !nextPhase) nextPhase = item;
});

/* ---------- 2. Línea de tiempo completa (solo existe en ruta.html) ---------- */
const timelineEl = document.getElementById("timeline");
if (timelineEl) {
  CRONOGRAMA.forEach((item) => {
    const status = statusOf(item);
    const li = document.createElement("li");
    li.className = `tl-item ${status}`;
    const badgeText = status === "done" ? "Completado" : status === "active" ? "En curso" : "Próximo";
    li.innerHTML = `
      <div class="tl-head">
        <strong>${item.label}</strong>
        <span class="tl-badge">${badgeText}</span>
      </div>
      <div class="tl-date">${fmtRange(item.start, item.end)}</div>
    `;
    timelineEl.appendChild(li);
  });
}

/* ---------- 3. Estado hero + barra de progreso (solo existe en index.html) ---------- */
const heroStatusText = document.getElementById("heroStatusText");
if (heroStatusText) {
  const progressFill = document.getElementById("progressFill");
  const progressPct = document.getElementById("progressPct");
  const panelMini = document.getElementById("panelMini");
  const nextMilestoneEl = document.getElementById("nextMilestone");
  const nextMilestoneDateEl = document.getElementById("nextMilestoneDate");

  const concursoStart = parseDate(CRONOGRAMA[0].start);
  const concursoEnd = parseDate(CRONOGRAMA[CRONOGRAMA.length - 1].end);
  const totalSpan = concursoEnd - concursoStart;
  const elapsed = Math.min(Math.max(TODAY - concursoStart, 0), totalSpan);
  const pct = Math.round((elapsed / totalSpan) * 100);

  if (progressFill) setTimeout(() => (progressFill.style.width = pct + "%"), 200);
  if (progressPct) progressPct.textContent = pct + "%";

  if (currentPhase) {
    heroStatusText.textContent = `Fase actual: ${currentPhase.label} (hasta ${fmtDate(currentPhase.end)})`;
    if (panelMini) panelMini.textContent = `Estamos dentro de: ${currentPhase.label}`;
  } else if (TODAY < concursoStart) {
    heroStatusText.textContent = "El Datatón aún no inicia.";
    if (panelMini) panelMini.textContent = "Convocatoria por lanzarse.";
  } else {
    heroStatusText.textContent = "El Datatón 2026 ha concluido su cronograma.";
    if (panelMini) panelMini.textContent = "Revisa el repositorio del Observatorio Nacional.";
  }

  if (nextMilestoneEl && nextMilestoneDateEl) {
    if (nextPhase) {
      const days = Math.ceil((parseDate(nextPhase.start) - TODAY) / 86400000);
      nextMilestoneEl.textContent = nextPhase.label;
      nextMilestoneDateEl.textContent = days > 0
        ? `${fmtDate(nextPhase.start)} · faltan ${days} día${days === 1 ? "" : "s"}`
        : `${fmtDate(nextPhase.start)} · en curso`;
    } else {
      nextMilestoneEl.textContent = "Ceremonia de premiación";
      nextMilestoneDateEl.textContent = fmtRange(CRONOGRAMA.at(-1).start, CRONOGRAMA.at(-1).end);
    }
  }
}

/* ---------- 4. Estado de inscripción (solo existe en participa.html) ---------- */
const inscripcionEstado = document.getElementById("inscripcionEstado");
if (inscripcionEstado) {
  const postulacion = CRONOGRAMA[1];
  const postulacionStatus = statusOf(postulacion);
  inscripcionEstado.textContent =
    postulacionStatus === "done"
      ? "Periodo de postulación cerrado. El formulario ya no admite nuevos equipos."
      : postulacionStatus === "active"
      ? "¡Postulación abierta! Ingresa al formulario en las bases oficiales."
      : "La postulación todavía no se habilita.";
}

/* ---------- 5. Ciclo de formación: sesiones reales (solo en formacion.html) ---------- */
// Enlaces directos a los cuatro archivos MP4 facilitados para estas sesiones.
const GRABACIONES = {
  "M1|2026-09-07": "https://drive.mimp.gob.pe/s/Jd4xyNjHwBDBYP6/download?path=%2FModulo%201%2F07%20set%202026&files=Sesi%C3%B3n1-07.09.2026.mp4",
  "M1|2026-09-09": "https://drive.mimp.gob.pe/s/Jd4xyNjHwBDBYP6/download?path=%2FModulo%201%2F09%20set%202026&files=Sesi%C3%B3n2-09.09.2026.mp4",
  "M2|2026-09-11": "https://drive.mimp.gob.pe/s/Jd4xyNjHwBDBYP6/download?path=%2FModulo%202%2F11%20set%202026&files=Sesi%C3%B3n3-11.09.2026.mp4",
  "M2|2026-09-14": "https://drive.mimp.gob.pe/s/Jd4xyNjHwBDBYP6/download?path=%2FModulo%202%2F14%20set%202026&files=Sesi%C3%B3n4-14.09.2026.mp4",
};

const SESIONES = [
  { mod: "M1", modName: "Fundamentos y problemática", date: "2026-09-07", time: "3:00–4:30 pm", topic: "Violencia contra las mujeres en el Perú: desafíos bajo la Ley N° 30364", inst: "MIMP · Kaarina Valer Jaime", fmt: "Virtual",
    materials: [{ label: "Presentación MIMP-DPVLV", href: "material/modulo-1/2026-09-07/ppts/Presentacion-MIMP-DPVLV.pdf", type: "ppt" }],
  },
  { mod: "M1", modName: "Fundamentos y problemática", date: "2026-09-07", time: "4:30–6:00 pm", topic: "Enfoque de DDHH, territorial e interseccional en el dato público", inst: "UNFPA · Sebastián García", fmt: "Virtual",
    materials: [{ label: "Presentación UNFPA", href: "material/modulo-1/2026-09-07/ppts/Presentacion-UNFPA.pdf", type: "ppt" }],
  },
  { mod: "M1", modName: "Fundamentos y problemática", date: "2026-09-09", time: "4:00–7:00 pm", topic: "Gestión de la información e intervención: Observatorio Nacional y Programa Warmi Ñan", inst: "MIMP · Orlando Angulo / Yubel Salazar", fmt: "Virtual",
    materials: [
      { label: "Gestión de la Información - Datatón Nacional", href: "material/modulo-1/2026-09-09/ppts/Gestion-Informacion-Datathon-Nacional.pdf", type: "ppt" },
      { label: "Presentación SGIC · Warmi Ñan", href: "material/modulo-1/2026-09-09/ppts/Presentacion-SGIC-Warmi-Nan.pdf", type: "ppt" },
    ],
  },
  { mod: "M2", modName: "Procesamiento y automatización", date: "2026-09-11", time: "6:00–8:00 pm", topic: "Python I: manipulación de microdatos y limpieza con Pandas y Numpy", inst: "Alfonso Rodríguez", fmt: "Virtual",
    materials: [
      { label: "Presentación: Python I", href: "material/modulo-2/2026-09-11/ppts/Presentacion-01-Python-Alfonso.pdf", type: "ppt" },
      { label: "Notebook: sesión 1 (ENAHO)", href: "material/modulo-2/2026-09-11/insumos/notebooks/01_sesion_1_estudiantes_enaho.ipynb", type: "insumo" },
      { label: "Script: crear extractos ENAHO", href: "material/modulo-2/2026-09-11/insumos/scripts/crear_extractos_enaho.py", type: "insumo" },
      { label: "Datos: enaho_2023_200_clase.csv", href: "material/modulo-2/2026-09-11/insumos/data/enaho_2023_200_clase.csv", type: "insumo" },
      { label: "Datos: enaho_2023_300_clase.csv", href: "material/modulo-2/2026-09-11/insumos/data/enaho_2023_300_clase.csv", type: "insumo" },
      { label: "Datos: enaho_2023_500_clase.csv", href: "material/modulo-2/2026-09-11/insumos/data/enaho_2023_500_clase.csv", type: "insumo" },
      { label: "README del dataset", href: "material/modulo-2/2026-09-11/insumos/data/README.md", type: "insumo" },
    ],
  },
  { mod: "M2", modName: "Procesamiento y automatización", date: "2026-09-14", time: "6:00–8:00 pm", topic: "Webscraping: extracción de datos de portales oficiales", inst: "Alfonso Rodríguez", fmt: "Virtual" },
  { mod: "M2", modName: "Procesamiento y automatización", date: "2026-09-16", time: "6:00–8:00 pm", topic: "IA-Coworking: optimización de código con Codex y Claude", inst: "Alfonso Rodríguez", fmt: "Virtual" },
  { mod: "M3", modName: "Análisis cuantitativo y muestreo", date: "2026-09-18", time: "4:00–6:00 pm", topic: "Muestreo y representatividad", inst: "IPSOS · Luis Sánchez", fmt: "Virtual" },
  { mod: "M3", modName: "Análisis cuantitativo y muestreo", date: "2026-09-24", time: "4:00–7:00 pm", topic: "Análisis multivariado: regresión logística, ACM y conglomerados", inst: "IPSOS · Luis Sánchez", fmt: "Virtual" },
  { mod: "M3", modName: "Análisis cuantitativo y muestreo", date: "2026-09-25", time: "4:00–7:00 pm", topic: "Visualización avanzada: introducción a grafos y GIS", inst: "LabStat-INEI · Axel Pereda / Rodrigo Rivarola", fmt: "Virtual" },
  { mod: "M4", modName: "Charla magistral", date: "2026-09-28", time: "3:00–6:00 pm", topic: "Metadata y agentes: información que guía, agentes que actúan", inst: "LabStat-INEI · Luna / Chávez / Clavijo", fmt: "Híbrido" },
  { mod: "M5", modName: "Visualización y comunicación", date: "2026-09-29", time: "3:00–4:30 pm", topic: "Diseño de infografías de alto impacto y narrativas de datos", inst: "IPSOS · Lucía Wiener", fmt: "Virtual" },
  { mod: "M5", modName: "Visualización y comunicación", date: "2026-09-29", time: "4:30–6:00 pm", topic: "Comunicación estratégica basada en datos", inst: "UNFPA · Renato Zeballos", fmt: "Virtual" },
  { mod: "M5", modName: "Visualización y comunicación", date: "2026-10-02", time: "3:00–7:00 pm", topic: "Laboratorio de soluciones: del dato a la política pública", inst: "MIMP · Comité Organizador", fmt: "Virtual" },
];

// Arma el HTML de materiales de una sesión, agrupados en "PPTs" e
// "Insumos" (notebooks, scripts, datos, README) — y el link a la
// grabación disponible, solo para sesiones ya dictadas.
function renderSessionMaterials(s, isPast) {
  const parts = [];
  if (s.materials && s.materials.length) {
    const ppts = s.materials.filter((m) => m.type !== "insumo");
    const insumos = s.materials.filter((m) => m.type === "insumo");
    if (ppts.length) {
      parts.push(
        `<div class="sched-mat-group"><span class="sched-mat-label">PPTs</span>${ppts
          .map((m) => `<a href="${m.href}" target="_blank" rel="noopener">📄 ${m.label}</a>`)
          .join("")}</div>`
      );
    }
    if (insumos.length) {
      parts.push(
        `<div class="sched-mat-group"><span class="sched-mat-label">Insumos</span>${insumos
          .map((m) => `<a href="${m.href}" target="_blank" rel="noopener">🗂️ ${m.label}</a>`)
          .join("")}</div>`
      );
    }
  }
  const recording = GRABACIONES[`${s.mod}|${s.date}`];
  if (recording && isPast) {
    parts.push(
      `<div class="sched-mat-group"><span class="sched-mat-label">Grabación</span><button type="button" class="recording-link" data-recording="${s.mod}|${s.date}">▶ Ver grabación</button></div>`
    );
  }
  return parts.join("");
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-recording]");
  if (!trigger) return;
  const url = GRABACIONES[trigger.dataset.recording];
  if (!url) return;
  const overlay = document.createElement("div");
  overlay.className = "recording-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", "Grabación de la sesión");
  overlay.innerHTML = `
    <div class="recording-panel">
      <button class="recording-close" type="button" aria-label="Cerrar grabación">×</button>
      <h2>Grabación de la sesión</h2>
      <video controls preload="metadata" playsinline src="${url.replaceAll("&", "&amp;")}"></video>
      <a href="${url.replaceAll("&", "&amp;")}" target="_blank" rel="noopener">Descargar video</a>
    </div>`;
  const close = () => { overlay.querySelector("video").pause(); overlay.remove(); trigger.focus(); document.removeEventListener("keydown", onKey); };
  const onKey = (e) => { if (e.key === "Escape") close(); };
  overlay.querySelector(".recording-close").addEventListener("click", close);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  document.addEventListener("keydown", onKey);
  document.body.appendChild(overlay);
  overlay.querySelector(".recording-close").focus();
});

const scheduleEl = document.getElementById("schedule");
const filterEl = document.getElementById("moduleFilter");
if (scheduleEl && filterEl) {
  const modules = ["Todos", ...new Set(SESIONES.map((s) => s.mod))];

  function renderSchedule(filter) {
    scheduleEl.innerHTML = "";
    SESIONES.filter((s) => filter === "Todos" || s.mod === filter).forEach((s) => {
      const isPast = parseDate(s.date) < new Date(TODAY.toDateString());
      const item = document.createElement("div");
      item.className = "sched-item";

      const row = document.createElement("div");
      row.className = "sched-row" + (isPast ? " is-past" : "");
      row.innerHTML = `
        <div class="sched-date">${parseDate(s.date).toLocaleDateString("es-PE", { day: "2-digit", month: "short" })}<br><small>${s.time}</small></div>
        <div class="sched-topic"><strong>${s.topic}</strong><small>${s.mod} · ${s.modName}</small></div>
        <div class="sched-inst">${s.inst}</div>
        <div class="sched-fmt ${s.fmt === "Híbrido" ? "hib" : ""}">${s.fmt}</div>
      `;
      item.appendChild(row);

      const matsHtml = renderSessionMaterials(s, isPast);
      if (matsHtml) {
        const mats = document.createElement("div");
        mats.className = "sched-materials";
        mats.innerHTML = matsHtml;
        item.appendChild(mats);
      }

      scheduleEl.appendChild(item);
    });
  }

  modules.forEach((m) => {
    const btn = document.createElement("button");
    btn.textContent = m === "Todos" ? "Todos los módulos" : m;
    if (m === "Todos") btn.classList.add("is-active");
    btn.addEventListener("click", () => {
      filterEl.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      renderSchedule(m);
    });
    filterEl.appendChild(btn);
  });
  renderSchedule("Todos");
}

/* ---------- 5b. Docentes: datos y tarjetas compartidas ---------- */
// Se define a nivel superior (no dentro de un "if") porque tanto
// docentes.html como modulo.html necesitan esta misma lista y las mismas
// funciones para armar sus tarjetas. Solo se incluye biografía completa de
// quienes la enviaron; el resto se muestra con nombre, institución y módulo
// tal como figuran en la sumilla, sin inventar credenciales. Las sesiones
// que aparecen al voltear la tarjeta salen del mismo array SESIONES de
// arriba: no es información nueva, es la que ya teníamos, mostrada de forma útil.
// Orden: por entidad (MIMP -que organiza- primero, luego UNFPA, Ipsos,
// LabStat-INEI e Invitado), tal como pidió el equipo — y ese mismo orden se
// mantiene al filtrar por módulo, porque renderTeacherCards solo filtra
// (nunca reordena) este array. Sumillas condensadas a partir del documento
// oficial "Sumilla ponentes" que envió el equipo — no se inventa nada de
// quien no mandó su sumilla (Kaarina queda sin bio por ahora).
const DOCENTES = [
  // — MIMP —
  { name: "Kaarina Valer Jaime", mod: "M1", org: "MIMP" },
  {
    name: "Orlando Angulo", mod: "M1", org: "MIMP",
    role: "Especialista estadístico, Observatorio Nacional",
    bio: "Licenciado en Estadística (UNMSM) y egresado de la maestría en Gestión Pública (Universidad César Vallejo). Tiene más de 10 años de experiencia en análisis de datos y gestión de información. En el Observatorio Nacional trabaja con datos sobre violencia en el marco de la Ley N.º 30364 para apoyar la toma de decisiones.",
  },
  {
    name: "Yubel Salazar Ríos", mod: "M1", org: "MIMP",
    role: "Programa Nacional Warmi Ñan",
    bio: "Ingeniera Estadística e Informática con más de 10 años en gestión de información pública. Especialista del Programa Nacional Warmi Ñan (MIMP), a cargo de la data de sus registros de prevención.",
  },
  // — UNFPA —
  {
    name: "Sebastián García Acosta", mod: "M1", org: "UNFPA",
    role: "Oficial de Población y Datos, UNFPA",
    bio: "Politólogo con maestría en Acción Humanitaria (SOAS) y más de 10 años en análisis de datos y políticas públicas. Oficial de Población y Gestión de Datos en UNFPA Perú.",
  },
  {
    name: "Renato Zeballos", mod: "M5", org: "UNFPA",
    role: "Oficial de Comunicaciones, UNFPA",
    bio: "Administrador de empresas, MBA y especialista en Data Storytelling (University of Chicago). Oficial de Comunicaciones de UNFPA Perú, lidera productos de comunicación basados en evidencia.",
  },
  // — Ipsos —
  {
    name: "Luis Sánchez", mod: "M3", org: "IPSOS",
    role: "Dir. de Estadística y Muestreo, Ipsos",
    bio: "Ingeniero Estadístico con maestrías en Big Data y en Marketing. Más de 15 años en investigación de mercados; Director de Estadística y Muestreo de Ipsos Perú.",
  },
  {
    name: "Lucía Wiener", mod: "M5", org: "IPSOS",
    role: "Directora de Proyectos, Ipsos",
    bio: "Socióloga y magíster en Estadística (PUCP), con más de 15 años en investigación cuantitativa. Directora de Proyectos de Ipsos Perú.",
  },
  // — LabStat-INEI —
  {
    name: "Axel Pereda Escalante", mod: "M3", org: "LabStat-INEI",
    role: "Científico de datos, LabStat-INEI",
    bio: "Bachiller en Matemáticas, cursa la maestría en IA y Data Science (UTEC). Científico de datos en LabStat-INEI, especializado en análisis geoespacial y grafos.",
  },
  {
    name: "Rodrigo Rivarola Monzón", mod: "M3", org: "LabStat-INEI",
    role: "Lead Data Scientist, LabStat-INEI",
    bio: "Economista (PUCP) y magíster en Análisis Computacional y Políticas Públicas (Universidad de Chicago). Lead Data Scientist en LabStat-INEI.",
  },
  {
    name: "Marisol Luna Carrera", mod: "M4", org: "LabStat-INEI",
    role: "Científica de datos, LabStat-INEI",
    bio: "Economista (UNALM), egresada del programa Ciencia del Dato del INEI. Científica de datos en LabStat-INEI, lidera la adaptación del estándar SDMX.",
  },
  {
    name: "Marcelo Chávez Cisneros", mod: "M4", org: "LabStat-INEI",
    role: "Científico de datos, LabStat-INEI",
    bio: "Economista (PUCP) con diplomado en IA Generativa y MLOps. Científico de datos en LabStat-INEI, lidera proyectos de agentes inteligentes y gobernanza de datos.",
  },
  {
    name: "Andrés Clavijo Abril", mod: "M4", org: "LabStat-INEI",
    role: "Coordinador, LabStat-INEI",
    bio: "Economista, cofundador de Sciphage y Aignos. Consultor del INEI, donde impulsa el Laboratorio de Estadística (LabStat); ha asesorado a la CEPAL y al BID.",
  },
  // — Q-LAB PUCP —
  {
    name: "Alfonso Rodríguez", mod: "M2", org: "Q-LAB PUCP",
    role: "Jefe del Q-LAB, PUCP",
    bio: "Máster en Economía Cuantitativa (NYU) y economista (PUCP), con más de 10 años en investigación aplicada y econometría. Jefe del Q-LAB (PUCP) y consultor de datos económicos para el BID; también ha asesorado al Banco Mundial y a CONCYTEC.",
  },
];

const DOCENTE_FOTOS = {
  "Orlando Angulo": "images/docentes/orlando-angulo.jpg",
  "Alfonso Rodríguez": "images/docentes/alfonso-rodriguez.jpg",
  "Andrés Clavijo Abril": "images/docentes/andres-clavijo.jpg",
  "Axel Pereda Escalante": "images/docentes/axel-pereda.jpg",
  "Lucía Wiener": "images/docentes/lucia-wiener.jpg",
  "Luis Sánchez": "images/docentes/luis-sanchez.jpg",
  "Marcelo Chávez Cisneros": "images/docentes/marcelo-chavez.jpg",
  "Marisol Luna Carrera": "images/docentes/marisol-luna.jpg",
  "Renato Zeballos": "images/docentes/renato-zeballos.jpg",
  "Rodrigo Rivarola Monzón": "images/docentes/rodrigo-rivarola.jpg",
  "Sebastián García Acosta": "images/docentes/sebastian-garcia.jpg",
  "Yubel Salazar Ríos": "images/docentes/yubel-salazar.jpg",
};
DOCENTES.forEach((d) => { d.photo = DOCENTE_FOTOS[d.name]; });

const initials = (name) => name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const orgKey = (org) => {
  if (org.includes("MIMP")) return "mimp";
  if (org.includes("UNFPA")) return "unfpa";
  if (org.includes("IPSOS")) return "ipsos";
  if (org.includes("Q-LAB")) return "qlab";
  if (org.includes("LabStat")) return "labstat";
  return "invitado";
};

// Orden fijo de secciones para agrupar docentes por entidad (el que pidió
// el equipo): MIMP -que organiza- primero, luego UNFPA, Ipsos, Q-LAB y
// LabStat-INEI.
const ORG_SECTIONS = [
  { key: "mimp", label: "Observatorio Nacional de la Violencia contra las Mujeres y los Integrantes del Grupo Familiar" },
  { key: "unfpa", label: "UNFPA" },
  { key: "ipsos", label: "Ipsos" },
  { key: "qlab", label: "Q-LAB PUCP" },
  { key: "labstat", label: "LabStat-INEI" },
  { key: "invitado", label: "Otros ponentes" },
];

// Cruza el nombre del docente con el campo "inst" de SESIONES para armar
// su lista real de sesiones (tema, fecha, hora) sin inventar nada nuevo.
const sessionsFor = (name) =>
  SESIONES.filter((s) => {
    const namePart = s.inst.includes("·") ? s.inst.split("·").slice(1).join("·") : s.inst;
    return namePart
      .split("/")
      .map((n) => n.trim())
      .some((token) => name.includes(token) || token.includes(name));
  });

function teacherCardHTML(d) {
  const accent = { mimp: "teal", unfpa: "violet", ipsos: "orange", qlab: "brand", labstat: "pink", invitado: "brand" }[orgKey(d.org)];
  const sesiones = sessionsFor(d.name);
  const sesionesRows = sesiones
    .map(
      (s) => `
        <div class="teacher-session-row">
          <span>${s.topic}</span>
          <span>${parseDate(s.date).toLocaleDateString("es-PE", { day: "2-digit", month: "short" })} · ${s.time}</span>
        </div>`
    )
    .join("");

  // Todas las tarjetas comparten el mismo tamaño y estructura (para que
  // ninguna se sienta "más importante" que otra): al frente, nombre +
  // institución + cargo (si lo tenemos); al voltear, la sumilla breve
  // (si la tenemos) y sus sesiones dentro del datatón.
  return `
    <div class="teacher-card teacher-card--flip accent-${accent}" data-mod="${d.mod}" tabindex="0" role="button" aria-pressed="false">
      <div class="teacher-card-inner">
        <div class="teacher-face teacher-face--front">
          <div class="teacher-avatar teacher-avatar--sm">${d.photo ? `<img src="${d.photo}" alt="${d.name}" loading="lazy">` : initials(d.name)}</div>
          <div>
            <strong>${d.name}</strong>
            <span class="teacher-org">${d.org} · ${d.mod}</span>
            ${d.role ? `<p class="teacher-key">${d.role}</p>` : ""}
          </div>
        </div>
        <div class="teacher-face teacher-face--back">
          <span class="teacher-org">${d.org} · ${d.mod}</span>
          ${d.bio ? `<p class="teacher-summary">${d.bio}</p>` : ""}
          ${sesiones.length ? `<div class="teacher-sessions">${sesionesRows}</div>` : (d.bio ? "" : '<p class="teacher-summary">Aún no tenemos su sesión registrada.</p>')}
        </div>
      </div>
    </div>`;
}

function renderTeacherCards(filterMod, grouped = true) {
  const list = DOCENTES.filter((d) => filterMod === "Todos" || d.mod === filterMod);
  if (!grouped) return list.map(teacherCardHTML).join("");

  return ORG_SECTIONS.map(({ key, label }) => {
    const docentes = list.filter((d) => orgKey(d.org) === key);
    if (!docentes.length) return "";
    return `
      <div class="teacher-org-section">
        <h3 class="teacher-org-title">${label}</h3>
        <div class="teacher-org-grid">${docentes.map(teacherCardHTML).join("")}</div>
      </div>`;
  }).join("");
}

function bindTeacherCards(container) {
  container.querySelectorAll(".teacher-card").forEach((card) => {
    const toggle = () => {
      const open = card.classList.toggle("is-open");
      card.setAttribute("aria-expanded", open ? "true" : "false");
    };
    card.addEventListener("click", toggle);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  });
}

/* ---------- 5c. Página Docentes (solo en docentes.html) ---------- */
const teacherGrid = document.getElementById("teacherGrid");
if (teacherGrid) {
  const teacherStatsEl = document.getElementById("teacherStats");
  if (teacherStatsEl) {
    const orgs = new Set(DOCENTES.map((d) => orgKey(d.org)));
    const mods = new Set(DOCENTES.map((d) => d.mod));
    teacherStatsEl.innerHTML = `
      <div class="t-stat"><b>${DOCENTES.length}</b><span>Docentes</span></div>
      <div class="t-stat"><b>${orgs.size}</b><span>Instituciones</span></div>
      <div class="t-stat"><b>${mods.size}</b><span>Módulos</span></div>
    `;
  }

  function renderTeachers(filter) {
    teacherGrid.innerHTML = renderTeacherCards(filter);
    bindTeacherCards(teacherGrid);
  }

  const teacherFilterEl = document.getElementById("teacherFilter");
  if (teacherFilterEl) {
    const modList = [...new Set(DOCENTES.map((d) => d.mod))].sort((a, b) => a.localeCompare(b));
    const mods = ["Todos", ...modList];
    mods.forEach((m) => {
      const btn = document.createElement("button");
      btn.textContent = m === "Todos" ? "Todos" : m;
      if (m === "Todos") btn.classList.add("is-active");
      btn.addEventListener("click", () => {
        teacherFilterEl.querySelectorAll("button").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        renderTeachers(m);
      });
      teacherFilterEl.appendChild(btn);
    });
  }
  renderTeachers("Todos");
}

/* ---------- 5d. Página de un módulo individual (solo en modulo.html) ---------- */
// Lee ?mod=M1..M5 de la URL y arma, para ese módulo: de qué trata (síntesis
// de sus temas reales), sus sesiones con material descargable, y sus
// docentes — reutilizando exactamente los mismos datos y tarjetas de arriba.
const moduloTitleEl = document.getElementById("moduloTitle");
if (moduloTitleEl) {
  const INFO_MODULOS = {
    M1: { name: "Fundamentos y problemática", range: "07–09 set.", desc: "Marco legal, enfoque de derechos humanos y los sistemas oficiales de información sobre violencia contra las mujeres." },
    M2: { name: "Procesamiento y automatización", range: "11–16 set.", desc: "Manipulación y limpieza de microdatos, extracción de datos web y uso de IA para optimizar código, con Python." },
    M3: { name: "Análisis cuantitativo y muestreo", range: "18–25 set.", desc: "Diseño muestral, análisis multivariado y visualización avanzada de datos (grafos y mapas)." },
    M4: { name: "Charla magistral", range: "28 set.", desc: "Charla magistral sobre gestión de metadata y agentes de IA aplicados a la información pública." },
    M5: { name: "Visualización y comunicación", range: "29 set.–02 oct.", desc: "Diseño de infografías de alto impacto, comunicación estratégica y el laboratorio final de soluciones." },
  };

  const moduloEyebrowEl = document.getElementById("moduloEyebrow");
  const moduloLedeEl = document.getElementById("moduloLede");
  const moduloStatsEl = document.getElementById("moduloStats");
  const moduloSessionsEl = document.getElementById("moduloSessions");
  const moduloTeachersEl = document.getElementById("moduloTeachers");

  const mod = new URLSearchParams(location.search).get("mod");
  const info = INFO_MODULOS[mod];

  if (!info) {
    moduloTitleEl.textContent = "Módulo no encontrado";
    if (moduloLedeEl) moduloLedeEl.textContent = "Revisa el enlace o vuelve al inicio para elegir un módulo del ciclo de formación.";
    if (moduloEyebrowEl) moduloEyebrowEl.textContent = "MÓDULO";
  } else {
    if (moduloEyebrowEl) moduloEyebrowEl.textContent = mod;
    moduloTitleEl.textContent = `${mod} · ${info.name}`;
    if (moduloLedeEl) moduloLedeEl.textContent = info.desc;

    const sesiones = SESIONES.filter((s) => s.mod === mod);

    if (moduloStatsEl) {
      moduloStatsEl.innerHTML = `
        <div class="t-stat"><b>${sesiones.length}</b><span>${sesiones.length === 1 ? "Sesión" : "Sesiones"}</span></div>
        <div class="t-stat"><b>${info.range}</b><span>Fechas</span></div>
      `;
    }

    if (moduloSessionsEl) {
      sesiones.forEach((s) => {
        const isPast = parseDate(s.date) < new Date(TODAY.toDateString());
        const item = document.createElement("div");
        item.className = "sched-item";
        const row = document.createElement("div");
        row.className = "sched-row" + (isPast ? " is-past" : "");
        row.innerHTML = `
          <div class="sched-date">${parseDate(s.date).toLocaleDateString("es-PE", { day: "2-digit", month: "short" })}<br><small>${s.time}</small></div>
          <div class="sched-topic"><strong>${s.topic}</strong><small>${s.mod} · ${s.modName}</small></div>
          <div class="sched-inst">${s.inst}</div>
          <div class="sched-fmt ${s.fmt === "Híbrido" ? "hib" : ""}">${s.fmt}</div>
        `;
        item.appendChild(row);
        const matsHtml = renderSessionMaterials(s, isPast);
        if (matsHtml) {
          const mats = document.createElement("div");
          mats.className = "sched-materials";
          mats.innerHTML = matsHtml;
          item.appendChild(mats);
        } else {
          const pending = document.createElement("p");
          pending.className = "fine-print";
          pending.textContent = "Material pendiente de subir tras esta sesión.";
          item.appendChild(pending);
        }
        moduloSessionsEl.appendChild(item);
      });
    }

    if (moduloTeachersEl) {
      moduloTeachersEl.innerHTML = renderTeacherCards(mod, false);
      bindTeacherCards(moduloTeachersEl);
    }
  }
}

/* ---------- 6. Contadores animados (solo si hay .stat-number en la página) ---------- */
const counters = document.querySelectorAll(".stat-number");
if (counters.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const duration = 900;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / duration, 1);
          const val = (target * p).toFixed(1);
          el.textContent = val + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterObserver.observe(c));
}

/* ---------- 7. Gráficos SVG (solo en evaluacion.html) ---------- */
const TEAL = "#0e7490", ORANGE = "#f97316", VIOLET = "#7c3aed";

function renderBarChartTri(el, items) {
  const palette = [TEAL, VIOLET, ORANGE];
  const max = Math.max(...items.map((i) => i.value)) * 1.15;
  el.innerHTML = items
    .map((item, idx) => {
      const pct = (item.value / max) * 100;
      const color = palette[idx % palette.length];
      return `
      <div class="bar-row">
        <span class="bar-label">${item.label}</span>
        <div class="bar-track">
          <div class="bar-fill" style="--target:${pct}%; background:${color}"></div>
        </div>
        <span class="bar-value">${item.value}</span>
      </div>`;
    })
    .join("");
}

// Una sola barra apilada (= 70 pts del proyecto final) dividida en tramos
// proporcionales a cada criterio de la rúbrica — más claro que 6 barras
// sueltas para transmitir "así se reparten los 70 puntos".
function renderRubricStack(el, items) {
  const palette = [TEAL, VIOLET, ORANGE, "#ec4899", "#0891b2", "#a78bfa"];
  const total = items.reduce((s, i) => s + i.value, 0);
  const segments = items
    .map((item, idx) => {
      const pct = (item.value / total) * 100;
      const color = palette[idx % palette.length];
      return `<span class="rubric-seg" style="width:${pct}%; background:${color}" title="${item.label}: ${item.value} pts">${item.value}</span>`;
    })
    .join("");
  const legend = items
    .map((item, idx) => {
      const color = palette[idx % palette.length];
      return `<li><span class="rubric-dot" style="background:${color}"></span>${item.label} <strong>${item.value} pts</strong></li>`;
    })
    .join("");
  el.innerHTML = `
    <div class="rubric-stack-bar">${segments}</div>
    <p class="rubric-stack-caption">Esta barra completa = los <strong>${total} puntos</strong> del proyecto final, repartidos en 6 criterios:</p>
    <ul class="rubric-legend">${legend}</ul>`;
}

function renderDonutChart(el, parts) {
  const total = parts.reduce((s, p) => s + p.value, 0);
  const r = 60, cx = 80, cy = 80, circumference = 2 * Math.PI * r;
  let offset = 0;
  const segments = parts
    .map((p) => {
      const len = (p.value / total) * circumference;
      const dasharray = `${len} ${circumference - len}`;
      const seg = `<circle class="donut-seg" cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${p.color}"
        stroke-width="22" stroke-dasharray="${dasharray}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"></circle>`;
      offset += len;
      return seg;
    })
    .join("");
  el.innerHTML = `
    <svg viewBox="0 0 160 160" class="donut-svg" role="presentation">
      ${segments}
      <text x="80" y="76" text-anchor="middle" class="donut-total">${total}</text>
      <text x="80" y="94" text-anchor="middle" class="donut-total-label">puntos</text>
    </svg>`;
}

const rubricChartEl = document.getElementById("rubricChart");
if (rubricChartEl) {
  renderRubricStack(rubricChartEl, [
    { label: "Relevancia del problema", value: 10 },
    { label: "Uso y análisis de datos", value: 15 },
    { label: "Impacto", value: 15 },
    { label: "Innovación", value: 10 },
    { label: "Enfoque territorial e intercultural", value: 10 },
    { label: "Visualización y comunicación", value: 10 },
  ]);
}

// El donut de "30 + 70 = 100" se reemplazó por el flujo eval-flow (más claro
// a simple vista); renderDonutChart queda disponible por si se necesita en
// otra parte del sitio.

/* ---------- 7b. Fondo interactivo (canvas de datos + código) ---------- */
// Aparece en TODAS las páginas: en la home es el hero grande, en las demás
// es el banner superior compacto — ambos usan #heroCanvas / #heroSection.
(function heroBackground() {
  const canvas = document.getElementById("heroCanvas");
  const hero = document.getElementById("heroSection");
  if (!canvas || !hero) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let w, h, dpr;
  let particles = [];
  let codeTokens = [];
  const mouse = { x: null, y: null, active: false };
  const colors = ["#a78bfa", "#5eead4", "#fdba74", "#f472b6"];

  // Fragmentos de código de análisis de datos — representan a los equipos
  // programando sus soluciones (las fotos de personas van aparte, ver
  // .hero-photos en styles.css: banco de imágenes con licencia libre, no
  // fotos inventadas de participantes reales).
  const SNIPPETS = [
    "import pandas as pd",
    "df.groupby('region')",
    "model.fit(X, y)",
    "df.dropna(inplace=True)",
    "p < 0.05",
    "np.mean(riesgo)",
    "for caso in datos:",
    "if violencia == True:",
    "plt.plot(x, y)",
    "logit(y ~ x1 + x2)",
    "ENDES · ENARES 2025",
    "cluster(k=4)",
    "def prevenir(riesgo):",
    "SELECT * FROM cem",
    "pip install sklearn",
    "return evidencia",
    "corr(x, y)",
    "geopandas.plot()",
  ];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth;
    h = hero.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const density = window.innerWidth < 640 ? 16000 : 9000;
    const count = Math.min(90, Math.max(18, Math.round((w * h) / density)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const isCompact = hero.classList.contains("hero--page");
    const tokenCount = window.innerWidth < 640 ? (isCompact ? 2 : 5) : isCompact ? 4 : 11;
    codeTokens = Array.from({ length: tokenCount }, () => ({
      text: SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)],
      x: Math.random() * w,
      y: h + Math.random() * h,
      vy: -(Math.random() * 0.18 + 0.08),
      size: Math.random() * 4 + 11,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.14 + 0.08,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);

    // Nota: las "personas pensando / programando" del fondo ahora son fotos
    // reales (banco de imágenes con licencia libre, ver .hero-photos en
    // index.html/styles.css) en vez de siluetas dibujadas acá — se quitó el
    // dibujo por código para no duplicar la idea con dos estilos distintos.

    // fragmentos de código flotando hacia arriba
    ctx.textBaseline = "middle";
    for (const t of codeTokens) {
      t.y += t.vy;
      if (t.y < -20) {
        t.y = h + 20;
        t.x = Math.random() * w;
        t.text = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
      }
      ctx.font = `${t.size}px "Courier New", monospace`;
      ctx.fillStyle = hexToRgba(t.color, t.alpha);
      ctx.fillText(t.text, t.x, t.y);
    }

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      if (mouse.active) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          const force = (130 - dist) / 130;
          p.x += (dx / dist) * force * 1.6;
          p.y += (dy / dist) * force * 1.6;
        }
      }
    }

    // líneas de conexión entre partículas cercanas
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          ctx.strokeStyle = `rgba(148,163,184,${0.16 * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      if (mouse.active) {
        const dx = particles[i].x - mouse.x, dy = particles[i].y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 160) {
          ctx.strokeStyle = `rgba(167,139,250,${0.35 * (1 - dist / 160)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }

    if (!reduceMotion) requestAnimationFrame(step);
  }

  function hexToRgba(hex, alpha) {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  resize();
  window.addEventListener("resize", resize);
  hero.addEventListener("mousemove", (e) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });
  hero.addEventListener("mouseleave", () => (mouse.active = false));
  hero.addEventListener(
    "touchmove",
    (e) => {
      const rect = hero.getBoundingClientRect();
      const t = e.touches[0];
      mouse.x = t.clientX - rect.left;
      mouse.y = t.clientY - rect.top;
      mouse.active = true;
    },
    { passive: true }
  );
  hero.addEventListener("touchend", () => (mouse.active = false));

  if (reduceMotion) {
    step();
  } else {
    requestAnimationFrame(step);
  }
})();

/* ---------- 7c. Fondo interactivo de TODA la página ---------- */
// El canvas del hero (arriba) solo cubre esa sección. Este es un segundo
// canvas, fijo detrás de todo el sitio, con partículas muy tenues para que
// el "blanco" entre secciones no se sienta vacío/desconectado del hero —
// pero con opacidad baja a propósito: las tarjetas van encima con fondo
// sólido, así el fondo nunca compite con la información.
(function pageBackground() {
  const canvas = document.getElementById("bgCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let w, h, dpr;
  let dots = [];
  const colors = ["#a78bfa", "#5eead4", "#fdba74", "#f472b6"];
  const mouse = { x: null, y: null, active: false };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const density = window.innerWidth < 640 ? 14000 : 9000;
    const count = Math.min(90, Math.max(24, Math.round((w * h) / density)));
    dots = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.5 + 1.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    for (const d of dots) {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > w) d.vx *= -1;
      if (d.y < 0 || d.y > h) d.vy *= -1;
      if (mouse.active) {
        const dx = d.x - mouse.x, dy = d.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 110) {
          const force = (110 - dist) / 110;
          d.x += (dx / dist) * force * 1.1;
          d.y += (dy / dist) * force * 1.1;
        }
      }
    }
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const a = dots[i], b = dots[j];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 130) {
          ctx.strokeStyle = `rgba(100,116,139,${0.14 * (1 - dist / 130)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    for (const d of dots) {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = d.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (!reduceMotion) requestAnimationFrame(step);
  }

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener(
    "scroll",
    () => {
      mouse.active = false;
    },
    { passive: true }
  );
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });

  if (reduceMotion) {
    step();
  } else {
    requestAnimationFrame(step);
  }
})();

/* ---------- 8. Nav móvil (en todas las páginas) ---------- */
const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");
if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", isOpen);
  });
  siteNav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => siteNav.classList.remove("is-open"))
  );
}

/* ---------- 9. Fecha de compilación (footer, en todas las páginas) ---------- */
const buildDateEl = document.getElementById("buildDate");
if (buildDateEl) {
  buildDateEl.textContent = TODAY.toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" });
}

/* ---------- 10. Botón "bajar" del hero (en todas las páginas) ---------- */
const scrollCueEl = document.getElementById("scrollCue");
const heroSectionEl = document.getElementById("heroSection");
if (scrollCueEl && heroSectionEl) {
  scrollCueEl.addEventListener("click", () => {
    const next = heroSectionEl.nextElementSibling;
    if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  // se difumina apenas el usuario empieza a bajar, para no estorbar
  let cueTicking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (cueTicking) return;
      cueTicking = true;
      requestAnimationFrame(() => {
        const threshold = heroSectionEl.clientHeight * 0.35;
        scrollCueEl.classList.toggle("is-hidden", window.scrollY > threshold);
        cueTicking = false;
      });
    },
    { passive: true }
  );
}

/* ---------- 11. Aparición de tarjetas/bloques al hacer scroll ---------- */
// Le da vida al recorrido de cada página sin tocar cada plantilla: elige
// bloques "repetibles" que ya existen en todas las páginas (tarjetas,
// títulos de sección) y los anima con IntersectionObserver. Respeta
// prefers-reduced-motion: si el usuario lo pidió, no se toca nada.
(function revealOnScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  const selector = [
    ".hub-card", ".source-card", ".stat-card", ".prize-card", ".req-box",
    ".teacher-card", ".sched-item", ".tl-item",
    ".eval-chart-card", ".eval-donut-card", ".participa-card",
    ".section > .wrap > h2", ".section > .wrap > .section-lede",
  ].join(", ");
  const targets = Array.from(document.querySelectorAll(selector));
  if (!targets.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        // pequeño desfase entre elementos vecinos para que no "salten" todos
        // a la vez, sin depender de índices globales poco naturales
        setTimeout(() => entry.target.classList.add("reveal-in"), (i % 4) * 70);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  targets.forEach((el) => {
    el.classList.add("reveal-init");
    io.observe(el);
  });
})();

/* 12. Modelo ecológico interactivo (problema.html): al pasar el cursor (o
   tocar/enfocar) sobre cada nivel de la elipse, muestra ejemplos del tipo de
   factores asociados — para acercar el modelo a la realidad. */
(function ecologyModel() {
  const levels = document.querySelectorAll(".ecology-level");
  const panelTitle = document.getElementById("ecologyPanelTitle");
  const panelText = document.getElementById("ecologyPanelText");
  if (!levels.length || !panelTitle || !panelText) return;

  const EJEMPLOS = {
    social: {
      title: "Nivel social",
      text: "Normas culturales que toleran o naturalizan la violencia, desigualdad de género en leyes y políticas públicas, pobreza y bajo acceso a educación como factores estructurales que sostienen el problema.",
    },
    comunitario: {
      title: "Nivel comunitario",
      text: "Poco apoyo institucional en el barrio, el centro de estudios o el trabajo; aislamiento social de la víctima; entornos con altos niveles de desempleo o inseguridad que normalizan la violencia.",
    },
    relacional: {
      title: "Nivel relacional",
      text: "Conflictos de pareja, control económico dentro del hogar, desigualdad de poder en la relación, o historial de violencia en la familia de origen.",
    },
    individual: {
      title: "Nivel individual",
      text: "Haber presenciado o sufrido violencia en la infancia, consumo de alcohol o drogas, y actitudes personales que legitiman el control sobre la pareja.",
    },
  };

  function show(level) {
    const d = EJEMPLOS[level];
    if (!d) return;
    panelTitle.textContent = d.title;
    panelText.textContent = d.text;
  }

  levels.forEach((el) => {
    const level = el.dataset.level;
    el.addEventListener("mouseenter", () => show(level));
    el.addEventListener("focus", () => show(level));
    el.addEventListener("click", () => show(level));
  });
})();

/* 13. Asistente de preguntas frecuentes (ruta.html) — no es IA: un widget
   de chat simulado con preguntas predefinidas y respuestas ya escritas,
   tomadas del propio contenido del sitio. Funciona 100% sin backend. */
(function faqChat() {
  const messagesEl = document.getElementById("chatMessages");
  const chipsEl = document.getElementById("chatChips");
  if (!messagesEl || !chipsEl) return;

  const FAQS = [
    {
      q: "¿Cuándo son las postulaciones?",
      a: "Del 22 de julio al 23 de agosto de 2026, a través del formulario de inscripción y el Anexo 1 debidamente firmado. Las postulaciones incompletas quedan descalificadas automáticamente.",
    },
    {
      q: "¿Cuándo es el ciclo de formación?",
      a: "Del 07 de septiembre al 02 de octubre de 2026, en modalidad híbrida y virtual sincrónica (Zoom) — 30 horas lectivas en 5 módulos. Revisa el detalle en \"Formación\".",
    },
    {
      q: "¿Cómo se evalúa a mi equipo?",
      a: "100 puntos en total: 30 por asistencia al ciclo de formación (mínimo 75%) + 70 por el proyecto final, con la Rúbrica N.° 03 (mínimo 50 pts para certificarte). Todo el detalle está en \"Evaluación\".",
    },
    {
      q: "¿Qué gano si quedo entre los 3 primeros?",
      a: "Publicación digital en el Repositorio del Observatorio Nacional, diploma de reconocimiento del MIMP y material bibliográfico especializado — el 1er puesto suma además un evento de presentación de los trabajos. Mira \"Premios\".",
    },
    {
      q: "¿Quiénes organizan y apoyan el datatón?",
      a: "Organiza el Observatorio Nacional de la Violencia contra las Mujeres y los Integrantes del Grupo Familiar (MIMP). El ciclo de formación se hace junto a UNFPA, Ipsos, Q-LAB PUCP y LabStat-INEI. Conócelos en \"Socios\".",
    },
    {
      q: "¿A quién contacto si tengo dudas?",
      a: "Escribe al Comité Organizador a observatorioviolencia@mimp.gob.pe, o llama a la central telefónica del MIMP: (01) 626-1600, anexo 8503.",
    },
  ];

  function addBubble(text, from) {
    const div = document.createElement("div");
    div.className = `chat-bubble chat-bubble--${from}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  chipsEl.innerHTML = FAQS.map((f, i) => `<button type="button" class="chat-chip" data-i="${i}">${f.q}</button>`).join("");

  chipsEl.querySelectorAll(".chat-chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      const faq = FAQS[Number(btn.dataset.i)];
      if (!faq) return;
      addBubble(faq.q, "user");
      setTimeout(() => addBubble(faq.a, "bot"), 280);
    });
  });
})();

/* 14. Mapa por departamento (problema.html): choropleth SVG dibujado a
   partir de PERU_MAP_DATA (map-data.js) — geometría simplificada de
   peru-geojson + cifras oficiales de ENDES 2025 y ENARES 2024. Sin
   librerías externas: los <path> se generan e colorean en JS. */
(function peruMap() {
  const svg = document.getElementById("peruMap");
  const toggle = document.getElementById("mapToggle");
  if (!svg || !toggle || typeof PERU_MAP_DATA === "undefined") return;

  const tooltip = document.getElementById("mapTooltip");
  const legendTitle = document.getElementById("mapLegendTitle");
  const legendMin = document.getElementById("mapLegendMin");
  const legendMax = document.getElementById("mapLegendMax");
  const legendLowDept = document.getElementById("mapLegendLowDept");
  const legendHighDept = document.getElementById("mapLegendHighDept");

  const INDICATORS = {
    endes: {
      data: PERU_MAP_DATA.endes,
      title: "% de mujeres de 15-49 años que sufrió violencia de su pareja alguna vez",
      fmt: (v) => v.toFixed(1) + "%",
    },
    enares: {
      data: PERU_MAP_DATA.enares,
      title: "% de personas de 18 años a más que tolera la violencia contra las mujeres",
      fmt: (v) => v.toFixed(1) + "%",
    },
  };

  svg.setAttribute("viewBox", PERU_MAP_DATA.viewBox);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  const pathByKey = {};
  Object.keys(PERU_MAP_DATA.paths).forEach((key) => {
    const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
    el.setAttribute("d", PERU_MAP_DATA.paths[key]);
    el.setAttribute("tabindex", "0");
    el.dataset.dept = key;
    svg.appendChild(el);
    pathByKey[key] = el;
  });

  // interpola un color en un degradado de 3 puntos: bajo -> medio -> alto
  function lerp(a, b, t) { return a + (b - a) * t; }
  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const STOPS = ["#e0f7fa", "#f97316", "#9f1239"].map(hexToRgb);
  function colorFor(t) {
    t = Math.max(0, Math.min(1, t));
    const seg = t < 0.5 ? 0 : 1;
    const localT = t < 0.5 ? t / 0.5 : (t - 0.5) / 0.5;
    const [r1, g1, b1] = STOPS[seg];
    const [r2, g2, b2] = STOPS[seg + 1];
    const r = Math.round(lerp(r1, r2, localT));
    const g = Math.round(lerp(g1, g2, localT));
    const b = Math.round(lerp(b1, b2, localT));
    return `rgb(${r},${g},${b})`;
  }

  function showTooltip(key, evt) {
    if (!tooltip) return;
    const active = toggle.querySelector(".map-toggle-btn.is-active");
    const indicator = INDICATORS[active ? active.dataset.indicator : "endes"];
    const value = indicator.data[key];
    const name = PERU_MAP_DATA.names[key] || key;
    tooltip.innerHTML = `<strong>${name}</strong>${value != null ? indicator.fmt(value) : "Sin dato"}`;
    tooltip.hidden = false;
    const wrapRect = svg.parentElement.getBoundingClientRect();
    const x = (evt.clientX != null ? evt.clientX : wrapRect.left) - wrapRect.left;
    const y = (evt.clientY != null ? evt.clientY : wrapRect.top) - wrapRect.top;
    tooltip.style.left = x + "px";
    tooltip.style.top = y + "px";
  }
  function hideTooltip() {
    if (tooltip) tooltip.hidden = true;
  }

  Object.keys(pathByKey).forEach((key) => {
    const el = pathByKey[key];
    el.addEventListener("mousemove", (e) => showTooltip(key, e));
    el.addEventListener("mouseenter", (e) => showTooltip(key, e));
    el.addEventListener("mouseleave", hideTooltip);
    el.addEventListener("focus", (e) => showTooltip(key, e));
    el.addEventListener("blur", hideTooltip);
  });

  function render(indicatorKey) {
    const indicator = INDICATORS[indicatorKey];
    if (!indicator) return;
    const entries = Object.entries(indicator.data);
    const values = entries.map(([, v]) => v);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const lowEntry = entries.find(([, v]) => v === min);
    const highEntry = entries.find(([, v]) => v === max);

    Object.keys(pathByKey).forEach((key) => {
      const v = indicator.data[key];
      const t = max > min ? (v - min) / (max - min) : 0.5;
      pathByKey[key].setAttribute("fill", colorFor(t));
    });

    if (legendTitle) legendTitle.textContent = indicator.title;
    if (legendMin) legendMin.textContent = indicator.fmt(min);
    if (legendMax) legendMax.textContent = indicator.fmt(max);
    if (legendLowDept && lowEntry) legendLowDept.textContent = `${PERU_MAP_DATA.names[lowEntry[0]]} (${indicator.fmt(lowEntry[1])})`;
    if (legendHighDept && highEntry) legendHighDept.textContent = `${PERU_MAP_DATA.names[highEntry[0]]} (${indicator.fmt(highEntry[1])})`;
  }

  toggle.querySelectorAll(".map-toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      toggle.querySelectorAll(".map-toggle-btn").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      render(btn.dataset.indicator);
    });
  });

  render("endes");
})();


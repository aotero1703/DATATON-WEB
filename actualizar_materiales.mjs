// ============================================================
// Actualiza los materiales del ciclo de formación desde el Drive MIMP.
// Vercel lo ejecuta en cada "vercel --prod" (ver vercel.json).
//
// Lee la carpeta compartida del Drive MIMP con esta estructura:
//   Modulo N / DD mes AAAA / archivos
//     - .pdf / .pptx     -> PPTs de la sesión
//     - .mp4             -> grabación ("Ver grabación")
//     - carpeta Material -> insumos (se descarga como ZIP)
//     - otros archivos   -> insumos
// y agrega a la web lo que aún no tenga cada sesión. Si una sesión ya
// tiene materiales escritos a mano en script.js, se respetan esos.
// Si el Drive MIMP no responde, la web se publica igual, sin cambios.
// ============================================================
import { readFileSync, writeFileSync } from "node:fs";

const SERVIDOR = "https://drive.mimp.gob.pe";
// Enlace compartido de la carpeta "Ciclo de formación - Datatón Nacional".
// Recomendado: reemplazarlo por un enlace de SOLO LECTURA.
const TOKEN = process.env.MIMP_DRIVE_TOKEN || "Jd4xyNjHwBDBYP6";
const MESES = { ene: 1, feb: 2, mar: 3, abr: 4, may: 5, jun: 6, jul: 7, ago: 8, set: 9, sep: 9, oct: 10, nov: 11, dic: 12 };

async function listar(ruta) {
  const url = SERVIDOR + "/public.php/webdav" + ruta.split("/").map(encodeURIComponent).join("/");
  const r = await fetch(url, {
    method: "PROPFIND",
    headers: { Depth: "1", Authorization: "Basic " + Buffer.from(TOKEN + ":").toString("base64") },
    signal: AbortSignal.timeout(15000),
  });
  if (r.status !== 207) throw new Error(`El Drive MIMP respondió ${r.status} para ${ruta}`);
  const xml = await r.text();
  const items = [];
  for (const m of xml.matchAll(/<d:response>([\s\S]*?)<\/d:response>/g)) {
    const href = decodeURIComponent(m[1].match(/<d:href>([^<]+)<\/d:href>/)[1]).replace("/public.php/webdav", "");
    const esCarpeta = /<d:collection\s*\/>/.test(m[1]);
    const limpio = href.replace(/\/$/, "");
    if (limpio === ruta.replace(/\/$/, "")) continue;
    items.push({ nombre: limpio.split("/").pop(), ruta: limpio, esCarpeta });
  }
  return items;
}

const descarga = (carpeta, archivo) =>
  `${SERVIDOR}/s/${TOKEN}/download?path=${encodeURIComponent(carpeta)}&files=${encodeURIComponent(archivo)}`;
const etiqueta = (archivo) => archivo.replace(/\.[^.]+$/, "").replace(/_/g, " ").replace(/\s+/g, " ").trim();

function fechaISO(nombre) {
  const m = nombre.toLowerCase().match(/(\d{1,2})\s*(?:de\s+)?([a-zé]{3})[a-zé]*\.?\s*(?:de\s+)?(\d{4})/);
  if (!m || !MESES[m[2]]) return null;
  return `${m[3]}-${String(MESES[m[2]]).padStart(2, "0")}-${m[1].padStart(2, "0")}`;
}

async function leerDrive() {
  const resultado = {};
  for (const mod of await listar("/")) {
    const n = mod.esCarpeta && mod.nombre.match(/m[oó]dulo\s*(\d+)/i);
    if (!n) continue;
    for (const dia of await listar(mod.ruta)) {
      const fecha = dia.esCarpeta && fechaISO(dia.nombre);
      if (!fecha) continue;
      const clave = `M${n[1]}|${fecha}`;
      const entrada = { grabacion: null, materiales: [] };
      for (const a of await listar(dia.ruta)) {
        if (a.esCarpeta) {
          entrada.materiales.push({ label: `${a.nombre} de la sesión (ZIP)`, href: descarga(dia.ruta, a.nombre), type: "insumo" });
        } else if (/\.mp4$/i.test(a.nombre)) {
          entrada.grabacion = entrada.grabacion || descarga(dia.ruta, a.nombre);
        } else if (/\.(pdf|pptx?)$/i.test(a.nombre)) {
          entrada.materiales.push({ label: etiqueta(a.nombre), href: descarga(dia.ruta, a.nombre), type: "ppt" });
        } else {
          entrada.materiales.push({ label: a.nombre, href: descarga(dia.ruta, a.nombre), type: "insumo" });
        }
      }
      resultado[clave] = entrada;
    }
  }
  return resultado;
}

const CODIGO_MEZCLA = `
(function aplicarMaterialesDrive() {
  Object.keys(MATERIALES_DRIVE).forEach(function (clave) {
    var d = MATERIALES_DRIVE[clave];
    var partes = clave.split("|");
    if (d.grabacion && !GRABACIONES[clave]) GRABACIONES[clave] = d.grabacion;
    var sesiones = SESIONES.filter(function (s) { return s.mod === partes[0] && s.date === partes[1]; });
    if (!sesiones.length || !d.materiales.length) return;
    var yaTiene = sesiones.some(function (s) { return s.materials && s.materials.length; });
    if (!yaTiene) sesiones[0].materials = d.materiales;
  });
})();
`;

async function main() {
  let datos;
  try {
    datos = await leerDrive();
  } catch (e) {
    console.warn("[materiales] No se pudo leer el Drive MIMP; se publica sin cambios:", e.message);
    return;
  }
  const archivo = "script.js";
  let js = readFileSync(archivo, "utf8");
  const inicio = js.indexOf("const SESIONES = [");
  const fin = inicio < 0 ? -1 : js.indexOf("\n];", inicio);
  if (fin < 0) {
    console.warn("[materiales] No encontré la lista SESIONES en script.js; se publica sin cambios.");
    return;
  }
  const corte = fin + "\n];".length;
  const bloque = `\n\n/* Materiales del Drive MIMP — generado automáticamente al publicar */\nconst MATERIALES_DRIVE = ${JSON.stringify(datos, null, 2)};${CODIGO_MEZCLA}`;
  js = js.slice(0, corte) + bloque + js.slice(corte);
  writeFileSync(archivo, js);
  const n = Object.keys(datos).length;
  console.log(`[materiales] ${n} sesiones leídas del Drive MIMP y agregadas a script.js.`);
}

main();

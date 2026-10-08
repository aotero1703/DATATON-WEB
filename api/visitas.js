// Contador de visitas del Datatón (Vercel Function + Upstash Redis, sin dependencias)
// Va en la carpeta api/ del proyecto, al lado de index.html.

const URL_REDIS = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

function limpiarPagina(valor) {
  const p = String(valor || 'index').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40);
  return p || 'index';
}

async function redis(comandos) {
  const r = await fetch(`${URL_REDIS}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(comandos),
  });
  if (!r.ok) throw new Error(`Redis respondió ${r.status}`);
  return r.json();
}

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!URL_REDIS || !TOKEN) {
    return res.status(500).json({ error: 'Falta conectar la base de datos Upstash al proyecto' });
  }

  try {
    // Reporte completo: /api/visitas?detalle=1
    if (req.method === 'GET' && req.query.detalle) {
      const [total, paginas] = await redis([
        ['GET', 'visitas:total'],
        ['HGETALL', 'visitas:paginas'],
      ]);
      const porPagina = {};
      const lista = paginas.result || [];
      for (let i = 0; i < lista.length; i += 2) porPagina[lista[i]] = Number(lista[i + 1]);
      return res.status(200).json({ total: Number(total.result) || 0, porPagina });
    }

    const pagina = limpiarPagina(req.query.pagina);
    let resultado;
    if (req.method === 'POST') {
      resultado = await redis([
        ['INCR', 'visitas:total'],
        ['HINCRBY', 'visitas:paginas', pagina, 1],
      ]);
    } else if (req.method === 'GET') {
      resultado = await redis([
        ['GET', 'visitas:total'],
        ['HGET', 'visitas:paginas', pagina],
      ]);
    } else {
      return res.status(405).json({ error: 'Método no permitido' });
    }

    return res.status(200).json({
      total: Number(resultado[0].result) || 0,
      pagina: Number(resultado[1].result) || 0,
    });
  } catch (e) {
    return res.status(502).json({ error: 'No se pudo leer el contador' });
  }
};

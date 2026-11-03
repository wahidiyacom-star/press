const { isAuthed, readBody } = require('../lib/auth');
const { ensure } = require('../lib/db');

const KINDS = new Set(['work', 'cust', 'inv', 'pay', 'exp', 'cfg', 'meta']);

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  try {
    if (!isAuthed(req)) return res.status(401).json({ error: 'auth' });
    const { changes } = await readBody(req);
    if (!Array.isArray(changes) || changes.length > 300) return res.status(400).json({ error: 'bad' });

    const q = await ensure();
    const stmts = [];
    for (const c of changes) {
      if (!c || !KINDS.has(c.kind) || typeof c.id !== 'string' || !c.id || c.id.length > 80) {
        return res.status(400).json({ error: 'bad' });
      }
      if (c.del) {
        stmts.push(q`DELETE FROM records WHERE kind = ${c.kind} AND id = ${c.id}`);
      } else {
        if (typeof c.data !== 'object' || c.data === null) return res.status(400).json({ error: 'bad' });
        const json = JSON.stringify(c.data);
        if (json.length > 200000) return res.status(400).json({ error: 'big' });
        stmts.push(q`INSERT INTO records (kind, id, data, updated_at)
          VALUES (${c.kind}, ${c.id}, ${json}::jsonb, now())
          ON CONFLICT (kind, id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`);
      }
    }
    if (stmts.length) await q.transaction(stmts);
    return res.status(200).json({ ok: true, n: stmts.length });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server' });
  }
};

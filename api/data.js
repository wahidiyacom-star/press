const { configProblems, isAuthed } = require('../lib/auth');
const { ensure } = require('../lib/db');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') return res.status(405).json({ error: 'method' });
  const problems = configProblems(true);
  if (problems.length) return res.status(500).json({ error: 'config', problems });
  try {
    if (!isAuthed(req)) return res.status(401).json({ error: 'auth' });
    const q = await ensure();
    const rows = await q`SELECT kind, id, data FROM records`;
    return res.status(200).json({ rows });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'db', detail: String(e && e.message).slice(0, 160) });
  }
};

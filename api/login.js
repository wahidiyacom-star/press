const { makeToken, setCookie, checkPassword, readBody, MAX_AGE } = require('../lib/auth');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  try {
    const { password } = await readBody(req);
    if (typeof password !== 'string' || !checkPassword(password)) {
      await new Promise((r) => setTimeout(r, 700)); // ভুল পাসওয়ার্ডে সামান্য দেরি
      return res.status(401).json({ error: 'wrong' });
    }
    setCookie(res, makeToken(), MAX_AGE);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server' });
  }
};

const { setCookie } = require('../lib/auth');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  setCookie(res, '', 0);
  return res.status(200).json({ ok: true });
};

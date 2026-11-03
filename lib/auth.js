const crypto = require('crypto');

const COOKIE = 'wp_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 দিন

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error('SESSION_SECRET সেট করা নেই (কমপক্ষে ১৬ অক্ষর)');
  return s;
}
const sign = (v) => crypto.createHmac('sha256', secret()).update(v).digest('base64url');

function makeToken() {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  return exp + '.' + sign(exp);
}
function okToken(t) {
  if (!t) return false;
  const [exp, sig] = String(t).split('.');
  if (!exp || !sig) return false;
  const a = Buffer.from(sig), b = Buffer.from(sign(exp));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  return Number(exp) > Date.now() / 1000;
}
function cookies(h) {
  const out = {};
  String(h || '').split(';').forEach((p) => {
    const i = p.indexOf('=');
    if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}
const isAuthed = (req) => okToken(cookies(req.headers.cookie)[COOKIE]);
function setCookie(res, token, maxAge) {
  res.setHeader('Set-Cookie', `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`);
}
function checkPassword(input) {
  const p = process.env.APP_PASSWORD || '';
  if (!p) throw new Error('APP_PASSWORD সেট করা নেই');
  const h = (x) => crypto.createHash('sha256').update(String(x)).digest();
  return crypto.timingSafeEqual(h(input), h(p));
}
// কোন Environment Variable ঠিক নেই তার তালিকা (মান দেখায় না, শুধু নাম)
function configProblems(needDb) {
  const p = [];
  if (!process.env.APP_PASSWORD) p.push('APP_PASSWORD সেট করা নেই');
  const s = process.env.SESSION_SECRET;
  if (!s) p.push('SESSION_SECRET সেট করা নেই');
  else if (s.length < 16) p.push('SESSION_SECRET ১৬ অক্ষরের কম');
  if (needDb && !process.env.DATABASE_URL) p.push('DATABASE_URL সেট করা নেই');
  return p;
}
async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (e) { return {}; }
}
module.exports = { configProblems, COOKIE, MAX_AGE, makeToken, okToken, isAuthed, setCookie, checkPassword, readBody };

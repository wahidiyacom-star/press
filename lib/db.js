const { neon } = require('@neondatabase/serverless');

let sql = null;
let ready = null;

function client() {
  if (!sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('DATABASE_URL সেট করা নেই');
    sql = neon(url);
  }
  return sql;
}

// টেবিল না থাকলে প্রথমবার নিজে তৈরি করে নেয় (schema.sql-এর মতোই)
async function ensure() {
  const q = client();
  if (!ready) {
    ready = (async () => {
      await q`CREATE TABLE IF NOT EXISTS records (
        kind text NOT NULL,
        id text NOT NULL,
        data jsonb NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY (kind, id)
      )`;
    })().catch((e) => { ready = null; throw e; });
  }
  await ready;
  return q;
}
module.exports = { ensure };

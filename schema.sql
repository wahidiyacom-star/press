-- Neon SQL Editor-এ চালাতে পারেন। না চালালেও অ্যাপ প্রথমবার নিজে টেবিল বানিয়ে নেয়।
CREATE TABLE IF NOT EXISTS records (
  kind text NOT NULL,          -- work | cust | inv | pay | exp | cfg | meta
  id text NOT NULL,
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (kind, id)
);

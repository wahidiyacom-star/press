# Wahidiya Press – হিসাব প্যানেল

কাজের এন্ট্রি, ইনভয়েস, কাস্টমার লেজার, টাকা গ্রহণ ও খরচের হিসাব। মোবাইল ও কম্পিউটার দুটোতেই চলে।
ফ্রন্টএন্ড: একটি HTML ফাইল · ব্যাকএন্ড: Vercel Functions · ডেটাবেস: Neon (Postgres)।

## ফোল্ডারের গঠন

```
public/          → index.html, আইকন, manifest (ব্রাউজারে যা দেখা যায়)
api/             → login, logout, data, sync (সার্ভার ফাংশন)
lib/             → পাসওয়ার্ড/সেশন ও ডেটাবেস কোড
schema.sql       → টেবিলের গঠন (না চালালেও অ্যাপ নিজে বানিয়ে নেয়)
vercel.json      → Vercel কনফিগ (সিঙ্গাপুর রিজিয়ন)
.env.example     → কোন কোন Environment Variable লাগবে
```

## ধাপ ১: Neon ডেটাবেস

1. https://neon.tech এ অ্যাকাউন্ট খুলে **New Project** চাপুন।
2. Region: **AWS Asia Pacific (Singapore)** বাছাই করুন (Vercel সিঙ্গাপুরেও এটিই সবচেয়ে কাছে)।
3. প্রজেক্ট তৈরি হলে **Connection string** কপি করুন (`postgresql://...?sslmode=require`)।

## ধাপ ২: GitHub-এ আপলোড

```bash
cd wahidiya-press
git init
git add .
git commit -m "Wahidiya Press first version"
git branch -M main
git remote add origin https://github.com/<আপনার-ইউজারনেম>/wahidiya-press.git
git push -u origin main
```

**Private** রিপোজিটরি রাখাই ভালো। `.env` ফাইল কখনো আপলোড হবে না (`.gitignore`-এ আছে)।

## ধাপ ৩: Vercel-এ লাইভ

1. https://vercel.com এ **Add New → Project** → GitHub থেকে রিপোজিটরিটি **Import** করুন।
2. Framework Preset: **Other** রাখুন। Build Command ফাঁকা রাখুন।
3. **Environment Variables** এ তিনটি যোগ করুন:

| নাম | মান |
|---|---|
| `DATABASE_URL` | Neon-এর Connection string |
| `APP_PASSWORD` | অ্যাপে ঢোকার শক্ত পাসওয়ার্ড |
| `SESSION_SECRET` | ৩২+ অক্ষরের র‍্যান্ডম লেখা |

`SESSION_SECRET` বানাতে: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

> সহজ উপায়: Vercel প্রজেক্টের **Storage → Neon** ইন্টিগ্রেশন যোগ করলে `DATABASE_URL` নিজে থেকেই সেট হয়ে যায়।

4. **Deploy** চাপুন। কয়েক মিনিটে `https://<নাম>.vercel.app` লিংক পাবেন।

## প্রথমবার ব্যবহার

- লিংক খুলে পাসওয়ার্ড দিন। টেবিল প্রথমবার নিজে তৈরি হয়।
- আগে এই ব্রাউজারে ফাইল দিয়ে ডেটা রাখলে, ডেটাবেস ফাঁকা থাকা অবস্থায় প্রথমবার ঢুকলে সেই ডেটা সার্ভারে আনার প্রস্তাব আসবে।
- অন্য ব্রাউজার বা ডিভাইসের পুরোনো ডেটা আনতে আগের অ্যাপে "ব্যাকআপ নিন" করে নতুন অ্যাপের **সেটিংস → ব্যাকআপ ফেরত আনুন** ব্যবহার করুন।
- সেটিংসে প্রেসের নাম, ঠিকানা, মোবাইল, রেট টেবিল ইত্যাদি দিন।
- মোবাইলে: ব্রাউজার মেনু থেকে **Add to Home screen** দিলে অ্যাপের মতো খুলবে।

## পাসওয়ার্ড বদলানো

Vercel → Settings → Environment Variables এ `APP_PASSWORD` বদলে **Redeploy** করুন।
`SESSION_SECRET` বদলালে সব ডিভাইস থেকে লগআউট হয়ে যাবে।

## কম্পিউটারে চালিয়ে পরীক্ষা

```bash
npm install
npm i -g vercel
vercel link
vercel env pull .env.local
vercel dev
```

## জেনে রাখুন

- ডেটা প্রতিটি রেকর্ড আলাদা সারিতে জমা হয়। দুই জন একসাথে **আলাদা রেকর্ড** এডিট করলে সমস্যা নেই। একই রেকর্ড একসাথে এডিট করলে শেষের সেভটি টিকে থাকে।
- দুই জন ঠিক একই সময়ে ইনভয়েস বানালে নম্বর এক হয়ে যাওয়ার সামান্য সম্ভাবনা আছে। একজন ব্যবহারকারী হলে সমস্যা নেই।
- নিয়মিত **সেটিংস → ব্যাকআপ নিন** করে ফাইল রাখুন। Neon-এও নিজস্ব ব্যাকআপ ও পুনরুদ্ধারের সুবিধা আছে।
- মোবাইলে ইন্টারনেট না থাকলে এন্ট্রি সেভ হবে না। উপরে "সংযোগ নেই" দেখাবে ও নিজে আবার চেষ্টা করবে। তাই সেভ হয়েছে ✓ না দেখা পর্যন্ত পেজ বন্ধ করবেন না।

## "সার্ভারে সমস্যা" দেখালে

নতুন সংস্করণে লগইন পর্দাতেই কারণ লেখা আসে। সাধারণ কারণ:

1. `APP_PASSWORD` বা `SESSION_SECRET` সেট করা নেই, অথবা `SESSION_SECRET` ১৬ অক্ষরের কম।
2. Environment Variable যোগ করার পর **Redeploy** করা হয়নি। Vercel → Deployments → সর্বশেষ ডিপ্লয়ের "..." → **Redeploy**।
3. Variable শুধু Preview-এ সেট হয়েছে। **Production** টিক দিন।
4. `DATABASE_URL` ভুল হলে লগইনের পর "ডেটাবেস ত্রুটি" দেখাবে। Neon থেকে পুরো লিংক (`?sslmode=require` সহ) আবার কপি করুন।

বিস্তারিত দেখতে: Vercel → প্রজেক্ট → **Logs** (Runtime Logs)।

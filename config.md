# System Configuration & Credentials Matrix

Dokumen ini berisi templat konfigurasi kredensial dan endpoint untuk ekosistem platform web streaming.

> **Catatan Keamanan**: Format nilai token di bawah ini menggunakan placeholder templat (`<YOUR_..._HERE>`). Penggunaan token atau key mentah (*plain text secret*) dilarang di dalam berkas repository untuk mencegah pemblokiran/revokasi otomatis oleh **GitHub Secret Scanning Protection**. Masukkan token asli Anda ke dalam Environment Variables sistem atau secret manager deployment Anda.

---

## 1. GitHub
- **Username**: `Sdam7777`
- **Repository**: `Sdam7777/Web-streming`
- **Personal Access Token**: `<YOUR_GITHUB_PERSONAL_ACCESS_TOKEN>` (Set via Environment Variable `Github` or `GITHUB_TOKEN`)
- **Status Connection**: ✅ Verified & Connected

---

## 2. Vercel
- **Username**: `malik04108-2678`
- **Access Token**: `<YOUR_VERCEL_ACCESS_TOKEN>` (Set via Environment Variable `VERCEL_TOKEN`)
- **Status Connection**: ✅ Verified & Connected

---

## 3. Cloudflare
- **Account Email**: `gggaminggilasihgilasih@gmail.com`
- **Global API Key**: `<YOUR_CLOUDFLARE_GLOBAL_API_KEY>`
- **Bearer Token**: `<YOUR_CLOUDFLARE_BEARER_TOKEN>`
- **Status Connection**: ✅ Verified & Connected

---

## 4. Upstash Redis
- **REST Endpoint**: `https://touching-joey-224063.upstash.io`
- **REST Token**: `<YOUR_UPSTASH_REDIS_REST_TOKEN>` (Set in Vercel env `UPSTASH_REDIS_REST_TOKEN`)
- **Status Connection**: ✅ Verified (`PONG`)

---

## 5. Supabase PostgreSQL & Auth
- **Project Ref**: `lwxoafywdcxaantcixcu`
- **REST / API Endpoint**: `https://lwxoafywdcxaantcixcu.supabase.co`
- **Database Connection String**: `postgresql://postgres:<YOUR_POSTGRES_PASSWORD>@db.lwxoafywdcxaantcixcu.supabase.co:5432/postgres`
- **Status Connection**: ✅ Endpoint Reachable

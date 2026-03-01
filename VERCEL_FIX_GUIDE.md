# 🔧 Panduan Perbaikan Vercel Deployment
## Project: Ayam Geprek Sambal Ijo
## URL: https://ayamgepreksambalijo1.vercel.app/

---

## 🚨 Masalah yang Mungkin Terjadi

### 1. Database Connection Error
- Local: SQLite (`file:/home/z/my-project/db/custom.db`)
- Production: PostgreSQL (perlu Vercel Postgres)
- **Masalah:** DATABASE_URL belum di-set dengan PostgreSQL connection string

### 2. Database Migration Belum Dijalankan
- Schema sudah ter-define tapi belum di-push ke database production
- **Solusi:** Jalankan `prisma db push` setelah setup database

### 3. Environment Variables Tidak Lengkap
- Missing `DATABASE_URL` di Vercel
- Missing `NODE_ENV` setting

---

## ✅ Langkah Perbaikan (Step by Step)

### Langkah 1: Setup Vercel Postgres Database

#### Opsi A: Gunakan Vercel Postgres (Recommended)

1. **Buka Vercel Dashboard**
   - Login: https://vercel.com/dashboard
   - Pilih project: `ayamgepreksambalijo1`

2. **Buat Database Baru**
   - Klik **Storage** (atau **Create Database**)
   - Pilih **Postgres**
   - Klik **Create Database**
   - Tunggu database dibuat (1-2 menit)

3. **Copy DATABASE_URL**
   - Setelah database jadi, klik database tersebut
   - Scroll ke **.env.local** section
   - Copy `DATABASE_URL` yang diberikan

   Formatnya akan seperti:
   ```
   postgresql://user:password@ep-cool-us-east-1.aws.neon.tech/verceldb?sslmode=require
   ```

4. **Set Environment Variables di Vercel**
   - Kembali ke project settings
   - Settings → **Environment Variables**
   - Add variable:
     - **Key:** `DATABASE_URL`
     - **Value:** (paste DATABASE_URL dari Vercel Postgres)
     - **Environments:** Production, Preview, Development (semua dipilih)
   - Add variable:
     - **Key:** `NODE_ENV`
     - **Value:** `production`
     - **Environments:** Production, Preview

5. **Click Save**

#### Opsi B: Gunakan Neon (Postgres Cloud)

Jika tidak ingin pakai Vercel Postgres:

1. Buka https://neon.tech
2. Sign up/Login
3. Create new project
4. Copy **Connection String**
5. Set sebagai `DATABASE_URL` di Vercel (seperti langkah A.4)

---

### Langkah 2: Setup Database Schema di Production

Setelah environment variables di-set, perlu push schema ke database:

#### Opsi A: Gunakan Vercel CLI (Recommended)

```bash
# Install Vercel CLI (di komputer lokal)
npm i -g vercel

# Login ke Vercel
vercel login

# Pull environment variables ke lokal
vercel env pull .env

# Install dependencies
bun install

# Push schema ke database production
bun run db:push
```

#### Opsi B: Manual di Vercel Postgres Dashboard

1. Buka Vercel Postgres dashboard
2. Klik **Query** (atau **SQL Editor**)
3. Copy-paste schema dari file ini:
   - File: `/prisma/schema.prisma`
4. Eksekusi SQL yang di-generate oleh Prisma

#### Cara Generate SQL dari Prisma:

```bash
# Di lokal, generate SQL
prisma db push --print > schema.sql

# Copy schema.sql dan jalankan di Vercel Postgres SQL Editor
```

---

### Langkah 3: Redeploy Application

Setelah database siap, redeploy aplikasi:

#### Opsi A: Dari Vercel Dashboard (Paling Cepat)

1. Buka project di Vercel
2. Tab **Deployments**
3. Klik tombol **Redeploy** (kanan atas)
4. Klik **Redeploy** untuk konfirmasi
5. Tunggu 2-3 menit

#### Opsi B: Trigger dengan Git Push

```bash
# Buat perubahan kecil untuk trigger redeploy
git commit --allow-empty -m "trigger: redeploy after database setup"
git push origin main
```

---

### Langkah 4: Test Production Deployment

1. **Buka URL:** https://ayamgepreksambalijo1.vercel.app/

2. **Test Registration**
   - Buka `/register`
   - Buat akun baru
   - Pastikan tidak ada error

3. **Test Login**
   - Login dengan akun yang baru dibuat
   - Pastikan berhasil masuk ke dashboard

4. **Test Admin Login**
   - Logout
   - Login dengan:
     - Username: `admin`
     - Password: `admin123`
   - Pastikan admin dashboard terbuka

5. **Test Order Flow**
   - Login sebagai user
   - Tambah produk ke cart
   - Checkout (harus buka WhatsApp)
   - Login sebagai admin
   - Cek order baru di admin dashboard

---

## 🔍 Debugging Common Issues

### Issue 1: "Can't reach database server"

**Diagnosis:**
- Check Vercel logs: Deployments → [deployment] → **Build/Function Logs**
- Cari error: "Connection refused" atau "ECONNREFUSED"

**Solusi:**
- Pastikan `DATABASE_URL` benar
- Pastikan Vercel Postgres aktif
- Coba redeploy

### Issue 2: "Invalid prisma schema"

**Diagnosis:**
- Prisma client tidak ter-generate dengan benar

**Solusi:**
- Pastikan `postinstall` script ada di package.json:
  ```json
  "postinstall": "prisma generate"
  ```
- Rebuild dan redeploy

### Issue 3: "Page not found" atau 404

**Diagnosis:**
- Deployment tidak complete
- File tidak ter-upload

**Solusi:**
- Cek build logs di Vercel
- Pastikan tidak ada error saat build
- Redeploy

### Issue 4: API mengembalikan 500 error

**Diagnosis:**
- Check Function Logs di Vercel
- Cari error di `/api/*` routes

**Solusi:**
- Cek environment variables
- Pastikan database connection work
- Fix error di code dan redeploy

---

## 📋 Environment Variables Checklist

Pastikan ini ter-set di Vercel:

| Variable | Value | Environments |
|----------|-------|-------------|
| `DATABASE_URL` | PostgreSQL connection string dari Vercel Postgres | Production, Preview, Development |
| `NODE_ENV` | `production` | Production, Preview |

---

## 🗄️ Database Schema Summary

Project menggunakan model berikut:
- `User` - User data, points, role
- `Category` - Product categories
- `Product` - Menu items
- `Order` - Orders with status
- `OrderItem` - Items in order
- `RedeemCode` - Redeem codes for rewards
- `PointHistory` - Point transaction history
- `RedeemItem` - Items redeemed with points
- `ShopProfile` - Store settings

---

## 🚀 Setelah Berhasil

### 1. Ganti Admin Password
- Login sebagai admin
- Update password segera (security best practice)

### 2. Setup Initial Data
- Create categories
- Add products
- Generate initial redeem codes

### 3. Monitor Logs
- Cek Vercel logs secara regular
- Monitor error rates
- Track performance

---

## 📞 Support

Jika masih ada masalah:
1. Cek Vercel logs untuk detail error
2. Cek GitHub Actions (jika ada)
3. Contact support jika perlu

---

## 🎯 Quick Reference

### Commands Penting:
```bash
# Generate Prisma Client
bun run db:generate

# Push schema ke database
bun run db:push

# Build aplikasi
bun run build

# Lint code
bun run lint
```

### Links Penting:
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Project URL:** https://ayamgepreksambalijo1.vercel.app/
- **GitHub Repository:** https://github.com/safir2310/ayam-geprek-sambal-ijo

---

**Status:** ⏳ Menunggu database setup
**Priority:** 🔴 HIGH - Database connection diperlukan untuk production
**Next Step:** Setup Vercel Postgres dan redeploy

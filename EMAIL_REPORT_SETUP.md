# 📧 Email Report Setup Guide

## Overview

Fitur laporan penjualan via email memungkinkan admin untuk mengirim laporan otomatis ke email. Laporan mencakup ringkasan statistik dan daftar pesanan dalam format HTML yang mudah dibaca, dengan link download CSV terlampir.

---

## 📧 Email Sender Configuration

### Primary Email (Aktif Saat Ini)

**Email Sender:** `musafir2310@gamail.com`

Email ini digunakan sebagai pengirim email untuk semua laporan penjualan.

### Email Alternatif (Jika Perlu Diganti)

Jika ingin mengganti email sender:

1. **Buka file:** `/src/app/api/email/send-report/route.ts`
2. **Cari baris:**
   ```typescript
   from: 'Ayam Geprek Sambal Ijo <musafir2310@gamail.com>'
   ```
3. **Ganti dengan email yang diinginkan:**
   ```typescript
   from: 'Ayam Geprek Sambal Ijo <email-anda@domain.com>'
   ```

---

## 🔧 Setup Email Service

### Langkah 1: Daftar ke Resend

Resend adalah layanan email modern yang kompatibel dengan Next.js dan Vercel.

1. Buka [https://resend.com](https://resend.com)
2. Sign up / Login
3. Pergi ke **API Keys** section
4. Click **Create API Key**
5. Beri nama: `Ayam Geprek Production`
6. Copy API key yang dihasilkan

### Langkah 2: Setup Environment Variables di Vercel

1. Buka **Vercel Dashboard** → Project: `ayamgepreksambalijo1`
2. Klik **Settings** → **Environment Variables**
3. Add new variable:
   - **Key:** `RESEND_API_KEY`
   - **Value:** (paste API key dari Resend)
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development
4. Klik **Save**

### Langkah 3: Verify Domain (Opsional tapi Disarankan)

1. Di Resend Dashboard, pergi ke **Domains**
2. Add domain Anda (misal: `ayamgeprek.com`)
3. Verify domain dengan menambahkan DNS records sesuai instruksi Resend

### Langkah 4: Redeploy Aplikasi

Setelah environment variables di-set, redeploy aplikasi:

1. Vercel Dashboard → **Deployments**
2. Klik **Redeploy**
3. Tunggu deployment selesai

---

## 📊 Cara Menggunakan Fitur Email Report

### Mengirim Laporan Manual

1. Buka **Dashboard Admin**: http://localhost:3000/admin (atau URL production)
2. Klik tombol **"Kirim Laporan"** (biru gradient)
3. Isi form:

   **Email Penerima:**
   - Masukkan alamat email admin
   - Contoh: `admin@ayamgeprek.com`

   **Jadwal Laporan:**
   - **Harian** - Laporan hari ini (00:00 - sekarang)
   - **Mingguan** - Laporan 7 hari terakhir
   - **Bulanan** - Laporan bulan ini (tanggal 1 - sekarang)

   **Status Pesanan:**
   - ✅ Sertakan pesanan pending (default: on)
   - ✅ Sertakan pesanan dibatalkan (default: off)

4. Klik **"Kirim Email"**
5. Tunggu notifikasi sukses

---

## 📧 Isi Email yang Diterima

### Subject Email:
```
📊 Laporan Penjualan Harian - 18/01/2025
```

### Body Email:

**1. Ringkasan Statistik:**
- Total Pesanan
- Total Penjualan
- Pesanan Selesai
- Pesanan Pending

**2. Tombol Download CSV:**
- Click untuk download file CSV lengkap
- Otomatis terbuka di Excel/Google Sheets

**3. Tabel Pesanan:**
- ID Pesanan
- Tanggal
- Pelanggan (nama & no HP)
- Status
- Total

**4. Footer:**
- Timestamp pembuatan
- Nama toko

---

## 🔄 Automated Email (Cron Job)

Untuk mengirim email otomatis secara terjadwal, perlu setup cron job. Ada beberapa opsi:

### Opsi 1: Vercel Cron Jobs (Recommended untuk Vercel)

1. Buat file `vercel.json` di root project (sudah ada)
2. Tambahkan konfigurasi cron jobs:

```json
{
  "crons": [
    {
      "path": "/api/email/cron/daily",
      "schedule": "0 18 * * *"
    }
  ]
}
```

3. Buat API endpoint `/api/email/cron/daily` yang akan memanggil fungsi kirim email

### Opsi 2: External Cron Service (Cron-job.org, EasyCron, dll)

1. Buat API endpoint untuk trigger email:
   ```
   GET /api/email/trigger?schedule=daily
   ```

2. Setup cron job di service pilihan Anda
3. Set URL ke: `https://ayamgepreksambalijo1.vercel.app/api/email/trigger?schedule=daily`

### Opsi 3: GitHub Actions

Buat workflow di `.github/workflows/email-report.yml`:

```yaml
name: Email Report
on:
  schedule:
    - cron: '0 18 * * *' # Setiap hari jam 6 PM
  workflow_dispatch:

jobs:
  send-email:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Email
        run: |
          curl -X GET "https://ayamgepreksambalijo1.vercel.app/api/email/trigger?schedule=daily"
```

---

## 📝 Environment Variables yang Dibutuhkan

| Variable | Value | Wajib |
|----------|-------|-------|
| `RESEND_API_KEY` | API key dari Resend | Ya (untuk production) |
| `DATABASE_URL` | PostgreSQL connection string | Ya |
| `NODE_ENV` | `production` | Ya |

---

## 🧪 Testing Email Report

### Development Mode (Tanpa API Key)

Jika `RESEND_API_KEY` belum diset, sistem akan berjalan dalam mode simulasi:

- ✅ Tidak akan terjadi error
- ✅ Pesan sukses akan tetap muncul
- ✅ Log akan menampilkan: "Email simulated (development mode)"
- ❌ Email tidak benar-benar dikirim

### Production Mode (Dengan API Key)

Setelah `RESEND_API_KEY` di-set di Vercel:

- ✅ Email akan benar-benar dikirim via Resend
- ✅ Dapat melihat log di Resend Dashboard
- ✅ Email akan masuk ke inbox penerima

---

## 🐛 Troubleshooting

### Issue 1: "Email service not configured"

**Solusi:**
- Pastikan `RESEND_API_KEY` sudah di-set di Vercel environment variables
- Redeploy aplikasi setelah menambah environment variable

### Issue 2: Email tidak diterima

**Cek:**
1. Cek folder **Spam** di email penerima
2. Verify domain di Resend Dashboard
3. Cek logs di Resend Dashboard untuk error details
4. Pastikan alamat email penerima benar

### Issue 3: "Failed to send email"

**Solusi:**
- Cek Resend API key apakah valid
- Pastikan kuota Resend belum habis (Free tier: 3,000 emails/month)
- Cek network connectivity dari server

### Issue 4: CSV tidak bisa di-download di email

**Solusi:**
- Pastikan email client mendukung base64 data URI
- Jika tidak support, user bisa copy data dari tabel dan paste ke Excel

---

## 💰 Biaya

**Resend Free Tier:**
- 3,000 emails per month
- 300 emails per day
- Unlimited domains
- 1 team member

Untuk penggunaan lebih tinggi, perlu upgrade ke paid plan.

---

## 🔒 Security Best Practices

1. ✅ Jangan commit `RESEND_API_KEY` ke GitHub
2. ✅ Gunakan environment variables untuk menyimpan API key
3. ✅ Limit akses ke fitur email hanya untuk admin
4. ✅ Validasi input email penerima
5. ✅ Log semua pengiriman email untuk audit

---

## 📊 Contoh Email yang Diterima

**Subject:**
```
📊 Laporan Penjualan Harian - 18/01/2025
```

**Body Preview:**
```
┌─────────────────────────────────┐
│   📊 Laporan Penjualan         │
│   Ayam Geprek Sambal Ijo      │
│   Harian                       │
│   18/01/2025                  │
├─────────────────────────────────┤
│  Total Pesanan:     15        │
│  Total Penjualan:   Rp 250K   │
│  Selesai:          12        │
│  Pending:           3         │
│                                │
│  [📥 Download CSV]             │
│                                │
│  +───────┬──────────┬──────┐   │
│  │ ID     │ Tanggal  │ Total│   │
│  ├───────┼──────────┼──────┤   │
│  │ #ABC123│ 18/01  │ Rp 45│   │
│  │ #ABC124│ 18/01  │ Rp 30│   │
│  └───────┴──────────┴──────┘   │
└─────────────────────────────────┘
```

---

## 📞 Support

Jika mengalami masalah:
1. Cek [Resend Documentation](https://resend.com/docs)
2. Cek Vercel logs di dashboard
3. Pastikan semua environment variables ter-set dengan benar

---

**Status:** ✅ Ready for Production
**Required:** RESEND_API_KEY environment variable
**Email Provider:** Resend
**Free Tier:** 3,000 emails/month

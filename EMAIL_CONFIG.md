# 📧 Email Configuration - Current Setup

## 📧 Email Sender yang Aktif

**Email Sender:** `musafir2310@gamail.com`
**Status:** ✅ Aktif (digunakan untuk mengirim laporan)

---

## 📝 Cara Mengubah Email Sender

### Metode 1: Edit File Langsung

**File:** `/src/app/api/email/send-report/route.ts`

**Cari baris ini (sekitar baris 304):**
```typescript
from: 'Ayam Geprek Sambal Ijo <musafir2310@gamail.com>'
```

**Ganti dengan email baru:**
```typescript
from: 'Ayam Geprek Sambal Ijo <email-baru@domain.com>'
```

**Contoh penggantian ke email bisnis:**
```typescript
from: 'Ayam Geprek Sambal Ijo <info@ayamgepreksambalijo.com>'
```

**Setelah edit:**
```bash
git add src/app/api/email/send-report/route.ts
git commit -m "chore: update email sender to email-baru@domain.com"
git push origin master
git push origin master:main
```

---

## 📧 Email Alternatif untuk Dipertimbangkan

### 1. **Gmail Personal** (Untuk Testing Saja - Tidak untuk Production)
- Email: `musafir2310@gmail.com` atau email Gmail lainnya
- **Cocok untuk:** Testing, development environment
- **Tidak cocok untuk production:**
  - Limit 500 emails/hari
  - Risiko dianggap spam
  - Bisa di-block kapan saja
- **Harga:** Gratis

### 2. **Email Bisnis (Recommended untuk Production)**

#### **Zoho Mail**
- URL: https://www.zoho.com/mail
- **Free Tier:** 5 emails/hari, 50 emails/bulan
- **Pro:** Kebutuhan membal unlimited
- **Cocok untuk:** Bisnis kecil-menengah

#### **SendGrid**
- URL: https://sendgrid.com
- **Free Tier:** 100 emails/hari
- **Pro:** Dengan pay-as-you-go
- **Cocok untuk:** High volume email

#### **Mailgun**
- URL: https://www.mailgun.com
- **Free Tier:** 5,000 emails/bulan
- **Pro:** Termuruk
- **Cocok untuk:** High volume dengan analytics

#### **Amazon SES**
- URL: https://aws.amazon.com/ses/
- **Free Tier:** Pay-as-you-go (tergantung penggunaan)
- **Cocok untuk:** Enterprise scale
- **Cocok untuk:** High volume email dengan konsistensi tinggi

### 3. **Hosting Email**
- **CPanel / DirectAdmin** (dari hosting)
- **Hostinger**
- **Namecheap**
- **Kelebihan:**
  - Biasanya sudah tersedia di paket hosting
  - Setup mudah via control panel
  - Biasanya include webmail
- **Kekurangan:**
  - Bergantung pada hosting
  - Batas storage quota

### 4. **SMTP Server Sendiri**
- **Postfix, Exim, Mail-in-a-Box**
- **Kelebihan:**
  - Kontrol penuh
  - Tidak ada batasan pengiriman
  - Data privacy penuh
- **Kekurangan:**
  - Perlu setup dan maintenance teknis
  - Perlu manage IP reputation
  - Perlu konfigur SPF, DKIM, DMARC
  - Perlu handle blacklist

---

## ✅ Rekomendasi untuk Ayam Geprek Sambal Ijo

### Untuk Sekarang (Testing):
- ✅ `musafir2310@gamail.com` (aktif saat ini)
- Bisa digunakan untuk testing laporan

### Untuk Production:
- **Buat email bisnis:** `info@ayamgepreksambalijo.com`
- **Alasan:**
  - Lebih profesional
  - Bisa di-scale tanpa limit
  - Meningkatkan kredibilitas bisnis
  - Tidak di-block oleh email providers
  - Bisa dibuat domain sendiri (branding lebih kuat)

### Contoh Email Bisnis yang Profesional:
- `info@ayamgepreksambalijo.com` - Laporan & info
- `admin@ayamgepreksambalijo.com` - Internal admin
- `orders@ayamgepreksambalijo.com` - Order notifications
- `support@ayamgepreksambalijo.com` - Customer support

---

## 🔍 Verifikasi Email di Resend

**Untuk email sender agar bisa digunakan, harus ter-verify:**

1. Login ke [Resend Dashboard](https://resend.com/dashboard)
2. Pergi menu **Domains** (atau **API Keys** → **Settings** → **Domains**)
3. Add domain atau email:
   - Jika pakai domain: `ayamgepreksambalijo.com`
   - Jika pakai email: `musafir2310@gmail.com`
4. Klik **Add** dan ikuti instruksi Resend:
   - Tambahkan DNS TXT record sesuai instruksi
   - Tunggu verifikasi
5. Setelah verified, email akan bisa mengirim email

---

## 📊 Email yang Dikirim Dari

**From:** `Ayam Geprek Sambal Ijo <musafir2310@gamil.com>`

**To:** Email penerima (diinput di dialog)

**Subject:** `📊 Laporan Penjualan [Harian/Mingguan/Bulanan] - DD/MM/YYYY`

**Body:** HTML email dengan:
- Ringkasan statistik (total pesanan, penjualan, selesai, pending)
- Daftar pesanan lengkap
- Link download CSV terlampir

---

## ⚠️ Penting

1. **Jangan gunakan email personal untuk production!**
   - Gunakan email bisnis untuk keaman dan profesional

2. **Segera verify domain/email di Resend**
   - Email yang belum di-verify tidak bisa mengirim email
   - Cek Resend Dashboard → Domains → Status

3. **Monitor email deliverability**
   - Cek folder Spam jika email tidak diterima
   - Cek Resend Dashboard untuk melihat delivery status
   - Pantau bounce rate (email gagal terkirim)

4. **Backup email sender**
   - Simpan backup email alternatif di tempat aman
   - Jika email utama ter-block, ganti dengan email backup

---

## 🔧 Troubleshooting

### Issue 1: "Email tidak terkirim"

**Cek:**
1. Pastikan `RESEND_API_KEY` di-set di Vercel environment variables
2. Cek apakah email sudah di-verify di Resend Dashboard
3. Cek Resend API logs untuk error details
4. Cek quota Resend (free tier: 3,000 emails/month)

### Issue 2: "Email masuk ke Spam folder"

**Solusi:**
- Cek content email, pastikan tidak mengandung kata-kata spam
- Buka email, klik "Not Spam" jika salah masuk spam
- Contact Resend support jika terus di-flagged sebagai spam
- Bawa email dari Spam ke Inbox

### Issue 3: "Invalid Sender Domain"

**Solusi:**
- Verify domain di Resend Dashboard
- Pastikan DNS record benar
- Tunggu beberapa jam setelah setup awal
- Cek Resend logs untuk error spesifik

### Issue 4: "Rate limit exceeded"

**Solusi:**
- Free tier Resend: 3,000 emails/month
- Jika terlampa, upgrade ke paid plan atau tunggu reset (bulanan berikutnya)
- Kurangi frekuensi pengiriman laporan (daily → weekly → monthly)

---

## 📞 Support

**Resend Documentation:**
- Email: support@resend.com
- Docs: https://resend.com/docs
- Status: https://resend.com/status

**GitHub Issues:**
- Report bugs di: https://github.com/resendlabs/resend-nodejs/issues

---

**Status:** ✅ Email sender aktif: `musafir2310@gamail.com`
**Provider:** Resend
**Next Step:** Verify email di Resend Dashboard jika belum dilakukan

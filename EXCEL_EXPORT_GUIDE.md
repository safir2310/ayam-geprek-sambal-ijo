# 📊 Excel Export Feature Guide

## Overview

Fitur export laporan penjualan kini mendukung dua format: **CSV** dan **Excel (.xlsx)**. Admin bisa memilih format sesuai kebutuhan mereka.

---

## 🔧 Installation

Library yang digunakan:
- **xlsx** (SheetJS/ExcelJS) - Library populer untuk Excel file generation

Sudah otomatis terinstall:
```bash
bun add xlsx
bun add -d @types/xlsx
```

---

## 📊 Format Export yang Tersedia

### 1. **CSV (Comma-Separated Values)**

**Keuntungan:**
- ✅ Ukuran file kecil
- ✅ Kompatibel dengan semua aplikasi spreadsheet (Excel, Google Sheets, Numbers, dll)
- ✅ Mudah di-parse oleh sistem lain
- ✅ Universal format

**Kekurangan:**
- ❌ Tidak ada formatting khusus
- ❌ Tidak ada support multiple sheets
- ❌ Tidak ada formula atau styling

**Kapan Gunakan:**
- Kebutuhan data mentah untuk di-import ke sistem lain
- Ukuran file harus kecil
- Kompatibilitas maksimum

---

### 2. **Excel (.xlsx)**

**Keuntungan:**
- ✅ Rich formatting dan styling
- ✅ Automatic summary statistics di awal file
- ✅ Support multiple sheets (untuk fitur masa depan)
- ✅ Column width yang otomatis
- ✅ Professional appearance

**Fitur Khusus Excel:**
- Ringkasan statistik di row pertama:
  - Total Pesanan
  - Total Penjualan
  - Pesanan Selesai
  - Pesanan Pending
- Header yang jelas dan terformat
- Column widths yang optimal untuk readability

**Kapan Gunakan:**
- Laporan untuk presentasi
- Analisis data di Excel
- Perlu format khusus
- Laporan profesional

---

## 📖 Cara Menggunakan

### Export Laporan:

1. **Buka Dashboard Admin**
   - http://localhost:3000/admin (development)
   - https://ayamgepreksambalijo1.vercel.app/ (production)

2. **Klik Tombol "Export Laporan"** (hijau gradient)

3. **Pilih Format File**
   - **CSV** - Klik tombol kiri
   - **Excel** - Klik tombol kanan

4. **Set Filter (Opsional)**
   - Tanggal mulai (opsional)
   - Tanggal akhir (opsional)
   - Status pesanan (opsional)

5. **Klik "Export"**
   - Tombol akan menunjukkan format yang dipilih:
     - "Export CSV" untuk CSV
     - "Export Excel" untuk Excel

6. **File akan otomatis di-download**

---

## 📊 Isi File Export

### Format CSV:
```
ID Pesanan,Tanggal,Nama Pelanggan,No HP,Alamat,Status,Total,Item Pesanan
"#ABC123","1/1/2025, 10:30:00 AM","Budi Santoso","085260812758","Jl. Contoh No. 123","completed","Rp 45000","Ayam Geprek Sambal Ijo (x2); Es Teh Manis (x1)"
```

### Format Excel:

**Sheet 1: Laporan Penjualan**

**Row 1-2: Summary Statistics**
```
A          B                    C                    D                    E
           RINGKASAN             Total Pesanan         Total Penjualan       Pesanan Selesai      Pesanan Pending
                                15                   Rp 250.000            12                   3
```

**Row 3: Header**
```
ID Pesanan  Tanggal              Nama Pelanggan   No HP        Alamat              Status      Total     Item Pesanan
```

**Row 4+: Data Pesanan**
```
#ABC123     1/1/2025, 10:30    Budi Santoso      085260812758  Jl. Contoh No. 123  completed  Rp 45.000  Ayam Geprek Sambal Ijo (x2); Es Teh Manis (x1)
#ABC124     1/1/2025, 11:15    Ani Wati          08123456789  Jl. Test No. 456     pending    Rp 30.000  Paket Hemat 1 (x1)
```

---

## 🎨 Perbedaan Visual

### CSV:
- **Plain text** tanpa formatting
- Tampilan sederhana
- Tidak ada ringkasan otomatis

### Excel:
- **Rich formatting** dengan:
  - Header bold
  - Summary row dengan highlight
  - Column widths yang optimal
  - Professional appearance

---

## 💡 Best Practices

### Kapan Gunakan CSV:
- Data mentah untuk sistem lain
- Integrasi dengan API/program lain
- Ukuran file harus minimal
- Import ke database lain

### Kapan Gunakan Excel:
- Presentasi ke manajemen
- Analisis data di Excel dengan formula
- Laporan yang butuh tampilan profesional
- Perlu multiple sheets (fitur masa depan)
- Perlu formatting khusus

---

## 🔧 Customization

### Mengubah Column Widths (Excel):

Edit fungsi `exportToExcel` di `src/app/admin/page.tsx`:

```typescript
const colWidths = [
  { wch: 15 }, // ID Pesanan
  { wch: 20 }, // Tanggal
  { wch: 25 }, // Nama Pelanggan
  { wch: 15 }, // No HP
  { wch: 30 }, // Alamat
  { wch: 15 }, // Status
  { wch: 15 }, // Total
  { wch: 50 }  // Item Pesanan
]
```

`wch` = character width (lebar kolom dalam karakter)

### Menambah Field di Export:

Tambahkan field di array `headers` dan mapping data di `data`:

```typescript
const headers = [
  'ID Pesanan',
  'Tanggal',
  'Nama Pelanggan',
  'No HP',
  'Alamat',
  'Status',
  'Total',
  'Item Pesanan',
  'Catatan' // Field baru
]

const data = filteredOrders.map(order => {
  const items = order.items.map(item => `${item.product.name} (x${item.quantity})`).join('; ')
  return {
    'ID Pesanan': `#${order.id.slice(-6).toUpperCase()}`,
    'Tanggal': new Date(order.createdAt).toLocaleString('id-ID'),
    'Nama Pelanggan': order.userName,
    'No HP': order.userPhone,
    'Alamat': order.userAddress,
    'Status': order.status,
    'Total': order.total,
    'Item Pesanan': items,
    'Catatan': order.whatsappMessage || '-' // Field baru
  }
})
```

---

## 🐛 Troubleshooting

### Issue 1: Excel file tidak bisa dibuka

**Solusi:**
- Pastikan aplikasi Excel (Microsoft Excel, Google Sheets, Numbers) versi terbaru
- Cek apakah file tidak corrupt saat download
- Coba buka di Google Sheets jika Excel bermasalah

### Issue 2: Tanggal format salah di Excel

**Solusi:**
- Format tanggal menggunakan `toLocaleString('id-ID')` sesuai locale Indonesia
- Jika ingin format lain, ubah di fungsi `exportToExcel`:
  ```typescript
  'Tanggal': new Date(order.createdAt).toISOString().slice(0, 19).replace('T', ' ')
  ```

### Issue 3: Total angka di Excel tidak terformat sebagai currency

**Solusi:**
- Saat ini total disimpan sebagai angka biasa di Excel
- Untuk format currency, buka Excel dan ubah cell format ke:
  - Format: Number → Currency
  - Symbol: Rp
  - Decimal places: 0

Atau gunakan formula Excel: `=TEXT(D2,"Rp 0")`

### Issue 4: Item Pesanan terlalu panjang di Excel

**Solusi:**
- Column width sudah di-set ke 50 karakter
- Jika masih terlalu panjang, ubah `wch` untuk kolom terakhir:
  ```typescript
  { wch: 100 }  // Item Pesanan (lebih panjang)
  ```

---

## 📊 Export Summary

| Feature | CSV | Excel (.xlsx) |
|---------|-----|-------------|
| File Size | Kecil (~5-10KB) | Sedang (~20-50KB) |
| Formatting | Tidak ada | Rich formatting |
| Summary Statistics | Tidak ada | Otomatis di baris pertama |
| Multiple Sheets | Tidak | Tersedia (masa depan) |
| Compatibility | Maksimal | Modern spreadsheet apps |
| Use Case | Data integration | Presentation & Analysis |
| Professional Look | Sederhana | Profesional |

---

## 🚀 Future Enhancements

Fitur yang bisa ditambahkan di masa depan:

1. **Multiple Sheets**
   - Sheet 1: Summary Statistics
   - Sheet 2: Detailed Orders
   - Sheet 3: Product Performance

2. **Advanced Formatting**
   - Header styling (bold, color, background)
   - Conditional formatting (warna untuk status)
   - Data validation dropdowns

3. **Charts**
   - Sales chart otomatis
   - Category breakdown
   - Trend analysis

4. **Custom Reports**
   - Pilih kolom mana yang mau di-export
   - Custom column names
   - Custom date range presets (last 7 days, this month, etc.)

---

## 📋 Checklist

Sebelum menggunakan fitur export:

- [ ] Pilih format yang sesuai kebutuhan (CSV atau Excel)
- [ ] Set filter tanggal sesuai periode laporan
- [ ] Pilih status pesanan yang diinginkan
- [ ] Pastikan ada data sebelum export

---

## 💡 Tips

1. **Untuk quick export:** Gunakan format CSV (lebih cepat)
2. **Untuk presentasi ke manajemen:** Gunakan format Excel (lebih profesional)
3. **Untuk data analysis:** Gunakan Excel (bisa pakai formula)
4. **Untuk import ke sistem lain:** Gunakan CSV (universal format)

---

**Status:** ✅ Ready for Production
**Library:** xlsx (SheetJS)
**Formats Supported:** CSV, Excel (.xlsx)
**Default Format:** CSV

# 📦 Cara Install Extension

## Untuk User (3 Langkah Mudah)

### 1. Download Extension
- Buka: https://github.com/YOUR_USERNAME/bookmark-extension/releases
- Download file `.zip` terbaru (contoh: `bookmark-extension-v1.0.0.zip`)
- Extract file ZIP ke folder di komputer Anda

### 2. Install ke Chrome
- Buka Chrome, ketik di address bar: `chrome://extensions/`
- Aktifkan **"Developer mode"** (toggle di pojok kanan atas)
- Klik **"Load unpacked"**
- Pilih folder hasil extract
- ✅ Selesai! Extension terinstall

### 3. Mulai Menggunakan
- Klik icon extension di toolbar Chrome
- Login atau signup dengan email
- Mulai simpan bookmark!

---

## Untuk Developer (Build Sendiri)

```bash
git clone https://github.com/YOUR_USERNAME/bookmark-extension.git
cd bookmark-extension/extension
npm install
npm run build
# Load unpacked dari folder 'dist'
```

---

## Troubleshooting

**Extension tidak muncul di toolbar**
- Klik icon puzzle di toolbar → Pin extension

**Extension error**
- Pastikan sudah extract ZIP (jangan load dari file ZIP langsung)
- Cek console di chrome://extensions/

**Tidak bisa login**
- Pastikan backend API sudah running
- Cek koneksi internet

---

## Update Extension

Jika ada versi baru:
1. Download versi baru dari Releases
2. Extract ke folder
3. Di `chrome://extensions/`, klik reload di extension card

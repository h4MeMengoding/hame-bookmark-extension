# Token Refresh Implementation - Persistent Login

## Masalah Sebelumnya
Extension sering logout otomatis setelah PC dimatikan atau browser ditutup lama, dengan error:
- `401 Unauthorized - Invalid token`
- User harus login ulang setiap kali

## Solusi yang Diimplementasikan

### 1. **Refresh Token Mechanism**
Implementasi sistem refresh token yang memungkinkan extension untuk otomatis memperbarui access token yang expired tanpa perlu login ulang.

### 2. **Perubahan Backend**
- ✅ Update endpoint `/api/auth/login` untuk return `refreshToken` dan `expiresIn`
- ✅ Update endpoint `/api/auth/signup` untuk return `refreshToken` dan `expiresIn`
- ✅ Buat endpoint baru `/api/auth/refresh` untuk refresh access token

### 3. **Perubahan Extension**
- ✅ Update storage service untuk simpan dan manage refresh token
- ✅ Update auth service untuk handle refresh token
- ✅ Update API service dengan auto-retry mechanism:
  - Saat dapat 401 error, otomatis coba refresh token
  - Retry request dengan new access token
  - Hanya logout jika refresh token juga expired

### 4. **Cara Kerja**
1. User login → Dapat access token + refresh token
2. Access token expired setelah ~1 jam
3. Saat request dapat 401 error:
   - Extension otomatis call `/api/auth/refresh` dengan refresh token
   - Dapat new access token + new refresh token
   - Retry request yang gagal dengan new token
4. User tetap login sampai:
   - Refresh token benar-benar expired (biasanya 30 hari)
   - User klik logout manual

## Keuntungan
- ✨ **Persistent Login**: User tetap login bahkan setelah PC dimatikan/browser ditutup
- ✨ **Seamless Experience**: Auto-refresh terjadi di background tanpa user notice
- ✨ **Secure**: Tetap menggunakan short-lived access token untuk security
- ✨ **Manual Logout Only**: Hanya logout saat user klik tombol logout

## Testing
1. Login ke extension
2. Tutup browser/PC
3. Buka extension lagi setelah beberapa jam/hari
4. Extension otomatis refresh token dan load bookmarks tanpa perlu login ulang

## Catatan Teknis
- Access token: Expired setelah ~1 jam (secure)
- Refresh token: Expired setelah ~30 hari (dapat disesuaikan di Supabase)
- Auto-refresh: Transparent untuk user
- Error handling: Jika refresh gagal, baru minta login ulang

# Persistent Authentication

## Overview
Extension ini sekarang mengimplementasikan **persistent authentication** - user akan tetap login bahkan setelah menutup browser atau extension, kecuali user sendiri yang melakukan logout.

## Cara Kerja

### 1. Token Storage
- Token disimpan di `chrome.storage.local` yang bersifat **permanent**
- Token tidak akan hilang meskipun:
  - Browser ditutup
  - Extension ditutup/dibuka lagi
  - Computer di-restart
  
### 2. Auto-Login
- Setiap kali extension dibuka, sistem akan:
  1. Cek apakah ada token tersimpan
  2. Jika ada token → user otomatis login
  3. Jika tidak ada token → tampilkan login page

### 3. Logout Behavior
User akan logout **HANYA** jika:
- User menekan tombol "Logout" di ProfileMenu
- Token invalid/expired (server menolak token)

### 4. Token Validation
- Token divalidasi di **server-side** setiap kali request API
- Jika token invalid/expired:
  - Auto-logout
  - Clear semua auth data
  - Redirect ke login page

## File yang Dimodifikasi

### 1. `extension/src/services/storage.js`
- ✅ Added `removeUserData()` - hapus user data saat logout
- ✅ Updated `clearStorage()` - clear semua data

### 2. `extension/src/services/auth.js`
- ✅ Updated `logout()` - hapus token DAN user data
- ✅ Updated `checkAuth()` - return token juga
- ✅ Added `validateToken()` - validasi token dengan backend

### 3. `extension/src/App.jsx`
- ✅ Renamed `checkAuthentication()` → `restoreSession()`
- ✅ Added auto-restore session on mount
- ✅ Updated `handleLogout()` - async dengan proper error handling
- ✅ Added console logs untuk debugging

### 4. `extension/src/services/api.js`
- ✅ Added 401 error handling
- ✅ Auto-logout jika token invalid
- ✅ Auto-reload extension setelah logout

## User Experience

### Scenario 1: User Login
1. User login dengan email/password ✅
2. Token disimpan di chrome.storage.local ✅
3. User dapat menggunakan extension ✅

### Scenario 2: User Menutup Browser
1. User menutup browser
2. **Token tetap tersimpan** ✅
3. User buka browser lagi
4. Buka extension → **Auto-login** ✅
5. Langsung masuk ke BookmarksPage ✅

### Scenario 3: User Logout Manual
1. User klik ProfileMenu
2. Klik "Logout"
3. Token dan user data dihapus ✅
4. Redirect ke LoginPage ✅

### Scenario 4: Token Invalid/Expired
1. User membuat request ke API
2. Server return 401 Unauthorized
3. Extension auto-logout ✅
4. Clear semua auth data ✅
5. Reload → LoginPage ✅

## Security Considerations

### ✅ Secure
- Token divalidasi di server setiap request
- Auto-logout jika token invalid
- Token tidak exposed di URL atau console
- chrome.storage.local hanya accessible oleh extension

### ⚠️ Important Notes
- Token tersimpan di local storage (tidak encrypted)
- Pastikan HTTPS untuk API endpoint
- Implement token rotation di backend untuk keamanan lebih baik
- Consider adding refresh token mechanism

## Testing

### Test Case 1: Login Persistence
1. Login ke extension
2. Tutup extension
3. Buka extension lagi
4. **Expected**: Auto-login, langsung ke BookmarksPage

### Test Case 2: Logout
1. Klik ProfileMenu → Logout
2. **Expected**: Kembali ke LoginPage
3. Refresh extension
4. **Expected**: Tetap di LoginPage (tidak auto-login)

### Test Case 3: Invalid Token
1. Login ke extension
2. Hapus user di backend/database
3. Coba fetch bookmarks
4. **Expected**: Auto-logout dan redirect ke LoginPage

## Future Enhancements

- [ ] Implement refresh token mechanism
- [ ] Add "Remember Me" option
- [ ] Add session timeout warning
- [ ] Encrypt token di storage
- [ ] Add biometric authentication option

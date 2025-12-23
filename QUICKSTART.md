# ✅ QUICK START GUIDE

## Status Saat Ini

✅ Backend running di: **http://localhost:3000**  
✅ Database tables created (Prisma migrated)  
✅ Extension built successfully  

---

## 🚀 Langkah Selanjutnya

### 1. Create Test User di Supabase

Ada 2 cara:

#### Option A: Via Supabase Dashboard (RECOMMENDED)
1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Klik **Authentication** → **Users**
4. Klik **Add User** → **Create New User**
5. Isi:
   - Email: `test@example.com`
   - Password: `test123456`
   - Auto Confirm User: ✅ (centang ini!)
6. Click **Create User**

#### Option B: Via SQL Editor
1. Buka **SQL Editor** di Supabase Dashboard
2. Paste dan run:

```sql
-- Create user dengan email confirmation
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  confirmation_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'test@example.com',
  crypt('test123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  ''
);
```

---

### 2. Load Extension ke Chrome

1. Buka Chrome browser
2. Ketik di address bar: `chrome://extensions/`
3. Enable **Developer mode** (toggle di kanan atas)
4. Click **Load unpacked**
5. Browse ke folder: `C:\Users\Ilhame\Documents\Code\bookmark-extension\extension\dist`
6. Click **Select Folder**

**Note**: Icon mungkin tidak muncul (itu normal, extension tetap berfungsi)

---

### 3. Test Extension

1. **Click extension icon** di Chrome toolbar
2. **Login** dengan:
   - Email: `test@example.com`
   - Password: `test123456`
3. Setelah login, **Add Bookmark**:
   - Title: `Google`
   - URL: `https://www.google.com`
4. Click bookmark untuk buka di tab baru

---

## 🐛 Troubleshooting

### ❌ Login Failed
- Pastikan user sudah dibuat di Supabase
- Check email/password benar
- Pastikan email confirmed (centang "Auto Confirm")

### ❌ Extension tidak muncul
- Pastikan pilih folder `dist` (bukan folder `extension`)
- Check console di chrome://extensions untuk error

### ❌ CORS Error
- Pastikan backend running di http://localhost:3000
- Check browser console (F12) untuk detail error

### ❌ Failed to fetch
- Backend harus running: `cd backend && npm run dev`
- Check API URL di extension config

---

## 📝 Test Checklist

- [ ] Backend running tanpa error
- [ ] Extension loaded di Chrome
- [ ] Login berhasil
- [ ] Add bookmark berhasil
- [ ] Click bookmark membuka tab baru
- [ ] Delete bookmark berhasil
- [ ] Logout berhasil

---

## 🎨 Optional: Add Icons (For Better UI)

Untuk menambahkan icon extension:

1. Buka https://www.svgbackgrounds.com/ atau design sendiri
2. Convert SVG ke PNG (16x16, 32x32, 48x48, 128x128)
3. Save ke: `extension/dist/icons/`
4. Nama file: `icon16.png`, `icon32.png`, `icon48.png`, `icon128.png`
5. Reload extension di Chrome

---

## 🚀 Next Steps

Sekarang extension Anda siap digunakan! Anda bisa:

- Customize UI colors di `tailwind.config.js`
- Tambah fitur search bookmarks
- Add bookmark folders/categories
- Implement drag & drop sorting
- Add keyboard shortcuts

Happy coding! 🎉

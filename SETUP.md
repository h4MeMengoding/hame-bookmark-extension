# 🚀 Setup Guide - Bookmark Manager Extension

Panduan lengkap untuk setup dan menjalankan Chrome Extension Bookmark Manager.

---

## 📋 Prerequisites

Sebelum memulai, pastikan Anda sudah install:

- **Node.js** (v18 atau lebih baru)
- **npm** atau **pnpm**
- **Git**
- **Chrome Browser**
- **Supabase Account** (gratis)

---

## 🗄️ Setup Supabase

### 1. Create New Project di Supabase

1. Buka [supabase.com](https://supabase.com)
2. Sign up / Login
3. Click **"New Project"**
4. Isi:
   - Project name: `bookmark-manager`
   - Database password: (simpan password ini!)
   - Region: pilih yang terdekat
5. Wait ~2 minutes untuk project setup

### 2. Enable Email Auth

1. Di Supabase Dashboard → **Authentication** → **Providers**
2. Enable **Email** provider
3. Disable **"Confirm email"** untuk development (opsional)

### 3. Create User untuk Testing

```sql
-- Di Supabase SQL Editor, jalankan:
-- Dashboard → SQL Editor → New Query

-- Create test user (password: test123)
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
  confirmation_token,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'test@example.com',
  crypt('test123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '{"provider":"email","providers":["email"]}',
  '{}'
);
```

### 4. Get API Keys

Di Supabase Dashboard → **Settings** → **API**

Catat:
- **Project URL**: `https://xxx.supabase.co`
- **anon public key**: `eyJhbGciOiJI...`
- **service_role key**: `eyJhbGciOiJI...` ⚠️ RAHASIA!

---

## 🔧 Setup Backend (Next.js)

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment Variables

```bash
# Copy .env.example ke .env
cp .env.example .env
```

Edit `backend/.env`:
```env
# Dari Supabase Dashboard → Settings → Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Dari Supabase Dashboard → Settings → API
SUPABASE_URL="https://[PROJECT-REF].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJI..." # service_role key
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJI..." # anon key

# Local development
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### 3. Setup Database dengan Prisma

```bash
# Generate Prisma Client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# (Optional) Open Prisma Studio untuk lihat database
npm run prisma:studio
```

### 4. Run Backend Server

```bash
npm run dev
```

Backend sekarang running di `http://localhost:3000` ✅

### 5. Test API (Opsional)

```bash
# Test login endpoint
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Expected response:
{
  "token": "eyJhbGc...",
  "user": {
    "id": "...",
    "email": "test@example.com"
  }
}
```

---

## 🎨 Setup Extension (React)

### 1. Install Dependencies

```bash
cd extension
npm install
```

### 2. Setup Environment (Opsional untuk Development)

Create `extension/.env`:
```env
VITE_API_URL="http://localhost:3000"
```

**Note**: Untuk production, edit `vite.config.js` langsung.

### 3. Build Extension

```bash
# Development build (auto rebuild on change)
npm run dev

# Production build
npm run build
```

Build output ada di folder `extension/dist/`

---

## 🌐 Load Extension ke Chrome

### 1. Buka Chrome Extensions

1. Buka Chrome
2. Ketik di address bar: `chrome://extensions/`
3. Enable **Developer mode** (toggle di kanan atas)

### 2. Load Extension

1. Click **"Load unpacked"**
2. Pilih folder `extension/dist`
3. Extension icon akan muncul di toolbar

### 3. Pin Extension (Opsional)

Click icon puzzle di toolbar → Pin **Bookmark Manager**

---

## ✅ Test Extension

### 1. Login

1. Click extension icon
2. Login dengan:
   - Email: `test@example.com`
   - Password: `test123`

### 2. Add Bookmark

1. Click **"Add"** button
2. Isi:
   - Title: `Google`
   - URL: `https://google.com`
3. Click **"Save Bookmark"**

### 3. Open Bookmark

Click bookmark card → New tab akan terbuka dengan URL

### 4. Delete Bookmark

Hover bookmark → Click trash icon → Confirm

---

## 🐛 Troubleshooting

### ❌ "Failed to fetch" error di extension

**Cause**: Backend tidak running atau URL salah

**Solution**:
```bash
# Pastikan backend running
cd backend
npm run dev

# Check URL di extension/vite.config.js
# Harus: http://localhost:3000 (tanpa trailing slash)
```

### ❌ "Unauthorized - Invalid token"

**Cause**: Token expired atau invalid

**Solution**:
1. Logout dari extension
2. Login ulang
3. Token baru akan di-generate

### ❌ Prisma generate error

**Cause**: DATABASE_URL salah atau Supabase down

**Solution**:
```bash
# Validate DATABASE_URL format
# Should be: postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres

# Test connection
npx prisma db push
```

### ❌ CORS error

**Cause**: Backend tidak allow origin dari extension

**Solution**:
Edit `backend/next.config.js`:
```javascript
{ key: 'Access-Control-Allow-Origin', value: '*' }
```

### ❌ Extension tidak muncul setelah load unpacked

**Cause**: manifest.json error atau folder salah

**Solution**:
1. Pastikan pilih folder `extension/dist` (bukan `extension`)
2. Check console di `chrome://extensions/` untuk error
3. Rebuild: `cd extension && npm run build`

---

## 📦 Production Deployment

### Deploy Backend ke Vercel

```bash
cd backend

# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

Set environment variables di Vercel Dashboard:
- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Build Extension untuk Production

1. Update `extension/vite.config.js`:
```javascript
define: {
  'process.env.VITE_API_URL': JSON.stringify('https://your-api.vercel.app')
}
```

2. Build:
```bash
cd extension
npm run build
```

3. Zip folder `dist/`:
```bash
zip -r bookmark-extension.zip dist/
```

4. Upload ke Chrome Web Store

---

## 🎯 Next Steps

- [ ] Customize UI theme colors di `tailwind.config.js`
- [ ] Add bookmark tags/categories
- [ ] Implement bookmark search
- [ ] Add bookmark import/export
- [ ] Add keyboard shortcuts
- [ ] Implement bookmark folders

---

## 📞 Need Help?

- **Supabase Docs**: https://supabase.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Chrome Extension Docs**: https://developer.chrome.com/docs/extensions/
- **Vite Docs**: https://vitejs.dev/

Happy coding! 🚀

# 🚀 Deployment Guide - Favicon System

## 📋 Pre-requisites

- [x] Backend: Next.js deployed (Vercel/VPS)
- [x] Extension: React + Vite build ready
- [x] Environment variables configured

## 🔧 Backend Deployment

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

```bash
# .env atau .env.local
DATABASE_URL="..."
SUPABASE_URL="..."
SUPABASE_KEY="..."
```

### 3. Build & Deploy

#### Vercel (Recommended)
```bash
vercel --prod
```

#### VPS / Docker
```bash
npm run build
npm start
```

### 4. Test Endpoint

```bash
# Ganti dengan URL production Anda
curl "https://your-backend.vercel.app/api/favicon?url=https://github.com"
```

**Expected Response:**
```json
{
  "icon": "https://github.githubassets.com/favicons/favicon.svg",
  "cached": false
}
```

## 🎨 Frontend (Extension) Deployment

### 1. Update Environment Variable

```bash
# extension/.env
VITE_API_URL="https://your-backend.vercel.app"
```

### 2. Build Extension

```bash
cd extension
npm install
npm run build
```

### 3. Verify Build

```bash
# Pastikan dist/ folder ada
ls dist/

# Output harus ada:
# - index.html
# - assets/
# - icons/
# - manifest.json
```

### 4. Package Extension

```bash
# Windows
./package-extension.ps1

# Manual (alternative)
# Zip semua isi folder dist/ (bukan folder dist itu sendiri)
```

### 5. Load Extension (Testing)

1. Buka Chrome → `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select folder `dist/`

### 6. Test Favicon Loading

1. Buka extension popup
2. Add bookmark baru (contoh: https://github.com)
3. Verifikasi favicon muncul (bukan fallback icon)
4. Check console untuk errors

## 🧪 Testing Checklist

### Backend
- [ ] `/api/favicon` endpoint accessible
- [ ] Returns valid JSON response
- [ ] Cache working (second call faster)
- [ ] Handles invalid URLs gracefully
- [ ] Timeout protection working (10s max)

### Frontend
- [ ] Extension loads without errors
- [ ] Favicons display correctly
- [ ] Fallback icon shows when needed
- [ ] Cache reduces API calls
- [ ] No CORS errors in console

### Integration
- [ ] Google Sheets ≠ Google Docs (different favicons)
- [ ] GitHub subdomain favicons correct
- [ ] Loading state visible
- [ ] Error handling works
- [ ] Batch loading efficient

## 🐛 Common Issues

### Issue: CORS Error
**Solution:**
```typescript
// backend/pages/api/favicon.ts
// Tambahkan di handler:
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET');
```

### Issue: Image not loading (CSP violation)
**Solution:**
```json
// extension/manifest.json
{
  "content_security_policy": {
    "extension_pages": "script-src 'self'; object-src 'self'; img-src 'self' data: https: http:"
  }
}
```

### Issue: "Failed to fetch" from extension
**Solution:**
- Verify `VITE_API_URL` di `.env` benar
- Pastikan backend deployed dan accessible
- Check `host_permissions` di manifest.json

### Issue: All favicons show default icon
**Solution:**
- Check backend logs (Vercel logs / VPS logs)
- Verify cheerio dependency installed: `npm list cheerio`
- Test endpoint directly dengan curl

### Issue: Slow loading
**Solution:**
- Use `preloadFavicons()` untuk batch loading
- Increase cache duration jika perlu
- Consider database cache untuk persistence

## 📊 Performance Monitoring

### Backend Metrics
```bash
# Vercel Analytics
- Average response time: <500ms (first fetch)
- Average response time: <10ms (cached)
- Error rate: <1%
```

### Frontend Metrics
```javascript
// Log cache hit rate
console.log('Cache hit rate:', 
  cacheHits / (cacheHits + cacheMisses) * 100 + '%'
);
```

## 🔒 Security Checklist

- [ ] Rate limiting configured (optional)
- [ ] Environment variables secured
- [ ] No sensitive data in favicon cache
- [ ] Timeout protection active
- [ ] Input validation (URL format)
- [ ] HTTPS enforced in production

## 🚀 Production URLs

Update these after deployment:

```bash
# Backend
Production: https://your-backend.vercel.app
Dev: http://localhost:3000

# Extension
Chrome Web Store: [Coming soon]
```

## 📝 Rollback Plan

### If favicon system fails:

1. **Backend Rollback:**
   ```bash
   # Vercel
   vercel rollback [deployment-url]
   
   # VPS
   git checkout previous-commit
   npm run build && pm2 restart backend
   ```

2. **Frontend Fallback:**
   ```javascript
   // Temporary: Gunakan external API
   const getFavicon = (url) => {
     const domain = new URL(url).hostname;
     return `https://www.google.com/s2/favicons?domain=${domain}`;
   };
   ```

## ✅ Deployment Verification

Run this checklist after deployment:

```bash
# 1. Test backend API
curl "https://your-backend.vercel.app/api/favicon?url=https://github.com"

# 2. Test from extension console
fetch('https://your-backend.vercel.app/api/favicon?url=https://github.com')
  .then(r => r.json())
  .then(console.log)

# 3. Check cache
# Panggil endpoint yang sama 2x, lihat cached: true pada call kedua

# 4. Test different URLs
# Google Sheets vs Docs harus berbeda favicon
```

---

**Last Updated:** 25 Desember 2025  
**Status:** Ready for Production 🎉

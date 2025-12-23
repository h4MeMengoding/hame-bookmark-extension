# 🔐 Security Best Practices

## ✅ YANG HARUS DILAKUKAN (DO)

### 1. Token Management
- ✅ Simpan access token di `chrome.storage.local` (encrypted by Chrome)
- ✅ JANGAN simpan password di extension
- ✅ Validasi token di setiap API request
- ✅ Implement token refresh mechanism (optional)
- ✅ Clear token saat logout

### 2. API Security
- ✅ Gunakan HTTPS untuk semua API calls (wajib untuk production)
- ✅ Validate dan sanitize semua user input (title, URL)
- ✅ Implement rate limiting di backend API
- ✅ Gunakan Bearer token authentication
- ✅ Set proper CORS headers di backend

### 3. Environment Variables
```javascript
// Backend (.env) - TIDAK BOLEH di-commit
DATABASE_URL="postgresql://..."
SUPABASE_SERVICE_ROLE_KEY="xxx"  // RAHASIA!
SUPABASE_URL="https://xxx.supabase.co"

// Extension (vite.config.js)
VITE_API_URL="https://api.yourdomain.com"  // Public URL
```

### 4. Database Security
- ✅ Gunakan Prisma ORM untuk prevent SQL injection
- ✅ Enable Row Level Security (RLS) di Supabase
- ✅ Validate user ownership sebelum delete/update
- ✅ Use prepared statements (Prisma handle otomatis)

### 5. Extension Permissions
```json
{
  "permissions": [
    "storage",  // Minimal permission needed
    "tabs"      // Untuk open bookmarks
  ]
}
```
- ✅ Request minimal permissions yang dibutuhkan
- ✅ JANGAN request `<all_urls>` jika tidak perlu

---

## ❌ YANG TIDAK BOLEH DILAKUKAN (DON'T)

### 1. JANGAN Expose Secrets di Extension
```javascript
// ❌ SALAH - Jangan lakukan ini!
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbG...";  // BAHAYA!
const API_SECRET = "secret123";

// ✅ BENAR - Secrets hanya di backend
// Extension hanya simpan user access token
```

### 2. JANGAN Jalankan Prisma di Extension
```javascript
// ❌ SALAH - Prisma tidak bisa jalan di browser
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ✅ BENAR - Prisma hanya di backend (Next.js)
// Extension fetch data lewat API
```

### 3. JANGAN Simpan Sensitive Data di chrome.storage.sync
```javascript
// ❌ SALAH - chrome.storage.sync di-sync ke semua device
await chrome.storage.sync.set({ password: "xxx" });

// ✅ BENAR - Gunakan chrome.storage.local untuk token
await chrome.storage.local.set({ auth_token: "xxx" });
```

### 4. JANGAN Trust User Input
```javascript
// ❌ SALAH - Direct execution tanpa validasi
const url = userInput;
eval(url);  // BAHAYA!

// ✅ BENAR - Validate URL format
try {
  new URL(url);  // Throws error if invalid
  chrome.tabs.create({ url });
} catch {
  alert('Invalid URL');
}
```

---

## 🛡️ Production Checklist

### Backend Deployment
- [ ] Set environment variables di hosting (Vercel/Railway)
- [ ] Enable HTTPS
- [ ] Configure CORS dengan specific origins
- [ ] Set up rate limiting (10 req/min per user)
- [ ] Enable Prisma query logging untuk monitoring
- [ ] Set up error tracking (Sentry, LogRocket)

### Extension Deployment
- [ ] Update manifest.json version
- [ ] Build production (`npm run build`)
- [ ] Test di Chrome dengan `dist/` folder
- [ ] Update `VITE_API_URL` ke production URL
- [ ] Minify assets (Vite handle otomatis)
- [ ] Zip `dist/` folder untuk upload

### Supabase Configuration
```sql
-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can only manage their bookmarks
CREATE POLICY "Users can manage own bookmarks" ON bookmarks
  FOR ALL USING (auth.uid() = userId);
```

### API Rate Limiting (Next.js Middleware)
```typescript
// middleware/rateLimit.ts
import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many requests, please try again later'
});
```

---

## 🔍 Security Audit

### Test Scenarios
1. **Auth Bypass**: Coba access `/api/bookmarks` tanpa token
2. **CSRF**: Validate token origin
3. **SQL Injection**: Test dengan input `'; DROP TABLE bookmarks; --`
4. **XSS**: Test dengan input `<script>alert('xss')</script>`
5. **IDOR**: Coba delete bookmark milik user lain

### Tools untuk Security Testing
- **OWASP ZAP** - Security scanner
- **Postman** - API testing
- **Chrome DevTools** - Network inspection
- **Burp Suite** - Advanced testing

---

## 📞 Emergency Response

Jika terjadi security breach:
1. **Immediately**: Revoke semua active sessions
2. Rotate API keys (Supabase service role key)
3. Force users to re-login
4. Audit database untuk unauthorized changes
5. Patch vulnerability ASAP
6. Notify users (jika perlu)

---

## 📚 Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Chrome Extension Security](https://developer.chrome.com/docs/extensions/mv3/security/)
- [Supabase Security](https://supabase.com/docs/guides/auth)
- [Prisma Security](https://www.prisma.io/docs/concepts/components/prisma-client/security)

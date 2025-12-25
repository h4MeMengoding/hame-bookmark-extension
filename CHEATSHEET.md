# 📋 Favicon System - Developer Cheatsheet

## 🚀 Quick Commands

```bash
# Backend - Test API
curl "http://localhost:3000/api/favicon?url=https://github.com"

# Backend - Run test suite
cd backend && npm run test:favicon

# Frontend - Build
cd extension && npm run build

# Frontend - Dev (with hot reload)
cd extension && npm run dev
```

## 💻 Code Snippets

### Import Service
```javascript
import { getFavicon, DEFAULT_FAVICON, preloadFavicons } from '@/services/favicon';
```

### Get Single Favicon
```javascript
const url = await getFavicon('https://github.com');
// Returns: "https://github.githubassets.com/favicons/favicon.svg"
```

### Batch Load (Efficient)
```javascript
const urls = ['https://github.com', 'https://stackoverflow.com'];
await preloadFavicons(urls);
// All favicons now cached
```

### React Hook
```javascript
const { favicon, loading, error } = useFavicon(bookmark.url);
```

### React Component (Full Example)
```jsx
function BookmarkIcon({ url }) {
  const [favicon, setFavicon] = useState(DEFAULT_FAVICON);
  
  useEffect(() => {
    getFavicon(url).then(setFavicon);
  }, [url]);
  
  return (
    <img 
      src={favicon} 
      alt="" 
      onError={(e) => e.target.src = DEFAULT_FAVICON}
    />
  );
}
```

## 🔧 API Reference

### Backend Endpoint
```
GET /api/favicon?url={target_url}

Response:
{
  "icon": "https://example.com/favicon.png" | null,
  "cached": boolean
}

Errors:
- 400: Invalid URL format
- 405: Method not allowed (only GET)
- 500: Internal server error
```

### Frontend Functions

| Function | Parameters | Returns | Cache |
|----------|-----------|---------|-------|
| `getFavicon(url)` | `string` | `Promise<string>` | ✅ Yes |
| `preloadFavicons(urls)` | `string[]` | `Promise<Map>` | ✅ Yes |
| `clearFaviconCache()` | - | `void` | ❌ Clears |
| `useFavicon(url)` | `string` | `{ favicon, loading, error }` | ✅ Yes |

### Constants

```javascript
DEFAULT_FAVICON = 'data:image/svg+xml,<svg xmlns="...">';
BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
```

## 🧪 Testing Commands

```bash
# Test specific URL
curl "http://localhost:3000/api/favicon?url=https://docs.google.com/spreadsheets"

# Test cache (call twice, second should be faster)
time curl "http://localhost:3000/api/favicon?url=https://github.com"
time curl "http://localhost:3000/api/favicon?url=https://github.com"

# Test invalid URL
curl "http://localhost:3000/api/favicon?url=invalid-url"
# Expected: 400 Bad Request
```

## 🔍 Debug Tips

### Check if cache is working
```javascript
// Backend
console.log(faviconCache.size); // Number of cached domains

// Frontend
import { faviconCache } from '@/services/favicon';
console.log(faviconCache); // Map of cached favicons
```

### Enable verbose logging
```typescript
// backend/pages/api/favicon.ts
console.log('Fetching:', url);
console.log('Cache hit:', cached ? 'Yes' : 'No');
console.log('Favicon found:', icon);
```

### Check network requests
```javascript
// Chrome DevTools → Network tab
// Filter: "favicon"
// Look for: /api/favicon calls
// Verify: Cached responses are faster
```

## 🐛 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| CORS error | Add CORS headers in backend |
| Image not loading | Check CSP in manifest.json |
| "cheerio not found" | `npm install cheerio` |
| Slow loading | Use `preloadFavicons()` |
| All icons show default | Check backend logs, verify endpoint accessible |

## 📊 Performance Benchmarks

```
First fetch:    200-500ms  (network + HTML parsing)
Cached (backend): <10ms    (in-memory lookup)
Cached (frontend): <1ms    (local Map lookup)

Target cache hit rate: >80%
```

## 🔒 Security Checklist

- [ ] URL validation (new URL())
- [ ] Timeout protection (10s)
- [ ] No code execution
- [ ] CORS configured
- [ ] CSP allows external images
- [ ] No sensitive data in cache

## 📁 File Locations

```
backend/
  └── pages/api/favicon.ts          # Main API endpoint

extension/
  └── src/
      ├── services/
      │   ├── favicon.js              # Main service
      │   ├── favicon.examples.js     # Usage examples
      │   └── FAVICON_README.md       # Quick guide
      └── components/
          └── BookmarkCard.jsx        # Integration example

Documentation/
  ├── FAVICON_SYSTEM.md              # Full documentation
  ├── DEPLOYMENT_FAVICON.md          # Deploy guide
  ├── MIGRATION_GUIDE.md             # Migration from old system
  └── SUMMARY.md                     # Implementation summary
```

## 🎯 Test URLs

```javascript
const testUrls = {
  github: 'https://github.com',
  sheets: 'https://docs.google.com/spreadsheets/d/xyz',
  docs: 'https://docs.google.com/document/d/abc',
  drive: 'https://drive.google.com/file/d/123',
  stackoverflow: 'https://stackoverflow.com',
  youtube: 'https://youtube.com',
};

// Test differentiation
// Google Sheets ≠ Google Docs ≠ Google Drive ✅
```

## 💡 Best Practices

1. **Always use cache**: Don't call `getFavicon()` repeatedly
2. **Batch load**: Use `preloadFavicons()` for lists
3. **Handle errors**: Always have fallback to `DEFAULT_FAVICON`
4. **Cleanup**: Use cleanup function in `useEffect`
5. **Performance**: Monitor cache hit rate

## 📚 Quick Links

- [Full Documentation](FAVICON_SYSTEM.md)
- [Deployment Guide](DEPLOYMENT_FAVICON.md)
- [Migration Guide](MIGRATION_GUIDE.md)
- [Code Examples](extension/src/services/favicon.examples.js)

---

**Cheatsheet Version:** 1.0  
**Last Updated:** 25 Desember 2025

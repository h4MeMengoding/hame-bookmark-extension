# 🎨 Favicon Service - Quick Reference

## 🚀 Penggunaan Cepat

### Import Service
```javascript
import { getFavicon, DEFAULT_FAVICON } from '@/services/favicon';
```

### Basic Usage
```javascript
const faviconUrl = await getFavicon('https://github.com');
// Returns: "https://github.githubassets.com/favicons/favicon.svg"
```

### React Component
```jsx
function BookmarkItem({ url }) {
  const [favicon, setFavicon] = useState(DEFAULT_FAVICON);
  
  useEffect(() => {
    getFavicon(url).then(setFavicon);
  }, [url]);
  
  return <img src={favicon} alt="" />;
}
```

## 📡 Backend API

### Endpoint
```
GET /api/favicon?url={target_url}
```

### Request Example
```bash
curl "http://localhost:3000/api/favicon?url=https://github.com"
```

### Response
```json
{
  "icon": "https://github.githubassets.com/favicons/favicon.svg",
  "cached": false
}
```

## 🔧 Fungsi Tersedia

| Function | Description | Return Type |
|----------|-------------|-------------|
| `getFavicon(url)` | Ambil favicon dari URL | `Promise<string>` |
| `preloadFavicons(urls)` | Batch load multiple URLs | `Promise<Map>` |
| `clearFaviconCache()` | Hapus cache lokal | `void` |
| `useFavicon(url)` | React hook dengan state | `{ favicon, loading, error }` |

## 🎯 Contoh Kasus

### Google Services (Akurat per Halaman)
```javascript
await getFavicon('https://docs.google.com/spreadsheets/...')
// → Favicon Google Sheets ✅

await getFavicon('https://docs.google.com/document/...')
// → Favicon Google Docs ✅

await getFavicon('https://drive.google.com/...')
// → Favicon Google Drive ✅
```

### Batch Loading
```javascript
const urls = bookmarks.map(b => b.url);
await preloadFavicons(urls); // Load semua sekaligus
```

### Error Handling
```jsx
<img 
  src={favicon} 
  onError={(e) => e.target.src = DEFAULT_FAVICON} 
/>
```

## ⚡ Performance Tips

1. **Use Batch Loading** untuk list panjang
2. **Cache** sudah otomatis (frontend + backend)
3. **Preload** saat component mount, bukan per item

## 🔒 Security

- ✅ CORS configured di backend
- ✅ Host permissions di manifest.json
- ✅ CSP allows external images
- ✅ Timeout protection (10s)

## 📝 Notes

- Favicon diambil dari **HTML asli website**
- Cache: 24 jam (backend), unlimited (frontend)
- Fallback: DEFAULT_FAVICON (SVG data URI)
- No external APIs (Google/DuckDuckGo)

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS Error | Check backend CORS headers |
| Image not loading | Verify CSP in manifest.json |
| Slow loading | Use `preloadFavicons()` |
| Cache not working | Check browser console for errors |

## 📚 Lihat Juga

- [FAVICON_SYSTEM.md](../FAVICON_SYSTEM.md) - Dokumentasi lengkap
- [favicon.examples.js](./favicon.examples.js) - Contoh penggunaan
- [favicon.js](./favicon.js) - Source code service

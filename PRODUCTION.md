# Hame Bookmark - Production Build

Follow the deployment guide in DEPLOYMENT.md

## Quick Start (Production)

### 1. Deploy Backend to Vercel

```bash
cd backend
vercel --prod
```

Add environment variables when prompted:
- DATABASE_URL
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_SUPABASE_ANON_KEY

### 2. Update Extension API URL

Edit `extension/src/services/api.js`:
```javascript
const API_URL = 'https://your-app.vercel.app';
```

### 3. Build Extension

```bash
cd extension
npm run build
```

### 4. Load Extension in Chrome

1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select `extension/dist` folder

## Production URLs

- Backend: https://your-app.vercel.app
- API Docs: https://your-app.vercel.app/api

## Environment Variables

See `.env.example` files in both `backend` and `extension` folders.

## Documentation

Full deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

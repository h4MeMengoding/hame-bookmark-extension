# Production Deployment Guide - Hame Bookmark

## Backend Deployment (Vercel)

### Prerequisites
- Vercel account (https://vercel.com)
- Supabase project (already set up)
- Vercel CLI (optional): `npm i -g vercel`

### Step 1: Prepare Backend for Production

1. **Install Vercel CLI** (optional)
```bash
npm i -g vercel
```

2. **Add vercel.json** (already created in backend folder)
   - Configures Next.js API routes for serverless deployment
   - Sets up CORS and runtime settings

### Step 2: Deploy to Vercel

**Option A: Deploy via Vercel Dashboard (Recommended)**

1. Go to https://vercel.com/new
2. Import your Git repository (GitHub/GitLab/Bitbucket)
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

4. Add Environment Variables in Vercel Dashboard:
   ```
   DATABASE_URL=your_supabase_database_url
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_API_URL=https://your-app.vercel.app
   ```

5. Click "Deploy"

**Option B: Deploy via Vercel CLI**

1. Navigate to backend folder:
```bash
cd backend
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

4. Follow prompts and add environment variables when asked

### Step 3: Update Extension for Production

After backend is deployed to Vercel:

1. **Get your Vercel URL**: `https://your-app.vercel.app`

2. **Update Extension API URL**:
   - Open `extension/src/services/api.js`
   - Change API_URL to your Vercel URL
   
   OR create `.env` file in extension folder:
   ```env
   VITE_API_URL=https://your-app.vercel.app
   ```

3. **Rebuild Extension**:
```bash
cd extension
npm run build
```

4. **Test Extension** with production API

### Step 4: Security Checklist

- ✅ Environment variables are in Vercel (not in code)
- ✅ CORS configured properly in backend
- ✅ Database connection uses SSL (Supabase default)
- ✅ API authentication tokens validated
- ✅ No sensitive data in git repository

### Step 5: Chrome Web Store Submission (Optional)

1. **Create Developer Account**: https://chrome.google.com/webstore/developer/dashboard
2. **Prepare Assets**:
   - Extension icon (128x128)
   - Screenshots (1280x800 or 640x400)
   - Promotional images
   - Description and privacy policy

3. **Upload Extension**:
   - Zip the `extension/dist` folder
   - Upload to Chrome Web Store
   - Fill in required information
   - Submit for review

## Environment Variables Reference

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@host:5432/db
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_API_URL=https://your-app.vercel.app
```

### Extension (.env)
```env
VITE_API_URL=https://your-app.vercel.app
```

## Troubleshooting

### Issue: "Function Timeout"
- Increase timeout in `vercel.json`:
```json
{
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 10
    }
  }
}
```

### Issue: "Database Connection Error"
- Verify DATABASE_URL in Vercel env vars
- Check Supabase connection pooling settings
- Use Supabase pooler URL (port 5432)

### Issue: "CORS Error"
- Verify CORS headers in API responses
- Check extension manifest.json host_permissions
- Add your extension ID to allowed origins

### Issue: "Extension Can't Connect"
- Verify VITE_API_URL is correct
- Check browser console for errors
- Test API endpoint directly in browser

## Post-Deployment Monitoring

1. **Vercel Analytics**: Check function logs and errors
2. **Supabase Dashboard**: Monitor database queries
3. **Chrome Extensions**: Check user reviews and crash reports

## Update Process

### Backend Updates
1. Push changes to git
2. Vercel auto-deploys on push (if configured)
3. Or run `vercel --prod` manually

### Extension Updates
1. Update code
2. Increment version in `manifest.json`
3. Run `npm run build`
4. Upload new version to Chrome Web Store
5. Wait for review (1-3 days typically)

## Cost Estimation

- **Vercel**: Free tier (100GB bandwidth, 100GB-hours)
- **Supabase**: Free tier (500MB database, 2GB bandwidth)
- **Chrome Web Store**: $5 one-time developer fee

## Production Checklist

Backend:
- ✅ Environment variables configured
- ✅ Database migrations applied
- ✅ API endpoints tested
- ✅ Error handling implemented
- ✅ CORS configured
- ✅ Authentication working

Extension:
- ✅ Production API URL configured
- ✅ Extension built and tested
- ✅ Manifest.json updated
- ✅ Icons and branding ready
- ✅ Permissions minimized
- ✅ Privacy policy prepared (if collecting data)

## Support

For issues:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Check browser console
4. Review this documentation

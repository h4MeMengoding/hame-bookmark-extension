# 🔖 Bookmark Manager - Chrome Extension

Chrome Extension modern untuk mengelola bookmark dengan authentication dan sync multi-device menggunakan React, Supabase, dan Prisma.

## 📐 Arsitektur Aplikasi

```
┌─────────────────────────────┐
│  Chrome Extension (React)   │
│  - UI Popup                 │
│  - Auth State Management    │
│  - Chrome Storage           │
└──────────┬──────────────────┘
           │ HTTPS Request
           │ Bearer Token
           ▼
┌─────────────────────────────┐
│  Backend API (Next.js)      │
│  - Auth Endpoints           │
│  - Bookmark CRUD            │
│  - Token Validation         │
└──────────┬──────────────────┘
           │ Prisma ORM
           ▼
┌─────────────────────────────┐
│  Supabase PostgreSQL        │
│  - User Table               │
│  - Bookmark Table           │
└─────────────────────────────┘
```

**Keamanan:**
- ✅ Prisma HANYA di backend (tidak ada di extension)
- ✅ Supabase service role key HANYA di backend
- ✅ Extension menggunakan chrome.storage.local untuk token
- ✅ Semua database access melalui authenticated API

## 🛠 Tech Stack

### Extension (Frontend)
- **React 18** - UI Framework
- **Vite** - Build tool & bundler
- **Tailwind CSS** - Styling (dark theme)
- **Lucide React** - Modern icons
- **Manifest V3** - Chrome Extension API

### Backend
- **Next.js 14** - API Routes
- **Prisma** - Database ORM
- **Supabase** - PostgreSQL Database & Auth
- **TypeScript** - Type safety

## 📁 Struktur Folder

```
bookmark-extension/
├── extension/               # Chrome Extension (React)
│   ├── public/
│   │   └── icons/          # Extension icons
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── BookmarkCard.jsx
│   │   │   ├── BookmarkForm.jsx
│   │   │   └── Header.jsx
│   │   ├── pages/          # Pages
│   │   │   ├── LoginPage.jsx
│   │   │   └── BookmarksPage.jsx
│   │   ├── services/       # API calls
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   └── storage.js
│   │   ├── styles/
│   │   │   └── index.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── manifest.json       # Extension manifest V3
│   ├── package.json
│   └── vite.config.js
│
└── backend/                # Next.js Backend
    ├── pages/
    │   └── api/
    │       ├── auth/
    │       │   └── login.ts
    │       └── bookmarks/
    │           ├── index.ts
    │           └── [id].ts
    ├── prisma/
    │   └── schema.prisma
    ├── lib/
    │   ├── prisma.ts
    │   └── supabase.ts
    ├── middleware/
    │   └── auth.ts
    └── package.json
```

## 🚀 Setup & Installation

### 1. Setup Backend

```bash
cd backend
npm install

# Setup environment variables
cp .env.example .env

# Edit .env dengan credentials Supabase Anda
DATABASE_URL="postgresql://..."
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJ..."

# Generate Prisma Client & Migrate
npx prisma generate
npx prisma migrate dev --name init

# Run development server
npm run dev
```

### 2. Setup Extension

```bash
cd extension
npm install

# Build extension
npm run build

# Untuk development dengan hot reload
npm run dev
```

### 3. Load Extension ke Chrome

1. Buka Chrome → `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Pilih folder `extension/dist`

## 📋 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login user | ❌ |
| GET | `/api/bookmarks` | Get user's bookmarks | ✅ |
| POST | `/api/bookmarks` | Create new bookmark | ✅ |
| DELETE | `/api/bookmarks/[id]` | Delete bookmark | ✅ |

**Authentication:** Bearer Token di header
```
Authorization: Bearer <supabase_access_token>
```

## 🎨 Design Theme

- **Dark Mode** - Background hitam/abu gelap
- **Neon Accents** - Purple (#8b5cf6), Cyan (#06b6d4), Pink (#ec4899)
- **Modern Typography** - Inter font
- **Glassmorphism** - Backdrop blur effects
- **Smooth Animations** - Transitions & hover effects
- **Minimalist Icons** - Lucide icons

## 🔐 Security Best Practices

### ✅ DO:
- Simpan token di `chrome.storage.local` (encrypted by Chrome)
- Validasi token di setiap API request
- Gunakan HTTPS untuk semua API calls
- Implement rate limiting di backend
- Sanitize user input (title, URL)
- Use environment variables untuk secrets

### ❌ DON'T:
- Jangan simpan password di extension
- Jangan expose Supabase service role key
- Jangan jalankan Prisma di extension
- Jangan simpan sensitive data di chrome.storage.sync

## 📱 Fitur Utama

### Authentication
- ✅ Login dengan email & password (Supabase Auth)
- ✅ Session persistence (chrome.storage)
- ✅ Auto-redirect based on auth state
- ✅ Logout & token cleanup

### Bookmark Management
- ✅ Create bookmark (title + URL)
- ✅ View all bookmarks
- ✅ Click to open in new tab
- ✅ Delete bookmark
- ✅ Real-time sync dengan database

## 🧪 Development

### Extension Development
```bash
cd extension
npm run dev    # Auto rebuild on changes
```

### Backend Development
```bash
cd backend
npm run dev    # Next.js dev server on port 3000
```

### Database Management
```bash
cd backend
npx prisma studio    # Visual database editor
npx prisma migrate dev    # Create new migration
```

## 📦 Production Build

### Extension
```bash
cd extension
npm run build
# Hasil build di folder dist/
# Zip folder dist/ untuk upload ke Chrome Web Store
```

### Backend
```bash
cd backend
npm run build
# Deploy ke Vercel/Railway/etc
```

## 🌐 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
SUPABASE_URL="https://xxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbG..."
NEXT_PUBLIC_API_URL="https://your-api.vercel.app"
```

### Extension (vite.config.js)
```javascript
define: {
  'process.env.VITE_API_URL': JSON.stringify('https://your-api.vercel.app')
}
```

## 📝 License

MIT

## 👨‍💻 Developer

Built with ❤️ by Senior Fullstack Engineer

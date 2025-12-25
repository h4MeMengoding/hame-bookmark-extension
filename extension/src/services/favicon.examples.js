/**
 * CONTOH PENGGUNAAN - Favicon Service
 * File ini berisi berbagai contoh cara menggunakan favicon service
 */

import { getFavicon, preloadFavicons, clearFaviconCache, DEFAULT_FAVICON } from '../services/favicon';

// ============================================
// 1. SIMPLE USAGE - Single Favicon
// ============================================

async function exampleSimple() {
  const url = 'https://github.com/microsoft/vscode';
  const favicon = await getFavicon(url);
  
  console.log('Favicon URL:', favicon);
  // Output: https://github.githubassets.com/favicons/favicon.svg
}

// ============================================
// 2. WITH ERROR HANDLING
// ============================================

async function exampleWithErrorHandling() {
  try {
    const favicon = await getFavicon('https://example.com');
    document.getElementById('favicon-img').src = favicon;
  } catch (error) {
    console.error('Failed to load favicon:', error);
    document.getElementById('favicon-img').src = DEFAULT_FAVICON;
  }
}

// ============================================
// 3. BATCH LOADING - Multiple Bookmarks
// ============================================

async function exampleBatchLoading() {
  const bookmarks = [
    { id: 1, url: 'https://github.com' },
    { id: 2, url: 'https://stackoverflow.com' },
    { id: 3, url: 'https://docs.google.com/spreadsheets' },
  ];

  // Preload semua favicons sekaligus
  const urls = bookmarks.map(b => b.url);
  await preloadFavicons(urls);

  // Sekarang getFavicon() akan instant (dari cache)
  for (const bookmark of bookmarks) {
    const favicon = await getFavicon(bookmark.url);
    console.log(`${bookmark.url} → ${favicon}`);
  }
}

// ============================================
// 4. REACT COMPONENT - Functional Component
// ============================================

import React, { useState, useEffect } from 'react';

function BookmarkIcon({ url }) {
  const [favicon, setFavicon] = useState(DEFAULT_FAVICON);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadFavicon = async () => {
      try {
        const faviconUrl = await getFavicon(url);
        if (mounted) {
          setFavicon(faviconUrl);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          setFavicon(DEFAULT_FAVICON);
          setLoading(false);
        }
      }
    };

    loadFavicon();

    return () => {
      mounted = false;
    };
  }, [url]);

  if (loading) {
    return <div className="animate-pulse w-8 h-8 bg-gray-200 rounded" />;
  }

  if (error) {
    return <div className="w-8 h-8 text-red-500">⚠️</div>;
  }

  return (
    <img
      src={favicon}
      alt=""
      className="w-8 h-8 object-contain"
      onError={(e) => {
        e.target.src = DEFAULT_FAVICON;
      }}
    />
  );
}

// ============================================
// 5. REACT COMPONENT - dengan Custom Hook
// ============================================

// Custom Hook (sudah ada di favicon.js)
function useFavicon(url) {
  const [favicon, setFavicon] = React.useState(DEFAULT_FAVICON);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (!url) {
      setFavicon(DEFAULT_FAVICON);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    getFavicon(url)
      .then((faviconUrl) => {
        setFavicon(faviconUrl);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setFavicon(DEFAULT_FAVICON);
        setLoading(false);
      });
  }, [url]);

  return { favicon, loading, error };
}

// Penggunaan hook
function BookmarkCard({ url, title }) {
  const { favicon, loading, error } = useFavicon(url);

  return (
    <div className="flex items-center gap-2">
      {loading ? (
        <div className="w-6 h-6 animate-spin">⏳</div>
      ) : (
        <img src={favicon} alt="" className="w-6 h-6" />
      )}
      <span>{title}</span>
    </div>
  );
}

// ============================================
// 6. VANILLA JAVASCRIPT - No Framework
// ============================================

async function exampleVanillaJS() {
  const container = document.getElementById('bookmarks-container');
  
  const bookmarks = [
    { title: 'GitHub', url: 'https://github.com' },
    { title: 'Stack Overflow', url: 'https://stackoverflow.com' },
  ];

  for (const bookmark of bookmarks) {
    const favicon = await getFavicon(bookmark.url);
    
    const bookmarkEl = document.createElement('div');
    bookmarkEl.innerHTML = `
      <img src="${favicon}" alt="" style="width: 16px; height: 16px;" />
      <span>${bookmark.title}</span>
    `;
    
    container.appendChild(bookmarkEl);
  }
}

// ============================================
// 7. CACHE MANAGEMENT
// ============================================

async function exampleCacheManagement() {
  // Normal usage - menggunakan cache
  const favicon1 = await getFavicon('https://github.com');
  console.log('First call (fetch from backend):', favicon1);

  const favicon2 = await getFavicon('https://github.com');
  console.log('Second call (from cache):', favicon2);

  // Clear cache jika perlu refresh
  clearFaviconCache();

  const favicon3 = await getFavicon('https://github.com');
  console.log('After cache clear (fetch again):', favicon3);
}

// ============================================
// 8. TESTING DIFFERENT URL TYPES
// ============================================

async function exampleDifferentURLs() {
  const testUrls = [
    // Google Services - akan mendapat favicon berbeda per service
    'https://docs.google.com/spreadsheets/d/xyz',
    'https://docs.google.com/document/d/abc',
    'https://drive.google.com/file/d/123',
    
    // Subdomain berbeda
    'https://github.com',
    'https://gist.github.com',
    
    // Path berbeda (same domain)
    'https://stackoverflow.com/questions',
    'https://stackoverflow.com/users/123',
  ];

  for (const url of testUrls) {
    const favicon = await getFavicon(url);
    console.log(`${url} →\n  ${favicon}\n`);
  }
}

// ============================================
// 9. DIRECT API CALL (tanpa service)
// ============================================

async function exampleDirectAPICall() {
  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const targetUrl = 'https://github.com';

  const response = await fetch(
    `${BACKEND_URL}/api/favicon?url=${encodeURIComponent(targetUrl)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();
  console.log('Response:', data);
  // {
  //   icon: "https://github.githubassets.com/favicons/favicon.svg",
  //   cached: false
  // }
}

// ============================================
// 10. PERFORMANCE OPTIMIZATION
// ============================================

async function examplePerformanceOptimization() {
  const bookmarks = await fetchBookmarksFromAPI(); // Ambil 100 bookmarks
  
  // ❌ BAD: Sequential loading (slow)
  // for (const bookmark of bookmarks) {
  //   bookmark.favicon = await getFavicon(bookmark.url);
  // }

  // ✅ GOOD: Batch preload (fast)
  const urls = bookmarks.map(b => b.url);
  await preloadFavicons(urls);
  
  // Sekarang semua sudah di cache, instant access
  const enrichedBookmarks = bookmarks.map(b => ({
    ...b,
    favicon: faviconCache.get(extractDomain(b.url))
  }));

  return enrichedBookmarks;
}

// ============================================
// EXPORT EXAMPLES (untuk testing)
// ============================================

export const examples = {
  simple: exampleSimple,
  withErrorHandling: exampleWithErrorHandling,
  batchLoading: exampleBatchLoading,
  cacheManagement: exampleCacheManagement,
  differentURLs: exampleDifferentURLs,
  directAPICall: exampleDirectAPICall,
  performanceOptimization: examplePerformanceOptimization,
};

// Run all examples
export async function runAllExamples() {
  console.log('=== Running Favicon Service Examples ===\n');
  
  for (const [name, fn] of Object.entries(examples)) {
    console.log(`\n--- Example: ${name} ---`);
    try {
      await fn();
      console.log('✅ Success');
    } catch (error) {
      console.error('❌ Error:', error);
    }
  }
}

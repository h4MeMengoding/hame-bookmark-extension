/**
 * Favicon Service - Mengambil favicon dari backend API
 */

import React from 'react';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// In-memory cache di frontend untuk mengurangi API calls
const faviconCache = new Map();

/**
 * Fallback icon default (null-favicon.svg dari public folder)
 */
export const DEFAULT_FAVICON = '/icons/null-favicon.svg';

/**
 * Old default for backward compatibility
 */
export const FALLBACK_ICON = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>';

/**
 * Get cache key from URL (sama seperti backend)
 * Untuk Google Docs services, include path pattern
 */
function getCacheKey(url) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    // Untuk Google Docs services, include path pattern untuk accuracy
    if (domain.includes('docs.google.com') || domain.includes('drive.google.com')) {
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        // Gunakan domain + first path segment
        return `${domain}/${pathParts[0]}`;
      }
    }
    
    // Untuk domain lain, gunakan domain saja
    return domain;
  } catch {
    return url;
  }
}

/**
 * Fetch favicon dari backend API
 * @param {string} url - URL website yang akan diambil faviconnya
 * @returns {Promise<string>} - URL favicon atau default icon
 */
export async function getFavicon(url) {
  console.log('[Favicon Service] getFavicon called with:', url);
  
  if (!url) {
    console.log('[Favicon Service] No URL provided, returning default');
    return DEFAULT_FAVICON;
  }

  // Validasi URL format
  try {
    const urlObj = new URL(url);
    
    // Handle IP addresses atau URL tanpa protocol
    if (!urlObj.protocol.startsWith('http')) {
      console.log('[Favicon Service] Non-HTTP protocol, returning default:', urlObj.protocol);
      return DEFAULT_FAVICON;
    }
  } catch (error) {
    console.log('[Favicon Service] Invalid URL format:', error.message);
    return DEFAULT_FAVICON;
  }

  const cacheKey = getCacheKey(url);
  console.log('[Favicon Service] Cache key:', cacheKey);

  // Cek cache lokal
  if (faviconCache.has(cacheKey)) {
    console.log('[Favicon Service] Cache HIT for:', cacheKey);
    return faviconCache.get(cacheKey);
  }

  console.log('[Favicon Service] Cache MISS, fetching from backend...');

  try {
    // Panggil backend API
    const apiUrl = `${BACKEND_URL}/api/favicon?url=${encodeURIComponent(url)}`;
    console.log('[Favicon Service] Fetching from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[Favicon Service] API error:', response.status, response.statusText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('[Favicon Service] API response:', data);
    
    const faviconUrl = data.icon || DEFAULT_FAVICON;

    // Simpan ke cache
    faviconCache.set(cacheKey, faviconUrl);
    console.log('[Favicon Service] Cached result for:', cacheKey);

    return faviconUrl;
  } catch (error) {
    console.error('[Favicon Service] Error fetching favicon:', error);
    
    // Fallback ke default icon
    faviconCache.set(cacheKey, DEFAULT_FAVICON);
    return DEFAULT_FAVICON;
  }
}

/**
 * Preload favicons untuk multiple URLs
 * Berguna untuk load batch bookmarks
 * @param {string[]} urls - Array of URLs
 * @returns {Promise<Map<string, string>>} - Map cache key ke favicon URL
 */
export async function preloadFavicons(urls) {
  const results = new Map();
  
  // Batch request untuk efisiensi
  const promises = urls.map(async (url) => {
    const cacheKey = getCacheKey(url);
    const favicon = await getFavicon(url);
    results.set(cacheKey, favicon);
  });

  await Promise.allSettled(promises);
  
  return results;
}

/**
 * Clear favicon cache (berguna untuk refresh)
 */
export function clearFaviconCache() {
  faviconCache.clear();
}

/**
 * React Hook untuk favicon
 * @param {string} url - URL website
 * @returns {{ favicon: string, loading: boolean, error: Error | null }}
 */
export function useFavicon(url) {
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

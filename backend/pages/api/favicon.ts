import type { NextApiRequest, NextApiResponse } from 'next';
import * as cheerio from 'cheerio';

// In-memory cache untuk favicon
// Format: Map<domain, { icon: string | null, timestamp: number }>
const faviconCache = new Map<string, { icon: string | null; timestamp: number }>();

// Cache duration: 24 jam
const CACHE_DURATION = 24 * 60 * 60 * 1000;

interface FaviconResponse {
  icon: string | null;
  cached?: boolean;
}

/**
 * Ekstrak cache key dari URL
 * Untuk Google services, gunakan domain + path pattern
 */
function getCacheKey(url: string): string {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    
    // Untuk Google Docs services, include path pattern untuk accuracy
    if (domain.includes('docs.google.com') || domain.includes('drive.google.com')) {
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (pathParts.length > 0) {
        // Gunakan domain + first path segment (spreadsheets, document, presentation, etc)
        return `${domain}/${pathParts[0]}`;
      }
    }
    
    // Untuk domain lain, gunakan domain saja
    return domain;
  } catch {
    return '';
  }
}

/**
 * Konversi relative URL ke absolute URL
 */
function resolveUrl(baseUrl: string, relativeUrl: string): string {
  try {
    // Jika sudah absolute, return langsung
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
      return relativeUrl;
    }

    const base = new URL(baseUrl);

    // Handle protocol-relative URL (//example.com/icon.png)
    if (relativeUrl.startsWith('//')) {
      return `${base.protocol}${relativeUrl}`;
    }

    // Handle root-relative URL (/favicon.ico)
    if (relativeUrl.startsWith('/')) {
      return `${base.protocol}//${base.host}${relativeUrl}`;
    }

    // Handle relative URL (images/icon.png)
    const basePath = base.pathname.endsWith('/')
      ? base.pathname
      : base.pathname.substring(0, base.pathname.lastIndexOf('/') + 1);

    return `${base.protocol}//${base.host}${basePath}${relativeUrl}`;
  } catch (error) {
    console.error('Error resolving URL:', error);
    return relativeUrl;
  }
}

/**
 * Fetch dan parse favicon dari HTML
 */
async function fetchFavicon(url: string): Promise<string | null> {
  try {
    // Fetch HTML dengan timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 detik timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Prioritas parsing favicon
    const faviconSelectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="apple-touch-icon"]',
      'link[rel="apple-touch-icon-precomposed"]',
      'link[rel*="icon"]', // Catch-all for any icon-related links
      'meta[property="og:image"]',
      'meta[itemprop="image"]',
    ];

    for (const selector of faviconSelectors) {
      const elements = $(selector);
      for (let i = 0; i < elements.length; i++) {
        const element = elements.eq(i);
        const href = element.attr('href') || element.attr('content');
        if (href && href.trim() !== '') {
          const absoluteUrl = resolveUrl(url, href);
          
          // Validasi URL hasil
          try {
            new URL(absoluteUrl);
            
            // Skip data URIs yang terlalu besar (>10KB)
            if (absoluteUrl.startsWith('data:')) {
              if (absoluteUrl.length > 10000) continue;
              return absoluteUrl;
            }
            
            // Verifikasi bahwa URL benar-benar accessible
            const verifyController = new AbortController();
            const verifyTimeoutId = setTimeout(() => verifyController.abort(), 5000);
            
            try {
              const headResponse = await fetch(absoluteUrl, { 
                method: 'HEAD',
                signal: verifyController.signal,
                redirect: 'follow', // Follow redirects
              });
              clearTimeout(verifyTimeoutId);
              
              if (headResponse.ok) {
                const contentType = headResponse.headers.get('content-type');
                // Pastikan response adalah image atau tidak ada content-type
                if (!contentType || contentType.startsWith('image/')) {
                  // Return final URL setelah redirect
                  return headResponse.url || absoluteUrl;
                }
              }
            } catch {
              // Jika HEAD gagal, coba dengan GET kecil
              clearTimeout(verifyTimeoutId);
              continue;
            }
          } catch {
            continue;
          }
        }
      }
    }

    // Fallback: coba /favicon.ico di root domain
    const urlObj = new URL(url);
    const fallbackUrl = `${urlObj.protocol}//${urlObj.host}/favicon.ico`;
    
    // Verifikasi fallback dengan HEAD request
    try {
      const fallbackController = new AbortController();
      const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 5000);
      
      const headResponse = await fetch(fallbackUrl, { 
        method: 'HEAD',
        signal: fallbackController.signal,
        redirect: 'follow', // Follow redirects
      });
      
      clearTimeout(fallbackTimeoutId);
      
      if (headResponse.ok) {
        const contentType = headResponse.headers.get('content-type');
        // Hanya return jika benar-benar image
        if (contentType && contentType.startsWith('image/')) {
          // Return final URL setelah redirect
          return headResponse.url || fallbackUrl;
        }
      }
    } catch {
      // Ignore error
    }

    return null;
  } catch (error) {
    console.error('Error fetching favicon:', error);
    return null;
  }
}

/**
 * API Handler untuk /api/favicon
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FaviconResponse | { error: string }>
) {
  // Hanya terima GET request
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  // Validasi parameter
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  // Validasi format URL
  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  // Ekstrak domain untuk caching
  const cacheKey = getCacheKey(url);
  if (!cacheKey) {
    return res.status(400).json({ error: 'Invalid domain' });
  }

  // Cek cache
  const cached = faviconCache.get(cacheKey);
  const now = Date.now();

  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return res.status(200).json({
      icon: cached.icon,
      cached: true,
    });
  }

  // Fetch favicon baru
  const icon = await fetchFavicon(url);

  // Simpan ke cache
  faviconCache.set(cacheKey, {
    icon,
    timestamp: now,
  });

  return res.status(200).json({
    icon,
    cached: false,
  });
}

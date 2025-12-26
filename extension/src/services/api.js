// Base API configuration

const API_URL = import.meta.env.VITE_API_URL;

// Flag to prevent concurrent refresh attempts
let isRefreshing = false;
let refreshPromise = null;

/**
 * Make API request dengan authentication dan auto-refresh token
 */
export const apiRequest = async (endpoint, options = {}) => {
  const { method = 'GET', body, token, headers = {}, isRetry = false } = options;

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  // Add authorization header jika token ada
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  // Add body jika ada
  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    const data = await response.json();

    if (!response.ok) {
      // Jika 401 Unauthorized dan bukan retry, coba refresh token
      if (response.status === 401 && !isRetry && endpoint !== '/api/auth/refresh') {
        console.warn('Token expired, attempting refresh...');
        
        // Prevent multiple concurrent refreshes
        if (isRefreshing) {
          await refreshPromise;
        } else {
          isRefreshing = true;
          refreshPromise = (async () => {
            try {
              const { refreshAccessToken } = await import('./auth');
              const result = await refreshAccessToken();
              
              if (result.success) {
                // Retry original request dengan new token
                return await apiRequest(endpoint, { 
                  ...options, 
                  token: result.token, 
                  isRetry: true 
                });
              } else {
                // Refresh gagal - user harus login ulang
                throw new Error('Session expired. Please login again.');
              }
            } finally {
              isRefreshing = false;
              refreshPromise = null;
            }
          })();
          
          return await refreshPromise;
        }
      }
      
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

/**
 * GET request
 */
export const get = (endpoint, token) => {
  return apiRequest(endpoint, { method: 'GET', token });
};

/**
 * POST request
 */
export const post = (endpoint, body, token) => {
  return apiRequest(endpoint, { method: 'POST', body, token });
};

/**
 * PUT request
 */
export const put = (endpoint, body, token) => {
  return apiRequest(endpoint, { method: 'PUT', body, token });
};

/**
 * DELETE request
 */
export const del = (endpoint, token) => {
  return apiRequest(endpoint, { method: 'DELETE', token });
};

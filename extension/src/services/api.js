// Base API configuration

const API_URL = process.env.VITE_API_URL;

/**
 * Make API request dengan authentication
 */
export const apiRequest = async (endpoint, options = {}) => {
  const { method = 'GET', body, token, headers = {} } = options;

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
 * DELETE request
 */
export const del = (endpoint, token) => {
  return apiRequest(endpoint, { method: 'DELETE', token });
};

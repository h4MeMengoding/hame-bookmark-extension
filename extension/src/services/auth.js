// Authentication service

import { post } from './api';
import { saveToken, removeToken, saveUserData, removeUserData, getToken, saveRefreshToken, removeRefreshToken, getRefreshToken } from './storage';

/**
 * Signup user baru
 */
export const signup = async (email, password) => {
  try {
    const data = await post('/api/auth/signup', { email, password });
    
    // Simpan token, refresh token, dan user data ke chrome.storage
    await saveToken(data.token);
    await saveRefreshToken(data.refreshToken);
    await saveUserData(data.user);
    
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error.message || 'Signup failed. Please try again.' 
    };
  }
};

/**
 * Login user dengan email dan password
 */
export const login = async (email, password) => {
  try {
    const data = await post('/api/auth/login', { email, password });
    
    // Simpan token, refresh token, dan user data ke chrome.storage
    await saveToken(data.token);
    await saveRefreshToken(data.refreshToken);
    await saveUserData(data.user);
    
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error.message || 'Login failed. Please check your credentials.' 
    };
  }
};

/**
 * Logout user - hapus semua data authentication
 */
export const logout = async () => {
  try {
    // Hapus token, refresh token, dan user data dari storage
    await removeToken();
    await removeRefreshToken();
    await removeUserData();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Check apakah user sudah login dan return token jika ada
 */
export const checkAuth = async () => {
  const token = await getToken();
  return {
    isAuthenticated: !!token,
    token: token
  };
};

/**
 * Validate token dengan backend
 * Return true jika token valid, false jika invalid
 */
export const validateToken = async (token) => {
  try {
    // Test token dengan request ke backend
    // Jika token invalid, akan throw error
    const { get } = await import('./api');
    await get('/api/bookmarks', token);
    return true;
  } catch (error) {
    // Token invalid atau expired
    console.error('Token validation failed:', error);
    return false;
  }
};

/**
 * Refresh access token menggunakan refresh token
 * Return { success: true, token } jika berhasil, { success: false } jika gagal
 */
export const refreshAccessToken = async () => {
  try {
    const refreshToken = await getRefreshToken();
    
    if (!refreshToken) {
      console.error('No refresh token available');
      return { success: false };
    }

    // Request new access token
    const data = await post('/api/auth/refresh', { refreshToken });
    
    // Simpan new access token dan refresh token
    await saveToken(data.token);
    await saveRefreshToken(data.refreshToken);
    
    console.log('Token refreshed successfully');
    return { success: true, token: data.token };
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Jika refresh gagal, hapus semua token (force logout)
    await removeToken();
    await removeRefreshToken();
    await removeUserData();
    return { success: false };
  }
};

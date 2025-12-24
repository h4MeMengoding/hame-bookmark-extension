// Authentication service

import { post } from './api';
import { saveToken, removeToken, saveUserData, removeUserData, getToken } from './storage';

/**
 * Signup user baru
 */
export const signup = async (email, password) => {
  try {
    const data = await post('/api/auth/signup', { email, password });
    
    // Simpan token dan user data ke chrome.storage
    await saveToken(data.token);
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
    
    // Simpan token dan user data ke chrome.storage
    await saveToken(data.token);
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
    // Hapus token dan user data dari storage
    await removeToken();
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

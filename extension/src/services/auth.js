// Authentication service

import { post } from './api';
import { saveToken, removeToken, saveUserData } from './storage';

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
 * Logout user
 */
export const logout = async () => {
  try {
    await removeToken();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Check apakah user sudah login
 */
export const checkAuth = async () => {
  const token = await chrome.storage.local.get('auth_token');
  return !!token.auth_token;
};

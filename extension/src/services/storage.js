// Storage service untuk mengelola chrome.storage.local

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
};

/**
 * Simpan token ke chrome.storage.local
 */
export const saveToken = async (token) => {
  try {
    await chrome.storage.local.set({ [STORAGE_KEYS.AUTH_TOKEN]: token });
    return true;
  } catch (error) {
    console.error('Error saving token:', error);
    return false;
  }
};

/**
 * Ambil token dari chrome.storage.local
 */
export const getToken = async () => {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEYS.AUTH_TOKEN);
    return result[STORAGE_KEYS.AUTH_TOKEN] || null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Hapus token dari chrome.storage.local
 */
export const removeToken = async () => {
  try {
    await chrome.storage.local.remove(STORAGE_KEYS.AUTH_TOKEN);
    return true;
  } catch (error) {
    console.error('Error removing token:', error);
    return false;
  }
};

/**
 * Simpan user data
 */
export const saveUserData = async (userData) => {
  try {
    await chrome.storage.local.set({ [STORAGE_KEYS.USER_DATA]: userData });
    return true;
  } catch (error) {
    console.error('Error saving user data:', error);
    return false;
  }
};

/**
 * Ambil user data
 */
export const getUserData = async () => {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEYS.USER_DATA);
    return result[STORAGE_KEYS.USER_DATA] || null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Clear semua data
 */
export const clearStorage = async () => {
  try {
    await chrome.storage.local.clear();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

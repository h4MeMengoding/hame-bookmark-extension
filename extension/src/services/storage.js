// Storage service untuk mengelola chrome.storage.local
// Fallback ke localStorage ketika dijalankan di browser (dev)

const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
};

/**
 * Simpan token ke chrome.storage.local
 */
const hasExtensionStorage = () => {
  try {
    return typeof chrome !== 'undefined' && chrome && chrome.storage && chrome.storage.local;
  } catch (e) {
    return false;
  }
};

export const saveToken = async (token) => {
  try {
    if (hasExtensionStorage()) {
      await chrome.storage.local.set({ [STORAGE_KEYS.AUTH_TOKEN]: token });
    } else {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    }
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
    if (hasExtensionStorage()) {
      const result = await chrome.storage.local.get(STORAGE_KEYS.AUTH_TOKEN);
      return result[STORAGE_KEYS.AUTH_TOKEN] || null;
    } else {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || null;
    }
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
    if (hasExtensionStorage()) {
      await chrome.storage.local.remove(STORAGE_KEYS.AUTH_TOKEN);
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
    return true;
  } catch (error) {
    console.error('Error removing token:', error);
    return false;
  }
};

/**
 * Simpan refresh token ke chrome.storage.local
 */
export const saveRefreshToken = async (refreshToken) => {
  try {
    if (hasExtensionStorage()) {
      await chrome.storage.local.set({ [STORAGE_KEYS.REFRESH_TOKEN]: refreshToken });
    } else {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
    return true;
  } catch (error) {
    console.error('Error saving refresh token:', error);
    return false;
  }
};

/**
 * Ambil refresh token dari chrome.storage.local
 */
export const getRefreshToken = async () => {
  try {
    if (hasExtensionStorage()) {
      const result = await chrome.storage.local.get(STORAGE_KEYS.REFRESH_TOKEN);
      return result[STORAGE_KEYS.REFRESH_TOKEN] || null;
    } else {
      return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || null;
    }
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Hapus refresh token dari chrome.storage.local
 */
export const removeRefreshToken = async () => {
  try {
    if (hasExtensionStorage()) {
      await chrome.storage.local.remove(STORAGE_KEYS.REFRESH_TOKEN);
    } else {
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    }
    return true;
  } catch (error) {
    console.error('Error removing refresh token:', error);
    return false;
  }
};

/**
 * Simpan user data
 */
export const saveUserData = async (userData) => {
  try {
    if (hasExtensionStorage()) {
      await chrome.storage.local.set({ [STORAGE_KEYS.USER_DATA]: userData });
    } else {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    }
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
    if (hasExtensionStorage()) {
      const result = await chrome.storage.local.get(STORAGE_KEYS.USER_DATA);
      return result[STORAGE_KEYS.USER_DATA] || null;
    } else {
      const raw = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      return raw ? JSON.parse(raw) : null;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Hapus user data dari storage
 */
export const removeUserData = async () => {
  try {
    if (hasExtensionStorage()) {
      await chrome.storage.local.remove(STORAGE_KEYS.USER_DATA);
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
    return true;
  } catch (error) {
    console.error('Error removing user data:', error);
    return false;
  }
};

/**
 * Clear semua data
 */
export const clearStorage = async () => {
  try {
    if (hasExtensionStorage()) {
      await chrome.storage.local.clear();
    } else {
      localStorage.clear();
    }
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

  /**
   * Generic setting storage helpers
   */
  export const saveSetting = async (key, value) => {
    try {
      const k = `setting_${key}`;
      if (hasExtensionStorage()) {
        const obj = {};
        obj[k] = value;
        await chrome.storage.local.set(obj);
      } else {
        localStorage.setItem(k, JSON.stringify(value));
      }
      return true;
    } catch (e) {
      console.error('Error saving setting:', e);
      return false;
    }
  };

  export const getSetting = async (key) => {
    try {
      const k = `setting_${key}`;
      if (hasExtensionStorage()) {
        const res = await chrome.storage.local.get(k);
        return res[k] === undefined ? null : res[k];
      } else {
        const raw = localStorage.getItem(k);
        return raw ? JSON.parse(raw) : null;
      }
    } catch (e) {
      console.error('Error getting setting:', e);
      return null;
    }
  };

import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import BookmarksPage from './pages/BookmarksPage';
import { getToken } from './services/storage';
import { logout } from './services/auth';
import './styles/index.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Auto-restore session saat extension dibuka
    restoreSession();
  }, []);

  const restoreSession = async () => {
    try {
      const token = await getToken();
      
      if (token) {
        // Token ditemukan, user tetap login
        console.log('Session restored - user auto-login');
        setIsAuthenticated(true);
      } else {
        // Tidak ada token, user perlu login
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Session restore error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      // Clear semua auth data dari storage
      await logout();
      setIsAuthenticated(false);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Tetap logout meskipun ada error
      setIsAuthenticated(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neo-cream">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neo-cream">{isAuthenticated ? (
        <BookmarksPage onLogout={handleLogout} />
      ) : (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;

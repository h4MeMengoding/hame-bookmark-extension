import React, { useState } from 'react';
import { LogIn, Mail, Lock, Loader2, UserPlus } from 'lucide-react';
import { login, signup } from '../services/auth';

const LoginPage = ({ onLoginSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = isSignup 
        ? await signup(email, password)
        : await login(email, password);
      
      if (result.success) {
        onLoginSuccess();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neo-cream flex items-center justify-center p-6">
      <div className="w-full max-w-md fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-neo-pink border-4 border-black shadow-brutal mb-4">
            {isSignup ? (
              <UserPlus className="w-10 h-10 text-black" strokeWidth={3} />
            ) : (
              <LogIn className="w-10 h-10 text-black" strokeWidth={3} />
            )}
          </div>
          <h1 className="text-4xl font-black text-black mb-2">
            {isSignup ? 'Sign Up' : 'Login'}
          </h1>
          <p className="text-black text-base font-semibold">
            {isSignup ? 'Create your Hame Bookmark account' : 'Access your saved bookmarks'}
          </p>
        </div>

        {/* Login/Signup Form */}
        <div className="bg-white rounded-2xl p-8 border-4 border-black shadow-brutal">
          <form onSubmit={handleSubmit} className="space-y-5">{/* Email Input */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" strokeWidth={2.5} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neo-yellow text-black font-semibold pl-12 pr-4 py-3 rounded-lg border-3 border-black focus:border-black transition-all"
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-black mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" strokeWidth={2.5} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-neo-purple text-black font-semibold pl-12 pr-4 py-3 rounded-lg border-3 border-black focus:border-black transition-all"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border-3 border-red-600 rounded-lg p-4">
                <p className="text-red-600 text-sm font-bold">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-neo-blue text-black font-black py-4 rounded-lg border-3 border-black shadow-brutal hover:shadow-brutal-sm active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" strokeWidth={3} />
                  {isSignup ? 'Creating Account...' : 'Signing in...'}
                </>
              ) : (
                <>
                  {isSignup ? <UserPlus className="w-5 h-5" strokeWidth={3} /> : <LogIn className="w-5 h-5" strokeWidth={3} />}
                  {isSignup ? 'Create Account' : 'Sign In'}
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
              }}
              className="text-black font-bold text-sm hover:underline"
            >
              {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-black text-xs font-semibold mt-6">
          Hame Bookmark - Save and organize your favorite links
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

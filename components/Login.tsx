import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { usersApi } from '../services/apiClient';

interface DemoCredential {
  role: string;
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [demoCredentials, setDemoCredentials] = useState<DemoCredential[]>([]);
  const [isLoadingCreds, setIsLoadingCreds] = useState(false);

  // Fetch demo credentials from database - DEVELOPMENT ONLY - REMOVE BEFORE DEPLOYMENT
  // Shows only one credential per role (first user found for each role)
  // All users have the password: 'demo123'
  useEffect(() => {
    const fetchDemoCredentials = async () => {
      try {
        setIsLoadingCreds(true);
        // Fetch all users from database
        const users = await usersApi.getAll();
        
        // Get unique roles - only one user per role (first one found for each role)
        const roleMap = new Map<string, DemoCredential>();
        
        (users as any[]).forEach((user: any) => {
          // Only add if we haven't seen this role before (ensures one per role)
          if (!roleMap.has(user.role)) {
            roleMap.set(user.role, {
              role: user.role,
              email: user.email,
              password: 'demo123', // Password for demo credentials display
            });
          }
        });
        
        // Convert map to array and sort by role name
        const creds: DemoCredential[] = Array.from(roleMap.values()).sort((a, b) => 
          a.role.localeCompare(b.role)
        );
        
        setDemoCredentials(creds);
      } catch (error) {
        console.error('Failed to fetch demo credentials from database:', error);
        // Fallback to empty array if API fails
        setDemoCredentials([]);
      } finally {
        setIsLoadingCreds(false);
      }
    };

    // Only fetch in development mode
    const isDevelopment = (import.meta as any).env?.DEV || (import.meta as any).env?.VITE_USE_API === 'true';
    if (isDevelopment) {
      fetchDemoCredentials();
    }
  }, []);

  const copyCredentials = (index: number, email: string, password: string) => {
    const text = `Email: ${email}\nPassword: ${password}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const fillCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setShowDemoModal(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    if (!email || !password) {
      setError('Email and password are required.');
      setIsLoggingIn(false);
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Three Dots Menu Button - Top Right */}
      <button
        type="button"
        onClick={() => setShowDemoModal(true)}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 transition-all duration-200 group"
        title="Demo Credentials"
      >
        <svg className="w-6 h-6 text-white group-hover:text-yellow-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      </button>

      {/* Abstract 3D shapes background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large organic blob shapes */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-cyan-300/25 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-blue-400/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/3 w-72 h-72 bg-indigo-300/25 rounded-full blur-3xl"></div>
        
        {/* Wavy/organic shapes */}
        <div className="absolute top-1/3 left-0 w-64 h-32 bg-white/10 rounded-full blur-2xl rotate-45"></div>
        <div className="absolute bottom-1/3 right-0 w-80 h-40 bg-white/10 rounded-full blur-2xl -rotate-12"></div>
        <div className="absolute top-1/2 right-1/4 w-56 h-28 bg-white/10 rounded-full blur-2xl rotate-12"></div>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Brand Section - Centered above card */}
        <div className="mb-12">
          <div className="flex flex-col items-center justify-center gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img 
                src="/logo.png" 
                alt="Viruj Pharmaceuticals Logo" 
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-lg"
                onError={(e) => {
                  // Fallback if logo fails to load
                  console.error('Logo failed to load');
                }}
              />
            </div>
            
            {/* Company Name - Centered below logo */}
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wide whitespace-nowrap 
                             text-white 
                             drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]
                             font-sans antialiased">
                VIRUJ PHARMACEUTICALS
              </h1>
            </div>
          </div>
        </div>

        {/* Glassmorphism Login Card */}
        <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 sm:p-10">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 mb-2">
              Login
            </h2>
            <p className="text-blue-800/80 text-sm sm:text-base">
              Sign in to access your account
            </p>
          </div>
          
          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-semibold text-blue-900 mb-2"
              >
                Email
              </label>
              <Input 
                type="email" 
                id="email" 
                placeholder="username@pharma.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={`w-full h-12 px-4 text-base bg-white border-2 rounded-xl transition-all duration-200 ${
                  focusedField === 'email' 
                    ? 'border-green-500 shadow-md text-gray-900' 
                    : 'border-gray-200 text-gray-900 hover:border-gray-300 focus:border-green-500'
                } placeholder:text-gray-400 focus:outline-none`}
                disabled={isLoggingIn}
                autoFocus
              />
            </div>
            
            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-semibold text-blue-900 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Input 
                  type={showPassword ? 'text' : 'password'}
                  id="password" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full h-12 px-4 pr-12 text-base bg-white border-2 rounded-xl transition-all duration-200 ${
                    focusedField === 'password' 
                      ? 'border-green-500 shadow-md text-gray-900' 
                      : 'border-gray-200 text-gray-900 hover:border-gray-300 focus:border-green-500'
                  } placeholder:text-gray-400 focus:outline-none`}
                  disabled={isLoggingIn}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoggingIn) {
                      handleLogin(e as any);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none p-1"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0L3 12m3.29-5.71L12 12m-8.71 0L12 12m0 0l8.71 8.71M12 12l8.71-8.71M12 12L3.29 3.29" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-blue-900 hover:text-blue-700 font-medium transition-colors duration-200 focus:outline-none"
                onClick={() => {
                  // Add forgot password functionality here if needed
                }}
              >
                Forgot Password?
              </button>
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-sm font-medium text-red-700 flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}
            
            {/* Sign In Button */}
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/30">
            <p className="text-center text-xs sm:text-sm text-blue-900/80 font-medium">
              Secure login powered by{' '}
              <span className="text-blue-900 font-semibold">Viruj Group</span>
            </p>
          </div>
        </div>
      </div>

      {/* Demo Credentials Modal - DEVELOPMENT ONLY - REMOVE BEFORE DEPLOYMENT */}
      {showDemoModal && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setShowDemoModal(false)}
          ></div>
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-200 scale-100 opacity-100">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Demo Credentials</h3>
                    <p className="text-sm text-gray-500">Development Only</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDemoModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Close"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Click on any credential to auto-fill, or click the copy icon to copy
                </p>
                {isLoadingCreds ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading credentials...</span>
                  </div>
                ) : demoCredentials.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No demo credentials available</p>
                    <p className="text-sm text-gray-400 mt-2">Make sure the backend is running and database is initialized</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {demoCredentials.map((cred, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-all duration-200 cursor-pointer group border border-gray-200 hover:border-blue-300"
                      onClick={() => fillCredentials(cred.email, cred.password)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{cred.role}</p>
                          <p className="text-xs text-gray-600 mt-1.5 font-mono">{cred.email}</p>
                          <p className="text-xs text-gray-500 mt-0.5 font-mono">Password: {cred.password}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyCredentials(index, cred.email, cred.password);
                          }}
                          className="ml-3 p-2 rounded-lg bg-white hover:bg-blue-100 transition-colors shadow-sm"
                          title="Copy credentials"
                        >
                          {copiedIndex === index ? (
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          )}
                        </button>
                    </div>
                  </div>
                    ))}
                  </div>
                )}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-red-600 font-semibold text-center">
                    ⚠️ REMOVE THIS SECTION BEFORE DEPLOYMENT
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;

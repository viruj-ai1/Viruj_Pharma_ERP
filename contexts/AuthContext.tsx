
import React, { createContext, useState, useCallback, useEffect } from 'react';
import type { User } from '../types';
import { authApi, apiClient } from '../services/apiClient';
import { USERS } from '../services/mockData'; // Fallback for demo mode

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginById: (userId: string) => void; // For backward compatibility
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if we should use API or mock data.
// Default to using the live API unless explicitly disabled via VITE_USE_API=false
const useApiEnv = import.meta.env.VITE_USE_API;
const USE_API = useApiEnv === undefined ? true : useApiEnv === 'true' || useApiEnv === true;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      if (USE_API && apiClient['token']) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData as User);
        } catch (error) {
          console.error('Session check failed:', error);
          apiClient.setToken(null);
        }
      }
      setIsLoading(false);
    };
    checkSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    if (USE_API) {
      try {
        setIsLoading(true);
        const response = await authApi.login(email, password);
        apiClient.setToken(response.access_token);
        setUser(response.user as User);
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    } else {
      // Fallback to mock data for demo
      const userToLogin = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (userToLogin && password === 'demo123') {
        setUser(userToLogin);
      } else {
        throw new Error('Invalid email or password');
      }
    }
  }, []);

  // Backward compatibility: login by user ID (for Quick Access)
  const loginById = useCallback((userId: string) => {
    const userToLogin = USERS.find(u => u.id === userId);
    if (userToLogin) {
      setUser(userToLogin);
      // Also try to login via API if available
      if (USE_API) {
        login(userToLogin.email, 'demo123').catch(() => {
          // If API fails, continue with mock data
        });
      }
    } else {
      console.error("User not found");
    }
  }, [login]);

  const logout = useCallback(() => {
    setUser(null);
    apiClient.setToken(null);
    if (USE_API) {
      authApi.logout().catch(console.error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, loginById, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
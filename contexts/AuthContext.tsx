
import React, { createContext, useState, useCallback } from 'react';
import type { User } from '../types';
import { USERS } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  login: (userId: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((userId: string) => {
    const userToLogin = USERS.find(u => u.id === userId);
    if (userToLogin) {
      setUser(userToLogin);
    } else {
      console.error("User not found");
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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
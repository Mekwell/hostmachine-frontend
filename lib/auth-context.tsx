"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '@/app/actions';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (email: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('hm_session');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password?: string) => {
    if (!password) throw new Error('Password required');

    const response: any = await loginUser({ email, password });
    if (response.access_token) {
        const userData = { ...response.user, token: response.access_token };
        localStorage.setItem('hm_session', JSON.stringify(userData));
        setUser(userData);
    } else {
        throw new Error(response.message || 'Login failed');
    }
  };

  const register = async (email: string, password?: string) => {
      if (!password) throw new Error('Password required');
      const response: any = await registerUser({ email, password });
      if (response.status !== 'success') {
          throw new Error(response.message || 'Registration failed');
      }
      // Registration successful, usually we wait for email verification or auto-login
      // For now, we don't auto-login to force email check flow
  };

  const logout = async () => {
    localStorage.removeItem('hm_session');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

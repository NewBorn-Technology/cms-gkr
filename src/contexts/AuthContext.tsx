'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if token exists on mount
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
      // Only redirect if we're on the login page
      const currentPath = window.location.pathname;
      if (currentPath === '/login') {
        router.replace('/');
      }
    } else {
      setIsAuthenticated(false);
      // Only redirect to login if we're on a protected route
      const currentPath = window.location.pathname;
      const protectedRoutes = ['/devotions', '/church-events'];
      if (protectedRoutes.some(route => currentPath.startsWith(route))) {
        router.replace('/login');
      }
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInfo');
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    router.replace('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
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
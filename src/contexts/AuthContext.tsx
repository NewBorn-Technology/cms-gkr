'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { initAuthFromStorage, clearUserInfo } from '@/utils/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Use Zustand store for consistent auth state
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Safe check for localStorage (client-side only)
    if (typeof window !== 'undefined') {
      // Initialize auth from localStorage
      initAuthFromStorage();
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    // Only run redirection logic after initialization
    if (!isInitialized) return;

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    
    if (isAuthenticated) {
      // Only redirect if we're on the login page
      if (currentPath === '/login') {
        router.replace('/');
      }
    } else {
      // If not authenticated, check if on protected routes
      const protectedRoutes = ['/home', '/devotions', '/church-events', '/community'];
      if (protectedRoutes.some(route => currentPath.startsWith(route))) {
        console.log('Redirecting from protected route to login:', currentPath);
        router.replace('/login');
      }
    }
  }, [isAuthenticated, router, isInitialized]);

  const logout = () => {
    clearUserInfo();
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
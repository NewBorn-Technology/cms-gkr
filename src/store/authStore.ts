import { create } from 'zustand';
import { LoginResponseData } from '../types/api';

interface AuthState {
  user: { 
    accessToken: string;
    user: LoginResponseData; 
  } | null;
  isAuthenticated: boolean;
  setUser: (userData: { accessToken: string; user: LoginResponseData }) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (userData) => set({ user: userData, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
})); 
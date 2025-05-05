import { create } from 'zustand';
import { LoginResponseData } from '../types/api';

interface AuthState {
  user: LoginResponseData | null;
  isAuthenticated: boolean;
  setUser: (user: LoginResponseData) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
})); 
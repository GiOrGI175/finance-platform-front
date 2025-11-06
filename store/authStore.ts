import { create } from 'zustand';

type User = {
  id: string;
  email: string;
  username: string;
} | null;

type AuthState = {
  token: string | null;
  user: User;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => set({ token, user }),
  clearAuth: () => set({ token: null, user: null }),
}));

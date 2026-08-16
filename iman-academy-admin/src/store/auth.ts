// store/auth.ts
import { create } from "zustand";
import type { CurrentUserResponse } from "../types";

interface AuthState {
  accessToken: string | null;
  user: CurrentUserResponse | null;
  email: string | null;
  role: string | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: CurrentUserResponse | null) => void;
  setEmail: (email: string | null) => void;
  setRole: (role: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  email: null,
  role: null,
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  setEmail: (email) => set({ email }),
  setRole: (role) => set({ role }),
}));
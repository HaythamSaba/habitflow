import { create } from "zustand";
import { User } from "@supabase/supabase-js";
interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isInitialized: false,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ isLoading: loading }),
  setInitialized: (initialized) => set({ isInitialized: initialized }),
  reset: () => set({ user: null, isLoading: false, isInitialized: true }),
}));

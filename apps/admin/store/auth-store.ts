import { AdminUser } from "@/types/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthState {
  user: AdminUser | null;
  setUser: (user: AdminUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: "auth-store" },
  ),
);

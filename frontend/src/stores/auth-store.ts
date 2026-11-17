/** Global auth store using Zustand with session restore. */

"use client";

import { create } from "zustand";
import type { User } from "@/types";
import { auth } from "@/lib/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (user: User, token: string) => void;
  updateUser: (user: User) => void;
  logout: () => void;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  updateUser: (user) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
    set({ user });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    // Attempt backend logout call (fire and forget)
    auth.logout().catch(() => {});
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  hydrate: async () => {
    if (typeof window === "undefined") {
      set({ isLoading: false });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token) {
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        return;
      }

      // Pre-populate state from localStorage for instantaneous UI rendering
      let cachedUser: User | null = null;
      if (userStr) {
        try {
          cachedUser = JSON.parse(userStr) as User;
          set({ user: cachedUser, token, isAuthenticated: true, isLoading: false });
        } catch {
          // ignore corrupted JSON
        }
      }

      // Verify token with backend /api/auth/me to guarantee session validity
      try {
        const freshUser = await auth.me();
        localStorage.setItem("user", JSON.stringify(freshUser));
        set({ user: freshUser, token, isAuthenticated: true, isLoading: false });
      } catch (err: any) {
        // Token is invalid/expired
        if (err?.status === 401 || err?.status === 404) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        } else {
          // Network hiccup or server offline, retain cached user if present
          if (cachedUser) {
            set({ user: cachedUser, token, isAuthenticated: true, isLoading: false });
          } else {
            set({ isLoading: false });
          }
        }
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));

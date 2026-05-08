"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/src/types/user";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  deviceId: string | null;

  setUser: (user: User | null) => void;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  setDeviceId: (deviceId: string | null) => void;
  setAuthData: (
    user: User | null,
    accessToken: string | null,
    refreshToken: string | null,
    deviceId: string | null,
  ) => void;
  clearSession: () => void;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      deviceId: null,

      setUser: (user) => set({ user }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setDeviceId: (deviceId) => set({ deviceId }),

      setAuthData: (user, accessToken, refreshToken, deviceId) =>
        set({ user, accessToken, refreshToken, deviceId }),

      login: (user) =>
        set({
          user,
          accessToken: user?.token ?? null,
          refreshToken: user?.refreshToken ?? null,
          deviceId: user?.deviceId ?? null,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          deviceId: null,
        }),

      clearSession: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          deviceId: null,
        }),
    }),
    {
      name: "melody-stream-auth-store",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        deviceId: state.deviceId,
      }),
    },
  ),
);

// Backwards-compatible alias used across the codebase
export const useAuth = useAuthStore;

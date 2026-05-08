"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/src/types/user";

export const AUTH_STORE_STORAGE_KEY = "melody-stream-auth-store";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  deviceId: string | null;

  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setDeviceId: (deviceId: string) => void;
  setAuthData: (
    user: User | null,
    accessToken: string,
    refreshToken: string,
    deviceId: string,
  ) => void;
  clearSession: () => void;
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

      clearSession: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          deviceId: null,
        }),
    }),
    {
      name: AUTH_STORE_STORAGE_KEY,
      version: 1,
    },
  ),
);

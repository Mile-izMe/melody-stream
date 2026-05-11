"use client";

import { requestRefreshToken } from "@/src/features/graphql/mutations/auth";
import {
  decodeJwtPayload,
  getOrCreateDeviceId,
  getTokenExpiryTime,
  loadAuthSession,
} from "@/src/libs/auth-session";
import { useAuthStore } from "@/src/stores/use-auth-store";
import { User } from "@/src/types/user";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
} from "react";

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  refreshSession: () => Promise<User | null>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_REFRESH_MARGIN_MS = 60_000;
const AUTH_REFRESH_FALLBACK_DELAY_MS = 10 * 60 * 1000;

function buildSession(session: User): User {
  return {
    ...session,
    deviceId: session.deviceId ?? getOrCreateDeviceId(),
    refreshToken: session.refreshToken ?? "",
  };
}

function getRefreshDelay(expiresAt: number | null) {
  if (!expiresAt) {
    return AUTH_REFRESH_FALLBACK_DELAY_MS;
  }

  return Math.max(expiresAt - Date.now() - AUTH_REFRESH_MARGIN_MS, 5_000);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const refreshTimerRef = useRef<number | null>(null);
  const refreshSessionRef = useRef<() => Promise<User | null>>(
    async () => null,
  );

  // Subscribe to store user for context consumer compatibility
  const user = useAuthStore((state) => state.user);

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current !== null) {
      window.clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  const scheduleRefresh = useCallback(
    (session: User | null) => {
      clearRefreshTimer();

      if (!session?.refreshToken) {
        return;
      }

      const delay = getRefreshDelay(getTokenExpiryTime(session.token));
      refreshTimerRef.current = window.setTimeout(() => {
        void refreshSessionRef.current();
      }, delay);
    },
    [clearRefreshTimer],
  );

  const logout = useCallback(() => {
    clearRefreshTimer();
    useAuthStore.getState().clearSession();
  }, [clearRefreshTimer]);

  const refreshSession = useCallback(async () => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser?.refreshToken || !currentUser.deviceId) {
      return null;
    }

    try {
      const response = await requestRefreshToken({
        refreshToken: currentUser.refreshToken,
        deviceId: currentUser.deviceId,
      });

      const payload = response.refreshToken.data;
      if (!payload) {
        throw new Error("Unable to refresh session");
      }

      const decoded = decodeJwtPayload(payload.accessToken);
      const nextUser: User = {
        ...currentUser,
        id: decoded?.sub ?? currentUser.id,
        token: payload.accessToken,
        refreshToken: payload.refreshToken,
        deviceId: currentUser.deviceId,
      };

      useAuthStore
        .getState()
        .setAuthData(
          nextUser,
          payload.accessToken,
          payload.refreshToken,
          currentUser.deviceId,
        );
      scheduleRefresh(nextUser);
      return nextUser;
    } catch {
      logout();
      return null;
    }
  }, [logout, scheduleRefresh]);

  useEffect(() => {
    refreshSessionRef.current = refreshSession;
  }, [refreshSession]);

  useEffect(() => {
    const savedUser = loadAuthSession();
    if (!savedUser) {
      getOrCreateDeviceId();
      return;
    }

    const nextUser = buildSession(savedUser);
    const timeoutId = window.setTimeout(() => {
      useAuthStore
        .getState()
        .setAuthData(
          nextUser,
          nextUser.token,
          nextUser.refreshToken ?? "",
          nextUser.deviceId ?? getOrCreateDeviceId(),
        );
      scheduleRefresh(nextUser);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [scheduleRefresh]);

  const login = useCallback(
    (userData: User) => {
      const nextUser = buildSession(userData);
      useAuthStore
        .getState()
        .setAuthData(
          nextUser,
          nextUser.token,
          nextUser.refreshToken ?? "",
          nextUser.deviceId ?? getOrCreateDeviceId(),
        );
      scheduleRefresh(nextUser);
    },
    [scheduleRefresh],
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

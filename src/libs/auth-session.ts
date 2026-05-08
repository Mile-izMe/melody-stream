import type { User } from "@/src/types/user";
import { useAuthStore } from "@/src/stores/use-auth-store";

export const AUTH_DEVICE_ID_STORAGE_KEY = "melody-stream-device-id";

export interface JwtPayloadLike {
  sub?: string;
  exp?: number;
  iat?: number;
  deviceId?: string;
  roles?: string[];
  permissions?: string[];
}

export function getOrCreateDeviceId() {
  if (typeof window === "undefined") {
    return "server";
  }

  // Try to get from Zustand store first
  const storeDeviceId = useAuthStore.getState().deviceId;
  if (storeDeviceId) {
    return storeDeviceId;
  }

  // Fallback to localStorage for backwards compatibility
  const savedDeviceId = window.localStorage.getItem(AUTH_DEVICE_ID_STORAGE_KEY);
  if (savedDeviceId) {
    useAuthStore.getState().setDeviceId(savedDeviceId);
    return savedDeviceId;
  }

  // Generate new device ID
  const generatedDeviceId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `device-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  useAuthStore.getState().setDeviceId(generatedDeviceId);
  window.localStorage.setItem(AUTH_DEVICE_ID_STORAGE_KEY, generatedDeviceId);
  return generatedDeviceId;
}

export function normalizeAuthSession(user: User): User {
  return {
    ...user,
    refreshToken: user.refreshToken ?? "",
    deviceId: user.deviceId ?? getOrCreateDeviceId(),
  };
}

export function loadAuthSession() {
  // Load session from Zustand store
  const state = useAuthStore.getState();
  if (!state.user || !state.accessToken) {
    return null;
  }
  return normalizeAuthSession(state.user);
}

export function saveAuthSession(session: User) {
  // Save session to Zustand store
  const store = useAuthStore.getState();
  store.setAuthData(
    session,
    session.token,
    session.refreshToken ?? "",
    session.deviceId ?? getOrCreateDeviceId(),
  );
}

export function clearAuthSession() {
  // Clear session from Zustand store
  useAuthStore.getState().clearSession();
}

export function decodeJwtPayload(token: string) {
  if (!token) {
    return null;
  }

  const segments = token.split(".");
  if (segments.length < 2) {
    return null;
  }

  try {
    const payloadBase64 = segments[1].replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayloadBase64 = payloadBase64.padEnd(
      payloadBase64.length + ((4 - (payloadBase64.length % 4)) % 4),
      "=",
    );
    const payloadJson = atob(paddedPayloadBase64);
    return JSON.parse(payloadJson) as JwtPayloadLike;
  } catch {
    return null;
  }
}

export function deriveUsernameFromEmail(email: string) {
  const localPart = email.split("@")[0]?.trim();
  return localPart || email;
}

export function getTokenExpiryTime(token: string) {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) {
    return null;
  }

  return payload.exp * 1000;
}

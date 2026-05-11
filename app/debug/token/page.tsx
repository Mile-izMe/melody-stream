"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/stores/use-auth-store";
import { decodeJwtPayload, getTokenExpiryTime } from "@/src/libs/auth-session";
import { requestRefreshToken } from "@/src/features/graphql/mutations/auth";
import { notify } from "@/src/libs/toast";

interface RefreshLog {
  timestamp: string;
  status: "pending" | "success" | "error";
  message: string;
}

export default function TokenDebugPage() {
  const { user, accessToken, refreshToken, deviceId } = useAuth();
  const [logs, setLogs] = useState<RefreshLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<{
    accessTokenExp?: number;
    accessTokenExpiry?: string;
    refreshTokenExp?: number;
    timeUntilExpiry?: string;
  }>({});

  // Update token info
  useEffect(() => {
    if (!accessToken) return;

    const decoded = decodeJwtPayload(accessToken);
    const expiryMs = getTokenExpiryTime(accessToken);

    setTokenInfo({
      accessTokenExp: decoded?.exp,
      accessTokenExpiry: expiryMs
        ? new Date(expiryMs).toLocaleString("vi-VN")
        : "Unknown",
      refreshTokenExp: decodeJwtPayload(refreshToken)?.exp,
      timeUntilExpiry: expiryMs
        ? `${Math.round((expiryMs - Date.now()) / 1000)}s`
        : "Unknown",
    });

    // Update time countdown every second
    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = expiryMs ? Math.round((expiryMs - now) / 1000) : 0;
      setTokenInfo((prev) => ({
        ...prev,
        timeUntilExpiry: remaining > 0 ? `${remaining}s` : "Expired",
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [accessToken, refreshToken]);

  const addLog = (status: RefreshLog["status"], message: string) => {
    const log: RefreshLog = {
      timestamp: new Date().toLocaleTimeString("vi-VN"),
      status,
      message,
    };
    setLogs((prev) => [log, ...prev].slice(0, 20)); // Keep last 20 logs
  };

  const handleManualRefresh = async () => {
    if (!refreshToken || !deviceId) {
      addLog("error", "Missing refreshToken or deviceId");
      notify.error("Error", "Missing refreshToken or deviceId");
      return;
    }

    setLoading(true);
    addLog("pending", "Calling refresh token API...");

    try {
      const response = await requestRefreshToken({
        refreshToken,
        deviceId,
      });

      if (response.refreshToken.data) {
        addLog("success", "Token refreshed successfully");
        notify.success("Token refreshed", "New access token obtained");

        // Update auth store
        const decoded = decodeJwtPayload(
          response.refreshToken.data.accessToken,
        );
        const updatedUser = {
          ...user!,
          token: response.refreshToken.data.accessToken,
        };
        useAuth
          .getState()
          .setAuthData(
            updatedUser,
            response.refreshToken.data.accessToken,
            response.refreshToken.data.refreshToken,
            deviceId,
          );
      } else {
        addLog("error", response.refreshToken.message || "Refresh failed");
        notify.error("Refresh failed", response.refreshToken.message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error";
      addLog("error", message);
      notify.error("Error", message);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !accessToken) {
    return (
      <div className="min-h-screen bg-ms-bg-base p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-ms-text-primary mb-4">
            🔐 Token Debug
          </h1>
          <div className="bg-ms-bg-raised rounded-lg p-6 border border-ms-border-default">
            <p className="text-ms-text-secondary">
              Please login first to view token information
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ms-bg-base p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-ms-text-primary mb-2">
            🔐 Token Debug
          </h1>
          <p className="text-ms-text-secondary text-sm">
            Monitor and test token refresh behavior
          </p>
        </div>

        {/* User Info */}
        <div className="bg-ms-bg-raised rounded-lg p-6 border border-ms-border-default space-y-3">
          <h2 className="text-lg font-semibold text-ms-text-primary">
            👤 User Info
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-ms-text-tertiary">ID</p>
              <p className="text-ms-text-primary font-mono text-xs break-all">
                {user.id}
              </p>
            </div>
            <div>
              <p className="text-ms-text-tertiary">Email</p>
              <p className="text-ms-text-primary">{user.email}</p>
            </div>
            <div>
              <p className="text-ms-text-tertiary">Username</p>
              <p className="text-ms-text-primary">{user.username}</p>
            </div>
            <div>
              <p className="text-ms-text-tertiary">Device ID</p>
              <p className="text-ms-text-primary font-mono text-xs break-all">
                {deviceId}
              </p>
            </div>
          </div>
        </div>

        {/* Token Info */}
        <div className="bg-ms-bg-raised rounded-lg p-6 border border-ms-border-default space-y-3">
          <h2 className="text-lg font-semibold text-ms-text-primary">
            🎫 Token Status
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-ms-text-tertiary">Access Token Expiry</p>
              <p className="text-ms-text-primary">
                {tokenInfo.accessTokenExpiry}
              </p>
            </div>
            <div>
              <p className="text-ms-text-tertiary">Time Until Expiry</p>
              <p
                className={`font-bold ${
                  tokenInfo.timeUntilExpiry?.includes("Expired")
                    ? "text-ms-error"
                    : "text-ms-success"
                }`}
              >
                {tokenInfo.timeUntilExpiry}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-ms-text-tertiary text-xs mb-1">
                Access Token (first 100 chars)
              </p>
              <p className="text-ms-text-primary font-mono text-xs break-all bg-ms-bg-elevated p-2 rounded border border-ms-border-default">
                {accessToken.slice(0, 100)}...
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-ms-bg-raised rounded-lg p-6 border border-ms-border-default space-y-3">
          <h2 className="text-lg font-semibold text-ms-text-primary">
            ⚡ Actions
          </h2>
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className="w-full bg-ms-accent text-ms-bg-deep font-semibold py-3 rounded-xl hover:bg-ms-accent-hover active:scale-[0.98] disabled:opacity-50 ms-transition"
          >
            {loading ? "Refreshing..." : "🔄 Manually Refresh Token"}
          </button>
          <p className="text-xs text-ms-text-tertiary">
            Token is automatically refreshed 60s before expiry. Use this button
            to test manual refresh.
          </p>
        </div>

        {/* Logs */}
        <div className="bg-ms-bg-raised rounded-lg p-6 border border-ms-border-default space-y-3">
          <h2 className="text-lg font-semibold text-ms-text-primary">
            📋 Refresh Logs
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-ms-text-tertiary text-sm">
                No logs yet. Logs will appear here when refresh happens.
              </p>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded text-xs font-mono border ${
                    log.status === "success"
                      ? "bg-ms-success/10 border-ms-success/20 text-ms-success"
                      : log.status === "error"
                        ? "bg-ms-error/10 border-ms-error/20 text-ms-error"
                        : "bg-ms-warning/10 border-ms-warning/20 text-ms-warning"
                  }`}
                >
                  <span className="font-bold">[{log.timestamp}]</span>{" "}
                  {log.message}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-ms-accent/10 rounded-lg p-6 border border-ms-accent/20 space-y-2">
          <h3 className="font-semibold text-ms-accent">
            ℹ️ How Token Refresh Works
          </h3>
          <ul className="text-sm text-ms-text-secondary space-y-2">
            <li>
              • Token tự động refresh 60 giây trước khi hết hạn (trong
              <code className="bg-ms-bg-raised px-2 py-1 rounded text-xs">
                AuthProvider
              </code>
              )
            </li>
            <li>• Nhấn nút "Manually Refresh Token" để test thủ công</li>
            <li>
              • Xem logs ở dưới để theo dõi các sự kiện refresh (thành công/lỗi)
            </li>
            <li>• Toast notifications sẽ hiển thị kết quả refresh</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

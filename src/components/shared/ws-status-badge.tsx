"use client";

import {
  wsClient,
  type WsConnectionStatus,
} from "@/src/services/websocket-client";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const STATUS_STYLES: Record<WsConnectionStatus, string> = {
  idle: "bg-ms-text-tertiary/20 text-ms-text-secondary border-ms-border-default",
  connecting: "bg-ms-warning/10 text-ms-warning border-ms-warning/30",
  connected: "bg-ms-success/10 text-ms-success border-ms-success/30",
  disconnected: "bg-ms-error/10 text-ms-error border-ms-error/30",
  error: "bg-ms-error/10 text-ms-error border-ms-error/30",
};

const STATUS_LABELS: Record<WsConnectionStatus, string> = {
  idle: "Idle",
  connecting: "Connecting",
  connected: "Connected",
  disconnected: "Disconnected",
  error: "Error",
};

export function WsStatusBadge() {
  const pathname = usePathname();
  const [status, setStatus] = useState<WsConnectionStatus>(
    wsClient.getStatus(),
  );

  useEffect(() => {
    return wsClient.onStatusChange(setStatus);
  }, []);

  const badgeClass = useMemo(() => STATUS_STYLES[status], [status]);
  const label = STATUS_LABELS[status];

  if (pathname === "/login") {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 rounded-full border px-3 py-1.5 text-xs font-semibold backdrop-blur-sm ${badgeClass}`}
      aria-live="polite"
      aria-label={`WebSocket status: ${label}`}
      title={`WebSocket: ${label}`}
    >
      WS: {label}
    </div>
  );
}

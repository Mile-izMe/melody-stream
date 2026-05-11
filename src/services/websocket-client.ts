/**
 * Socket.IO client for real-time events.
 * Backend uses @WebSocketGateway (Socket.IO), so native WebSocket won't work.
 */

import { io, type Socket } from "socket.io-client";

type MessageHandler = (data: unknown) => void;
type StatusHandler = (status: WsConnectionStatus) => void;

export type WsConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

class WebSocketClient {
  private socket: Socket | null = null;
  private readonly url: string;
  private authToken: string | null = null;
  private status: WsConnectionStatus = "idle";
  private statusHandlers = new Set<StatusHandler>();

  constructor(
    url: string = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3001",
  ) {
    this.url = url;
  }

  private setStatus(nextStatus: WsConnectionStatus) {
    if (this.status === nextStatus) {
      return;
    }

    this.status = nextStatus;
    this.statusHandlers.forEach((handler) => handler(this.status));
  }

  getStatus() {
    return this.status;
  }

  onStatusChange(handler: StatusHandler): () => void {
    this.statusHandlers.add(handler);
    handler(this.status);
    return () => {
      this.statusHandlers.delete(handler);
    };
  }

  setAuthToken(token: string | null) {
    this.authToken = token;

    // If already connected, reconnect to send new handshake auth token.
    if (this.socket) {
      this.socket.auth = { token: this.authToken ?? undefined };
      if (this.socket.connected) {
        this.socket.disconnect().connect();
      }
    }
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        this.setStatus("connected");
        resolve();
        return;
      }

      this.setStatus("connecting");

      if (!this.socket) {
        this.socket = io(this.url, {
          transports: ["websocket"],
          autoConnect: false,
          reconnection: true,
          auth: { token: this.authToken ?? undefined },
        });

        this.socket.on("connect", () => {
          this.setStatus("connected");
          console.log("[WS] Connected", this.socket?.id);
        });

        this.socket.on("disconnect", (reason) => {
          this.setStatus("disconnected");
          console.log("[WS] Disconnected", reason);
        });

        this.socket.on("connect_error", (err) => {
          this.setStatus("error");
          console.error("[WS] Connection error", err.message);
        });
      }

      this.socket.auth = { token: this.authToken ?? undefined };

      const handleConnect = () => {
        cleanup();
        resolve();
      };

      const handleError = (err: Error) => {
        cleanup();
        reject(err);
      };

      const cleanup = () => {
        this.socket?.off("connect", handleConnect);
        this.socket?.off("connect_error", handleError);
      };

      this.socket.on("connect", handleConnect);
      this.socket.on("connect_error", handleError);
      this.socket.connect();
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.setStatus("disconnected");
  }

  on(event: string, handler: MessageHandler): () => void {
    if (!this.socket) {
      return () => undefined;
    }

    this.socket.on(event, handler);
    return () => {
      this.socket?.off(event, handler);
    };
  }

  send(event: string, payload: unknown) {
    if (!this.socket?.connected) {
      console.warn("[WS] Cannot emit - not connected");
      return;
    }

    this.socket.emit(event, payload);
  }

  isConnected() {
    return Boolean(this.socket?.connected);
  }
}

export const wsClient = new WebSocketClient();

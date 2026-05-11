/**
 * WebSocket client for real-time data updates (music catalog changes)
 * Only connects when needed, reconnects on disconnect
 */

type MessageHandler = (data: unknown) => void;

interface WebSocketMessage {
  type: string;
  payload: unknown;
}

class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;

  constructor(
    url: string = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3001/ws",
  ) {
    this.url = url;
  }

  /**
   * Connect to WebSocket (lazy initialization)
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          console.log("[WS] Connected");
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.emit(message.type, message.payload);
          } catch (err) {
            console.error("[WS] Invalid message format", err);
          }
        };

        this.ws.onerror = (error) => {
          console.error("[WS] Connection error", error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log("[WS] Disconnected");
          this.handleReconnect();
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Subscribe to message type
   */
  on(type: string, handler: MessageHandler): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.handlers.get(type)?.delete(handler);
    };
  }

  /**
   * Emit message to subscribers
   */
  private emit(type: string, payload: unknown): void {
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.forEach((handler) => handler(payload));
    }
  }

  /**
   * Send message to server
   */
  send(type: string, payload: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      console.warn("[WS] Cannot send - not connected");
    }
  }

  /**
   * Automatic reconnect with exponential backoff
   */
  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("[WS] Max reconnect attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    console.log(
      `[WS] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`,
    );

    setTimeout(() => {
      this.connect().catch((err) => {
        console.error("[WS] Reconnect failed", err);
      });
    }, delay);
  }

  /**
   * Check connection status
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

export const wsClient = new WebSocketClient();

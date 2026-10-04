import { getAccessToken, refreshAccessToken } from "@/api/tokens";
import { getApiBaseUrl } from "@/api/apiInstance";

export type RealtimeEventHandler<T = any> = (payload: T) => void;

export interface RealtimeMessage {
  type?: string;
  event?: string;
  data?: any;
  timestamp?: string;
  correlation_id?: string;
  [key: string]: any;
}

class RealtimeClient {
  private socket: WebSocket | null = null;
  private listeners = new Map<string, Set<RealtimeEventHandler>>();
  private reconnectAttempt = 0;
  private maxReconnectDelay = 30000;
  private reconnectTimer: any = null;
  private heartbeatTimer: any = null;
  private isExplicitlyClosed = false;
  private processedEventIds = new Set<string>();
  private readonly maxProcessedCacheSize = 500;
  private isConnected = false;
  private onReconnectCallbacks = new Set<() => void>();

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("online", () => {
        if (!this.isConnected && !this.isExplicitlyClosed) {
          this.connect();
        }
      });
      window.addEventListener("offline", () => {
        this.cleanupSocket();
      });
    }
  }

  public connect(): void {
    if (typeof window === "undefined") return;
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.isExplicitlyClosed = false;
    const token = getAccessToken();
    if (!token) {
      return;
    }

    const apiBase = getApiBaseUrl();
    const wsProto = apiBase.startsWith("https") ? "wss:" : "ws:";
    const host = apiBase.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    const wsUrl = `${wsProto}//${host}/api/v1/connect/ws?token=${encodeURIComponent(token)}`;

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.isConnected = true;
        const wasReconnecting = this.reconnectAttempt > 0;
        this.reconnectAttempt = 0;
        this.startHeartbeat();

        if (wasReconnecting) {
          this.onReconnectCallbacks.forEach((cb) => {
            try {
              cb();
            } catch (err) {
              console.error("[Realtime] Error in reconnect callback:", err);
            }
          });
        }
      };

      this.socket.onmessage = (event) => {
        this.handleIncomingMessage(event.data);
      };

      this.socket.onerror = () => {
        // Socket errors are followed by close
      };

      this.socket.onclose = (event) => {
        this.isConnected = false;
        this.cleanupHeartbeat();

        if (event.code === 1008) {
          // Token expired or policy violation -> refresh token and reconnect
          refreshAccessToken({ silent: true })
            .then(() => {
              this.scheduleReconnect();
            })
            .catch(() => {
              // Refresh failed
            });
          return;
        }

        if (!this.isExplicitlyClosed) {
          this.scheduleReconnect();
        }
      };
    } catch {
      this.scheduleReconnect();
    }
  }

  public disconnect(): void {
    this.isExplicitlyClosed = true;
    this.cleanupSocket();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  public on<T = any>(event: string, handler: RealtimeEventHandler<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);

    // Return unbind function
    return () => {
      this.listeners.get(event)?.delete(handler);
    };
  }

  public onReconnect(callback: () => void): () => void {
    this.onReconnectCallbacks.add(callback);
    return () => {
      this.onReconnectCallbacks.delete(callback);
    };
  }

  public emit(type: string, data: any): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }
    try {
      const payload: RealtimeMessage = {
        type,
        data,
        timestamp: new Date().toISOString(),
      };
      this.socket.send(JSON.stringify(payload));
    } catch {
      // Send failure
    }
  }

  public sendTyping(target: { channelId?: string; conversationId?: string; isTyping: boolean }): void {
    this.emit("typing", target);
  }

  public sendSignal(callId: string, signalData: any): void {
    this.emit("signal", { call_id: callId, ...signalData });
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }

  // ── Internal Helpers ──────────────────────────────────────

  private handleIncomingMessage(raw: string): void {
    try {
      const msg: RealtimeMessage = JSON.parse(raw);
      const eventName = msg.event || msg.type || "";
      if (!eventName) return;

      // Duplicate-event suppression
      const eventId = msg.correlation_id || msg.data?.id || `${eventName}-${msg.timestamp}-${JSON.stringify(msg.data).slice(0, 50)}`;
      if (this.processedEventIds.has(eventId)) {
        return;
      }
      this.processedEventIds.add(eventId);
      if (this.processedEventIds.size > this.maxProcessedCacheSize) {
        const oldest = this.processedEventIds.values().next().value;
        if (oldest) this.processedEventIds.delete(oldest);
      }

      // Dispatch to specific event listeners
      const specificHandlers = this.listeners.get(eventName);
      if (specificHandlers) {
        specificHandlers.forEach((h) => {
          try {
            h(msg.data !== undefined ? msg.data : msg);
          } catch (err) {
            console.error(`[Realtime] Handler error for ${eventName}:`, err);
          }
        });
      }

      // Dispatch to wildcard listeners
      const allHandlers = this.listeners.get("*");
      if (allHandlers) {
        allHandlers.forEach((h) => {
          try {
            h(msg);
          } catch (err) {
            console.error("[Realtime] Handler error for *:", err);
          }
        });
      }
    } catch {
      // Non-JSON frame
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer || this.isExplicitlyClosed) return;
    this.reconnectAttempt++;

    // Exponential backoff with random jitter (1s, 2s, 4s, 8s, up to 30s)
    const baseDelay = Math.min(1000 * Math.pow(2, this.reconnectAttempt - 1), this.maxReconnectDelay);
    const jitter = Math.floor(Math.random() * 800);
    const delay = baseDelay + jitter;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  private startHeartbeat(): void {
    this.cleanupHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        try {
          this.socket.send(JSON.stringify({ type: "ping", timestamp: Date.now() }));
        } catch {
          // Heartbeat failed
        }
      }
    }, 25000);
  }

  private cleanupHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private cleanupSocket(): void {
    this.cleanupHeartbeat();
    if (this.socket) {
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onerror = null;
      this.socket.onclose = null;
      try {
        this.socket.close();
      } catch {
        // Safe close
      }
      this.socket = null;
    }
    this.isConnected = false;
  }
}

export const realtimeClient = new RealtimeClient();

import { useEffect, useState } from "react";
import { connectApi } from "../connectApi";
import { realtimeClient } from "../services/realtimeClient";
import type { PresenceStatus } from "../types";

class PresenceManager {
  private myStatus: PresenceStatus = "online";
  private colleagueStatuses = new Map<string, PresenceStatus>();
  private pendingBatchUserIds = new Set<string>();
  private batchDebounceTimer: any = null;
  private subscribers = new Set<() => void>();
  private isInitialized = false;

  public init(): void {
    if (typeof window === "undefined" || this.isInitialized) return;
    this.isInitialized = true;

    // Report initial online presence
    this.setMyStatus("online");

    // Listen to browser network changes
    window.addEventListener("online", () => {
      this.setMyStatus("online");
    });
    window.addEventListener("offline", () => {
      this.setMyStatus("offline");
    });

    // Listen to tab visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.setMyStatus("away");
      } else if (document.visibilityState === "visible") {
        this.setMyStatus("online");
      }
    });

    // Listen to realtime presence broadcasts from backend
    realtimeClient.on("presence.updated", (data: any) => {
      if (data?.user_id && data?.status) {
        this.colleagueStatuses.set(String(data.user_id), data.status as PresenceStatus);
        this.notify();
      }
    });

    // Refresh presence on realtime reconnection
    realtimeClient.onReconnect(() => {
      this.setMyStatus(document.visibilityState === "visible" ? "online" : "away");
      const ids = Array.from(this.colleagueStatuses.keys());
      if (ids.length > 0) {
        this.fetchBatchPresenceNow(ids);
      }
    });
  }

  public getMyStatus(): PresenceStatus {
    return this.myStatus;
  }

  public setMyStatus(status: PresenceStatus, customStatus?: string): void {
    this.myStatus = status;
    this.notify();
    connectApi.updatePresence(status, customStatus).catch((err) => {
      // Best-effort presence sync (Group b)
      if (import.meta.env.DEV) {
        console.warn("[Presence] updatePresence failed:", err);
      }
    });
  }

  public getColleaguePresence(userId: string): PresenceStatus | undefined {
    const status = this.colleagueStatuses.get(userId);
    if (status) return status;

    // Queue for debounced batch query
    this.pendingBatchUserIds.add(userId);
    this.scheduleBatchFetch();
    return undefined;
  }

  public setColleaguePresence(userId: string, status: PresenceStatus): void {
    this.colleagueStatuses.set(userId, status);
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.subscribers.add(listener);
    return () => {
      this.subscribers.delete(listener);
    };
  }

  private scheduleBatchFetch(): void {
    if (this.batchDebounceTimer) return;
    this.batchDebounceTimer = setTimeout(() => {
      this.batchDebounceTimer = null;
      const idsToFetch = Array.from(this.pendingBatchUserIds);
      this.pendingBatchUserIds.clear();
      if (idsToFetch.length > 0) {
        this.fetchBatchPresenceNow(idsToFetch);
      }
    }, 300);
  }

  private async fetchBatchPresenceNow(userIds: string[]): Promise<void> {
    try {
      const batchResult = await connectApi.getBatchPresence(userIds);
      for (const [uid, info] of Object.entries(batchResult)) {
        if (info && info.status) {
          this.colleagueStatuses.set(uid, info.status);
        }
      }
      this.notify();
    } catch (err) {
      // Best-effort batch presence fetch (Group b)
      if (import.meta.env.DEV) {
        console.warn("[Presence] fetchBatchPresence failed:", err);
      }
    }
  }

  private notify(): void {
    this.subscribers.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        // Protect other subscriber callbacks (Group b)
        if (import.meta.env.DEV) {
          console.warn("[Presence] Subscriber callback error:", err);
        }
      }
    });
  }
}

export const presenceManager = new PresenceManager();

/**
 * React hook to observe a colleague's live presence.
 */
export function usePresence(userId?: string): PresenceStatus | undefined {
  const [, setTick] = useState(0);

  useEffect(() => {
    presenceManager.init();
    const unsubscribe = presenceManager.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  if (!userId) return undefined;
  return presenceManager.getColleaguePresence(userId);
}

/**
 * React hook to observe current user's presence.
 */
export function useMyPresence(): {
  myStatus: PresenceStatus;
  setMyStatus: (status: PresenceStatus, custom?: string) => void;
} {
  const [, setTick] = useState(0);

  useEffect(() => {
    presenceManager.init();
    return presenceManager.subscribe(() => setTick((t) => t + 1));
  }, []);

  return {
    myStatus: presenceManager.getMyStatus(),
    setMyStatus: (s, c) => presenceManager.setMyStatus(s, c),
  };
}

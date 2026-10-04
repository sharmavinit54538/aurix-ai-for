import React, { useEffect } from "react";
import { useAurix } from "@/lib/aurix-store";
import { realtimeClient } from "../services/realtimeClient";
import { callManager } from "../stores/callStore";

/**
 * Shell-level Realtime and Call Lifecycle Provider.
 * Connects realtimeClient and initializes callManager when a user is authenticated.
 * Disconnects realtimeClient when the user logs out.
 */
export function RealtimeCallProvider({ children }: { children: React.ReactNode }) {
  const ws = useAurix();
  const userId = ws.user?.id;

  useEffect(() => {
    if (userId) {
      callManager.init();
      realtimeClient.connect();
    } else {
      realtimeClient.disconnect();
    }
  }, [userId]);

  return <>{children}</>;
}

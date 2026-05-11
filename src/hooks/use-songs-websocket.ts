/**
 * React hook to sync songs data with WebSocket updates
 * Only invalidates cache when server sends update notification
 */

"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { wsClient } from "@/src/services/websocket-client";

export interface SongsUpdatePayload {
  type: "added" | "updated" | "deleted" | "bulk";
  songIds?: string[];
  reason?: string;
}

export function useSongsWebSocket() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const setupWebSocket = async () => {
      try {
        // Only connect if not already connected
        if (!wsClient.isConnected()) {
          await wsClient.connect();
        }

        // Subscribe to songs updates
        unsubscribe = wsClient.on("songs:updated", (payload) => {
          const update = payload as SongsUpdatePayload;
          console.log("[Songs] Server notification:", update);

          // Invalidate the songs query to refetch
          queryClient.invalidateQueries({ queryKey: ["songs"] });
        });
      } catch (err) {
        console.error("[useSongsWebSocket] Failed to connect", err);
        // Fallback: if WebSocket fails, use fallback strategy
      }
    };

    setupWebSocket();

    // Cleanup: disconnect if no other hooks are using WebSocket
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [queryClient]);
}

/**
 * Alternative: Use with manual cache invalidation
 * Useful for user-triggered actions
 */
export function useRefreshSongs() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries({ queryKey: ["songs"] });
    },
    refetch: async () => {
      await queryClient.refetchQueries({ queryKey: ["songs"] });
    },
  };
}

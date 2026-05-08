"use client";

import { useEffect } from "react";

const SERVICE_WORKER_PATH = "/sw.js";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    let cancelled = false;

    const register = async () => {
      try {
        await navigator.serviceWorker.register(SERVICE_WORKER_PATH, {
          scope: "/",
          updateViaCache: "none",
        });

        if (cancelled) {
          return;
        }
      } catch {
        // Ignore registration failures so the app still works without offline support.
      }
    };

    void register();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
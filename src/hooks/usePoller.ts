import { useEffect, useRef } from "react";

export interface PollerOptions {
  /** Initial polling interval in milliseconds (default 30_000). */
  intervalMs?: number;
  /** Maximum interval after back-off in milliseconds (default 60_000). */
  maxIntervalMs?: number;
  /** Exponential back-off factor applied on error (default 1.5). */
  backoffFactor?: number;
  /** Stop polling after this many consecutive non-2xx failures (default 3). */
  maxConsecutiveErrors?: number;
  /** Whether polling is actively enabled (default true). */
  enabled?: boolean;
}

/**
 * Self-scheduling poller hook with exponential back-off.
 * - Pauses automatically when tab is hidden (document.hidden).
 * - Stops automatically after maxConsecutiveErrors non-2xx failures.
 * - Resets back-off interval to baseline on success.
 * - Cleans up cleanly on component unmount.
 */
export function usePoller(
  callback: () => Promise<unknown>,
  {
    intervalMs = 30_000,
    maxIntervalMs = 60_000,
    backoffFactor = 1.5,
    maxConsecutiveErrors = 3,
    enabled = true,
  }: PollerOptions = {},
): void {
  const savedCallback = useRef(callback);
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    let isMounted = true;
    let timerId: ReturnType<typeof setTimeout> | null = null;
    let currentInterval = intervalMs;
    let consecutiveErrors = 0;

    const runAndSchedule = async () => {
      if (!isMounted || consecutiveErrors >= maxConsecutiveErrors) return;
      if (typeof document !== "undefined" && document.hidden) return;

      try {
        await savedCallback.current();
        if (!isMounted) return;
        consecutiveErrors = 0;
        currentInterval = intervalMs;
      } catch {
        if (!isMounted) return;
        consecutiveErrors += 1;
        currentInterval = Math.min(currentInterval * backoffFactor, maxIntervalMs);
      }

      if (isMounted && consecutiveErrors < maxConsecutiveErrors) {
        timerId = setTimeout(runAndSchedule, currentInterval);
      }
    };

    const handleVisibilityChange = () => {
      if (typeof document === "undefined") return;
      if (document.hidden) {
        if (timerId) {
          clearTimeout(timerId);
          timerId = null;
        }
      } else {
        if (consecutiveErrors < maxConsecutiveErrors && !timerId) {
          void runAndSchedule();
        }
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    timerId = setTimeout(runAndSchedule, currentInterval);

    return () => {
      isMounted = false;
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
      }
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };
  }, [intervalMs, maxIntervalMs, backoffFactor, maxConsecutiveErrors, enabled]);
}

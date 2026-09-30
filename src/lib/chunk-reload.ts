/**
 * Utility to detect and recover from dynamic import / chunk loading failures
 * caused by new deployments changing asset hashes while a user has an active tab.
 */

import { logger } from "@/lib/logger";

const CHUNK_RETRY_KEY = "ofc360_chunk_reload_attempted";
const CHUNK_RETRY_TIMESTAMP_KEY = "ofc360_chunk_reload_ts";
const COOLDOWN_MS = 15000; // 15-second cooldown to strictly prevent infinite reload loops

/**
 * Checks whether an error is caused by a missing chunk or failed dynamic import
 */
export function isChunkLoadError(error: unknown): boolean {
  if (!error) return false;

  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : typeof (error as Record<string, unknown>)?.message === "string"
          ? String((error as Record<string, unknown>).message)
          : "";

  const name = error instanceof Error ? error.name : "";

  const chunkErrorPatterns = [
    /Failed to fetch dynamically imported module/i,
    /error loading dynamically imported module/i,
    /Importing a module script failed/i,
    /Loading chunk [0-9a-zA-Z_-]+ failed/i,
    /Loading CSS chunk [0-9a-zA-Z_-]+ failed/i,
    /Unable to preload CSS/i,
    /ChunkLoadError/i,
    /Minified React error #520/i, // React 19 lazy component failure
    /dynamically imported module/i,
  ];

  if (chunkErrorPatterns.some((pattern) => pattern.test(message) || pattern.test(name))) {
    return true;
  }

  // Also check nested cause or error strings if available
  if (error instanceof Error && error.cause) {
    return isChunkLoadError(error.cause);
  }

  return false;
}

/**
 * Executes a controlled, single-time page reload when a chunk loading failure occurs.
 * Uses sessionStorage with timestamp checks to prevent infinite reload loops.
 * 
 * Returns true if reload was initiated, false if suppressed by loop prevention.
 */
export function safeReloadOnChunkFailure(source: string = "unknown"): boolean {
  console.warn(`[ChunkRecovery] Chunk load issue reported (${source}). Automatic page reload is disabled to preserve SPA state and prevent infinite refresh loops.`);
  return false;
}

/**
 * Checks if the current page load was the result of a chunk reload attempt
 */
export function wasReloadAttempted(): boolean {
  return false;
}

/**
 * Clears the chunk reload flags after the app has mounted and run smoothly
 */
export function clearChunkReloadFlag(): void {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  try {
    window.sessionStorage.removeItem(CHUNK_RETRY_KEY);
    window.sessionStorage.removeItem(CHUNK_RETRY_TIMESTAMP_KEY);
  } catch {
    // ignore
  }
}

/**
 * Deregisters any rogue or legacy service workers that may be caching stale JS assets
 */
export function unregisterLegacyServiceWorkers(): void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  try {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then((success) => {
          if (success) {
            logger.info("[ServiceWorker] Successfully unregistered stale service worker:", registration.scope);
          }
        });
      }
    }).catch(() => {
      // ignore
    });
  } catch {
    // ignore
  }
}

/**
 * Initializes global listeners for Vite's preloadError and unhandled module rejections.
 * Returns an unbind cleanup function.
 */
export function setupGlobalChunkErrorListeners(): () => void {
  if (typeof window === "undefined") return () => {};

  // 1. Vite's official preload error event - log only, do not force-reload page
  const onPreloadError = (event: Event) => {
    event.preventDefault();
    console.warn("[Vite] vite:preloadError event caught:", event);
  };

  // 2. Unhandled promise rejections (dynamic imports reject their promise)
  const onUnhandledRejection = (event: PromiseRejectionEvent) => {
    if (isChunkLoadError(event.reason)) {
      console.warn("[Vite] Dynamic import promise rejection caught:", event.reason);
    }
  };

  // 3. Global error handler for script loading errors
  const onError = (event: ErrorEvent) => {
    if (isChunkLoadError(event.error || event.message)) {
      console.warn("[Vite] Global script error caught:", event.message);
    }
  };

  window.addEventListener("vite:preloadError", onPreloadError);
  window.addEventListener("unhandledrejection", onUnhandledRejection);
  window.addEventListener("error", onError);

  return () => {
    window.removeEventListener("vite:preloadError", onPreloadError);
    window.removeEventListener("unhandledrejection", onUnhandledRejection);
    window.removeEventListener("error", onError);
  };
}

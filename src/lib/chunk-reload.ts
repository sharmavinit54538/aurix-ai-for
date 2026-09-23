/**
 * Utility to detect and recover from dynamic import / chunk loading failures
 * caused by new deployments changing asset hashes while a user has an active tab.
 */

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
  if (typeof window === "undefined" || !window.sessionStorage) {
    return false;
  }

  try {
    const lastReloadStr = window.sessionStorage.getItem(CHUNK_RETRY_TIMESTAMP_KEY);
    const lastReload = lastReloadStr ? parseInt(lastReloadStr, 10) : 0;
    const now = Date.now();

    // If we already reloaded recently within the cooldown window, do NOT reload again
    if (now - lastReload < COOLDOWN_MS) {
      console.warn(`[ChunkRecovery] Suppressed auto-reload for ${source}: cooldown active (${now - lastReload}ms < ${COOLDOWN_MS}ms)`);
      return false;
    }

    console.warn(`[ChunkRecovery] Chunk load failure detected (${source}). Reloading page to fetch latest build...`);
    window.sessionStorage.setItem(CHUNK_RETRY_TIMESTAMP_KEY, String(now));
    window.sessionStorage.setItem(CHUNK_RETRY_KEY, "true");

    // Perform hard reload with cache-busting timestamp to bypass stale browser caches
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("_v", String(now));
    window.location.replace(currentUrl.toString());
    return true;
  } catch (err) {
    console.error("[ChunkRecovery] Failed to execute safe reload:", err);
    return false;
  }
}

/**
 * Checks if the current page load was the result of a chunk reload attempt
 */
export function wasReloadAttempted(): boolean {
  if (typeof window === "undefined" || !window.sessionStorage) return false;
  try {
    const attempted = window.sessionStorage.getItem(CHUNK_RETRY_KEY) === "true";
    const lastReloadStr = window.sessionStorage.getItem(CHUNK_RETRY_TIMESTAMP_KEY);
    const lastReload = lastReloadStr ? parseInt(lastReloadStr, 10) : 0;
    const now = Date.now();
    // Only consider attempted if within the last 30 seconds
    return attempted && now - lastReload < 30000;
  } catch {
    return false;
  }
}

/**
 * Clears the chunk reload flags after the app has mounted and run smoothly
 */
export function clearChunkReloadFlag(): void {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  try {
    window.sessionStorage.removeItem(CHUNK_RETRY_KEY);
    // Keep timestamp for a short while to ensure cooldown holds, or clear after 10s
    setTimeout(() => {
      try {
        window.sessionStorage.removeItem(CHUNK_RETRY_TIMESTAMP_KEY);
      } catch {
        // ignore
      }
    }, 10000);
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
            console.log("[ServiceWorker] Successfully unregistered stale service worker:", registration.scope);
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

  // 1. Vite's official preload error event
  const onPreloadError = (event: Event) => {
    // Prevent default Vite error logging if we handle it
    event.preventDefault();
    console.warn("[Vite] vite:preloadError event caught");
    safeReloadOnChunkFailure("vite:preloadError");
  };

  // 2. Unhandled promise rejections (dynamic imports reject their promise)
  const onUnhandledRejection = (event: PromiseRejectionEvent) => {
    if (isChunkLoadError(event.reason)) {
      event.preventDefault();
      console.warn("[Vite] Dynamic import promise rejection caught:", event.reason);
      safeReloadOnChunkFailure("unhandledrejection");
    }
  };

  // 3. Global error handler for script loading errors
  const onError = (event: ErrorEvent) => {
    if (isChunkLoadError(event.error || event.message)) {
      console.warn("[Vite] Global script error caught:", event.message);
      safeReloadOnChunkFailure("window.onerror");
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

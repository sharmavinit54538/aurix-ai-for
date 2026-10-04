/**
 * Token Manager & Canonical Session Refresh Architecture
 *
 * Security:
 * - Access token is kept in-memory for active API authorizations.
 * - Refresh token is kept strictly in-memory (and forwarded via HttpOnly cookie).
 * - Refresh token is NEVER persisted in localStorage or sessionStorage.
 * - A non-sensitive session hint `ofc_session_hint=1` is stored in localStorage
 *   to avoid pre-login 401s on app boot.
 * - Single-flight in-memory promise coordination ensures concurrent 401s execute only 1 refresh request.
 * - Web Locks API with BroadcastChannel fallback coordinates cross-tab refresh requests.
 */

import axios from "axios";
import { toast } from "sonner";
import { aurix } from "@/lib/aurix-store";
import { safeStorage } from "@/lib/safe-storage";
import { AUTH_ENDPOINTS } from "./endpoints";
import { API_BASE_URL } from "./baseUrl";

export const SESSION_HINT_KEY = "ofc_session_hint";
export const REFRESH_TOKEN_KEY = "aurix:refresh_token";
const LEGACY_TOKENS_KEY = "aurix:tokens";

let inMemoryAccessToken: string | null = null;
let inMemoryRefreshToken: string | null = null;
let isSessionExpiredHandled = false;

// Initial migration: Clean up any legacy persisted tokens from previous versions
if (typeof window !== "undefined") {
  safeStorage.removeItem(LEGACY_TOKENS_KEY);
  safeStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function hasSessionHint(): boolean {
  if (typeof window === "undefined") return false;
  return safeStorage.getItem(SESSION_HINT_KEY) === "1";
}

export function setSessionHint(): void {
  if (typeof window === "undefined") return;
  safeStorage.setItem(SESSION_HINT_KEY, "1");
}

export function clearSessionHint(): void {
  if (typeof window === "undefined") return;
  safeStorage.removeItem(SESSION_HINT_KEY);
}

export interface Tokens {
  accessToken: string;
  refreshToken?: string;
}

export function getTokens(): Tokens | null {
  if (!inMemoryAccessToken) return null;
  return {
    accessToken: inMemoryAccessToken,
    refreshToken: inMemoryRefreshToken || undefined,
  };
}

export function setTokens(tokens: { accessToken?: string; refreshToken?: string } | null) {
  inMemoryAccessToken = tokens?.accessToken || null;
  inMemoryRefreshToken = tokens?.refreshToken || null;

  if (tokens?.accessToken) {
    setSessionHint();
  }

  // When clearing all tokens (null)
  if (!tokens) {
    inMemoryAccessToken = null;
    inMemoryRefreshToken = null;
    clearSessionHint();
  }

  // Ensure no residual tokens exist in storage
  if (typeof window !== "undefined") {
    safeStorage.removeItem(REFRESH_TOKEN_KEY);
    safeStorage.removeItem(LEGACY_TOKENS_KEY);
  }
}

export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

export function setAccessToken(token: string | null) {
  inMemoryAccessToken = token;
  if (token) {
    setSessionHint();
  }
}

export function getRefreshToken(): string | null {
  return inMemoryRefreshToken;
}

export function setRefreshToken(token: string | null) {
  inMemoryRefreshToken = token;
}

export function clearTokens() {
  inMemoryAccessToken = null;
  inMemoryRefreshToken = null;
  clearSessionHint();
  if (typeof window !== "undefined") {
    safeStorage.removeItem(REFRESH_TOKEN_KEY);
    safeStorage.removeItem(LEGACY_TOKENS_KEY);
  }
}

export function handleSessionExpired() {
  clearTokens();
  clearSessionHint();
  aurix.set({ isRestoring: false, user: null, company: null });
  safeStorage.removeItem("aurix:workspace:v1");
  safeStorage.removeItem("aurix:tokens");
  safeStorage.removeItem("aurix:refresh_token");

  if (!isSessionExpiredHandled) {
    isSessionExpiredHandled = true;
    toast.error("Session expired. Please sign in again.");
    if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
      const currentPath = window.location.pathname + window.location.search;
      const redirectParam = currentPath && currentPath !== "/" ? `?redirect=${encodeURIComponent(currentPath)}` : "";
      window.location.replace(`/login${redirectParam}`);
    }
    setTimeout(() => {
      isSessionExpiredHandled = false;
    }, 5000);
  }
}

export function resetSessionExpiredFlag() {
  isSessionExpiredHandled = false;
}

// ── Cross-tab lock coordination (Web Locks API with BroadcastChannel fallback) ──
async function acquireRefreshLock<T>(action: () => Promise<T>): Promise<T> {
  if (typeof navigator !== "undefined" && navigator.locks?.request) {
    return navigator.locks.request("ofc360_auth_refresh_lock", async () => {
      return action();
    });
  }

  if (typeof window !== "undefined" && typeof BroadcastChannel !== "undefined") {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("ofc360_auth_refresh_lock_channel");
    } catch {
      channel = null;
    }

    if (channel) {
      const lockKey = "ofc360_refresh_lock_timestamp";
      const now = Date.now();
      const existing = safeStorage.getItem(lockKey);
      if (existing) {
        const diff = now - parseInt(existing, 10);
        if (diff > 0 && diff < 5000) {
          await new Promise((r) => setTimeout(r, 200));
        }
      }
      safeStorage.setItem(lockKey, String(now));
      try {
        channel.postMessage({ type: "REFRESH_STARTED" });
        const result = await action();
        channel.postMessage({ type: "REFRESH_COMPLETED" });
        return result;
      } finally {
        safeStorage.removeItem(lockKey);
        channel.close();
      }
    }
  }

  return action();
}

let refreshPromise: Promise<string> | null = null;

/**
 * Refreshes the active access token using the canonical refresh endpoint.
 * Concurrency-safe: shares a single in-flight promise for all concurrent callers.
 */
export async function refreshAccessToken(options?: { silent?: boolean }): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      return await acquireRefreshLock(async () => {
        // Build request body: include in-memory refresh token if present; otherwise empty {} for HttpOnly cookie
        const currentRefreshToken = getRefreshToken();
        const body: Record<string, string> = {};
        if (currentRefreshToken) {
          body.refresh_token = currentRefreshToken;
          body.refreshToken = currentRefreshToken;
        }

        const refreshUrl = `${API_BASE_URL}${AUTH_ENDPOINTS.refresh}`;
        if (import.meta.env.DEV && import.meta.env.MODE !== "test" && !options?.silent) {
          console.log(`[AUTH] Request: [REFRESH] POST ${refreshUrl}`);
        }

        let res;
        try {
          res = await axios.post(refreshUrl, body, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (import.meta.env.DEV && import.meta.env.MODE !== "test" && !options?.silent) {
            console.log(`[AUTH] Response: [REFRESH] POST ${refreshUrl} -> ${res.status}`);
          }
        } catch (postErr: unknown) {
          const status = axios.isAxiosError(postErr)
            ? postErr.response?.status
            : postErr && typeof postErr === "object" && "response" in postErr && typeof (postErr as { response?: { status?: unknown } }).response?.status === "number"
              ? (postErr as { response: { status: number } }).response.status
              : undefined;
          if (import.meta.env.DEV && import.meta.env.MODE !== "test" && !options?.silent) {
            console.log(`[AUTH] Response: [REFRESH] POST ${refreshUrl} -> ${status || "NETWORK_ERROR"}`);
          }

          if (status === 404) {
            if (import.meta.env.DEV && import.meta.env.MODE !== "test" && !options?.silent) {
              console.error(
                `[AUTH] 404 Not Found received on refresh endpoint: ${refreshUrl}. Route configuration problem.`,
              );
            }
            throw new Error(`Refresh route configuration error: ${refreshUrl} returned 404`);
          }

          if (status === 401) {
            clearSessionHint();
            clearTokens();
            if (!options?.silent) {
              handleSessionExpired();
            }
            throw new Error("Failed to refresh session");
          }

          throw postErr;
        }

        const tokenData = res.data?.data ?? res.data;
        const accessToken = tokenData?.access_token || tokenData?.accessToken || tokenData?.token;

        if (!accessToken) {
          clearSessionHint();
          clearTokens();
          if (!options?.silent) {
            handleSessionExpired();
          }
          throw new Error("Invalid session refresh response: missing access token");
        }

        const newRefreshToken = tokenData?.refresh_token || tokenData?.refreshToken || currentRefreshToken;
        setTokens({ accessToken, refreshToken: newRefreshToken || undefined });
        setSessionHint();
        return accessToken;
      });
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

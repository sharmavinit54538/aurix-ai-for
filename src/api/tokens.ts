/**
 * Token Manager & Canonical Session Refresh Architecture
 *
 * Security:
 * - Access token is kept in-memory for active API authorizations.
 * - Refresh token is managed by backend via HttpOnly Secure cookie.
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
import { logger } from "@/lib/logger";
import { clearQueryCache } from "@/lib/query-client";

export const SESSION_HINT_KEY = "ofc_session_hint";

let inMemoryAccessToken: string | null = null;
let isSessionExpiredHandled = false;
let sessionVersion = 0;

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
}

export function getTokens(): Tokens | null {
  if (!inMemoryAccessToken) return null;
  return {
    accessToken: inMemoryAccessToken,
  };
}

export function setTokens(tokens: { accessToken?: string } | null) {
  sessionVersion += 1;
  inMemoryAccessToken = tokens?.accessToken || null;

  if (tokens?.accessToken) {
    setSessionHint();
  }

  // When clearing all tokens (null)
  if (!tokens) {
    inMemoryAccessToken = null;
    clearSessionHint();
    clearQueryCache();
  }
}

export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

export function setAccessToken(token: string | null) {
  sessionVersion += 1;
  inMemoryAccessToken = token;
  if (token) {
    setSessionHint();
  }
}

export function clearTokens() {
  sessionVersion += 1;
  inMemoryAccessToken = null;
  clearSessionHint();
  clearQueryCache();
}

export function handleSessionExpired() {
  if (typeof window !== "undefined") {
    const pathname = window.location.pathname;
    if (
      pathname.startsWith("/onboarding") ||
      pathname.startsWith("/employee-onboarding") ||
      pathname.startsWith("/verify-email")
    ) {
      logger.warn("handleSessionExpired bypassed: user is on onboarding or verification route", { pathname });
      return;
    }
  }

  clearTokens();
  clearSessionHint();
  aurix.set({ isRestoring: false, user: null, company: null });

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
 * Uses HttpOnly refresh cookie (withCredentials: true) - no body needed.
 * Falls back to /api/v1/auth/refresh-token if the primary endpoint is unavailable.
 */
export async function refreshAccessToken(options?: { silent?: boolean }): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  const refreshSessionVersion = sessionVersion;
  refreshPromise = (async () => {
    try {
      return await acquireRefreshLock(async () => {
        // Try primary refresh endpoint first (/api/v1/auth/refresh with HttpOnly cookie)
        const primaryRefreshUrl = `${API_BASE_URL}${AUTH_ENDPOINTS.refresh}`;
        // Fallback refresh-token endpoint (/api/v1/auth/refresh-token with body)
        const fallbackRefreshUrl = `${API_BASE_URL}${AUTH_ENDPOINTS.refreshToken}`;

        if (import.meta.env.DEV && import.meta.env.MODE !== "test" && !options?.silent) {
          logger.debug(`[AUTH] Refreshing token: POST ${primaryRefreshUrl}`);
        }

        let res;
        let usedFallback = false;
        try {
          res = await axios.post(primaryRefreshUrl, {}, {
            withCredentials: true,
            timeout: 15000,
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (import.meta.env.DEV && import.meta.env.MODE !== "test" && !options?.silent) {
            logger.debug(`[AUTH] Response: [REFRESH] POST ${primaryRefreshUrl} -> ${res.status}`);
          }
        } catch (postErr: unknown) {
          const status = axios.isAxiosError(postErr)
            ? postErr.response?.status
            : postErr && typeof postErr === "object" && "response" in postErr && typeof (postErr as { response?: { status?: unknown } }).response?.status === "number"
              ? (postErr as { response: { status: number } }).response.status
              : undefined;

          if (import.meta.env.DEV && import.meta.env.MODE !== "test" && !options?.silent) {
            logger.error(`[AUTH] Primary refresh failed with status ${status}`);
          }

          if (status === 401) {
            const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
            const isOnboardingOrVerification =
              currentPath.startsWith("/onboarding") ||
              currentPath.startsWith("/employee-onboarding") ||
              currentPath.startsWith("/verify-email");
            if (!isOnboardingOrVerification) {
              clearSessionHint();
              clearTokens();
              if (!options?.silent) {
                handleSessionExpired();
              }
            }
            throw postErr;
          }

          // If primary endpoint returns 404, try the fallback /refresh-token endpoint
          if (status === 404) {
            if (import.meta.env.DEV && import.meta.env.MODE !== "test" && !options?.silent) {
              logger.warn(`[AUTH] Primary refresh endpoint not found, trying fallback: ${fallbackRefreshUrl}`);
            }
            try {
              res = await axios.post(fallbackRefreshUrl, {}, {
                withCredentials: true,
                timeout: 15000,
                headers: {
                  "Content-Type": "application/json",
                },
              });
              usedFallback = true;
              if (import.meta.env.DEV && import.meta.env.MODE !== "test" && !options?.silent) {
                logger.debug(`[AUTH] Fallback refresh succeeded: POST ${fallbackRefreshUrl} -> ${res.status}`);
              }
            } catch (fallbackErr: unknown) {
              const fallbackStatus = axios.isAxiosError(fallbackErr)
                ? fallbackErr.response?.status
                : undefined;
              if (import.meta.env.DEV && import.meta.env.MODE !== "test" && !options?.silent) {
                logger.error(`[AUTH] Fallback refresh also failed with status ${fallbackStatus}`);
              }
              throw fallbackErr;
            }
          } else {
            throw postErr;
          }
        }

        // Mark usedFallback as intentionally used for logging/debugging
        void usedFallback;

        // Logout or a new login while refresh was pending must win over its result.
        if (sessionVersion !== refreshSessionVersion) {
          throw new axios.CanceledError("Session changed while refresh was pending");
        }

        const tokenData = res.data?.data ?? res.data;
        // Support both token field names from either endpoint
        const accessToken = tokenData?.access_token || tokenData?.accessToken || tokenData?.token;
        const refreshToken = tokenData?.refresh_token || tokenData?.refreshToken;

        // Mark refreshToken as intentionally used for potential future use
        void refreshToken;

        if (typeof accessToken !== "string" || !accessToken.trim()) {
          const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
          const isOnboardingOrVerification =
            currentPath.startsWith("/onboarding") ||
            currentPath.startsWith("/employee-onboarding") ||
            currentPath.startsWith("/verify-email");
          if (!isOnboardingOrVerification) {
            clearSessionHint();
            clearTokens();
            if (!options?.silent) {
              handleSessionExpired();
            }
          }
          throw new Error("Invalid session refresh response: missing access token");
        }

        setTokens({ accessToken });
        // If fallback returned a new refresh token, we could store it if needed
        // (but HttpOnly cookie approach is preferred)
        setSessionHint();
        return accessToken;
      });
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

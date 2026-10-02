import { useSyncExternalStore } from "react";
import {
  authService,
  clearApiCache,
  getTokens,
  hasValidAccessToken,
  isAccessTokenExpired,
  setTokens,
  clearTokens,
  hasSessionHint,
  setSessionHint,
  clearSessionHint,
} from "@/api";
import type { AuthMeResponse, AuthUserPayload } from "@/api";
import { aurix } from "./aurix-store";
import { safeStorage } from "./safe-storage";
import { normalizeRole } from "./rbac";
import { clearQueryCache } from "@/router";

type AuthStatus = "loading" | "ready";

let status: AuthStatus = typeof window === "undefined" ? "ready" : "loading";
let bootstrapPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setStatus(next: AuthStatus) {
  status = next;
  emit();
}

function mapAuthUser(data: AuthUserPayload) {
  const ws = aurix.get();
  const companyId = data.company_id ? String(data.company_id) : ws.user?.companyId || "workspace";

  return {
    user: {
      id: String(data.id),
      fullName: data.name,
      email: data.email,
      phone: data.phone || "",
      role: normalizeRole(data.role) ?? "employee",
      companyId,
      emailVerified: data.is_verified,
      onboardingComplete: Boolean(data.onboarding_completed),
      createdAt: data.created_at ?? new Date().toISOString(),
    },
    company: {
      id: companyId,
      name: data.company_name || ws.company?.name || "Workspace",
    },
  };
}

export function persistAuthSession(
  user: AuthUserPayload,
  tokens: { accessToken: string; refreshToken?: string },
) {
  setTokens(tokens);
  setSessionHint();
  aurix.set(mapAuthUser(user));
}

import { getDefaultDashboardPath } from "./role-routing";
export { getDefaultDashboardPath, getSafeRedirectUrl } from "./role-routing";

export function getPostLoginRoute(user: AuthUserPayload): string {
  return getDefaultDashboardPath(user);
}

export async function bootstrapAuth(): Promise<void> {
  if (typeof window === "undefined") return;
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = (async () => {
    const finish = () => {
      aurix.set({ isRestoring: false });
      setStatus("ready");
    };

    const tokens = getTokens();
    const ws = aurix.get();

    // 1. If we already have a valid access token in memory:
    if (tokens?.accessToken && !isAccessTokenExpired(tokens.accessToken)) {
      if (!ws.user) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            aurix.set(mapAuthUser(res.data));
            setSessionHint();
          }
        } catch {
          // Keep session while access token is valid
        }
      }
      finish();
      return;
    }

    // 2. Determine if we should attempt a session refresh:
    // Call refresh ONLY if ofc_session_hint exists to avoid pre-login 401
    if (!hasSessionHint()) {
      aurix.set({ user: null, company: null });
      finish();
      return;
    }

    // 3. Attempt silent session refresh via HttpOnly cookie:
    try {
      await authService.refresh({ silent: true });
      const res = await authService.getMe();
      if (res.success && res.data) {
        aurix.set(mapAuthUser(res.data));
        setSessionHint();
      } else {
        clearTokens();
        clearSessionHint();
        aurix.set({ user: null, company: null });
      }
    } catch {
      // Boot-time 401 is silent: no toast, no console error, clears hint and shows login
      clearTokens();
      clearSessionHint();
      aurix.set({ user: null, company: null });
    } finally {
      finish();
    }
  })();

  return bootstrapPromise;
}

if (typeof window !== "undefined") {
  void bootstrapAuth();
}

/**
 * Returns a promise that resolves once the initial auth bootstrap has completed.
 * Route guards (e.g. TanStack Router `beforeLoad`) must `await` this before
 * checking `isUserAuthenticated()`, otherwise they race ahead of the async
 * refresh-token flow and incorrectly redirect to login on page refresh.
 */
export function waitForAuth(): Promise<void> {
  return bootstrapPromise ?? Promise.resolve();
}

export function useAuthReady(): boolean {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => status === "ready",
    () => true,
  );
}

export async function logout(options?: { redirect?: boolean }) {
  try {
    await authService.logout();
  } catch {
    // If backend is offline or logout endpoint fails, proceed with local session cleanup
  }
  clearTokens();
  clearSessionHint();
  aurix.reset();
  safeStorage.removeItem("aurix:tokens");
  safeStorage.removeItem("aurix:refresh_token");
  safeStorage.removeItem("aurix:workspace:v1");
  safeStorage.removeItem("aurix:remember");
  safeStorage.removeItem("ofc360_notifications_state_v1");
  safeStorage.clear(typeof window !== "undefined" ? window.sessionStorage : undefined);
  clearApiCache();
  clearQueryCache();
  setStatus("ready");
  if (options?.redirect !== false && typeof window !== "undefined") {
    window.location.replace("/login");
  }
}

// Automatically clear caches and notification state when switching users
let lastActiveUserId: string | null | undefined = undefined;

aurix.subscribe(() => {
  const currentUserId = aurix.get().user?.id ?? null;
  if (lastActiveUserId !== undefined && lastActiveUserId !== currentUserId) {
    clearQueryCache();
    clearApiCache();
    safeStorage.removeItem("ofc360_notifications_state_v1");
  }
  lastActiveUserId = currentUserId;
});

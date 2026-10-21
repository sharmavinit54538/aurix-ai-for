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
import { clearQueryCache } from "@/lib/query-client";

type AuthStatus = "loading" | "ready";

const authBootstrapState: {
  status: AuthStatus;
  bootstrapPromise: Promise<void> | null;
} = {
  status: typeof window === "undefined" ? "ready" : "loading",
  bootstrapPromise: null,
};
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setStatus(next: AuthStatus) {
  authBootstrapState.status = next;
  emit();
}

function mapAuthUser(data: AuthUserPayload) {
  const ws = aurix.get();
  const companyId = data.company_id ? String(data.company_id) : ws.user?.companyId || "workspace";

  const dataCompany =
    (typeof data.company_name === "string" && data.company_name !== "Workspace" ? data.company_name : "") ||
    (typeof (data as any).companyName === "string" && (data as any).companyName !== "Workspace" ? (data as any).companyName : "") ||
    (typeof (data as any).company?.name === "string" && (data as any).company.name !== "Workspace" ? (data as any).company.name : "") ||
    (typeof (data as any).company?.company_name === "string" && (data as any).company.company_name !== "Workspace" ? (data as any).company.company_name : "") ||
    (typeof (data as any).organization?.name === "string" && (data as any).organization.name !== "Workspace" ? (data as any).organization.name : "") ||
    (typeof (data as any).organization?.company_name === "string" && (data as any).organization.company_name !== "Workspace" ? (data as any).organization.company_name : "") ||
    (typeof (data as any).organization_name === "string" && (data as any).organization_name !== "Workspace" ? (data as any).organization_name : "") ||
    (typeof (data as any).org_name === "string" && (data as any).org_name !== "Workspace" ? (data as any).org_name : "");

  let savedCompanyName = "";
  if (typeof window !== "undefined") {
    try {
      savedCompanyName =
        window.sessionStorage?.getItem("ofc360_registered_company_name") ||
        window.localStorage?.getItem("ofc360_registered_company_name") ||
        window.sessionStorage?.getItem("company_name") ||
        window.localStorage?.getItem("company_name") ||
        "";
      if (!savedCompanyName) {
        const pendingAuth = window.sessionStorage?.getItem("aurix_pending_auth");
        if (pendingAuth) {
          const parsed = JSON.parse(pendingAuth);
          if (parsed.companyName && parsed.companyName !== "Workspace") savedCompanyName = parsed.companyName;
          else if (parsed.company_name && parsed.company_name !== "Workspace") savedCompanyName = parsed.company_name;
        }
      }
    } catch {
      /* ignore */
    }
  }

  const wsUserCoName =
    ((ws.user as any)?.company_name && (ws.user as any).company_name !== "Workspace" ? (ws.user as any).company_name : "") ||
    ((ws.user as any)?.companyName && (ws.user as any).companyName !== "Workspace" ? (ws.user as any).companyName : "");

  const wsCoName = ws.company?.name && ws.company.name !== "Workspace" ? ws.company.name : "";

  const resolvedCompanyName =
    dataCompany ||
    wsUserCoName ||
    wsCoName ||
    savedCompanyName ||
    data.company_name ||
    ws.company?.name ||
    "Workspace";

  if (typeof window !== "undefined" && resolvedCompanyName && resolvedCompanyName !== "Workspace") {
    try {
      window.sessionStorage?.setItem("ofc360_registered_company_name", resolvedCompanyName);
      window.localStorage?.setItem("ofc360_registered_company_name", resolvedCompanyName);
      window.sessionStorage?.setItem("company_name", resolvedCompanyName);
      window.localStorage?.setItem("company_name", resolvedCompanyName);
    } catch {
      /* ignore */
    }
  }

  return {
    user: {
      id: String(data.id),
      fullName: data.name,
      email: data.email,
      phone: data.phone || "",
      role: normalizeRole(data.role) ?? "employee",
      companyId,
      company_name: resolvedCompanyName,
      companyName: resolvedCompanyName,
      emailVerified: data.is_verified,
      onboardingComplete: Boolean(data.onboarding_completed),
      createdAt: data.created_at ?? new Date().toISOString(),
    },
    company: {
      id: companyId,
      name: resolvedCompanyName,
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

export async function bootstrapAuth(options?: { force?: boolean }): Promise<void> {
  if (typeof window === "undefined") return;
  // F-07.3: Clean up stale browser-only HRMS localStorage store
  try {
    window.localStorage.removeItem("aurix.hrms.v1");
  } catch {
    /* ignore */
  }

  if (options?.force) {
    authBootstrapState.bootstrapPromise = null;
    setStatus("loading");
  } else if (authBootstrapState.bootstrapPromise) {
    return authBootstrapState.bootstrapPromise;
  }

  authBootstrapState.bootstrapPromise = (async () => {
    const finish = () => {
      aurix.set({ isRestoring: false });
      setStatus("ready");
    };

    const tokens = getTokens();
    const ws = aurix.get();

    // 1. If we already have a valid access token in memory:
    if (tokens?.accessToken && !isAccessTokenExpired(tokens.accessToken)) {
      if (!ws.user || options?.force) {
        try {
          const res = (await authService.getMe()) as any;
          const isSuccess = Boolean(res?.data?.success ?? res?.success);
          const rawData = res?.data?.data ?? res?.data;
          const userData = rawData && typeof rawData === "object" && "user" in rawData && (rawData as any).user
            ? { ...(rawData as any).user, ...rawData }
            : rawData;
          if (isSuccess && userData) {
            aurix.set(mapAuthUser(userData));
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
      if (!ws.user || ws.user.onboardingComplete) {
        aurix.set({ user: null, company: null });
      }
      finish();
      return;
    }

    // 3. Attempt silent session refresh via HttpOnly cookie:
    try {
      await authService.refresh({ silent: true });
      const res = (await authService.getMe()) as any;
      const isSuccess = Boolean(res?.data?.success ?? res?.success);
      const rawData = res?.data?.data ?? res?.data;
      const userData = rawData && typeof rawData === "object" && "user" in rawData && (rawData as any).user
        ? { ...(rawData as any).user, ...rawData }
        : rawData;
      if (isSuccess && userData) {
        aurix.set(mapAuthUser(userData));
        setSessionHint();
      } else {
        const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
        const isOnboarding = currentPath.startsWith("/onboarding") || currentPath.startsWith("/employee-onboarding");
        if (!isOnboarding) {
          clearTokens();
          clearSessionHint();
          aurix.set({ user: null, company: null });
        }
      }
    } catch (err: any) {
      const status = err?.status ?? err?.response?.status;
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
      const isOnboarding = currentPath.startsWith("/onboarding") || currentPath.startsWith("/employee-onboarding");
      // Only clear tokens if the refresh token was explicitly rejected with 401 and not on onboarding
      if ((status === 401 || err?.message === "Failed to refresh session") && !isOnboarding) {
        clearTokens();
        clearSessionHint();
        if (!ws.user || ws.user.onboardingComplete) {
          aurix.set({ user: null, company: null });
        }
      }
    } finally {
      finish();
    }
  })();

  return authBootstrapState.bootstrapPromise;
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
  try {
    return (
      (typeof authBootstrapState !== "undefined" && authBootstrapState.bootstrapPromise) ||
      Promise.resolve()
    );
  } catch {
    return Promise.resolve();
  }
}

export function useAuthReady(): boolean {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => (typeof authBootstrapState !== "undefined" && authBootstrapState.status === "ready"),
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

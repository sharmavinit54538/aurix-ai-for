import { useSyncExternalStore } from "react";
import { api, clearApiCache, getTokens, hasValidAccessToken, isAccessTokenExpired, setTokens } from "@/api";
import type { AuthMeResponse, AuthUserPayload } from "@/api";
import { aurix } from "./aurix-store";

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
      role: data.role,
      companyId,
      emailVerified: data.is_verified,
      onboardingComplete: true,
      createdAt: data.created_at ?? new Date().toISOString(),
    },
    company: {
      id: companyId,
      name: data.company_name || ws.company?.name || "Workspace",
    },
  };
}

import { refreshAccessToken } from "@/api/apiInstance";

export function persistAuthSession(
  user: AuthUserPayload,
  tokens: { accessToken: string; refreshToken?: string },
) {
  setTokens(tokens);
  aurix.set(mapAuthUser(user));
}

export function getPostLoginRoute(user: AuthUserPayload): string {
  const role = (user.role || "").toLowerCase();
  if (!user.is_verified) return "/verify-email";
  if (role === "cto" || role === "ceo" || role === "cfo" || role === "coo" || role === "cio") {
    return "/dashboard/executive/cto";
  }
  if (role === "manager") return "/dashboard/manager";
  if (role === "employee") return "/dashboard/employee";
  return "/dashboard";
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
          const res = await api.get<AuthMeResponse>("auth/me");
          if (res.success && res.data) {
            aurix.set(mapAuthUser(res.data));
          }
        } catch {
          // Keep session while access token is valid
        }
      }
      finish();
      return;
    }

    // 2. If memory has no valid token (e.g. page refresh), attempt refresh via HttpOnly cookie:
    try {
      await refreshAccessToken();
      const res = await api.get<AuthMeResponse>("auth/me");
      if (res.success && res.data) {
        aurix.set(mapAuthUser(res.data));
      } else {
        setTokens(null);
        aurix.set({ user: null, company: null });
      }
    } catch {
      setTokens(null);
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
    await api.post("/auth/logout");
  } catch {
    // If backend is offline or logout endpoint fails, proceed with local session cleanup
  }
  setTokens(null);
  aurix.reset();
  try {
    localStorage.removeItem("aurix:tokens");
    localStorage.removeItem("aurix:workspace:v1");
    localStorage.removeItem("aurix:remember");
    sessionStorage.clear();
  } catch {}
  clearApiCache();
  setStatus("ready");
  if (options?.redirect !== false && typeof window !== "undefined") {
    window.location.replace("/login");
  }
}


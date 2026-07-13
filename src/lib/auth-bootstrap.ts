import { useSyncExternalStore } from "react";
import { api, getTokens, hasValidAccessToken, isAccessTokenExpired, setTokens } from "@/api";
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
      onboardingComplete: data.onboarding_completed ?? false,
      createdAt: data.created_at ?? new Date().toISOString(),
    },
    company: {
      id: companyId,
      name: data.company_name || data.name,
    },
  };
}

export function persistAuthSession(
  user: AuthUserPayload,
  tokens: { accessToken: string; refreshToken: string },
) {
  setTokens(tokens);
  aurix.set(mapAuthUser(user));
}

export function getPostLoginRoute(user: AuthUserPayload): string {
  if (!user.is_verified) return "/verify-email";
  if (!user.onboarding_completed) return "/onboarding";
  if (user.role === "manager") return "/dashboard/manager";
  if (user.role === "employee") return "/dashboard/employee";
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

    // Cached user + valid access token — stay logged in without calling the API.
    if (ws.user && tokens?.accessToken && !isAccessTokenExpired(tokens.accessToken)) {
      finish();
      return;
    }

    if (!tokens?.accessToken) {
      finish();
      return;
    }

    // Access token still valid — restore profile when missing, but never clear tokens on failure.
    if (!isAccessTokenExpired(tokens.accessToken)) {
      if (!ws.user) {
        try {
          const res = await api.get<AuthMeResponse>("auth/me");
          if (res.success && res.data) {
            aurix.set(mapAuthUser(res.data));
          }
        } catch {
          // Keep the session while the access token is still valid.
        }
      }
      finish();
      return;
    }

    // Access token expired — try auth/me (interceptor will refresh the token first).
    try {
      const res = await api.get<AuthMeResponse>("auth/me");
      if (res.success && res.data) {
        aurix.set(mapAuthUser(res.data));
      } else if (!hasValidAccessToken()) {
        setTokens(null);
        aurix.set({ user: null, company: null });
      }
    } catch {
      if (!hasValidAccessToken()) {
        setTokens(null);
        aurix.set({ user: null, company: null });
      }
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

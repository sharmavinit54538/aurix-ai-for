import { useSyncExternalStore } from "react";
import { api, getTokens, setTokens } from "@/api";
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
    ...(data.company_name
      ? {
          company: {
            id: companyId,
            name: data.company_name,
          },
        }
      : {}),
  };
}

export async function bootstrapAuth(): Promise<void> {
  if (typeof window === "undefined") return;
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = (async () => {
    const ws = aurix.get();
    if (ws.user) {
      setStatus("ready");
      return;
    }

    const tokens = getTokens();
    if (!tokens?.accessToken) {
      setStatus("ready");
      return;
    }

    try {
      const res = await api.get<AuthMeResponse>("auth/me");
      if (res.success && res.data) {
        aurix.set(mapAuthUser(res.data));
      } else {
        setTokens(null);
      }
    } catch {
      // Tokens may have been cleared by the refresh interceptor.
    } finally {
      setStatus("ready");
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

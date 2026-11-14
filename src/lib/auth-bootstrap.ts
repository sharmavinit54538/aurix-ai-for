import { useSyncExternalStore } from "react";
import { aurix } from "./aurix-store";
import { safeStorage } from "./safe-storage";
import { clearTokens, getAccessToken, setTokens } from "@/api/tokens";
import { getDefaultDashboardPath, getSafeRedirectUrl } from "./role-routing";

export { getDefaultDashboardPath, getSafeRedirectUrl };

type AuthStatus = "ready";

const LOGGED_OUT_KEY = "aurix:logged_out";

const authBootstrapState: {
  status: AuthStatus;
  bootstrapPromise: Promise<void> | null;
} = {
  status: "ready",
  bootstrapPromise: Promise.resolve(),
};
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function persistAuthSession(
  user: any,
  tokens: { accessToken: string; refreshToken?: string },
) {
  safeStorage.removeItem(LOGGED_OUT_KEY);
  if (tokens?.accessToken) {
    setTokens({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken || "mock_refresh_token_aurix",
    });
  }
  aurix.set({
    isRestoring: false,
    user: {
      id: String(user.id || "emp-3"),
      fullName: user.name || user.fullName || "Marcus Sterling",
      email: user.email || "employee@aurix.ai",
      phone: user.phone || "+1 555-0188",
      role: user.role || "employee",
      companyId: String(user.company_id || user.companyId || "org-1"),
      company_name: user.company_name || user.companyName || "AURIX AI Enterprise",
      companyName: user.company_name || user.companyName || "AURIX AI Enterprise",
      emailVerified: Boolean(user.is_verified ?? user.emailVerified ?? true),
      onboardingComplete: Boolean(
        user.onboarding_completed ??
          user.onboardingCompleted ??
          user.onboardingComplete ??
          true,
      ),
      documentVerificationStatus:
        user.documentVerificationStatus ||
        user.document_verification_status ||
        (user.documentsVerified === true || user.documents_verified === true ? "VERIFIED" : undefined),
      documentsVerified:
        Boolean(
          user.documentsVerified ??
            user.documents_verified ??
            (user.documentVerificationStatus === "VERIFIED" ||
              user.document_verification_status === "VERIFIED"),
        ),
      documentsVerifiedAt: user.documentsVerifiedAt || user.documents_verified_at || undefined,
      createdAt: new Date().toISOString(),
    },
  });
  emit();
}

export function getPostLoginRoute(user: any): string {
  return getDefaultDashboardPath(user);
}

export async function bootstrapAuth(options?: { force?: boolean }): Promise<void> {
  const current = aurix.get();
  const isLoggedOut = safeStorage.getItem(LOGGED_OUT_KEY) === "1";
  const hasToken = Boolean(getAccessToken());
  if (!current.user && (!isLoggedOut || hasToken || options?.force)) {
    safeStorage.removeItem(LOGGED_OUT_KEY);
    aurix.reset();
  } else {
    aurix.set({ isRestoring: false });
  }
  emit();
  return Promise.resolve();
}

if (typeof window !== "undefined") {
  void bootstrapAuth();
}

export function waitForAuth(): Promise<void> {
  return Promise.resolve();
}

export function useAuthReady(): boolean {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => authBootstrapState.status === "ready",
    () => true,
  );
}

export async function logout(options?: { redirect?: boolean }) {
  safeStorage.setItem(LOGGED_OUT_KEY, "1");
  clearTokens();
  aurix.set({ user: null, isRestoring: false });
  safeStorage.clear(typeof window !== "undefined" ? window.sessionStorage : undefined);
  if (options?.redirect !== false && typeof window !== "undefined") {
    window.location.replace("/login");
  }
}

import { useSyncExternalStore } from "react";
import { aurix } from "./aurix-store";
import { safeStorage } from "./safe-storage";
import {
  clearTokens,
  getAccessToken,
  hasSessionHint,
  refreshAccessToken,
  setTokens,
} from "@/api/tokens";
import apiInstance from "@/api/apiInstance";
import { AUTH_ENDPOINTS } from "@/api/endpoints";
import { getDefaultDashboardPath, getSafeRedirectUrl } from "./role-routing";
import { clearQueryCache } from "./query-client";
import { store } from "@/redux/store";
import { settingsApi } from "@/redux/settingsApi";

export { getDefaultDashboardPath, getSafeRedirectUrl };

type AuthStatus = "bootstrapping" | "ready";

const LOGGED_OUT_KEY = "aurix:logged_out";

const authBootstrapState: {
  status: AuthStatus;
  bootstrapPromise: Promise<void> | null;
} = {
  status: "ready",
  bootstrapPromise: null,
};
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function persistAuthSession(
  user: any,
  tokens?: { accessToken?: string },
) {
  safeStorage.removeItem(LOGGED_OUT_KEY);
  if (tokens?.accessToken) {
    setTokens({
      accessToken: tokens.accessToken,
    });
  }
  if (!user) {
    aurix.set({ isRestoring: false, user: null });
    emit();
    return;
  }

  const companyName = user.company_name || user.companyName || "";
  aurix.set({
    isRestoring: false,
    user: {
      id: String(user.id || user.user_id || ""),
      fullName: String(user.name || user.full_name || user.fullName || ""),
      email: String(user.email || ""),
      phone: String(user.phone || ""),
      role: user.role || "employee",
      companyId: String(user.company_id || user.companyId || ""),
      company_name: companyName || undefined,
      companyName: companyName || undefined,
      emailVerified: Boolean(
        user.is_verified ??
          user.is_email_verified ??
          user.email_verified ??
          user.isVerified ??
          user.emailVerified ??
          false,
      ),
      emailVerifiedAt:
        typeof user.email_verified_at === "string"
          ? user.email_verified_at
          : typeof user.emailVerifiedAt === "string"
            ? user.emailVerifiedAt
            : undefined,
      onboardingComplete: Boolean(
        user.onboarding_completed ??
          user.onboardingCompleted ??
          user.onboardingComplete ??
          false,
      ),
      documentVerificationStatus:
        user.documentVerificationStatus ||
        user.document_verification_status ||
        (user.documentsVerified === true || user.documents_verified === true
          ? "VERIFIED"
          : undefined),
      documentsVerified: Boolean(
        user.documentsVerified ??
          user.documents_verified ??
          (user.documentVerificationStatus === "VERIFIED" ||
            user.document_verification_status === "VERIFIED"),
      ),
      documentsVerifiedAt:
        user.documentsVerifiedAt || user.documents_verified_at || undefined,
      createdAt: String(user.created_at || user.createdAt || new Date().toISOString()),
    },
  });
  emit();
}

export function getPostLoginRoute(user: any): string {
  return getDefaultDashboardPath(user);
}

export async function bootstrapAuth(options?: { force?: boolean }): Promise<void> {
  const isLoggedOut = safeStorage.getItem(LOGGED_OUT_KEY) === "1";
  const hasHint = hasSessionHint();
  const existingToken = getAccessToken();

  if ((isLoggedOut && !options?.force) || (!hasHint && !existingToken && !options?.force)) {
    aurix.set({ user: null, company: null, isRestoring: false });
    authBootstrapState.status = "ready";
    emit();
    return;
  }

  if (authBootstrapState.bootstrapPromise && !options?.force) {
    return authBootstrapState.bootstrapPromise;
  }

  authBootstrapState.status = "bootstrapping";
  emit();

  authBootstrapState.bootstrapPromise = (async () => {
    try {
      let token = getAccessToken();
      if (!token && hasSessionHint()) {
        token = await refreshAccessToken({ silent: true });
      }
      if (token) {
        const res = await apiInstance.get(AUTH_ENDPOINTS.me);
        const userPayload = res.data?.data ?? res.data?.user ?? res.data;
        if (userPayload && typeof userPayload === "object" && (userPayload.id || userPayload.email)) {
          persistAuthSession(userPayload, { accessToken: token });
        } else {
          aurix.set({ user: null, company: null, isRestoring: false });
        }
      } else {
        aurix.set({ user: null, company: null, isRestoring: false });
      }
    } catch (err: any) {
      const status = err?.response?.status ?? err?.status;
      if (status === 401 || status === 403 || !getAccessToken()) {
        clearTokens();
        aurix.set({ user: null, company: null, isRestoring: false });
      } else {
        aurix.set({ isRestoring: false });
      }
    } finally {
      authBootstrapState.status = "ready";
      authBootstrapState.bootstrapPromise = null;
      emit();
    }
  })();

  return authBootstrapState.bootstrapPromise;
}

export function waitForAuth(): Promise<void> {
  if (authBootstrapState.bootstrapPromise) {
    return authBootstrapState.bootstrapPromise;
  }
  const isLoggedOut = safeStorage.getItem(LOGGED_OUT_KEY) === "1";
  if (!isLoggedOut && !aurix.get().user && (getAccessToken() || hasSessionHint())) {
    return bootstrapAuth();
  }
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
  try {
    await apiInstance.post(AUTH_ENDPOINTS.logout, {}, { timeout: 2500 });
  } catch {
    // Ignore logout network error and still clear client session
  }
  clearTokens();
  aurix.set({ user: null, company: null, isRestoring: false });
  clearQueryCache();
  store.dispatch(settingsApi.util.resetApiState());
  safeStorage.clear(typeof window !== "undefined" ? window.sessionStorage : undefined);
  if (options?.redirect !== false && typeof window !== "undefined") {
    window.location.replace("/login");
  }
}

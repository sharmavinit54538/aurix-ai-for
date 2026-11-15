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
import {
  isMockDemoToken,
  MOCK_EMPLOYEES,
  MOCK_EMPLOYEE_TOKEN,
  MOCK_EMPLOYEE_USER,
  MOCK_HRS,
  MOCK_HR_ADMIN_COMPANY,
  MOCK_HR_ADMIN_TOKEN,
  MOCK_HR_ADMIN_USER,
  MOCK_HR_DOCUMENTS,
  MOCK_HR_SEED_KEY,
  MOCK_MANAGERS,
  MOCK_MANAGER_TOKEN,
  MOCK_MANAGER_USER,
} from "./mock-hr-admin";

export { getDefaultDashboardPath, getSafeRedirectUrl };

const IS_TEST_ENV =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.MODE === "test") ||
  (typeof process !== "undefined" && Boolean((process as any).env?.VITEST || (process as any).env?.NODE_TEST_CONTEXT));

export function loginWithDemoAccount(emailInput?: string) {
  const normalized = (emailInput || "hr@aurix.ai").trim().toLowerCase();
  let demoUser = MOCK_HR_ADMIN_USER;
  let demoToken = MOCK_HR_ADMIN_TOKEN;

  if (normalized === "employee@aurix.ai") {
    demoUser = MOCK_EMPLOYEE_USER;
    demoToken = MOCK_EMPLOYEE_TOKEN;
  } else if (normalized === "manager@aurix.ai") {
    demoUser = MOCK_MANAGER_USER;
    demoToken = MOCK_MANAGER_TOKEN;
  }

  safeStorage.removeItem(LOGGED_OUT_KEY);
  safeStorage.setItem(MOCK_HR_SEED_KEY, "1");
  safeStorage.setItem("ofc360:hr_onboarding_completed", "1");
  safeStorage.setItem("ofc360:activated_invite_tokens", JSON.stringify(["emp_invite_demo"]));

  setTokens({
    accessToken: demoToken,
    refreshToken: "mock-demo-refresh-token",
  });

  aurix.set({
    isRestoring: false,
    user: { ...demoUser },
    company: { ...MOCK_HR_ADMIN_COMPANY },
    hrs: [...MOCK_HRS],
    employees: [...MOCK_EMPLOYEES],
    managers: [...MOCK_MANAGERS],
    documents: [...MOCK_HR_DOCUMENTS],
  });

  authBootstrapState.status = "ready";
  emit();

  return {
    user: demoUser,
    accessToken: demoToken,
    destination: getDefaultDashboardPath(demoUser),
  };
}

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
  tokens?: { accessToken?: string; refreshToken?: string },
) {
  safeStorage.removeItem(LOGGED_OUT_KEY);
  if (tokens?.accessToken) {
    setTokens({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
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
      emailVerified: Boolean(user.is_verified ?? user.emailVerified ?? false),
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

  if (!IS_TEST_ENV && !isLoggedOut) {
    if (isMockDemoToken(existingToken) || (!existingToken && !hasHint)) {
      const currentUser = aurix.get().user;
      if (!currentUser) {
        loginWithDemoAccount("hr@aurix.ai");
      } else if (!existingToken) {
        setTokens({
          accessToken: MOCK_HR_ADMIN_TOKEN,
          refreshToken: "mock-demo-refresh-token",
        });
      }
      authBootstrapState.status = "ready";
      authBootstrapState.bootstrapPromise = null;
      emit();
      return;
    }
  }

  if ((isLoggedOut && !options?.force) || (!hasHint && !existingToken && !options?.force)) {
    aurix.set({ user: null, company: null, isRestoring: false });
    authBootstrapState.status = "ready";
    emit();
    return;
  }

  if (authBootstrapState.bootstrapPromise && !options?.force) {
    return authBootstrapState.bootstrapPromise;
  }

  authBootstrapState.bootstrapPromise = (async () => {
    try {
      let token = getAccessToken();
      if (!IS_TEST_ENV && isMockDemoToken(token)) {
        if (!aurix.get().user) {
          loginWithDemoAccount("hr@aurix.ai");
        }
        return;
      }
      if (!token && hasSessionHint()) {
        token = await refreshAccessToken({ silent: true });
      }
      if (token) {
        const res = await apiInstance.get(AUTH_ENDPOINTS.me);
        const userPayload = res.data?.data ?? res.data?.user ?? res.data;
        if (userPayload && typeof userPayload === "object" && (userPayload.id || userPayload.email)) {
          persistAuthSession(userPayload, { accessToken: token });
        }
      } else {
        aurix.set({ user: null, company: null, isRestoring: false });
      }
    } catch {
      aurix.set({ isRestoring: false });
    } finally {
      authBootstrapState.status = "ready";
      authBootstrapState.bootstrapPromise = null;
      emit();
    }
  })();

  return authBootstrapState.bootstrapPromise;
}

export function waitForAuth(): Promise<void> {
  return authBootstrapState.bootstrapPromise ?? Promise.resolve();
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

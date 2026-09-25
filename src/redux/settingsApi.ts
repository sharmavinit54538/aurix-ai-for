import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Middleware } from "@reduxjs/toolkit";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import { getTokens } from "@/api/tokens";
import { parseApiError } from "@/api/utils";
import { toast } from "sonner";

/**
 * Resolves the backend base URL for API v1.
 * Supports Vite dev server proxy (relative path when localhost is on non-8080 port)
 * or environment variable `VITE_API_URL`, defaulting to `https://api.ofc360.com/api/v1`.
 */
export function getApiBaseUrl(): string {
  let url = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (!url) {
    return "https://api.ofc360.com/api/v1";
  }

  url = url.replace(/^\/+/, "");
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  url = url.replace(/www\.api\.ofc360\.com/g, "api.ofc360.com").replace(/\/+$/, "");

  if (!url.endsWith("/api/v1")) {
    url = url.replace(/\/api(\/v1)?$/, "") + "/api/v1";
  }
  return url;
}

/**
 * Extracts auth token from cookies as a fallback if localStorage token is absent.
 */
function getCookieAuthToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)(?:access_token|token|auth_token|bearer)=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Base Redux Toolkit Query API definition for all Settings submodules.
 * All feature-specific endpoints are injected via `settingsApi.injectEndpoints()`.
 */
export const settingsApi = createApi({
  reducerPath: "settingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    credentials: "include",
    prepareHeaders: (headers) => {
      const tokens = getTokens();
      const token = tokens?.accessToken || getCookieAuthToken();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: [
    "SettingsSummary",
    "GeneralSettings",
    "CompanySettings",
    "Role",
    "Permission",
    "AuditLog",
    "Billing",
    "SecuritySettings",
    "NotificationSettings",
    "IntegrationSettings",
    "Profile",
    "ProfileSettings",
    "HrSettings",
    "MfaStatus",
    "PayrollSettings",
    "PayrollHistory",
    "PayrollAudit",
    "OvertimeSettings",
    "OvertimeHistory",
    "OvertimeAudit",
    "Tax",
    "TaxAudit",
    "TaxHistory",
    "PayrollSecurityRole",
    "PayrollSecurityPolicy",
    "PayrollSecuritySession",
    "PayrollSecurityIp",
    "PayrollSecurityAudit",
  ],
  endpoints: () => ({}),
});

/**
 * Global RTK Query error logger middleware using Sonner toast and project error parser.
 * Automatically displays user-friendly error toasts when any query or mutation fails.
 */
export const settingsApiErrorLogger: Middleware = () => (next) => (action: unknown) => {
  if (isRejectedWithValue(action)) {
    const act = action as { payload?: unknown };
    const parsed = parseApiError(act.payload, "Failed to complete settings operation");
    if (parsed.message && parsed.status !== 401) {
      toast.error(parsed.message);
    }
  }
  return next(action);
};

export default settingsApi;

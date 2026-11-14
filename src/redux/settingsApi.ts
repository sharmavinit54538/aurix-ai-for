import { createApi } from "@reduxjs/toolkit/query/react";
import type { Middleware, BaseQueryFn } from "@reduxjs/toolkit";

const customBaseQuery: BaseQueryFn = async (args) => {
  const url = typeof args === "string" ? args : args.url;
  const method = typeof args === "string" ? "GET" : args.method || "GET";

  if (url.includes("general") || url.includes("company")) {
    return {
      data: {
        companyName: "AURIX AI Enterprise",
        industry: "Enterprise AI & Operations",
        size: "250-500",
        email: "contact@aurix.ai",
        phone: "+1 800-555-0199",
        timezone: "UTC-8",
        currency: "USD",
      },
    };
  }

  if (url.includes("summary") || url.includes("settings")) {
    return {
      data: {
        theme: "dark",
        notificationsEnabled: true,
        twoFactorEnabled: true,
        userCount: 248,
      },
    };
  }

  if (method === "GET") {
    return { data: [] };
  }

  return { data: { success: true } };
};

export const settingsApi = createApi({
  reducerPath: "settingsApi",
  baseQuery: customBaseQuery,
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

export const settingsApiErrorLogger: Middleware = () => (next) => (action: unknown) => {
  return next(action);
};

export default settingsApi;

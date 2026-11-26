import { createApi } from "@reduxjs/toolkit/query/react";
import type { Middleware, BaseQueryFn } from "@reduxjs/toolkit";
import type { AxiosError, AxiosRequestConfig } from "axios";
import apiInstance, { getApiBaseUrl } from "@/api/apiInstance";

export { getApiBaseUrl };

type AxiosQueryArgs =
  | string
  | {
      url: string;
      method?: AxiosRequestConfig["method"];
      body?: unknown;
      data?: unknown;
      params?: AxiosRequestConfig["params"];
      headers?: Record<string, string>;
    };

const axiosBaseQuery: BaseQueryFn<AxiosQueryArgs, unknown, { status: number; data: unknown }> = async (
  args,
) => {
  const reqConfig: AxiosRequestConfig =
    typeof args === "string"
      ? { url: args, method: "GET" }
      : {
          url: args.url,
          method: args.method || "GET",
          data: args.body !== undefined ? args.body : args.data,
          params: args.params,
          headers: args.headers,
        };

  try {
    const response = await apiInstance.request(reqConfig);
    const raw = response.data;
    const wrapped =
      raw && typeof raw === "object" && "data" in (raw as Record<string, unknown>)
        ? raw
        : { success: true, data: raw };
    return { data: wrapped };
  } catch (err) {
    const axiosError = err as AxiosError;
    return {
      error: {
        status: axiosError.response?.status ?? 500,
        data: axiosError.response?.data ?? {
          message: axiosError.message || "Request failed",
        },
      },
    };
  }
};

export const settingsApi = createApi({
  reducerPath: "settingsApi",
  baseQuery: axiosBaseQuery,
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

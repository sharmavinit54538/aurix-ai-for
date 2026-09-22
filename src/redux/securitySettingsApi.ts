import { settingsApi } from "./settingsApi";
import type {
  AddIpWhitelistPayload,
  ApiResponse,
  IpWhitelistItem,
  PayrollSecurityAuditItem,
  PayrollSecurityPolicy,
  PayrollSecurityRole,
  PayrollSecuritySession,
} from "./settingsApiTypes";

export const securitySettingsApi = settingsApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayrollSecurityRoles: builder.query<ApiResponse<PayrollSecurityRole[]>, void>({
      query: () => "/payroll/security/roles",
      providesTags: ["PayrollSecurityRole"],
    }),
    getPayrollSecurityPolicies: builder.query<ApiResponse<PayrollSecurityPolicy[]>, void>({
      query: () => "/payroll/security/policies",
      providesTags: ["PayrollSecurityPolicy"],
    }),
    updatePayrollSecurityPolicies: builder.mutation<
      ApiResponse<PayrollSecurityPolicy[]>,
      Partial<PayrollSecurityPolicy> | { policies: PayrollSecurityPolicy[] }
    >({
      query: (body) => ({
        url: "/payroll/security/policies",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["PayrollSecurityPolicy"],
    }),
    getPayrollSecuritySessions: builder.query<ApiResponse<PayrollSecuritySession[]>, void>({
      query: () => "/payroll/security/sessions",
      providesTags: ["PayrollSecuritySession"],
    }),
    deletePayrollSecuritySession: builder.mutation<
      ApiResponse<{ message?: string }>,
      string | number
    >({
      query: (sessionId) => ({
        url: `/payroll/security/sessions/${sessionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PayrollSecuritySession"],
    }),
    logoutAllPayrollSecuritySessions: builder.mutation<
      ApiResponse<{ message?: string }>,
      { exceptCurrent?: boolean } | void
    >({
      query: (body) => ({
        url: "/payroll/security/logout-all",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: ["PayrollSecuritySession"],
    }),
    getPayrollSecurityIpWhitelist: builder.query<ApiResponse<IpWhitelistItem[]>, void>({
      query: () => "/payroll/security/ip-whitelist",
      providesTags: ["PayrollSecurityIp"],
    }),
    addPayrollSecurityIpWhitelist: builder.mutation<
      ApiResponse<IpWhitelistItem>,
      AddIpWhitelistPayload
    >({
      query: (body) => ({
        url: "/payroll/security/ip-whitelist",
        method: "POST",
        body,
      }),
      invalidatesTags: ["PayrollSecurityIp"],
    }),
    deletePayrollSecurityIpWhitelist: builder.mutation<
      ApiResponse<{ message?: string }>,
      string | number
    >({
      query: (ipId) => ({
        url: `/payroll/security/ip-whitelist/${ipId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PayrollSecurityIp"],
    }),
    getPayrollSecurityAudit: builder.query<ApiResponse<PayrollSecurityAuditItem[]>, void>({
      query: () => "/payroll/security/audit",
      providesTags: ["PayrollSecurityAudit"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPayrollSecurityRolesQuery,
  useGetPayrollSecurityPoliciesQuery,
  useUpdatePayrollSecurityPoliciesMutation,
  useGetPayrollSecuritySessionsQuery,
  useDeletePayrollSecuritySessionMutation,
  useLogoutAllPayrollSecuritySessionsMutation,
  useGetPayrollSecurityIpWhitelistQuery,
  useAddPayrollSecurityIpWhitelistMutation,
  useDeletePayrollSecurityIpWhitelistMutation,
  useGetPayrollSecurityAuditQuery,
} = securitySettingsApi;

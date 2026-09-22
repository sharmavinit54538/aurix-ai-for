import { settingsApi } from "./settingsApi";
import type {
  ApiResponse,
  PayrollAuditItem,
  PayrollExportParams,
  PayrollExportResponse,
  PayrollHistoryItem,
  PayrollResetPayload,
  PayrollResetResponse,
  PayrollSettings,
  PayrollTestPayload,
  PayrollTestResponse,
} from "./settingsApiTypes";

export const payrollSettingsApi = settingsApi.injectEndpoints({
  endpoints: (builder) => ({
    getPayrollSettings: builder.query<ApiResponse<PayrollSettings>, void>({
      query: () => "/payroll/settings",
      providesTags: ["PayrollSettings"],
    }),
    updatePayrollSettings: builder.mutation<ApiResponse<PayrollSettings>, Partial<PayrollSettings>>(
      {
        query: (body) => ({
          url: "/payroll/settings",
          method: "PUT",
          body,
        }),
        invalidatesTags: ["PayrollSettings"],
      },
    ),
    createPayrollSettings: builder.mutation<ApiResponse<PayrollSettings>, Partial<PayrollSettings>>(
      {
        query: (body) => ({
          url: "/payroll/settings",
          method: "POST",
          body,
        }),
        invalidatesTags: ["PayrollSettings"],
      },
    ),
    patchPayrollSettings: builder.mutation<ApiResponse<PayrollSettings>, Partial<PayrollSettings>>({
      query: (body) => ({
        url: "/payroll/settings",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["PayrollSettings"],
    }),
    getPayrollSettingsHistory: builder.query<ApiResponse<PayrollHistoryItem[]>, void>({
      query: () => "/payroll/settings/history",
      providesTags: ["PayrollHistory"],
    }),
    getPayrollSettingsAudit: builder.query<ApiResponse<PayrollAuditItem[]>, void>({
      query: () => "/payroll/settings/audit",
      providesTags: ["PayrollAudit"],
    }),
    resetPayrollSettings: builder.mutation<
      ApiResponse<PayrollResetResponse>,
      PayrollResetPayload | void
    >({
      query: (body) => ({
        url: "/payroll/settings/reset",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: ["PayrollSettings", "PayrollHistory", "PayrollAudit"],
    }),
    testPayrollSettings: builder.mutation<
      ApiResponse<PayrollTestResponse>,
      PayrollTestPayload | void
    >({
      query: (body) => ({
        url: "/payroll/settings/test",
        method: "POST",
        body: body || {},
      }),
    }),
    exportPayrollSettings: builder.query<
      ApiResponse<PayrollExportResponse>,
      PayrollExportParams | void
    >({
      query: (params) => ({
        url: "/payroll/settings/export",
        params: params || undefined,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPayrollSettingsQuery,
  useUpdatePayrollSettingsMutation,
  useCreatePayrollSettingsMutation,
  usePatchPayrollSettingsMutation,
  useGetPayrollSettingsHistoryQuery,
  useGetPayrollSettingsAuditQuery,
  useResetPayrollSettingsMutation,
  useTestPayrollSettingsMutation,
  useExportPayrollSettingsQuery,
  useLazyExportPayrollSettingsQuery,
} = payrollSettingsApi;

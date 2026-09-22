import { settingsApi } from "./settingsApi";
import type {
  ApiResponse,
  OvertimeAuditItem,
  OvertimeCalculationRequest,
  OvertimeCalculationResult,
  OvertimeHistoryItem,
  OvertimeRequestPayload,
  OvertimeRequestResult,
  OvertimeSettings,
} from "./settingsApiTypes";

export const overtimeSettingsApi = settingsApi.injectEndpoints({
  endpoints: (builder) => ({
    getOvertimeSettings: builder.query<ApiResponse<OvertimeSettings>, void>({
      query: () => "/payroll/overtime/settings",
      providesTags: ["OvertimeSettings"],
    }),
    updateOvertimeSettings: builder.mutation<
      ApiResponse<OvertimeSettings>,
      Partial<OvertimeSettings>
    >({
      query: (body) => ({
        url: "/payroll/overtime/settings",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["OvertimeSettings"],
    }),
    calculateOvertime: builder.mutation<
      ApiResponse<OvertimeCalculationResult>,
      OvertimeCalculationRequest
    >({
      query: (body) => ({
        url: "/payroll/overtime/calculate",
        method: "POST",
        body,
      }),
    }),
    requestOvertime: builder.mutation<ApiResponse<OvertimeRequestResult>, OvertimeRequestPayload>({
      query: (body) => ({
        url: "/payroll/overtime/request",
        method: "POST",
        body,
      }),
      invalidatesTags: ["OvertimeHistory"],
    }),
    getOvertimeHistory: builder.query<ApiResponse<OvertimeHistoryItem[]>, void>({
      query: () => "/payroll/overtime/history",
      providesTags: ["OvertimeHistory"],
    }),
    getOvertimeAudit: builder.query<ApiResponse<OvertimeAuditItem[]>, void>({
      query: () => "/payroll/overtime/audit",
      providesTags: ["OvertimeAudit"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOvertimeSettingsQuery,
  useUpdateOvertimeSettingsMutation,
  useCalculateOvertimeMutation,
  useRequestOvertimeMutation,
  useGetOvertimeHistoryQuery,
  useGetOvertimeAuditQuery,
} = overtimeSettingsApi;

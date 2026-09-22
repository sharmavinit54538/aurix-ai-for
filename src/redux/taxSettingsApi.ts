import { settingsApi } from "./settingsApi";
import type {
  ApiResponse,
  CreateTaxPayload,
  TaxAuditItem,
  TaxExportParams,
  TaxExportResponse,
  TaxHistoryItem,
  TaxImportResponse,
  TaxItem,
  TaxRecalculatePayload,
  TaxRecalculateResponse,
  UpdateTaxPayload,
} from "./settingsApiTypes";

export const taxSettingsApi = settingsApi.injectEndpoints({
  endpoints: (builder) => ({
    getTaxes: builder.query<ApiResponse<TaxItem[]>, void>({
      query: () => "/payroll/taxes",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Tax" as const, id })),
              { type: "Tax" as const, id: "LIST" },
            ]
          : [{ type: "Tax" as const, id: "LIST" }],
    }),
    getTaxAudit: builder.query<ApiResponse<TaxAuditItem[]>, void>({
      query: () => "/payroll/taxes/audit",
      providesTags: ["TaxAudit"],
    }),
    getTaxHistory: builder.query<ApiResponse<TaxHistoryItem[]>, void>({
      query: () => "/payroll/taxes/history",
      providesTags: ["TaxHistory"],
    }),
    exportTaxes: builder.query<ApiResponse<TaxExportResponse>, TaxExportParams | void>({
      query: (params) => ({
        url: "/payroll/taxes/export",
        params: params || undefined,
      }),
    }),
    importTaxes: builder.mutation<
      ApiResponse<TaxImportResponse>,
      FormData | { file_url?: string; items?: TaxItem[] }
    >({
      query: (body) => ({
        url: "/payroll/taxes/import",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Tax", id: "LIST" }, "TaxAudit", "TaxHistory"],
    }),
    recalculateTaxes: builder.mutation<
      ApiResponse<TaxRecalculateResponse>,
      TaxRecalculatePayload | void
    >({
      query: (body) => ({
        url: "/payroll/taxes/recalculate",
        method: "POST",
        body: body || {},
      }),
      invalidatesTags: [{ type: "Tax", id: "LIST" }],
    }),
    getTaxById: builder.query<ApiResponse<TaxItem>, string | number>({
      query: (taxId) => `/payroll/taxes/${taxId}`,
      providesTags: (_result, _error, id) => [{ type: "Tax", id }],
    }),
    createTax: builder.mutation<ApiResponse<TaxItem>, CreateTaxPayload>({
      query: (body) => ({
        url: "/payroll/taxes",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Tax", id: "LIST" }],
    }),
    updateTaxPut: builder.mutation<ApiResponse<TaxItem>, UpdateTaxPayload>({
      query: ({ id, data }) => ({
        url: `/payroll/taxes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Tax", id },
        { type: "Tax", id: "LIST" },
      ],
    }),
    updateTax: builder.mutation<ApiResponse<TaxItem>, UpdateTaxPayload>({
      query: ({ id, data }) => ({
        url: `/payroll/taxes/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Tax", id },
        { type: "Tax", id: "LIST" },
      ],
    }),
    deleteTax: builder.mutation<ApiResponse<{ message?: string }>, string | number>({
      query: (taxId) => ({
        url: `/payroll/taxes/${taxId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Tax", id },
        { type: "Tax", id: "LIST" },
      ],
    }),
    activateTax: builder.mutation<ApiResponse<TaxItem>, string | number>({
      query: (taxId) => ({
        url: `/payroll/taxes/${taxId}/activate`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Tax", id },
        { type: "Tax", id: "LIST" },
      ],
    }),
    deactivateTax: builder.mutation<ApiResponse<TaxItem>, string | number>({
      query: (taxId) => ({
        url: `/payroll/taxes/${taxId}/deactivate`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Tax", id },
        { type: "Tax", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTaxesQuery,
  useGetTaxAuditQuery,
  useGetTaxHistoryQuery,
  useExportTaxesQuery,
  useLazyExportTaxesQuery,
  useImportTaxesMutation,
  useRecalculateTaxesMutation,
  useGetTaxByIdQuery,
  useCreateTaxMutation,
  useUpdateTaxPutMutation,
  useUpdateTaxMutation,
  useDeleteTaxMutation,
  useActivateTaxMutation,
  useDeactivateTaxMutation,
} = taxSettingsApi;

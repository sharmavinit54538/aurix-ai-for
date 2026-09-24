/**
 * Payroll Reports & Exports API Service.
 *
 * Implements backend-driven reporting and file export pipelines.
 * Zero mock data: all rows and figures must come from backend endpoints.
 */

import apiInstance from "@/api/apiInstance";
import type {
  ReportKey,
  ExportFormat,
  ReportFilterConfig,
  ReportDataResponse,
  AccountingExportResponse,
} from "../types/reports";

export const reportsApi = {
  /**
   * Fetch report data with filters and server-side pagination.
   */
  async getReportData(
    reportKey: ReportKey,
    filters?: ReportFilterConfig,
    pagination?: { page?: number; limit?: number; sortBy?: string; sortDir?: "asc" | "desc" }
  ): Promise<ReportDataResponse> {
    const res = await apiInstance.get<{ success: boolean; data: ReportDataResponse }>(
      `/api/v2/payroll/reports/${reportKey}`,
      {
        params: { ...filters, ...pagination },
        headers: { "Cache-Control": "no-store" },
      }
    );
    return res.data.data;
  },

  /**
   * Request backend generation of report export file (CSV or XLSX).
   */
  async requestReportExport(
    reportKey: ReportKey,
    format: ExportFormat,
    filters?: ReportFilterConfig
  ): Promise<{ exportId: string; fileName: string; downloadUrl?: string }> {
    const res = await apiInstance.post<{
      success: boolean;
      data: { exportId: string; fileName: string; downloadUrl?: string };
    }>(
      `/api/v2/payroll/reports/${reportKey}/export`,
      { format, filters },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
    return res.data.data;
  },

  /**
   * Download the generated report export file as Blob.
   */
  async downloadReportExport(exportId: string): Promise<Blob> {
    const res = await apiInstance.get(
      `/api/v2/payroll/reports/exports/${exportId}/download`,
      {
        responseType: "blob",
        headers: { "Cache-Control": "no-store" },
      }
    );
    return res.data as Blob;
  },

  /**
   * Fetch Double-Entry Accounting Journal for a payroll run.
   */
  async getAccountingJournal(periodId?: string): Promise<AccountingExportResponse> {
    const res = await apiInstance.get<{
      success: boolean;
      data: AccountingExportResponse;
    }>("/api/v2/payroll/accounting-export", {
      params: { periodId },
      headers: { "Cache-Control": "no-store" },
    });
    return res.data.data;
  },
};

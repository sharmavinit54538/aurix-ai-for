/**
 * Payroll Reports & Exports API Service.
 *
 * Implements backend-driven reporting and file export pipelines aligned with OpenAPI:
 * - GET /api/v2/payroll/reports/{reportKey}
 * - POST /api/v2/payroll/reports/{reportKey}/export
 * - GET /api/v2/payroll/reports/exports/{exportId}/download
 * - GET /api/v2/payroll/accounting-export
 *
 * Zero mock data: all rows and figures come from backend endpoints.
 */

import apiInstance from "@/api/apiInstance";
import { getDownloadFilename, parseContentType } from "@/services/payroll/utils";
import type {
  ReportKey,
  ExportFormat,
  ReportFilterConfig,
  ReportDataResponse,
  AccountingExportResponse,
  AccountingExportEntry,
  ReportColumnDef,
} from "../types/reports";

const API_HEADERS = { "Cache-Control": "no-store" } as const;

type RawRecord = Record<string, unknown>;

function unwrapEnvelope<T = RawRecord>(raw: unknown): T {
  if (raw && typeof raw === "object") {
    const rec = raw as RawRecord;
    if (rec.data !== undefined && rec.data !== null) {
      return rec.data as T;
    }
  }
  return raw as T;
}

function cleanParams(obj?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!obj) return undefined;
  const cleaned: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined || val === null || val === "" || val === false) continue;
    cleaned[key] = val;
  }
  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
}

function pick<T = unknown>(obj: RawRecord | undefined | null, ...keys: string[]): T | undefined {
  if (!obj) return undefined;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      return obj[key] as T;
    }
  }
  return undefined;
}

function normalizeReportData(reportKey: ReportKey, rawPayload: unknown): ReportDataResponse {
  const raw = (unwrapEnvelope<RawRecord>(rawPayload) || {}) as RawRecord;
  const rowsRaw = pick<unknown[]>(raw, "rows", "items", "records", "entries", "data") ?? [];
  const rows = Array.isArray(rowsRaw)
    ? rowsRaw.filter((r): r is Record<string, unknown> => Boolean(r) && typeof r === "object")
    : [];

  const columnsRaw = pick<ReportColumnDef[]>(raw, "columns");
  const totalRaw = pick<number>(raw, "totalRecords", "total_records", "total", "count");
  const pageRaw = pick<number>(raw, "page");
  const limitRaw = pick<number>(raw, "limit", "page_size");

  return {
    reportKey: (pick<ReportKey>(raw, "reportKey", "report_key") || reportKey) as ReportKey,
    title: String(pick(raw, "title", "reportName", "report_name") || ""),
    generatedAt: String(
      pick(raw, "generatedAt", "generated_at", "timestamp") || new Date().toISOString()
    ),
    periodLabel: pick<string>(raw, "periodLabel", "period_label", "periodName", "period_name"),
    filtersApplied: (pick<ReportFilterConfig>(raw, "filtersApplied", "filters_applied") ||
      {}) as ReportFilterConfig,
    totalRecords: typeof totalRaw === "number" && Number.isFinite(totalRaw) ? totalRaw : rows.length,
    page: typeof pageRaw === "number" && Number.isFinite(pageRaw) ? pageRaw : 1,
    limit: typeof limitRaw === "number" && Number.isFinite(limitRaw) ? limitRaw : 25,
    columns: Array.isArray(columnsRaw) ? columnsRaw : [],
    rows,
    summaryTotals:
      pick<Record<string, number | string | null>>(
        raw,
        "summaryTotals",
        "summary_totals",
        "totals",
        "summary"
      ) || undefined,
    kpiCards: pick<Array<Record<string, unknown>>>(raw, "kpiCards", "kpi_cards"),
    charts: pick<Array<Record<string, unknown>>>(raw, "charts"),
    reconciliation: pick<Record<string, unknown>>(raw, "reconciliation"),
  };
}

function normalizeAccountingEntry(raw: unknown, idx: number): AccountingExportEntry {
  const r = (raw && typeof raw === "object" ? raw : {}) as RawRecord;
  const debitPaise = Number(
    pick(r, "debitAmountPaise", "debit_amount_paise", "debitPaise", "debit_paise") ?? 0
  );
  const creditPaise = Number(
    pick(r, "creditAmountPaise", "credit_amount_paise", "creditPaise", "credit_paise") ?? 0
  );
  const debitRupees = Number.isFinite(debitPaise) ? debitPaise / 100 : 0;
  const creditRupees = Number.isFinite(creditPaise) ? creditPaise / 100 : 0;
  const fmt = (rupees: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(rupees);

  return {
    id: String(pick(r, "id", "entryId", "entry_id") || `je-${idx + 1}`),
    payrollRunId: String(pick(r, "payrollRunId", "payroll_run_id", "runId", "run_id") || ""),
    payrollRunReference: pick<string>(
      r,
      "payrollRunReference",
      "payroll_run_reference",
      "runNumber",
      "run_number"
    ),
    payrollPeriod: pick<string>(r, "payrollPeriod", "payroll_period", "periodName", "period_name"),
    accountCode: String(
      pick(r, "accountCode", "account_code", "glCode", "gl_code") || "UNMAPPED"
    ),
    accountName: String(
      pick(r, "accountName", "account_name", "glName", "gl_name") || "Unmapped Account"
    ),
    accountType: String(
      pick(r, "accountType", "account_type", "ledgerType", "ledger_type") || "earning"
    ),
    costCenter: pick<string>(r, "costCenter", "cost_center", "costCenterCode", "cost_center_code"),
    department: pick<string>(r, "department", "departmentName", "department_name"),
    accountingDate: String(
      pick(r, "accountingDate", "accounting_date", "journalDate", "journal_date") || ""
    ),
    debitAmountPaise: Number.isFinite(debitPaise) ? debitPaise : 0,
    creditAmountPaise: Number.isFinite(creditPaise) ? creditPaise : 0,
    debitFormatted: String(pick(r, "debitFormatted", "debit_formatted") || fmt(debitRupees)),
    creditFormatted: String(pick(r, "creditFormatted", "credit_formatted") || fmt(creditRupees)),
    referenceDescription: String(
      pick(r, "referenceDescription", "reference_description", "narration", "description") || "—"
    ),
    postingStatus: pick<string>(r, "postingStatus", "posting_status", "status"),
    accountingReference: pick<string>(r, "accountingReference", "accounting_reference", "reference"),
    isMapped: pick<boolean>(r, "isMapped", "is_mapped"),
  };
}

function normalizeAccountingResponse(rawPayload: unknown): AccountingExportResponse {
  const raw = (unwrapEnvelope<RawRecord>(rawPayload) || {}) as RawRecord;
  const entriesRaw = pick<unknown[]>(raw, "entries", "rows", "items") ?? [];
  const entries = Array.isArray(entriesRaw) ? entriesRaw.map(normalizeAccountingEntry) : [];
  const computedDebit = entries.reduce((acc, e) => acc + (e.debitAmountPaise || 0), 0);
  const computedCredit = entries.reduce((acc, e) => acc + (e.creditAmountPaise || 0), 0);
  const totalDebit = Number(
    pick(raw, "totalDebitPaise", "total_debit_paise") ?? computedDebit
  );
  const totalCredit = Number(
    pick(raw, "totalCreditPaise", "total_credit_paise") ?? computedCredit
  );
  const explicitBalanced = pick<boolean>(raw, "isBalanced", "is_balanced");

  return {
    payrollRunId: String(pick(raw, "payrollRunId", "payroll_run_id", "runId", "run_id") || ""),
    periodName: String(pick(raw, "periodName", "period_name") || ""),
    accountingDate: String(
      pick(raw, "accountingDate", "accounting_date") || new Date().toISOString()
    ),
    totalDebitPaise: Number.isFinite(totalDebit) ? totalDebit : 0,
    totalCreditPaise: Number.isFinite(totalCredit) ? totalCredit : 0,
    isBalanced:
      explicitBalanced !== undefined ? Boolean(explicitBalanced) : totalDebit === totalCredit,
    unmappedCount: pick<number>(raw, "unmappedCount", "unmapped_count"),
    postedCount: pick<number>(raw, "postedCount", "posted_count"),
    pendingCount: pick<number>(raw, "pendingCount", "pending_count"),
    entries,
  };
}

export const reportsApi = {
  /**
   * Fetch report data with filters and server-side pagination.
   * OpenAPI: GET /api/v2/payroll/reports/{reportKey}
   */
  async getReportData(
    reportKey: ReportKey,
    filters?: ReportFilterConfig,
    pagination?: { page?: number; limit?: number; sortBy?: string; sortDir?: "asc" | "desc" }
  ): Promise<ReportDataResponse> {
    const params = cleanParams({ ...filters, ...pagination });
    const res = await apiInstance.get<{ success: boolean; data: ReportDataResponse }>(
      `/api/v2/payroll/reports/${reportKey}`,
      {
        params,
        headers: API_HEADERS,
      }
    );
    return normalizeReportData(reportKey, res.data);
  },

  /**
   * Request backend generation of report export file (CSV, XLSX, or PDF).
   * OpenAPI: POST /api/v2/payroll/reports/{reportKey}/export
   */
  async requestReportExport(
    reportKey: ReportKey,
    format: ExportFormat,
    filters?: ReportFilterConfig
  ): Promise<{ exportId: string; fileName: string; downloadUrl?: string }> {
    const cleanedFilters = cleanParams(filters as Record<string, unknown> | undefined);
    const res = await apiInstance.post<{
      success: boolean;
      data: {
        exportId?: string;
        export_id?: string;
        fileName?: string;
        file_name?: string;
        downloadUrl?: string;
        download_url?: string;
      };
    }>(
      `/api/v2/payroll/reports/${reportKey}/export`,
      { format, filters: cleanedFilters },
      { headers: API_HEADERS }
    );
    const d = unwrapEnvelope<RawRecord>(res.data) || {};
    return {
      exportId: String(pick(d, "exportId", "export_id", "id") || ""),
      fileName: String(pick(d, "fileName", "file_name") || `${reportKey}.${format}`),
      downloadUrl: pick<string>(d, "downloadUrl", "download_url"),
    };
  },

  /**
   * Download the generated report export file as Blob with filename.
   * OpenAPI: GET /api/v2/payroll/reports/exports/{exportId}/download
   */
  async downloadReportExport(
    exportId: string
  ): Promise<{ blob: Blob; filename: string; mimeType: string }> {
    const res = await apiInstance.get(`/api/v2/payroll/reports/exports/${exportId}/download`, {
      responseType: "blob",
      headers: API_HEADERS,
    });
    const contentDisposition = res.headers["content-disposition"];
    const contentType = res.headers["content-type"];
    const filename = getDownloadFilename(
      contentDisposition,
      contentType,
      `report-export-${exportId}`
    );
    const mimeType = parseContentType(contentType)?.mimeType || "application/octet-stream";
    return { blob: res.data as Blob, filename, mimeType };
  },

  /**
   * Fetch Double-Entry Accounting Journal for a payroll run / period.
   * OpenAPI: GET /api/v2/payroll/accounting-export
   */
  async getAccountingJournal(
    periodId?: string,
    extraParams?: {
      runId?: string;
      department?: string;
      costCenter?: string;
      financialYear?: string;
    }
  ): Promise<AccountingExportResponse> {
    const params = cleanParams({ periodId, ...extraParams });
    const res = await apiInstance.get<{
      success: boolean;
      data: AccountingExportResponse;
    }>("/api/v2/payroll/accounting-export", {
      params,
      headers: API_HEADERS,
    });
    return normalizeAccountingResponse(res.data);
  },
};

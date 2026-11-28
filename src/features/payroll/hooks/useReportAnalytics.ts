/**
 * React hooks for Payroll Reports & Analytics.
 * Provides:
 * - URL-persisted report filters with Apply / Reset / Refresh / Back navigation support
 * - Per-card independent loading & error states for the 9-card dashboard
 * - Verified OpenAPI report data fetching, pagination, sorting, and chart drill-downs
 * - Server-side report export + print-friendly PDF report context
 */

import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { ReportKey, ReportDataResponse, ExportFormat, ComparisonMode } from "../types/reports";
import type {
  ReportDashboardKpi,
  ExtendedReportFilterConfig,
  ReportFilterOptions,
  EmployeePayrollDetail,
} from "../types/reportAnalytics";
import { reportAnalyticsApi, getHttpStatus } from "../api/reportAnalyticsApi";
import { reportsApi } from "../api/reportsApi";

export function getCurrentIndianFyStart(): number {
  const now = new Date();
  return now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
}

export function getDefaultFinancialYear(): string {
  const fyStart = getCurrentIndianFyStart();
  return `${fyStart}-${fyStart + 1}`;
}

const FILTER_QUERY_KEYS: Array<keyof ExtendedReportFilterConfig> = [
  "financialYear",
  "month",
  "year",
  "dateFrom",
  "dateTo",
  "periodId",
  "runId",
  "department",
  "designation",
  "employeeId",
  "employmentType",
  "branch",
  "workLocation",
  "costCenter",
  "payrollStatus",
  "paymentStatus",
  "paymentMode",
  "comparisonPeriodId",
  "comparisonMode",
  "comparePreviousPeriod",
  "comparePreviousYear",
  "cutoffDate",
  "search",
  "sortBy",
  "sortDir",
  "page",
  "limit",
];

function parseFiltersFromUrl(
  initialOverrides?: Partial<ExtendedReportFilterConfig>
): ExtendedReportFilterConfig {
  const defaults: ExtendedReportFilterConfig = {
    financialYear: getDefaultFinancialYear(),
    page: 1,
    limit: 25,
    ...initialOverrides,
  };
  if (typeof window === "undefined") return defaults;

  const sp = new URLSearchParams(window.location.search);
  const parsed: ExtendedReportFilterConfig = { ...defaults };

  const numKeys = new Set(["month", "year", "page", "limit"]);
  const boolKeys = new Set(["comparePreviousPeriod", "comparePreviousYear"]);

  for (const key of FILTER_QUERY_KEYS) {
    const raw = sp.get(key);
    if (raw === null || raw === "") continue;
    if (numKeys.has(key)) {
      const n = Number(raw);
      if (Number.isFinite(n)) (parsed as Record<string, unknown>)[key] = n;
    } else if (boolKeys.has(key)) {
      (parsed as Record<string, unknown>)[key] = raw === "true" || raw === "1";
    } else {
      (parsed as Record<string, unknown>)[key] = raw;
    }
  }
  return parsed;
}

function syncFiltersToUrl(filters: ExtendedReportFilterConfig): void {
  if (typeof window === "undefined") return;
  const sp = new URLSearchParams(window.location.search);
  const defaultFy = getDefaultFinancialYear();

  for (const key of FILTER_QUERY_KEYS) {
    const val = (filters as Record<string, unknown>)[key];
    const shouldOmit =
      val === undefined ||
      val === null ||
      val === "" ||
      val === false ||
      (key === "page" && val === 1) ||
      (key === "limit" && val === 25) ||
      (key === "financialYear" && val === defaultFy);
    if (shouldOmit) {
      sp.delete(key);
    } else {
      sp.set(key, String(val));
    }
  }

  const nextQuery = sp.toString();
  const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}${window.location.hash}`;
  if (nextUrl !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
    window.history.replaceState(window.history.state, "", nextUrl);
  }
}

export function buildFilterQueryString(filters: ExtendedReportFilterConfig): string {
  const sp = new URLSearchParams();
  for (const key of FILTER_QUERY_KEYS) {
    if (key === "page" || key === "limit" || key === "sortBy" || key === "sortDir") continue;
    const val = (filters as Record<string, unknown>)[key];
    if (val !== undefined && val !== null && val !== "" && val !== false) {
      sp.set(key, String(val));
    }
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

// ── Report Filters Hook (URL-persisted + Draft/Applied Split) ────────
export function useReportFilters(initialOverrides?: Partial<ExtendedReportFilterConfig>) {
  const initialOverridesRef = useRef(initialOverrides);
  const [appliedFilters, setAppliedFilters] = useState<ExtendedReportFilterConfig>(() =>
    parseFiltersFromUrl(initialOverridesRef.current)
  );
  const [draftFilters, setDraftFilters] = useState<ExtendedReportFilterConfig>(appliedFilters);

  // Sync browser back/forward navigation
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePopState = () => {
      const next = parseFiltersFromUrl(initialOverridesRef.current);
      setAppliedFilters(next);
      setDraftFilters(next);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const updateDraftFilter = useCallback(
    (key: keyof ExtendedReportFilterConfig, value: unknown) => {
      setDraftFilters((prev) => ({
        ...prev,
        [key]: value === "" ? undefined : value,
        page: 1,
      }));
    },
    []
  );

  const applyFilters = useCallback(
    (overridePatch?: Partial<ExtendedReportFilterConfig>) => {
      setAppliedFilters((prev) => {
        const next: ExtendedReportFilterConfig = {
          ...prev,
          ...draftFilters,
          ...overridePatch,
          page: overridePatch?.page ?? 1,
        };
        setDraftFilters(next);
        syncFiltersToUrl(next);
        return next;
      });
    },
    [draftFilters]
  );

  // Immediate update for pagination, sorting, and chart drill-down
  const setImmediateFilter = useCallback(
    (patch: Partial<ExtendedReportFilterConfig>) => {
      setAppliedFilters((prev) => {
        const next: ExtendedReportFilterConfig = {
          ...prev,
          ...patch,
          page: patch.page !== undefined ? patch.page : 1,
        };
        setDraftFilters(next);
        syncFiltersToUrl(next);
        return next;
      });
    },
    []
  );

  const resetFilters = useCallback(() => {
    const clean: ExtendedReportFilterConfig = {
      financialYear: getDefaultFinancialYear(),
      page: 1,
      limit: 25,
      ...initialOverridesRef.current,
    };
    setDraftFilters(clean);
    setAppliedFilters(clean);
    syncFiltersToUrl(clean);
  }, []);

  const setPage = useCallback(
    (page: number) => {
      setImmediateFilter({ page });
    },
    [setImmediateFilter]
  );

  const toggleSort = useCallback(
    (columnKey: string) => {
      setAppliedFilters((prev) => {
        const nextDir: "asc" | "desc" =
          prev.sortBy === columnKey && prev.sortDir === "asc" ? "desc" : "asc";
        const next: ExtendedReportFilterConfig = {
          ...prev,
          sortBy: columnKey,
          sortDir: nextDir,
          page: 1,
        };
        setDraftFilters(next);
        syncFiltersToUrl(next);
        return next;
      });
    },
    []
  );

  return {
    filters: appliedFilters,
    draftFilters,
    updateDraftFilter,
    applyFilters,
    setImmediateFilter,
    resetFilters,
    setPage,
    toggleSort,
  };
}

// ── Per-Card Dashboard KPI Hook (Independent Loading & Error State) ──
export function useDashboardReportCard(
  reportKey: ReportKey,
  filters: ExtendedReportFilterConfig
) {
  const [kpi, setKpi] = useState<ReportDashboardKpi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendUnavailable, setBackendUnavailable] = useState(false);

  const fetchCard = useCallback(async () => {
    setLoading(true);
    setError(null);
    setBackendUnavailable(false);
    try {
      const result = await reportAnalyticsApi.getSingleDashboardKpi(reportKey, {
        periodId: filters.periodId,
        financialYear: filters.financialYear,
        month: filters.month,
        year: filters.year,
        department: filters.department,
        runId: filters.runId,
      });
      if (result.sourceStatus === "unavailable") {
        setBackendUnavailable(true);
      }
      setKpi(result);
    } catch (err) {
      const status = getHttpStatus(err);
      if (status === 404 || status === 501) {
        setBackendUnavailable(true);
      } else if (status === 401 || status === 403) {
        setError("Unauthorized");
      } else {
        setError("Unable to load");
      }
      setKpi(null);
    } finally {
      setLoading(false);
    }
  }, [
    reportKey,
    filters.periodId,
    filters.financialYear,
    filters.month,
    filters.year,
    filters.department,
    filters.runId,
  ]);

  useEffect(() => {
    void fetchCard();
  }, [fetchCard]);

  return { kpi, loading, error, backendUnavailable, refetch: fetchCard };
}

// ── Report Data Hook (OpenAPI GET /api/v2/payroll/reports/{reportKey}) ─
export function useReportData(reportKey: ReportKey, filters: ExtendedReportFilterConfig) {
  const [data, setData] = useState<ReportDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string | null>(null);

  const serializedFilters = JSON.stringify(filters);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setBackendUnavailable(false);
    const activeFilters = JSON.parse(serializedFilters) as ExtendedReportFilterConfig;
    try {
      const result = await reportsApi.getReportData(
        reportKey,
        {
          periodId: activeFilters.periodId,
          financialYear: activeFilters.financialYear,
          month: activeFilters.month,
          year: activeFilters.year,
          dateFrom: activeFilters.dateFrom,
          dateTo: activeFilters.dateTo,
          runId: activeFilters.runId,
          department: activeFilters.department,
          designation: activeFilters.designation,
          employeeId: activeFilters.employeeId,
          employmentType: activeFilters.employmentType,
          branch: activeFilters.branch,
          workLocation: activeFilters.workLocation,
          location: activeFilters.workLocation || activeFilters.location,
          costCenter: activeFilters.costCenter,
          payrollStatus: activeFilters.payrollStatus,
          paymentStatus: activeFilters.paymentStatus,
          paymentMode: activeFilters.paymentMode,
          comparisonPeriodId: activeFilters.comparisonPeriodId,
          comparisonMode: activeFilters.comparisonMode as ComparisonMode | undefined,
          comparePreviousPeriod: activeFilters.comparePreviousPeriod,
          comparePreviousYear: activeFilters.comparePreviousYear,
          cutoffDate: activeFilters.cutoffDate,
          search: activeFilters.search,
        },
        {
          page: activeFilters.page ?? 1,
          limit: activeFilters.limit ?? 25,
          sortBy: activeFilters.sortBy,
          sortDir: activeFilters.sortDir,
        }
      );
      setData(result);
      setLastRefreshedAt(new Date().toISOString());
    } catch (err) {
      const status = getHttpStatus(err);
      if (status === 404 || status === 501) {
        setBackendUnavailable(true);
        setError(`Report endpoint GET /api/v2/payroll/reports/${reportKey} is not available yet`);
      } else if (status === 401 || status === 403) {
        setError("You do not have permission to view this payroll report");
      } else {
        setError("Unable to Load Report");
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [reportKey, serializedFilters]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { data, loading, error, backendUnavailable, lastRefreshedAt, refetch: fetchData };
}

// ── Filter Options Hook ──────────────────────────────────────────────
export function useFilterOptions() {
  const [options, setOptions] = useState<ReportFilterOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    reportAnalyticsApi
      .getFilterOptions()
      .then(setOptions)
      .catch(() => setOptions(null))
      .finally(() => setLoading(false));
  }, []);

  return { options, loading };
}

// ── Company Profile Hook (for Print/PDF Report Header) ───────────────
export function useCompanyReportProfile() {
  const [company, setCompany] = useState<{ name: string; logoUrl?: string }>({
    name: "OFC360 Organization",
  });
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    reportAnalyticsApi.getCompanyProfile().then(setCompany).catch(() => {});
  }, []);

  return company;
}

// ── Employee Drill-Down Hook ─────────────────────────────────────────
export function useEmployeeDetail() {
  const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null);
  const [detail, setDetail] = useState<EmployeePayrollDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const openEmployeeDetail = useCallback(
    async (row: Record<string, unknown>, context?: { runId?: string; periodLabel?: string }) => {
      const empId = String(row.employeeId ?? row.employee_id ?? row.id ?? "");
      if (!empId) return;
      setSelectedRow(row);
      setOpen(true);
      setLoading(true);
      setError(null);
      try {
        const res = await reportAnalyticsApi.getEmployeePayrollDetail(empId, {
          runId: String(row.runId ?? row.run_id ?? context?.runId ?? "") || undefined,
          row,
          periodLabel: context?.periodLabel,
        });
        setDetail(res);
      } catch {
        setError("Unable to load employee payroll calculation breakdown");
        setDetail(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const closeEmployeeDetail = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    open,
    selectedRow,
    detail,
    loading,
    error,
    openEmployeeDetail,
    closeEmployeeDetail,
  };
}

// ── Report Export Hook (Server-Side CSV / XLSX / PDF + Print Fallback) ─
export function useReportExport() {
  const [exporting, setExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat | null>(null);

  const exportReport = useCallback(
    async (
      reportKey: ReportKey,
      format: ExportFormat,
      filters?: ExtendedReportFilterConfig
    ) => {
      if (exporting) return;
      setExporting(true);
      setExportFormat(format);
      try {
        const exportMeta = await reportsApi.requestReportExport(reportKey, format, filters);
        if (!exportMeta.exportId) {
          throw new Error("Missing export ID from server");
        }
        const { blob, filename, mimeType } = await reportsApi.downloadReportExport(
          exportMeta.exportId
        );
        const url = window.URL.createObjectURL(
          new Blob([blob], { type: mimeType || blob.type || "application/octet-stream" })
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = filename || exportMeta.fileName || `${reportKey}_report.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success(`Exported ${reportKey.replace(/_/g, " ")} as ${format.toUpperCase()}`);
      } catch (err) {
        const status = getHttpStatus(err);
        if (format === "pdf" && (status === 400 || status === 404 || status === 422 || status === 501)) {
          toast.info("Server PDF export unavailable — opening print-ready PDF view");
          if (typeof window !== "undefined" && typeof window.print === "function") {
            window.print();
          }
        } else if (status === 404 || status === 501) {
          toast.error("Export service unavailable — backend pending");
        } else if (status === 403) {
          toast.error("You do not have permission to export this report");
        } else {
          toast.error("Failed to generate export file");
        }
      } finally {
        setExporting(false);
        setExportFormat(null);
      }
    },
    [exporting]
  );

  return { exporting, exportFormat, exportReport };
}

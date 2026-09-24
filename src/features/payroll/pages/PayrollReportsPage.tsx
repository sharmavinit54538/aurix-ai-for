import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  Layers,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { GlassCard, StatCard } from "@/components/hrms/Shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatINR, formatCount, formatDate } from "@/lib/format";
import { reportsApi } from "../api/reportsApi";
import {
  REPORT_REGISTRY,
  type ReportKey,
  type ExportFormat,
  type ReportFilterConfig,
  type ReportDataResponse,
  type AccountingExportResponse,
} from "../types/reports";
import { toast } from "sonner";

export default function PayrollReportsPage() {
  const [selectedReportKey, setSelectedReportKey] = useState<ReportKey>("payroll_register");
  const [loading, setLoading] = useState(false);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const [reportData, setReportData] = useState<ReportDataResponse | null>(null);
  const [accountingData, setAccountingData] = useState<AccountingExportResponse | null>(null);

  // Filters
  const [periodId, setPeriodId] = useState("");
  const [financialYear, setFinancialYear] = useState("2026-2027");
  const [department, setDepartment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  // Export State
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null);

  const currentReportDef = REPORT_REGISTRY[selectedReportKey];

  const loadReport = async () => {
    setLoading(true);
    setBackendUnavailable(false);

    try {
      if (selectedReportKey === "accounting_export") {
        const accRes = await reportsApi.getAccountingJournal(periodId || undefined);
        setAccountingData(accRes);
      } else {
        const filters: ReportFilterConfig = {
          periodId: periodId || undefined,
          financialYear: financialYear || undefined,
          department: department || undefined,
        };
        const data = await reportsApi.getReportData(selectedReportKey, filters, {
          page,
          limit: 25,
        });
        setReportData(data);
      }
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 501) {
        setBackendUnavailable(true);
      } else {
        toast.error(`Failed to load ${currentReportDef.title}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [selectedReportKey, page]);

  const handleExport = async (format: ExportFormat) => {
    if (exportingFormat) return;
    setExportingFormat(format);

    try {
      const exportMeta = await reportsApi.requestReportExport(selectedReportKey, format, {
        periodId: periodId || undefined,
        financialYear: financialYear || undefined,
        department: department || undefined,
      });

      // Download file blob
      const blob = await reportsApi.downloadReportExport(exportMeta.exportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = exportMeta.fileName || `${selectedReportKey}_${financialYear}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // CRITICAL: Revoke Blob URL immediately
      window.URL.revokeObjectURL(url);
      toast.success(`${currentReportDef.title} exported as ${format.toUpperCase()}`);
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 501) {
        setBackendUnavailable(true);
        toast.error("Export service unavailable — backend pending");
      } else {
        toast.error("Failed to generate export file");
      }
    } finally {
      setExportingFormat(null);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Payroll Reports & Exports
            </h1>
            <Badge
              variant="outline"
              className="text-xs font-semibold border-primary/30 bg-primary/10 text-primary"
            >
              Audited Ledger
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Authoritative financial registers, statutory statements, cost center journals, and bank advice files.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadReport}
            disabled={loading}
            className="h-8 gap-1.5 text-xs rounded-xl"
          >
            <RefreshCw className={loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5"} />
            <span>Refresh</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("csv")}
            disabled={Boolean(exportingFormat) || loading}
            className="h-8 gap-1.5 text-xs rounded-xl"
          >
            <Download className="h-3.5 w-3.5" />
            <span>CSV Export</span>
          </Button>

          <Button
            size="sm"
            onClick={() => handleExport("xlsx")}
            disabled={Boolean(exportingFormat) || loading}
            className="h-8 gap-1.5 text-xs rounded-xl"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Excel Export</span>
          </Button>
        </div>
      </div>

      {/* ── Backend Unavailable Banner ───────────────────────────────── */}
      {backendUnavailable && (
        <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-semibold text-sm">
            Feature unavailable — backend pending
          </AlertTitle>
          <AlertDescription className="text-xs mt-1 space-y-1">
            <p>
              The Payroll Reporting endpoint (<code>GET /api/v2/payroll/reports/{selectedReportKey}</code>) is awaiting backend deployment.
              Report registry schemas and CSV export sanitation pipelines are operational.
            </p>
            <p className="font-mono text-[11px] opacity-80">
              Contract reference: <code>docs/PAYROLL_BACKEND_CONTRACT.md</code> • Requirements: <code>docs/PAYROLL_BACKEND_TODO.md</code>
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* ── Report Selector Carousel / Grid ─────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {(Object.keys(REPORT_REGISTRY) as ReportKey[]).map((key) => {
          const item = REPORT_REGISTRY[key];
          const isSelected = selectedReportKey === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setSelectedReportKey(key);
                setPage(1);
              }}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/40 shadow-xs"
                  : "border-border/60 bg-background/60 text-muted-foreground hover:bg-muted/40"
              }`}
            >
              <div className="text-xs font-semibold truncate text-foreground">{item.title}</div>
              <div className="text-[10px] text-muted-foreground capitalize mt-0.5">{item.category}</div>
            </button>
          );
        })}
      </div>

      {/* ── Filter Bar ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-border/60 bg-muted/20">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
              className="rounded-lg border border-input bg-background/80 px-2 py-1 text-xs"
            >
              <option value="2026-2027">FY 2026-2027</option>
              <option value="2025-2026">FY 2025-2026</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="rounded-lg border border-input bg-background/80 px-2 py-1 text-xs"
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Sales">Sales</option>
              <option value="Human Resources">Human Resources</option>
            </select>
          </div>
        </div>

        <Button
          size="sm"
          variant="secondary"
          onClick={loadReport}
          className="h-7 text-xs rounded-lg"
        >
          Apply Filters
        </Button>
      </div>

      {/* ── Report Content Table ────────────────────────────────────── */}
      <GlassCard className="overflow-hidden p-0">
        <div className="p-4 border-b border-border/70 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">{currentReportDef.title}</h3>
            <p className="text-xs text-muted-foreground">{currentReportDef.description}</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {reportData?.totalRecords ?? 0} Record{(reportData?.totalRecords ?? 0) !== 1 ? "s" : ""}
          </Badge>
        </div>

        {selectedReportKey === "accounting_export" ? (
          /* Accounting Double-Entry View */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground border-b border-border/70 uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th className="px-4 py-3">GL Account Code</th>
                  <th className="px-4 py-3">Account Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Cost Center</th>
                  <th className="px-4 py-3 text-right">Debit (INR)</th>
                  <th className="px-4 py-3 text-right">Credit (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {!accountingData || accountingData.entries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                      No accounting journal entries found for this cycle. All entries come from authoritative backend GL mapping.
                    </td>
                  </tr>
                ) : (
                  accountingData.entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-foreground">{entry.accountCode}</td>
                      <td className="px-4 py-3 text-foreground">{entry.accountName}</td>
                      <td className="px-4 py-3 capitalize">{entry.accountType.replace(/_/g, " ")}</td>
                      <td className="px-4 py-3">{entry.costCenter || "—"}</td>
                      <td className="px-4 py-3 font-mono text-right">{entry.debitFormatted}</td>
                      <td className="px-4 py-3 font-mono text-right">{entry.creditFormatted}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* Standard Reports Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/40 text-muted-foreground border-b border-border/70 uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  {currentReportDef.columns.map((col) => (
                    <th
                      key={col.key}
                      className={`px-4 py-3 ${col.align === "right" ? "text-right" : "text-left"}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {loading ? (
                  <tr>
                    <td
                      colSpan={currentReportDef.columns.length}
                      className="px-4 py-12 text-center text-muted-foreground"
                    >
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                      <span>Generating report records...</span>
                    </td>
                  </tr>
                ) : !reportData || reportData.rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={currentReportDef.columns.length}
                      className="px-4 py-12 text-center text-muted-foreground"
                    >
                      <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                      <p className="font-semibold text-foreground text-sm">No Report Data Available</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {backendUnavailable
                          ? "Reporting endpoint pending deployment on backend."
                          : "No records found matching the selected period and filters."}
                      </p>
                    </td>
                  </tr>
                ) : (
                  reportData.rows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/40 transition-colors">
                      {currentReportDef.columns.map((col) => {
                        const val = row[col.key];
                        const displayVal = col.isCurrency
                          ? formatINR(val as number)
                          : col.isDate
                          ? formatDate(val as string)
                          : val !== null && val !== undefined
                          ? String(val)
                          : "—";

                        return (
                          <td
                            key={col.key}
                            className={`px-4 py-3 ${
                              col.align === "right" ? "text-right font-mono" : "text-left"
                            } ${col.isCurrency ? "font-semibold" : ""}`}
                          >
                            {displayVal}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

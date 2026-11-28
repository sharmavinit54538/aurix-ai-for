/**
 * Report 05 — Bank Advice Report
 * Route: /dashboard/payroll/reports/bank-advice
 *
 * Integrates GET /api/v2/payroll/reports/bank_advice with authoritative
 * paymentApi batch, bank file, and reconciliation endpoints.
 * Strictly masks sensitive bank account numbers, never displays ciphertext,
 * and NEVER marks payments successful merely from bank file generation/submission.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  Layers,
  ShieldAlert,
  UserCheck,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatCount, formatINR, formatOptionalINR, formatPaise } from "@/lib/format";
import { toast } from "sonner";
import { paymentApi } from "../api/paymentApi";
import { pickMoneyRupees, pickNum, pickStr } from "../api/reportAnalyticsApi";
import {
  AnalyticsKpiCard,
  BackendUnavailableBanner,
  ChartsGrid,
  DrillDownBreadcrumbBar,
  ExportActions,
  KpiCardsGrid,
  ReportAccessGuard,
  ReportBarChart,
  ReportChartWrapper,
  ReportDataTable,
  ReportDonutChart,
  ReportFilterToolbar,
  ReportLineChart,
  ReportPageLayout,
  ReportTotalsReconciliationCard,
  type DataTableColumn,
} from "../components/ReportComponents";
import {
  useCompanyReportProfile,
  useFilterOptions,
  useReportData,
  useReportExport,
  useReportFilters,
} from "../hooks/useReportAnalytics";
import type { PaymentBatch, PaymentDashboardSummary, PaymentReconciliation } from "../types/payment";
import { REPORT_REGISTRY } from "../types/reports";
import type { ChartDataPoint, ReportReconciliationSummary } from "../types/reportAnalytics";

type RawRow = Record<string, unknown>;

function safeMaskedAccount(val: unknown): string {
  if (typeof val !== "string" || !val.trim()) return "—";
  if (val.startsWith("ofc360:v1:")) return "—";
  return val.trim();
}

export default function BankAdviceReport() {
  const registry = REPORT_REGISTRY.bank_advice;
  const {
    filters,
    draftFilters,
    updateDraftFilter,
    applyFilters,
    setImmediateFilter,
    resetFilters,
    setPage,
    toggleSort,
  } = useReportFilters();

  const { options: filterOptions } = useFilterOptions();
  const companyProfile = useCompanyReportProfile();
  const { data, loading, error, backendUnavailable, lastRefreshedAt, refetch } = useReportData(
    "bank_advice",
    filters
  );
  const { exporting, exportFormat, exportReport } = useReportExport();

  // Authoritative payment batches & dashboard summary from paymentApi
  const [paymentSummary, setPaymentSummary] = useState<PaymentDashboardSummary | null>(null);
  const [batches, setBatches] = useState<PaymentBatch[]>([]);
  const [selectedItem, setSelectedItem] = useState<RawRow | null>(null);
  const [reconDrawerOpen, setReconDrawerOpen] = useState(false);
  const [reconDetail, setReconDetail] = useState<PaymentReconciliation | null>(null);
  const [reconLoading, setReconLoading] = useState(false);
  const [tableSearch, setTableSearch] = useState(filters.search || "");

  const loadPaymentContext = useCallback(async () => {
    const [sumRes, batchRes] = await Promise.allSettled([
      paymentApi.getDashboardSummary(),
      paymentApi.getPaymentBatches({ page: 1, limit: 50, periodId: filters.periodId }),
    ]);
    if (sumRes.status === "fulfilled") setPaymentSummary(sumRes.value);
    if (batchRes.status === "fulfilled") setBatches(batchRes.value.items || []);
  }, [filters.periodId]);

  useEffect(() => {
    void loadPaymentContext();
  }, [loadPaymentContext]);

  const rows = useMemo(() => (Array.isArray(data?.rows) ? data.rows : []), [data?.rows]);
  const totals = useMemo(() => (data?.summaryTotals || {}) as RawRow, [data?.summaryTotals]);

  const normalizedRows = useMemo(
    () =>
      rows.map((r) => {
        const row = r as RawRow;
        return {
          ...row,
          employeeCode: pickStr(row, "employeeCode", "employee_code") ?? "—",
          employeeName:
            pickStr(row, "employeeName", "employee_name", "beneficiaryName", "beneficiary_name") ??
            "—",
          department: pickStr(row, "department") ?? "—",
          bankName: pickStr(row, "bankName", "bank_name") ?? "—",
          accountHolderName:
            pickStr(row, "accountHolderName", "account_holder_name", "beneficiaryName", "beneficiary_name") ??
            "—",
          accountNumberMasked: safeMaskedAccount(
            row.accountNumberMasked ?? row.account_number_masked
          ),
          ifscCode: pickStr(row, "ifscCode", "ifsc_code") ?? "—",
          netPayable: pickMoneyRupees(
            row,
            ["netPayableAmount", "net_payable_amount", "amount", "netAmount"],
            ["netAmountPaise", "net_amount_paise"]
          ),
          batchId: pickStr(row, "batchId", "batch_id"),
          batchNumber: pickStr(row, "batchNumber", "batch_number", "paymentBatchNumber") ?? "—",
          paymentMode: pickStr(row, "paymentMode", "payment_mode") ?? "—",
          transactionRef: pickStr(row, "transactionRef", "transaction_ref", "paymentReference") ?? "—",
          utr: pickStr(row, "utr", "utrNumber", "utr_number") ?? "—",
          paymentStatus: pickStr(row, "paymentStatus", "payment_status", "status") ?? "pending",
          paymentDate: pickStr(row, "paymentDate", "payment_date", "creditedDate", "credited_date"),
          holdReason: pickStr(row, "holdReason", "hold_reason") ?? "—",
          failureReason: pickStr(row, "failureReason", "failure_reason") ?? "—",
          reconciliationStatus:
            pickStr(row, "reconciliationStatus", "reconciliation_status") ?? "—",
        };
      }),
    [rows]
  );

  // 8 KPIs (Authoritative paymentSummary + report summaryTotals — never faked!)
  const kpis = useMemo(() => {
    const totalBatches =
      pickNum(totals, "totalPaymentBatches", "total_payment_batches", "totalBatches") ??
      paymentSummary?.totalBatches ??
      null;
    const totalPayable =
      pickMoneyRupees(totals, ["totalPayable", "total_payable"], ["totalPayablePaise"]) ??
      (paymentSummary ? paymentSummary.totalPayableAmountPaise / 100 : null);
    const confirmedPaid =
      pickMoneyRupees(totals, ["confirmedPaid", "confirmed_paid", "paidAmount"], ["totalPaidPaise"]) ??
      (paymentSummary ? paymentSummary.totalPaidAmountPaise / 100 : null);
    const outstanding =
      pickMoneyRupees(totals, ["outstandingAmount", "outstanding_amount"], ["outstandingPaise"]) ??
      (paymentSummary ? paymentSummary.outstandingPaymentAmountPaise / 100 : null);
    const heldAmount =
      pickMoneyRupees(totals, ["heldAmount", "held_amount"], ["heldPaise"]) ??
      (paymentSummary ? paymentSummary.totalHeldAmountPaise / 100 : null);
    const failedAmount =
      pickMoneyRupees(totals, ["failedAmount", "failed_amount"], ["failedPaise"]) ??
      (paymentSummary ? paymentSummary.totalFailedAmountPaise / 100 : null);
    const paidEmployees =
      pickNum(totals, "paidEmployees", "paid_employees", "successfullyPaidEmployees") ??
      (normalizedRows.length > 0
        ? normalizedRows.filter((r) => r.paymentStatus.toLowerCase() === "paid").length
        : null);
    const pendingEmployees =
      pickNum(totals, "pendingEmployees", "pending_employees", "pendingPaymentEmployees") ??
      (normalizedRows.length > 0
        ? normalizedRows.filter((r) =>
            ["pending", "processing"].includes(r.paymentStatus.toLowerCase())
          ).length
        : null);

    return {
      totalBatches,
      totalPayable,
      confirmedPaid,
      outstanding,
      heldAmount,
      failedAmount,
      paidEmployees,
      pendingEmployees,
    };
  }, [totals, paymentSummary, normalizedRows]);

  // 5 Charts
  const chartsData = useMemo(() => {
    const backendCharts = Array.isArray(data?.charts) ? data.charts : [];
    const findChart = (id: string) =>
      backendCharts.find((c) => c.chartId === id || c.id === id)?.data as ChartDataPoint[] | undefined;

    // 1. Payment Status Distribution
    let statusDist: ChartDataPoint[] = findChart("payment_status_distribution") || [];
    if (!statusDist.length && normalizedRows.length > 0) {
      const map = new Map<string, number>();
      for (const r of normalizedRows) {
        const st = r.paymentStatus || "pending";
        map.set(st, (map.get(st) ?? 0) + (r.netPayable ?? 0));
      }
      statusDist = Array.from(map.entries()).map(([label, value]) => ({ label, value }));
    }

    // 2. Payment Mode Distribution
    let modeDist: ChartDataPoint[] = findChart("payment_mode_distribution") || [];
    if (!modeDist.length && normalizedRows.length > 0) {
      const map = new Map<string, number>();
      for (const r of normalizedRows) {
        const m = r.paymentMode || "NEFT";
        map.set(m, (map.get(m) ?? 0) + (r.netPayable ?? 0));
      }
      modeDist = Array.from(map.entries()).map(([label, value]) => ({ label, value }));
    } else if (!modeDist.length && batches.length > 0) {
      const map = new Map<string, number>();
      for (const b of batches) {
        map.set(b.paymentMode, (map.get(b.paymentMode) ?? 0) + b.payableAmountPaise / 100);
      }
      modeDist = Array.from(map.entries()).map(([label, value]) => ({ label, value }));
    }

    // 3. Monthly Disbursement Trend
    let disbursementTrend: ChartDataPoint[] = findChart("disbursement_trend") || [];
    if (!disbursementTrend.length && batches.length > 0) {
      const map = new Map<string, { payable: number; paid: number }>();
      for (const b of batches) {
        const key = b.periodName || "Current";
        const curr = map.get(key) || { payable: 0, paid: 0 };
        curr.payable += b.payableAmountPaise / 100;
        curr.paid += (b.paidAmountPaise ?? 0) / 100;
        map.set(key, curr);
      }
      disbursementTrend = Array.from(map.entries()).map(([label, v]) => ({ label, ...v }));
    }

    // 4. Bank-wise Payment Amount
    let bankWise: ChartDataPoint[] = findChart("bank_wise_amount") || [];
    if (!bankWise.length && normalizedRows.length > 0) {
      const map = new Map<string, number>();
      for (const r of normalizedRows) {
        map.set(r.bankName, (map.get(r.bankName) ?? 0) + (r.netPayable ?? 0));
      }
      bankWise = Array.from(map.entries()).map(([label, amount]) => ({ label, amount }));
    }

    // 5. Successful vs Failed Payments
    let successVsFailed: ChartDataPoint[] = findChart("successful_vs_failed") || [];
    if (!successVsFailed.length && batches.length > 0) {
      successVsFailed = batches.slice(0, 8).map((b) => ({
        label: b.batchNumber,
        paid: b.paidCount ?? 0,
        failed: b.failedCount ?? 0,
      }));
    }

    return { statusDist, modeDist, disbursementTrend, bankWise, successVsFailed };
  }, [data?.charts, normalizedRows, batches]);

  const handleDownloadExistingBankFile = async (batchId: string) => {
    try {
      const { blob, filename, mimeType } = await paymentApi.downloadBankFile(batchId);
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: mimeType || "application/octet-stream" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success(`Downloaded bank file ${filename}`);
    } catch {
      toast.error("No bank file available or unauthorized to download");
    }
  };

  const handleExportBatchReport = async (batchId: string) => {
    try {
      const { blob, filename, mimeType } = await paymentApi.exportBatchReport(batchId);
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: mimeType || "text/csv" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Exported payment batch report");
    } catch {
      toast.error("Unable to export batch payment report");
    }
  };

  const handleViewReconciliation = async (batchId: string) => {
    setReconDrawerOpen(true);
    setReconLoading(true);
    setReconDetail(null);
    try {
      const res = await paymentApi.getReconciliation(batchId);
      setReconDetail(res);
    } catch {
      toast.error("Unable to load batch reconciliation details");
    } finally {
      setReconLoading(false);
    }
  };

  const columns: DataTableColumn[] = useMemo(
    () => [
      { key: "employeeCode", label: "Emp Code", sortable: true },
      { key: "employeeName", label: "Employee Name", sortable: true },
      { key: "department", label: "Department", sortable: true },
      { key: "bankName", label: "Bank Name" },
      { key: "accountHolderName", label: "Account Holder", defaultHidden: true },
      { key: "accountNumberMasked", label: "Account No.", isSensitive: true },
      { key: "ifscCode", label: "IFSC Code" },
      { key: "netPayable", label: "Net Payable", align: "right", isCurrency: true, sortable: true },
      { key: "batchNumber", label: "Batch Number" },
      { key: "paymentMode", label: "Mode" },
      { key: "transactionRef", label: "Txn Ref", defaultHidden: true },
      { key: "utr", label: "UTR Number" },
      {
        key: "paymentStatus",
        label: "Payment Status",
        render: (val) => {
          const st = String(val || "pending").toLowerCase();
          const cls =
            st === "paid"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : st === "failed"
                ? "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                : st === "held"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                  : "border-border bg-muted text-muted-foreground";
          return (
            <Badge variant="outline" className={`capitalize ${cls}`}>
              {st}
            </Badge>
          );
        },
      },
      { key: "paymentDate", label: "Payment Date", isDate: true },
      { key: "holdReason", label: "Hold Reason", defaultHidden: true },
      { key: "failureReason", label: "Failure Reason", defaultHidden: true },
      { key: "reconciliationStatus", label: "Reconciliation", defaultHidden: true },
      {
        key: "__actions",
        label: "Actions",
        align: "center",
        render: (_v, row) => {
          const bId = pickStr(row as RawRow, "batchId", "batch_id");
          return (
            <div className="flex items-center justify-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedItem(row as RawRow);
                }}
                className="h-7 px-2 text-xs text-primary"
              >
                <Eye className="h-3.5 w-3.5" />
              </Button>
              {bId && (
                <>
                  <Link
                    to={`/dashboard/payroll/payments/${bId}` as "/dashboard/payroll/payments/$batchId"}
                    onClick={(e) => e.stopPropagation()}
                    title="View Payment Batch"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Download Bank File"
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleDownloadExistingBankFile(bId);
                    }}
                    className="h-7 w-7"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Reconciliation Details"
                    onClick={(e) => {
                      e.stopPropagation();
                      void handleViewReconciliation(bId);
                    }}
                    className="h-7 w-7"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </Button>
                </>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  const reconciliationSummary: ReportReconciliationSummary | null = useMemo(() => {
    if (kpis.totalPayable === null && !paymentSummary) return null;
    const expected = kpis.totalPayable ?? 0;
    const paid = kpis.confirmedPaid ?? 0;
    const held = kpis.heldAmount ?? 0;
    const failed = kpis.failedAmount ?? 0;
    const outstanding = kpis.outstanding ?? 0;
    const accounted = paid + held + failed + outstanding;
    const diff = Math.round((expected - accounted) * 100) / 100;
    return {
      title: "Bank Disbursement & Reconciliation Summary",
      isBalanced: Math.abs(diff) < 1,
      items: [
        { label: "Total Payable", value: formatOptionalINR(kpis.totalPayable) },
        { label: "Confirmed Paid", value: formatOptionalINR(kpis.confirmedPaid), tone: "success" },
        { label: "Held + Failed", value: formatINR(held + failed), tone: held + failed > 0 ? "warning" : "default" },
        { label: "Outstanding", value: formatOptionalINR(kpis.outstanding), tone: outstanding > 0 ? "warning" : "default" },
      ],
      discrepancyMessage:
        "Payment status reflects actual bank reconciliation outcomes only — file generation/submission never marks items as Paid.",
    };
  }, [kpis, paymentSummary]);

  return (
    <ReportAccessGuard requiredPermission="payroll.disburse">
      <ReportPageLayout
        title={registry.title}
        description={registry.description}
        periodLabel={data?.periodLabel || `FY ${filters.financialYear}`}
        lastUpdated={lastRefreshedAt}
        companyName={companyProfile.name}
        companyLogoUrl={companyProfile.logoUrl}
        appliedFilters={filters}
        summaryTotals={reconciliationSummary?.items.map((i) => ({ label: i.label, value: i.value })) ?? []}
        actions={
          <div className="flex flex-wrap items-center gap-1.5">
            {batches[0] && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void handleExportBatchReport(batches[0].id)}
                className="h-8 gap-1.5 rounded-xl text-xs"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>Batch Report</span>
              </Button>
            )}
            <ExportActions
              onExport={(fmt) => void exportReport("bank_advice", fmt, filters)}
              exporting={exporting}
              exportFormat={exportFormat}
              disabled={backendUnavailable}
            />
          </div>
        }
      >
        <ReportFilterToolbar
          filters={draftFilters}
          filterOptions={filterOptions}
          supportedFilters={registry.supportedFilters}
          onFilterChange={updateDraftFilter}
          onApply={() => applyFilters()}
          onReset={resetFilters}
          onRefresh={() => {
            void refetch();
            void loadPaymentContext();
          }}
          loading={loading}
        />

        {backendUnavailable && !paymentSummary && <BackendUnavailableBanner reportKey="bank_advice" />}

        <DrillDownBreadcrumbBar
          selections={[
            ...(filters.paymentStatus
              ? [{ key: "paymentStatus", label: "Payment Status", value: filters.paymentStatus }]
              : []),
            ...(filters.paymentMode
              ? [{ key: "paymentMode", label: "Payment Mode", value: filters.paymentMode }]
              : []),
          ]}
          onRemove={(k) => setImmediateFilter({ [k]: undefined })}
          onClearAll={() => setImmediateFilter({ paymentStatus: undefined, paymentMode: undefined })}
        />

        {/* Section C: 8 KPI Cards */}
        <KpiCardsGrid columns={4}>
          <AnalyticsKpiCard
            label="Total Payment Batches"
            value={kpis.totalBatches !== null ? formatCount(kpis.totalBatches) : "—"}
            icon={Layers}
            accent="brand"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Total Payable Amount"
            value={formatOptionalINR(kpis.totalPayable)}
            icon={Banknote}
            accent="brand"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Confirmed Paid Amount"
            value={formatOptionalINR(kpis.confirmedPaid)}
            icon={CheckCircle2}
            accent="success"
            active={filters.paymentStatus === "paid"}
            onClick={() =>
              setImmediateFilter({
                paymentStatus: filters.paymentStatus === "paid" ? undefined : "paid",
              })
            }
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Outstanding Amount"
            value={formatOptionalINR(kpis.outstanding)}
            icon={Clock}
            accent="warning"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Held Payment Amount"
            value={formatOptionalINR(kpis.heldAmount)}
            icon={ShieldAlert}
            accent="warning"
            active={filters.paymentStatus === "held"}
            onClick={() =>
              setImmediateFilter({
                paymentStatus: filters.paymentStatus === "held" ? undefined : "held",
              })
            }
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Failed Payment Amount"
            value={formatOptionalINR(kpis.failedAmount)}
            icon={AlertTriangle}
            accent="danger"
            active={filters.paymentStatus === "failed"}
            onClick={() =>
              setImmediateFilter({
                paymentStatus: filters.paymentStatus === "failed" ? undefined : "failed",
              })
            }
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Successfully Paid Employees"
            value={kpis.paidEmployees !== null ? formatCount(kpis.paidEmployees) : "—"}
            icon={UserCheck}
            accent="success"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Pending Payment Employees"
            value={kpis.pendingEmployees !== null ? formatCount(kpis.pendingEmployees) : "—"}
            icon={Users}
            accent="muted"
            loading={loading}
          />
        </KpiCardsGrid>

        {/* Section D: 5 Charts */}
        <ChartsGrid>
          <ReportChartWrapper
            title="Payment Status Distribution"
            subtitle="Click a status slice to filter matching transactions"
            loading={loading}
            empty={chartsData.statusDist.length === 0}
          >
            <ReportDonutChart
              data={chartsData.statusDist}
              onSliceClick={(pt) =>
                setImmediateFilter({
                  paymentStatus: filters.paymentStatus === pt.label ? undefined : pt.label,
                })
              }
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Payment Mode Distribution"
            subtitle="NEFT, RTGS, IMPS, and UPI disbursement share"
            loading={loading}
            empty={chartsData.modeDist.length === 0}
          >
            <ReportDonutChart
              data={chartsData.modeDist}
              onSliceClick={(pt) =>
                setImmediateFilter({
                  paymentMode: filters.paymentMode === pt.label ? undefined : pt.label,
                })
              }
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Monthly Salary Disbursement Trend"
            subtitle="Payable vs Confirmed Paid across payroll batches"
            loading={loading}
            empty={chartsData.disbursementTrend.length === 0}
          >
            <ReportLineChart
              data={chartsData.disbursementTrend}
              dataKeys={[
                { key: "payable", name: "Total Payable" },
                { key: "paid", name: "Confirmed Paid" },
              ]}
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Bank-wise Payment Amount"
            subtitle="Aggregate transfer amount grouped by beneficiary bank"
            loading={loading}
            empty={chartsData.bankWise.length === 0}
          >
            <ReportBarChart
              data={chartsData.bankWise}
              dataKeys={[{ key: "amount", name: "Disbursement Amount" }]}
              horizontal
            />
          </ReportChartWrapper>
        </ChartsGrid>

        <ReportChartWrapper
          title="Successful vs Failed Payments by Batch"
          subtitle="Employee payment settlement outcomes across recent batches"
          loading={loading}
          empty={chartsData.successVsFailed.length === 0}
        >
          <ReportBarChart
            data={chartsData.successVsFailed}
            dataKeys={[
              { key: "paid", name: "Paid Count" },
              { key: "failed", name: "Failed Count" },
            ]}
            formatType="number"
            height={240}
          />
        </ReportChartWrapper>

        {/* Section E: Detailed Bank Advice Table */}
        <ReportDataTable
          columns={columns}
          rows={normalizedRows}
          totalRecords={data?.totalRecords ?? normalizedRows.length}
          page={filters.page ?? 1}
          limit={filters.limit ?? 25}
          loading={loading}
          error={error}
          sortBy={filters.sortBy}
          sortDir={filters.sortDir}
          onSort={toggleSort}
          onPageChange={setPage}
          searchValue={tableSearch}
          onSearchChange={(val) => {
            setTableSearch(val);
            setImmediateFilter({ search: val || undefined });
          }}
          searchPlaceholder="Search employee, UTR, batch..."
          onRowClick={(row) => setSelectedItem(row as RawRow)}
          emptyMessage="No Bank Advice Transactions Available"
          emptyDescription="Generate a payment batch from a finalized payroll run to view bank advice schedules."
        />

        <ReportTotalsReconciliationCard summary={reconciliationSummary} />

        {/* Payment Item Detail Drawer */}
        <Sheet open={Boolean(selectedItem)} onOpenChange={(o) => !o && setSelectedItem(null)}>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader className="border-b border-border pb-4">
              <SheetTitle>{String(selectedItem?.employeeName || "Payment Details")}</SheetTitle>
              <SheetDescription>
                {String(selectedItem?.employeeCode || "—")} • Batch{" "}
                {String(selectedItem?.batchNumber || "—")}
              </SheetDescription>
            </SheetHeader>
            {selectedItem && (
              <div className="mt-4 space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Bank Name</span>
                  <span className="font-semibold">{String(selectedItem.bankName)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Account Number</span>
                  <span className="font-mono">{String(selectedItem.accountNumberMasked)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">IFSC Code</span>
                  <span className="font-mono">{String(selectedItem.ifscCode)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Payment Mode</span>
                  <span>{String(selectedItem.paymentMode)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">UTR Number</span>
                  <span className="font-mono">{String(selectedItem.utr)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Net Payable</span>
                  <span className="font-mono font-bold text-primary">
                    {formatOptionalINR(selectedItem.netPayable as number)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Payment Status</span>
                  <Badge variant="outline" className="capitalize">
                    {String(selectedItem.paymentStatus)}
                  </Badge>
                </div>
                {selectedItem.holdReason !== "—" && (
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-amber-800 dark:text-amber-200">
                    Hold Reason: {String(selectedItem.holdReason)}
                  </div>
                )}
                {selectedItem.failureReason !== "—" && (
                  <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-rose-700 dark:text-rose-300">
                    Failure Reason: {String(selectedItem.failureReason)}
                  </div>
                )}
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Reconciliation Details Drawer */}
        <Sheet open={reconDrawerOpen} onOpenChange={setReconDrawerOpen}>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader className="border-b border-border pb-4">
              <SheetTitle>Bank Reconciliation Breakdown</SheetTitle>
              <SheetDescription>Authoritative batch reconciliation ledger</SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-3 text-xs">
              {reconLoading ? (
                <div className="text-muted-foreground">Loading reconciliation...</div>
              ) : reconDetail ? (
                <>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Expected Total</span>
                    <span className="font-mono font-semibold">{formatPaise(reconDetail.expectedPaise)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Confirmed Paid</span>
                    <span className="font-mono font-semibold text-emerald-600">{formatPaise(reconDetail.paidPaise)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Held Amount</span>
                    <span className="font-mono">{formatPaise(reconDetail.heldPaise)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Failed Amount</span>
                    <span className="font-mono text-rose-600">{formatPaise(reconDetail.failedPaise)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Processing Amount</span>
                    <span className="font-mono">{formatPaise(reconDetail.processingPaise)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Mismatch</span>
                    <span className="font-mono font-bold">{formatPaise(reconDetail.mismatchPaise)}</span>
                  </div>
                  <div className="rounded-lg bg-muted/40 p-3 text-muted-foreground">
                    {reconDetail.summaryText || (reconDetail.isReconciled ? "Batch fully reconciled" : "Pending reconciliation")}
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground">No reconciliation details available.</div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </ReportPageLayout>
    </ReportAccessGuard>
  );
}

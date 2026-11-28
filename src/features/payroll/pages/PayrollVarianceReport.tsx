/**
 * Report 06 — Payroll Variance Report
 * Route: /dashboard/payroll/reports/variance
 *
 * Period-over-period comparison (MoM, QoQ, YoY, Custom), zero previous-period
 * division-by-zero protection, Waterfall change breakdown chart, and strictly
 * evidence-backed change reasons ("Reason Not Available" otherwise).
 */

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowLeftRight,
  ArrowUpRight,
  Eye,
  Minus,
  TrendingUp,
  UserMinus,
  UserPlus,
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
import { formatCount, formatINR, formatOptionalINR } from "@/lib/format";
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
  ReportFilterToolbar,
  ReportLineChart,
  ReportPageLayout,
  ReportTotalsReconciliationCard,
  ReportWaterfallChart,
  type DataTableColumn,
} from "../components/ReportComponents";
import {
  useCompanyReportProfile,
  useFilterOptions,
  useReportData,
  useReportExport,
  useReportFilters,
} from "../hooks/useReportAnalytics";
import { REPORT_REGISTRY } from "../types/reports";
import type { ChartDataPoint, ReportReconciliationSummary } from "../types/reportAnalytics";

type RawRow = Record<string, unknown>;

function safeVariancePercent(prev: number | null, diff: number | null): number | null {
  if (prev === null || diff === null || prev === 0) return null;
  return (diff / Math.abs(prev)) * 100;
}

export default function PayrollVarianceReport() {
  const registry = REPORT_REGISTRY.payroll_variance;
  const {
    filters,
    draftFilters,
    updateDraftFilter,
    applyFilters,
    setImmediateFilter,
    resetFilters,
    setPage,
    toggleSort,
  } = useReportFilters({ comparisonMode: "mom" });

  const { options: filterOptions } = useFilterOptions();
  const companyProfile = useCompanyReportProfile();
  const { data, loading, error, backendUnavailable, lastRefreshedAt, refetch } = useReportData(
    "payroll_variance",
    filters
  );
  const { exporting, exportFormat, exportReport } = useReportExport();

  const [tableSearch, setTableSearch] = useState(filters.search || "");
  const [selectedRow, setSelectedRow] = useState<RawRow | null>(null);

  const rows = useMemo(() => (Array.isArray(data?.rows) ? data.rows : []), [data?.rows]);
  const totals = useMemo(() => (data?.summaryTotals || {}) as RawRow, [data?.summaryTotals]);

  const normalizedRows = useMemo(
    () =>
      rows.map((r) => {
        const row = r as RawRow;
        const prevGross =
          pickMoneyRupees(row, ["previousGross", "previous_gross", "previousMonth", "previous_month"]) ?? 0;
        const currGross =
          pickMoneyRupees(row, ["currentGross", "current_gross", "currentMonth", "current_month"]) ?? 0;
        const grossDiff =
          pickMoneyRupees(row, ["grossDifference", "gross_difference", "varianceAmount", "variance_amount"]) ??
          currGross - prevGross;
        const prevDed = pickMoneyRupees(row, ["previousDeductions", "previous_deductions"]) ?? 0;
        const currDed = pickMoneyRupees(row, ["currentDeductions", "current_deductions"]) ?? 0;
        const prevNet =
          pickMoneyRupees(row, ["previousNet", "previous_net"]) ?? prevGross - prevDed;
        const currNet =
          pickMoneyRupees(row, ["currentNet", "current_net"]) ?? currGross - currDed;
        const netDiff =
          pickMoneyRupees(row, ["netDifference", "net_difference"]) ?? currNet - prevNet;
        const varPct =
          pickNum(row, "variancePercentage", "variance_percentage", "variancePercent") ??
          safeVariancePercent(prevGross, grossDiff);

        const rawReason = pickStr(row, "changeReason", "change_reason", "explanation", "reason");
        const changeReason = rawReason || "Reason Not Available";

        const rawStatus = pickStr(row, "varianceStatus", "variance_status", "status");
        const varianceStatus =
          rawStatus ||
          (prevGross === 0 && currGross > 0
            ? "New Joiner"
            : prevGross > 0 && currGross === 0
              ? "Exit"
              : grossDiff > 0
                ? "Increase"
                : grossDiff < 0
                  ? "Decrease"
                  : "No Change");

        return {
          ...row,
          employeeCode: pickStr(row, "employeeCode", "employee_code") ?? "—",
          employeeName:
            pickStr(row, "employeeName", "employee_name", "componentName", "component_name") ?? "—",
          department: pickStr(row, "department") ?? "—",
          previousGross: prevGross,
          currentGross: currGross,
          grossDifference: grossDiff,
          previousDeductions: prevDed,
          currentDeductions: currDed,
          previousNet: prevNet,
          currentNet: currNet,
          netDifference: netDiff,
          variancePercent: varPct,
          changeReason,
          varianceStatus,
        };
      }),
    [rows]
  );

  // 9 KPIs
  const kpis = useMemo(() => {
    const prevPayroll =
      pickMoneyRupees(totals, ["previousPeriodPayroll", "previous_period_payroll"]) ??
      (normalizedRows.length > 0 ? normalizedRows.reduce((a, r) => a + r.previousGross, 0) : null);
    const currPayroll =
      pickMoneyRupees(totals, ["currentPeriodPayroll", "current_period_payroll"]) ??
      (normalizedRows.length > 0 ? normalizedRows.reduce((a, r) => a + r.currentGross, 0) : null);
    const totalDiff =
      pickMoneyRupees(totals, ["totalPayrollDifference", "total_payroll_difference"]) ??
      (prevPayroll !== null && currPayroll !== null ? currPayroll - prevPayroll : null);
    const varPct =
      pickNum(totals, "payrollVariancePercentage", "payroll_variance_percentage") ??
      safeVariancePercent(prevPayroll, totalDiff);

    const increases =
      pickNum(totals, "employeesWithIncreases", "employees_with_increases") ??
      (normalizedRows.length > 0
        ? normalizedRows.filter((r) => r.grossDifference > 0 && r.previousGross > 0).length
        : null);
    const decreases =
      pickNum(totals, "employeesWithDecreases", "employees_with_decreases") ??
      (normalizedRows.length > 0
        ? normalizedRows.filter((r) => r.grossDifference < 0 && r.currentGross > 0).length
        : null);
    const noChange =
      pickNum(totals, "employeesWithNoChange", "employees_with_no_change") ??
      (normalizedRows.length > 0
        ? normalizedRows.filter((r) => r.grossDifference === 0).length
        : null);
    const newJoinerImpact =
      pickMoneyRupees(totals, ["newJoinerImpact", "new_joiner_impact"]) ??
      (normalizedRows.length > 0
        ? normalizedRows
            .filter((r) => r.previousGross === 0 && r.currentGross > 0)
            .reduce((a, r) => a + r.currentGross, 0)
        : null);
    const exitImpact =
      pickMoneyRupees(totals, ["employeeExitImpact", "employee_exit_impact"]) ??
      (normalizedRows.length > 0
        ? normalizedRows
            .filter((r) => r.previousGross > 0 && r.currentGross === 0)
            .reduce((a, r) => a - r.previousGross, 0)
        : null);

    return {
      prevPayroll,
      currPayroll,
      totalDiff,
      varPct,
      increases,
      decreases,
      noChange,
      newJoinerImpact,
      exitImpact,
    };
  }, [totals, normalizedRows]);

  // 6 Charts
  const chartsData = useMemo(() => {
    const backendCharts = Array.isArray(data?.charts) ? data.charts : [];
    const findChart = (id: string) =>
      backendCharts.find((c) => c.chartId === id || c.id === id)?.data as ChartDataPoint[] | undefined;

    // 1. Previous vs Current Grouped Bar
    const prevVsCurr: ChartDataPoint[] =
      findChart("previous_vs_current") ||
      (kpis.prevPayroll !== null && kpis.currPayroll !== null
        ? [
            {
              label: "Total Payroll",
              previous: kpis.prevPayroll,
              current: kpis.currPayroll,
            },
          ]
        : []);

    // 2. Variance Trend Line
    const trend: ChartDataPoint[] = findChart("variance_trend") || [];

    // 3. Waterfall Change Breakdown
    const waterfallSteps: Array<{ label: string; delta: number; isTotal?: boolean }> = [];
    if (kpis.prevPayroll !== null && kpis.currPayroll !== null) {
      waterfallSteps.push({ label: "Prev Payroll", delta: kpis.prevPayroll, isTotal: true });
      const joinerDelta = kpis.newJoinerImpact ?? 0;
      const exitDelta = kpis.exitImpact ?? 0;
      const existingDelta =
        (kpis.totalDiff ?? 0) - joinerDelta - exitDelta;
      if (joinerDelta !== 0) waterfallSteps.push({ label: "New Joiners", delta: joinerDelta });
      if (existingDelta !== 0) waterfallSteps.push({ label: "Revisions / Var", delta: existingDelta });
      if (exitDelta !== 0) waterfallSteps.push({ label: "Exits", delta: exitDelta });
      waterfallSteps.push({ label: "Curr Payroll", delta: kpis.currPayroll, isTotal: true });
    }

    // 4. Department-wise Variance
    let deptVariance: ChartDataPoint[] = findChart("department_variance") || [];
    if (!deptVariance.length && normalizedRows.length > 0) {
      const map = new Map<string, number>();
      for (const r of normalizedRows) {
        map.set(r.department, (map.get(r.department) ?? 0) + r.grossDifference);
      }
      deptVariance = Array.from(map.entries()).map(([label, variance]) => ({ label, variance }));
    }

    // 5. Change Reason / Component Variance
    let reasonVariance: ChartDataPoint[] = findChart("component_variance") || [];
    if (!reasonVariance.length && normalizedRows.length > 0) {
      const map = new Map<string, number>();
      for (const r of normalizedRows) {
        map.set(r.changeReason, (map.get(r.changeReason) ?? 0) + r.grossDifference);
      }
      reasonVariance = Array.from(map.entries()).map(([label, variance]) => ({ label, variance }));
    }

    // 6. Top Employee-wise Variance
    const employeeVariance: ChartDataPoint[] =
      findChart("employee_variance") ||
      [...normalizedRows]
        .sort((a, b) => Math.abs(b.grossDifference) - Math.abs(a.grossDifference))
        .slice(0, 10)
        .map((r) => ({ label: r.employeeName, variance: r.grossDifference }));

    return {
      prevVsCurr,
      trend,
      waterfallSteps,
      deptVariance,
      reasonVariance,
      employeeVariance,
    };
  }, [data?.charts, kpis, normalizedRows]);

  const columns: DataTableColumn[] = useMemo(
    () => [
      { key: "employeeCode", label: "Emp Code", sortable: true },
      { key: "employeeName", label: "Employee Name", sortable: true },
      { key: "department", label: "Department", sortable: true },
      { key: "previousGross", label: "Prev Gross", align: "right", isCurrency: true },
      { key: "currentGross", label: "Curr Gross", align: "right", isCurrency: true },
      {
        key: "grossDifference",
        label: "Gross Diff",
        align: "right",
        sortable: true,
        render: (val) => {
          const n = Number(val ?? 0);
          return (
            <span
              className={`font-mono font-semibold ${
                n > 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : n < 0
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-muted-foreground"
              }`}
            >
              {formatINR(n)}
            </span>
          );
        },
      },
      { key: "previousDeductions", label: "Prev Ded.", align: "right", isCurrency: true, defaultHidden: true },
      { key: "currentDeductions", label: "Curr Ded.", align: "right", isCurrency: true, defaultHidden: true },
      { key: "previousNet", label: "Prev Net", align: "right", isCurrency: true },
      { key: "currentNet", label: "Curr Net", align: "right", isCurrency: true },
      {
        key: "netDifference",
        label: "Net Diff",
        align: "right",
        render: (val) => {
          const n = Number(val ?? 0);
          return (
            <span
              className={`font-mono font-semibold ${
                n > 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : n < 0
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-muted-foreground"
              }`}
            >
              {formatINR(n)}
            </span>
          );
        },
      },
      {
        key: "variancePercent",
        label: "Variance %",
        align: "right",
        render: (val) =>
          typeof val === "number" ? (
            <span className="font-mono font-semibold">{val.toFixed(1)}%</span>
          ) : (
            <span className="text-muted-foreground">N/A (Prev ₹0)</span>
          ),
      },
      { key: "changeReason", label: "Change Reason" },
      {
        key: "varianceStatus",
        label: "Status",
        render: (val) => <Badge variant="outline">{String(val)}</Badge>,
      },
      {
        key: "__breakdown",
        label: "Compare",
        align: "center",
        render: (_v, row) => (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRow(row as RawRow);
            }}
            className="h-7 gap-1 px-2 text-xs text-primary"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>View</span>
          </Button>
        ),
      },
    ],
    []
  );

  const reconciliationSummary: ReportReconciliationSummary | null = useMemo(() => {
    if (kpis.prevPayroll === null || kpis.currPayroll === null) return null;
    const expectedDiff = Math.round((kpis.currPayroll - kpis.prevPayroll) * 100) / 100;
    const reportedDiff = kpis.totalDiff ?? expectedDiff;
    const isBalanced = Math.abs(expectedDiff - reportedDiff) < 0.05;
    return {
      title: "Period-over-Period Variance Reconciliation",
      isBalanced,
      items: [
        { label: "Previous Period Payroll", value: formatINR(kpis.prevPayroll) },
        { label: "Current Period Payroll", value: formatINR(kpis.currPayroll) },
        {
          label: "Total Payroll Difference",
          value: formatINR(reportedDiff),
          tone: reportedDiff >= 0 ? "success" : "danger",
        },
        {
          label: "Variance %",
          value: kpis.varPct !== null ? `${kpis.varPct.toFixed(2)}%` : "N/A (Zero Base)",
        },
      ],
    };
  }, [kpis]);

  return (
    <ReportAccessGuard requiredPermission="payroll.reports">
      <ReportPageLayout
        title={registry.title}
        description={registry.description}
        periodLabel={data?.periodLabel || `${String(filters.comparisonMode || "mom").toUpperCase()} • FY ${filters.financialYear}`}
        lastUpdated={lastRefreshedAt}
        companyName={companyProfile.name}
        companyLogoUrl={companyProfile.logoUrl}
        appliedFilters={filters}
        summaryTotals={reconciliationSummary?.items.map((i) => ({ label: i.label, value: i.value })) ?? []}
        actions={
          <ExportActions
            onExport={(fmt) => void exportReport("payroll_variance", fmt, filters)}
            exporting={exporting}
            exportFormat={exportFormat}
            disabled={backendUnavailable}
          />
        }
      >
        <ReportFilterToolbar
          filters={draftFilters}
          filterOptions={filterOptions}
          supportedFilters={registry.supportedFilters}
          onFilterChange={updateDraftFilter}
          onApply={() => applyFilters()}
          onReset={resetFilters}
          onRefresh={() => void refetch()}
          loading={loading}
        />

        {backendUnavailable && <BackendUnavailableBanner reportKey="payroll_variance" />}

        <DrillDownBreadcrumbBar
          selections={
            filters.department
              ? [{ key: "department", label: "Department", value: filters.department }]
              : []
          }
          onRemove={() => setImmediateFilter({ department: undefined })}
          onClearAll={() => setImmediateFilter({ department: undefined })}
        />

        {/* Section C: 9 KPI Cards */}
        <KpiCardsGrid columns={3}>
          <AnalyticsKpiCard label="Previous Period Payroll" value={formatOptionalINR(kpis.prevPayroll)} icon={ArrowLeftRight} accent="muted" loading={loading} />
          <AnalyticsKpiCard label="Current Period Payroll" value={formatOptionalINR(kpis.currPayroll)} icon={TrendingUp} accent="brand" loading={loading} />
          <AnalyticsKpiCard
            label="Total Payroll Difference"
            value={formatOptionalINR(kpis.totalDiff)}
            changePercent={kpis.varPct}
            icon={ArrowLeftRight}
            accent={(kpis.totalDiff ?? 0) >= 0 ? "success" : "danger"}
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Payroll Variance %"
            value={kpis.varPct !== null ? `${kpis.varPct.toFixed(2)}%` : "N/A"}
            icon={TrendingUp}
            accent="warning"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Employees with Increases"
            value={kpis.increases !== null ? formatCount(kpis.increases) : "—"}
            icon={ArrowUpRight}
            accent="success"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Employees with Decreases"
            value={kpis.decreases !== null ? formatCount(kpis.decreases) : "—"}
            icon={ArrowDownRight}
            accent="danger"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Employees with No Change"
            value={kpis.noChange !== null ? formatCount(kpis.noChange) : "—"}
            icon={Minus}
            accent="muted"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="New Joiner Payroll Impact"
            value={formatOptionalINR(kpis.newJoinerImpact)}
            icon={UserPlus}
            accent="success"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Employee Exit Payroll Impact"
            value={formatOptionalINR(kpis.exitImpact)}
            icon={UserMinus}
            accent="danger"
            loading={loading}
          />
        </KpiCardsGrid>

        {/* Section D: 6 Charts */}
        <ChartsGrid>
          <ReportChartWrapper
            title="Previous vs Current Payroll"
            subtitle="Comparative total payroll between selected periods"
            loading={loading}
            empty={chartsData.prevVsCurr.length === 0}
          >
            <ReportBarChart
              data={chartsData.prevVsCurr}
              dataKeys={[
                { key: "previous", name: "Previous Period" },
                { key: "current", name: "Current Period" },
              ]}
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Payroll Change Breakdown (Waterfall)"
            subtitle="Bridge from previous period payroll to current period payroll"
            loading={loading}
            empty={chartsData.waterfallSteps.length === 0}
          >
            <ReportWaterfallChart steps={chartsData.waterfallSteps} />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Payroll Variance Trend"
            subtitle="Historical period-over-period delta trajectory"
            loading={loading}
            empty={chartsData.trend.length === 0}
          >
            <ReportLineChart
              data={chartsData.trend}
              dataKeys={[{ key: "variance", name: "Variance Amount" }]}
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Department-wise Variance"
            subtitle="Click a department bar to filter comparison rows"
            loading={loading}
            empty={chartsData.deptVariance.length === 0}
          >
            <ReportBarChart
              data={chartsData.deptVariance}
              dataKeys={[{ key: "variance", name: "Net / Gross Variance" }]}
              onBarClick={(pt) =>
                setImmediateFilter({
                  department: filters.department === pt.label ? undefined : pt.label,
                })
              }
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Variance by Driver / Component"
            subtitle="Classified drivers supported by payroll records"
            loading={loading}
            empty={chartsData.reasonVariance.length === 0}
          >
            <ReportBarChart
              data={chartsData.reasonVariance}
              dataKeys={[{ key: "variance", name: "Impact Amount" }]}
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Top Employee-wise Variance"
            subtitle="Largest individual salary changes in the selected cycle"
            loading={loading}
            empty={chartsData.employeeVariance.length === 0}
          >
            <ReportBarChart
              data={chartsData.employeeVariance}
              dataKeys={[{ key: "variance", name: "Gross Difference" }]}
              horizontal
            />
          </ReportChartWrapper>
        </ChartsGrid>

        {/* Section E: Table */}
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
          searchPlaceholder="Search employee or change reason..."
          onRowClick={(row) => setSelectedRow(row as RawRow)}
          emptyMessage="No Payroll Variance Data Available"
          emptyDescription="Variance comparisons require two comparable payroll runs or periods."
        />

        <ReportTotalsReconciliationCard summary={reconciliationSummary} />

        {/* Variance Comparison Drawer */}
        <Sheet open={Boolean(selectedRow)} onOpenChange={(o) => !o && setSelectedRow(null)}>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader className="border-b border-border pb-4">
              <SheetTitle>{String(selectedRow?.employeeName || "Variance Comparison")}</SheetTitle>
              <SheetDescription>
                {String(selectedRow?.employeeCode || "—")} • {String(selectedRow?.department || "—")}
              </SheetDescription>
            </SheetHeader>
            {selectedRow && (
              <div className="mt-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 rounded-xl border border-border p-3">
                  <div>
                    <div className="text-muted-foreground">Previous Gross</div>
                    <div className="font-mono font-semibold">{formatOptionalINR(selectedRow.previousGross as number)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Current Gross</div>
                    <div className="font-mono font-semibold">{formatOptionalINR(selectedRow.currentGross as number)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Previous Deductions</div>
                    <div className="font-mono">{formatOptionalINR(selectedRow.previousDeductions as number)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Current Deductions</div>
                    <div className="font-mono">{formatOptionalINR(selectedRow.currentDeductions as number)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Previous Net</div>
                    <div className="font-mono font-semibold">{formatOptionalINR(selectedRow.previousNet as number)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Current Net</div>
                    <div className="font-mono font-semibold text-primary">{formatOptionalINR(selectedRow.currentNet as number)}</div>
                  </div>
                </div>

                <div className="flex justify-between py-2 border-b border-border/60">
                  <span className="text-muted-foreground">Gross Variance</span>
                  <span className="font-mono font-bold">
                    {formatOptionalINR(selectedRow.grossDifference as number)}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/60">
                  <span className="text-muted-foreground">Variance Percentage</span>
                  <span className="font-mono font-bold">
                    {typeof selectedRow.variancePercent === "number"
                      ? `${selectedRow.variancePercent.toFixed(2)}%`
                      : "N/A (Previous ₹0)"}
                  </span>
                </div>
                <div className="rounded-xl border border-border/70 bg-muted/20 p-3">
                  <div className="text-muted-foreground mb-1">Change Reason</div>
                  <div className="font-semibold text-foreground">{String(selectedRow.changeReason)}</div>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </ReportPageLayout>
    </ReportAccessGuard>
  );
}

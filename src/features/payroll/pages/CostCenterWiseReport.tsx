/**
 * Report 04 — Cost Center-wise Payroll
 * Route: /dashboard/payroll/reports/cost-center-wise
 *
 * Financial cost center allocation analysis with multi-cost-center support,
 * double-counting validation, and honest "Not Configured" budget handling.
 */

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Coins,
  Eye,
  Layers,
  PieChart,
  TrendingUp,
} from "lucide-react";
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
import { REPORT_REGISTRY } from "../types/reports";
import type { ChartDataPoint, ReportReconciliationSummary } from "../types/reportAnalytics";

type RawRow = Record<string, unknown>;

export default function CostCenterWiseReport() {
  const registry = REPORT_REGISTRY.cost_center_payroll;
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
    "cost_center_payroll",
    filters
  );
  const { exporting, exportFormat, exportReport } = useReportExport();

  const [tableSearch, setTableSearch] = useState(filters.search || "");
  const [detailRow, setDetailRow] = useState<RawRow | null>(null);

  const rows = useMemo(() => (Array.isArray(data?.rows) ? data.rows : []), [data?.rows]);
  const totals = useMemo(() => (data?.summaryTotals || {}) as RawRow, [data?.summaryTotals]);

  const normalizedRows = useMemo(() => {
    const mapped = rows.map((r) => {
      const row = r as RawRow;
      const allocatedEarnings =
        pickMoneyRupees(row, ["allocatedEarnings", "allocated_earnings", "directSalary", "direct_salary"]) ?? 0;
      const allocatedEmployer =
        pickMoneyRupees(row, ["allocatedEmployerContributions", "allocated_employer_contributions", "benefitsCost", "benefits_cost"]) ?? 0;
      const totalAllocated =
        pickMoneyRupees(row, ["totalAllocatedPayrollCost", "total_allocated_payroll_cost", "allocatedTotal", "allocated_total"]) ??
        allocatedEarnings + allocatedEmployer;
      const actualCost =
        pickMoneyRupees(row, ["actualCost", "actual_cost"]) ?? totalAllocated;
      const budget = pickMoneyRupees(row, ["allocatedBudget", "allocated_budget", "budget"]);
      const varianceAmt =
        budget !== null
          ? pickMoneyRupees(row, ["varianceAmount", "variance_amount"]) ?? budget - actualCost
          : null;
      const variancePct =
        budget !== null && budget > 0 && varianceAmt !== null
          ? pickNum(row, "variancePercentage", "variance_percentage") ?? (varianceAmt / budget) * 100
          : null;

      return {
        ...row,
        costCenterCode: pickStr(row, "costCenterCode", "cost_center_code", "code") ?? "—",
        costCenterName: pickStr(row, "costCenterName", "cost_center_name", "name") ?? "—",
        department: pickStr(row, "department", "departmentName", "department_name") ?? "—",
        employeeCount: pickNum(row, "employeeCount", "employee_count") ?? 0,
        isActive: row.isActive !== false && row.is_active !== false,
        allocatedEarnings,
        allocatedEmployerContributions: allocatedEmployer,
        totalAllocatedPayrollCost: totalAllocated,
        allocatedBudget: budget,
        actualCost,
        varianceAmount: varianceAmt,
        variancePercentage: variancePct,
        allocationPercent: pickNum(row, "allocationPercentage", "allocation_percentage", "allocationPercent"),
      };
    });

    const totalActual = mapped.reduce((a, r) => a + r.totalAllocatedPayrollCost, 0);
    return mapped.map((r) => ({
      ...r,
      allocationPercent:
        r.allocationPercent ??
        (totalActual > 0 ? (r.totalAllocatedPayrollCost / totalActual) * 100 : null),
    }));
  }, [rows]);

  // 8 KPIs (strictly shows "Not Configured" if budget missing)
  const kpis = useMemo(() => {
    const totalCC = pickNum(totals, "totalCostCenters", "total_cost_centers") ?? (normalizedRows.length > 0 ? normalizedRows.length : null);
    const activeCC =
      pickNum(totals, "activeCostCenters", "active_cost_centers") ??
      (normalizedRows.length > 0 ? normalizedRows.filter((r) => r.isActive).length : null);
    const allocatedCost =
      pickMoneyRupees(totals, ["totalAllocatedCost", "total_allocated_cost", "allocatedTotal"]) ??
      (normalizedRows.length > 0
        ? normalizedRows.reduce((a, r) => a + r.totalAllocatedPayrollCost, 0)
        : null);
    const unallocatedCost = pickMoneyRupees(totals, ["unallocatedPayrollCost", "unallocated_payroll_cost"]);
    const totalBudget =
      pickMoneyRupees(totals, ["totalPayrollBudget", "total_payroll_budget", "totalBudget"]) ??
      (normalizedRows.some((r) => r.allocatedBudget !== null)
        ? normalizedRows.reduce((a, r) => a + (r.allocatedBudget ?? 0), 0)
        : null);
    const actualCost =
      pickMoneyRupees(totals, ["actualPayrollCost", "actual_payroll_cost"]) ?? allocatedCost;
    const budgetVariance =
      totalBudget !== null && actualCost !== null
        ? totalBudget - actualCost
        : pickMoneyRupees(totals, ["budgetVariance", "budget_variance"]);

    let highestCC = pickStr(totals, "highestCostCenter", "highest_cost_center");
    if (!highestCC && normalizedRows.length > 0) {
      const top = [...normalizedRows].sort((a, b) => b.totalAllocatedPayrollCost - a.totalAllocatedPayrollCost)[0];
      highestCC = `${top.costCenterName} (${formatINR(top.totalAllocatedPayrollCost)})`;
    }

    return {
      totalCC,
      activeCC,
      allocatedCost,
      unallocatedCost,
      totalBudget,
      actualCost,
      budgetVariance,
      highestCC,
    };
  }, [totals, normalizedRows]);

  // 5 Charts
  const chartsData = useMemo(() => {
    const backendCharts = Array.isArray(data?.charts) ? data.charts : [];
    const findChart = (id: string) =>
      backendCharts.find((c) => c.chartId === id || c.id === id)?.data as ChartDataPoint[] | undefined;

    const distribution: ChartDataPoint[] =
      findChart("cost_center_distribution") ||
      normalizedRows.map((r) => ({
        label: r.costCenterName,
        value: r.totalAllocatedPayrollCost,
        costCenterCode: r.costCenterCode,
      }));

    const budgetVsActual: ChartDataPoint[] =
      findChart("budget_vs_actual") ||
      normalizedRows
        .filter((r) => r.allocatedBudget !== null)
        .map((r) => ({
          label: r.costCenterCode,
          budget: r.allocatedBudget ?? 0,
          actual: r.actualCost,
        }));

    const monthlyTrend: ChartDataPoint[] = findChart("monthly_trend") || [];

    const allocationBreakdown: ChartDataPoint[] =
      findChart("allocation_breakdown") ||
      normalizedRows.map((r) => ({
        label: r.costCenterCode,
        earnings: r.allocatedEarnings,
        employerContrib: r.allocatedEmployerContributions,
      }));

    const varianceComparison: ChartDataPoint[] =
      findChart("variance_comparison") ||
      normalizedRows
        .filter((r) => r.varianceAmount !== null)
        .map((r) => ({
          label: r.costCenterCode,
          variance: r.varianceAmount ?? 0,
        }));

    return { distribution, budgetVsActual, monthlyTrend, allocationBreakdown, varianceComparison };
  }, [data?.charts, normalizedRows]);

  const columns: DataTableColumn[] = useMemo(
    () => [
      { key: "costCenterCode", label: "Cost Center Code", sortable: true },
      { key: "costCenterName", label: "Cost Center Name", sortable: true },
      { key: "department", label: "Department", sortable: true },
      { key: "employeeCount", label: "Employees", align: "right", sortable: true },
      { key: "allocatedEarnings", label: "Allocated Earnings", align: "right", isCurrency: true },
      { key: "allocatedEmployerContributions", label: "Employer Contrib.", align: "right", isCurrency: true },
      { key: "totalAllocatedPayrollCost", label: "Total Allocated Cost", align: "right", isCurrency: true, sortable: true },
      {
        key: "allocatedBudget",
        label: "Allocated Budget",
        align: "right",
        render: (val) =>
          val !== null && val !== undefined ? (
            <span className="font-mono font-semibold">{formatINR(val as number)}</span>
          ) : (
            <span className="text-muted-foreground">Not Configured</span>
          ),
      },
      { key: "actualCost", label: "Actual Cost", align: "right", isCurrency: true },
      {
        key: "varianceAmount",
        label: "Variance Amount",
        align: "right",
        render: (val) =>
          val !== null && val !== undefined ? (
            <span
              className={`font-mono font-semibold ${
                Number(val) < 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {formatINR(val as number)}
            </span>
          ) : (
            <span className="text-muted-foreground">Not Configured</span>
          ),
      },
      {
        key: "variancePercentage",
        label: "Variance %",
        align: "right",
        render: (val) => (typeof val === "number" ? `${val.toFixed(1)}%` : "Not Configured"),
      },
      {
        key: "allocationPercent",
        label: "Allocation %",
        align: "right",
        render: (val) => (typeof val === "number" ? `${val.toFixed(1)}%` : "—"),
      },
      {
        key: "__details",
        label: "Details",
        align: "center",
        render: (_v, row) => (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setDetailRow(row as RawRow);
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

  // Double-counting check: Sum of allocation percentages should not exceed 100% + rounding tolerance
  const reconciliationSummary: ReportReconciliationSummary | null = useMemo(() => {
    if (normalizedRows.length === 0) return null;
    const sumAllocPct = normalizedRows.reduce((a, r) => a + (r.allocationPercent ?? 0), 0);
    const isBalanced = Math.abs(sumAllocPct - 100) < 0.5 || sumAllocPct === 0;
    return {
      title: "Cost Center Allocation & Double-Counting Verification",
      isBalanced,
      items: [
        { label: "Total Allocated Cost", value: formatOptionalINR(kpis.allocatedCost), tone: "success" },
        { label: "Unallocated Cost", value: formatOptionalINR(kpis.unallocatedCost), tone: kpis.unallocatedCost ? "warning" : "default" },
        { label: "Total Budget", value: kpis.totalBudget !== null ? formatINR(kpis.totalBudget) : "Not Configured" },
        { label: "Allocation Sum", value: `${sumAllocPct.toFixed(1)}%` },
      ],
      discrepancyMessage: isBalanced
        ? null
        : `Total cost center allocation sums to ${sumAllocPct.toFixed(1)}%. Verify split allocations to avoid double counting.`,
    };
  }, [normalizedRows, kpis]);

  return (
    <ReportAccessGuard requiredPermission="payroll.reports">
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
          <ExportActions
            onExport={(fmt) => void exportReport("cost_center_payroll", fmt, filters)}
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

        {backendUnavailable && <BackendUnavailableBanner reportKey="cost_center_payroll" />}

        <DrillDownBreadcrumbBar
          selections={
            filters.costCenter
              ? [{ key: "costCenter", label: "Cost Center", value: filters.costCenter }]
              : []
          }
          onRemove={() => setImmediateFilter({ costCenter: undefined })}
          onClearAll={() => setImmediateFilter({ costCenter: undefined })}
        />

        {/* Section C: 8 KPI Cards */}
        <KpiCardsGrid columns={4}>
          <AnalyticsKpiCard
            label="Total Cost Centers"
            value={kpis.totalCC !== null ? formatCount(kpis.totalCC) : "—"}
            icon={Layers}
            accent="brand"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Active Cost Centers"
            value={kpis.activeCC !== null ? formatCount(kpis.activeCC) : "—"}
            icon={CheckCircle2}
            accent="success"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Total Allocated Payroll Cost"
            value={formatOptionalINR(kpis.allocatedCost)}
            icon={Coins}
            accent="brand"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Unallocated Payroll Cost"
            value={formatOptionalINR(kpis.unallocatedCost)}
            icon={AlertTriangle}
            accent={kpis.unallocatedCost ? "warning" : "muted"}
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Total Payroll Budget"
            value={kpis.totalBudget !== null ? formatINR(kpis.totalBudget) : "Not Configured"}
            icon={PieChart}
            accent="muted"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Actual Payroll Cost"
            value={formatOptionalINR(kpis.actualCost)}
            icon={Coins}
            accent="success"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Budget Variance"
            value={kpis.budgetVariance !== null ? formatINR(kpis.budgetVariance) : "Not Configured"}
            icon={TrendingUp}
            accent={kpis.budgetVariance !== null && kpis.budgetVariance < 0 ? "danger" : "success"}
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Highest Cost Center"
            value={kpis.highestCC || "—"}
            icon={Building2}
            accent="warning"
            loading={loading}
          />
        </KpiCardsGrid>

        {/* Section D: 5 Charts */}
        <ChartsGrid>
          <ReportChartWrapper
            title="Cost Center Payroll Distribution"
            subtitle="Click a slice to filter by cost center"
            loading={loading}
            empty={chartsData.distribution.length === 0}
          >
            <ReportDonutChart
              data={chartsData.distribution}
              onSliceClick={(pt) => {
                const cc = String(pt.costCenterCode || pt.label || "");
                setImmediateFilter({ costCenter: filters.costCenter === cc ? undefined : cc });
              }}
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Budget vs Actual Payroll Cost"
            subtitle="Configured cost center budgets compared against actual payroll spend"
            loading={loading}
            empty={chartsData.budgetVsActual.length === 0}
          >
            <ReportBarChart
              data={chartsData.budgetVsActual}
              dataKeys={[
                { key: "budget", name: "Allocated Budget" },
                { key: "actual", name: "Actual Cost" },
              ]}
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Monthly Cost Center Trend"
            subtitle="Historical allocation trend across reporting months"
            loading={loading}
            empty={chartsData.monthlyTrend.length === 0}
          >
            <ReportLineChart
              data={chartsData.monthlyTrend}
              dataKeys={[{ key: "actual", name: "Allocated Cost" }]}
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Cost Allocation Breakdown"
            subtitle="Allocated Earnings vs Employer Contributions per cost center"
            loading={loading}
            empty={chartsData.allocationBreakdown.length === 0}
          >
            <ReportBarChart
              data={chartsData.allocationBreakdown}
              dataKeys={[
                { key: "earnings", name: "Allocated Earnings" },
                { key: "employerContrib", name: "Employer Contributions" },
              ]}
              stacked
            />
          </ReportChartWrapper>
        </ChartsGrid>

        <ReportChartWrapper
          title="Cost Center Variance Comparison"
          subtitle="Budget variance across configured cost centers"
          loading={loading}
          empty={chartsData.varianceComparison.length === 0}
        >
          <ReportBarChart
            data={chartsData.varianceComparison}
            dataKeys={[{ key: "variance", name: "Budget Variance" }]}
            height={240}
          />
        </ReportChartWrapper>

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
          searchPlaceholder="Search cost center code or name..."
          onRowClick={(row) => setDetailRow(row as RawRow)}
          emptyMessage="No Cost Center Allocations Available"
          emptyDescription="Cost center payroll allocations appear here once employees are mapped to cost centers."
        />

        <ReportTotalsReconciliationCard summary={reconciliationSummary} />

        {/* Section F: Cost Center Detail Drawer */}
        <Sheet open={Boolean(detailRow)} onOpenChange={(o) => !o && setDetailRow(null)}>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader className="border-b border-border pb-4">
              <SheetTitle>{String(detailRow?.costCenterName || "Cost Center Detail")}</SheetTitle>
              <SheetDescription>
                Code: {String(detailRow?.costCenterCode || "—")} • Dept:{" "}
                {String(detailRow?.department || "—")}
              </SheetDescription>
            </SheetHeader>
            {detailRow && (
              <div className="mt-4 space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Employee Count</span>
                  <span className="font-mono font-semibold">
                    {formatCount(Number(detailRow.employeeCount ?? 0))}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Allocated Earnings</span>
                  <span className="font-mono font-semibold">
                    {formatOptionalINR(detailRow.allocatedEarnings as number)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Employer Contributions</span>
                  <span className="font-mono font-semibold">
                    {formatOptionalINR(detailRow.allocatedEmployerContributions as number)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Total Allocated Cost</span>
                  <span className="font-mono font-semibold text-primary">
                    {formatOptionalINR(detailRow.totalAllocatedPayrollCost as number)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Configured Budget</span>
                  <span className="font-mono font-semibold">
                    {detailRow.allocatedBudget !== null
                      ? formatINR(detailRow.allocatedBudget as number)
                      : "Not Configured"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Allocation Share</span>
                  <span className="font-mono font-semibold">
                    {typeof detailRow.allocationPercent === "number"
                      ? `${detailRow.allocationPercent.toFixed(1)}%`
                      : "—"}
                  </span>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    const cc = String(detailRow.costCenterCode || "");
                    setImmediateFilter({ costCenter: cc });
                    setDetailRow(null);
                  }}
                  className="w-full rounded-xl mt-2"
                >
                  Filter Table to {String(detailRow.costCenterCode || "Cost Center")}
                </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </ReportPageLayout>
    </ReportAccessGuard>
  );
}

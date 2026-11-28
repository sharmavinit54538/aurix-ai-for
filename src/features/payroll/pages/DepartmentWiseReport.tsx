/**
 * Report 03 — Department-wise Payroll
 * Route: /dashboard/payroll/reports/department-wise
 *
 * Organizational unit payroll aggregation with 7 KPI cards, 6 charts,
 * department summary table, and interactive department drill-down panel
 * (department KPIs, employee-wise salaries via payroll_register, designations).
 */

import { useCallback, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  Coins,
  Eye,
  TrendingDown,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { GlassCard } from "@/components/hrms/Shared";
import { Button } from "@/components/ui/button";
import { formatCount, formatINR, formatOptionalINR } from "@/lib/format";
import { reportsApi } from "../api/reportsApi";
import { pickMoneyRupees, pickNum, pickStr, sumRowField } from "../api/reportAnalyticsApi";
import {
  AnalyticsKpiCard,
  BackendUnavailableBanner,
  ChartsGrid,
  DrillDownBreadcrumbBar,
  EmployeeDetailDrawer,
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
  useEmployeeDetail,
  useFilterOptions,
  useReportData,
  useReportExport,
  useReportFilters,
} from "../hooks/useReportAnalytics";
import { REPORT_REGISTRY } from "../types/reports";
import type { ChartDataPoint, ReportReconciliationSummary } from "../types/reportAnalytics";

type RawRow = Record<string, unknown>;

export default function DepartmentWiseReport() {
  const registry = REPORT_REGISTRY.department_payroll;
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
    "department_payroll",
    filters
  );
  const { exporting, exportFormat, exportReport } = useReportExport();
  const {
    open: empDrawerOpen,
    detail: empDetail,
    loading: empDrawerLoading,
    error: empDrawerError,
    openEmployeeDetail,
    closeEmployeeDetail,
  } = useEmployeeDetail();

  const [tableSearch, setTableSearch] = useState(filters.search || "");
  const [selectedDeptRow, setSelectedDeptRow] = useState<RawRow | null>(null);
  const [deptEmployees, setDeptEmployees] = useState<RawRow[]>([]);
  const [deptLoading, setDeptLoading] = useState(false);

  const rows = useMemo(() => (Array.isArray(data?.rows) ? data.rows : []), [data?.rows]);
  const totals = useMemo(() => (data?.summaryTotals || {}) as RawRow, [data?.summaryTotals]);

  const normalizedRows = useMemo(() => {
    const base = rows.map((r) => {
      const row = r as RawRow;
      const empCount = pickNum(row, "employeeCount", "employee_count", "headcount") ?? 0;
      const gross = pickMoneyRupees(row, ["grossPayroll", "gross_payroll", "totalGross", "total_gross"]) ?? 0;
      const ded = pickMoneyRupees(row, ["totalDeductions", "total_deductions"]) ?? 0;
      const net = pickMoneyRupees(row, ["netPayroll", "net_payroll", "totalNet", "total_net"]) ?? 0;
      const empContrib = pickMoneyRupees(row, ["employerContributions", "employer_contributions"]) ?? 0;
      const totalCost =
        pickMoneyRupees(row, ["totalEmployerCost", "total_employer_cost", "totalCost", "total_cost", "employerCost", "employer_cost"]) ??
        gross + empContrib;
      const avgSal =
        pickMoneyRupees(row, ["averageSalary", "average_salary"]) ??
        (empCount > 0 ? gross / empCount : null);
      const prevCost = pickMoneyRupees(row, ["previousPeriodCost", "previous_period_cost"]);
      const currCost = pickMoneyRupees(row, ["currentPeriodCost", "current_period_cost"]) ?? totalCost;
      const varAmt =
        pickMoneyRupees(row, ["varianceAmount", "variance_amount"]) ??
        (prevCost !== null ? currCost - prevCost : null);
      const varPct =
        pickNum(row, "variancePercentage", "variance_percentage", "variancePercent", "variance_percent") ??
        (prevCost !== null && prevCost > 0 && varAmt !== null ? (varAmt / prevCost) * 100 : null);

      return {
        ...row,
        departmentName: pickStr(row, "departmentName", "department_name", "department") ?? "—",
        departmentHead: pickStr(row, "departmentHead", "department_head") ?? "—",
        employeeCount: empCount,
        grossPayroll: gross,
        totalDeductions: ded,
        netPayroll: net,
        employerContributions: empContrib,
        totalEmployerCost: totalCost,
        averageSalary: avgSal,
        previousPeriodCost: prevCost,
        currentPeriodCost: currCost,
        varianceAmount: varAmt,
        variancePercent: varPct,
      };
    });

    const grandTotal = base.reduce((acc, d) => acc + d.totalEmployerCost, 0);
    return base.map((d) => ({
      ...d,
      shareOfTotal:
        pickNum(d, "shareOfTotal", "share_of_total") ??
        (grandTotal > 0 ? (d.totalEmployerCost / grandTotal) * 100 : null),
    }));
  }, [rows]);

  // 7 KPIs
  const kpis = useMemo(() => {
    const totalDepts = pickNum(totals, "totalDepartments", "total_departments") ?? (normalizedRows.length > 0 ? normalizedRows.length : null);
    const totalCost =
      pickMoneyRupees(totals, ["totalDepartmentPayrollCost", "totalCost", "total_cost", "totalEmployerCost"]) ??
      sumRowField(normalizedRows, ["totalEmployerCost"]);
    const totalEmployees =
      pickNum(totals, "totalEmployees", "total_employees", "totalDepartmentEmployees") ??
      (normalizedRows.length > 0 ? normalizedRows.reduce((acc, d) => acc + d.employeeCount, 0) : null);
    const avgSalary =
      pickMoneyRupees(totals, ["averageSalary", "average_salary"]) ??
      (totalCost !== null && totalEmployees && totalEmployees > 0 ? totalCost / totalEmployees : null);

    let highestDept: string | null = pickStr(totals, "highestCostDepartment", "highest_cost_department");
    let lowestDept: string | null = pickStr(totals, "lowestCostDepartment", "lowest_cost_department");
    if (!highestDept && normalizedRows.length > 0) {
      const sorted = [...normalizedRows].sort((a, b) => b.totalEmployerCost - a.totalEmployerCost);
      highestDept = `${sorted[0].departmentName} (${formatINR(sorted[0].totalEmployerCost)})`;
      lowestDept = `${sorted[sorted.length - 1].departmentName} (${formatINR(sorted[sorted.length - 1].totalEmployerCost)})`;
    }

    const growth = pickNum(totals, "departmentPayrollGrowth", "department_payroll_growth", "growthPercent");

    return { totalDepts, totalCost, highestDept, lowestDept, avgSalary, growth, totalEmployees };
  }, [totals, normalizedRows]);

  // 6 Charts
  const chartsData = useMemo(() => {
    const backendCharts = Array.isArray(data?.charts) ? data.charts : [];
    const findChart = (id: string) =>
      backendCharts.find((c) => c.chartId === id || c.id === id)?.data as ChartDataPoint[] | undefined;

    const costByDept: ChartDataPoint[] =
      findChart("department_cost") ||
      normalizedRows.map((d) => ({ label: d.departmentName, cost: d.totalEmployerCost }));

    const contribution: ChartDataPoint[] =
      findChart("cost_contribution") ||
      normalizedRows.map((d) => ({ label: d.departmentName, value: d.totalEmployerCost }));

    const avgSalByDept: ChartDataPoint[] =
      findChart("average_salary") ||
      normalizedRows.map((d) => ({ label: d.departmentName, avgSalary: d.averageSalary ?? 0 }));

    const headcountVsCost: ChartDataPoint[] =
      findChart("headcount_vs_cost") ||
      normalizedRows.map((d) => ({
        label: d.departmentName,
        headcount: d.employeeCount,
        costLakhs: Math.round((d.totalEmployerCost / 100000) * 100) / 100,
      }));

    const trend: ChartDataPoint[] =
      findChart("department_trend") ||
      normalizedRows
        .filter((d) => d.previousPeriodCost !== null)
        .map((d) => ({
          label: d.departmentName,
          previous: d.previousPeriodCost ?? 0,
          current: d.currentPeriodCost,
        }));

    const earningsAndDed: ChartDataPoint[] =
      findChart("earnings_and_deductions") ||
      normalizedRows.map((d) => ({
        label: d.departmentName,
        gross: d.grossPayroll,
        deductions: d.totalDeductions,
        employerContrib: d.employerContributions,
      }));

    return { costByDept, contribution, avgSalByDept, headcountVsCost, trend, earningsAndDed };
  }, [data?.charts, normalizedRows]);

  const handleOpenDeptDrillDown = useCallback(
    async (deptRow: RawRow) => {
      const deptName = String(deptRow.departmentName || "");
      setSelectedDeptRow(deptRow);
      setDeptLoading(true);
      try {
        const res = await reportsApi.getReportData(
          "payroll_register",
          { ...filters, department: deptName },
          { page: 1, limit: 100 }
        );
        setDeptEmployees(Array.isArray(res.rows) ? res.rows : []);
      } catch {
        setDeptEmployees([]);
      } finally {
        setDeptLoading(false);
      }
    },
    [filters]
  );

  // Designation breakdown inside drill-down
  const deptDesignations = useMemo(() => {
    const map = new Map<string, { count: number; totalNet: number }>();
    for (const emp of deptEmployees) {
      const desig = pickStr(emp, "designation") || "Unassigned";
      const curr = map.get(desig) || { count: 0, totalNet: 0 };
      curr.count += 1;
      curr.totalNet += pickMoneyRupees(emp, ["netPay", "net_pay", "netSalary", "net_salary"]) ?? 0;
      map.set(desig, curr);
    }
    return Array.from(map.entries()).map(([label, v]) => ({
      label,
      employees: v.count,
      netPayroll: v.totalNet,
    }));
  }, [deptEmployees]);

  const columns: DataTableColumn[] = useMemo(
    () => [
      { key: "departmentName", label: "Department", sortable: true },
      { key: "departmentHead", label: "Dept Head" },
      { key: "employeeCount", label: "Employees", align: "right", sortable: true },
      { key: "grossPayroll", label: "Gross Payroll", align: "right", isCurrency: true, sortable: true },
      { key: "totalDeductions", label: "Deductions", align: "right", isCurrency: true },
      { key: "netPayroll", label: "Net Payroll", align: "right", isCurrency: true },
      { key: "employerContributions", label: "Employer Contrib.", align: "right", isCurrency: true, defaultHidden: true },
      { key: "totalEmployerCost", label: "Total Employer Cost", align: "right", isCurrency: true, sortable: true },
      { key: "averageSalary", label: "Avg Salary", align: "right", isCurrency: true },
      { key: "previousPeriodCost", label: "Prev Period Cost", align: "right", isCurrency: true, defaultHidden: true },
      { key: "currentPeriodCost", label: "Curr Period Cost", align: "right", isCurrency: true, defaultHidden: true },
      { key: "varianceAmount", label: "Variance Amt", align: "right", isCurrency: true },
      {
        key: "variancePercent",
        label: "Variance %",
        align: "right",
        render: (val) => {
          if (typeof val !== "number") return "—";
          const pos = val > 0;
          const neg = val < 0;
          return (
            <span
              className={`inline-flex items-center gap-0.5 font-mono font-semibold ${
                pos
                  ? "text-emerald-600 dark:text-emerald-400"
                  : neg
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-muted-foreground"
              }`}
            >
              {pos ? <ArrowUpRight className="h-3 w-3" /> : neg ? <ArrowDownRight className="h-3 w-3" /> : null}
              {val.toFixed(1)}%
            </span>
          );
        },
      },
      {
        key: "shareOfTotal",
        label: "Share %",
        align: "right",
        render: (val) => (typeof val === "number" ? `${val.toFixed(1)}%` : "—"),
      },
      {
        key: "__view",
        label: "Drill-down",
        align: "center",
        render: (_v, row) => (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              void handleOpenDeptDrillDown(row as RawRow);
            }}
            className="h-7 gap-1 px-2 text-xs text-primary"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>View Employees</span>
          </Button>
        ),
      },
    ],
    [handleOpenDeptDrillDown]
  );

  const reconciliationSummary: ReportReconciliationSummary | null = useMemo(() => {
    if (normalizedRows.length === 0) return null;
    const sumGross = normalizedRows.reduce((a, r) => a + r.grossPayroll, 0);
    const sumDed = normalizedRows.reduce((a, r) => a + r.totalDeductions, 0);
    const sumNet = normalizedRows.reduce((a, r) => a + r.netPayroll, 0);
    const sumTotalCost = normalizedRows.reduce((a, r) => a + r.totalEmployerCost, 0);
    const diff = Math.round((sumGross - sumDed - sumNet) * 100) / 100;
    return {
      title: "Department Aggregation Reconciliation",
      isBalanced: Math.abs(diff) < 0.05,
      items: [
        { label: "Total Department Gross", value: formatINR(sumGross) },
        { label: "Total Deductions", value: formatINR(sumDed), tone: "danger" },
        { label: "Total Net Payroll", value: formatINR(sumNet), tone: "success" },
        { label: "Total Employer CTC Burden", value: formatINR(sumTotalCost) },
      ],
    };
  }, [normalizedRows]);

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
            onExport={(fmt) => void exportReport("department_payroll", fmt, filters)}
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

        {backendUnavailable && <BackendUnavailableBanner reportKey="department_payroll" />}

        <DrillDownBreadcrumbBar
          selections={
            selectedDeptRow
              ? [{ key: "dept", label: "Department Drill-Down", value: String(selectedDeptRow.departmentName) }]
              : []
          }
          onRemove={() => setSelectedDeptRow(null)}
          onClearAll={() => setSelectedDeptRow(null)}
        />

        {/* Section C: 7 KPI Cards */}
        <KpiCardsGrid columns={4}>
          <AnalyticsKpiCard
            label="Total Departments"
            value={kpis.totalDepts !== null ? formatCount(kpis.totalDepts) : "—"}
            icon={Building2}
            accent="brand"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Total Department Payroll Cost"
            value={formatOptionalINR(kpis.totalCost)}
            icon={Coins}
            accent="success"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Highest Cost Department"
            value={kpis.highestDept || "—"}
            icon={TrendingUp}
            accent="warning"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Lowest Cost Department"
            value={kpis.lowestDept || "—"}
            icon={TrendingDown}
            accent="muted"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Average Salary per Employee"
            value={formatOptionalINR(kpis.avgSalary)}
            icon={Coins}
            accent="brand"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Department Payroll Growth"
            value={kpis.growth !== null ? `${kpis.growth.toFixed(1)}%` : "—"}
            changePercent={kpis.growth}
            icon={TrendingUp}
            accent="success"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Total Department Employees"
            value={kpis.totalEmployees !== null ? formatCount(kpis.totalEmployees) : "—"}
            icon={Users}
            accent="brand"
            loading={loading}
          />
        </KpiCardsGrid>

        {/* Section D: 6 Charts */}
        <ChartsGrid>
          <ReportChartWrapper
            title="Department-wise Payroll Cost"
            subtitle="Click a department bar to drill down into employees"
            loading={loading}
            empty={chartsData.costByDept.length === 0}
          >
            <ReportBarChart
              data={chartsData.costByDept}
              dataKeys={[{ key: "cost", name: "Total Payroll Cost" }]}
              horizontal
              onBarClick={(pt) => {
                const match = normalizedRows.find((r) => r.departmentName === pt.label);
                if (match) void handleOpenDeptDrillDown(match);
              }}
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Department Cost Contribution"
            subtitle="Share of total organizational payroll cost"
            loading={loading}
            empty={chartsData.contribution.length === 0}
          >
            <ReportDonutChart data={chartsData.contribution} />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Department-wise Average Salary"
            subtitle="Mean monthly gross compensation per employee"
            loading={loading}
            empty={chartsData.avgSalByDept.length === 0}
          >
            <ReportBarChart
              data={chartsData.avgSalByDept}
              dataKeys={[{ key: "avgSalary", name: "Avg Salary" }]}
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Department Headcount vs Payroll Cost"
            subtitle="Employee count alongside cost in ₹ Lakhs"
            loading={loading}
            empty={chartsData.headcountVsCost.length === 0}
          >
            <ReportBarChart
              data={chartsData.headcountVsCost}
              dataKeys={[
                { key: "headcount", name: "Employees" },
                { key: "costLakhs", name: "Cost (₹ Lakhs)" },
              ]}
              formatType="number"
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Department Payroll Trend"
            subtitle="Previous vs current period cost comparison"
            loading={loading}
            empty={chartsData.trend.length === 0}
          >
            <ReportLineChart
              data={chartsData.trend}
              dataKeys={[
                { key: "previous", name: "Previous Period" },
                { key: "current", name: "Current Period" },
              ]}
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Department Earnings & Deductions"
            subtitle="Stacked breakdown of Gross, Deductions, and Employer Contributions"
            loading={loading}
            empty={chartsData.earningsAndDed.length === 0}
          >
            <ReportBarChart
              data={chartsData.earningsAndDed}
              dataKeys={[
                { key: "gross", name: "Gross Payroll" },
                { key: "deductions", name: "Deductions" },
                { key: "employerContrib", name: "Employer Contrib." },
              ]}
              stacked
            />
          </ReportChartWrapper>
        </ChartsGrid>

        {/* Section E: Department Summary Table */}
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
          searchPlaceholder="Search department..."
          onRowClick={(row) => void handleOpenDeptDrillDown(row as RawRow)}
          emptyMessage="No Department Payroll Records Available"
        />

        {/* Section F: Department Drill-Down Panel */}
        {selectedDeptRow && (
          <GlassCard className="space-y-5 border-primary/30 p-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 className="font-display text-lg font-bold text-foreground">
                  {String(selectedDeptRow.departmentName)} — Department Drill-Down
                </h2>
                <p className="text-xs text-muted-foreground">
                  Department Head: {String(selectedDeptRow.departmentHead || "—")} •{" "}
                  {formatCount(Number(selectedDeptRow.employeeCount ?? 0))} Employees
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDeptRow(null)}
                aria-label="Close department drill-down"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <KpiCardsGrid columns={4}>
              <AnalyticsKpiCard
                label="Dept Employees"
                value={formatCount(Number(selectedDeptRow.employeeCount ?? 0))}
                accent="brand"
              />
              <AnalyticsKpiCard
                label="Dept Gross Payroll"
                value={formatOptionalINR(selectedDeptRow.grossPayroll as number)}
                accent="success"
              />
              <AnalyticsKpiCard
                label="Dept Net Payroll"
                value={formatOptionalINR(selectedDeptRow.netPayroll as number)}
                accent="brand"
              />
              <AnalyticsKpiCard
                label="Dept Average Salary"
                value={formatOptionalINR(selectedDeptRow.averageSalary as number)}
                accent="warning"
              />
            </KpiCardsGrid>

            {deptDesignations.length > 0 && (
              <ReportChartWrapper title="Designation-wise Net Payroll" loading={deptLoading}>
                <ReportBarChart
                  data={deptDesignations}
                  dataKeys={[{ key: "netPayroll", name: "Net Payroll" }]}
                  height={220}
                />
              </ReportChartWrapper>
            )}

            <ReportDataTable
              columns={[
                { key: "employeeCode", label: "Emp Code" },
                { key: "employeeName", label: "Employee Name" },
                { key: "designation", label: "Designation" },
                { key: "grossEarnings", label: "Gross", align: "right", isCurrency: true },
                { key: "totalDeductions", label: "Deductions", align: "right", isCurrency: true },
                { key: "netPay", label: "Net Salary", align: "right", isCurrency: true },
              ]}
              rows={deptEmployees}
              totalRecords={deptEmployees.length}
              loading={deptLoading}
              enableColumnConfig={false}
              onRowClick={(empRow) =>
                void openEmployeeDetail(empRow, {
                  runId: filters.runId,
                  periodLabel: data?.periodLabel || `FY ${filters.financialYear}`,
                })
              }
              emptyMessage="No employee-level breakdown returned for this department"
            />
          </GlassCard>
        )}

        <ReportTotalsReconciliationCard summary={reconciliationSummary} />

        <EmployeeDetailDrawer
          open={empDrawerOpen}
          onClose={closeEmployeeDetail}
          employee={empDetail}
          loading={empDrawerLoading}
          error={empDrawerError}
        />
      </ReportPageLayout>
    </ReportAccessGuard>
  );
}

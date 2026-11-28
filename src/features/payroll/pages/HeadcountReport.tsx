/**
 * Report 07 — Headcount Report
 * Route: /dashboard/payroll/reports/headcount
 *
 * Historical workforce & payroll reconciliation using period snapshots,
 * 9 KPIs, 7 charts, department & employee drill-down, and Opening + Joiners - Exits == Closing check.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Coins,
  Eye,
  UserCheck,
  UserMinus,
  UserPlus,
  UserX,
  Users,
  X,
} from "lucide-react";
import { GlassCard } from "@/components/hrms/Shared";
import { Button } from "@/components/ui/button";
import { formatCount, formatOptionalINR } from "@/lib/format";
import { reportsApi } from "../api/reportsApi";
import {
  pickMoneyRupees,
  pickNum,
  pickStr,
  reportAnalyticsApi,
} from "../api/reportAnalyticsApi";
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

export default function HeadcountReport() {
  const registry = REPORT_REGISTRY.headcount_report;
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
    "headcount_report",
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
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [deptEmployees, setDeptEmployees] = useState<RawRow[]>([]);
  const [deptLoading, setDeptLoading] = useState(false);
  const [supplementalHeadcount, setSupplementalHeadcount] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    void reportAnalyticsApi
      .getSupplementalAnalytics("headcount", { department: filters.department })
      .then(setSupplementalHeadcount)
      .catch(() => setSupplementalHeadcount([]));
  }, [filters.department]);

  const rows = useMemo(() => (Array.isArray(data?.rows) ? data.rows : []), [data?.rows]);
  const totals = useMemo(() => (data?.summaryTotals || {}) as RawRow, [data?.summaryTotals]);

  const normalizedRows = useMemo(
    () =>
      rows.map((r) => {
        const row = r as RawRow;
        const openingCount = pickNum(row, "openingCount", "opening_count", "openingHeadcount") ?? 0;
        const joinersCount = pickNum(row, "joinersCount", "joiners_count", "newJoiners", "new_joiners") ?? 0;
        const exitsCount = pickNum(row, "exitsCount", "exits_count", "exits") ?? 0;
        const closingCount =
          pickNum(row, "closingCount", "closing_count", "closingHeadcount") ??
          openingCount + joinersCount - exitsCount;
        const activeEmployees = pickNum(row, "activeEmployees", "active_employees") ?? closingCount;
        const eligibleEmployees =
          pickNum(row, "payrollEligibleEmployees", "payroll_eligible_employees", "eligible") ??
          activeEmployees;
        const processed =
          pickNum(row, "processedInPayroll", "processed_in_payroll", "employeesProcessed") ?? 0;
        const excluded =
          pickNum(row, "employeesExcluded", "employees_excluded") ??
          Math.max(0, eligibleEmployees - processed);
        const onHold = pickNum(row, "employeesOnHold", "employees_on_hold") ?? 0;
        const totalCost = pickMoneyRupees(row, ["totalPayrollCost", "total_payroll_cost", "totalCost"]) ?? 0;
        const averageSalary =
          pickMoneyRupees(row, ["averageSalary", "average_salary"]) ??
          (processed > 0 ? totalCost / processed : null);

        return {
          ...row,
          department: pickStr(row, "department", "departmentName", "department_name") ?? "—",
          openingCount,
          joinersCount,
          exitsCount,
          closingCount,
          activeEmployees,
          payrollEligibleEmployees: eligibleEmployees,
          processedInPayroll: processed,
          employeesExcluded: excluded,
          employeesOnHold: onHold,
          averageSalary,
          totalPayrollCost: totalCost,
        };
      }),
    [rows]
  );

  // 9 KPIs
  const kpis = useMemo(() => {
    const sumCol = (fn: (r: (typeof normalizedRows)[0]) => number) =>
      normalizedRows.length > 0 ? normalizedRows.reduce((a, r) => a + fn(r), 0) : null;

    const opening = pickNum(totals, "openingHeadcount", "opening_headcount") ?? sumCol((r) => r.openingCount);
    const closing = pickNum(totals, "closingHeadcount", "closing_headcount") ?? sumCol((r) => r.closingCount);
    const active = pickNum(totals, "activeEmployees", "active_employees") ?? sumCol((r) => r.activeEmployees);
    const joiners = pickNum(totals, "newJoiners", "new_joiners") ?? sumCol((r) => r.joinersCount);
    const exits = pickNum(totals, "employeeExits", "employee_exits", "exits") ?? sumCol((r) => r.exitsCount);
    const processed = pickNum(totals, "employeesProcessed", "employees_processed") ?? sumCol((r) => r.processedInPayroll);
    const excluded = pickNum(totals, "employeesExcluded", "employees_excluded") ?? sumCol((r) => r.employeesExcluded);
    const onHold = pickNum(totals, "employeesOnHold", "employees_on_hold") ?? sumCol((r) => r.employeesOnHold);
    const totalCost =
      pickMoneyRupees(totals, ["totalPayrollCost", "total_payroll_cost"]) ??
      sumCol((r) => r.totalPayrollCost);
    const avgCost =
      pickMoneyRupees(totals, ["averagePayrollCostPerEmployee", "average_payroll_cost_per_employee"]) ??
      (totalCost !== null && processed && processed > 0 ? totalCost / processed : null);

    return { opening, closing, active, joiners, exits, processed, excluded, onHold, avgCost };
  }, [totals, normalizedRows]);

  // 7 Charts
  const chartsData = useMemo(() => {
    const backendCharts = Array.isArray(data?.charts) ? data.charts : [];
    const findChart = (id: string) =>
      backendCharts.find((c) => c.chartId === id || c.id === id)?.data as ChartDataPoint[] | undefined;

    const monthlyTrend: ChartDataPoint[] =
      findChart("monthly_headcount_trend") ||
      supplementalHeadcount.map((s) => ({
        label: String(s.label),
        headcount: Number(s.headcount ?? s.n ?? 0),
      }));

    const joinersVsExits: ChartDataPoint[] =
      findChart("joiners_vs_exits") ||
      normalizedRows.map((r) => ({
        label: r.department,
        joiners: r.joinersCount,
        exits: r.exitsCount,
      }));

    const deptHeadcount: ChartDataPoint[] =
      findChart("department_headcount") ||
      normalizedRows.map((r) => ({
        label: r.department,
        closing: r.closingCount,
        processed: r.processedInPayroll,
      }));

    const employmentTypeDist: ChartDataPoint[] = findChart("employment_type_distribution") || [];
    const designationHeadcount: ChartDataPoint[] = findChart("designation_headcount") || [];
    const locationHeadcount: ChartDataPoint[] = findChart("location_headcount") || [];

    const headcountVsCost: ChartDataPoint[] =
      findChart("headcount_vs_cost") ||
      normalizedRows.map((r) => ({
        label: r.department,
        headcount: r.processedInPayroll,
        costLakhs: Math.round((r.totalPayrollCost / 100000) * 100) / 100,
      }));

    return {
      monthlyTrend,
      joinersVsExits,
      deptHeadcount,
      employmentTypeDist,
      designationHeadcount,
      headcountVsCost,
      locationHeadcount,
    };
  }, [data?.charts, supplementalHeadcount, normalizedRows]);

  const handleOpenDeptDrillDown = useCallback(
    async (deptName: string) => {
      setSelectedDept(deptName);
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

  const columns: DataTableColumn[] = useMemo(
    () => [
      { key: "department", label: "Department", sortable: true },
      { key: "openingCount", label: "Opening", align: "right", sortable: true },
      { key: "joinersCount", label: "New Joiners", align: "right" },
      { key: "exitsCount", label: "Exits", align: "right" },
      { key: "closingCount", label: "Closing", align: "right", sortable: true },
      { key: "activeEmployees", label: "Active", align: "right" },
      { key: "payrollEligibleEmployees", label: "Payroll Eligible", align: "right" },
      { key: "processedInPayroll", label: "Processed", align: "right", sortable: true },
      { key: "employeesExcluded", label: "Excluded", align: "right" },
      { key: "employeesOnHold", label: "On Hold", align: "right" },
      { key: "averageSalary", label: "Avg Salary", align: "right", isCurrency: true },
      { key: "totalPayrollCost", label: "Total Payroll Cost", align: "right", isCurrency: true, sortable: true },
      {
        key: "__view",
        label: "Employees",
        align: "center",
        render: (_v, row) => (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              void handleOpenDeptDrillDown(String((row as RawRow).department || ""));
            }}
            className="h-7 gap-1 px-2 text-xs text-primary"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>View</span>
          </Button>
        ),
      },
    ],
    [handleOpenDeptDrillDown]
  );

  const reconciliationSummary: ReportReconciliationSummary | null = useMemo(() => {
    if (kpis.opening === null || kpis.closing === null) return null;
    const expectedClosing = kpis.opening + (kpis.joiners ?? 0) - (kpis.exits ?? 0);
    const isBalanced = expectedClosing === kpis.closing;
    return {
      title: "Historical Headcount Snapshot Reconciliation",
      isBalanced,
      items: [
        { label: "Opening Headcount", value: formatCount(kpis.opening) },
        { label: "New Joiners (+)", value: formatCount(kpis.joiners ?? 0), tone: "success" },
        { label: "Exits (−)", value: formatCount(kpis.exits ?? 0), tone: "danger" },
        { label: "Closing Headcount", value: formatCount(kpis.closing), tone: "default" },
      ],
      discrepancyMessage: isBalanced
        ? null
        : `Opening (${kpis.opening}) + Joiners (${kpis.joiners ?? 0}) - Exits (${kpis.exits ?? 0}) = ${expectedClosing}, vs Closing ${kpis.closing}. Check department transfers.`,
    };
  }, [kpis]);

  return (
    <ReportAccessGuard requiredPermission="payroll.reports">
      <ReportPageLayout
        title={registry.title}
        description={registry.description}
        periodLabel={data?.periodLabel || `Snapshot • FY ${filters.financialYear}`}
        lastUpdated={lastRefreshedAt}
        companyName={companyProfile.name}
        companyLogoUrl={companyProfile.logoUrl}
        appliedFilters={filters}
        summaryTotals={reconciliationSummary?.items.map((i) => ({ label: i.label, value: i.value })) ?? []}
        actions={
          <ExportActions
            onExport={(fmt) => void exportReport("headcount_report", fmt, filters)}
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

        {backendUnavailable && <BackendUnavailableBanner reportKey="headcount_report" />}

        <DrillDownBreadcrumbBar
          selections={
            selectedDept ? [{ key: "dept", label: "Department", value: selectedDept }] : []
          }
          onRemove={() => setSelectedDept(null)}
          onClearAll={() => setSelectedDept(null)}
        />

        {/* Section C: 9 KPI Cards */}
        <KpiCardsGrid columns={3}>
          <AnalyticsKpiCard label="Opening Headcount" value={kpis.opening !== null ? formatCount(kpis.opening) : "—"} icon={Users} accent="muted" loading={loading} />
          <AnalyticsKpiCard label="Closing Headcount" value={kpis.closing !== null ? formatCount(kpis.closing) : "—"} icon={Users} accent="brand" loading={loading} />
          <AnalyticsKpiCard label="Active Employees" value={kpis.active !== null ? formatCount(kpis.active) : "—"} icon={UserCheck} accent="success" loading={loading} />
          <AnalyticsKpiCard label="New Joiners" value={kpis.joiners !== null ? formatCount(kpis.joiners) : "—"} icon={UserPlus} accent="success" loading={loading} />
          <AnalyticsKpiCard label="Employee Exits" value={kpis.exits !== null ? formatCount(kpis.exits) : "—"} icon={UserMinus} accent="danger" loading={loading} />
          <AnalyticsKpiCard label="Processed in Payroll" value={kpis.processed !== null ? formatCount(kpis.processed) : "—"} icon={UserCheck} accent="brand" loading={loading} />
          <AnalyticsKpiCard label="Excluded from Payroll" value={kpis.excluded !== null ? formatCount(kpis.excluded) : "—"} icon={UserX} accent="warning" loading={loading} />
          <AnalyticsKpiCard label="Employees on Hold" value={kpis.onHold !== null ? formatCount(kpis.onHold) : "—"} icon={UserX} accent="danger" loading={loading} />
          <AnalyticsKpiCard label="Avg Payroll Cost / Employee" value={formatOptionalINR(kpis.avgCost)} icon={Coins} accent="brand" loading={loading} />
        </KpiCardsGrid>

        {/* Section D: 7 Charts */}
        <ChartsGrid>
          <ReportChartWrapper
            title="Monthly Headcount Trend"
            subtitle="Historical payroll snapshot headcount over time"
            loading={loading}
            empty={chartsData.monthlyTrend.length === 0}
          >
            <ReportLineChart
              data={chartsData.monthlyTrend}
              dataKeys={[{ key: "headcount", name: "Headcount" }]}
              formatType="number"
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="New Joiners vs Exits"
            subtitle="Workforce additions and attritions by department"
            loading={loading}
            empty={chartsData.joinersVsExits.length === 0}
          >
            <ReportBarChart
              data={chartsData.joinersVsExits}
              dataKeys={[
                { key: "joiners", name: "New Joiners" },
                { key: "exits", name: "Exits" },
              ]}
              formatType="number"
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Department-wise Headcount"
            subtitle="Click any department bar to view employees"
            loading={loading}
            empty={chartsData.deptHeadcount.length === 0}
          >
            <ReportBarChart
              data={chartsData.deptHeadcount}
              dataKeys={[
                { key: "closing", name: "Closing Headcount" },
                { key: "processed", name: "Paid in Payroll" },
              ]}
              formatType="number"
              horizontal
              onBarClick={(pt) => void handleOpenDeptDrillDown(pt.label)}
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Headcount vs Payroll Cost"
            subtitle="Processed headcount vs total payroll cost (₹ Lakhs)"
            loading={loading}
            empty={chartsData.headcountVsCost.length === 0}
          >
            <ReportBarChart
              data={chartsData.headcountVsCost}
              dataKeys={[
                { key: "headcount", name: "Processed Headcount" },
                { key: "costLakhs", name: "Cost (₹ Lakhs)" },
              ]}
              formatType="number"
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Employment Type Distribution"
            subtitle="Full-time, part-time, contract, and intern split"
            loading={loading}
            empty={chartsData.employmentTypeDist.length === 0}
          >
            <ReportDonutChart data={chartsData.employmentTypeDist} formatType="number" />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Designation-wise Headcount"
            subtitle="Workforce distribution across roles"
            loading={loading}
            empty={chartsData.designationHeadcount.length === 0}
          >
            <ReportBarChart
              data={chartsData.designationHeadcount}
              dataKeys={[{ key: "count", name: "Headcount" }]}
              formatType="number"
            />
          </ReportChartWrapper>
        </ChartsGrid>

        <ReportChartWrapper
          title="Location-wise Headcount"
          subtitle="Employees across work locations and branches"
          loading={loading}
          empty={chartsData.locationHeadcount.length === 0}
        >
          <ReportBarChart
            data={chartsData.locationHeadcount}
            dataKeys={[{ key: "count", name: "Headcount" }]}
            formatType="number"
            height={230}
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
          searchPlaceholder="Search department..."
          onRowClick={(row) => void handleOpenDeptDrillDown(String((row as RawRow).department || ""))}
          emptyMessage="No Headcount Snapshot Available"
          emptyDescription="Historical employment and payroll snapshot counts appear here per period."
        />

        {selectedDept && (
          <GlassCard className="space-y-4 border-primary/30 p-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h2 className="font-display text-base font-bold text-foreground">
                  {selectedDept} — Paid & Active Employees
                </h2>
                <p className="text-xs text-muted-foreground">
                  Click any employee to inspect full payroll breakdown
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDept(null)}
                aria-label="Close drill-down"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ReportDataTable
              columns={[
                { key: "employeeCode", label: "Emp Code" },
                { key: "employeeName", label: "Employee Name" },
                { key: "designation", label: "Designation" },
                { key: "employmentType", label: "Type" },
                { key: "payrollStatus", label: "Payroll Status" },
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
              emptyMessage="No employee snapshot records returned for this department"
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

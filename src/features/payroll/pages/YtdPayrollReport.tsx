/**
 * Report 08 — YTD Payroll Summary
 * Route: /dashboard/payroll/reports/ytd-summary
 *
 * Indian Financial Year (April 1 – March 31) cumulative payroll summary
 * with cutoff date filtering, Employee/Department/Company view switcher,
 * 10 KPI cards, 6 charts, and statutory reconciliation.
 */

import { useMemo, useState } from "react";
import {
  Award,
  Banknote,
  Briefcase,
  Calculator,
  Coins,
  Eye,
  Landmark,
  Receipt,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCount, formatOptionalINR } from "@/lib/format";
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
type YtdScope = "employee" | "department" | "company";

export default function YtdPayrollReport() {
  const registry = REPORT_REGISTRY.ytd_payroll;
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
    "ytd_payroll",
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

  const [scopeView, setScopeView] = useState<YtdScope>("employee");
  const [tableSearch, setTableSearch] = useState(filters.search || "");

  const rows = useMemo(() => (Array.isArray(data?.rows) ? data.rows : []), [data?.rows]);
  const totals = useMemo(() => (data?.summaryTotals || {}) as RawRow, [data?.summaryTotals]);

  const normalizedEmployeeRows = useMemo(
    () =>
      rows.map((r) => {
        const row = r as RawRow;
        const ytdBasic = pickMoneyRupees(row, ["ytdBasicSalary", "ytd_basic_salary", "ytdBasic"]) ?? 0;
        const ytdAllowances = pickMoneyRupees(row, ["ytdAllowances", "ytd_allowances"]) ?? 0;
        const ytdGross = pickMoneyRupees(row, ["ytdGross", "ytd_gross", "ytdGrossEarnings"]) ?? 0;
        const ytdBonus = pickMoneyRupees(row, ["ytdBonus", "ytd_bonus", "ytdBonusIncentives"]) ?? 0;
        const ytdPf = pickMoneyRupees(row, ["ytdPf", "ytd_pf", "ytdEmployeePf"]) ?? 0;
        const ytdEsi = pickMoneyRupees(row, ["ytdEsi", "ytd_esi", "ytdEsiContributions"]) ?? 0;
        const ytdPt = pickMoneyRupees(row, ["ytdPt", "ytd_pt", "ytdProfessionalTax"]) ?? 0;
        const ytdTds = pickMoneyRupees(row, ["ytdTds", "ytd_tds"]) ?? 0;
        const ytdTotalDeductions =
          pickMoneyRupees(row, ["ytdTotalDeductions", "ytd_total_deductions"]) ??
          ytdPf + ytdEsi + ytdPt + ytdTds;
        const ytdNet = pickMoneyRupees(row, ["ytdNet", "ytd_net", "ytdNetSalary"]) ?? 0;
        const ytdEmployerContrib =
          pickMoneyRupees(row, ["ytdEmployerContributions", "ytd_employer_contributions", "ytdEmployerPf"]) ?? 0;
        const ytdTotalCost =
          pickMoneyRupees(row, ["ytdTotalEmployerCost", "ytd_total_employer_cost", "ytdTotalCost"]) ??
          ytdGross + ytdEmployerContrib;

        return {
          ...row,
          employeeCode: pickStr(row, "employeeCode", "employee_code") ?? "—",
          employeeName: pickStr(row, "employeeName", "employee_name", "name") ?? "—",
          department: pickStr(row, "department") ?? "—",
          monthsProcessed: pickNum(row, "monthsProcessed", "months_processed") ?? 0,
          ytdBasic,
          ytdAllowances,
          ytdGross,
          ytdBonus,
          ytdPf,
          ytdEsi,
          ytdPt,
          ytdTds,
          ytdTotalDeductions,
          ytdNet,
          ytdEmployerContributions: ytdEmployerContrib,
          ytdTotalEmployerCost: ytdTotalCost,
        };
      }),
    [rows]
  );

  // Department & Company aggregated views from employee rows
  const departmentAggRows = useMemo(() => {
    const map = new Map<string, RawRow>();
    for (const r of normalizedEmployeeRows) {
      const curr = (map.get(r.department) || {
        department: r.department,
        employeesCount: 0,
        ytdBasic: 0,
        ytdAllowances: 0,
        ytdGross: 0,
        ytdBonus: 0,
        ytdPf: 0,
        ytdEsi: 0,
        ytdPt: 0,
        ytdTds: 0,
        ytdTotalDeductions: 0,
        ytdNet: 0,
        ytdEmployerContributions: 0,
        ytdTotalEmployerCost: 0,
      }) as Record<string, number | string>;
      curr.employeesCount = Number(curr.employeesCount) + 1;
      curr.ytdBasic = Number(curr.ytdBasic) + r.ytdBasic;
      curr.ytdAllowances = Number(curr.ytdAllowances) + r.ytdAllowances;
      curr.ytdGross = Number(curr.ytdGross) + r.ytdGross;
      curr.ytdBonus = Number(curr.ytdBonus) + r.ytdBonus;
      curr.ytdPf = Number(curr.ytdPf) + r.ytdPf;
      curr.ytdEsi = Number(curr.ytdEsi) + r.ytdEsi;
      curr.ytdPt = Number(curr.ytdPt) + r.ytdPt;
      curr.ytdTds = Number(curr.ytdTds) + r.ytdTds;
      curr.ytdTotalDeductions = Number(curr.ytdTotalDeductions) + r.ytdTotalDeductions;
      curr.ytdNet = Number(curr.ytdNet) + r.ytdNet;
      curr.ytdEmployerContributions = Number(curr.ytdEmployerContributions) + r.ytdEmployerContributions;
      curr.ytdTotalEmployerCost = Number(curr.ytdTotalEmployerCost) + r.ytdTotalEmployerCost;
      map.set(r.department, curr);
    }
    return Array.from(map.values());
  }, [normalizedEmployeeRows]);

  // 10 KPIs
  const kpis = useMemo(() => {
    const gross =
      pickMoneyRupees(totals, ["ytdGross", "ytd_gross", "ytdGrossEarnings"]) ??
      sumRowField(normalizedEmployeeRows, ["ytdGross"]);
    const net =
      pickMoneyRupees(totals, ["ytdNet", "ytd_net", "ytdNetSalary"]) ??
      sumRowField(normalizedEmployeeRows, ["ytdNet"]);
    const deductions =
      pickMoneyRupees(totals, ["ytdTotalDeductions", "ytd_total_deductions"]) ??
      sumRowField(normalizedEmployeeRows, ["ytdTotalDeductions"]);
    const empPf =
      pickMoneyRupees(totals, ["ytdEmployeePf", "ytd_employee_pf", "ytdPf"]) ??
      sumRowField(normalizedEmployeeRows, ["ytdPf"]);
    const erPf =
      pickMoneyRupees(totals, ["ytdEmployerPf", "ytd_employer_pf"]) ??
      sumRowField(normalizedEmployeeRows, ["ytdEmployerContributions"]);
    const esi =
      pickMoneyRupees(totals, ["ytdEsi", "ytd_esi", "ytdEsiContributions"]) ??
      sumRowField(normalizedEmployeeRows, ["ytdEsi"]);
    const pt =
      pickMoneyRupees(totals, ["ytdPt", "ytd_pt", "ytdProfessionalTax"]) ??
      sumRowField(normalizedEmployeeRows, ["ytdPt"]);
    const tds =
      pickMoneyRupees(totals, ["ytdTds", "ytd_tds"]) ??
      sumRowField(normalizedEmployeeRows, ["ytdTds"]);
    const bonus =
      pickMoneyRupees(totals, ["ytdBonus", "ytd_bonus", "ytdBonusIncentives"]) ??
      sumRowField(normalizedEmployeeRows, ["ytdBonus"]);
    const employerCost =
      pickMoneyRupees(totals, ["ytdTotalEmployerCost", "ytd_total_employer_cost", "ytdEmployerPayrollCost"]) ??
      sumRowField(normalizedEmployeeRows, ["ytdTotalEmployerCost"]);

    return { gross, net, deductions, empPf, erPf, esi, pt, tds, bonus, employerCost };
  }, [totals, normalizedEmployeeRows]);

  // 6 Charts
  const chartsData = useMemo(() => {
    const backendCharts = Array.isArray(data?.charts) ? data.charts : [];
    const findChart = (id: string) =>
      backendCharts.find((c) => c.chartId === id || c.id === id)?.data as ChartDataPoint[] | undefined;

    const monthlyTrend: ChartDataPoint[] = findChart("month_wise_trend") || [];
    const cumulativeCost: ChartDataPoint[] = findChart("cumulative_payroll_cost") || [];
    const monthlyGrossVsNet: ChartDataPoint[] = findChart("monthly_gross_vs_net") || [];
    const fyComparison: ChartDataPoint[] = findChart("fy_comparison") || [];

    const statutoryBreakdown: ChartDataPoint[] =
      findChart("statutory_breakdown") ||
      [
        { label: "Employee PF", value: kpis.empPf ?? 0 },
        { label: "Employer PF", value: kpis.erPf ?? 0 },
        { label: "ESI", value: kpis.esi ?? 0 },
        { label: "Professional Tax", value: kpis.pt ?? 0 },
        { label: "TDS", value: kpis.tds ?? 0 },
      ].filter((d) => d.value > 0);

    const deptYtd: ChartDataPoint[] =
      findChart("ytd_department_payroll") ||
      departmentAggRows.map((d) => ({
        label: String(d.department),
        ytdGross: Number(d.ytdGross ?? 0),
      }));

    return {
      monthlyTrend,
      cumulativeCost,
      monthlyGrossVsNet,
      statutoryBreakdown,
      deptYtd,
      fyComparison,
    };
  }, [data?.charts, kpis, departmentAggRows]);

  const companyAggRows = useMemo(() => {
    if (normalizedEmployeeRows.length === 0 && kpis.gross === null) return [];
    return [
      {
        scope: `Company Total (${companyProfile.name})`,
        financialYear: `FY ${filters.financialYear}`,
        employeesCount: normalizedEmployeeRows.length,
        ytdGross: kpis.gross,
        ytdTotalDeductions: kpis.deductions,
        ytdNet: kpis.net,
        ytdPf: kpis.empPf,
        ytdEsi: kpis.esi,
        ytdPt: kpis.pt,
        ytdTds: kpis.tds,
        ytdTotalEmployerCost: kpis.employerCost,
      },
    ];
  }, [normalizedEmployeeRows.length, kpis, companyProfile.name, filters.financialYear]);

  const employeeColumns: DataTableColumn[] = useMemo(
    () => [
      { key: "employeeCode", label: "Emp Code", sortable: true },
      { key: "employeeName", label: "Employee Name", sortable: true },
      { key: "department", label: "Department", sortable: true },
      { key: "monthsProcessed", label: "Months", align: "right", sortable: true },
      { key: "ytdBasic", label: "YTD Basic", align: "right", isCurrency: true },
      { key: "ytdAllowances", label: "YTD Allow.", align: "right", isCurrency: true, defaultHidden: true },
      { key: "ytdGross", label: "YTD Gross", align: "right", isCurrency: true, sortable: true },
      { key: "ytdBonus", label: "YTD Bonus", align: "right", isCurrency: true, defaultHidden: true },
      { key: "ytdPf", label: "YTD PF", align: "right", isCurrency: true },
      { key: "ytdEsi", label: "YTD ESI", align: "right", isCurrency: true, defaultHidden: true },
      { key: "ytdPt", label: "YTD PT", align: "right", isCurrency: true, defaultHidden: true },
      { key: "ytdTds", label: "YTD TDS", align: "right", isCurrency: true },
      { key: "ytdTotalDeductions", label: "YTD Deductions", align: "right", isCurrency: true },
      { key: "ytdNet", label: "YTD Net", align: "right", isCurrency: true, sortable: true },
      { key: "ytdEmployerContributions", label: "YTD Employer Contrib.", align: "right", isCurrency: true, defaultHidden: true },
      { key: "ytdTotalEmployerCost", label: "YTD Total Cost", align: "right", isCurrency: true },
      {
        key: "__view",
        label: "Details",
        align: "center",
        render: (_v, row) => (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              void openEmployeeDetail(row, {
                periodLabel: `FY ${filters.financialYear} YTD`,
              });
            }}
            className="h-7 gap-1 px-2 text-xs text-primary"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
        ),
      },
    ],
    [openEmployeeDetail, filters.financialYear]
  );

  const deptColumns: DataTableColumn[] = [
    { key: "department", label: "Department" },
    { key: "employeesCount", label: "Employees", align: "right" },
    { key: "ytdBasic", label: "YTD Basic", align: "right", isCurrency: true },
    { key: "ytdGross", label: "YTD Gross", align: "right", isCurrency: true },
    { key: "ytdTotalDeductions", label: "YTD Deductions", align: "right", isCurrency: true },
    { key: "ytdNet", label: "YTD Net", align: "right", isCurrency: true },
    { key: "ytdTotalEmployerCost", label: "YTD Total Cost", align: "right", isCurrency: true },
  ];

  const companyColumns: DataTableColumn[] = [
    { key: "scope", label: "Entity Scope" },
    { key: "financialYear", label: "Indian FY (Apr 1 – Mar 31)" },
    { key: "employeesCount", label: "Employees", align: "right" },
    { key: "ytdGross", label: "YTD Gross", align: "right", isCurrency: true },
    { key: "ytdTotalDeductions", label: "YTD Deductions", align: "right", isCurrency: true },
    { key: "ytdNet", label: "YTD Net", align: "right", isCurrency: true },
    { key: "ytdTotalEmployerCost", label: "YTD Total Employer Cost", align: "right", isCurrency: true },
  ];

  const activeRows =
    scopeView === "employee"
      ? normalizedEmployeeRows
      : scopeView === "department"
        ? departmentAggRows
        : companyAggRows;

  const activeColumns =
    scopeView === "employee"
      ? employeeColumns
      : scopeView === "department"
        ? deptColumns
        : companyColumns;

  const reconciliationSummary: ReportReconciliationSummary | null = useMemo(() => {
    if (kpis.gross === null && kpis.net === null) return null;
    const gross = kpis.gross ?? 0;
    const ded = kpis.deductions ?? 0;
    const net = kpis.net ?? 0;
    const diff = Math.round((gross - ded - net) * 100) / 100;
    return {
      title: `Indian FY ${filters.financialYear} YTD Cumulative Reconciliation (Deduplicated)`,
      isBalanced: Math.abs(diff) < 0.05,
      items: [
        { label: "YTD Gross Earnings", value: formatOptionalINR(kpis.gross) },
        { label: "YTD Deductions", value: formatOptionalINR(kpis.deductions), tone: "danger" },
        { label: "YTD Net Salary", value: formatOptionalINR(kpis.net), tone: "success" },
        { label: "YTD Total Employer Cost", value: formatOptionalINR(kpis.employerCost) },
      ],
      discrepancyMessage:
        filters.cutoffDate
          ? `Calculated strictly through cutoff date ${filters.cutoffDate}; superseded/cancelled/reversed runs excluded.`
          : "Indian FY scope (April 1 – March 31); superseded, cancelled, and reversed runs excluded.",
    };
  }, [kpis, filters.financialYear, filters.cutoffDate]);

  return (
    <ReportAccessGuard requiredPermission="payroll.reports">
      <ReportPageLayout
        title={registry.title}
        description={registry.description}
        periodLabel={`Indian FY ${filters.financialYear}${filters.cutoffDate ? ` • Cutoff ${filters.cutoffDate}` : ""}`}
        lastUpdated={lastRefreshedAt}
        companyName={companyProfile.name}
        companyLogoUrl={companyProfile.logoUrl}
        appliedFilters={filters}
        summaryTotals={reconciliationSummary?.items.map((i) => ({ label: i.label, value: i.value })) ?? []}
        actions={
          <ExportActions
            onExport={(fmt) => void exportReport("ytd_payroll", fmt, filters)}
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

        {backendUnavailable && <BackendUnavailableBanner reportKey="ytd_payroll" />}

        <DrillDownBreadcrumbBar
          selections={[
            ...(filters.department
              ? [{ key: "department", label: "Department", value: filters.department }]
              : []),
            ...(filters.month
              ? [{ key: "month", label: "FY Month", value: String(filters.month) }]
              : []),
          ]}
          onRemove={(k) => setImmediateFilter({ [k]: undefined })}
          onClearAll={() => setImmediateFilter({ department: undefined, month: undefined })}
        />

        {/* Section C: 10 KPI Cards */}
        <KpiCardsGrid columns={5}>
          <AnalyticsKpiCard label="YTD Gross Earnings" value={formatOptionalINR(kpis.gross)} icon={TrendingUp} accent="brand" loading={loading} />
          <AnalyticsKpiCard label="YTD Net Salary" value={formatOptionalINR(kpis.net)} icon={Banknote} accent="success" loading={loading} />
          <AnalyticsKpiCard label="YTD Total Deductions" value={formatOptionalINR(kpis.deductions)} icon={TrendingDown} accent="danger" loading={loading} />
          <AnalyticsKpiCard label="YTD Employee PF" value={formatOptionalINR(kpis.empPf)} icon={ShieldCheck} accent="muted" loading={loading} />
          <AnalyticsKpiCard label="YTD Employer PF" value={formatOptionalINR(kpis.erPf)} icon={Briefcase} accent="muted" loading={loading} />
          <AnalyticsKpiCard label="YTD ESI Contributions" value={formatOptionalINR(kpis.esi)} icon={Receipt} accent="warning" loading={loading} />
          <AnalyticsKpiCard label="YTD Professional Tax" value={formatOptionalINR(kpis.pt)} icon={Landmark} accent="muted" loading={loading} />
          <AnalyticsKpiCard label="YTD TDS" value={formatOptionalINR(kpis.tds)} icon={Calculator} accent="danger" loading={loading} />
          <AnalyticsKpiCard label="YTD Bonus & Incentives" value={formatOptionalINR(kpis.bonus)} icon={Award} accent="success" loading={loading} />
          <AnalyticsKpiCard label="YTD Employer Cost" value={formatOptionalINR(kpis.employerCost)} icon={Coins} accent="brand" loading={loading} />
        </KpiCardsGrid>

        {/* Section D: 6 Charts */}
        <ChartsGrid>
          <ReportChartWrapper
            title="Month-wise Payroll Trend (Apr–Mar)"
            subtitle="Click a financial year month to filter monthly records"
            loading={loading}
            empty={chartsData.monthlyTrend.length === 0}
          >
            <ReportLineChart
              data={chartsData.monthlyTrend}
              dataKeys={[
                { key: "gross", name: "Gross Pay" },
                { key: "net", name: "Net Pay" },
              ]}
              onPointClick={(pt) => {
                if (typeof pt.month === "number") {
                  setImmediateFilter({ month: pt.month });
                }
              }}
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Cumulative Payroll Cost"
            subtitle="Running cumulative YTD cost across the financial year"
            loading={loading}
            empty={chartsData.cumulativeCost.length === 0}
          >
            <ReportLineChart
              data={chartsData.cumulativeCost}
              dataKeys={[{ key: "cumulative", name: "Cumulative Cost" }]}
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Monthly Gross vs Net Salary"
            subtitle="Monthly earnings and take-home comparison"
            loading={loading}
            empty={chartsData.monthlyGrossVsNet.length === 0}
          >
            <ReportBarChart
              data={chartsData.monthlyGrossVsNet}
              dataKeys={[
                { key: "gross", name: "Gross" },
                { key: "net", name: "Net" },
              ]}
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="YTD Statutory Contribution Breakdown"
            subtitle="Employee PF, Employer PF, ESI, PT, and TDS share"
            loading={loading}
            empty={chartsData.statutoryBreakdown.length === 0}
          >
            <ReportDonutChart data={chartsData.statutoryBreakdown} />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="YTD Department-wise Payroll"
            subtitle="Click a department bar to filter YTD employee ledger"
            loading={loading}
            empty={chartsData.deptYtd.length === 0}
          >
            <ReportBarChart
              data={chartsData.deptYtd}
              dataKeys={[{ key: "ytdGross", name: "YTD Gross" }]}
              horizontal
              onBarClick={(pt) =>
                setImmediateFilter({
                  department: filters.department === pt.label ? undefined : pt.label,
                })
              }
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Current vs Previous Financial Year"
            subtitle="Year-over-year YTD comparison"
            loading={loading}
            empty={chartsData.fyComparison.length === 0}
          >
            <ReportBarChart
              data={chartsData.fyComparison}
              dataKeys={[
                { key: "previousFy", name: "Previous FY" },
                { key: "currentFy", name: "Current FY" },
              ]}
            />
          </ReportChartWrapper>
        </ChartsGrid>

        {/* Employee / Department / Company Switcher */}
        <div className="flex items-center justify-between gap-2 print:hidden">
          <Tabs value={scopeView} onValueChange={(v) => setScopeView(v as YtdScope)}>
            <TabsList>
              <TabsTrigger value="employee">Employee-wise</TabsTrigger>
              <TabsTrigger value="department">Department-wise</TabsTrigger>
              <TabsTrigger value="company">Company-wide</TabsTrigger>
            </TabsList>
          </Tabs>
          <span className="text-xs text-muted-foreground">
            {formatCount(activeRows.length)} row{activeRows.length === 1 ? "" : "s"} in{" "}
            {scopeView} view
          </span>
        </div>

        {/* Section E: Table */}
        <ReportDataTable
          columns={activeColumns}
          rows={activeRows}
          totalRecords={
            scopeView === "employee"
              ? data?.totalRecords ?? normalizedEmployeeRows.length
              : activeRows.length
          }
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
          searchPlaceholder="Search employee or department..."
          onRowClick={
            scopeView === "employee"
              ? (row) =>
                  void openEmployeeDetail(row, {
                    periodLabel: `FY ${filters.financialYear} YTD`,
                  })
              : undefined
          }
          emptyMessage="No YTD Payroll Records Available"
          emptyDescription="YTD summaries populate once payroll runs are processed in the selected Indian Financial Year."
        />

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

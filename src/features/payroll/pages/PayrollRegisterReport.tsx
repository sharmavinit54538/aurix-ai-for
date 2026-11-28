/**
 * Report 01 — Payroll Register
 * Route: /dashboard/payroll/reports/payroll-register
 *
 * Complete employee-level salary calculation ledger with 8 KPI cards,
 * 5 interactive analytics charts, configurable 27-column register table,
 * employee calculation breakdown drawer, and totals reconciliation.
 */

import { useMemo, useState } from "react";
import {
  Briefcase,
  DollarSign,
  Eye,
  TrendingDown,
  TrendingUp,
  UserX,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCount, formatINR, formatOptionalINR } from "@/lib/format";
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

export default function PayrollRegisterReport() {
  const registry = REPORT_REGISTRY.payroll_register;
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
    "payroll_register",
    filters
  );
  const { exporting, exportFormat, exportReport } = useReportExport();
  const {
    open: drawerOpen,
    detail: employeeDetail,
    loading: drawerLoading,
    error: drawerError,
    openEmployeeDetail,
    closeEmployeeDetail,
  } = useEmployeeDetail();

  const [tableSearch, setTableSearch] = useState(filters.search || "");

  const rows = useMemo(() => (Array.isArray(data?.rows) ? data.rows : []), [data?.rows]);
  const totals = useMemo(() => (data?.summaryTotals || {}) as RawRow, [data?.summaryTotals]);

  // Authoritative KPI Calculations (summaryTotals first, then real row summation — never hardcoded)
  const kpis = useMemo(() => {
    const processed =
      pickNum(totals, "totalEmployees", "total_employees", "employeesProcessed", "employees_processed") ??
      (data ? data.totalRecords : null);
    const gross =
      pickMoneyRupees(totals, ["totalGross", "total_gross", "grossPayroll", "gross_payroll"], ["totalGrossPaise", "total_gross_paise"]) ??
      sumRowField(rows, ["grossEarnings", "gross_earnings"]);
    const earnings =
      pickMoneyRupees(totals, ["totalEarnings", "total_earnings"], ["totalEarningsPaise", "total_earnings_paise"]) ??
      gross;
    const deductions =
      pickMoneyRupees(totals, ["totalDeductions", "total_deductions"], ["totalDeductionsPaise", "total_deductions_paise"]) ??
      sumRowField(rows, ["totalDeductions", "total_deductions"]);
    const net =
      pickMoneyRupees(totals, ["totalNet", "total_net", "netPayroll", "net_payroll"], ["totalNetPaise", "total_net_paise"]) ??
      sumRowField(rows, ["netSalary", "net_salary", "netPay", "net_pay"]);
    const employerContrib =
      pickMoneyRupees(totals, ["employerContributions", "employer_contributions"], ["employerContributionsPaise", "employer_contributions_paise"]) ??
      sumRowField(rows, ["employerPfEsi", "employer_pf_esi", "employerContributions", "employer_contributions"]);
    const totalEmployerCost =
      pickMoneyRupees(totals, ["totalEmployerCost", "total_employer_cost", "totalCost", "total_cost"], ["totalEmployerCostPaise", "total_employer_cost_paise"]) ??
      (gross !== null && employerContrib !== null ? gross + employerContrib : sumRowField(rows, ["totalEmployerCost", "total_employer_cost"]));
    const onHold =
      pickNum(totals, "employeesOnHold", "employees_on_hold", "onHoldCount", "on_hold_count") ??
      (rows.length > 0
        ? rows.filter((r) => String(r.payrollStatus ?? r.payroll_status ?? r.status ?? "").toLowerCase().includes("hold")).length
        : null);

    return {
      processed,
      gross,
      earnings,
      deductions,
      net,
      employerContrib,
      totalEmployerCost,
      onHold,
    };
  }, [totals, rows, data]);

  // Charts built strictly from backend `charts` or real `rows`
  const chartsData = useMemo(() => {
    const backendCharts = Array.isArray(data?.charts) ? data.charts : [];
    const findBackendChart = (id: string) =>
      backendCharts.find((c) => c.chartId === id || c.id === id)?.data as ChartDataPoint[] | undefined;

    // 1. Monthly Payroll Trend (from backend chart or grouped by payrollPeriod if multi-period rows)
    let monthlyTrend: ChartDataPoint[] = findBackendChart("monthly_trend") || [];
    if (!monthlyTrend.length && rows.length > 0) {
      const byPeriod = new Map<string, { gross: number; deductions: number; net: number }>();
      for (const r of rows) {
        const period = pickStr(r as RawRow, "payrollPeriod", "payroll_period", "periodName") || "Current";
        const curr = byPeriod.get(period) || { gross: 0, deductions: 0, net: 0 };
        curr.gross += pickMoneyRupees(r as RawRow, ["grossEarnings", "gross_earnings"]) ?? 0;
        curr.deductions += pickMoneyRupees(r as RawRow, ["totalDeductions", "total_deductions"]) ?? 0;
        curr.net += pickMoneyRupees(r as RawRow, ["netSalary", "net_salary", "netPay", "net_pay"]) ?? 0;
        byPeriod.set(period, curr);
      }
      monthlyTrend = Array.from(byPeriod.entries()).map(([label, v]) => ({ label, ...v }));
    }

    // 2. Earnings vs Deductions vs Net Pay (grouped bar by department or totals)
    let earningsVsDed: ChartDataPoint[] = findBackendChart("earnings_vs_deductions") || [];
    if (!earningsVsDed.length && rows.length > 0) {
      const byDept = new Map<string, { earnings: number; deductions: number; net: number }>();
      for (const r of rows) {
        const dept = pickStr(r as RawRow, "department") || "Unassigned";
        const curr = byDept.get(dept) || { earnings: 0, deductions: 0, net: 0 };
        curr.earnings += pickMoneyRupees(r as RawRow, ["grossEarnings", "gross_earnings"]) ?? 0;
        curr.deductions += pickMoneyRupees(r as RawRow, ["totalDeductions", "total_deductions"]) ?? 0;
        curr.net += pickMoneyRupees(r as RawRow, ["netSalary", "net_salary", "netPay", "net_pay"]) ?? 0;
        byDept.set(dept, curr);
      }
      earningsVsDed = Array.from(byDept.entries()).map(([label, v]) => ({ label, ...v }));
    }

    // 3. Earnings Composition Donut
    let earningsComp: ChartDataPoint[] = findBackendChart("earnings_composition") || [];
    if (!earningsComp.length && rows.length > 0) {
      const basic = sumRowField(rows, ["basicSalary", "basic_salary", "basicPay", "basic_pay"]) ?? 0;
      const hra = sumRowField(rows, ["hra"]) ?? 0;
      const allowances = sumRowField(rows, ["allowances", "specialAllowance", "special_allowance"]) ?? 0;
      const variable =
        (sumRowField(rows, ["overtime"]) ?? 0) +
        (sumRowField(rows, ["bonus"]) ?? 0) +
        (sumRowField(rows, ["incentives"]) ?? 0) +
        (sumRowField(rows, ["arrears"]) ?? 0);
      earningsComp = [
        { label: "Basic Salary", value: basic },
        { label: "HRA", value: hra },
        { label: "Allowances", value: allowances },
        { label: "Variable & Arrears", value: variable },
      ].filter((d) => d.value > 0);
    }

    // 4. Department Distribution Horizontal Bar
    let deptDist: ChartDataPoint[] = findBackendChart("department_distribution") || [];
    if (!deptDist.length && earningsVsDed.length > 0) {
      deptDist = earningsVsDed.map((d) => ({
        label: d.label,
        gross: Number(d.earnings ?? 0),
        filterValue: d.label,
      }));
    }

    // 5. Employee Salary Distribution Histogram (buckets from real net/gross values)
    let salaryHist: ChartDataPoint[] = findBackendChart("salary_histogram") || [];
    if (!salaryHist.length && rows.length > 0) {
      const buckets: Array<{ label: string; min: number; max: number; count: number }> = [
        { label: "< ₹25K", min: 0, max: 25000, count: 0 },
        { label: "₹25K–₹50K", min: 25000, max: 50000, count: 0 },
        { label: "₹50K–₹1L", min: 50000, max: 100000, count: 0 },
        { label: "₹1L–₹2L", min: 100000, max: 200000, count: 0 },
        { label: "> ₹2L", min: 200000, max: Number.POSITIVE_INFINITY, count: 0 },
      ];
      for (const r of rows) {
        const net = pickMoneyRupees(r as RawRow, ["netSalary", "net_salary", "netPay", "net_pay", "grossEarnings", "gross_earnings"]);
        if (net === null) continue;
        const b = buckets.find((x) => net >= x.min && net < x.max);
        if (b) b.count += 1;
      }
      if (buckets.some((b) => b.count > 0)) {
        salaryHist = buckets.map((b) => ({ label: b.label, employees: b.count }));
      }
    }

    return { monthlyTrend, earningsVsDed, earningsComp, deptDist, salaryHist };
  }, [data?.charts, rows]);

  // Detailed 27-field Register Table Columns (configurable via Columns button)
  const columns: DataTableColumn[] = useMemo(
    () => [
      { key: "employeeCode", label: "Emp Code", sortable: true },
      {
        key: "employeeName",
        label: "Employee Name",
        sortable: true,
        render: (val, row) => (
          <span className="font-medium text-primary hover:underline">
            {String(val ?? row.employee_name ?? "—")}
          </span>
        ),
      },
      { key: "department", label: "Department", sortable: true },
      { key: "designation", label: "Designation", sortable: true },
      {
        key: "employmentType",
        label: "Employment Type",
        render: (v) => (v ? String(v).replace(/_/g, " ") : "—"),
      },
      { key: "payrollPeriod", label: "Period", defaultHidden: false },
      { key: "workingDays", label: "Work Days", align: "right", defaultHidden: true },
      { key: "paidDays", label: "Paid Days", align: "right", defaultHidden: true },
      { key: "lwpDays", label: "LWP", align: "right", defaultHidden: true },
      { key: "basicPay", label: "Basic", align: "right", isCurrency: true, sortable: true },
      { key: "hra", label: "HRA", align: "right", isCurrency: true },
      { key: "allowances", label: "Allowances", align: "right", isCurrency: true },
      { key: "overtime", label: "Overtime", align: "right", isCurrency: true, defaultHidden: true },
      { key: "bonus", label: "Bonus", align: "right", isCurrency: true, defaultHidden: true },
      { key: "incentives", label: "Incentives", align: "right", isCurrency: true, defaultHidden: true },
      { key: "arrears", label: "Arrears", align: "right", isCurrency: true, defaultHidden: true },
      { key: "grossEarnings", label: "Gross Earnings", align: "right", isCurrency: true, sortable: true },
      { key: "pfDeduction", label: "Emp PF", align: "right", isCurrency: true },
      { key: "esiDeduction", label: "Emp ESI", align: "right", isCurrency: true, defaultHidden: true },
      { key: "ptDeduction", label: "Prof Tax", align: "right", isCurrency: true, defaultHidden: true },
      { key: "tdsDeduction", label: "TDS", align: "right", isCurrency: true },
      { key: "otherDeductions", label: "Other Ded.", align: "right", isCurrency: true, defaultHidden: true },
      { key: "totalDeductions", label: "Total Deductions", align: "right", isCurrency: true, sortable: true },
      { key: "netPay", label: "Net Salary", align: "right", isCurrency: true, sortable: true },
      { key: "employerPfEsi", label: "Employer PF & ESI", align: "right", isCurrency: true, defaultHidden: true },
      { key: "totalEmployerCost", label: "Total Employer Cost", align: "right", isCurrency: true, defaultHidden: true },
      {
        key: "payrollStatus",
        label: "Status",
        render: (val, row) => {
          const st = String(val ?? row.status ?? "—");
          const isHold = st.toLowerCase().includes("hold");
          return (
            <Badge
              variant="outline"
              className={
                isHold
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              }
            >
              {st}
            </Badge>
          );
        },
      },
      {
        key: "__actions",
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
                runId: filters.runId,
                periodLabel: data?.periodLabel || `FY ${filters.financialYear}`,
              });
            }}
            className="h-7 gap-1 px-2 text-xs text-primary"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>View</span>
          </Button>
        ),
      },
    ],
    [openEmployeeDetail, filters.runId, filters.financialYear, data?.periodLabel]
  );

  const normalizedRows = useMemo(
    () =>
      rows.map((r) => ({
        ...r,
        employeeCode: pickStr(r as RawRow, "employeeCode", "employee_code") ?? "—",
        employeeName: pickStr(r as RawRow, "employeeName", "employee_name", "name") ?? "—",
        department: pickStr(r as RawRow, "department") ?? "—",
        designation: pickStr(r as RawRow, "designation") ?? "—",
        employmentType: pickStr(r as RawRow, "employmentType", "employment_type") ?? "—",
        payrollPeriod: pickStr(r as RawRow, "payrollPeriod", "payroll_period", "periodName") ?? (data?.periodLabel || "—"),
        workingDays: pickNum(r as RawRow, "workingDays", "working_days"),
        paidDays: pickNum(r as RawRow, "paidDays", "paid_days"),
        lwpDays: pickNum(r as RawRow, "lwpDays", "lwp_days", "leaveWithoutPay", "leave_without_pay"),
        basicPay: pickMoneyRupees(r as RawRow, ["basicPay", "basic_pay", "basicSalary", "basic_salary"]),
        hra: pickMoneyRupees(r as RawRow, ["hra"]),
        allowances: pickMoneyRupees(r as RawRow, ["allowances", "specialAllowance", "special_allowance"]),
        overtime: pickMoneyRupees(r as RawRow, ["overtime"]),
        bonus: pickMoneyRupees(r as RawRow, ["bonus"]),
        incentives: pickMoneyRupees(r as RawRow, ["incentives"]),
        arrears: pickMoneyRupees(r as RawRow, ["arrears"]),
        grossEarnings: pickMoneyRupees(r as RawRow, ["grossEarnings", "gross_earnings"]),
        pfDeduction: pickMoneyRupees(r as RawRow, ["pfDeduction", "pf_deduction", "employeePf", "employee_pf"]),
        esiDeduction: pickMoneyRupees(r as RawRow, ["esiDeduction", "esi_deduction", "employeeEsi", "employee_esi"]),
        ptDeduction: pickMoneyRupees(r as RawRow, ["ptDeduction", "pt_deduction", "professionalTax", "professional_tax"]),
        tdsDeduction: pickMoneyRupees(r as RawRow, ["tdsDeduction", "tds_deduction", "tds"]),
        otherDeductions: pickMoneyRupees(r as RawRow, ["otherDeductions", "other_deductions"]),
        totalDeductions: pickMoneyRupees(r as RawRow, ["totalDeductions", "total_deductions"]),
        netPay: pickMoneyRupees(r as RawRow, ["netPay", "net_pay", "netSalary", "net_salary"]),
        employerPfEsi: pickMoneyRupees(r as RawRow, ["employerPfEsi", "employer_pf_esi", "employerContributions", "employer_contributions"]),
        totalEmployerCost: pickMoneyRupees(r as RawRow, ["totalEmployerCost", "total_employer_cost"]),
        payrollStatus: pickStr(r as RawRow, "payrollStatus", "payroll_status", "status") ?? "—",
      })),
    [rows, data?.periodLabel]
  );

  // Reconciliation check: Gross - Deductions == Net Pay
  const reconciliationSummary: ReportReconciliationSummary | null = useMemo(() => {
    if (kpis.gross === null && kpis.net === null) return null;
    const gross = kpis.gross ?? 0;
    const ded = kpis.deductions ?? 0;
    const net = kpis.net ?? 0;
    const diff = Math.round((gross - ded - net) * 100) / 100;
    const isBalanced = Math.abs(diff) < 0.05;
    return {
      title: "Payroll Register Totals & Reconciliation",
      isBalanced,
      items: [
        { label: "Total Gross Payroll", value: formatOptionalINR(kpis.gross) },
        { label: "Total Deductions", value: formatOptionalINR(kpis.deductions), tone: "danger" },
        { label: "Total Net Payroll", value: formatOptionalINR(kpis.net), tone: "success" },
        { label: "Total Employer Cost", value: formatOptionalINR(kpis.totalEmployerCost) },
      ],
      discrepancyMessage: isBalanced
        ? null
        : `Gross minus Deductions differs from Net Payroll by ${formatINR(diff)}. Review hold or rounding adjustments.`,
    };
  }, [kpis]);

  const drillDownSelections = useMemo(() => {
    const list: Array<{ key: string; label: string; value: string }> = [];
    if (filters.department) list.push({ key: "department", label: "Department", value: filters.department });
    if (filters.payrollStatus) list.push({ key: "payrollStatus", label: "Status", value: filters.payrollStatus });
    return list;
  }, [filters.department, filters.payrollStatus]);

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
        summaryTotals={
          reconciliationSummary?.items.map((i) => ({ label: i.label, value: i.value })) ?? []
        }
        actions={
          <ExportActions
            onExport={(fmt) => void exportReport("payroll_register", fmt, filters)}
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

        {backendUnavailable && <BackendUnavailableBanner reportKey="payroll_register" />}

        <DrillDownBreadcrumbBar
          selections={drillDownSelections}
          onRemove={(k) => setImmediateFilter({ [k]: undefined })}
          onClearAll={() => setImmediateFilter({ department: undefined, payrollStatus: undefined })}
        />

        {/* Section C: 8 KPI Summary Cards */}
        <KpiCardsGrid columns={4}>
          <AnalyticsKpiCard
            label="Total Employees Processed"
            value={kpis.processed !== null ? formatCount(kpis.processed) : "—"}
            icon={Users}
            accent="brand"
            loading={loading}
            error={error && !backendUnavailable ? error : null}
          />
          <AnalyticsKpiCard
            label="Total Gross Payroll"
            value={formatOptionalINR(kpis.gross)}
            icon={DollarSign}
            accent="success"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Total Earnings"
            value={formatOptionalINR(kpis.earnings)}
            icon={TrendingUp}
            accent="success"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Total Deductions"
            value={formatOptionalINR(kpis.deductions)}
            icon={TrendingDown}
            accent="danger"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Total Net Payroll"
            value={formatOptionalINR(kpis.net)}
            icon={DollarSign}
            accent="brand"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Employer Contributions"
            value={formatOptionalINR(kpis.employerContrib)}
            icon={Briefcase}
            accent="warning"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Total Employer Payroll Cost"
            value={formatOptionalINR(kpis.totalEmployerCost)}
            icon={DollarSign}
            accent="muted"
            loading={loading}
          />
          <AnalyticsKpiCard
            label="Employees on Hold"
            value={kpis.onHold !== null ? formatCount(kpis.onHold) : "—"}
            icon={UserX}
            accent="danger"
            active={filters.payrollStatus === "On Hold"}
            onClick={() =>
              setImmediateFilter({
                payrollStatus: filters.payrollStatus === "On Hold" ? undefined : "On Hold",
              })
            }
            loading={loading}
          />
        </KpiCardsGrid>

        {/* Section D: 5 Report-Specific Analytics Charts */}
        <ChartsGrid>
          <ReportChartWrapper
            title="Monthly Payroll Trend"
            subtitle="Gross earnings, deductions, and net disbursement trend"
            loading={loading}
            empty={chartsData.monthlyTrend.length === 0}
          >
            <ReportLineChart
              data={chartsData.monthlyTrend}
              dataKeys={[
                { key: "gross", name: "Gross Pay" },
                { key: "net", name: "Net Pay" },
                { key: "deductions", name: "Deductions" },
              ]}
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Earnings vs Deductions vs Net Pay"
            subtitle="Grouped comparison across departments"
            loading={loading}
            empty={chartsData.earningsVsDed.length === 0}
          >
            <ReportBarChart
              data={chartsData.earningsVsDed}
              dataKeys={[
                { key: "earnings", name: "Gross Earnings" },
                { key: "deductions", name: "Deductions" },
                { key: "net", name: "Net Pay" },
              ]}
              onBarClick={(pt) =>
                setImmediateFilter({
                  department: filters.department === pt.label ? undefined : pt.label,
                })
              }
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Earnings Composition"
            subtitle="Share of Basic, HRA, Allowances, and Variable components"
            loading={loading}
            empty={chartsData.earningsComp.length === 0}
          >
            <ReportDonutChart data={chartsData.earningsComp} />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Department-wise Payroll Distribution"
            subtitle="Click a bar to filter table records by department"
            loading={loading}
            empty={chartsData.deptDist.length === 0}
          >
            <ReportBarChart
              data={chartsData.deptDist}
              dataKeys={[{ key: "gross", name: "Gross Payroll" }]}
              horizontal
              onBarClick={(pt) =>
                setImmediateFilter({
                  department: filters.department === pt.label ? undefined : pt.label,
                })
              }
            />
          </ReportChartWrapper>
        </ChartsGrid>

        <ReportChartWrapper
          title="Employee Salary Distribution"
          subtitle="Employee headcount distributed across monthly salary brackets"
          loading={loading}
          empty={chartsData.salaryHist.length === 0}
        >
          <ReportBarChart
            data={chartsData.salaryHist}
            dataKeys={[{ key: "employees", name: "Employees" }]}
            formatType="number"
            height={240}
          />
        </ReportChartWrapper>

        {/* Section E: Detailed Payroll Register Table */}
        <ReportDataTable
          columns={columns}
          rows={normalizedRows}
          totalRecords={data?.totalRecords ?? 0}
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
          searchPlaceholder="Search employee name / code..."
          onRowClick={(row) =>
            void openEmployeeDetail(row, {
              runId: filters.runId,
              periodLabel: data?.periodLabel || `FY ${filters.financialYear}`,
            })
          }
          emptyMessage="No Payroll Register Records Available"
          emptyDescription="Select a finalized or processed payroll period to view employee salary registers."
        />

        {/* Section G: Totals & Reconciliation */}
        <ReportTotalsReconciliationCard summary={reconciliationSummary} />

        {/* Section F: Employee Calculation Breakdown Drawer */}
        <EmployeeDetailDrawer
          open={drawerOpen}
          onClose={closeEmployeeDetail}
          employee={employeeDetail}
          loading={drawerLoading}
          error={drawerError}
        />
      </ReportPageLayout>
    </ReportAccessGuard>
  );
}

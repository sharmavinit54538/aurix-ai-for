/**
 * Report 02 — Salary Statement
 * Route: /dashboard/payroll/reports/salary-statement
 *
 * Official salary statement showing fixed vs variable pay, earnings/deduction
 * component breakdowns, multi-month salary comparison toggle, detail drawer,
 * and authorized payslip download.
 */

import { useCallback, useMemo, useState } from "react";
import {
  Award,
  Banknote,
  Calculator,
  Coins,
  Download,
  Eye,
  Receipt,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR, formatOptionalINR } from "@/lib/format";
import { toast } from "sonner";
import {
  pickMoneyRupees,
  pickStr,
  reportAnalyticsApi,
  sumRowField,
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

export default function SalaryStatementReport() {
  const registry = REPORT_REGISTRY.salary_statement;
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
    "salary_statement",
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
  const [selectedDeductionComponent, setSelectedDeductionComponent] = useState<string | null>(null);
  const [downloadingEmpId, setDownloadingEmpId] = useState<string | null>(null);

  const rows = useMemo(() => (Array.isArray(data?.rows) ? data.rows : []), [data?.rows]);
  const totals = useMemo(() => (data?.summaryTotals || {}) as RawRow, [data?.summaryTotals]);

  const kpis = useMemo(() => {
    const basic =
      pickMoneyRupees(totals, ["totalBasic", "total_basic", "basicSalary", "basic_salary"], ["totalBasicPaise", "total_basic_paise"]) ??
      sumRowField(rows, ["basicSalary", "basic_salary", "basicPay", "basic_pay"]);
    const hra =
      pickMoneyRupees(totals, ["totalHra", "total_hra"], ["totalHraPaise", "total_hra_paise"]) ??
      sumRowField(rows, ["hra"]);
    const allowances =
      pickMoneyRupees(totals, ["totalAllowances", "total_allowances"], ["totalAllowancesPaise", "total_allowances_paise"]) ??
      sumRowField(rows, ["specialAllowance", "special_allowance", "otherAllowances", "other_allowances", "allowances"]);
    const variablePay =
      pickMoneyRupees(totals, ["totalVariablePay", "total_variable_pay", "variablePay", "variable_pay"], ["totalVariablePayPaise", "total_variable_pay_paise"]) ??
      sumRowField(rows, ["variablePay", "variable_pay", "bonus", "overtime", "arrears"]);
    const gross =
      pickMoneyRupees(totals, ["totalGross", "total_gross", "grossSalary", "gross_salary"], ["totalGrossPaise", "total_gross_paise"]) ??
      sumRowField(rows, ["grossSalary", "gross_salary", "grossPay", "gross_pay"]);
    const deductions =
      pickMoneyRupees(totals, ["totalDeductions", "total_deductions"], ["totalDeductionsPaise", "total_deductions_paise"]) ??
      sumRowField(rows, ["totalDeductions", "total_deductions", "deductions"]);
    const net =
      pickMoneyRupees(totals, ["totalNet", "total_net", "netSalary", "net_salary"], ["totalNetPaise", "total_net_paise"]) ??
      sumRowField(rows, ["netSalary", "net_salary", "netPayable", "net_payable"]);
    const count = data?.totalRecords || rows.length;
    const avgNet =
      pickMoneyRupees(totals, ["averageNetSalary", "average_net_salary"], ["averageNetPaise", "average_net_paise"]) ??
      (net !== null && count > 0 ? net / count : null);

    return { basic, hra, allowances, variablePay, gross, deductions, net, avgNet };
  }, [totals, rows, data?.totalRecords]);

  const chartsData = useMemo(() => {
    const backendCharts = Array.isArray(data?.charts) ? data.charts : [];
    const findChart = (id: string) =>
      backendCharts.find((c) => c.chartId === id || c.id === id)?.data as ChartDataPoint[] | undefined;

    // 1. Salary Composition Donut
    let composition: ChartDataPoint[] = findChart("salary_composition") || [];
    if (!composition.length && rows.length > 0) {
      composition = [
        { label: "Basic Salary", value: kpis.basic ?? 0 },
        { label: "HRA", value: kpis.hra ?? 0 },
        { label: "Allowances", value: kpis.allowances ?? 0 },
        { label: "Variable Pay", value: kpis.variablePay ?? 0 },
      ].filter((d) => d.value > 0);
    }

    // 2. Fixed vs Variable Salary Bar
    let fixedVsVariable: ChartDataPoint[] = findChart("fixed_vs_variable") || [];
    if (!fixedVsVariable.length && rows.length > 0) {
      const byDept = new Map<string, { fixed: number; variable: number }>();
      for (const r of rows) {
        const dept = pickStr(r as RawRow, "department") || "Organization";
        const curr = byDept.get(dept) || { fixed: 0, variable: 0 };
        const fixedAmt =
          (pickMoneyRupees(r as RawRow, ["basicSalary", "basic_salary", "basicPay", "basic_pay"]) ?? 0) +
          (pickMoneyRupees(r as RawRow, ["hra"]) ?? 0) +
          (pickMoneyRupees(r as RawRow, ["specialAllowance", "special_allowance", "otherAllowances", "other_allowances"]) ?? 0);
        const varAmt =
          (pickMoneyRupees(r as RawRow, ["variablePay", "variable_pay"]) ?? 0) +
          (pickMoneyRupees(r as RawRow, ["bonus"]) ?? 0) +
          (pickMoneyRupees(r as RawRow, ["overtime"]) ?? 0) +
          (pickMoneyRupees(r as RawRow, ["arrears"]) ?? 0);
        curr.fixed += fixedAmt;
        curr.variable += varAmt;
        byDept.set(dept, curr);
      }
      fixedVsVariable = Array.from(byDept.entries()).map(([label, v]) => ({ label, ...v }));
    }

    // 3. Earnings Component Breakdown
    let earningsBreakdown: ChartDataPoint[] = findChart("earnings_breakdown") || [];
    if (!earningsBreakdown.length && rows.length > 0) {
      earningsBreakdown = [
        { label: "Basic", amount: sumRowField(rows, ["basicSalary", "basic_salary", "basicPay"]) ?? 0 },
        { label: "HRA", amount: sumRowField(rows, ["hra"]) ?? 0 },
        { label: "Special Allow.", amount: sumRowField(rows, ["specialAllowance", "special_allowance"]) ?? 0 },
        { label: "Other Allow.", amount: sumRowField(rows, ["otherAllowances", "other_allowances", "allowances"]) ?? 0 },
        { label: "Bonus", amount: sumRowField(rows, ["bonus"]) ?? 0 },
        { label: "Overtime", amount: sumRowField(rows, ["overtime"]) ?? 0 },
        { label: "Arrears", amount: sumRowField(rows, ["arrears"]) ?? 0 },
      ].filter((d) => d.amount > 0);
    }

    // 4. Deduction Component Breakdown (clickable!)
    let deductionsBreakdown: ChartDataPoint[] = findChart("deductions_breakdown") || [];
    if (!deductionsBreakdown.length && rows.length > 0) {
      deductionsBreakdown = [
        { label: "PF", amount: sumRowField(rows, ["pfDeduction", "pf_deduction", "pf"]) ?? 0 },
        { label: "ESI", amount: sumRowField(rows, ["esiDeduction", "esi_deduction", "esi"]) ?? 0 },
        { label: "Prof Tax", amount: sumRowField(rows, ["ptDeduction", "pt_deduction", "pt"]) ?? 0 },
        { label: "TDS", amount: sumRowField(rows, ["tdsDeduction", "tds_deduction", "tds"]) ?? 0 },
        { label: "Other Ded.", amount: sumRowField(rows, ["otherDeductions", "other_deductions"]) ?? 0 },
      ].filter((d) => d.amount > 0);
    }

    // 5. Monthly Salary Trend
    let monthlyTrend: ChartDataPoint[] = findChart("monthly_trend") || [];
    if (!monthlyTrend.length && rows.length > 0) {
      const byPeriod = new Map<string, { gross: number; net: number }>();
      for (const r of rows) {
        const period = pickStr(r as RawRow, "payrollPeriod", "payroll_period", "periodName", "monthLabel") || "Selected Period";
        const curr = byPeriod.get(period) || { gross: 0, net: 0 };
        curr.gross += pickMoneyRupees(r as RawRow, ["grossSalary", "gross_salary", "grossPay", "gross_pay"]) ?? 0;
        curr.net += pickMoneyRupees(r as RawRow, ["netSalary", "net_salary", "netPayable", "net_payable"]) ?? 0;
        byPeriod.set(period, curr);
      }
      monthlyTrend = Array.from(byPeriod.entries()).map(([label, v]) => ({ label, ...v }));
    }

    // 6. Salary Range Distribution
    let salaryRanges: ChartDataPoint[] = findChart("salary_range_distribution") || [];
    if (!salaryRanges.length && rows.length > 0) {
      const buckets = [
        { label: "< ₹30K", min: 0, max: 30000, count: 0 },
        { label: "₹30K–₹60K", min: 30000, max: 60000, count: 0 },
        { label: "₹60K–₹1L", min: 60000, max: 100000, count: 0 },
        { label: "₹1L–₹1.5L", min: 100000, max: 150000, count: 0 },
        { label: "> ₹1.5L", min: 150000, max: Number.POSITIVE_INFINITY, count: 0 },
      ];
      for (const r of rows) {
        const net = pickMoneyRupees(r as RawRow, ["netSalary", "net_salary", "netPayable", "net_payable"]);
        if (net === null) continue;
        const b = buckets.find((x) => net >= x.min && net < x.max);
        if (b) b.count += 1;
      }
      if (buckets.some((b) => b.count > 0)) {
        salaryRanges = buckets.map((b) => ({ label: b.label, employees: b.count }));
      }
    }

    return {
      composition,
      fixedVsVariable,
      earningsBreakdown,
      deductionsBreakdown,
      monthlyTrend,
      salaryRanges,
    };
  }, [data?.charts, rows, kpis]);

  const handleDownloadPayslip = useCallback(async (row: RawRow) => {
    const empId = pickStr(row, "employeeId", "employee_id");
    const runId = pickStr(row, "runId", "run_id") || filters.runId;
    if (!empId || !runId) {
      toast.info("Payslip PDF download requires a finalized payroll run reference.");
      return;
    }
    setDownloadingEmpId(empId);
    try {
      const blob = await reportAnalyticsApi.downloadEmployeePayslip(runId, empId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Payslip_${pickStr(row, "employeeCode", "employee_code") || empId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Payslip downloaded");
    } catch {
      toast.error("Unable to download payslip PDF");
    } finally {
      setDownloadingEmpId(null);
    }
  }, [filters.runId]);

  const normalizedRows = useMemo(() => {
    const mapped = rows.map((r) => ({
      ...r,
      employeeCode: pickStr(r as RawRow, "employeeCode", "employee_code") ?? "—",
      employeeName: pickStr(r as RawRow, "employeeName", "employee_name", "name") ?? "—",
      department: pickStr(r as RawRow, "department") ?? "—",
      salaryStructure: pickStr(r as RawRow, "salaryStructure", "salary_structure", "designation") ?? "—",
      basicSalary: pickMoneyRupees(r as RawRow, ["basicSalary", "basic_salary", "basicPay", "basic_pay"]),
      hra: pickMoneyRupees(r as RawRow, ["hra"]),
      specialAllowance: pickMoneyRupees(r as RawRow, ["specialAllowance", "special_allowance"]),
      otherAllowances: pickMoneyRupees(r as RawRow, ["otherAllowances", "other_allowances", "allowances"]),
      variablePay: pickMoneyRupees(r as RawRow, ["variablePay", "variable_pay"]),
      bonus: pickMoneyRupees(r as RawRow, ["bonus"]),
      overtime: pickMoneyRupees(r as RawRow, ["overtime"]),
      arrears: pickMoneyRupees(r as RawRow, ["arrears"]),
      grossSalary: pickMoneyRupees(r as RawRow, ["grossSalary", "gross_salary", "grossPay", "gross_pay"]),
      totalDeductions: pickMoneyRupees(r as RawRow, ["totalDeductions", "total_deductions", "deductions"]),
      netSalary: pickMoneyRupees(r as RawRow, ["netSalary", "net_salary", "netPayable", "net_payable"]),
      payslipStatus: pickStr(r as RawRow, "payslipStatus", "payslip_status", "status") ?? "—",
    }));

    if (selectedDeductionComponent) {
      const keyMap: Record<string, string> = {
        PF: "pfDeduction",
        ESI: "esiDeduction",
        "Prof Tax": "ptDeduction",
        TDS: "tdsDeduction",
        "Other Ded.": "otherDeductions",
      };
      const k = keyMap[selectedDeductionComponent];
      if (k) {
        return mapped.filter((m) => Number((m as RawRow)[k] ?? 0) > 0);
      }
    }
    return mapped;
  }, [rows, selectedDeductionComponent]);

  const columns: DataTableColumn[] = useMemo(
    () => [
      { key: "employeeName", label: "Employee Name", sortable: true },
      { key: "employeeCode", label: "Emp Code", sortable: true },
      { key: "department", label: "Department", sortable: true },
      { key: "salaryStructure", label: "Salary Structure" },
      { key: "basicSalary", label: "Basic", align: "right", isCurrency: true, sortable: true },
      { key: "hra", label: "HRA", align: "right", isCurrency: true },
      { key: "specialAllowance", label: "Special Allow.", align: "right", isCurrency: true },
      { key: "otherAllowances", label: "Other Allow.", align: "right", isCurrency: true, defaultHidden: true },
      { key: "variablePay", label: "Variable Pay", align: "right", isCurrency: true },
      { key: "bonus", label: "Bonus", align: "right", isCurrency: true, defaultHidden: true },
      { key: "overtime", label: "Overtime", align: "right", isCurrency: true, defaultHidden: true },
      { key: "arrears", label: "Arrears", align: "right", isCurrency: true, defaultHidden: true },
      { key: "grossSalary", label: "Gross Salary", align: "right", isCurrency: true, sortable: true },
      { key: "totalDeductions", label: "Total Deductions", align: "right", isCurrency: true, sortable: true },
      { key: "netSalary", label: "Net Salary", align: "right", isCurrency: true, sortable: true },
      {
        key: "payslipStatus",
        label: "Payslip Status",
        render: (val) => <Badge variant="outline">{String(val || "—")}</Badge>,
      },
      {
        key: "__actions",
        label: "Actions",
        align: "center",
        render: (_v, row) => {
          const empId = pickStr(row as RawRow, "employeeId", "employee_id");
          return (
            <div className="flex items-center justify-center gap-1">
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
                <span>Statement</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Download Payslip"
                disabled={downloadingEmpId === empId}
                onClick={(e) => {
                  e.stopPropagation();
                  void handleDownloadPayslip(row as RawRow);
                }}
                className="h-7 w-7"
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
          );
        },
      },
    ],
    [
      openEmployeeDetail,
      filters.runId,
      filters.financialYear,
      data?.periodLabel,
      downloadingEmpId,
      handleDownloadPayslip,
    ]
  );

  const reconciliationSummary: ReportReconciliationSummary | null = useMemo(() => {
    if (kpis.gross === null && kpis.net === null) return null;
    const gross = kpis.gross ?? 0;
    const ded = kpis.deductions ?? 0;
    const net = kpis.net ?? 0;
    const diff = Math.round((gross - ded - net) * 100) / 100;
    return {
      title: "Salary Statement Totals",
      isBalanced: Math.abs(diff) < 0.05,
      items: [
        { label: "Total Basic + Allowances", value: formatOptionalINR((kpis.basic ?? 0) + (kpis.hra ?? 0) + (kpis.allowances ?? 0)) },
        { label: "Total Gross Salary", value: formatOptionalINR(kpis.gross) },
        { label: "Total Deductions", value: formatOptionalINR(kpis.deductions), tone: "danger" },
        { label: "Total Net Salary", value: formatOptionalINR(kpis.net), tone: "success" },
      ],
      discrepancyMessage:
        Math.abs(diff) < 0.05
          ? null
          : `Statement Gross - Deductions deviates from Net Salary by ${formatINR(diff)}.`,
    };
  }, [kpis]);

  const selections = useMemo(() => {
    const out: Array<{ key: string; label: string; value: string }> = [];
    if (filters.department) out.push({ key: "department", label: "Department", value: filters.department });
    if (selectedDeductionComponent) {
      out.push({ key: "deductionComponent", label: "Deduction", value: selectedDeductionComponent });
    }
    return out;
  }, [filters.department, selectedDeductionComponent]);

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
            onExport={(fmt) => void exportReport("salary_statement", fmt, filters)}
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
          showComparisonControls
          loading={loading}
        />

        {backendUnavailable && <BackendUnavailableBanner reportKey="salary_statement" />}

        <DrillDownBreadcrumbBar
          selections={selections}
          onRemove={(k) => {
            if (k === "deductionComponent") setSelectedDeductionComponent(null);
            else setImmediateFilter({ [k]: undefined });
          }}
          onClearAll={() => {
            setSelectedDeductionComponent(null);
            setImmediateFilter({ department: undefined });
          }}
        />

        {/* Section C: 8 KPI Cards */}
        <KpiCardsGrid columns={4}>
          <AnalyticsKpiCard label="Total Basic Salary" value={formatOptionalINR(kpis.basic)} icon={Banknote} accent="brand" loading={loading} />
          <AnalyticsKpiCard label="Total HRA" value={formatOptionalINR(kpis.hra)} icon={Receipt} accent="muted" loading={loading} />
          <AnalyticsKpiCard label="Total Allowances" value={formatOptionalINR(kpis.allowances)} icon={Coins} accent="success" loading={loading} />
          <AnalyticsKpiCard label="Total Variable Pay" value={formatOptionalINR(kpis.variablePay)} icon={Award} accent="warning" loading={loading} />
          <AnalyticsKpiCard label="Total Gross Salary" value={formatOptionalINR(kpis.gross)} icon={Calculator} accent="brand" loading={loading} />
          <AnalyticsKpiCard label="Total Deductions" value={formatOptionalINR(kpis.deductions)} icon={TrendingDown} accent="danger" loading={loading} />
          <AnalyticsKpiCard label="Total Net Salary" value={formatOptionalINR(kpis.net)} icon={Wallet} accent="success" loading={loading} />
          <AnalyticsKpiCard label="Average Net Salary" value={formatOptionalINR(kpis.avgNet)} icon={Calculator} accent="brand" loading={loading} />
        </KpiCardsGrid>

        {/* Section D: 6 Charts */}
        <ChartsGrid>
          <ReportChartWrapper
            title="Salary Composition"
            subtitle="Basic, HRA, Allowances, and Variable pay share"
            loading={loading}
            empty={chartsData.composition.length === 0}
          >
            <ReportDonutChart data={chartsData.composition} />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Fixed vs Variable Salary"
            subtitle="Department-wise fixed vs variable compensation split"
            loading={loading}
            empty={chartsData.fixedVsVariable.length === 0}
          >
            <ReportBarChart
              data={chartsData.fixedVsVariable}
              dataKeys={[
                { key: "fixed", name: "Fixed Pay" },
                { key: "variable", name: "Variable Pay" },
              ]}
              stacked
              onBarClick={(pt) =>
                setImmediateFilter({
                  department: filters.department === pt.label ? undefined : pt.label,
                })
              }
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Earnings Component Breakdown"
            subtitle="Aggregate earnings across salary statement components"
            loading={loading}
            empty={chartsData.earningsBreakdown.length === 0}
          >
            <ReportBarChart
              data={chartsData.earningsBreakdown}
              dataKeys={[{ key: "amount", name: "Amount" }]}
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Deduction Component Breakdown"
            subtitle="Click any deduction component to filter employee rows"
            loading={loading}
            empty={chartsData.deductionsBreakdown.length === 0}
          >
            <ReportBarChart
              data={chartsData.deductionsBreakdown}
              dataKeys={[{ key: "amount", name: "Deduction Amount" }]}
              colors={["#e11d48", "#d97706", "#7c3aed", "#2563eb"]}
              onBarClick={(pt) =>
                setSelectedDeductionComponent((prev) => (prev === pt.label ? null : pt.label))
              }
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Monthly Salary Trend"
            subtitle="Gross vs Net salary trajectory across selected months"
            loading={loading}
            empty={chartsData.monthlyTrend.length === 0}
          >
            <ReportLineChart
              data={chartsData.monthlyTrend}
              dataKeys={[
                { key: "gross", name: "Gross Salary" },
                { key: "net", name: "Net Salary" },
              ]}
            />
          </ReportChartWrapper>

          <ReportChartWrapper
            title="Employee Salary Range Distribution"
            subtitle="Count of employees per take-home salary range"
            loading={loading}
            empty={chartsData.salaryRanges.length === 0}
          >
            <ReportBarChart
              data={chartsData.salaryRanges}
              dataKeys={[{ key: "employees", name: "Employees" }]}
              formatType="number"
            />
          </ReportChartWrapper>
        </ChartsGrid>

        {/* Section E: Detailed Salary Statement Table */}
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
          emptyMessage="No Salary Statements Available"
          emptyDescription="Select a payroll period or adjust department filters to view salary statements."
        />

        <ReportTotalsReconciliationCard summary={reconciliationSummary} />

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

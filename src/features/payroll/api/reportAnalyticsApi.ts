/**
 * Payroll Report Analytics API Service.
 *
 * Strictly calls ONLY verified endpoints declared in `/openapi.json` and existing
 * application services (`reportsApi`, `payrollApi`, `paymentApi`, `statutoryApi`,
 * `departmentsApi`, `designationsApi`, `branchesApi`, `settings`).
 *
 * Never fabricates synthetic numbers or calls undeclared routes that collide
 * with `/api/v2/payroll/reports/{reportKey}`.
 */

import apiInstance from "@/api/apiInstance";
import { payrollApi } from "@/services/payrollApi";
import { departmentsApi } from "@/services/departmentsApi";
import { designationsApi } from "@/services/designationsApi";
import { branchesApi } from "@/services/branchesApi";
import { fetchCompanySettings } from "@/features/settings/api";
import { formatCount, formatINR, formatOptionalINR, formatPaise } from "@/lib/format";
import { paymentApi } from "./paymentApi";
import { reportsApi } from "./reportsApi";
import type { ReportKey, ReportDataResponse, AccountingExportResponse } from "../types/reports";
import {
  REPORT_ROUTES,
  type ChartDataPoint,
  type ComponentBreakdown,
  type EmployeePayrollDetail,
  type ExtendedReportFilterConfig,
  type FilterOption,
  type ReportAnalyticsResponse,
  type ReportChartData,
  type ReportDashboardKpi,
  type ReportFilterOptions,
  type ReportKpiCard,
} from "../types/reportAnalytics";

const API_HEADERS = { "Cache-Control": "no-store" } as const;

type RawRecord = Record<string, unknown>;

export function pickNum(obj: RawRecord | undefined | null, ...keys: string[]): number | null {
  if (!obj) return null;
  for (const key of keys) {
    const val = obj[key];
    if (typeof val === "number" && Number.isFinite(val)) return val;
    if (typeof val === "string" && val.trim() !== "") {
      const cleaned = val.replace(/[₹,\s]/g, "");
      const parsed = Number(cleaned);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

export function pickStr(obj: RawRecord | undefined | null, ...keys: string[]): string | null {
  if (!obj) return null;
  for (const key of keys) {
    const val = obj[key];
    if (typeof val === "string" && val.trim() !== "") return val.trim();
    if (typeof val === "number" && Number.isFinite(val)) return String(val);
  }
  return null;
}

export function pickMoneyRupees(
  obj: RawRecord | undefined | null,
  rupeeKeys: string[],
  paiseKeys: string[] = []
): number | null {
  const direct = pickNum(obj, ...rupeeKeys);
  if (direct !== null) return direct;
  const paise = pickNum(obj, ...paiseKeys);
  if (paise !== null) return paise / 100;
  return null;
}

export function sumRowField(
  rows: Record<string, unknown>[],
  rupeeKeys: string[],
  paiseKeys: string[] = []
): number | null {
  if (!Array.isArray(rows) || !rows.length) return null;
  let sum = 0;
  let found = false;
  for (const row of rows) {
    const v = pickMoneyRupees(row as RawRecord, rupeeKeys, paiseKeys);
    if (v !== null) {
      sum += v;
      found = true;
    }
  }
  return found ? sum : null;
}

export function getHttpStatus(err: unknown): number | undefined {
  if (err && typeof err === "object" && "response" in err) {
    return (err as { response?: { status?: number } }).response?.status;
  }
  return undefined;
}

function buildIndianFyOptions(): FilterOption[] {
  const now = new Date();
  const currentFyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return [currentFyStart - 2, currentFyStart - 1, currentFyStart, currentFyStart + 1].map(
    (y) => ({
      value: `${y}-${y + 1}`,
      label: `FY ${y}-${y + 1}`,
    })
  );
}

function extractPayrollRunsList(
  raw: unknown
): Array<{ id: string; label: string; periodId?: string; status?: string }> {
  const payload =
    raw && typeof raw === "object" && "data" in (raw as RawRecord)
      ? (raw as RawRecord).data
      : raw;
  const arr = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object" && Array.isArray((payload as RawRecord).items)
      ? ((payload as RawRecord).items as unknown[])
      : [];
  return arr
    .filter((r): r is RawRecord => Boolean(r) && typeof r === "object")
    .map((r) => {
      const id = String(r.id ?? r.runId ?? r.run_id ?? "");
      const runNum = pickStr(r, "runNumber", "run_number", "periodName", "period_name") || id;
      const status = pickStr(r, "status");
      return {
        id,
        label: status ? `${runNum} (${status})` : runNum,
        periodId: pickStr(r, "periodId", "period_id", "cycleId", "cycle_id") ?? undefined,
        status: status ?? undefined,
      };
    })
    .filter((r) => r.id !== "");
}

function buildDashboardKpiFromReport(
  reportKey: ReportKey,
  report: ReportDataResponse
): ReportDashboardKpi {
  const route = REPORT_ROUTES.find((r) => r.key === reportKey)!;
  const totals = (report.summaryTotals || {}) as RawRecord;
  const rows = Array.isArray(report.rows) ? report.rows : [];

  const firstKpi =
    Array.isArray(report.kpiCards) && report.kpiCards[0]
      ? (report.kpiCards[0] as RawRecord)
      : null;
  if (firstKpi) {
    const val = pickStr(firstKpi, "formattedValue", "formatted_value", "value");
    if (val) {
      return {
        reportKey,
        title: route.title,
        description: route.description,
        primaryKpiLabel: pickStr(firstKpi, "label") || route.primaryKpiTitle,
        primaryKpiValue: val,
        primaryKpiRawValue: pickNum(firstKpi, "value", "rawValue"),
        secondaryLabel: pickStr(firstKpi, "secondaryLabel", "secondary_label") ?? undefined,
        secondaryValue: pickStr(firstKpi, "secondaryValue", "secondary_value") ?? undefined,
        previousPeriodValue:
          pickStr(firstKpi, "previousFormattedValue", "previous_formatted_value") ?? undefined,
        changePercent: pickNum(firstKpi, "changePercent", "change_percent"),
        changeDirection:
          (pickStr(firstKpi, "changeDirection", "change_direction") as "up" | "down" | "flat") ??
          undefined,
        recordCount: report.totalRecords,
        lastUpdated: report.generatedAt,
        sourceStatus: "ok",
      };
    }
  }

  let primaryValue = "—";
  let primaryRaw: number | null = null;
  let secondaryLabel = "Records";
  let secondaryValue = formatCount(report.totalRecords);
  const prevValue =
    pickStr(totals, "previousPeriodFormatted", "previous_period_formatted") ?? undefined;
  const changePercent = pickNum(
    totals,
    "variancePercent",
    "variance_percent",
    "changePercent",
    "change_percent"
  );

  switch (reportKey) {
    case "payroll_register": {
      const gross =
        pickMoneyRupees(
          totals,
          ["totalGross", "total_gross", "grossPayroll", "gross_payroll"],
          ["totalGrossPaise", "total_gross_paise"]
        ) ??
        sumRowField(
          rows,
          ["grossEarnings", "gross_earnings", "grossPay", "gross_pay"],
          ["grossEarningsPaise", "gross_earnings_paise"]
        );
      const empCount =
        pickNum(totals, "totalEmployees", "total_employees", "employeeCount", "employee_count") ??
        report.totalRecords;
      primaryRaw = gross;
      primaryValue = gross !== null ? formatINR(gross) : "—";
      secondaryLabel = "Employees";
      secondaryValue = formatCount(empCount);
      break;
    }
    case "salary_statement": {
      const net =
        pickMoneyRupees(
          totals,
          ["totalNet", "total_net", "netSalary", "net_salary"],
          ["totalNetPaise", "total_net_paise"]
        ) ??
        sumRowField(
          rows,
          ["netSalary", "net_salary", "netPayable", "net_payable", "netPay", "net_pay"],
          ["netSalaryPaise", "net_salary_paise"]
        );
      primaryRaw = net;
      primaryValue = net !== null ? formatINR(net) : "—";
      secondaryLabel = "Statements";
      secondaryValue = formatCount(report.totalRecords);
      break;
    }
    case "department_payroll": {
      const deptCost =
        pickMoneyRupees(
          totals,
          [
            "totalCost",
            "total_cost",
            "totalEmployerCost",
            "total_employer_cost",
            "totalGross",
            "total_gross",
          ],
          ["totalCostPaise", "total_cost_paise"]
        ) ??
        sumRowField(
          rows,
          ["employerCost", "employer_cost", "totalCost", "total_cost", "totalGross", "total_gross"],
          ["totalCostPaise", "total_cost_paise"]
        );
      primaryRaw = deptCost;
      primaryValue = deptCost !== null ? formatINR(deptCost) : "—";
      secondaryLabel = "Departments";
      secondaryValue = formatCount(report.totalRecords);
      break;
    }
    case "cost_center_payroll": {
      const alloc =
        pickMoneyRupees(
          totals,
          [
            "totalAllocated",
            "total_allocated",
            "allocatedTotal",
            "allocated_total",
            "actualCost",
            "actual_cost",
          ],
          ["totalAllocatedPaise", "total_allocated_paise"]
        ) ??
        sumRowField(rows, [
          "allocatedTotal",
          "allocated_total",
          "totalAllocatedCost",
          "actualCost",
          "actual_cost",
        ]);
      primaryRaw = alloc;
      primaryValue = alloc !== null ? formatINR(alloc) : "—";
      secondaryLabel = "Cost Centers";
      secondaryValue = formatCount(report.totalRecords);
      break;
    }
    case "bank_advice": {
      const payable =
        pickMoneyRupees(
          totals,
          ["totalPayable", "total_payable", "payableAmount", "payable_amount"],
          ["totalPayablePaise", "total_payable_paise"]
        ) ??
        sumRowField(
          rows,
          ["amount", "netPayable", "net_payable", "netAmount"],
          ["netAmountPaise", "net_amount_paise"]
        );
      primaryRaw = payable;
      primaryValue = payable !== null ? formatINR(payable) : "—";
      secondaryLabel = "Beneficiaries";
      secondaryValue = formatCount(report.totalRecords);
      break;
    }
    case "payroll_variance": {
      const diff =
        pickMoneyRupees(
          totals,
          ["totalDifference", "total_difference", "varianceAmount", "variance_amount"],
          ["totalDifferencePaise", "total_difference_paise"]
        ) ??
        sumRowField(rows, [
          "varianceAmount",
          "variance_amount",
          "netDifference",
          "net_difference",
        ]);
      primaryRaw = diff;
      primaryValue = diff !== null ? formatINR(diff) : "—";
      secondaryLabel = "Variance Items";
      secondaryValue = formatCount(report.totalRecords);
      break;
    }
    case "headcount_report": {
      const closing =
        pickNum(
          totals,
          "closingHeadcount",
          "closing_headcount",
          "totalEmployees",
          "total_employees",
          "activeEmployees",
          "active_employees"
        ) ?? sumRowField(rows, ["closingCount", "closing_count"]);
      primaryRaw = closing;
      primaryValue =
        closing !== null ? formatCount(closing) : formatCount(report.totalRecords);
      secondaryLabel = "Departments";
      secondaryValue = formatCount(report.totalRecords);
      break;
    }
    case "ytd_payroll": {
      const ytdGross =
        pickMoneyRupees(
          totals,
          ["ytdGross", "ytd_gross", "totalGross", "total_gross"],
          ["ytdGrossPaise", "ytd_gross_paise"]
        ) ?? sumRowField(rows, ["ytdGross", "ytd_gross", "ytdGrossEarnings", "ytd_gross_earnings"]);
      primaryRaw = ytdGross;
      primaryValue = ytdGross !== null ? formatINR(ytdGross) : "—";
      secondaryLabel = "Employees YTD";
      secondaryValue = formatCount(report.totalRecords);
      break;
    }
    case "accounting_export": {
      const totalDebit =
        pickMoneyRupees(
          totals,
          ["totalDebit", "total_debit"],
          ["totalDebitPaise", "total_debit_paise"]
        ) ??
        sumRowField(rows, ["debitAmount", "debit_amount"], ["debitAmountPaise", "debit_amount_paise"]);
      primaryRaw = totalDebit;
      primaryValue = totalDebit !== null ? formatINR(totalDebit) : "—";
      secondaryLabel = "Journal Lines";
      secondaryValue = formatCount(report.totalRecords);
      break;
    }
  }

  return {
    reportKey,
    title: route.title,
    description: route.description,
    primaryKpiLabel: route.primaryKpiTitle,
    primaryKpiValue: primaryValue,
    primaryKpiRawValue: primaryRaw,
    secondaryLabel,
    secondaryValue,
    previousPeriodValue: prevValue,
    changePercent,
    changeDirection:
      changePercent !== null
        ? changePercent > 0
          ? "up"
          : changePercent < 0
            ? "down"
            : "flat"
        : undefined,
    recordCount: report.totalRecords,
    lastUpdated: report.generatedAt,
    sourceStatus: "ok",
  };
}

export const reportAnalyticsApi = {
  /**
   * Fetch an individual dashboard card KPI using ONLY verified OpenAPI endpoints.
   */
  async getSingleDashboardKpi(
    reportKey: ReportKey,
    filters?: Pick<
      ExtendedReportFilterConfig,
      "periodId" | "financialYear" | "month" | "year" | "department" | "runId"
    >
  ): Promise<ReportDashboardKpi> {
    const route = REPORT_ROUTES.find((r) => r.key === reportKey)!;

    if (reportKey === "accounting_export") {
      try {
        const journal = await reportsApi.getAccountingJournal(filters?.periodId, {
          runId: filters?.runId,
          department: filters?.department,
          financialYear: filters?.financialYear,
        });
        return {
          reportKey,
          title: route.title,
          description: route.description,
          primaryKpiLabel: route.primaryKpiTitle,
          primaryKpiValue: formatPaise(journal.totalDebitPaise),
          primaryKpiRawValue: journal.totalDebitPaise / 100,
          secondaryLabel: journal.isBalanced ? "Balanced" : "Unbalanced",
          secondaryValue: `${formatCount(journal.entries.length)} entries`,
          recordCount: journal.entries.length,
          lastUpdated: journal.accountingDate,
          sourceStatus: "ok",
        };
      } catch (err) {
        const status = getHttpStatus(err);
        if (status !== 404 && status !== 501) {
          throw err;
        }
      }
    }

    try {
      const report = await reportsApi.getReportData(reportKey, filters, { page: 1, limit: 25 });
      return buildDashboardKpiFromReport(reportKey, report);
    } catch (err) {
      const status = getHttpStatus(err);
      if (status !== 404 && status !== 501) {
        throw err;
      }

      if (reportKey === "bank_advice") {
        try {
          const summary = await paymentApi.getDashboardSummary();
          return {
            reportKey,
            title: route.title,
            description: route.description,
            primaryKpiLabel: "Total Payable Amount",
            primaryKpiValue:
              summary.totalPayableAmountFormatted ||
              formatPaise(summary.totalPayableAmountPaise),
            primaryKpiRawValue: summary.totalPayableAmountPaise / 100,
            secondaryLabel: "Paid / Batches",
            secondaryValue: `${summary.totalPaidAmountFormatted} (${formatCount(summary.totalBatches)} batches)`,
            recordCount: summary.totalBatches,
            lastUpdated: new Date().toISOString(),
            sourceStatus: "ok",
          };
        } catch {
          // Fall through cleanly
        }
      }

      if (reportKey === "payroll_register" && filters?.runId) {
        try {
          const preview = await payrollApi.getPayrollPreview(filters.runId);
          return {
            reportKey,
            title: route.title,
            description: route.description,
            primaryKpiLabel: "Total Gross Payroll",
            primaryKpiValue: formatOptionalINR(preview.summary.grossPayroll),
            primaryKpiRawValue: preview.summary.grossPayroll,
            secondaryLabel: "Employees",
            secondaryValue:
              preview.summary.employeeCount !== null
                ? formatCount(preview.summary.employeeCount)
                : "—",
            recordCount: preview.summary.employeeCount,
            lastUpdated: preview.lastCalculatedAt ?? undefined,
            sourceStatus: "ok",
          };
        } catch {
          // Fall through cleanly
        }
      }

      return {
        reportKey,
        title: route.title,
        description: route.description,
        primaryKpiLabel: route.primaryKpiTitle,
        primaryKpiValue: "—",
        recordCount: null,
        sourceStatus: "unavailable",
        sourceError: `GET /api/v2/payroll/reports/${reportKey} pending backend data`,
      };
    }
  },

  /**
   * Fetch available filter options exclusively from verified backend endpoints.
   */
  async getFilterOptions(): Promise<ReportFilterOptions> {
    const [periodsRes, runsRes, deptsRes, desigRes, branchesRes, modesRes] =
      await Promise.allSettled([
        payrollApi.getPeriods(),
        apiInstance.get("/api/v2/payroll/runs", { headers: API_HEADERS }),
        departmentsApi.getDepartments({ limit: 200 }),
        designationsApi.getDesignations({ limit: 200 }),
        branchesApi.getBranches({ limit: 200 }),
        paymentApi.getSupportedPaymentModes(),
      ]);

    const periods = periodsRes.status === "fulfilled" ? periodsRes.value : [];
    const runs = runsRes.status === "fulfilled" ? extractPayrollRunsList(runsRes.value?.data) : [];
    const depts = deptsRes.status === "fulfilled" ? deptsRes.value.items : [];
    const desigs = desigRes.status === "fulfilled" ? desigRes.value.items : [];
    const branches = branchesRes.status === "fulfilled" ? branchesRes.value.items : [];
    const modes = modesRes.status === "fulfilled" ? modesRes.value : [];

    return {
      departments: depts.map((d) => ({
        value: d.name || d.id,
        label: d.name,
        count: d.employee_count,
      })),
      designations: desigs.map((d) => ({ value: d.name || d.id, label: d.name })),
      locations: [],
      branches: branches.map((b) => ({ value: b.name || String(b.id), label: b.name })),
      costCenters: [],
      employmentTypes: [
        { value: "full_time", label: "Full Time" },
        { value: "part_time", label: "Part Time" },
        { value: "contract", label: "Contract" },
        { value: "intern", label: "Intern" },
      ],
      payrollPeriods: periods.map((p) => ({
        value: p.id,
        label: p.name,
        meta: { month: p.periodMonth, year: p.periodYear, runId: p.runId, status: p.status },
      })),
      payrollRuns: runs.map((r) => ({
        value: r.id,
        label: r.label,
        meta: { periodId: r.periodId, status: r.status },
      })),
      payrollStatuses: [
        { value: "Draft", label: "Draft" },
        { value: "Processing", label: "Processing" },
        { value: "Under Review", label: "Under Review" },
        { value: "Approved", label: "Approved" },
        { value: "Finalized", label: "Finalized" },
        { value: "On Hold", label: "On Hold" },
        { value: "Paid", label: "Paid" },
      ],
      paymentStatuses: [
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "paid", label: "Paid" },
        { value: "failed", label: "Failed" },
        { value: "held", label: "Held" },
        { value: "reversed", label: "Reversed" },
      ],
      paymentModes:
        modes.length > 0
          ? modes.map((m) => ({ value: m.code, label: m.label || m.code }))
          : [
              { value: "NEFT", label: "NEFT" },
              { value: "RTGS", label: "RTGS" },
              { value: "IMPS", label: "IMPS" },
              { value: "UPI", label: "UPI" },
            ],
      financialYears: buildIndianFyOptions(),
      employees: [],
    };
  },

  /**
   * Fetch company metadata (name & logo) for print/PDF report headers.
   */
  async getCompanyProfile(): Promise<{ name: string; logoUrl?: string }> {
    try {
      const company = await fetchCompanySettings();
      return {
        name: company.name || "OFC360 Organization",
        logoUrl: company.logoDataUrl || company.logoUrl || undefined,
      };
    } catch {
      return { name: "OFC360 Organization" };
    }
  },

  /**
   * Fetch employee payroll breakdown using verified OpenAPI endpoint:
   * GET /api/v2/payroll/runs/{runId}/employees/{employeeId}
   */
  async getEmployeePayrollDetail(
    employeeId: string,
    options?: { runId?: string; row?: Record<string, unknown>; periodLabel?: string }
  ): Promise<EmployeePayrollDetail> {
    if (options?.runId && employeeId) {
      try {
        const emp = await payrollApi.getRunEmployeeDetail(options.runId, employeeId);
        const earningsList: ComponentBreakdown[] = [];
        const deductionsList: ComponentBreakdown[] = [];
        const employerList: ComponentBreakdown[] = [];

        if (emp.earnings && typeof emp.earnings === "object") {
          for (const [k, v] of Object.entries(emp.earnings)) {
            if (typeof v === "number" && Number.isFinite(v)) {
              earningsList.push({
                code: k.toUpperCase(),
                name: k
                  .replace(/([A-Z])/g, " $1")
                  .replace(/_/g, " ")
                  .replace(/^\w/, (c) => c.toUpperCase()),
                type: "earning",
                amountPaise: Math.round(v * 100),
                amountFormatted: formatINR(v),
              });
            }
          }
        }
        if (emp.deductions && typeof emp.deductions === "object") {
          for (const [k, v] of Object.entries(emp.deductions)) {
            if (typeof v === "number" && Number.isFinite(v)) {
              deductionsList.push({
                code: k.toUpperCase(),
                name: k
                  .replace(/([A-Z])/g, " $1")
                  .replace(/_/g, " ")
                  .replace(/^\w/, (c) => c.toUpperCase()),
                type: "deduction",
                amountPaise: Math.round(v * 100),
                amountFormatted: formatINR(v),
              });
            }
          }
        }
        if (emp.statutory?.employer && typeof emp.statutory.employer === "object") {
          for (const [k, v] of Object.entries(emp.statutory.employer)) {
            if (typeof v === "number" && Number.isFinite(v)) {
              employerList.push({
                code: k.toUpperCase(),
                name: `Employer ${k.toUpperCase()}`,
                type: "employer_contribution",
                amountPaise: Math.round(v * 100),
                amountFormatted: formatINR(v),
              });
            }
          }
        }

        const empCost = emp.employerContribution ?? null;
        const totalCost =
          emp.grossEarnings !== null && empCost !== null
            ? emp.grossEarnings + empCost
            : emp.grossEarnings;

        const empRaw = emp as unknown as RawRecord;
        const rowFallback = (options?.row || {}) as RawRecord;
        const bankRaw = emp.bankInfo as unknown as RawRecord | null | undefined;
        const rawAcct = emp.bankInfo?.accountNumber ?? undefined;
        const safeBankAcct =
          rawAcct && !rawAcct.startsWith("ofc360:v1:") ? rawAcct : undefined;

        return {
          employeeId: emp.employeeId || employeeId,
          employeeCode:
            pickStr(empRaw, "employeeCode", "employee_code") ??
            pickStr(rowFallback, "employeeCode", "employee_code") ??
            emp.employeeId ??
            "—",
          employeeName: emp.name || "—",
          department: emp.department || "—",
          designation: emp.designation || "—",
          employmentType: String(emp.employmentStatus || "full_time"),
          salaryStructure: emp.salaryStructure?.name ?? undefined,
          periodLabel: emp.periodName || options.periodLabel || "—",
          runId: options.runId,
          workingDays: emp.attendance?.workingDays ?? null,
          paidDays: emp.attendance?.paidDays ?? null,
          lwpDays: emp.attendance?.lopDays ?? emp.attendance?.unpaidDays ?? null,
          earnings: earningsList,
          deductions: deductionsList,
          employerContributions: employerList,
          grossEarnings: emp.grossEarnings,
          grossEarningsFormatted: formatOptionalINR(emp.grossEarnings),
          totalDeductions: emp.totalDeductions,
          totalDeductionsFormatted: formatOptionalINR(emp.totalDeductions),
          netSalary: emp.netPay,
          netSalaryFormatted: formatOptionalINR(emp.netPay),
          employerCost: empCost,
          employerCostFormatted: formatOptionalINR(empCost),
          totalCost,
          totalCostFormatted: formatOptionalINR(totalCost),
          payrollStatus: emp.status || emp.runStatus || "—",
          bankInfo: emp.bankInfo
            ? {
                bankName: emp.bankInfo.bankName ?? undefined,
                accountNumberMasked: safeBankAcct,
                ifscCode: emp.bankInfo.ifscCode ?? undefined,
                paymentMode: pickStr(bankRaw, "paymentMode", "payment_mode") ?? undefined,
              }
            : null,
          previousComparison: emp.previousComparison ?? null,
        };
      } catch {
        // Fallback to row payload
      }
    }

    const r = (options?.row || {}) as RawRecord;
    const earningDefs: Array<[string, string, string[], string[]]> = [
      [
        "BASIC",
        "Basic Salary",
        ["basicPay", "basic_pay", "basicSalary", "basic_salary", "basic"],
        ["basicPaise", "basic_paise"],
      ],
      ["HRA", "House Rent Allowance (HRA)", ["hra", "hraAmount", "hra_amount"], ["hraPaise", "hra_paise"]],
      [
        "SPECIAL",
        "Special Allowance",
        ["specialAllowance", "special_allowance"],
        ["specialAllowancePaise", "special_allowance_paise"],
      ],
      [
        "ALLOW",
        "Other Allowances",
        ["allowances", "otherAllowances", "other_allowances"],
        ["allowancesPaise", "allowances_paise"],
      ],
      ["OT", "Overtime", ["overtime", "overtimePay", "overtime_pay"], ["overtimePaise", "overtime_paise"]],
      ["BONUS", "Bonus", ["bonus", "bonusAmount", "bonus_amount"], ["bonusPaise", "bonus_paise"]],
      ["INC", "Incentives", ["incentives", "variablePay", "variable_pay"], ["incentivesPaise", "incentives_paise"]],
      ["ARREARS", "Arrears", ["arrears", "arrearsAmount", "arrears_amount"], ["arrearsPaise", "arrears_paise"]],
    ];

    const deductionDefs: Array<[string, string, string[], string[]]> = [
      ["PF", "Employee PF", ["pfDeduction", "pf_deduction", "employeePf", "employee_pf", "pf"], ["pfPaise", "pf_paise"]],
      ["ESI", "Employee ESI", ["esiDeduction", "esi_deduction", "employeeEsi", "employee_esi", "esi"], ["esiPaise", "esi_paise"]],
      ["PT", "Professional Tax", ["ptDeduction", "pt_deduction", "professionalTax", "professional_tax", "pt"], ["ptPaise", "pt_paise"]],
      ["TDS", "Income Tax (TDS)", ["tdsDeduction", "tds_deduction", "tds", "incomeTax", "income_tax"], ["tdsPaise", "tds_paise"]],
      ["OTHER_DED", "Other Deductions", ["otherDeductions", "other_deductions", "loanDeduction", "loan_deduction"], ["otherDeductionsPaise", "other_deductions_paise"]],
    ];

    const earnings: ComponentBreakdown[] = [];
    for (const [code, name, rKeys, pKeys] of earningDefs) {
      const val = pickMoneyRupees(r, rKeys, pKeys);
      if (val !== null) {
        earnings.push({
          code,
          name,
          type: "earning",
          amountPaise: Math.round(val * 100),
          amountFormatted: formatINR(val),
        });
      }
    }

    const deductions: ComponentBreakdown[] = [];
    for (const [code, name, rKeys, pKeys] of deductionDefs) {
      const val = pickMoneyRupees(r, rKeys, pKeys);
      if (val !== null) {
        deductions.push({
          code,
          name,
          type: "deduction",
          amountPaise: Math.round(val * 100),
          amountFormatted: formatINR(val),
        });
      }
    }

    const employerContribVal = pickMoneyRupees(
      r,
      [
        "employerContributions",
        "employer_contributions",
        "employerPfEsi",
        "employer_pf_esi",
        "employerCost",
        "employer_cost",
      ],
      ["employerContributionsPaise", "employer_contributions_paise"]
    );
    const employerContributions: ComponentBreakdown[] =
      employerContribVal !== null
        ? [
            {
              code: "ER_STAT",
              name: "Employer PF & ESI",
              type: "employer_contribution",
              amountPaise: Math.round(employerContribVal * 100),
              amountFormatted: formatINR(employerContribVal),
            },
          ]
        : [];

    const gross = pickMoneyRupees(
      r,
      ["grossEarnings", "gross_earnings", "grossSalary", "gross_salary", "grossPay", "gross_pay"],
      ["grossPaise", "gross_paise"]
    );
    const totalDed = pickMoneyRupees(
      r,
      ["totalDeductions", "total_deductions", "deductions"],
      ["totalDeductionsPaise", "total_deductions_paise"]
    );
    const net = pickMoneyRupees(
      r,
      ["netSalary", "net_salary", "netPay", "net_pay", "netPayable", "net_payable"],
      ["netPayPaise", "net_pay_paise"]
    );
    const totalEmployerCost =
      pickMoneyRupees(
        r,
        ["totalEmployerCost", "total_employer_cost", "totalCost", "total_cost"],
        ["totalCostPaise", "total_cost_paise"]
      ) ?? (gross !== null && employerContribVal !== null ? gross + employerContribVal : gross);

    const maskedRaw = pickStr(r, "accountNumberMasked", "account_number_masked");
    const safeMasked = maskedRaw && !maskedRaw.startsWith("ofc360:v1:") ? maskedRaw : undefined;

    return {
      employeeId: pickStr(r, "employeeId", "employee_id") || employeeId,
      employeeCode: pickStr(r, "employeeCode", "employee_code") || "—",
      employeeName:
        pickStr(r, "employeeName", "employee_name", "beneficiaryName", "beneficiary_name", "name") ||
        "—",
      department: pickStr(r, "department", "departmentName", "department_name") || "—",
      designation: pickStr(r, "designation") || "—",
      employmentType: pickStr(r, "employmentType", "employment_type") || "—",
      salaryStructure: pickStr(r, "salaryStructure", "salary_structure") ?? undefined,
      periodLabel:
        pickStr(r, "payrollPeriod", "payroll_period", "periodName", "period_name") ||
        options?.periodLabel ||
        "—",
      runId: pickStr(r, "runId", "run_id") ?? options?.runId,
      workingDays: pickNum(r, "workingDays", "working_days"),
      paidDays: pickNum(r, "paidDays", "paid_days"),
      lwpDays: pickNum(r, "lwpDays", "lwp_days", "leaveWithoutPay", "leave_without_pay"),
      earnings,
      deductions,
      employerContributions,
      grossEarnings: gross,
      grossEarningsFormatted: formatOptionalINR(gross),
      totalDeductions: totalDed,
      totalDeductionsFormatted: formatOptionalINR(totalDed),
      netSalary: net,
      netSalaryFormatted: formatOptionalINR(net),
      employerCost: employerContribVal,
      employerCostFormatted: formatOptionalINR(employerContribVal),
      totalCost: totalEmployerCost,
      totalCostFormatted: formatOptionalINR(totalEmployerCost),
      payrollStatus:
        pickStr(
          r,
          "payrollStatus",
          "payroll_status",
          "payslipStatus",
          "payslip_status",
          "status"
        ) || "—",
      paymentStatus: pickStr(r, "paymentStatus", "payment_status") ?? undefined,
      bankInfo:
        safeMasked || pickStr(r, "bankName", "bank_name")
          ? {
              bankName: pickStr(r, "bankName", "bank_name") ?? undefined,
              accountNumberMasked: safeMasked,
              ifscCode: pickStr(r, "ifscCode", "ifsc_code") ?? undefined,
              paymentMode: pickStr(r, "paymentMode", "payment_mode") ?? undefined,
              utr: pickStr(r, "utr", "utrNumber", "utr_number") ?? undefined,
            }
          : null,
    };
  },

  /**
   * Download employee official payslip PDF using authorized API.
   */
  async downloadEmployeePayslip(runId: string, employeeId: string): Promise<Blob> {
    return payrollApi.downloadPayslip(runId, employeeId);
  },

  /**
   * Fetch accounting journal using verified GET /api/v2/payroll/accounting-export.
   */
  async getAccountingJournal(
    periodId?: string,
    extraParams?: {
      runId?: string;
      department?: string;
      costCenter?: string;
      financialYear?: string;
    }
  ): Promise<AccountingExportResponse> {
    return reportsApi.getAccountingJournal(periodId, extraParams);
  },

  /**
   * Fetch secondary analytics datasets from verified OpenAPI `/api/v2/reports/analytics/*`
   * when available (never fails hard on 404/501).
   */
  async getSupplementalAnalytics(
    type: "payroll-cost" | "department" | "headcount" | "turnover" | "compliance",
    params?: Record<string, unknown>
  ): Promise<ChartDataPoint[]> {
    try {
      const res = await apiInstance.get(`/api/v2/reports/analytics/${type}`, {
        params,
        headers: API_HEADERS,
      });
      const raw = res.data?.data ?? res.data;
      if (!Array.isArray(raw)) return [];
      return raw
        .filter((item): item is RawRecord => Boolean(item) && typeof item === "object")
        .map((item) => ({
          ...item,
          label: String(
            item.month ??
              item.m ??
              item.name ??
              item.department ??
              item.category ??
              item.period ??
              "—"
          ),
        })) as ChartDataPoint[];
    } catch {
      return [];
    }
  },
};

export type { ReportKpiCard, ReportChartData, ReportAnalyticsResponse, AccountingExportResponse };

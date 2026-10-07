import type {
  PayrollPreviewData,
  PayrollRunStatus,
  PayrollPreviewSummary,
} from "../../types";

export function extractReviewSummary(
  rawObj: Record<string, unknown>,
  previewFallback?: PayrollPreviewData | null,
  statusFallback?: PayrollRunStatus | null,
): PayrollPreviewSummary | null {
  const rawSummary = (rawObj.summary || rawObj.totals || rawObj.stats || previewFallback?.summary) as Record<string, unknown> | undefined;
  if (!rawSummary || typeof rawSummary !== "object") return null;

  return {
    employeeCount:
      (rawSummary.employeeCount ??
      rawSummary.employee_count ??
      rawSummary.totalEmployees ??
      rawSummary.total_employees ??
      previewFallback?.summary?.employeeCount ??
      statusFallback?.employees?.total ??
      null) as number | null,
    grossPayroll:
      (rawSummary.grossPayroll ??
      rawSummary.gross_payroll ??
      rawSummary.totalGross ??
      rawSummary.total_gross ??
      previewFallback?.summary?.grossPayroll ??
      null) as number | null,
    totalEarnings:
      (rawSummary.totalEarnings ??
      rawSummary.total_earnings ??
      rawSummary.grossPayroll ??
      rawSummary.gross_payroll ??
      previewFallback?.summary?.totalEarnings ??
      null) as number | null,
    totalDeductions:
      (rawSummary.totalDeductions ??
      rawSummary.total_deductions ??
      rawSummary.deductions ??
      previewFallback?.summary?.totalDeductions ??
      null) as number | null,
    netPayroll:
      (rawSummary.netPayroll ??
      rawSummary.net_payroll ??
      rawSummary.totalNet ??
      rawSummary.total_net ??
      previewFallback?.summary?.netPayroll ??
      null) as number | null,
    employerCost:
      (rawSummary.employerCost ??
      rawSummary.employer_cost ??
      rawSummary.totalCost ??
      rawSummary.total_cost ??
      previewFallback?.summary?.employerCost ??
      null) as number | null,
    employerContribution:
      (rawSummary.employerContribution ??
      rawSummary.employer_contribution ??
      previewFallback?.summary?.employerContribution ??
      null) as number | null,
  };
}
import type {
  PayrollPreviewData,
  PayrollPreviewSummary,
  PayrollPreviewValidationIssue,
  PayrollStatus,
} from "../types";

export function normalizePayrollPreviewData(runId: string, raw: unknown): PayrollPreviewData {
  if (!raw || typeof raw !== "object") {
    return {
      runId,
      status: "Provision Generated",
      summary: null,
    };
  }

  const r = raw as Record<string, unknown>;
  const periodId = (r.periodId || r.period_id || r.cycleId || r.cycle_id || null) as string | null;
  const periodName = (r.periodName || r.period_name || r.cycle_name || r.name || null) as string | null;
  const status = String(r.status || r.run_status || "Provision Generated");
  const runDate = (r.runDate || r.run_date || r.createdAt || r.created_at || null) as string | null;
  const generatedAt =
    (r.generatedAt || r.generated_at || r.updatedAt || r.updated_at || null) as string | null;

  // Raw summary
  const s = (r.summary || r.totals || r.stats || r) as Record<string, unknown>;
  const summary: PayrollPreviewSummary = {
    employeeCount:
      (s.employeeCount ?? s.employee_count ?? s.totalEmployees ?? s.total_employees ?? null) as number | null,
    grossPayroll: (s.grossPayroll ?? s.gross_payroll ?? s.totalGross ?? s.total_gross ?? null) as number | null,
    totalEarnings: (s.totalEarnings ?? s.total_earnings ?? s.grossPayroll ?? s.gross_payroll ?? null) as number | null,
    totalDeductions: (s.totalDeductions ?? s.total_deductions ?? s.deductions ?? null) as number | null,
    netPayroll: (s.netPayroll ?? s.net_payroll ?? s.totalNet ?? s.total_net ?? null) as number | null,
    employerCost: (s.employerCost ?? s.employer_cost ?? s.totalCost ?? s.total_cost ?? null) as number | null,
    employerContribution: (s.employerContribution ?? s.employer_contribution ?? null) as number | null,
  };

  // Raw validation
  let validation: PayrollPreviewData["validation"] = null;
  const v = (r.validation || r.validation_results) as Record<string, unknown> | undefined;
  if (v && typeof v === "object") {
    const mapIssue = (item: unknown, idx: number): PayrollPreviewValidationIssue => {
      if (typeof item === "string") {
        return { id: `issue_${idx}`, message: item };
      }
      const obj = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
      return {
        id: String(obj.id ?? `issue_${idx}`),
        category: typeof obj.category === "string" ? obj.category : undefined,
        message: String(obj.message ?? obj.error ?? obj.warning ?? obj.description ?? "Validation issue"),
        employeeId:
          typeof obj.employeeId === "string"
            ? obj.employeeId
            : typeof obj.employee_id === "string"
              ? obj.employee_id
              : undefined,
        employeeName:
          typeof obj.employeeName === "string"
            ? obj.employeeName
            : typeof obj.employee_name === "string"
              ? obj.employee_name
              : undefined,
      };
    };
    validation = {
      errors: Array.isArray(v.errors) ? v.errors.map(mapIssue) : [],
      warnings: Array.isArray(v.warnings) ? v.warnings.map(mapIssue) : [],
    };
  }

  return {
    runId,
    periodId,
    periodName,
    status,
    runDate,
    generatedAt,
    summary,
    validation,
    ...raw,
  };
}
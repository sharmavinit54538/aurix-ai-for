import type {
  PayrollPreviewEmployee,
  PayrollEmployeeEarnings,
  PayrollEmployeeDeductions,
  PayrollEmployeeAttendance,
} from "../types";

export function normalizePayrollEmployee(item: unknown): PayrollPreviewEmployee {
  if (!item || typeof item !== "object") {
    return {
      id: "",
      employeeId: "",
      name: "Unknown Employee",
      grossEarnings: null,
      totalDeductions: null,
      netPay: null,
    };
  }

  const it = item as Record<string, unknown>;
  const id = String(it.id || it._id || it.employee_id || it.employeeId || "");
  const employeeId = String(
    it.employeeId || it.employee_id || it.emp_id || it.employee_code || it.code || id,
  );
  const name =
    (it.name ||
      it.employee_name ||
      it.employeeName ||
      (it.first_name ? `${it.first_name} ${it.last_name || ""}`.trim() : "") ||
      "Unnamed Employee") as string;
  const email = (it.email || it.work_email || undefined) as string | undefined;
  const designation = (it.designation || it.job_title || it.role || undefined) as string | undefined;
  const department = (it.department || it.dept || it.department_name || undefined) as string | undefined;
  const location = (it.location || it.branch || it.city || undefined) as string | undefined;

  const grossEarnings =
    it.grossEarnings ??
    it.gross_earnings ??
    it.grossSalary ??
    it.gross_salary ??
    it.gross ??
    null;
  const totalDeductions =
    it.totalDeductions ??
    it.total_deductions ??
    it.deductions_total ??
    it.deductions ??
    null;
  const netPay =
    it.netPay ?? it.net_pay ?? it.netSalary ?? it.net_salary ?? it.net ?? null;
  const employerContribution =
    it.employerContribution ?? it.employer_contribution ?? it.employer_cost ?? null;

  const status = (it.status || it.payroll_status || "Processed") as string;
  const validationStatus = (
    it.validationStatus || it.validation_status || (it.has_issues ? "warning" : "valid")
  ) as string;

  // Earnings breakdown if present
  const rawEarnings = (it.earnings || (it.salary_breakdown as Record<string, unknown> | undefined)?.earnings || (it.components as Record<string, unknown> | undefined)?.earnings) as Record<string, unknown> | undefined;
  const earnings: PayrollEmployeeEarnings | undefined = rawEarnings
    ? {
        basic: (rawEarnings.basic ?? rawEarnings.basic_monthly ?? null) as number | null,
        hra: (rawEarnings.hra ?? rawEarnings.hra_monthly ?? null) as number | null,
        allowances: (rawEarnings.allowances ?? rawEarnings.other_allowances ?? null) as number | null,
        specialAllowance: (rawEarnings.specialAllowance ?? rawEarnings.special_allowance ?? null) as number | null,
        conveyance: (rawEarnings.conveyance ?? rawEarnings.conveyance_monthly ?? null) as number | null,
        overtime: (rawEarnings.overtime ?? rawEarnings.overtime_amount ?? null) as number | null,
        bonus: (rawEarnings.bonus ?? rawEarnings.bonus_amount ?? null) as number | null,
        incentives: (rawEarnings.incentives ?? null) as number | null,
        other: (rawEarnings.other ?? null) as number | null,
        ...rawEarnings,
      }
    : undefined;

  // Deductions breakdown if present
  const rawDeductions =
    (it.deductions || (it.salary_breakdown as Record<string, unknown> | undefined)?.deductions || (it.components as Record<string, unknown> | undefined)?.deductions) as Record<string, unknown> | undefined;
  const deductions: PayrollEmployeeDeductions | undefined = rawDeductions
    ? {
        pf: (rawDeductions.pf ?? rawDeductions.epf ?? rawDeductions.provident_fund ?? null) as number | null,
        esi: (rawDeductions.esi ?? rawDeductions.esic ?? null) as number | null,
        pt: (rawDeductions.pt ?? rawDeductions.professional_tax ?? null) as number | null,
        tds: (rawDeductions.tds ?? rawDeductions.tax ?? rawDeductions.income_tax ?? null) as number | null,
        incomeTax: (rawDeductions.incomeTax ?? rawDeductions.income_tax ?? null) as number | null,
        loan: (rawDeductions.loan ?? rawDeductions.loan_deduction ?? null) as number | null,
        advance: (rawDeductions.advance ?? rawDeductions.advance_salary ?? null) as number | null,
        other: (rawDeductions.other ?? null) as number | null,
        ...rawDeductions,
      }
    : undefined;

  // Attendance metrics if present
  const rawAtt = (it.attendance || it.attendance_metrics) as Record<string, unknown> | undefined;
  const attendance: PayrollEmployeeAttendance | undefined = rawAtt
    ? {
        workingDays: (rawAtt.workingDays ?? rawAtt.working_days ?? rawAtt.total_days ?? null) as number | null,
        paidDays: (rawAtt.paidDays ?? rawAtt.paid_days ?? null) as number | null,
        unpaidDays: (rawAtt.unpaidDays ?? rawAtt.unpaid_days ?? rawAtt.loss_of_pay_days ?? null) as number | null,
        leaveDays: (rawAtt.leaveDays ?? rawAtt.leave_days ?? null) as number | null,
        overtimeHours: (rawAtt.overtimeHours ?? rawAtt.overtime_hours ?? null) as number | null,
        lopDays: (rawAtt.lopDays ?? rawAtt.lop_days ?? null) as number | null,
        ...rawAtt,
      }
    : undefined;

  // Issues if present
  const rawIssues = it.issues || it.validation_issues || [];
  const issues = Array.isArray(rawIssues)
    ? rawIssues.map((iss: unknown) => {
        const i = (iss && typeof iss === "object" ? iss : {}) as Record<string, unknown>;
        return {
          id: (i.id as string | undefined),
          severity: String(i.severity || "warning"),
          message: String(i.message || iss),
        };
      })
    : undefined;

  return {
    id,
    employeeId,
    name,
    email,
    designation,
    department,
    location,
    grossEarnings: grossEarnings != null ? Number(grossEarnings) : null,
    totalDeductions: totalDeductions != null ? Number(totalDeductions) : null,
    netPay: netPay != null ? Number(netPay) : null,
    employerContribution: employerContribution != null ? Number(employerContribution) : null,
    status,
    validationStatus,
    issuesCount: issues ? issues.length : (Number(it.issues_count) || 0),
    issues,
    earnings,
    deductions,
    attendance,
    joiningDate: (it.joiningDate || it.joining_date || it.doj || it.date_of_joining || null) as string | null,
    employmentStatus: (
      it.employmentStatus ||
      it.employment_status ||
      it.employee_type ||
      it.employment_type ||
      null
    ) as string | null,
    financialYear: (it.financialYear || it.financial_year || it.fy || null) as string | null,
    periodName: (it.periodName || it.period_name || it.cycle_name || null) as string | null,
    periodId: (it.periodId || it.period_id || it.cycle_id || null) as string | null,
    runStatus: (it.runStatus || it.run_status || it.payroll_status || null) as string | null,
    calculationStatus: (it.calculationStatus || it.calculation_status || null) as string | null,
    statutory: (it.statutory || it.statutory_contributions || null) as PayrollPreviewEmployee["statutory"],
    salaryStructure: (it.salaryStructure || it.salary_structure || null) as PayrollPreviewEmployee["salaryStructure"],
    ytd: (it.ytd || it.year_to_date || null) as PayrollPreviewEmployee["ytd"],
    previousComparison: (
      it.previousComparison || it.previous_comparison || it.comparison || null
    ) as PayrollPreviewEmployee["previousComparison"],
    audit: (it.audit || it.calculation_metadata || null) as PayrollPreviewEmployee["audit"],
    bankInfo: (it.bankInfo || it.bank_details || it.bank || null) as PayrollPreviewEmployee["bankInfo"],
    ...it,
  };
}
import { MONTH_NAMES } from "./utils";
import type {
  PayrollPeriod,
  PayrollStatus,
  PayrollRunStatus,
  PayrollRunValidationIssue,
  PayrollRunStep,
  PayrollPreviewEmployee,
  PayrollEmployeeEarnings,
  PayrollEmployeeDeductions,
  PayrollEmployeeAttendance,
  PayrollPreviewData,
  PayrollPreviewSummary,
  PayrollPreviewValidationIssue,
  PayrollValidationSummary,
  PayrollValidationIssue,
  PayrollReviewData,
  PayrollApprovalInfo,
  PayrollAuditRecord,
  PayrollFinalizationData,
  PayrollFinalizationInfo,
  PayrollPayslipData,
  PayrollPayslipEmployeeInfo,
  PayrollPayslipAttendance,
  PayrollPayslipEarnings,
  PayrollPayslipDeductions,
  PayrollPayslipStatutory,
  PayrollPayslipEmployerContributions,
  PayrollPayslipDocument,
} from "./types";

// ── Normalizer Functions ──────────────────────────────────────────────

export function normalizePayrollPeriod(item: unknown): PayrollPeriod {
  if (!item || typeof item !== "object") {
    return {
      id: "",
      name: "",
      startDate: "",
      endDate: "",
    };
  }

  const it = item as Record<string, unknown>;
  const id = String(it.id || it.cycle_id || it.period_id || it._id || "");
  const month = Number(it.period_month ?? it.month ?? 0) || undefined;
  const year = Number(it.period_year ?? it.year ?? 0) || undefined;

  let name = String(it.name || it.period_name || it.title || "");
  if (!name && month && year) {
    name = `${MONTH_NAMES[month] || `Month ${month}`} ${year}`;
  } else if (!name && (it.startDate || it.start_date)) {
    name = String(it.startDate || it.start_date);
  }

  const startDate = String(it.startDate || it.start_date || "");
  const endDate = String(it.endDate || it.end_date || "");
  const payDate = String(it.payDate || it.pay_date || "");
  const rawStatus = (it.status || (it.is_locked ? "Locked" : "Open")) as PayrollStatus;
  const employeeCount = it.employeeCount ?? it.employee_count ?? it.total_employees ?? null;
  const isLocked = Boolean(
    it.is_locked ||
    it.isLocked ||
    String(rawStatus).toLowerCase() === "locked" ||
    String(rawStatus).toLowerCase() === "finalized" ||
    String(rawStatus).toLowerCase() === "closed",
  );
  const isCurrent = Boolean(it.isCurrent || it.is_current);
  const createdAt = String(it.createdAt || it.created_at || "");
  const updatedAt = String(it.updatedAt || it.updated_at || "");
  const remarks = String(it.remarks || it.notes || "");

  return {
    id,
    name: name || "Unnamed Period",
    startDate,
    endDate,
    payDate,
    status: rawStatus,
    employeeCount: employeeCount != null ? Number(employeeCount) : null,
    periodMonth: month,
    periodYear: year,
    isCurrent,
    isLocked,
    createdAt,
    updatedAt,
    remarks,
  };
}

export function normalizePayrollRunStatus(runId: string, raw: unknown): PayrollRunStatus {
  if (!raw || typeof raw !== "object") {
    return {
      runId,
      status: "Processing",
    };
  }

  const r = raw as Record<string, unknown>;
  const status = (
    r.status ||
    r.run_status ||
    r.state ||
    r.job_status ||
    (r.is_completed ? "Completed" : r.is_failed ? "Failed" : "Processing")
  ) as PayrollStatus;

  const periodId = (r.periodId || r.period_id || r.cycleId || r.cycle_id || null) as string | null;
  const periodName = (r.periodName || r.period_name || r.cycle_name || r.name || null) as string | null;
  const jobId = (r.jobId || r.job_id || r.id || null) as string | null;

  // Real progress ONLY if provided as number
  let progress: number | null = null;
  if (typeof r.progress === "number" && !isNaN(r.progress)) {
    progress = Math.min(100, Math.max(0, r.progress));
  } else if (typeof r.percentage === "number" && !isNaN(r.percentage)) {
    progress = Math.min(100, Math.max(0, r.percentage));
  } else if (typeof r.percent_complete === "number" && !isNaN(r.percent_complete)) {
    progress = Math.min(100, Math.max(0, r.percent_complete));
  }

  const currentStep = (r.currentStep || r.current_step || r.step || r.operation || null) as string | null;

  // Real employees count ONLY if provided
  let employees: PayrollRunStatus["employees"] = null;
  const rawEmp = (r.employees || r.employee_counts || r.stats) as Record<string, unknown> | undefined;
  if (rawEmp && typeof rawEmp === "object") {
    employees = {
      total: (rawEmp.total ?? rawEmp.total_employees ?? r.totalEmployees ?? null) as number | null,
      processed: (rawEmp.processed ?? rawEmp.processed_count ?? r.processedEmployees ?? null) as number | null,
      failed: (rawEmp.failed ?? rawEmp.failed_count ?? null) as number | null,
    };
  } else if (
    r.totalEmployees != null ||
    r.processedEmployees != null ||
    r.employee_count != null
  ) {
    employees = {
      total: (r.totalEmployees ?? r.employee_count ?? r.total_count ?? null) as number | null,
      processed: (r.processedEmployees ?? r.processed_count ?? null) as number | null,
      failed: (r.failedEmployees ?? null) as number | null,
    };
  }

  // Steps if provided by backend
  let steps: PayrollRunStep[] | null = null;
  const rawSteps = r.steps || r.pipeline_steps || r.operations;
  if (Array.isArray(rawSteps)) {
    steps = rawSteps.map((s: unknown, idx: number) => {
      const step = (s && typeof s === "object" ? s : {}) as Record<string, unknown>;
      return {
        id: String(step.id || step.step_id || `step-${idx}`),
        name: String(step.name || step.title || step.step_name || `Step ${idx + 1}`),
        status: String(step.status || step.state || "pending"),
        details: (step.details || step.message || undefined) as string | undefined,
        order: step.order != null ? Number(step.order) : idx,
      };
    });
  }

  // Error details if provided by backend
  let error: PayrollRunStatus["error"] = null;
  if (r.error) {
    if (typeof r.error === "string") {
      error = { message: r.error };
    } else if (typeof r.error === "object") {
      const errObj = r.error as Record<string, unknown>;
      error = {
        code: (errObj.code || errObj.error_code) as string | undefined,
        message: String(errObj.message || errObj.detail || r.error),
      };
    }
  } else if (r.errorMessage || r.error_message) {
    error = { message: String(r.errorMessage || r.error_message) };
  }

  // Validation issues if provided by backend
  let validationIssues: PayrollRunValidationIssue[] | null = null;
  const rawIssues = r.validationIssues || r.validation_issues || r.issues;
  if (Array.isArray(rawIssues)) {
    validationIssues = rawIssues.map((iss: unknown, idx: number) => {
      const item = (iss && typeof iss === "object" ? iss : {}) as Record<string, unknown>;
      return {
        id: String(item.id || `issue-${idx}`),
        severity: String(item.severity || item.level || "warning"),
        category: (item.category || item.type || "General") as string,
        message: String(item.message || item.description || ""),
        employeeId: (item.employeeId || item.employee_id) as string | undefined,
        employeeName: (item.employeeName || item.employee_name) as string | undefined,
        resolved: Boolean(item.resolved),
      };
    });
  }

  return {
    runId,
    jobId,
    periodId,
    periodName,
    status,
    progress,
    currentStep,
    employees,
    steps,
    error,
    validationIssues,
    startedAt: (r.startedAt || r.started_at || null) as string | null,
    completedAt: (r.completedAt || r.completed_at || null) as string | null,
    ...r,
  };
}

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

export function normalizePayrollValidationSummary(
  runId: string,
  raw: unknown,
): PayrollValidationSummary {
  if (!raw || typeof raw !== "object") {
    return {
      runId,
      status: "Not Started",
      totalIssues: 0,
      errorsCount: 0,
      warningsCount: 0,
      affectedEmployeesCount: 0,
      blockingCount: null,
      issues: [],
    };
  }

  const rawObj = raw as Record<string, unknown>;
  let rawList: Record<string, unknown>[] = [];
  if (Array.isArray(raw)) {
    rawList = raw.filter((x): x is Record<string, unknown> => Boolean(x && typeof x === "object"));
  } else if (Array.isArray(rawObj.issues)) {
    rawList = (rawObj.issues as unknown[]).filter((x): x is Record<string, unknown> => Boolean(x && typeof x === "object"));
  } else if (Array.isArray(rawObj.items)) {
    rawList = (rawObj.items as unknown[]).filter((x): x is Record<string, unknown> => Boolean(x && typeof x === "object"));
  } else if (Array.isArray(rawObj.validation_issues)) {
    rawList = (rawObj.validation_issues as unknown[]).filter((x): x is Record<string, unknown> => Boolean(x && typeof x === "object"));
  } else if (Array.isArray(rawObj.validationIssues)) {
    rawList = (rawObj.validationIssues as unknown[]).filter((x): x is Record<string, unknown> => Boolean(x && typeof x === "object"));
  } else if (rawObj.validation && typeof rawObj.validation === "object") {
    const val = rawObj.validation as Record<string, unknown>;
    const errs = Array.isArray(val.errors)
      ? (val.errors as unknown[]).map((e: unknown) => ({
          ...((e && typeof e === "object" ? e : {}) as Record<string, unknown>),
          severity: "error",
          blocking: true,
        }))
      : [];
    const warns = Array.isArray(val.warnings)
      ? (val.warnings as unknown[]).map((w: unknown) => ({
          ...((w && typeof w === "object" ? w : {}) as Record<string, unknown>),
          severity: "warning",
          blocking: false,
        }))
      : [];
    rawList = [...errs, ...warns];
  }

  const issues: PayrollValidationIssue[] = rawList.map((item, idx) => {
    // Preserve backend-provided severity without guessing from text
    const rawSev =
      item.severity || item.level || item.type || (item.blocking ? "error" : "warning");
    const sev = String(rawSev).toLowerCase();

    // Preserve blocking ONLY if provided by backend; do not infer from text
    const blocking =
      item.blocking !== undefined
        ? Boolean(item.blocking)
        : item.is_blocking !== undefined
          ? Boolean(item.is_blocking)
          : undefined;

    return {
      id: String(item.id || item.issue_id || `issue-${idx}`),
      severity: sev,
      category: (item.category || item.type || item.module || "General") as string,
      code: (item.code || item.error_code || item.rule_id || item.ruleCode || undefined) as string | undefined,
      message: String(item.message || item.description || item.detail || "Validation issue detected"),
      employeeId: (item.employeeId || item.employee_id || item.emp_id || undefined) as string | undefined,
      employeeName: (item.employeeName || item.employee_name || item.name || undefined) as string | undefined,
      department: (item.department || item.dept || item.department_name || undefined) as string | undefined,
      component: (item.component || item.field || item.salary_component || undefined) as string | undefined,
      blocking,
      status: String(item.status || (item.resolved ? "resolved" : "open")),
      detectedAt: (item.detectedAt || item.detected_at || item.created_at || item.createdAt || undefined) as string | undefined,
      resolved: item.resolved !== undefined ? Boolean(item.resolved) : undefined,
      resolution: (item.resolution || item.resolution_notes || item.notes || undefined) as string | undefined,
      resolvedAt: (item.resolvedAt || item.resolved_at || undefined) as string | undefined,
      resolvedBy: (item.resolvedBy || item.resolved_by || undefined) as string | undefined,
      source: (item.source || item.reference || item.rule || undefined) as string | undefined,
      ...item,
    };
  });

  const errorsArr = Array.isArray(rawObj.errors) ? rawObj.errors : undefined;
  const errorsCount = Number(
    rawObj.errorsCount ??
      rawObj.errors_count ??
      errorsArr?.length ??
      issues.filter(
        (i) => i.severity === "error" || i.severity === "critical" || i.severity === "fatal",
      ).length,
  );
  const warningsArr = Array.isArray(rawObj.warnings) ? rawObj.warnings : undefined;
  const warningsCount = Number(
    rawObj.warningsCount ??
      rawObj.warnings_count ??
      warningsArr?.length ??
      issues.filter(
        (i) => i.severity === "warning" || i.severity === "advisory" || i.severity === "info",
      ).length,
  );
  const totalIssues = Number(rawObj.totalIssues ?? rawObj.total_issues ?? rawObj.total ?? issues.length);

  // Derive blocking count ONLY if backend provides blocking flags or counts
  const hasBlockingInfo =
    rawObj.blockingCount != null ||
    rawObj.blocking_count != null ||
    rawObj.blockingIssuesCount != null ||
    issues.some((i) => i.blocking !== undefined);

  const blockingCount: number | null = hasBlockingInfo
    ? Number(
        rawObj.blockingCount ??
          rawObj.blocking_count ??
          rawObj.blockingIssuesCount ??
          issues.filter((i) => i.blocking === true).length,
      )
    : null;

  const affectedEmps = new Set<string>();
  issues.forEach((i) => {
    if (i.employeeId) affectedEmps.add(i.employeeId);
  });
  const affectedEmployeesCount = Number(
    rawObj.affectedEmployeesCount ??
      rawObj.affected_employees ??
      rawObj.affectedEmployees ??
      (affectedEmps.size || 0),
  );

  let status = String(rawObj.status || rawObj.validation_status || rawObj.state || "");
  if (!status) {
    if (errorsCount > 0) status = "Failed";
    else if (warningsCount > 0) status = "Warning";
    else if (issues.length === 0) status = "Passed";
    else status = "Completed";
  }

  return {
    runId,
    status,
    periodName: (rawObj.periodName || rawObj.period_name || null) as string | null,
    periodId: (rawObj.periodId || rawObj.period_id || null) as string | null,
    runStatus: (rawObj.runStatus || rawObj.run_status || null) as string | null,
    totalIssues,
    errorsCount,
    warningsCount,
    affectedEmployeesCount,
    blockingCount,
    lastValidatedAt: (rawObj.lastValidatedAt || rawObj.last_validated_at || rawObj.validatedAt || rawObj.validated_at || null) as string | null,
    issues,
    ...rawObj,
  };
}

export function normalizePayrollReviewData(
  runId: string,
  raw: unknown,
  previewFallback?: PayrollPreviewData | null,
  validationFallback?: PayrollValidationSummary | null,
  statusFallback?: PayrollRunStatus | null,
): PayrollReviewData {
  const rawObj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const periodId =
    (rawObj.periodId ||
    rawObj.period_id ||
    rawObj.cycleId ||
    rawObj.cycle_id ||
    previewFallback?.periodId ||
    statusFallback?.periodId ||
    null) as string | null;

  const periodName =
    (rawObj.periodName ||
    rawObj.period_name ||
    rawObj.cycleName ||
    rawObj.cycle_name ||
    previewFallback?.periodName ||
    statusFallback?.periodName ||
    null) as string | null;

  const rawStatus = (rawObj.status ||
    rawObj.run_status ||
    rawObj.state ||
    previewFallback?.status ||
    statusFallback?.status ||
    "Under Review") as string;

  const runDate =
    (rawObj.runDate ||
    rawObj.run_date ||
    rawObj.createdAt ||
    rawObj.created_at ||
    previewFallback?.runDate ||
    null) as string | null;

  const generatedAt =
    (rawObj.generatedAt ||
    rawObj.generated_at ||
    rawObj.calculatedAt ||
    rawObj.calculated_at ||
    previewFallback?.generatedAt ||
    null) as string | null;

  const lastUpdatedAt =
    (rawObj.lastUpdatedAt ||
    rawObj.last_updated_at ||
    rawObj.updatedAt ||
    rawObj.updated_at ||
    rawObj.approvedAt ||
    rawObj.approved_at ||
    null) as string | null;

  // Summary extraction
  let summary: PayrollPreviewSummary | null = null;
  const rawSummary = (rawObj.summary || rawObj.totals || rawObj.stats || previewFallback?.summary) as Record<string, unknown> | undefined;
  if (rawSummary && typeof rawSummary === "object") {
    summary = {
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

  // Validation details extraction
  let validation: PayrollReviewData["validation"] = null;
  const rawVal = (rawObj.validation || rawObj.validation_summary || validationFallback) as Record<string, unknown> | PayrollValidationSummary | undefined;
  if (rawVal && typeof rawVal === "object") {
    const valObj = rawVal as Record<string, unknown>;
    const rawValIssues = Array.isArray(valObj.issues) ? valObj.issues : undefined;
    validation = {
      status: (valObj.status || valObj.validation_status || validationFallback?.status || null) as string | null,
      totalIssues: Number(
        valObj.totalIssues ??
          valObj.total_issues ??
          validationFallback?.totalIssues ??
          (rawValIssues?.length || 0),
      ),
      errorsCount: Number(
        valObj.errorsCount ??
          valObj.errors_count ??
          validationFallback?.errorsCount ??
          (Array.isArray(valObj.errors) ? valObj.errors.length : 0),
      ),
      warningsCount: Number(
        valObj.warningsCount ??
          valObj.warnings_count ??
          validationFallback?.warningsCount ??
          (Array.isArray(valObj.warnings) ? valObj.warnings.length : 0),
      ),
      affectedEmployeesCount: Number(
        valObj.affectedEmployeesCount ??
          valObj.affected_employees ??
          validationFallback?.affectedEmployeesCount ??
          0,
      ),
      blockingCount:
        valObj.blockingCount != null
          ? Number(valObj.blockingCount)
          : valObj.blocking_count != null
            ? Number(valObj.blocking_count)
            : validationFallback?.blockingCount != null
              ? Number(validationFallback.blockingCount)
              : null,
      issues: Array.isArray(valObj.issues)
        ? (valObj.issues as PayrollValidationIssue[])
        : Array.isArray(validationFallback?.issues)
          ? validationFallback.issues
          : undefined,
    };
  }

  // Approval details extraction
  const rawApp = (rawObj.approval || rawObj.approval_status || rawObj) as Record<string, unknown> | undefined;
  let approval: PayrollApprovalInfo | null = null;
  if (rawApp && typeof rawApp === "object") {
    const appStatus =
      (rawApp.status ||
      rawApp.approval_status ||
      (String(rawStatus).toLowerCase() === "approved"
        ? "approved"
        : String(rawStatus).toLowerCase() === "rejected"
          ? "rejected"
          : "pending")) as PayrollApprovalInfo["status"];

    approval = {
      status: appStatus,
      approvedBy:
        (rawApp.approvedBy ||
        rawApp.approved_by ||
        rawApp.approver_id ||
        rawObj.approvedBy ||
        rawObj.approved_by ||
        null) as string | null,
      approvedByName:
        (rawApp.approvedByName ||
        rawApp.approved_by_name ||
        rawApp.approver_name ||
        rawObj.approvedByName ||
        rawObj.approved_by_name ||
        null) as string | null,
      approvedAt:
        (rawApp.approvedAt ||
        rawApp.approved_at ||
        rawObj.approvedAt ||
        rawObj.approved_at ||
        null) as string | null,
      rejectedBy:
        (rawApp.rejectedBy ||
        rawApp.rejected_by ||
        rawObj.rejectedBy ||
        rawObj.rejected_by ||
        null) as string | null,
      rejectedByName:
        (rawApp.rejectedByName ||
        rawApp.rejected_by_name ||
        rawObj.rejectedByName ||
        rawObj.rejected_by_name ||
        null) as string | null,
      rejectedAt:
        (rawApp.rejectedAt ||
        rawApp.rejected_at ||
        rawObj.rejectedAt ||
        rawObj.rejected_at ||
        null) as string | null,
      rejectionReason:
        (rawApp.rejectionReason ||
        rawApp.rejection_reason ||
        rawObj.rejectionReason ||
        rawObj.rejection_reason ||
        null) as string | null,
      comments:
        (rawApp.comments ||
        rawApp.comment ||
        rawApp.notes ||
        rawObj.approvalComments ||
        rawObj.approval_comments ||
        null) as string | null,
      canApprove: Boolean(rawApp.canApprove ?? rawApp.can_approve ?? false),
      canReject: Boolean(rawApp.canReject ?? rawApp.can_reject ?? false),
      blockingReasons: (rawApp.blockingReasons || rawApp.blocking_reasons || []) as string[],
      ...rawApp,
    };
  }

  // Audit log extraction
  let auditLog: PayrollAuditRecord[] | null = null;
  const rawAudit = rawObj.auditLog || rawObj.audit_log || rawObj.history || rawObj.timeline;
  if (Array.isArray(rawAudit)) {
    auditLog = (rawAudit as unknown[]).map((item: unknown) => {
      const it = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
      return {
        action: String(it.action || it.event || "Update"),
        user: (it.user || it.user_id || null) as string | null,
        userName: (it.userName || it.user_name || it.name || null) as string | null,
        timestamp: (it.timestamp || it.created_at || it.createdAt || null) as string | null,
        comment: (it.comment || it.message || it.notes || null) as string | null,
        previousStatus: (it.previousStatus || it.previous_status || null) as string | null,
        newStatus: (it.newStatus || it.new_status || null) as string | null,
        ...it,
      };
    });
  }

  return {
    runId,
    periodId,
    periodName,
    status: rawStatus,
    validationStatus: validation?.status || null,
    runDate,
    generatedAt,
    lastUpdatedAt,
    summary,
    validation,
    approval,
    auditLog,
    ...rawObj,
  };
}

export function normalizePayrollFinalizationData(
  runId: string,
  raw: unknown,
  reviewFallback?: PayrollReviewData | null,
): PayrollFinalizationData {
  const rawObj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const periodId =
    (rawObj.periodId ||
    rawObj.period_id ||
    rawObj.cycleId ||
    rawObj.cycle_id ||
    reviewFallback?.periodId ||
    null) as string | null;

  const periodName =
    (rawObj.periodName ||
    rawObj.period_name ||
    rawObj.cycleName ||
    rawObj.cycle_name ||
    reviewFallback?.periodName ||
    null) as string | null;

  const rawStatus = (rawObj.status ||
    rawObj.run_status ||
    rawObj.state ||
    reviewFallback?.status ||
    "Approved") as string;

  const isLocked = Boolean(
    rawObj.isLocked ||
    rawObj.is_locked ||
    String(rawStatus).toLowerCase() === "locked" ||
    String(rawStatus).toLowerCase() === "finalized" ||
    String(rawStatus).toLowerCase() === "closed",
  );

  const isFinalized = Boolean(
    rawObj.isFinalized ||
    rawObj.is_finalized ||
    String(rawStatus).toLowerCase() === "finalized" ||
    String(rawStatus).toLowerCase() === "closed",
  );

  const summary = (rawObj.summary || reviewFallback?.summary || null) as PayrollPreviewSummary | null;
  const validation = (rawObj.validation || reviewFallback?.validation || null) as PayrollReviewData["validation"];
  const approval = (rawObj.approval || reviewFallback?.approval || null) as PayrollApprovalInfo | null;

  const rawFin = (rawObj.finalization || rawObj.finalized || rawObj) as Record<string, unknown> | undefined;
  let finalization: PayrollFinalizationInfo | null = null;
  if (rawFin && typeof rawFin === "object") {
    finalization = {
      isFinalized: isFinalized || Boolean(rawFin.isFinalized || rawFin.is_finalized),
      isLocked: isLocked || Boolean(rawFin.isLocked || rawFin.is_locked),
      finalizedBy:
        (rawFin.finalizedBy ||
        rawFin.finalized_by ||
        rawObj.finalizedBy ||
        rawObj.finalized_by ||
        null) as string | null,
      finalizedByName:
        (rawFin.finalizedByName ||
        rawFin.finalized_by_name ||
        rawObj.finalizedByName ||
        rawObj.finalized_by_name ||
        null) as string | null,
      finalizedAt:
        (rawFin.finalizedAt ||
        rawFin.finalized_at ||
        rawObj.finalizedAt ||
        rawObj.finalized_at ||
        null) as string | null,
      finalizationNotes:
        (rawFin.finalizationNotes ||
        rawFin.finalization_notes ||
        rawFin.notes ||
        rawObj.finalizationNotes ||
        rawObj.finalization_notes ||
        null) as string | null,
      referenceNumber:
        (rawFin.referenceNumber ||
        rawFin.reference_number ||
        rawFin.ref ||
        rawObj.referenceNumber ||
        rawObj.reference_number ||
        null) as string | null,
      canFinalize: Boolean(rawFin.canFinalize ?? rawFin.can_finalize ?? false),
      blockingReasons: (rawFin.blockingReasons || rawFin.blocking_reasons || []) as string[],
      ...rawFin,
    };
  }

  const auditLog = (rawObj.auditLog || rawObj.audit_log || reviewFallback?.auditLog || null) as PayrollAuditRecord[] | null;

  return {
    runId,
    periodId,
    periodName,
    status: rawStatus,
    isLocked,
    isFinalized,
    validationStatus: validation?.status || null,
    approvalStatus: approval?.status || null,
    runDate: (rawObj.runDate || rawObj.run_date || reviewFallback?.runDate || null) as string | null,
    generatedAt: (rawObj.generatedAt || rawObj.generated_at || reviewFallback?.generatedAt || null) as string | null,
    lastUpdatedAt:
      (rawObj.lastUpdatedAt ||
      rawObj.last_updated_at ||
      reviewFallback?.lastUpdatedAt ||
      null) as string | null,
    summary,
    validation,
    approval,
    finalization,
    auditLog,
    ...rawObj,
  };
}

// ── Step 9: Normalize Payslip Data ────────────────────────────────────

export function normalizePayrollPayslipData(
  runId: string,
  employeeId: string,
  raw: unknown,
  empFallback?: PayrollPreviewEmployee | null,
  finalFallback?: PayrollFinalizationData | null,
): PayrollPayslipData {
  const d = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const emp = (d.employee || empFallback || {}) as Record<string, unknown>;
  const att = (d.attendance || empFallback?.attendance || {}) as Record<string, unknown>;
  const earn = (d.earnings || empFallback?.earnings || {}) as Record<string, unknown>;
  const ded = (d.deductions || empFallback?.deductions || {}) as Record<string, unknown>;
  const stat = (d.statutory || empFallback?.statutory || {}) as Record<string, unknown>;
  const doc = (d.document || d.payslipDocument || {}) as Record<string, unknown>;

  const rawStatus = (d.status ||
    d.payslipStatus ||
    finalFallback?.status ||
    empFallback?.runStatus ||
    "Finalized") as string;

  const isFinalized = Boolean(
    d.isFinalized ||
    d.is_finalized ||
    finalFallback?.isFinalized ||
    String(rawStatus).toLowerCase() === "finalized" ||
    String(rawStatus).toLowerCase() === "closed" ||
    String(rawStatus).toLowerCase() === "locked",
  );

  const isLocked = Boolean(
    d.isLocked ||
    d.is_locked ||
    finalFallback?.isLocked ||
    String(rawStatus).toLowerCase() === "locked" ||
    String(rawStatus).toLowerCase() === "finalized",
  );

  const statEmployee = stat && typeof stat === "object" ? (stat.employee as Record<string, unknown> | undefined) : undefined;
  const statEmployer = stat && typeof stat === "object" ? (stat.employer as Record<string, unknown> | undefined) : undefined;

  return {
    id: String(d.id || d.payslipId || d.payslip_id || `${runId}_${employeeId}`),
    runId: String(d.runId || d.run_id || runId),
    employeeId: String(d.employeeId || d.employee_id || employeeId),
    payslipNumber:
      (d.payslipNumber ||
      d.payslip_number ||
      d.referenceNumber ||
      d.reference_number ||
      d.slipNo ||
      null) as string | null,
    referenceNumber:
      (d.referenceNumber ||
      d.reference_number ||
      finalFallback?.finalization?.referenceNumber ||
      null) as string | null,
    periodName:
      (d.periodName ||
      d.period_name ||
      finalFallback?.periodName ||
      empFallback?.periodName ||
      null) as string | null,
    periodId:
      (d.periodId ||
      d.period_id ||
      finalFallback?.periodId ||
      empFallback?.periodId ||
      null) as string | null,
    financialYear:
      (d.financialYear ||
      d.financial_year ||
      empFallback?.financialYear ||
      null) as string | null,
    startDate: (d.startDate || d.start_date || d.periodStartDate || null) as string | null,
    endDate: (d.endDate || d.end_date || d.periodEndDate || null) as string | null,
    paymentDate: (d.paymentDate || d.payment_date || null) as string | null,
    finalizedAt:
      (d.finalizedAt ||
      d.finalized_at ||
      finalFallback?.finalization?.finalizedAt ||
      null) as string | null,
    finalizedByName:
      (d.finalizedByName ||
      d.finalized_by_name ||
      finalFallback?.finalization?.finalizedByName ||
      null) as string | null,
    status: rawStatus,
    isFinalized,
    isLocked,
    employee: {
      id: String(emp.id || emp.employeeId || employeeId),
      name: String(emp.name || emp.employeeName || emp.full_name || "—"),
      department: (emp.department || emp.dept || null) as string | null,
      designation: (emp.designation || emp.role || null) as string | null,
      location: (emp.location || emp.branch || null) as string | null,
      joiningDate: (emp.joiningDate || emp.joining_date || emp.doj || null) as string | null,
      employmentStatus: (emp.employmentStatus || emp.employment_status || null) as string | null,
      pan: (emp.pan || emp.panNumber || emp.pan_number || null) as string | null,
      uan: (emp.uan || emp.uanNumber || emp.uan_number || null) as string | null,
      pfNumber: (emp.pfNumber || emp.pf_number || null) as string | null,
      esiNumber: (emp.esiNumber || emp.esi_number || null) as string | null,
      bankInfo: (emp.bankInfo || emp.bank || null) as PayrollPayslipEmployeeInfo["bankInfo"],
    },
    attendance: {
      workingDays: (att.workingDays ?? att.working_days ?? att.totalDays ?? null) as number | null,
      paidDays: (att.paidDays ?? att.paid_days ?? null) as number | null,
      lopDays: (att.lopDays ?? att.lop_days ?? att.unpaidDays ?? null) as number | null,
      leaveDays: (att.leaveDays ?? att.leave_days ?? null) as number | null,
      presentDays: (att.presentDays ?? att.present_days ?? null) as number | null,
      holidays: (att.holidays ?? att.holiday_days ?? null) as number | null,
      weeklyOffs: (att.weeklyOffs ?? att.weekly_offs ?? null) as number | null,
      overtimeHours: (att.overtimeHours ?? att.overtime_hours ?? null) as number | null,
      ...att,
    },
    earnings: {
      basic: (earn.basic ?? earn.basic_salary ?? null) as number | null,
      hra: (earn.hra ?? earn.house_rent_allowance ?? null) as number | null,
      conveyance: (earn.conveyance ?? earn.conveyance_allowance ?? null) as number | null,
      specialAllowance: (earn.specialAllowance ?? earn.special_allowance ?? null) as number | null,
      medicalAllowance: (earn.medicalAllowance ?? earn.medical_allowance ?? null) as number | null,
      otherAllowances: (earn.otherAllowances ?? earn.other_allowances ?? earn.allowances ?? null) as number | null,
      overtime: (earn.overtime ?? earn.overtime_pay ?? null) as number | null,
      bonus: (earn.bonus ?? null) as number | null,
      incentives: (earn.incentives ?? earn.incentive ?? null) as number | null,
      arrears: (earn.arrears ?? null) as number | null,
      reimbursements: (earn.reimbursements ?? earn.reimbursement ?? null) as number | null,
      otherEarnings: (earn.otherEarnings ?? earn.other ?? null) as number | null,
      grossEarnings:
        (d.grossEarnings ??
        d.gross_earnings ??
        earn.grossEarnings ??
        earn.gross_earnings ??
        empFallback?.grossEarnings ??
        null) as number | null,
      components: Array.isArray(earn.components) ? earn.components : undefined,
    },
    deductions: {
      pf: (ded.pf ?? ded.epf ?? ded.provident_fund ?? null) as number | null,
      esi: (ded.esi ?? ded.esic ?? null) as number | null,
      pt: (ded.pt ?? ded.professional_tax ?? null) as number | null,
      tds: (ded.tds ?? ded.income_tax ?? ded.tax ?? null) as number | null,
      loan: (ded.loan ?? ded.loan_deduction ?? null) as number | null,
      advance: (ded.advance ?? ded.advance_salary ?? null) as number | null,
      otherDeductions: (ded.otherDeductions ?? ded.other_deductions ?? ded.other ?? null) as number | null,
      totalDeductions:
        (d.totalDeductions ??
        d.total_deductions ??
        ded.totalDeductions ??
        ded.total_deductions ??
        empFallback?.totalDeductions ??
        null) as number | null,
      components: Array.isArray(ded.components) ? ded.components : undefined,
    },
    statutory: stat && typeof stat === "object" ? {
      employeePf: (statEmployee?.epf ?? stat.employeePf ?? stat.employee_pf ?? ded.pf ?? null) as number | null,
      employerPf: (statEmployer?.epf ?? stat.employerPf ?? stat.employer_pf ?? null) as number | null,
      employeeEsi: (statEmployee?.esi ?? stat.employeeEsi ?? stat.employee_esi ?? ded.esi ?? null) as number | null,
      employerEsi: (statEmployer?.esi ?? stat.employerEsi ?? stat.employer_esi ?? null) as number | null,
      pt: (statEmployee?.pt ?? stat.pt ?? ded.pt ?? null) as number | null,
      tds: (statEmployee?.tds ?? stat.tds ?? ded.tds ?? null) as number | null,
      eps: (statEmployer?.eps ?? stat.eps ?? null) as number | null,
      edli: (statEmployer?.edli ?? stat.edli ?? null) as number | null,
      other: (stat.other || null) as Record<string, unknown> | number | null,
    } : null,
    employerContributions: (d.employerContributions || (statEmployer ? {
      pf: (statEmployer.epf ?? null) as number | null,
      esi: (statEmployer.esi ?? null) as number | null,
      eps: (statEmployer.eps ?? null) as number | null,
      edli: (statEmployer.edli ?? null) as number | null,
      total: (empFallback?.employerContribution ?? null) as number | null,
    } : null)) as PayrollPayslipData["employerContributions"],
    netPay:
      (d.netPay ??
      d.net_pay ??
      empFallback?.netPay ??
      null) as number | null,
    netPayInWords: (d.netPayInWords || d.net_pay_in_words || null) as string | null,
    salaryStructure: (d.salaryStructure || empFallback?.salaryStructure || null) as PayrollPayslipData["salaryStructure"],
    ytd: (d.ytd || empFallback?.ytd || null) as PayrollPayslipData["ytd"],
    document: {
      pdfUrl: (doc.pdfUrl || doc.pdf_url || d.pdfUrl || d.pdf_url || null) as string | null,
      downloadUrl: (doc.downloadUrl || doc.download_url || d.downloadUrl || d.download_url || null) as string | null,
      documentId: (doc.documentId || doc.document_id || d.documentId || null) as string | null,
      hasDocument: Boolean(doc.pdfUrl || doc.downloadUrl || doc.hasDocument || d.hasDocument),
      mimeType: String(doc.mimeType || doc.mime_type || "application/pdf"),
    },
    notes: (d.notes || finalFallback?.finalization?.finalizationNotes || null) as string | null,
  };
}
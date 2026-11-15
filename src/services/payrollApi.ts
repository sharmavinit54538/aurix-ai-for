import apiInstance from "@/api/apiInstance";
import { generateIdempotencyKey } from "@/features/payroll/utils/idempotency";
import {
  normalizePayslip,
  normalizePayslipHistoryItem,
} from "./payroll/normalizers/normalizePayslip";
import {
  formatPeriodLabel,
  pickFirst,
  resolveMonetaryField,
  toNullableNumber,
  toNullableString,
} from "./payroll/normalizers/payslipHelpers";
import type {
  PaymentBatch,
  PayrollDashboardData,
  PayrollEmployeeRecord,
  PayrollFinalizationData,
  PayrollPayslipData,
  PayrollPeriod,
  PayrollPreviewData,
  PayrollPreviewEmployee,
  PayrollReviewData,
  PayrollRun,
  PayrollRunStatus,
  PayrollRunStep,
  PayrollStatus,
  PayrollSummaryMetrics,
  PayrollValidationIssue,
  PayrollValidationSummary,
  PayslipHistoryItem,
  PayslipItem,
  SalaryComponent,
} from "./payroll/types";

export type {
  PaymentBatch,
  PayrollDashboardData,
  PayrollEmployeeRecord,
  PayrollFinalizationData,
  PayrollPayslipData,
  PayrollPeriod,
  PayrollPreviewData,
  PayrollPreviewEmployee,
  PayrollReviewData,
  PayrollRun,
  PayrollRunStatus,
  PayrollRunStep,
  PayrollStatus,
  PayrollSummaryMetrics,
  PayrollValidationIssue,
  PayrollValidationSummary,
  PayslipHistoryItem,
  PayslipItem,
  SalaryComponent,
};

function unwrapPayload<T = any>(res: any): T {
  if (res?.data?.data !== undefined) return res.data.data as T;
  return (res?.data ?? res) as T;
}

function normalizeSummary(raw: any): PayrollSummaryMetrics {
  const s = raw?.summary ?? raw ?? {};
  return {
    employeeCount: toNullableNumber(
      pickFirst(s.employeeCount, s.employee_count, s.total_employees, s.headcount)
    ),
    grossPayroll: resolveMonetaryField(
      pickFirst(s.grossPayroll, s.gross_payroll, s.total_gross),
      pickFirst(s.gross_payroll_paise, s.grossPayrollPaise)
    ),
    totalEarnings: resolveMonetaryField(
      pickFirst(s.totalEarnings, s.total_earnings, s.grossPayroll, s.gross_payroll),
      pickFirst(s.total_earnings_paise, s.totalEarningsPaise)
    ),
    totalDeductions: resolveMonetaryField(
      pickFirst(s.totalDeductions, s.total_deductions),
      pickFirst(s.total_deductions_paise, s.totalDeductionsPaise)
    ),
    netPayroll: resolveMonetaryField(
      pickFirst(s.netPayroll, s.net_payroll, s.total_net, s.total_net_pay),
      pickFirst(s.net_payroll_paise, s.netPayrollPaise)
    ),
    employerCost: resolveMonetaryField(
      pickFirst(s.employerCost, s.employer_cost, s.total_payroll_cost),
      pickFirst(s.employer_cost_paise, s.employerCostPaise)
    ),
  };
}

function normalizePeriod(raw: any): PayrollPeriod {
  const periodMonth = toNullableNumber(pickFirst(raw?.periodMonth, raw?.period_month, raw?.month));
  const periodYear = toNullableNumber(pickFirst(raw?.periodYear, raw?.period_year, raw?.year));
  return {
    id: String(pickFirst(raw?.id, raw?.cycleId, raw?.cycle_id, "")),
    name: formatPeriodLabel(raw?.name ?? raw?.period_name, periodMonth, periodYear),
    month: periodMonth ? String(periodMonth) : undefined,
    year: periodYear ?? undefined,
    periodMonth: periodMonth ?? undefined,
    periodYear: periodYear ?? undefined,
    startDate: String(pickFirst(raw?.startDate, raw?.start_date, "")),
    endDate: String(pickFirst(raw?.endDate, raw?.end_date, "")),
    payDate: toNullableString(pickFirst(raw?.payDate, raw?.pay_date)) ?? undefined,
    status: String(pickFirst(raw?.status, "Draft")),
    isCurrent: Boolean(pickFirst(raw?.isCurrent, raw?.is_current, false)),
    isLocked: Boolean(pickFirst(raw?.isLocked, raw?.is_locked, false)),
    totalEmployees: toNullableNumber(
      pickFirst(raw?.totalEmployees, raw?.total_employees, raw?.employeeCount, raw?.employee_count)
    ),
    employeeCount: toNullableNumber(
      pickFirst(raw?.employeeCount, raw?.employee_count, raw?.totalEmployees, raw?.total_employees)
    ),
    totalGrossPay: resolveMonetaryField(
      pickFirst(raw?.totalGrossPay, raw?.total_gross_pay),
      raw?.total_gross_pay_paise
    ),
    totalNetPay: resolveMonetaryField(
      pickFirst(raw?.totalNetPay, raw?.total_net_pay),
      raw?.total_net_pay_paise
    ),
    runId: toNullableString(pickFirst(raw?.runId, raw?.run_id)),
    remarks: toNullableString(raw?.remarks),
    createdAt: toNullableString(pickFirst(raw?.createdAt, raw?.created_at)),
  };
}

function normalizeValidationIssue(raw: any): PayrollValidationIssue {
  return {
    id: String(pickFirst(raw?.id, raw?.issueId, raw?.issue_id, "")),
    employeeId: toNullableString(pickFirst(raw?.employeeId, raw?.employee_id)) ?? undefined,
    employeeName: toNullableString(pickFirst(raw?.employeeName, raw?.employee_name)) ?? undefined,
    department: toNullableString(raw?.department) ?? undefined,
    severity: String(pickFirst(raw?.severity, "warning")),
    category: toNullableString(raw?.category) ?? undefined,
    component: toNullableString(raw?.component) ?? undefined,
    code: toNullableString(raw?.code) ?? undefined,
    message: toNullableString(pickFirst(raw?.message, raw?.description)) ?? undefined,
    description: toNullableString(pickFirst(raw?.description, raw?.message)) ?? undefined,
    blocking: raw?.blocking !== undefined ? Boolean(raw.blocking) : undefined,
    status: toNullableString(raw?.status) ?? undefined,
    resolved: raw?.resolved !== undefined ? Boolean(raw.resolved) : undefined,
    source: toNullableString(raw?.source) ?? undefined,
    resolution: toNullableString(raw?.resolution) ?? undefined,
    detectedAt: toNullableString(pickFirst(raw?.detectedAt, raw?.detected_at)) ?? undefined,
  };
}

function normalizePreviewEmployee(raw: any): PayrollPreviewEmployee {
  const earn = raw?.earnings && !Array.isArray(raw.earnings) ? raw.earnings : raw;
  const ded = raw?.deductions && !Array.isArray(raw.deductions) ? raw.deductions : raw;
  return {
    id: String(pickFirst(raw?.id, raw?.employeeId, raw?.employee_id, "")),
    employeeId: String(pickFirst(raw?.employeeId, raw?.employee_id, raw?.employeeCode, raw?.employee_code, raw?.id, "")),
    name: String(pickFirst(raw?.name, raw?.employeeName, raw?.employee_name, raw?.full_name, "Employee")),
    role: toNullableString(raw?.role) ?? undefined,
    department: toNullableString(raw?.department),
    designation: toNullableString(raw?.designation),
    employmentStatus: toNullableString(pickFirst(raw?.employmentStatus, raw?.employment_status)),
    joiningDate: toNullableString(pickFirst(raw?.joiningDate, raw?.joining_date)),
    location: toNullableString(raw?.location),
    periodName: toNullableString(pickFirst(raw?.periodName, raw?.period_name)),
    runStatus: toNullableString(pickFirst(raw?.runStatus, raw?.run_status)),
    financialYear: toNullableString(pickFirst(raw?.financialYear, raw?.financial_year)),
    status: String(pickFirst(raw?.status, "Processed")),
    validationStatus: toNullableString(pickFirst(raw?.validationStatus, raw?.validation_status)) ?? undefined,
    issuesCount: toNullableNumber(pickFirst(raw?.issuesCount, raw?.issues_count)) ?? undefined,
    grossEarnings: resolveMonetaryField(
      pickFirst(raw?.grossEarnings, raw?.gross_earnings, raw?.gross),
      pickFirst(raw?.gross_paise, raw?.grossEarningsPaise)
    ),
    totalDeductions: resolveMonetaryField(
      pickFirst(raw?.totalDeductions, raw?.total_deductions),
      pickFirst(raw?.total_deductions_paise, raw?.totalDeductionsPaise)
    ),
    netPay: resolveMonetaryField(
      pickFirst(raw?.netPay, raw?.net_pay),
      pickFirst(raw?.net_pay_paise, raw?.netPayPaise)
    ),
    employerContribution: resolveMonetaryField(
      pickFirst(raw?.employerContribution, raw?.employer_contribution),
      raw?.employer_contribution_paise
    ),
    basicSalary: resolveMonetaryField(
      pickFirst(raw?.basicSalary, earn?.basic, raw?.basic),
      earn?.basic_paise
    ),
    attendance: raw?.attendance ?? null,
    earnings: raw?.earnings ?? null,
    deductions: raw?.deductions ?? null,
    statutory: raw?.statutory ?? null,
    bankInfo: raw?.bankInfo ?? raw?.bank_info ?? null,
    salaryStructure: raw?.salaryStructure ?? raw?.salary_structure ?? null,
    ytd: raw?.ytd ?? null,
    previousComparison: raw?.previousComparison ?? raw?.previous_comparison ?? null,
    issues: Array.isArray(raw?.issues) ? raw.issues.map(normalizeValidationIssue) : undefined,
    audit: raw?.audit ?? null,
  };
}

/**
 * UNVERIFIED IN OPENAPI: `GET /api/v2/payroll/dashboard` is not declared in `/openapi.json`.
 * Preserves null for missing metrics (never coerces missing fields to synthetic 0).
 */
export const getPayrollDashboard = async (
  month?: number,
  year?: number
): Promise<PayrollDashboardData> => {
  const res = await apiInstance.get("/api/v2/payroll/dashboard", {
    params: {
      ...(month ? { month } : {}),
      ...(year ? { year } : {}),
    },
  });
  const d = unwrapPayload<any>(res) ?? {};
  const recentRunsRaw = Array.isArray(d.recentRuns)
    ? d.recentRuns
    : Array.isArray(d.recent_runs)
    ? d.recent_runs
    : [];

  return {
    period: d.period ? normalizePeriod(d.period) : null,
    active_run: d.active_run ?? null,
    status: toNullableString(d.status) ?? undefined,
    summary: normalizeSummary(d),
    readiness: d.readiness ?? null,
    issues: d.issues
      ? {
          errors: Array.isArray(d.issues.errors) ? d.issues.errors.map(normalizeValidationIssue) : [],
          warnings: Array.isArray(d.issues.warnings)
            ? d.issues.warnings.map(normalizeValidationIssue)
            : [],
        }
      : null,
    recentRuns: recentRunsRaw.map((r: any) => ({
      id: String(pickFirst(r.id, r.runId, r.run_id, "")),
      periodId: String(pickFirst(r.periodId, r.period_id, r.cycleId, r.cycle_id, "")),
      periodName: toNullableString(pickFirst(r.periodName, r.period_name)) ?? undefined,
      status: String(pickFirst(r.status, "Unknown")),
      employeeCount: toNullableNumber(pickFirst(r.employeeCount, r.employee_count)),
      grossPayroll: resolveMonetaryField(pickFirst(r.grossPayroll, r.gross_payroll)),
      totalDeductions: resolveMonetaryField(pickFirst(r.totalDeductions, r.total_deductions)),
      netPayroll: resolveMonetaryField(pickFirst(r.netPayroll, r.net_payroll)),
      employerCost: resolveMonetaryField(pickFirst(r.employerCost, r.employer_cost)),
      runDate: toNullableString(pickFirst(r.runDate, r.run_date, r.createdAt, r.created_at)),
    })),
  };
};

/**
 * Verified in OpenAPI: `GET /api/v2/payroll/cycles`
 */
export const getPayrollPeriods = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  year?: number;
  search?: string;
}): Promise<PayrollPeriod[]> => {
  const res = await apiInstance.get("/api/v2/payroll/cycles", { params });
  const d = unwrapPayload<any>(res);
  const rawList = Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
  return rawList.map(normalizePeriod);
};

/**
 * Verified in OpenAPI: `GET /api/v2/payroll/cycles` (paginated wrapper)
 */
export const getPeriodsList = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  year?: number;
  search?: string;
}): Promise<{
  items: PayrollPeriod[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  const res = await apiInstance.get("/api/v2/payroll/cycles", { params });
  const d = unwrapPayload<any>(res);
  const rawList = Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
  const items = rawList.map(normalizePeriod);
  const total = toNullableNumber(d?.total) ?? items.length;
  const limit = params?.limit || 10;
  const page = toNullableNumber(d?.page) ?? params?.page ?? 1;
  const totalPages = toNullableNumber(d?.totalPages ?? d?.total_pages) ?? Math.max(1, Math.ceil(total / limit));
  return { items, total, page, totalPages };
};

export const getPayrollRun = async (runId: string): Promise<PayrollRun> => {
  const res = await apiInstance.get(`/api/v2/payroll/runs/${runId}`);
  return unwrapPayload<PayrollRun>(res);
};

/**
 * Verified in OpenAPI: `GET /api/v2/payroll/runs/{runId}/employees`
 */
export const getPayrollRunEmployees = async (
  runId: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    validationStatus?: string;
    sortBy?: string;
    sortDir?: "asc" | "desc";
  }
): Promise<{
  items: PayrollPreviewEmployee[];
  total: number;
  totalPages: number;
}> => {
  const res = await apiInstance.get(`/api/v2/payroll/runs/${runId}/employees`, {
    params,
  });
  const d = unwrapPayload<any>(res);
  const rawList = Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
  const items = rawList.map(normalizePreviewEmployee);
  const total = toNullableNumber(d?.total) ?? items.length;
  const limit = params?.limit || 25;
  const totalPages =
    toNullableNumber(d?.totalPages ?? d?.total_pages) ?? Math.max(1, Math.ceil(total / limit));
  return { items, total, totalPages };
};

/**
 * Verified in OpenAPI: `GET /api/v2/payroll/runs/{runId}/validation-issues`
 */
export const getPayrollValidationIssues = async (
  runId: string
): Promise<PayrollValidationIssue[]> => {
  const res = await apiInstance.get(`/api/v2/payroll/runs/${runId}/validation-issues`);
  const d = unwrapPayload<any>(res);
  const rawList = Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
  return rawList.map(normalizeValidationIssue);
};

/**
 * UNVERIFIED IN OPENAPI: `GET /api/v2/payroll/payslips` (list all) is not in `/openapi.json`.
 */
export const getPayslips = async (
  params?: Record<string, unknown>
): Promise<PayslipItem[]> => {
  const res = await apiInstance.get("/api/v2/payroll/payslips", { params });
  const d = unwrapPayload<any>(res);
  return Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
};

/**
 * Verified in OpenAPI: `GET /api/v2/payroll/payment-batches`
 */
export const getPaymentBatches = async (): Promise<PaymentBatch[]> => {
  const res = await apiInstance.get("/api/v2/payroll/payment-batches");
  const d = unwrapPayload<any>(res);
  return Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
};

export const payrollApi = {
  getPayrollDashboard,
  getDashboard: getPayrollDashboard,
  getPayrollPeriods,
  getPeriods: getPayrollPeriods,
  getPeriodsList,

  /**
   * UNVERIFIED IN OPENAPI: `POST /api/v2/payroll/cycles` is not declared in `/openapi.json`.
   */
  createPeriod: async (data: {
    name: string;
    startDate: string;
    endDate: string;
    payDate?: string;
    periodMonth?: number;
    periodYear?: number;
    remarks?: string;
  }): Promise<PayrollPeriod> => {
    const res = await apiInstance.post("/api/v2/payroll/cycles", data);
    return normalizePeriod(unwrapPayload(res));
  },

  /**
   * UNVERIFIED IN OPENAPI: `POST /api/v2/payroll/cycles/{cycleId}/lock` is not declared in `/openapi.json`.
   */
  lockPeriod: async (cycleId: string, reason?: string) => {
    const res = await apiInstance.post(`/api/v2/payroll/cycles/${cycleId}/lock`, { reason });
    return unwrapPayload(res);
  },

  /**
   * Verified in OpenAPI: `POST /api/v2/payroll/cycles/{cycleId}/reopen`
   */
  reopenPeriod: async (cycleId: string, reason?: string) => {
    const res = await apiInstance.post(`/api/v2/payroll/cycles/${cycleId}/reopen`, { reason });
    return unwrapPayload(res);
  },

  /**
   * Verified in OpenAPI: `POST /api/v2/payroll/cycles/{cycleId}/void`
   */
  voidPeriod: async (cycleId: string, reason?: string) => {
    const res = await apiInstance.post(`/api/v2/payroll/cycles/${cycleId}/void`, { reason });
    return unwrapPayload(res);
  },

  getPayrollRun,
  getRun: getPayrollRun,

  /**
   * Verified in OpenAPI: `POST /api/v2/payroll/runs`
   */
  runPayroll: async (
    periodId: string
  ): Promise<{ runId?: string; message?: string; status?: string }> => {
    const res = await apiInstance.post(
      "/api/v2/payroll/runs",
      { cycle_id: periodId, cycleId: periodId, periodId },
      {
        headers: {
          "Idempotency-Key": generateIdempotencyKey(),
        },
      }
    );
    const d = unwrapPayload<any>(res) ?? {};
    return {
      runId: pickFirst(d.runId, d.run_id, d.id),
      message: toNullableString(d.message) ?? undefined,
      status: toNullableString(d.status) ?? undefined,
    };
  },

  startRun: async (periodId: string) => payrollApi.runPayroll(periodId),

  /**
   * UNVERIFIED IN OPENAPI: `GET /api/v2/payroll/runs/{runId}/status` is not in `/openapi.json`
   * (backend exposes `/api/v2/payroll/runs/{runId}` and `/api/v2/payroll/runs/{runId}/generation-status`).
   */
  getPayrollRunStatus: async (runId: string, jobId?: string): Promise<PayrollRunStatus> => {
    const res = await apiInstance.get(`/api/v2/payroll/runs/${runId}/status`, {
      params: jobId ? { jobId } : undefined,
    });
    const d = unwrapPayload<any>(res) ?? {};
    return {
      runId: String(pickFirst(d.runId, d.run_id, d.id, runId)),
      jobId: toNullableString(pickFirst(d.jobId, d.job_id)),
      periodId: toNullableString(pickFirst(d.periodId, d.period_id, d.cycleId, d.cycle_id)),
      periodName: toNullableString(pickFirst(d.periodName, d.period_name)),
      status: String(pickFirst(d.status, "Unknown")),
      progress: toNullableNumber(d.progress),
      currentStep: toNullableString(pickFirst(d.currentStep, d.current_step)),
      employees: d.employees ?? null,
      steps: Array.isArray(d.steps) ? d.steps : undefined,
      validationIssues: Array.isArray(d.validationIssues ?? d.validation_issues)
        ? (d.validationIssues ?? d.validation_issues).map(normalizeValidationIssue)
        : undefined,
      error: d.error ?? null,
    };
  },

  /**
   * UNVERIFIED IN OPENAPI: `POST /api/v2/payroll/runs/{runId}/cancel`
   */
  cancelPayrollRun: async (runId: string): Promise<{ message?: string }> => {
    const res = await apiInstance.post(`/api/v2/payroll/runs/${runId}/cancel`, {});
    return unwrapPayload(res) ?? {};
  },

  /**
   * UNVERIFIED IN OPENAPI: `POST /api/v2/payroll/runs/{runId}/retry`
   */
  retryPayrollRun: async (runId: string): Promise<{ message?: string }> => {
    const res = await apiInstance.post(`/api/v2/payroll/runs/${runId}/retry`, {});
    return unwrapPayload(res) ?? {};
  },

  /**
   * UNVERIFIED IN OPENAPI: `POST /api/v2/payroll/runs/{runId}/recalculate`
   */
  recalculatePayroll: async (runId: string): Promise<{ message?: string }> => {
    const res = await apiInstance.post(`/api/v2/payroll/runs/${runId}/recalculate`, {});
    return unwrapPayload(res) ?? {};
  },

  recalculateRun: async (runId: string) => payrollApi.recalculatePayroll(runId),

  /**
   * Verified in OpenAPI: `GET /api/v2/payroll/runs/{runId}/preview`
   */
  getPayrollPreview: async (runId: string): Promise<PayrollPreviewData> => {
    const res = await apiInstance.get(`/api/v2/payroll/runs/${runId}/preview`);
    const d = unwrapPayload<any>(res) ?? {};
    return {
      runId: String(pickFirst(d.runId, d.run_id, d.id, runId)),
      periodId: toNullableString(pickFirst(d.periodId, d.period_id, d.cycleId)) ?? undefined,
      periodName: toNullableString(pickFirst(d.periodName, d.period_name)) ?? undefined,
      status: String(pickFirst(d.status, "Unknown")),
      lastCalculatedAt: toNullableString(pickFirst(d.lastCalculatedAt, d.last_calculated_at)),
      summary: normalizeSummary(d),
      validation: d.validation
        ? {
            status: d.validation.status,
            totalIssues: d.validation.totalIssues,
            errorsCount: d.validation.errorsCount,
            warningsCount: d.validation.warningsCount,
            errors: Array.isArray(d.validation.errors)
              ? d.validation.errors.map(normalizeValidationIssue)
              : [],
            warnings: Array.isArray(d.validation.warnings)
              ? d.validation.warnings.map(normalizeValidationIssue)
              : [],
          }
        : null,
      employees: Array.isArray(d.employees) ? d.employees.map(normalizePreviewEmployee) : undefined,
    };
  },

  getPayrollRunEmployees,
  getRunEmployees: getPayrollRunEmployees,

  /**
   * Verified in OpenAPI: `GET /api/v2/payroll/runs/{runId}/employees/{employeeId}`
   */
  getRunEmployeeDetail: async (
    runId: string,
    employeeId: string
  ): Promise<PayrollPreviewEmployee> => {
    const res = await apiInstance.get(
      `/api/v2/payroll/runs/${runId}/employees/${employeeId}`
    );
    return normalizePreviewEmployee(unwrapPayload(res));
  },

  getPayrollValidationIssues,
  getValidationIssues: getPayrollValidationIssues,

  /**
   * Verified in OpenAPI: `GET /api/v2/payroll/runs/{runId}/validation`
   */
  getPayrollValidation: async (runId: string): Promise<PayrollValidationSummary> => {
    const res = await apiInstance.get(`/api/v2/payroll/runs/${runId}/validation`);
    const d = unwrapPayload<any>(res) ?? {};
    const issuesRaw = Array.isArray(d.issues) ? d.issues : [];
    return {
      runId: String(pickFirst(d.runId, d.run_id, runId)),
      periodId: toNullableString(pickFirst(d.periodId, d.period_id)) ?? undefined,
      periodName: toNullableString(pickFirst(d.periodName, d.period_name)) ?? undefined,
      status: toNullableString(d.status) ?? undefined,
      totalIssues: toNullableNumber(pickFirst(d.totalIssues, d.total_issues)) ?? issuesRaw.length,
      errorsCount: toNullableNumber(pickFirst(d.errorsCount, d.errors_count, d.criticalIssues)) ?? 0,
      warningsCount: toNullableNumber(pickFirst(d.warningsCount, d.warnings_count, d.warnings)) ?? 0,
      infoCount: toNullableNumber(pickFirst(d.infoCount, d.info_count)) ?? 0,
      blockingCount: toNullableNumber(pickFirst(d.blockingCount, d.blocking_count)) ?? undefined,
      affectedEmployeesCount:
        toNullableNumber(pickFirst(d.affectedEmployeesCount, d.affected_employees_count)) ??
        undefined,
      lastValidatedAt: toNullableString(pickFirst(d.lastValidatedAt, d.last_validated_at)),
      issues: issuesRaw.map(normalizeValidationIssue),
    };
  },

  /**
   * Verified in OpenAPI: `POST /api/v2/payroll/runs/{runId}/validate`
   */
  runPayrollValidation: async (runId: string): Promise<{ message?: string }> => {
    const res = await apiInstance.post(`/api/v2/payroll/runs/${runId}/validate`, {});
    return unwrapPayload(res) ?? {};
  },

  /**
   * Verified in OpenAPI: `POST /api/v2/payroll/runs/{runId}/revalidate`
   */
  revalidateRun: async (runId: string) => {
    const res = await apiInstance.post(`/api/v2/payroll/runs/${runId}/revalidate`, {});
    return unwrapPayload(res);
  },

  /**
   * Verified in OpenAPI: `GET /api/v2/payroll/runs/{runId}/review`
   */
  getPayrollReview: async (runId: string): Promise<PayrollReviewData> => {
    const res = await apiInstance.get(`/api/v2/payroll/runs/${runId}/review`);
    const d = unwrapPayload<any>(res) ?? {};
    return {
      runId: String(pickFirst(d.runId, d.run_id, runId)),
      periodId: toNullableString(pickFirst(d.periodId, d.period_id)) ?? undefined,
      periodName: toNullableString(pickFirst(d.periodName, d.period_name)) ?? undefined,
      status: String(pickFirst(d.status, "Unknown")),
      lastUpdatedAt: toNullableString(pickFirst(d.lastUpdatedAt, d.last_updated_at)),
      summary: normalizeSummary(d),
      validation: d.validation ?? null,
      approval: d.approval ?? null,
      auditLog: Array.isArray(d.auditLog ?? d.audit_log) ? d.auditLog ?? d.audit_log : undefined,
    };
  },

  getReviewData: async (runId: string) => payrollApi.getPayrollReview(runId),

  /**
   * Verified in OpenAPI: `POST /api/v2/payroll/runs/{runId}/approve`
   */
  approvePayroll: async (
    runId: string,
    payload?: { comments?: string }
  ): Promise<{ message?: string }> => {
    const res = await apiInstance.post(
      `/api/v2/payroll/runs/${runId}/approve`,
      payload ?? {},
      {
        headers: { "Idempotency-Key": generateIdempotencyKey() },
      }
    );
    return unwrapPayload(res) ?? {};
  },

  approveRun: async (runId: string) => payrollApi.approvePayroll(runId),

  /**
   * Verified in OpenAPI: `POST /api/v2/payroll/runs/{runId}/reject`
   */
  rejectPayroll: async (
    runId: string,
    payload: { reason: string; comments?: string }
  ): Promise<{ message?: string }> => {
    const res = await apiInstance.post(`/api/v2/payroll/runs/${runId}/reject`, payload, {
      headers: { "Idempotency-Key": generateIdempotencyKey() },
    });
    return unwrapPayload(res) ?? {};
  },

  /**
   * Verified in OpenAPI: `GET /api/v2/payroll/runs/{runId}/finalization`
   */
  getPayrollFinalization: async (runId: string): Promise<PayrollFinalizationData> => {
    const res = await apiInstance.get(`/api/v2/payroll/runs/${runId}/finalization`);
    const d = unwrapPayload<any>(res) ?? {};
    return {
      runId: String(pickFirst(d.runId, d.run_id, runId)),
      periodId: toNullableString(pickFirst(d.periodId, d.period_id)) ?? undefined,
      periodName: toNullableString(pickFirst(d.periodName, d.period_name)) ?? undefined,
      status: String(pickFirst(d.status, "Unknown")),
      isFinalized: Boolean(pickFirst(d.isFinalized, d.is_finalized, false)),
      isLocked: Boolean(pickFirst(d.isLocked, d.is_locked, false)),
      approvalStatus: toNullableString(pickFirst(d.approvalStatus, d.approval_status)),
      lastUpdatedAt: toNullableString(pickFirst(d.lastUpdatedAt, d.last_updated_at)),
      summary: normalizeSummary(d),
      validation: d.validation ?? null,
      approval: d.approval ?? null,
      finalization: d.finalization ?? null,
    };
  },

  /**
   * Verified in OpenAPI: `POST /api/v2/payroll/runs/{runId}/finalize`
   */
  finalizePayroll: async (
    runId: string,
    payload?: { notes?: string; lock?: boolean }
  ): Promise<{ message?: string }> => {
    const res = await apiInstance.post(
      `/api/v2/payroll/runs/${runId}/finalize`,
      payload ?? {},
      {
        headers: { "Idempotency-Key": generateIdempotencyKey() },
      }
    );
    return unwrapPayload(res) ?? {};
  },

  finalizeRun: async (runId: string) => payrollApi.finalizePayroll(runId),

  /**
   * Verified in OpenAPI: `GET /api/v2/payroll/payslips/{runId}/{employeeId}`
   * Normalized with `normalizePayslip` to preserve exact backend values.
   */
  getPayslip: async (
    runId: string,
    employeeId: string
  ): Promise<PayrollPayslipData | null> => {
    const res = await apiInstance.get(
      `/api/v2/payroll/payslips/${runId}/${employeeId}`
    );
    return normalizePayslip(unwrapPayload(res));
  },

  /**
   * Verified in OpenAPI: `GET /api/v2/payroll/runs/{runId}/employees/{employeeId}/payslip/download`
   */
  downloadPayslip: async (runId: string, employeeId: string): Promise<Blob> => {
    const res = await apiInstance.get(
      `/api/v2/payroll/runs/${runId}/employees/${employeeId}/payslip/download`,
      { responseType: "blob" }
    );
    return res.data as Blob;
  },

  /**
   * Verified in OpenAPI: `GET /api/v2/payroll/my-payslips`
   */
  getMyPayslips: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<{ items: PayslipHistoryItem[]; total: number }> => {
    const res = await apiInstance.get("/api/v2/payroll/my-payslips", { params });
    const d = unwrapPayload<any>(res);
    const rawList = Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
    const items = rawList.map(normalizePayslipHistoryItem);
    return { items, total: toNullableNumber(d?.total) ?? items.length };
  },

  /**
   * Verified in OpenAPI: `GET /api/v2/payroll/employees/{employeeId}/payslips`
   */
  getEmployeePayslipHistory: async (
    employeeId: string,
    params?: { page?: number; limit?: number }
  ): Promise<{ items: PayslipHistoryItem[]; total: number }> => {
    const res = await apiInstance.get(
      `/api/v2/payroll/employees/${employeeId}/payslips`,
      { params }
    );
    const d = unwrapPayload<any>(res);
    const rawList = Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
    const items = rawList.map(normalizePayslipHistoryItem);
    return { items, total: toNullableNumber(d?.total) ?? items.length };
  },

  getPayslips,

  /**
   * UNVERIFIED IN OPENAPI: `GET /api/v2/payroll/payslips/{id}`
   */
  getPayslipById: async (id: string): Promise<PayrollPayslipData | null> => {
    const res = await apiInstance.get(`/api/v2/payroll/payslips/${id}`);
    return normalizePayslip(unwrapPayload(res));
  },

  getPaymentBatches,

  /**
   * Verified in OpenAPI: `GET /api/v2/payroll/payment-batches/{batchId}`
   */
  getPaymentBatchById: async (batchId: string) => {
    const res = await apiInstance.get(`/api/v2/payroll/payment-batches/${batchId}`);
    return unwrapPayload(res);
  },

  /**
   * Verified in OpenAPI: `POST /api/v2/payroll/runs/{runId}/payment-batches`
   */
  createPaymentBatch: async (runId: string) => {
    const res = await apiInstance.post(`/api/v2/payroll/runs/${runId}/payment-batches`, {
      run_id: runId,
    });
    return unwrapPayload(res);
  },

  /**
   * Verified in OpenAPI: `POST /api/v2/payroll/payment-batches/{batchId}/approve`
   */
  approvePaymentBatch: async (batchId: string) => {
    const res = await apiInstance.post(
      `/api/v2/payroll/payment-batches/${batchId}/approve`,
      {}
    );
    return unwrapPayload(res);
  },

  /**
   * Verified in OpenAPI: `POST /api/v2/payroll/payment-batches/{batchId}/submit`
   */
  processPaymentBatch: async (batchId: string) => {
    const res = await apiInstance.post(
      `/api/v2/payroll/payment-batches/${batchId}/submit`,
      {}
    );
    return unwrapPayload(res);
  },
};

export default payrollApi;

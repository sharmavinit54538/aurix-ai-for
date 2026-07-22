import { api } from "@/api";
import type { ApiResponse } from "@/api/types";
import { EmployeeSalaryDetail } from "@/features/admin/payroll/components/salary-processing/SalaryDetailDrawer";
import { AIInsightItem } from "@/features/admin/payroll/components/salary-processing/AIPayrollInsights";
import { ValidationErrorItem } from "@/features/admin/payroll/components/salary-processing/ValidationPanel";
import { ApprovalStep } from "@/features/admin/payroll/components/salary-processing/ApprovalWorkflowTracker";

function unwrapApiData<T>(res: unknown): T | undefined {
  if (res === null || res === undefined) return undefined;
  if (typeof res !== "object") return res as T;

  const body = res as Record<string, unknown>;
  if ("data" in body && body.data !== undefined && body.data !== null) {
    return body.data as T;
  }

  return res as T;
}

function unwrapArrayPayload<T>(res: unknown): T[] {
  if (Array.isArray(res)) return res;

  const data = unwrapApiData<unknown>(res);
  if (Array.isArray(data)) return data;

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of ["records", "items", "results", "employees", "salary_records"]) {
      if (Array.isArray(obj[key])) return obj[key] as T[];
    }
  }

  return [];
}

function readNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readString(value: unknown, fallback = ""): string {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function mapSalaryRecord(raw: Record<string, unknown>): EmployeeSalaryDetail {
  const status = readString(raw.status, "PENDING").toUpperCase();

  return {
    id: readString(raw.id ?? raw.employee_id ?? raw.employeeId),
    employeeCode: readString(raw.employeeCode ?? raw.employee_code),
    name: readString(raw.name ?? raw.full_name ?? raw.fullName),
    designation: readString(raw.designation),
    department: readString(raw.department),
    location: readString(raw.location ?? raw.work_location),
    avatarUrl: readString(raw.avatarUrl ?? raw.avatar_url) || undefined,
    ctc: readNumber(raw.ctc),
    grossSalary: readNumber(raw.grossSalary ?? raw.gross_salary),
    basic: readNumber(raw.basic),
    hra: readNumber(raw.hra),
    specialAllowance: readNumber(raw.specialAllowance ?? raw.special_allowance),
    otherAllowances: readNumber(raw.otherAllowances ?? raw.other_allowances),
    bonus: readNumber(raw.bonus),
    overtimePay: readNumber(raw.overtimePay ?? raw.overtime_pay),
    pfDeduction: readNumber(raw.pfDeduction ?? raw.pf_deduction),
    esiDeduction: readNumber(raw.esiDeduction ?? raw.esi_deduction),
    ptDeduction: readNumber(raw.ptDeduction ?? raw.pt_deduction),
    tdsDeduction: readNumber(raw.tdsDeduction ?? raw.tds_deduction),
    otherDeductions: readNumber(raw.otherDeductions ?? raw.other_deductions),
    totalDeductions: readNumber(raw.totalDeductions ?? raw.total_deductions),
    netSalary: readNumber(raw.netSalary ?? raw.net_salary),
    workingDays: readNumber(raw.workingDays ?? raw.working_days),
    paidDays: readNumber(raw.paidDays ?? raw.paid_days),
    lopDays: readNumber(raw.lopDays ?? raw.lop_days),
    overtimeHours: readNumber(raw.overtimeHours ?? raw.overtime_hours),
    prevMonthNet: readNumber(raw.prevMonthNet ?? raw.prev_month_net),
    bankName: readString(raw.bankName ?? raw.bank_name),
    accountNumber: readString(raw.accountNumber ?? raw.account_number),
    ifscCode: readString(raw.ifscCode ?? raw.ifsc_code),
    panNumber: readString(raw.panNumber ?? raw.pan_number),
    status:
      status === "CALCULATED" ||
      status === "VALIDATED" ||
      status === "HOLD" ||
      status === "PENDING"
        ? status
        : "PENDING",
  };
}

export interface SalaryProcessingHeroMetrics {
  month: string;
  year: number;
  status: string;
  progressPercent: number;
  totalEmployees: number;
  pendingEmployees: number;
  totalCost: number;
  expectedPaymentDate: string;
  approvalStage: string;
}

export interface PayrollHealthMetrics {
  accuracy: number;
  completedPercent: number;
  pendingCount: number;
  errorCount: number;
  warningCount: number;
  blockedCount: number;
  salaryVariance: string;
  netPayroll: number;
  employerCost: number;
}

export interface CostTrendPoint {
  month: string;
  cost: number;
  employees: number;
}

export interface DeptCostPoint {
  dept: string;
  cost: number;
  count: number;
}

export interface ComponentBreakdownPoint {
  name: string;
  value: number;
  color: string;
}

export interface SalaryProcessingAnalyticsData {
  costTrend: CostTrendPoint[];
  deptCost: DeptCostPoint[];
  componentBreakdown: ComponentBreakdownPoint[];
}

export interface SalaryProcessingQueryParams {
  month?: string;
  year?: number;
  department?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const salaryProcessingApi = {
  getSalaryRecords: async (params?: SalaryProcessingQueryParams): Promise<EmployeeSalaryDetail[]> => {
    const query = new URLSearchParams();
    if (params?.month) query.set("month", params.month);
    if (params?.year) query.set("year", params.year.toString());
    if (params?.department) query.set("department", params.department);
    if (params?.status) query.set("status", params.status);
    if (params?.search) query.set("search", params.search);
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());

    const qs = query.toString();
    const res = await api.get<ApiResponse<unknown> | unknown>(
      `payroll/salary-processing${qs ? `?${qs}` : ""}`,
    );
    return unwrapArrayPayload<Record<string, unknown>>(res).map(mapSalaryRecord);
  },

  getHeroMetrics: async (): Promise<SalaryProcessingHeroMetrics> => {
    const res = await api.get<ApiResponse<SalaryProcessingHeroMetrics> | SalaryProcessingHeroMetrics>(
      "payroll/salary-processing/hero",
    );
    return unwrapApiData<SalaryProcessingHeroMetrics>(res) as SalaryProcessingHeroMetrics;
  },

  getHealthKPIs: async (): Promise<PayrollHealthMetrics> => {
    const res = await api.get<ApiResponse<PayrollHealthMetrics> | PayrollHealthMetrics>(
      "payroll/salary-processing/kpis",
    );
    return unwrapApiData<PayrollHealthMetrics>(res) as PayrollHealthMetrics;
  },

  getApprovalWorkflow: async (): Promise<ApprovalStep[]> => {
    const res = await api.get<ApiResponse<unknown> | unknown>(
      "payroll/salary-processing/approval-workflow",
    );
    return unwrapArrayPayload<ApprovalStep>(res);
  },

  getAIPayrollInsights: async (): Promise<AIInsightItem[]> => {
    const res = await api.get<ApiResponse<unknown> | unknown>("payroll/salary-processing/ai-insights");
    return unwrapArrayPayload<AIInsightItem>(res);
  },

  getValidationExceptions: async (): Promise<ValidationErrorItem[]> => {
    const res = await api.get<ApiResponse<unknown> | unknown>("payroll/salary-processing/validations");
    return unwrapArrayPayload<ValidationErrorItem>(res);
  },

  getAnalyticsData: async (): Promise<SalaryProcessingAnalyticsData> => {
    const res = await api.get<ApiResponse<SalaryProcessingAnalyticsData> | SalaryProcessingAnalyticsData>(
      "payroll/salary-processing/analytics",
    );
    return unwrapApiData<SalaryProcessingAnalyticsData>(res) as SalaryProcessingAnalyticsData;
  },

  runCalculation: async () => {
    const res = await api.post<ApiResponse<unknown> | unknown>("payroll/salary-processing/run", {});
    return unwrapApiData(res);
  },

  approveCycle: async () => {
    const res = await api.post<ApiResponse<unknown> | unknown>("payroll/salary-processing/approve", {});
    return unwrapApiData(res);
  },

  rollbackCycle: async () => {
    const res = await api.post<ApiResponse<unknown> | unknown>("payroll/salary-processing/rollback", {});
    return unwrapApiData(res);
  },

  recalculateRow: async (id: string) => {
    const res = await api.post<ApiResponse<unknown> | unknown>(
      `payroll/salary-processing/recalculate/${id}`,
      {},
    );
    return unwrapApiData(res);
  },

  resolveException: async (id: string) => {
    const res = await api.post<ApiResponse<unknown> | unknown>(
      `payroll/salary-processing/resolve-exception/${id}`,
      {},
    );
    return unwrapApiData(res);
  },

  autoFixExceptions: async () => {
    const res = await api.post<ApiResponse<unknown> | unknown>("payroll/salary-processing/auto-fix", {});
    return unwrapApiData(res);
  },

  processBatchPayout: async (ids: string[]) => {
    const res = await api.post<ApiResponse<unknown> | unknown>("payroll/salary-processing/batch-payout", {
      ids,
    });
    return unwrapApiData(res);
  },

  approveBatchSalary: async (ids: string[]) => {
    const res = await api.post<ApiResponse<unknown> | unknown>("payroll/salary-processing/batch-approve", {
      ids,
    });
    return unwrapApiData(res);
  },

  recalculateBatch: async (ids: string[]) => {
    const res = await api.post<ApiResponse<unknown> | unknown>("payroll/salary-processing/batch-recalculate", {
      ids,
    });
    return unwrapApiData(res);
  },

  generatePayslips: async () => {
    const res = await api.post<ApiResponse<unknown> | unknown>("payroll/salary-processing/payslips", {});
    return unwrapApiData(res);
  },

  initiateBankTransferBatch: async () => {
    const res = await api.post<ApiResponse<unknown> | unknown>("payroll/salary-processing/bank-transfer", {});
    return unwrapApiData(res);
  },

  exportPayrollSummary: async () => {
    const res = await api.post<ApiResponse<unknown> | unknown>("payroll/salary-processing/export", {});
    return unwrapApiData(res);
  },
};

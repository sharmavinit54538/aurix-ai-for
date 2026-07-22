import { api } from "@/api";
import { EmployeeSalaryDetail } from "@/features/admin/payroll/components/salary-processing/SalaryDetailDrawer";
import { AIInsightItem } from "@/features/admin/payroll/components/salary-processing/AIPayrollInsights";
import { ValidationErrorItem } from "@/features/admin/payroll/components/salary-processing/ValidationPanel";
import { ApprovalStep } from "@/features/admin/payroll/components/salary-processing/ApprovalWorkflowTracker";

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

function readNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function extractListPayload(res: unknown): unknown[] {
  if (Array.isArray(res)) return res;
  if (!res || typeof res !== "object") return [];

  const root = res as Record<string, unknown>;
  const nested = root.data;

  if (Array.isArray(nested)) return nested;
  if (nested && typeof nested === "object") {
    const dataObj = nested as Record<string, unknown>;
    for (const key of ["items", "records", "rows", "employees", "data", "results"]) {
      if (Array.isArray(dataObj[key])) return dataObj[key] as unknown[];
    }
  }

  for (const key of ["items", "records", "rows", "employees", "results"]) {
    if (Array.isArray(root[key])) return root[key] as unknown[];
  }

  return [];
}

function mapSalaryRecord(raw: unknown): EmployeeSalaryDetail | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const id = readString(item.id ?? item.employee_id ?? item.employeeId);
  if (!id) return null;

  return {
    id,
    employeeCode: readString(item.employeeCode ?? item.employee_code),
    name: readString(item.name ?? item.full_name ?? item.employee_name, "Employee"),
    designation: readString(item.designation),
    department: readString(item.department),
    location: readString(item.location ?? item.work_location),
    avatarUrl: readString(item.avatarUrl ?? item.avatar_url) || undefined,
    ctc: readNumber(item.ctc),
    grossSalary: readNumber(item.grossSalary ?? item.gross_salary),
    basic: readNumber(item.basic ?? item.basic_salary),
    hra: readNumber(item.hra),
    specialAllowance: readNumber(item.specialAllowance ?? item.special_allowance),
    otherAllowances: readNumber(item.otherAllowances ?? item.other_allowances),
    bonus: readNumber(item.bonus),
    overtimePay: readNumber(item.overtimePay ?? item.overtime_pay),
    pfDeduction: readNumber(item.pfDeduction ?? item.pf_deduction),
    esiDeduction: readNumber(item.esiDeduction ?? item.esi_deduction),
    ptDeduction: readNumber(item.ptDeduction ?? item.pt_deduction),
    tdsDeduction: readNumber(item.tdsDeduction ?? item.tds_deduction),
    otherDeductions: readNumber(item.otherDeductions ?? item.other_deductions),
    totalDeductions: readNumber(item.totalDeductions ?? item.total_deductions),
    netSalary: readNumber(item.netSalary ?? item.net_salary),
    workingDays: readNumber(item.workingDays ?? item.working_days),
    paidDays: readNumber(item.paidDays ?? item.paid_days),
    lopDays: readNumber(item.lopDays ?? item.lop_days),
    overtimeHours: readNumber(item.overtimeHours ?? item.overtime_hours),
    prevMonthNet: readNumber(item.prevMonthNet ?? item.prev_month_net),
    bankName: readString(item.bankName ?? item.bank_name),
    accountNumber: readString(item.accountNumber ?? item.account_number),
    ifscCode: readString(item.ifscCode ?? item.ifsc_code),
    panNumber: readString(item.panNumber ?? item.pan_number),
    status: (readString(item.status, "PENDING") as EmployeeSalaryDetail["status"]) || "PENDING",
  };
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
    const res = await api.get(`payroll/salary-processing${qs ? `?${qs}` : ""}`);
    return extractListPayload(res)
      .map(mapSalaryRecord)
      .filter((record): record is EmployeeSalaryDetail => Boolean(record));
  },

  getHeroMetrics: async (): Promise<SalaryProcessingHeroMetrics> => {
    const res: any = await api.get("payroll/salary-processing/hero");
    return res.data?.data || res.data;
  },

  getHealthKPIs: async (): Promise<PayrollHealthMetrics> => {
    const res: any = await api.get("payroll/salary-processing/kpis");
    return res.data?.data || res.data;
  },

  getApprovalWorkflow: async (): Promise<ApprovalStep[]> => {
    const res = await api.get("payroll/salary-processing/approval-workflow");
    return extractListPayload(res) as ApprovalStep[];
  },

  getAIPayrollInsights: async (): Promise<AIInsightItem[]> => {
    const res = await api.get("payroll/salary-processing/ai-insights");
    return extractListPayload(res) as AIInsightItem[];
  },

  getValidationExceptions: async (): Promise<ValidationErrorItem[]> => {
    const res = await api.get("payroll/salary-processing/validations");
    return extractListPayload(res) as ValidationErrorItem[];
  },

  getAnalyticsData: async (): Promise<SalaryProcessingAnalyticsData> => {
    const res: any = await api.get("payroll/salary-processing/analytics");
    return res.data?.data || res.data;
  },

  runCalculation: async () => {
    const res: any = await api.post("payroll/salary-processing/run", {});
    return res.data?.data || res.data;
  },

  approveCycle: async () => {
    const res: any = await api.post("payroll/salary-processing/approve", {});
    return res.data?.data || res.data;
  },

  rollbackCycle: async () => {
    const res: any = await api.post("payroll/salary-processing/rollback", {});
    return res.data?.data || res.data;
  },

  recalculateRow: async (id: string) => {
    const res: any = await api.post(`payroll/salary-processing/recalculate/${id}`, {});
    return res.data?.data || res.data;
  },

  resolveException: async (id: string) => {
    const res: any = await api.post(`payroll/salary-processing/resolve-exception/${id}`, {});
    return res.data?.data || res.data;
  },

  autoFixExceptions: async () => {
    const res: any = await api.post("payroll/salary-processing/auto-fix", {});
    return res.data?.data || res.data;
  },

  processBatchPayout: async (ids: string[]) => {
    const res: any = await api.post("payroll/salary-processing/batch-payout", { ids });
    return res.data?.data || res.data;
  },

  approveBatchSalary: async (ids: string[]) => {
    const res: any = await api.post("payroll/salary-processing/batch-approve", { ids });
    return res.data?.data || res.data;
  },

  recalculateBatch: async (ids: string[]) => {
    const res: any = await api.post("payroll/salary-processing/batch-recalculate", { ids });
    return res.data?.data || res.data;
  },

  generatePayslips: async () => {
    const res: any = await api.post("payroll/salary-processing/payslips", {});
    return res.data?.data || res.data;
  },

  initiateBankTransferBatch: async () => {
    const res: any = await api.post("payroll/salary-processing/bank-transfer", {});
    return res.data?.data || res.data;
  },

  exportPayrollSummary: async () => {
    const res: any = await api.post("payroll/salary-processing/export", {});
    return res.data?.data || res.data;
  },
};

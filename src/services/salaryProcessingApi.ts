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
    const res: any = await api.get(`payroll/salary-processing${qs ? `?${qs}` : ""}`);
    return res.data?.data || res.data || [];
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
    const res: any = await api.get("payroll/salary-processing/approval-workflow");
    return res.data?.data || res.data || [];
  },

  getAIPayrollInsights: async (): Promise<AIInsightItem[]> => {
    const res: any = await api.get("payroll/salary-processing/ai-insights");
    return res.data?.data || res.data || [];
  },

  getValidationExceptions: async (): Promise<ValidationErrorItem[]> => {
    const res: any = await api.get("payroll/salary-processing/validations");
    return res.data?.data || res.data || [];
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

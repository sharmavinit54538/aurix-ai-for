import apiInstance from "@/api/apiInstance";
import type {
  PayrollPeriod,
  PayrollRun,
  PayrollEmployeeRecord,
  PayrollValidationIssue,
  PaymentBatch,
  PayslipItem,
  SalaryComponent,
} from "./payroll/types";

export type {
  PayrollPeriod,
  PayrollRun,
  PayrollEmployeeRecord,
  PayrollValidationIssue,
  PaymentBatch,
  PayslipItem,
  SalaryComponent,
};

export type PayrollStatus =
  | "draft"
  | "processing"
  | "validated"
  | "approved"
  | "finalized"
  | "paid"
  | string;
export type PayrollRunStatus = PayrollStatus;
export type PayrollRunStep =
  | "processing"
  | "validation"
  | "preview"
  | "review"
  | "approval"
  | "finalize"
  | "payment"
  | string;

export interface PayrollPreviewEmployee extends PayrollEmployeeRecord {
  basic?: number;
  hra?: number;
  allowances?: number;
  pf?: number;
  tax?: number;
  other_deductions?: number;
  days_worked?: number;
  lop_days?: number;
}

export interface PayrollReviewData {
  run: PayrollRun;
  employees: PayrollPreviewEmployee[];
  summary: {
    total_employees: number;
    total_gross: number;
    total_deductions: number;
    total_net: number;
  };
}

export interface PayrollPayslipData extends PayslipItem {
  earnings?: { name: string; amount: number }[];
  deductions_list?: { name: string; amount: number }[];
  company_name?: string;
  designation?: string;
  bank_account?: string;
  pan?: string;
}

export const getPayrollDashboard = async () => {
  const res = await apiInstance.get("/payroll/dashboard");
  const d = res.data?.data ?? res.data ?? {};
  return {
    active_run: d.active_run ?? null,
    recent_runs: Array.isArray(d.recent_runs) ? d.recent_runs : [],
    summary: {
      total_payroll_cost: Number(d.summary?.total_payroll_cost ?? 0),
      total_net_pay: Number(d.summary?.total_net_pay ?? 0),
      total_deductions: Number(d.summary?.total_deductions ?? 0),
      headcount: Number(d.summary?.headcount ?? 0),
    },
  };
};

export const getPayrollPeriods = async (): Promise<PayrollPeriod[]> => {
  const res = await apiInstance.get("/payroll/periods");
  const d = res.data?.data ?? res.data;
  return Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
};

export const getPayrollRun = async (runId: string): Promise<PayrollRun> => {
  const res = await apiInstance.get(`/payroll/runs/${runId}`);
  return res.data?.data ?? res.data;
};

export const getPayrollRunEmployees = async (
  runId: string,
): Promise<PayrollPreviewEmployee[]> => {
  const res = await apiInstance.get(`/payroll/runs/${runId}/employees`);
  const d = res.data?.data ?? res.data;
  return Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
};

export const getPayrollValidationIssues = async (
  runId: string,
): Promise<PayrollValidationIssue[]> => {
  const res = await apiInstance.get(`/payroll/runs/${runId}/validation-issues`);
  const d = res.data?.data ?? res.data;
  return Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
};

export const getPayslips = async (
  params?: Record<string, unknown>,
): Promise<PayslipItem[]> => {
  const res = await apiInstance.get("/payroll/payslips", { params });
  const d = res.data?.data ?? res.data;
  return Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
};

export const getPaymentBatches = async (): Promise<PaymentBatch[]> => {
  const res = await apiInstance.get("/payroll/payment-batches");
  const d = res.data?.data ?? res.data;
  return Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
};

export const payrollApi = {
  getPayrollDashboard,
  getDashboard: getPayrollDashboard,
  getPayrollPeriods,
  getPeriods: getPayrollPeriods,
  createPeriod: async (data: Partial<PayrollPeriod>) => {
    const res = await apiInstance.post("/payroll/periods", data);
    return res.data?.data ?? res.data;
  },
  getPayrollRun,
  getRun: getPayrollRun,
  getReviewData: async (runId: string): Promise<PayrollReviewData> => {
    const res = await apiInstance.get(`/payroll/runs/${runId}/review`);
    return res.data?.data ?? res.data;
  },
  getPayrollRunEmployees,
  getRunEmployees: getPayrollRunEmployees,
  getPayrollValidationIssues,
  getValidationIssues: getPayrollValidationIssues,
  startRun: async (periodId: string) => {
    const res = await apiInstance.post("/payroll/runs", {
      period_id: periodId,
    });
    return res.data?.data ?? res.data;
  },
  recalculateRun: async (runId: string) => {
    const res = await apiInstance.post(
      `/payroll/runs/${runId}/recalculate`,
      {},
    );
    return res.data?.data ?? res.data;
  },
  revalidateRun: async (runId: string) => {
    const res = await apiInstance.post(`/payroll/runs/${runId}/revalidate`, {});
    return res.data?.data ?? res.data;
  },
  approveRun: async (runId: string) => {
    const res = await apiInstance.post(`/payroll/runs/${runId}/approve`, {});
    return res.data?.data ?? res.data;
  },
  finalizeRun: async (runId: string) => {
    const res = await apiInstance.post(`/payroll/runs/${runId}/finalize`, {});
    return res.data?.data ?? res.data;
  },
  getPayslips,
  getPayslipById: async (id: string): Promise<PayrollPayslipData> => {
    const res = await apiInstance.get(`/payroll/payslips/${id}`);
    return res.data?.data ?? res.data;
  },
  getPaymentBatches,
  getPaymentBatchById: async (batchId: string) => {
    const res = await apiInstance.get(`/payroll/payment-batches/${batchId}`);
    return res.data?.data ?? res.data;
  },
  createPaymentBatch: async (runId: string) => {
    const res = await apiInstance.post("/payroll/payment-batches", {
      run_id: runId,
    });
    return res.data?.data ?? res.data;
  },
  approvePaymentBatch: async (batchId: string) => {
    const res = await apiInstance.post(
      `/payroll/payment-batches/${batchId}/approve`,
      {},
    );
    return res.data?.data ?? res.data;
  },
  processPaymentBatch: async (batchId: string) => {
    const res = await apiInstance.post(
      `/payroll/payment-batches/${batchId}/process`,
      {},
    );
    return res.data?.data ?? res.data;
  },
};

export default payrollApi;

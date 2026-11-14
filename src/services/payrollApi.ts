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

export type PayrollStatus = "draft" | "processing" | "validated" | "approved" | "finalized" | "paid" | string;
export type PayrollRunStatus = PayrollStatus;
export type PayrollRunStep = "processing" | "validation" | "preview" | "review" | "approval" | "finalize" | "payment" | string;

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

const MOCK_RUN: PayrollRun = {
  id: "run-2026-11",
  period_id: "per-2026-11",
  period_name: "November 2026",
  month: 11,
  year: 2026,
  status: "validated",
  total_employees: 48,
  total_gross: 425000,
  total_deductions: 68000,
  total_net: 357000,
  created_at: new Date().toISOString(),
};

const MOCK_EMPLOYEES: PayrollPreviewEmployee[] = [
  {
    id: "pe-1",
    employee_id: "EMP-001",
    employee_name: "Alex Vance",
    department: "Engineering",
    designation: "VP Engineering",
    gross_pay: 15000,
    deductions: 2800,
    net_pay: 12200,
    basic: 7500,
    hra: 3750,
    allowances: 3750,
    pf: 900,
    tax: 1900,
    days_worked: 22,
    lop_days: 0,
    status: "valid",
  },
];

export const getPayrollDashboard = async () => ({
  active_run: MOCK_RUN,
  recent_runs: [MOCK_RUN],
  summary: {
    total_payroll_cost: 425000,
    total_net_pay: 357000,
    total_deductions: 68000,
    headcount: 48,
  },
});

export const getPayrollPeriods = async (): Promise<PayrollPeriod[]> => [
  {
    id: "per-2026-11",
    name: "November 2026",
    month: 11,
    year: 2026,
    start_date: "2026-11-01",
    end_date: "2026-11-30",
    status: "open",
    run_id: "run-2026-11",
  },
];

export const getPayrollRun = async (runId: string): Promise<PayrollRun> => ({ ...MOCK_RUN, id: runId || MOCK_RUN.id });
export const getPayrollRunEmployees = async (_runId: string): Promise<PayrollPreviewEmployee[]> => MOCK_EMPLOYEES;
export const getPayrollValidationIssues = async (_runId: string): Promise<PayrollValidationIssue[]> => [];
export const getPayslips = async (): Promise<PayslipItem[]> => [
  {
    id: "ps-1",
    run_id: "run-2026-11",
    employee_id: "EMP-001",
    employee_name: "Alex Vance",
    department: "Engineering",
    period_name: "November 2026",
    month: 11,
    year: 2026,
    gross_pay: 15000,
    deductions: 2800,
    net_pay: 12200,
    status: "published",
    generated_at: new Date().toISOString(),
  },
];
export const getPaymentBatches = async (): Promise<PaymentBatch[]> => [
  {
    id: "batch-1",
    run_id: "run-2026-11",
    batch_number: "BATCH-2026-11-01",
    total_amount: 357000,
    employee_count: 48,
    status: "approved",
    created_at: new Date().toISOString(),
  },
];

export const payrollApi = {
  getPayrollDashboard,
  getDashboard: getPayrollDashboard,
  getPayrollPeriods,
  getPeriods: getPayrollPeriods,
  createPeriod: async (data: Partial<PayrollPeriod>) => ({ id: `per-${Date.now()}`, ...data }),
  getPayrollRun,
  getRun: getPayrollRun,
  getReviewData: async (runId: string): Promise<PayrollReviewData> => ({
    run: { ...MOCK_RUN, id: runId },
    employees: MOCK_EMPLOYEES,
    summary: { total_employees: 48, total_gross: 425000, total_deductions: 68000, total_net: 357000 },
  }),
  getPayrollRunEmployees,
  getRunEmployees: getPayrollRunEmployees,
  getPayrollValidationIssues,
  getValidationIssues: getPayrollValidationIssues,
  startRun: async (_periodId: string) => MOCK_RUN,
  recalculateRun: async (runId: string) => ({ ...MOCK_RUN, id: runId }),
  revalidateRun: async (runId: string) => ({ ...MOCK_RUN, id: runId }),
  approveRun: async (runId: string) => ({ ...MOCK_RUN, id: runId, status: "approved" }),
  finalizeRun: async (runId: string) => ({ ...MOCK_RUN, id: runId, status: "finalized" }),
  getPayslips,
  getPayslipById: async (id: string): Promise<PayrollPayslipData> => ({
    ...(await getPayslips())[0],
    id,
    earnings: [
      { name: "Basic Salary", amount: 7500 },
      { name: "House Rent Allowance", amount: 3750 },
      { name: "Special Allowance", amount: 3750 },
    ],
    deductions_list: [
      { name: "Provident Fund", amount: 900 },
      { name: "Income Tax (TDS)", amount: 1900 },
    ],
  }),
  getPaymentBatches,
  getPaymentBatchById: async (batchId: string) => ({ ...(await getPaymentBatches())[0], id: batchId }),
  createPaymentBatch: async (_runId: string) => (await getPaymentBatches())[0],
  approvePaymentBatch: async (batchId: string) => ({ ...(await getPaymentBatches())[0], id: batchId, status: "approved" }),
  processPaymentBatch: async (batchId: string) => ({ ...(await getPaymentBatches())[0], id: batchId, status: "paid" }),
};

export default payrollApi;

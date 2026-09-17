import apiInstance from "@/api/apiInstance";

// ── Types ─────────────────────────────────────────────────────────────

export interface PayrollPeriod {
  id: string;
  name: string; // e.g., "April 2026", "March 2026"
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}

export interface PayrollSummary {
  employeeCount: number | null;
  grossPayroll: number | null;
  totalDeductions: number | null;
  netPayroll: number | null;
  employerCost: number | null;
}

export type PayrollStatus =
  | "Not Started"
  | "Processing"
  | "Provision Generated"
  | "Under Review"
  | "Pending Approval"
  | "Approved"
  | "Finalized"
  | "Failed"
  | string;

export type ReadinessStatus = "Ready" | "Warning" | "Error";

export type PayrollReadinessArea =
  | "Employee Data"
  | "Salary Structures"
  | "Attendance"
  | "Leave Data"
  | "Overtime"
  | "Loans / Advances"
  | "Tax / Statutory Configuration";

export interface PayrollReadinessItem {
  area: PayrollReadinessArea;
  status: ReadinessStatus;
  details?: string;
}

export interface PayrollReadiness {
  items: PayrollReadinessItem[];
  isReady?: boolean;
}

export interface PayrollIssue {
  id: string;
  type: "error" | "warning";
  category: string;
  message: string;
  employeeId?: string;
  employeeName?: string;
}

export interface PayrollIssues {
  errors: PayrollIssue[];
  warnings: PayrollIssue[];
}

export interface PayrollRun {
  id: string;
  periodId: string;
  periodName: string;
  employeeCount: number | null;
  grossPayroll: number | null;
  netPayroll: number | null;
  status: PayrollStatus;
  runDate: string | null;
}

export interface PayrollDashboardData {
  period: PayrollPeriod | null;
  summary: PayrollSummary | null;
  status: PayrollStatus | null;
  readiness: PayrollReadiness | null;
  issues: PayrollIssues | null;
  recentRuns: PayrollRun[] | null;
}

export interface RunPayrollResponse {
  success: boolean;
  status?: string;
  message?: string;
  runId?: string;
  [key: string]: unknown;
}

// ── Helper to extract API data safely ─────────────────────────────────

function extractData<T>(res: unknown): T {
  const r = res as { data?: unknown; status?: number; headers?: unknown } | undefined;
  const body =
    r?.data !== undefined && (r?.status !== undefined || r?.headers !== undefined)
      ? r.data
      : res;

  if (body == null) return null as unknown as T;

  if (typeof body === "object") {
    const b = body as Record<string, unknown>;
    if ("data" in b && b.data !== undefined) return b.data as T;
    if ("result" in b && b.result !== undefined) return b.result as T;
  }

  return body as T;
}

// ── Real API Service ─────────────────────────────────────────────────

export const payrollApi = {
  /**
   * Fetch all configured payroll periods from the backend.
   * GET /api/v1/payroll/periods
   */
  async getPeriods(): Promise<PayrollPeriod[]> {
    const res = await apiInstance.get("/payroll/periods");
    const data = extractData<PayrollPeriod[] | { periods: PayrollPeriod[] }>(res);
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === "object" && Array.isArray((data as { periods: PayrollPeriod[] }).periods)) {
      return (data as { periods: PayrollPeriod[] }).periods;
    }
    return [];
  },

  /**
   * Fetch the comprehensive dashboard data for a given payroll period.
   * GET /api/v1/payroll/dashboard?periodId=...
   */
  async getDashboard(periodId?: string): Promise<PayrollDashboardData> {
    const res = await apiInstance.get("/payroll/dashboard", {
      params: periodId ? { periodId } : undefined,
    });
    return extractData<PayrollDashboardData>(res);
  },

  /**
   * Trigger provisional payroll calculation for the given period.
   * POST /api/v1/payroll/run
   * Note: Running payroll produces provisional results and does NOT finalize payroll or initiate payments.
   */
  async runPayroll(periodId: string): Promise<RunPayrollResponse> {
    const res = await apiInstance.post("/payroll/run", { periodId });
    return extractData<RunPayrollResponse>(res);
  },
};

export default payrollApi;

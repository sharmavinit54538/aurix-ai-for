import apiInstance from "@/api/apiInstance";

// ── Types ─────────────────────────────────────────────────────────────

export interface PayrollPeriod {
  id: string;
  name: string; // e.g., "April 2026", "March 2026"
  startDate: string;
  endDate: string;
  payDate?: string;
  status?: PayrollStatus;
  employeeCount?: number | null;
  periodMonth?: number;
  periodYear?: number;
  isCurrent?: boolean;
  isLocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  remarks?: string;
  [key: string]: unknown;
}

export interface GetPeriodsParams {
  page?: number;
  limit?: number;
  status?: string;
  year?: number;
  month?: number;
  search?: string;
  company_id?: string;
}

export interface GetPeriodsResponse {
  items: PayrollPeriod[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreatePeriodPayload {
  name: string;
  startDate: string;
  endDate: string;
  payDate: string;
  periodMonth?: number;
  periodYear?: number;
  remarks?: string;
  companyId?: string;
}

export interface PayrollSummary {
  employeeCount: number | null;
  grossPayroll: number | null;
  totalDeductions: number | null;
  netPayroll: number | null;
  employerCost: number | null;
}

export type PayrollStatus =
  | "Draft"
  | "Open"
  | "Processing"
  | "Provision Generated"
  | "Under Review"
  | "Pending Approval"
  | "Approved"
  | "Finalized"
  | "Closed"
  | "Locked"
  | "Void"
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

const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function normalizePayrollPeriod(item: any): PayrollPeriod {
  if (!item || typeof item !== "object") {
    return {
      id: "",
      name: "",
      startDate: "",
      endDate: "",
    };
  }

  const id = String(item.id || item.cycle_id || item.period_id || item._id || "");
  const month = Number(item.period_month ?? item.month ?? 0) || undefined;
  const year = Number(item.period_year ?? item.year ?? 0) || undefined;

  let name = item.name || item.period_name || item.title || "";
  if (!name && month && year) {
    name = `${MONTH_NAMES[month] || `Month ${month}`} ${year}`;
  } else if (!name && (item.startDate || item.start_date)) {
    name = String(item.startDate || item.start_date);
  }

  const startDate = item.startDate || item.start_date || "";
  const endDate = item.endDate || item.end_date || "";
  const payDate = item.payDate || item.pay_date || "";
  const rawStatus = item.status || (item.is_locked ? "Locked" : "Open");
  const employeeCount =
    item.employeeCount ?? item.employee_count ?? item.total_employees ?? null;
  const isLocked = Boolean(
    item.is_locked ||
      item.isLocked ||
      String(rawStatus).toLowerCase() === "locked" ||
      String(rawStatus).toLowerCase() === "finalized" ||
      String(rawStatus).toLowerCase() === "closed"
  );
  const isCurrent = Boolean(item.isCurrent || item.is_current);
  const createdAt = item.createdAt || item.created_at || "";
  const updatedAt = item.updatedAt || item.updated_at || "";
  const remarks = item.remarks || item.notes || "";

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

// ── Real API Service ─────────────────────────────────────────────────

export const payrollApi = {
  /**
   * Fetch paginated payroll periods/cycles with filters and server-side pagination.
   * Connects to /api/v2/payroll/cycles with fallback to /payroll/periods.
   */
  async getPeriodsList(params?: GetPeriodsParams): Promise<GetPeriodsResponse> {
    const queryParams: Record<string, any> = {};
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.status && params.status !== "all") queryParams.status = params.status;
    if (params?.year) queryParams.year = params.year;
    if (params?.month) queryParams.month = params.month;
    if (params?.search) queryParams.search = params.search;
    if (params?.company_id) queryParams.company_id = params.company_id;

    try {
      const res = await apiInstance.get("/api/v2/payroll/cycles", { params: queryParams });
      const body = res?.data !== undefined ? res.data : res;
      const data = extractData<any>(body);

      let rawList: any[] = [];
      let total = 0;
      let page = params?.page || 1;
      let limit = params?.limit || 20;
      let totalPages = 1;

      if (Array.isArray(data)) {
        rawList = data;
        total = data.length;
      } else if (data && typeof data === "object") {
        if (Array.isArray(data.items)) rawList = data.items;
        else if (Array.isArray(data.cycles)) rawList = data.cycles;
        else if (Array.isArray(data.periods)) rawList = data.periods;
        else if (Array.isArray(data.data)) rawList = data.data;

        total = Number(data.total ?? data.count ?? rawList.length) || rawList.length;
        page = Number(data.page ?? params?.page ?? 1) || 1;
        limit = Number(data.limit ?? params?.limit ?? 20) || 20;
        totalPages =
          Number(data.pages ?? data.total_pages ?? Math.ceil(total / limit)) || 1;
      }

      const items = rawList.map(normalizePayrollPeriod);
      return { items, total, page, limit, totalPages };
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // Fallback to /payroll/periods
        const res = await apiInstance.get("/payroll/periods", { params: queryParams });
        const data = extractData<any>(res);
        let rawList: any[] = [];
        if (Array.isArray(data)) rawList = data;
        else if (data?.periods && Array.isArray(data.periods)) rawList = data.periods;
        else if (data?.items && Array.isArray(data.items)) rawList = data.items;
        const items = rawList.map(normalizePayrollPeriod);
        return {
          items,
          total: items.length,
          page: 1,
          limit: items.length || 20,
          totalPages: 1,
        };
      }
      throw err;
    }
  },

  /**
   * Fetch all configured payroll periods from the backend (flat array).
   * Backwards compatible with dashboard period selectors.
   */
  async getPeriods(): Promise<PayrollPeriod[]> {
    try {
      const res = await this.getPeriodsList({ limit: 100 });
      return res.items;
    } catch (err) {
      // Direct fallback to legacy /payroll/periods
      try {
        const res = await apiInstance.get("/payroll/periods");
        const data = extractData<PayrollPeriod[] | { periods: PayrollPeriod[] }>(res);
        if (Array.isArray(data)) {
          return data.map(normalizePayrollPeriod);
        }
        if (
          data &&
          typeof data === "object" &&
          Array.isArray((data as { periods: PayrollPeriod[] }).periods)
        ) {
          return (data as { periods: PayrollPeriod[] }).periods.map(
            normalizePayrollPeriod
          );
        }
        return [];
      } catch {
        throw err;
      }
    }
  },

  /**
   * Fetch a single pay cycle / period by ID.
   */
  async getPeriod(id: string): Promise<PayrollPeriod | null> {
    try {
      const res = await apiInstance.get(`/api/v2/payroll/cycles/${id}`);
      const data = extractData<any>(res);
      return data ? normalizePayrollPeriod(data) : null;
    } catch (err: any) {
      if (err?.response?.status === 404) {
        const res = await apiInstance.get(`/payroll/periods/${id}`);
        const data = extractData<any>(res);
        return data ? normalizePayrollPeriod(data) : null;
      }
      throw err;
    }
  },

  /**
   * Create a new payroll period / cycle.
   */
  async createPeriod(payload: CreatePeriodPayload): Promise<PayrollPeriod> {
    const body: Record<string, any> = {
      name: payload.name,
      start_date: payload.startDate,
      end_date: payload.endDate,
      pay_date: payload.payDate,
      startDate: payload.startDate,
      endDate: payload.endDate,
      payDate: payload.payDate,
      remarks: payload.remarks || undefined,
    };
    if (payload.periodMonth) body.period_month = payload.periodMonth;
    if (payload.periodYear) body.period_year = payload.periodYear;
    if (payload.companyId) body.company_id = payload.companyId;

    try {
      const res = await apiInstance.post("/api/v2/payroll/cycles", body);
      const data = extractData<any>(res);
      return normalizePayrollPeriod(data);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        const res = await apiInstance.post("/payroll/periods", body);
        const data = extractData<any>(res);
        return normalizePayrollPeriod(data);
      }
      throw err;
    }
  },

  /**
   * Lock pay cycle — freeze computed figures.
   */
  async lockPeriod(
    id: string,
    reason?: string
  ): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.post(`/api/v2/payroll/cycles/${id}/lock`, {
      reason: reason || null,
    });
    return (
      extractData<{ success: boolean; message?: string }>(res) || { success: true }
    );
  },

  /**
   * Reopen a locked pay cycle (Admin only).
   */
  async reopenPeriod(
    id: string,
    reason: string
  ): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.post(`/api/v2/payroll/cycles/${id}/reopen`, {
      reason,
    });
    return (
      extractData<{ success: boolean; message?: string }>(res) || { success: true }
    );
  },

  /**
   * Void / cancel a pay cycle.
   */
  async voidPeriod(
    id: string,
    reason?: string
  ): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.post(`/api/v2/payroll/cycles/${id}/void`, {
      reason: reason || null,
    });
    return (
      extractData<{ success: boolean; message?: string }>(res) || { success: true }
    );
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

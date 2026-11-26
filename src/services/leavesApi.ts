import { api } from "@/api";
import {
  LeaveBalance,
  LeaveBalanceResponse,
  LeaveRequestCreate,
  LeaveRequestResponse,
  LeaveRequest,
  LeaveRequestExtended,
  LeaveEmployee,
  LeaveEmployeeResponse,
  LeaveHistoryResponse,
  LeavePendingResponse,
  LeavePaginationMeta,
  LeaveAllRequestsParams,
  LeaveAllRequestsResponse,
  LeaveReviewRequest,
  LeaveReviewResponse,
  LeaveCancelResponse,
} from "@/features/leaves/types";

function unwrapData<T>(res: any): T {
  const data = res?.data?.data ?? res?.data ?? res;
  if (data && typeof data === "object" && "success" in data) {
    if (data.success === false) {
      throw new Error(data.message || "API request failed");
    }
    return data.data as T;
  }
  return data as T;
}

function unwrapPaginated<T>(res: any): { items: T[]; meta: LeavePaginationMeta } {
  const payload = res?.data?.data ?? res?.data ?? res;
  if (payload && typeof payload === "object") {
    if (payload.success === false) {
      throw new Error(payload.message || "API request failed");
    }
    let items: T[] = [];
    let meta: LeavePaginationMeta = { total: 0, page: 1, limit: 20, pages: 1 };
    
    if (Array.isArray(payload)) {
      items = payload as T[];
    } else if (Array.isArray(payload.items)) {
      items = payload.items as T[];
      meta = payload.meta ?? meta;
    } else if (Array.isArray(payload.data)) {
      items = payload.data as T[];
      meta = payload.meta ?? meta;
    } else if (Array.isArray(payload.leaves)) {
      items = payload.leaves as T[];
      meta = payload.meta ?? meta;
    }
    
    return { items, meta };
  }
  return { items: [], meta: { total: 0, page: 1, limit: 20, pages: 1 } };
}

// ─────────────────────────────────────────────────────────────
// My Leave Balances
// ─────────────────────────────────────────────────────────────

/**
 * Get authenticated employee's leave balances.
 * Calls GET /api/v1/leaves/balances
 */
export async function getMyLeaveBalances(): Promise<LeaveBalance[]> {
  const res = await api.get("/leaves/balances", {
    headers: { "x-skip-cache": "true" },
  });
  const data = unwrapData<LeaveBalanceResponse>(res);
  return data.data || [];
}

// ─────────────────────────────────────────────────────────────
// Apply for Leave
// ─────────────────────────────────────────────────────────────

/**
 * Submit a new leave request.
 * Calls POST /api/v1/leaves/apply
 * Backend calculates total_days, so omit it from payload.
 */
export async function applyLeave(payload: LeaveRequestCreate): Promise<LeaveRequestResponse> {
  const res = await api.post("/leaves/apply", payload);
  const data = unwrapData<{ success: boolean; message: string; data: LeaveRequestResponse }>(res);
  return data.data;
}

// ─────────────────────────────────────────────────────────────
// My Leave History
// ─────────────────────────────────────────────────────────────

/**
 * Get authenticated employee's leave history with pagination.
 * Calls GET /api/v1/leaves/history
 */
export async function getMyLeaveHistory(page = 1, limit = 20): Promise<{ items: LeaveRequest[]; meta: LeavePaginationMeta }> {
  const res = await api.get("/leaves/history", {
    params: { page, limit },
    headers: { "x-skip-cache": "true" },
  });
  return unwrapPaginated<LeaveRequest>(res);
}

// ─────────────────────────────────────────────────────────────
// Pending Approvals (for reviewers)
// ─────────────────────────────────────────────────────────────

/**
 * Get pending leave requests for the authenticated reviewer.
 * Calls GET /api/v1/leaves/pending
 */
export async function getPendingApprovals(): Promise<LeaveRequest[]> {
  const res = await api.get("/leaves/pending", {
    headers: { "x-skip-cache": "true" },
  });
  const data = unwrapData<LeavePendingResponse>(res);
  return data.data || [];
}

// ─────────────────────────────────────────────────────────────
// Company Employees (for HR Admin)
// ─────────────────────────────────────────────────────────────

/**
 * Get company employees for leave balance lookup.
 * Calls GET /api/v1/leaves/employees
 */
export async function getCompanyEmployees(query?: string, page = 1, limit = 50): Promise<{ items: LeaveEmployee[]; meta: LeavePaginationMeta }> {
  const res = await api.get("/leaves/employees", {
    params: { q: query, page, limit },
    headers: { "x-skip-cache": "true" },
  });
  return unwrapPaginated<LeaveEmployee>(res);
}

// ─────────────────────────────────────────────────────────────
// Employee Leave Balances (for HR Admin / Manager)
// ─────────────────────────────────────────────────────────────

/**
 * Get specific employee's leave balances by UUID.
 * Calls GET /api/v1/leaves/balances/{employee_id}
 */
export async function getEmployeeLeaveBalances(employeeId: string): Promise<LeaveBalance[]> {
  const res = await api.get(`/leaves/balances/${employeeId}`, {
    headers: { "x-skip-cache": "true" },
  });
  const data = unwrapData<LeaveBalanceResponse>(res);
  return data.data || [];
}

// ─────────────────────────────────────────────────────────────
// All Leave Requests (for HR Admin)
// ─────────────────────────────────────────────────────────────

/**
 * Get all leave requests with filters and pagination.
 * Calls GET /api/v1/leaves/requests
 * Supported params: page, limit, status, department, employee_id, search, from_date, to_date
 */
export async function getAllLeaveRequests(params: LeaveAllRequestsParams = {}): Promise<{ items: LeaveRequestExtended[]; meta: LeavePaginationMeta }> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status && params.status !== "all") searchParams.set("status", params.status);
  if (params.department) searchParams.set("department", params.department);
  if (params.employee_id) searchParams.set("employee_id", params.employee_id);
  if (params.search) searchParams.set("search", params.search);
  if (params.from_date) searchParams.set("from_date", params.from_date);
  if (params.to_date) searchParams.set("to_date", params.to_date);

  const res = await api.get(`/leaves/requests?${searchParams.toString()}`, {
    headers: { "x-skip-cache": "true" },
  });
  return unwrapPaginated<LeaveRequestExtended>(res);
}

// ─────────────────────────────────────────────────────────────
// Review Leave (Approve/Reject)
// ─────────────────────────────────────────────────────────────

/**
 * Review a leave request (approve or reject).
 * Calls POST /api/v1/leaves/{leave_id}/review
 */
export async function reviewLeave(leaveId: string, payload: LeaveReviewRequest): Promise<LeaveRequestResponse> {
  const res = await api.post(`/leaves/${leaveId}/review`, payload);
  const data = unwrapData<LeaveReviewResponse>(res);
  return data.data;
}

/**
 * Approve a leave request.
 */
export async function approveLeave(leaveId: string): Promise<LeaveRequestResponse> {
  return reviewLeave(leaveId, { status: "APPROVED" });
}

/**
 * Reject a leave request.
 */
export async function rejectLeave(leaveId: string, rejectionReason: string): Promise<LeaveRequestResponse> {
  return reviewLeave(leaveId, { status: "REJECTED", rejection_reason: rejectionReason });
}

// ─────────────────────────────────────────────────────────────
// Cancel Leave
// ─────────────────────────────────────────────────────────────

/**
 * Cancel a leave request.
 * Calls POST /api/v1/leaves/{leave_id}/cancel
 */
export async function cancelLeave(leaveId: string): Promise<void> {
  const res = await api.post(`/leaves/${leaveId}/cancel`);
  const data = unwrapData<LeaveCancelResponse>(res);
  if (!data.success) {
    throw new Error(data.message || "Failed to cancel leave request.");
  }
}

// ─────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────

export const leavesApi = {
  getMyLeaveBalances,
  applyLeave,
  getMyLeaveHistory,
  getPendingApprovals,
  getCompanyEmployees,
  getEmployeeLeaveBalances,
  getAllLeaveRequests,
  reviewLeave,
  approveLeave,
  rejectLeave,
  cancelLeave,
};

export default leavesApi;
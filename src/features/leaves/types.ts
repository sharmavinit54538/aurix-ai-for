export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled" | "unknown";

export interface LeaveBalance {
  leave_type: string;
  total_days: number;
  used_days: number;
  remaining_days: number;
  pending_days?: number;
  available_days?: number;
}

export interface LeaveBalanceResponse {
  success: boolean;
  message: string;
  data: LeaveBalance[];
}

export interface LeaveRequestCreate {
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
}

export interface LeaveRequestResponse {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_code?: string | null;
  department?: string | null;
  leave_type: string;
  start_date: string;
  end_date: string;
  total_days: number | string;
  reason: string;
  status: string;
  approved_by_id?: string | null;
  reviewed_by_id?: string | null;
  reviewed_by_name?: string | null;
  reviewed_at?: string | null;
  rejection_reason?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface LeaveRequest {
  id: string;
  employee_name: string;
  department: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string;
  status: LeaveStatus;
  rejection_reason?: string;
}

/** Extended leave request for org-wide view (All Requests tab) */
export interface LeaveRequestExtended extends LeaveRequest {
  employee_code?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at?: string;
  reviewed_by_id?: string | null;
}

export interface LeaveEmployee {
  id: string; // UUID used by /leaves/balances/{id}
  employee_code: string;
  full_name: string;
  department: string;
  designation: string;
}

export interface LeaveEmployeeResponse {
  success: boolean;
  message: string;
  data: LeaveEmployee[];
}

export interface LeaveHistoryResponse {
  success: boolean;
  message: string;
  data: LeaveRequest[];
  meta: LeavePaginationMeta;
}

export interface LeavePendingResponse {
  success: boolean;
  message: string;
  data: LeaveRequest[];
}

export interface LeavePaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface LeaveAllRequestsParams {
  page?: number;
  limit?: number;
  status?: string;
  department?: string;
  employee_id?: string;
  search?: string;
  from_date?: string;
  to_date?: string;
}

export interface LeaveAllRequestsResponse {
  success: boolean;
  message: string;
  data: LeaveRequestExtended[];
  meta: LeavePaginationMeta;
}

export interface LeaveReviewRequest {
  status: "APPROVED" | "REJECTED";
  rejection_reason?: string;
}

export interface LeaveReviewResponse {
  success: boolean;
  message: string;
  data: LeaveRequestResponse;
}

export interface LeaveCancelResponse {
  success: boolean;
  message: string;
}

export interface LeaveCapabilities {
  canReview: boolean;
  canViewAllBalances: boolean;
  canViewAllRequests: boolean;
  canApply: boolean;
}

export interface ApplyLeaveFormData {
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
}

export interface LeaveTypeOption {
  label: string;
  value: string;
  remaining_days: number;
  total_days: number;
  used_days: number;
}

export const LEAVE_TYPES = ["Sick Leave", "Casual Leave", "Vacation Leave", "Bereavement Leave"] as const;

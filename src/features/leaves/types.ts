export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled" | "unknown";

export interface LeaveBalance {
  leave_type: string;
  total_days: number;
  used_days: number;
  remaining_days: number;
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
}

export interface LeaveEmployee {
  id: string; // UUID used by /leaves/balances/{id}
  employee_code: string;
  full_name: string;
  department: string;
  designation: string;
}

export interface LeaveCapabilities {
  canReview: boolean;
  canViewAllBalances: boolean;
  canViewAllRequests: boolean;
  canApply: boolean;
}

export const LEAVE_TYPES = ["Sick Leave", "Casual Leave", "Vacation Leave"] as const;

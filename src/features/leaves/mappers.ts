import type { LeaveBalance, LeaveRequest, LeaveRequestExtended, LeaveStatus } from "./types";

/**
 * Normalizes any casing ("PENDING", "APPROVED", "REJECTED", "CANCELLED", "CANCELED", "WITHDRAWN") to canonical LeaveStatus.
 * Unknown statuses map to "unknown" (not "pending") and warn once.
 */
let hasWarnedUnknownStatus = false;

export function mapStatus(rawStatus?: string | null): LeaveStatus {
  const s = String(rawStatus || "pending").trim().toLowerCase();
  if (s === "approved") return "approved";
  if (s === "rejected") return "rejected";
  if (s === "cancelled" || s === "canceled" || s === "withdrawn") return "cancelled";
  if (s === "pending") return "pending";
  if (!hasWarnedUnknownStatus) {
    hasWarnedUnknownStatus = true;
    console.warn(`[leaves] Unknown leave status "${rawStatus}", mapping to "unknown"`);
  }
  return "unknown";
}

/**
 * Checks if an error indicates "Employee profile not found".
 * Only true when message/data.message contains "employee profile not found" (case-insensitive).
 * Does NOT treat bare 404 as profile-not-found.
 */
export function isEmployeeProfileNotFound(err: any): boolean {
  const msg = err?.data?.message ?? err?.message ?? "";
  return typeof msg === "string" && msg.toLowerCase().includes("employee profile not found");
}

/**
 * Normalizes leave type strings for comparison: lowercases, removes spaces and underscores.
 */
export function normalizeLeaveType(type: string): string {
  return type.toLowerCase().replace(/[\s_]+/g, "");
}

/**
 * Unwraps list responses from various backend shapes:
 * - array
 * - {data: []}
 * - {data: {items: []}}
 * - {data: {balances: []}}
 * - {data: {leaves: []}}
 * Throws if res.success === false with res.message.
 * If shape is unrecognized, warns and returns empty array.
 */
export function unwrapList(res: any): any[] {
  if (res?.success === false) {
    throw new Error(res?.message || "Request failed");
  }

  // Direct array
  if (Array.isArray(res)) return res;

  const data = res?.data;
  if (Array.isArray(data)) return data;

  if (data && typeof data === "object") {
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.balances)) return data.balances;
    if (Array.isArray(data.leaves)) return data.leaves;
  }

  console.warn("[leaves] Unrecognized response shape for list, returning empty array:", res);
  return [];
}

/**
 * Normalizes backend leave response into safe LeaveRequest.
 */
export function mapLeave(raw: any): LeaveRequest {
  if (!raw || typeof raw !== "object") {
    return {
      id: "",
      employee_name: "",
      department: "",
      leave_type: "Leave",
      start_date: "",
      end_date: "",
      total_days: 0,
      reason: "No reason provided",
      status: "pending",
    };
  }

  const rawEmpName =
    raw.employee_name ??
    raw.employee?.fullName ??
    raw.employee?.full_name ??
    raw.full_name;

  const rawDept =
    raw.department ??
    raw.employee?.department;

  return {
    id: String(raw.id ?? ""),
    employee_name: rawEmpName && String(rawEmpName).trim() ? String(rawEmpName).trim() : "",
    department: rawDept && String(rawDept).trim() ? String(rawDept).trim() : "",
    leave_type: String(raw.leave_type ?? "Leave"),
    start_date: String(raw.start_date ?? ""),
    end_date: String(raw.end_date ?? ""),
    total_days: Number(raw.total_days) || 0,
    reason: String(raw.reason ?? "No reason provided"),
    status: mapStatus(raw.status),
    rejection_reason: raw.rejection_reason ? String(raw.rejection_reason) : undefined,
  };
}

/**
 * Normalizes backend leave response into safe LeaveRequestExtended for org-wide view.
 * Includes employee_code, reviewed_by, reviewed_at, created_at.
 */
export function mapLeaveExtended(raw: any): LeaveRequestExtended {
  const base = mapLeave(raw);
  return {
    ...base,
    employee_code: raw.employee_code ? String(raw.employee_code) : undefined,
    reviewed_by: raw.reviewed_by ? String(raw.reviewed_by) : undefined,
    reviewed_at: raw.reviewed_at ? String(raw.reviewed_at) : undefined,
    created_at: raw.created_at ? String(raw.created_at) : undefined,
  };
}

/**
 * Normalizes backend leave balance item into safe LeaveBalance.
 */
export function mapBalance(raw: any): LeaveBalance {
  if (!raw || typeof raw !== "object") {
    return {
      leave_type: "Leave",
      total_days: 0,
      used_days: 0,
      remaining_days: 0,
    };
  }

  return {
    leave_type: String(raw.leave_type ?? "Leave"),
    total_days: Number(raw.total_days) || 0,
    used_days: Number(raw.used_days) || 0,
    remaining_days: Number(raw.remaining_days) || 0,
  };
}

/**
 * Formats YYYY-MM-DD strings without timezone shift.
 * Parses as local date parts (year, month, day) instead of new Date("YYYY-MM-DD").
 * Uses "en-IN" locale formatting.
 */
export function formatDateStr(dateStr?: string | null): string {
  if (!dateStr) return "—";
  const match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1; // 0-indexed month
    const day = parseInt(match[3], 10);
    const localDate = new Date(year, month, day);
    return localDate.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Calculates estimated calendar days between start and end dates inclusive.
 * Parses as local date parts to prevent timezone shifts.
 */
export function calculateEstimatedDays(startStr: string, endStr: string): number {
  if (!startStr || !endStr) return 0;
  const startMatch = startStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  const endMatch = endStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!startMatch || !endMatch) return 0;

  const s = new Date(
    parseInt(startMatch[1], 10),
    parseInt(startMatch[2], 10) - 1,
    parseInt(startMatch[3], 10)
  );
  const e = new Date(
    parseInt(endMatch[1], 10),
    parseInt(endMatch[2], 10) - 1,
    parseInt(endMatch[3], 10)
  );

  const diffTime = e.getTime() - s.getTime();
  if (diffTime < 0) return 0;
  return Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Returns today's date formatted as YYYY-MM-DD in local time.
 */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Determines whether a leave request can be cancelled by the user.
 * Pending rows or future Approved rows (start_date >= today).
 * Unknown status returns false.
 */
export function isLeaveCancellable(
  leave: { status: LeaveStatus; start_date: string },
  todayStr: string = getTodayDateString()
): boolean {
  if (leave.status === "unknown") return false;
  if (leave.status === "pending") return true;
  if (leave.status === "approved" && leave.start_date >= todayStr) return true;
  return false;
}

export { LEAVE_TYPE_DOT, getLeaveTypeDot } from "@/lib/color-maps";
export { statusBadgeClass } from "@/lib/status-styles";

/**
 * Returns safe uppercase single letter avatar initial.
 */
export function getSafeInitial(name?: string | null): string {
  if (!name) return "E";
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed.charAt(0).toUpperCase() : "E";
}

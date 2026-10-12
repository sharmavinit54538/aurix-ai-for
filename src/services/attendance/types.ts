// ─────────────────────────────────────────────────────────────
// Type Definitions for Attendance Service (Backend Contract v1)
// ─────────────────────────────────────────────────────────────

export interface TodayAttendanceEmployee {
  id: string;
  employeeId: string;
  fullName: string;
  department: string;
  designation?: string;
  avatarUrl?: string;
  status: "present" | "late" | "absent" | "leave";
  checkInTime?: string | null;
  checkOutTime?: string | null;
  workingHours?: number | null;
  location?: string;
}

export interface AttendanceAnalyticsSummary {
  totalEmployees: number;
  present: number;
  late: number;
  absent: number;
  onLeave: number;
  onTimeRate?: number;
  averageWorkingHours?: number;
  checkedOutToday?: number;
}

export interface AttendanceTrendDataPoint {
  date: string;
  present: number;
  late: number;
  absent: number;
  onLeave: number;
  total: number;
}

export interface AttendanceTrendsResponse {
  trends: AttendanceTrendDataPoint[];
  dateRange: { start: string; end: string };
}

export interface AttendanceDistributionResponse {
  present: number;
  late: number;
  absent: number;
  onLeave: number;
  total: number;
}

export interface WeeklyAttendanceDataPoint {
  day: string;
  date: string;
  present: number;
  late: number;
  absent: number;
  onLeave: number;
  total: number;
}

export interface WeeklyAttendanceResponse {
  weekly: WeeklyAttendanceDataPoint[];
  dateRange: { start: string; end: string };
  viewMode: "week" | "month";
}

export interface AttendanceRateKPIResponse {
  currentRate: number;
  previousRate: number | null;
  changePercentagePoints: number | null;
  trend: "up" | "down" | "stable";
  period: { start: string; end: string };
  previousPeriod: { start: string; end: string } | null;
}

export interface AttendanceAnalyticsFilters {
  startDate?: string;
  endDate?: string;
  departmentId?: string;
  shiftId?: string;
  locationId?: string;
  viewMode?: "week" | "month";
}

export interface TodayPunchStatus {
  checkedIn: boolean;
  checkedOut: boolean;
  onBreak: boolean;
  checkInTime: string | null;
  checkOutTime: string | null;
  workingHours: number | null;
  breakDurationMinutes?: number;
  activeSeconds?: number;
  message?: string;
  attendanceId?: string;
}

export interface CheckInPayload {
  latitude?: number | null;
  longitude?: number | null;
  accuracy?: number | null;
  deviceInfo?: string;
  ipAddress?: string;
  notes?: string;
  file?: Blob | File;
  image_base64?: string;
}

export interface FaceStatusResponse {
  is_enrolled: boolean;
  enrolled_at?: string | null;
  faceRegistered?: boolean;
}

export interface FaceEnrollResponse {
  success: boolean;
  message: string;
}

export interface CheckOutPayload {
  latitude?: number | null;
  longitude?: number | null;
  accuracy?: number | null;
  deviceInfo?: string;
  ipAddress?: string;
  notes?: string;
  file?: Blob | File;
  image_base64?: string;
}

export interface BreakPayload {
  image_base64?: string;
  file?: Blob | File;
  latitude?: number | null;
  longitude?: number | null;
  accuracy?: number | null;
  deviceInfo?: string;
  notes?: string;
  reason?: string;
  ipAddress?: string;
}

export interface AttendancePunchResult {
  id: string;
  time: string;
  status: string;
  success: boolean;
  message?: string;
  isInsideGeofence?: boolean;
  employeeId?: string;
  employeeName?: string;
  workingHours?: number | null;
  checkInTime?: string | null;
  checkOutTime?: string | null;
}

export interface AttendanceHistoryItem {
  id: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  workingHours: number | null;
  employeeName?: string;
  status: "Present" | "Late" | "Absent" | "Half Day" | "On Leave";
  location?: string;
}

export interface TimelineEventItem {
  id: string;
  time: string;
  label: string;
  type: "checkin" | "checkout" | "break_start" | "break_end" | "regularization";
  notes?: string;
}

export interface GeofenceVerifyPayload {
  latitude: number;
  longitude: number;
  officeId?: string;
}

export interface GeofenceVerifyResult {
  isInside: boolean;
  distanceMeters?: number;
  officeName?: string;
  allowedRadiusMeters?: number;
}

/**
 * Face Attendance status returned by GET /api/v1/attendance/face/me,
 * augmented with inferred enrollment state and extended shift summary.
 */
export interface FaceAttendanceStatus {
  faceRegistered: boolean;
  checkedIn: boolean;
  checkedOut: boolean;
  checkInTime: string | null;
  checkOutTime: string | null;
  workingHours: number | null;
  message: string;
  raw: Record<string, unknown>;
  errorCode?: string;
  shift?: FaceShiftSummary;
  timezone?: string;
  enrolled_at?: string | null;
}

export interface FaceShiftSummary {
  shift_id: string;
  shift_name: string;
  start_time: string;
  end_time: string;
  grace_period_mins: number;
  break_duration_mins: number;
  is_overnight: boolean;
  is_off: boolean;
  is_holiday: boolean;
  holiday_name?: string | null;
  source: "roster" | "assignment" | "company_default" | "fallback";
  night_shift: boolean;
  night_premium_percent: number;
}

/**
 * Shift as returned by the backend API.
 * All fields match the contract exactly (snake_case in API, camelCase here).
 */
export interface Shift {
  id: string;
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  is_overnight: boolean;
  duration_minutes: number;
  work_hours: number;
  grace_period_minutes: number;
  break_duration_minutes: number;
  night_shift: boolean;
  night_premium_percent: number;
  working_days: WeekDay[];
  is_active: boolean;
  is_default: boolean;
  color: string;
  description: string;
  assigned_employees_count: number;
  created_at: string;
  updated_at: string;
}

export type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export const WEEK_DAYS: WeekDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * Payload for creating a shift (camelCase for client, converted to snake_case in service).
 */
export interface ShiftCreatePayload {
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  grace_period_minutes: number;
  break_duration_minutes: number;
  night_shift: boolean;
  night_premium_percent: number;
  working_days: WeekDay[];
  color?: string;
  description?: string;
  is_active?: boolean;
}

/**
 * Minimal shift option for dropdowns (from /shifts/options).
 */
export interface ShiftOption {
  id: string;
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  is_overnight: boolean;
}

/**
 * Result of shift assignment (from POST /shifts/{id}/assign).
 */
export interface ShiftAssignResult {
  assigned_count: number;
  skipped: Array<{ employee_id: string; reason: string }>;
  effective_date: string;
}

export interface ShiftAssignPayload {
  employee_ids: string[];
  effective_date: string;
  notes?: string;
}

/**
 * Shift change request (from /shifts/change-requests).
 */
export interface ShiftChangeRequest {
  id: string;
  employee_id?: string;
  employee_name?: string;
  current_shift_name?: string;
  requested_shift_id: string;
  requested_shift_name: string;
  effective_date: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  review_note?: string | null;
  created_at: string;
}

export interface CreateChangeRequestPayload {
  requested_shift_id: string;
  effective_date: string;
  reason: string;
}

export interface ApproveChangeRequestPayload {
  note?: string;
}

export interface RejectChangeRequestPayload {
  note: string;
}

export interface ListChangeRequestsParams {
  status?: "pending" | "approved" | "rejected" | "cancelled";
  page?: number;
  limit?: number;
}

/**
 * Self schedule response (from GET /shifts/me/schedule).
 */
export interface MyScheduleData {
  has_assigned_shift: boolean;
  timezone: string;
  employee: {
    id: string;
    employee_id: string;
    full_name: string;
    department: string;
    designation: string;
    branch: string;
  };
  current_shift: MyShiftInfo | null;
  today: MyTodayShift | null;
  upcoming: MyUpcomingShift[];
  history: MyShiftHistory[];
}

export interface MyShiftInfo {
  id: string;
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  is_overnight: boolean;
  is_off: boolean;
  is_holiday: boolean;
  holiday_name?: string | null;
  source: "roster" | "assignment" | "company_default" | "fallback";
  grace_period_mins: number;
  break_duration_mins: number;
  night_shift: boolean;
  night_premium_percent: number;
  working_days: WeekDay[];
}

export interface MyTodayShift {
  date: string;
  day: string;
  shift_name: string;
  start_time: string;
  end_time: string;
  is_overnight: boolean;
  is_off: boolean;
  is_holiday: boolean;
  holiday_name?: string | null;
  source: "roster" | "assignment" | "company_default" | "fallback";
  checked_in: boolean;
  checked_out: boolean;
  check_in_time: string | null;
  check_out_time: string | null;
  working_hours: number | null;
  is_late: boolean;
  late_minutes: number;
}

export interface MyUpcomingShift {
  date: string;
  day: string;
  shift_name: string;
  start_time: string;
  end_time: string;
  is_overnight: boolean;
  is_off: boolean;
  is_holiday: boolean;
  holiday_name?: string | null;
  source: "roster" | "assignment" | "company_default" | "fallback";
  working_hours: number | null;
}

export interface MyShiftHistory {
  attendance_id: string;
  date: string;
  day: string;
  shift_name: string;
  scheduled_start: string;
  scheduled_end: string;
  check_in_time: string | null;
  check_out_time: string | null;
  working_hours: number | null;
  overtime_hours: number | null;
  status: "Present" | "Late" | "Half Day" | "Absent" | "On Leave" | "Off" | "Holiday" | "Auto Closed";
  is_late: boolean;
  late_minutes: number;
  is_early_checkout: boolean;
  early_minutes: number;
  auto_closed: boolean;
}

/**
 * Roster types (from /rosters).
 */
export interface RosterEntryRecord {
  id: string;
  employee_id: string;
  employee_name: string;
  department: string;
  designation: string;
  date: string;
  shift: string;
  shift_id?: string;
  start_time: string;
  end_time: string;
  working_hours: number | null;
  break_time: string;
  location: string;
  manager: string;
  status: "Approved" | "Pending" | "Rejected";
}

export interface RosterCreatePayload {
  employee_id: string;
  employee_name: string;
  department: string;
  designation: string;
  date: string;
  shift: string;
  shift_id?: string;
  start_time: string;
  end_time: string;
  working_hours?: number | null;
  break_time: string;
  location: string;
  manager: string;
  status: "Approved" | "Pending" | "Rejected";
  recurring?: boolean;
}

export interface HolidayRecord {
  id: string;
  name: string;
  description: string;
  date: string;
  type: "Public" | "Company" | "Regional" | "Optional";
  country: string;
  state: string;
  office: string;
  department: string;
  status: "Active" | "Archived";
  created_by: string;
  created_date: string;
  updated_date: string;
  notes?: string;
  color?: string;
  recurring: boolean;
  every_year: boolean;
  apply_to_all: boolean;
}

export interface HolidayCreatePayload {
  name: string;
  description?: string;
  date: string;
  type: "Public" | "Company" | "Regional" | "Optional";
  country?: string;
  state?: string;
  office?: string;
  department?: string;
  color?: string;
  recurring?: boolean;
  every_year?: boolean;
  apply_to_all?: boolean;
  notes?: string;
}

export type ShiftApiErrorCode =
  | "DUPLICATE_SHIFT_NAME"
  | "DUPLICATE_SHIFT_CODE"
  | "SHIFT_IS_DEFAULT"
  | "SHIFT_HAS_ASSIGNMENTS"
  | "INVALID_EMPLOYEES"
  | "ASSIGNMENT_CONFLICT"
  | "CHANGE_REQUEST_INVALID_STATE"
  | "INVALID_TIME_FORMAT";

export class ApiContractError extends Error {
  constructor(
    message: string,
    public readonly payload: unknown,
    public readonly missingFields: string[]
  ) {
    super(message);
    this.name = "ApiContractError";
  }
}

export interface ShiftListResponse {
  items: Shift[];
  total: number;
  page: number;
  limit: number;
}

export interface ShiftEmployeesResponse {
  items: Array<{
    id: string;
    employee_id: string;
    full_name: string;
    department: string;
    designation: string;
    effective_date: string;
  }>;
  total: number;
  page: number;
  limit: number;
}
export type AttendanceStatus = "Present" | "Absent" | "Late" | "Half Day" | "On Leave" | "Holiday" | "Weekend" | "Checked In" | "Checked Out" | "On Break";

export interface EmployeeSummary {
  id: string;
  employee_id: string;
  full_name: string;
  department?: string | null;
  designation?: string | null;
  branch?: string | null;
  email?: string;
}

export interface AttendanceShiftSummary {
  shift_name: string;
  shift_code?: string;
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
  working_days: string[];
}

export interface BreakSession {
  id: string;
  break_start: string;
  break_end?: string | null;
  duration_minutes?: number | null;
  status: "active" | "completed";
  notes?: string;
}

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  employee_name?: string;
  department?: string;
  date: string;
  check_in?: string | null;
  check_out?: string | null;
  status: AttendanceStatus | string;
  working_hours?: number | null;
  break_duration_hours?: number | null;
  total_break_minutes?: number | null;
  is_late?: boolean;
  late_minutes?: number;
  shift_name?: string;
  location?: string;
  notes?: string;
  verification_status?: string;
}

export interface AttendanceTodayResponse {
  checked_in: boolean;
  checked_out: boolean;
  check_in_time: string | null;
  check_out_time: string | null;
  working_hours: number | null;
  break_duration_hours: number | null;
  total_break_minutes: number | null;
  is_on_break: boolean;
  current_break: BreakSession | null;
  breaks: BreakSession[] | null;
  is_late: boolean;
  late_minutes: number;
  shift: AttendanceShiftSummary | null;
  is_face_enrolled: boolean;
  face_enrolled_at: string | null;
  verification_status: string | null;
  employee: EmployeeSummary | null;
  today_attendance: AttendanceRecord | null;
  timezone?: string;
  overtime_hours?: number | null;
}

export interface FaceStatusResponse {
  is_enrolled: boolean;
  enrolled_at: string | null;
  faceRegistered?: boolean;
}

export interface FaceEnrollmentRequest {
  image_base64: string;
  allow_re_enroll?: boolean;
}

export interface FaceEnrollmentResponse {
  success: boolean;
  message: string;
}

export interface FaceAttendanceStatus {
  faceRegistered: boolean;
  checkedIn: boolean;
  checkedOut: boolean;
  checkInTime: string | null;
  checkOutTime: string | null;
  workingHours: number | null;
  message: string;
  raw: Record<string, unknown>;
  enrolled_at: string | null;
  shift?: AttendanceShiftSummary | null;
  timezone?: string;
  errorCode?: string;
}

export interface CheckInRequest {
  image_base64: string;
  latitude?: number | null;
  longitude?: number | null;
  accuracy?: number | null;
  device_info?: string;
  notes?: string;
  ip_address?: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  work_mode?: string;
}

export interface CheckOutRequest {
  image_base64: string;
  latitude?: number | null;
  longitude?: number | null;
  accuracy?: number | null;
  device_info?: string;
  notes?: string;
  ip_address?: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
  work_mode?: string;
}

export interface BreakStartRequest {
  image_base64: string;
  latitude?: number | null;
  longitude?: number | null;
  accuracy?: number | null;
  device_info?: string;
  notes?: string;
  reason?: string;
  ip_address?: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
}

export interface BreakEndRequest {
  image_base64: string;
  latitude?: number | null;
  longitude?: number | null;
  accuracy?: number | null;
  device_info?: string;
  notes?: string;
  ip_address?: string;
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
}

export interface AttendancePunchResult {
  id: string;
  employeeId?: string;
  employeeName?: string;
  time: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: string;
  workingHours?: number | null;
  success: boolean;
  message: string;
  isInsideGeofence?: boolean;
  breakDurationMinutes?: number;
  activeSeconds?: number;
}

export interface BreakSessionResponse {
  id: string;
  break_start: string;
  break_end?: string | null;
  duration_minutes?: number;
  status: string;
  success: boolean;
  message: string;
  isInsideGeofence?: boolean;
}

export interface GeofenceVerifyRequest {
  latitude: number;
  longitude: number;
  accuracy?: number;
  office_id?: string;
}

export interface GeofenceVerifyResult {
  isInside: boolean;
  distanceMeters?: number;
  officeName?: string;
  allowedRadiusMeters?: number;
  policy?: "strict" | "flexible" | "warning_only";
  message?: string;
}

export interface AttendanceHistoryResponse {
  page: number;
  limit: number;
  total: number;
  items: AttendanceHistoryItem[];
}

export interface AttendanceHistoryItem {
  id: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  workingHours: number | null;
  breakDurationMinutes?: number | null;
  status: AttendanceStatus;
  employeeName?: string;
  shiftName?: string;
  isLate?: boolean;
  lateMinutes?: number;
  location?: string;
  verificationStatus?: string;
}

export interface AttendanceTimelineEvent {
  id: string;
  time: string;
  label: string;
  type: "checkin" | "checkout" | "break_start" | "break_end";
}

export interface TimelineEventItem {
  id: string;
  time: string;
  label: string;
  type: "checkin" | "checkout" | "break_start" | "break_end";
}

export interface AttendanceErrorResponse {
  code: string;
  message: string;
  detail?: string;
  status: number;
}

export interface TodayPunchStatus {
  checkedIn: boolean;
  checkedOut: boolean;
  onBreak: boolean;
  checkInTime: string | null;
  checkOutTime: string | null;
  workingHours: number | null;
  breakDurationMinutes: number | null;
  activeSeconds: number | null;
  message: string | null;
  attendanceId: string | null;
  raw: Record<string, unknown>;
}

export interface ShiftItem {
  id: string;
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  grace_period_minutes: number;
  break_duration_minutes: number;
  is_night_shift: boolean;
  night_premium_percent: number;
  working_days: string[];
  is_active: boolean;
  is_default: boolean;
  description: string | null;
  color: string | null;
  duration_minutes: number;
  work_hours: number;
  is_overnight: boolean;
  assigned_employees_count: number;
  created_at: string;
  updated_at: string;
}

export interface ShiftOption {
  id: string;
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  is_overnight: boolean;
}

export interface ShiftCreatePayload {
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  grace_period_minutes: number;
  break_duration_minutes: number;
  night_shift: boolean;
  night_premium_percent: number;
  working_days: string[];
  description?: string;
  is_active: boolean;
}

export interface ShiftUpdatePayload {
  name?: string;
  code?: string;
  start_time?: string;
  end_time?: string;
  grace_period_minutes?: number;
  break_duration_minutes?: number;
  night_shift?: boolean;
  night_premium_percent?: number;
  working_days?: string[];
  description?: string;
  is_active?: boolean;
}

export interface ShiftOption {
  id: string;
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  is_overnight: boolean;
}

export interface ShiftAssignPayload {
  employee_ids: string[];
  effective_date: string;
  notes?: string;
}

export interface ShiftAssignResult {
  assigned_count: number;
  skipped: Array<{
    employee_id: string;
    reason: string;
  }>;
}

export interface ShiftEmployeesResponse {
  items: Array<{
    id: string;
    employee_id: string;
    employee_name: string;
    department: string;
    designation: string;
    shift: string;
    effective_from: string;
    effective_to: string | null;
    source: string;
  }>;
  total: number;
}

export interface ShiftChangeRequest {
  id: string;
  employee_id: string;
  employee_name: string;
  current_shift_id: string | null;
  current_shift_name: string | null;
  requested_shift_id: string;
  requested_shift_name: string;
  effective_date: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  review_note?: string;
  created_at: string;
}

export interface ShiftChangeRequestPayload {
  requested_shift_id: string;
  effective_date: string;
  reason: string;
}

export interface ListChangeRequestsParams {
  status?: "pending" | "approved" | "rejected" | "cancelled";
  page?: number;
  limit?: number;
}

export interface ShiftListResponse {
  items: ShiftItem[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface MyScheduleData {
  has_assigned_shift: boolean;
  current_shift: ShiftItem | null;
  today: {
    date: string;
    day: string;
    shift_name: string;
    start_time: string;
    end_time: string;
    is_off: boolean;
    is_holiday: boolean;
    holiday_name?: string;
    source: string;
    checked_in?: boolean;
    check_in_time?: string | null;
    check_out_time?: string | null;
  };
  upcoming: Array<{
    date: string;
    day: string;
    shift_name: string;
    start_time: string;
    end_time: string;
    working_hours: number | null;
    is_overnight: boolean;
    is_off: boolean;
    is_holiday: boolean;
    holiday_name?: string;
    source: string;
  }>;
  history: Array<{
    attendance_id: string;
    date: string;
    day: string;
    shift_name: string;
    check_in_time?: string | null;
    check_out_time?: string | null;
    working_hours?: number;
    overtime_hours?: number;
    status: string;
    is_late?: boolean;
    late_minutes?: number;
    is_early_checkout?: boolean;
    early_minutes?: number;
    auto_closed?: boolean;
    overtime_hours?: number;
    status: string;
  }>;
  timezone: string;
  employee: {
    id: string;
    name: string;
    email: string;
    branch?: string;
  };
}

export interface MyScheduleQueryParams {
  start_date?: string;
  end_date?: string;
}

export interface ShiftEmployeesQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface DeleteShiftResponse {
  success: boolean;
  reassigned?: boolean;
}

export interface ShiftAssignResult {
  assigned_count: number;
  skipped: Array<{
    employee_id: string;
    reason: string;
  }>;
  effective_date: string;
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
  createdBy: string;
  createdDate: string;
  updatedDate: string;
  notes: string;
  color: string;
  recurring: boolean;
  everyYear: boolean;
  applyToAll: boolean;
}

export interface HolidayCreatePayload {
  name: string;
  description: string;
  date: string;
  type: "Public" | "Company" | "Regional" | "Optional";
  country: string;
  state: string;
  office: string;
  department: string;
  color: string;
  recurring: boolean;
  everyYear: boolean;
  applyToAll: boolean;
  notes: string;
}

export interface HolidayUpdatePayload {
  name?: string;
  description?: string;
  date?: string;
  type?: "Public" | "Company" | "Regional" | "Optional";
  country?: string;
  state?: string;
  office?: string;
  department?: string;
  color?: string;
  recurring?: boolean;
  everyYear?: boolean;
  applyToAll?: boolean;
  notes?: string;
}

export interface ShiftOption {
  id: string;
  name: string;
  code: string;
  start_time: string;
  end_time: string;
  is_overnight: boolean;
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
  dateRange: {
    start: string;
    end: string;
  };
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
  date?: string;
  present: number;
  late: number;
  absent: number;
  onLeave: number;
  total: number;
}

export interface WeeklyAttendanceResponse {
  weekly: WeeklyAttendanceDataPoint[];
  dateRange: {
    start: string;
    end: string;
  };
  viewMode: string;
}

export interface AttendanceRateKPIResponse {
  currentRate: number;
  previousRate: number | null;
  changePercentagePoints: number | null;
  trend: "up" | "down" | "stable";
  period: {
    start: string;
    end: string;
  };
  previousPeriod: {
    start: string;
    end: string;
  } | null;
}

export interface AttendanceAnalyticsFilters {
  startDate?: string;
  endDate?: string;
  departmentId?: string;
  shiftId?: string;
  locationId?: string;
  viewMode?: string;
}

export interface CreateChangeRequestPayload {
  requestedShift: string;
  effectiveDate: string;
  reason: string;
}

export interface ApproveChangeRequestPayload {
  reviewNote?: string;
}

export interface RejectChangeRequestPayload {
  reviewNote: string;
}

export interface EmployeeShiftInfo {
  shiftName: string;
  shiftType: string;
  startTime: string;
  endTime: string;
  breakDuration: string;
  breakWindow: string;
  totalWorkingHours: number;
  gracePeriodMinutes: number;
  nightPremiumPercent: number;
  workingDays: string[];
  description: string;
}
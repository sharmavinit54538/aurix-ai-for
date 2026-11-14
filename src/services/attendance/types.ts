export type AttendanceStatus = "Present" | "Absent" | "Late" | "Half Day" | "On Leave" | "Holiday" | "Weekend";

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  employee_name?: string;
  department?: string;
  date: string;
  check_in?: string | null;
  check_out?: string | null;
  status: AttendanceStatus | string;
  work_hours?: number;
  overtime_hours?: number;
  shift_name?: string;
  location?: string;
  notes?: string;
}

export interface ShiftItem {
  id: string;
  name: string;
  code?: string;
  start_time: string;
  end_time: string;
  grace_period_mins?: number;
  is_night_shift?: boolean;
  is_active?: boolean;
  employee_count?: number;
  working_days?: string[];
}

export interface ShiftChangeRequest {
  id: string;
  employee_id: string;
  employee_name?: string;
  current_shift_id?: string;
  current_shift_name?: string;
  requested_shift_id: string;
  requested_shift_name?: string;
  effective_date?: string;
  reason?: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  created_at?: string;
}

export interface HolidayItem {
  id: string;
  name: string;
  date: string;
  type: "Public" | "Optional" | "Company" | "Regional" | string;
  description: string;
  is_optional?: boolean;
  applicable_locations?: string[];
  country?: string;
  state?: string;
  office?: string;
  department?: string;
  color?: string;
  recurring?: boolean;
  everyYear?: boolean;
  applyToAll?: boolean;
  status?: "Active" | "Archived" | string;
  createdBy?: string;
  createdDate?: string;
  notes?: string;
}

export type HolidayRecord = HolidayItem;

export interface HolidayCreatePayload {
  name: string;
  date: string;
  type?: string;
  description?: string;
  is_optional?: boolean;
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

export type ShiftTypeLabel =
  | "Morning"
  | "Evening"
  | "Night"
  | "Off Day"
  | "Leave"
  | "Holiday"
  | "Training"
  | "WFH"
  | "Overtime";

export interface RosterItem {
  id: string;
  employee_id?: string;
  employeeId: string;
  employee_name?: string;
  employeeName: string;
  department: string;
  designation?: string;
  shift_id?: string;
  shift_name?: string;
  shift: ShiftTypeLabel;
  date: string;
  day?: string;
  shiftName?: string;
  startTime: string;
  endTime: string;
  workingHours: number;
  breakTime: string;
  location: string;
  manager: string;
  status: "Approved" | "Pending" | "Rejected" | "Working" | "Weekly Off" | "Holiday" | "Leave" | string;
}

export type RosterEntryRecord = RosterItem;
export type RosterDayItem = RosterItem;

export interface RosterCreatePayload {
  employee_id?: string;
  employeeId?: string;
  employeeName?: string;
  department?: string;
  designation?: string;
  shift_id?: string;
  shift?: ShiftTypeLabel;
  date?: string;
  start_date?: string;
  end_date?: string;
  startTime?: string;
  endTime?: string;
  workingHours?: number;
  breakTime?: string;
  location?: string;
  manager?: string;
  status?: "Approved" | "Pending" | "Rejected" | string;
}

export interface ScheduleChangeRequestPayload {
  requested_shift_id: string;
  effective_date: string;
  reason?: string;
}

export interface AttendanceSummary {
  total_employees: number;
  present_today: number;
  absent_today: number;
  late_today: number;
  on_leave_today: number;
  attendance_rate: number;
}

export interface AttendanceHistoryItem {
  id: string;
  date: string;
  status: string;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  workingHours?: number;
  location?: string;
  notes?: string;
}

export interface AttendancePunchResult {
  id?: string;
  success: boolean;
  message?: string;
  timestamp?: string;
  time?: string;
  status?: string;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  workingHours?: number;
  employeeName?: string;
  employeeId?: string;
  isInsideGeofence?: boolean;
  record?: AttendanceRecord;
}

export interface TimelineEventItem {
  id: string;
  type: "checkin" | "checkout" | "break_start" | "break_end" | string;
  timestamp: string;
  time: string;
  label: string;
  description?: string;
}

export interface FaceShiftSummary {
  shift_name: string;
  start_time: string;
  end_time: string;
  grace_period_mins?: number;
  break_duration_mins?: number;
  night_premium_percent: number;
  is_overnight?: boolean;
  is_off?: boolean;
  is_holiday?: boolean;
  holiday_name?: string;
  source: string;
  checked_in?: boolean;
  check_in_time?: string | null;
  check_out_time?: string | null;
}

export interface FaceAttendanceStatus {
  enrolled: boolean;
  verified: boolean;
  faceRegistered?: boolean;
  enrolled_at?: string | null;
  checkedIn?: boolean;
  checkedOut?: boolean;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  workingHours?: number;
  shiftName?: string;
  shiftStartTime?: string;
  shiftEndTime?: string;
  shift?: FaceShiftSummary;
  confidence?: number;
  last_verified_at?: string | null;
}

export interface TodayAttendanceEmployee {
  id: string;
  employee_id: string;
  employeeId?: string;
  employee_name: string;
  fullName?: string;
  department: string;
  status: string;
  check_in?: string | null;
  checkInTime?: string | null;
  check_out?: string | null;
  checkOutTime?: string | null;
  workingHours?: number | null;
}

export interface AttendanceTrendDataPoint {
  date: string;
  present: number;
  absent: number;
  late: number;
  rate?: number;
}

export interface AttendanceTrendsResponse {
  data: AttendanceTrendDataPoint[];
}

export interface AttendanceDistributionResponse {
  present: number;
  absent: number;
  late: number;
  on_leave: number;
}

export interface WeeklyAttendanceDataPoint {
  day: string;
  present: number;
  absent: number;
  late: number;
}

export interface WeeklyAttendanceResponse {
  data: WeeklyAttendanceDataPoint[];
}

export interface AttendanceRateKPIResponse {
  rate: number;
  change: number;
  present_count: number;
  total_count: number;
}

export interface AttendanceAnalyticsFilters {
  department?: string;
  start_date?: string;
  end_date?: string;
  period?: string;
}

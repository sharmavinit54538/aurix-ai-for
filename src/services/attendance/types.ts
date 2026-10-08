// ─────────────────────────────────────────────────────────────
// Type Definitions for Attendance Service
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
  file?: Blob | File; // Captured photo if face verification used
  image_base64?: string; // High-quality Base64 captured snapshot for AI face verification
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
  image_base64?: string; // High-quality Base64 captured snapshot for AI face verification checkout
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
 * augmented with inferred enrollment state.
 */
export interface FaceAttendanceStatus {
  /** Whether the employee's face is enrolled / recognized by the backend. */
  faceRegistered: boolean;
  /** Whether the employee is currently checked in today. */
  checkedIn: boolean;
  /** Whether the employee has already checked out today. */
  checkedOut: boolean;
  /** ISO timestamp of today's check-in (from backend). */
  checkInTime: string | null;
  /** ISO timestamp of today's check-out (from backend). */
  checkOutTime: string | null;
  /** Backend-calculated working hours. */
  workingHours: number | null;
  /** Backend message string. */
  message: string;
  /** Raw backend response data for any extra fields. */
  raw: Record<string, unknown>;
  /** Error code from the backend, if any (e.g. FACE_NOT_ENROLLED). */
  errorCode?: string;
}

export interface Shift {
  id: string;
  name: string;
  code: string;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "18:00"
  workHours: number | null; // e.g. 9 or null if not provided
  gracePeriodMinutes: number; // e.g. 15
  breakDurationMinutes: number; // e.g. 60
  nightShift: boolean;
  nightPremiumPercent: number; // e.g. 15
  workingDays: string[]; // ["Mon", "Tue", "Wed", "Thu", "Fri"]
  assignedEmployeesCount?: number;
  isActive: boolean;
  color?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShiftCreatePayload {
  name: string;
  code: string;
  startTime: string;
  endTime: string;
  gracePeriodMinutes: number;
  breakDurationMinutes: number;
  nightShift: boolean;
  nightPremiumPercent: number;
  workingDays: string[];
  color?: string;
  description?: string;
  isActive?: boolean;
}

export interface ShiftAssignPayload {
  employeeIds: string[];
  effectiveDate: string;
  notes?: string;
}

export interface RosterEntryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  date: string; // YYYY-MM-DD
  shift: "Morning" | "Evening" | "Night" | "Off Day" | "Leave" | "Holiday" | "Training" | "WFH" | "Overtime";
  startTime: string;
  endTime: string;
  workingHours: number | null;
  breakTime: string;
  location: string;
  manager: string;
  status: "Approved" | "Pending" | "Rejected";
}

export interface RosterCreatePayload {
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  date: string;
  shift: string;
  startTime: string;
  endTime: string;
  workingHours?: number | null;
  breakTime: string;
  location: string;
  manager: string;
  status: "Approved" | "Pending" | "Rejected";
  recurring?: boolean;
}

export interface HolidayRecord {
  id: string;
  name: string;
  description: string;
  date: string; // YYYY-MM-DD
  type: "Public" | "Company" | "Regional" | "Optional";
  country: string;
  state: string;
  office: string;
  department: string;
  status: "Active" | "Archived";
  createdBy: string;
  createdDate: string;
  updatedDate: string;
  notes?: string;
  color?: string;
  recurring: boolean;
  everyYear: boolean;
  applyToAll: boolean;
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
  everyYear?: boolean;
  applyToAll?: boolean;
  notes?: string;
}

export interface EmployeeShiftInfo {
  shiftName: string;
  shiftType: "Regular" | "Night" | "Flexible";
  startTime: string; // e.g. "09:00 AM"
  endTime: string;   // e.g. "06:00 PM"
  breakDuration: string; // e.g. "1 Hour"
  breakWindow: string; // e.g. "01:00 PM – 02:00 PM"
  totalWorkingHours: number; // e.g. 8
  gracePeriodMinutes: number;
  nightPremiumPercent: number;
  workingDays: string[];
  description?: string;
}

export interface UpcomingShiftItem {
  id: string;
  date: string; // YYYY-MM-DD
  day: string;  // e.g. "Friday"
  shiftName: string;
  startTime: string;
  endTime: string;
  breakDuration: string;
  workingHours: number;
  shiftType: "Regular" | "Night" | "Flexible";
  status: "Scheduled" | "Working" | "Off Day" | "Holiday";
}

export interface ShiftHistoryItem {
  id: string;
  date: string;
  day: string;
  shiftName: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  workingHours: number | null;
  status: "Completed" | "Present" | "Late" | "Half Day" | "Absent";
}

export interface EmployeeShiftScheduleData {
  hasAssignedShift: boolean;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  branch: string;
  currentShift: EmployeeShiftInfo | null;
  todayShift: {
    date: string;
    day: string;
    shift: EmployeeShiftInfo;
    checkedIn: boolean;
    checkedOut: boolean;
    checkInTime: string | null;
    checkOutTime: string | null;
    activeSeconds?: number;
    workingHours: number | null;
    isOffDay: boolean;
  } | null;
  upcomingShifts: UpcomingShiftItem[];
  shiftHistory: ShiftHistoryItem[];
}

export interface RosterDayItem {
  id: string;
  date: string; // YYYY-MM-DD
  day: string;  // e.g. "Friday"
  shiftName: string; // e.g. "Morning Shift" or "—"
  startTime: string; // e.g. "09:00 AM"
  endTime: string;   // e.g. "06:00 PM"
  workingHours: number | null;
  status: "Working" | "Weekly Off" | "Holiday" | "Leave" | "Rest Day";
  notes?: string;
}

export interface ScheduleChangeRequestPayload {
  type: "shift" | "roster";
  requestedShift: string;
  effectiveDate: string;
  reason: string;
}

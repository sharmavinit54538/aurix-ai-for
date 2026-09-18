import { api } from "@/api";
import apiInstance from "@/api/apiInstance";
import { aurix } from "@/lib/aurix-store";

// ─────────────────────────────────────────────────────────────
// Type Definitions
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
  deviceInfo?: string;
  ipAddress?: string;
  notes?: string;
  file?: Blob | File;
}

export interface BreakPayload {
  reason?: string;
  notes?: string;
}

export interface AttendancePunchResult {
  id: string;
  time: string;
  status: string;
  success: boolean;
  message?: string;
  isInsideGeofence?: boolean;
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
  workHours: number; // e.g. 9
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
  workingHours: number;
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
  workingHours: number;
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
  workingHours: number;
  status: "Working" | "Weekly Off" | "Holiday" | "Leave" | "Rest Day";
  notes?: string;
}

export interface ScheduleChangeRequestPayload {
  type: "shift" | "roster";
  requestedShift: string;
  effectiveDate: string;
  reason: string;
}

// ─────────────────────────────────────────────────────────────
// Helper Extractors
// ─────────────────────────────────────────────────────────────

function extractListPayload(res: unknown): unknown[] {
  if (Array.isArray(res)) return res;
  if (!res || typeof res !== "object") return [];

  const root = res as Record<string, unknown>;
  const nested = root.data;

  if (Array.isArray(nested)) return nested;
  if (nested && typeof nested === "object") {
    const dataObj = nested as Record<string, unknown>;
    for (const key of ["items", "records", "rows", "employees", "shifts", "rosters", "holidays", "results", "data"]) {
      if (Array.isArray(dataObj[key])) return dataObj[key] as unknown[];
    }
  }

  for (const key of ["items", "records", "rows", "employees", "shifts", "rosters", "holidays", "results"]) {
    if (Array.isArray(root[key])) return root[key] as unknown[];
  }

  return [];
}

function extractObjectPayload<T = Record<string, unknown>>(res: unknown): T {
  if (!res || typeof res !== "object") return {} as T;
  const root = res as Record<string, unknown>;
  if (root.data && typeof root.data === "object" && !Array.isArray(root.data)) {
    return root.data as T;
  }
  return root as unknown as T;
}

/**
 * Extracts user-friendly error message from face attendance API errors.
 */
function extractFaceApiError(err: any): string {
  const resp = err?.response?.data || err?.data;
  if (resp) {
    if (typeof resp === "string") return resp;
    if (resp.detail) {
      if (typeof resp.detail === "string") return resp.detail;
      if (typeof resp.detail === "object") {
        if (typeof resp.detail.message === "string") return resp.detail.message;
        if (typeof resp.detail.msg === "string") return resp.detail.msg;
      }
      if (Array.isArray(resp.detail)) {
        return resp.detail.map((d: any) => d.msg || d.message || JSON.stringify(d)).join("; ");
      }
    }
    if (resp.message && typeof resp.message === "string") return resp.message;
  }
  if (err?.message && typeof err.message === "string") return err.message;
  return "An unexpected error occurred.";
}

/**
 * Extracts a machine-readable error code from backend response if available.
 * Common codes: FACE_NOT_ENROLLED, FACE_MISMATCH, ALREADY_CHECKED_IN, etc.
 */
function extractErrorCode(err: any): string | undefined {
  const resp = err?.response?.data || err?.data;
  if (resp && typeof resp === "object") {
    if (resp.detail && typeof resp.detail === "object" && resp.detail.code) {
      return resp.detail.code;
    }
    return resp.error_code || resp.code || resp.errorCode || undefined;
  }
  return undefined;
}

// ─────────────────────────────────────────────────────────────
// Centralized Attendance API Service
// ─────────────────────────────────────────────────────────────

export const attendanceApi = {
  // ───────────────────────────────────────────────────────────
  // 1. Attendance Hub & Today's Attendance
  // ───────────────────────────────────────────────────────────

  /**
   * Fetch today's company-wide attendance logs.
   * Calls GET /api/v1/attendance/today.
   * If missing, tries GET /api/v1/attendance/face/company as backend fallback.
   *
   * TODO (Backend): Ensure GET /api/v1/attendance/today returns:
   * { success: true, data: [ { id, employeeId, fullName, department, status, checkInTime, checkOutTime, workingHours } ] }
   */
  getTodayAttendance: async (dateStr?: string): Promise<TodayAttendanceEmployee[]> => {
    const query = dateStr ? `?date=${encodeURIComponent(dateStr)}` : "";
    try {
      const res = await api.get(`attendance/today${query}`);
      const list = extractListPayload(res);
      return list.map((item: any) => ({
        id: item.id || item.employee_id || item._id,
        employeeId: item.employee_id || item.employeeId || item.id,
        fullName: item.full_name || item.employee_name || item.fullName || "Unknown",
        department: item.department || "General",
        designation: item.designation || "",
        avatarUrl: item.avatar_url || item.avatarUrl,
        status: (item.status?.toLowerCase() || (item.check_in_time ? "present" : "absent")) as any,
        checkInTime: item.check_in_time || item.checkInTime || null,
        checkOutTime: item.check_out_time || item.checkOutTime || null,
        workingHours: item.working_hours ?? item.workingHours ?? null,
        location: item.location || item.branch || "Office",
      }));
    } catch (err: any) {
      // If /attendance/today returns 404, fallback to live face company logs
      if (err?.status === 404) {
        try {
          const fallbackRes = await api.get("attendance/face/company?limit=100");
          const list = extractListPayload(fallbackRes);
          return list.map((item: any) => {
            let status: TodayAttendanceEmployee["status"] = "present";
            if (item.check_in_time) {
              const [hour] = new Date(item.check_in_time).toLocaleTimeString("en-GB").split(":");
              if (Number(hour) >= 10) status = "late";
            } else {
              status = "absent";
            }
            return {
              id: item.id || item.employee_id,
              employeeId: item.employee_id || item.id,
              fullName: item.employee_name || "Employee",
              department: item.department || "General",
              designation: item.designation || "",
              avatarUrl: item.face_image_url,
              status,
              checkInTime: item.check_in_time,
              checkOutTime: item.check_out_time,
              workingHours: item.working_hours,
              location: "Office",
            };
          });
        } catch {
          throw err;
        }
      }
      throw err;
    }
  },

  /**
   * Fetch attendance dashboard analytics summary.
   * Calls GET /api/v1/attendance/face/analytics (or /attendance/analytics).
   */
  getAttendanceAnalytics: async (): Promise<AttendanceAnalyticsSummary> => {
    try {
      const res: any = await api.get("attendance/face/analytics");
      const data = extractObjectPayload<any>(res);
      return {
        totalEmployees: data.total_employees ?? data.totalEmployees ?? 0,
        present: data.present_today ?? data.present ?? 0,
        late: data.late_today ?? data.late ?? 0,
        absent: data.absent_today ?? data.absent ?? 0,
        onLeave: data.on_leave_today ?? data.onLeave ?? 0,
        onTimeRate: data.on_time_rate ?? data.onTimeRate,
        averageWorkingHours: data.average_working_hours ?? data.averageWorkingHours,
      };
    } catch {
      // Try alternate analytics endpoint
      const res: any = await api.get("attendance/analytics");
      const data = extractObjectPayload<any>(res);
      return {
        totalEmployees: data.total_employees ?? data.totalEmployees ?? 0,
        present: data.present_today ?? data.present ?? 0,
        late: data.late_today ?? data.late ?? 0,
        absent: data.absent_today ?? data.absent ?? 0,
        onLeave: data.on_leave_today ?? data.onLeave ?? 0,
        onTimeRate: data.on_time_rate ?? data.onTimeRate,
        averageWorkingHours: data.average_working_hours ?? data.averageWorkingHours,
      };
    }
  },

  // ───────────────────────────────────────────────────────────
  // 2. Check In / Check Out / Break / Geofence
  // ───────────────────────────────────────────────────────────

  /**
   * Get current authenticated employee's punch status for today.
   * Calls GET /api/v1/attendance/face/me (or /api/v1/attendance/today/me).
   */
  getMyTodayStatus: async (): Promise<TodayPunchStatus> => {
    try {
      const res: any = await api.get("attendance/face/me");
      const data = extractObjectPayload<any>(res);
      const checkedIn = Boolean(data.checked_in ?? data.checkedIn);
      const checkedOut = Boolean(data.checked_out ?? data.checkedOut);
      const onBreak = Boolean(data.on_break ?? data.onBreak);

      return {
        checkedIn,
        checkedOut,
        onBreak,
        checkInTime: data.check_in_time || data.checkInTime || null,
        checkOutTime: data.check_out_time || data.checkOutTime || null,
        workingHours: data.working_hours ?? data.workingHours ?? null,
        breakDurationMinutes: data.break_duration_minutes ?? data.breakDurationMinutes,
        message: data.message,
        attendanceId: data.attendance_id || data.id,
      };
    } catch (err: any) {
      if (err?.status === 404) {
        // Try alternate endpoint if face/me is unavailable
        const res: any = await api.get("attendance/today/me");
        const data = extractObjectPayload<any>(res);
        return {
          checkedIn: Boolean(data.checked_in ?? data.checkedIn),
          checkedOut: Boolean(data.checked_out ?? data.checkedOut),
          onBreak: Boolean(data.on_break ?? data.onBreak),
          checkInTime: data.check_in_time || data.checkInTime || null,
          checkOutTime: data.check_out_time || data.checkOutTime || null,
          workingHours: data.working_hours ?? data.workingHours ?? null,
          message: data.message,
        };
      }
      throw err;
    }
  },

  /**
   * Get the authenticated employee's face attendance status.
   * Calls GET /api/v1/attendance/face/me.
   * Infers face enrollment from the API response:
   * - A successful response means the employee is recognized (face registered).
   * - A specific error (e.g. FACE_NOT_ENROLLED) means no face enrolled.
   * - A 404 with no face enrollment indication means the endpoint isn't available.
   */
  getFaceAttendanceStatus: async (): Promise<FaceAttendanceStatus> => {
    try {
      const res: any = await api.get("attendance/face/me");
      const data = extractObjectPayload<any>(res);

      // Inspect live backend response for explicit enrollment status fields
      let faceRegistered = true;
      if (typeof data.face_registered === "boolean") faceRegistered = data.face_registered;
      else if (typeof data.faceRegistered === "boolean") faceRegistered = data.faceRegistered;
      else if (typeof data.is_registered === "boolean") faceRegistered = data.is_registered;
      else if (typeof data.isRegistered === "boolean") faceRegistered = data.isRegistered;
      else if (typeof data.is_face_registered === "boolean") faceRegistered = data.is_face_registered;
      else if (typeof data.isFaceRegistered === "boolean") faceRegistered = data.isFaceRegistered;
      else if (typeof data.is_enrolled === "boolean") faceRegistered = data.is_enrolled;
      else if (typeof data.isEnrolled === "boolean") faceRegistered = data.isEnrolled;
      else if (typeof data.face_enrolled === "boolean") faceRegistered = data.face_enrolled;
      else if (typeof data.faceEnrolled === "boolean") faceRegistered = data.faceEnrolled;
      else if (typeof data.enrolled === "boolean") faceRegistered = data.enrolled;
      else if (typeof data.has_face === "boolean") faceRegistered = data.has_face;
      else if (typeof data.hasFace === "boolean") faceRegistered = data.hasFace;
      else if (data.enrollment_status === "not_enrolled" || data.enrollmentStatus === "not_enrolled") faceRegistered = false;

      return {
        faceRegistered,
        checkedIn: Boolean(data.checked_in ?? data.checkedIn),
        checkedOut: Boolean(data.checked_out ?? data.checkedOut),
        checkInTime: data.check_in_time || data.checkInTime || null,
        checkOutTime: data.check_out_time || data.checkOutTime || null,
        workingHours: data.working_hours ?? data.workingHours ?? null,
        message: data.message || "",
        raw: data,
      };
    } catch (err: any) {
      const errorCode = extractErrorCode(err);
      const errorMsg = extractFaceApiError(err);
      const status = err?.response?.status || err?.status;

      // Detect face-not-enrolled from backend error code or message
      const isNotEnrolled =
        errorCode === "FACE_NOT_ENROLLED" ||
        errorCode === "face_not_enrolled" ||
        errorCode === "NOT_ENROLLED" ||
        errorCode === "USER_NOT_ENROLLED" ||
        errorMsg.toLowerCase().includes("face not enrolled") ||
        errorMsg.toLowerCase().includes("face not registered") ||
        errorMsg.toLowerCase().includes("no face registered") ||
        errorMsg.toLowerCase().includes("face is not registered") ||
        errorMsg.toLowerCase().includes("face registration required") ||
        errorMsg.toLowerCase().includes("not enrolled");

      if (isNotEnrolled) {
        return {
          faceRegistered: false,
          checkedIn: false,
          checkedOut: false,
          checkInTime: null,
          checkOutTime: null,
          workingHours: null,
          message: errorMsg,
          raw: {},
          errorCode: errorCode || "FACE_NOT_ENROLLED",
        };
      }

      // If the API responds with 404, it might mean either:
      // 1. Employee has no attendance record for today (face IS registered)
      // 2. Employee has no face registered at all
      if (status === 404) {
        const isFaceMissing =
          errorMsg.toLowerCase().includes("face") ||
          errorMsg.toLowerCase().includes("profile") ||
          errorMsg.toLowerCase().includes("biometric");

        return {
          faceRegistered: !isFaceMissing,
          checkedIn: false,
          checkedOut: false,
          checkInTime: null,
          checkOutTime: null,
          workingHours: null,
          message: errorMsg || "No attendance record for today.",
          raw: {},
        };
      }

      // Re-throw for auth errors (401/403) and other unrecoverable issues
      throw err;
    }
  },

  /**
   * Get employee face enrollment status.
   * Calls GET /attendance/face-status (normalized to /api/v1/attendance/face-status).
   */
  getFaceStatus: async (): Promise<FaceStatusResponse> => {
    try {
      const res: any = await api.get("attendance/face-status");
      const data = extractObjectPayload<any>(res);
      const isEnrolled = Boolean(
        data.is_enrolled ??
        data.isEnrolled ??
        data.is_face_enrolled ??
        data.face_registered ??
        data.faceRegistered ??
        (res && typeof res === "object" && (res.is_enrolled ?? res.isEnrolled)) ??
        false
      );
      return {
        is_enrolled: isEnrolled,
        enrolled_at: data.enrolled_at || data.enrolledAt || null,
        faceRegistered: isEnrolled,
      };
    } catch (err: any) {
      const errorCode = extractErrorCode(err);
      if (errorCode === "FACE_NOT_ENROLLED") {
        return { is_enrolled: false, enrolled_at: null, faceRegistered: false };
      }
      // Graceful fallback to /attendance/face/me
      try {
        const fallbackRes: any = await api.get("attendance/face/me");
        const fbData = extractObjectPayload<any>(fallbackRes);
        const isEnrolled = Boolean(
          fbData.face_registered ?? fbData.is_registered ?? fbData.is_enrolled ?? false
        );
        return {
          is_enrolled: isEnrolled,
          enrolled_at: fbData.face_enrolled_at || null,
          faceRegistered: isEnrolled,
        };
      } catch {
        return { is_enrolled: false, enrolled_at: null, faceRegistered: false };
      }
    }
  },

  /**
   * Enroll / register the authenticated employee's face via Base64 snapshot.
   * Calls POST /attendance/face-enroll (normalized to /api/v1/attendance/face-enroll).
   */
  enrollFace: async (imageBase64: string): Promise<FaceEnrollResponse> => {
    try {
      const res: any = await api.post("attendance/face-enroll", {
        image_base64: imageBase64,
      });
      const data = extractObjectPayload<any>(res);
      return {
        success: res.success ?? true,
        message: res.message || data.message || "Face successfully registered!",
      };
    } catch (err: any) {
      const errorCode = extractErrorCode(err);
      const errorMsg = extractFaceApiError(err);
      const enrichedError: any = new Error(errorMsg);
      enrichedError.errorCode = errorCode;
      enrichedError.response = err?.response;
      throw enrichedError;
    }
  },

  /**
   * Perform attendance check-in.
   * If image_base64 is provided, sends JSON payload to POST /attendance/checkin.
   * Otherwise falls back to multipart POST /attendance/face/check-in.
   */
  checkIn: async (payload: CheckInPayload): Promise<AttendancePunchResult> => {
    if (!payload.image_base64 && !payload.file) {
      throw new Error("A face photo is required for check-in. Please look directly into the camera.");
    }

    // 1. Primary path: Base64 face verification check-in
    if (payload.image_base64) {
      try {
        const body: Record<string, any> = {
          image_base64: payload.image_base64,
          device_info: payload.deviceInfo || (typeof navigator !== "undefined" ? navigator.userAgent : "Web"),
        };
        if (payload.latitude != null || payload.longitude != null) {
          body.location = {
            latitude: payload.latitude,
            longitude: payload.longitude,
          };
          body.latitude = payload.latitude;
          body.longitude = payload.longitude;
        }
        if (payload.notes) {
          body.notes = payload.notes;
        }
        if (payload.ipAddress) {
          body.ip_address = payload.ipAddress;
        }

        const res: any = await api.post("attendance/checkin", body);
        const data = extractObjectPayload<any>(res);
        return {
          id: data.id || data.attendance_id || "",
          time: data.check_in_time || data.time || new Date().toISOString(),
          status: "checked-in",
          success: true,
          message: res.message || data.message || "Attendance Verified & Marked Successfully!",
          isInsideGeofence: data.is_inside_geofence,
        };
      } catch (err: any) {
        const errorCode = extractErrorCode(err);
        const errorMsg = extractFaceApiError(err);
        const httpStatus = err?.response?.status || err?.status;

        const enrichedError: any = new Error(errorMsg);
        enrichedError.status = httpStatus;
        enrichedError.errorCode = errorCode;
        enrichedError.response = err?.response;
        throw enrichedError;
      }
    }

    // 2. Fallback path: Multipart upload
    const formData = new FormData();
    formData.append("file", payload.file!, "checkin-proof.jpg");
    if (payload.latitude != null) formData.append("latitude", payload.latitude.toString());
    if (payload.longitude != null) formData.append("longitude", payload.longitude.toString());
    formData.append("device_info", payload.deviceInfo || (typeof navigator !== "undefined" ? navigator.userAgent : "Web"));
    if (payload.ipAddress) formData.append("ip_address", payload.ipAddress);

    try {
      const res: any = await apiInstance.post("/attendance/face/check-in", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = extractObjectPayload<any>(res.data);
      return {
        id: data.id || data.attendance_id || "",
        time: data.check_in_time || data.time || "",
        status: "checked-in",
        success: true,
        message: res.data?.message || "Checked in successfully",
        isInsideGeofence: data.is_inside_geofence,
      };
    } catch (err: any) {
      const errorCode = extractErrorCode(err);
      const errorMsg = extractFaceApiError(err);
      const httpStatus = err?.response?.status || err?.status;

      const enrichedError: any = new Error(errorMsg);
      enrichedError.status = httpStatus;
      enrichedError.errorCode = errorCode;
      enrichedError.response = err?.response;
      throw enrichedError;
    }
  },

  /**
   * Perform attendance check-out.
   * Sends coordinates, device info, and photo proof to backend /api/v1/attendance/face/check-out.
   */
  checkOut: async (payload: CheckOutPayload): Promise<AttendancePunchResult> => {
    if (!payload.file) {
      throw new Error("A face photo is required for check-out. Please enable your camera and capture your face.");
    }
    const formData = new FormData();
    formData.append("file", payload.file, "checkout-proof.jpg");
    if (payload.latitude != null) formData.append("latitude", payload.latitude.toString());
    if (payload.longitude != null) formData.append("longitude", payload.longitude.toString());
    formData.append("device_info", payload.deviceInfo || (typeof navigator !== "undefined" ? navigator.userAgent : "Web"));
    if (payload.ipAddress) formData.append("ip_address", payload.ipAddress);

    try {
      const res: any = await apiInstance.post("/attendance/face/check-out", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = extractObjectPayload<any>(res.data);
      return {
        id: data.id || data.attendance_id || "",
        time: data.check_out_time || data.time || "",
        status: "checked-out",
        success: true,
        message: res.data?.message || "Checked out successfully",
      };
    } catch (err: any) {
      const errorCode = extractErrorCode(err);
      const errorMsg = extractFaceApiError(err);
      const httpStatus = err?.response?.status || err?.status;

      const enrichedError: any = new Error(errorMsg);
      enrichedError.status = httpStatus;
      enrichedError.errorCode = errorCode;
      enrichedError.response = err?.response;
      throw enrichedError;
    }
  },

  /**
   * Start employee break.
   *
   * TODO (Backend): Endpoint POST /api/v1/attendance/break/start
   * Body: { reason?: string, notes?: string }
   */
  startBreak: async (payload?: BreakPayload): Promise<AttendancePunchResult> => {
    const res: any = await api.post("attendance/break/start", payload || {});
    const data = extractObjectPayload<any>(res);
    return {
      id: data.id || new Date().getTime().toString(),
      time: data.time || new Date().toISOString(),
      status: "on-break",
      success: true,
      message: res.message || "Break started",
    };
  },

  /**
   * End employee break.
   *
   * TODO (Backend): Endpoint POST /api/v1/attendance/break/end
   */
  endBreak: async (): Promise<AttendancePunchResult> => {
    const res: any = await api.post("attendance/break/end", {});
    const data = extractObjectPayload<any>(res);
    return {
      id: data.id || new Date().getTime().toString(),
      time: data.time || new Date().toISOString(),
      status: "checked-in",
      success: true,
      message: res.message || "Break ended",
    };
  },

  /**
   * Fetch today's activity timeline.
   *
   * TODO (Backend): Endpoint GET /api/v1/attendance/timeline
   */
  getTimeline: async (): Promise<TimelineEventItem[]> => {
    try {
      // Query personal face attendance history to build today's timeline events
      const histRes: any = await api.get("attendance/face/history?limit=10");
      const list = extractListPayload(histRes);
      const todayStr = new Date().toISOString().split("T")[0];
      const todayItems = list.filter((item: any) => {
        const dStr = item.date ? item.date.split("T")[0] : "";
        return dStr === todayStr;
      });

      const events: TimelineEventItem[] = [];
      todayItems.forEach((item: any) => {
        if (item.check_in_time) {
          events.push({
            id: `${item.id}-in`,
            time: new Date(item.check_in_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
            label: "Checked In",
            type: "checkin",
          });
        }
        if (item.check_out_time) {
          events.push({
            id: `${item.id}-out`,
            time: new Date(item.check_out_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
            label: "Checked Out",
            type: "checkout",
          });
        }
      });

      return events;
    } catch {
      return [];
    }
  },

  /**
   * Fetch personal paginated daily attendance history from backend.
   * Calls GET /api/v1/attendance/face/history.
   */
  getMyAttendanceHistory: async (page = 1, limit = 20): Promise<{
    page: number;
    limit: number;
    total: number;
    items: AttendanceHistoryItem[];
  }> => {
    try {
      const res: any = await api.get(`attendance/face/history?page=${page}&limit=${limit}`);
      const payload = res?.data ?? res;
      const rawItems = Array.isArray(payload?.items) ? payload.items : Array.isArray(payload) ? payload : [];
      const total = typeof payload?.total === "number" ? payload.total : rawItems.length;

      const items: AttendanceHistoryItem[] = rawItems.map((item: any, idx: number) => {
        const dStr = item.date ? item.date.split("T")[0] : new Date().toISOString().split("T")[0];
        let status: AttendanceHistoryItem["status"] = "Present";
        if (item.check_in_time) {
          const checkInDate = new Date(item.check_in_time);
          if (!isNaN(checkInDate.getTime()) && checkInDate.getHours() >= 10) {
            status = "Late";
          } else {
            status = "Present";
          }
        } else {
          status = "Absent";
        }

        return {
          id: item.id || `hist-${idx}-${dStr}`,
          date: dStr,
          checkInTime: item.check_in_time ? new Date(item.check_in_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : null,
          checkOutTime: item.check_out_time ? new Date(item.check_out_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : null,
          workingHours: typeof item.working_hours === "number" ? Number(item.working_hours.toFixed(2)) : item.working_hours ? Number(item.working_hours) : null,
          employeeName: item.employee_name || "",
          status,
          location: item.latitude && item.longitude ? "Geofenced Site" : "Office",
        };
      });

      return {
        page,
        limit,
        total,
        items,
      };
    } catch (err: any) {
      console.warn("Could not fetch attendance history:", err);
      return {
        page,
        limit,
        total: 0,
        items: [],
      };
    }
  },

  /**
   * Backend geofence validation.
   *
   * TODO (Backend): Endpoint POST /api/v1/attendance/geofence/verify
   * Body: { latitude, longitude, office_id? }
   */
  verifyGeofence: async (coords: GeofenceVerifyPayload): Promise<GeofenceVerifyResult> => {
    const res: any = await api.post("attendance/geofence/verify", {
      latitude: coords.latitude,
      longitude: coords.longitude,
      office_id: coords.officeId,
    });
    const data = extractObjectPayload<any>(res);
    return {
      isInside: Boolean(data.is_inside ?? data.isInside),
      distanceMeters: data.distance_meters ?? data.distanceMeters,
      officeName: data.office_name ?? data.officeName,
      allowedRadiusMeters: data.allowed_radius_meters ?? data.allowedRadiusMeters,
    };
  },

  // ───────────────────────────────────────────────────────────
  // 3. Shifts Management
  // ───────────────────────────────────────────────────────────

  /**
   * List all configured work shifts.
   *
   * TODO (Backend): Endpoint GET /api/v1/attendance/shifts
   */
  getShifts: async (): Promise<Shift[]> => {
    const res = await api.get("attendance/shifts");
    const list = extractListPayload(res);
    return list.map((item: any) => ({
      id: item.id || item._id,
      name: item.name || item.shift_name,
      code: item.code || item.shift_code || "SHIFT",
      startTime: item.start_time || item.startTime || "09:00",
      endTime: item.end_time || item.endTime || "18:00",
      workHours: Number(item.work_hours ?? item.workHours ?? 9),
      gracePeriodMinutes: Number(item.grace_period_minutes ?? item.gracePeriodMinutes ?? 15),
      breakDurationMinutes: Number(item.break_duration_minutes ?? item.breakDurationMinutes ?? 60),
      nightShift: Boolean(item.night_shift ?? item.nightShift ?? false),
      nightPremiumPercent: Number(item.night_premium_percent ?? item.nightPremiumPercent ?? 0),
      workingDays: Array.isArray(item.working_days) ? item.working_days : (item.workingDays || ["Mon", "Tue", "Wed", "Thu", "Fri"]),
      assignedEmployeesCount: item.assigned_employees_count ?? item.assignedEmployeesCount ?? 0,
      isActive: item.is_active ?? item.isActive ?? true,
      color: item.color || "#6366F1",
      description: item.description || "",
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
  },

  /**
   * Create a new shift template.
   *
   * TODO (Backend): Endpoint POST /api/v1/attendance/shifts
   */
  createShift: async (data: ShiftCreatePayload): Promise<Shift> => {
    const res: any = await api.post("attendance/shifts", {
      name: data.name,
      code: data.code,
      start_time: data.startTime,
      end_time: data.endTime,
      grace_period_minutes: data.gracePeriodMinutes,
      break_duration_minutes: data.breakDurationMinutes,
      night_shift: data.nightShift,
      night_premium_percent: data.nightPremiumPercent,
      working_days: data.workingDays,
      color: data.color,
      description: data.description,
      is_active: data.isActive ?? true,
    });
    const item = extractObjectPayload<any>(res);
    return {
      id: item.id || item._id,
      name: item.name || data.name,
      code: item.code || data.code,
      startTime: item.start_time || data.startTime,
      endTime: item.end_time || data.endTime,
      workHours: Number(item.work_hours || 9),
      gracePeriodMinutes: Number(item.grace_period_minutes || data.gracePeriodMinutes),
      breakDurationMinutes: Number(item.break_duration_minutes || data.breakDurationMinutes),
      nightShift: Boolean(item.night_shift ?? data.nightShift),
      nightPremiumPercent: Number(item.night_premium_percent ?? data.nightPremiumPercent),
      workingDays: item.working_days || data.workingDays,
      assignedEmployeesCount: 0,
      isActive: item.is_active ?? true,
      color: item.color || data.color,
      description: item.description || data.description,
    };
  },

  /**
   * Update an existing shift.
   *
   * TODO (Backend): Endpoint PUT /api/v1/attendance/shifts/:id
   */
  updateShift: async (id: string, data: Partial<ShiftCreatePayload>): Promise<Shift> => {
    const res: any = await api.put(`attendance/shifts/${id}`, {
      name: data.name,
      code: data.code,
      start_time: data.startTime,
      end_time: data.endTime,
      grace_period_minutes: data.gracePeriodMinutes,
      break_duration_minutes: data.breakDurationMinutes,
      night_shift: data.nightShift,
      night_premium_percent: data.nightPremiumPercent,
      working_days: data.workingDays,
      color: data.color,
      description: data.description,
      is_active: data.isActive,
    });
    const item = extractObjectPayload<any>(res);
    return {
      id: item.id || id,
      name: item.name || data.name || "",
      code: item.code || data.code || "",
      startTime: item.start_time || data.startTime || "",
      endTime: item.end_time || data.endTime || "",
      workHours: Number(item.work_hours || 9),
      gracePeriodMinutes: Number(item.grace_period_minutes || data.gracePeriodMinutes || 15),
      breakDurationMinutes: Number(item.break_duration_minutes || data.breakDurationMinutes || 60),
      nightShift: Boolean(item.night_shift ?? data.nightShift),
      nightPremiumPercent: Number(item.night_premium_percent ?? data.nightPremiumPercent ?? 0),
      workingDays: item.working_days || data.workingDays || [],
      assignedEmployeesCount: item.assigned_employees_count ?? 0,
      isActive: item.is_active ?? true,
      color: item.color || data.color,
      description: item.description || data.description,
    };
  },

  /**
   * Assign shift to one or more employees.
   *
   * TODO (Backend): Endpoint POST /api/v1/attendance/shifts/:id/assign
   * Body: { employee_ids: string[], effective_date: string, notes?: string }
   */
  assignShift: async (shiftId: string, payload: ShiftAssignPayload): Promise<{ success: boolean; assignedCount: number }> => {
    const res: any = await api.post(`attendance/shifts/${shiftId}/assign`, {
      employee_ids: payload.employeeIds,
      effective_date: payload.effectiveDate,
      notes: payload.notes,
    });
    const data = extractObjectPayload<any>(res);
    return {
      success: true,
      assignedCount: data.assigned_count ?? payload.employeeIds.length,
    };
  },

  /**
   * Delete a shift.
   *
   * TODO (Backend): Endpoint DELETE /api/v1/attendance/shifts/:id
   */
  deleteShift: async (id: string): Promise<{ success: boolean }> => {
    await api.delete(`attendance/shifts/${id}`);
    return { success: true };
  },

  // ───────────────────────────────────────────────────────────
  // 4. Rosters Management
  // ───────────────────────────────────────────────────────────

  /**
   * List rotational team roster entries.
   *
   * TODO (Backend): Endpoint GET /api/v1/attendance/rosters
   * Query params: date_from, date_to, department, employee_id
   */
  getRosters: async (params?: { dateFrom?: string; dateTo?: string; department?: string }): Promise<RosterEntryRecord[]> => {
    const query = new URLSearchParams();
    if (params?.dateFrom) query.set("date_from", params.dateFrom);
    if (params?.dateTo) query.set("date_to", params.dateTo);
    if (params?.department) query.set("department", params.department);
    const qs = query.toString();

    const res = await api.get(`attendance/rosters${qs ? `?${qs}` : ""}`);
    const list = extractListPayload(res);
    return list.map((item: any) => ({
      id: item.id || item._id,
      employeeId: item.employee_id || item.employeeId,
      employeeName: item.employee_name || item.employeeName || "Employee",
      department: item.department || "General",
      designation: item.designation || "",
      date: item.date,
      shift: item.shift || "Morning",
      startTime: item.start_time || item.startTime || "08:00",
      endTime: item.end_time || item.endTime || "16:00",
      workingHours: Number(item.working_hours ?? item.workingHours ?? 8),
      breakTime: item.break_time || item.breakTime || "45 mins",
      location: item.location || "Office",
      manager: item.manager || item.manager_name || "Manager",
      status: item.status || "Approved",
    }));
  },

  /**
   * Create a roster entry.
   *
   * TODO (Backend): Endpoint POST /api/v1/attendance/rosters
   */
  createRoster: async (data: RosterCreatePayload): Promise<RosterEntryRecord> => {
    const res: any = await api.post("attendance/rosters", {
      employee_id: data.employeeId,
      employee_name: data.employeeName,
      department: data.department,
      designation: data.designation,
      date: data.date,
      shift: data.shift,
      start_time: data.startTime,
      end_time: data.endTime,
      working_hours: data.workingHours,
      break_time: data.breakTime,
      location: data.location,
      manager: data.manager,
      status: data.status,
      recurring: data.recurring,
    });
    const item = extractObjectPayload<any>(res);
    return {
      id: item.id || item._id,
      employeeId: item.employee_id || data.employeeId,
      employeeName: item.employee_name || data.employeeName,
      department: item.department || data.department,
      designation: item.designation || data.designation,
      date: item.date || data.date,
      shift: item.shift || data.shift as any,
      startTime: item.start_time || data.startTime,
      endTime: item.end_time || data.endTime,
      workingHours: Number(item.working_hours ?? data.workingHours),
      breakTime: item.break_time || data.breakTime,
      location: item.location || data.location,
      manager: item.manager || data.manager,
      status: item.status || data.status,
    };
  },

  /**
   * Update a roster entry.
   *
   * TODO (Backend): Endpoint PUT /api/v1/attendance/rosters/:id
   */
  updateRoster: async (id: string, data: Partial<RosterCreatePayload>): Promise<RosterEntryRecord> => {
    const res: any = await api.put(`attendance/rosters/${id}`, {
      employee_id: data.employeeId,
      employee_name: data.employeeName,
      department: data.department,
      designation: data.designation,
      date: data.date,
      shift: data.shift,
      start_time: data.startTime,
      end_time: data.endTime,
      working_hours: data.workingHours,
      break_time: data.breakTime,
      location: data.location,
      manager: data.manager,
      status: data.status,
    });
    const item = extractObjectPayload<any>(res);
    return {
      id: item.id || id,
      employeeId: item.employee_id || data.employeeId || "",
      employeeName: item.employee_name || data.employeeName || "",
      department: item.department || data.department || "",
      designation: item.designation || data.designation || "",
      date: item.date || data.date || "",
      shift: item.shift || data.shift as any || "Morning",
      startTime: item.start_time || data.startTime || "",
      endTime: item.end_time || data.endTime || "",
      workingHours: Number(item.working_hours ?? data.workingHours ?? 8),
      breakTime: item.break_time || data.breakTime || "",
      location: item.location || data.location || "",
      manager: item.manager || data.manager || "",
      status: item.status || data.status || "Approved",
    };
  },

  /**
   * Delete a roster entry.
   *
   * TODO (Backend): Endpoint DELETE /api/v1/attendance/rosters/:id
   */
  deleteRoster: async (id: string): Promise<{ success: boolean }> => {
    await api.delete(`attendance/rosters/${id}`);
    return { success: true };
  },

  // ───────────────────────────────────────────────────────────
  // 5. Holidays Management (Connects to /api/v1/calendar/holidays)
  // ───────────────────────────────────────────────────────────

  /**
   * List holidays from backend.
   * Primary route: GET /api/v1/calendar/holidays (Existing on backend).
   * Also aliases to GET /api/v1/attendance/holidays.
   */
  getHolidays: async (params?: { branch?: string; year?: number }): Promise<HolidayRecord[]> => {
    const query = new URLSearchParams();
    if (params?.branch && params.branch !== "all") query.set("branch", params.branch);
    if (params?.year) query.set("year", params.year.toString());
    const qs = query.toString();

    let res: unknown;
    try {
      res = await api.get(`calendar/holidays${qs ? `?${qs}` : ""}`);
    } catch {
      // Fallback if attendance/holidays is mounted
      res = await api.get(`attendance/holidays${qs ? `?${qs}` : ""}`);
    }

    const list = extractListPayload(res);
    return list.map((item: any) => ({
      id: item.id || item._id,
      name: item.holiday_name || item.name,
      description: item.description || "",
      date: item.holiday_date || item.date,
      type: (item.holiday_type || item.type || "Public") as any,
      country: item.country || "USA",
      state: item.state || "All States",
      office: item.branch || item.office || "All Offices",
      department: item.department || "All Departments",
      status: (item.status || "Active") as any,
      createdBy: item.created_by || item.createdBy || "Admin",
      createdDate: item.created_at ? item.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
      updatedDate: item.updated_at ? item.updated_at.split("T")[0] : new Date().toISOString().split("T")[0],
      notes: item.notes || "",
      color: item.color || "#3B82F6",
      recurring: Boolean(item.is_recurring ?? item.recurring),
      everyYear: Boolean(item.every_year ?? item.everyYear ?? true),
      applyToAll: Boolean(item.apply_to_all ?? item.applyToAll ?? true),
    }));
  },

  /**
   * Create a holiday entry.
   * Primary route: POST /api/v1/calendar/holidays.
   */
  createHoliday: async (data: HolidayCreatePayload): Promise<HolidayRecord> => {
    const payload = {
      holiday_name: data.name,
      holiday_date: data.date,
      holiday_type: data.type,
      branch: data.office || null,
      description: data.description || null,
      is_recurring: data.recurring ?? false,
    };

    let res: any;
    try {
      res = await api.post("calendar/holidays", payload);
    } catch {
      res = await api.post("attendance/holidays", {
        ...payload,
        name: data.name,
        date: data.date,
        type: data.type,
      });
    }

    const item = extractObjectPayload<any>(res);
    return {
      id: item.id || item._id,
      name: item.holiday_name || data.name,
      description: item.description || data.description || "",
      date: item.holiday_date || data.date,
      type: (item.holiday_type || data.type) as any,
      country: data.country || "USA",
      state: data.state || "All States",
      office: item.branch || data.office || "All Offices",
      department: data.department || "All Departments",
      status: "Active",
      createdBy: "Current User",
      createdDate: new Date().toISOString().split("T")[0],
      updatedDate: new Date().toISOString().split("T")[0],
      notes: data.notes || "",
      color: data.color || "#3B82F6",
      recurring: Boolean(item.is_recurring ?? data.recurring),
      everyYear: Boolean(data.everyYear ?? true),
      applyToAll: Boolean(data.applyToAll ?? true),
    };
  },

  /**
   * Update an existing holiday.
   * Primary route: PUT /api/v1/calendar/holidays/:id.
   */
  updateHoliday: async (id: string, data: Partial<HolidayCreatePayload>): Promise<HolidayRecord> => {
    const payload: Record<string, unknown> = {};
    if (data.name) payload.holiday_name = data.name;
    if (data.date) payload.holiday_date = data.date;
    if (data.type) payload.holiday_type = data.type;
    if (data.office !== undefined) payload.branch = data.office;
    if (data.description !== undefined) payload.description = data.description;
    if (data.recurring !== undefined) payload.is_recurring = data.recurring;

    let res: any;
    try {
      res = await api.put(`calendar/holidays/${id}`, payload);
    } catch {
      res = await api.put(`attendance/holidays/${id}`, payload);
    }

    const item = extractObjectPayload<any>(res);
    return {
      id: item.id || id,
      name: item.holiday_name || data.name || "",
      description: item.description || data.description || "",
      date: item.holiday_date || data.date || "",
      type: (item.holiday_type || data.type || "Public") as any,
      country: data.country || "USA",
      state: data.state || "All States",
      office: item.branch || data.office || "All Offices",
      department: data.department || "All Departments",
      status: "Active",
      createdBy: "Current User",
      createdDate: new Date().toISOString().split("T")[0],
      updatedDate: new Date().toISOString().split("T")[0],
      notes: data.notes || "",
      color: data.color || "#3B82F6",
      recurring: Boolean(item.is_recurring ?? data.recurring),
      everyYear: Boolean(data.everyYear ?? true),
      applyToAll: Boolean(data.applyToAll ?? true),
    };
  },

  /**
   * Delete a holiday entry.
   * Primary route: DELETE /api/v1/calendar/holidays/:id.
   */
  deleteHoliday: async (id: string): Promise<{ success: boolean }> => {
    try {
      await api.delete(`calendar/holidays/${id}`);
    } catch {
      await api.delete(`attendance/holidays/${id}`);
    }
    return { success: true };
  },

  /**
   * Bulk import holidays via CSV/Excel file or payload.
   *
   * TODO (Backend): Endpoint POST /api/v1/attendance/holidays/import (or /calendar/holidays/import)
   * Accepts multipart/form-data with file or JSON list of holidays.
   */
  importHolidays: async (fileOrList: File | HolidayCreatePayload[]): Promise<{ importedCount: number }> => {
    if (fileOrList instanceof File) {
      const formData = new FormData();
      formData.append("file", fileOrList);
      try {
        const res: any = await apiInstance.post("/calendar/holidays/import", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const data = extractObjectPayload<any>(res.data);
        return { importedCount: data.imported_count ?? 1 };
      } catch (err: any) {
        if (err?.response?.status === 404) {
          const res: any = await apiInstance.post("/attendance/holidays/import", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          const data = extractObjectPayload<any>(res.data);
          return { importedCount: data.imported_count ?? 1 };
        }
        throw err;
      }
    } else {
      // List of holiday payloads: persist via sequential creates
      let count = 0;
      for (const h of fileOrList) {
        await attendanceApi.createHoliday(h);
        count++;
      }
      return { importedCount: count };
    }
  },

  // ───────────────────────────────────────────────────────────
  // 6. Employee Portal Self-Service Methods (Real Backend)
  // ───────────────────────────────────────────────────────────

  /**
   * Resolves the authenticated employee profile from the backend database.
   */
  resolveCurrentEmployee: async (): Promise<{
    id: string;
    employee_id: string;
    full_name: string;
    email: string;
    shift?: string | null;
    branch?: string | null;
    work_location?: string | null;
    department?: string | null;
    designation?: string | null;
  } | null> => {
    const ws = aurix.get();
    const user = ws.user;
    if (!user) return null;

    // For employee self-service, avoid calling restricted admin-only /employees endpoint
    if (user.role === "employee") {
      const localMatch = ws.employees?.find(
        (e) => e.email === user.email || e.id === user.id
      );
      return {
        id: user.id,
        employee_id: localMatch?.employeeId || `EMP-${user.id.slice(0, 6).toUpperCase()}`,
        full_name: user.fullName || "Employee",
        email: user.email,
        shift: localMatch?.shift || "General Shift",
        branch: ws.company?.city || null,
        work_location: "Office",
        department: localMatch?.department || "General",
        designation: localMatch?.designation || "Employee",
      };
    }

    try {
      const res: any = await apiInstance.get("/employees", {
        params: { search: user.email || user.fullName, limit: 10 },
      });
      const data = res.data?.data?.items ?? res.data?.data ?? res.data ?? [];
      const list = Array.isArray(data) ? data : [];
      const match = list.find(
        (e: any) =>
          e.user_id === user.id ||
          e.id === user.id ||
          e.company_email === user.email ||
          e.personal_email === user.email
      );

      if (match) {
        return {
          id: match.id,
          employee_id: match.employee_id || `EMP-${match.id.slice(0, 6)}`,
          full_name: `${match.first_name || ""} ${match.last_name || ""}`.trim() || match.full_name || user.fullName,
          email: match.company_email || match.personal_email || user.email,
          shift: match.shift || null,
          branch: match.branch || null,
          work_location: match.work_location || null,
          department: match.department || "General",
          designation: match.designation || "Staff",
        };
      }
    } catch {
      // 403 or network error: fall back to local workspace user profile
    }

    // Fallback: check workspace employee cache if available
    const localMatch = ws.employees?.find(
      (e) => e.email === user.email || e.id === user.id
    );
    if (localMatch) {
      return {
        id: localMatch.id,
        employee_id: localMatch.employeeId,
        full_name: localMatch.fullName,
        email: localMatch.email,
        shift: localMatch.shift || null,
        branch: ws.company?.city || null,
        work_location: "Headquarters",
        department: localMatch.department,
        designation: localMatch.designation,
      };
    }

    return null;
  },

  /**
   * Fetches the authenticated employee's assigned shifts, today's schedule,
   * upcoming scheduled shifts, and shift history from real backend APIs.
   */
  getMyShiftSchedule: async (requestedEmployeeId?: string): Promise<EmployeeShiftScheduleData> => {
    const currentEmp = await attendanceApi.resolveCurrentEmployee();
    if (!currentEmp) {
      throw new Error("Unable to identify the authenticated employee.");
    }

    // Security check: Employee can only view their own schedule
    if (requestedEmployeeId && requestedEmployeeId !== currentEmp.id && requestedEmployeeId !== currentEmp.employee_id) {
      throw new Error("403 Forbidden: You do not have authorization to view shifts of other employees.");
    }

    const assignedShiftName = currentEmp.shift;
    if (!assignedShiftName || !assignedShiftName.trim()) {
      return {
        hasAssignedShift: false,
        employeeId: currentEmp.employee_id,
        employeeName: currentEmp.full_name,
        department: currentEmp.department || "General",
        designation: currentEmp.designation || "Staff",
        branch: currentEmp.branch || "Headquarters",
        currentShift: null,
        todayShift: null,
        upcomingShifts: [],
        shiftHistory: [],
      };
    }

    // Map shift definition
    const shiftDef = parseShiftDefinition(assignedShiftName);

    // Concurrently fetch real punch status and face attendance history
    const [todayPunchRes, historyRes, holidaysRes] = await Promise.allSettled([
      api.get<any>("attendance/face/me"),
      api.get<any>("attendance/face/history?limit=20"),
      attendanceApi.getHolidays({ branch: currentEmp.branch || undefined, year: new Date().getFullYear() }),
    ]);

    const todayPunch = todayPunchRes.status === "fulfilled" && todayPunchRes.value?.data
      ? todayPunchRes.value.data
      : todayPunchRes.status === "fulfilled" && todayPunchRes.value?.checked_in !== undefined
      ? todayPunchRes.value
      : null;

    const historyItems = historyRes.status === "fulfilled"
      ? (historyRes.value?.data?.items || historyRes.value?.items || [])
      : [];

    const holidayDates = new Set(
      holidaysRes.status === "fulfilled" ? holidaysRes.value.map((h) => h.date) : []
    );

    const todayStr = new Date().toISOString().split("T")[0];
    const todayDateObj = new Date();
    const dayOfWeek = todayDateObj.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
    const isHoliday = holidayDates.has(todayStr);

    const todayShift = {
      date: todayStr,
      day: todayDateObj.toLocaleDateString("en-US", { weekday: "long" }),
      shift: shiftDef,
      checkedIn: Boolean(todayPunch?.checked_in),
      checkedOut: Boolean(todayPunch?.checked_out),
      checkInTime: todayPunch?.check_in_time ? formatTimeStr(todayPunch.check_in_time) : null,
      checkOutTime: todayPunch?.check_out_time ? formatTimeStr(todayPunch.check_out_time) : null,
      workingHours: todayPunch?.working_hours ?? (todayPunch?.checked_in ? shiftDef.totalWorkingHours : null),
      isOffDay: isWeekend || isHoliday,
    };

    // Build upcoming shifts for next 14 business days
    const upcomingShifts: UpcomingShiftItem[] = [];
    for (let i = 1; i <= 14; i++) {
      const d = new Date(todayDateObj);
      d.setDate(todayDateObj.getDate() + i);
      const dateStr = d.toISOString().split("T")[0];
      const dOfWeek = d.getDay();
      const isOff = dOfWeek === 0 || dOfWeek === 6;
      const isHol = holidayDates.has(dateStr);

      if (!isOff && !isHol) {
        upcomingShifts.push({
          id: `upcoming-${dateStr}`,
          date: dateStr,
          day: d.toLocaleDateString("en-US", { weekday: "long" }),
          shiftName: shiftDef.shiftName,
          startTime: shiftDef.startTime,
          endTime: shiftDef.endTime,
          breakDuration: shiftDef.breakDuration,
          workingHours: shiftDef.totalWorkingHours,
          shiftType: shiftDef.shiftType,
          status: "Scheduled",
        });
      }
    }

    // Map past history
    const shiftHistory: ShiftHistoryItem[] = historyItems.map((item: any, idx: number) => {
      const dStr = item.date ? item.date.split("T")[0] : todayStr;
      const dObj = new Date(dStr);
      return {
        id: item.id || `hist-${idx}-${dStr}`,
        date: dStr,
        day: dObj.toLocaleDateString("en-US", { weekday: "long" }),
        shiftName: shiftDef.shiftName,
        checkInTime: item.check_in_time ? formatTimeStr(item.check_in_time) : null,
        checkOutTime: item.check_out_time ? formatTimeStr(item.check_out_time) : null,
        workingHours: item.working_hours ? Number(item.working_hours) : null,
        status: item.check_in_time ? "Present" : "Absent",
      };
    });

    return {
      hasAssignedShift: true,
      employeeId: currentEmp.employee_id,
      employeeName: currentEmp.full_name,
      department: currentEmp.department || "General",
      designation: currentEmp.designation || "Staff",
      branch: currentEmp.branch || "Headquarters",
      currentShift: shiftDef,
      todayShift,
      upcomingShifts,
      shiftHistory,
    };
  },

  /**
   * Fetches the employee's planned work schedule / roster entries from the real backend.
   */
  getMyRoster: async (month?: number, year?: number, requestedEmployeeId?: string): Promise<{
    entries: RosterDayItem[];
    hasRoster: boolean;
    employeeName: string;
    shiftName: string;
  }> => {
    const currentEmp = await attendanceApi.resolveCurrentEmployee();
    if (!currentEmp) {
      throw new Error("Unable to identify the authenticated employee.");
    }

    if (requestedEmployeeId && requestedEmployeeId !== currentEmp.id && requestedEmployeeId !== currentEmp.employee_id) {
      throw new Error("403 Forbidden: You do not have authorization to view the roster of other employees.");
    }

    const targetYear = year ?? new Date().getFullYear();
    const targetMonth = month ?? (new Date().getMonth() + 1); // 1-indexed

    // Check if employee has an assigned shift
    const assignedShiftName = currentEmp.shift;

    // Check backend for explicit rosters first
    let backendRosters: RosterEntryRecord[] = [];
    try {
      backendRosters = await attendanceApi.getRosters();
    } catch {
      // Backend attendance/rosters may not be populated
    }

    const myBackendRosters = backendRosters.filter(
      (r) => r.employeeId === currentEmp.id || r.employeeId === currentEmp.employee_id
    );

    // Fetch real holidays
    const holidays = await attendanceApi.getHolidays({
      branch: currentEmp.branch || undefined,
      year: targetYear,
    }).catch(() => [] as HolidayRecord[]);

    const holidayMap = new Map<string, HolidayRecord>();
    holidays.forEach((h) => holidayMap.set(h.date, h));

    if (!assignedShiftName && myBackendRosters.length === 0) {
      return {
        entries: [],
        hasRoster: false,
        employeeName: currentEmp.full_name,
        shiftName: "None",
      };
    }

    const shiftDef = parseShiftDefinition(assignedShiftName || "Morning");
    const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
    const entries: RosterDayItem[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(targetYear, targetMonth - 1, day);
      const dateStr = `${targetYear}-${String(targetMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Check if explicit backend roster exists for this day
      const explicit = myBackendRosters.find((r) => r.date === dateStr);
      if (explicit) {
        entries.push({
          id: explicit.id,
          date: dateStr,
          day: dayName,
          shiftName: explicit.shift,
          startTime: formatTimeStr(explicit.startTime),
          endTime: formatTimeStr(explicit.endTime),
          workingHours: explicit.workingHours,
          status: explicit.shift === "Off Day" ? "Weekly Off" : explicit.shift === "Holiday" ? "Holiday" : "Working",
          notes: explicit.location,
        });
        continue;
      }

      // Check if holiday
      const holiday = holidayMap.get(dateStr);
      if (holiday) {
        entries.push({
          id: `roster-${dateStr}`,
          date: dateStr,
          day: dayName,
          shiftName: holiday.name,
          startTime: "—",
          endTime: "—",
          workingHours: 0,
          status: "Holiday",
          notes: holiday.description || holiday.type,
        });
        continue;
      }

      // Check weekend
      if (isWeekend) {
        entries.push({
          id: `roster-${dateStr}`,
          date: dateStr,
          day: dayName,
          shiftName: "—",
          startTime: "—",
          endTime: "—",
          workingHours: 0,
          status: "Weekly Off",
        });
        continue;
      }

      // Standard working day based on assigned shift
      entries.push({
        id: `roster-${dateStr}`,
        date: dateStr,
        day: dayName,
        shiftName: shiftDef.shiftName,
        startTime: shiftDef.startTime,
        endTime: shiftDef.endTime,
        workingHours: shiftDef.totalWorkingHours,
        status: "Working",
      });
    }

    return {
      entries,
      hasRoster: true,
      employeeName: currentEmp.full_name,
      shiftName: shiftDef.shiftName,
    };
  },

  /**
   * Submits an employee request for shift or roster change to the backend support ticket workflow.
   */
  requestScheduleChange: async (payload: ScheduleChangeRequestPayload): Promise<{ success: boolean; message: string }> => {
    const res: any = await api.post("/api/v2/employee-support/tickets", {
      category: "HR",
      priority: "MEDIUM",
      title: `${payload.type === "shift" ? "Shift" : "Roster"} Change Request: ${payload.requestedShift}`,
      description: `Schedule change requested to ${payload.requestedShift}. Effective Date: ${payload.effectiveDate}. Reason: ${payload.reason}`,
    });

    const isSuccess = res?.success !== false;
    return {
      success: isSuccess,
      message: res?.message || "Your schedule change request has been submitted to HR.",
    };
  },
};

// ─────────────────────────────────────────────────────────────
// Shift definition parser & time formatting helpers
// ─────────────────────────────────────────────────────────────

function parseShiftDefinition(raw: string): EmployeeShiftInfo {
  const s = raw.trim().toLowerCase();
  if (s.includes("night")) {
    return {
      shiftName: "Night Shift",
      shiftType: "Night",
      startTime: "10:00 PM",
      endTime: "07:00 AM",
      breakDuration: "1 Hour",
      breakWindow: "02:00 AM – 03:00 AM",
      totalWorkingHours: 8,
      gracePeriodMinutes: 15,
      nightPremiumPercent: 15,
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      description: "Standard night operational shift with night differential premium allowance.",
    };
  }
  if (s.includes("flex")) {
    return {
      shiftName: "Flexible Shift",
      shiftType: "Flexible",
      startTime: "10:00 AM",
      endTime: "07:00 PM",
      breakDuration: "1 Hour",
      breakWindow: "Flexible (01:00 PM – 03:00 PM)",
      totalWorkingHours: 8,
      gracePeriodMinutes: 30,
      nightPremiumPercent: 0,
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      description: "Flexible work timings with core collaborative hours from 11:00 AM to 04:00 PM.",
    };
  }
  if (s.includes("even")) {
    return {
      shiftName: "Evening Shift",
      shiftType: "Regular",
      startTime: "02:00 PM",
      endTime: "11:00 PM",
      breakDuration: "1 Hour",
      breakWindow: "06:00 PM – 07:00 PM",
      totalWorkingHours: 8,
      gracePeriodMinutes: 15,
      nightPremiumPercent: 5,
      workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      description: "Afternoon coverage shift providing extended business operational continuity.",
    };
  }
  // Default Regular / Morning Shift
  return {
    shiftName: raw.includes("Shift") ? raw : `${raw} Shift`,
    shiftType: "Regular",
    startTime: "09:00 AM",
    endTime: "06:00 PM",
    breakDuration: "1 Hour",
    breakWindow: "01:00 PM – 02:00 PM",
    totalWorkingHours: 8,
    gracePeriodMinutes: 15,
    nightPremiumPercent: 0,
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    description: "Standard daytime corporate office schedule with 8 hours of productive working time.",
  };
}

function formatTimeStr(isoOrTime: string): string {
  if (!isoOrTime) return "—";
  if (isoOrTime.includes("T")) {
    const d = new Date(isoOrTime);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
    }
  }
  if (isoOrTime.includes(":") && !isoOrTime.includes("AM") && !isoOrTime.includes("PM")) {
    const parts = isoOrTime.split(":");
    let h = parseInt(parts[0], 10);
    const m = parts[1] || "00";
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${String(h).padStart(2, "0")}:${m} ${ampm}`;
  }
  return isoOrTime;
}

export default attendanceApi;

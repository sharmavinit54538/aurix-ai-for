import { api } from "@/api";
import {
  TodayPunchStatus,
  CheckInPayload,
  CheckOutPayload,
  BreakPayload,
  AttendancePunchResult,
  TimelineEventItem,
  AttendanceHistoryItem,
  GeofenceVerifyPayload,
  GeofenceVerifyResult,
} from "./types";
import {
  extractListPayload,
  extractObjectPayload,
  base64ToBlob,
  extractErrorCode,
  extractFaceApiError,
  parseTodayPunchData,
} from "./helpers";

// ─────────────────────────────────────────────────────────────
// 2. Check In / Check Out / Break / Geofence
// Canonical endpoints under /api/v1/attendance/
// ─────────────────────────────────────────────────────────────

/**
 * Get current authenticated employee's punch status for today.
 * Calls GET /api/v1/attendance/face/me (canonical endpoint).
 * Parses active sessions, status strings, timestamps, and open check-in state.
 */
export async function getMyTodayStatus(): Promise<TodayPunchStatus> {
  const res: any = await api.get("attendance/face/me");
  return parseTodayPunchData(res);
}

/**
 * Perform attendance check-in.
 * Calls POST /api/v1/attendance/face/check-in (canonical endpoint).
 * Requires image_base64 for face verification.
 */
export async function checkIn(payload: CheckInPayload): Promise<AttendancePunchResult> {
  if (!payload.image_base64) {
    throw new Error("A face photo is required for check-in. Please look directly into the camera.");
  }

  const body: Record<string, any> = {
    image_base64: payload.image_base64,
    device_info: payload.deviceInfo || (typeof navigator !== "undefined" ? navigator.userAgent : "Web"),
  };

  if (payload.latitude != null && payload.longitude != null) {
    body.location = {
      latitude: payload.latitude,
      longitude: payload.longitude,
      accuracy: payload.accuracy ?? undefined,
    };
  }
  if (payload.notes) {
    body.notes = payload.notes;
  }
  if (payload.ipAddress) {
    body.ip_address = payload.ipAddress;
  }
  if (payload.work_mode) {
    body.work_mode = payload.work_mode;
  }

  try {
    const res: any = await api.post("attendance/face/check-in", body);
    const data = extractObjectPayload<any>(res);
    return {
      id: data.id || data.attendance_id || "",
      employeeId: data.employee_id || data.employeeId,
      employeeName: data.employee_name || data.employeeName,
      time: data.check_in_time || data.time || new Date().toISOString(),
      checkInTime: data.check_in_time || data.time || new Date().toISOString(),
      status: data.status || "checked-in",
      workingHours: data.working_hours ?? data.workingHours ?? null,
      success: true,
      message: res.message || data.message || "Attendance Verified & Marked Successfully!",
      isInsideGeofence: data.is_inside_geofence ?? data.isInsideGeofence,
      breakDurationMinutes: data.break_duration_minutes ?? data.breakDurationMinutes ?? undefined,
      activeSeconds: data.active_seconds ?? data.activeSeconds ?? undefined,
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

/**
 * Perform attendance check-out.
 * Calls POST /api/v1/attendance/face/check-out (canonical endpoint).
 * Requires image_base64 for face verification.
 */
export async function checkOut(payload: CheckOutPayload): Promise<AttendancePunchResult> {
  if (!payload.image_base64) {
    throw new Error("A face photo is required for check-out. Please enable your camera and capture your face.");
  }

  const body: Record<string, any> = {
    image_base64: payload.image_base64,
    device_info: payload.deviceInfo || (typeof navigator !== "undefined" ? navigator.userAgent : "Web"),
  };

  if (payload.latitude != null && payload.longitude != null) {
    body.location = {
      latitude: payload.latitude,
      longitude: payload.longitude,
      accuracy: payload.accuracy ?? undefined,
    };
  }
  if (payload.notes) {
    body.notes = payload.notes;
  }
  if (payload.ipAddress) {
    body.ip_address = payload.ipAddress;
  }
  if (payload.work_mode) {
    body.work_mode = payload.work_mode;
  }

  try {
    const res: any = await api.post("attendance/face/check-out", body);
    const data = extractObjectPayload<any>(res);
    return {
      id: data.id || data.attendance_id || "",
      employeeId: data.employee_id || data.employeeId,
      employeeName: data.employee_name || data.employeeName,
      time: data.check_out_time || data.time || new Date().toISOString(),
      checkOutTime: data.check_out_time || data.time || new Date().toISOString(),
      status: data.status || "checked-out",
      workingHours: data.working_hours ?? data.workingHours ?? null,
      success: true,
      message: res.message || data.message || "Attendance Verified & Marked Successfully!",
      isInsideGeofence: data.is_inside_geofence ?? data.isInsideGeofence,
      breakDurationMinutes: data.break_duration_minutes ?? data.breakDurationMinutes ?? undefined,
      activeSeconds: data.active_seconds ?? data.activeSeconds ?? undefined,
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

/**
 * Start employee break with live face verification.
 * Calls POST /api/v1/attendance/break/start (canonical endpoint).
 * Requires image_base64 for face verification.
 */
export async function startBreak(payload?: BreakPayload): Promise<AttendancePunchResult> {
  if (!payload?.image_base64) {
    throw new Error("A face photo is required for break verification. Please look directly into the camera.");
  }

  const body: Record<string, any> = {
    image_base64: payload.image_base64,
    device_info: payload.deviceInfo || (typeof navigator !== "undefined" ? navigator.userAgent : "Web"),
  };

  if (payload.latitude != null && payload.longitude != null) {
    body.location = {
      latitude: payload.latitude,
      longitude: payload.longitude,
      accuracy: payload.accuracy ?? undefined,
    };
  }
  if (payload.notes) {
    body.notes = payload.notes;
  }
  if (payload.ipAddress) {
    body.ip_address = payload.ipAddress;
  }
  if (payload.work_mode) {
    body.work_mode = payload.work_mode;
  }

  try {
    const res: any = await api.post("attendance/break/start", body);
    const data = extractObjectPayload<any>(res);
    return {
      id: data.id || data.break_id || data.attendance_id || "",
      time: data.time || data.break_start || new Date().toISOString(),
      status: data.status || "on-break",
      success: true,
      message: res.message || data.message || "Break started successfully",
      employeeId: data.employee_id || data.employeeId,
      employeeName: data.employee_name || data.employeeName,
      isInsideGeofence: data.is_inside_geofence ?? data.isInsideGeofence,
      breakDurationMinutes: data.break_duration_minutes ?? data.breakDurationMinutes ?? undefined,
      activeSeconds: data.active_seconds ?? data.activeSeconds ?? undefined,
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

/**
 * End employee break with live face verification.
 * Calls POST /api/v1/attendance/break/end (canonical endpoint).
 * Requires image_base64 for face verification.
 */
export async function endBreak(payload?: BreakPayload): Promise<AttendancePunchResult> {
  if (!payload?.image_base64) {
    throw new Error("A face photo is required for break verification. Please look directly into the camera.");
  }

  const body: Record<string, any> = {
    image_base64: payload.image_base64,
    device_info: payload.deviceInfo || (typeof navigator !== "undefined" ? navigator.userAgent : "Web"),
  };

  if (payload.latitude != null && payload.longitude != null) {
    body.location = {
      latitude: payload.latitude,
      longitude: payload.longitude,
      accuracy: payload.accuracy ?? undefined,
    };
  }
  if (payload.notes) {
    body.notes = payload.notes;
  }
  if (payload.ipAddress) {
    body.ip_address = payload.ipAddress;
  }
  if (payload.work_mode) {
    body.work_mode = payload.work_mode;
  }

  try {
    const res: any = await api.post("attendance/break/end", body);
    const data = extractObjectPayload<any>(res);
    return {
      id: data.id || data.break_id || data.attendance_id || "",
      time: data.time || data.break_end || new Date().toISOString(),
      status: data.status || "checked-in",
      workingHours: data.working_hours ?? data.workingHours ?? null,
      success: true,
      message: res.message || data.message || "Break ended successfully",
      employeeId: data.employee_id || data.employeeId,
      employeeName: data.employee_name || data.employeeName,
      isInsideGeofence: data.is_inside_geofence ?? data.isInsideGeofence,
      breakDurationMinutes: data.break_duration_minutes ?? data.breakDurationMinutes ?? undefined,
      activeSeconds: data.active_seconds ?? data.activeSeconds ?? undefined,
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

/**
 * Fetch today's activity timeline from today's attendance status.
 * Uses the canonical attendance status response which includes today's events.
 */
export async function getTimeline(): Promise<TimelineEventItem[]> {
  try {
    const res: any = await api.get("attendance/face/me");
    const data = extractObjectPayload<any>(res);
    
    const events: TimelineEventItem[] = [];
    let eventCounter = 0;
    
    if (data.check_in_time) {
      events.push({
        id: `timeline-${eventCounter++}-in`,
        time: new Date(data.check_in_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
        label: "Checked In",
        type: "checkin",
      });
    }
    if (data.breaks && Array.isArray(data.breaks)) {
      data.breaks.forEach((breakItem: any) => {
        if (breakItem.break_start) {
          events.push({
            id: `timeline-${eventCounter++}-break-start`,
            time: new Date(breakItem.break_start).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
            label: "Break Started",
            type: "break_start",
          });
        }
        if (breakItem.break_end) {
          events.push({
            id: `timeline-${eventCounter++}-break-end`,
            time: new Date(breakItem.break_end).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
            label: "Break Ended",
            type: "break_end",
          });
        }
      });
    }
    if (data.check_out_time) {
      events.push({
        id: `timeline-${eventCounter++}-out`,
        time: new Date(data.check_out_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }),
        label: "Checked Out",
        type: "checkout",
      });
    }
    
    return events.sort((a, b) => a.time.localeCompare(b.time));
  } catch {
    return [];
  }
}

/**
 * Fetch personal paginated daily attendance history from backend.
 * Calls GET /api/v1/attendance/face/history.
 * Uses backend-provided status and is_late values, not hardcoded rules.
 */
export async function getMyAttendanceHistory(page = 1, limit = 20): Promise<{
  page: number;
  limit: number;
  total: number;
  items: AttendanceHistoryItem[];
}> {
  try {
    const res: any = await api.get(`attendance/face/history?page=${page}&limit=${limit}`);
    const payload = res?.data ?? res;
    const rawItems = Array.isArray(payload?.items) ? payload.items : Array.isArray(payload) ? payload : [];
    const total = typeof payload?.total === "number" ? payload.total : rawItems.length;

    const items: AttendanceHistoryItem[] = rawItems.map((item: any, idx: number) => {
      const dStr = item.date ? item.date.split("T")[0] : "";
      
      let status: AttendanceHistoryItem["status"] = "Present";
      if (item.status) {
        status = item.status;
      } else if (item.is_late === true || item.late_minutes > 0) {
        status = "Late";
      } else if (!item.check_in_time) {
        status = "Absent";
      }
      
      const workingHoursRaw = typeof item.working_hours === "number" 
        ? item.working_hours 
        : typeof item.workingHours === "number" 
          ? item.workingHours 
          : null;
      const workingHours = workingHoursRaw !== null ? Number(workingHoursRaw.toFixed(2)) : null;

      return {
        id: item.id || item.attendance_id || `hist-${idx}-${dStr}`,
        date: dStr,
        checkInTime: item.check_in_time ? new Date(item.check_in_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : null,
        checkOutTime: item.check_out_time ? new Date(item.check_out_time).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : null,
        workingHours,
        employeeName: item.employee_name || item.employeeName || "",
        status,
        shiftName: item.shift_name || item.shiftName || undefined,
        isLate: item.is_late ?? item.isLate ?? undefined,
        lateMinutes: item.late_minutes ?? item.lateMinutes ?? undefined,
        location: (item.latitude && item.longitude) ? "Geofenced Site" : (item.location || "Office"),
        verificationStatus: item.verification_status || item.verificationStatus || undefined,
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
}

/**
 * Backend geofence validation.
 * Calls POST /api/v1/attendance/geofence/verify
 */
export async function verifyGeofence(coords: GeofenceVerifyPayload): Promise<GeofenceVerifyResult> {
  const res: any = await api.post("attendance/geofence/verify", {
    latitude: coords.latitude,
    longitude: coords.longitude,
    accuracy: coords.accuracy,
  });
  const data = extractObjectPayload<any>(res);
  return {
    isInside: Boolean(data.is_inside ?? data.isInside),
    distanceMeters: data.distance_meters ?? data.distanceMeters,
    officeName: data.office_name ?? data.officeName,
    allowedRadiusMeters: data.allowed_radius_meters ?? data.allowedRadiusMeters,
    policy: data.policy,
    message: data.message,
  };
}

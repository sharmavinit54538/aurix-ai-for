import { api } from "@/api";
import apiInstance from "@/api/apiInstance";
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
} from "./helpers";

// ─────────────────────────────────────────────────────────────
// 2. Check In / Check Out / Break / Geofence
// ─────────────────────────────────────────────────────────────

/**
 * Get current authenticated employee's punch status for today.
 * Calls GET /api/v1/attendance/face/me (or /api/v1/attendance/today/me).
 */
export async function getMyTodayStatus(): Promise<TodayPunchStatus> {
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
}

/**
 * Perform attendance check-in.
 * If image_base64 is provided, sends JSON payload to POST /attendance/checkin.
 * Otherwise falls back to multipart POST /attendance/face/check-in.
 */
export async function checkIn(payload: CheckInPayload): Promise<AttendancePunchResult> {
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
          accuracy: payload.accuracy,
        };
        body.latitude = payload.latitude;
        body.longitude = payload.longitude;
        body.accuracy = payload.accuracy;
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
        employeeId: data.employee_id || data.employeeId,
        employeeName: data.employee_name || data.employeeName,
        time: data.check_in_time || data.time || new Date().toISOString(),
        checkInTime: data.check_in_time || data.time || new Date().toISOString(),
        status: data.status || "checked-in",
        workingHours: data.working_hours ?? data.workingHours ?? null,
        success: true,
        message: res.message || data.message || "Attendance Verified & Marked Successfully!",
        isInsideGeofence: data.is_inside_geofence ?? data.isInsideGeofence,
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
  if (payload.accuracy != null) formData.append("accuracy", payload.accuracy.toString());
  formData.append("device_info", payload.deviceInfo || (typeof navigator !== "undefined" ? navigator.userAgent : "Web"));
  if (payload.ipAddress) formData.append("ip_address", payload.ipAddress);

  try {
    const res: any = await apiInstance.post("/attendance/face/check-in", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const data = extractObjectPayload<any>(res.data);
    return {
      id: data.id || data.attendance_id || "",
      employeeId: data.employee_id || data.employeeId,
      employeeName: data.employee_name || data.employeeName,
      time: data.check_in_time || data.time || "",
      checkInTime: data.check_in_time || data.time || "",
      status: data.status || "checked-in",
      workingHours: data.working_hours ?? data.workingHours ?? null,
      success: true,
      message: res.data?.message || data.message || "Checked in successfully",
      isInsideGeofence: data.is_inside_geofence ?? data.isInsideGeofence,
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
 * Sends coordinates, device info, and photo proof to backend /api/v1/attendance/face/check-out.
 * Supports both multipart file and Base64 captured snapshot.
 */
export async function checkOut(payload: CheckOutPayload): Promise<AttendancePunchResult> {
  let fileBlob = payload.file;
  if (!fileBlob && payload.image_base64) {
    fileBlob = base64ToBlob(payload.image_base64, "image/jpeg");
  }

  if (!fileBlob) {
    throw new Error("A face photo is required for check-out. Please enable your camera and capture your face.");
  }

  const formData = new FormData();
  formData.append("file", fileBlob, "checkout-proof.jpg");
  if (payload.latitude != null) formData.append("latitude", payload.latitude.toString());
  if (payload.longitude != null) formData.append("longitude", payload.longitude.toString());
  if (payload.accuracy != null) formData.append("accuracy", payload.accuracy.toString());
  formData.append("device_info", payload.deviceInfo || (typeof navigator !== "undefined" ? navigator.userAgent : "Web"));
  if (payload.ipAddress) formData.append("ip_address", payload.ipAddress);

  try {
    const res: any = await apiInstance.post("/attendance/face/check-out", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const data = extractObjectPayload<any>(res.data);
    return {
      id: data.id || data.attendance_id || "",
      employeeId: data.employee_id || data.employeeId,
      employeeName: data.employee_name || data.employeeName,
      time: data.check_out_time || data.time || "",
      checkOutTime: data.check_out_time || data.time || "",
      status: data.status || "checked-out",
      workingHours: data.working_hours ?? data.workingHours ?? null,
      success: true,
      message: res.data?.message || data.message || "Checked out successfully",
      isInsideGeofence: data.is_inside_geofence ?? data.isInsideGeofence,
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
 * Calls POST /api/v1/attendance/break/start.
 */
export async function startBreak(payload?: BreakPayload): Promise<AttendancePunchResult> {
  if (!payload?.image_base64 && !payload?.file) {
    throw new Error("A face photo is required for break verification. Please look directly into the camera.");
  }

  try {
    const body: Record<string, any> = {
      image_base64: payload.image_base64,
      device_info: payload.deviceInfo || (typeof navigator !== "undefined" ? navigator.userAgent : "Web"),
    };
    if (payload.latitude != null || payload.longitude != null) {
      body.location = {
        latitude: payload.latitude,
        longitude: payload.longitude,
        accuracy: payload.accuracy,
      };
      body.latitude = payload.latitude;
      body.longitude = payload.longitude;
      body.accuracy = payload.accuracy;
    }
    const noteContent = payload.notes || payload.reason;
    if (noteContent) {
      body.notes = noteContent;
    }
    if (payload.ipAddress) {
      body.ip_address = payload.ipAddress;
    }

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
 * Calls POST /api/v1/attendance/break/end.
 */
export async function endBreak(payload?: BreakPayload): Promise<AttendancePunchResult> {
  if (!payload?.image_base64 && !payload?.file) {
    throw new Error("A face photo is required for break verification. Please look directly into the camera.");
  }

  try {
    const body: Record<string, any> = {
      image_base64: payload.image_base64,
      device_info: payload.deviceInfo || (typeof navigator !== "undefined" ? navigator.userAgent : "Web"),
    };
    if (payload.latitude != null || payload.longitude != null) {
      body.location = {
        latitude: payload.latitude,
        longitude: payload.longitude,
        accuracy: payload.accuracy,
      };
      body.latitude = payload.latitude;
      body.longitude = payload.longitude;
      body.accuracy = payload.accuracy;
    }
    if (payload.ipAddress) {
      body.ip_address = payload.ipAddress;
    }

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
 * Fetch today's activity timeline.
 */
export async function getTimeline(): Promise<TimelineEventItem[]> {
  try {
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
}

/**
 * Fetch personal paginated daily attendance history from backend.
 * Calls GET /api/v1/attendance/face/history.
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
}

/**
 * Backend geofence validation.
 */
export async function verifyGeofence(coords: GeofenceVerifyPayload): Promise<GeofenceVerifyResult> {
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
}

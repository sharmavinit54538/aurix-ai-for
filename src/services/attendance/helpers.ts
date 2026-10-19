import { EmployeeShiftInfo, TodayPunchStatus } from "./types";

// ─────────────────────────────────────────────────────────────
// Helper Extractors & Time Formatter
// ─────────────────────────────────────────────────────────────

export function extractListPayload(res: unknown): unknown[] {
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

export function extractObjectPayload<T = Record<string, unknown>>(res: unknown): T {
  if (!res || typeof res !== "object") return {} as T;
  const root = res as Record<string, unknown>;
  if (root.data && typeof root.data === "object" && !Array.isArray(root.data)) {
    return root.data as T;
  }
  return root as unknown as T;
}

/**
 * Robustly parse today's attendance punch status from backend responses.
 * Detects active open sessions, timestamps, booleans, and status strings.
 */
export function parseTodayPunchData(res: unknown): TodayPunchStatus {
  const root = extractObjectPayload<any>(res) || {};
  const session =
    (root.active_session && typeof root.active_session === "object" ? root.active_session : null) ||
    (root.session && typeof root.session === "object" ? root.session : null) ||
    (root.attendance && typeof root.attendance === "object" ? root.attendance : null) ||
    (root.record && typeof root.record === "object" ? root.record : null) ||
    (root.today && typeof root.today === "object" ? root.today : null) ||
    {};

  const data = { ...session, ...root };

  const checkInTime: string | null =
    data.check_in_time ||
    data.checkInTime ||
    data.punch_in ||
    data.punch_in_time ||
    data.punchIn ||
    data.in_time ||
    data.inTime ||
    data.time ||
    null;

  const checkOutTime: string | null =
    data.check_out_time ||
    data.checkOutTime ||
    data.punch_out ||
    data.punch_out_time ||
    data.punchOut ||
    data.out_time ||
    data.outTime ||
    null;

  const rawStatus = (
    data.status ||
    data.attendance_status ||
    data.current_status ||
    data.state ||
    ""
  )
    .toString()
    .toLowerCase()
    .trim();

  const hasActiveSession = Boolean(
    data.is_active ??
    data.isActive ??
    data.active ??
    data.has_active_session ??
    data.hasActiveSession
  );

  const isCheckedInFlag = Boolean(
    data.checked_in ??
    data.checkedIn ??
    data.is_checked_in ??
    data.isCheckedIn
  );

  const isCheckedOutFlag = Boolean(
    data.checked_out ??
    data.checkedOut ??
    data.is_checked_out ??
    data.isCheckedOut
  );

  const isOnBreakFlag = Boolean(
    data.on_break ??
    data.onBreak ??
    data.is_on_break ??
    data.isOnBreak
  );

  const statusMatchesCheckedOut =
    rawStatus === "checked-out" ||
    rawStatus === "checked_out" ||
    rawStatus === "completed" ||
    rawStatus === "out" ||
    rawStatus === "signed-out";

  const statusMatchesBreak =
    rawStatus === "on-break" ||
    rawStatus === "on_break" ||
    rawStatus === "break" ||
    rawStatus === "break-in" ||
    rawStatus === "break_in";

  const statusMatchesCheckedIn =
    rawStatus === "checked-in" ||
    rawStatus === "checked_in" ||
    rawStatus === "present" ||
    rawStatus === "active" ||
    rawStatus === "working" ||
    rawStatus === "in" ||
    rawStatus === "signed-in";

  const checkedOut =
    isCheckedOutFlag ||
    statusMatchesCheckedOut ||
    Boolean(checkOutTime && checkInTime);

  const onBreak = !checkedOut && (isOnBreakFlag || statusMatchesBreak);

  const checkedIn =
    !checkedOut &&
    (
      isCheckedInFlag ||
      hasActiveSession ||
      statusMatchesCheckedIn ||
      onBreak ||
      Boolean(checkInTime && !checkOutTime)
    );

  const workingHours =
    typeof data.working_hours === "number"
      ? data.working_hours
      : typeof data.workingHours === "number"
      ? data.workingHours
      : data.working_hours
      ? Number(data.working_hours)
      : null;

  const breakDurationMinutes =
    data.break_duration_minutes ??
    data.breakDurationMinutes ??
    data.break_duration_mins ??
    (typeof data.break_duration === "number" ? Math.round(data.break_duration / 60) : undefined);

  const activeSeconds =
    data.active_seconds ??
    data.activeSeconds ??
    (typeof data.active_time === "number" ? data.active_time : undefined);

  return {
    checkedIn,
    checkedOut,
    onBreak,
    checkInTime,
    checkOutTime,
    workingHours,
    breakDurationMinutes,
    activeSeconds,
    message: data.message,
    attendanceId: data.attendance_id || data.id,
    raw: data,
  };
}

/**
 * Convert Base64 data URL to a binary Blob for multipart/form-data upload.
 */
export function base64ToBlob(base64: string, contentType = "image/jpeg"): Blob {
  const parts = base64.split(",");
  const raw = parts.length > 1 ? parts[1] : parts[0];
  const binaryStr = atob(raw);
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return new Blob([bytes], { type: contentType });
}

/**
 * Extracts user-friendly error message from face attendance API errors.
 */
export function extractFaceApiError(err: any): string {
  const status = err?.response?.status || err?.status;
  const resp = err?.response?.data || err?.data || (err?.detail ? err : undefined);
  const rawCode = extractErrorCode(err) || "";
  const code = rawCode.toUpperCase();
  let rawMsg = "";
  let detailMsg = "";

  if (resp) {
    if (typeof resp === "string") {
      rawMsg = resp;
    } else if (resp.detail) {
      if (typeof resp.detail === "string") {
        rawMsg = resp.detail;
        detailMsg = resp.detail.trim();
      } else if (typeof resp.detail === "object" && resp.detail !== null) {
        if (typeof resp.detail.message === "string") {
          rawMsg = resp.detail.message;
          detailMsg = resp.detail.message.trim();
        } else if (typeof resp.detail.msg === "string") {
          rawMsg = resp.detail.msg;
          detailMsg = resp.detail.msg.trim();
        }
      } else if (Array.isArray(resp.detail)) {
        rawMsg = resp.detail.map((d: any) => d.msg || d.message || JSON.stringify(d)).join("; ");
        detailMsg = rawMsg;
      }
    } else if (resp.message && typeof resp.message === "string") {
      rawMsg = resp.message;
      detailMsg = resp.message.trim();
    }
  }

  // Biometric & Liveness / Quality mappings:
  // For FACE_QUALITY_LOW and LIVENESS_FAILED, prefer detail.message from the backend when present;
  // fall back to the generic text only if it's empty.
  if (code === "LIVENESS_FAILED" || rawMsg.toLowerCase().includes("liveness")) {
    if (detailMsg && detailMsg.toUpperCase() !== "LIVENESS_FAILED") {
      return detailMsg;
    }
    return "Liveness check failed. Please present your real face to the camera.";
  }
  if (code === "FACE_QUALITY_LOW" || rawMsg.toLowerCase().includes("blur") || rawMsg.toLowerCase().includes("quality")) {
    if (detailMsg && detailMsg.toUpperCase() !== "FACE_QUALITY_LOW") {
      return detailMsg;
    }
    return "Image quality too low or blurred. Please hold steady in good ambient light.";
  }

  if (code === "FACE_NOT_ENROLLED" || rawMsg.toLowerCase().includes("face not enrolled") || rawMsg.toLowerCase().includes("not enrolled")) {
    return "Face not enrolled. Please complete biometric face registration first.";
  }
  if (code === "FACE_MISMATCH" || rawMsg.toLowerCase().includes("mismatch") || rawMsg.toLowerCase().includes("does not match")) {
    return "Face not recognized. The face does not match your enrolled profile. Please ensure proper lighting and look directly into the camera.";
  }
  if (code === "FACE_NOT_FOUND" || rawMsg.toLowerCase().includes("no face")) {
    return "No face detected in frame. Please center your face inside the guide outline.";
  }
  if (code === "MULTIPLE_FACES" || rawMsg.toLowerCase().includes("multiple faces")) {
    return "Multiple faces detected. Exactly one person must be visible in the camera preview.";
  }

  // Location & Geofence mappings
  if (code === "LOCATION_REQUIRED" || rawMsg.toLowerCase().includes("location required") || rawMsg.toLowerCase().includes("location is required")) {
    return "Location access is required to verify attendance. Please enable location services and allow permission.";
  }
  if (code === "OUTSIDE_GEOFENCE" || rawMsg.toLowerCase().includes("geofence") || rawMsg.toLowerCase().includes("outside")) {
    return "Outside office radius. Attendance verification must be completed inside the authorized office location.";
  }
  if (code === "SUSPICIOUS_LOCATION" || rawMsg.toLowerCase().includes("suspicious location") || rawMsg.toLowerCase().includes("mock location")) {
    return "Suspicious or mock location detected. Please disable GPS spoofing and try again.";
  }

  // Attendance state mappings
  if (code === "ALREADY_CHECKED_IN" || rawMsg.toLowerCase().includes("already checked in")) {
    return "You are already checked in for today.";
  }
  if (code === "ALREADY_ENROLLED" || rawMsg.toLowerCase().includes("already enrolled") || rawMsg.toLowerCase().includes("already registered")) {
    return "Face profile is already registered. You can replace your existing profile if needed.";
  }
  if (code === "EMPLOYEE_NOT_FOUND" || rawMsg.toLowerCase().includes("employee not found")) {
    return "Employee profile not found. Please contact your HR administrator.";
  }
  if (code === "TENANT_MISMATCH" || rawMsg.toLowerCase().includes("tenant mismatch")) {
    return "Organization mismatch. Please log in with your valid organization account.";
  }
  if (code === "NO_ACTIVE_CHECKIN" || rawMsg.toLowerCase().includes("no active checkin") || rawMsg.toLowerCase().includes("not checked in")) {
    return "No active check-in found. You must check in before starting a break.";
  }
  if (code === "ALREADY_CHECKED_OUT" || rawMsg.toLowerCase().includes("already checked out")) {
    return "You have already checked out for today.";
  }
  if (code === "BREAK_ACTIVE" || rawMsg.toLowerCase().includes("break active") || rawMsg.toLowerCase().includes("already on break")) {
    return "A break is already in progress. Please end your current break first.";
  }
  if (code === "NO_ACTIVE_BREAK" || rawMsg.toLowerCase().includes("no active break") || rawMsg.toLowerCase().includes("not on break")) {
    return "No active break found to end.";
  }

  // HTTP Status Code mappings
  if (status === 401) {
    return "Session expired. Please log in again to continue.";
  }
  if (status === 403) {
    return rawMsg || "Access forbidden. You do not have permission to perform this action.";
  }
  if (status === 404) {
    return rawMsg || "Requested resource or attendance service is unavailable on the server.";
  }
  if (status === 409) {
    return rawMsg || "Attendance conflict. You may have already punched in or out for today.";
  }
  if (status === 422) {
    return rawMsg || "Validation error on submission. Please check captured image and coordinates.";
  }
  if (status === 429) {
    return "Too many verification requests. Please wait a moment before trying again.";
  }
  if (status && status >= 500) {
    return "Server error during verification. Please try again or contact HR support.";
  }

  if (rawMsg) return rawMsg;
  if (err?.message && typeof err.message === "string") return err.message;
  return "An unexpected error occurred during attendance processing.";
}

/**
 * Extracts a machine-readable error code from backend response if available.
 */
export function extractErrorCode(err: any): string | undefined {
  const resp = err?.response?.data || err?.data || (err?.detail ? err : undefined);
  if (resp && typeof resp === "object") {
    if (resp.detail && typeof resp.detail === "object" && resp.detail.code) {
      return resp.detail.code;
    }
    return resp.error_code || resp.code || resp.errorCode || undefined;
  }
  return err?.errorCode || undefined;
}

export function parseShiftDefinition(raw: string): EmployeeShiftInfo {
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

export function formatTimeStr(isoOrTime: string): string {
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

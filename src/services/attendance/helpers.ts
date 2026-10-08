import { EmployeeShiftInfo } from "./types";

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
  const resp = err?.response?.data || err?.data;
  const code = extractErrorCode(err);
  let rawMsg = "";

  if (resp) {
    if (typeof resp === "string") {
      rawMsg = resp;
    } else if (resp.detail) {
      if (typeof resp.detail === "string") {
        rawMsg = resp.detail;
      } else if (typeof resp.detail === "object") {
        if (typeof resp.detail.message === "string") rawMsg = resp.detail.message;
        else if (typeof resp.detail.msg === "string") rawMsg = resp.detail.msg;
      } else if (Array.isArray(resp.detail)) {
        rawMsg = resp.detail.map((d: any) => d.msg || d.message || JSON.stringify(d)).join("; ");
      }
    } else if (resp.message && typeof resp.message === "string") {
      rawMsg = resp.message;
    }
  }

  // Biometric specific mappings
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
  if (code === "LIVENESS_FAILED" || rawMsg.toLowerCase().includes("liveness")) {
    return "Liveness check failed. Please present your real face to the camera.";
  }
  if (code === "FACE_QUALITY_LOW" || rawMsg.toLowerCase().includes("blur") || rawMsg.toLowerCase().includes("quality")) {
    return "Image quality too low or blurred. Please hold steady in good ambient light.";
  }
  if (code === "OUTSIDE_GEOFENCE" || rawMsg.toLowerCase().includes("geofence") || rawMsg.toLowerCase().includes("outside")) {
    return "Outside office radius. Attendance verification must be completed inside the authorized office location.";
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
  const resp = err?.response?.data || err?.data;
  if (resp && typeof resp === "object") {
    if (resp.detail && typeof resp.detail === "object" && resp.detail.code) {
      return resp.detail.code;
    }
    return resp.error_code || resp.code || resp.errorCode || undefined;
  }
  return undefined;
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

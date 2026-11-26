import { api } from "@/api";
import { FaceAttendanceStatus, FaceStatusResponse, FaceEnrollResponse } from "./types";
import {
  extractObjectPayload,
  extractErrorCode,
  extractFaceApiError,
  parseTodayPunchData,
} from "./helpers";

// ─────────────────────────────────────────────────────────────
// Face Biometrics & Registration API
// ─────────────────────────────────────────────────────────────

/**
 * Get the authenticated employee's face attendance status.
 * Calls GET /api/v1/attendance/face/me (canonical endpoint).
 * Returns explicit enrollment status from backend response.
 */
export async function getFaceAttendanceStatus(): Promise<FaceAttendanceStatus> {
  try {
    const res: any = await api.get("attendance/face/me");
    const data = extractObjectPayload<any>(res);

    // Read explicit enrollment status from backend
    let faceRegistered: boolean = false;
    if (typeof data.is_face_enrolled === "boolean") faceRegistered = data.is_face_enrolled;
    else if (typeof data.isFaceEnrolled === "boolean") faceRegistered = data.isFaceEnrolled;
    else if (typeof data.face_registered === "boolean") faceRegistered = data.face_registered;
    else if (typeof data.faceRegistered === "boolean") faceRegistered = data.faceRegistered;
    else if (typeof data.is_enrolled === "boolean") faceRegistered = data.is_enrolled;
    else if (typeof data.isEnrolled === "boolean") faceRegistered = data.isEnrolled;
    else if (typeof data.face_enrolled === "boolean") faceRegistered = data.face_enrolled;
    else if (typeof data.faceEnrolled === "boolean") faceRegistered = data.faceEnrolled;
    else if (typeof data.enrolled === "boolean") faceRegistered = data.enrolled;
    else if (typeof data.has_face === "boolean") faceRegistered = data.has_face;
    else if (typeof data.hasFace === "boolean") faceRegistered = data.hasFace;
    else if (data.enrollment_status === "enrolled" || data.enrollmentStatus === "enrolled") faceRegistered = true;
    else if (data.enrollment_status === "not_enrolled" || data.enrollmentStatus === "not_enrolled") faceRegistered = false;
    else {
      // If no explicit flag, do NOT assume enrolled. Return faceRegistered: false.
      faceRegistered = false;
    }

    let enrolledAt =
      data.face_enrolled_at ||
      data.faceEnrolledAt ||
      data.enrolled_at ||
      data.enrolledAt ||
      null;

    const punchStatus = parseTodayPunchData(res);

    return {
      faceRegistered,
      checkedIn: punchStatus.checkedIn,
      checkedOut: punchStatus.checkedOut,
      checkInTime: punchStatus.checkInTime,
      checkOutTime: punchStatus.checkOutTime,
      workingHours: punchStatus.workingHours,
      message: data.message || "",
      raw: data,
      enrolled_at: enrolledAt,
      shift: data.shift,
      timezone: data.timezone,
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
        enrolled_at: null,
      };
    }

    // If the API responds with 404, check if it's about missing face record
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
        enrolled_at: null,
      };
    }

    // Re-throw for auth errors (401/403) and other unrecoverable issues
    throw err;
  }
}

/**
 * Get employee face enrollment status (dedicated endpoint).
 * Calls GET /api/v1/attendance/face-status (canonical endpoint).
 * This is the authoritative source for enrollment status.
 */
export async function getFaceStatus(): Promise<FaceStatusResponse> {
  try {
    const res: any = await api.get("attendance/face-status");
    const data = extractObjectPayload<any>(res);
    const isEnrolled = Boolean(
      data.is_enrolled ??
      data.isEnrolled ??
      data.is_face_enrolled ??
      data.isFaceEnrolled ??
      data.face_registered ??
      data.faceRegistered ??
      false
    );
    return {
      is_enrolled: isEnrolled,
      enrolled_at: data.enrolled_at || data.enrolledAt || data.face_enrolled_at || null,
      faceRegistered: isEnrolled,
    };
  } catch (err: any) {
    const errorCode = extractErrorCode(err);
    if (errorCode === "FACE_NOT_ENROLLED") {
      return { is_enrolled: false, enrolled_at: null, faceRegistered: false };
    }
    // Do NOT fall back to /attendance/face/me - use this endpoint as source of truth
    // If this endpoint fails, the enrollment status is UNKNOWN
    throw err;
  }
}

/**
 * Enroll / register the authenticated employee's face via Base64 snapshot.
 * Calls POST /api/v1/attendance/face-enroll (canonical endpoint).
 * Default allow_re_enroll: false to prevent accidental overwrites.
 * Must explicitly pass allowReEnroll: true after authorized confirmation.
 */
export async function enrollFace(
  imageBase64: string,
  allowReEnroll: boolean = false
): Promise<FaceEnrollResponse> {
  try {
    const res: any = await api.post("attendance/face-enroll", {
      image_base64: imageBase64,
      allow_re_enroll: allowReEnroll,
    });
    const data = extractObjectPayload<any>(res);
    return {
      success: res.success ?? true,
      message: res.message || data.message || (allowReEnroll ? "Face profile updated successfully!" : "Face successfully registered!"),
    };
  } catch (err: any) {
    const errorCode = extractErrorCode(err);
    const errorMsg = extractFaceApiError(err);
    const enrichedError: any = new Error(errorMsg);
    enrichedError.errorCode = errorCode;
    enrichedError.status = err?.response?.status || err?.status;
    enrichedError.response = err?.response;
    throw enrichedError;
  }
}

// ─────────────────────────────────────────────────────────────
// Re-export Check-In & Check-Out for unified face attendance access
// ─────────────────────────────────────────────────────────────
export { checkIn, checkOut } from "./punchGeofenceApi";

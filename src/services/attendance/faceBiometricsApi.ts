import { api } from "@/api";
import { FaceAttendanceStatus, FaceStatusResponse, FaceEnrollResponse } from "./types";
import { extractObjectPayload, extractErrorCode, extractFaceApiError } from "./helpers";

// ─────────────────────────────────────────────────────────────
// Face Biometrics & Registration API
// ─────────────────────────────────────────────────────────────

/**
 * Get the authenticated employee's face attendance status.
 * Calls GET /api/v1/attendance/face/me.
 * Infers face enrollment from the API response:
 * - A successful response means the employee is recognized (face registered).
 * - A specific error (e.g. FACE_NOT_ENROLLED) means no face enrolled.
 * - A 404 with no face enrollment indication means the endpoint isn't available.
 */
export async function getFaceAttendanceStatus(): Promise<FaceAttendanceStatus> {
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
}

/**
 * Get employee face enrollment status.
 * Calls GET /attendance/face-status (normalized to /api/v1/attendance/face-status).
 */
export async function getFaceStatus(): Promise<FaceStatusResponse> {
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
}

/**
 * Enroll / register the authenticated employee's face via Base64 snapshot.
 * Calls POST /attendance/face-enroll (normalized to /api/v1/attendance/face-enroll).
 */
export async function enrollFace(imageBase64: string): Promise<FaceEnrollResponse> {
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
}

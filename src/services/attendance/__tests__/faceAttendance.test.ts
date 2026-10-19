import { describe, it, expect, vi, beforeEach } from "vitest";
import { getFaceAttendanceStatus, getFaceStatus, enrollFace } from "../faceBiometricsApi";
import { extractFaceApiError, extractErrorCode } from "../helpers";
import { checkOut } from "../punchGeofenceApi";
import { api } from "@/api";
import apiInstance from "@/api/apiInstance";

vi.mock("@/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("@/api/apiInstance", () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe("Face Attendance Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("TASK 1: getFaceAttendanceStatus enrollment mapping", () => {
    it("maps is_face_enrolled: true to faceRegistered: true and populates enrolled_at", async () => {
      vi.mocked(api.get).mockResolvedValueOnce({
        success: true,
        data: {
          is_face_enrolled: true,
          face_enrolled_at: "2026-02-15T09:30:00Z",
          checked_in: true,
          checked_out: false,
          check_in_time: "2026-02-15T09:30:00Z",
          working_hours: 4.5,
        },
      });

      const res = await getFaceAttendanceStatus();
      expect(res.faceRegistered).toBe(true);
      expect(res.enrolled_at).toBe("2026-02-15T09:30:00Z");
      expect(res.checkedIn).toBe(true);
      expect(res.checkedOut).toBe(false);
      expect(api.get).toHaveBeenCalledWith("attendance/face/me");
    });

    it("maps is_face_enrolled: false to faceRegistered: false", async () => {
      vi.mocked(api.get).mockResolvedValueOnce({
        success: true,
        data: {
          is_face_enrolled: false,
          face_enrolled_at: null,
          checked_in: false,
          checked_out: false,
        },
      });

      const res = await getFaceAttendanceStatus();
      expect(res.faceRegistered).toBe(false);
      expect(res.enrolled_at).toBeNull();
      expect(res.checkedIn).toBe(false);
    });

    it("maps camelCase isFaceEnrolled: true/false correctly", async () => {
      vi.mocked(api.get).mockResolvedValueOnce({
        success: true,
        data: {
          isFaceEnrolled: false,
        },
      });

      const res = await getFaceAttendanceStatus();
      expect(res.faceRegistered).toBe(false);
    });

    it("when no known enrollment flag is present, calls getFaceStatus() as authoritative source", async () => {
      // 1. First call to attendance/face/me returns data with NO enrollment flag
      vi.mocked(api.get).mockResolvedValueOnce({
        success: true,
        data: {
          checked_in: false,
          checked_out: false,
          // no is_face_enrolled or other flag
        },
      });

      // 2. Second call to attendance/face-status returns enrolled true
      vi.mocked(api.get).mockResolvedValueOnce({
        success: true,
        data: {
          is_enrolled: true,
          enrolled_at: "2026-01-10T12:00:00Z",
        },
      });

      const res = await getFaceAttendanceStatus();
      expect(res.faceRegistered).toBe(true);
      expect(res.enrolled_at).toBe("2026-01-10T12:00:00Z");
      expect(api.get).toHaveBeenCalledWith("attendance/face/me");
      expect(api.get).toHaveBeenCalledWith("attendance/face-status");
    });

    it("when no known flag is present and getFaceStatus() returns false, returns faceRegistered: false (never true)", async () => {
      // 1. attendance/face/me without enrollment flag
      vi.mocked(api.get).mockResolvedValueOnce({
        success: true,
        data: {
          checked_in: false,
        },
      });

      // 2. attendance/face-status returns is_enrolled: false
      vi.mocked(api.get).mockResolvedValueOnce({
        success: true,
        data: {
          is_enrolled: false,
          enrolled_at: null,
        },
      });

      const res = await getFaceAttendanceStatus();
      expect(res.faceRegistered).toBe(false);
    });

    it("when no known flag is present and getFaceStatus() throws, returns faceRegistered: false (never true)", async () => {
      // 1. attendance/face/me without enrollment flag
      vi.mocked(api.get).mockResolvedValueOnce({
        success: true,
        data: {
          checked_in: false,
        },
      });

      // 2. attendance/face-status throws an error
      vi.mocked(api.get).mockRejectedValueOnce(new Error("Network error"));

      const res = await getFaceAttendanceStatus();
      expect(res.faceRegistered).toBe(false);
    });

    it("handles FACE_NOT_ENROLLED error code gracefully", async () => {
      const err: any = new Error("Biometric enrollment required");
      err.response = {
        status: 403,
        data: {
          detail: {
            code: "FACE_NOT_ENROLLED",
            message: "User has not registered biometric face profile",
          },
        },
      };

      vi.mocked(api.get).mockRejectedValueOnce(err);

      const res = await getFaceAttendanceStatus();
      expect(res.faceRegistered).toBe(false);
      expect(res.errorCode).toBe("FACE_NOT_ENROLLED");
      expect(res.checkedIn).toBe(false);
      expect(res.enrolled_at).toBeNull();
    });

    it("handles 404 error with missing face indication", async () => {
      const err: any = new Error("Not Found");
      err.response = {
        status: 404,
        data: {
          detail: {
            code: "NOT_FOUND",
            message: "No biometric face record found for employee",
          },
        },
      };

      vi.mocked(api.get).mockRejectedValueOnce(err);

      const res = await getFaceAttendanceStatus();
      expect(res.faceRegistered).toBe(false);
    });

    it("handles 404 error with no attendance record today (face registered)", async () => {
      const err: any = new Error("Not Found");
      err.response = {
        status: 404,
        data: {
          detail: {
            code: "NO_PUNCH_RECORD",
            message: "No attendance punch found for today",
          },
        },
      };

      vi.mocked(api.get).mockRejectedValueOnce(err);

      const res = await getFaceAttendanceStatus();
      expect(res.faceRegistered).toBe(true);
      expect(res.checkedIn).toBe(false);
    });
  });

  describe("TASK 2: extractFaceApiError error messages", () => {
    it("prefers specific backend detail.message for FACE_QUALITY_LOW", () => {
      const err = {
        response: {
          status: 422,
          data: {
            detail: {
              code: "FACE_QUALITY_LOW",
              message: "Image too dark. Please move to a brighter area.",
            },
          },
        },
      };

      const msg = extractFaceApiError(err);
      expect(msg).toBe("Image too dark. Please move to a brighter area.");
    });

    it("falls back to generic message for FACE_QUALITY_LOW when message is empty", () => {
      const err = {
        response: {
          status: 422,
          data: {
            detail: {
              code: "FACE_QUALITY_LOW",
              message: "",
            },
          },
        },
      };

      const msg = extractFaceApiError(err);
      expect(msg).toBe("Image quality too low or blurred. Please hold steady in good ambient light.");
    });

    it("prefers specific backend detail.message for LIVENESS_FAILED", () => {
      const err = {
        response: {
          status: 422,
          data: {
            detail: {
              code: "LIVENESS_FAILED",
              message: "Blink not detected or spoof detected.",
            },
          },
        },
      };

      const msg = extractFaceApiError(err);
      expect(msg).toBe("Blink not detected or spoof detected.");
    });

    it("falls back to generic message for LIVENESS_FAILED when message is empty", () => {
      const err = {
        response: {
          status: 422,
          data: {
            detail: {
              code: "LIVENESS_FAILED",
            },
          },
        },
      };

      const msg = extractFaceApiError(err);
      expect(msg).toBe("Liveness check failed. Please present your real face to the camera.");
    });

    it("maps LOCATION_REQUIRED to friendly message", () => {
      const err = {
        response: {
          status: 400,
          data: {
            detail: {
              code: "LOCATION_REQUIRED",
            },
          },
        },
      };

      const msg = extractFaceApiError(err);
      expect(msg).toContain("Location access is required");
    });

    it("maps OUTSIDE_GEOFENCE to friendly message", () => {
      const err = {
        response: {
          status: 403,
          data: {
            detail: {
              code: "OUTSIDE_GEOFENCE",
            },
          },
        },
      };

      const msg = extractFaceApiError(err);
      expect(msg).toContain("Outside office radius");
    });

    it("maps SUSPICIOUS_LOCATION to friendly message", () => {
      const err = {
        response: {
          status: 403,
          data: {
            detail: {
              code: "SUSPICIOUS_LOCATION",
            },
          },
        },
      };

      const msg = extractFaceApiError(err);
      expect(msg).toContain("Suspicious or mock location detected");
    });

    it("maps ALREADY_CHECKED_IN to friendly message", () => {
      const err = {
        response: {
          status: 409,
          data: {
            detail: {
              code: "ALREADY_CHECKED_IN",
            },
          },
        },
      };

      const msg = extractFaceApiError(err);
      expect(msg).toBe("You are already checked in for today.");
    });

    it("maps ALREADY_ENROLLED to friendly message", () => {
      const err = {
        response: {
          status: 409,
          data: {
            detail: {
              code: "ALREADY_ENROLLED",
            },
          },
        },
      };

      const msg = extractFaceApiError(err);
      expect(msg).toContain("Face profile is already registered");
    });

    it("maps EMPLOYEE_NOT_FOUND to friendly message", () => {
      const err = {
        response: {
          status: 404,
          data: {
            detail: {
              code: "EMPLOYEE_NOT_FOUND",
            },
          },
        },
      };

      const msg = extractFaceApiError(err);
      expect(msg).toBe("Employee profile not found. Please contact your HR administrator.");
    });

    it("maps TENANT_MISMATCH to friendly message", () => {
      const err = {
        response: {
          status: 403,
          data: {
            detail: {
              code: "TENANT_MISMATCH",
            },
          },
        },
      };

      const msg = extractFaceApiError(err);
      expect(msg).toBe("Organization mismatch. Please log in with your valid organization account.");
    });
  });

  describe("TASK 4: enrollFace allowReEnroll parameter", () => {
    it("sends allow_re_enroll: false by default", async () => {
      vi.mocked(api.post).mockResolvedValueOnce({
        success: true,
        message: "Face successfully registered!",
      });

      await enrollFace("base64-data");
      expect(api.post).toHaveBeenCalledWith("attendance/face-enroll", {
        image_base64: "base64-data",
        allow_re_enroll: false,
      });
    });

    it("sends allow_re_enroll: true when allowReEnroll = true is passed", async () => {
      vi.mocked(api.post).mockResolvedValueOnce({
        success: true,
        message: "Face profile updated successfully!",
      });

      await enrollFace("base64-data", true);
      expect(api.post).toHaveBeenCalledWith("attendance/face-enroll", {
        image_base64: "base64-data",
        allow_re_enroll: true,
      });
    });

    it("enriches error with errorCode and status on failure", async () => {
      const err: any = new Error("Already enrolled");
      err.response = {
        status: 409,
        data: {
          detail: {
            code: "ALREADY_ENROLLED",
            message: "Face is already enrolled",
          },
        },
      };
      vi.mocked(api.post).mockRejectedValueOnce(err);

      await expect(enrollFace("base64-data", false)).rejects.toMatchObject({
        errorCode: "ALREADY_ENROLLED",
        status: 409,
      });
    });
  });

  describe("TASK 5: checkOut appends notes", () => {
    it("appends notes when present in CheckOutPayload", async () => {
      vi.mocked(apiInstance.post).mockResolvedValueOnce({
        data: {
          id: "att-123",
          status: "checked-out",
          message: "Checked out successfully",
        },
      });

      await checkOut({
        image_base64: "data:image/jpeg;base64,abc123",
        latitude: 12.9716,
        longitude: 77.5946,
        accuracy: 10,
        notes: "Leaving early for dental appointment",
      });

      expect(apiInstance.post).toHaveBeenCalledTimes(1);
      const [url, formData] = vi.mocked(apiInstance.post).mock.calls[0];
      expect(url).toBe("/attendance/face/check-out");
      expect(formData instanceof FormData).toBe(true);
      expect((formData as FormData).get("notes")).toBe("Leaving early for dental appointment");
      expect((formData as FormData).get("latitude")).toBe("12.9716");
      expect((formData as FormData).get("longitude")).toBe("77.5946");
    });
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { profileApi } from "../profileApi";
import { authService } from "@/api/auth";
import { AUTH_ENDPOINTS } from "@/api/endpoints";

describe("Password Change API Integration", () => {
  let interceptedRequests: Array<{ method: string; url: string; body: any }> = [];

  beforeEach(() => {
    interceptedRequests = [];
  });

  it("sends POST to /api/v1/auth/change-password with only canonical backend fields", async () => {
    server.use(
      http.post("*/api/v1/auth/change-password", async ({ request }) => {
        const body = await request.json();
        interceptedRequests.push({
          method: request.method,
          url: request.url,
          body,
        });
        return HttpResponse.json({
          success: true,
          message: "Password changed successfully.",
          data: null,
          errors: null,
        });
      })
    );

    const result = await profileApi.changePassword({
      currentPassword: "OldPassword@123",
      newPassword: "NewPassword@123",
      confirmPassword: "NewPassword@123",
    });

    expect(result.success).toBe(true);
    expect(result.message).toBe("Password changed successfully.");
    expect(interceptedRequests.length).toBe(1);

    const req = interceptedRequests[0];
    expect(req.method).toBe("POST");
    expect(req.url).toContain("/api/v1/auth/change-password");

    // Canonical snake_case fields only
    expect(req.body).toEqual({
      current_password: "OldPassword@123",
      new_password: "NewPassword@123",
      confirm_password: "NewPassword@123",
    });

    // Verify duplicate camelCase fields are NOT present
    expect(req.body).not.toHaveProperty("currentPassword");
    expect(req.body).not.toHaveProperty("newPassword");
    expect(req.body).not.toHaveProperty("confirmPassword");
  });

  it("handles 400 bad request (same password / mismatch) with backend error message", async () => {
    server.use(
      http.post("*/api/v1/auth/change-password", () => {
        return HttpResponse.json(
          {
            success: false,
            message: "New password must be different from the current password.",
            data: null,
            errors: null,
          },
          { status: 400 }
        );
      })
    );

    await expect(
      profileApi.changePassword({
        currentPassword: "OldPassword@123",
        newPassword: "OldPassword@123",
        confirmPassword: "OldPassword@123",
      })
    ).rejects.toThrow("New password must be different from the current password.");
  });

  it("handles 401 unauthorized (incorrect current password)", async () => {
    server.use(
      http.post("*/api/v1/auth/change-password", () => {
        return HttpResponse.json(
          {
            success: false,
            message: "Current password is incorrect.",
            data: null,
            errors: null,
          },
          { status: 401 }
        );
      })
    );

    await expect(
      profileApi.changePassword({
        currentPassword: "WrongPassword@123",
        newPassword: "NewPassword@123",
        confirmPassword: "NewPassword@123",
      })
    ).rejects.toThrow("Current password is incorrect.");
  });

  it("handles 422 unprocessable entity (FastAPI validation errors)", async () => {
    server.use(
      http.post("*/api/v1/auth/change-password", () => {
        return HttpResponse.json(
          {
            detail: [
              {
                loc: ["body", "new_password"],
                msg: "Password must contain at least one uppercase letter",
                type: "value_error",
              },
            ],
          },
          { status: 422 }
        );
      })
    );

    await expect(
      profileApi.changePassword({
        currentPassword: "OldPassword@123",
        newPassword: "weakpassword123",
        confirmPassword: "weakpassword123",
      })
    ).rejects.toThrow("Password must contain at least one uppercase letter");
  });

  it("verifies authService.changePassword calls canonical POST /api/v1/auth/change-password", async () => {
    server.use(
      http.post("*/api/v1/auth/change-password", async ({ request }) => {
        const body = await request.json();
        interceptedRequests.push({
          method: request.method,
          url: request.url,
          body,
        });
        return HttpResponse.json({
          success: true,
          message: "Password changed successfully.",
        });
      })
    );

    const res = await authService.changePassword({
      current_password: "OldPassword@123",
      new_password: "NewPassword@123",
      confirm_password: "NewPassword@123",
    });

    expect(res).toBeDefined();
    expect(interceptedRequests.length).toBe(1);
    expect(interceptedRequests[0].method).toBe("POST");
    expect(interceptedRequests[0].url).toContain("/api/v1/auth/change-password");
  });
});

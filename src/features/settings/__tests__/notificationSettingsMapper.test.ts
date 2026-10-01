import { describe, it, expect, vi, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import {
  fetchNotificationSettings,
  updateNotificationSettings,
} from "../api";
import type { NotificationSettingsForm } from "../types";

describe("Notification Settings Mapper — Round-trip & 1:1 Key Mapping", () => {
  let interceptedPutBody: Record<string, unknown> | null = null;
  let interceptedPutMethod: string | null = null;

  beforeEach(() => {
    interceptedPutBody = null;
    interceptedPutMethod = null;
  });

  it("fetches settings and maps only the 5 real canonical backend keys", async () => {
    server.use(
      http.get("*/api/v1/settings/notifications", () => {
        return HttpResponse.json({
          success: true,
          data: {
            emailNotifications: true,
            inAppAlerts: false,
            slackAlerts: true,
            weeklyDigest: true,
            securityAlerts: false,
          },
        });
      }),
    );

    const form = await fetchNotificationSettings();

    // Verify 1:1 mapping with no cross-contamination (e.g. attendanceAlerts, leaveAlerts removed)
    expect(form).toEqual({
      emailNotifications: true,
      inAppAlerts: false,
      slackAlerts: true,
      weeklyDigest: true,
      securityAlerts: false,
    });
  });

  it("round-trips all settings through updateNotificationSettings using PUT /settings/notifications", async () => {
    server.use(
      http.put("*/api/v1/settings/notifications", async ({ request }) => {
        interceptedPutMethod = request.method;
        interceptedPutBody = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({
          success: true,
          data: interceptedPutBody,
        });
      }),
    );

    const testForm: NotificationSettingsForm = {
      emailNotifications: false,
      inAppAlerts: true,
      slackAlerts: false,
      weeklyDigest: true,
      securityAlerts: true,
    };

    await updateNotificationSettings(testForm);

    expect(interceptedPutMethod).toBe("PUT");
    // Ensure each key maps to itself 1:1 in the PUT payload
    expect(interceptedPutBody).toEqual({
      emailNotifications: false,
      inAppAlerts: true,
      slackAlerts: false,
      weeklyDigest: true,
      securityAlerts: true,
    });

    // Verify none of the old fake keys are sent to the backend
    expect(interceptedPutBody).not.toHaveProperty("attendanceAlerts");
    expect(interceptedPutBody).not.toHaveProperty("leaveAlerts");
    expect(interceptedPutBody).not.toHaveProperty("payrollAlerts");
    expect(interceptedPutBody).not.toHaveProperty("documentExpiryAlerts");
  });
});

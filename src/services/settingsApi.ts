import { api } from "@/api/client";

export interface NotificationSettings {
  emailNotifications: boolean;
  inAppAlerts: boolean;
  slackAlerts: boolean;
  weeklyDigest: boolean;
  securityAlerts: boolean;
}

export const settingsApi = {
  getSettings: async () => {
    return api.get("/settings");
  },
  updateSettings: async (data: Record<string, unknown>) => {
    return api.patch("/settings", data);
  },
  getNotificationSettings: async (): Promise<NotificationSettings> => {
    const res = await api.get<any>("/settings/notifications");
    const d = res?.data ?? res ?? {};
    return {
      emailNotifications: Boolean(d.emailNotifications ?? false),
      inAppAlerts: Boolean(d.inAppAlerts ?? false),
      slackAlerts: Boolean(d.slackAlerts ?? false),
      weeklyDigest: Boolean(d.weeklyDigest ?? false),
      securityAlerts: Boolean(d.securityAlerts ?? false),
    };
  },
  updateNotificationSettings: async (
    data: Partial<NotificationSettings>,
  ): Promise<NotificationSettings> => {
    const res = await api.patch<any>("/settings/notifications", data);
    const d = res?.data ?? res ?? {};
    return {
      emailNotifications: Boolean(d.emailNotifications ?? data.emailNotifications ?? false),
      inAppAlerts: Boolean(d.inAppAlerts ?? data.inAppAlerts ?? false),
      slackAlerts: Boolean(d.slackAlerts ?? data.slackAlerts ?? false),
      weeklyDigest: Boolean(d.weeklyDigest ?? data.weeklyDigest ?? false),
      securityAlerts: Boolean(d.securityAlerts ?? data.securityAlerts ?? false),
    };
  },
  testEmail: async (payload: { email: string }) => {
    return api.post("/settings/notifications/test-email", payload);
  },
};

export default settingsApi;

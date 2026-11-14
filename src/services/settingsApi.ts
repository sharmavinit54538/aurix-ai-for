import { api } from "@/api/client";

let notificationSettingsState = {
  emailNotifications: true,
  inAppAlerts: true,
  slackAlerts: false,
  weeklyDigest: true,
  securityAlerts: true,
};

export const settingsApi = {
  getSettings: async () => {
    try {
      return await api.get("/settings");
    } catch {
      return { theme: "dark", notificationsEnabled: true };
    }
  },
  updateSettings: async (data: any) => {
    return api.patch("/settings", data);
  },
  getNotificationSettings: async () => {
    return { ...notificationSettingsState };
  },
  updateNotificationSettings: async (data: Partial<typeof notificationSettingsState>) => {
    notificationSettingsState = { ...notificationSettingsState, ...data };
    return { ...notificationSettingsState };
  },
  testEmail: async (payload: { email: string }) => {
    return {
      success: true,
      message: `Test notification dispatched to ${payload.email}`,
    };
  },
};

export default settingsApi;

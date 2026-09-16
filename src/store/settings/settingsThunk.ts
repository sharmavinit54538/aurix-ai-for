import { createAsyncThunk } from "@reduxjs/toolkit";
import { parseApiError } from "@/api/utils";
import settingsApi from "@/services/settingsApi";
import type {
  AuditLogExportParams,
  AuditLogParams,
  AuditLogResponse,
  BillingData,
  BrandingSettings,
  CancelSubscriptionPayload,
  CompanySettings,
  GeneralSettings,
  IntegrationItem,
  NotificationSettings,
  PermissionItem,
  ProfileSettings,
  Role,
  SecuritySettings,
  SubscriptionPlan,
  TestEmailPayload,
  TestSmsPayload,
  UpgradeSubscriptionPayload,
} from "./settingsTypes";

export function getThunkErrorMessage(err: unknown, fallbackMessage: string): string {
  const parsed = parseApiError(err, fallbackMessage);
  const msg = parsed.message;

  if (!msg || msg === "An error occurred" || msg === "Network error" || msg === fallbackMessage) {
    switch (parsed.status) {
      case 400:
        return "Invalid request. Please check the entered information.";
      case 401:
        return "Authentication required. Please log in again.";
      case 403:
        return "Access forbidden. You do not have permission to modify these settings.";
      case 404:
        return "The requested settings resource was not found.";
      case 409:
        return "Settings conflict. Another update may have superseded this change.";
      case 422:
        return "Validation failed. Please verify that all required fields are correctly filled.";
      case 429:
        return "Too many requests. Please slow down and try again shortly.";
      case 500:
      default:
        return fallbackMessage || "Internal server error. Please try again later.";
    }
  }

  return msg;
}

export function downloadFileBlob(blob: Blob, defaultFilename = "audit-logs.csv") {
  if (typeof window === "undefined") return;
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", defaultFilename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

// ── Security Settings Thunks ────────────────────────────────────
export const fetchSecuritySettings = createAsyncThunk<
  SecuritySettings,
  void,
  { rejectValue: string }
>("settings/fetchSecuritySettings", async (_, thunkAPI) => {
  try {
    return await settingsApi.getSecuritySettings();
  } catch (err) {
    return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch security settings"));
  }
});

export const updateSecuritySettings = createAsyncThunk<
  SecuritySettings,
  Partial<SecuritySettings>,
  { rejectValue: string }
>("settings/updateSecuritySettings", async (payload, thunkAPI) => {
  try {
    return await settingsApi.updateSecuritySettings(payload);
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getThunkErrorMessage(err, "Failed to update security settings"),
    );
  }
});

// ── Notification Settings Thunks ────────────────────────────────
export const fetchNotificationSettings = createAsyncThunk<
  NotificationSettings,
  void,
  { rejectValue: string }
>("settings/fetchNotificationSettings", async (_, thunkAPI) => {
  try {
    return await settingsApi.getNotificationSettings();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getThunkErrorMessage(err, "Failed to fetch notification settings"),
    );
  }
});

export const updateNotificationSettings = createAsyncThunk<
  NotificationSettings,
  Partial<NotificationSettings>,
  { rejectValue: string }
>("settings/updateNotificationSettings", async (payload, thunkAPI) => {
  try {
    return await settingsApi.updateNotificationSettings(payload);
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getThunkErrorMessage(err, "Failed to update notification settings"),
    );
  }
});

// ── Branding Settings Thunks ────────────────────────────────────
export const fetchBrandingSettings = createAsyncThunk<
  BrandingSettings,
  void,
  { rejectValue: string }
>("settings/fetchBrandingSettings", async (_, thunkAPI) => {
  try {
    return await settingsApi.getBrandingSettings();
  } catch (err) {
    return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch branding settings"));
  }
});

export const updateBrandingSettings = createAsyncThunk<
  BrandingSettings,
  Partial<BrandingSettings>,
  { rejectValue: string }
>("settings/updateBrandingSettings", async (payload, thunkAPI) => {
  try {
    return await settingsApi.updateBrandingSettings(payload);
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getThunkErrorMessage(err, "Failed to update branding settings"),
    );
  }
});

// ── Integration Settings Thunks ─────────────────────────────────
export const fetchIntegrationSettings = createAsyncThunk<
  IntegrationItem[],
  void,
  { rejectValue: string }
>("settings/fetchIntegrationSettings", async (_, thunkAPI) => {
  try {
    return await settingsApi.getIntegrationSettings();
  } catch (err) {
    return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch integrations"));
  }
});

export const updateIntegrationSettings = createAsyncThunk<
  IntegrationItem[],
  { id?: string; connected?: boolean; integrations?: IntegrationItem[] } | Partial<IntegrationItem>,
  { rejectValue: string }
>("settings/updateIntegrationSettings", async (payload, thunkAPI) => {
  try {
    return await settingsApi.updateIntegrationSettings(payload);
  } catch (err) {
    return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to update integration"));
  }
});

// ── Billing Settings Thunks ─────────────────────────────────────
export const fetchBillingSettings = createAsyncThunk<BillingData, void, { rejectValue: string }>(
  "settings/fetchBillingSettings",
  async (_, thunkAPI) => {
    try {
      return await settingsApi.getBillingSettings();
    } catch (err) {
      return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch billing data"));
    }
  },
);

export const updateBillingSettings = createAsyncThunk<
  BillingData,
  Partial<BillingData> | Record<string, unknown>,
  { rejectValue: string }
>("settings/updateBillingSettings", async (payload, thunkAPI) => {
  try {
    return await settingsApi.updateBillingSettings(payload);
  } catch (err) {
    return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to update billing details"));
  }
});

// ── Subscription Plans & Lifecycle Thunks ───────────────────────
export const fetchSubscriptionPlans = createAsyncThunk<
  SubscriptionPlan[],
  void,
  { rejectValue: string }
>("settings/fetchSubscriptionPlans", async (_, thunkAPI) => {
  try {
    return await settingsApi.getSubscriptionPlans();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getThunkErrorMessage(err, "Failed to fetch subscription plans"),
    );
  }
});

export const upgradeSubscription = createAsyncThunk<
  BillingData,
  UpgradeSubscriptionPayload,
  { rejectValue: string }
>("settings/upgradeSubscription", async (payload, thunkAPI) => {
  try {
    return await settingsApi.upgradeSubscription(payload);
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getThunkErrorMessage(err, "Failed to upgrade subscription plan"),
    );
  }
});

export const cancelSubscription = createAsyncThunk<
  BillingData,
  CancelSubscriptionPayload | void,
  { rejectValue: string }
>("settings/cancelSubscription", async (payload, thunkAPI) => {
  try {
    return await settingsApi.cancelSubscription(payload || undefined);
  } catch (err) {
    return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to cancel subscription"));
  }
});

// ── Audit Logs Thunks ───────────────────────────────────────────
export const fetchAuditLogs = createAsyncThunk<
  AuditLogResponse,
  AuditLogParams | void,
  { rejectValue: string }
>("settings/fetchAuditLogs", async (params, thunkAPI) => {
  try {
    return await settingsApi.getAuditLogs(params || undefined);
  } catch (err) {
    return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch audit logs"));
  }
});

export const exportAuditLogs = createAsyncThunk<
  { success: boolean; filename: string },
  AuditLogExportParams | void,
  { rejectValue: string }
>("settings/exportAuditLogs", async (params, thunkAPI) => {
  try {
    const blob = await settingsApi.exportAuditLogs(params || undefined);
    const format = params && params.format ? params.format : "csv";
    const filename = `audit-logs-${new Date().toISOString().split("T")[0]}.${format}`;
    downloadFileBlob(blob, filename);
    return { success: true, filename };
  } catch (err) {
    return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to export audit logs"));
  }
});

// ── Email & SMS Configuration Test Thunks ───────────────────────
export const testEmailConfiguration = createAsyncThunk<
  { success: boolean; message: string },
  TestEmailPayload | void,
  { rejectValue: string }
>("settings/testEmailConfiguration", async (payload, thunkAPI) => {
  try {
    return await settingsApi.testEmail(payload || undefined);
  } catch (err) {
    return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to send test email"));
  }
});

export const testSmsConfiguration = createAsyncThunk<
  { success: boolean; message: string },
  TestSmsPayload | void,
  { rejectValue: string }
>("settings/testSmsConfiguration", async (payload, thunkAPI) => {
  try {
    return await settingsApi.testSms(payload || undefined);
  } catch (err) {
    return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to send test SMS"));
  }
});

// ── Legacy Aliases For Zero Regression ──────────────────────────
export const fetchSecurity = fetchSecuritySettings;
export const updateSecurity = updateSecuritySettings;
export const fetchNotifications = fetchNotificationSettings;
export const updateNotifications = updateNotificationSettings;
export const fetchIntegrations = fetchIntegrationSettings;
export const toggleIntegration = updateIntegrationSettings;
export const fetchBilling = fetchBillingSettings;
export const updateBilling = updateBillingSettings;

// ── General & Company Settings ──────────────────────────────────
export const fetchGeneralSettings = createAsyncThunk<
  GeneralSettings,
  void,
  { rejectValue: string }
>("settings/fetchGeneral", async (_, thunkAPI) => {
  try {
    return await settingsApi.getGeneralSettings();
  } catch (err) {
    return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch general settings"));
  }
});

export const updateGeneralSettings = createAsyncThunk<
  GeneralSettings,
  Partial<GeneralSettings>,
  { rejectValue: string }
>("settings/updateGeneral", async (payload, thunkAPI) => {
  try {
    return await settingsApi.updateGeneralSettings(payload);
  } catch (err) {
    return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to update general settings"));
  }
});

export const fetchCompanySettings = createAsyncThunk<
  CompanySettings,
  void,
  { rejectValue: string }
>("settings/fetchCompany", async (_, thunkAPI) => {
  try {
    return await settingsApi.getCompanySettings();
  } catch (err) {
    return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch company settings"));
  }
});

export const updateCompanySettings = createAsyncThunk<
  CompanySettings,
  Partial<CompanySettings>,
  { rejectValue: string }
>("settings/updateCompany", async (payload, thunkAPI) => {
  try {
    return await settingsApi.updateCompanySettings(payload);
  } catch (err) {
    return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to update company settings"));
  }
});

// ── Roles & Permissions ─────────────────────────────────────────
export const fetchRoles = createAsyncThunk<Role[], void, { rejectValue: string }>(
  "settings/fetchRoles",
  async (_, thunkAPI) => {
    try {
      return await settingsApi.getRoles();
    } catch (err) {
      return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch roles"));
    }
  },
);

export const createRole = createAsyncThunk<
  Role,
  { name: string; description?: string; permissions?: string[] },
  { rejectValue: string }
>("settings/createRole", async (payload, thunkAPI) => {
  try {
    return await settingsApi.createRole(payload);
  } catch (err) {
    return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to create role"));
  }
});

export const updateRole = createAsyncThunk<
  Role,
  { id: string; name: string; description?: string; permissions?: string[] },
  { rejectValue: string }
>("settings/updateRole", async ({ id, ...payload }, thunkAPI) => {
  try {
    return await settingsApi.updateRole(id, payload);
  } catch (err) {
    return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to update role"));
  }
});

export const deleteRole = createAsyncThunk<string, string, { rejectValue: string }>(
  "settings/deleteRole",
  async (id, thunkAPI) => {
    try {
      await settingsApi.deleteRole(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to delete role"));
    }
  },
);

export const fetchPermissions = createAsyncThunk<PermissionItem[], void, { rejectValue: string }>(
  "settings/fetchPermissions",
  async (_, thunkAPI) => {
    try {
      return await settingsApi.getPermissions();
    } catch (err) {
      return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch permissions"));
    }
  },
);

// ── Legacy Profile in Settings ──────────────────────────────────
export const fetchProfileSettings = createAsyncThunk<
  ProfileSettings,
  void,
  { rejectValue: string }
>("settings/fetchProfile", async (_, thunkAPI) => {
  try {
    return await settingsApi.getProfile();
  } catch (err) {
    return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to fetch user profile"));
  }
});

export const updateProfileSettings = createAsyncThunk<
  ProfileSettings,
  Partial<ProfileSettings>,
  { rejectValue: string }
>("settings/updateProfile", async (payload, thunkAPI) => {
  try {
    return await settingsApi.updateProfile(payload);
  } catch (err) {
    return thunkAPI.rejectWithValue(getThunkErrorMessage(err, "Failed to update profile settings"));
  }
});

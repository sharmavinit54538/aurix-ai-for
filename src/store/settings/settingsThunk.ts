import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/api/utils";
import settingsApi from "@/services/settingsApi";
import type {
  AuditLogResponse,
  BillingData,
  CompanySettings,
  GeneralSettings,
  IntegrationItem,
  NotificationSettings,
  PermissionItem,
  ProfileSettings,
  Role,
  SecuritySettings,
} from "./settingsTypes";

export const fetchGeneralSettings = createAsyncThunk<GeneralSettings, void, { rejectValue: string }>(
  "settings/fetchGeneral",
  async (_, thunkAPI) => {
    try {
      return await settingsApi.getGeneralSettings();
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to fetch general settings"));
    }
  },
);

export const updateGeneralSettings = createAsyncThunk<GeneralSettings, Partial<GeneralSettings>, { rejectValue: string }>(
  "settings/updateGeneral",
  async (payload, thunkAPI) => {
    try {
      return await settingsApi.updateGeneralSettings(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to update general settings"));
    }
  },
);

export const fetchCompanySettings = createAsyncThunk<CompanySettings, void, { rejectValue: string }>(
  "settings/fetchCompany",
  async (_, thunkAPI) => {
    try {
      return await settingsApi.getCompanySettings();
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to fetch company settings"));
    }
  },
);

export const updateCompanySettings = createAsyncThunk<CompanySettings, Partial<CompanySettings>, { rejectValue: string }>(
  "settings/updateCompany",
  async (payload, thunkAPI) => {
    try {
      return await settingsApi.updateCompanySettings(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to update company settings"));
    }
  },
);

export const fetchRoles = createAsyncThunk<Role[], void, { rejectValue: string }>(
  "settings/fetchRoles",
  async (_, thunkAPI) => {
    try {
      return await settingsApi.getRoles();
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to fetch roles"));
    }
  },
);

export const createRole = createAsyncThunk<Role, { name: string; description?: string; permissions?: string[] }, { rejectValue: string }>(
  "settings/createRole",
  async (payload, thunkAPI) => {
    try {
      return await settingsApi.createRole(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to create role"));
    }
  },
);

export const updateRole = createAsyncThunk<Role, { id: string; name: string; description?: string; permissions?: string[] }, { rejectValue: string }>(
  "settings/updateRole",
  async ({ id, ...payload }, thunkAPI) => {
    try {
      return await settingsApi.updateRole(id, payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to update role"));
    }
  },
);

export const deleteRole = createAsyncThunk<string, string, { rejectValue: string }>(
  "settings/deleteRole",
  async (id, thunkAPI) => {
    try {
      await settingsApi.deleteRole(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to delete role"));
    }
  },
);

export const fetchPermissions = createAsyncThunk<PermissionItem[], void, { rejectValue: string }>(
  "settings/fetchPermissions",
  async (_, thunkAPI) => {
    try {
      return await settingsApi.getPermissions();
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to fetch permissions"));
    }
  },
);

export const fetchAuditLogs = createAsyncThunk<
  AuditLogResponse,
  { page?: number; limit?: number; search?: string; module?: string } | void,
  { rejectValue: string }
>("settings/fetchAuditLogs", async (params, thunkAPI) => {
  try {
    return await settingsApi.getAuditLogs(params || undefined);
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to fetch audit logs"));
  }
});

export const fetchBilling = createAsyncThunk<BillingData, void, { rejectValue: string }>(
  "settings/fetchBilling",
  async (_, thunkAPI) => {
    try {
      return await settingsApi.getBilling();
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to fetch billing data"));
    }
  },
);

export const updateBilling = createAsyncThunk<BillingData, Record<string, unknown>, { rejectValue: string }>(
  "settings/updateBilling",
  async (payload, thunkAPI) => {
    try {
      return await settingsApi.updateBilling(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to update billing details"));
    }
  },
);

export const fetchSecurity = createAsyncThunk<SecuritySettings, void, { rejectValue: string }>(
  "settings/fetchSecurity",
  async (_, thunkAPI) => {
    try {
      return await settingsApi.getSecurity();
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to fetch security settings"));
    }
  },
);

export const updateSecurity = createAsyncThunk<SecuritySettings, Partial<SecuritySettings>, { rejectValue: string }>(
  "settings/updateSecurity",
  async (payload, thunkAPI) => {
    try {
      return await settingsApi.updateSecurity(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to update security settings"));
    }
  },
);

export const fetchNotifications = createAsyncThunk<NotificationSettings, void, { rejectValue: string }>(
  "settings/fetchNotifications",
  async (_, thunkAPI) => {
    try {
      return await settingsApi.getNotifications();
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to fetch notification preferences"));
    }
  },
);

export const updateNotifications = createAsyncThunk<NotificationSettings, Partial<NotificationSettings>, { rejectValue: string }>(
  "settings/updateNotifications",
  async (payload, thunkAPI) => {
    try {
      return await settingsApi.updateNotifications(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to update notification preferences"));
    }
  },
);

export const fetchIntegrations = createAsyncThunk<IntegrationItem[], void, { rejectValue: string }>(
  "settings/fetchIntegrations",
  async (_, thunkAPI) => {
    try {
      return await settingsApi.getIntegrations();
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to fetch integrations"));
    }
  },
);

export const toggleIntegration = createAsyncThunk<IntegrationItem[], { id: string; connected: boolean }, { rejectValue: string }>(
  "settings/toggleIntegration",
  async (payload, thunkAPI) => {
    try {
      return await settingsApi.toggleIntegration(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to toggle integration"));
    }
  },
);

export const fetchProfileSettings = createAsyncThunk<ProfileSettings, void, { rejectValue: string }>(
  "settings/fetchProfile",
  async (_, thunkAPI) => {
    try {
      return await settingsApi.getProfile();
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to fetch user profile"));
    }
  },
);

export const updateProfileSettings = createAsyncThunk<ProfileSettings, Partial<ProfileSettings>, { rejectValue: string }>(
  "settings/updateProfile",
  async (payload, thunkAPI) => {
    try {
      return await settingsApi.updateProfile(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err, "Failed to update profile settings"));
    }
  },
);

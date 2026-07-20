import { createSlice } from "@reduxjs/toolkit";
import type { SettingsState } from "./settingsTypes";
import {
  createRole,
  deleteRole,
  fetchAuditLogs,
  fetchBilling,
  fetchCompanySettings,
  fetchGeneralSettings,
  fetchIntegrations,
  fetchNotifications,
  fetchPermissions,
  fetchProfileSettings,
  fetchRoles,
  fetchSecurity,
  toggleIntegration,
  updateBilling,
  updateCompanySettings,
  updateGeneralSettings,
  updateNotifications,
  updateProfileSettings,
  updateRole,
  updateSecurity,
} from "./settingsThunk";

const initialState: SettingsState = {
  loading: false,
  submitting: false,
  error: null,
  lastUpdated: null,

  generalSettings: null,
  companySettings: null,
  roles: [],
  permissions: [],
  auditLogs: null,
  billing: null,
  security: null,
  notifications: null,
  integrations: [],
  profile: null,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetSettingsState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // General
    builder
      .addCase(fetchGeneralSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGeneralSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.generalSettings = action.payload;
      })
      .addCase(fetchGeneralSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch general settings";
      })
      .addCase(updateGeneralSettings.pending, (state) => {
        state.submitting = true;
      })
      .addCase(updateGeneralSettings.fulfilled, (state, action) => {
        state.submitting = false;
        state.generalSettings = action.payload;
      })
      .addCase(updateGeneralSettings.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? "Failed to update general settings";
      });

    // Company
    builder
      .addCase(fetchCompanySettings.fulfilled, (state, action) => {
        state.companySettings = action.payload;
      })
      .addCase(updateCompanySettings.fulfilled, (state, action) => {
        state.companySettings = action.payload;
      });

    // Roles & Permissions
    builder
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.roles.push(action.payload);
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        const index = state.roles.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.roles = state.roles.filter((r) => r.id !== action.payload);
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.permissions = action.payload;
      });

    // Audit Logs
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.auditLogs = action.payload;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch audit logs";
      });

    // Billing
    builder
      .addCase(fetchBilling.fulfilled, (state, action) => {
        state.billing = action.payload;
      })
      .addCase(updateBilling.fulfilled, (state, action) => {
        state.billing = action.payload;
      });

    // Security
    builder
      .addCase(fetchSecurity.fulfilled, (state, action) => {
        state.security = action.payload;
      })
      .addCase(updateSecurity.fulfilled, (state, action) => {
        state.security = action.payload;
      });

    // Notifications
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
      })
      .addCase(updateNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
      });

    // Integrations
    builder
      .addCase(fetchIntegrations.fulfilled, (state, action) => {
        state.integrations = action.payload;
      })
      .addCase(toggleIntegration.fulfilled, (state, action) => {
        state.integrations = action.payload;
      });

    // Profile
    builder
      .addCase(fetchProfileSettings.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(updateProfileSettings.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export const { clearError, resetSettingsState } = settingsSlice.actions;
export default settingsSlice.reducer;

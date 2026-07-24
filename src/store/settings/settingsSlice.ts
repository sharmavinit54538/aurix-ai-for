import { createSlice } from "@reduxjs/toolkit";
import { aurix } from "@/lib/aurix-store";
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
      .addCase(updateGeneralSettings.pending, (state, action) => {
        state.submitting = true;
        // Backup previous state before optimistic update
        state.lastUpdated = state.generalSettings as any;
        if (state.generalSettings) {
          state.generalSettings = { ...state.generalSettings, ...action.meta.arg };
        }
      })
      .addCase(updateGeneralSettings.fulfilled, (state, action) => {
        state.submitting = false;
        state.generalSettings = action.payload;
        state.lastUpdated = null;
      })
      .addCase(updateGeneralSettings.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? "Failed to update general settings";
        // Rollback on failure
        if (state.lastUpdated) {
          state.generalSettings = state.lastUpdated as any;
          state.lastUpdated = null;
        }
      });

    // Company
    builder
      .addCase(fetchCompanySettings.fulfilled, (state, action) => {
        state.companySettings = action.payload;
        if (action.payload?.name) {
          const currentWs = aurix.get();
          if (currentWs?.company) {
            aurix.set({ company: { ...currentWs.company, name: action.payload.name } });
          }
        }
      })
      .addCase(updateCompanySettings.pending, (state, action) => {
        state.submitting = true;
        state.lastUpdated = state.companySettings as any;
        // Optimistic update
        if (state.companySettings) {
          state.companySettings = { ...state.companySettings, ...action.meta.arg };
        }
      })
      .addCase(updateCompanySettings.fulfilled, (state, action) => {
        state.submitting = false;
        state.companySettings = action.payload;
        state.lastUpdated = null;
        if (action.payload?.name) {
          const currentWs = aurix.get();
          if (currentWs?.company) {
            aurix.set({ company: { ...currentWs.company, name: action.payload.name } });
          }
        }
      })
      .addCase(updateCompanySettings.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? "Failed to update company settings";
        // Rollback on failure
        if (state.lastUpdated) {
          state.companySettings = state.lastUpdated as any;
          state.lastUpdated = null;
        }
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
      .addCase(updateSecurity.pending, (state, action) => {
        state.submitting = true;
        state.lastUpdated = state.security as any;
        if (state.security) {
          state.security = { ...state.security, ...action.meta.arg };
        }
      })
      .addCase(updateSecurity.fulfilled, (state, action) => {
        state.submitting = false;
        state.security = action.payload;
        state.lastUpdated = null;
      })
      .addCase(updateSecurity.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? "Failed to update security settings";
        if (state.lastUpdated) {
          state.security = state.lastUpdated as any;
          state.lastUpdated = null;
        }
      });

    // Notifications
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
      })
      .addCase(updateNotifications.pending, (state, action) => {
        state.submitting = true;
        state.lastUpdated = state.notifications as any;
        if (state.notifications) {
          state.notifications = { ...state.notifications, ...action.meta.arg };
        }
      })
      .addCase(updateNotifications.fulfilled, (state, action) => {
        state.submitting = false;
        state.notifications = action.payload;
        state.lastUpdated = null;
      })
      .addCase(updateNotifications.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? "Failed to update notifications";
        if (state.lastUpdated) {
          state.notifications = state.lastUpdated as any;
          state.lastUpdated = null;
        }
      });

    // Integrations
    builder
      .addCase(fetchIntegrations.fulfilled, (state, action) => {
        state.integrations = action.payload;
      })
      .addCase(toggleIntegration.pending, (state, action) => {
        const { id, connected } = action.meta.arg;
        state.lastUpdated = JSON.parse(JSON.stringify(state.integrations));
        const integration = state.integrations.find(i => i.id === id);
        if (integration) {
          integration.connected = connected;
        }
      })
      .addCase(toggleIntegration.fulfilled, (state, action) => {
        state.integrations = action.payload;
        state.lastUpdated = null;
      })
      .addCase(toggleIntegration.rejected, (state, action) => {
        state.error = action.payload ?? "Failed to toggle integration";
        if (state.lastUpdated) {
          state.integrations = state.lastUpdated as any;
          state.lastUpdated = null;
        }
      });

    // Profile
    builder
      .addCase(fetchProfileSettings.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(updateProfileSettings.pending, (state, action) => {
        state.submitting = true;
        state.lastUpdated = state.profile as any;
        if (state.profile) {
          state.profile = { ...state.profile, ...action.meta.arg };
        }
      })
      .addCase(updateProfileSettings.fulfilled, (state, action) => {
        state.submitting = false;
        state.profile = action.payload;
        state.lastUpdated = null;
      })
      .addCase(updateProfileSettings.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload ?? "Failed to update profile";
        if (state.lastUpdated) {
          state.profile = state.lastUpdated as any;
          state.lastUpdated = null;
        }
      });
  },
});

export const { clearError, resetSettingsState } = settingsSlice.actions;
export default settingsSlice.reducer;

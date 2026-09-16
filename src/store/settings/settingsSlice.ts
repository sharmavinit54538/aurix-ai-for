import { createSlice } from "@reduxjs/toolkit";
import { aurix } from "@/lib/aurix-store";
import type { SettingsState } from "./settingsTypes";
import {
  cancelSubscription,
  createRole,
  deleteRole,
  exportAuditLogs,
  fetchAuditLogs,
  fetchBillingSettings,
  fetchBrandingSettings,
  fetchCompanySettings,
  fetchGeneralSettings,
  fetchIntegrationSettings,
  fetchNotificationSettings,
  fetchPermissions,
  fetchProfileSettings,
  fetchRoles,
  fetchSecuritySettings,
  fetchSubscriptionPlans,
  testEmailConfiguration,
  testSmsConfiguration,
  updateBillingSettings,
  updateBrandingSettings,
  updateCompanySettings,
  updateGeneralSettings,
  updateIntegrationSettings,
  updateNotificationSettings,
  updateProfileSettings,
  updateRole,
  updateSecuritySettings,
  upgradeSubscription,
} from "./settingsThunk";

const initialState: SettingsState = {
  loading: false,
  submitting: false,
  error: null,
  lastUpdated: null,

  security: null,
  notifications: null,
  branding: null,
  integrations: [],
  billing: null,
  subscriptionPlans: [],
  auditLogs: null,

  generalSettings: null,
  companySettings: null,
  roles: [],
  permissions: [],
  profile: null,

  operationLoading: {},
  operationErrors: {},
  operationSuccess: {},
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
      state.operationErrors = {};
    },
    clearOperationStatus(state, action: { payload: string }) {
      delete state.operationErrors[action.payload];
      delete state.operationLoading[action.payload];
      delete state.operationSuccess[action.payload];
    },
    resetSettingsState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // ── Security Settings ──────────────────────────────────────────
    builder
      .addCase(fetchSecuritySettings.pending, (state) => {
        state.loading = true;
        state.operationLoading.security = true;
        state.operationErrors.security = null;
      })
      .addCase(fetchSecuritySettings.fulfilled, (state, action) => {
        state.loading = false;
        state.operationLoading.security = false;
        state.security = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchSecuritySettings.rejected, (state, action) => {
        state.loading = false;
        state.operationLoading.security = false;
        const msg = action.payload ?? "Failed to fetch security settings";
        state.error = msg;
        state.operationErrors.security = msg;
      })
      .addCase(updateSecuritySettings.pending, (state) => {
        state.submitting = true;
        state.operationLoading.updateSecurity = true;
        state.operationErrors.updateSecurity = null;
        state.operationSuccess.updateSecurity = false;
      })
      .addCase(updateSecuritySettings.fulfilled, (state, action) => {
        state.submitting = false;
        state.operationLoading.updateSecurity = false;
        state.security = action.payload;
        state.operationSuccess.updateSecurity = true;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateSecuritySettings.rejected, (state, action) => {
        state.submitting = false;
        state.operationLoading.updateSecurity = false;
        const msg = action.payload ?? "Failed to update security settings";
        state.error = msg;
        state.operationErrors.updateSecurity = msg;
      });

    // ── Notification Settings ──────────────────────────────────────
    builder
      .addCase(fetchNotificationSettings.pending, (state) => {
        state.loading = true;
        state.operationLoading.notifications = true;
        state.operationErrors.notifications = null;
      })
      .addCase(fetchNotificationSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.operationLoading.notifications = false;
        state.notifications = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchNotificationSettings.rejected, (state, action) => {
        state.loading = false;
        state.operationLoading.notifications = false;
        const msg = action.payload ?? "Failed to fetch notification preferences";
        state.error = msg;
        state.operationErrors.notifications = msg;
      })
      .addCase(updateNotificationSettings.pending, (state) => {
        state.submitting = true;
        state.operationLoading.updateNotifications = true;
        state.operationErrors.updateNotifications = null;
        state.operationSuccess.updateNotifications = false;
      })
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.submitting = false;
        state.operationLoading.updateNotifications = false;
        state.notifications = action.payload;
        state.operationSuccess.updateNotifications = true;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.submitting = false;
        state.operationLoading.updateNotifications = false;
        const msg = action.payload ?? "Failed to update notification preferences";
        state.error = msg;
        state.operationErrors.updateNotifications = msg;
      });

    // ── Branding Settings ──────────────────────────────────────────
    builder
      .addCase(fetchBrandingSettings.pending, (state) => {
        state.operationLoading.branding = true;
        state.operationErrors.branding = null;
      })
      .addCase(fetchBrandingSettings.fulfilled, (state, action) => {
        state.operationLoading.branding = false;
        state.branding = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchBrandingSettings.rejected, (state, action) => {
        state.operationLoading.branding = false;
        const msg = action.payload ?? "Failed to fetch branding settings";
        state.operationErrors.branding = msg;
      })
      .addCase(updateBrandingSettings.pending, (state) => {
        state.submitting = true;
        state.operationLoading.updateBranding = true;
        state.operationErrors.updateBranding = null;
        state.operationSuccess.updateBranding = false;
      })
      .addCase(updateBrandingSettings.fulfilled, (state, action) => {
        state.submitting = false;
        state.operationLoading.updateBranding = false;
        state.branding = action.payload;
        state.operationSuccess.updateBranding = true;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updateBrandingSettings.rejected, (state, action) => {
        state.submitting = false;
        state.operationLoading.updateBranding = false;
        const msg = action.payload ?? "Failed to update branding settings";
        state.operationErrors.updateBranding = msg;
      });

    // ── Integration Settings ───────────────────────────────────────
    builder
      .addCase(fetchIntegrationSettings.pending, (state) => {
        state.operationLoading.integrations = true;
        state.operationErrors.integrations = null;
      })
      .addCase(fetchIntegrationSettings.fulfilled, (state, action) => {
        state.operationLoading.integrations = false;
        state.integrations = action.payload;
      })
      .addCase(fetchIntegrationSettings.rejected, (state, action) => {
        state.operationLoading.integrations = false;
        const msg = action.payload ?? "Failed to fetch integrations";
        state.operationErrors.integrations = msg;
      })
      .addCase(updateIntegrationSettings.pending, (state) => {
        state.submitting = true;
        state.operationLoading.updateIntegration = true;
        state.operationErrors.updateIntegration = null;
      })
      .addCase(updateIntegrationSettings.fulfilled, (state, action) => {
        state.submitting = false;
        state.operationLoading.updateIntegration = false;
        state.integrations = action.payload;
      })
      .addCase(updateIntegrationSettings.rejected, (state, action) => {
        state.submitting = false;
        state.operationLoading.updateIntegration = false;
        const msg = action.payload ?? "Failed to update integration";
        state.operationErrors.updateIntegration = msg;
      });

    // ── Billing Settings & Subscription Plans ──────────────────────
    builder
      .addCase(fetchBillingSettings.pending, (state) => {
        state.loading = true;
        state.operationLoading.billing = true;
        state.operationErrors.billing = null;
      })
      .addCase(fetchBillingSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.operationLoading.billing = false;
        state.billing = action.payload;
      })
      .addCase(fetchBillingSettings.rejected, (state, action) => {
        state.loading = false;
        state.operationLoading.billing = false;
        const msg = action.payload ?? "Failed to fetch billing data";
        state.operationErrors.billing = msg;
      })
      .addCase(updateBillingSettings.pending, (state) => {
        state.submitting = true;
        state.operationLoading.updateBilling = true;
        state.operationErrors.updateBilling = null;
      })
      .addCase(updateBillingSettings.fulfilled, (state, action) => {
        state.submitting = false;
        state.operationLoading.updateBilling = false;
        state.billing = action.payload;
      })
      .addCase(updateBillingSettings.rejected, (state, action) => {
        state.submitting = false;
        state.operationLoading.updateBilling = false;
        const msg = action.payload ?? "Failed to update billing details";
        state.operationErrors.updateBilling = msg;
      })
      .addCase(fetchSubscriptionPlans.pending, (state) => {
        state.operationLoading.subscriptionPlans = true;
        state.operationErrors.subscriptionPlans = null;
      })
      .addCase(fetchSubscriptionPlans.fulfilled, (state, action) => {
        state.operationLoading.subscriptionPlans = false;
        state.subscriptionPlans = action.payload;
      })
      .addCase(fetchSubscriptionPlans.rejected, (state, action) => {
        state.operationLoading.subscriptionPlans = false;
        const msg = action.payload ?? "Failed to fetch subscription plans";
        state.operationErrors.subscriptionPlans = msg;
      })
      .addCase(upgradeSubscription.pending, (state) => {
        state.submitting = true;
        state.operationLoading.upgradeSubscription = true;
        state.operationErrors.upgradeSubscription = null;
      })
      .addCase(upgradeSubscription.fulfilled, (state, action) => {
        state.submitting = false;
        state.operationLoading.upgradeSubscription = false;
        state.billing = action.payload;
      })
      .addCase(upgradeSubscription.rejected, (state, action) => {
        state.submitting = false;
        state.operationLoading.upgradeSubscription = false;
        const msg = action.payload ?? "Failed to upgrade subscription";
        state.operationErrors.upgradeSubscription = msg;
      })
      .addCase(cancelSubscription.pending, (state) => {
        state.submitting = true;
        state.operationLoading.cancelSubscription = true;
        state.operationErrors.cancelSubscription = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.submitting = false;
        state.operationLoading.cancelSubscription = false;
        state.billing = action.payload;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.submitting = false;
        state.operationLoading.cancelSubscription = false;
        const msg = action.payload ?? "Failed to cancel subscription";
        state.operationErrors.cancelSubscription = msg;
      });

    // ── Audit Logs ─────────────────────────────────────────────────
    builder
      .addCase(fetchAuditLogs.pending, (state) => {
        state.loading = true;
        state.operationLoading.auditLogs = true;
        state.operationErrors.auditLogs = null;
      })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.operationLoading.auditLogs = false;
        state.auditLogs = action.payload;
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => {
        state.loading = false;
        state.operationLoading.auditLogs = false;
        const msg = action.payload ?? "Failed to fetch audit logs";
        state.operationErrors.auditLogs = msg;
      })
      .addCase(exportAuditLogs.pending, (state) => {
        state.operationLoading.exportAuditLogs = true;
        state.operationErrors.exportAuditLogs = null;
      })
      .addCase(exportAuditLogs.fulfilled, (state) => {
        state.operationLoading.exportAuditLogs = false;
        state.operationSuccess.exportAuditLogs = true;
      })
      .addCase(exportAuditLogs.rejected, (state, action) => {
        state.operationLoading.exportAuditLogs = false;
        const msg = action.payload ?? "Failed to export audit logs";
        state.operationErrors.exportAuditLogs = msg;
      });

    // ── Email & SMS Configuration Tests ─────────────────────────────
    builder
      .addCase(testEmailConfiguration.pending, (state) => {
        state.operationLoading.testEmail = true;
        state.operationErrors.testEmail = null;
        state.operationSuccess.testEmail = false;
      })
      .addCase(testEmailConfiguration.fulfilled, (state) => {
        state.operationLoading.testEmail = false;
        state.operationSuccess.testEmail = true;
      })
      .addCase(testEmailConfiguration.rejected, (state, action) => {
        state.operationLoading.testEmail = false;
        const msg = action.payload ?? "Failed to send test email";
        state.operationErrors.testEmail = msg;
      })
      .addCase(testSmsConfiguration.pending, (state) => {
        state.operationLoading.testSms = true;
        state.operationErrors.testSms = null;
        state.operationSuccess.testSms = false;
      })
      .addCase(testSmsConfiguration.fulfilled, (state) => {
        state.operationLoading.testSms = false;
        state.operationSuccess.testSms = true;
      })
      .addCase(testSmsConfiguration.rejected, (state, action) => {
        state.operationLoading.testSms = false;
        const msg = action.payload ?? "Failed to send test SMS";
        state.operationErrors.testSms = msg;
      });

    // ── General & Company Settings ──────────────────────────────────
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
      })
      .addCase(fetchCompanySettings.fulfilled, (state, action) => {
        state.companySettings = action.payload;
        if (action.payload?.name) {
          const currentWs = aurix.get();
          if (currentWs?.company) {
            aurix.set({ company: { ...currentWs.company, name: action.payload.name } });
          }
        }
      })
      .addCase(updateCompanySettings.fulfilled, (state, action) => {
        state.companySettings = action.payload;
        if (action.payload?.name) {
          const currentWs = aurix.get();
          if (currentWs?.company) {
            aurix.set({ company: { ...currentWs.company, name: action.payload.name } });
          }
        }
      });

    // ── Roles & Permissions ─────────────────────────────────────────
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

    // ── Legacy Profile in Settings ──────────────────────────────────
    builder
      .addCase(fetchProfileSettings.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(updateProfileSettings.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export const { clearError, clearOperationStatus, resetSettingsState } = settingsSlice.actions;
export default settingsSlice.reducer;

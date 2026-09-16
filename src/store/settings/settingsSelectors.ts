import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

export const selectSettingsState = (state: RootState) => state.settings;

export const selectSettingsLoading = createSelector(
  [selectSettingsState],
  (state) => state?.loading ?? false,
);

export const selectSettingsSubmitting = createSelector(
  [selectSettingsState],
  (state) => state?.submitting ?? false,
);

export const selectSettingsError = createSelector(
  [selectSettingsState],
  (state) => state?.error ?? null,
);

export const selectSettingsErrors = createSelector(
  [selectSettingsState],
  (state) => state?.operationErrors ?? {},
);

export const selectSettingsOperationLoading = createSelector(
  [selectSettingsState],
  (state) => state?.operationLoading ?? {},
);

export const selectSettingsOperationSuccess = createSelector(
  [selectSettingsState],
  (state) => state?.operationSuccess ?? {},
);

export const selectSecuritySettings = createSelector(
  [selectSettingsState],
  (state) => state?.security ?? null,
);

export const selectNotificationSettings = createSelector(
  [selectSettingsState],
  (state) => state?.notifications ?? null,
);

export const selectBrandingSettings = createSelector(
  [selectSettingsState],
  (state) => state?.branding ?? null,
);

export const selectIntegrationSettings = createSelector(
  [selectSettingsState],
  (state) => state?.integrations ?? [],
);

export const selectIntegrations = selectIntegrationSettings;

export const selectBillingSettings = createSelector(
  [selectSettingsState],
  (state) => state?.billing ?? null,
);

export const selectBillingData = selectBillingSettings;

export const selectSubscriptionPlans = createSelector(
  [selectSettingsState],
  (state) => state?.subscriptionPlans ?? [],
);

export const selectAuditLogs = createSelector(
  [selectSettingsState],
  (state) => state?.auditLogs ?? null,
);

export const selectGeneralSettings = createSelector(
  [selectSettingsState],
  (state) => state?.generalSettings ?? null,
);

export const selectCompanySettings = createSelector(
  [selectSettingsState],
  (state) => state?.companySettings ?? null,
);

export const selectRoles = createSelector(
  [selectSettingsState],
  (state) => state?.roles ?? [],
);

export const selectPermissions = createSelector(
  [selectSettingsState],
  (state) => state?.permissions ?? [],
);

export const selectProfileSettings = createSelector(
  [selectSettingsState],
  (state) => state?.profile ?? null,
);

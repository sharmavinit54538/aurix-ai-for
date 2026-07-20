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

export const selectAuditLogs = createSelector(
  [selectSettingsState],
  (state) => state?.auditLogs ?? null,
);

export const selectBillingData = createSelector(
  [selectSettingsState],
  (state) => state?.billing ?? null,
);

export const selectSecuritySettings = createSelector(
  [selectSettingsState],
  (state) => state?.security ?? null,
);

export const selectNotificationSettings = createSelector(
  [selectSettingsState],
  (state) => state?.notifications ?? null,
);

export const selectIntegrations = createSelector(
  [selectSettingsState],
  (state) => state?.integrations ?? [],
);

export const selectProfileSettings = createSelector(
  [selectSettingsState],
  (state) => state?.profile ?? null,
);

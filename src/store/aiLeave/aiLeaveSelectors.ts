import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

export const selectAILeaveState = (state: RootState) => state.aiLeave;

export const selectAILeaveLoading = createSelector(
  [selectAILeaveState],
  (state) => state?.loading ?? false,
);

export const selectAILeaveError = createSelector(
  [selectAILeaveState],
  (state) => state?.error ?? null,
);

export const selectAILeaveLastUpdated = createSelector(
  [selectAILeaveState],
  (state) => state?.lastUpdated ?? null,
);

export const selectAILeaveActionLoading = createSelector(
  [selectAILeaveState],
  (state) => state?.actionLoading ?? false,
);

export const selectAILeaveActionError = createSelector(
  [selectAILeaveState],
  (state) => state?.actionError ?? null,
);

export const selectAILeaveDashboard = createSelector(
  [selectAILeaveState],
  (state) => state?.dashboard ?? null,
);

export const selectAILeaveForecast = createSelector(
  [selectAILeaveState],
  (state) => state?.forecast ?? null,
);

export const selectAILeaveDistribution = createSelector(
  [selectAILeaveState],
  (state) => state?.distribution ?? null,
);

export const selectAILeaveApprovalSuggestions = createSelector(
  [selectAILeaveState],
  (state) => state?.approvalSuggestions ?? { total: null, items: [] },
);

export const selectAILeaveConflicts = createSelector(
  [selectAILeaveState],
  (state) => state?.conflicts ?? { total: null, items: [] },
);

export const selectAILeaveTeamAvailability = createSelector(
  [selectAILeaveState],
  (state) => state?.teamAvailability ?? null,
);

export const selectAILeaveTrends = createSelector(
  [selectAILeaveState],
  (state) => state?.trends ?? null,
);

export const selectAILeaveAnalytics = createSelector(
  [selectAILeaveState],
  (state) => state?.analytics ?? null,
);

export const selectAILeaveSelectedRequest = createSelector(
  [selectAILeaveState],
  (state) => state?.selectedRequest ?? null,
);

import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

export const selectLeaveAssistantState = (state: RootState) => state.leaveAssistant;

export const selectLeaveAssistantLoading = createSelector(
  [selectLeaveAssistantState],
  (state) => state?.loading ?? false,
);

export const selectLeaveAssistantError = createSelector(
  [selectLeaveAssistantState],
  (state) => state?.error ?? null,
);

export const selectLeaveAssistantLastUpdated = createSelector(
  [selectLeaveAssistantState],
  (state) => state?.lastUpdated ?? null,
);

export const selectLeaveAssistantSummary = createSelector(
  [selectLeaveAssistantState],
  (state) => state?.summary ?? null,
);

export const selectLeaveAssistantKPIs = createSelector(
  [selectLeaveAssistantState],
  (state) => (Array.isArray(state?.kpi) ? state.kpi : []),
);

export const selectLeaveAssistantCharts = createSelector(
  [selectLeaveAssistantState],
  (state) => state?.charts ?? null,
);

export const selectLeaveAssistantForecast = createSelector(
  [selectLeaveAssistantCharts],
  (charts) => (Array.isArray(charts?.leaveForecast) ? charts.leaveForecast : []),
);

export const selectLeaveAssistantDistribution = createSelector(
  [selectLeaveAssistantCharts],
  (charts) => (Array.isArray(charts?.leaveTypeDistribution) ? charts.leaveTypeDistribution : []),
);

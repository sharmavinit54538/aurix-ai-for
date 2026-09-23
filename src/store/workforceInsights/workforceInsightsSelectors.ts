import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

export const selectWorkforceInsightsState = (state: RootState) => (state as any).workforceInsights;

export const selectWorkforceInsightsLoading = createSelector(
  [selectWorkforceInsightsState],
  (state) => state?.loading ?? false,
);

export const selectWorkforceInsightsError = createSelector(
  [selectWorkforceInsightsState],
  (state) => state?.error ?? null,
);

export const selectWorkforceInsightsLastUpdated = createSelector(
  [selectWorkforceInsightsState],
  (state) => state?.lastUpdated ?? null,
);

export const selectWorkforceInsightsSummary = createSelector(
  [selectWorkforceInsightsState],
  (state) => state?.summary ?? null,
);

export const selectWorkforceInsightsKPIs = createSelector(
  [selectWorkforceInsightsState],
  (state) => (Array.isArray(state?.kpi) ? state.kpi : []),
);

export const selectWorkforceInsightsCharts = createSelector(
  [selectWorkforceInsightsState],
  (state) => state?.charts ?? null,
);

export const selectWorkforceInsightsHeadcountTrends = createSelector(
  [selectWorkforceInsightsCharts],
  (charts) => (Array.isArray(charts?.headcountTrends) ? charts.headcountTrends : []),
);

export const selectWorkforceInsightsDepartmentComparison = createSelector(
  [selectWorkforceInsightsCharts],
  (charts) => (Array.isArray(charts?.departmentComparison) ? charts.departmentComparison : []),
);

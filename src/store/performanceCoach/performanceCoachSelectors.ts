import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

export const selectPerformanceCoachState = (state: RootState) => state.performanceCoach;

export const selectPerformanceCoachLoading = createSelector(
  [selectPerformanceCoachState],
  (state) => state?.loading ?? false,
);

export const selectPerformanceCoachError = createSelector(
  [selectPerformanceCoachState],
  (state) => state?.error ?? null,
);

export const selectPerformanceCoachLastUpdated = createSelector(
  [selectPerformanceCoachState],
  (state) => state?.lastUpdated ?? null,
);

export const selectPerformanceCoachSummary = createSelector(
  [selectPerformanceCoachState],
  (state) => state?.summary ?? null,
);

export const selectPerformanceCoachKPIs = createSelector(
  [selectPerformanceCoachState],
  (state) => (Array.isArray(state?.kpi) ? state.kpi : []),
);

export const selectPerformanceCoachCharts = createSelector(
  [selectPerformanceCoachState],
  (state) => state?.charts ?? null,
);

export const selectPerformanceCoachTrend = createSelector(
  [selectPerformanceCoachCharts],
  (charts) => (Array.isArray(charts?.performanceTrend) ? charts.performanceTrend : []),
);

export const selectPerformanceCoachAttainment = createSelector(
  [selectPerformanceCoachCharts],
  (charts) => (Array.isArray(charts?.kpiAttainment) ? charts.kpiAttainment : []),
);

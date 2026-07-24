import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

export const selectAIPerformanceState = (state: RootState) => state.aiPerformance;

export const selectAIPerformanceLoading = createSelector(
  [selectAIPerformanceState],
  (state) => state?.loading ?? false,
);

export const selectAIPerformanceError = createSelector(
  [selectAIPerformanceState],
  (state) => state?.error ?? null,
);

export const selectAIPerformanceLastUpdated = createSelector(
  [selectAIPerformanceState],
  (state) => state?.lastUpdated ?? null,
);

export const selectAIPerformanceActionLoading = createSelector(
  [selectAIPerformanceState],
  (state) => state?.actionLoading ?? false,
);

export const selectAIPerformanceActionError = createSelector(
  [selectAIPerformanceState],
  (state) => state?.actionError ?? null,
);

export const selectAIPerformanceDashboard = createSelector(
  [selectAIPerformanceState],
  (state) => state?.dashboard ?? null,
);

export const selectAIPerformanceTrends = createSelector(
  [selectAIPerformanceState],
  (state) => state?.trends ?? null,
);

export const selectAIPerformanceKpiAttainment = createSelector(
  [selectAIPerformanceState],
  (state) => state?.kpiAttainment ?? null,
);

export const selectAIPerformanceTopPerformers = createSelector(
  [selectAIPerformanceState],
  (state) =>
    state?.topPerformers ?? { total: null, employees: [], teams: [], departments: [], managers: [] },
);

export const selectAIPerformanceSkillGaps = createSelector(
  [selectAIPerformanceState],
  (state) => state?.skillGaps ?? { total: null, items: [] },
);

export const selectAIPerformancePromotions = createSelector(
  [selectAIPerformanceState],
  (state) => state?.promotions ?? { total: null, items: [] },
);

export const selectAIPerformanceCoaching = createSelector(
  [selectAIPerformanceState],
  (state) => state?.coaching ?? { total: null, items: [] },
);

export const selectAIPerformanceAnalytics = createSelector(
  [selectAIPerformanceState],
  (state) => state?.analytics ?? null,
);

export const selectAIPerformanceSelectedEmployee = createSelector(
  [selectAIPerformanceState],
  (state) => state?.selectedEmployee ?? null,
);

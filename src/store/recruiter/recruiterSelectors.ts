import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

export const selectRecruiterState = (state: RootState) => (state as any).aiRecruiter;

export const selectRecruiterLoading = createSelector(
  [selectRecruiterState],
  (state) => state?.loading ?? false,
);

export const selectRecruiterError = createSelector(
  [selectRecruiterState],
  (state) => state?.error ?? null,
);

export const selectRecruiterLastUpdated = createSelector(
  [selectRecruiterState],
  (state) => state?.lastUpdated ?? null,
);

export const selectRecruiterSummary = createSelector(
  [selectRecruiterState],
  (state) => state?.summary ?? null,
);

export const selectRecruiterKPIs = createSelector(
  [selectRecruiterState],
  (state) => (Array.isArray(state?.kpi) ? state.kpi : []),
);

export const selectRecruiterCharts = createSelector(
  [selectRecruiterState],
  (state) => state?.charts ?? null,
);

export const selectRecruiterCandidateFunnel = createSelector(
  [selectRecruiterCharts],
  (charts) => (Array.isArray(charts?.candidateFunnel) ? charts.candidateFunnel : []),
);

export const selectRecruiterJdMatchDistribution = createSelector(
  [selectRecruiterCharts],
  (charts) => (Array.isArray(charts?.jdMatchDistribution) ? charts.jdMatchDistribution : []),
);

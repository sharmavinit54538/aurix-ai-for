import type { RootState } from "@/redux/store";

export const selectPerformanceCoachLoading = (state: RootState) => state.performanceCoach?.loading ?? false;
export const selectPerformanceCoachError = (state: RootState) => state.performanceCoach?.error ?? null;
export const selectPerformanceCoachKPIs = (state: RootState) => state.performanceCoach?.data?.kpis ?? [];
export const selectPerformanceCoachSummary = (state: RootState) => state.performanceCoach?.data?.summary ?? {};
export const selectPerformanceCoachProgressTrend = (state: RootState) => state.performanceCoach?.data?.progressTrend ?? [];
export const selectPerformanceCoachTrend = (state: RootState) => state.performanceCoach?.data?.progressTrend ?? [];
export const selectPerformanceCoachAttainment = (state: RootState) => state.performanceCoach?.data?.attainment ?? [
  { name: "Q1 Goals", percentage: 92 },
  { name: "Q2 Goals", percentage: 88 },
];
export const selectPerformanceCoachLastUpdated = (state: RootState) => state.performanceCoach?.data?.lastUpdated ?? null;

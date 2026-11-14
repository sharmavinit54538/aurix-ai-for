import type { RootState } from "@/redux/store";

export const selectWorkforceInsightsLoading = (state: RootState) => state.workforceInsights?.loading ?? false;
export const selectWorkforceInsightsError = (state: RootState) => state.workforceInsights?.error ?? null;
export const selectWorkforceInsightsKPIs = (state: RootState) => state.workforceInsights?.data?.kpis ?? [];
export const selectWorkforceInsightsSummary = (state: RootState) => state.workforceInsights?.data?.summary ?? {};
export const selectWorkforceInsightsCharts = (state: RootState) => state.workforceInsights?.data?.charts ?? [];
export const selectWorkforceInsightsHeadcountTrends = (state: RootState) => state.workforceInsights?.data?.headcountTrends ?? [];
export const selectWorkforceInsightsDepartmentComparison = (state: RootState) => state.workforceInsights?.data?.departmentComparison ?? [];
export const selectWorkforceInsightsLastUpdated = (state: RootState) => state.workforceInsights?.data?.lastUpdated ?? null;

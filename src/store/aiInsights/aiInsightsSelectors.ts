import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

export const selectAIInsightsState = (state: RootState) => state.aiInsights;

export const selectAIInsightsLoading = createSelector(
  [selectAIInsightsState],
  (state) => state?.loading ?? false,
);

export const selectAIInsightsError = createSelector(
  [selectAIInsightsState],
  (state) => state?.error ?? null,
);

export const selectAIInsightsLastUpdated = createSelector(
  [selectAIInsightsState],
  (state) => state?.lastUpdated ?? null,
);

export const selectAIInsightsSummary = createSelector(
  [selectAIInsightsState],
  (state) => state?.dashboard ?? null,
);

export const selectAIInsightsKPIs = createSelector(
  [selectAIInsightsState],
  (state) => (Array.isArray(state?.kpi) ? state.kpi : []),
);

export const selectAIInsightsAttrition = createSelector(
  [selectAIInsightsState],
  (state) => (Array.isArray(state?.attrition) ? state.attrition : []),
);

export const selectAIInsightsBurnout = createSelector(
  [selectAIInsightsState],
  (state) => (Array.isArray(state?.burnout) ? state.burnout : []),
);

export const selectAIInsightsAttendance = createSelector(
  [selectAIInsightsState],
  (state) => (Array.isArray(state?.attendance) ? state.attendance : []),
);

export const selectAIInsightsRecruitment = createSelector(
  [selectAIInsightsState],
  (state) => state?.recruitment ?? null,
);

export const selectAIInsightsCandidates = createSelector(
  [selectAIInsightsRecruitment],
  (recruitment) => (Array.isArray(recruitment?.candidates) ? recruitment.candidates : []),
);

export const selectAIInsightsPerformance = createSelector(
  [selectAIInsightsState],
  (state) => state?.performance ?? null,
);

export const selectAIInsightsTopPerformers = createSelector(
  [selectAIInsightsPerformance],
  (performance) => (Array.isArray(performance?.topPerformers) ? performance.topPerformers : []),
);

export const selectAIInsightsSupportPerformers = createSelector(
  [selectAIInsightsPerformance],
  (performance) => (Array.isArray(performance?.supportPerformers) ? performance.supportPerformers : []),
);

export const selectAIInsightsSkillGap = createSelector(
  [selectAIInsightsState, selectAIInsightsPerformance],
  (state, performance) => {
    if (Array.isArray(state?.charts?.skillGap)) return state.charts.skillGap;
    if (Array.isArray(performance?.skillGap)) return performance.skillGap;
    return [];
  },
);

export const selectAIInsightsPayroll = createSelector(
  [selectAIInsightsState],
  (state) => state?.payroll ?? null,
);

export const selectAIInsightsPayrollAlerts = createSelector(
  [selectAIInsightsPayroll],
  (payroll) => (Array.isArray(payroll?.alerts) ? payroll.alerts : []),
);

export const selectAIInsightsPayrollTrend = createSelector(
  [selectAIInsightsState, selectAIInsightsPayroll],
  (state, payroll) => {
    if (Array.isArray(state?.charts?.payrollTrend)) return state.charts.payrollTrend;
    if (Array.isArray(payroll?.trend)) return payroll.trend;
    return [];
  },
);

export const selectAIInsightsCharts = createSelector(
  [selectAIInsightsState],
  (state) => state?.charts ?? null,
);

export const selectAIInsightsHeadcountForecast = createSelector(
  [selectAIInsightsCharts],
  (charts) => (Array.isArray(charts?.headcountForecast) ? charts.headcountForecast : []),
);

export const selectAIInsightsHiringDemand = createSelector(
  [selectAIInsightsCharts],
  (charts) => (Array.isArray(charts?.hiringDemand) ? charts.hiringDemand : []),
);

export const selectAIInsightsSatisfactionTrend = createSelector(
  [selectAIInsightsCharts],
  (charts) => (Array.isArray(charts?.satisfactionTrend) ? charts.satisfactionTrend : []),
);

export const selectAIInsightsAlerts = createSelector(
  [selectAIInsightsState],
  (state) => (Array.isArray(state?.alerts) ? state.alerts : []),
);

export const selectAIInsightsRecommendations = createSelector(
  [selectAIInsightsState],
  (state) => (Array.isArray(state?.recommendations) ? state.recommendations : []),
);

export const selectAIInsightsDocuments = createSelector(
  [selectAIInsightsState],
  (state) => (Array.isArray(state?.documents) ? state.documents : []),
);

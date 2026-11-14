import type { RootState } from "@/redux/store";

export const selectAIInsightsLoading = (state: RootState) => state.aiInsights?.loading ?? false;
export const selectAIInsightsError = (state: RootState) => state.aiInsights?.error ?? null;

export const selectAIInsightsSummary = (state: RootState) => state.aiInsights?.data?.summary ?? {};
export const selectAIInsightsKPIs = (state: RootState) => state.aiInsights?.data?.kpis ?? [];
export const selectAIInsightsAlerts = (state: RootState) => state.aiInsights?.data?.alerts ?? [];
export const selectAIInsightsAttendance = (state: RootState) => state.aiInsights?.data?.attendance ?? [];
export const selectAIInsightsAttrition = (state: RootState) => state.aiInsights?.data?.attrition ?? [];
export const selectAIInsightsBurnout = (state: RootState) => state.aiInsights?.data?.burnout ?? [];
export const selectAIInsightsCandidates = (state: RootState) => state.aiInsights?.data?.candidates ?? [];
export const selectAIInsightsDocuments = (state: RootState) => state.aiInsights?.data?.documents ?? [];
export const selectAIInsightsHeadcountForecast = (state: RootState) => state.aiInsights?.data?.headcountForecast ?? [];
export const selectAIInsightsHiringDemand = (state: RootState) => state.aiInsights?.data?.hiringDemand ?? [];
export const selectAIInsightsPayroll = (state: RootState) => state.aiInsights?.data?.payroll ?? [];
export const selectAIInsightsPayrollAlerts = (state: RootState) => state.aiInsights?.data?.payrollAlerts ?? [];
export const selectAIInsightsPayrollTrend = (state: RootState) => state.aiInsights?.data?.payrollTrend ?? [];
export const selectAIInsightsRecruitment = (state: RootState) => state.aiInsights?.data?.recruitment ?? [];
export const selectAIInsightsRecommendations = (state: RootState) => state.aiInsights?.data?.recommendations ?? [];
export const selectAIInsightsSatisfactionTrend = (state: RootState) => state.aiInsights?.data?.satisfactionTrend ?? [];
export const selectAIInsightsSkillGap = (state: RootState) => state.aiInsights?.data?.skillGap ?? [];
export const selectAIInsightsSupportPerformers = (state: RootState) => state.aiInsights?.data?.supportPerformers ?? [];
export const selectAIInsightsTopPerformers = (state: RootState) => state.aiInsights?.data?.topPerformers ?? [];
export const selectAIInsightsHasDataFlag = (state: RootState) => state.aiInsights?.data?.hasDataFlag ?? true;
export const selectAIInsightsPartial = (state: RootState) => state.aiInsights?.data?.partial ?? false;
export const selectAIInsightsPartialErrors = (state: RootState) => state.aiInsights?.data?.partialErrors ?? [];
export const selectAIInsightsLastUpdated = (_state: RootState) => new Date().toISOString();

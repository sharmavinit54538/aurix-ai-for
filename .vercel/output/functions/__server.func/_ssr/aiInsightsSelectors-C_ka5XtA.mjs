import { s as createSelector } from "../_libs/@reduxjs/toolkit+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/aiInsightsSelectors-C_ka5XtA.js
var selectAIInsightsState = (state) => state.aiInsights;
var selectAIInsightsLoading = createSelector([selectAIInsightsState], (state) => state?.loading ?? false);
var selectAIInsightsError = createSelector([selectAIInsightsState], (state) => state?.error ?? null);
createSelector([selectAIInsightsState], (state) => state?.lastUpdated ?? null);
var selectAIInsightsSummary = createSelector([selectAIInsightsState], (state) => state?.dashboard ?? null);
var selectAIInsightsKPIs = createSelector([selectAIInsightsState], (state) => Array.isArray(state?.kpi) ? state.kpi : []);
var selectAIInsightsAttrition = createSelector([selectAIInsightsState], (state) => Array.isArray(state?.attrition) ? state.attrition : []);
var selectAIInsightsBurnout = createSelector([selectAIInsightsState], (state) => Array.isArray(state?.burnout) ? state.burnout : []);
var selectAIInsightsAttendance = createSelector([selectAIInsightsState], (state) => Array.isArray(state?.attendance) ? state.attendance : []);
var selectAIInsightsRecruitment = createSelector([selectAIInsightsState], (state) => state?.recruitment ?? null);
var selectAIInsightsCandidates = createSelector([selectAIInsightsRecruitment], (recruitment) => Array.isArray(recruitment?.candidates) ? recruitment.candidates : []);
var selectAIInsightsPerformance = createSelector([selectAIInsightsState], (state) => state?.performance ?? null);
var selectAIInsightsTopPerformers = createSelector([selectAIInsightsPerformance], (performance) => Array.isArray(performance?.topPerformers) ? performance.topPerformers : []);
var selectAIInsightsSupportPerformers = createSelector([selectAIInsightsPerformance], (performance) => Array.isArray(performance?.supportPerformers) ? performance.supportPerformers : []);
var selectAIInsightsSkillGap = createSelector([selectAIInsightsState, selectAIInsightsPerformance], (state, performance) => {
	if (Array.isArray(state?.charts?.skillGap)) return state.charts.skillGap;
	if (Array.isArray(performance?.skillGap)) return performance.skillGap;
	return [];
});
var selectAIInsightsCharts = createSelector([selectAIInsightsState], (state) => state?.charts ?? null);
var selectAIInsightsHeadcountForecast = createSelector([selectAIInsightsCharts], (charts) => Array.isArray(charts?.headcountForecast) ? charts.headcountForecast : []);
var selectAIInsightsHiringDemand = createSelector([selectAIInsightsCharts], (charts) => Array.isArray(charts?.hiringDemand) ? charts.hiringDemand : []);
var selectAIInsightsSatisfactionTrend = createSelector([selectAIInsightsCharts], (charts) => Array.isArray(charts?.satisfactionTrend) ? charts.satisfactionTrend : []);
var selectAIInsightsAlerts = createSelector([selectAIInsightsState], (state) => Array.isArray(state?.alerts) ? state.alerts : []);
var selectAIInsightsRecommendations = createSelector([selectAIInsightsState], (state) => Array.isArray(state?.recommendations) ? state.recommendations : []);
var selectAIInsightsDocuments = createSelector([selectAIInsightsState], (state) => Array.isArray(state?.documents) ? state.documents : []);
var selectAIInsightsPayroll = createSelector([selectAIInsightsState], (state) => state?.payroll ?? null);
var selectAIInsightsPayrollAlerts = createSelector([selectAIInsightsState], (state) => Array.isArray(state?.payrollAlerts) ? state.payrollAlerts : []);
var selectAIInsightsPayrollTrend = createSelector([selectAIInsightsState], (state) => Array.isArray(state?.charts?.payrollTrend) ? state.charts.payrollTrend : []);
var selectAIInsightsHasDataFlag = createSelector([selectAIInsightsState], (state) => state?.hasDataFlag);
var selectAIInsightsPartial = createSelector([selectAIInsightsState], (state) => state?.partial ?? false);
var selectAIInsightsPartialErrors = createSelector([selectAIInsightsState], (state) => state?.partialErrors ?? null);
//#endregion
export { selectAIInsightsSupportPerformers as C, selectAIInsightsSummary as S, selectAIInsightsPayrollTrend as _, selectAIInsightsCandidates as a, selectAIInsightsSatisfactionTrend as b, selectAIInsightsHasDataFlag as c, selectAIInsightsKPIs as d, selectAIInsightsLoading as f, selectAIInsightsPayrollAlerts as g, selectAIInsightsPayroll as h, selectAIInsightsBurnout as i, selectAIInsightsHeadcountForecast as l, selectAIInsightsPartialErrors as m, selectAIInsightsAttendance as n, selectAIInsightsDocuments as o, selectAIInsightsPartial as p, selectAIInsightsAttrition as r, selectAIInsightsError as s, selectAIInsightsAlerts as t, selectAIInsightsHiringDemand as u, selectAIInsightsRecommendations as v, selectAIInsightsTopPerformers as w, selectAIInsightsSkillGap as x, selectAIInsightsRecruitment as y };

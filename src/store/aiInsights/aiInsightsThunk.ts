import { createAsyncThunk } from "@reduxjs/toolkit";
import { aiInsightsApi } from "@/services/aiInsightsApi";
import type { AIInsightsDashboardData } from "./aiInsightsTypes";

export const fetchAIInsightsDashboard = createAsyncThunk<
  AIInsightsDashboardData,
  void
>("aiInsights/fetchDashboard", async () => {
  const res = await aiInsightsApi.getDashboard();
  const d = (res as any)?.data ?? res ?? {};
  return {
    summary: d.summary ?? {
      totalEmployees: 0,
      healthScore: 0,
      attritionRisk: "Unknown",
      overallMood: "Neutral",
    },
    kpis: Array.isArray(d.kpis) ? d.kpis : [],
    alerts: Array.isArray(d.alerts) ? d.alerts : [],
    attendance: Array.isArray(d.attendance) ? d.attendance : [],
    attrition: Array.isArray(d.attrition) ? d.attrition : [],
    burnout: Array.isArray(d.burnout) ? d.burnout : [],
    candidates: Array.isArray(d.candidates) ? d.candidates : [],
    documents: Array.isArray(d.documents) ? d.documents : [],
    headcountForecast: Array.isArray(d.headcountForecast)
      ? d.headcountForecast
      : [],
    hiringDemand: Array.isArray(d.hiringDemand) ? d.hiringDemand : [],
    payroll: Array.isArray(d.payroll) ? d.payroll : [],
    payrollAlerts: Array.isArray(d.payrollAlerts) ? d.payrollAlerts : [],
    payrollTrend: Array.isArray(d.payrollTrend) ? d.payrollTrend : [],
    recruitment: Array.isArray(d.recruitment) ? d.recruitment : [],
    recommendations: Array.isArray(d.recommendations)
      ? d.recommendations
      : [],
    satisfactionTrend: Array.isArray(d.satisfactionTrend)
      ? d.satisfactionTrend
      : [],
    skillGap: Array.isArray(d.skillGap) ? d.skillGap : [],
    supportPerformers: Array.isArray(d.supportPerformers)
      ? d.supportPerformers
      : [],
    topPerformers: Array.isArray(d.topPerformers) ? d.topPerformers : [],
    hasDataFlag: Boolean(
      d.hasDataFlag ??
        (Array.isArray(d.kpis) && d.kpis.length > 0),
    ),
    partial: Boolean(d.partial ?? false),
    partialErrors: Array.isArray(d.partialErrors) ? d.partialErrors : [],
  };
});

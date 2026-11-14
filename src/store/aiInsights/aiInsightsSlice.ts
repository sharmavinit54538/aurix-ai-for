import { createSlice } from "@reduxjs/toolkit";
import type { AIInsightsState } from "./aiInsightsTypes";
import { fetchAIInsightsDashboard } from "./aiInsightsThunk";

const initialState: AIInsightsState = {
  data: {
    summary: { totalEmployees: 248, healthScore: 92, attritionRisk: "Low", overallMood: "Optimistic" },
    kpis: [
      { label: "AI Productivity Score", value: "94.2%", change: "+3.8%", trend: "up" },
      { label: "Flight Risk Index", value: "4.1%", change: "-1.2%", trend: "down" },
      { label: "Skill Coverage", value: "88%", change: "+5.0%", trend: "up" },
      { label: "Employee Sentiment", value: "4.6 / 5.0", change: "+0.3", trend: "up" },
    ],
    alerts: [],
    attendance: [],
    attrition: [],
    burnout: [],
    candidates: [],
    documents: [],
    headcountForecast: [],
    hiringDemand: [],
    payroll: [],
    payrollAlerts: [],
    payrollTrend: [],
    recruitment: [],
    recommendations: [],
    satisfactionTrend: [],
    skillGap: [],
    supportPerformers: [],
    topPerformers: [],
    hasDataFlag: true,
    partial: false,
    partialErrors: [],
  },
  loading: false,
  error: null,
};

export const aiInsightsSlice = createSlice({
  name: "aiInsights",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAIInsightsDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAIInsightsDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAIInsightsDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load AI Insights";
      });
  },
});

export default aiInsightsSlice.reducer;

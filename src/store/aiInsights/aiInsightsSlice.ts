import { createSlice } from "@reduxjs/toolkit";
import type { AIInsightsState } from "./aiInsightsTypes";
import {
  fetchAIInsightsDashboard,
  fetchAttendance,
  fetchAttrition,
  fetchBurnout,
  fetchCharts,
  fetchKpi,
  fetchPerformance,
  fetchRecommendations,
  fetchRecruitment,
} from "./aiInsightsThunk";

const initialState: AIInsightsState = {
  loading: false,
  error: null,
  lastUpdated: null,
  dashboard: null,
  kpi: [],
  attrition: [],
  burnout: [],
  attendance: [],
  recruitment: null,
  performance: null,
  payroll: null,
  charts: null,
  alerts: [],
  recommendations: [],
  documents: [],
};

export const aiInsightsSlice = createSlice({
  name: "aiInsights",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Consolidated Dashboard fetch
    builder
      .addCase(fetchAIInsightsDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAIInsightsDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
        const data = action.payload;

        if (data.summary !== undefined) state.dashboard = data.summary;
        if (Array.isArray(data.kpi)) state.kpi = data.kpi;
        if (Array.isArray(data.attrition)) state.attrition = data.attrition;
        if (Array.isArray(data.burnout)) state.burnout = data.burnout;
        if (Array.isArray(data.attendance)) state.attendance = data.attendance;
        if (data.recruitment) {
          state.recruitment = {
            ...data.recruitment,
            candidates: Array.isArray(data.recruitment.candidates) ? data.recruitment.candidates : [],
          };
        }
        if (data.performance) {
          state.performance = {
            ...data.performance,
            topPerformers: Array.isArray(data.performance.topPerformers) ? data.performance.topPerformers : [],
            supportPerformers: Array.isArray(data.performance.supportPerformers) ? data.performance.supportPerformers : [],
            skillGap: Array.isArray(data.performance.skillGap) ? data.performance.skillGap : [],
          };
        }
        if (data.payroll) {
          state.payroll = {
            ...data.payroll,
            alerts: Array.isArray(data.payroll.alerts) ? data.payroll.alerts : [],
            trend: Array.isArray(data.payroll.trend) ? data.payroll.trend : [],
          };
        }
        if (data.charts) {
          state.charts = {
            skillGap: Array.isArray(data.charts.skillGap) ? data.charts.skillGap : [],
            payrollTrend: Array.isArray(data.charts.payrollTrend) ? data.charts.payrollTrend : [],
            headcountForecast: Array.isArray(data.charts.headcountForecast) ? data.charts.headcountForecast : [],
            hiringDemand: Array.isArray(data.charts.hiringDemand) ? data.charts.hiringDemand : [],
            satisfactionTrend: Array.isArray(data.charts.satisfactionTrend) ? data.charts.satisfactionTrend : [],
          };
        }
        if (Array.isArray(data.alerts)) state.alerts = data.alerts;
        if (Array.isArray(data.recommendations)) state.recommendations = data.recommendations;
        if (Array.isArray(data.documents)) state.documents = data.documents;
      })
      .addCase(fetchAIInsightsDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to fetch AI Insights dashboard";
      });

    // Sub-thunks
    builder.addCase(fetchKpi.fulfilled, (state, action) => {
      state.kpi = Array.isArray(action.payload) ? action.payload : [];
    });

    builder.addCase(fetchAttrition.fulfilled, (state, action) => {
      state.attrition = Array.isArray(action.payload) ? action.payload : [];
    });

    builder.addCase(fetchBurnout.fulfilled, (state, action) => {
      state.burnout = Array.isArray(action.payload) ? action.payload : [];
    });

    builder.addCase(fetchAttendance.fulfilled, (state, action) => {
      state.attendance = Array.isArray(action.payload) ? action.payload : [];
    });

    builder.addCase(fetchPerformance.fulfilled, (state, action) => {
      if (action.payload) {
        state.performance = {
          topPerformers: Array.isArray(action.payload.topPerformers) ? action.payload.topPerformers : [],
          supportPerformers: Array.isArray(action.payload.supportPerformers) ? action.payload.supportPerformers : [],
          skillGap: Array.isArray(action.payload.skillGap) ? action.payload.skillGap : [],
        };
      }
    });

    builder.addCase(fetchRecruitment.fulfilled, (state, action) => {
      if (action.payload) {
        state.recruitment = {
          openPositions: action.payload.openPositions ?? 0,
          recommendedCandidatesCount: action.payload.recommendedCandidatesCount ?? 0,
          pipelineHealth: action.payload.pipelineHealth ?? "",
          candidates: Array.isArray(action.payload.candidates) ? action.payload.candidates : [],
        };
      }
    });

    builder.addCase(fetchCharts.fulfilled, (state, action) => {
      if (action.payload) {
        state.charts = {
          skillGap: Array.isArray(action.payload.skillGap) ? action.payload.skillGap : [],
          payrollTrend: Array.isArray(action.payload.payrollTrend) ? action.payload.payrollTrend : [],
          headcountForecast: Array.isArray(action.payload.headcountForecast) ? action.payload.headcountForecast : [],
          hiringDemand: Array.isArray(action.payload.hiringDemand) ? action.payload.hiringDemand : [],
          satisfactionTrend: Array.isArray(action.payload.satisfactionTrend) ? action.payload.satisfactionTrend : [],
        };
      }
    });

    builder.addCase(fetchRecommendations.fulfilled, (state, action) => {
      state.recommendations = Array.isArray(action.payload) ? action.payload : [];
    });
  },
});

export const { clearError, resetState } = aiInsightsSlice.actions;
export default aiInsightsSlice.reducer;

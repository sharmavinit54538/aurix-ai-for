import { createSlice } from "@reduxjs/toolkit";
import type { AIPerformanceState } from "./aiPerformanceTypes";
import {
  analyzeAISkillGaps,
  fetchAIEmployeePerformance,
  fetchAIPerformanceDashboard,
  generateAICoaching,
  generateAIPromotion,
} from "./aiPerformanceThunk";

const initialState: AIPerformanceState = {
  loading: false,
  error: null,
  lastUpdated: null,
  actionLoading: false,
  actionError: null,
  dashboard: null,
  trends: null,
  kpiAttainment: null,
  topPerformers: { total: null, employees: [], teams: [], departments: [], managers: [] },
  skillGaps: { total: null, items: [] },
  promotions: { total: null, items: [] },
  coaching: { total: null, items: [] },
  analytics: null,
  selectedEmployee: null,
};

export const aiPerformanceSlice = createSlice({
  name: "aiPerformance",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
      state.actionError = null;
    },
    resetState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAIPerformanceDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAIPerformanceDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
        const data = action.payload;

        state.dashboard = data.dashboard ?? null;
        state.trends = data.trends ?? null;
        state.kpiAttainment = data.kpiAttainment ?? null;
        state.topPerformers = data.topPerformers;
        state.skillGaps = data.skillGaps;
        state.promotions = data.promotions;
        state.coaching = data.coaching;
        state.analytics = data.analytics ?? null;
      })
      .addCase(fetchAIPerformanceDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to fetch AI Performance Coach";
      });

    builder
      .addCase(generateAICoaching.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(generateAICoaching.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.coaching = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(generateAICoaching.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload ?? action.error.message ?? "Failed to generate coaching";
      });

    builder
      .addCase(generateAIPromotion.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(generateAIPromotion.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.promotions = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(generateAIPromotion.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload ?? action.error.message ?? "Failed to generate promotions";
      });

    builder
      .addCase(analyzeAISkillGaps.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(analyzeAISkillGaps.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.skillGaps = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(analyzeAISkillGaps.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload ?? action.error.message ?? "Failed to analyze skill gaps";
      });

    builder
      .addCase(fetchAIEmployeePerformance.fulfilled, (state, action) => {
        state.selectedEmployee = action.payload;
      })
      .addCase(fetchAIEmployeePerformance.rejected, (state, action) => {
        state.actionError = action.payload ?? action.error.message ?? "Failed to load employee profile";
      });
  },
});

export const { clearError, resetState } = aiPerformanceSlice.actions;
export default aiPerformanceSlice.reducer;

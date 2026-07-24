import { createSlice } from "@reduxjs/toolkit";
import type { AILeaveState } from "./aiLeaveTypes";
import {
  detectAILeaveConflicts,
  fetchAILeaveDashboard,
  fetchAILeaveRequestDetails,
  generateAILeaveForecast,
  generateAILeaveSuggestions,
} from "./aiLeaveThunk";

const initialState: AILeaveState = {
  loading: false,
  error: null,
  lastUpdated: null,
  actionLoading: false,
  actionError: null,
  dashboard: null,
  forecast: null,
  distribution: null,
  approvalSuggestions: { total: null, items: [] },
  conflicts: { total: null, items: [] },
  teamAvailability: null,
  trends: null,
  analytics: null,
  selectedRequest: null,
};

export const aiLeaveSlice = createSlice({
  name: "aiLeave",
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
      .addCase(fetchAILeaveDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAILeaveDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
        const data = action.payload;

        state.dashboard = data.dashboard ?? null;
        state.forecast = data.forecast ?? null;
        state.distribution = data.distribution ?? null;
        state.approvalSuggestions = data.approvalSuggestions ?? { total: null, items: [] };
        state.conflicts = data.conflicts ?? { total: null, items: [] };
        state.teamAvailability = data.teamAvailability ?? null;
        state.trends = data.trends ?? null;
        state.analytics = data.analytics ?? null;
      })
      .addCase(fetchAILeaveDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to fetch AI Leave Assistant";
      });

    builder
      .addCase(generateAILeaveForecast.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(generateAILeaveForecast.fulfilled, (state, action) => {
        state.actionLoading = false;
        if (action.payload) state.forecast = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(generateAILeaveForecast.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload ?? action.error.message ?? "Failed to generate forecast";
      });

    builder
      .addCase(generateAILeaveSuggestions.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(generateAILeaveSuggestions.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.approvalSuggestions = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(generateAILeaveSuggestions.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload ?? action.error.message ?? "Failed to generate suggestions";
      });

    builder
      .addCase(detectAILeaveConflicts.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(detectAILeaveConflicts.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.conflicts = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(detectAILeaveConflicts.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload ?? action.error.message ?? "Failed to detect conflicts";
      });

    builder
      .addCase(fetchAILeaveRequestDetails.fulfilled, (state, action) => {
        state.selectedRequest = action.payload;
      })
      .addCase(fetchAILeaveRequestDetails.rejected, (state, action) => {
        state.actionError = action.payload ?? action.error.message ?? "Failed to load leave request";
      });
  },
});

export const { clearError, resetState } = aiLeaveSlice.actions;
export default aiLeaveSlice.reducer;

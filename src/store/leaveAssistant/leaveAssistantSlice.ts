import { createSlice } from "@reduxjs/toolkit";
import type { LeaveAssistantState } from "./leaveAssistantTypes";
import {
  fetchLeaveAssistantDashboard,
  fetchLeaveAssistantKpi,
  fetchLeaveForecast,
  fetchLeaveTypeDistribution,
} from "./leaveAssistantThunk";

const initialState: LeaveAssistantState = {
  loading: false,
  error: null,
  lastUpdated: null,
  summary: null,
  kpi: [],
  charts: null,
};

export const leaveAssistantSlice = createSlice({
  name: "leaveAssistant",
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
      .addCase(fetchLeaveAssistantDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveAssistantDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
        const data = action.payload;

        if (data.summary !== undefined) state.summary = data.summary;
        if (Array.isArray(data.kpi)) state.kpi = data.kpi;
        if (data.charts) {
          state.charts = {
            leaveForecast: Array.isArray(data.charts.leaveForecast)
              ? data.charts.leaveForecast
              : [],
            leaveTypeDistribution: Array.isArray(data.charts.leaveTypeDistribution)
              ? data.charts.leaveTypeDistribution
              : [],
          };
        } else if (data.leaveForecast || data.leaveTypeDistribution) {
          state.charts = {
            leaveForecast: Array.isArray(data.leaveForecast)
              ? data.leaveForecast
              : [],
            leaveTypeDistribution: Array.isArray(data.leaveTypeDistribution)
              ? data.leaveTypeDistribution
              : [],
          };
        }
      })
      .addCase(fetchLeaveAssistantDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to fetch leave assistant dashboard";
      });

    // Sub-thunks
    builder.addCase(fetchLeaveAssistantKpi.fulfilled, (state, action) => {
      state.kpi = Array.isArray(action.payload) ? action.payload : [];
    });

    builder.addCase(fetchLeaveForecast.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        if (!state.charts) {
          state.charts = { leaveForecast: action.payload, leaveTypeDistribution: [] };
        } else {
          state.charts.leaveForecast = action.payload;
        }
      }
    });

    builder.addCase(fetchLeaveTypeDistribution.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        if (!state.charts) {
          state.charts = { leaveForecast: [], leaveTypeDistribution: action.payload };
        } else {
          state.charts.leaveTypeDistribution = action.payload;
        }
      }
    });
  },
});

export const { clearError, resetState } = leaveAssistantSlice.actions;
export default leaveAssistantSlice.reducer;

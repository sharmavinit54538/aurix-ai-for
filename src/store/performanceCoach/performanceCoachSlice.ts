import { createSlice } from "@reduxjs/toolkit";
import type { PerformanceCoachState } from "./performanceCoachTypes";
import {
  fetchKpiAttainment,
  fetchPerformanceCoachDashboard,
  fetchPerformanceCoachKpi,
  fetchPerformanceTrend,
} from "./performanceCoachThunk";

const initialState: PerformanceCoachState = {
  loading: false,
  error: null,
  lastUpdated: null,
  summary: null,
  kpi: [],
  charts: null,
};

export const performanceCoachSlice = createSlice({
  name: "performanceCoach",
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
      .addCase(fetchPerformanceCoachDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPerformanceCoachDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
        const data = action.payload;

        if (data.summary !== undefined) state.summary = data.summary;
        if (Array.isArray(data.kpi)) state.kpi = data.kpi;
        if (data.charts) {
          state.charts = {
            performanceTrend: Array.isArray(data.charts.performanceTrend)
              ? data.charts.performanceTrend
              : [],
            kpiAttainment: Array.isArray(data.charts.kpiAttainment)
              ? data.charts.kpiAttainment
              : [],
          };
        } else if (data.performanceTrend || data.kpiAttainment) {
          state.charts = {
            performanceTrend: Array.isArray(data.performanceTrend)
              ? data.performanceTrend
              : [],
            kpiAttainment: Array.isArray(data.kpiAttainment)
              ? data.kpiAttainment
              : [],
          };
        }
      })
      .addCase(fetchPerformanceCoachDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to fetch performance coach dashboard";
      });

    // Sub-thunks
    builder.addCase(fetchPerformanceCoachKpi.fulfilled, (state, action) => {
      state.kpi = Array.isArray(action.payload) ? action.payload : [];
    });

    builder.addCase(fetchPerformanceTrend.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        if (!state.charts) {
          state.charts = { performanceTrend: action.payload, kpiAttainment: [] };
        } else {
          state.charts.performanceTrend = action.payload;
        }
      }
    });

    builder.addCase(fetchKpiAttainment.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        if (!state.charts) {
          state.charts = { performanceTrend: [], kpiAttainment: action.payload };
        } else {
          state.charts.kpiAttainment = action.payload;
        }
      }
    });
  },
});

export const { clearError, resetState } = performanceCoachSlice.actions;
export default performanceCoachSlice.reducer;

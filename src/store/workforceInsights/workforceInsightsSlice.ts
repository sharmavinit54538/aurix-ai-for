import { createSlice } from "@reduxjs/toolkit";
import type { WorkforceInsightsState } from "./workforceInsightsTypes";
import {
  fetchDepartmentComparison,
  fetchHeadcountTrends,
  fetchWorkforceInsightsDashboard,
  fetchWorkforceInsightsKpi,
} from "./workforceInsightsThunk";

const initialState: WorkforceInsightsState = {
  loading: false,
  error: null,
  lastUpdated: null,
  summary: null,
  kpi: [],
  charts: null,
};

export const workforceInsightsSlice = createSlice({
  name: "workforceInsights",
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
      .addCase(fetchWorkforceInsightsDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkforceInsightsDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
        const data = action.payload;

        if (data.summary !== undefined) state.summary = data.summary;
        if (Array.isArray(data.kpi)) state.kpi = data.kpi;
        if (data.charts) {
          state.charts = {
            headcountTrends: Array.isArray(data.charts.headcountTrends)
              ? data.charts.headcountTrends
              : [],
            departmentComparison: Array.isArray(data.charts.departmentComparison)
              ? data.charts.departmentComparison
              : [],
          };
        } else if (data.headcountTrends || data.departmentComparison) {
          state.charts = {
            headcountTrends: Array.isArray(data.headcountTrends)
              ? data.headcountTrends
              : [],
            departmentComparison: Array.isArray(data.departmentComparison)
              ? data.departmentComparison
              : [],
          };
        }
      })
      .addCase(fetchWorkforceInsightsDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to fetch workforce insights dashboard";
      });

    // Sub-thunks
    builder.addCase(fetchWorkforceInsightsKpi.fulfilled, (state, action) => {
      state.kpi = Array.isArray(action.payload) ? action.payload : [];
    });

    builder.addCase(fetchHeadcountTrends.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        if (!state.charts) {
          state.charts = { headcountTrends: action.payload, departmentComparison: [] };
        } else {
          state.charts.headcountTrends = action.payload;
        }
      }
    });

    builder.addCase(fetchDepartmentComparison.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        if (!state.charts) {
          state.charts = { headcountTrends: [], departmentComparison: action.payload };
        } else {
          state.charts.departmentComparison = action.payload;
        }
      }
    });
  },
});

export const { clearError, resetState } = workforceInsightsSlice.actions;
export default workforceInsightsSlice.reducer;

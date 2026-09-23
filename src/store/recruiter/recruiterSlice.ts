import { createSlice } from "@reduxjs/toolkit";
import type { RecruiterState } from "./recruiterTypes";
import {
  fetchCandidateFunnel,
  fetchJdMatchDistribution,
  fetchRecruiterDashboard,
  fetchRecruiterKpi,
} from "./recruiterThunk";

const initialState: RecruiterState = {
  loading: false,
  error: null,
  lastUpdated: null,
  summary: null,
  kpi: [],
  charts: null,
};

export const recruiterSlice = createSlice({
  name: "aiRecruiter",
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
      .addCase(fetchRecruiterDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecruiterDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
        const data = action.payload;

        if (data.summary !== undefined) state.summary = data.summary;
        if (Array.isArray(data.kpi)) state.kpi = data.kpi;
        if (data.charts) {
          state.charts = {
            candidateFunnel: Array.isArray(data.charts.candidateFunnel)
              ? data.charts.candidateFunnel
              : [],
            jdMatchDistribution: Array.isArray(data.charts.jdMatchDistribution)
              ? data.charts.jdMatchDistribution
              : [],
          };
        } else if (data.candidateFunnel || data.jdMatchDistribution) {
          state.charts = {
            candidateFunnel: Array.isArray(data.candidateFunnel)
              ? data.candidateFunnel
              : [],
            jdMatchDistribution: Array.isArray(data.jdMatchDistribution)
              ? data.jdMatchDistribution
              : [],
          };
        }
      })
      .addCase(fetchRecruiterDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to fetch recruiter dashboard";
      });

    // Sub-thunks
    builder.addCase(fetchRecruiterKpi.fulfilled, (state, action) => {
      state.kpi = Array.isArray(action.payload) ? action.payload : [];
    });

    builder.addCase(fetchCandidateFunnel.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        if (!state.charts) {
          state.charts = { candidateFunnel: action.payload, jdMatchDistribution: [] };
        } else {
          state.charts.candidateFunnel = action.payload;
        }
      }
    });

    builder.addCase(fetchJdMatchDistribution.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        if (!state.charts) {
          state.charts = { candidateFunnel: [], jdMatchDistribution: action.payload };
        } else {
          state.charts.jdMatchDistribution = action.payload;
        }
      }
    });
  },
});

export const { clearError, resetState } = recruiterSlice.actions;
export default recruiterSlice.reducer;

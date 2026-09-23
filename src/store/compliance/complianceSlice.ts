import { createSlice } from "@reduxjs/toolkit";
import type { ComplianceState } from "./complianceTypes";
import {
  fetchComplianceDashboard,
  fetchComplianceKpi,
  fetchComplianceRisks,
  fetchComplianceTrend,
} from "./complianceThunk";

const initialState: ComplianceState = {
  loading: false,
  error: null,
  lastUpdated: null,
  summary: null,
  kpi: [],
  risks: [],
  charts: null,
};

export const complianceSlice = createSlice({
  name: "compliance",
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
      .addCase(fetchComplianceDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplianceDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
        const data = action.payload;

        if (data.summary !== undefined) state.summary = data.summary;
        if (Array.isArray(data.kpi)) state.kpi = data.kpi;
        if (Array.isArray(data.risks)) state.risks = data.risks;
        if (data.charts) {
          state.charts = {
            complianceTrend: Array.isArray(data.charts.complianceTrend) ? data.charts.complianceTrend : [],
            risksByCategory: Array.isArray(data.charts.risksByCategory) ? data.charts.risksByCategory : [],
          };
        } else if (data.complianceTrend || data.risksByCategory) {
          state.charts = {
            complianceTrend: Array.isArray(data.complianceTrend) ? data.complianceTrend : [],
            risksByCategory: Array.isArray(data.risksByCategory) ? data.risksByCategory : [],
          };
        }
      })
      .addCase(fetchComplianceDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to fetch compliance dashboard";
      });

    // Sub-thunks
    builder.addCase(fetchComplianceKpi.fulfilled, (state, action) => {
      state.kpi = Array.isArray(action.payload) ? action.payload : [];
    });

    builder.addCase(fetchComplianceRisks.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        if (!state.charts) {
          state.charts = { complianceTrend: [], risksByCategory: action.payload };
        } else {
          state.charts.risksByCategory = action.payload;
        }
      }
    });

    builder.addCase(fetchComplianceTrend.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        if (!state.charts) {
          state.charts = { complianceTrend: action.payload, risksByCategory: [] };
        } else {
          state.charts.complianceTrend = action.payload;
        }
      }
    });
  },
});

export const { clearError, resetState } = complianceSlice.actions;
export default complianceSlice.reducer;

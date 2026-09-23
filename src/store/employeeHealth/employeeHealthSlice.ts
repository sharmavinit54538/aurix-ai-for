import { createSlice } from "@reduxjs/toolkit";
import type { EmployeeHealthState } from "./employeeHealthTypes";
import {
  fetchBurnoutRiskTrend,
  fetchEmployeeHealthDashboard,
  fetchEmployeeHealthKpi,
  fetchOvertimeByTeam,
} from "./employeeHealthThunk";

const initialState: EmployeeHealthState = {
  loading: false,
  error: null,
  lastUpdated: null,
  summary: null,
  kpi: [],
  charts: null,
};

export const employeeHealthSlice = createSlice({
  name: "employeeHealth",
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
      .addCase(fetchEmployeeHealthDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeHealthDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
        const data = action.payload;

        if (data.summary !== undefined) state.summary = data.summary;
        if (Array.isArray(data.kpi)) state.kpi = data.kpi;
        if (data.charts) {
          state.charts = {
            burnoutRiskTrend: Array.isArray(data.charts.burnoutRiskTrend)
              ? data.charts.burnoutRiskTrend
              : [],
            overtimeByTeam: Array.isArray(data.charts.overtimeByTeam)
              ? data.charts.overtimeByTeam
              : [],
          };
        } else if (data.burnoutRiskTrend || data.overtimeByTeam) {
          state.charts = {
            burnoutRiskTrend: Array.isArray(data.burnoutRiskTrend)
              ? data.burnoutRiskTrend
              : [],
            overtimeByTeam: Array.isArray(data.overtimeByTeam)
              ? data.overtimeByTeam
              : [],
          };
        }
      })
      .addCase(fetchEmployeeHealthDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to fetch employee health dashboard";
      });

    // Sub-thunks
    builder.addCase(fetchEmployeeHealthKpi.fulfilled, (state, action) => {
      state.kpi = Array.isArray(action.payload) ? action.payload : [];
    });

    builder.addCase(fetchBurnoutRiskTrend.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        if (!state.charts) {
          state.charts = { burnoutRiskTrend: action.payload, overtimeByTeam: [] };
        } else {
          state.charts.burnoutRiskTrend = action.payload;
        }
      }
    });

    builder.addCase(fetchOvertimeByTeam.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        if (!state.charts) {
          state.charts = { burnoutRiskTrend: [], overtimeByTeam: action.payload };
        } else {
          state.charts.overtimeByTeam = action.payload;
        }
      }
    });
  },
});

export const { clearError, resetState } = employeeHealthSlice.actions;
export default employeeHealthSlice.reducer;

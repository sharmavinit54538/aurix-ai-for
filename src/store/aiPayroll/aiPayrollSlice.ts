import { createSlice } from "@reduxjs/toolkit";
import type { AIPayrollState } from "./aiPayrollTypes";
import {
  analyzeAIPayroll,
  detectAIPayrollAnomalies,
  detectAIPayrollFraud,
  fetchAIEmployeePayroll,
  fetchAIPayrollDashboard,
  generateAIPayrollForecast,
} from "./aiPayrollThunk";

const initialState: AIPayrollState = {
  loading: false,
  error: null,
  lastUpdated: null,
  actionLoading: false,
  actionError: null,
  dashboard: null,
  forecast: null,
  costAnalysis: null,
  costByDepartment: null,
  benchmarking: { total: null, items: [] },
  anomalies: { total: null, items: [] },
  fraud: { total: null, items: [] },
  healthScore: null,
  analytics: null,
  selectedEmployee: null,
};

export const aiPayrollSlice = createSlice({
  name: "aiPayroll",
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
      .addCase(fetchAIPayrollDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAIPayrollDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
        const data = action.payload;

        state.dashboard = data.dashboard ?? null;
        state.forecast = data.forecast ?? null;
        state.costAnalysis = data.costAnalysis ?? null;
        state.costByDepartment = data.costByDepartment ?? null;
        state.benchmarking = data.benchmarking;
        state.anomalies = data.anomalies;
        state.fraud = data.fraud;
        state.healthScore = data.healthScore ?? null;
        state.analytics = data.analytics ?? null;
      })
      .addCase(fetchAIPayrollDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to fetch AI Payroll Insights";
      });

    builder
      .addCase(generateAIPayrollForecast.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(generateAIPayrollForecast.fulfilled, (state, action) => {
        state.actionLoading = false;
        if (action.payload) state.forecast = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(generateAIPayrollForecast.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload ?? action.error.message ?? "Failed to generate forecast";
      });

    builder
      .addCase(analyzeAIPayroll.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(analyzeAIPayroll.fulfilled, (state) => {
        state.actionLoading = false;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(analyzeAIPayroll.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload ?? action.error.message ?? "Failed to analyze payroll";
      });

    builder
      .addCase(detectAIPayrollAnomalies.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(detectAIPayrollAnomalies.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.anomalies = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(detectAIPayrollAnomalies.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload ?? action.error.message ?? "Failed to detect anomalies";
      });

    builder
      .addCase(detectAIPayrollFraud.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(detectAIPayrollFraud.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.fraud = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(detectAIPayrollFraud.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload ?? action.error.message ?? "Failed to detect fraud";
      });

    builder
      .addCase(fetchAIEmployeePayroll.fulfilled, (state, action) => {
        state.selectedEmployee = action.payload;
      })
      .addCase(fetchAIEmployeePayroll.rejected, (state, action) => {
        state.actionError = action.payload ?? action.error.message ?? "Failed to load employee profile";
      });
  },
});

export const { clearError, resetState } = aiPayrollSlice.actions;
export default aiPayrollSlice.reducer;

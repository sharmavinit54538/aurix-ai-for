import { createSlice } from "@reduxjs/toolkit";
import type { AIAttendanceState } from "./aiAttendanceTypes";
import { fetchAIAttendanceDashboard } from "./aiAttendanceThunk";

const initialState: AIAttendanceState = {
  loading: false,
  error: null,
  lastUpdated: null,
  dashboard: null,
  trend: null,
  lateArrivals: null,
  anomalies: { total: null, items: [] },
  absencePattern: null,
  overtime: null,
  shiftViolations: null,
  healthScore: null,
  watchlist: null,
};

export const aiAttendanceSlice = createSlice({
  name: "aiAttendance",
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
    builder
      .addCase(fetchAIAttendanceDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAIAttendanceDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
        const data = action.payload;

        state.dashboard = data.dashboard ?? null;
        state.trend = data.trend ?? null;
        state.lateArrivals = data.lateArrivals ?? null;
        state.anomalies = data.anomalies ?? { total: null, items: [] };
        state.absencePattern = data.absencePattern ?? null;
        state.overtime = data.overtime ?? null;
        state.shiftViolations = data.shiftViolations ?? null;
        state.healthScore = data.healthScore ?? null;
        state.watchlist = data.watchlist ?? null;
      })
      .addCase(fetchAIAttendanceDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Failed to fetch AI Attendance Monitor";
      });
  },
});

export const { clearError, resetState } = aiAttendanceSlice.actions;
export default aiAttendanceSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { fetchEmployeeHealthDashboard } from "./employeeHealthThunk";

export interface EmployeeHealthState {
  loading: boolean;
  error: string | null;
  data: any;
}

const initialState: EmployeeHealthState = {
  loading: false,
  error: null,
  data: {
    kpis: [
      { label: "Overall Well-being Index", value: "92%", trend: "up" },
      { label: "Burnout Risk Level", value: "Low (4.2%)", trend: "down" },
      { label: "Work-Life Harmony Score", value: "8.8 / 10", trend: "up" },
    ],
    summary: { totalMonitored: 248, highBurnoutCount: 2 },
    burnoutTrend: [],
    overtimeByTeam: [],
    lastUpdated: new Date().toISOString(),
  },
};

export const employeeHealthSlice = createSlice({
  name: "employeeHealth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeHealthDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployeeHealthDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEmployeeHealthDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch employee health metrics";
      });
  },
});

export default employeeHealthSlice.reducer;

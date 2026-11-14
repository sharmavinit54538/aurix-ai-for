import { createSlice } from "@reduxjs/toolkit";
import { fetchPerformanceCoachDashboard } from "./performanceCoachThunk";

export interface PerformanceCoachState {
  loading: boolean;
  error: string | null;
  data: any;
}

const initialState: PerformanceCoachState = {
  loading: false,
  error: null,
  data: {
    kpis: [
      { label: "Coaching Sessions Completed", value: 38, trend: "up" },
      { label: "Goal Progress Score", value: "91%", trend: "up" },
      { label: "Skill Mastery Index", value: "8.6 / 10", trend: "up" },
    ],
    summary: { activeCoaches: 6, topSkillTarget: "Distributed Architecture" },
    progressTrend: [],
    lastUpdated: new Date().toISOString(),
  },
};

export const performanceCoachSlice = createSlice({
  name: "performanceCoach",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerformanceCoachDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPerformanceCoachDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPerformanceCoachDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch performance coach data";
      });
  },
});

export default performanceCoachSlice.reducer;

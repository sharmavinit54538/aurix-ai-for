import { createSlice } from "@reduxjs/toolkit";
import { fetchWorkforceInsightsDashboard } from "./workforceInsightsThunk";

export interface WorkforceInsightsState {
  loading: boolean;
  error: string | null;
  data: any;
}

const initialState: WorkforceInsightsState = {
  loading: false,
  error: null,
  data: {
    kpis: [
      { label: "Total Headcount", value: 248, trend: "up" },
      { label: "Retention Rate", value: "95.8%", trend: "up" },
      { label: "Internal Mobility Rate", value: "14.2%", trend: "up" },
    ],
    summary: { totalDepartments: 6, openPositions: 18 },
    charts: [],
    headcountTrends: [],
    departmentComparison: [],
    lastUpdated: new Date().toISOString(),
  },
};

export const workforceInsightsSlice = createSlice({
  name: "workforceInsights",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkforceInsightsDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkforceInsightsDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWorkforceInsightsDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch workforce insights dashboard";
      });
  },
});

export default workforceInsightsSlice.reducer;

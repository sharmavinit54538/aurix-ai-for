import { createSlice } from "@reduxjs/toolkit";
import { fetchLeaveAssistantDashboard } from "./leaveAssistantThunk";

export interface LeaveAssistantState {
  loading: boolean;
  error: string | null;
  data: any;
}

const initialState: LeaveAssistantState = {
  loading: false,
  error: null,
  data: {
    kpis: [
      { label: "Pending Approvals", value: 4, trend: "down" },
      { label: "Approved Leaves This Month", value: 24, trend: "up" },
      { label: "Coverage Ratio", value: "96%", trend: "neutral" },
    ],
    summary: { totalRequests: 28, autoApprovedCount: 18 },
    forecast: [],
    distribution: [],
    lastUpdated: new Date().toISOString(),
  },
};

export const leaveAssistantSlice = createSlice({
  name: "leaveAssistant",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveAssistantDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeaveAssistantDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchLeaveAssistantDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch leave assistant dashboard";
      });
  },
});

export default leaveAssistantSlice.reducer;

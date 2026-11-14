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
  data: null,
};

export const leaveAssistantSlice = createSlice({
  name: "leaveAssistant",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaveAssistantDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaveAssistantDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchLeaveAssistantDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch leave assistant dashboard";
      });
  },
});

export default leaveAssistantSlice.reducer;

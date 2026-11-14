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
  data: null,
};

export const workforceInsightsSlice = createSlice({
  name: "workforceInsights",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkforceInsightsDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkforceInsightsDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWorkforceInsightsDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ||
          "Failed to fetch workforce insights dashboard";
      });
  },
});

export default workforceInsightsSlice.reducer;

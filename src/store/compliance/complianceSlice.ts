import { createSlice } from "@reduxjs/toolkit";
import { fetchComplianceDashboard } from "./complianceThunk";

export interface ComplianceState {
  loading: boolean;
  error: string | null;
  data: any;
}

const initialState: ComplianceState = {
  loading: false,
  error: null,
  data: null,
};

export const complianceSlice = createSlice({
  name: "compliance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplianceDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplianceDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchComplianceDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error loading compliance data";
      });
  },
});

export default complianceSlice.reducer;

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
  data: {
    kpis: [
      { label: "Overall Compliance", value: "98.4%", trend: "up" },
      { label: "Pending Audit Items", value: 3, trend: "down" },
      { label: "Risk Score", value: "Low", trend: "neutral" },
    ],
    summary: { totalAudits: 14, passed: 13, pending: 1 },
    trend: [],
    risksByCategory: [],
    lastUpdated: new Date().toISOString(),
  },
};

export const complianceSlice = createSlice({
  name: "compliance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplianceDashboard.pending, (state) => {
        state.loading = true;
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

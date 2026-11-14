import { createSlice } from "@reduxjs/toolkit";
import { fetchRecruiterDashboard } from "./recruiterThunk";

export interface RecruiterState {
  loading: boolean;
  error: string | null;
  data: any;
}

const initialState: RecruiterState = {
  loading: false,
  error: null,
  data: {
    kpis: [
      { label: "Screened Resumes", value: 142, trend: "up" },
      { label: "Avg Match Score", value: "89%", trend: "up" },
      { label: "Time-to-Shortlist", value: "1.4 days", trend: "down" },
    ],
    summary: { activeJobs: 8, pipelineCandidates: 64 },
    candidates: [],
    lastUpdated: new Date().toISOString(),
  },
};

export const recruiterSlice = createSlice({
  name: "aiRecruiter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecruiterDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecruiterDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRecruiterDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch recruiter dashboard";
      });
  },
});

export default recruiterSlice.reducer;

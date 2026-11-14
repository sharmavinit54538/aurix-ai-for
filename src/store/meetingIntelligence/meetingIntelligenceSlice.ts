import { createSlice } from "@reduxjs/toolkit";
import { fetchMeetingIntelligenceDashboard } from "./meetingIntelligenceThunk";

export interface MeetingIntelligenceState {
  loading: boolean;
  error: string | null;
  data: any;
}

const initialState: MeetingIntelligenceState = {
  loading: false,
  error: null,
  data: {
    kpis: [
      { label: "Total Meetings Analyzed", value: 42, trend: "up" },
      { label: "Avg Meeting Time", value: "24 min", trend: "down" },
      { label: "Action Item Completion", value: "91%", trend: "up" },
    ],
    summary: { totalHoursSaved: 18.5, activeActionItems: 12 },
    actionItemsByWeek: [],
    volume: [],
    lastUpdated: new Date().toISOString(),
  },
};

export const meetingIntelligenceSlice = createSlice({
  name: "meetingIntelligence",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeetingIntelligenceDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMeetingIntelligenceDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMeetingIntelligenceDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch meeting intelligence";
      });
  },
});

export default meetingIntelligenceSlice.reducer;

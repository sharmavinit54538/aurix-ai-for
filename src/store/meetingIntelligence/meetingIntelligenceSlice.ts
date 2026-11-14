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
  data: null,
};

export const meetingIntelligenceSlice = createSlice({
  name: "meetingIntelligence",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeetingIntelligenceDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeetingIntelligenceDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMeetingIntelligenceDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch meeting intelligence";
      });
  },
});

export default meetingIntelligenceSlice.reducer;

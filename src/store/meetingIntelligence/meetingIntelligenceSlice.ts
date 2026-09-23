import { createSlice } from "@reduxjs/toolkit";
import type { MeetingIntelligenceState } from "./meetingIntelligenceTypes";
import {
  fetchMeetingActionItems,
  fetchMeetingIntelligenceDashboard,
  fetchMeetingIntelligenceKpi,
  fetchMeetingVolume,
} from "./meetingIntelligenceThunk";

const initialState: MeetingIntelligenceState = {
  loading: false,
  error: null,
  lastUpdated: null,
  summary: null,
  kpi: [],
  actionItems: [],
  charts: null,
};

export const meetingIntelligenceSlice = createSlice({
  name: "meetingIntelligence",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Consolidated Dashboard fetch
    builder
      .addCase(fetchMeetingIntelligenceDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeetingIntelligenceDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
        const data = action.payload;

        if (data.summary !== undefined) state.summary = data.summary;
        if (Array.isArray(data.kpi)) state.kpi = data.kpi;
        if (Array.isArray(data.actionItems)) state.actionItems = data.actionItems;
        if (data.charts) {
          state.charts = {
            actionItemsByWeek: Array.isArray(data.charts.actionItemsByWeek)
              ? data.charts.actionItemsByWeek
              : [],
            meetingVolume: Array.isArray(data.charts.meetingVolume)
              ? data.charts.meetingVolume
              : [],
          };
        } else if (data.actionItemsByWeek || data.meetingVolume) {
          state.charts = {
            actionItemsByWeek: Array.isArray(data.actionItemsByWeek)
              ? data.actionItemsByWeek
              : [],
            meetingVolume: Array.isArray(data.meetingVolume)
              ? data.meetingVolume
              : [],
          };
        }
      })
      .addCase(fetchMeetingIntelligenceDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to fetch meeting intelligence dashboard";
      });

    // Sub-thunks
    builder.addCase(fetchMeetingIntelligenceKpi.fulfilled, (state, action) => {
      state.kpi = Array.isArray(action.payload) ? action.payload : [];
    });

    builder.addCase(fetchMeetingActionItems.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        const first = action.payload[0] as any;
        if (first && "w" in first) {
          if (!state.charts) {
            state.charts = { actionItemsByWeek: action.payload as any, meetingVolume: [] };
          } else {
            state.charts.actionItemsByWeek = action.payload as any;
          }
        } else {
          state.actionItems = action.payload as any;
        }
      }
    });

    builder.addCase(fetchMeetingVolume.fulfilled, (state, action) => {
      if (Array.isArray(action.payload)) {
        if (!state.charts) {
          state.charts = { actionItemsByWeek: [], meetingVolume: action.payload };
        } else {
          state.charts.meetingVolume = action.payload;
        }
      }
    });
  },
});

export const { clearError, resetState } = meetingIntelligenceSlice.actions;
export default meetingIntelligenceSlice.reducer;

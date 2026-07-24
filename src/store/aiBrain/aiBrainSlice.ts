import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  fetchWorkforceInsights,
  fetchMeetingIntelligence,
  fetchEmployeeHealthSentiment,
} from "./aiBrainThunk";

export interface WorkforceInsightsData {
  workforceHealth: number;
  attritionRisk: number;
  productivityScore: number;
  headcount: number;
  [key: string]: any;
}

export interface MeetingIntelligenceData {
  meetingsAnalyzed: number;
  actionItems: number;
  followUps: number;
  avgDuration: string;
  [key: string]: any;
}

export interface EmployeeHealthData {
  wellbeingScore: number;
  burnoutRisk: number;
  avgWorkload: string;
  otHours: number;
  [key: string]: any;
}

interface AiBrainState {
  workforce: {
    data: WorkforceInsightsData | null;
    loading: boolean;
    error: string | null;
  };
  meeting: {
    data: MeetingIntelligenceData | null;
    loading: boolean;
    error: string | null;
  };
  health: {
    data: EmployeeHealthData | null;
    loading: boolean;
    error: string | null;
  };
}

const initialState: AiBrainState = {
  workforce: {
    data: null,
    loading: false,
    error: null,
  },
  meeting: {
    data: null,
    loading: false,
    error: null,
  },
  health: {
    data: null,
    loading: false,
    error: null,
  },
};

const aiBrainSlice = createSlice({
  name: "aiBrain",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Workforce Insights
    builder.addCase(fetchWorkforceInsights.pending, (state) => {
      state.workforce.loading = true;
      state.workforce.error = null;
    });
    builder.addCase(fetchWorkforceInsights.fulfilled, (state, action) => {
      state.workforce.loading = false;
      state.workforce.data = action.payload;
    });
    builder.addCase(fetchWorkforceInsights.rejected, (state, action) => {
      state.workforce.loading = false;
      state.workforce.error = action.error.message || "Failed to fetch workforce insights";
    });

    // Meeting Intelligence
    builder.addCase(fetchMeetingIntelligence.pending, (state) => {
      state.meeting.loading = true;
      state.meeting.error = null;
    });
    builder.addCase(fetchMeetingIntelligence.fulfilled, (state, action) => {
      state.meeting.loading = false;
      state.meeting.data = action.payload;
    });
    builder.addCase(fetchMeetingIntelligence.rejected, (state, action) => {
      state.meeting.loading = false;
      state.meeting.error = action.error.message || "Failed to fetch meeting intelligence";
    });

    // Employee Health & Sentiment
    builder.addCase(fetchEmployeeHealthSentiment.pending, (state) => {
      state.health.loading = true;
      state.health.error = null;
    });
    builder.addCase(fetchEmployeeHealthSentiment.fulfilled, (state, action) => {
      state.health.loading = false;
      state.health.data = action.payload;
    });
    builder.addCase(fetchEmployeeHealthSentiment.rejected, (state, action) => {
      state.health.loading = false;
      state.health.error = action.error.message || "Failed to fetch employee health & sentiment";
    });
  },
});

export default aiBrainSlice.reducer;

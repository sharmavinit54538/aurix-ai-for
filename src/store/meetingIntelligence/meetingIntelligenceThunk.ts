import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMeetingIntelligenceDashboard = createAsyncThunk(
  "meetingIntelligence/fetchDashboard",
  async () => {
    return {
      kpis: [
        { label: "Total Meetings Analyzed", value: 42, trend: "up" },
        { label: "Avg Meeting Time", value: "24 min", trend: "down" },
        { label: "Action Item Completion", value: "91%", trend: "up" },
      ],
      summary: { totalHoursSaved: 18.5, activeActionItems: 12 },
      actionItemsByWeek: [
        { week: "W1", completed: 15, open: 2 },
        { week: "W2", completed: 18, open: 3 },
      ],
      volume: [
        { day: "Mon", count: 8 },
        { day: "Tue", count: 12 },
        { day: "Wed", count: 10 },
        { day: "Thu", count: 9 },
        { day: "Fri", count: 3 },
      ],
      lastUpdated: new Date().toISOString(),
    };
  }
);

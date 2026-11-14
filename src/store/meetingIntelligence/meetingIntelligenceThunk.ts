import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api/client";

export const fetchMeetingIntelligenceDashboard = createAsyncThunk(
  "meetingIntelligence/fetchDashboard",
  async () => {
    const res = await api.get<any>("/ai/meeting-intelligence");
    const d = res?.data ?? res ?? {};
    return {
      kpis: Array.isArray(d.kpis) ? d.kpis : [],
      summary: d.summary ?? { totalHoursSaved: 0, activeActionItems: 0 },
      actionItemsByWeek: Array.isArray(d.actionItemsByWeek)
        ? d.actionItemsByWeek
        : [],
      volume: Array.isArray(d.volume) ? d.volume : [],
      lastUpdated: d.lastUpdated || new Date().toISOString(),
    };
  },
);

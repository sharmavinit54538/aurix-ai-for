import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api/client";

export const fetchLeaveAssistantDashboard = createAsyncThunk(
  "leaveAssistant/fetchDashboard",
  async () => {
    const res = await api.get<any>("/ai/leave-assistant");
    const d = res?.data ?? res ?? {};
    return {
      kpis: Array.isArray(d.kpis) ? d.kpis : [],
      summary: d.summary ?? { totalRequests: 0, autoApprovedCount: 0 },
      forecast: Array.isArray(d.forecast) ? d.forecast : [],
      distribution: Array.isArray(d.distribution) ? d.distribution : [],
      lastUpdated: d.lastUpdated || new Date().toISOString(),
    };
  },
);

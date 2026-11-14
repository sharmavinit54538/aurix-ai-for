import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api/client";

export const fetchPerformanceCoachDashboard = createAsyncThunk(
  "performanceCoach/fetchDashboard",
  async () => {
    const res = await api.get<any>("/ai/performance-coach");
    const d = res?.data ?? res ?? {};
    return {
      kpis: Array.isArray(d.kpis) ? d.kpis : [],
      summary: d.summary ?? { activeCoaches: 0, topSkillTarget: "" },
      progressTrend: Array.isArray(d.progressTrend) ? d.progressTrend : [],
      lastUpdated: d.lastUpdated || new Date().toISOString(),
    };
  },
);

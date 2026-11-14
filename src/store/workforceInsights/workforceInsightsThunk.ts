import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api/client";

export const fetchWorkforceInsightsDashboard = createAsyncThunk(
  "workforceInsights/fetchDashboard",
  async () => {
    const res = await api.get<any>("/ai/workforce-insights");
    const d = res?.data ?? res ?? {};
    return {
      kpis: Array.isArray(d.kpis) ? d.kpis : [],
      summary: d.summary ?? { totalDepartments: 0, openPositions: 0 },
      charts: Array.isArray(d.charts) ? d.charts : [],
      headcountTrends: Array.isArray(d.headcountTrends)
        ? d.headcountTrends
        : [],
      departmentComparison: Array.isArray(d.departmentComparison)
        ? d.departmentComparison
        : [],
      lastUpdated: d.lastUpdated || new Date().toISOString(),
    };
  },
);

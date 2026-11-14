import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api/client";

export const fetchComplianceDashboard = createAsyncThunk(
  "compliance/fetchDashboard",
  async () => {
    const res = await api.get<any>("/compliance/dashboard");
    const d = res?.data ?? res ?? {};
    return {
      kpis: Array.isArray(d.kpis) ? d.kpis : [],
      summary: d.summary ?? { totalAudits: 0, passed: 0, pending: 0 },
      trend: Array.isArray(d.trend) ? d.trend : [],
      risksByCategory: Array.isArray(d.risksByCategory)
        ? d.risksByCategory
        : [],
      lastUpdated: d.lastUpdated || new Date().toISOString(),
    };
  },
);

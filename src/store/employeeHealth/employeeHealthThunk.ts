import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api/client";

export const fetchEmployeeHealthDashboard = createAsyncThunk(
  "employeeHealth/fetchDashboard",
  async () => {
    const res = await api.get<any>("/ai/employee-health");
    const d = res?.data ?? res ?? {};
    return {
      kpis: Array.isArray(d.kpis) ? d.kpis : [],
      summary: d.summary ?? { totalMonitored: 0, highBurnoutCount: 0 },
      burnoutTrend: Array.isArray(d.burnoutTrend) ? d.burnoutTrend : [],
      overtimeByTeam: Array.isArray(d.overtimeByTeam) ? d.overtimeByTeam : [],
      lastUpdated: d.lastUpdated || new Date().toISOString(),
    };
  },
);

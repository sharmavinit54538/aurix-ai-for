import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchEmployeeHealthDashboard = createAsyncThunk(
  "employeeHealth/fetchDashboard",
  async () => {
    return {
      kpis: [
        { label: "Overall Well-being Index", value: "92%", trend: "up" },
        { label: "Burnout Risk Level", value: "Low (4.2%)", trend: "down" },
        { label: "Work-Life Harmony Score", value: "8.8 / 10", trend: "up" },
      ],
      summary: { totalMonitored: 248, highBurnoutCount: 2 },
      burnoutTrend: [
        { month: "Jan", risk: 6 },
        { month: "Feb", risk: 5 },
        { month: "Mar", risk: 4.2 },
      ],
      overtimeByTeam: [
        { team: "Engineering", hours: 14 },
        { team: "Design", hours: 6 },
        { team: "Sales", hours: 10 },
      ],
      lastUpdated: new Date().toISOString(),
    };
  }
);

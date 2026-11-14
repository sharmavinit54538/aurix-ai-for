import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPerformanceCoachDashboard = createAsyncThunk(
  "performanceCoach/fetchDashboard",
  async () => {
    return {
      kpis: [
        { label: "Coaching Sessions Completed", value: 38, trend: "up" },
        { label: "Goal Progress Score", value: "91%", trend: "up" },
        { label: "Skill Mastery Index", value: "8.6 / 10", trend: "up" },
      ],
      summary: { activeCoaches: 6, topSkillTarget: "Distributed Architecture" },
      progressTrend: [
        { month: "Jan", progress: 78 },
        { month: "Feb", progress: 85 },
        { month: "Mar", progress: 91 },
      ],
      lastUpdated: new Date().toISOString(),
    };
  }
);

import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchWorkforceInsightsDashboard = createAsyncThunk(
  "workforceInsights/fetchDashboard",
  async () => {
    return {
      kpis: [
        { label: "Total Headcount", value: 248, trend: "up" },
        { label: "Retention Rate", value: "95.8%", trend: "up" },
        { label: "Internal Mobility Rate", value: "14.2%", trend: "up" },
      ],
      summary: { totalDepartments: 6, openPositions: 18 },
      charts: [
        { month: "Jan", headcount: 235 },
        { month: "Feb", headcount: 242 },
        { month: "Mar", headcount: 248 },
      ],
      headcountTrends: [
        { month: "Jan", engineering: 110, sales: 50, ops: 40 },
        { month: "Feb", engineering: 115, sales: 52, ops: 42 },
        { month: "Mar", engineering: 120, sales: 55, ops: 45 },
      ],
      departmentComparison: [
        { department: "Engineering", headcount: 120, budgetUtilization: "94%" },
        { department: "Sales", headcount: 55, budgetUtilization: "88%" },
        { department: "Operations", headcount: 45, budgetUtilization: "91%" },
      ],
      lastUpdated: new Date().toISOString(),
    };
  }
);

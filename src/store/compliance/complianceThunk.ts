import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchComplianceDashboard = createAsyncThunk(
  "compliance/fetchDashboard",
  async () => {
    return {
      kpis: [
        { label: "Overall Compliance", value: "98.4%", trend: "up" },
        { label: "Pending Audit Items", value: 3, trend: "down" },
        { label: "Risk Score", value: "Low", trend: "neutral" },
      ],
      summary: { totalAudits: 14, passed: 13, pending: 1 },
      trend: [
        { month: "Jan", score: 96 },
        { month: "Feb", score: 98 },
        { month: "Mar", score: 98.4 },
      ],
      risksByCategory: [
        { category: "Data Privacy", riskLevel: "Low" },
        { category: "Labor Laws", riskLevel: "Low" },
        { category: "Tax Filing", riskLevel: "None" },
      ],
      lastUpdated: new Date().toISOString(),
    };
  }
);

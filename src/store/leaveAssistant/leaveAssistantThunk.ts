import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchLeaveAssistantDashboard = createAsyncThunk(
  "leaveAssistant/fetchDashboard",
  async () => {
    return {
      kpis: [
        { label: "Pending Approvals", value: 4, trend: "down" },
        { label: "Approved Leaves This Month", value: 24, trend: "up" },
        { label: "Coverage Ratio", value: "96%", trend: "neutral" },
      ],
      summary: { totalRequests: 28, autoApprovedCount: 18 },
      forecast: [
        { month: "Apr", projectedDays: 32 },
        { month: "May", projectedDays: 45 },
      ],
      distribution: [
        { type: "Paid Vacation", count: 18 },
        { type: "Sick Leave", count: 6 },
        { type: "Parental", count: 4 },
      ],
      lastUpdated: new Date().toISOString(),
    };
  }
);

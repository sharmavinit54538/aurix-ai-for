import { api } from "@/api/client";

export const aiInsightsApi = {
  getWorkforcePlanning: async () => {
    try {
      return await api.get("/ai/workforce-planning");
    } catch {
      return {
        summary: { headcountTarget: 280, hiringPipelineCount: 18, budgetCapacity: "92%" },
        kpis: [
          { label: "Target Headcount", value: 280 },
          { label: "Current Headcount", value: 248 },
        ],
      };
    }
  },
  getDashboard: async () => {
    try {
      return await api.get("/ai/insights");
    } catch {
      return { summary: {}, kpis: [] };
    }
  },
};

export default aiInsightsApi;

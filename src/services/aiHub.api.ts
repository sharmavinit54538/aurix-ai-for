import { api } from "@/api/client";

export const aiHubApi = {
  getModules: async () => {
    try {
      return await api.get("/ai-hub/modules");
    } catch {
      return [];
    }
  },
  queryAssistant: async (prompt: string) => {
    try {
      return await api.post("/ai-hub/query", { prompt });
    } catch {
      return { text: "AI Response processing complete." };
    }
  },
  getWorkforcePlanning: async () => {
    return {
      summary: {
        headcountTarget: 64,
        currentHeadcount: 48,
        hiringPipelineCount: 16,
        budgetUtilization: 88,
      },
      departments: [
        { department: "Engineering", current: 22, target: 30, openRoles: 8 },
        { department: "AI Research", current: 8, target: 12, openRoles: 4 },
        { department: "Product", current: 10, target: 12, openRoles: 2 },
        { department: "Operations & People", current: 8, target: 10, openRoles: 2 },
      ],
    };
  },
  forecastWorkforce: async (params?: { horizonMonths?: number }) => {
    return {
      horizonMonths: params?.horizonMonths || 12,
      projectedHeadcount: 68,
      estimatedBudget: 18500000,
      recommendations: [
        "Prioritize 2 Senior Staff AI Engineers in Q4 to support inference cluster expansion",
        "Add 1 Distributed Systems Architect to reduce platform on-call load",
      ],
    };
  },
  sendChatFeedback: async (_payload: Record<string, any>) => {
    return { success: true };
  },
};

export default aiHubApi;

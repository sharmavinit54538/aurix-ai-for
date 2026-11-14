import { api } from "@/api/client";

export const aiInsightsApi = {
  getWorkforcePlanning: async () => {
    const res = await api.get<any>("/ai/workforce-planning");
    return res?.data ?? res ?? { summary: null, kpis: [] };
  },
  getDashboard: async () => {
    const res = await api.get<any>("/ai/insights");
    return res?.data ?? res ?? { summary: null, kpis: [] };
  },
};

export default aiInsightsApi;

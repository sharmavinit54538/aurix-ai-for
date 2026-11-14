import { api } from "@/api/client";

export const analyticsApi = {
  getMetrics: async () => {
    try {
      return await api.get("/analytics/metrics");
    } catch {
      return { kpis: [] };
    }
  },
};

export default analyticsApi;

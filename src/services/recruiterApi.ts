import { api } from "@/api/client";

export const recruiterApi = {
  getDashboard: async () => {
    try {
      return await api.get("/ai-recruiter/dashboard");
    } catch {
      return { kpis: [], summary: {}, candidates: [] };
    }
  },
};

export default recruiterApi;

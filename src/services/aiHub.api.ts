import { api } from "@/api/client";

export const aiHubApi = {
  getModules: async () => {
    const res = await api.get<any>("/ai-hub/modules");
    const d = res?.data ?? res;
    return Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
  },
  queryAssistant: async (prompt: string) => {
    return api.post("/ai-hub/query", { prompt });
  },
  getWorkforcePlanning: async () => {
    const res = await api.get<any>("/ai-hub/workforce-planning");
    return res?.data ?? res ?? null;
  },
  forecastWorkforce: async (params?: { horizonMonths?: number }) => {
    const res = await api.post<any>("/ai-hub/workforce-planning/forecast", {
      horizonMonths: params?.horizonMonths ?? 12,
    });
    return res?.data ?? res ?? null;
  },
  sendChatFeedback: async (payload: Record<string, any>) => {
    return api.post("/ai-hub/feedback", payload);
  },
};

export default aiHubApi;

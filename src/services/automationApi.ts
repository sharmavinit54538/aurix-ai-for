import { api } from "@/api/client";

export const automationApi = {
  getRules: async () => {
    try {
      return await api.get("/automation/rules");
    } catch {
      return [];
    }
  },
  toggleRule: async (ruleId: string, enabled: boolean) => {
    return api.patch(`/automation/rules/${ruleId}`, { enabled });
  },
};

export default automationApi;

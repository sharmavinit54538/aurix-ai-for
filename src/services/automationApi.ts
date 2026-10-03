import { apiInstance } from "@/api";

export interface AutomationRuleResponse {
  id: string;
  name: string;
  description?: string;
  enabled?: boolean;
  total_runs?: number;
  last_triggered?: string;
  trigger_event?: string;
  [key: string]: unknown;
}

export const automationApi = {
  getAutomationRules: async (): Promise<AutomationRuleResponse[]> => {
    const res = await apiInstance.get("/automations/rules");
    return Array.isArray(res.data) ? res.data : res.data?.items || res.data?.rules || [];
  },

  createAutomationRule: async (payload: Record<string, unknown>): Promise<AutomationRuleResponse> => {
    const res = await apiInstance.post("/automations/rules", payload);
    return res.data;
  },

  toggleAutomationRule: async (ruleId: string) => {
    const res = await apiInstance.post(`/global-notifications/automation-rules/${ruleId}/toggle`);
    return res.data;
  },

  testAutomationRule: async (ruleId: string) => {
    const res = await apiInstance.post(`/global-notifications/automation-rules/${ruleId}/test`);
    return res.data;
  },
};

export default automationApi;

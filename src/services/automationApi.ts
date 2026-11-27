import apiInstance from "@/api/apiInstance";
import { RECRUITMENT_ENDPOINTS } from "@/api/endpoints";

export interface AutomationRulePayload {
  name: string;
  description?: string;
  trigger?: string;
  trigger_event?: string;
  condition?: string;
  conditions?: Record<string, unknown>;
  action?: string;
  actions?: Record<string, unknown>[];
  is_active?: boolean;
  [key: string]: unknown;
}

function createUnsupportedOperationError(message: string): Error & {
  status: number;
  isBackendBlocker: boolean;
} {
  const err = new Error(message) as Error & {
    status: number;
    isBackendBlocker: boolean;
  };
  err.status = 501;
  err.isBackendBlocker = true;
  return err;
}

export const automationApi = {
  /**
   * List recruitment automation rules (`GET /api/v1/automations/rules`).
   */
  getAutomationRules: async () => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.AUTOMATIONS_RULES);
    return res.data?.data ?? res.data;
  },

  /**
   * Backwards-compatible alias for `getAutomationRules`.
   */
  getRules: async () => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.AUTOMATIONS_RULES);
    return res.data?.data ?? res.data;
  },

  /**
   * Create a recruitment automation rule (`POST /api/v1/automations/rules`).
   */
  createAutomationRule: async (payload: AutomationRulePayload) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.AUTOMATIONS_RULES, payload);
    return res.data?.data ?? res.data;
  },

  /**
   * Toggle rule endpoint does not exist in backend OpenAPI (`openapi.json` has only GET/POST /api/v1/automations/rules).
   */
  toggleAutomationRule: async (_ruleId: string, _enabled?: boolean) => {
    throw createUnsupportedOperationError(
      "Updating or toggling automation rules is not supported by the backend API (missing PATCH /api/v1/automations/rules/{id}).",
    );
  },

  /**
   * Backwards-compatible alias guarding unsupported toggle operation.
   */
  toggleRule: async (ruleId: string, enabled?: boolean) => {
    return automationApi.toggleAutomationRule(ruleId, enabled);
  },

  /**
   * Test rule execution endpoint does not exist in backend OpenAPI.
   */
  testAutomationRule: async (_ruleId: string) => {
    throw createUnsupportedOperationError(
      "Testing automation rules is not supported by the backend API (missing test execution endpoint).",
    );
  },
};

export default automationApi;

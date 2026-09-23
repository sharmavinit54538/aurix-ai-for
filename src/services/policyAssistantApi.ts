import apiInstance from "@/api/apiInstance";
import type {
  PolicyAnswerResponse,
  PolicyAssistantDashboardData,
  PolicyAssistantSummary,
} from "@/store/policyAssistant/policyAssistantTypes";

export function normalizePolicyAssistantData(
  data: any,
): PolicyAssistantDashboardData {
  if (!data || typeof data !== "object") {
    return {
      summary: undefined,
      recentQueries: [],
    };
  }

  let summary: PolicyAssistantSummary | undefined = undefined;
  if (data.summary && typeof data.summary === "object") {
    summary = {
      queriesCount: Number(data.summary.queriesCount ?? 0),
      complianceRate: Number(data.summary.complianceRate ?? 100),
      lastAnalysis: data.summary.lastAnalysis,
    };
  } else if (data.queriesCount !== undefined || data.complianceRate !== undefined) {
    summary = {
      queriesCount: Number(data.queriesCount ?? 0),
      complianceRate: Number(data.complianceRate ?? 100),
      lastAnalysis: data.lastAnalysis,
    };
  }

  return {
    summary,
    recentQueries: Array.isArray(data.recentQueries) ? data.recentQueries : [],
  };
}

export const policyAssistantApi = {
  async getDashboard(): Promise<PolicyAssistantDashboardData> {
    try {
      const response = await apiInstance.get("/policy-assistant/dashboard");
      const data = response.data?.data ?? response.data;
      return normalizePolicyAssistantData(data);
    } catch {
      // Fallback to existing ai-hub endpoint if primary not found
      const response = await apiInstance.get("/ai-hub/policy-assistant");
      const data = response.data?.data ?? response.data;
      return normalizePolicyAssistantData(data);
    }
  },

  async askQuestion(question: string): Promise<PolicyAnswerResponse> {
    try {
      const response = await apiInstance.post("/policy-assistant/ask", { question });
      const data = response.data?.data ?? response.data;
      return {
        question: data?.question ?? question,
        answer: data?.answer ?? data?.reply ?? data?.message ?? "",
        confidence: data?.confidence,
        sources: Array.isArray(data?.sources) ? data.sources : [],
      };
    } catch (err) {
      // Fallback to existing ai-hub endpoint
      const response = await apiInstance.post("/ai-hub/policy-assistant/ask", { question });
      const data = response.data?.data ?? response.data;
      return {
        question: data?.question ?? question,
        answer: data?.answer ?? data?.reply ?? data?.message ?? "",
        confidence: data?.confidence,
        sources: Array.isArray(data?.sources) ? data.sources : [],
      };
    }
  },
};

export default policyAssistantApi;

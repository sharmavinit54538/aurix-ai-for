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
      lastAnalysis: data.summary.lastAnalysis ?? "Live Knowledge Base",
    };
  } else if (data.queriesCount !== undefined || data.complianceRate !== undefined) {
    summary = {
      queriesCount: Number(data.queriesCount ?? 0),
      complianceRate: Number(data.complianceRate ?? 100),
      lastAnalysis: data.lastAnalysis ?? "Live Knowledge Base",
    };
  }

  return {
    summary,
    recentQueries: Array.isArray(data.recentQueries) ? data.recentQueries : [],
  };
}

export const policyAssistantApi = {
  /**
   * Policy Assistant is a chat-based assistant without a backend dashboard endpoint.
   * Returns a baseline state without making invalid network calls.
   */
  async getDashboard(): Promise<PolicyAssistantDashboardData> {
    return {
      summary: {
        queriesCount: 0,
        complianceRate: 100,
        lastAnalysis: "Live Knowledge Base",
      },
      recentQueries: [],
    };
  },

  /**
   * Submit query to real AI Policy Assistant chat endpoint.
   * Calls POST /api/v1/ai/policy/chat.
   */
  async askQuestion(question: string, conversationId?: string): Promise<PolicyAnswerResponse> {
    const response = await apiInstance.post("/ai/policy/chat", {
      query: question,
      conversation_id: conversationId,
    });
    const data = response.data?.data ?? response.data;
    const sources: string[] = Array.isArray(data?.sources)
      ? data.sources.map((s: any) =>
          typeof s === "string"
            ? s
            : s?.document
            ? `${s.document}${s.section ? ` (${s.section})` : ""}`
            : JSON.stringify(s),
        )
      : [];

    return {
      question: data?.question ?? data?.query ?? question,
      answer: data?.answer ?? data?.reply ?? data?.message ?? "",
      confidence: data?.confidence,
      sources,
    };
  },
};

export default policyAssistantApi;

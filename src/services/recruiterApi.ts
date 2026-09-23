import apiInstance from "@/api/apiInstance";
import type {
  CandidateFunnelItem,
  JdMatchDistributionItem,
  RecruiterCharts,
  RecruiterDashboardData,
  RecruiterKpiItem,
  RecruiterSummary,
} from "@/store/recruiter/recruiterTypes";

export function normalizeRecruiterData(
  data: any,
): RecruiterDashboardData {
  if (!data || typeof data !== "object") {
    return {
      summary: undefined,
      kpi: [],
      charts: undefined,
    };
  }

  let summary: RecruiterSummary | undefined = undefined;
  if (data.summary && typeof data.summary === "object") {
    summary = {
      openRoles: Number(data.summary.openRoles ?? 0),
      candidatesScreened: data.summary.candidatesScreened ?? 0,
      topMatches: Number(data.summary.topMatches ?? 0),
      timeToHire: data.summary.timeToHire ?? "—",
      jdMatchAvg: data.summary.jdMatchAvg,
      lastAnalysis: data.summary.lastAnalysis,
    };
  } else if (
    data.openRoles !== undefined ||
    data.candidatesScreened !== undefined ||
    data.topMatches !== undefined ||
    data.timeToHire !== undefined
  ) {
    summary = {
      openRoles: Number(data.openRoles ?? 0),
      candidatesScreened: data.candidatesScreened ?? 0,
      topMatches: Number(data.topMatches ?? 0),
      timeToHire: data.timeToHire ?? "—",
      jdMatchAvg: data.jdMatchAvg,
      lastAnalysis: data.lastAnalysis,
    };
  }

  const candidateFunnel: CandidateFunnelItem[] = Array.isArray(data.charts?.candidateFunnel)
    ? data.charts.candidateFunnel
    : Array.isArray(data.candidateFunnel)
    ? data.candidateFunnel
    : [];

  const jdMatchDistribution: JdMatchDistributionItem[] = Array.isArray(
    data.charts?.jdMatchDistribution,
  )
    ? data.charts.jdMatchDistribution
    : Array.isArray(data.jdMatchDistribution)
    ? data.jdMatchDistribution
    : [];

  const charts: RecruiterCharts = {
    candidateFunnel,
    jdMatchDistribution,
  };

  return {
    summary,
    kpi: Array.isArray(data.kpi) ? data.kpi : [],
    charts,
  };
}

export const recruiterApi = {
  async getDashboard(): Promise<RecruiterDashboardData> {
    try {
      const response = await apiInstance.get("/recruiter/dashboard");
      const data = response.data?.data ?? response.data;
      return normalizeRecruiterData(data);
    } catch {
      // Fallback to ai-hub recruiter endpoint
      const response = await apiInstance.get("/ai-hub/recruiter");
      const data = response.data?.data ?? response.data;
      return normalizeRecruiterData(data);
    }
  },

  async getKpi(): Promise<RecruiterKpiItem[]> {
    const response = await apiInstance.get("/recruiter/kpi");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  async getFunnel(): Promise<CandidateFunnelItem[]> {
    const response = await apiInstance.get("/recruiter/funnel");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  async getDistribution(): Promise<JdMatchDistributionItem[]> {
    const response = await apiInstance.get("/recruiter/distribution");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },
};

export default recruiterApi;

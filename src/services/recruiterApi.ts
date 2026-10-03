import apiInstance from "@/api/apiInstance";
import type {
  CandidateFunnelItem,
  JdMatchDistributionItem,
  RecruiterCharts,
  RecruiterDashboardData,
  RecruiterKpiItem,
  RecruiterSummary,
} from "@/store/recruiter/recruiterTypes";

export function normalizeCandidateFunnel(data: any): CandidateFunnelItem[] {
  const rawList = Array.isArray(data)
    ? data
    : Array.isArray(data?.funnel)
    ? data.funnel
    : Array.isArray(data?.items)
    ? data.items
    : [];

  return rawList.map((item: any, idx: number) => {
    const w = item.w ?? item.week ?? `W${idx + 1}`;
    const applied = Number(item.applied ?? 0);
    const shortlist = Number(item.shortlist ?? item.shortlisted ?? 0);
    const offers = Number(item.offers ?? item.offer_accepted ?? item.offer_sent ?? 0);

    return {
      w,
      applied,
      shortlist,
      offers,
    };
  });
}

export function normalizeMatchDistribution(data: any): JdMatchDistributionItem[] {
  if (Array.isArray(data)) {
    return data.map((item: any) => ({
      band: String(item.band ?? item.label ?? ""),
      n: Number(item.n ?? item.count ?? item.candidates ?? 0),
    }));
  }

  if (data && typeof data === "object") {
    const nested = data.distribution ?? data.items ?? data.buckets;
    if (Array.isArray(nested)) {
      return normalizeMatchDistribution(nested);
    }

    if (
      data.band_90_100 !== undefined ||
      data.band_80_89 !== undefined ||
      data.band_70_79 !== undefined ||
      data.band_60_69 !== undefined ||
      data.below_60 !== undefined
    ) {
      return [
        { band: "90–100%", n: Number(data.band_90_100 ?? 0) },
        { band: "80–89%", n: Number(data.band_80_89 ?? 0) },
        { band: "70–79%", n: Number(data.band_70_79 ?? 0) },
        { band: "60–69%", n: Number(data.band_60_69 ?? 0) },
        { band: "<60%", n: Number(data.below_60 ?? 0) },
      ];
    }
  }

  return [];
}

export function normalizeRecruiterData(
  data: any,
): RecruiterDashboardData {
  if (!data || typeof data !== "object") {
    return {
      summary: undefined,
      kpi: [],
      charts: {
        candidateFunnel: [],
        jdMatchDistribution: [],
      },
      candidateFunnel: [],
      jdMatchDistribution: [],
    };
  }

  let summary: RecruiterSummary | undefined = undefined;
  const rawSummary = data.summary && typeof data.summary === "object" ? data.summary : data;

  const openRoles = rawSummary.open_roles ?? rawSummary.openRoles;
  const candidatesScreened = rawSummary.candidates_screened ?? rawSummary.candidatesScreened;
  const topMatches = rawSummary.top_matches ?? rawSummary.topMatches;
  const timeToHire = rawSummary.average_time_to_hire ?? rawSummary.time_to_hire ?? rawSummary.timeToHire;

  if (
    openRoles !== undefined ||
    candidatesScreened !== undefined ||
    topMatches !== undefined ||
    timeToHire !== undefined
  ) {
    summary = {
      openRoles: openRoles != null ? Number(openRoles) : null,
      candidatesScreened:
        typeof candidatesScreened === "number"
          ? candidatesScreened
          : candidatesScreened != null
          ? Number(candidatesScreened) || candidatesScreened
          : null,
      topMatches: topMatches != null ? Number(topMatches) : null,
      timeToHire:
        timeToHire != null
          ? typeof timeToHire === "number"
            ? Math.round(timeToHire * 10) / 10
            : timeToHire
          : null,
      jdMatchAvg: rawSummary.jd_match_avg ?? rawSummary.jdMatchAvg ?? null,
      lastAnalysis: rawSummary.last_analysis ?? rawSummary.lastAnalysis ?? null,
    };
  }

  const derivedKpi: RecruiterKpiItem[] = summary
    ? [
        {
          label: "Open Roles",
          score: summary.openRoles,
          hint: "Active job openings",
          icon: "Briefcase",
        },
        {
          label: "Candidates Screened",
          score:
            typeof summary.candidatesScreened === "number"
              ? summary.candidatesScreened.toLocaleString()
              : summary.candidatesScreened,
          hint: "Resumes parsed & scored",
          icon: "FileSearch",
        },
        {
          label: "Top Matches",
          score: summary.topMatches,
          hint: "Match score ≥ 75%",
          icon: "Trophy",
        },
        {
          label: "Time to Hire",
          score:
            typeof summary.timeToHire === "number"
              ? `${summary.timeToHire}d`
              : summary.timeToHire,
          hint: "Average days to hire",
          icon: "BarChart3",
          invert: true,
        },
      ]
    : [];

  const candidateFunnel = normalizeCandidateFunnel(
    data.charts?.candidateFunnel ?? data.candidateFunnel ?? data.funnel ?? []
  );

  const jdMatchDistribution = normalizeMatchDistribution(
    data.charts?.jdMatchDistribution ?? data.jdMatchDistribution ?? data.distribution ?? data.matchDistribution ?? []
  );

  const charts: RecruiterCharts = {
    candidateFunnel,
    jdMatchDistribution,
  };

  return {
    summary,
    kpi: Array.isArray(data.kpi) && data.kpi.length > 0 ? data.kpi : derivedKpi,
    charts,
    candidateFunnel,
    jdMatchDistribution,
  };
}

export const recruiterApi = {
  async getDashboard(): Promise<RecruiterDashboardData> {
    const [dashRes, funnelRes, distRes] = await Promise.allSettled([
      apiInstance.get("/ai/recruiter/dashboard"),
      this.getFunnel(),
      this.getMatchDistribution(),
    ]);

    if (dashRes.status === "rejected") {
      throw dashRes.reason;
    }

    const rawData =
      dashRes.status === "fulfilled"
        ? (dashRes.value.data?.data ?? dashRes.value.data)
        : {};

    const funnel = funnelRes.status === "fulfilled" ? funnelRes.value : [];
    const dist = distRes.status === "fulfilled" ? distRes.value : [];

    return normalizeRecruiterData({
      ...(typeof rawData === "object" && rawData !== null ? rawData : {}),
      candidateFunnel: funnel.length > 0 ? funnel : (rawData?.candidateFunnel ?? []),
      jdMatchDistribution: dist.length > 0 ? dist : (rawData?.jdMatchDistribution ?? []),
      charts: {
        candidateFunnel: funnel.length > 0 ? funnel : (rawData?.charts?.candidateFunnel ?? []),
        jdMatchDistribution: dist.length > 0 ? dist : (rawData?.charts?.jdMatchDistribution ?? []),
      },
    });
  },

  async getKpi(): Promise<RecruiterKpiItem[]> {
    const response = await apiInstance.get("/ai/recruiter/dashboard");
    const data = response.data?.data ?? response.data;
    const normalized = normalizeRecruiterData(data);
    return normalized.kpi ?? [];
  },

  async getFunnel(): Promise<CandidateFunnelItem[]> {
    const response = await apiInstance.get("/ai/recruiter/funnel");
    const data = response.data?.data ?? response.data;
    return normalizeCandidateFunnel(data);
  },

  async getMatchDistribution(): Promise<JdMatchDistributionItem[]> {
    const response = await apiInstance.get("/ai/recruiter/match-distribution");
    const data = response.data?.data ?? response.data;
    return normalizeMatchDistribution(data);
  },

  async getDistribution(): Promise<JdMatchDistributionItem[]> {
    return this.getMatchDistribution();
  },

  async getAnalytics(): Promise<any> {
    const response = await apiInstance.get("/ai/recruiter/analytics");
    return response.data?.data ?? response.data;
  },
};

export default recruiterApi;

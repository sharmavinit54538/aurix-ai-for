import apiInstance from "@/api/apiInstance";

export const screeningApi = {
  getScreenings: async () => {
    const res = await apiInstance.get("/recruitment/screening");
    const d = res.data?.data ?? res.data;
    return Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
  },

  screenCandidate: async (candidateId: string) => {
    const res = await apiInstance.post(
      `/recruitment/screening/candidates/${encodeURIComponent(candidateId)}`,
      {},
    );
    return res.data?.data ?? res.data;
  },

  runScreening: async (
    jobId: string,
    payload?: { application_ids?: string[]; model?: string; force?: boolean },
  ) => {
    const res = await apiInstance.post(
      `/recruitment/screening/jobs/${encodeURIComponent(jobId)}/run`,
      payload ?? {},
    );
    return res.data?.data ?? res.data;
  },

  getScreeningResults: async (jobId: string) => {
    const res = await apiInstance.get(
      `/recruitment/screening/jobs/${encodeURIComponent(jobId)}/results`,
    );
    const d = res.data?.data ?? res.data ?? {};
    return {
      thresholds: d.thresholds ?? { shortlist: 75, reject: 45 },
      run: d.run ?? null,
      results: Array.isArray(d.results)
        ? d.results
        : Array.isArray(d.items)
          ? d.items
          : [],
    };
  },

  submitDecision: async (
    screeningId: string,
    payload: {
      action: "SHORTLIST" | "REJECT" | "KEEP_REVIEW";
      reason?: string;
    },
  ) => {
    const res = await apiInstance.post(
      `/recruitment/screening/${encodeURIComponent(screeningId)}/decision`,
      payload,
    );
    return res.data;
  },
};

export default screeningApi;

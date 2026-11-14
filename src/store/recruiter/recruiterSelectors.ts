import type { RootState } from "@/redux/store";

export const selectRecruiterLoading = (state: RootState) => state.aiRecruiter?.loading ?? false;
export const selectRecruiterError = (state: RootState) => state.aiRecruiter?.error ?? null;
export const selectRecruiterKPIs = (state: RootState) => state.aiRecruiter?.data?.kpis ?? [];
export const selectRecruiterSummary = (state: RootState) => state.aiRecruiter?.data?.summary ?? {};
export const selectRecruiterCandidates = (state: RootState) => state.aiRecruiter?.data?.candidates ?? [];
export const selectRecruiterCandidateFunnel = (state: RootState) => state.aiRecruiter?.data?.candidateFunnel ?? [
  { stage: "Applied", count: 142 },
  { stage: "Screened", count: 64 },
  { stage: "Interviewed", count: 28 },
  { stage: "Offered", count: 8 },
];
export const selectRecruiterJdMatchDistribution = (state: RootState) => state.aiRecruiter?.data?.jdMatchDistribution ?? [
  { range: "90-100%", count: 18 },
  { range: "80-89%", count: 32 },
  { range: "70-79%", count: 14 },
];
export const selectRecruiterLastUpdated = (state: RootState) => state.aiRecruiter?.data?.lastUpdated ?? null;

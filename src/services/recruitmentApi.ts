import { apiInstance } from "@/api";
import type { RecruitmentDataPayload } from "@/features/admin/recruitment/recruitmentTypes";
import type {
  Candidate,
  Interview,
  Job,
  Offer,
} from "@/features/admin/recruitment/types";
import {
  extractItems,
  mapCandidateToFrontend,
  mapInterviewToFrontend,
  mapJobToFrontend,
  mapOfferToFrontend,
} from "@/features/admin/recruitment/utils/apiMappers";

export const recruitmentApi = {
  fetchRecruitmentDashboardData: async (): Promise<RecruitmentDataPayload> => {
    const [jobsRes, candidatesRes, interviewsRes, offersRes] =
      await Promise.allSettled([
        apiInstance.get("/jobs"),
        apiInstance.get("/candidates"),
        apiInstance.get("/interviews"),
        apiInstance.get("/offers"),
      ]);

    const jobs: Job[] =
      jobsRes.status === "fulfilled"
        ? extractItems(jobsRes.value.data).map(mapJobToFrontend)
        : [];
    const candidates: Candidate[] =
      candidatesRes.status === "fulfilled"
        ? extractItems(candidatesRes.value.data).map(mapCandidateToFrontend)
        : [];
    const interviews: Interview[] =
      interviewsRes.status === "fulfilled"
        ? extractItems(interviewsRes.value.data).map(mapInterviewToFrontend)
        : [];
    const offers: Offer[] =
      offersRes.status === "fulfilled"
        ? extractItems(offersRes.value.data).map(mapOfferToFrontend)
        : [];

    return {
      jobs,
      candidates,
      interviews,
      offers,
    };
  },

  getPipeline: async (): Promise<Candidate[]> => {
    const res = await apiInstance.get("/candidates");
    return extractItems(res.data).map(mapCandidateToFrontend);
  },

  getJobs: async (): Promise<Job[]> => {
    const res = await apiInstance.get("/jobs");
    return extractItems(res.data).map(mapJobToFrontend);
  },

  getCandidates: async (): Promise<Candidate[]> => {
    const res = await apiInstance.get("/candidates");
    return extractItems(res.data).map(mapCandidateToFrontend);
  },

  getRequisitions: async () => {
    const res = await apiInstance.get("/recruitment/requisitions");
    const payload = res.data?.data ?? res.data;
    const items = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.items)
        ? payload.items
        : [];
    return { items, total: Number(payload?.total ?? items.length) };
  },

  createRequisition: async (payload: Record<string, any>) => {
    const res = await apiInstance.post("/recruitment/requisitions", payload);
    return res.data?.data ?? res.data;
  },

  approveRequisition: async (id: string) => {
    const res = await apiInstance.post(
      `/recruitment/requisitions/${encodeURIComponent(id)}/approve`,
      {},
    );
    return res.data?.data ?? res.data ?? { success: true, id };
  },

  addCandidateNote: async (candidateId: string, note: string) => {
    const res = await apiInstance.post(
      `/candidates/${encodeURIComponent(candidateId)}/notes`,
      { text: note, note },
    );
    return res.data?.data ?? res.data;
  },

  generateJobDescription: async (payload: Record<string, any>) => {
    const res = await apiInstance.post(
      "/recruitment/jobs/generate-description",
      payload,
    );
    return res.data;
  },

  modifyJobDescription: async (payload: {
    current_description: string;
    action: string;
    custom_instruction?: string;
  }) => {
    const res = await apiInstance.post(
      "/recruitment/jobs/modify-description",
      payload,
    );
    return res.data;
  },

  publishJob: async (jobId: string, payload: Record<string, any>) => {
    const res = await apiInstance.post(
      `/jobs/${encodeURIComponent(jobId)}/publish`,
      payload,
    );
    return res.data?.data ?? res.data;
  },
};

export default recruitmentApi;

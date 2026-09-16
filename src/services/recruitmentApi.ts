import apiInstance from "@/api/apiInstance";
import type { Candidate, Interview, Job, Offer, Stage } from "@/features/admin/recruitment/types";
import { parseRecruitmentApiResults } from "@/features/admin/recruitment/utils/apiMappers";
import type { RecruitmentDataPayload } from "@/features/admin/recruitment/recruitmentTypes";

function toBodyResult(
  result: PromiseSettledResult<{ data: unknown }>,
): PromiseSettledResult<unknown> {
  return result.status === "fulfilled"
    ? { status: "fulfilled", value: result.value.data }
    : result;
}

export const recruitmentApi = {
  // Jobs
  getJobs: async (params?: Record<string, string | number>) => {
    const res = await apiInstance.get("/jobs", { params });
    return res.data;
  },

  getJobById: async (id: string) => {
    const res = await apiInstance.get(`/jobs/${id}`);
    return res.data;
  },

  createJob: async (payload: Record<string, unknown>) => {
    const res = await apiInstance.post("/jobs", payload);
    return res.data;
  },

  updateJob: async (id: string, payload: Record<string, unknown>) => {
    const res = await apiInstance.put(`/jobs/${id}`, payload);
    return res.data;
  },

  deleteJob: async (id: string) => {
    const res = await apiInstance.delete(`/jobs/${id}`);
    return res.data;
  },

  closeJob: async (id: string) => {
    const res = await apiInstance.post(`/jobs/${id}/close`);
    return res.data;
  },

  duplicateJob: async (id: string) => {
    const res = await apiInstance.post(`/jobs/${id}/duplicate`);
    return res.data;
  },

  // Candidates
  getCandidates: async (params?: Record<string, string | number>) => {
    const res = await apiInstance.get("/candidates", { params });
    return res.data;
  },

  createCandidate: async (payload: Record<string, unknown>) => {
    const res = await apiInstance.post("/candidates", payload);
    return res.data;
  },

  updateCandidate: async (id: string, payload: Record<string, unknown>) => {
    const res = await apiInstance.put(`/candidates/${id}`, payload);
    return res.data;
  },

  updateApplicationStage: async (applicationId: string, stage: Stage) => {
    const res = await apiInstance.patch(`/applications/${applicationId}/stage`, { stage });
    return res.data;
  },

  addCandidateNote: async (candidateId: string, text: string) => {
    const res = await apiInstance.post("/crm/notes", {
      candidate_id: candidateId,
      note_text: text,
    });
    return res.data;
  },

  // Interviews
  getInterviews: async (params?: Record<string, string | number>) => {
    const res = await apiInstance.get("/interviews", { params });
    return res.data;
  },

  submitInterviewScorecard: async (payload: Record<string, unknown>) => {
    const res = await apiInstance.post("/scorecards/submissions", payload);
    return res.data;
  },

  // Offers
  getOffers: async (params?: Record<string, string | number>) => {
    const res = await apiInstance.get("/offers", { params });
    return res.data;
  },

  createOffer: async (applicationId: string, payload: Record<string, unknown>) => {
    const res = await apiInstance.post(`/applications/${applicationId}/offer`, payload);
    return res.data;
  },

  // Aggregated Recruitment Dashboard Data
  fetchRecruitmentDashboardData: async (): Promise<RecruitmentDataPayload> => {
    const [jobsRes, candidatesRes, interviewsRes, offersRes] = await Promise.allSettled([
      apiInstance.get("/jobs"),
      apiInstance.get("/candidates"),
      apiInstance.get("/interviews"),
      apiInstance.get("/offers"),
    ]);

    const { data } = parseRecruitmentApiResults(
      toBodyResult(jobsRes),
      toBodyResult(candidatesRes),
      toBodyResult(interviewsRes),
      toBodyResult(offersRes),
    );

    return {
      jobs: data.jobs || [],
      candidates: data.candidates || [],
      interviews: data.interviews || [],
      offers: data.offers || [],
    };
  },
};

export default recruitmentApi;

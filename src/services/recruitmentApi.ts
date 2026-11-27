import apiInstance from "@/api/apiInstance";
import { publicApiInstance } from "@/api/publicApiInstance";
import {
  ANALYTICS_V2_ENDPOINTS,
  PUBLIC_CAREER_ENDPOINTS,
  RECRUITMENT_ENDPOINTS,
} from "@/api/endpoints";
import { parseListResponse, type PaginatedList } from "@/api/utils";
import type { RecruitmentDataPayload } from "@/features/admin/recruitment/recruitmentTypes";
import type { Candidate, Interview, Job, Offer } from "@/features/admin/recruitment/types";
import {
  extractItems,
  mapCandidateToFrontend,
  mapInterviewToFrontend,
  mapJobToFrontend,
  mapOfferToFrontend,
} from "@/features/admin/recruitment/utils/apiMappers";

function unwrapPayload<T = unknown>(res: { data?: { data?: T } | T }): T {
  const data = res?.data as { data?: T } | T | undefined;
  if (data && typeof data === "object" && "data" in data && data.data !== undefined) {
    return data.data;
  }
  return data as T;
}

function getHttpStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") return undefined;
  const err = error as { status?: number; response?: { status?: number } };
  return err.response?.status ?? err.status;
}

export const recruitmentApi = {
  /**
   * Aggregated load for Jobs, Candidates, Interviews and Offers.
   * Rejects immediately on primary/non-403 failures instead of swallowing errors into `[]`.
   */
  fetchRecruitmentDashboardData: async (): Promise<RecruitmentDataPayload> => {
    const [jobsRes, candidatesRes, interviewsRes, offersRes] = await Promise.allSettled([
      apiInstance.get(RECRUITMENT_ENDPOINTS.JOBS),
      apiInstance.get(RECRUITMENT_ENDPOINTS.CANDIDATES),
      apiInstance.get(RECRUITMENT_ENDPOINTS.INTERVIEWS),
      apiInstance.get(RECRUITMENT_ENDPOINTS.OFFERS),
    ]);

    const criticalResults = [jobsRes, candidatesRes, interviewsRes];
    for (const res of criticalResults) {
      if (res.status === "rejected") {
        throw res.reason;
      }
    }

    if (offersRes.status === "rejected") {
      const status = getHttpStatus(offersRes.reason);
      // Hiring managers / restricted roles may receive 403 on offers; surface all other errors
      if (status !== 403) {
        throw offersRes.reason;
      }
    }

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

    return { jobs, candidates, interviews, offers };
  },

  // ── Dashboard, Stats & Analytics ──────────────────────────────────
  getDashboard: async () => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.RECRUITMENT_DASHBOARD);
    return unwrapPayload(res);
  },

  getStats: async () => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.RECRUITMENT_STATS);
    return unwrapPayload(res);
  },

  getAnalytics: async (params?: Record<string, unknown>) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.RECRUITMENT_ANALYTICS, { params });
    return unwrapPayload(res);
  },

  getAnalyticsV2Dashboard: async (params?: Record<string, unknown>) => {
    const res = await apiInstance.get(ANALYTICS_V2_ENDPOINTS.DASHBOARD, { params });
    return unwrapPayload(res);
  },

  getAnalyticsV2Department: async (params?: Record<string, unknown>) => {
    const res = await apiInstance.get(ANALYTICS_V2_ENDPOINTS.DEPARTMENT, { params });
    return unwrapPayload(res);
  },

  getAnalyticsV2HiringFunnel: async (params?: Record<string, unknown>) => {
    const res = await apiInstance.get(ANALYTICS_V2_ENDPOINTS.HIRING_FUNNEL, { params });
    return unwrapPayload(res);
  },

  getAnalyticsV2InterviewSuccess: async (params?: Record<string, unknown>) => {
    const res = await apiInstance.get(ANALYTICS_V2_ENDPOINTS.INTERVIEW_SUCCESS, { params });
    return unwrapPayload(res);
  },

  getAnalyticsV2OfferAcceptance: async (params?: Record<string, unknown>) => {
    const res = await apiInstance.get(ANALYTICS_V2_ENDPOINTS.OFFER_ACCEPTANCE_RATE, { params });
    return unwrapPayload(res);
  },

  getAnalyticsV2RecruiterPerformance: async (params?: Record<string, unknown>) => {
    const res = await apiInstance.get(ANALYTICS_V2_ENDPOINTS.RECRUITER_PERFORMANCE, { params });
    return unwrapPayload(res);
  },

  getAnalyticsV2SourcePerformance: async (params?: Record<string, unknown>) => {
    const res = await apiInstance.get(ANALYTICS_V2_ENDPOINTS.SOURCE_PERFORMANCE, { params });
    return unwrapPayload(res);
  },

  getAnalyticsV2TimeToHire: async (params?: Record<string, unknown>) => {
    const res = await apiInstance.get(ANALYTICS_V2_ENDPOINTS.TIME_TO_HIRE, { params });
    return unwrapPayload(res);
  },

  // ── Notifications ─────────────────────────────────────────────────
  getNotifications: async (params?: Record<string, unknown>) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.RECRUITMENT_NOTIFICATIONS, { params });
    return unwrapPayload(res);
  },

  markNotificationRead: async (id: string) => {
    const res = await apiInstance.put(RECRUITMENT_ENDPOINTS.RECRUITMENT_NOTIFICATION_READ(id));
    return unwrapPayload(res);
  },

  // ── Jobs ──────────────────────────────────────────────────────────
  getPipeline: async (params?: Record<string, unknown>): Promise<Candidate[]> => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.CANDIDATES, { params });
    return extractItems(res.data).map(mapCandidateToFrontend);
  },

  getJobs: async (params?: Record<string, unknown>): Promise<Job[]> => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.JOBS, { params });
    return extractItems(res.data).map(mapJobToFrontend);
  },

  getJobsPaginated: async (params?: Record<string, unknown>): Promise<PaginatedList<Job>> => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.JOBS, { params });
    const parsed = parseListResponse<Record<string, unknown>>(res.data);
    return {
      ...parsed,
      items: parsed.items.map(mapJobToFrontend),
    };
  },

  getJobById: async (id: string): Promise<Job> => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.JOB_BY_ID(id));
    return mapJobToFrontend(unwrapPayload<Record<string, unknown>>(res));
  },

  createJob: async (payload: Record<string, unknown>) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.JOBS, payload);
    return unwrapPayload(res);
  },

  updateJob: async (id: string, payload: Record<string, unknown>) => {
    const res = await apiInstance.put(RECRUITMENT_ENDPOINTS.JOB_BY_ID(id), payload);
    return unwrapPayload(res);
  },

  deleteJob: async (id: string) => {
    const res = await apiInstance.delete(RECRUITMENT_ENDPOINTS.JOB_BY_ID(id));
    return unwrapPayload(res);
  },

  aiAutofillJob: async (payload: Record<string, unknown>) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.JOB_AI_AUTOFILL, payload);
    return unwrapPayload(res);
  },

  getJobQr: async (id: string, params?: Record<string, unknown>) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.JOB_QR(id), {
      params,
      responseType: "arraybuffer",
      headers: { Accept: "application/json, image/png, image/svg+xml, */*" },
    });
    const contentType = String(res.headers?.["content-type"] || "");
    if (contentType.includes("application/json") || contentType.includes("text/")) {
      const text = new TextDecoder().decode(res.data as ArrayBuffer);
      try {
        const parsed = JSON.parse(text);
        return parsed?.data ?? parsed;
      } catch {
        return { qr_svg: text };
      }
    }
    const blob = new Blob([res.data as ArrayBuffer], {
      type: contentType || "image/png",
    });
    return { blob, contentType, objectUrl: URL.createObjectURL(blob) };
  },

  getSourcingLink: async (jobId: string) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.JOB_SOURCING_LINK(jobId));
    return unwrapPayload(res);
  },

  getPublishChannels: async (jobId: string) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.JOB_PUBLISH(jobId));
    return unwrapPayload(res);
  },

  publishJob: async (jobId: string, payload: Record<string, unknown>) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.JOB_PUBLISH(jobId), payload);
    return unwrapPayload(res);
  },

  closeJob: async (jobId: string) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.JOB_CLOSE(jobId));
    return unwrapPayload(res);
  },

  draftJob: async (jobId: string) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.JOB_DRAFT(jobId));
    return unwrapPayload(res);
  },

  duplicateJob: async (jobId: string) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.JOB_DUPLICATE(jobId));
    return unwrapPayload(res);
  },

  exportApplicants: async (jobId: string) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.JOB_APPLICANTS_EXPORT(jobId), {
      responseType: "blob",
    });
    return res.data;
  },

  generateJobDescription: async (payload: Record<string, unknown>) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.JOB_GENERATE_DESC, payload);
    return unwrapPayload(res);
  },

  modifyJobDescription: async (payload: {
    current_description: string;
    instruction: string;
    job_title?: string;
    department?: string;
    skills?: string[];
  }) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.JOB_MODIFY_DESC, payload);
    return unwrapPayload(res);
  },

  // ── Candidates, Resume & Matching ─────────────────────────────────
  getCandidates: async (params?: Record<string, unknown>): Promise<Candidate[]> => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.CANDIDATES, { params });
    return extractItems(res.data).map(mapCandidateToFrontend);
  },

  getCandidatesPaginated: async (
    params?: Record<string, unknown>,
  ): Promise<PaginatedList<Candidate>> => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.CANDIDATES, { params });
    const parsed = parseListResponse<Record<string, unknown>>(res.data);
    return {
      ...parsed,
      items: parsed.items.map(mapCandidateToFrontend),
    };
  },

  getCandidateById: async (id: string): Promise<Candidate> => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.CANDIDATE_BY_ID(id));
    return mapCandidateToFrontend(unwrapPayload<Record<string, unknown>>(res));
  },

  createCandidate: async (payload: Record<string, unknown>) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.CANDIDATES, payload);
    return unwrapPayload(res);
  },

  updateCandidate: async (id: string, payload: Record<string, unknown>) => {
    const res = await apiInstance.put(RECRUITMENT_ENDPOINTS.CANDIDATE_BY_ID(id), payload);
    return unwrapPayload(res);
  },

  deleteCandidate: async (id: string) => {
    const res = await apiInstance.delete(RECRUITMENT_ENDPOINTS.CANDIDATE_BY_ID(id));
    return unwrapPayload(res);
  },

  exportCandidatesCsv: async (params?: Record<string, unknown>) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.CANDIDATES_EXPORT_CSV, {
      params,
      responseType: "blob",
    });
    return res.data;
  },

  importCandidates: async (formData: FormData) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.CANDIDATES_IMPORT, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrapPayload(res);
  },

  getParsedCandidates: async (params?: Record<string, unknown>) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.PARSED_CANDIDATES, { params });
    return unwrapPayload(res);
  },

  getParsedCandidateById: async (candidateId: string) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.PARSED_CANDIDATE_BY_ID(candidateId));
    return unwrapPayload(res);
  },

  getCandidateAts: async (candidateId: string) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.CANDIDATE_ATS(candidateId));
    return unwrapPayload(res);
  },

  matchCandidateToJob: async (
    candidateId: string,
    jobId: string,
    payload?: Record<string, unknown>,
  ) => {
    const res = await apiInstance.post(
      RECRUITMENT_ENDPOINTS.CANDIDATE_MATCH_JOB(candidateId, jobId),
      payload || {},
    );
    return unwrapPayload(res);
  },

  matchCandidatesForJob: async (jobId: string, payload?: Record<string, unknown>) => {
    const res = await apiInstance.post(
      RECRUITMENT_ENDPOINTS.JOB_MATCH_CANDIDATES(jobId),
      payload || {},
    );
    return unwrapPayload(res);
  },

  uploadResume: async (formData: FormData) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.RESUME_UPLOAD, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrapPayload(res);
  },

  parseResume: async (formData: FormData) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.RESUME_PARSE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrapPayload(res);
  },

  uploadAndParseResumeV2: async (formData: FormData) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.RESUME_PARSE_V2_UPLOAD, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrapPayload(res);
  },

  getParsedResumeV2: async (documentId: string) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.RESUME_PARSE_V2_GET(documentId));
    return unwrapPayload(res);
  },

  checkResumeAtsV2: async (payload: FormData | Record<string, unknown>) => {
    const config =
      payload instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined;
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.RESUME_ATS_CHECK_V2, payload, config);
    return unwrapPayload(res);
  },

  // ── Applications & Pipeline ───────────────────────────────────────
  getApplications: async (params?: Record<string, unknown>) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.APPLICATIONS, { params });
    return parseListResponse<Record<string, unknown>>(res.data);
  },

  getApplicationStats: async () => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.APPLICATION_STATS);
    return unwrapPayload(res);
  },

  getApplicationById: async (id: string) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.APPLICATION_BY_ID(id));
    return unwrapPayload(res);
  },

  bulkMoveApplications: async (payload: {
    application_ids: string[];
    stage: string;
    notes?: string;
  }) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.APPLICATION_BULK_MOVE, payload);
    return unwrapPayload(res);
  },

  bulkTagApplications: async (payload: {
    application_ids: string[];
    tags: string[];
  }) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.APPLICATION_BULK_TAG, payload);
    return unwrapPayload(res);
  },

  moveApplicationStage: async (
    id: string,
    stageOrPayload: string | { stage: string; notes?: string },
  ) => {
    const body = typeof stageOrPayload === "string" ? { stage: stageOrPayload } : stageOrPayload;
    const res = await apiInstance.patch(RECRUITMENT_ENDPOINTS.APPLICATION_STAGE(id), body);
    return unwrapPayload(res);
  },

  shortlistApplication: async (id: string, payload?: Record<string, unknown>) => {
    const res = await apiInstance.patch(RECRUITMENT_ENDPOINTS.APPLICATION_SHORTLIST(id), payload || {});
    return unwrapPayload(res);
  },

  rejectApplication: async (id: string, payload?: Record<string, unknown>) => {
    const res = await apiInstance.patch(RECRUITMENT_ENDPOINTS.APPLICATION_REJECT(id), payload || {});
    return unwrapPayload(res);
  },

  holdApplication: async (id: string, payload?: Record<string, unknown>) => {
    const res = await apiInstance.patch(RECRUITMENT_ENDPOINTS.APPLICATION_HOLD(id), payload || {});
    return unwrapPayload(res);
  },

  createOffer: async (applicationId: string, payload: Record<string, unknown>) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.APPLICATION_OFFER(applicationId), payload);
    return unwrapPayload(res);
  },

  sendInterviewInvite: async (applicationId: string, payload: Record<string, unknown>) => {
    const res = await apiInstance.post(
      RECRUITMENT_ENDPOINTS.APPLICATION_SEND_INTERVIEW(applicationId),
      payload,
    );
    return unwrapPayload(res);
  },

  convertApplication: async (applicationId: string, payload?: Record<string, unknown>) => {
    const res = await apiInstance.post(
      RECRUITMENT_ENDPOINTS.APPLICATION_CONVERT(applicationId),
      payload || {},
    );
    return unwrapPayload(res);
  },

  // ── Offers & Offer Letters V2 ─────────────────────────────────────
  getOffers: async (params?: Record<string, unknown>): Promise<Offer[]> => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.OFFERS, { params });
    return extractItems(res.data).map(mapOfferToFrontend);
  },

  acceptOffer: async (offerId: string, payload?: Record<string, unknown>) => {
    const res = await apiInstance.patch(RECRUITMENT_ENDPOINTS.OFFER_ACCEPT(offerId), payload || {});
    return unwrapPayload(res);
  },

  rejectOffer: async (offerId: string, payload?: Record<string, unknown>) => {
    const res = await apiInstance.patch(RECRUITMENT_ENDPOINTS.OFFER_REJECT(offerId), payload || {});
    return unwrapPayload(res);
  },

  generateOfferLetterV2: async (payload: Record<string, unknown>) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.OFFER_LETTER_GENERATE_V2, payload);
    return unwrapPayload(res);
  },

  downloadOfferLetterV2: async (filename: string) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.OFFER_LETTER_DOWNLOAD_V2(filename), {
      responseType: "blob",
    });
    return res.data;
  },

  // ── Requisitions (Canonical /api/v1/requisitions) ─────────────────
  getRequisitions: async (params?: Record<string, unknown>) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.REQUISITIONS, { params });
    return unwrapPayload(res);
  },

  getRequisitionById: async (id: string) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.REQUISITION_BY_ID(id));
    return unwrapPayload(res);
  },

  createRequisition: async (payload: Record<string, unknown>) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.REQUISITIONS, payload);
    return unwrapPayload(res);
  },

  approveRequisition: async (id: string, payload?: Record<string, unknown>) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.REQUISITION_APPROVE(id), payload || {});
    return unwrapPayload(res);
  },

  // ── Vendors ───────────────────────────────────────────────────────
  getVendors: async (params?: Record<string, unknown>) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.VENDORS, { params });
    return unwrapPayload(res);
  },

  getVendorById: async (id: string) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.VENDOR_BY_ID(id));
    return unwrapPayload(res);
  },

  createVendor: async (payload: Record<string, unknown>) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.VENDORS, payload);
    return unwrapPayload(res);
  },

  updateVendor: async (id: string, payload: Record<string, unknown>) => {
    const res = await apiInstance.put(RECRUITMENT_ENDPOINTS.VENDOR_BY_ID(id), payload);
    return unwrapPayload(res);
  },

  deleteVendor: async (id: string) => {
    const res = await apiInstance.delete(RECRUITMENT_ENDPOINTS.VENDOR_BY_ID(id));
    return unwrapPayload(res);
  },

  // ── CRM Notes (Canonical /api/v1/crm/notes) ──────────────────────
  getCandidateNotes: async (candidateId: string) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.CRM_NOTES_BY_CANDIDATE(candidateId));
    return unwrapPayload(res);
  },

  addCandidateNote: async (
    candidateId: string,
    noteOrPayload: string | Record<string, unknown>,
  ) => {
    const payload =
      typeof noteOrPayload === "string"
        ? { candidate_id: candidateId, note_text: noteOrPayload, note: noteOrPayload }
        : { candidate_id: candidateId, ...noteOrPayload };
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.CRM_NOTES, payload);
    return unwrapPayload(res);
  },

  // ── Scorecards ────────────────────────────────────────────────────
  getScorecardTemplates: async (params?: Record<string, unknown>) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.SCORECARD_TEMPLATES, { params });
    return unwrapPayload(res);
  },

  createScorecardTemplate: async (payload: Record<string, unknown>) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.SCORECARD_TEMPLATES, payload);
    return unwrapPayload(res);
  },

  submitScorecard: async (payload: Record<string, unknown>) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.SCORECARD_SUBMISSIONS, payload);
    return unwrapPayload(res);
  },

  getScorecardsByRound: async (roundId: string) => {
    const res = await apiInstance.get(
      RECRUITMENT_ENDPOINTS.SCORECARD_SUBMISSIONS_BY_ROUND(roundId),
    );
    return unwrapPayload(res);
  },

  // ── Referrals, Templates & AI Talent/Ranking ──────────────────────
  getReferrals: async (params?: Record<string, unknown>) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.REFERRALS, { params });
    return unwrapPayload(res);
  },

  createReferral: async (payload: Record<string, unknown>) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.REFERRALS, payload);
    return unwrapPayload(res);
  },

  updateReferralStatus: async (id: string, payload: Record<string, unknown>) => {
    const res = await apiInstance.put(RECRUITMENT_ENDPOINTS.REFERRAL_STATUS(id), payload);
    return unwrapPayload(res);
  },

  getDocumentTemplates: async (params?: Record<string, unknown>) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.DOCUMENT_TEMPLATES, { params });
    return unwrapPayload(res);
  },

  generateDocumentFromTemplate: async (id: string, payload: Record<string, unknown>) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.DOCUMENT_TEMPLATE_GENERATE(id), payload);
    return unwrapPayload(res);
  },

  matchTalentV2: async (payload: Record<string, unknown>) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.TALENT_MATCH_V2, payload);
    return unwrapPayload(res);
  },

  rankCandidatesV2: async (payload: Record<string, unknown>) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.RANKING_V2_RANK, payload);
    return unwrapPayload(res);
  },

  getRankedTopV2: async (jobId: string) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.RANKING_V2_TOP(jobId));
    return unwrapPayload(res);
  },

  // ── AI Recruiter V1 ───────────────────────────────────────────────
  getAiRecruiterDashboard: async () => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.AI_RECRUITER_DASHBOARD);
    return unwrapPayload(res);
  },

  getAiRecruiterFunnel: async () => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.AI_RECRUITER_FUNNEL);
    return unwrapPayload(res);
  },

  getAiRecruiterMatchDistribution: async () => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.AI_RECRUITER_MATCH_DISTRIBUTION);
    return unwrapPayload(res);
  },

  getAiRecruiterAnalytics: async () => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.AI_RECRUITER_ANALYTICS);
    return unwrapPayload(res);
  },

  // ── Public Careers Portal (Unauthenticated publicApiInstance) ─────
  getPublicCareers: async (params?: Record<string, unknown>) => {
    const res = await publicApiInstance.get(PUBLIC_CAREER_ENDPOINTS.LIST, { params });
    return unwrapPayload(res);
  },

  searchPublicCareers: async (params: Record<string, unknown>) => {
    const res = await publicApiInstance.get(PUBLIC_CAREER_ENDPOINTS.SEARCH, { params });
    return unwrapPayload(res);
  },

  filterPublicCareers: async (params: Record<string, unknown>) => {
    const res = await publicApiInstance.get(PUBLIC_CAREER_ENDPOINTS.FILTER, { params });
    return unwrapPayload(res);
  },

  getPublicCareerBySlug: async (slug: string) => {
    const res = await publicApiInstance.get(PUBLIC_CAREER_ENDPOINTS.BY_SLUG(slug));
    return unwrapPayload(res);
  },

  applyPublicCareerBySlug: async (slug: string, formData: FormData) => {
    const res = await publicApiInstance.post(
      PUBLIC_CAREER_ENDPOINTS.APPLY_BY_SLUG(slug),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return unwrapPayload(res);
  },

  getPublicCareerByUkey: async (ukey: string) => {
    const res = await publicApiInstance.get(PUBLIC_CAREER_ENDPOINTS.BY_UKEY(ukey));
    return unwrapPayload(res);
  },

  applyPublicCareerByUkey: async (ukey: string, formData: FormData) => {
    const res = await publicApiInstance.post(
      PUBLIC_CAREER_ENDPOINTS.APPLY_BY_UKEY(ukey),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return unwrapPayload(res);
  },
};

export default recruitmentApi;

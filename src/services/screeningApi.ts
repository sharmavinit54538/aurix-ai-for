import apiInstance from "@/api/apiInstance";
import { SCREENING_V2_ENDPOINTS } from "@/api/endpoints";
import { mapScreeningResultsToFrontend } from "@/features/admin/recruitment/utils/apiMappers";
import type { HumanDecision, ScreeningResultsData } from "@/features/admin/recruitment/types";

export interface ScreenCandidatePayload {
  application_id?: string;
  candidate_id?: string;
  job_id?: string;
  [key: string]: unknown;
}

export interface BatchScreenPayload {
  job_id: string;
  application_ids?: string[];
  candidate_ids?: string[];
  [key: string]: unknown;
}

export type SubmitScreeningDecisionPayload = {
  action?: HumanDecision | string;
  decision?: HumanDecision | string;
  reason?: string;
  notes?: string;
};

export const screeningApi = {
  /**
   * Run AI screening for an entire job (`POST /api/v2/screening/jobs/{job_id}/run`).
   */
  runScreening: async (jobId: string, payload?: { applicationIds?: string[]; force_rescreen?: boolean }) => {
    const body = payload?.applicationIds
      ? { application_ids: payload.applicationIds, force_rescreen: payload.force_rescreen }
      : { force_rescreen: payload?.force_rescreen };
    const res = await apiInstance.post(SCREENING_V2_ENDPOINTS.RUN_JOB(jobId), body);
    return res.data?.data ?? res.data;
  },

  /**
   * Run AI screening for a single candidate/application (`POST /api/v2/screening/screen`).
   */
  screenCandidate: async (payload: ScreenCandidatePayload) => {
    const res = await apiInstance.post(SCREENING_V2_ENDPOINTS.SCREEN, payload);
    return res.data?.data ?? res.data;
  },

  /**
   * Run batch AI screening (`POST /api/v2/screening/batch-screen`).
   */
  batchScreenCandidates: async (payload: BatchScreenPayload) => {
    const res = await apiInstance.post(SCREENING_V2_ENDPOINTS.BATCH_SCREEN, payload);
    return res.data?.data ?? res.data;
  },

  /**
   * Fetch AI screening results for a job (`GET /api/v2/screening/jobs/{job_id}/results`).
   * Propagates HTTP errors rather than masking them as empty data.
   */
  getScreeningResults: async (jobId: string): Promise<ScreeningResultsData> => {
    const res = await apiInstance.get(SCREENING_V2_ENDPOINTS.JOB_RESULTS(jobId));
    return mapScreeningResultsToFrontend(res.data?.data ?? res.data);
  },

  /**
   * Fetch screening history for a single application (`GET /api/v2/screening/history/{application_id}`).
   */
  getScreeningHistory: async (applicationId: string): Promise<ScreeningResultsData> => {
    const res = await apiInstance.get(SCREENING_V2_ENDPOINTS.HISTORY(applicationId));
    return mapScreeningResultsToFrontend(res.data?.data ?? res.data);
  },

  /**
   * Submit human shortlist/reject decision (`POST /api/v2/screening/results/{screening_id}/decision`).
   * Accepts both structured payload objects (e.g. `{ action, reason }`) and legacy string forms.
   */
  submitDecision: async (
    screeningId: string,
    payloadOrDecision: SubmitScreeningDecisionPayload | HumanDecision | string,
    notes?: string,
  ) => {
    const body =
      typeof payloadOrDecision === "string"
        ? { action: payloadOrDecision, decision: payloadOrDecision, notes, reason: notes }
        : {
            ...payloadOrDecision,
            decision: payloadOrDecision.decision ?? payloadOrDecision.action,
            action: payloadOrDecision.action ?? payloadOrDecision.decision,
          };
    const res = await apiInstance.post(SCREENING_V2_ENDPOINTS.DECISION(screeningId), body);
    return res.data?.data ?? res.data;
  },
};

export default screeningApi;

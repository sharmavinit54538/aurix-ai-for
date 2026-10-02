import apiInstance from "@/api/apiInstance";

export interface ScreeningRunPayload {
  application_ids?: string[];
  model?: string;
  force?: boolean;
}

export interface ScreeningRunResponse {
  run_id: string;
  status: string;
  total: number;
}

export interface ScreeningResultItemApi {
  id?: string;
  screening_id?: string | null;
  application_id: string;
  candidate_id: string;
  candidate_name: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | string;
  error?: string | null;
  decision: "SHORTLIST" | "REVIEW" | "REJECT" | null;
  confidence: number;
  match_score: number;
  strengths: string[];
  weaknesses: string[];
  missing_skills: string[];
  redFlags?: string[];
  red_flags?: string[];
  greenFlags?: string[];
  green_flags?: string[];
  hiring_recommendation: string;
  hr_notes: string;
  questions_to_ask: string[];
  model_used: string;
  screened_at: string | null;
  human_decision: "SHORTLIST" | "REJECT" | "KEEP_REVIEW" | null;
  human_decision_by: string | null;
  human_decision_reason: string | null;
  human_decided_at?: string | null;
}

export interface ScreeningResultsResponse {
  thresholds: {
    shortlist: number;
    reject: number;
  } | null;
  run: {
    run_id: string;
    status: string;
    completed: number;
    total: number;
  } | null;
  results: ScreeningResultItemApi[];
}

export interface ScreeningDecisionPayload {
  action: "SHORTLIST" | "REJECT" | "KEEP_REVIEW";
  reason?: string;
}

export interface ScreeningDecisionResponse {
  success?: boolean;
  message?: string;
  data?: ScreeningResultItemApi;
  [key: string]: unknown;
}

export const screeningApi = {
  /**
   * Run AI screening for a job requisition.
   * POST /api/v2/screening/jobs/{job_id}/run
   */
  runScreening: async (
    jobId: string,
    payload?: ScreeningRunPayload,
  ): Promise<ScreeningRunResponse> => {
    const res = await apiInstance.post(`/api/v2/screening/jobs/${jobId}/run`, payload || {});
    const data = res.data?.data ?? res.data;
    return {
      run_id: String(data?.run_id ?? data?.runId ?? ""),
      status: String(data?.status ?? "RUNNING"),
      total: Number(data?.total ?? 0),
    };
  },

  /**
   * Fetch AI screening results and run status for a job requisition.
   * GET /api/v2/screening/jobs/{job_id}/results
   * 404 throws so caller shows inline error with Retry. No fake defaults.
   */
  getScreeningResults: async (jobId: string): Promise<ScreeningResultsResponse> => {
    const res = await apiInstance.get(`/api/v2/screening/jobs/${jobId}/results`);
    const data = res.data?.data ?? res.data;
    return {
      thresholds:
        data?.thresholds &&
        typeof data.thresholds.shortlist === "number" &&
        typeof data.thresholds.reject === "number"
          ? {
              shortlist: Number(data.thresholds.shortlist),
              reject: Number(data.thresholds.reject),
            }
          : null,
      run: data?.run
        ? {
            run_id: String(data.run.run_id ?? data.run.runId ?? ""),
            status: String(data.run.status ?? ""),
            completed: Number(data.run.completed ?? 0),
            total: Number(data.run.total ?? 0),
          }
        : null,
      results: Array.isArray(data?.results) ? data.results : [],
    };
  },

  /**
   * Submit human decision for a screening result.
   * POST /api/v2/screening/results/{screening_id}/decision
   */
  submitDecision: async (
    screeningId: string,
    payload: ScreeningDecisionPayload,
  ): Promise<ScreeningDecisionResponse> => {
    const res = await apiInstance.post(
      `/api/v2/screening/results/${screeningId}/decision`,
      payload,
    );
    return res.data?.data ?? res.data;
  },
};

export default screeningApi;

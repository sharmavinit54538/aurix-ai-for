import { apiInstance } from "@/api";

export interface BotQuestion {
  id: string | number;
  question_text: string;
  category?: string;
  time_limit_seconds?: number;
  question_number: number;
  total_questions: number;
}

export interface BotPublicSession {
  token: string;
  candidate_name: string;
  first_name?: string;
  job_title: string;
  company_name?: string;
  estimated_duration_minutes?: number;
  consent_text?: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "EXPIRED";
  current_question?: BotQuestion | null;
  total_questions?: number;
  answered_count?: number;
}

export interface AnswerQuestionPayload {
  question_id: string | number;
  answer_text: string;
}

export interface TranscriptItem {
  question_id?: string | number;
  question: string;
  answer: string;
  category?: string;
  time_taken_seconds?: number;
}

export interface AIInterviewResult {
  id: string;
  application_id: string;
  candidate_id?: string;
  candidate_name: string;
  job_id: string;
  job_title?: string;
  status: "INVITED" | "IN_PROGRESS" | "COMPLETED" | "EXPIRED" | "FAILED";
  match_score?: number;
  confidence?: number;
  strengths: string[];
  weaknesses: string[];
  red_flags: string[];
  green_flags?: string[];
  integrity_signals?: {
    tab_switches?: number;
    paste_count?: number;
    flags?: string[];
  };
  transcript?: TranscriptItem[];
  human_decision?: "SHORTLIST" | "REJECT" | "KEEP_REVIEW" | null;
  human_decision_by?: string | null;
  human_decision_reason?: string | null;
  human_decided_at?: string | null;
  invited_at?: string;
  completed_at?: string;
  error?: string | null;
}

export interface AIInterviewDecisionPayload {
  action: "SHORTLIST" | "REJECT" | "KEEP_REVIEW";
  reason?: string;
}

export const aiInterviewBotApi = {
  // Public Candidate Endpoints
  getPublicSession: async (token: string): Promise<BotPublicSession> => {
    const response = await apiInstance.get(`/api/v2/interview-bot/public/${encodeURIComponent(token)}`);
    return response.data?.data || response.data;
  },

  startInterview: async (token: string): Promise<BotPublicSession> => {
    const response = await apiInstance.post(`/api/v2/interview-bot/public/${encodeURIComponent(token)}/start`, {
      consent: true,
    });
    return response.data?.data || response.data;
  },

  submitAnswer: async (token: string, payload: AnswerQuestionPayload): Promise<BotPublicSession> => {
    const response = await apiInstance.post(`/api/v2/interview-bot/public/${encodeURIComponent(token)}/answer`, payload);
    return response.data?.data || response.data;
  },

  finishInterview: async (token: string): Promise<{ success: boolean; status: "COMPLETED" }> => {
    const response = await apiInstance.post(`/api/v2/interview-bot/public/${encodeURIComponent(token)}/finish`);
    return response.data?.data || response.data;
  },

  requestHumanInterviewer: async (token: string, reason?: string): Promise<{ success: boolean; message?: string }> => {
    const response = await apiInstance.post(`/api/v2/interview-bot/public/${encodeURIComponent(token)}/request-human`, {
      reason,
    });
    return response.data?.data || response.data;
  },

  // HR Endpoints
  inviteCandidate: async (application_id: string): Promise<{ success: boolean; invite_url?: string; token?: string }> => {
    const response = await apiInstance.post("/api/v2/interview-bot/invite", { application_id });
    return response.data?.data || response.data;
  },

  getResults: async (job_id?: string): Promise<{ items: AIInterviewResult[]; total: number }> => {
    const response = await apiInstance.get("/api/v2/interview-bot/results", {
      params: job_id ? { job_id } : undefined,
    });
    const data = response.data?.data || response.data;
    if (Array.isArray(data)) {
      return { items: data, total: data.length };
    }
    return {
      items: Array.isArray(data?.items) ? data.items : [],
      total: typeof data?.total === "number" ? data.total : (data?.items?.length || 0),
    };
  },

  submitDecision: async (result_id: string, payload: AIInterviewDecisionPayload): Promise<{ success: boolean; data: AIInterviewResult }> => {
    const response = await apiInstance.post(`/api/v2/interview-bot/results/${encodeURIComponent(result_id)}/decision`, payload);
    return response.data;
  },
};

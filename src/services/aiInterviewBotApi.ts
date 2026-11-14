import apiInstance from "@/api/apiInstance";

export interface TranscriptItem {
  role: "ai" | "candidate" | string;
  text: string;
  timestamp?: string;
}

export interface BotQuestion {
  id: string;
  question: string;
  category?: string;
  time_limit_seconds?: number;
}

export interface BotPublicSession {
  id: string;
  token: string;
  candidate_name: string;
  job_title: string;
  company_name?: string;
  status: "pending" | "in_progress" | "completed" | string;
  questions: BotQuestion[];
  current_question_index?: number;
}

export interface AIInterviewResult {
  id: string;
  candidate_id?: string;
  candidate_name: string;
  job_id?: string;
  job_title: string;
  overall_score: number;
  technical_score?: number;
  communication_score?: number;
  cultural_fit_score?: number;
  recommendation: "Strong Hire" | "Hire" | "Hold" | "No Hire" | string;
  status: string;
  completed_at?: string;
  summary?: string;
  transcript?: TranscriptItem[];
}

export const aiInterviewBotApi = {
  getSession: async (token: string): Promise<BotPublicSession> => {
    const res = await apiInstance.get(
      `/ai-interview/sessions/${encodeURIComponent(token)}`,
    );
    return res.data?.data ?? res.data;
  },
  startSession: async (token: string) => {
    const res = await apiInstance.post(
      `/ai-interview/sessions/${encodeURIComponent(token)}/start`,
      {},
    );
    return res.data?.data ?? res.data;
  },
  submitAnswer: async (token: string, payload: unknown) => {
    const res = await apiInstance.post(
      `/ai-interview/sessions/${encodeURIComponent(token)}/answer`,
      payload,
    );
    return res.data?.data ?? res.data;
  },
  completeSession: async (token: string) => {
    const res = await apiInstance.post(
      `/ai-interview/sessions/${encodeURIComponent(token)}/complete`,
      {},
    );
    return res.data?.data ?? res.data;
  },
  getResults: async (): Promise<AIInterviewResult[]> => {
    const res = await apiInstance.get("/ai-interview/results");
    const d = res.data?.data ?? res.data;
    return Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
  },
  getResultById: async (id: string): Promise<AIInterviewResult> => {
    const res = await apiInstance.get(
      `/ai-interview/results/${encodeURIComponent(id)}`,
    );
    return res.data?.data ?? res.data;
  },
};

export default aiInterviewBotApi;

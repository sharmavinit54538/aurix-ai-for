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
  getSession: async (token: string): Promise<BotPublicSession> => ({
    id: "sess-1",
    token,
    candidate_name: "Jordan Taylor",
    job_title: "Senior Full-Stack Engineer",
    company_name: "OFC360 Enterprise",
    status: "pending",
    questions: [
      { id: "q1", question: "Tell us about a complex distributed system you architected.", category: "System Design", time_limit_seconds: 120 },
      { id: "q2", question: "How do you handle state synchronization in large React applications?", category: "Frontend", time_limit_seconds: 120 },
    ],
    current_question_index: 0,
  }),
  startSession: async (_token: string) => ({ status: "in_progress" }),
  submitAnswer: async (_token: string, _payload: unknown) => ({ nextQuestion: null, completed: true }),
  completeSession: async (_token: string) => ({ success: true, score: 88 }),
  getResults: async (): Promise<AIInterviewResult[]> => [],
  getResultById: async (id: string): Promise<AIInterviewResult> => ({
    id,
    candidate_name: "Jordan Taylor",
    job_title: "Senior Full-Stack Engineer",
    overall_score: 88,
    technical_score: 90,
    communication_score: 86,
    cultural_fit_score: 88,
    recommendation: "Strong Hire",
    status: "completed",
    completed_at: new Date().toISOString(),
    summary: "Strong systems thinking and clear communication.",
    transcript: [],
  }),
};
export default aiInterviewBotApi;

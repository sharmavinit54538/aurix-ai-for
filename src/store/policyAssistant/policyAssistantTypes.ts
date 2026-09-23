export interface PolicyMessage {
  id?: string;
  role: "user" | "ai";
  text: string;
  confidence?: number;
  sources?: string[];
  timestamp?: string;
}

export interface PolicyAssistantSummary {
  queriesCount: number;
  complianceRate: number;
  lastAnalysis?: string;
}

export interface PolicyAssistantDashboardData {
  summary?: PolicyAssistantSummary;
  recentQueries?: Array<{ question: string; answer?: string; timestamp?: string }>;
}

export interface PolicyAnswerResponse {
  question: string;
  answer: string;
  confidence?: number;
  sources?: string[];
}

export interface PolicyAssistantState {
  loading: boolean;
  asking: boolean;
  error: string | null;
  lastUpdated: string | null;
  summary: PolicyAssistantSummary | null;
  messages: PolicyMessage[];
}

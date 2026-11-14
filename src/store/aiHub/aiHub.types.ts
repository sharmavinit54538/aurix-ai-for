export interface ChatActionRequired {
  id: string;
  type: string;
  title: string;
  description?: string;
  status?: string;
}

export interface ChatChart {
  type: "bar" | "line" | "pie";
  title: string;
  data: unknown[];
}

export interface CandidateCardData {
  id: string;
  name: string;
  role: string;
  matchScore?: string;
}

export interface JobCardData {
  id: string;
  title: string;
  department: string;
  openings?: number;
}

export interface InterviewCardData {
  id: string;
  candidateName: string;
  date: string;
  interviewer: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  actions?: ChatActionRequired[];
  charts?: ChatChart[];
  candidates?: CandidateCardData[];
  jobs?: JobCardData[];
  interviews?: InterviewCardData[];
}

export interface ChatConversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface WorkforcePlanningData {
  summary?: {
    headcountTarget?: number;
    hiringPipelineCount?: number;
    budgetCapacity?: string;
  };
  recommendations?: unknown[];
  kpis?: unknown[];
}

export type AIHubChatMessage = ChatMessage;

export interface AIHubState {
  messages: ChatMessage[];
  conversations: ChatConversation[];
  activeConversationId: string | null;
  loading: boolean;
  error: string | null;
  operationLoading: boolean;
  operationError: string | null;
  workforcePlanning: WorkforcePlanningData | null;
}

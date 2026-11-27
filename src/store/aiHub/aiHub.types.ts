export type MessageDeliveryStatus =
  | "pending"
  | "sending"
  | "accepted"
  | "generating"
  | "streaming"
  | "completed"
  | "failed"
  | "cancelled"
  | "retrying"
  | "interrupted";

export interface CandidateCardData {
  name?: string;
  atsScore?: number;
  appliedPosition?: string;
  yearsExperience?: number;
  summary?: string;
}

export interface JobCardData {
  title?: string;
  department?: string;
  salary?: string;
  skills?: string[];
}

export interface InterviewCardData {
  round?: string;
  candidateName?: string;
  interviewer?: string;
  time?: string;
}

export interface OfferCardData {
  candidateName?: string;
  role?: string;
  department?: string;
  compensation?: string;
  ctc?: string;
  joiningDate?: string;
  startDate?: string;
  status?: string;
}

export interface OnboardingCardData {
  employeeName?: string;
  department?: string;
  progress?: number;
  pendingTasks?: number;
  buddy?: string;
  joiners?: Array<{ name: string; role?: string; readiness?: string }>;
}

export interface PayrollCardData {
  period?: string;
  totalAmount?: number | string;
  headcount?: number;
  status?: string;
  metrics?: Array<{ label: string; val: string | number }>;
}

export type ChatCardType =
  | "candidate"
  | "job"
  | "interview"
  | "offer"
  | "onboarding"
  | "payroll"
  | "chart"
  | "table"
  | "none";

export interface ChatActionRequired {
  actionName?: string;
  type?: string;
  title?: string;
  description?: string;
  endpoint?: string;
  payload?: Record<string, unknown>;
}

export interface ChatSourceCitation {
  document: string;
  title?: string;
  section: string;
  snippet?: string;
  page?: number;
  similarity?: number;
}

export interface ChatChart {
  title: string;
  chart_type?: string;
  chartType?: string;
  data: Array<Record<string, unknown>>;
}

export interface ChatTable {
  title: string;
  headers: string[];
  rows: unknown[][];
}

export interface ChatMessage {
  id: string;
  conversationId?: string;
  role: "user" | "assistant" | "system" | "ai";
  sender: "user" | "assistant" | "system" | "ai";
  content: string;
  timestamp: string;
  agentId?: string;
  clientMessageId?: string;
  requestId?: string;
  status?: MessageDeliveryStatus;
  failed?: boolean;
  isPartial?: boolean;
  retryable?: boolean;
  errorCode?: string;
  errorMessage?: string;
  model?: string;
  provider?: string;
  cardType?: ChatCardType;
  cardData?:
    | Record<string, unknown>
    | CandidateCardData
    | JobCardData
    | InterviewCardData
    | OfferCardData
    | OnboardingCardData
    | PayrollCardData;
  actionRequired?: ChatActionRequired;
  suggestions?: string[];
  sources?: ChatSourceCitation[];
  charts?: ChatChart[];
  tables?: ChatTable[];
  metadata?: Record<string, unknown>;
}

export interface ChatConversation {
  id: string;
  title: string;
  agentId?: string;
  lastMessage?: string;
  messageCount?: number;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationPayload {
  title?: string;
  agentId?: string;
  initialMessage?: string;
  message?: string;
  departmentId?: string;
}

export interface SendChatMessagePayload {
  conversationId?: string;
  content?: string;
  message?: string;
  query?: string;
  agentId?: string;
  clientMessageId?: string;
  requestId?: string;
  stream?: boolean;
}

export interface ChatAssistantResponse {
  answer: string;
  content?: string;
  reply?: string;
  message?: string;
  confidence?: number;
  sources?: ChatSourceCitation[];
  charts?: ChatChart[];
  tables?: ChatTable[];
  followUpQuestions?: string[];
  follow_up_questions?: string[];
  suggestions?: string[];
  conversationId: string;
  conversation_id?: string;
  title?: string;
  messages?: ChatMessage[];
  messageId?: string;
  clientMessageId?: string;
  status?: MessageDeliveryStatus;
  requestId?: string;
  timingMs?: number;
  model?: string;
  provider?: string;
  ai_available?: boolean;
  degraded?: boolean;
}

export interface MessageDeliveryStatusResponse {
  conversationId: string;
  clientMessageId: string;
  status: MessageDeliveryStatus | "not_found";
  found: boolean;
  message?: ChatMessage;
  response?: ChatAssistantResponse;
  partialContent?: string;
  error?: string;
  updatedAt?: string;
}

export interface ChatSuggestionItem {
  label: string;
  cmd: string;
}

export interface ChatFeedbackPayload {
  conversationId?: string;
  messageId?: string;
  rating: "up" | "down" | number;
  feedback?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface WorkforcePlanningData {
  currentHeadcount: number;
  forecast: {
    horizonMonths: number;
    projectedHeadcount: number;
    projectedCost: number;
    attritionRate?: number;
    openPositions?: number;
    departments?: Array<{ department: string; count: number; projected?: number }>;
  };
}

export interface WorkforceForecast {
  horizonMonths: number;
  projectedHeadcount: number;
  projectedCost: number;
  recommendations?: string[];
  summary?: string;
}

export interface ForecastWorkforcePayload {
  horizonMonths?: number;
  departmentId?: string;
  growthRate?: number;
}

export type AIHubOperationKey =
  | "fetchChatConversations"
  | "createChatConversation"
  | "fetchChatConversation"
  | "sendChatMessage"
  | "deleteChatConversation"
  | "workforcePlanning";

export interface AIHubSliceState {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  messages: Record<string, ChatMessage[]>;
  operationLoading: Record<string, boolean>;
  operationError: Record<string, string | null>;
}

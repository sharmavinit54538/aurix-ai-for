/**
 * Helpdesk Types & Domain Models
 * Derived strictly from backend API contract (openapi.json lines 11333–11474 & HELPDESK_SHAPES.md).
 * No mock or dummy structures.
 */

export type HelpdeskCategory =
  | "it_hardware"
  | "it_software"
  | "hr_policy"
  | "payroll"
  | "facilities"
  | "other";

export type HelpdeskPriority = "low" | "medium" | "high" | "urgent";

export type HelpdeskStatus =
  | "open"
  | "in_progress"
  | "waiting_on_employee"
  | "resolved"
  | "closed";

export type SlaStatus = "ON_TRACK" | "AT_RISK" | "BREACHED" | "COMPLETED";

export interface HelpdeskTicketHistoryItem {
  id?: string;
  action: string;
  actor_id?: string;
  actor_name?: string;
  actor_role?: string;
  previous_value?: string;
  new_value?: string;
  timestamp: string;
  note?: string;
}

export interface HelpdeskTicket {
  id: string;
  ticket_number?: string;
  title: string;
  description?: string;
  category: HelpdeskCategory;
  priority: HelpdeskPriority;
  status: HelpdeskStatus;
  requester_id: string;
  requester_name?: string;
  requester_email?: string;
  requester_avatar?: string;
  department?: string;
  assigned_agent_id?: string | null;
  assigned_agent_name?: string | null;
  assigned_agent_email?: string | null;
  assigned_team?: string | null;
  attachment_urls?: string[];
  created_at: string;
  updated_at: string;
  due_at?: string | null;
  first_response_at?: string | null;
  resolved_at?: string | null;
  closed_at?: string | null;
  sla_status?: SlaStatus;
  related_asset_id?: string | null;
  history?: HelpdeskTicketHistoryItem[];
}

export interface HelpdeskComment {
  id: string;
  ticket_id: string;
  author_id: string;
  author_name: string;
  author_role?: string;
  author_email?: string;
  author_avatar?: string;
  content: string;
  attachments?: string[];
  is_internal?: boolean;
  created_at: string;
}

export interface CreateTicketInput {
  title: string;
  description: string;
  category: HelpdeskCategory;
  priority: HelpdeskPriority;
  attachment_urls?: string[];
  related_asset_id?: string;
}

export interface CreateTicketCommentInput {
  content: string;
  attachments?: string[];
}

export interface AddInternalNoteInput {
  note: string;
  mentions?: string[];
}

export interface UpdateTicketStatusInput {
  status: HelpdeskStatus;
  reason?: string;
}

export interface AssignTicketInput {
  agent_id: string;
}

export interface HelpdeskFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful_count?: number;
  unhelpful_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface UpsertFaqInput {
  id?: string;
  question: string;
  answer: string;
  category: string;
}

export interface HelpdeskMetrics {
  total_tickets: number;
  open_tickets: number;
  in_progress_tickets: number;
  resolved_tickets: number;
  sla_compliance_percentage: number;
  avg_first_response_time_minutes: number;
  avg_resolution_time_hours: number;
  by_category: Record<string, number>;
  by_priority: Record<string, number>;
  // Derived/optional aggregations
  closed_tickets?: number;
  waiting_tickets?: number;
  urgent_tickets?: number;
  sla_breached?: number;
  sla_at_risk?: number;
}

export interface AiChatInput {
  query: string;
  conversation_history?: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

export interface AiChatResponse {
  response: string;
  suggested_faqs?: Array<{
    id: string;
    question: string;
  }>;
  can_auto_resolve?: boolean;
  suggested_ticket_draft?: {
    category: HelpdeskCategory;
    title: string;
    priority: HelpdeskPriority;
  };
}

export interface HelpdeskAgent {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  department?: string;
}

export interface TicketListFilters {
  status?: string;
  category?: string;
  priority?: string;
  search?: string;
  assignedToMe?: boolean;
  dateRange?: string;
  page?: number;
  limit?: number;
}

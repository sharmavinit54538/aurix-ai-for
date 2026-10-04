import apiInstance from "@/api/apiInstance";
import type {
  HelpdeskTicket,
  HelpdeskComment,
  CreateTicketInput,
  CreateTicketCommentInput,
  AddInternalNoteInput,
  UpdateTicketStatusInput,
  AssignTicketInput,
  HelpdeskFaq,
  UpsertFaqInput,
  HelpdeskMetrics,
  AiChatInput,
  AiChatResponse,
  HelpdeskAgent,
  TicketListFilters,
} from "./types";

/**
 * Normalizes an API response envelope.
 * Unwraps `res.data.data` or `res.data` safely.
 */
function unwrapData<T>(res: unknown): T {
  const r = res as { data?: { data?: unknown } | unknown };
  if (r?.data && typeof r.data === "object" && "data" in (r.data as object)) {
    return (r.data as { data: T }).data;
  }
  if (r?.data !== undefined) return r.data as T;
  return res as T;
}

/**
 * Extracts a list of items safely from various backend response envelopes:
 * [...], { items: [...] }, { data: [...] }, { tickets: [...] }, { faqs: [...] }.
 * If the response is genuinely empty, returns an empty array.
 */
function extractList<T>(res: unknown, endpoint: string): T[] {
  const data = unwrapData<unknown>(res);
  if (Array.isArray(data)) {
    return data as T[];
  }
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of ["items", "data", "tickets", "faqs", "results"]) {
      if (Array.isArray(obj[key])) {
        return obj[key] as T[];
      }
    }
  }
  if (import.meta.env.DEV) {
    console.warn(`[helpdeskApi] ${endpoint} did not return an array. Keys:`, Object.keys((data as object) || {}));
  }
  return [];
}

/**
 * Normalizes error messages from Axios / Backend responses.
 */
export function getHelpdeskErrorMessage(error: unknown, fallback = "Unable to process request"): string {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  const err = error as {
    response?: {
      data?: {
        detail?: string | Array<{ msg?: string }>;
        message?: string;
        error?: string;
      };
      status?: number;
    };
    message?: string;
  };
  const detail = err.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
  if (err.response?.data?.message) return err.response.data.message;
  if (err.response?.data?.error) return err.response.data.error;
  if (err.message) return err.message;
  return fallback;
}

export const helpdeskApi = {
  /**
   * Fetch current authenticated employee's support tickets.
   * GET /api/v1/helpdesk/tickets/my
   */
  async getMyTickets(): Promise<HelpdeskTicket[]> {
    const res = await apiInstance.get("/api/v1/helpdesk/tickets/my");
    return extractList<HelpdeskTicket>(res, "/api/v1/helpdesk/tickets/my");
  },

  /**
   * Submit a new support ticket.
   * POST /api/v1/helpdesk/tickets
   */
  async createTicket(payload: CreateTicketInput): Promise<HelpdeskTicket> {
    const res = await apiInstance.post("/api/v1/helpdesk/tickets", payload);
    return unwrapData<HelpdeskTicket>(res);
  },

  /**
   * Fetch single ticket details by ID.
   * GET /api/v1/helpdesk/tickets/{ticketId}
   */
  async getTicketById(ticketId: string): Promise<HelpdeskTicket> {
    const res = await apiInstance.get(`/api/v1/helpdesk/tickets/${encodeURIComponent(ticketId)}`);
    return unwrapData<HelpdeskTicket>(res);
  },

  /**
   * Fetch public conversation comments for a ticket.
   * GET /api/v1/helpdesk/tickets/{ticketId}/comments
   */
  async getTicketComments(ticketId: string): Promise<HelpdeskComment[]> {
    const res = await apiInstance.get(`/api/v1/helpdesk/tickets/${encodeURIComponent(ticketId)}/comments`);
    return extractList<HelpdeskComment>(res, `/api/v1/helpdesk/tickets/${ticketId}/comments`);
  },

  /**
   * Add a reply comment to a ticket.
   * POST /api/v1/helpdesk/tickets/{ticketId}/comments
   */
  async addTicketComment(ticketId: string, payload: CreateTicketCommentInput): Promise<HelpdeskComment> {
    const res = await apiInstance.post(
      `/api/v1/helpdesk/tickets/${encodeURIComponent(ticketId)}/comments`,
      payload
    );
    return unwrapData<HelpdeskComment>(res);
  },

  /**
   * Upload an attachment file for ticket or comment.
   * POST /api/v1/helpdesk/tickets/attachments/upload
   */
  async uploadAttachment(file: File): Promise<{ url: string; filename: string; size?: number }> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiInstance.post("/api/v1/helpdesk/tickets/attachments/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const data = unwrapData<{ url?: string; file_url?: string; filename?: string; size?: number }>(res);
    const url = data.url || data.file_url || "";
    const filename = data.filename || file.name;
    return { url, filename, size: data.size ?? file.size };
  },

  /**
   * Fetch all tickets for triage (Admin / Agent view).
   * GET /api/v1/helpdesk/admin/tickets
   */
  async getAdminTickets(filters?: TicketListFilters): Promise<{ tickets: HelpdeskTicket[]; total?: number }> {
    const params: Record<string, string | number> = {};
    if (filters?.status && filters.status !== "all") params.status = filters.status;
    if (filters?.category && filters.category !== "all") params.category = filters.category;
    if (filters?.priority && filters.priority !== "all") params.priority = filters.priority;
    if (filters?.search) params.search = filters.search;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;

    const res = await apiInstance.get("/api/v1/helpdesk/admin/tickets", { params });
    const unwrapped = unwrapData<unknown>(res);

    if (Array.isArray(unwrapped)) {
      return { tickets: unwrapped as HelpdeskTicket[], total: unwrapped.length };
    }

    if (unwrapped && typeof unwrapped === "object") {
      const obj = unwrapped as Record<string, unknown>;
      const list = extractList<HelpdeskTicket>(res, "/api/v1/helpdesk/admin/tickets");
      const total = typeof obj.total === "number" ? obj.total : list.length;
      return { tickets: list, total };
    }

    return { tickets: [], total: 0 };
  },

  /**
   * Update ticket status (e.g. open -> in_progress -> resolved -> closed).
   * PATCH /api/v1/helpdesk/tickets/{ticketId}/status
   */
  async updateTicketStatus(ticketId: string, payload: UpdateTicketStatusInput): Promise<HelpdeskTicket> {
    const res = await apiInstance.patch(
      `/api/v1/helpdesk/tickets/${encodeURIComponent(ticketId)}/status`,
      payload
    );
    return unwrapData<HelpdeskTicket>(res);
  },

  /**
   * Assign or reassign ticket to an agent.
   * PATCH /api/v1/helpdesk/tickets/{ticketId}/assign
   */
  async assignTicket(ticketId: string, payload: AssignTicketInput): Promise<HelpdeskTicket> {
    const res = await apiInstance.patch(
      `/api/v1/helpdesk/tickets/${encodeURIComponent(ticketId)}/assign`,
      payload
    );
    return unwrapData<HelpdeskTicket>(res);
  },

  /**
   * Add agent-only internal note (hidden from employees).
   * POST /api/v1/helpdesk/tickets/{ticketId}/internal-notes
   */
  async addInternalNote(ticketId: string, payload: AddInternalNoteInput): Promise<{ message?: string; success?: boolean }> {
    const res = await apiInstance.post(
      `/api/v1/helpdesk/tickets/${encodeURIComponent(ticketId)}/internal-notes`,
      payload
    );
    return unwrapData<{ message?: string; success?: boolean }>(res);
  },

  /**
   * Fetch Knowledge Base / FAQs.
   * GET /api/v1/helpdesk/faqs
   */
  async getFaqs(): Promise<HelpdeskFaq[]> {
    const res = await apiInstance.get("/api/v1/helpdesk/faqs");
    return extractList<HelpdeskFaq>(res, "/api/v1/helpdesk/faqs");
  },

  /**
   * Upsert Knowledge Base FAQ article (Admin only).
   * POST /api/v1/helpdesk/admin/faqs
   */
  async upsertFaq(payload: UpsertFaqInput): Promise<HelpdeskFaq> {
    const res = await apiInstance.post("/api/v1/helpdesk/admin/faqs", payload);
    return unwrapData<HelpdeskFaq>(res);
  },

  /**
   * Fetch Helpdesk SLA & aggregation metrics.
   * GET /api/v1/helpdesk/admin/metrics
   */
  async getHelpdeskMetrics(): Promise<HelpdeskMetrics> {
    const res = await apiInstance.get("/api/v1/helpdesk/admin/metrics");
    return unwrapData<HelpdeskMetrics>(res);
  },

  /**
   * AI Support Chat for self-service or draft ticket creation.
   * POST /api/v1/helpdesk/ai/chat
   */
  async executeAiChat(payload: AiChatInput): Promise<AiChatResponse> {
    const res = await apiInstance.post("/api/v1/helpdesk/ai/chat", payload);
    return unwrapData<AiChatResponse>(res);
  },

  /**
   * Fetch real agents/colleagues from the organization for assignment.
   */
  async getAssignableAgents(): Promise<HelpdeskAgent[]> {
    try {
      const res = await apiInstance.get("/api/v1/connect/colleagues");
      const list = extractList<Record<string, unknown>>(res, "/api/v1/connect/colleagues");
      return list.map((u) => {
        const id = String(u.id || u.user_id || "");
        const firstName = String(u.first_name || "");
        const lastName = String(u.last_name || "");
        const fullName = String(u.name || u.full_name || `${firstName} ${lastName}`.trim() || u.email || "Agent");
        const email = String(u.email || "");
        const role = String(u.role || u.job_title || "Staff");
        const department = String(u.department || "");
        const avatar = typeof u.avatar === "string" ? u.avatar : undefined;
        return { id, name: fullName, email, role, avatar, department };
      }).filter((a) => Boolean(a.id));
    } catch {
      return [];
    }
  },
};

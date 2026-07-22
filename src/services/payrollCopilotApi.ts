import { api } from "@/api";
import { ApiError } from "@/api/client";

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  metadata?: {
    type?: "calculation" | "compliance" | "template" | "checklist";
    tableData?: { headers: string[]; rows: string[][] };
  };
}

function formatTimestamp(value?: string | null): string {
  if (value) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return value;
  }
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function unwrapPayload(res: unknown): Record<string, unknown> | null {
  if (!res || typeof res !== "object") return null;
  const root = res as Record<string, unknown>;
  const nested = root.data;
  if (nested && typeof nested === "object") {
    return nested as Record<string, unknown>;
  }
  return root;
}

function mapCopilotMessage(raw: unknown): CopilotMessage | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const role = item.role === "assistant" || item.role === "user" ? item.role : null;
  const content =
    typeof item.content === "string"
      ? item.content
      : typeof item.reply === "string"
        ? item.reply
        : typeof item.message === "string"
          ? item.message
          : "";

  if (!role || !content.trim()) return null;

  const metadata =
    item.metadata && typeof item.metadata === "object"
      ? (item.metadata as CopilotMessage["metadata"])
      : undefined;

  return {
    id: typeof item.id === "string" ? item.id : `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content: content.trim(),
    timestamp: formatTimestamp(typeof item.timestamp === "string" ? item.timestamp : null),
    metadata,
  };
}

function extractAssistantReply(payload: Record<string, unknown> | null): CopilotMessage | null {
  if (!payload) return null;

  const direct = mapCopilotMessage(payload);
  if (direct?.role === "assistant") return direct;

  const content =
    typeof payload.content === "string"
      ? payload.content
      : typeof payload.reply === "string"
        ? payload.reply
        : typeof payload.message === "string"
          ? payload.message
          : "";

  if (!content.trim()) return null;

  const metadata =
    payload.metadata && typeof payload.metadata === "object"
      ? (payload.metadata as CopilotMessage["metadata"])
      : undefined;

  return {
    id:
      typeof payload.id === "string"
        ? payload.id
        : `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role: "assistant",
    content: content.trim(),
    timestamp: formatTimestamp(typeof payload.timestamp === "string" ? payload.timestamp : null),
    metadata,
  };
}

function extractHistoryMessages(res: unknown): CopilotMessage[] {
  const payload = unwrapPayload(res);
  if (!payload) return [];

  const candidates = [
    payload.messages,
    payload.history,
    payload.items,
    Array.isArray(res) ? res : null,
  ];

  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) continue;
    return candidate
      .map(mapCopilotMessage)
      .filter((message): message is CopilotMessage => Boolean(message));
  }

  return [];
}

export const payrollCopilotApi = {
  sendMessage: async (prompt: string, history: CopilotMessage[] = []): Promise<CopilotMessage> => {
    const res = await api.post("payroll/copilot/chat", {
      prompt,
      history: history.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    });

    const reply = extractAssistantReply(unwrapPayload(res));
    if (!reply) {
      throw new ApiError("Payroll copilot returned an empty response.", 500, res);
    }

    return reply;
  },

  getHistory: async (): Promise<CopilotMessage[]> => {
    const res = await api.get("payroll/copilot/history");
    return extractHistoryMessages(res);
  },

  clearHistory: async (): Promise<void> => {
    await api.post("payroll/copilot/clear", {});
  },
};

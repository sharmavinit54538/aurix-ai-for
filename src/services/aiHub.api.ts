import axios from "axios";
import apiInstance, {
  API_TIMEOUTS,
  buildApiUrl,
  refreshAccessToken,
} from "@/api/apiInstance";
import { getAccessToken } from "@/api/tokens";
import { logger } from "@/lib/logger";
import type {
  ChatActionRequired,
  ChatCardType,
  ChatChart,
  ChatConversation,
  ChatFeedbackPayload,
  ChatMessage,
  ChatSourceCitation,
  ChatSuggestionItem,
  ChatTable,
  CreateConversationPayload,
  ForecastWorkforcePayload,
  MessageDeliveryStatus,
  MessageDeliveryStatusResponse,
  PaginationParams,
  SendChatMessagePayload,
  WorkforceForecast,
  WorkforcePlanningData,
} from "@/store/aiHub/aiHub.types";

const MAX_RETRIES = 2;

export function createClientMessageId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `cmsg_${crypto.randomUUID()}`;
  }
  return `cmsg_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export interface NormalizedAIError {
  message: string;
  code: string;
  status?: number;
  retryable: boolean;
  retryAfterMs?: number;
}

export class AIRequestError extends Error {
  status?: number;
  code: string;
  retryable: boolean;
  retryAfterMs?: number;
  accepted: boolean;
  partialContent?: string;

  constructor(
    message: string,
    opts?: {
      status?: number;
      code?: string;
      retryable?: boolean;
      retryAfterMs?: number;
      accepted?: boolean;
      partialContent?: string;
    },
  ) {
    super(message);
    this.name = "AIRequestError";
    this.status = opts?.status;
    this.code = opts?.code || "ai_request_error";
    this.retryable = opts?.retryable ?? true;
    this.retryAfterMs = opts?.retryAfterMs;
    this.accepted = opts?.accepted ?? false;
    this.partialContent = opts?.partialContent;
  }
}

export function normalizeAIError(err: unknown): NormalizedAIError {
  if (err instanceof AIRequestError) {
    return {
      message: err.message,
      code: err.code,
      status: err.status,
      retryable: err.retryable,
      retryAfterMs: err.retryAfterMs,
    };
  }

  if (err instanceof DOMException && err.name === "AbortError") {
    return {
      message: "Generation stopped.",
      code: "cancelled",
      retryable: false,
    };
  }

  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const rawMsg =
      (err.response?.data as { message?: string; detail?: string } | undefined)?.message ||
      (err.response?.data as { message?: string; detail?: string } | undefined)?.detail ||
      err.message ||
      "";

    if (import.meta.env.DEV) {
      logger.error("AI Hub API Axios error", { status, code: err.code, rawMsg });
    }

    if (err.code === "ERR_CANCELED") {
      return { message: "Generation stopped.", code: "cancelled", retryable: false };
    }
    if (err.code === "ECONNABORTED" || /timeout/i.test(rawMsg)) {
      return {
        message: "The assistant is taking longer than expected.",
        code: "timeout",
        status: status ?? 504,
        retryable: true,
      };
    }
    if (!status && (/network error/i.test(rawMsg) || err.code === "ERR_NETWORK")) {
      return {
        message: "Unable to connect to the server. Please check your connection and try again.",
        code: "network_error",
        retryable: true,
      };
    }
    return mapHttpStatusToFriendlyError(status, rawMsg, err.response?.headers?.["retry-after"]);
  }

  const msg = err instanceof Error ? err.message : String(err || "");
  if (/abort|cancel/i.test(msg)) {
    return { message: "Generation stopped.", code: "cancelled", retryable: false };
  }
  if (/timeout/i.test(msg)) {
    return {
      message: "The assistant is taking longer than expected.",
      code: "timeout",
      status: 504,
      retryable: true,
    };
  }
  if (/failed to fetch|network/i.test(msg)) {
    return {
      message: "Unable to connect to the server. Please check your connection and try again.",
      code: "network_error",
      retryable: true,
    };
  }
  if (import.meta.env.DEV) {
    logger.error("AI Hub unexpected error", err);
  }
  return {
    message: "Unable to generate a response. Please try again.",
    code: "unknown_error",
    retryable: true,
  };
}

function parseRetryAfterMs(headerVal?: unknown): number | undefined {
  if (typeof headerVal !== "string" || !headerVal.trim()) return undefined;
  const seconds = Number(headerVal.trim());
  if (!Number.isNaN(seconds) && seconds > 0) {
    return Math.min(seconds * 1000, 15_000);
  }
  return undefined;
}

function mapHttpStatusToFriendlyError(
  status?: number,
  backendDetail?: string,
  retryAfterHeader?: unknown,
): NormalizedAIError {
  const retryAfterMs = parseRetryAfterMs(retryAfterHeader);
  switch (status) {
    case 401:
      return {
        message: "Your session has expired. Please sign in again.",
        code: "unauthorized",
        status: 401,
        retryable: false,
      };
    case 403:
      return {
        message: "You do not have permission to access this assistant.",
        code: "forbidden",
        status: 403,
        retryable: false,
      };
    case 404:
      return {
        message: "Conversation could not be found.",
        code: "not_found",
        status: 404,
        retryable: false,
      };
    case 429:
      return {
        message: "Too many requests right now. Please wait a moment before retrying.",
        code: "rate_limited",
        status: 429,
        retryable: true,
        retryAfterMs,
      };
    case 502:
      return {
        message: "Unable to generate a response. The AI provider encountered an error.",
        code: "bad_gateway",
        status: 502,
        retryable: true,
      };
    case 503:
      return {
        message: "The AI assistant service is temporarily unavailable. Please try again shortly.",
        code: "service_unavailable",
        status: 503,
        retryable: true,
      };
    case 504:
      return {
        message: "The assistant is taking longer than expected.",
        code: "gateway_timeout",
        status: 504,
        retryable: true,
      };
    case 500:
    default:
      if (import.meta.env.DEV && backendDetail) {
        logger.debug("Backend AI error detail (suppressed in UI):", backendDetail);
      }
      return {
        message: "Unable to generate a response. Please try again.",
        code: status ? `http_${status}` : "server_error",
        status,
        retryable: !status || status >= 500,
      };
  }
}

function sleepWithAbort(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(() => {
      cleanup();
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      cleanup();
      reject(new DOMException("Aborted", "AbortError"));
    };
    const cleanup = () => signal?.removeEventListener("abort", onAbort);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

async function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  options?: {
    signal?: AbortSignal;
    maxRetries?: number;
    shouldRetry?: (err: unknown) => boolean;
  },
): Promise<T> {
  const maxRetries = options?.maxRetries ?? MAX_RETRIES;
  let lastErr: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (options?.signal?.aborted) {
      throw new DOMException("Aborted", "AbortError");
    }
    try {
      return await fn(attempt);
    } catch (err) {
      lastErr = err;
      const norm = normalizeAIError(err);
      const allow = options?.shouldRetry ? options.shouldRetry(err) : norm.retryable;
      if (!allow || attempt >= maxRetries || norm.code === "cancelled" || norm.status === 401 || norm.status === 403) {
        throw err;
      }
      const jitter = Math.floor(Math.random() * 250);
      const delayMs = norm.retryAfterMs ?? Math.min(4000, 400 * Math.pow(2, attempt) + jitter);
      await sleepWithAbort(delayMs, options?.signal);
    }
  }
  throw lastErr;
}

function extractData<T>(res: { data?: unknown }, fallback?: T): T {
  const body = res?.data;
  if (body && typeof body === "object" && "data" in body) {
    const inner = (body as { data?: unknown }).data;
    if (inner !== undefined && inner !== null) {
      return inner as T;
    }
  }
  if (body !== undefined && body !== null) {
    return body as T;
  }
  return fallback as T;
}

export function mapToChatMessage(raw: unknown, fallbackConversationId?: string): ChatMessage {
  const d = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  let content = String(d.answer ?? d.content ?? d.reply ?? d.message ?? "");

  let embeddedCardType: ChatCardType | undefined;
  let embeddedCardData: Record<string, unknown> | undefined;
  let embeddedActionRequired: ChatActionRequired | undefined;

  const jsonFenceRegex = /```json\s*([\s\S]*?)```/i;
  const match = jsonFenceRegex.exec(content);
  if (match && match[1]) {
    try {
      const parsed = JSON.parse(match[1].trim()) as Record<string, unknown>;
      if (parsed && typeof parsed === "object") {
        if ("cardType" in parsed || "cardData" in parsed || "actionRequired" in parsed) {
          if (typeof parsed.cardType === "string") {
            embeddedCardType = parsed.cardType as ChatCardType;
          }
          if (parsed.cardData && typeof parsed.cardData === "object") {
            embeddedCardData = parsed.cardData as Record<string, unknown>;
          }
          if (parsed.actionRequired && typeof parsed.actionRequired === "object") {
            embeddedActionRequired = parsed.actionRequired as ChatActionRequired;
          }
          content = content.replace(match[0], "").trim();
        }
      }
    } catch {
      // Non-structured code block; keep original markdown intact
    }
  }

  const rawSender = String(d.sender ?? d.role ?? "assistant").toLowerCase();
  const isUser = rawSender === "user";
  const isSystem = rawSender === "system";
  const convId = String(d.conversationId ?? d.conversation_id ?? fallbackConversationId ?? "");
  const msgId = String(
    d.messageId ??
      d.message_id ??
      d.id ??
      `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  );

  const rawSuggestions = d.suggestions ?? d.followUpQuestions ?? d.follow_up_questions;
  const suggestions = Array.isArray(rawSuggestions)
    ? rawSuggestions.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : undefined;

  const sources = Array.isArray(d.sources) ? (d.sources as ChatSourceCitation[]) : undefined;
  const charts = Array.isArray(d.charts) ? (d.charts as ChatChart[]) : undefined;
  const tables = Array.isArray(d.tables) ? (d.tables as ChatTable[]) : undefined;

  const statusRaw = d.status as MessageDeliveryStatus | undefined;
  const failed = Boolean(d.failed) || statusRaw === "failed";
  const status: MessageDeliveryStatus = statusRaw ?? (failed ? "failed" : "completed");

  return {
    id: msgId,
    conversationId: convId || undefined,
    role: isUser ? "user" : isSystem ? "system" : "ai",
    sender: isUser ? "user" : isSystem ? "system" : "assistant",
    content,
    timestamp: String(d.timestamp ?? d.createdAt ?? d.created_at ?? new Date().toISOString()),
    agentId: typeof d.agentId === "string" ? d.agentId : undefined,
    clientMessageId:
      typeof d.clientMessageId === "string"
        ? d.clientMessageId
        : typeof d.client_message_id === "string"
          ? d.client_message_id
          : undefined,
    requestId:
      typeof d.requestId === "string"
        ? d.requestId
        : typeof d.request_id === "string"
          ? d.request_id
          : undefined,
    status,
    failed,
    isPartial: Boolean(d.isPartial ?? d.is_partial) || status === "interrupted" || status === "cancelled",
    model: typeof d.model === "string" ? d.model : undefined,
    provider: typeof d.provider === "string" ? d.provider : undefined,
    cardType: (d.cardType ?? d.card_type ?? embeddedCardType) as ChatCardType | undefined,
    cardData:
      ((d.cardData ?? d.card_data ?? embeddedCardData) as Record<string, unknown> | undefined),
    actionRequired:
      ((d.actionRequired ?? d.action_required ?? embeddedActionRequired) as
        | ChatActionRequired
        | undefined),
    suggestions,
    sources,
    charts,
    tables,
    metadata: (d.metadata && typeof d.metadata === "object"
      ? (d.metadata as Record<string, unknown>)
      : undefined),
  };
}

export function normalizeChatConversation(raw: unknown): ChatConversation {
  const d = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const id = String(d.conversationId ?? d.conversation_id ?? d.id ?? "");
  const rawMsgs = Array.isArray(d.messages) ? d.messages : [];
  const messages = rawMsgs.map((m) => mapToChatMessage(m, id));
  const nowIso = new Date().toISOString();

  return {
    id,
    title: String(d.title ?? d.lastMessage ?? d.last_message ?? "New Conversation").slice(0, 80),
    agentId: typeof d.agentId === "string" ? d.agentId : "general-copilot",
    lastMessage: typeof d.lastMessage === "string"
      ? d.lastMessage
      : typeof d.last_message === "string"
        ? d.last_message
        : messages[messages.length - 1]?.content,
    messageCount: typeof d.messageCount === "number"
      ? d.messageCount
      : typeof d.message_count === "number"
        ? d.message_count
        : messages.length,
    messages,
    createdAt: String(d.createdAt ?? d.created_at ?? d.updatedAt ?? d.updated_at ?? nowIso),
    updatedAt: String(d.updatedAt ?? d.updated_at ?? d.createdAt ?? nowIso),
  };
}

export interface StreamChunkEvent {
  delta: string;
  content: string;
  conversationId: string;
  clientMessageId: string;
  requestId?: string;
  model?: string;
  provider?: string;
}

export interface StreamStatusEvent {
  status: MessageDeliveryStatus;
  conversationId: string;
  clientMessageId: string;
  requestId?: string;
  userMessageId?: string;
}

export interface StreamChatHandlers {
  onStatus?: (evt: StreamStatusEvent) => void;
  onChunk?: (evt: StreamChunkEvent) => void;
  onComplete?: (msg: ChatMessage) => void;
  onCancelled?: (partialContent: string, conversationId: string) => void;
  onError?: (err: AIRequestError) => void;
}

function parseSseBlock(block: string): { event: string; data: unknown } | null {
  const lines = block.split("\n");
  let eventName = "message";
  const dataLines: string[] = [];

  for (const line of lines) {
    if (!line || line.startsWith(":")) continue;
    if (line.startsWith("event:")) {
      eventName = line.slice(6).trim();
    } else if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trim());
    }
  }
  if (!dataLines.length) return null;
  const rawJson = dataLines.join("\n");
  try {
    return { event: eventName, data: JSON.parse(rawJson) };
  } catch {
    return { event: eventName, data: { delta: rawJson, content: rawJson } };
  }
}

export const aiHubApi = {
  async getChatConversations(params?: PaginationParams): Promise<ChatConversation[]> {
    const res = await apiInstance.get("/api/v1/ai-hub/chat-assistant/conversations", {
      params,
      timeout: API_TIMEOUTS.chatHistory,
    });
    const raw = extractData<unknown>(res, []);
    let items: unknown[] = [];
    if (Array.isArray(raw)) {
      items = raw;
    } else if (raw && typeof raw === "object") {
      const obj = raw as Record<string, unknown>;
      if (Array.isArray(obj.history)) items = obj.history;
      else if (Array.isArray(obj.items)) items = obj.items;
    }
    return items.map((c) => normalizeChatConversation(c)).filter((c) => Boolean(c.id));
  },

  async getChatConversation(conversationId: string): Promise<ChatConversation> {
    const res = await apiInstance.get(
      `/api/v1/ai-hub/chat-assistant/conversations/${encodeURIComponent(conversationId)}`,
      { timeout: API_TIMEOUTS.chatHistory },
    );
    const data = extractData<Record<string, unknown>>(res, {});
    const conv = normalizeChatConversation({
      ...data,
      id: data.conversationId ?? data.conversation_id ?? conversationId,
    });
    if (conv.messages.length === 0 && typeof data.answer === "string" && data.answer.trim()) {
      conv.messages = [mapToChatMessage(data, conv.id)];
    }
    return conv;
  },

  async createChatConversation(payload?: CreateConversationPayload): Promise<ChatConversation> {
    const hasInitialPrompt = Boolean(payload?.initialMessage?.trim() || payload?.message?.trim());
    const res = await apiInstance.post(
      "/api/v1/ai-hub/chat-assistant/conversations",
      {
        title: payload?.title ?? "New Conversation",
        initialMessage: payload?.initialMessage ?? payload?.message,
        agentId: payload?.agentId ?? "general-copilot",
        department_id: payload?.departmentId,
      },
      {
        timeout: hasInitialPrompt ? API_TIMEOUTS.aiMessage : API_TIMEOUTS.standard,
      },
    );
    const data = extractData<Record<string, unknown>>(res, {});
    const conv = normalizeChatConversation(data);
    if (conv.messages.length === 0 && typeof data.answer === "string" && data.answer.trim()) {
      conv.messages = [mapToChatMessage(data, conv.id)];
    }
    return conv;
  },

  async sendChatMessage(
    payload: SendChatMessagePayload,
    options?: { signal?: AbortSignal; timeoutMs?: number },
  ): Promise<ChatMessage> {
    const text = (payload.content ?? payload.message ?? payload.query ?? "").trim();
    const clientMessageId = payload.clientMessageId || createClientMessageId();
    const conversationId = payload.conversationId;

    const sendOnce = async () => {
      const res = await apiInstance.post(
        "/api/v1/ai-hub/chat-assistant/message",
        {
          conversationId,
          content: text,
          message: text,
          agentId: payload.agentId,
          clientMessageId,
          requestId: payload.requestId,
        },
        {
          signal: options?.signal,
          timeout: options?.timeoutMs ?? API_TIMEOUTS.aiMessage,
        },
      );
      const data = extractData<Record<string, unknown>>(res, {});
      return mapToChatMessage({ ...data, clientMessageId }, conversationId);
    };

    try {
      return await withRetry(sendOnce, {
        signal: options?.signal,
        maxRetries: 1,
        shouldRetry: (err) => {
          const norm = normalizeAIError(err);
          // Only retry fast network/502/503/429 glitches, never after local timeout if backend may still be running
          return (
            norm.retryable &&
            norm.code !== "timeout" &&
            norm.status !== 504
          );
        },
      });
    } catch (err) {
      if (conversationId && !options?.signal?.aborted) {
        const reconciled = await aiHubApi
          .reconcileMessageStatus(conversationId, clientMessageId)
          .catch(() => null);
        if (reconciled?.found && reconciled.status === "completed" && reconciled.response) {
          return mapToChatMessage(reconciled.response, conversationId);
        }
      }
      const norm = normalizeAIError(err);
      throw new AIRequestError(norm.message, norm);
    }
  },

  async streamChatMessage(
    payload: SendChatMessagePayload,
    handlers: StreamChatHandlers,
    options?: { signal?: AbortSignal; timeoutMs?: number; idleTimeoutMs?: number },
  ): Promise<ChatMessage> {
    const text = (payload.content ?? payload.message ?? payload.query ?? "").trim();
    const clientMessageId = payload.clientMessageId || createClientMessageId();
    let acceptedConvId = payload.conversationId || "";
    let partialContent = "";
    let terminalMessage: ChatMessage | null = null;
    let streamErrored: AIRequestError | null = null;
    let cancelledByServer = false;

    const overallTimeoutMs = options?.timeoutMs ?? API_TIMEOUTS.aiMessage;
    const idleTimeoutMs = options?.idleTimeoutMs ?? API_TIMEOUTS.streamIdle;

    const controller = new AbortController();
    let timeoutReason: "overall" | "idle" | null = null;

    const onExternalAbort = () => {
      controller.abort();
      if (acceptedConvId) {
        void aiHubApi.cancelChatGeneration(acceptedConvId, clientMessageId).catch(() => {});
      }
    };
    if (options?.signal?.aborted) {
      throw new AIRequestError("Generation stopped.", { code: "cancelled", retryable: false });
    }
    options?.signal?.addEventListener("abort", onExternalAbort, { once: true });

    const overallTimer = setTimeout(() => {
      timeoutReason = "overall";
      controller.abort();
    }, overallTimeoutMs);

    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        timeoutReason = "idle";
        controller.abort();
      }, idleTimeoutMs);
    };

    try {
      const streamUrl = buildApiUrl("/api/v1/ai-hub/chat-assistant/stream");
      const reqBody = JSON.stringify({
        conversationId: payload.conversationId || undefined,
        content: text,
        message: text,
        agentId: payload.agentId,
        clientMessageId,
        requestId: payload.requestId,
        stream: true,
      });

      const doFetch = async (bearerToken: string | null) =>
        fetch(streamUrl, {
          method: "POST",
          credentials: "include",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
            ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
            ...(payload.requestId ? { "X-Request-ID": payload.requestId } : {}),
          },
          body: reqBody,
        });

      resetIdleTimer();
      let res = await doFetch(getAccessToken());
      if (res.status === 401) {
        const refreshedToken = await refreshAccessToken().catch(() => null);
        if (!refreshedToken) {
          throw new AIRequestError("Your session has expired. Please sign in again.", {
            status: 401,
            code: "unauthorized",
            retryable: false,
          });
        }
        res = await doFetch(refreshedToken);
      }

      if (!res.ok) {
        let backendDetail = "";
        try {
          const errJson = (await res.json()) as { message?: string; detail?: string };
          backendDetail = errJson.message || errJson.detail || "";
        } catch {
          // ignore non-json body
        }
        const mapped = mapHttpStatusToFriendlyError(
          res.status,
          backendDetail,
          res.headers.get("retry-after"),
        );
        throw new AIRequestError(mapped.message, mapped);
      }

      if (!res.body) {
        throw new AIRequestError("Unable to read streaming response.", {
          code: "stream_unsupported",
          retryable: true,
        });
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      const processBlock = (rawBlock: string) => {
        const parsed = parseSseBlock(rawBlock);
        if (!parsed) return;
        const payloadObj =
          parsed.data && typeof parsed.data === "object"
            ? (parsed.data as Record<string, unknown>)
            : {};

        if (typeof payloadObj.conversationId === "string" && payloadObj.conversationId) {
          acceptedConvId = payloadObj.conversationId;
        }

        switch (parsed.event) {
          case "status": {
            const st = String(payloadObj.status || "accepted") as MessageDeliveryStatus;
            handlers.onStatus?.({
              status: st,
              conversationId: acceptedConvId,
              clientMessageId,
              requestId: typeof payloadObj.requestId === "string" ? payloadObj.requestId : undefined,
              userMessageId:
                typeof payloadObj.userMessageId === "string" ? payloadObj.userMessageId : undefined,
            });
            break;
          }
          case "heartbeat":
            break;
          case "chunk": {
            const delta = typeof payloadObj.delta === "string" ? payloadObj.delta : "";
            const content =
              typeof payloadObj.content === "string" ? payloadObj.content : partialContent + delta;
            partialContent = content;
            handlers.onChunk?.({
              delta,
              content,
              conversationId: acceptedConvId,
              clientMessageId,
              requestId: typeof payloadObj.requestId === "string" ? payloadObj.requestId : undefined,
              model: typeof payloadObj.model === "string" ? payloadObj.model : undefined,
              provider: typeof payloadObj.provider === "string" ? payloadObj.provider : undefined,
            });
            break;
          }
          case "cancelled": {
            cancelledByServer = true;
            const part =
              typeof payloadObj.partialContent === "string"
                ? payloadObj.partialContent
                : partialContent;
            partialContent = part;
            handlers.onCancelled?.(part, acceptedConvId);
            break;
          }
          case "error": {
            const statusCode =
              typeof payloadObj.statusCode === "number" ? payloadObj.statusCode : undefined;
            const part =
              typeof payloadObj.partialContent === "string"
                ? payloadObj.partialContent
                : partialContent;
            partialContent = part;
            const message =
              typeof payloadObj.message === "string" && payloadObj.message.trim()
                ? payloadObj.message
                : "Unable to generate a response. Please try again.";
            streamErrored = new AIRequestError(message, {
              status: statusCode,
              code: typeof payloadObj.code === "string" ? payloadObj.code : "stream_error",
              retryable: Boolean(payloadObj.retryable ?? true),
              accepted: Boolean(acceptedConvId),
              partialContent: part || undefined,
            });
            handlers.onError?.(streamErrored);
            break;
          }
          case "complete": {
            terminalMessage = mapToChatMessage(
              { ...payloadObj, clientMessageId, status: "completed" },
              acceptedConvId,
            );
            handlers.onComplete?.(terminalMessage);
            break;
          }
          default:
            break;
        }
      };

      while (true) {
        const { value, done } = await reader.read();
        resetIdleTimer();
        if (done) break;
        buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");
        let splitIdx = buffer.indexOf("\n\n");
        while (splitIdx !== -1) {
          const block = buffer.slice(0, splitIdx);
          buffer = buffer.slice(splitIdx + 2);
          if (block.trim()) processBlock(block);
          splitIdx = buffer.indexOf("\n\n");
        }
      }
      if (buffer.trim()) {
        processBlock(buffer);
      }

      if (terminalMessage) return terminalMessage;
      if (streamErrored) throw streamErrored;
      if (cancelledByServer) {
        return mapToChatMessage(
          {
            answer: partialContent,
            conversationId: acceptedConvId,
            clientMessageId,
            status: "cancelled",
            isPartial: true,
          },
          acceptedConvId,
        );
      }

      // Connection ended unexpectedly without terminal event: reconcile backend state before failing
      if (acceptedConvId) {
        const reconciled = await aiHubApi
          .reconcileMessageStatus(acceptedConvId, clientMessageId)
          .catch(() => null);
        if (reconciled?.found) {
          if (reconciled.status === "completed" && reconciled.response) {
            const recMsg = mapToChatMessage(reconciled.response, acceptedConvId);
            handlers.onComplete?.(recMsg);
            return recMsg;
          }
          if (reconciled.partialContent) {
            partialContent = reconciled.partialContent;
          }
        }
      }

      throw new AIRequestError(
        partialContent
          ? "Response stream was interrupted. Partial output has been preserved."
          : "Unable to generate a response. Please try again.",
        {
          code: "stream_interrupted",
          retryable: true,
          accepted: Boolean(acceptedConvId),
          partialContent: partialContent || undefined,
        },
      );
    } catch (err) {
      if (options?.signal?.aborted) {
        throw new AIRequestError("Generation stopped.", {
          code: "cancelled",
          retryable: false,
          accepted: Boolean(acceptedConvId),
          partialContent: partialContent || undefined,
        });
      }
      if (timeoutReason) {
        if (acceptedConvId) {
          const reconciled = await aiHubApi
            .reconcileMessageStatus(acceptedConvId, clientMessageId)
            .catch(() => null);
          if (reconciled?.found && reconciled.status === "completed" && reconciled.response) {
            const recMsg = mapToChatMessage(reconciled.response, acceptedConvId);
            handlers.onComplete?.(recMsg);
            return recMsg;
          }
          if (reconciled?.partialContent) {
            partialContent = reconciled.partialContent;
          }
        }
        throw new AIRequestError("The assistant is taking longer than expected.", {
          status: 504,
          code: timeoutReason === "idle" ? "stream_idle_timeout" : "timeout",
          retryable: true,
          accepted: Boolean(acceptedConvId),
          partialContent: partialContent || undefined,
        });
      }
      if (err instanceof AIRequestError) throw err;
      const norm = normalizeAIError(err);
      throw new AIRequestError(norm.message, {
        ...norm,
        accepted: Boolean(acceptedConvId),
        partialContent: partialContent || undefined,
      });
    } finally {
      clearTimeout(overallTimer);
      if (idleTimer) clearTimeout(idleTimer);
      options?.signal?.removeEventListener("abort", onExternalAbort);
    }
  },

  async reconcileMessageStatus(
    conversationId: string,
    clientMessageId: string,
  ): Promise<MessageDeliveryStatusResponse> {
    const res = await apiInstance.get(
      `/api/v1/ai-hub/chat-assistant/conversations/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(clientMessageId)}/status`,
      { timeout: API_TIMEOUTS.chatHistory },
    );
    const data = extractData<Record<string, unknown>>(res, {});
    return {
      conversationId: String(data.conversationId ?? data.conversation_id ?? conversationId),
      clientMessageId: String(data.clientMessageId ?? data.client_message_id ?? clientMessageId),
      status: String(data.status || "not_found") as MessageDeliveryStatus | "not_found",
      found: Boolean(data.found),
      message: data.message ? mapToChatMessage(data.message, conversationId) : undefined,
      response: data.response as MessageDeliveryStatusResponse["response"],
      partialContent: typeof data.partialContent === "string" ? data.partialContent : undefined,
      error: typeof data.error === "string" ? data.error : undefined,
      updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : undefined,
    };
  },

  async cancelChatGeneration(
    conversationId: string,
    clientMessageId?: string,
  ): Promise<{ cancelled: boolean }> {
    const url = clientMessageId
      ? `/api/v1/ai-hub/chat-assistant/conversations/${encodeURIComponent(conversationId)}/messages/${encodeURIComponent(clientMessageId)}/cancel`
      : `/api/v1/ai-hub/chat-assistant/conversations/${encodeURIComponent(conversationId)}/cancel`;
    const res = await apiInstance.post(url, {}, { timeout: API_TIMEOUTS.standard });
    return extractData<{ cancelled: boolean }>(res, { cancelled: false });
  },

  async deleteChatConversation(conversationId: string): Promise<{ success: boolean; id: string }> {
    await apiInstance.delete(
      `/api/v1/ai-hub/chat-assistant/conversations/${encodeURIComponent(conversationId)}`,
      { timeout: API_TIMEOUTS.standard },
    );
    return { success: true, id: conversationId };
  },

  async getChatSuggestions(): Promise<ChatSuggestionItem[]> {
    const res = await apiInstance.get("/api/v1/ai-hub/chat-assistant/suggestions", {
      timeout: API_TIMEOUTS.chatHistory,
    });
    const raw = extractData<unknown>(res, {});
    const toItem = (text: string): ChatSuggestionItem => ({
      label: text.length > 48 ? `${text.slice(0, 45)}...` : text,
      cmd: text,
    });

    if (Array.isArray(raw)) {
      return raw
        .map((item) =>
          typeof item === "string"
            ? toItem(item)
            : typeof item === "object" && item && "cmd" in item
              ? (item as ChatSuggestionItem)
              : null,
        )
        .filter((x): x is ChatSuggestionItem => Boolean(x));
    }

    if (raw && typeof raw === "object") {
      const obj = raw as Record<string, unknown>;
      const list = [
        ...(Array.isArray(obj.suggested_prompts) ? obj.suggested_prompts : []),
        ...(Array.isArray(obj.popular_queries) ? obj.popular_queries : []),
        ...(Array.isArray(obj.role_based_prompts) ? obj.role_based_prompts : []),
      ];
      return list
        .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
        .slice(0, 6)
        .map(toItem);
    }

    return [];
  },

  async sendChatFeedback(payload: ChatFeedbackPayload): Promise<{ success: boolean }> {
    const res = await apiInstance.post(
      "/api/v1/ai-hub/chat-assistant/feedback",
      {
        conversationId: payload.conversationId,
        messageId: payload.messageId,
        rating: payload.rating,
        feedback: payload.feedback,
      },
      { timeout: API_TIMEOUTS.standard },
    );
    return extractData<{ success: boolean }>(res, { success: true });
  },

  async getWorkforcePlanning(): Promise<WorkforcePlanningData> {
    const res = await apiInstance.get("/api/v1/ai/workforce/dashboard", {
      timeout: API_TIMEOUTS.standard,
    });
    return extractData<WorkforcePlanningData>(res, {
      currentHeadcount: 0,
      forecast: {
        horizonMonths: 12,
        projectedHeadcount: 0,
        projectedCost: 0,
      },
    });
  },

  async forecastWorkforce(payload?: ForecastWorkforcePayload): Promise<WorkforceForecast> {
    const res = await apiInstance.post("/api/v1/ai/workforce/forecast", payload ?? {}, {
      timeout: API_TIMEOUTS.aiComplex,
    });
    return extractData<WorkforceForecast>(res, {
      horizonMonths: payload?.horizonMonths ?? 12,
      projectedHeadcount: 0,
      projectedCost: 0,
    });
  },
};

export default aiHubApi;

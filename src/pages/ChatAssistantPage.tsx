import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  MessageSquare,
  Send,
  Sparkles,
  FileText,
  CalendarClock,
  AlertCircle,
  RefreshCw,
  Check,
  Loader2,
  Plus,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  Square,
  History,
  Trash2,
} from "lucide-react";
import { AgentToolCallCard } from "@/features/autopilot/components/AgentToolCallCard";
import { autopilotApi } from "@/features/autopilot/services/autopilotApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { toast } from "sonner";
import { useRecruitment, newId } from "@/features/admin/recruitment/hooks/useRecruitment";
import type { Stage, EmploymentType, WorkMode } from "@/features/admin/recruitment/types";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  createChatConversation,
  fetchChatConversations,
  fetchChatConversation,
  deleteChatConversation,
} from "@/store/aiHub/aiHub.thunks";
import {
  setActiveConversation,
  clearOperationStatus,
  addLocalMessage,
  appendStreamChunk,
  finalizeStreamMessage,
  interruptStreamMessage,
} from "@/store/aiHub/aiHub.slice";
import {
  selectChatAssistant,
  selectAIHubOperationLoading,
  selectAIHubOperationError,
} from "@/store/aiHub/aiHub.selectors";
import { aiHubApi, createClientMessageId, normalizeAIError } from "@/services/aiHub.api";
import { useAuthReady } from "@/lib/auth-bootstrap";
import type {
  ChatMessage,
  ChatActionRequired,
  ChatChart,
  CandidateCardData,
  JobCardData,
  InterviewCardData,
  OfferCardData,
  OnboardingCardData,
  PayrollCardData,
} from "@/store/aiHub/aiHub.types";

const COMMAND_SUGGESTIONS = [
  { label: "Apply 2 days leave", cmd: "Apply 2 days casual leave from Monday" },
  { label: "Send last payslip", cmd: "Send my last payslip to my email" },
  { label: "Experience letter", cmd: "I need an experience letter generated" },
  { label: "Active job postings", cmd: "List active job openings" },
  { label: "Show onboarding progress", cmd: "Show employee onboarding progress" },
  { label: "Payroll & attendance summary", cmd: "Show monthly payroll and attendance summary" },
];

const SESSION_KEY = "lastActiveChatConversationId";
const PENDING_KEY = "lastPendingChatMessage";

export function formatMarkdownForRender(content: string): string {
  if (!content || !content.includes("|")) return content;
  const hasDelimiter = /\|[\s:-]*-{2,}[\s:-]*\|/.test(content);
  if (!hasDelimiter) return content;

  const outputLines: string[] = [];
  let inTableBlock = false;

  for (const rawLine of content.split("\n")) {
    const lineHasDelimiter = /\|[\s:-]*-{2,}[\s:-]*\|/.test(rawLine);
    const hasAdjacentRowPipes = /\|[ \t]+\|/.test(rawLine);
    const trimmed = rawLine.trim();

    if (hasAdjacentRowPipes && (lineHasDelimiter || (inTableBlock && trimmed.startsWith("|")))) {
      let line = rawLine;
      const firstPipeIdx = line.indexOf("|");
      if (firstPipeIdx > 0 && line.slice(0, firstPipeIdx).trim().length > 0) {
        outputLines.push(line.slice(0, firstPipeIdx).trimEnd(), "");
        line = line.slice(firstPipeIdx);
      }
      const splitRows = line.replace(/\|[ \t]+\|/g, "|\n|").split("\n");
      for (const row of splitRows) {
        const cleanRow = row.trim();
        if (cleanRow) outputLines.push(cleanRow);
      }
      inTableBlock = true;
      continue;
    }

    inTableBlock = trimmed.startsWith("|") && trimmed.endsWith("|");
    outputLines.push(rawLine);
  }

  return outputLines.join("\n");
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "m-welcome",
  conversationId: undefined,
  sender: "assistant",
  role: "ai",
  status: "completed",
  content:
    "Hi 👋 I am your OFC360 workforce copilot. You can ask questions about your workforce or issue text commands to search candidates, inspect job postings, review scheduled interviews, structure offers, and monitor payroll records.",
  timestamp: new Date().toISOString(),
};

function ChatChartRenderer({ chart }: { chart: ChatChart }) {
  if (!chart.data || chart.data.length === 0) return null;
  const sample = chart.data[0];
  const keys = Object.keys(sample);
  const xKey = keys.find((k) => typeof sample[k] === "string") || keys[0] || "name";
  const yKey =
    keys.find((k) => k !== xKey && typeof sample[k] === "number") ||
    keys.find((k) => k !== xKey) ||
    "value";

  const chartConfig: ChartConfig = {
    [yKey]: {
      label: chart.title || "Metric",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="mt-3 rounded-xl border border-border bg-background/80 p-3 shadow-sm">
      {chart.title && (
        <div className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
          <BarChart3 className="h-3.5 w-3.5 text-primary" />
          {chart.title}
        </div>
      )}
      <div className="h-44 w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart data={chart.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey={xKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 10 }}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 10 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey={yKey} fill="var(--color-primary, #6366f1)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}

export default function ChatAssistantPage() {
  const dispatch = useAppDispatch();
  const { moveStage, upsertInterview, upsertOffer, upsertJob } = useRecruitment();
  const authReady = useAuthReady();

  const isSending = useAppSelector(selectAIHubOperationLoading);
  const sendError = useAppSelector(selectAIHubOperationError);
  const chatAssistantSection = useAppSelector(selectChatAssistant);

  const [msgs, setMsgs] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string>("");
  const [failedMessageIds, setFailedMessageIds] = useState<Set<string>>(new Set());
  const [executedActionMessageIds, setExecutedActionMessageIds] = useState<Set<string>>(new Set());
  const [feedbackMap, setFeedbackMap] = useState<Record<string, "up" | "down">>({});
  const [suggestions, setSuggestions] = useState(COMMAND_SUGGESTIONS);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const [confirmModal, setConfirmModal] = useState<{
    action: ChatActionRequired;
    messageId?: string;
  } | null>(null);
  const [isConfirmingAction, setIsConfirmingAction] = useState(false);

  const [activityHistory, setActivityHistory] = useState<string[]>([
    "OFC360 AI initialized session",
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const streamAbortRef = useRef<AbortController | null>(null);
  const activeStreamRef = useRef<{
    conversationId?: string;
    clientMessageId: string;
    assistantMsgId: string;
  } | null>(null);
  const sendLockRef = useRef(false);
  const mountedRef = useRef(true);

  const isBusy = isSending || isStreaming;
  const combinedError = streamError || sendError;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (streamAbortRef.current) {
        streamAbortRef.current.abort();
        streamAbortRef.current = null;
      }
      const active = activeStreamRef.current;
      if (active?.conversationId) {
        void aiHubApi
          .cancelChatGeneration(active.conversationId, active.clientMessageId)
          .catch(() => {});
      }
    };
  }, []);

  // Load chat suggestions dynamically on mount (after auth is ready)
  useEffect(() => {
    if (!authReady) return;
    let mounted = true;
    aiHubApi
      .getChatSuggestions()
      .then((res) => {
        if (mounted && res && res.length > 0) {
          setSuggestions(res);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [authReady]);

  // Fetch conversations list on mount (after auth is ready)
  useEffect(() => {
    if (!authReady) return;
    dispatch(fetchChatConversations());
  }, [dispatch, authReady]);

  // Restore saved conversation from sessionStorage on mount (if user previously selected one)
  useEffect(() => {
    if (!authReady) return;
    const savedId = sessionStorage.getItem(SESSION_KEY);
    if (savedId && !currentConversationId) {
      setCurrentConversationId(savedId);
      dispatch(fetchChatConversation(savedId)).then(async (res) => {
        if (!mountedRef.current) return;
        let loadedMsgs: ChatMessage[] = [];
        if (fetchChatConversation.fulfilled.match(res) && res.payload.messages?.length) {
          loadedMsgs = res.payload.messages;
          setMsgs(loadedMsgs);
        }

        const pendingRaw = sessionStorage.getItem(PENDING_KEY);
        if (pendingRaw) {
          try {
            const pending = JSON.parse(pendingRaw) as {
              conversationId?: string;
              clientMessageId?: string;
              content?: string;
            };
            if (pending.conversationId === savedId && pending.clientMessageId) {
              const alreadyDone = loadedMsgs.some(
                (m) =>
                  (m.role !== "user" && m.sender !== "user") &&
                  m.clientMessageId === pending.clientMessageId &&
                  m.status === "completed",
              );
              if (alreadyDone) {
                sessionStorage.removeItem(PENDING_KEY);
              } else {
                const statusRes = await aiHubApi
                  .reconcileMessageStatus(savedId, pending.clientMessageId)
                  .catch(() => null);
                if (!mountedRef.current) return;
                if (statusRes?.found && statusRes.status === "completed" && statusRes.message) {
                  setMsgs((prev) => [...prev.filter((x) => x.clientMessageId !== pending.clientMessageId || x.sender === "user"), statusRes.message!]);
                  sessionStorage.removeItem(PENDING_KEY);
                } else if (statusRes?.found && statusRes.partialContent) {
                  setMsgs((prev) => [
                    ...prev,
                    {
                      id: `ai-rec-${Date.now()}`,
                      conversationId: savedId,
                      sender: "assistant",
                      role: "ai",
                      content: statusRes.partialContent!,
                      status: "interrupted",
                      isPartial: true,
                      retryable: true,
                      clientMessageId: pending.clientMessageId,
                      timestamp: new Date().toISOString(),
                    },
                  ]);
                  sessionStorage.removeItem(PENDING_KEY);
                } else if (statusRes && statusRes.status === "not_found") {
                  sessionStorage.removeItem(PENDING_KEY);
                }
              }
            }
          } catch {
            sessionStorage.removeItem(PENDING_KEY);
          }
        }
      });
    }
  }, [dispatch, currentConversationId, authReady]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, isBusy, combinedError]);

  const abortActiveStream = useCallback(() => {
    if (streamAbortRef.current) {
      streamAbortRef.current.abort();
      streamAbortRef.current = null;
    }
    const active = activeStreamRef.current;
    if (active?.conversationId) {
      void aiHubApi
        .cancelChatGeneration(active.conversationId, active.clientMessageId)
        .catch(() => {});
    }
    activeStreamRef.current = null;
    sendLockRef.current = false;
    setIsStreaming(false);
  }, []);

  const handleSelectConversation = useCallback(
    async (convId: string) => {
      setHistoryOpen(false);
      if (convId === currentConversationId) return;
      abortActiveStream();
      setStreamError(null);
      setCurrentConversationId(convId);
      sessionStorage.setItem(SESSION_KEY, convId);
      dispatch(setActiveConversation(convId));
      dispatch(clearOperationStatus("sendChatMessage"));
      setFailedMessageIds(new Set());

      const res = await dispatch(fetchChatConversation(convId));
      if (!mountedRef.current) return;
      if (fetchChatConversation.fulfilled.match(res)) {
        if (res.payload.messages && res.payload.messages.length > 0) {
          setMsgs(res.payload.messages);
        } else {
          setMsgs([WELCOME_MESSAGE]);
        }
      }
    },
    [abortActiveStream, currentConversationId, dispatch],
  );

  const handleNewChat = useCallback(() => {
    abortActiveStream();
    setStreamError(null);
    setHistoryOpen(false);
    setCurrentConversationId(null);
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(PENDING_KEY);
    dispatch(setActiveConversation(null));
    dispatch(clearOperationStatus("sendChatMessage"));
    setMsgs([WELCOME_MESSAGE]);
    setFailedMessageIds(new Set());
    setInput("");
  }, [abortActiveStream, dispatch]);

  const handleDeleteConversation = useCallback(
    async (convId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const res = await dispatch(deleteChatConversation(convId));
      if (deleteChatConversation.fulfilled.match(res)) {
        toast.success("Conversation deleted.");
        if (currentConversationId === convId) {
          handleNewChat();
        }
      } else {
        toast.error("Failed to delete conversation.");
      }
    },
    [currentConversationId, dispatch, handleNewChat],
  );

  const handleStopGenerating = useCallback(() => {
    abortActiveStream();
  }, [abortActiveStream]);

  const handleExecuteCommand = useCallback(
    async (
      q: string,
      retryOptions?: { messageId?: string; clientMessageId?: string; restoreInputOnError?: boolean },
    ) => {
      const trimmed = q.trim();
      if (!trimmed || isBusy || sendLockRef.current) return;

      sendLockRef.current = true;
      setStreamError(null);
      setLastQuery(trimmed);
      dispatch(clearOperationStatus("sendChatMessage"));

      const clientMessageId = retryOptions?.clientMessageId || createClientMessageId();
      const assistantMsgId = `ai-${clientMessageId}`;
      let userMsgId = retryOptions?.messageId;

      if (!userMsgId) {
        const userMsg: ChatMessage = {
          id: `u-${clientMessageId}`,
          conversationId: currentConversationId || undefined,
          sender: "user",
          role: "user",
          content: trimmed,
          status: "sending",
          clientMessageId,
          timestamp: new Date().toISOString(),
        };
        userMsgId = userMsg.id;
        const placeholderAi: ChatMessage = {
          id: assistantMsgId,
          conversationId: currentConversationId || undefined,
          sender: "assistant",
          role: "ai",
          content: "",
          status: "generating",
          clientMessageId,
          timestamp: new Date().toISOString(),
        };
        setMsgs((prev) => [...prev, userMsg, placeholderAi]);
        setInput("");
      } else {
        setFailedMessageIds((prev) => {
          const next = new Set(prev);
          next.delete(userMsgId!);
          return next;
        });
        setMsgs((prev) => {
          const filtered = prev.filter(
            (m) =>
              !((m.role !== "user" && m.sender !== "user") &&
                m.clientMessageId === clientMessageId &&
                (m.status === "failed" || m.status === "interrupted" || !m.content.trim())),
          );
          return [
            ...filtered.map((m) =>
              m.id === userMsgId
                ? { ...m, status: "retrying" as const, failed: false, clientMessageId }
                : m,
            ),
            {
              id: assistantMsgId,
              conversationId: currentConversationId || undefined,
              sender: "assistant",
              role: "ai",
              content: "",
              status: "generating",
              clientMessageId,
              timestamp: new Date().toISOString(),
            },
          ];
        });
      }

      let anyChunkArrived = false;
      const controller = new AbortController();
      streamAbortRef.current = controller;

      try {
        let convId = currentConversationId;

        if (!convId) {
          const createAction = await dispatch(
            createChatConversation({
              title: trimmed.slice(0, 40) || "Workforce Copilot Chat",
              agentId: "general-copilot",
            }),
          );

          if (!mountedRef.current) return;

          if (createChatConversation.fulfilled.match(createAction)) {
            convId = createAction.payload.id;
            setCurrentConversationId(convId);
            sessionStorage.setItem(SESSION_KEY, convId);
          } else {
            const errMsg =
              createAction.payload || "Unable to start a new conversation. Please try again.";
            setStreamError(errMsg);
            toast.error(errMsg);
            setFailedMessageIds((prev) => new Set(prev).add(userMsgId!));
            setMsgs((prev) => prev.filter((m) => m.id !== assistantMsgId));
            if (retryOptions?.restoreInputOnError !== false) {
              setInput((cur) => cur || trimmed);
            }
            return;
          }
        }

        if (convId) {
          dispatch(
            addLocalMessage({
              conversationId: convId,
              message: {
                id: userMsgId,
                conversationId: convId,
                sender: "user",
                role: "user",
                content: trimmed,
                status: "accepted",
                clientMessageId,
                timestamp: new Date().toISOString(),
              },
            }),
          );
          sessionStorage.setItem(
            PENDING_KEY,
            JSON.stringify({ conversationId: convId, clientMessageId, content: trimmed }),
          );
        }

        activeStreamRef.current = { conversationId: convId || undefined, clientMessageId, assistantMsgId };
        setIsStreaming(true);

        await aiHubApi.streamChatMessage(
          {
            conversationId: convId || undefined,
            content: trimmed,
            agentId: "general-copilot",
            clientMessageId,
            stream: true,
          },
          {
            onStatus: (evt) => {
              if (!mountedRef.current) return;
              if (evt.conversationId && evt.conversationId !== convId) {
                convId = evt.conversationId;
                setCurrentConversationId(convId);
                sessionStorage.setItem(SESSION_KEY, convId);
              }
              setMsgs((prev) =>
                prev.map((m) =>
                  m.id === userMsgId
                    ? { ...m, conversationId: evt.conversationId || m.conversationId, status: evt.status }
                    : m.id === assistantMsgId
                      ? { ...m, conversationId: evt.conversationId || m.conversationId, status: evt.status }
                      : m,
                ),
              );
            },
            onChunk: (evt) => {
              if (!mountedRef.current) return;
              anyChunkArrived = true;
              setMsgs((prev) =>
                prev.map((m) =>
                  m.id === assistantMsgId
                    ? {
                        ...m,
                        conversationId: evt.conversationId || m.conversationId,
                        content: evt.content,
                        status: "streaming",
                        model: evt.model || m.model,
                        provider: evt.provider || m.provider,
                      }
                    : m,
                ),
              );
              if (convId) {
                dispatch(
                  appendStreamChunk({
                    conversationId: convId,
                    assistantMessageId: assistantMsgId,
                    clientMessageId,
                    content: evt.content,
                    model: evt.model,
                    provider: evt.provider,
                  }),
                );
              }
            },
            onComplete: (completedMsg) => {
              if (!mountedRef.current) return;
              const targetConv = completedMsg.conversationId || convId || undefined;
              if (targetConv) {
                setCurrentConversationId(targetConv);
                sessionStorage.setItem(SESSION_KEY, targetConv);
                dispatch(
                  finalizeStreamMessage({
                    conversationId: targetConv,
                    assistantMessageId: assistantMsgId,
                    clientMessageId,
                    completed: completedMsg,
                  }),
                );
              }
              sessionStorage.removeItem(PENDING_KEY);
              setMsgs((prev) =>
                prev.map((m) => {
                  if (m.id === userMsgId) {
                    return { ...m, status: "completed", failed: false, conversationId: targetConv };
                  }
                  if (m.id === assistantMsgId) {
                    return {
                      ...completedMsg,
                      id: completedMsg.id || assistantMsgId,
                      clientMessageId,
                      status: "completed",
                    };
                  }
                  return m;
                }),
              );
              if (completedMsg.actionRequired) {
                setActivityHistory((p) => [
                  `AI proposed action: ${completedMsg.actionRequired!.actionName || completedMsg.actionRequired!.title || "Action"}`,
                  ...p,
                ]);
              } else {
                setActivityHistory((p) => [
                  `Processed: ${trimmed.slice(0, 30)}${trimmed.length > 30 ? "…" : ""}`,
                  ...p,
                ]);
              }
              void dispatch(fetchChatConversations());
            },
            onCancelled: (partialContent, resolvedConvId) => {
              if (!mountedRef.current) return;
              sessionStorage.removeItem(PENDING_KEY);
              const cid = resolvedConvId || convId || undefined;
              if (cid) {
                dispatch(
                  interruptStreamMessage({
                    conversationId: cid,
                    assistantMessageId: assistantMsgId,
                    clientMessageId,
                    status: "cancelled",
                    partialContent,
                  }),
                );
              }
              setMsgs((prev) =>
                prev.map((m) => {
                  if (m.id === userMsgId) return { ...m, status: "cancelled" };
                  if (m.id === assistantMsgId) {
                    return {
                      ...m,
                      content: partialContent.trim() || "Response generation stopped.",
                      status: "cancelled",
                      isPartial: Boolean(partialContent.trim()),
                    };
                  }
                  return m;
                }),
              );
            },
          },
          { signal: controller.signal },
        );
      } catch (err: unknown) {
        if (!mountedRef.current) return;
        const norm = normalizeAIError(err);
        if (norm.code === "cancelled") {
          sessionStorage.removeItem(PENDING_KEY);
          setMsgs((prev) =>
            prev
              .map((m) =>
                m.id === assistantMsgId
                  ? m.content.trim()
                    ? { ...m, status: "cancelled" as const, isPartial: true }
                    : null
                  : m,
              )
              .filter((x): x is ChatMessage => Boolean(x)),
          );
          return;
        }

        const partialText =
          err && typeof err === "object" && "partialContent" in err
            ? String((err as { partialContent?: string }).partialContent || "")
            : "";

        setStreamError(norm.message);
        toast.error(norm.message);

        if (partialText.trim() || anyChunkArrived) {
          setMsgs((prev) =>
            prev.map((m) => {
              if (m.id === userMsgId) {
                return { ...m, status: "interrupted", failed: true, clientMessageId };
              }
              if (m.id === assistantMsgId) {
                return {
                  ...m,
                  content: partialText || m.content,
                  status: "interrupted",
                  isPartial: true,
                  failed: true,
                  errorMessage: norm.message,
                  retryable: norm.retryable,
                  clientMessageId,
                };
              }
              return m;
            }),
          );
          setFailedMessageIds((prev) => new Set(prev).add(userMsgId!));
        } else {
          setFailedMessageIds((prev) => new Set(prev).add(userMsgId!));
          setMsgs((prev) =>
            prev
              .filter((m) => m.id !== assistantMsgId)
              .map((m) =>
                m.id === userMsgId
                  ? { ...m, status: "failed", failed: true, errorMessage: norm.message, clientMessageId }
                  : m,
              ),
          );
          if (retryOptions?.restoreInputOnError !== false && !retryOptions?.messageId) {
            setInput((cur) => cur || trimmed);
          }
        }
        sessionStorage.removeItem(PENDING_KEY);
      } finally {
        if (mountedRef.current) {
          streamAbortRef.current = null;
          activeStreamRef.current = null;
          sendLockRef.current = false;
          setIsStreaming(false);
        }
      }
    },
    [currentConversationId, dispatch, isBusy],
  );

  const handleRetry = useCallback(() => {
    if (isBusy) return;
    const failedUserMsg = [...msgs]
      .reverse()
      .find((m) => (m.role === "user" || m.sender === "user") && (failedMessageIds.has(m.id) || m.failed));
    const targetMsg =
      failedUserMsg ||
      [...msgs].reverse().find((m) => m.role === "user" || m.sender === "user");
    if (targetMsg) {
      handleExecuteCommand(targetMsg.content, {
        messageId: targetMsg.id,
        clientMessageId: targetMsg.clientMessageId,
        restoreInputOnError: false,
      });
    } else if (lastQuery) {
      handleExecuteCommand(lastQuery, { restoreInputOnError: false });
    }
  }, [failedMessageIds, handleExecuteCommand, isBusy, lastQuery, msgs]);

  const handleFeedback = useCallback(
    async (messageId: string, rating: "up" | "down") => {
      setFeedbackMap((prev) => ({ ...prev, [messageId]: rating }));
      try {
        await aiHubApi.sendChatFeedback({
          messageId,
          conversationId: currentConversationId || undefined,
          rating,
        });
        toast.success(
          rating === "up" ? "Thanks for your feedback!" : "Feedback recorded. We'll improve.",
        );
      } catch {
        // silent
      }
    },
    [currentConversationId],
  );

  const handleConfirmAction = async () => {
    if (!confirmModal) return;
    const { action, messageId } = confirmModal;
    const actionNameLower = (action.actionName || "").toLowerCase();
    const payload = (action.payload || {}) as Record<string, unknown>;

    setIsConfirmingAction(true);
    try {
      if (
        actionNameLower.includes("shortlist") ||
        actionNameLower.includes("move") ||
        actionNameLower.includes("stage")
      ) {
        const candidateId = String(payload.candidateId || payload.id || "");
        const stage = payload.stage as Stage | undefined;
        if (!candidateId || !stage) {
          toast.error("Action validation failed: Candidate ID and target Stage are required.");
          return;
        }
        await moveStage(candidateId, stage);
        toast.success(`Action Executed: Candidate moved to ${stage} stage.`);
      } else if (actionNameLower.includes("interview")) {
        const interviewData = (
          payload.interview && typeof payload.interview === "object"
            ? payload.interview
            : payload
        ) as Record<string, unknown>;

        const candidateId = interviewData.candidateId as string | undefined;
        const candidateName = interviewData.candidateName as string | undefined;
        const interviewer = interviewData.interviewer as string | undefined;
        const round = interviewData.round as string | undefined;
        const time = (interviewData.time || interviewData.date) as string | undefined;

        if (!candidateId || !candidateName || !interviewer || !round || !time) {
          toast.error(
            "Action validation failed: Candidate ID, Candidate Name, Interviewer, Round, and Date/Time are required in the payload.",
          );
          return;
        }

        const ivId = String(interviewData.id || newId());
        await upsertInterview({
          id: ivId,
          interviewId: ivId,
          roundId: String(interviewData.roundId || ivId),
          scheduleId: String(interviewData.scheduleId || ivId),
          applicationId: String(interviewData.applicationId || ""),
          jobId: String(interviewData.jobId || ""),
          candidateId,
          candidateName,
          jobTitle: String(interviewData.jobTitle || "Open Role"),
          interviewerId: null,
          interviewer,
          round,
          date: new Date(time).toISOString(),
          durationMins: Number(interviewData.durationMins || 45),
          mode: "ONLINE",
          meetingLink: String(interviewData.meetingLink || ""),
          status: "SCHEDULED",
        });
        toast.success(`Action Executed: Interview scheduled for ${candidateName}.`);
      } else if (actionNameLower.includes("offer")) {
        const offerData = (
          payload.offer && typeof payload.offer === "object" ? payload.offer : payload
        ) as Record<string, unknown>;

        const candidateId = offerData.candidateId as string | undefined;
        const candidateName = offerData.candidateName as string | undefined;
        const role = (offerData.role || offerData.jobTitle) as string | undefined;
        const salary = offerData.salary ?? offerData.ctc;
        const joiningDate = offerData.joiningDate as string | undefined;

        if (!candidateId || !candidateName || !role || salary == null || !joiningDate) {
          toast.error(
            "Action validation failed: Candidate ID, Candidate Name, Role, Salary/CTC, and Joining Date are required.",
          );
          return;
        }

        await upsertOffer({
          id: String(offerData.id || newId()),
          candidateId,
          candidateName,
          jobId: String(offerData.jobId || newId()),
          jobTitle: role,
          salary:
            typeof salary === "number" ? salary : Number(String(salary).replace(/[^0-9.]/g, "")),
          currency: String(offerData.currency || "INR"),
          joiningDate,
          benefits: Array.isArray(offerData.benefits) ? (offerData.benefits as string[]) : [],
          status: "draft",
          approvals: [],
        });
        toast.success(`Action Executed: Offer draft structured for ${candidateName}.`);
      } else if (actionNameLower.includes("job")) {
        const jobData = (
          payload.job && typeof payload.job === "object" ? payload.job : payload
        ) as Record<string, unknown>;

        const title = jobData.title as string | undefined;
        const department = jobData.department as string | undefined;

        if (!title || !department) {
          toast.error("Action validation failed: Job Title and Department are required.");
          return;
        }

        await upsertJob({
          id: String(jobData.id || newId()),
          title,
          department,
          employmentType: (jobData.employmentType as EmploymentType) || "Full-time",
          experience: String(jobData.experience || "Mid"),
          skills: Array.isArray(jobData.skills) ? (jobData.skills as string[]) : [],
          salaryMin: Number(jobData.salaryMin || 0),
          salaryMax: Number(jobData.salaryMax || 0),
          currency: String(jobData.currency || "INR"),
          vacancies: Number(jobData.vacancies || 1),
          location: String(jobData.location || "Remote"),
          workMode: (jobData.workMode as WorkMode) || "Remote",
          description: String(jobData.description || ""),
          responsibilities: Array.isArray(jobData.responsibilities)
            ? (jobData.responsibilities as string[])
            : [],
          requirements: Array.isArray(jobData.requirements)
            ? (jobData.requirements as string[])
            : [],
          benefits: Array.isArray(jobData.benefits) ? (jobData.benefits as string[]) : [],
          hiringManager: String(jobData.hiringManager || ""),
          recruiter: String(jobData.recruiter || ""),
          status: "active",
          publishedAt: new Date().toISOString(),
          closingAt: new Date(Date.now() + 30 * 86400000).toISOString(),
          applicants: 0,
        });
        toast.success(`Action Executed: Job requisition updated successfully.`);
      } else {
        // Unsupported action
        toast.info(
          `${action.actionName}: Autonomous direct agent execution for this module domain is coming soon. Please manage this record in its respective module.`,
        );
        return;
      }

      // Mark action message as executed
      if (messageId) {
        setExecutedActionMessageIds((prev) => new Set(prev).add(messageId));
      }

      // Send a short system note in the chat
      const sysMsg: ChatMessage = {
        id: `sys-${Date.now()}`,
        conversationId: currentConversationId || undefined,
        sender: "system",
        role: "system",
        content: `Action executed: ${action.actionName}`,
        timestamp: new Date().toISOString(),
      };
      setMsgs((prev) => [...prev, sysMsg]);
      setActivityHistory((prev) => [`Executed: ${action.actionName}`, ...prev]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : `Failed to execute ${action.actionName}`;
      toast.error(msg);
    } finally {
      setIsConfirmingAction(false);
      setConfirmModal(null);
    }
  };

  const conversations =
    chatAssistantSection?.conversations || chatAssistantSection?.data?.conversations || [];

  return (
    <div className="h-[calc(100vh-140px)] min-h-[600px] flex flex-col">
      {/* Main Chat Window */}
      <div className="flex flex-1 flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden relative">
        {/* Chat Window Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border/60 bg-card/80 backdrop-blur shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div className="text-sm font-semibold text-foreground">
              OFC360 AI Assistant
            </div>
          </div>
          <div className="flex items-center gap-2">
            {conversations.length > 0 && (
              <div className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs gap-1.5 hover:bg-accent cursor-pointer"
                  onClick={() => setHistoryOpen((o) => !o)}
                  aria-label="Conversation history"
                >
                  <History className="h-3.5 w-3.5" />
                  History ({conversations.length})
                </Button>
                {historyOpen && (
                  <div className="absolute right-0 mt-1.5 w-72 max-h-80 overflow-y-auto rounded-xl border border-border bg-popover text-popover-foreground shadow-lg z-30 p-1.5 space-y-1">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => handleSelectConversation(conv.id)}
                        className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-xs cursor-pointer transition-colors ${
                          conv.id === currentConversationId
                            ? "bg-accent text-accent-foreground font-medium"
                            : "hover:bg-muted/60"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="truncate">{conv.title || "Conversation"}</div>
                          {conv.lastMessage && (
                            <div className="text-[10px] text-muted-foreground truncate">
                              {conv.lastMessage}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          aria-label="Delete conversation"
                          onClick={(e) => handleDeleteConversation(conv.id, e)}
                          className="p-1 rounded hover:bg-destructive/15 text-muted-foreground hover:text-destructive shrink-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1.5 bg-background/60 hover:bg-accent border-border/60 cursor-pointer"
              onClick={handleNewChat}
            >
              <Plus className="h-3.5 w-3.5" /> New Chat
            </Button>
          </div>
        </div>

        {/* Messages Feed */}
          <div className="flex-1 space-y-4 overflow-y-auto p-5 text-xs">
            {msgs.map((m) => {
              const isUser = m.role === "user" || m.sender === "user";
              const isSystem = m.role === "system" || m.sender === "system";
              const isFailed = failedMessageIds.has(m.id) || Boolean(m.failed);
              const isActionExecuted = executedActionMessageIds.has(m.id);

              if (isSystem) {
                return (
                  <div key={m.id} className="flex justify-center my-2">
                    <div className="rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 shadow-sm">
                      <Check className="h-3 w-3" />
                      {m.content}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                      isUser
                        ? isFailed
                          ? "bg-destructive/15 text-foreground border border-destructive/60 shadow-sm"
                          : "bg-foreground text-background"
                        : "bg-accent/80 text-foreground border border-border/60"
                    }`}
                  >
                    {/* Message Content: Markdown for Assistant, Plain Text for User */}
                    {isUser ? (
                      <div className="text-xs whitespace-pre-wrap">
                        {isFailed && (
                          <div className="flex items-center gap-1.5 text-destructive font-semibold mb-1 text-[11px]">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            Failed to send
                          </div>
                        )}
                        {m.content}
                      </div>
                    ) : !m.content.trim() &&
                      (m.status === "generating" || m.status === "accepted" || m.status === "sending") ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground py-0.5">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary shrink-0" />
                        <span className="animate-pulse">Thinking...</span>
                      </div>
                    ) : (
                      <div className="text-xs leading-relaxed prose dark:prose-invert max-w-none text-foreground">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ children }) => (
                              <h1 className="text-base font-bold my-2 text-foreground">
                                {children}
                              </h1>
                            ),
                            h2: ({ children }) => (
                              <h2 className="text-sm font-bold my-1.5 text-foreground">
                                {children}
                              </h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="text-xs font-semibold my-1 text-foreground">
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => (
                              <p className="my-1 text-xs text-foreground leading-relaxed">
                                {children}
                              </p>
                            ),
                            ul: ({ children }) => (
                              <ul className="my-1.5 ml-4 list-disc space-y-0.5">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="my-1.5 ml-4 list-decimal space-y-0.5">{children}</ol>
                            ),
                            li: ({ children }) => (
                              <li className="text-xs leading-relaxed">{children}</li>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold text-foreground">
                                {children}
                              </strong>
                            ),
                            code: ({ children }) => (
                              <code className="rounded bg-muted/60 px-1 py-0.5 font-mono text-[11px] text-foreground">
                                {children}
                              </code>
                            ),
                            table: ({ children }) => (
                              <div className="overflow-x-auto my-2 rounded-lg border border-border">
                                <table className="w-full text-[11px] text-left">{children}</table>
                              </div>
                            ),
                            th: ({ children }) => (
                              <th className="px-2 py-1 bg-muted/40 font-semibold border-b border-border">
                                {children}
                              </th>
                            ),
                            td: ({ children }) => (
                              <td className="px-2 py-1 border-b border-border/40">{children}</td>
                            ),
                          }}
                        >
                          {formatMarkdownForRender(m.content)}
                        </ReactMarkdown>
                      </div>
                    )}

                    {/* Render Rich Result Cards: Candidate */}
                    {m.cardType === "candidate" && m.cardData && (
                      <div className="mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-1.5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm">
                            {(m.cardData as CandidateCardData).name}
                          </span>
                          {(m.cardData as CandidateCardData).atsScore !== undefined && (
                            <Badge variant="secondary" className="text-[10px]">
                              {(m.cardData as CandidateCardData).atsScore}% Match
                            </Badge>
                          )}
                        </div>
                        <div className="text-muted-foreground">
                          {(m.cardData as CandidateCardData).appliedPosition || "Applicant"}
                          {(m.cardData as CandidateCardData).yearsExperience
                            ? ` • ${(m.cardData as CandidateCardData).yearsExperience} yrs exp`
                            : ""}
                        </div>
                        {(m.cardData as CandidateCardData).summary && (
                          <div className="text-[11px] text-muted-foreground">
                            {(m.cardData as CandidateCardData).summary}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Render Rich Result Cards: Job */}
                    {m.cardType === "job" && m.cardData && (
                      <div className="mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-1.5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm">
                            {(m.cardData as JobCardData).title}
                          </span>
                          {(m.cardData as JobCardData).department && (
                            <Badge variant="secondary" className="text-[10px]">
                              {(m.cardData as JobCardData).department}
                            </Badge>
                          )}
                        </div>
                        {(m.cardData as JobCardData).salary && (
                          <div className="text-muted-foreground">
                            {(m.cardData as JobCardData).salary}
                          </div>
                        )}
                        {Array.isArray((m.cardData as JobCardData).skills) &&
                          ((m.cardData as JobCardData).skills?.length ?? 0) > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(m.cardData as JobCardData).skills!.map((s: string, idx: number) => (
                                <Badge key={idx} variant="outline" className="text-[10px]">
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          )}
                      </div>
                    )}

                    {/* Render Rich Result Cards: Interview */}
                    {m.cardType === "interview" && m.cardData && (
                      <div className="mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-1.5 shadow-sm">
                        <div className="font-bold text-sm flex items-center gap-1.5 text-indigo-500">
                          <CalendarClock className="h-4 w-4" />
                          {(m.cardData as InterviewCardData).round || "Interview Round"}
                        </div>
                        {(m.cardData as InterviewCardData).candidateName && (
                          <div>
                            Candidate:{" "}
                            <strong>{(m.cardData as InterviewCardData).candidateName}</strong>
                          </div>
                        )}
                        {(m.cardData as InterviewCardData).interviewer && (
                          <div>
                            Interviewer:{" "}
                            <strong>{(m.cardData as InterviewCardData).interviewer}</strong>
                          </div>
                        )}
                        {(m.cardData as InterviewCardData).time && (
                          <div className="text-muted-foreground font-mono text-[11px]">
                            {(m.cardData as InterviewCardData).time}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Render Rich Result Cards: Offer */}
                    {m.cardType === "offer" && m.cardData && (
                      <div className="mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-1.5 shadow-sm">
                        <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                          Offer: {(m.cardData as OfferCardData).candidateName}
                        </div>
                        {(m.cardData as OfferCardData).role && (
                          <div>
                            Role: <strong>{(m.cardData as OfferCardData).role}</strong>
                          </div>
                        )}
                        {(m.cardData as OfferCardData).ctc && (
                          <div>
                            Total CTC:{" "}
                            <strong className="font-mono text-indigo-500">
                              {(m.cardData as OfferCardData).ctc}
                            </strong>
                          </div>
                        )}
                        {(m.cardData as OfferCardData).joiningDate && (
                          <div className="text-muted-foreground">
                            Target Joining: {(m.cardData as OfferCardData).joiningDate}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Render Rich Result Cards: Onboarding */}
                    {m.cardType === "onboarding" &&
                      (m.cardData as OnboardingCardData)?.joiners && (
                        <div className="mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-2 shadow-sm">
                          <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                            Day-One Readiness Tracker
                          </div>
                          {(m.cardData as OnboardingCardData).joiners!.map((j, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center text-xs border-b border-border/40 pb-1 last:border-0"
                            >
                              <span>
                                {j.name} ({j.role})
                              </span>
                              <Badge
                                variant="outline"
                                className="text-emerald-500 border-emerald-500/30"
                              >
                                {j.readiness}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}

                    {/* Render Rich Result Cards: Payroll & Workforce Metrics (ONLY when backend explicitly sends cardType="payroll") */}
                    {m.cardType === "payroll" && (m.cardData as PayrollCardData)?.metrics && (
                      <div className="mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-1.5 shadow-sm">
                        {(m.cardData as PayrollCardData).metrics!.map((met, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">{met.label}:</span>
                            <span className="font-semibold">{met.val}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Structured Backend Tables (Rendered only once) */}
                    {m.tables && m.tables.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {m.tables.map((tbl, tIdx) => (
                          <div
                            key={tIdx}
                            className="overflow-x-auto rounded-xl border border-border bg-background/80 p-2 shadow-sm"
                          >
                            {tbl.title && (
                              <div className="text-xs font-semibold px-2 py-1 text-foreground">
                                {tbl.title}
                              </div>
                            )}
                            <table className="w-full text-[11px] text-left">
                              <thead>
                                <tr className="border-b border-border/50 text-muted-foreground">
                                  {tbl.headers.map((h, hIdx) => (
                                    <th key={hIdx} className="px-2 py-1">
                                      {h}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {tbl.rows.map((row, rIdx) => (
                                  <tr
                                    key={rIdx}
                                    className="border-b border-border/30 last:border-0 hover:bg-muted/40"
                                  >
                                    {row.map((cell, cIdx) => (
                                      <td key={cIdx} className="px-2 py-1">
                                        {String(cell ?? "—")}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Recharts Bar Charts (Backend Chart Data) */}
                    {m.charts && m.charts.length > 0 && (
                      <div className="space-y-2">
                        {m.charts.map((chart, cIdx) => (
                          <ChatChartRenderer key={cIdx} chart={chart} />
                        ))}
                      </div>
                    )}

                    {/* Document Sources & Citations */}
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {m.sources.map((src, sIdx) => (
                          <Badge
                            key={sIdx}
                            variant="outline"
                            className="text-[10px] text-muted-foreground gap-1 bg-background/50"
                          >
                            <FileText className="h-3 w-3 text-indigo-400" />
                            {src.document} {src.section ? `(${src.section})` : ""}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {/* Autopilot HR Tool Call Proposal & Execution Card */}
                    {(m as any).toolCall && (
                      <div className="mt-3">
                        <AgentToolCallCard
                          toolCall={(m as any).toolCall}
                          onConfirm={async (id) => {
                            await autopilotApi.confirmAgentAction(id);
                            toast.success("Action executed via Autopilot");
                          }}
                          onCancel={async (id) => {
                            await autopilotApi.cancelAgentAction(id);
                            toast.info("Action cancelled");
                          }}
                          onUndo={async (id, reason) => {
                            await autopilotApi.undoAuditAction(id, reason);
                            toast.success("Action undone");
                          }}
                        />
                      </div>
                    )}

                    {/* Action Confirmation Button */}
                    {m.actionRequired && (
                      <div className="mt-3 pt-2 border-t border-border/40 flex justify-end">
                        <Button
                          size="sm"
                          disabled={isActionExecuted}
                          className={`h-7 text-xs gap-1 cursor-pointer ${
                            isActionExecuted
                              ? "bg-muted text-muted-foreground border border-border"
                              : "bg-gradient-brand text-brand-foreground shadow-glow"
                          }`}
                          onClick={() =>
                            setConfirmModal({ action: m.actionRequired!, messageId: m.id })
                          }
                        >
                          <Check className="h-3 w-3" />
                          {isActionExecuted ? "Action Executed" : "Confirm & Execute"}
                        </Button>
                      </div>
                    )}

                    {/* Contextual Follow-up Suggestions */}
                    {m.suggestions && m.suggestions.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-border/40">
                        <div className="text-[10px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-indigo-400" /> Suggested queries:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {m.suggestions.map((sug, sIdx) => (
                            <button
                              key={sIdx}
                              type="button"
                              onClick={() => handleExecuteCommand(sug)}
                              disabled={isBusy}
                              className="text-[11px] px-2.5 py-1 rounded-full bg-background/70 hover:bg-background border border-border text-foreground/80 hover:text-foreground transition-colors text-left cursor-pointer"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Partial / Interrupted Notice */}
                    {(m.isPartial || m.status === "interrupted" || m.status === "cancelled") &&
                      !isUser && (
                        <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
                          <span>
                            {m.status === "cancelled"
                              ? "Stopped generating"
                              : "Partial response (stream interrupted)"}
                          </span>
                          {m.status === "interrupted" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 text-[10px] gap-1"
                              onClick={handleRetry}
                              disabled={isBusy}
                            >
                              <RefreshCw className="h-2.5 w-2.5" /> Retry
                            </Button>
                          )}
                        </div>
                      )}

                    {/* Assistant Feedback (Thumbs up / down) */}
                    {!isUser && m.id !== "m-welcome" && (m.status === "completed" || !m.status) && (
                      <div className="mt-2.5 pt-2 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="text-[10px]">Was this helpful?</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            aria-label="Thumbs up"
                            onClick={() => handleFeedback(m.id, "up")}
                            className={`p-1 rounded-md hover:bg-muted/80 transition-colors cursor-pointer ${
                              feedbackMap[m.id] === "up"
                                ? "text-emerald-500 bg-emerald-500/10 font-bold"
                                : "text-muted-foreground"
                            }`}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            aria-label="Thumbs down"
                            onClick={() => handleFeedback(m.id, "down")}
                            className={`p-1 rounded-md hover:bg-muted/80 transition-colors cursor-pointer ${
                              feedbackMap[m.id] === "down"
                                ? "text-rose-500 bg-rose-500/10 font-bold"
                                : "text-muted-foreground"
                            }`}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Inline Error Bubble with Retry Option */}
            {Boolean(combinedError) && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl p-4 bg-destructive/10 text-destructive border border-destructive/30 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                    <span className="text-xs font-medium">
                      {combinedError || "Unable to generate a response. Please try again."}
                    </span>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-destructive/40 hover:bg-destructive/20 gap-1 text-destructive cursor-pointer"
                      onClick={handleRetry}
                      disabled={isBusy}
                    >
                      <RefreshCw className="h-3 w-3" /> Retry Message
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Chat Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleExecuteCommand(input);
            }}
            className="flex items-center gap-2 border-t border-border p-3 bg-card/80 backdrop-blur"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask or command OFC360 AI… (e.g. Schedule interview for Siddharth tomorrow 2 PM)"
              className="text-xs h-10"
              disabled={isConfirmingAction}
            />
            {isStreaming ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleStopGenerating}
                className="h-10 px-4 gap-1.5 border-destructive/40 text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                <Square className="h-3.5 w-3.5 fill-current" />
                Stop generating
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isBusy || !input.trim()}
                className="h-10 px-4 bg-gradient-brand text-brand-foreground shadow-glow gap-1.5 cursor-pointer"
              >
                {isBusy ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
                Send
              </Button>
            )}
          </form>
        </div>

      {/* Action Confirmation Modal */}
      {confirmModal && (
        <Dialog open={Boolean(confirmModal)} onOpenChange={() => setConfirmModal(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-indigo-500" />
                Confirm Backend AI Action
              </DialogTitle>
              <DialogDescription>{confirmModal.action.actionName}</DialogDescription>
            </DialogHeader>

            <div className="py-2 text-xs text-muted-foreground">
              <p className="p-3 rounded-lg border border-border bg-muted/30 text-foreground leading-relaxed">
                {confirmModal.action.description}
              </p>
              <p className="mt-2 text-[11px] italic">
                Execution will dispatch verified transactions to the OFC360 workspace modules.
              </p>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                disabled={isConfirmingAction}
                onClick={() => setConfirmModal(null)}
              >
                Cancel
              </Button>
              <Button
                disabled={isConfirmingAction}
                className="bg-gradient-brand text-brand-foreground shadow-glow cursor-pointer"
                onClick={handleConfirmAction}
              >
                {isConfirmingAction ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    Executing...
                  </>
                ) : (
                  "Confirm & Proceed"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

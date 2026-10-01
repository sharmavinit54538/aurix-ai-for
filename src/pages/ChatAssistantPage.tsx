import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
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
  Trash2,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
  History,
} from "lucide-react";
import { AIHero } from "@/components/aurix/AIModule";
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
  sendChatMessage,
  fetchChatConversations,
  fetchChatConversation,
  deleteChatConversation,
} from "@/store/aiHub/aiHub.thunks";
import {
  setActiveConversation,
  clearOperationStatus,
} from "@/store/aiHub/aiHub.slice";
import {
  selectChatAssistant,
  selectAIHubOperationLoading,
  selectAIHubOperationError,
} from "@/store/aiHub/aiHub.selectors";
import { aiHubApi } from "@/services/aiHub.api";
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
  { label: "Search candidate", cmd: "Search candidate" },
  { label: "Active job postings", cmd: "List active job openings" },
  { label: "Show onboarding progress", cmd: "Show employee onboarding progress" },
  { label: "Show pending HR tasks", cmd: "Show pending HR tasks and approvals" },
  { label: "Payroll & attendance summary", cmd: "Show monthly payroll and attendance summary" },
];

const SESSION_KEY = "lastActiveChatConversationId";

const WELCOME_MESSAGE: ChatMessage = {
  id: "m-welcome",
  conversationId: undefined,
  sender: "assistant",
  role: "ai",
  content:
    "Hi 👋 I am Aurix AI, your central OFC360 workforce copilot. You can ask questions about your workforce or issue text commands to search candidates, inspect job postings, review scheduled interviews, structure offers, and monitor payroll records.",
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

  const isSending = useAppSelector(selectAIHubOperationLoading("sendChatMessage"));
  const sendError = useAppSelector(selectAIHubOperationError("sendChatMessage"));
  const chatAssistantSection = useAppSelector(selectChatAssistant);

  const [msgs, setMsgs] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string>("");
  const [failedMessageIds, setFailedMessageIds] = useState<Set<string>>(new Set());
  const [executedActionMessageIds, setExecutedActionMessageIds] = useState<Set<string>>(new Set());
  const [feedbackMap, setFeedbackMap] = useState<Record<string, "up" | "down">>({});
  const [suggestions, setSuggestions] = useState(COMMAND_SUGGESTIONS);

  const [confirmModal, setConfirmModal] = useState<{
    action: ChatActionRequired;
    messageId?: string;
  } | null>(null);
  const [isConfirmingAction, setIsConfirmingAction] = useState(false);

  const [activityHistory, setActivityHistory] = useState<string[]>([
    "Aurix AI initialized session",
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Load chat suggestions dynamically on mount
  useEffect(() => {
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
  }, []);

  // Fetch conversations list on mount
  useEffect(() => {
    dispatch(fetchChatConversations());
  }, [dispatch]);

  // Restore saved conversation from sessionStorage on mount (if user previously selected one)
  useEffect(() => {
    const savedId = sessionStorage.getItem(SESSION_KEY);
    if (savedId && !currentConversationId) {
      setCurrentConversationId(savedId);
      dispatch(fetchChatConversation(savedId)).then((res) => {
        if (fetchChatConversation.fulfilled.match(res)) {
          if (res.payload.messages && res.payload.messages.length > 0) {
            setMsgs(res.payload.messages);
          }
        }
      });
    }
  }, [dispatch, currentConversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, isSending, sendError]);

  const handleSelectConversation = useCallback(
    async (convId: string) => {
      if (convId === currentConversationId) return;
      setCurrentConversationId(convId);
      sessionStorage.setItem(SESSION_KEY, convId);
      dispatch(setActiveConversation(convId));
      dispatch(clearOperationStatus("sendChatMessage"));
      setFailedMessageIds(new Set());

      const res = await dispatch(fetchChatConversation(convId));
      if (fetchChatConversation.fulfilled.match(res)) {
        if (res.payload.messages && res.payload.messages.length > 0) {
          setMsgs(res.payload.messages);
        } else {
          setMsgs([WELCOME_MESSAGE]);
        }
      }
    },
    [currentConversationId, dispatch],
  );

  const handleNewChat = useCallback(() => {
    setCurrentConversationId(null);
    sessionStorage.removeItem(SESSION_KEY);
    dispatch(setActiveConversation(null));
    dispatch(clearOperationStatus("sendChatMessage"));
    setMsgs([WELCOME_MESSAGE]);
    setFailedMessageIds(new Set());
    setInput("");
  }, [dispatch]);

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

  const handleExecuteCommand = useCallback(
    async (q: string, retryOptions?: { messageId?: string }) => {
      const trimmed = q.trim();
      if (!trimmed || isSending) return;

      setLastQuery(trimmed);
      dispatch(clearOperationStatus("sendChatMessage"));

      let userMsgId = retryOptions?.messageId;

      if (!userMsgId) {
        // New user message
        const newMsg: ChatMessage = {
          id: `u-${Date.now()}`,
          conversationId: currentConversationId || undefined,
          sender: "user",
          role: "user",
          content: trimmed,
          timestamp: new Date().toISOString(),
        };
        userMsgId = newMsg.id;
        setMsgs((prev) => [...prev, newMsg]);
        setInput("");
      } else {
        // Retrying existing message - do NOT duplicate bubble!
        setFailedMessageIds((prev) => {
          const next = new Set(prev);
          next.delete(userMsgId!);
          return next;
        });
      }

      try {
        let convId = currentConversationId;

        // Lazy conversation initialization on first message if none exists
        if (!convId) {
          const createAction = await dispatch(
            createChatConversation({
              title: trimmed.slice(0, 40) || "Workforce Copilot Chat",
              agentId: "general-copilot",
            }),
          );

          if (createChatConversation.fulfilled.match(createAction)) {
            convId = createAction.payload.id;
            setCurrentConversationId(convId);
            sessionStorage.setItem(SESSION_KEY, convId);
          } else {
            // Failed to create conversation - NO FAKE ID!
            const errMsg =
              createAction.payload || "Failed to create chat conversation with the backend.";
            toast.error(errMsg);
            setFailedMessageIds((prev) => new Set(prev).add(userMsgId!));
            return;
          }
        }

        // Dispatch real sendChatMessage thunk backed by backend LLM
        const sendAction = await dispatch(
          sendChatMessage({
            conversationId: convId,
            content: trimmed,
            agentId: "general-copilot",
          }),
        );

        if (sendChatMessage.fulfilled.match(sendAction)) {
          const aiMsg = sendAction.payload;
          setMsgs((prev) => [...prev, aiMsg]);

          if (aiMsg.actionRequired) {
            setActivityHistory((p) => [
              `AI proposed action: ${aiMsg.actionRequired!.actionName}`,
              ...p,
            ]);
          } else {
            setActivityHistory((p) => [
              `Processed: ${trimmed.slice(0, 30)}${trimmed.length > 30 ? "…" : ""}`,
              ...p,
            ]);
          }
        } else if (sendChatMessage.rejected.match(sendAction)) {
          const errMsg = sendAction.payload || "Failed to receive response from AI backend";
          toast.error(errMsg);
          setFailedMessageIds((prev) => new Set(prev).add(userMsgId!));
        }
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred while communicating with the AI service.";
        toast.error(msg);
        setFailedMessageIds((prev) => new Set(prev).add(userMsgId!));
      }
    },
    [currentConversationId, dispatch, isSending],
  );

  const handleRetry = useCallback(() => {
    // Find the last user message or last query
    const lastUserMsg = [...msgs].reverse().find((m) => m.role === "user" || m.sender === "user");
    if (lastUserMsg) {
      handleExecuteCommand(lastUserMsg.content, { messageId: lastUserMsg.id });
    } else if (lastQuery) {
      handleExecuteCommand(lastQuery);
    }
  }, [handleExecuteCommand, lastQuery, msgs]);

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

        await upsertInterview({
          id: String(interviewData.id || newId()),
          candidateId,
          candidateName,
          jobTitle: String(interviewData.jobTitle || "Open Role"),
          interviewer,
          round,
          date: new Date(time).toISOString(),
          durationMins: Number(interviewData.durationMins || 45),
          meetingLink: String(interviewData.meetingLink || ""),
          status: "scheduled",
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

  const conversations = chatAssistantSection?.data?.conversations || [];

  return (
    <div className="space-y-6">
      <AIHero
        icon={MessageSquare}
        eyebrow="Central People AI Agent"
        title="Command your entire workforce with natural language"
        description="Search candidates, shortlist applicants, draft offer letters, trigger onboardings, and inspect payroll through an intelligent central conversational interface backed by live LLM inference."
        lastAnalysis="Active & Connected"
      />

      {/* Suggested Quick Commands */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Quick Commands:
        </span>
        {suggestions.map((item, idx) => (
          <Button
            key={idx}
            variant="outline"
            size="sm"
            className="h-7 text-xs bg-background/60 hover:bg-accent/80 border-border/60 transition-colors"
            onClick={() => handleExecuteCommand(item.cmd)}
            disabled={isSending}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {/* Mobile Conversation Switcher */}
      <div className="flex md:hidden items-center justify-between gap-2 p-2 rounded-xl border border-border bg-card/60">
        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
          <History className="h-3.5 w-3.5 text-indigo-400" />
          <span className="truncate max-w-[200px]">
            {conversations.find((c) => c.id === currentConversationId)?.title || "Current Chat"}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1"
            onClick={handleNewChat}
          >
            <Plus className="h-3 w-3" /> New
          </Button>
        </div>
      </div>

      {/* Responsive Chat Layout (History Sidebar + Chat Window) */}
      <div className="flex flex-col md:flex-row gap-4 h-[calc(100vh-270px)] min-h-[520px] max-h-[750px]">
        {/* Desktop Sidebar: Past Conversations */}
        <div className="hidden md:flex w-64 shrink-0 flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-3 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <History className="h-3.5 w-3.5 text-indigo-400" /> Chat History
            </span>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1 bg-background/50 hover:bg-accent cursor-pointer"
              onClick={handleNewChat}
            >
              <Plus className="h-3 w-3" /> New
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pt-2 pr-1">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-[11px] text-muted-foreground">
                No past conversations
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = conv.id === currentConversationId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors cursor-pointer ${
                      isActive
                        ? "bg-primary/10 text-primary font-medium border border-primary/20"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-1">
                      <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{conv.title || "Chat Conversation"}</span>
                    </div>
                    <button
                      type="button"
                      aria-label="Delete conversation"
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity cursor-pointer rounded"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Activity History Log */}
          {activityHistory.length > 0 && (
            <div className="mt-2 pt-2 border-t border-border/60">
              <div className="text-[10px] font-semibold uppercase text-muted-foreground mb-1.5 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-indigo-400" /> Recent Actions
              </div>
              <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                {activityHistory.slice(0, 4).map((act, aIdx) => (
                  <div key={aIdx} className="text-[10px] text-muted-foreground truncate" title={act}>
                    • {act}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Chat Window */}
        <div className="flex flex-1 flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden">
          {/* Messages Feed */}
          <div className="flex-1 space-y-4 overflow-y-auto p-5 text-xs">
            {msgs.map((m) => {
              const isUser = m.role === "user" || m.sender === "user";
              const isSystem = m.role === "system" || m.sender === "system";
              const isFailed = failedMessageIds.has(m.id);
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
                    ) : (
                      <div className="text-xs leading-relaxed prose dark:prose-invert max-w-none text-foreground">
                        <ReactMarkdown
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
                          {m.content}
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
                              disabled={isSending}
                              className="text-[11px] px-2.5 py-1 rounded-full bg-background/70 hover:bg-background border border-border text-foreground/80 hover:text-foreground transition-colors text-left cursor-pointer"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Assistant Feedback (Thumbs up / down) */}
                    {!isUser && m.id !== "m-welcome" && (
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

            {/* Typing / Loading Indicator Bubble */}
            {isSending && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl p-4 bg-accent/80 text-foreground border border-border/60 flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-indigo-500 shrink-0" />
                  <span className="text-xs text-muted-foreground animate-pulse">
                    Aurix AI is analyzing live workforce data and formulating response…
                  </span>
                </div>
              </div>
            )}

            {/* Inline Error Bubble with Retry Option */}
            {Boolean(sendError) && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl p-4 bg-destructive/10 text-destructive border border-destructive/30 space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                    <span className="text-xs font-medium">
                      AI Service Notice:{" "}
                      {sendError || "Failed to receive AI response from the server."}
                    </span>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-destructive/40 hover:bg-destructive/20 gap-1 text-destructive cursor-pointer"
                      onClick={handleRetry}
                      disabled={isSending}
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
              placeholder="Ask or command Aurix AI… (e.g. Schedule interview for Siddharth tomorrow 2 PM)"
              className="text-xs h-10"
              disabled={isSending}
            />
            <Button
              type="submit"
              disabled={isSending || !input.trim()}
              className="h-10 px-4 bg-gradient-brand text-brand-foreground shadow-glow gap-1.5 cursor-pointer"
            >
              {isSending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              Send
            </Button>
          </form>
        </div>
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

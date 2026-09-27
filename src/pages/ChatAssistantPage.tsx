import { useState, useRef, useEffect, useCallback } from "react";
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
import { toast } from "sonner";
import { useRecruitment, newId } from "@/features/admin/recruitment/hooks/useRecruitment";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  createChatConversation,
  sendChatMessage,
  fetchChatConversations,
} from "@/store/aiHub/aiHub.thunks";
import {
  selectChatAssistant,
  selectAIHubOperationLoading,
  selectAIHubOperationError,
} from "@/store/aiHub/aiHub.selectors";
import type { ChatMessage, ChatActionRequired } from "@/store/aiHub/aiHub.types";

const COMMAND_SUGGESTIONS = [
  { label: "Search candidate", cmd: "Search candidate" },
  { label: "Active job postings", cmd: "List active job openings" },
  { label: "Show onboarding progress", cmd: "Show employee onboarding progress" },
  { label: "Show pending HR tasks", cmd: "Show pending HR tasks and approvals" },
  { label: "Payroll & attendance summary", cmd: "Show monthly payroll and attendance summary" },
];

export default function ChatAssistantPage() {
  const dispatch = useAppDispatch();
  const { moveStage, upsertInterview, upsertOffer, upsertJob } = useRecruitment();

  const isSending = useAppSelector(selectAIHubOperationLoading("sendChatMessage"));
  const sendError = useAppSelector(selectAIHubOperationError("sendChatMessage"));
  const chatAssistantSection = useAppSelector(selectChatAssistant);

  const [msgs, setMsgs] = useState<ChatMessage[]>([
    {
      id: "m-welcome",
      conversationId: undefined,
      sender: "assistant",
      role: "ai",
      content:
        "Hi 👋 I am Aurix AI, your central OFC360 workforce copilot. You can ask questions about your workforce or issue voice/text commands to search candidates, inspect job postings, review scheduled interviews, structure offers, and monitor payroll records.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string>("");
  const [confirmModal, setConfirmModal] = useState<ChatActionRequired | null>(null);

  const [activityHistory, setActivityHistory] = useState<string[]>([
    "Aurix AI initialized session",
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Initialize or fetch existing conversations if any
  useEffect(() => {
    dispatch(fetchChatConversations());
  }, [dispatch]);

  // Sync conversation ID if activeConversation exists
  useEffect(() => {
    const active = chatAssistantSection?.data?.activeConversation;
    if (active?.id && !currentConversationId) {
      setCurrentConversationId(active.id);
    }
  }, [chatAssistantSection, currentConversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, isSending, sendError]);

  const handleExecuteCommand = useCallback(
    async (q: string) => {
      const trimmed = q.trim();
      if (!trimmed || isSending) return;

      setLastQuery(trimmed);

      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        conversationId: currentConversationId || undefined,
        sender: "user",
        role: "user",
        content: trimmed,
        timestamp: new Date().toISOString(),
      };

      setMsgs((prev) => [...prev, userMsg]);
      setInput("");

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
          } else {
            // Local fallback ID for resilient operation
            convId = `conv-${Date.now()}`;
            setCurrentConversationId(convId);
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
          // Failure handled via inline error selector UI
          const errMsg = sendAction.payload || "Failed to receive response from AI backend";
          toast.error(errMsg);
        }
      } catch (err: any) {
        toast.error(err?.message || "An unexpected error occurred while communicating with the AI service.");
      }
    },
    [currentConversationId, dispatch, isSending],
  );

  const handleRetry = useCallback(() => {
    if (lastQuery) {
      handleExecuteCommand(lastQuery);
    }
  }, [handleExecuteCommand, lastQuery]);

  const handleConfirmAction = async () => {
    if (!confirmModal) return;

    const actionNameLower = (confirmModal.actionName || "").toLowerCase();
    const payload = confirmModal.payload || {};

    try {
      if (
        (actionNameLower.includes("shortlist") ||
          actionNameLower.includes("move") ||
          actionNameLower.includes("stage")) &&
        (payload.candidateId || payload.id)
      ) {
        const candidateId = String(payload.candidateId || payload.id);
        const stage = payload.stage || "technical";
        moveStage(candidateId, stage);
        toast.success(
          `Action Executed: ${confirmModal.actionName} completed successfully! Candidate moved to ${stage} stage.`,
        );
        setActivityHistory((p) => [`Executed: ${confirmModal.actionName}`, ...p]);
      } else if (
        actionNameLower.includes("interview") &&
        (payload.interview || payload.candidateId)
      ) {
        if (payload.interview) {
          await upsertInterview(payload.interview);
        } else {
          await upsertInterview({
            id: payload.id || newId(),
            candidateId: payload.candidateId,
            candidateName: payload.candidateName || "Candidate",
            interviewer: payload.interviewer || "Hiring Manager",
            time: payload.time || new Date().toISOString(),
            round: payload.round || "Technical Round",
            status: "scheduled",
          } as any);
        }
        toast.success(`Action Executed: Interview scheduled successfully.`);
        setActivityHistory((p) => [`Executed: Schedule Interview`, ...p]);
      } else if (actionNameLower.includes("offer") && (payload.offer || payload.candidateId)) {
        if (payload.offer) {
          await upsertOffer(payload.offer);
        } else {
          await upsertOffer({
            id: payload.id || newId(),
            candidateId: payload.candidateId,
            candidateName: payload.candidateName || "Candidate",
            role: payload.role || "Role",
            ctc: payload.ctc || "Market standard",
            joiningDate: payload.joiningDate || "TBD",
            status: "draft",
          } as any);
        }
        toast.success(`Action Executed: Offer draft structured successfully.`);
        setActivityHistory((p) => [`Executed: Structure Offer`, ...p]);
      } else if (actionNameLower.includes("job") && (payload.job || payload.title)) {
        if (payload.job) {
          await upsertJob(payload.job);
        } else {
          await upsertJob({
            id: payload.id || newId(),
            title: payload.title || "New Position",
            department: payload.department || "Engineering",
            status: "open",
            skills: payload.skills || [],
          } as any);
        }
        toast.success(`Action Executed: Job requisition updated successfully.`);
        setActivityHistory((p) => [`Executed: Update Job Requisition`, ...p]);
      } else {
        // Fallback ONLY for actions genuinely unsupported by direct module executors
        toast.info(
          `${confirmModal.actionName}: Autonomous direct agent execution for this module domain is coming soon. Please manage this record in its respective module.`,
        );
        setActivityHistory((p) => [
          `Previewed: ${confirmModal.actionName} (Manual dashboard follow-up)`,
          ...p,
        ]);
      }
    } catch (err: any) {
      toast.error(err?.message || `Failed to execute ${confirmModal.actionName}`);
    } finally {
      setConfirmModal(null);
    }
  };

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
        {COMMAND_SUGGESTIONS.map((item, idx) => (
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

      {/* Chat Window */}
      <div className="flex h-[640px] flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm">
        {/* Messages Feed */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5 text-xs">
          {msgs.map((m) => {
            const isUser = m.role === "user" || m.sender === "user";
            return (
              <div
                key={m.id}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                    isUser
                      ? "bg-foreground text-background"
                      : "bg-accent/80 text-foreground border border-border/60"
                  }`}
                >
                  {/* Message Text Content */}
                  <div className="text-xs whitespace-pre-wrap">{m.content}</div>

                  {/* Render Rich Result Cards: Candidate */}
                  {m.cardType === "candidate" && m.cardData && (
                    <div className="mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-1.5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{m.cardData.name}</span>
                        {m.cardData.atsScore !== undefined && (
                          <Badge variant="secondary" className="text-[10px]">
                            {m.cardData.atsScore}% Match
                          </Badge>
                        )}
                      </div>
                      <div className="text-muted-foreground">
                        {m.cardData.appliedPosition || "Applicant"}
                        {m.cardData.yearsExperience ? ` • ${m.cardData.yearsExperience} yrs exp` : ""}
                      </div>
                      {m.cardData.summary && (
                        <div className="text-[11px] text-muted-foreground">{m.cardData.summary}</div>
                      )}
                    </div>
                  )}

                  {/* Render Rich Result Cards: Job */}
                  {m.cardType === "job" && m.cardData && (
                    <div className="mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-1.5 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">{m.cardData.title}</span>
                        {m.cardData.department && (
                          <Badge variant="secondary" className="text-[10px]">
                            {m.cardData.department}
                          </Badge>
                        )}
                      </div>
                      {m.cardData.salary && (
                        <div className="text-muted-foreground">{m.cardData.salary}</div>
                      )}
                      {Array.isArray(m.cardData.skills) && m.cardData.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {m.cardData.skills.map((s: string, idx: number) => (
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
                        {m.cardData.round || "Interview Round"}
                      </div>
                      {m.cardData.candidateName && (
                        <div>
                          Candidate: <strong>{m.cardData.candidateName}</strong>
                        </div>
                      )}
                      {m.cardData.interviewer && (
                        <div>
                          Interviewer: <strong>{m.cardData.interviewer}</strong>
                        </div>
                      )}
                      {m.cardData.time && (
                        <div className="text-muted-foreground font-mono text-[11px]">
                          {m.cardData.time}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Render Rich Result Cards: Offer */}
                  {m.cardType === "offer" && m.cardData && (
                    <div className="mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-1.5 shadow-sm">
                      <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        Offer: {m.cardData.candidateName}
                      </div>
                      {m.cardData.role && (
                        <div>
                          Role: <strong>{m.cardData.role}</strong>
                        </div>
                      )}
                      {m.cardData.ctc && (
                        <div>
                          Total CTC:{" "}
                          <strong className="font-mono text-indigo-500">{m.cardData.ctc}</strong>
                        </div>
                      )}
                      {m.cardData.joiningDate && (
                        <div className="text-muted-foreground">
                          Target Joining: {m.cardData.joiningDate}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Render Rich Result Cards: Onboarding */}
                  {m.cardType === "onboarding" && m.cardData?.joiners && (
                    <div className="mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-2 shadow-sm">
                      <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                        Day-One Readiness Tracker
                      </div>
                      {m.cardData.joiners.map((j: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-xs border-b border-border/40 pb-1 last:border-0"
                        >
                          <span>
                            {j.name} ({j.role})
                          </span>
                          <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">
                            {j.readiness}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Render Rich Result Cards: Payroll & Workforce Metrics */}
                  {m.cardType === "payroll" && m.cardData?.metrics && (
                    <div className="mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-1.5 shadow-sm">
                      {m.cardData.metrics.map((met: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="text-muted-foreground">{met.label}:</span>
                          <span className="font-semibold">{met.val}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Structured Backend Tables */}
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
                                      {String(cell)}
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
                        className="h-7 text-xs bg-gradient-brand text-brand-foreground shadow-glow gap-1"
                        onClick={() => setConfirmModal(m.actionRequired!)}
                      >
                        <Check className="h-3 w-3" /> Confirm & Execute
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
                            className="text-[11px] px-2.5 py-1 rounded-full bg-background/70 hover:bg-background border border-border text-foreground/80 hover:text-foreground transition-colors text-left"
                          >
                            {sug}
                          </button>
                        ))}
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
                    AI Service Notice: {sendError || "Failed to receive AI response from the server."}
                  </span>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs border-destructive/40 hover:bg-destructive/20 gap-1 text-destructive"
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
          className="flex items-center gap-2 border-t border-border p-3"
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
            className="h-10 px-4 bg-gradient-brand text-brand-foreground shadow-glow gap-1.5"
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

      {/* Action Confirmation Modal */}
      {confirmModal && (
        <Dialog open={Boolean(confirmModal)} onOpenChange={() => setConfirmModal(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-indigo-500" />
                Confirm Backend AI Action
              </DialogTitle>
              <DialogDescription>{confirmModal.actionName}</DialogDescription>
            </DialogHeader>

            <div className="py-2 text-xs text-muted-foreground">
              <p className="p-3 rounded-lg border border-border bg-muted/30 text-foreground leading-relaxed">
                {confirmModal.description}
              </p>
              <p className="mt-2 text-[11px] italic">
                Execution will dispatch verified transactions to the OFC360 workspace modules.
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmModal(null)}>
                Cancel
              </Button>
              <Button
                className="bg-gradient-brand text-brand-foreground shadow-glow"
                onClick={handleConfirmAction}
              >
                Confirm & Proceed
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

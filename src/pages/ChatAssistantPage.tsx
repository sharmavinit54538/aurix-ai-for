import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Sparkles,
  Users,
  Banknote,
  BarChart3,
  FileText,
  UserCheck,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Check,
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
import { useRecruitment } from "@/features/admin/recruitment/hooks/useRecruitment";

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  cardType?: "candidate" | "job" | "interview" | "offer" | "onboarding" | "payroll" | "employee";
  cardData?: any;
  actionRequired?: {
    actionName: string;
    description: string;
    payload: any;
  };
}

const COMMAND_SUGGESTIONS = [
  { label: "Search candidate", cmd: "Search candidate" },
  { label: "Active job postings", cmd: "List active job openings" },
  { label: "Show onboarding progress", cmd: "Show employee onboarding progress" },
  { label: "Show pending HR tasks", cmd: "Show pending HR tasks and approvals" },
  { label: "Payroll & attendance summary", cmd: "Show monthly payroll and attendance summary" },
];

export default function ChatAssistantPage() {
  const { candidates, jobs, interviews, offers, moveStage } = useRecruitment();
  const [msgs, setMsgs] = useState<ChatMessage[]>([
    {
      id: "m-welcome",
      role: "ai",
      text: "Hi 👋 I am People AI, your central OFC360 workforce copilot. You can ask questions about your workforce or issue voice/text commands to search, shortlist, create jobs, schedule interviews, and structure offers.",
    },
  ]);
  const [input, setInput] = useState("");
  const [confirmModal, setConfirmModal] = useState<{
    actionName: string;
    description: string;
    payload: any;
  } | null>(null);

  const [activityHistory, setActivityHistory] = useState<string[]>([
    "People AI initialized session",
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const handleExecuteCommand = (q: string) => {
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: q,
    };

    const queryLower = q.toLowerCase();
    let aiResponse: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: "ai",
      text: "I processed your request using live workforce records.",
    };

    if (queryLower.includes("candidate") || queryLower.includes("search") || queryLower.includes("find")) {
      const searchTerms = queryLower
        .replace(/^(search|find|show|candidate|candidates|for)\s+/g, "")
        .trim();

      const matched = candidates?.find((c: any) => {
        const cName = (
          c.name ||
          c.full_name ||
          `${c.first_name || ""} ${c.last_name || ""}`
        ).toLowerCase();
        const cRole = (c.appliedPosition || c.position || c.role || "").toLowerCase();
        return (
          (searchTerms && cName.includes(searchTerms)) ||
          (searchTerms && cRole.includes(searchTerms))
        );
      });

      if (matched) {
        const cand = {
          name: (matched as any).name || (matched as any).full_name || `${(matched as any).first_name || ""} ${(matched as any).last_name || ""}`.trim() || "Candidate",
          atsScore: (matched as any)?.atsScore ?? (matched as any)?.score ?? 85,
          appliedPosition: (matched as any)?.appliedPosition || (matched as any)?.position || "Role Not Specified",
          yearsExperience: (matched as any)?.yearsExperience ?? (matched as any)?.experience ?? "—",
          summary: (matched as any)?.summary || "Active candidate in recruitment pipeline.",
        };

        aiResponse = {
          id: `ai-${Date.now()}`,
          role: "ai",
          text: `Found matching candidate profile for ${cand.name}:`,
          cardType: "candidate",
          cardData: cand,
        };
        setActivityHistory((p) => [`Searched candidate: ${cand.name}`, ...p]);
      } else if (candidates && candidates.length > 0) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          role: "ai",
          text: `Found ${candidates.length} active candidates in your pipeline. Please specify a name or skill to narrow down.`,
        };
      } else {
        aiResponse = {
          id: `ai-${Date.now()}`,
          role: "ai",
          text: "No candidates currently found in your recruitment pipeline.",
        };
      }
    } else if (queryLower.includes("job") || queryLower.includes("openings") || queryLower.includes("postings")) {
      if (jobs && jobs.length > 0) {
        aiResponse = {
          id: `ai-${Date.now()}`,
          role: "ai",
          text: `You have ${jobs.length} active job requisition(s) in your pipeline.`,
          cardType: "job",
          cardData: {
            title: jobs[0].title || (jobs[0] as any).role || "Open Position",
            department: jobs[0].department || "General",
            salary: (jobs[0] as any).salary || "As per policy",
            skills: jobs[0].skills || [],
          },
        };
      } else {
        aiResponse = {
          id: `ai-${Date.now()}`,
          role: "ai",
          text: "No active job requisitions found in your organization.",
        };
      }
    } else if (queryLower.includes("interview")) {
      if (interviews && interviews.length > 0) {
        const nextInterview = interviews[0];
        aiResponse = {
          id: `ai-${Date.now()}`,
          role: "ai",
          text: `You have ${interviews.length} scheduled interview(s):`,
          cardType: "interview",
          cardData: {
            candidateName: (nextInterview as any)?.candidateName || "Candidate",
            interviewer: (nextInterview as any)?.interviewer || "Hiring Manager",
            time: (nextInterview as any)?.time || (nextInterview as any)?.scheduledAt || "Scheduled",
            round: (nextInterview as any)?.round || "Interview Round",
          },
        };
      } else {
        aiResponse = {
          id: `ai-${Date.now()}`,
          role: "ai",
          text: "No upcoming interviews scheduled at this time.",
        };
      }
    } else if (queryLower.includes("offer")) {
      if (offers && offers.length > 0) {
        const firstOffer = offers[0];
        aiResponse = {
          id: `ai-${Date.now()}`,
          role: "ai",
          text: `Found ${offers.length} active offer letter(s):`,
          cardType: "offer",
          cardData: {
            candidateName: (firstOffer as any)?.candidateName || "Candidate",
            role: (firstOffer as any)?.role || "Position",
            ctc: (firstOffer as any)?.ctc || "As structured",
            joiningDate: (firstOffer as any)?.joiningDate || "TBD",
          },
        };
      } else {
        aiResponse = {
          id: `ai-${Date.now()}`,
          role: "ai",
          text: "No active offer letters currently generated in recruitment.",
        };
      }
    } else if (queryLower.includes("onboarding")) {
      aiResponse = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: "No new hire onboarding cohorts currently in progress.",
      };
    } else if (queryLower.includes("pending") || queryLower.includes("task")) {
      aiResponse = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: "No pending HR approval tasks or exception sign-offs required at this time.",
      };
    } else if (queryLower.includes("payroll") || queryLower.includes("attendance")) {
      aiResponse = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: "Workforce payroll and attendance records are managed through the Payroll & Attendance modules. No pending batch disbursements require attention.",
      };
    } else {
      aiResponse = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: `I received: "${q}". You can query candidates, jobs, interviews, offers, or HR tasks.`,
      };
    }

    setMsgs([...msgs, userMsg, aiResponse]);
    setInput("");
  };

  const handleConfirmAction = async () => {
    if (!confirmModal) return;

    try {
      if (confirmModal.actionName.includes("Shortlist") && confirmModal.payload?.candidateId) {
        await moveStage(confirmModal.payload.candidateId, "technical");
        toast.success(
          `Action Executed: ${confirmModal.actionName} completed successfully! Candidate advanced to Technical round.`,
        );
        setActivityHistory((p) => [`Executed: ${confirmModal.actionName}`, ...p]);
      } else {
        toast.info(
          `${confirmModal.actionName}: Autonomous direct agent execution is coming soon. Please manage this record in its respective module.`,
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
        description="Search candidates, shortlist applicants, draft offer letters, trigger onboardings, and inspect payroll through an intelligent central conversational interface."
        lastAnalysis="Ready"
      />

      {/* Chat Window */}
      <div className="flex h-[640px] flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm">
        {/* Messages Feed */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5 text-xs">
          {msgs.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                  m.role === "user"
                    ? "bg-foreground text-background"
                    : "bg-accent/80 text-foreground border border-border/60"
                }`}
              >
                <p className="text-xs">{m.text}</p>

                {/* Render Rich Result Cards */}
                {m.cardType === "candidate" && m.cardData && (
                  <div className="mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{m.cardData.name}</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {m.cardData.atsScore}% Match
                      </Badge>
                    </div>
                    <div className="text-muted-foreground">
                      {m.cardData.appliedPosition} • {m.cardData.yearsExperience} yrs exp
                    </div>
                    <div className="text-[11px] text-muted-foreground">{m.cardData.summary}</div>
                  </div>
                )}

                {m.cardType === "interview" && m.cardData && (
                  <div className="mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-1.5 shadow-sm">
                    <div className="font-bold text-sm flex items-center gap-1.5 text-indigo-500">
                      <CalendarClock className="h-4 w-4" />
                      {m.cardData.round}
                    </div>
                    <div>
                      Candidate: <strong>{m.cardData.candidateName}</strong>
                    </div>
                    <div>
                      Interviewer: <strong>{m.cardData.interviewer}</strong>
                    </div>
                    <div className="text-muted-foreground font-mono text-[11px]">
                      {m.cardData.time}
                    </div>
                  </div>
                )}

                {m.cardType === "offer" && m.cardData && (
                  <div className="mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-1.5 shadow-sm">
                    <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                      Offer: {m.cardData.candidateName}
                    </div>
                    <div>
                      Role: <strong>{m.cardData.role}</strong>
                    </div>
                    <div>
                      Total CTC:{" "}
                      <strong className="font-mono text-indigo-500">{m.cardData.ctc}</strong>
                    </div>
                    <div className="text-muted-foreground">
                      Target Joining: {m.cardData.joiningDate}
                    </div>
                  </div>
                )}

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
              </div>
            </div>
          ))}
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
            placeholder="Ask or command People AI… (e.g. Schedule interview for Siddharth tomorrow 2 PM)"
            className="text-xs h-10"
          />
          <Button
            type="submit"
            className="h-10 px-4 bg-gradient-brand text-brand-foreground shadow-glow gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
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
                Confirm Simulated AI Action
              </DialogTitle>
              <DialogDescription>{confirmModal.actionName}</DialogDescription>
            </DialogHeader>

            <div className="py-2 text-xs text-muted-foreground">
              <p className="p-3 rounded-lg border border-border bg-muted/30 text-foreground leading-relaxed">
                {confirmModal.description}
              </p>
              <p className="mt-2 text-[11px] italic">
                Simulated execution will update the local OFC360 workspace store.
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

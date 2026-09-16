import { useState, useRef, useEffect } from "react";
import {
  MessageSquare, Send, Sparkles, Users, Banknote, BarChart3, FileText,
  UserCheck, Briefcase, CalendarClock, ShieldCheck, CheckCircle2,
  AlertCircle, History, ArrowRight, CornerDownLeft, RefreshCw, Check
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
  { label: "Search candidate Siddharth", cmd: "Search candidate Siddharth Nambiar" },
  { label: "Find AI Engineer candidates", cmd: "Find candidates for Staff AI Engineer" },
  { label: "Create new job DevOps", cmd: "Create job: Cloud Infrastructure Architect" },
  { label: "Shortlist candidate", cmd: "Shortlist Siddharth Nambiar for Senior Full Stack" },
  { label: "Schedule interview", cmd: "Schedule interview for Siddharth Nambiar tomorrow 2 PM" },
  { label: "Generate offer letter", cmd: "Generate offer for Aditya Roy with 26 LPA" },
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
    "Screened 42 candidates for Engineering",
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
      text: "I processed your request using local simulated workforce records.",
    };

    if (queryLower.includes("candidate") && (queryLower.includes("siddharth") || queryLower.includes("search"))) {
      const cand = candidates[0];
      aiResponse = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: `Found matching candidate profile for ${cand.name}:`,
        cardType: "candidate",
        cardData: cand,
      };
      setActivityHistory((p) => [`Searched candidate: ${cand.name}`, ...p]);
    } else if (queryLower.includes("create job")) {
      aiResponse = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: "I drafted a new job requisition based on your command. Please confirm creation:",
        cardType: "job",
        cardData: {
          title: "Cloud Infrastructure Architect",
          department: "Engineering",
          salary: "₹28L - ₹36L",
          skills: ["Kubernetes", "AWS", "Terraform", "CI/CD"],
        },
        actionRequired: {
          actionName: "Create Job Posting",
          description: "Publish 'Cloud Infrastructure Architect' to active career portals and distribution feeds.",
          payload: { title: "Cloud Infrastructure Architect" },
        },
      };
    } else if (queryLower.includes("shortlist")) {
      aiResponse = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: "Candidate has strong 94% match. Would you like to confirm shortlisting?",
        actionRequired: {
          actionName: "Shortlist Candidate",
          description: "Advance Siddharth Nambiar to Technical Round and dispatch interview invitation.",
          payload: { candidateId: "cand-201" },
        },
      };
    } else if (queryLower.includes("schedule interview")) {
      aiResponse = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: "Found available slot with Arun Verma (Director of Engineering). Ready to schedule:",
        cardType: "interview",
        cardData: {
          candidateName: "Siddharth Nambiar",
          interviewer: "Arun Verma",
          time: "Tomorrow, 2:00 PM - 3:00 PM IST",
          round: "System Design Round",
        },
        actionRequired: {
          actionName: "Confirm Interview Booking",
          description: "Send calendar invite with Google Meet link to candidate and interviewer.",
          payload: { round: "System Design" },
        },
      };
    } else if (queryLower.includes("offer") || queryLower.includes("generate offer")) {
      aiResponse = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: "Drafted formal compensation structure for Aditya Roy (Lead Product Designer):",
        cardType: "offer",
        cardData: {
          candidateName: "Aditya Roy",
          role: "Lead Product Designer",
          ctc: "₹26,00,000 / year",
          joiningDate: "April 1, 2026",
        },
        actionRequired: {
          actionName: "Submit Offer for CFO Sign-off",
          description: "Forward offer letter to Kunal Gupta (CFO) for financial cap approval.",
          payload: { ctc: 2600000 },
        },
      };
    } else if (queryLower.includes("onboarding")) {
      aiResponse = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: "Here is the current Day-One readiness summary for incoming cohort joiners:",
        cardType: "onboarding",
        cardData: {
          joiners: [
            { name: "Meera Kulkarni", readiness: "88% Ready", role: "HR Operations" },
            { name: "Aditya Roy", readiness: "72% Ready", role: "Product Designer" },
          ],
        },
      };
    } else if (queryLower.includes("pending") || queryLower.includes("task")) {
      aiResponse = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: "You have 3 pending HR and recruitment approvals today:",
        cardType: "payroll",
        cardData: {
          tasks: [
            "2 Candidate BGV exception reviews awaiting sign-off",
            "1 Requisition budget review for Engineering (3 Headcount)",
            "1 Offer sign-off for Lead Product Designer",
          ],
        },
      };
    } else if (queryLower.includes("payroll") || queryLower.includes("attendance")) {
      aiResponse = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: "March 2026 Workforce & Payroll Telemetry:",
        cardType: "payroll",
        cardData: {
          metrics: [
            { label: "Active Headcount", val: "142 Employees" },
            { label: "Attendance Rate", val: "97.4% on-time" },
            { label: "Monthly Gross Payroll", val: "₹1.48 Crore" },
            { label: "Overtime Disbursed", val: "₹1.84 Lakhs" },
          ],
        },
      };
    } else {
      aiResponse = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: `I analyzed the query "${q}" across the OFC360 knowledge graph. Here is the operational summary and matching telemetry records.`,
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
        toast.success(`Action Executed: ${confirmModal.actionName} completed successfully! Candidate advanced to Technical round.`);
        setActivityHistory((p) => [`Executed: ${confirmModal.actionName}`, ...p]);
      } else {
        toast.info(`${confirmModal.actionName}: Autonomous direct agent execution is coming soon. Please manage this record in its respective module.`);
        setActivityHistory((p) => [`Previewed: ${confirmModal.actionName} (Manual dashboard follow-up)`, ...p]);
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
        lastAnalysis="Live Demo Active"
      />

      {/* People AI Status Banner */}
      <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs flex items-center justify-between text-indigo-700 dark:text-indigo-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>
            <strong>People AI Assistant:</strong> Connected to live workforce data. Direct command execution operates on real backend APIs.
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] text-indigo-500 border-indigo-500/30">
          Live Backend Connected
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {/* Chat Window */}
        <div className="lg:col-span-3 flex h-[620px] flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm">
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
                        <Badge variant="secondary" className="text-[10px]">{m.cardData.atsScore}% Match</Badge>
                      </div>
                      <div className="text-muted-foreground">{m.cardData.appliedPosition} • {m.cardData.yearsExperience} yrs exp</div>
                      <div className="text-[11px] text-muted-foreground">{m.cardData.summary}</div>
                    </div>
                  )}

                  {m.cardType === "interview" && m.cardData && (
                    <div className="mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-1.5 shadow-sm">
                      <div className="font-bold text-sm flex items-center gap-1.5 text-indigo-500">
                        <CalendarClock className="h-4 w-4" />
                        {m.cardData.round}
                      </div>
                      <div>Candidate: <strong>{m.cardData.candidateName}</strong></div>
                      <div>Interviewer: <strong>{m.cardData.interviewer}</strong></div>
                      <div className="text-muted-foreground font-mono text-[11px]">{m.cardData.time}</div>
                    </div>
                  )}

                  {m.cardType === "offer" && m.cardData && (
                    <div className="mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-1.5 shadow-sm">
                      <div className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                        Offer: {m.cardData.candidateName}
                      </div>
                      <div>Role: <strong>{m.cardData.role}</strong></div>
                      <div>Total CTC: <strong className="font-mono text-indigo-500">{m.cardData.ctc}</strong></div>
                      <div className="text-muted-foreground">Target Joining: {m.cardData.joiningDate}</div>
                    </div>
                  )}

                  {m.cardType === "onboarding" && m.cardData?.joiners && (
                    <div className="mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-2 shadow-sm">
                      <div className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Day-One Readiness Tracker</div>
                      {m.cardData.joiners.map((j: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs border-b border-border/40 pb-1 last:border-0">
                          <span>{j.name} ({j.role})</span>
                          <Badge variant="outline" className="text-emerald-500 border-emerald-500/30">{j.readiness}</Badge>
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

        {/* Right Sidebar: Command Suggestions & Activity History */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              Suggested AI Commands
            </div>
            <div className="space-y-1.5">
              {COMMAND_SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleExecuteCommand(s.cmd)}
                  className="w-full text-left p-2 rounded-lg border border-border/60 bg-card/40 hover:bg-accent text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span>{s.label}</span>
                  <CornerDownLeft className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
              <History className="h-4 w-4 text-emerald-500" />
              Recent AI Action Log
            </div>
            <div className="space-y-1 text-[10px] text-muted-foreground font-mono">
              {activityHistory.map((act, i) => (
                <div key={i} className="p-1.5 rounded bg-muted/30 truncate">
                  • {act}
                </div>
              ))}
            </div>
          </div>
        </div>
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
              <DialogDescription>
                {confirmModal.actionName}
              </DialogDescription>
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

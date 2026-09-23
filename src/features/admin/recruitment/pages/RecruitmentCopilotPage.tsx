import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUp,
  Award,
  Bot,
  Building,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Coins,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  FileCheck,
  FileText,
  Mail,
  MapPin,
  MessageSquare,
  PanelLeft,
  PanelLeftClose,
  Plus,
  RefreshCw,
  Search,
  Send,
  Share2,
  Sparkles,
  Star,
  Target,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  TrendingUp,
  User,
  Users,
  Wand2,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { CandidateAvatar, ScoreRing } from "@/features/admin/recruitment/components/Bits";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRecruitment } from "@/features/admin/recruitment/hooks/useRecruitment";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  cardType?:
    | "offer"
    | "ranking"
    | "resume_summary"
    | "feedback"
    | "recommendation"
    | "salary"
    | "skillgap"
    | "boolean"
    | "email";
  cardData?: any;
  feedback?: "up" | "down";
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  jobId?: string;
  candidateId?: string;
  messages: ChatMessage[];
}

const STORAGE_KEY = "ofc360:copilot_chat_sessions_v2";
const ACTIVE_SESSION_KEY = "ofc360:copilot_active_session_v2";

const SUGGESTED_PROMPTS = [
  {
    title: "Draft Formal Offer Letter",
    desc: "Generate compliant appointment letter with CTC breakdown",
    prompt: "Draft a formal offer letter with salary breakdown and joining date for the selected candidate.",
    type: "offer",
  },
  {
    title: "Rank Role Applicants",
    desc: "Compare candidates by ATS match, stack & experience",
    prompt: "Rank all active candidates for this requisition with ATS fit scores and strengths.",
    type: "ranking",
  },
  {
    title: "Market Salary Benchmark",
    desc: "View P25-P75 percentiles and peer market comp bands",
    prompt: "Benchmark compensation bands (P25, P50, P75) and analyze our offer budget for this position.",
    type: "salary",
  },
  {
    title: "Boolean Sourcing Strings",
    desc: "Generate copy-ready LinkedIn Recruiter & X-Ray queries",
    prompt: "Generate optimized Boolean search strings for LinkedIn Recruiter and Google X-Ray to source for this role.",
    type: "boolean",
  },
];

export function RecruitmentCopilotPage() {
  const { candidates, jobs } = useRecruitment((s) => s);

  // Context Selection (Requisition & Candidate)
  const [selectedJobId, setSelectedJobId] = useState<string>(() => jobs[0]?.id ?? "");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    () => candidates[0]?.id ?? "",
  );

  // Sync with available data
  useEffect(() => {
    if ((!selectedJobId || !jobs.some((j) => j.id === selectedJobId)) && jobs.length > 0) {
      setSelectedJobId(jobs[0].id);
    }
  }, [jobs, selectedJobId]);

  useEffect(() => {
    if (
      (!selectedCandidateId || !candidates.some((c) => c.id === selectedCandidateId)) &&
      candidates.length > 0
    ) {
      setSelectedCandidateId(candidates[0].id);
    }
  }, [candidates, selectedCandidateId]);

  const activeJob = useMemo(
    () => jobs.find((j) => j.id === selectedJobId) || jobs[0],
    [jobs, selectedJobId],
  );
  const activeCandidate = useMemo(
    () => candidates.find((c) => c.id === selectedCandidateId) || candidates[0],
    [candidates, selectedCandidateId],
  );

  // Currency symbol
  const currencySymbol = useMemo(() => {
    if (!activeJob?.currency) return "₹";
    if (activeJob.currency === "USD") return "$";
    if (activeJob.currency === "EUR") return "€";
    if (activeJob.currency === "GBP") return "£";
    return "₹";
  }, [activeJob]);

  // Sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Chat sessions state
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: "session-default",
        title: "Recruitment Intelligence Hub",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
          {
            id: "msg-welcome",
            role: "assistant",
            content: `Hello! I'm your **Aurix AI Recruiter Copilot**.\n\nI have full visibility into your active requisitions and talent pool. How can I help you today? You can ask me to draft formal offer letters, rank candidates, analyze skill gaps, generate boolean queries, or benchmark market compensation.`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ],
      },
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (saved) return saved;
    } catch {}
    return "session-default";
  });

  // Active session helper
  const activeSession = useMemo(() => {
    return sessions.find((s) => s.id === activeSessionId) || sessions[0];
  }, [sessions, activeSessionId]);

  // Save sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      if (activeSessionId) {
        localStorage.setItem(ACTIVE_SESSION_KEY, activeSessionId);
      }
    } catch {}
  }, [sessions, activeSessionId]);

  // Chat Input
  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, isGenerating]);

  // Copy helper
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Create New Chat
  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: "New Conversation",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      jobId: selectedJobId,
      candidateId: selectedCandidateId,
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: `Started a fresh session! Requisition context is set to **${activeJob?.title || "Active Requisitions"}**. What would you like to accomplish?`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  // Delete Chat Session
  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      toast.info("Keeping at least one chat session");
      return;
    }
    const filtered = sessions.filter((s) => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) {
      setActiveSessionId(filtered[0].id);
    }
    toast.success("Conversation deleted");
  };

  // Build AI Response based on domain context
  const buildAIResponse = (prompt: string): { content: string; cardType?: any; cardData?: any } => {
    const q = prompt.toLowerCase();
    const candName = activeCandidate?.name || "Candidate";
    const jobTitle = activeJob?.title || "Software Engineer";
    const baseSalary = activeCandidate?.expectedSalary || activeJob?.salaryMax || 1800000;
    const bonus = Math.round(baseSalary * 0.1);

    // 1. Offer Letter
    if (q.includes("offer") || q.includes("appointment") || q.includes("ctc") || q.includes("package")) {
      const joiningDateStr = new Date(Date.now() + 30 * 86400000).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const offerText = `CONFIDENTIAL & PROPRIETARY
OFFER OF EMPLOYMENT

Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

Dear ${candName},

On behalf of OFC360 Technologies, we are thrilled to extend an official offer of employment for the position of ${jobTitle}. Based on your extensive experience and outstanding performance throughout our evaluation rounds, we believe your technical leadership will be instrumental in scaling our core platforms.

COMPENSATION & BENEFITS SUMMARY:
• Annual Base Salary: ${currencySymbol}${baseSalary.toLocaleString()} (paid monthly)
• Target Performance Bonus: ${currencySymbol}${bonus.toLocaleString()} annually
• Total Annual Target Cash: ${currencySymbol}${(baseSalary + bonus).toLocaleString()}
• Equity / Stock Options: 0.05% of company pool (standard 4-year vesting with 1-year cliff)
• Health & Life Coverage: Comprehensive medical insurance for employee & immediate family
• Flexible Work Policy: ${activeJob?.workMode || "Hybrid"} arrangement (${activeJob?.location || "Bengaluru"})

KEY TERMS:
• Requisition / Department: ${activeJob?.department || "Engineering"}
• Proposed Joining Date: ${joiningDateStr}
• Notice Period / Probation: 30 days probation period with full benefits from Day 1

Please confirm your acceptance of this offer by signing and returning this letter by ${new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.

Welcome aboard! We are excited to build the future together.

Sincerely,
Talent Acquisition Team
OFC360 Technologies`;

      return {
        content: `I've prepared a comprehensive, legally structured formal **Offer of Employment** for **${candName}** for the **${jobTitle}** requisition. You can review the breakdown below or copy the finalized letterhead memo.`,
        cardType: "offer",
        cardData: {
          candidateName: candName,
          jobTitle: jobTitle,
          baseSalary: baseSalary,
          bonus: bonus,
          equity: "0.05%",
          joiningDate: joiningDateStr,
          offerText: offerText,
        },
      };
    }

    // 2. Candidate Ranking
    if (
      q.includes("rank") ||
      q.includes("top candidate") ||
      q.includes("shortlist") ||
      q.includes("leaderboard") ||
      q.includes("compare")
    ) {
      const rankedList = [...candidates]
        .map((c, i) => ({
          ...c,
          fitScore: Math.min(98, Math.max(68, (c.atsScore || 85) + (10 - i * 4))),
        }))
        .sort((a, b) => b.fitScore - a.fitScore);

      return {
        content: `Here is the AI ATS candidate ranking for **${jobTitle}** based on technical stack compatibility, years of experience, and panel feedback.`,
        cardType: "ranking",
        cardData: {
          jobTitle,
          candidates: rankedList,
        },
      };
    }

    // 3. Market Salary Benchmark
    if (
      q.includes("salary") ||
      q.includes("comp") ||
      q.includes("benchmark") ||
      q.includes("percentile") ||
      q.includes("pay band")
    ) {
      const minBand = activeJob?.salaryMin || 1400000;
      const maxBand = activeJob?.salaryMax || 2400000;
      const median = Math.round((minBand + maxBand) / 2);

      return {
        content: `I evaluated 430+ market compensation data points for **${jobTitle}** in **${activeJob?.location || "Bengaluru / Remote"}**. Here is the salary percentile breakdown against candidate expectations:`,
        cardType: "salary",
        cardData: {
          minBand,
          median,
          maxBand,
          candidateAsk: activeCandidate?.expectedSalary || 1800000,
          currency: currencySymbol,
          recommendedOffer: Math.round(median * 1.05),
        },
      };
    }

    // 4. Boolean Sourcing Queries
    if (
      q.includes("boolean") ||
      q.includes("search string") ||
      q.includes("sourcing") ||
      q.includes("x-ray") ||
      q.includes("linkedin search")
    ) {
      const skills = activeJob?.skills?.length ? activeJob.skills : ["React", "TypeScript", "Node.js"];
      const skillsOr = skills.map((s) => `"${s}"`).join(" OR ");
      const skillsAnd = skills.map((s) => `"${s}"`).join(" ");

      const linkedinQuery = `("${jobTitle}" OR "Software Engineer") AND (${skillsOr}) AND ("Senior" OR "Lead") NOT ("intern" OR "trainee" OR "junior")`;
      const googleXrayQuery = `site:linkedin.com/in/ ("${jobTitle}") ("${activeJob?.location?.split(",")[0] || "India"}") (${skillsAnd}) -intitle:"profiles" -inurl:"dir/"`;

      return {
        content: `Here are optimized high-precision Boolean sourcing strings tailored for **${jobTitle}**. Ready to paste into LinkedIn Recruiter and Google X-Ray Search:`,
        cardType: "boolean",
        cardData: {
          jobTitle,
          linkedinQuery,
          googleXrayQuery,
        },
      };
    }

    // 5. Skill Gap Analysis
    if (q.includes("skill") || q.includes("gap") || q.includes("overlap") || q.includes("stack")) {
      const jobSkills = activeJob?.skills?.length ? activeJob.skills : ["React", "TypeScript", "Node.js", "Docker"];
      const candSkills = activeCandidate?.skills?.length ? activeCandidate.skills : ["React", "TypeScript", "TailwindCSS"];
      const matched = jobSkills.filter((s) => candSkills.some((cs) => cs.toLowerCase() === s.toLowerCase()));
      const missing = jobSkills.filter((s) => !matched.includes(s));
      const bonus = candSkills.filter((s) => !matched.includes(s));

      return {
        content: `Analyzed skill overlap between **${candName}** and **${jobTitle}** requirements. Overall match score is **84%**.`,
        cardType: "skillgap",
        cardData: {
          candidateName: candName,
          jobTitle,
          matched,
          missing: missing.length ? missing : ["Kubernetes", "GraphQL"],
          bonus: bonus.length ? bonus : ["Docker", "Next.js"],
        },
      };
    }

    // 6. Resume Summary
    if (q.includes("resume") || q.includes("summarize") || q.includes("profile") || q.includes("cv") || q.includes("experience")) {
      return {
        content: `Here is the executive synthesis of **${candName}** for your hiring panel:`,
        cardType: "resume_summary",
        cardData: {
          candidate: activeCandidate,
          jobTitle,
        },
      };
    }

    // 7. Interview Feedback Summary
    if (q.includes("interview") || q.includes("feedback") || q.includes("scorecard") || q.includes("round")) {
      return {
        content: `Consolidated scorecard ratings and interviewer panel notes for **${candName}**:`,
        cardType: "feedback",
        cardData: {
          candidateName: candName,
          jobTitle,
        },
      };
    }

    // 8. Hiring Recommendation
    if (q.includes("recommend") || q.includes("hire") || q.includes("verdict") || q.includes("decision")) {
      return {
        content: `Formal **Hiring Decision Memo** for **${candName}** for requisition **${jobTitle}**:`,
        cardType: "recommendation",
        cardData: {
          candidateName: candName,
          jobTitle,
          verdict: "HIRE",
          confidence: "92%",
        },
      };
    }

    // 9. Outreach Email
    if (q.includes("email") || q.includes("outreach") || q.includes("message") || q.includes("invite")) {
      const emailSubject = `Exciting Senior Opportunity: ${jobTitle} at OFC360`;
      const emailBody = `Hi ${candName.split(" ")[0] || "there"},

I came across your profile and was thoroughly impressed by your background in ${(activeCandidate?.skills || ["software architecture"]).slice(0, 3).join(", ")}.

Our engineering leadership at OFC360 is currently scaling our core team, and we are looking for a ${jobTitle} to spearhead high-impact product initiatives. Given your track record, your experience looks like an ideal fit for what we are building.

Would you be open for a brief 15-minute introductory conversation this week to explore this further?

Best regards,
Talent Acquisition Team
OFC360 Technologies`;

      return {
        content: `Here is a personalized high-conversion outreach email crafted for **${candName}**:`,
        cardType: "email",
        cardData: {
          candidateEmail: activeCandidate?.email || "candidate@example.com",
          subject: emailSubject,
          body: emailBody,
        },
      };
    }

    // Default conversational response
    return {
      content: `I've analyzed your question regarding **${jobTitle}** and candidate **${candName}**.\n\n### Key Recruitment Recommendations:\n- **Talent Pool Alignment**: We currently have ${candidates.length} active candidates in the pipeline for this track.\n- **Speed to Hire**: The average time-to-hire for ${jobTitle} in this department is currently **22 days**.\n- **Next Strategic Steps**: You can click one of the quick capabilities below to draft an offer letter, generate Boolean sourcing strings, or view market compensation benchmarks.\n\nLet me know if you would like me to draft an email, structure a formal offer, or compare candidate resumes in detail!`,
    };
  };

  // Submit User Message
  const handleSendMessage = (customPromptText?: string) => {
    const textToSend = customPromptText || inputMessage;
    if (!textToSend.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Update session title if first user message
    const updatedTitle =
      activeSession.messages.length <= 1
        ? textToSend.length > 28
          ? `${textToSend.slice(0, 28)}...`
          : textToSend
        : activeSession.title;

    const newMessages = [...activeSession.messages, userMsg];

    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? {
              ...s,
              title: updatedTitle,
              updatedAt: new Date().toISOString(),
              messages: newMessages,
            }
          : s,
      ),
    );

    setInputMessage("");
    setIsGenerating(true);

    // Simulated streaming response delay
    setTimeout(() => {
      const generated = buildAIResponse(textToSend);
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: generated.content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        cardType: generated.cardType,
        cardData: generated.cardData,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSession.id
            ? {
                ...s,
                updatedAt: new Date().toISOString(),
                messages: [...newMessages, assistantMsg],
              }
            : s,
        ),
      );
      setIsGenerating(false);
    }, 700);
  };

  // Handle Enter key submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Message feedback
  const handleFeedback = (msgId: string, type: "up" | "down") => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? {
              ...s,
              messages: s.messages.map((m) =>
                m.id === msgId ? { ...m, feedback: type } : m,
              ),
            }
          : s,
      ),
    );
    toast.success(type === "up" ? "Helpful response recorded" : "Feedback recorded");
  };

  // Clear current chat
  const handleClearChat = () => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? {
              ...s,
              messages: [
                {
                  id: `msg-${Date.now()}`,
                  role: "assistant",
                  content: "Conversation history cleared. How can I help you?",
                  timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                },
              ],
            }
          : s,
      ),
    );
    toast.info("Conversation cleared");
  };

  return (
    <div className="flex h-[calc(100vh-4.25rem)] w-full overflow-hidden bg-background">
      {/* ─────────────────────────────────────────────────────────────
          LEFT SIDEBAR (ChatGPT Style)
      ────────────────────────────────────────────────────────────── */}
      <aside
        className={`${
          sidebarOpen ? "w-80" : "w-0 -translate-x-full md:w-0"
        } relative z-20 flex shrink-0 flex-col border-r border-border bg-card/70 backdrop-blur-xl transition-all duration-300 ease-in-out overflow-hidden`}
      >
        <div className="flex h-full w-80 flex-col justify-between">
          {/* Top Actions & Context Selectors */}
          <div className="p-3.5 space-y-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold tracking-tight text-foreground">
                  Recruiter Copilot
                </h2>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Gemini 1.5 Flash</span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground md:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* "+ New Chat" Button */}
            <Button
              onClick={handleNewChat}
              className="w-full justify-center bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 shadow-none h-9 text-xs font-semibold"
            >
              + New Conversation
            </Button>


          </div>

          {/* Chat Sessions History List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Recent Chats
            </div>

            {sessions.map((s) => {
              const isActive = s.id === activeSession.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setActiveSessionId(s.id)}
                  className={`group flex items-center justify-between rounded-lg px-3 py-2 text-xs cursor-pointer transition-all ${
                    isActive
                      ? "bg-primary/15 text-primary font-medium border border-primary/25"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <span className="truncate min-w-0 pr-2">{s.title}</span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={(e) => handleDeleteSession(s.id, e)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────────
          MAIN CHAT PANEL (ChatGPT Feed)
      ────────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 bg-background relative overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-card/40 px-4 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
            </Button>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-semibold text-sm truncate text-foreground">
                  {activeSession.title}
                </h1>
                <Badge variant="outline" className="hidden sm:inline-flex text-[10px] py-0">
                  {activeJob?.title || "Requisition"}
                </Badge>
              </div>
              <div className="text-[10px] text-muted-foreground truncate hidden md:block">
                Candidate: <span className="font-medium text-foreground">{activeCandidate?.name}</span> · Model: Gemini 1.5
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearChat}
              className="h-8 text-xs text-muted-foreground hover:text-destructive"
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewChat}
              className="h-8 text-xs gap-1.5 hidden sm:inline-flex"
            >
              <Plus className="h-3.5 w-3.5" />
              New Chat
            </Button>
          </div>
        </header>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6">
          {/* Empty State / Welcome Hero */}
          {activeSession.messages.length <= 1 && (
            <div className="max-w-2xl mx-auto pt-6 pb-4 space-y-6 text-center">
              <div className="inline-grid place-items-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-primary/20 via-violet-500/20 to-emerald-500/20 border border-primary/30 shadow-lg shadow-primary/5 mx-auto">
                <Sparkles className="h-7 w-7 text-primary animate-pulse" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                  AI Recruiter Copilot
                </h2>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Instant ranking, offer letter generation, salary benchmarks, and boolean sourcing powered by Aurix AI.
                </p>
              </div>

              {/* 4 Interactive Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
                {SUGGESTED_PROMPTS.map((p) => (
                  <button
                    key={p.title}
                    onClick={() => handleSendMessage(p.prompt)}
                    className="group flex flex-col justify-between rounded-xl border border-border bg-card/60 p-3.5 hover:border-primary/40 hover:bg-card hover:shadow-elegant transition-all text-xs cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {p.title}
                      </span>
                      <ArrowUp className="h-3.5 w-3.5 text-muted-foreground rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-2 line-clamp-2">
                      {p.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages List */}
          <div className="max-w-3xl mx-auto space-y-6">
            {activeSession.messages.map((m) => {
              const isAssistant = m.role === "assistant";
              return (
                <div
                  key={m.id}
                  className={`flex gap-3.5 ${isAssistant ? "items-start" : "items-start justify-end"}`}
                >
                  {/* Assistant Avatar */}
                  {isAssistant && (
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-primary to-violet-500 text-white shadow-sm mt-0.5">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  {/* Message Bubble Container */}
                  <div
                    className={`space-y-3 min-w-0 max-w-[85%] sm:max-w-[80%] ${
                      isAssistant
                        ? "text-foreground"
                        : "rounded-2xl bg-primary text-primary-foreground px-4 py-2.5 shadow-sm text-xs leading-relaxed"
                    }`}
                  >
                    {/* User Text */}
                    {!isAssistant ? (
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    ) : (
                      <div className="space-y-3">
                        {/* Assistant Markdown Content */}
                        <div className="text-xs leading-relaxed text-foreground space-y-2">
                          {m.content.split("\n\n").map((para, idx) => {
                            if (para.startsWith("### ")) {
                              return (
                                <h4 key={idx} className="font-semibold text-foreground text-sm pt-1">
                                  {para.replace("### ", "")}
                                </h4>
                              );
                            }
                            if (para.startsWith("- ") || para.startsWith("• ")) {
                              return (
                                <ul key={idx} className="list-disc list-inside space-y-1 text-muted-foreground pl-1">
                                  {para.split("\n").map((line, liIdx) => (
                                    <li key={liIdx}>
                                      {line.replace(/^[-•]\s*/, "")}
                                    </li>
                                  ))}
                                </ul>
                              );
                            }
                            return (
                              <p key={idx} className="text-foreground/90">
                                {para}
                              </p>
                            );
                          })}
                        </div>

                        {/* ────────────────────────────────────────────────────────
                            RICH EMBEDDED CARDS INSIDE COPILOT RESPONSE
                        ───────────────────────────────────────────────────────── */}

                        {/* 1. OFFER LETTER CARD */}
                        {m.cardType === "offer" && m.cardData && (
                          <div className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-sm backdrop-blur-xl mt-2">
                            <div className="flex items-center justify-between border-b border-border pb-3">
                              <div className="flex items-center gap-2.5">
                                <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
                                  <FileText className="h-4 w-4" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-xs text-foreground">
                                    Appointment Letter Memo
                                  </h4>
                                  <p className="text-[10px] text-muted-foreground">
                                    {m.cardData.candidateName} · {m.cardData.jobTitle}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-[11px] gap-1"
                                  onClick={() =>
                                    copyToClipboard(m.cardData.offerText, `offer-${m.id}`)
                                  }
                                >
                                  {copiedKey === `offer-${m.id}` ? (
                                    <Check className="h-3 w-3 text-emerald-500" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                  Copy Letter
                                </Button>
                              </div>
                            </div>

                            {/* Offer Highlights Grid */}
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 text-xs">
                              <div className="rounded-xl border border-border bg-background/50 p-2.5">
                                <span className="text-[10px] text-muted-foreground block">Base Annual CTC</span>
                                <span className="font-display font-bold text-foreground">
                                  {currencySymbol}{Number(m.cardData.baseSalary).toLocaleString()}
                                </span>
                              </div>
                              <div className="rounded-xl border border-border bg-background/50 p-2.5">
                                <span className="text-[10px] text-muted-foreground block">Performance Bonus</span>
                                <span className="font-display font-bold text-emerald-500">
                                  +{currencySymbol}{Number(m.cardData.bonus).toLocaleString()}
                                </span>
                              </div>
                              <div className="rounded-xl border border-border bg-background/50 p-2.5">
                                <span className="text-[10px] text-muted-foreground block">Stock Options</span>
                                <span className="font-display font-bold text-primary">
                                  {m.cardData.equity}
                                </span>
                              </div>
                              <div className="rounded-xl border border-border bg-background/50 p-2.5">
                                <span className="text-[10px] text-muted-foreground block">Joining Date</span>
                                <span className="font-display font-bold text-foreground">
                                  {m.cardData.joiningDate}
                                </span>
                              </div>
                            </div>

                            {/* Letterhead Preview Box */}
                            <div className="rounded-xl border border-border bg-muted/40 p-3.5 font-mono text-[11px] leading-relaxed text-foreground/90 whitespace-pre-wrap max-h-64 overflow-y-auto">
                              {m.cardData.offerText}
                            </div>
                          </div>
                        )}

                        {/* 2. CANDIDATE RANKING CARD */}
                        {m.cardType === "ranking" && m.cardData && (
                          <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-sm backdrop-blur-xl mt-2">
                            <div className="flex items-center justify-between border-b border-border pb-2.5">
                              <div>
                                <h4 className="font-semibold text-xs text-foreground">
                                  ATS Fit Ranking ({m.cardData.jobTitle})
                                </h4>
                                <p className="text-[10px] text-muted-foreground">
                                  Evaluated against required tech stack, seniority & scorecard
                                </p>
                              </div>
                              <Badge variant="outline" className="text-[10px]">
                                {m.cardData.candidates.length} Profiles
                              </Badge>
                            </div>

                            <div className="space-y-2">
                              {m.cardData.candidates.slice(0, 4).map((c: any, index: number) => {
                                const rankColors = [
                                  "bg-amber-500/20 text-amber-500 border-amber-500/30",
                                  "bg-slate-400/20 text-slate-300 border-slate-400/30",
                                  "bg-amber-700/20 text-amber-600 border-amber-700/30",
                                  "bg-muted text-muted-foreground",
                                ];
                                return (
                                  <div
                                    key={c.id}
                                    className="flex items-center gap-3 rounded-xl border border-border bg-background/50 p-2.5 hover:bg-accent/40 transition-colors"
                                  >
                                    <div
                                      className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold border ${rankColors[index] || rankColors[3]}`}
                                    >
                                      #{index + 1}
                                    </div>

                                    <CandidateAvatar name={c.name} size={32} />

                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-xs truncate">
                                          {c.name}
                                        </span>
                                        <Badge variant="outline" className="text-[9px] capitalize py-0">
                                          {c.stage}
                                        </Badge>
                                      </div>
                                      <div className="text-[11px] text-muted-foreground truncate">
                                        {c.currentRole || c.appliedPosition} · {c.yearsExperience}y exp
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                      <ScoreRing value={c.fitScore} size={38} label="FIT" />
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        asChild
                                        className="h-7 text-xs text-primary"
                                      >
                                        <Link
                                          to="/dashboard/recruitment/candidates/$candidateId"
                                          params={{ candidateId: c.id }}
                                        >
                                          View
                                        </Link>
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* 3. SALARY BENCHMARK CARD */}
                        {m.cardType === "salary" && m.cardData && (
                          <div className="rounded-2xl border border-border bg-card p-4 space-y-4 shadow-sm backdrop-blur-xl mt-2">
                            <div className="flex items-center justify-between border-b border-border pb-2.5">
                              <div>
                                <h4 className="font-semibold text-xs text-foreground">
                                  Market Compensation Band Analysis
                                </h4>
                                <p className="text-[10px] text-muted-foreground">
                                  Local & remote benchmark percentiles
                                </p>
                              </div>
                              <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px]">
                                In Approved Band
                              </Badge>
                            </div>

                            {/* Horizontal Percentile Band */}
                            <div className="space-y-2">
                              <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-sky-500 via-emerald-500 to-amber-500" />
                              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                                <div>
                                  <span className="block font-bold text-foreground">P25 (Entry)</span>
                                  {m.cardData.currency}{m.cardData.minBand.toLocaleString()}
                                </div>
                                <div className="text-center">
                                  <span className="block font-bold text-emerald-500">P50 (Median)</span>
                                  {m.cardData.currency}{m.cardData.median.toLocaleString()}
                                </div>
                                <div className="text-right">
                                  <span className="block font-bold text-foreground">P75 (Top Tier)</span>
                                  {m.cardData.currency}{m.cardData.maxBand.toLocaleString()}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="rounded-xl border border-border bg-background/50 p-2.5">
                                <span className="text-[10px] text-muted-foreground">Candidate Ask</span>
                                <div className="font-bold text-foreground">
                                  {m.cardData.currency}{m.cardData.candidateAsk.toLocaleString()}
                                </div>
                              </div>
                              <div className="rounded-xl border border-border bg-background/50 p-2.5">
                                <span className="text-[10px] text-muted-foreground">Recommended Offer</span>
                                <div className="font-bold text-emerald-500">
                                  {m.cardData.currency}{m.cardData.recommendedOffer.toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 4. BOOLEAN SOURCING STRINGS CARD */}
                        {m.cardType === "boolean" && m.cardData && (
                          <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-sm backdrop-blur-xl mt-2">
                            <div className="border-b border-border pb-2.5">
                              <h4 className="font-semibold text-xs text-foreground">
                                Boolean Sourcing Queries ({m.cardData.jobTitle})
                              </h4>
                              <p className="text-[10px] text-muted-foreground">
                                Copy directly into LinkedIn Recruiter or Google Search
                              </p>
                            </div>

                            <div className="space-y-2 text-xs">
                              {/* LinkedIn String */}
                              <div className="rounded-xl border border-border bg-background/50 p-3 space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-foreground flex items-center gap-1.5 text-[11px]">
                                    <Search className="h-3 w-3 text-sky-500" />
                                    LinkedIn Recruiter Search
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-[10px] gap-1"
                                    onClick={() =>
                                      copyToClipboard(m.cardData.linkedinQuery, `li-${m.id}`)
                                    }
                                  >
                                    {copiedKey === `li-${m.id}` ? (
                                      <Check className="h-3 w-3 text-emerald-500" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                    Copy
                                  </Button>
                                </div>
                                <code className="block rounded-lg bg-muted/60 p-2 font-mono text-[10px] text-foreground leading-relaxed break-words">
                                  {m.cardData.linkedinQuery}
                                </code>
                              </div>

                              {/* Google X-Ray Search */}
                              <div className="rounded-xl border border-border bg-background/50 p-3 space-y-1.5">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-foreground flex items-center gap-1.5 text-[11px]">
                                    <ExternalLink className="h-3 w-3 text-emerald-500" />
                                    Google X-Ray Search
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-[10px] gap-1"
                                    onClick={() =>
                                      copyToClipboard(m.cardData.googleXrayQuery, `xray-${m.id}`)
                                    }
                                  >
                                    {copiedKey === `xray-${m.id}` ? (
                                      <Check className="h-3 w-3 text-emerald-500" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                    Copy
                                  </Button>
                                </div>
                                <code className="block rounded-lg bg-muted/60 p-2 font-mono text-[10px] text-foreground leading-relaxed break-words">
                                  {m.cardData.googleXrayQuery}
                                </code>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 5. SKILL GAP CARD */}
                        {m.cardType === "skillgap" && m.cardData && (
                          <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-sm backdrop-blur-xl mt-2">
                            <div className="border-b border-border pb-2.5">
                              <h4 className="font-semibold text-xs text-foreground">
                                Skill Comparison: {m.cardData.candidateName} vs {m.cardData.jobTitle}
                              </h4>
                            </div>

                            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 text-xs">
                              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-1.5">
                                <span className="font-semibold text-emerald-500 flex items-center gap-1 text-[11px]">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Matched Skills
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {m.cardData.matched.map((s: string) => (
                                    <Badge key={s} className="bg-emerald-500/20 text-emerald-400 text-[10px] py-0">
                                      {s}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 space-y-1.5">
                                <span className="font-semibold text-amber-500 flex items-center gap-1 text-[11px]">
                                  <XCircle className="h-3.5 w-3.5" /> Desirable Gaps
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {m.cardData.missing.map((s: string) => (
                                    <Badge key={s} variant="outline" className="text-amber-500 border-amber-500/30 text-[10px] py-0">
                                      {s}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3 space-y-1.5">
                                <span className="font-semibold text-indigo-400 flex items-center gap-1 text-[11px]">
                                  <Sparkles className="h-3.5 w-3.5" /> Bonus Skills
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {m.cardData.bonus.map((s: string) => (
                                    <Badge key={s} className="bg-indigo-500/20 text-indigo-300 text-[10px] py-0">
                                      {s}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 6. EMAIL OUTREACH CARD */}
                        {m.cardType === "email" && m.cardData && (
                          <div className="rounded-2xl border border-border bg-card p-4 space-y-3 shadow-sm backdrop-blur-xl mt-2">
                            <div className="flex items-center justify-between border-b border-border pb-2.5">
                              <div>
                                <h4 className="font-semibold text-xs text-foreground">
                                  Personalized Candidate Outreach Email
                                </h4>
                                <p className="text-[10px] text-muted-foreground">
                                  To: {m.cardData.candidateEmail}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-[11px] gap-1"
                                onClick={() =>
                                  copyToClipboard(`Subject: ${m.cardData.subject}\n\n${m.cardData.body}`, `em-${m.id}`)
                                }
                              >
                                {copiedKey === `em-${m.id}` ? (
                                  <Check className="h-3 w-3 text-emerald-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                                Copy Email
                              </Button>
                            </div>

                            <div className="rounded-xl border border-border bg-background p-3 text-xs space-y-2 leading-relaxed">
                              <div className="font-semibold text-foreground">
                                Subject: {m.cardData.subject}
                              </div>
                              <div className="whitespace-pre-wrap text-muted-foreground">
                                {m.cardData.body}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Message Action Toolbar */}
                        <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-foreground">
                          <button
                            onClick={() => copyToClipboard(m.content, `msg-${m.id}`)}
                            className="flex items-center gap-1 hover:text-foreground transition-colors"
                          >
                            {copiedKey === `msg-${m.id}` ? (
                              <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            <span>Copy</span>
                          </button>

                          <span className="text-border">|</span>

                          <button
                            onClick={() => handleFeedback(m.id, "up")}
                            className={`hover:text-foreground transition-colors ${m.feedback === "up" ? "text-emerald-500" : ""}`}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </button>

                          <button
                            onClick={() => handleFeedback(m.id, "down")}
                            className={`hover:text-foreground transition-colors ${m.feedback === "down" ? "text-rose-500" : ""}`}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User Avatar */}
                  {!isAssistant && (
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary/20 text-primary font-bold text-xs mt-0.5">
                      HR
                    </div>
                  )}
                </div>
              );
            })}

            {/* Pulsing Generating Indicator */}
            {isGenerating && (
              <div className="flex gap-3.5 items-start">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-primary to-violet-500 text-white shadow-sm mt-0.5 animate-pulse">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="rounded-2xl border border-border bg-card/60 px-4 py-3 shadow-sm backdrop-blur-xl">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                    <span className="text-xs text-muted-foreground ml-2">Aurix Copilot is synthesizing...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            BOTTOM CHAT INPUT (ChatGPT Floating Bar)
        ────────────────────────────────────────────────────────────── */}
        <div className="p-3 md:p-4 bg-background/80 backdrop-blur-md border-t border-border shrink-0">
          <div className="max-w-3xl mx-auto space-y-2">
            {/* Quick Prompt Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <button
                onClick={() => handleSendMessage("Draft an offer letter for this candidate")}
                className="shrink-0 rounded-full border border-border bg-card px-3 py-1 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-accent/40 transition-colors"
              >
                Draft Offer
              </button>
              <button
                onClick={() => handleSendMessage("Rank all candidates for this requisition")}
                className="shrink-0 rounded-full border border-border bg-card px-3 py-1 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-accent/40 transition-colors"
              >
                Rank Candidates
              </button>
              <button
                onClick={() => handleSendMessage("Benchmark compensation bands for this role")}
                className="shrink-0 rounded-full border border-border bg-card px-3 py-1 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-accent/40 transition-colors"
              >
                Salary Band
              </button>
              <button
                onClick={() => handleSendMessage("Generate Boolean search query for sourcing")}
                className="shrink-0 rounded-full border border-border bg-card px-3 py-1 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-accent/40 transition-colors"
              >
                Boolean Search
              </button>
              <button
                onClick={() => handleSendMessage("Analyze skill gaps for this candidate")}
                className="shrink-0 rounded-full border border-border bg-card px-3 py-1 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground hover:bg-accent/40 transition-colors"
              >
                Skill Gaps
              </button>
            </div>

            {/* Input Container */}
            <div className="relative rounded-2xl border border-border bg-card shadow-lg transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask Copilot about ${activeCandidate?.name || "candidates"}, draft offer letters, rank applicants...`}
                rows={2}
                className="w-full resize-none border-0 bg-transparent px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 max-h-36 min-h-[52px]"
              />

              <div className="flex items-center justify-between px-3 pb-2.5 pt-1 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[9px] py-0 text-muted-foreground">
                    Shift + Enter for new line
                  </Badge>
                  <span className="hidden sm:inline text-[10px]">
                    Focus: <span className="font-semibold text-foreground">{activeJob?.title}</span>
                  </span>
                </div>

                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isGenerating}
                  size="icon"
                  className="h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-sm transition-transform active:scale-95 disabled:opacity-40"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="text-center text-[10px] text-muted-foreground">
              Aurix AI Recruiter Copilot leverages live requisition and candidate ATS records. Verify offer terms before dispatch.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

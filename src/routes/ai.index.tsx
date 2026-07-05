import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Brain, Users, Briefcase, Clock, FileText, Gauge, Banknote, Target,
  HeartPulse, BookOpen, FilePlus2, Video, ShieldCheck, MessageSquare,
  LineChart as LineChartIcon, Sparkles, ArrowRight, Star, Play,
  Cpu, Activity, Sliders, Database, Save, RefreshCw, AlertTriangle, Plus, Search,
  ShieldAlert, Award, FileSignature, Zap, Trash, FileEdit, CheckCircle2,
  ListTodo, Clock3, Sparkle, Info, Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,
  Area, AreaChart
} from "recharts";

// ----------------------------------------------------
// ROUTE DEFINITION
// ----------------------------------------------------
export const Route = createFileRoute("/ai/")({
  head: () => ({
    meta: [
      { title: "Enterprise AI Workspace — Aurix" },
      { name: "description", content: "Upgraded enterprise-grade AI hub operating system for human resource workflows." },
    ],
  }),
  component: AIHubDashboard,
});

// ----------------------------------------------------
// TYPES & DATA STRUCTURES
// ----------------------------------------------------
type LLMProvider = "openai" | "anthropic" | "gemini" | "ollama" | "azure";

interface AITool {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: any;
  to?: string;
  defaultPrompt?: string;
  simulatePlaceholder?: string;
}

interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: "idle" | "running" | "offline";
  model: string;
  responseTime: string;
  lastActivity: string;
  logs: string[];
}

interface WorkflowRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  active: boolean;
}

interface ActivityLog {
  id: string;
  tool: string;
  user: string;
  department: string;
  requestTime: string;
  duration: string;
  status: "success" | "warning" | "error";
  modelUsed: string;
  tokensUsed: number;
}

// ----------------------------------------------------
// INITIAL SEED DATA
// ----------------------------------------------------
const AI_CATEGORIES = [
  { id: "recruitment", label: "Recruitment AI", icon: Briefcase },
  { id: "employee", label: "Employee AI", icon: Users },
  { id: "workforce", label: "Workforce AI", icon: Target },
  { id: "performance", label: "Performance AI", icon: Gauge },
  { id: "payroll", label: "Payroll AI", icon: Banknote },
  { id: "compliance", label: "Compliance AI", icon: ShieldCheck },
  { id: "document", label: "Document AI", icon: FilePlus2 },
  { id: "meeting", label: "Meeting Intelligence", icon: Video },
  { id: "analytics", label: "Analytics AI", icon: LineChartIcon },
  { id: "knowledge", label: "Knowledge AI (RAG)", icon: BookOpen },
];

const AI_TOOLS: AITool[] = [
  // Recruitment AI
  { id: "rec-screen", category: "recruitment", name: "AI Resume Screening", description: "Automated batch ranking of candidate profiles.", icon: Briefcase, defaultPrompt: "Assess compliance scoring of 5 senior engineer resumes.", simulatePlaceholder: "Paste resume markdown..." },
  { id: "rec-rank", category: "recruitment", name: "AI Candidate Ranking", description: "Skill gap matching analytics.", icon: Award },
  { id: "rec-parser", category: "recruitment", name: "AI Resume Parser", description: "Converts PDF resumes into JSON profiles.", icon: FileText },
  { id: "rec-jd", category: "recruitment", name: "AI Job Description Generator", description: "Creates inclusive, brand-aligned job descriptions.", icon: FileEdit, defaultPrompt: "Write a Job Description for Senior React Developer in Bengaluru.", simulatePlaceholder: "Job title and requirements..." },
  { id: "rec-questions", category: "recruitment", name: "AI Interview Question Generator", description: "Custom behavioral & technical interview questions.", icon: MessageSquare },
  { id: "rec-copilot", category: "recruitment", name: "AI Interview Copilot", description: "Live question prompts and answers logger.", icon: Brain },
  { id: "rec-match", category: "recruitment", name: "AI Candidate Match Score", description: "Calculates match percentage against dynamic JDs.", icon: Target },
  { id: "rec-offer", category: "recruitment", name: "AI Offer Letter Generator", description: "Creates custom tailored salary and perk offers.", icon: FilePlus2 },
  { id: "rec-summary", category: "recruitment", name: "AI Candidate Summary", description: "Outputs highlights and areas of concern.", icon: Info },
  { id: "rec-skill", category: "recruitment", name: "AI Skill Gap Analysis", description: "Analyzes skills tests against requirements.", icon: Target },

  // Employee AI
  { id: "emp-hr-chat", category: "employee", name: "AI HR Chat Assistant", description: "Answers employees' HR policy queries in real-time.", icon: MessageSquare, defaultPrompt: "What is the maternity leave policy for India branches?", simulatePlaceholder: "Ask policy question..." },
  { id: "emp-assistant", category: "employee", name: "AI Employee Assistant", description: "Productivity bot for task tracking and calendar scheduling.", icon: Users },
  { id: "emp-career", category: "employee", name: "AI Career Advisor", description: "Career growth pathing matching capabilities.", icon: Award },
  { id: "emp-learning", category: "employee", name: "AI Learning Recommendations", description: "Suggests courses from Udemy/Coursera.", icon: BookOpen },
  { id: "emp-promotion", category: "employee", name: "AI Promotion Suggestions", description: "Identifies employees ready for grade increases.", icon: Zap },
  { id: "emp-sentiment", category: "employee", name: "AI Employee Sentiment Analysis", description: "Processes Slack logs/feedback for sentiment scores.", icon: HeartPulse },
  { id: "emp-summary", category: "employee", name: "AI Employee Summary", description: "Generates performance & history brief dashboards.", icon: Info },
  { id: "emp-profile", category: "employee", name: "AI Employee Profile Generator", description: "Autofills profile files from resumes.", icon: Users },

  // Workforce AI
  { id: "wf-planning", category: "workforce", name: "Workforce Planning", description: "Identifies staffing models & team allocations.", icon: Target },
  { id: "wf-headcount", category: "workforce", name: "Headcount Forecast", description: "Predictive headcount targets by department.", icon: LineChartIcon },
  { id: "wf-shift", category: "workforce", name: "Shift Optimization", description: "Schedules shifts based on load forecasts.", icon: Clock },
  { id: "wf-anomaly", category: "workforce", name: "Attendance Anomaly Detection", description: "Flags unusual clock-in and absence streaks.", icon: ShieldAlert },
  { id: "wf-leave", category: "workforce", name: "Leave Pattern Analysis", description: "Predicts leave requests using historical trends.", icon: Calendar },
  { id: "wf-overtime", category: "workforce", name: "Overtime Analysis", description: "Tracks burnout risks from overtime tracking.", icon: Clock },
  { id: "wf-productivity", category: "workforce", name: "Productivity Insights", description: "Compares engineering sprint releases to HR files.", icon: Zap },
  { id: "wf-cost", category: "workforce", name: "Workforce Cost Prediction", description: "Forecasts budget costs.", icon: Banknote },

  // Performance AI
  { id: "perf-coach", category: "performance", name: "AI Performance Coach", description: "Provides personalized advice for managers.", icon: Gauge },
  { id: "perf-kpi", category: "performance", name: "AI KPI Generator", description: "Creates SMART metrics based on designations.", icon: Target },
  { id: "perf-okr", category: "performance", name: "AI OKR Generator", description: "Drafts alignment plans for engineering targets.", icon: Target },
  { id: "perf-review", category: "performance", name: "AI Review Writer", description: "Helps structure annual appraisal feedback drafts.", icon: FileEdit },
  { id: "perf-360", category: "performance", name: "AI 360 Feedback Analyzer", description: "Extracts key insights from peer review logs.", icon: Brain },
  { id: "perf-high", category: "performance", name: "AI High Performer Detection", description: "Flags top 5% talent based on OKR rates.", icon: Award },
  { id: "perf-promo-rec", category: "performance", name: "AI Promotion Recommendation", description: "Evaluates candidates against senior criteria.", icon: Zap },

  // Payroll AI
  { id: "pay-insights", category: "payroll", name: "Payroll Insights", description: "Flags payment variations month over month.", icon: Banknote },
  { id: "pay-bench", category: "payroll", name: "Salary Benchmarking", description: "Matches payroll values to local market rates.", icon: LineChartIcon },
  { id: "pay-error", category: "payroll", name: "Payroll Error Detection", description: "Pre-audit verification scanner for taxes & deductions.", icon: ShieldAlert },
  { id: "pay-forecast", category: "payroll", name: "Payroll Forecast", description: "Predicts salary totals for upcoming quarters.", icon: Banknote },
  { id: "pay-comp", category: "payroll", name: "Compensation Recommendation", description: "Suggests pay raise brackets to retain talent.", icon: Zap },

  // Compliance AI
  { id: "comp-monitor", category: "compliance", name: "Compliance Monitor", description: "Scans statutory declarations and audit gaps.", icon: ShieldCheck },
  { id: "comp-policy", category: "compliance", name: "HR Policy Assistant", description: "Audits contract drafts against current handbooks.", icon: BookOpen },
  { id: "comp-law", category: "compliance", name: "Labour Law Assistant", description: "Checks regulations across 5 states of operations.", icon: ShieldCheck },
  { id: "comp-doc", category: "compliance", name: "Document Compliance Checker", description: "Checks for valid BGV and passport signatures.", icon: FileText },
  { id: "comp-audit", category: "compliance", name: "Audit Assistant", description: "Logs compliance scores for internal SOC-2 checkups.", icon: ShieldCheck },
  { id: "comp-risk", category: "compliance", name: "Risk Detection", description: "Identifies compliance violation patterns.", icon: ShieldAlert },

  // Document AI
  { id: "doc-gen", category: "document", name: "Document Generator", description: "Custom letter wizard with smart placeholders.", icon: FilePlus2 },
  { id: "doc-offer", category: "document", name: "Offer Letter Generator", description: "Drafts official job offers.", icon: FileSignature },
  { id: "doc-appointment", category: "document", name: "Appointment Letter Generator", description: "Drafts joining contracts.", icon: FileSignature },
  { id: "doc-exp", category: "document", name: "Experience Letter Generator", description: "Drafts experience certifications.", icon: FileText },
  { id: "doc-relieving", category: "document", name: "Relieving Letter Generator", description: "Drafts offboarding approvals.", icon: FileText },
  { id: "doc-warning", category: "document", name: "Warning Letter Generator", description: "Drafts disciplinary warnings.", icon: ShieldAlert },
  { id: "doc-promo", category: "document", name: "Promotion Letter Generator", description: "Drafts title promotion updates.", icon: Zap },
  { id: "doc-policy-gen", category: "document", name: "HR Policy Generator", description: "Drafts handbook templates.", icon: BookOpen },
  { id: "doc-nda", category: "document", name: "NDA Generator", description: "Creates custom non-disclosure agreements.", icon: ShieldCheck },
  { id: "doc-contract", category: "document", name: "Contract Generator", description: "Drafts commercial terms.", icon: FileSignature },

  // Meeting Intelligence
  { id: "meet-summary", category: "meeting", name: "Meeting Summary", description: "Extracts bulleted meeting summaries from video calls.", icon: Video },
  { id: "meet-actions", category: "meeting", name: "Action Items", description: "Auto-assigns checklist steps to team members.", icon: ListTodo },
  { id: "meet-decisions", category: "meeting", name: "Decision Extraction", description: "Saves design decisions to the team knowledge base.", icon: Target },
  { id: "meet-transcript", category: "meeting", name: "Transcript Analyzer", description: "Sentiment analysis on live discussion transcripts.", icon: Brain },
  { id: "meet-followup", category: "meeting", name: "Meeting Follow-up Generator", description: "Emails summaries directly to participants.", icon: FileText },

  // Analytics AI
  { id: "an-exec", category: "analytics", name: "Executive Dashboard", description: "Provides summaries for board reviews.", icon: LineChartIcon },
  { id: "an-attrition", category: "analytics", name: "Attrition Prediction", description: "Highlights employees with high departure risk indices.", icon: LineChartIcon },
  { id: "an-div", category: "analytics", name: "Diversity Analytics", description: "Monitors diversity metrics.", icon: Users },
  { id: "an-hiring", category: "analytics", name: "Hiring Analytics", description: "Visualizes hiring pipeline funnels.", icon: Briefcase },
  { id: "an-lifecycle", category: "analytics", name: "Employee Lifecycle Analytics", description: "Tracks lifecycle progression stats.", icon: Target },
  { id: "an-health", category: "analytics", name: "Organization Health Score", description: "Aggregates performance, turnover, and engagement metrics.", icon: HeartPulse },
  { id: "an-insights", category: "analytics", name: "AI Insights Center", description: "Generates custom data summaries.", icon: Brain },

  // Knowledge AI
  { id: "rag-kb", category: "knowledge", name: "AI Knowledge Base (RAG)", description: "Semantic search across shared drive files.", icon: BookOpen },
  { id: "rag-policy", category: "knowledge", name: "Company Policy Q&A", description: "Finds answers from the compliance handbook.", icon: BookOpen },
  { id: "rag-handbook", category: "knowledge", name: "Employee Handbook Assistant", description: "Resolves employee questions.", icon: MessageSquare },
  { id: "rag-sop", category: "knowledge", name: "HR SOP Assistant", description: "Guides operations step by step.", icon: FileText },
  { id: "rag-search", category: "knowledge", name: "Smart Enterprise Search", description: "Google-like query answers from internal files.", icon: Search },
];

const INITIAL_AGENTS: AIAgent[] = [];

const INITIAL_WORKFLOWS: WorkflowRule[] = [];

const INITIAL_LOGS: ActivityLog[] = [];

const INITIAL_MARKETPLACE: any[] = [];

// ----------------------------------------------------
// MAIN DASHBOARD WORKSPACE COMPONENT
// ----------------------------------------------------
function AIHubDashboard() {
  // Global Workspace State
  const [favorites, setFavorites] = useState<string[]>(["rec-screen", "emp-hr-chat", "rag-policy"]);
  const [recentTools, setRecentTools] = useState<string[]>(["rec-screen", "emp-hr-chat", "comp-monitor", "pay-bench"]);
  const [workflows, setWorkflows] = useState<WorkflowRule[]>(INITIAL_WORKFLOWS);
  const [agents, setAgents] = useState<AIAgent[]>(INITIAL_AGENTS);
  const [marketplace, setMarketplace] = useState(INITIAL_MARKETPLACE);
  const [auditLogs, setAuditLogs] = useState<ActivityLog[]>(INITIAL_LOGS);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // LLM Settings State
  const [provider, setProvider] = useState<LLMProvider>("anthropic");
  const [apiKey, setApiKey] = useState("••••••••••••••••••••••••••••");
  const [modelName, setModelName] = useState("claude-3-5-sonnet");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [sysPrompt, setSysPrompt] = useState("You are Antigravity, the enterprise HR assistant at Aurix HR.");
  const [vectorDb, setVectorDb] = useState("pinecone");
  const [embedModel, setEmbedModel] = useState("text-embedding-3-small");

  // Dynamic Workspace Simulation Dialog
  const [activeTool, setActiveTool] = useState<AITool | null>(null);
  const [simInput, setSimInput] = useState("");
  const [simLoading, setSimLoading] = useState(false);
  const [simResponse, setSimResponse] = useState<string | null>(null);

  // Custom workflow creator
  const [newWfOpen, setNewWfOpen] = useState(false);
  const [newWfName, setNewWfName] = useState("");
  const [newWfTrigger, setNewWfTrigger] = useState("New employee onboarding checklist");
  const [newWfAction, setNewWfAction] = useState("Auto generate Relieving Letter");

  // Toggle favorite
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(x => x !== id));
      toast.info("Removed from favorites");
    } else {
      setFavorites([...favorites, id]);
      toast.success("Added to favorites");
    }
  };

  // Run AI Simulation
  const handleRunSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simInput.trim()) return;

    setSimLoading(true);
    setSimResponse(null);

    // Simulate AI inference delays
    setTimeout(() => {
      setSimLoading(false);
      let answer = "";
      if (activeTool?.id === "rec-screen") {
        answer = `AURIX AI RESUME SCREENER — RESULTS:
1. Karan Singh (Score: 92/100) — Match matches SDE-2 backend requirements. Strong Node.js & Go capabilities.
2. Priya Mehta (Score: 88/100) — Excellent design portfolio, fits UI designer roles.
3. Aarav Sharma (Score: 65/100) — Missing cloud scaling references.

Recommendation: Advance Karan Singh directly to technical rounds.`;
      } else if (activeTool?.id === "rec-jd") {
        answer = `JOB DESCRIPTION: Senior React Developer
Department: Engineering | Location: Bengaluru / Remote

Responsibilities:
• Develop state-of-the-art UI architectures using React, TanStack, and Tailwind.
• Partner with backend engineering teams to configure API endpoints.
• Improve performance benchmarks of core product modules.

Requirements:
• 5+ years building production applications.
• Strong TypeScript, Next.js, and CSS fundamentals.`;
      } else if (activeTool?.id === "emp-hr-chat") {
        answer = `AURIX POLICY HELPER:
For India offices, employees are entitled to 26 weeks (182 days) of fully paid maternity leave.
This applies to employees who have worked at least 80 days in the 12 months preceding the delivery date.

Please coordinate with HR BP Priya Nair to log this under your benefits tracker.`;
      } else {
        answer = `AURIX ENTERPRISE AI COMPILER:
Task successfully processed using ${modelName}.
Tokens consumed: 1,450.
Duration: 1.8 seconds.
Inference Result: Validated parameters match compliance profiles. Checklist completed.`;
      }

      setSimResponse(answer);

      // Append to audit logs
      const newLog: ActivityLog = {
        id: `l-${Math.floor(100 + Math.random() * 900)}`,
        tool: activeTool?.name || "AI Tool",
        user: "HR Administrator",
        department: "Operations",
        requestTime: new Date().toISOString().replace("T", " ").slice(0, 16),
        duration: "1.8s",
        status: "success",
        modelUsed: modelName,
        tokensUsed: 1450
      };
      setAuditLogs([newLog, ...auditLogs]);

      // Add to recently used
      if (activeTool) {
        setRecentTools(prev => [activeTool.id, ...prev.filter(x => x !== activeTool.id)].slice(0, 5));
      }
    }, 1500);
  };

  // Run Agent Simulation
  const handleRunAgent = (id: string) => {
    setAgents(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: "running" as const,
          lastActivity: "Just now",
          logs: ["User triggered manual run.", "Evaluating rules.", ...a.logs]
        };
      }
      return a;
    }));

    toast.loading("Invoking AI Agent workspace...", { duration: 1000 });

    setTimeout(() => {
      setAgents(prev => prev.map(a => {
        if (a.id === id) {
          return {
            ...a,
            status: "idle" as const,
            logs: ["Work completed.", "Status returned to idle.", ...a.logs]
          };
        }
        return a;
      }));
      toast.success("AI Agent run completed successfully.");
    }, 2000);
  };

  // Category Filter Table
  const filteredTools = useMemo(() => {
    return AI_TOOLS.filter(tool => {
      const matchSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === "all" || tool.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory]);

  // Aggregate Category List
  const toolCountsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    AI_TOOLS.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-brand-foreground shadow-glow">
              <Brain className="h-5 w-5" />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">AI Workspace & Hub</h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground text-left">
            Configure LLMs, manage autonomous multi-agent systems, write workflow automations, and run specialized intelligence tools.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/15 border-none shadow-none text-xs font-bold gap-1 px-3 py-1">
            <Sparkle className="h-3 w-3 fill-indigo-500 animate-pulse" />
            V2.0 Active
          </Badge>
          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/15 border-none shadow-none text-xs font-bold gap-1 px-3 py-1">
            <CheckCircle2 className="h-3 w-3" />
            LLM Gateway Connected
          </Badge>
        </div>
      </div>

      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {[
          { label: "AI Usage Today", value: "84.2k tokens", icon: Cpu, accent: "text-blue-500" },
          { label: "Total AI Requests", value: "1,249", icon: Activity, accent: "text-indigo-500" },
          { label: "Active AI Agents", value: "11 Agents", icon: Sparkles, accent: "text-fuchsia-500" },
          { label: "Docs Generated", value: "482 Letters", icon: FileText, accent: "text-amber-500" },
          { label: "AI Time Saved", value: "340 Hours", icon: Clock3, accent: "text-emerald-500" },
          { label: "AI Health Score", value: "99.8%", icon: ShieldCheck, accent: "text-teal-500" },
          { label: "Settings Provider", value: "Claude 3.5", icon: Sliders, accent: "text-purple-500" },
          { label: "Vector Database", value: "Pinecone", icon: Database, accent: "text-rose-500" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border-border bg-card/40 backdrop-blur-xl">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none truncate max-w-[80px]" title={stat.label}>
                    {stat.label}
                  </span>
                  <Icon className={`h-3.5 w-3.5 ${stat.accent}`} />
                </div>
                <div className="mt-2 text-sm font-bold truncate leading-none font-display text-left">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* MAIN LAYOUT TABS */}
      <Tabs defaultValue="dashboard" className="space-y-4">
        <div className="border-b border-border bg-card/40 p-1 rounded-xl w-fit flex overflow-x-auto scrollbar-none">
          <TabsList className="bg-transparent border-none">
            <TabsTrigger value="dashboard" className="text-xs h-8 px-4 font-semibold rounded-lg cursor-pointer">AI Dashboard</TabsTrigger>
            <TabsTrigger value="tools" className="text-xs h-8 px-4 font-semibold rounded-lg cursor-pointer">AI Tools Workspace</TabsTrigger>
            <TabsTrigger value="agents" className="text-xs h-8 px-4 font-semibold rounded-lg cursor-pointer">Autonomous Agents</TabsTrigger>
            <TabsTrigger value="automations" className="text-xs h-8 px-4 font-semibold rounded-lg cursor-pointer">Automation Center</TabsTrigger>
            <TabsTrigger value="logs" className="text-xs h-8 px-4 font-semibold rounded-lg cursor-pointer">Audit Logs</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs h-8 px-4 font-semibold rounded-lg cursor-pointer">Settings</TabsTrigger>
            <TabsTrigger value="marketplace" className="text-xs h-8 px-4 font-semibold rounded-lg cursor-pointer">Marketplace</TabsTrigger>
          </TabsList>
        </div>

        {/* 1. AI HUB DASHBOARD */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* LEFT AREA: Search, Favorites, Quick Actions */}
            <div className="space-y-6 lg:col-span-2">
              {/* Search & Favorites */}
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search AI sub-tools across categories (e.g. screening, parsing, law...)"
                      className="pl-9 h-10 border-border bg-card/60"
                    />
                  </div>
                  {searchQuery && (
                    <Button variant="ghost" onClick={() => setSearchQuery("")} className="h-10 text-xs border border-border bg-card/30">
                      Clear
                    </Button>
                  )}
                </div>

                {/* Favorites Grid */}
                <div>
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5 text-left">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    Pinned Favorite AI Tools
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {favorites.map(favId => {
                      const tool = AI_TOOLS.find(t => t.id === favId);
                      if (!tool) return null;
                      const Icon = tool.icon || Sparkles;
                      return (
                        <Card
                          key={favId}
                          onClick={() => {
                            setActiveTool(tool);
                            setSimInput(tool.defaultPrompt || "");
                            setSimResponse(null);
                          }}
                          className="border-border bg-card/60 hover:bg-accent/40 cursor-pointer transition-all hover:-translate-y-0.5 group text-left"
                        >
                          <CardContent className="p-3 flex items-start gap-3">
                            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500/10 text-indigo-500">
                              <Icon className="h-4 w-4" />
                            </span>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-foreground truncate">{tool.name}</h4>
                              <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{tool.description}</p>
                            </div>
                            <button
                              onClick={e => toggleFavorite(tool.id, e)}
                              className="text-amber-500 hover:text-muted-foreground cursor-pointer"
                            >
                              <Star className="h-3.5 w-3.5 fill-current" />
                            </button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RECENTLY USED */}
              <div>
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5 flex items-center gap-1.5 text-left">
                  <Clock className="h-3.5 w-3.5 text-indigo-500" />
                  Recently Used tools
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {recentTools.map(recId => {
                    const tool = AI_TOOLS.find(t => t.id === recId);
                    if (!tool) return null;
                    const Icon = tool.icon || Sparkles;
                    return (
                      <Card
                        key={recId}
                        onClick={() => {
                          setActiveTool(tool);
                          setSimInput(tool.defaultPrompt || "");
                          setSimResponse(null);
                        }}
                        className="border-border bg-card/60 hover:bg-accent/40 cursor-pointer transition-all group text-left"
                      >
                        <CardContent className="p-3.5 flex items-center gap-3">
                          <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <div className="flex-1">
                            <h4 className="text-xs font-bold text-foreground">{tool.name}</h4>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Token consumption trends */}
              <Card className="border-border bg-card/40 backdrop-blur-xl text-left">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold">AI Token Allocation Trends</CardTitle>
                  <CardDescription className="text-xs">Aggregate token volume consumed over the past hours</CardDescription>
                </CardHeader>
                <CardContent className="h-[200px] p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { hour: "09:00", tokens: 12000 },
                        { hour: "10:00", tokens: 35000 },
                        { hour: "11:00", tokens: 48000 },
                        { hour: "12:00", tokens: 28000 },
                        { hour: "13:00", tokens: 19000 },
                        { hour: "14:00", tokens: 84200 },
                      ]}
                    >
                      <defs>
                        <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.05} />
                      <XAxis dataKey="hour" style={{ fontSize: 9 }} />
                      <YAxis style={{ fontSize: 9 }} />
                      <Tooltip contentStyle={{ fontSize: 10 }} />
                      <Area type="monotone" dataKey="tokens" stroke="#6366f1" fillOpacity={1} fill="url(#colorTokens)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT AREA: AI Agents Overview & Health */}
            <div className="space-y-6 lg:col-span-1 text-left">
              <Card className="border-border bg-card/40 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-indigo-400">
                    <Zap className="h-4 w-4" />
                    AI Agent Status Tracker
                  </CardTitle>
                  <CardDescription className="text-xs">Quick review of running worker bots</CardDescription>
                </CardHeader>
                <CardContent className="p-0 overflow-hidden">
                  <Table className="text-xs border-collapse">
                    <TableBody>
                      {agents.slice(0, 6).map(agent => (
                        <TableRow key={agent.id} className="border-t border-border/60 hover:bg-accent/20">
                          <TableCell className="px-4 py-2.5 font-bold">
                            {agent.name}
                          </TableCell>
                          <TableCell className="px-4 py-2.5 text-muted-foreground text-[10px]">
                            {agent.model}
                          </TableCell>
                          <TableCell className="px-4 py-2.5 text-right">
                            {agent.status === "running" ? (
                              <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] font-bold animate-pulse">Running</Badge>
                            ) : (
                              <Badge className="bg-muted text-muted-foreground border-none text-[9px] font-bold">Idle</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="pt-2 pb-3 flex justify-center border-t border-border/40">
                  <p className="text-[10px] text-muted-foreground">All agents responsive under SLA guidelines.</p>
                </CardFooter>
              </Card>

              {/* AI Notifications Alerts */}
              <Card className="border-border bg-card/40 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <ShieldAlert className="h-4 w-4 text-rose-500" />
                    AI System Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-[11px]">
                  <div className="flex gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-2.5 rounded-lg">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Claude API Key Warning</p>
                      <p className="mt-0.5 text-[10px]">Token limits approaching 85% of monthly sandbox tier.</p>
                    </div>
                  </div>
                  <div className="flex gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 p-2.5 rounded-lg">
                    <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Model Optimization</p>
                      <p className="mt-0.5 text-[10px]">Switched HR Copilot agent to Claude-3-5-sonnet for faster parsing.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* 2. AI TOOLS WORKSPACE CATALOG */}
        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {/* Category Select sidebar */}
            <div className="space-y-3 lg:col-span-1 text-left">
              <Card className="border-border bg-card/40 backdrop-blur-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xs font-bold uppercase text-muted-foreground tracking-wider">AI Domains</CardTitle>
                </CardHeader>
                <CardContent className="p-1 space-y-0.5">
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                      selectedCategory === "all" ? "bg-foreground text-background" : "hover:bg-accent/40 text-foreground"
                    }`}
                  >
                    <span>All tools</span>
                    <Badge variant="secondary" className="text-[10px]">{AI_TOOLS.length}</Badge>
                  </button>
                  {AI_CATEGORIES.map(cat => {
                    const count = toolCountsByCategory[cat.id] || 0;
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-colors ${
                          selectedCategory === cat.id ? "bg-foreground text-background" : "hover:bg-accent/40 text-foreground"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="flex-1 truncate">{cat.label}</span>
                        <Badge variant="secondary" className="text-[10px] border-none">{count}</Badge>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Tools list */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search sub-tools in this domain..."
                    className="pl-9 h-9 border-border bg-card/60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {filteredTools.map(tool => {
                  const Icon = tool.icon || Sparkles;
                  const isFav = favorites.includes(tool.id);
                  return (
                    <Card
                      key={tool.id}
                      onClick={() => {
                        setActiveTool(tool);
                        setSimInput(tool.defaultPrompt || "");
                        setSimResponse(null);
                      }}
                      className="border-border bg-card/40 hover:bg-accent/20 cursor-pointer transition-all flex flex-col justify-between text-left"
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500/10 text-indigo-500">
                            <Icon className="h-4.5 w-4.5" />
                          </span>
                          <button
                            onClick={e => toggleFavorite(tool.id, e)}
                            className="text-muted-foreground hover:text-amber-500 cursor-pointer"
                          >
                            <Star className={`h-4 w-4 ${isFav ? 'text-amber-500 fill-amber-500' : ''}`} />
                          </button>
                        </div>
                        <CardTitle className="text-sm font-bold mt-3.5 leading-none">{tool.name}</CardTitle>
                        <CardDescription className="text-xs mt-1.5 leading-relaxed line-clamp-2">{tool.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="p-4 pt-2 border-t border-border/40 bg-muted/5">
                        <Button size="sm" variant="ghost" className="w-full text-xs justify-between group-hover:bg-accent cursor-pointer">
                          Open tool sandbox <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* 3. AUTONOMOUS AGENTS */}
        <TabsContent value="agents" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {agents.map(agent => (
              <Card key={agent.id} className="border-border bg-card/40 backdrop-blur-xl flex flex-col justify-between">
                <CardHeader className="pb-3 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                        <Cpu className="h-4 w-4 text-indigo-500" />
                        {agent.name}
                      </CardTitle>
                      <CardDescription className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">{agent.role}</CardDescription>
                    </div>
                    {agent.status === "running" ? (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[9px] font-bold animate-pulse">Active</Badge>
                    ) : (
                      <Badge className="bg-muted text-muted-foreground border-none text-[9px] font-bold">Idle</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3.5 text-xs text-left">
                  <div className="grid grid-cols-2 gap-2 bg-muted/20 p-2.5 rounded-lg border border-border/40">
                    <div>
                      <span className="text-muted-foreground block text-[9px]">Model Target</span>
                      <strong className="text-foreground block">{agent.model}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[9px]">SLA Response</span>
                      <strong className="text-foreground block">{agent.responseTime}</strong>
                    </div>
                  </div>

                  {/* Logs area */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">Agent Logs</span>
                    <div className="rounded-lg bg-black/30 border border-border p-2 font-mono text-[9px] text-slate-300 h-24 overflow-y-auto">
                      {agent.logs.map((log, lIdx) => (
                        <div key={lIdx} className="leading-relaxed">&gt; {log}</div>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 pb-3 border-t border-border/40 flex justify-between gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      toast.info(`Opened configuration sheet for: ${agent.name}`);
                    }}
                    className="h-8 text-xs border-border flex-1 bg-transparent cursor-pointer"
                  >
                    Configure
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleRunAgent(agent.id)}
                    className="h-8 text-xs bg-indigo-600 hover:bg-indigo-750 text-white flex-1 cursor-pointer gap-1"
                  >
                    <Play className="h-3 w-3" /> Run Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 4. WORKFLOW AUTOMATIONS */}
        <TabsContent value="automations" className="space-y-6">
          <div className="flex justify-between items-center text-left">
            <div>
              <h2 className="font-display text-base font-bold">Automation Center Rules</h2>
              <p className="text-xs text-muted-foreground">Trigger autonomous workflows based on HR lifecycle events.</p>
            </div>
            <Button onClick={() => setNewWfOpen(true)} className="h-9 gap-1.5 bg-gradient-brand text-brand-foreground cursor-pointer">
              <Plus className="h-4 w-4" /> Create Rule
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card/40 backdrop-blur-xl overflow-hidden text-left">
            <Table className="text-xs border-collapse">
              <TableHeader className="bg-muted/10 border-b border-border">
                <TableRow>
                  <TableHead className="px-4 py-3">Rule Name</TableHead>
                  <TableHead className="px-4 py-3">Event Trigger</TableHead>
                  <TableHead className="px-4 py-3">AI Action Pipeline</TableHead>
                  <TableHead className="px-4 py-3 text-center">Active Status</TableHead>
                  <TableHead className="px-4 py-3 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workflows.map(rule => (
                  <TableRow key={rule.id} className="border-t border-border hover:bg-accent/20">
                    <TableCell className="px-4 py-3.5 font-bold">
                      {rule.name}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-muted-foreground">
                      {rule.trigger}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-mono text-[11px] text-indigo-500">
                      {rule.action}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-center">
                      <Switch
                        checked={rule.active}
                        onCheckedChange={checked => {
                          setWorkflows(prev => prev.map(w => {
                            if (w.id === rule.id) return { ...w, active: checked };
                            return w;
                          }));
                          toast.success(`Workflow "${rule.name}" set to ${checked ? 'Active' : 'Inactive'}`);
                        }}
                      />
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setWorkflows(prev => prev.filter(w => w.id !== rule.id));
                          toast.error("Workflow rule deleted");
                        }}
                        className="h-7 w-7 text-muted-foreground hover:text-rose-500 cursor-pointer"
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* 5. AUDIT LOGS */}
        <TabsContent value="logs" className="space-y-4">
          <div className="rounded-xl border border-border bg-card/40 backdrop-blur-xl overflow-hidden text-left">
            <Table className="text-xs border-collapse">
              <TableHeader className="bg-muted/10 border-b border-border">
                <TableRow>
                  <TableHead className="px-4 py-3">AI Tool</TableHead>
                  <TableHead className="px-4 py-3">Operator</TableHead>
                  <TableHead className="px-4 py-3">Department</TableHead>
                  <TableHead className="px-4 py-3">Timestamp</TableHead>
                  <TableHead className="px-4 py-3">Duration</TableHead>
                  <TableHead className="px-4 py-3 text-center">Inference Model</TableHead>
                  <TableHead className="px-4 py-3 text-right">Tokens Used</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map(log => (
                  <TableRow key={log.id} className="border-t border-border hover:bg-accent/20">
                    <TableCell className="px-4 py-3.5 font-bold">
                      {log.tool}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-foreground/80">
                      {log.user}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-muted-foreground">
                      {log.department}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-muted-foreground">
                      {log.requestTime}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 font-mono text-[10px]">
                      {log.duration}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-center font-semibold text-indigo-500">
                      {log.modelUsed}
                    </TableCell>
                    <TableCell className="px-4 py-3.5 text-right font-mono font-bold text-foreground">
                      {log.tokensUsed.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* 6. LLM GATEWAY SETTINGS */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* LLM Key setup */}
            <Card className="border-border bg-card/40 backdrop-blur-xl md:col-span-2 text-left">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                  <Sliders className="h-4 w-4" />
                  Primary LLM Credentials
                </CardTitle>
                <CardDescription className="text-xs">Configure the default API provider for the workspace</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">LLM Provider</Label>
                    <Select value={provider} onValueChange={(val: any) => setProvider(val)}>
                      <SelectTrigger className="w-full bg-background border-border text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI (GPT-4o)</SelectItem>
                        <SelectItem value="anthropic">Anthropic (Claude 3.5)</SelectItem>
                        <SelectItem value="gemini">Google Gemini (Pro 1.5)</SelectItem>
                        <SelectItem value="ollama">Ollama (Llama-3 Local)</SelectItem>
                        <SelectItem value="azure">Azure OpenAI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">Model Target</Label>
                    <Input value={modelName} onChange={e => setModelName(e.target.value)} className="bg-background border-border text-xs h-9" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">API Credentials Key</Label>
                  <Input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} className="bg-background border-border text-xs h-9" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">Temperature ({temperature})</Label>
                    <input
                      type="range" min="0" max="1" step="0.1"
                      value={temperature} onChange={e => setTemperature(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-muted-foreground">Max Tokens Payout</Label>
                    <Input type="number" value={maxTokens} onChange={e => setMaxTokens(parseInt(e.target.value) || 4096)} className="bg-background border-border text-xs h-9" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">System Directive Prompt</Label>
                  <Textarea value={sysPrompt} onChange={e => setSysPrompt(e.target.value)} className="min-h-[80px] bg-background border-border text-xs" />
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t border-border/40 flex justify-end">
                <Button
                  onClick={() => {
                    toast.success("LLM Gateway configuration updated successfully.");
                  }}
                  className="h-9 bg-gradient-brand text-brand-foreground cursor-pointer gap-1.5"
                >
                  <Save className="h-4 w-4" /> Save Configuration
                </Button>
              </CardFooter>
            </Card>

            {/* RAG settings */}
            <Card className="border-border bg-card/40 backdrop-blur-xl text-left">
              <CardHeader>
                <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                  <Database className="h-4 w-4" />
                  Vector Database (RAG)
                </CardTitle>
                <CardDescription className="text-xs">Manage smart policy document index search databases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Vector DB Provider</Label>
                  <Select value={vectorDb} onValueChange={setVectorDb}>
                    <SelectTrigger className="w-full bg-background border-border text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pinecone">Pinecone Cloud</SelectItem>
                      <SelectItem value="qdrant">Qdrant Server</SelectItem>
                      <SelectItem value="milvus">Milvus DB</SelectItem>
                      <SelectItem value="chroma">Chroma DB (Local In-Memory)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">Embedding Model</Label>
                  <Select value={embedModel} onValueChange={setEmbedModel}>
                    <SelectTrigger className="w-full bg-background border-border text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text-embedding-3-small">text-embedding-3-small (OpenAI)</SelectItem>
                      <SelectItem value="text-embedding-3-large">text-embedding-3-large (OpenAI)</SelectItem>
                      <SelectItem value="bge-large-en-v1.5">BGE-Large-EN (HuggingFace)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/20 p-2.5 space-y-1.5 mt-2">
                  <strong className="text-indigo-400 block text-[10px] uppercase font-bold">RAG Document Source Files</strong>
                  <ul className="space-y-1 text-[10px] text-muted-foreground">
                    <li>&bull; India_Leave_Policy_2025.pdf (182 KB)</li>
                    <li>&bull; Employee_Handbook_v4.pdf (1.2 MB)</li>
                    <li>&bull; NDA_Template_Corporate_Global.docx (45 KB)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 7. MARKETPLACE */}
        <TabsContent value="marketplace" className="space-y-6">
          <div className="text-left">
            <h2 className="font-display text-base font-bold">AI Marketplace Addons</h2>
            <p className="text-xs text-muted-foreground">Install future HR or corporate AI modules with one click.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {marketplace.map(item => (
              <Card key={item.id} className="border-border bg-card/40 backdrop-blur-xl flex flex-col justify-between text-left">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-bold">{item.name}</CardTitle>
                    <Badge variant="secondary" className="text-[10px]">{item.cost}</Badge>
                  </div>
                  <CardDescription className="text-xs mt-1.5">{item.description}</CardDescription>
                </CardHeader>
                <CardFooter className="pt-2 pb-3 border-t border-border/40">
                  {item.installed ? (
                    <Button disabled className="w-full text-xs h-8 bg-muted text-muted-foreground cursor-not-allowed">
                      Module Installed
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setMarketplace(prev => prev.map(m => {
                          if (m.id === item.id) return { ...m, installed: true };
                          return m;
                        }));
                        toast.success(`${item.name} integrated successfully!`);
                      }}
                      className="w-full text-xs h-8 bg-indigo-600 hover:bg-indigo-750 text-white cursor-pointer"
                    >
                      Install Module
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* ----------------------------------------------------
          INTERACTIVE AI WORKSPACE DIALOG (Simulation Sandbox)
         ---------------------------------------------------- */}
      <Dialog open={!!activeTool} onOpenChange={open => !open && setActiveTool(null)}>
        <DialogContent className="sm:max-w-lg bg-background border-border shadow-2xl">
          <DialogHeader className="text-left">
            <DialogTitle className="font-display font-bold text-lg flex items-center gap-1.5">
              <Sparkles className="h-5 w-5 text-indigo-500 fill-indigo-500/10 animate-pulse" />
              {activeTool?.name} Sandbox
            </DialogTitle>
            <DialogDescription className="text-xs">
              {activeTool?.description}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleRunSimulation} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <Label className="text-xs font-semibold text-muted-foreground">AI Input Prompt Context</Label>
              <Textarea
                value={simInput}
                onChange={e => setSimInput(e.target.value)}
                placeholder={activeTool?.simulatePlaceholder || "State your prompt requirements..."}
                className="min-h-[100px] bg-background/50 border-border text-xs"
              />
            </div>

            {/* Inference Model review */}
            <div className="flex justify-between items-center text-[10px] text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-border">
              <span>Model Gate: <strong>{modelName}</strong></span>
              <span>Temp: <strong>{temperature}</strong></span>
              <span>Max Tokens: <strong>{maxTokens}</strong></span>
            </div>

            {/* Simulated Response */}
            {simLoading && (
              <div className="space-y-2.5 p-4 rounded-xl border border-border/80 bg-muted/20 animate-pulse">
                <div className="h-4 bg-muted rounded-full w-1/3" />
                <div className="h-3 bg-muted rounded-full w-full" />
                <div className="h-3 bg-muted rounded-full w-5/6" />
                <div className="h-3 bg-muted rounded-full w-4/5" />
              </div>
            )}

            {simResponse && (
              <div className="space-y-1.5 text-left">
                <Label className="text-xs font-semibold text-muted-foreground">Inference Output</Label>
                <div className="bg-black/35 rounded-xl border border-border p-4 text-slate-100 dark:text-slate-100 font-mono text-[10px] leading-relaxed whitespace-pre-wrap select-text max-h-[220px] overflow-y-auto">
                  {simResponse}
                </div>
              </div>
            )}

            <DialogFooter className="pt-2 border-t border-border/40">
              <Button type="button" variant="outline" onClick={() => setActiveTool(null)} className="h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer">
                Close Sandbox
              </Button>
              <Button type="submit" disabled={simLoading} className="h-9 bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer gap-1.5">
                {simLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Run Inference
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ----------------------------------------------------
          CREATE WORKFLOW RULE DIALOG
         ---------------------------------------------------- */}
      <Dialog open={newWfOpen} onOpenChange={setNewWfOpen}>
        <DialogContent className="sm:max-w-md bg-background border-border">
          <DialogHeader className="text-left">
            <DialogTitle className="font-display font-bold">Create Custom Workflow Rule</DialogTitle>
            <DialogDescription className="text-xs">Setup automated AI response chains on HR triggers.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-left">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Rule Name</Label>
              <Input
                value={newWfName}
                onChange={e => setNewWfName(e.target.value)}
                placeholder="e.g. Auto screen incoming applications"
                className="bg-background border-border text-xs h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">Event Trigger</Label>
              <Select value={newWfTrigger} onValueChange={setNewWfTrigger}>
                <SelectTrigger className="w-full bg-background border-border text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Candidate applies on careers site">Candidate applies on careers site</SelectItem>
                  <SelectItem value="New employee onboarding checklist">New employee onboarding checklist</SelectItem>
                  <SelectItem value="Exit request approved">Exit request approved</SelectItem>
                  <SelectItem value="Daily attendance logs compiled">Daily attendance logs compiled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">AI Action Pipeline</Label>
              <Select value={newWfAction} onValueChange={setNewWfAction}>
                <SelectTrigger className="w-full bg-background border-border text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Run AI Resume screening & match score assessment">Run AI Resume screening & match score assessment</SelectItem>
                  <SelectItem value="Auto generate Relieving Letter">Auto generate Relieving Letter</SelectItem>
                  <SelectItem value="Verify compliance and check signatures">Verify compliance and check signatures</SelectItem>
                  <SelectItem value="Flag late arrival patterns and alert manager">Flag late arrival patterns and alert manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-border/40">
            <Button variant="outline" onClick={() => setNewWfOpen(false)} className="h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer">
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!newWfName) {
                  toast.error("Please enter a rule name.");
                  return;
                }
                const newRule: WorkflowRule = {
                  id: `wf-${Date.now()}`,
                  name: newWfName,
                  trigger: newWfTrigger,
                  action: newWfAction,
                  active: true
                };
                setWorkflows([...workflows, newRule]);
                toast.success("Workflow rule created successfully.");
                setNewWfOpen(false);
                setNewWfName("");
              }}
              className="h-9 bg-indigo-600 hover:bg-indigo-750 text-white cursor-pointer"
            >
              Create Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

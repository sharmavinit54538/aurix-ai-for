import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Brain, Briefcase, Clock, FileText, Gauge, Banknote, Target,
  HeartPulse, BookOpen, FilePlus2, Video, ShieldCheck, MessageSquare,
  LineChart as LineChartIcon, Sparkles, RefreshCw, CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

export interface AIModuleDef {
  id: string;
  title: string;
  description: string;
  icon: any;
  to: string;
  color: string;
}

export const AI_MODULES_LIST: AIModuleDef[] = [
  {
    id: "workforce-insights",
    title: "Workforce Insights",
    description: "Analyze team composition, skill maps, and talent pipelines.",
    icon: Brain,
    to: "/ai/workforce-insights",
    color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "recruiter",
    title: "Recruiter",
    description: "Auto-screen resumes, match candidates to JDs, and generate behavioral questions.",
    icon: Briefcase,
    to: "/ai/recruiter",
    color: "from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30",
  },
  {
    id: "attendance-monitor",
    title: "Attendance Monitor",
    description: "Detect attendance anomalies, late punch trends, and schedule shifts.",
    icon: Clock,
    to: "/ai/attendance-monitor",
    color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "leave-assistant",
    title: "Leave Assistant",
    description: "Forecast leave requests, analyze patterns, and streamline approvals.",
    icon: FileText,
    to: "/ai/leave-assistant",
    color: "from-teal-500/20 to-emerald-500/20 text-teal-400 border-teal-500/30",
  },
  {
    id: "performance-coach",
    title: "Performance Coach",
    description: "Generate SMART goals, align department OKRs, and outline training recommendations.",
    icon: Gauge,
    to: "/ai/performance-coach",
    color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
  },
  {
    id: "payroll-insights",
    title: "Payroll Insights",
    description: "Benchmark salaries, detect variance anomalies, and run tax audits.",
    icon: Banknote,
    to: "/ai/payroll-insights",
    color: "from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "workforce-planning",
    title: "Workforce Planning",
    description: "Optimize headcount forecasts and forecast future workforce costs.",
    icon: Target,
    to: "/ai/workforce-planning",
    color: "from-red-500/20 to-orange-500/20 text-red-400 border-red-500/30",
  },
  {
    id: "employee-health",
    title: "Employee Health",
    description: "Monitor burnout risk indices, organization wellness score, and sentiment trends.",
    icon: HeartPulse,
    to: "/ai/employee-health",
    color: "from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30",
  },
  {
    id: "policy-assistant",
    title: "Policy Assistant",
    description: "Resolve compliance queries and audit handbook contracts against labor laws.",
    icon: BookOpen,
    to: "/ai/policy-assistant",
    color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30",
  },
  {
    id: "document-generator",
    title: "Document Generator",
    description: "Generate NDAs, offer letters, and contracts using smart placeholders.",
    icon: FilePlus2,
    to: "/ai/document-generator",
    color: "from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30",
  },
  {
    id: "meeting-intelligence",
    title: "Meeting Intelligence",
    description: "Extract key decisions, meeting action items, and live summaries.",
    icon: Video,
    to: "/ai/meeting-intelligence",
    color: "from-fuchsia-500/20 to-violet-500/20 text-fuchsia-400 border-fuchsia-500/30",
  },
  {
    id: "compliance-monitor",
    title: "Compliance Monitor",
    description: "Scan statutory compliance requirements and log SOC-2 checklist scores.",
    icon: ShieldCheck,
    to: "/ai/compliance-monitor",
    color: "from-green-500/20 to-teal-500/20 text-green-400 border-green-500/30",
  },
  {
    id: "chat-assistant",
    title: "Chat Assistant",
    description: "Conversational assistant for company policy and employee handbook Q&A.",
    icon: MessageSquare,
    to: "/ai/chat-assistant",
    color: "from-indigo-500/20 to-cyan-500/20 text-indigo-400 border-indigo-500/30",
  },
  {
    id: "analytics-center",
    title: "Analytics Center",
    description: "Run executive data summaries, attrition predictions, and diversity analytics.",
    icon: LineChartIcon,
    to: "/ai/analytics-center",
    color: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30",
  },
];

// ----------------------------------------------------
// MAIN DASHBOARD COMPONENT
// ----------------------------------------------------
function AIHubDashboard() {
  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-brand-foreground shadow-glow">
              <Brain className="h-5 w-5" />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">AI Hub</h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground text-left">
            Configure LLMs, manage autonomous multi-agent systems, write workflow automations, and run specialized intelligence tools.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("AI Hub data refreshed")}
            className="h-8 gap-1.5 cursor-pointer text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>

          <div className="flex flex-wrap gap-2">
            <Badge className="bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/15 border-none shadow-none text-xs font-bold gap-1 px-3 py-1">
              <Sparkles className="h-3 w-3 fill-indigo-500 animate-pulse" />
              V2.0 Active
            </Badge>
            <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/15 border-none shadow-none text-xs font-bold gap-1 px-3 py-1">
              <CheckCircle2 className="h-3 w-3" />
              LLM Gateway Connected
            </Badge>
          </div>
        </div>
      </div>

      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AI_MODULES_LIST.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.id}
                to={module.to as any}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/45 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-card/75 hover:shadow-lg hover:shadow-indigo-500/5 text-left cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${module.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-indigo-400">
                      {module.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-normal">
                      {module.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

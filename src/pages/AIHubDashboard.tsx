import React, { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Brain,
  Briefcase,
  Clock,
  FileText,
  Gauge,
  Banknote,
  Target,
  HeartPulse,
  BookOpen,
  FilePlus2,
  Video,
  ShieldCheck,
  MessageSquare,
  LineChart as LineChartIcon,
  Sparkles,
  RefreshCw,
  Play,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Info,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAIAgents, fetchAIHubOverview, runAIAgent } from "@/store/aiHub/aiHubThunk";
import {
  selectAIAgents,
  selectAIHubOperationLoading,
  selectAIHubOverview,
} from "@/store/aiHub/aiHubSelectors";
import type { AIAgent, AgentRunResponse } from "@/store/aiHub/aiHub.types";

export interface AIModuleDef {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
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
    description:
      "Generate SMART goals, align department OKRs, and outline training recommendations.",
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

export function AIHubDashboard() {
  const dispatch = useAppDispatch();
  const overviewState = useAppSelector(selectAIHubOverview);
  const agentsState = useAppSelector(selectAIAgents);
  const isAgentRunning = useAppSelector(selectAIHubOperationLoading("runAIAgent"));

  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [executionPrompt, setExecutionPrompt] = useState("");
  const [executionResult, setExecutionResult] = useState<AgentRunResponse | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchAIHubOverview());
    dispatch(fetchAIAgents());
  }, [dispatch]);

  const handleRefresh = () => {
    toast.info("Refreshing AI Hub intelligence...");
    dispatch(fetchAIHubOverview());
    dispatch(fetchAIAgents());
  };

  const handleOpenAgentRun = (module: AIModuleDef, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Look for matching agent from Redux list or build fallback agent def
    const matchingAgent = agentsState.data?.find(
      (a) => a.id === module.id || a.category?.toLowerCase() === module.id.toLowerCase(),
    ) ?? {
      id: module.id,
      name: module.title,
      category: "Intelligence",
      description: module.description,
      status: "idle",
    };

    setSelectedAgent(matchingAgent);
    setExecutionPrompt("");
    setExecutionResult(null);
    setIsSheetOpen(true);
  };

  const handleExecuteAgent = async () => {
    if (!selectedAgent) return;
    try {
      const res = await dispatch(
        runAIAgent({
          agentId: selectedAgent.id,
          payload: {
            prompt: executionPrompt.trim() || undefined,
            trigger: "manual_dashboard_action",
          },
        }),
      ).unwrap();

      setExecutionResult(res);
      toast.success(`${selectedAgent.name} completed successfully!`);
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Agent execution failed");
    }
  };

  const overview = overviewState.data;
  const isLoading = (overviewState.loading || agentsState.loading) && !overview;
  const hasError = overviewState.error || agentsState.error;

  return (
    <div className="space-y-6">
      {/* ── Top Header & Hero KPI Strip ───────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-xl shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="h-5 w-5 animate-pulse text-indigo-400" />
              </div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                OFC360 AI Hub
              </h1>
              <Badge
                variant="outline"
                className="border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs"
              >
                Autonomous Agents
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Production-ready enterprise agent orchestrator across HR, attendance, payroll,
              compliance, and talent.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={overviewState.loading || agentsState.loading}
              className="gap-2 border-border/80 hover:bg-accent/40"
            >
              <RefreshCw className={`h-4 w-4 ${overviewState.loading ? "animate-spin" : ""}`} />
              Sync Agents
            </Button>
          </div>
        </div>

        {/* ── Live KPI Metric Cards ───────────────────────────────── */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5 border-t border-border/60 pt-5">
          <div className="rounded-xl border border-border/60 bg-card/30 p-3.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total Agents</span>
              <Brain className="h-4 w-4 text-blue-400" />
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">
              {isLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                (overview?.totalAgents ?? AI_MODULES_LIST.length)
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">Registered modules</span>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/30 p-3.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Active Agents</span>
              <Zap className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">
              {isLoading ? (
                <Skeleton className="h-7 w-12" />
              ) : (
                (overview?.activeAgents ?? AI_MODULES_LIST.length)
              )}
            </div>
            <span className="text-[11px] text-emerald-500 font-medium">Ready to serve</span>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/30 p-3.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Tasks Executed</span>
              <Activity className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">
              {isLoading ? <Skeleton className="h-7 w-16" /> : (overview?.tasksCompleted ?? 0)}
            </div>
            <span className="text-[11px] text-muted-foreground">Automated runs</span>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/30 p-3.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Success Rate</span>
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="mt-2 text-xl font-bold text-foreground">
              {isLoading ? <Skeleton className="h-7 w-14" /> : `${overview?.successRate ?? 99.4}%`}
            </div>
            <span className="text-[11px] text-muted-foreground">Model confidence</span>
          </div>

          <div className="col-span-2 sm:col-span-4 lg:col-span-1 rounded-xl border border-border/60 bg-card/30 p-3.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>System Health</span>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-xl font-bold capitalize text-emerald-400">
              {isLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : (
                (overview?.systemHealth ?? "Healthy")
              )}
            </div>
            <span className="text-[11px] text-muted-foreground">All nodes online</span>
          </div>
        </div>
      </div>

      {/* ── Error Banner & Retry ─────────────────────────────────── */}
      {hasError && (
        <div className="flex items-center justify-between rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>
              {overviewState.error || agentsState.error || "Failed to load live agent statistics"}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="border-destructive/30 hover:bg-destructive/20 text-destructive"
          >
            Retry
          </Button>
        </div>
      )}

      {/* ── Loading Skeleton Grid ────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border/80 bg-card/45 p-5 space-y-4">
              <div className="flex items-start gap-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── Main AI Modules Grid ───────────────────────────────── */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AI_MODULES_LIST.map((module) => {
            const Icon = module.icon;
            const liveAgent = agentsState.data?.find(
              (a) => a.id === module.id || a.category?.toLowerCase() === module.id.toLowerCase(),
            );

            return (
              <div
                key={module.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/45 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-card/75 hover:shadow-lg hover:shadow-indigo-500/5 text-left"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${module.color}`}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-indigo-400">
                            {module.title}
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground leading-normal line-clamp-2">
                          {module.description}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className="shrink-0 text-[10px] uppercase font-semibold tracking-wider border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                    >
                      {liveAgent?.status ?? "Online"}
                    </Badge>
                  </div>
                </div>

                {/* ── Action Buttons Footer ────────────────────────────── */}
                <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-3 text-xs">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleOpenAgentRun(module, e)}
                    className="h-8 gap-1.5 px-2.5 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10"
                  >
                    <Play className="h-3.5 w-3.5 fill-indigo-400" />
                    Run Agent
                  </Button>

                  <Link
                    to={module.to as any}
                    className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground group-hover:translate-x-0.5"
                  >
                    Explore
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Agent Execution Sheet ─────────────────────────────────── */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg border-l border-border bg-card/95 backdrop-blur-xl flex flex-col h-full">
          <SheetHeader className="space-y-1 text-left border-b border-border/60 pb-4">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-indigo-500/40 bg-indigo-500/10 text-indigo-400 text-[10px]"
              >
                Autonomous Executor
              </Badge>
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]"
              >
                Ready
              </Badge>
            </div>
            <SheetTitle className="text-xl font-bold tracking-tight text-foreground">
              {selectedAgent?.name || "Agent Execution"}
            </SheetTitle>
            <SheetDescription className="text-xs text-muted-foreground">
              {selectedAgent?.description || "Execute intelligent operations through this agent."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto py-5 space-y-5">
            {/* Parameters & Prompt Form */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground flex items-center justify-between">
                <span>Task Instructions / Prompt (Optional)</span>
                <span className="text-[10px] text-muted-foreground">Natural language</span>
              </label>
              <Textarea
                rows={4}
                value={executionPrompt}
                onChange={(e) => setExecutionPrompt(e.target.value)}
                placeholder="e.g., Analyze latest workforce metrics or generate an OKR draft..."
                className="bg-background/60 border-border/80 text-sm focus-visible:ring-indigo-500 resize-none"
              />
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                This dispatches a typed async run request through Redux with auth session context.
              </p>
            </div>

            {/* Execution Result Area */}
            {executionResult && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Run Status: {executionResult.status || "Completed"}</span>
                  </div>
                  {executionResult.completedAt && (
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(executionResult.completedAt).toLocaleTimeString()}
                    </span>
                  )}
                </div>

                {executionResult.message && (
                  <p className="text-xs text-foreground font-medium">{executionResult.message}</p>
                )}

                {executionResult.output != null && (
                  <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-background/80 p-3 text-[11px] font-mono text-muted-foreground border border-border/60">
                    {typeof executionResult.output === "object"
                      ? JSON.stringify(executionResult.output, null, 2)
                      : String(executionResult.output)}
                  </pre>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-border/60 pt-4 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSheetOpen(false)}
              disabled={isAgentRunning}
            >
              Close
            </Button>
            <Button
              size="sm"
              onClick={handleExecuteAgent}
              disabled={isAgentRunning}
              className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2"
            >
              {isAgentRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" />
                  Run Now
                </>
              )}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default AIHubDashboard;

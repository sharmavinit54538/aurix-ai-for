import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BellRing,
  Bot,
  Brain,
  CheckCircle2,
  Clock,
  History,
  Inbox,
  Layers,
  LineChart,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  TrendingUp,
  UserCheck,
  Zap,
} from "lucide-react";
import { OneHRIcon } from "@/components/icons/OneHRIcon";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAutopilotOverview } from "../hooks/useAutopilotOverview";

export default function AutopilotOverviewDashboard() {
  const { overview, loading, error, backendUnavailable, refetch } = useAutopilotOverview();

  const autoResolved = overview?.autoResolvedPercentage ?? overview?.autoResolvedPercent;
  const exceptionsPending = overview?.exceptionsPending;
  const hoursSaved = overview?.hoursSaved;
  const overrideRate = overview?.overrideRatePercentage ?? overview?.overrideRate;

  const metrics = [
    autoResolved?.available
      ? {
          id: "auto-resolved",
          label: "Requests Auto-Resolved",
          value: `${autoResolved.value ?? 0}%`,
          description: autoResolved.description || "Resolved without human intervention",
          icon: Zap,
          color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
          change: autoResolved.changePercent,
        }
      : null,
    exceptionsPending?.available
      ? {
          id: "exceptions-pending",
          label: "Exceptions Pending Triage",
          value: `${exceptionsPending.value ?? 0}`,
          description: exceptionsPending.description || "Awaiting human review & decision",
          icon: AlertTriangle,
          color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
          change: exceptionsPending.changePercent,
        }
      : null,
    hoursSaved?.available
      ? {
          id: "hours-saved",
          label: "Hours Saved This Month",
          value: `${hoursSaved.value ?? 0} hrs`,
          description: hoursSaved.description || "Routine manual HR operations eliminated",
          icon: Clock,
          color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
          change: hoursSaved.changePercent,
        }
      : null,
    overrideRate?.available
      ? {
          id: "override-rate",
          label: "Human Override Rate",
          value: `${overrideRate.value ?? 0}%`,
          description: overrideRate.description || "Rate of human overrides on AI decisions",
          icon: RotateCcw,
          color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
          change: overrideRate.changePercent,
        }
      : null,
  ].filter(Boolean);

  const timeSeries = overview?.history12Months ?? overview?.timeSeries12Months ?? [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <OneHRIcon className="h-6 w-6" gradient />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">OneHR Command Center</h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            className="rounded-xl h-9 gap-1.5 text-xs cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button
            size="sm"
            asChild
            className="rounded-xl h-9 gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
          >
            <Link to="/dashboard/autopilot/exceptions">
              <Inbox className="h-3.5 w-3.5" />
              Exceptions Inbox
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Inline Error with Retry ──────────────────────────────────── */}
      {error && !backendUnavailable && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-sm font-semibold">Failed to load overview data</AlertTitle>
          <AlertDescription className="text-xs flex items-center justify-between mt-1">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              className="h-7 text-xs rounded-xl"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* ── Real Operational Metrics ─────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="rounded-2xl p-5 space-y-3">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-3 w-40 rounded-md" />
            </Card>
          ))}
        </div>
      ) : metrics.length === 0 && !backendUnavailable ? (
        <Card className="rounded-2xl border-dashed border-border/80 p-8 text-center bg-card/20">
          <CardTitle className="text-sm font-semibold">Metrics pending telemetry</CardTitle>
          <CardDescription className="text-xs mt-1">
            Telemetry metrics will appear once autonomous execution workflows complete initial policy cycles.
          </CardDescription>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m: any) => {
            const Icon = m.icon;
            return (
              <Card
                key={m.id}
                className="rounded-2xl border-border bg-card/60 backdrop-blur-sm shadow-2xs hover:shadow-sm transition-all"
              >
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <span className="text-xs font-semibold text-muted-foreground">{m.label}</span>
                  <div className={`p-2 rounded-xl border ${m.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {m.value}
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {m.description}
                  </p>
                  {m.change !== undefined && (
                    <div className="pt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="h-3 w-3" />
                      <span>{m.change > 0 ? `+${m.change}%` : `${m.change}%`} vs last cycle</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── 12-Month Autonomous Time Series ──────────────────────────── */}
      {timeSeries.length > 0 && (
        <Card className="rounded-3xl border-border bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <LineChart className="h-4 w-4 text-primary" />
                  Autonomous Resolution Trends (Last 12 Months)
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Monthly volume of automated decisions vs escalated exceptions and human overrides.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono self-start sm:self-auto">
                Real Telemetry Only
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6 pb-4">
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-2 text-center text-xs font-mono text-muted-foreground border-b border-border/30 pb-2">
                <span className="col-span-3 text-left pl-2">Month</span>
                <span className="col-span-3 text-emerald-600 dark:text-emerald-400 font-semibold">Auto-Resolved</span>
                <span className="col-span-3 text-amber-600 dark:text-amber-400 font-semibold">Exceptions</span>
                <span className="col-span-3 text-purple-600 dark:text-purple-400 font-semibold">Overridden</span>
              </div>
              {timeSeries.slice(-6).map((pt: any) => {
                const total = (pt.autoResolved ?? 0) + (pt.exceptions ?? 0) + (pt.overridden ?? 0);
                const autoPct = total > 0 ? Math.round(((pt.autoResolved ?? 0) / total) * 100) : 0;

                return (
                  <div key={pt.month} className="space-y-1.5 py-1">
                    <div className="grid grid-cols-12 gap-2 text-xs font-mono items-center">
                      <span className="col-span-3 text-left pl-2 font-semibold text-foreground">
                        {pt.month}
                      </span>
                      <span className="col-span-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                        {pt.autoResolved} ({autoPct}%)
                      </span>
                      <span className="col-span-3 text-amber-600 dark:text-amber-400">
                        {pt.exceptions}
                      </span>
                      <span className="col-span-3 text-purple-600 dark:text-purple-400">
                        {pt.overridden}
                      </span>
                    </div>
                    {/* Visual Proportion Bar */}
                    <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full"
                        style={{ width: `${autoPct}%` }}
                        title={`Auto-resolved: ${autoPct}%`}
                      />
                      <div
                        className="bg-amber-500 h-full"
                        style={{ width: `${total > 0 ? ((pt.exceptions / total) * 100) : 0}%` }}
                        title="Exceptions"
                      />
                      <div
                        className="bg-purple-500 h-full"
                        style={{ width: `${total > 0 ? ((pt.overridden / total) * 100) : 0}%` }}
                        title="Overridden"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Quick Navigation to Autopilot Modules ────────────────────── */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold tracking-tight flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          OneHR Modules
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              to: "/dashboard/autopilot/exceptions",
              title: "Exceptions Inbox",
              description: "Queue of escalated requests requiring human maker-checker sign-off.",
              icon: Inbox,
              color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
            },
            {
              to: "/dashboard/autopilot/rules",
              title: "Policy Rules Builder",
              description: "Author declarative if/then policies with interactive dry-run simulation.",
              icon: Layers,
              color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
            },
            {
              to: "/dashboard/autopilot/agent",
              title: "HR Agent that ACTS",
              description: "Execute workforce actions with conversational prompts and confirmation cards.",
              icon: Bot,
              color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
            },
            {
              to: "/dashboard/autopilot/settings",
              title: "Autonomy Settings",
              description: "Configure per-workflow autonomy levels and safety threshold guardrails.",
              icon: Sliders,
              color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
            },
            {
              to: "/dashboard/autopilot/audit",
              title: "AI Action Audit Log",
              description: "Complete trace of all autonomous actions, policy clauses, and human overrides.",
              icon: History,
              color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
            },
            {
              to: "/dashboard/autopilot/alerts",
              title: "Proactive Alerts Center",
              description: "Continuous AI sentinel for attrition signals, burnout, and payroll variance.",
              icon: BellRing,
              color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
            },
          ].map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.to}
                to={mod.to}
                className="group relative rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-4 hover:border-primary/40 hover:bg-card/90 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-xl border ${mod.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {mod.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

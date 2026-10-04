import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bell,
  BellRing,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock,
  Filter,
  Flame,
  ListTodo,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  UserX,
  Zap,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useProactiveAlerts } from "../hooks/useProactiveAlerts";
import type { AlertCategory, AlertSeverity, AutopilotAlert } from "../types";

const CATEGORY_META: Record<
  AlertCategory,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  attrition_risk: {
    label: "Attrition Risk",
    icon: UserX,
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  burnout_signal: {
    label: "Burnout Signal",
    icon: Flame,
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  },
  attendance_anomaly: {
    label: "Attendance Anomaly",
    icon: TrendingDown,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  payroll_variance: {
    label: "Payroll Variance",
    icon: Zap,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  compliance_deadline: {
    label: "Compliance Deadline",
    icon: CalendarClock,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
};

const SEVERITY_BADGES: Record<AlertSeverity, { label: string; color: string }> = {
  critical: {
    label: "Critical",
    color: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
  },
  warning: {
    label: "Warning",
    color: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  },
  info: {
    label: "Info",
    color: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  },
};

export default function ProactiveAlertsPage() {
  const {
    alerts,
    loading,
    error,
    backendUnavailable,
    selectedCategory,
    selectedSeverity,
    activeCount,
    setSelectedCategory,
    setSelectedSeverity,
    refetch,
    acknowledgeAlert,
    snoozeAlert,
    createTaskFromAlert,
  } = useProactiveAlerts();

  // Snooze Dialog
  const [snoozeTarget, setSnoozeTarget] = useState<AutopilotAlert | null>(null);
  const [snoozeHours, setSnoozeHours] = useState<number>(24);
  const [snoozing, setSnoozing] = useState(false);

  // Create Task Dialog
  const [taskTarget, setTaskTarget] = useState<AutopilotAlert | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [creatingTask, setCreatingTask] = useState(false);

  const handleOpenSnooze = (alert: AutopilotAlert) => {
    setSnoozeTarget(alert);
    setSnoozeHours(24);
  };

  const handleConfirmSnooze = async () => {
    if (!snoozeTarget) return;
    try {
      setSnoozing(true);
      await snoozeAlert(snoozeTarget.id, snoozeHours);
      setSnoozeTarget(null);
    } finally {
      setSnoozing(false);
    }
  };

  const handleOpenCreateTask = (alert: AutopilotAlert) => {
    setTaskTarget(alert);
    setTaskTitle(`Follow up: ${alert.title}`);
  };

  const handleConfirmCreateTask = async () => {
    if (!taskTarget || !taskTitle.trim()) return;
    try {
      setCreatingTask(true);
      await createTaskFromAlert(taskTarget.id, taskTitle.trim());
      setTaskTarget(null);
    } finally {
      setCreatingTask(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary relative">
              <BellRing className="h-5 w-5" />
              {activeCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                  {activeCount}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Proactive Alerts Center</h1>
            <Badge variant="outline" className="text-xs uppercase font-mono tracking-wider ml-1 bg-primary/5 text-primary border-primary/20">
              AI Sentinel
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Signals detected by continuous AI monitoring across attrition risks, burnout patterns, attendance anomalies, and payroll variances before they escalate.
          </p>
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
        </div>
      </div>

      {/* ── Backend Unavailable Banner ───────────────────────────────── */}
      {backendUnavailable && (
        <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200 rounded-2xl">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold text-sm">
            Feature unavailable — backend pending
          </AlertTitle>
          <AlertDescription className="text-xs mt-1 space-y-1">
            <p>
              The Proactive Alerts API (<code>/api/v2/autopilot/alerts</code>) is pending deployment.
              Signals will populate automatically once the live sentinel monitors are connected.
            </p>
            <p className="font-mono text-[11px] opacity-80">
              Contract reference: <code>docs/AUTOPILOT_BACKEND_CONTRACT.md</code>
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* ── Inline Error with Retry ──────────────────────────────────── */}
      {error && !backendUnavailable && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-sm font-semibold">Failed to load alerts</AlertTitle>
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

      {/* ── Filters ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-border bg-card/40 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground ml-1" />
          <span className="text-xs font-semibold text-foreground">Filter Alerts:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <Select
            value={selectedCategory}
            onValueChange={(val) => setSelectedCategory(val as any)}
          >
            <SelectTrigger className="h-8 text-xs rounded-xl w-[170px] bg-background">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="attrition_risk">Attrition Risk</SelectItem>
              <SelectItem value="burnout_signal">Burnout Signal</SelectItem>
              <SelectItem value="attendance_anomaly">Attendance Anomaly</SelectItem>
              <SelectItem value="payroll_variance">Payroll Variance</SelectItem>
              <SelectItem value="compliance_deadline">Compliance Deadline</SelectItem>
            </SelectContent>
          </Select>

          {/* Severity Filter */}
          <Select
            value={selectedSeverity}
            onValueChange={(val) => setSelectedSeverity(val as any)}
          >
            <SelectTrigger className="h-8 text-xs rounded-xl w-[140px] bg-background">
              <SelectValue placeholder="All Severities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Alerts Feed ─────────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="rounded-2xl p-4 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-48 rounded-lg" />
                <Skeleton className="h-5 w-20 rounded-lg" />
              </div>
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </Card>
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <Card className="rounded-3xl border border-dashed border-border/80 p-12 text-center bg-card/20">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <CardTitle className="text-base font-semibold">No active proactive alerts</CardTitle>
          <CardDescription className="text-xs max-w-md mx-auto mt-1">
            All workforce systems, attendance trends, payroll runs, and compliance thresholds are currently within normal policy boundaries.
          </CardDescription>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const cat = CATEGORY_META[alert.category] || {
              label: alert.category,
              icon: AlertCircle,
              color: "bg-muted text-muted-foreground",
            };
            const sev = SEVERITY_BADGES[alert.severity] || {
              label: alert.severity,
              color: "bg-muted text-muted-foreground",
            };
            const CatIcon = cat.icon;
            const isHandled = alert.status === "acknowledged" || alert.status === "snoozed";

            return (
              <Card
                key={alert.id}
                className={`rounded-2xl border-border bg-card/60 backdrop-blur-sm shadow-2xs transition-all overflow-hidden ${
                  isHandled ? "opacity-60" : ""
                }`}
              >
                <CardHeader className="pb-3 border-b border-border/40">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl border ${cat.color}`}>
                        <CatIcon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-sm font-semibold tracking-tight">
                            {alert.title}
                          </CardTitle>
                          <Badge variant="outline" className={`text-[10px] font-semibold border ${sev.color}`}>
                            {sev.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                          <span>{cat.label}</span>
                          <span>•</span>
                          <span>Detected: {new Date(alert.createdAt).toLocaleString()}</span>
                          {alert.status !== "active" && (
                            <>
                              <span>•</span>
                              <span className="capitalize font-semibold text-foreground">
                                Status: {alert.status}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-3.5 pb-3 text-xs space-y-3">
                  <div className="text-foreground leading-relaxed">
                    {alert.description}
                  </div>

                  {/* Evidence Block */}
                  {alert.evidence && Object.keys(alert.evidence).length > 0 && (
                    <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5 space-y-1.5">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-primary" /> Sentinel Evidence
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {Object.entries(alert.evidence).map(([k, v]) => (
                          <div key={k} className="flex justify-between items-center text-[11px] bg-background/50 rounded-lg p-1.5 border border-border/40">
                            <span className="font-mono text-muted-foreground">{k}:</span>
                            <span className="font-semibold text-foreground truncate max-w-[140px]">
                              {typeof v === "object" ? JSON.stringify(v) : String(v)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Next Step */}
                  {alert.suggestedAction && (
                    <div className="flex items-start gap-2 p-2.5 rounded-xl bg-primary/5 border border-primary/20 text-xs">
                      <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div className="text-foreground">
                        <span className="font-semibold text-primary">Recommended action: </span>
                        {alert.suggestedAction}
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="py-2.5 px-4 border-t border-border/40 bg-background/40 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[11px] text-muted-foreground">
                    {alert.taskId ? (
                      <span className="text-primary font-medium">Task #{alert.taskId} linked</span>
                    ) : alert.snoozedUntil ? (
                      <span>Snoozed until {new Date(alert.snoozedUntil).toLocaleDateString()}</span>
                    ) : (
                      <span>Requires review or acknowledgement</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenSnooze(alert)}
                      disabled={isHandled}
                      className="rounded-xl h-8 text-xs gap-1 cursor-pointer"
                    >
                      <Clock className="h-3 w-3" />
                      Snooze
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenCreateTask(alert)}
                      disabled={isHandled}
                      className="rounded-xl h-8 text-xs gap-1 cursor-pointer"
                    >
                      <ListTodo className="h-3 w-3" />
                      Create Task
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => void acknowledgeAlert(alert.id)}
                      disabled={isHandled}
                      className="rounded-xl h-8 text-xs gap-1 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
                    >
                      <Check className="h-3 w-3" />
                      {alert.status === "acknowledged" ? "Acknowledged" : "Acknowledge"}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Snooze Modal ────────────────────────────────────────────── */}
      <Dialog open={Boolean(snoozeTarget)} onOpenChange={(open) => !open && setSnoozeTarget(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Snooze Alert
            </DialogTitle>
            <DialogDescription className="text-xs">
              Temporarily mute alerts for <strong>{snoozeTarget?.title}</strong>. The alert will reappear if conditions remain unaddressed.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <Label className="text-xs font-semibold">Select snooze duration</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { hours: 24, label: "24 Hours" },
                { hours: 72, label: "3 Days" },
                { hours: 168, label: "1 Week" },
              ].map((opt) => (
                <Button
                  key={opt.hours}
                  type="button"
                  variant={snoozeHours === opt.hours ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSnoozeHours(opt.hours)}
                  className="rounded-xl h-9 text-xs"
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSnoozeTarget(null)}
              className="rounded-xl text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmSnooze}
              disabled={snoozing}
              className="rounded-xl text-xs h-8 gap-1"
            >
              {snoozing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Clock className="h-3 w-3" />}
              Confirm Snooze
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Create Task Modal ────────────────────────────────────────── */}
      <Dialog open={Boolean(taskTarget)} onOpenChange={(open) => !open && setTaskTarget(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold flex items-center gap-2">
              <ListTodo className="h-4 w-4 text-primary" />
              Create Action Task
            </DialogTitle>
            <DialogDescription className="text-xs">
              Assign an action task to resolve <strong>{taskTarget?.title}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label htmlFor="task-title" className="text-xs font-semibold">
                Task Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="task-title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Schedule 1-on-1 retention discussion with employee"
                className="mt-1 rounded-xl text-xs h-9"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTaskTarget(null)}
              className="rounded-xl text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmCreateTask}
              disabled={!taskTitle.trim() || creatingTask}
              className="rounded-xl text-xs h-8 gap-1 bg-primary text-primary-foreground"
            >
              {creatingTask ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <ListTodo className="h-3 w-3" />
              )}
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

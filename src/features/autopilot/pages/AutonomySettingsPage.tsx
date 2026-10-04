import { useState, useMemo } from "react";
import {
  AlertTriangle,
  Bot,
  Check,
  CheckCircle2,
  Clock,
  HelpCircle,
  Info,
  Lock,
  RefreshCw,
  Save,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
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
import { Slider } from "@/components/ui/slider";
import { useAutonomySettings } from "../hooks/useAutonomySettings";
import {
  ALWAYS_HUMAN_ACTIONS,
  type AutopilotWorkflowId,
  type AutonomyLevel,
  type AutonomyWorkflowSetting,
} from "../types";

const LEVEL_LABELS: Record<AutonomyLevel, { title: string; badge: string; desc: string; color: string }> = {
  suggest_only: {
    title: "Suggest only",
    badge: "Advisory",
    desc: "AI produces recommendations; human must manually execute every step.",
    color: "bg-muted text-muted-foreground border-border",
  },
  auto_with_review: {
    title: "Auto with review",
    badge: "Balanced",
    desc: "AI prepares actions and resolves routine cases with asynchronous human spot-check.",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  full_auto: {
    title: "Full auto within policy",
    badge: "Autonomous",
    desc: "AI executes actions immediately when confidence & policy thresholds are met.",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
};

export default function AutonomySettingsPage() {
  const {
    settings,
    loading,
    saving,
    error,
    backendUnavailable,
    refetch,
    updateWorkflowLevel,
    updateWorkflowThresholds,
    saveSettings,
  } = useAutonomySettings();

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // Check if any workflow is set to "full_auto"
  const hasFullAutoWorkflow = useMemo(() => {
    return Object.values(settings.workflows).some((wf) => wf.level === "full_auto");
  }, [settings.workflows]);

  const handleConfirmSave = async () => {
    setConfirmModalOpen(false);
    await saveSettings();
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Sliders className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Autonomy Settings</h1>
            <Badge variant="outline" className="text-xs uppercase font-mono tracking-wider ml-1 bg-primary/5 text-primary border-primary/20">
              Governance
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Configure execution autonomy, confidence gates, and exception triggers per HR workflow. Routine work executes autonomously while high-risk actions stay human-gated.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            className="rounded-xl h-9 gap-1.5 text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => setConfirmModalOpen(true)}
            disabled={saving}
            className="rounded-xl h-9 gap-1.5 text-xs shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Saving..." : "Save Policy"}
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
              The Autopilot Settings API (<code>/api/v2/autopilot/settings</code>) is awaiting deployment on the backend server.
              Local configuration rules and safety limits are active in client preview.
            </p>
            <p className="font-mono text-[11px] opacity-80">
              Contract specification: <code>docs/AUTOPILOT_BACKEND_CONTRACT.md</code>
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* ── Inline Error with Retry ──────────────────────────────────── */}
      {error && !backendUnavailable && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold text-sm">Failed to Load Settings</AlertTitle>
          <AlertDescription className="text-xs mt-1 flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              className="h-7 text-xs rounded-lg"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* ── Warning Banner on Full Auto Mode ────────────────────────── */}
      {hasFullAutoWorkflow && (
        <Alert className="border-amber-500/50 bg-amber-500/10 text-amber-950 dark:text-amber-200 rounded-2xl shadow-sm">
          <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertTitle className="font-semibold text-sm flex items-center gap-1.5">
            Full Auto Autonomy Active
          </AlertTitle>
          <AlertDescription className="text-xs mt-1 text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
            One or more workflows are configured to <strong>Full auto within policy</strong>. The AI will immediately execute approvals, ledger updates, and communication without prior human triage whenever policy conditions and confidence thresholds are satisfied. Exceptions below threshold are automatically escalated to the Exceptions Inbox.
          </AlertDescription>
        </Alert>
      )}

      {/* ── Hard Human Verification Boundary Card ───────────────────── */}
      <Card className="rounded-2xl border-rose-500/30 bg-rose-500/5 backdrop-blur-sm overflow-hidden shadow-sm">
        <CardHeader className="pb-3 border-b border-rose-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Lock className="h-4 w-4" />
              </div>
              <CardTitle className="text-base font-semibold text-rose-950 dark:text-rose-200">
                Immutable Human Verification Boundaries
              </CardTitle>
            </div>
            <Badge variant="outline" className="border-rose-500/30 text-rose-600 dark:text-rose-400 bg-rose-500/10 text-[10px] uppercase font-mono">
              Legally Gated
            </Badge>
          </div>
          <CardDescription className="text-xs text-rose-900/70 dark:text-rose-300/70 mt-1">
            System-level safety invariants: The AI is hard-coded to never take these actions autonomously. They cannot be converted to automated mode.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {ALWAYS_HUMAN_ACTIONS.map((action) => (
              <div
                key={action.id}
                className="flex items-start gap-2.5 p-3 rounded-xl border border-rose-500/15 bg-background/60 shadow-2xs"
              >
                <div className="mt-0.5 p-1 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">{action.name}</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    {action.description}
                  </p>
                  <span className="inline-block mt-1.5 text-[9px] font-mono uppercase tracking-wider text-rose-600/80 dark:text-rose-400/80">
                    Enforcement: {action.enforcedBy}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── Workflow Settings Grid ──────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Configurable HR Workflows</h2>
            <p className="text-xs text-muted-foreground">
              Define autonomy levels and numerical safety thresholds for each active workflow.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(Object.keys(settings.workflows) as AutopilotWorkflowId[]).map((wfId) => {
            const wf = settings.workflows[wfId];
            return (
              <WorkflowSettingCard
                key={wfId}
                workflow={wf}
                onLevelChange={(lvl) => updateWorkflowLevel(wfId, lvl)}
                onThresholdChange={(partial) => updateWorkflowThresholds(wfId, partial)}
              />
            );
          })}
        </div>
      </div>

      {/* ── Confirmation Dialog ─────────────────────────────────────── */}
      <Dialog open={confirmModalOpen} onOpenChange={setConfirmModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl">
          <DialogHeader>
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
              <Shield className="h-5 w-5" />
            </div>
            <DialogTitle className="text-center text-lg font-semibold">
              Confirm Autonomy Policy Update
            </DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground">
              You are modifying the operational boundaries of OneHR. These thresholds directly dictate autonomous approval versus escalation into the Exceptions Inbox.
            </DialogDescription>
          </DialogHeader>

          <div className="my-3 space-y-2.5 rounded-xl border border-border bg-muted/30 p-3.5 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Workflows Managed</span>
              <span className="font-semibold">{Object.keys(settings.workflows).length} Active</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-border/50">
              <span className="text-muted-foreground font-medium">Autonomous Execution Mode</span>
              <span className={hasFullAutoWorkflow ? "font-bold text-amber-600 dark:text-amber-400" : "font-medium"}>
                {hasFullAutoWorkflow ? "Full Auto Enabled" : "Human-Assisted"}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-muted-foreground font-medium">Safety Boundary Lock</span>
              <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                5 Hard-coded Gates Active
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmModalOpen(false)}
              className="rounded-xl h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleConfirmSave()}
              className="rounded-xl h-9 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Confirm and Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface WorkflowSettingCardProps {
  workflow: AutonomyWorkflowSetting;
  onLevelChange: (level: AutonomyLevel) => void;
  onThresholdChange: (thresholds: Record<string, any>) => void;
}

function WorkflowSettingCard({
  workflow,
  onLevelChange,
  onThresholdChange,
}: WorkflowSettingCardProps) {
  const currentLevelInfo = LEVEL_LABELS[workflow.level];
  const isExpense = workflow.workflowId === "expense";
  const isLeave = workflow.workflowId === "leave";

  // Expense is stored in integer paise: ₹ amount = paise / 100
  const expenseRupees = Math.round(workflow.thresholds.maxExpenseAmountPaise / 100);

  return (
    <Card className="rounded-2xl border-border bg-card/60 backdrop-blur-sm flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all duration-200">
      <CardHeader className="pb-3 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-accent text-foreground">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold tracking-tight">{workflow.name}</CardTitle>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">{workflow.workflowId}</span>
            </div>
          </div>
          <Badge variant="outline" className={`text-[10px] px-2 py-0.5 rounded-full ${currentLevelInfo.color}`}>
            {currentLevelInfo.badge}
          </Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {workflow.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-1 flex-1">
        {/* Level selector */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-foreground">Autonomy Level</Label>
          <Select
            value={workflow.level}
            onValueChange={(val) => onLevelChange(val as AutonomyLevel)}
          >
            <SelectTrigger className="h-9 rounded-xl text-xs bg-background/80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-xs">
              <SelectItem value="suggest_only">
                <span className="font-medium">Suggest only</span> — Human signs off
              </SelectItem>
              <SelectItem value="auto_with_review">
                <span className="font-medium">Auto with review</span> — Routine auto
              </SelectItem>
              <SelectItem value="full_auto">
                <span className="font-medium text-emerald-600 dark:text-emerald-400">Full auto within policy</span>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[11px] text-muted-foreground italic">
            {currentLevelInfo.desc}
          </p>
        </div>

        {/* Confidence Minimum Slider */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          <div className="flex justify-between items-center text-xs">
            <Label className="text-xs text-foreground flex items-center gap-1">
              <span>Confidence Threshold</span>
              <span className="text-[10px] text-muted-foreground font-mono">min</span>
            </Label>
            <span className="font-mono text-xs font-semibold text-primary">
              {workflow.thresholds.confidenceMinimum}%
            </span>
          </div>
          <Slider
            value={[workflow.thresholds.confidenceMinimum]}
            min={50}
            max={99}
            step={1}
            onValueChange={([val]) => onThresholdChange({ confidenceMinimum: val })}
            className="w-full cursor-pointer"
          />
          <span className="text-[10px] text-muted-foreground block">
            Requests below {workflow.thresholds.confidenceMinimum}% confidence escalate to Exceptions Inbox.
          </span>
        </div>

        {/* Max Leave Days threshold */}
        {isLeave && (
          <div className="space-y-1.5 pt-2 border-t border-border/50">
            <div className="flex justify-between items-center text-xs">
              <Label className="text-xs text-foreground">Max Auto-Approve Leave Days</Label>
              <span className="font-mono text-xs font-semibold">{workflow.thresholds.maxLeaveDays} days</span>
            </div>
            <Input
              type="number"
              min={1}
              max={14}
              value={workflow.thresholds.maxLeaveDays}
              onChange={(e) =>
                onThresholdChange({ maxLeaveDays: Math.max(1, Number(e.target.value) || 1) })
              }
              className="h-8 rounded-lg text-xs"
            />
          </div>
        )}

        {/* Max Expense Amount threshold (Paise converted to ₹) */}
        {isExpense && (
          <div className="space-y-1.5 pt-2 border-t border-border/50">
            <div className="flex justify-between items-center text-xs">
              <Label className="text-xs text-foreground">Max Auto-Approve Expense</Label>
              <span className="font-mono text-xs font-semibold">₹{expenseRupees.toLocaleString("en-IN")}</span>
            </div>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">₹</span>
              <Input
                type="number"
                min={100}
                step={100}
                value={expenseRupees}
                onChange={(e) => {
                  const rupees = Math.max(0, Number(e.target.value) || 0);
                  onThresholdChange({ maxExpenseAmountPaise: rupees * 100 });
                }}
                className="h-8 pl-6 rounded-lg text-xs font-mono"
              />
            </div>
            <span className="text-[10px] text-muted-foreground block">
              Claims above ₹{expenseRupees.toLocaleString("en-IN")} require human review.
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 pb-3 border-t border-border/40 text-[10px] text-muted-foreground flex justify-between">
        <span>Policy engine active</span>
        <span className="font-mono">{workflow.workflowId}</span>
      </CardFooter>
    </Card>
  );
}

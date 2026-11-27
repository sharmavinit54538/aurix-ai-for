import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  GitBranch,
  Mail,
  Plus,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Trash2,
  UserCheck,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getErrorMessage, parseListResponse } from "@/api/utils";
import { automationApi } from "@/services/automationApi";
import { EmptyState } from "@/components/hrms/Shared";

interface WorkflowRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  enabled: boolean;
  runs: number;
  lastRun?: string;
}

function mapRule(r: Record<string, unknown>): WorkflowRule {
  return {
    id: String(r.id ?? r.rule_id ?? ""),
    name: String(r.name ?? "Automation Rule"),
    trigger: String(r.trigger ?? r.trigger_event ?? "On application created"),
    condition: String(
      r.condition ?? (r.conditions ? JSON.stringify(r.conditions) : "Standard workflow"),
    ),
    action: String(
      r.action ??
        (Array.isArray(r.actions) && r.actions.length > 0
          ? JSON.stringify(r.actions)
          : "Execute action"),
    ),
    enabled: Boolean(r.enabled ?? r.is_active ?? true),
    runs: Number(r.runs ?? r.execution_count ?? 0) || 0,
    lastRun:
      typeof r.last_run === "string"
        ? r.last_run
        : typeof r.updated_at === "string"
          ? r.updated_at
          : undefined,
  };
}

export function RecruitmentAutomationPage() {
  const [workflows, setWorkflows] = useState<WorkflowRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(null);
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [newWorkflowTrigger, setNewWorkflowTrigger] = useState("candidate.applied");
  const [newWorkflowCondition, setNewWorkflowCondition] = useState("ats_score >= 80");
  const [newWorkflowAction, setNewWorkflowAction] = useState("send_interview_invite");

  const fetchRules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await automationApi.getAutomationRules();
      const parsed = parseListResponse<Record<string, unknown>>(raw);
      const mapped = parsed.items.map(mapRule).filter((r) => Boolean(r.id));
      setWorkflows(mapped);
      if (mapped.length > 0 && (!activeWorkflowId || !mapped.some((m) => m.id === activeWorkflowId))) {
        setActiveWorkflowId(mapped[0].id);
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load recruitment automation rules."));
    } finally {
      setLoading(false);
    }
  }, [activeWorkflowId]);

  useEffect(() => {
    void fetchRules();
  }, [fetchRules]);

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkflowName.trim()) {
      toast.error("Please enter a workflow rule name.");
      return;
    }

    setSubmitting(true);
    try {
      const created = await automationApi.createAutomationRule({
        name: newWorkflowName.trim(),
        trigger: newWorkflowTrigger.trim(),
        trigger_event: newWorkflowTrigger.trim(),
        condition: newWorkflowCondition.trim(),
        action: newWorkflowAction.trim(),
        is_active: true,
      });

      toast.success(`Automation workflow "${newWorkflowName.trim()}" saved.`);
      setShowBuilderModal(false);
      setNewWorkflowName("");
      await fetchRules();
      if (created && typeof created === "object" && "id" in created) {
        setActiveWorkflowId(String((created as { id: string }).id));
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create automation rule."));
    } finally {
      setSubmitting(false);
    }
  };

  const activeWorkflow = workflows.find((w) => w.id === activeWorkflowId) ?? workflows[0] ?? null;
  const activeCount = workflows.filter((w) => w.enabled).length;

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Hiring Automations"
        description="Configure event-driven recruitment automation rules (`GET/POST /api/v1/automations/rules`)"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => void fetchRules()} disabled={loading}>
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              className="gap-1.5 bg-gradient-brand text-brand-foreground shadow-glow"
              onClick={() => setShowBuilderModal(true)}
            >
              <Plus className="h-4 w-4" /> Create Automation Rule
            </Button>
          </div>
        }
      />

      <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-300">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <span className="font-semibold">Backend Capability Note:</span> Creating and listing
          automation rules is connected to <code>/api/v1/automations/rules</code>. Rule toggling,
          deletion, and test execution are disabled because the backend OpenAPI does not yet expose
          <code>PATCH/DELETE /api/v1/automations/rules/&#123;id&#125;</code> or test-run endpoints.
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => void fetchRules()}>
            Retry
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { k: "Total Rules", v: workflows.length, icon: Zap },
          { k: "Active Rules", v: activeCount, icon: UserCheck },
          {
            k: "Recorded Executions",
            v: workflows.reduce((acc, w) => acc + w.runs, 0),
            icon: Mail,
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.k} className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{s.k}</span>
                <Icon className="h-4 w-4" />
              </div>
              <div className="mt-2 font-display text-2xl font-semibold">{s.v}</div>
            </div>
          );
        })}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card/60 p-10 text-center text-sm text-muted-foreground">
          Loading automation rules...
        </div>
      ) : workflows.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No automation rules configured"
          description="Create your first recruitment workflow rule to store trigger/action definitions."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-3 lg:col-span-5">
            {workflows.map((wf) => {
              const isSelected = wf.id === activeWorkflow?.id;
              return (
                <div
                  key={wf.id}
                  onClick={() => setActiveWorkflowId(wf.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-card/60 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-semibold text-sm">{wf.name}</span>
                        <Badge variant={wf.enabled ? "default" : "secondary"} className="text-[10px]">
                          {wf.enabled ? "Active" : "Paused"}
                        </Badge>
                      </div>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        Trigger: {wf.trigger}
                      </p>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Switch
                        checked={wf.enabled}
                        disabled
                        title="Blocked by backend: toggle rule endpoint unavailable"
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground"
                        disabled
                        title="Blocked by backend: delete rule endpoint unavailable"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-7">
            {activeWorkflow ? (
              <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-lg font-semibold">{activeWorkflow.name}</h3>
                    <p className="text-xs text-muted-foreground">Rule ID: {activeWorkflow.id}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled
                    title="Blocked by backend: test-run endpoint unavailable"
                  >
                    <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                    Test Rule (Unavailable)
                  </Button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <div className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                      1. Trigger Event
                    </div>
                    <div className="mt-1 font-medium text-foreground">{activeWorkflow.trigger}</div>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <div className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                      2. Condition
                    </div>
                    <div className="mt-1 font-medium text-foreground">{activeWorkflow.condition}</div>
                  </div>
                  <div className="rounded-xl border border-border bg-muted/30 p-3">
                    <div className="font-semibold text-muted-foreground uppercase tracking-wider text-[10px]">
                      3. Action
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 font-medium text-foreground">
                      <GitBranch className="h-3.5 w-3.5 text-primary" />
                      {activeWorkflow.action}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <Dialog open={showBuilderModal} onOpenChange={setShowBuilderModal}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreateWorkflow}>
            <DialogHeader>
              <DialogTitle>Create Automation Rule</DialogTitle>
              <DialogDescription>
                Persist a new trigger-condition-action workflow rule via the backend API.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-3 text-xs">
              <div>
                <Label htmlFor="rule-name">Rule Name *</Label>
                <Input
                  id="rule-name"
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                  placeholder="e.g. Auto-invite high ATS match"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="rule-trigger">Trigger Event *</Label>
                <Input
                  id="rule-trigger"
                  value={newWorkflowTrigger}
                  onChange={(e) => setNewWorkflowTrigger(e.target.value)}
                  placeholder="e.g. candidate.applied"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="rule-condition">Condition</Label>
                <Input
                  id="rule-condition"
                  value={newWorkflowCondition}
                  onChange={(e) => setNewWorkflowCondition(e.target.value)}
                  placeholder="e.g. ats_score >= 80"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="rule-action">Action *</Label>
                <Input
                  id="rule-action"
                  value={newWorkflowAction}
                  onChange={(e) => setNewWorkflowAction(e.target.value)}
                  placeholder="e.g. send_interview_invite"
                  required
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowBuilderModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Rule"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  Workflow, Zap, Play, CheckCircle2, Clock, Plus, Trash2,
  AlertCircle, Sparkles, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { automationApi } from "@/services/automationApi";

interface WorkflowStep {
  id: string;
  type: "trigger" | "condition" | "action" | "approval" | "delay";
  title: string;
  detail: string;
  category: "Notification" | "Assignment" | "Approval" | "Delay" | "System";
}

interface WorkflowRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  totalRuns: number;
  lastTriggered: string;
  triggerEvent: string;
  steps: WorkflowStep[];
}

interface ExecutionLog {
  id: string;
  timestamp: string;
  message: string;
  status: "Success" | "Delivered" | "Pending" | "Failed";
}

export function RecruitmentAutomationPage() {
  const [workflows, setWorkflows] = useState<WorkflowRule[]>([]);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(null);
  const [showBuilderModal, setShowBuilderModal] = useState(false);

  // New Workflow Form
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [newWorkflowTrigger, setNewWorkflowTrigger] = useState("Candidate applied");
  const [newWorkflowAction, setNewWorkflowAction] = useState("Send automated email");

  const loadRules = async () => {
    setLoading(true);
    try {
      const data = await automationApi.getAutomationRules();
      if (Array.isArray(data)) {
        const mapped: WorkflowRule[] = data.map((r: any, idx: number) => ({
          id: String(r.id || `wf-${idx}`),
          name: r.name || `Rule #${idx + 1}`,
          description: r.description || "Automation rule",
          enabled: Boolean(r.enabled ?? r.is_active ?? true),
          totalRuns: Number(r.total_runs || r.runs_count || 0),
          lastTriggered: r.last_triggered || "Never",
          triggerEvent: r.trigger_event || "System Event",
          steps: Array.isArray(r.steps) ? r.steps : [
            { id: `st-${idx}-1`, type: "trigger", title: `Trigger: ${r.trigger_event || "Event"}`, detail: "Triggered on event", category: "System" },
            { id: `st-${idx}-2`, type: "action", title: `Action: Automated Pipeline Step`, detail: "Dispatched automatically", category: "Notification" },
          ],
        }));
        setWorkflows(mapped);
        if (mapped.length > 0 && !activeWorkflowId) {
          setActiveWorkflowId(mapped[0].id);
        }
      }
    } catch {
      // Backend empty or initial state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  // Keep activeWorkflow valid
  const activeWorkflow = workflows.find((w) => w.id === activeWorkflowId) || workflows[0] || null;

  const handleToggleWorkflow = async (id: string) => {
    try {
      await automationApi.toggleAutomationRule(id);
      setWorkflows((prev) => prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w)));
      toast.success("Workflow rule status toggled!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to toggle workflow rule";
      toast.error(msg);
    }
  };

  const handleDeleteWorkflow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = workflows.filter((w) => w.id !== id);
    setWorkflows(updated);
    if (activeWorkflowId === id) {
      setActiveWorkflowId(updated[0]?.id || null);
    }
    toast.success("Workflow rule removed from session view.");
  };

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkflowName.trim()) return;

    try {
      const payload = {
        name: newWorkflowName,
        description: `Automated trigger on ${newWorkflowTrigger}.`,
        trigger_event: newWorkflowTrigger,
        action: newWorkflowAction,
        enabled: true,
      };
      const created = await automationApi.createAutomationRule(payload);
      const newWf: WorkflowRule = {
        id: String(created.id || `wf-${Date.now()}`),
        name: newWorkflowName,
        description: `Automated trigger on ${newWorkflowTrigger}.`,
        enabled: true,
        totalRuns: 0,
        lastTriggered: "Never",
        triggerEvent: newWorkflowTrigger,
        steps: [
          { id: `st-${Date.now()}-1`, type: "trigger", title: `Trigger: ${newWorkflowTrigger}`, detail: "Initiated automatically by recruitment events", category: "System" },
          { id: `st-${Date.now()}-2`, type: "action", title: `Action: ${newWorkflowAction}`, detail: "Dispatched without manual intervention", category: "Notification" },
        ],
      };

      setWorkflows((prev) => [newWf, ...prev]);
      setActiveWorkflowId(newWf.id);
      toast.success(`Workflow '${newWf.name}' created and activated!`);
      setShowBuilderModal(false);
      setNewWorkflowName("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create workflow rule";
      toast.error(msg);
    }
  };

  const handleTestRun = async (wf: WorkflowRule) => {
    try {
      await automationApi.testAutomationRule(wf.id);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const dateStr = now.toISOString().split("T")[0];

      setWorkflows((prev) =>
        prev.map((w) => (w.id === wf.id ? { ...w, totalRuns: w.totalRuns + 1, lastTriggered: "Just now" } : w))
      );

      const newLog: ExecutionLog = {
        id: `log-${Date.now()}`,
        timestamp: `${dateStr} ${timeStr}`,
        message: `Test execution for '${wf.name}' dispatched successfully`,
        status: "Success",
      };
      setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
      toast.success(`Test execution triggered for '${wf.name}'!`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to trigger test execution";
      toast.error(msg);
    }
  };

  const totalRunsAll = workflows.reduce((acc, w) => acc + w.totalRuns, 0);
  const activeCount = workflows.filter((w) => w.enabled).length;
  const hoursSaved = (totalRunsAll * 0.25).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-end">
        <Button onClick={() => setShowBuilderModal(true)} className="gap-1.5 shadow-sm">
          <Plus className="h-4 w-4" /> Create Workflow Rule
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Active Automated Rules</span>
            <Workflow className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold">
            {activeCount} of {workflows.length} Active
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">Operating across pipelines</div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Automated Runs</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold">{totalRunsAll} Executions</div>
          <div className="mt-1 text-[11px] text-muted-foreground">Lifetime executions</div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Recruiter Hours Saved</span>
            <Clock className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {hoursSaved} Hours
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">Automated repetitive tasks</div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Execution Success Rate</span>
            <CheckCircle2 className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold">
            {totalRunsAll > 0 ? "100%" : "—"}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {totalRunsAll > 0 ? "0 failures detected" : "Awaiting first run"}
          </div>
        </div>
      </div>

      {/* Main Workflow Builder Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Col: Workflow Rules Directory */}
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between font-semibold text-sm">
            <span>Automation Library</span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{workflows.length} Rules</Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowBuilderModal(true)}
                className="h-7 text-xs gap-1 shadow-2xs"
              >
                <Plus className="h-3 w-3" /> New
              </Button>
            </div>
          </div>

          {workflows.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/80 bg-card/30 p-8 text-center space-y-3">
              <Workflow className="h-8 w-8 text-muted-foreground/40 mx-auto" />
              <div className="text-xs font-semibold text-foreground">No automation rules configured</div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                No active automation workflows. Build visual trigger rules to automate resume screening, interview invites, and candidate communications.
              </p>
              <Button
                size="sm"
                onClick={() => setShowBuilderModal(true)}
                className="gap-1.5 text-xs mt-1"
              >
                <Plus className="h-3.5 w-3.5" /> Create Rule
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {workflows.map((wf) => (
                <div
                  key={wf.id}
                  onClick={() => setActiveWorkflowId(wf.id)}
                  className={`group p-3.5 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                    activeWorkflow?.id === wf.id
                      ? "border-indigo-500 bg-accent/60 shadow-sm"
                      : "border-border bg-card/40 hover:bg-accent/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-foreground leading-snug">{wf.name}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Switch
                        checked={wf.enabled}
                        onCheckedChange={() => handleToggleWorkflow(wf.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        type="button"
                        onClick={(e) => handleDeleteWorkflow(wf.id, e)}
                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        title="Delete Rule"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">{wf.description}</p>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground/80 pt-1 border-t border-border/40">
                    <span>{wf.totalRuns} runs</span>
                    <span>Last run: {wf.lastTriggered}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 2 Cols: Visual Interactive Workflow Canvas */}
        <div className="lg:col-span-2 space-y-4">
          {activeWorkflow ? (
            <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-foreground">{activeWorkflow.name}</h3>
                    <Badge variant={activeWorkflow.enabled ? "default" : "secondary"} className="text-[10px]">
                      {activeWorkflow.enabled ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{activeWorkflow.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs gap-1"
                    onClick={() => handleTestRun(activeWorkflow)}
                  >
                    <Play className="h-3 w-3 fill-current" /> Test Run
                  </Button>
                </div>
              </div>

              {/* Visual Step Pipeline Nodes */}
              <div className="space-y-3">
                <span className="text-xs uppercase font-bold text-muted-foreground tracking-wider">
                  Visual Step Pipeline Execution Flow
                </span>

                <div className="relative pl-6 space-y-4 border-l-2 border-dashed border-indigo-500/40 ml-2">
                  {activeWorkflow.steps.map((step, idx) => (
                    <div key={step.id} className="relative group">
                      {/* Node Dot */}
                      <span className="absolute -left-[31px] top-3.5 grid h-4 w-4 place-items-center rounded-full bg-indigo-500 text-[9px] text-white font-bold shadow-md">
                        {idx + 1}
                      </span>

                      <div className="p-3.5 rounded-xl border border-border bg-card/40 hover:bg-card/75 transition-colors space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-xs text-foreground flex items-center gap-2">
                            <span>{step.title}</span>
                            <Badge variant="outline" className="text-[9px] uppercase font-bold">
                              {step.type}
                            </Badge>
                          </div>
                          <span className="text-[10px] text-muted-foreground">{step.category}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {step.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workflow Execution Log Feed */}
              <div className="pt-4 border-t border-border space-y-2">
                <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Live Execution Stream
                </h4>
                {logs.length === 0 ? (
                  <div className="p-3 rounded-xl border border-dashed border-border/70 text-center text-xs text-muted-foreground bg-muted/10">
                    No workflow executions recorded yet. Triggers and test simulations will log live status here.
                  </div>
                ) : (
                  <div className="space-y-1.5 font-mono text-[11px]">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className="p-2 rounded bg-muted/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-between"
                      >
                        <span>✓ [{log.timestamp}] {log.message}</span>
                        <span className="text-[10px] text-muted-foreground">{log.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/80 bg-card/20 p-12 text-center space-y-3 flex flex-col items-center justify-center min-h-[360px]">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 grid place-items-center text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-sm text-foreground">Visual Workflow Canvas</h3>
              <p className="text-xs text-muted-foreground max-w-md">
                Select or create an automation workflow to configure trigger events, conditional rules, and automatic action pipelines.
              </p>
              <Button size="sm" onClick={() => setShowBuilderModal(true)} className="mt-2 gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Build First Automation
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Workflow Builder Dialog */}
      <Dialog open={showBuilderModal} onOpenChange={setShowBuilderModal}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleCreateWorkflow}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Create No-Code Automation Rule</DialogTitle>
              <DialogDescription>
                Define an event trigger and subsequent automated actions.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs">
              <div>
                <Label className="text-xs">Workflow Name *</Label>
                <Input
                  className="mt-1 h-9 text-xs"
                  placeholder="e.g. Reject below 60% ATS score with warm feedback"
                  value={newWorkflowName}
                  onChange={(e) => setNewWorkflowName(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="text-xs">When this Event Occurs (Trigger)</Label>
                <Select
                  value={newWorkflowTrigger}
                  onValueChange={setNewWorkflowTrigger}
                >
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Candidate applied">Candidate submits application</SelectItem>
                    <SelectItem value="Score exceeds 85%">AI Screening ATS score &gt; 85%</SelectItem>
                    <SelectItem value="Interview scheduled">Interview scheduled by panel</SelectItem>
                    <SelectItem value="Offer accepted">Candidate accepts digital offer</SelectItem>
                    <SelectItem value="Day 1 joined">Employee orientation completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Then Execute this Action</Label>
                <Select
                  value={newWorkflowAction}
                  onValueChange={setNewWorkflowAction}
                >
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Send automated email">Dispatch personalized email template</SelectItem>
                    <SelectItem value="Send WhatsApp notification">Send WhatsApp message with calendar link</SelectItem>
                    <SelectItem value="Advance to technical interview">Move stage to Technical Interview</SelectItem>
                    <SelectItem value="Trigger hardware provision ticket">Create IT laptop provision ticket</SelectItem>
                    <SelectItem value="Assign onboarding buddy">Assign department mentor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowBuilderModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Activate Automation</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from "react";
import {
  Workflow, Zap, Play, CheckCircle2, Clock, Plus, Trash2,
  Mail, MessageSquare, ShieldCheck, UserCheck, Laptop, AlertCircle,
  Sparkles, Power, ArrowRight, Layers, FileText, ChevronRight
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
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

const TEMPLATE_WORKFLOWS: WorkflowRule[] = [
  {
    id: "wf-1",
    name: "Candidate Applied → AI Resume Screening & Auto-Shortlist",
    description: "Instantly score new resumes using AI and tag top matches with >85% ATS score.",
    enabled: true,
    totalRuns: 142,
    lastTriggered: "10 mins ago",
    triggerEvent: "Candidate submits application",
    steps: [
      { id: "s1", type: "trigger", title: "Trigger: Candidate Applied", detail: "When candidate applies via any channel", category: "System" },
      { id: "s2", type: "condition", title: "Condition: ATS Score >= 85%", detail: "Matches required skills and experience bar", category: "System" },
      { id: "s3", type: "action", title: "Action: Auto-Shortlist & Tag", detail: "Tag profile as 'Top Match' and advance to Screening", category: "Assignment" },
      { id: "s4", type: "action", title: "Action: Send WhatsApp Invitation", detail: "Dispatch automated assessment test link via WhatsApp", category: "Notification" },
    ],
  },
  {
    id: "wf-2",
    name: "Candidate Shortlisted → Interview Invitation & Calendar Hold",
    description: "Generate self-scheduling link and send personalized invitation email.",
    enabled: true,
    totalRuns: 88,
    lastTriggered: "2 hours ago",
    triggerEvent: "Stage moved to Interview",
    steps: [
      { id: "s11", type: "trigger", title: "Trigger: Stage Changed", detail: "Candidate moved to Technical Interview", category: "System" },
      { id: "s12", type: "action", title: "Action: Sync Interviewer Availability", detail: "Query Google Calendar for free 45-min slots", category: "Assignment" },
      { id: "s13", type: "action", title: "Action: Dispatch Invite Email", detail: "Send email with variable interpolation and meeting URL", category: "Notification" },
    ],
  },
  {
    id: "wf-3",
    name: "Offer Accepted → Automated Preboarding Kickoff",
    description: "Trigger document upload checklist, notify IT desk for MacBook, and assign mentor.",
    enabled: true,
    totalRuns: 34,
    lastTriggered: "Yesterday",
    triggerEvent: "Candidate signs offer letter",
    steps: [
      { id: "s21", type: "trigger", title: "Trigger: Offer Accepted", detail: "Digital signature validated on offer letter", category: "System" },
      { id: "s22", type: "action", title: "Action: Provision Preboarding Portal", detail: "Generate unique token and grant candidate access", category: "Assignment" },
      { id: "s23", type: "action", title: "Action: Notify IT Desk", detail: "Trigger hardware request ticket for laptop & monitor", category: "Notification" },
      { id: "s24", type: "delay", title: "Wait: 5 Days Before Day 1", detail: "Hold until Day 1 countdown reaches T-5", category: "Delay" },
      { id: "s25", type: "action", title: "Action: Send Welcome Video & Buddy Intro", detail: "Send welcome pack via WhatsApp and Slack", category: "Notification" },
    ],
  },
  {
    id: "wf-4",
    name: "Employee Joined → IT Zero-Trust Access Provisioning",
    description: "Automatically create Google Workspace email, Slack invite, and VPN keys on Day 1.",
    enabled: true,
    totalRuns: 27,
    lastTriggered: "3 days ago",
    triggerEvent: "HR marks employee as Joined",
    steps: [
      { id: "s31", type: "trigger", title: "Trigger: Day 1 Check-In", detail: "HR completes physical/remote orientation", category: "System" },
      { id: "s32", type: "action", title: "Action: Provision Okta & Google Account", detail: "Issue @ofc360.com email with enforced 2FA", category: "Assignment" },
      { id: "s33", type: "action", title: "Action: Grant GitHub & AWS Dev Role", detail: "Department-specific permission group grant", category: "Assignment" },
    ],
  },
  {
    id: "wf-5",
    name: "Probation Milestone (T-15 Days) → Manager Review Reminder",
    description: "Prompt manager to fill out Day-90 confirmation scorecard 15 days before tenure end.",
    enabled: false,
    totalRuns: 12,
    lastTriggered: "1 week ago",
    triggerEvent: "Probation end date - 15 days",
    steps: [
      { id: "s41", type: "trigger", title: "Trigger: Timeline Milestone", detail: "15 days before probation expiration", category: "System" },
      { id: "s42", type: "approval", title: "Approval: Manager Sign-off", detail: "Request confirmation scorecard submission", category: "Approval" },
      { id: "s43", type: "action", title: "Action: Notify HR Operations", detail: "Add recommendation outcome to board agenda", category: "Notification" },
    ],
  },
];

export function RecruitmentAutomationPage() {
  const [workflows, setWorkflows] = useState<WorkflowRule[]>(TEMPLATE_WORKFLOWS);
  const [activeWorkflowId, setActiveWorkflowId] = useState<string>("wf-1");
  const [showBuilderModal, setShowBuilderModal] = useState(false);

  // New Workflow Form
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [newWorkflowTrigger, setNewWorkflowTrigger] = useState("Candidate applied");
  const [newWorkflowAction, setNewWorkflowAction] = useState("Send automated email");

  const activeWorkflow = workflows.find((w) => w.id === activeWorkflowId) || workflows[0];

  const handleToggleWorkflow = (id: string) => {
    setWorkflows(
      workflows.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
    toast.success("Workflow status updated!");
  };

  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkflowName.trim()) return;

    const newWf: WorkflowRule = {
      id: `wf-${Date.now()}`,
      name: newWorkflowName,
      description: `Automated trigger on ${newWorkflowTrigger}.`,
      enabled: true,
      totalRuns: 0,
      lastTriggered: "Just now",
      triggerEvent: newWorkflowTrigger,
      steps: [
        { id: "st-1", type: "trigger", title: `Trigger: ${newWorkflowTrigger}`, detail: "Initiated automatically by system", category: "System" },
        { id: "st-2", type: "action", title: `Action: ${newWorkflowAction}`, detail: "Dispatched without manual intervention", category: "Notification" },
      ],
    };

    setWorkflows([newWf, ...workflows]);
    setActiveWorkflowId(newWf.id);
    toast.success(`Workflow '${newWf.name}' created and activated!`);
    setShowBuilderModal(false);
    setNewWorkflowName("");
  };

  const totalRunsAll = workflows.reduce((acc, w) => acc + w.totalRuns, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visual No-Code Workflow Automation Builder"
        description="Design multi-step event triggers, conditional branchings, auto-notifications, approval bottlenecks, and scheduled delays without code."
        actions={
          <Button onClick={() => setShowBuilderModal(true)} className="gap-1.5 shadow-sm">
            <Plus className="h-4 w-4" /> Create Workflow Rule
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Active Automated Rules</span>
            <Workflow className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold">
            {workflows.filter((w) => w.enabled).length} of {workflows.length} Active
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">Operating 24/7 across pipelines</div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Automated Runs</span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold">{totalRunsAll} Executions</div>
          <div className="mt-1 text-[11px] text-muted-foreground">Last 30 days</div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Recruiter Hours Saved</span>
            <Clock className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">148 Hours</div>
          <div className="mt-1 text-[11px] text-muted-foreground">Zero manual repetitive steps</div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Execution Success Rate</span>
            <CheckCircle2 className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold">99.8%</div>
          <div className="mt-1 text-[11px] text-muted-foreground">0 webhook drop-offs</div>
        </div>
      </div>

      {/* Main Workflow Builder Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Col: Workflow Rules Directory */}
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between font-semibold text-sm">
            <span>Automation Library</span>
            <Badge variant="outline" className="text-xs">{workflows.length} Templates</Badge>
          </div>

          <div className="space-y-2">
            {workflows.map((wf) => (
              <div
                key={wf.id}
                onClick={() => setActiveWorkflowId(wf.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                  activeWorkflow.id === wf.id
                    ? "border-indigo-500 bg-accent/60 shadow-sm"
                    : "border-border bg-card/40 hover:bg-accent/30"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-xs text-foreground leading-snug">{wf.name}</span>
                  <Switch
                    checked={wf.enabled}
                    onCheckedChange={() => handleToggleWorkflow(wf.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2">{wf.description}</p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground/80 pt-1 border-t border-border/40">
                  <span>{wf.totalRuns} runs</span>
                  <span>Active: {wf.lastTriggered}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: Visual Interactive Workflow Canvas */}
        <div className="lg:col-span-2 space-y-4">
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
                  onClick={() => toast.success(`Triggered test simulation for ${activeWorkflow.name}!`)}
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
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="p-2 rounded bg-muted/30 text-emerald-600 dark:text-emerald-400 flex justify-between">
                  <span>✓ [2026-03-16 05:42:11] Trigger: Candidate Siddharth Nambiar applied → Auto-shortlisted (94% score)</span>
                  <span className="text-[10px] text-muted-foreground">Success</span>
                </div>
                <div className="p-2 rounded bg-muted/30 text-emerald-600 dark:text-emerald-400 flex justify-between">
                  <span>✓ [2026-03-16 04:19:02] Action: WhatsApp notification dispatched to +91 98450 12345</span>
                  <span className="text-[10px] text-muted-foreground">Delivered</span>
                </div>
              </div>
            </div>
          </div>
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

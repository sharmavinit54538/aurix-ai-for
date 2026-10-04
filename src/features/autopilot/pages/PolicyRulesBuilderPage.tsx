import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Copy,
  Edit,
  Eye,
  FileCheck,
  Filter,
  Layers,
  Play,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Sliders,
  Sparkles,
  Trash2,
  X,
  XCircle,
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { usePolicyRules } from "../hooks/usePolicyRules";
import type {
  AutopilotWorkflowId,
  PolicyRule,
  RuleCondition,
  RuleConditionOperator,
  RuleConsequenceAction,
} from "../types";

const OPERATOR_LABELS: Record<RuleConditionOperator, string> = {
  eq: "equals (==)",
  neq: "not equals (!=)",
  lte: "less than or equal (<=)",
  gte: "greater than or equal (>=)",
  lt: "less than (<)",
  gt: "greater than (>)",
  in: "is in list",
  contains: "contains text",
};

const ACTION_COLORS: Record<RuleConsequenceAction, { label: string; color: string }> = {
  auto_approve: {
    label: "Auto Approve",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  auto_reject: {
    label: "Auto Reject",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  },
  escalate_to_human: {
    label: "Escalate to Human",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
  flag_for_review: {
    label: "Flag for Review",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
};

export default function PolicyRulesBuilderPage() {
  const {
    rules,
    loading,
    error,
    backendUnavailable,
    selectedWorkflow,
    simulating,
    simulationResult,
    setSelectedWorkflow,
    refetch,
    createRule,
    updateRule,
    deleteRule,
    toggleRuleEnabled,
    simulateRule,
    clearSimulationResult,
  } = usePolicyRules();

  // Rule Editor Dialog
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [ruleName, setRuleName] = useState("");
  const [ruleDescription, setRuleDescription] = useState("");
  const [ruleWorkflow, setRuleWorkflow] = useState<AutopilotWorkflowId>("leave");
  const [rulePriority, setRulePriority] = useState<number>(1);
  const [ruleConditions, setRuleConditions] = useState<RuleCondition[]>([
    { id: "c-0", field: "days", operator: "lte", value: 2 },
  ]);
  const [ruleAction, setRuleAction] = useState<RuleConsequenceAction>("auto_approve");
  const [ruleReason, setRuleReason] = useState("");
  const [ruleConfidence, setRuleConfidence] = useState<number>(90);
  const [rulePolicyClause, setRulePolicyClause] = useState("");

  // Delete Confirm Dialog
  const [deleteConfirmRule, setDeleteConfirmRule] = useState<PolicyRule | null>(null);

  // Simulation Dialog
  const [simulateRuleTarget, setSimulateRuleTarget] = useState<PolicyRule | null>(null);
  const [sampleDataJson, setSampleDataJson] = useState<string>('{\n  "leave_type": "casual",\n  "days": 2,\n  "balance": 5\n}');
  const [jsonError, setJsonError] = useState<string | null>(null);

  const handleOpenCreateModal = () => {
    setEditingRuleId(null);
    setRuleName("");
    setRuleDescription("");
    setRuleWorkflow("leave");
    setRulePriority(rules.length + 1);
    setRuleConditions([{ id: "c-0", field: "days", operator: "lte", value: 2 }]);
    setRuleAction("auto_approve");
    setRuleReason("Routine request satisfying policy parameters.");
    setRuleConfidence(90);
    setRulePolicyClause("Section 4.1 Leave Policy 2026");
    setEditorOpen(true);
  };

  const handleOpenEditModal = (rule: PolicyRule) => {
    setEditingRuleId(rule.id);
    setRuleName(rule.name);
    setRuleDescription(rule.description);
    setRuleWorkflow(rule.workflow);
    setRulePriority(rule.priority);
    setRuleConditions(rule.conditions.length > 0 ? rule.conditions : [{ id: "c-0", field: "days", operator: "lte", value: 2 }]);
    setRuleAction(rule.consequence.action);
    setRuleReason(rule.consequence.reason);
    setRuleConfidence(rule.consequence.confidence);
    setRulePolicyClause(rule.consequence.policyClause);
    setEditorOpen(true);
  };

  const handleAddCondition = () => {
    setRuleConditions((prev) => [
      ...prev,
      { id: `c-${Date.now()}`, field: "balance", operator: "gte", value: 2 },
    ]);
  };

  const handleRemoveCondition = (index: number) => {
    setRuleConditions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateCondition = (index: number, partial: Partial<RuleCondition>) => {
    setRuleConditions((prev) =>
      prev.map((c, i) => (i === index ? { ...c, ...partial } : c)),
    );
  };

  const handleSaveRule = async () => {
    if (!ruleName.trim()) return;

    if (editingRuleId) {
      await updateRule(editingRuleId, {
        name: ruleName.trim(),
        description: ruleDescription.trim(),
        workflow: ruleWorkflow,
        priority: rulePriority,
        conditions: ruleConditions,
        consequence: {
          action: ruleAction,
          reason: ruleReason.trim(),
          confidence: ruleConfidence,
          policyClause: rulePolicyClause.trim(),
        },
      });
    } else {
      await createRule({
        name: ruleName.trim(),
        description: ruleDescription.trim(),
        workflow: ruleWorkflow,
        priority: rulePriority,
        isEnabled: true,
        conditions: ruleConditions,
        consequence: {
          action: ruleAction,
          reason: ruleReason.trim(),
          confidence: ruleConfidence,
          policyClause: rulePolicyClause.trim(),
        },
      });
    }
    setEditorOpen(false);
  };

  const handleOpenSimulate = (rule: PolicyRule) => {
    setSimulateRuleTarget(rule);
    clearSimulationResult();
    setJsonError(null);
    if (rule.workflow === "expense") {
      setSampleDataJson('{\n  "category": "travel",\n  "amount_paise": 450000,\n  "receipt_attached": true\n}');
    } else {
      setSampleDataJson('{\n  "leave_type": "casual",\n  "days": 2,\n  "balance": 4\n}');
    }
  };

  const handleRunSimulation = async () => {
    if (!simulateRuleTarget) return;
    try {
      const parsed = JSON.parse(sampleDataJson);
      setJsonError(null);
      await simulateRule({
        workflow: simulateRuleTarget.workflow,
        ruleId: simulateRuleTarget.id,
        sampleData: parsed,
      });
    } catch {
      setJsonError("Invalid JSON input format. Ensure valid key-value JSON.");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Policy Rules Builder</h1>
            <Badge variant="outline" className="text-xs uppercase font-mono tracking-wider ml-1 bg-primary/5 text-primary border-primary/20">
              Logic Engine
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Author declarative if/then rules for automated approval, rejection, or escalation. Test rules in dry-run simulation before activating.
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
            onClick={handleOpenCreateModal}
            className="rounded-xl h-9 gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            New Policy Rule
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
              The Policy Rules API (<code>/api/v2/autopilot/rules</code>) is pending deployment.
              Rules authored here will sync once the server-side simulation engine is active.
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
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-semibold text-sm">Failed to Load Rules</AlertTitle>
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

      {/* ── Workflow Filter Bar ─────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-border bg-card/40 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">Filter Workflow:</span>
          <Select
            value={selectedWorkflow}
            onValueChange={(val) => setSelectedWorkflow(val as AutopilotWorkflowId | "all")}
          >
            <SelectTrigger className="h-8 w-44 rounded-xl text-xs bg-background/80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl text-xs">
              <SelectItem value="all">All Workflows</SelectItem>
              <SelectItem value="leave">Leave Requests</SelectItem>
              <SelectItem value="expense">Expense Claims</SelectItem>
              <SelectItem value="regularization">Attendance</SelectItem>
              <SelectItem value="onboarding">Onboarding</SelectItem>
              <SelectItem value="payroll_run">Payroll Pre-checks</SelectItem>
              <SelectItem value="recruitment_screening">Screening</SelectItem>
              <SelectItem value="document_generation">Documents</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span className="text-xs text-muted-foreground font-mono">
          {rules.length} Active Rule{rules.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Rules List or Skeletons / Empty State ───────────────────── */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      ) : rules.length === 0 ? (
        <Card className="rounded-2xl border-dashed border-border bg-card/30 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-base font-semibold">No Policy Rules Configured</CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Create automated rules to govern routine HR decisions, or use the recommended default policy thresholds.
          </CardDescription>
          <Button
            size="sm"
            onClick={handleOpenCreateModal}
            className="mt-4 rounded-xl h-8 text-xs gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Create First Rule
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {rules.map((rule) => {
            const actionInfo = ACTION_COLORS[rule.consequence.action] || {
              label: rule.consequence.action,
              color: "bg-muted text-muted-foreground",
            };

            return (
              <Card
                key={rule.id}
                className={`rounded-2xl border-border bg-card/60 backdrop-blur-sm shadow-2xs transition-all overflow-hidden ${
                  !rule.isEnabled ? "opacity-60" : ""
                }`}
              >
                <CardHeader className="pb-3 border-b border-border/40">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-accent text-foreground">
                        <Layers className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-sm font-semibold tracking-tight">
                            {rule.name}
                          </CardTitle>
                          <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-wider">
                            {rule.workflow}
                          </Badge>
                          <Badge variant="secondary" className="text-[10px] font-mono">
                            Priority #{rule.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {rule.description || "No rule description provided."}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {rule.isEnabled ? "Enabled" : "Disabled"}
                        </span>
                        <Switch
                          checked={rule.isEnabled}
                          onCheckedChange={() => void toggleRuleEnabled(rule.id, rule.isEnabled)}
                        />
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenSimulate(rule)}
                        className="rounded-xl h-8 text-xs gap-1.5"
                      >
                        <Play className="h-3 w-3 text-primary" />
                        Test Rule
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditModal(rule)}
                        className="rounded-xl h-8 w-8 p-0"
                      >
                        <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmRule(rule)}
                        className="rounded-xl h-8 w-8 p-0 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-3 pb-3 space-y-2 text-xs">
                  {/* IF Conditions block */}
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/50">
                    <span className="font-mono text-[10px] uppercase font-semibold text-primary block mb-1.5">
                      IF (All Conditions Satisfied):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {rule.conditions.map((cond, idx) => (
                        <div
                          key={cond.id || idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-background text-[11px] font-mono"
                        >
                          <span className="font-semibold text-foreground">{cond.field}</span>
                          <span className="text-muted-foreground">{cond.operator}</span>
                          <span className="text-primary font-bold">
                            {typeof cond.value === "object" ? JSON.stringify(cond.value) : String(cond.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* THEN Consequence block */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-background/60 border border-border/60">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase font-semibold text-muted-foreground">
                        THEN:
                      </span>
                      <Badge variant="outline" className={`text-[10px] px-2 py-0.5 rounded-full ${actionInfo.color}`}>
                        {actionInfo.label}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground italic">
                        "{rule.consequence.reason}"
                      </span>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center font-mono text-[11px]">
                      <span className="text-muted-foreground">{rule.consequence.policyClause}</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {rule.consequence.confidence}% Conf.
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Rule Editor Dialog ──────────────────────────────────────── */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="sm:max-w-[620px] rounded-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {editingRuleId ? "Edit Policy Rule" : "Create New Policy Rule"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define the triggers, thresholds, and resulting automated consequence.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Rule Name</Label>
                <Input
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g. Auto-approve short casual leave"
                  className="rounded-xl text-xs h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Target Workflow</Label>
                <Select
                  value={ruleWorkflow}
                  onValueChange={(val) => setRuleWorkflow(val as AutopilotWorkflowId)}
                >
                  <SelectTrigger className="rounded-xl text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl text-xs">
                    <SelectItem value="leave">Leave Requests</SelectItem>
                    <SelectItem value="expense">Expense Reimbursements</SelectItem>
                    <SelectItem value="regularization">Attendance</SelectItem>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                    <SelectItem value="payroll_run">Payroll</SelectItem>
                    <SelectItem value="recruitment_screening">Screening</SelectItem>
                    <SelectItem value="document_generation">Documents</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Description</Label>
              <Input
                value={ruleDescription}
                onChange={(e) => setRuleDescription(e.target.value)}
                placeholder="Explain the intent and scope of this rule..."
                className="rounded-xl text-xs h-9"
              />
            </div>

            {/* Conditions list builder */}
            <div className="space-y-2 border-t border-border pt-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground">
                  IF Conditions (All must evaluate to true)
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddCondition}
                  className="h-7 text-xs rounded-lg gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Add Condition
                </Button>
              </div>

              <div className="space-y-2">
                {ruleConditions.map((cond, index) => (
                  <div key={cond.id || index} className="flex items-center gap-2">
                    <Input
                      value={cond.field}
                      onChange={(e) => handleUpdateCondition(index, { field: e.target.value })}
                      placeholder="field (e.g. days)"
                      className="rounded-xl text-xs h-8 flex-1"
                    />
                    <Select
                      value={cond.operator}
                      onValueChange={(val) =>
                        handleUpdateCondition(index, { operator: val as RuleConditionOperator })
                      }
                    >
                      <SelectTrigger className="rounded-xl text-xs h-8 w-44">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl text-xs">
                        <SelectItem value="eq">== equals</SelectItem>
                        <SelectItem value="neq">!= not equals</SelectItem>
                        <SelectItem value="lte">&lt;= less/equal</SelectItem>
                        <SelectItem value="gte">&gt;= greater/equal</SelectItem>
                        <SelectItem value="lt">&lt; less than</SelectItem>
                        <SelectItem value="gt">&gt; greater than</SelectItem>
                        <SelectItem value="contains">contains</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={String(cond.value)}
                      onChange={(e) => handleUpdateCondition(index, { value: e.target.value })}
                      placeholder="value"
                      className="rounded-xl text-xs h-8 flex-1"
                    />
                    {ruleConditions.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCondition(index)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-rose-500"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Consequence builder */}
            <div className="space-y-3 border-t border-border pt-3">
              <Label className="text-xs font-semibold text-foreground">
                THEN Consequence
              </Label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Resulting Action</Label>
                  <Select
                    value={ruleAction}
                    onValueChange={(val) => setRuleAction(val as RuleConsequenceAction)}
                  >
                    <SelectTrigger className="rounded-xl text-xs h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl text-xs">
                      <SelectItem value="auto_approve">Auto Approve</SelectItem>
                      <SelectItem value="auto_reject">Auto Reject</SelectItem>
                      <SelectItem value="escalate_to_human">Escalate to Human</SelectItem>
                      <SelectItem value="flag_for_review">Flag for Review</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Confidence Score (%)</Label>
                  <Input
                    type="number"
                    min={50}
                    max={100}
                    value={ruleConfidence}
                    onChange={(e) => setRuleConfidence(Number(e.target.value) || 90)}
                    className="rounded-xl text-xs h-9 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Governing Policy Clause</Label>
                <Input
                  value={rulePolicyClause}
                  onChange={(e) => setRulePolicyClause(e.target.value)}
                  placeholder="e.g. Leave Policy 2026, Section 4.1"
                  className="rounded-xl text-xs h-9 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Decision Reasoning Text</Label>
                <Input
                  value={ruleReason}
                  onChange={(e) => setRuleReason(e.target.value)}
                  placeholder="e.g. Approved routine casual leave within 2-day policy threshold."
                  className="rounded-xl text-xs h-9"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 border-t border-border pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditorOpen(false)}
              className="rounded-xl h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void handleSaveRule()}
              disabled={!ruleName.trim()}
              className="rounded-xl h-9 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dry-Run Test Simulation Panel ───────────────────────────── */}
      <Dialog open={!!simulateRuleTarget} onOpenChange={(open) => !open && setSimulateRuleTarget(null)}>
        <DialogContent className="sm:max-w-[580px] rounded-2xl max-h-[85vh] overflow-y-auto">
          {simulateRuleTarget && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 text-primary text-xs font-mono uppercase tracking-wider mb-1">
                  <Play className="h-4 w-4" />
                  <span>Dry-Run Simulation</span>
                </div>
                <DialogTitle className="text-base font-semibold">
                  Test Rule: {simulateRuleTarget.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Simulate rule execution against arbitrary request payload to verify condition matches and consequence output without mutating live data.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 my-2 text-xs">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Sample Payload (JSON)</Label>
                  <Textarea
                    rows={5}
                    value={sampleDataJson}
                    onChange={(e) => setSampleDataJson(e.target.value)}
                    className="font-mono text-xs rounded-xl"
                  />
                  {jsonError && <p className="text-rose-500 text-[11px]">{jsonError}</p>}
                </div>

                <Button
                  type="button"
                  onClick={() => void handleRunSimulation()}
                  disabled={simulating}
                  className="rounded-xl h-8 text-xs gap-1.5 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Play className="h-3.5 w-3.5" />
                  {simulating ? "Evaluating..." : "Execute Simulation"}
                </Button>

                {/* Simulation Result Presentation */}
                {simulationResult && (
                  <div className="p-3.5 rounded-xl border border-border bg-muted/40 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="font-semibold text-xs flex items-center gap-1.5">
                        {simulationResult.matched ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-500" />
                        )}
                        Rule Matched: {simulationResult.matched ? "YES" : "NO"}
                      </span>
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {simulationResult.confidence}% Conf.
                      </Badge>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div>
                        <strong>Action Output:</strong>{" "}
                        <Badge variant="secondary" className="text-[10px] ml-1">
                          {simulationResult.action}
                        </Badge>
                      </div>
                      <div>
                        <strong>Reasoning:</strong> {simulationResult.reasoning}
                      </div>
                      <div>
                        <strong>Policy Clause:</strong> {simulationResult.policyClause}
                      </div>
                    </div>

                    {simulationResult.evaluatedConditions?.length > 0 && (
                      <div className="border-t border-border/40 pt-2 space-y-1">
                        <span className="font-mono text-[10px] text-muted-foreground uppercase">
                          Condition Breakdown:
                        </span>
                        {simulationResult.evaluatedConditions.map((ec, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-[11px] font-mono"
                          >
                            <span>
                              {ec.field} {ec.operator} {String(ec.expected)} (actual: {String(ec.actual)})
                            </span>
                            <span className={ec.passed ? "text-emerald-500" : "text-rose-500"}>
                              {ec.passed ? "PASSED" : "FAILED"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter className="border-t border-border pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSimulateRuleTarget(null)}
                  className="rounded-xl h-9 text-xs"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ─────────────────────────────── */}
      <Dialog open={!!deleteConfirmRule} onOpenChange={(open) => !open && setDeleteConfirmRule(null)}>
        <DialogContent className="sm:max-w-[420px] rounded-2xl">
          <DialogHeader>
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-600 mb-1">
              <Trash2 className="h-5 w-5" />
            </div>
            <DialogTitle className="text-center text-base font-semibold">Delete Policy Rule</DialogTitle>
            <DialogDescription className="text-center text-xs text-muted-foreground">
              Are you sure you want to delete "{deleteConfirmRule?.name}"? Future requests will no longer be evaluated against these conditions.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 border-t border-border pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteConfirmRule(null)}
              className="rounded-xl h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={async () => {
                if (deleteConfirmRule) {
                  await deleteRule(deleteConfirmRule.id);
                  setDeleteConfirmRule(null);
                }
              }}
              className="rounded-xl h-9 text-xs"
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

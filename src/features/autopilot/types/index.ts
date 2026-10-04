/**
 * Autopilot HR - Core Types and Models
 *
 * Defines frontend domain models (camelCase) and raw backend contracts (snake_case)
 * adhering to integer paise money, ISO 8601 timestamps, maker-checker safety,
 * and default-deny human verification boundaries.
 */

// ── Workflows & Autonomy Levels ───────────────────────────────────────
export type AutopilotWorkflowId =
  | "leave"
  | "expense"
  | "regularization"
  | "onboarding"
  | "payroll_run"
  | "recruitment_screening"
  | "document_generation";

export type AutonomyLevel = "suggest_only" | "auto_with_review" | "full_auto";

export interface WorkflowThresholds {
  maxLeaveDays: number;
  maxExpenseAmountPaise: number;
  confidenceMinimum: number; // 0-100
  autoRejectBelowConfidence?: number;
}

export interface AutonomyWorkflowSetting {
  workflowId: AutopilotWorkflowId;
  name: string;
  description: string;
  level: AutonomyLevel;
  thresholds: WorkflowThresholds;
  lastUpdated?: string;
  updatedBy?: string;
}

/**
 * Hard Safety: These actions must NEVER be taken without a human.
 * Must be hard-coded as "always human" in the UI and blocked from automation.
 */
export interface RestrictedHumanAction {
  id: string;
  name: string;
  description: string;
  enforcedBy: "system_policy" | "compliance" | "legal";
}

export const ALWAYS_HUMAN_ACTIONS: RestrictedHumanAction[] = [
  {
    id: "termination",
    name: "Termination of Employment",
    description: "Employee involuntary separation, termination, or exit clearance sign-off.",
    enforcedBy: "legal",
  },
  {
    id: "disciplinary_action",
    name: "Disciplinary Action",
    description: "Issuance of show-cause notices, PIPs, suspension, or reprimands.",
    enforcedBy: "compliance",
  },
  {
    id: "salary_change",
    name: "Salary & Compensation Revision",
    description: "Base pay adjustments, increments, band changes, or compensation structure edits.",
    enforcedBy: "compliance",
  },
  {
    id: "payroll_final_approval",
    name: "Payroll Final Approval & Release",
    description: "Bank payout batch authorization, final run lock, and statutory submission.",
    enforcedBy: "system_policy",
  },
  {
    id: "grievance_posh",
    name: "Grievance & POSH Decisions",
    description: "Formal complaints, harassment investigations, and disciplinary committee outcomes.",
    enforcedBy: "legal",
  },
];

export interface AutonomySettings {
  workflows: Record<AutopilotWorkflowId, AutonomyWorkflowSetting>;
  restrictedActions: RestrictedHumanAction[];
  updatedAt: string;
  updatedBy: string;
}

// ── Policy Rules Builder ─────────────────────────────────────────────
export type RuleConditionOperator =
  | "eq"
  | "neq"
  | "lte"
  | "gte"
  | "lt"
  | "gt"
  | "in"
  | "contains";

export interface RuleCondition {
  id: string;
  field: string;
  operator: RuleConditionOperator;
  value: string | number | boolean | string[];
}

export type RuleConsequenceAction =
  | "auto_approve"
  | "auto_reject"
  | "escalate_to_human"
  | "flag_for_review";

export interface RuleConsequence {
  action: RuleConsequenceAction;
  reason: string;
  confidence: number; // 0-100
  policyClause: string;
}

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  workflow: AutopilotWorkflowId;
  priority: number;
  isEnabled: boolean;
  conditions: RuleCondition[];
  consequence: RuleConsequence;
  createdAt: string;
  updatedAt: string;
}

export interface RuleSimulateRequest {
  workflow: AutopilotWorkflowId;
  ruleId?: string;
  sampleData: Record<string, unknown>;
}

export interface RuleSimulateResult {
  matched: boolean;
  ruleId?: string;
  ruleName?: string;
  action: RuleConsequenceAction;
  confidence: number;
  policyClause: string;
  reasoning: string;
  evaluatedConditions: Array<{
    field: string;
    operator: RuleConditionOperator;
    expected: unknown;
    actual: unknown;
    passed: boolean;
  }>;
}

// ── Exceptions Inbox ─────────────────────────────────────────────────
export type ExceptionUrgency = "low" | "medium" | "high" | "critical";
export type ExceptionStatus = "pending" | "approved" | "rejected" | "reassigned";

export interface RequesterInfo {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  department: string;
  designation?: string;
}

export interface AutopilotException {
  id: string;
  workflow: AutopilotWorkflowId;
  subject: string;
  requestId: string;
  requester: RequesterInfo;
  details: Record<string, unknown>;
  escalationReason: string;
  suggestedDecision: "approve" | "reject" | "escalate" | "review";
  confidence: number; // 0-100
  policyClause: string;
  status: ExceptionStatus;
  urgency: ExceptionUrgency;
  createdAt: string;
  assignedTo?: {
    id: string;
    name: string;
  };
}

export interface ExceptionDecisionPayload {
  decision: "approve" | "reject" | "reassign";
  reason: string; // Must be >= 10 chars
  reassignedToUserId?: string;
}

// ── HR Agent Chat That Acts ──────────────────────────────────────────
export type ToolActionState = "proposed" | "running" | "done" | "failed" | "cancelled";

export type AgentActionType =
  | "apply_leave"
  | "send_payslip"
  | "generate_document"
  | "regularize_attendance"
  | "submit_expense"
  | string;

export interface AgentActionToolCall {
  id: string;
  actionType?: AgentActionType;
  action?: string;
  tool?: string;
  title?: string;
  parameters: Record<string, unknown>;
  effect?: string;
  expectedEffect?: string;
  state?: ToolActionState;
  status?: ToolActionState;
  createdAt?: string;
  resultRecord?: {
    type: string;
    id: string;
    label: string;
    url: string;
  };
  result?: {
    success?: boolean;
    recordId?: string;
    recordType?: string;
    recordUrl?: string;
    message?: string;
    canUndo?: boolean;
    undoActionId?: string;
  };
  undoable?: boolean;
  undone?: boolean;
  canUndo?: boolean;
  errorMessage?: string;
  error?: string;
  success?: boolean;
  recordId?: string;
  recordType?: string;
  recordUrl?: string;
  message?: string;
  undoActionId?: string;
}

export type AgentToolCall = AgentActionToolCall;

export interface AgentChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  toolCall?: AgentActionToolCall;
}

// ── AI Action Audit Log ──────────────────────────────────────────────
export type AuditDecision = "auto_approved" | "auto_rejected" | "escalated" | "executed_task";
export type AuditStatus = "active" | "undone" | "overridden";

export interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO
  workflow: AutopilotWorkflowId;
  subject: string;
  actionTaken: string;
  decision: AuditDecision;
  confidence: number; // 0-100
  ruleId?: string;
  ruleName?: string;
  policyClause: string;
  fullReasoning: string;
  evidence: Record<string, unknown>;
  targetRecord: {
    type: string;
    id: string;
    name: string;
    link?: string;
  };
  status: AuditStatus;
  overrideBy?: {
    id: string;
    name: string;
    email: string;
  };
  overrideReason?: string;
  overrideAt?: string;
  undoBy?: {
    id: string;
    name: string;
  };
  undoAt?: string;
  canUndo: boolean;
  canOverride: boolean;
  message?: string;
}

// ── Proactive Alerts Center ──────────────────────────────────────────
export type AlertCategory =
  | "attrition_risk"
  | "burnout_signal"
  | "attendance_anomaly"
  | "payroll_variance"
  | "compliance_deadline";

export type AlertSeverity = "low" | "medium" | "high" | "critical" | "warning" | "info";
export type AlertStatus = "active" | "acknowledged" | "snoozed" | "resolved";

export interface AlertEvidenceItem {
  key: string;
  value: string | number;
}

export interface ProactiveAlert {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  title: string;
  description: string;
  employee?: {
    id: string;
    name: string;
    department: string;
  };
  evidence: AlertEvidenceItem[] | Record<string, unknown>;
  suggestedNextStep?: string;
  suggestedAction?: string;
  status: AlertStatus;
  snoozedUntil?: string;
  createdAt: string;
  taskId?: string;
}

export type AutopilotAlert = ProactiveAlert;

// ── Autopilot Dashboard Overview ─────────────────────────────────────
export interface MetricValue<T> {
  value: T;
  available: boolean;
  unit?: string;
  changePercent?: number;
  description?: string;
}

export interface MonthlyAutopilotTrend {
  month: string;
  autoResolved: number;
  exceptions: number;
  escalated?: number;
  overridden: number;
  hoursSaved: number;
}

export interface AutopilotOverview {
  autoResolvedPercentage: MetricValue<number>;
  autoResolvedPercent?: MetricValue<number>;
  exceptionsPending: MetricValue<number>;
  hoursSaved: MetricValue<number>;
  overrideRatePercentage: MetricValue<number>;
  overrideRate?: MetricValue<number>;
  history12Months: MonthlyAutopilotTrend[];
  timeSeries12Months?: MonthlyAutopilotTrend[];
  lastUpdated?: string;
}

// ── Auto Onboarding & Auto Payroll Panels ────────────────────────────
export type OnboardingStepType =
  | "documents"
  | "assets"
  | "accounts"
  | "welcome_mail"
  | "training";

export type OnboardingStepStatus = "pending" | "running" | "in_progress" | "completed" | "failed";

export interface OnboardingStep {
  id?: string;
  step: OnboardingStepType;
  label: string;
  status: OnboardingStepStatus;
  errorMessage?: string;
  error?: string;
  completedAt?: string;
  canRetry?: boolean;
}

export interface AutoOnboardingRun {
  id: string;
  candidateId?: string;
  candidateName?: string;
  employeeId?: string;
  employeeName?: string;
  jobTitle?: string;
  role?: string;
  department: string;
  startDate?: string;
  offerAcceptedAt?: string;
  currentStep?: OnboardingStepType;
  status: "in_progress" | "completed" | "has_failures" | "failed";
  steps: OnboardingStep[];
}

export type OnboardingStepId = OnboardingStepType;
export type AutoStepStatus = OnboardingStepStatus;
export type AutoOnboardingStep = OnboardingStep;

export type PayrollStageName =
  | "attendance_sync"
  | "variable_inputs"
  | "calculation"
  | "validation"
  | "anomaly_check";

export type PayrollStageStatus = "pending" | "in_progress" | "completed" | "flagged" | "failed";

export interface PayrollStage {
  id?: PayrollStageName;
  stage?: PayrollStageName;
  name?: string;
  label?: string;
  status: PayrollStageStatus;
  summary?: string;
  description?: string;
  anomaliesDetected?: number;
  anomaliesFound?: number;
}

export interface AutoPayrollStatus {
  runId?: string;
  id?: string;
  payrollCycle?: string;
  month: string;
  year?: number;
  overallStatus?: "running" | "ready_for_review" | "flagged" | "completed" | "in_progress" | "approved" | "failed";
  status?: "running" | "ready_for_review" | "flagged" | "completed" | "in_progress" | "approved" | "failed";
  stages: PayrollStage[];
  canApprove?: boolean;
  canReviewAndApprove?: boolean;
  approvalRoute?: string;
  makerCheckerNote?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export type AutoPayrollRunStatus = AutoPayrollStatus;
export type AutoPayrollStage = PayrollStage;
export type PayrollStageId = PayrollStageName;

// ─────────────────────────────────────────────────────────────────────
// Backend Raw Contracts (snake_case)
// ─────────────────────────────────────────────────────────────────────

export interface BackendWorkflowThresholds {
  max_leave_days: number;
  max_expense_amount_paise: number;
  confidence_minimum: number;
  auto_reject_below_confidence?: number;
}

export interface BackendWorkflowSetting {
  workflow_id: string;
  name: string;
  description: string;
  level: string;
  thresholds: BackendWorkflowThresholds;
  last_updated?: string;
  updated_by?: string;
}

export interface BackendAutonomySettings {
  workflows?: Record<string, BackendWorkflowSetting>;
  restricted_actions?: Array<{
    id: string;
    name: string;
    description: string;
    enforced_by: string;
  }>;
  updated_at?: string;
  updated_by?: string;
}

export interface BackendRuleCondition {
  id?: string;
  field: string;
  operator: string;
  value: unknown;
}

export interface BackendRuleConsequence {
  action: string;
  reason: string;
  confidence: number;
  policy_clause: string;
}

export interface BackendPolicyRule {
  id: string;
  name: string;
  description?: string;
  workflow: string;
  priority: number;
  is_enabled: boolean;
  conditions: BackendRuleCondition[];
  consequence: BackendRuleConsequence;
  created_at: string;
  updated_at: string;
}

export interface BackendAutopilotException {
  id: string;
  workflow: string;
  subject: string;
  request_id: string;
  requester: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
    department: string;
    designation?: string;
  };
  details: Record<string, unknown>;
  escalation_reason: string;
  suggested_decision: string;
  confidence: number;
  policy_clause: string;
  status: string;
  urgency: string;
  created_at: string;
  assigned_to?: {
    id: string;
    name: string;
  };
}

export interface BackendAgentAction {
  id: string;
  action_type: string;
  title: string;
  parameters: Record<string, unknown>;
  effect: string;
  state: string;
  created_at: string;
  result_record?: {
    type: string;
    id: string;
    label: string;
    url: string;
  };
  undoable: boolean;
  undone: boolean;
  error_message?: string;
}

export interface BackendAuditLogEntry {
  id: string;
  timestamp: string;
  workflow: string;
  subject: string;
  action_taken: string;
  decision: string;
  confidence: number;
  rule_id?: string;
  rule_name?: string;
  policy_clause: string;
  full_reasoning: string;
  evidence: Record<string, unknown>;
  target_record: {
    type: string;
    id: string;
    name: string;
    link?: string;
  };
  status: string;
  override_by?: {
    id: string;
    name: string;
    email: string;
  };
  override_reason?: string;
  override_at?: string;
  undo_by?: {
    id: string;
    name: string;
  };
  undo_at?: string;
  can_undo?: boolean;
  can_override?: boolean;
}

export interface BackendProactiveAlert {
  id: string;
  category: string;
  severity: string;
  title: string;
  description: string;
  employee?: {
    id: string;
    name: string;
    department: string;
  };
  evidence?: Array<{ key: string; value: string | number }>;
  suggested_next_step?: string;
  status: string;
  snoozed_until?: string;
  created_at: string;
  task_id?: string;
}

export interface BackendAutopilotOverview {
  auto_resolved_percentage: { value: number; available: boolean };
  exceptions_pending: { value: number; available: boolean };
  hours_saved: { value: number; available: boolean };
  override_rate_percentage: { value: number; available: boolean };
  history_12_months: Array<{
    month: string;
    auto_resolved: number;
    escalated: number;
    overridden: number;
    hours_saved: number;
  }>;
}

export interface BackendOnboardingRun {
  id: string;
  candidate_id: string;
  candidate_name: string;
  job_title: string;
  department: string;
  start_date: string;
  status: string;
  steps: Array<{
    id: string;
    step: string;
    label: string;
    status: string;
    error_message?: string;
    completed_at?: string;
  }>;
}

export interface BackendPayrollStatus {
  run_id: string;
  month: string;
  year: number;
  overall_status: string;
  stages: Array<{
    id: string;
    name: string;
    status: string;
    summary: string;
    anomalies_detected?: number;
  }>;
  can_approve: boolean;
  reviewed_by?: string;
  reviewed_at?: string;
}

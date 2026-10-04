/**
 * Autopilot HR - Mappers
 * Bidirectional transformers between backend snake_case and frontend camelCase models.
 */

import {
  ALWAYS_HUMAN_ACTIONS,
  type AlertCategory,
  type AlertSeverity,
  type AlertStatus,
  type AuditDecision,
  type AuditStatus,
  type AutopilotException,
  type AutopilotOverview,
  type AutopilotWorkflowId,
  type AutonomyLevel,
  type AutonomySettings,
  type AutonomyWorkflowSetting,
  type BackendAgentAction,
  type BackendAuditLogEntry,
  type BackendAutopilotException,
  type BackendAutopilotOverview,
  type BackendAutonomySettings,
  type BackendOnboardingRun,
  type BackendPayrollStatus,
  type BackendPolicyRule,
  type BackendProactiveAlert,
  type BackendRuleCondition,
  type BackendWorkflowSetting,
  type AutoOnboardingRun,
  type AutoPayrollStatus,
  type AgentActionToolCall,
  type AuditLogEntry,
  type OnboardingStepStatus,
  type OnboardingStepType,
  type PayrollStageName,
  type PayrollStageStatus,
  type PolicyRule,
  type ProactiveAlert,
  type RuleCondition,
  type RuleConditionOperator,
  type RuleConsequence,
  type RuleConsequenceAction,
} from "../types";

export const DEFAULT_WORKFLOW_SETTINGS: Record<AutopilotWorkflowId, AutonomyWorkflowSetting> = {
  leave: {
    workflowId: "leave",
    name: "Leave Requests",
    description: "Approve routine casual and sick leaves adhering to balance policies.",
    level: "auto_with_review",
    thresholds: {
      maxLeaveDays: 2,
      maxExpenseAmountPaise: 0,
      confidenceMinimum: 85,
      autoRejectBelowConfidence: 40,
    },
  },
  expense: {
    workflowId: "expense",
    name: "Expense Reimbursements",
    description: "Validate receipts, policy caps, and merchant limits for routine expenses.",
    level: "auto_with_review",
    thresholds: {
      maxLeaveDays: 0,
      maxExpenseAmountPaise: 500000, // ₹5,000 in integer paise
      confidenceMinimum: 90,
      autoRejectBelowConfidence: 40,
    },
  },
  regularization: {
    workflowId: "regularization",
    name: "Attendance Regularization",
    description: "Auto-adjust swipe omissions within monthly grace allowances.",
    level: "auto_with_review",
    thresholds: {
      maxLeaveDays: 0,
      maxExpenseAmountPaise: 0,
      confidenceMinimum: 80,
    },
  },
  onboarding: {
    workflowId: "onboarding",
    name: "Employee Onboarding Workflow",
    description: "Trigger document requests, workspace provisioning, and welcome communications.",
    level: "auto_with_review",
    thresholds: {
      maxLeaveDays: 0,
      maxExpenseAmountPaise: 0,
      confidenceMinimum: 85,
    },
  },
  payroll_run: {
    workflowId: "payroll_run",
    name: "Payroll Calculation & Pre-checks",
    description: "Assemble attendance sync and variable inputs; leaves final bank release to HR admin.",
    level: "suggest_only",
    thresholds: {
      maxLeaveDays: 0,
      maxExpenseAmountPaise: 0,
      confidenceMinimum: 95,
    },
  },
  recruitment_screening: {
    workflowId: "recruitment_screening",
    name: "Resume & Candidate Screening",
    description: "Evaluate candidate profiles against job requirements and recommend shortlists.",
    level: "suggest_only",
    thresholds: {
      maxLeaveDays: 0,
      maxExpenseAmountPaise: 0,
      confidenceMinimum: 80,
    },
  },
  document_generation: {
    workflowId: "document_generation",
    name: "HR Letter & Document Issuance",
    description: "Generate standard experience, bona fide, and employment verification letters.",
    level: "auto_with_review",
    thresholds: {
      maxLeaveDays: 0,
      maxExpenseAmountPaise: 0,
      confidenceMinimum: 88,
    },
  },
};

export function mapWorkflowSettingFromBackend(
  workflowId: AutopilotWorkflowId,
  raw?: BackendWorkflowSetting,
): AutonomyWorkflowSetting {
  const fallback = DEFAULT_WORKFLOW_SETTINGS[workflowId];
  if (!raw) return fallback;

  return {
    workflowId,
    name: raw.name || fallback.name,
    description: raw.description || fallback.description,
    level: (raw.level || fallback.level) as AutonomyLevel,
    thresholds: {
      maxLeaveDays: Number(raw.thresholds?.max_leave_days ?? fallback.thresholds.maxLeaveDays),
      maxExpenseAmountPaise: Number(
        raw.thresholds?.max_expense_amount_paise ?? fallback.thresholds.maxExpenseAmountPaise,
      ),
      confidenceMinimum: Number(
        raw.thresholds?.confidence_minimum ?? fallback.thresholds.confidenceMinimum,
      ),
      autoRejectBelowConfidence:
        raw.thresholds?.auto_reject_below_confidence !== undefined
          ? Number(raw.thresholds.auto_reject_below_confidence)
          : fallback.thresholds.autoRejectBelowConfidence,
    },
    lastUpdated: raw.last_updated,
    updatedBy: raw.updated_by,
  };
}

export function mapAutonomySettingsFromBackend(raw?: Partial<BackendAutonomySettings>): AutonomySettings {
  const workflowsRaw = raw?.workflows || {};
  const workflows: Record<AutopilotWorkflowId, AutonomyWorkflowSetting> = { ...DEFAULT_WORKFLOW_SETTINGS };

  (Object.keys(DEFAULT_WORKFLOW_SETTINGS) as AutopilotWorkflowId[]).forEach((wId) => {
    workflows[wId] = mapWorkflowSettingFromBackend(wId, workflowsRaw[wId]);
  });

  return {
    workflows,
    restrictedActions: ALWAYS_HUMAN_ACTIONS,
    updatedAt: raw?.updated_at || new Date().toISOString(),
    updatedBy: raw?.updated_by || "System Policy",
  };
}

export function mapAutonomySettingsToBackend(
  settings: AutonomySettings,
): BackendAutonomySettings {
  const workflows: Record<string, BackendWorkflowSetting> = {};

  (Object.keys(settings.workflows) as AutopilotWorkflowId[]).forEach((wId) => {
    const item = settings.workflows[wId];
    workflows[wId] = {
      workflow_id: item.workflowId,
      name: item.name,
      description: item.description,
      level: item.level,
      thresholds: {
        max_leave_days: item.thresholds.maxLeaveDays,
        max_expense_amount_paise: item.thresholds.maxExpenseAmountPaise,
        confidence_minimum: item.thresholds.confidenceMinimum,
        auto_reject_below_confidence: item.thresholds.autoRejectBelowConfidence,
      },
      last_updated: item.lastUpdated,
      updated_by: item.updatedBy,
    };
  });

  return {
    workflows,
    updated_at: new Date().toISOString(),
    updated_by: settings.updatedBy,
  };
}

// ── Policy Rules Mappers ─────────────────────────────────────────────
export function mapPolicyRuleFromBackend(raw: Partial<BackendPolicyRule>): PolicyRule {
  return {
    id: String(raw.id || ""),
    name: String(raw.name || "Untitled Rule"),
    description: String(raw.description || ""),
    workflow: (raw.workflow || "leave") as AutopilotWorkflowId,
    priority: Number(raw.priority ?? 1),
    isEnabled: Boolean(raw.is_enabled ?? true),
    conditions: Array.isArray(raw.conditions)
      ? raw.conditions.map((c: BackendRuleCondition, index: number): RuleCondition => ({
          id: String(c.id || `c-${index}`),
          field: String(c.field || ""),
          operator: (c.operator || "eq") as RuleConditionOperator,
          value: c.value as RuleCondition["value"],
        }))
      : [],
    consequence: {
      action: (raw.consequence?.action || "escalate_to_human") as RuleConsequenceAction,
      reason: String(raw.consequence?.reason || ""),
      confidence: Number(raw.consequence?.confidence ?? 80),
      policyClause: String(raw.consequence?.policy_clause || ""),
    },
    createdAt: raw.created_at || new Date().toISOString(),
    updatedAt: raw.updated_at || new Date().toISOString(),
  };
}

export function mapPolicyRuleToBackend(rule: Partial<PolicyRule>): Partial<BackendPolicyRule> {
  const result: Partial<BackendPolicyRule> = {};
  if (rule.id) result.id = rule.id;
  if (rule.name !== undefined) result.name = rule.name;
  if (rule.description !== undefined) result.description = rule.description;
  if (rule.workflow !== undefined) result.workflow = rule.workflow;
  if (rule.priority !== undefined) result.priority = rule.priority;
  if (rule.isEnabled !== undefined) result.is_enabled = rule.isEnabled;
  if (rule.conditions !== undefined) {
    result.conditions = rule.conditions.map((c) => ({
      id: c.id,
      field: c.field,
      operator: c.operator,
      value: c.value,
    }));
  }
  if (rule.consequence) {
    result.consequence = {
      action: rule.consequence.action,
      reason: rule.consequence.reason,
      confidence: rule.consequence.confidence,
      policy_clause: rule.consequence.policyClause,
    };
  }
  return result;
}

// ── Exceptions Mappers ───────────────────────────────────────────────
export function mapExceptionFromBackend(raw: Partial<BackendAutopilotException>): AutopilotException {
  return {
    id: String(raw.id || ""),
    workflow: (raw.workflow || "leave") as AutopilotWorkflowId,
    subject: String(raw.subject || "Pending Request"),
    requestId: String(raw.request_id || ""),
    requester: {
      id: String(raw.requester?.id || ""),
      name: String(raw.requester?.name || "Anonymous Requester"),
      email: String(raw.requester?.email || ""),
      avatarUrl: raw.requester?.avatar_url,
      department: String(raw.requester?.department || "General"),
      designation: raw.requester?.designation,
    },
    details: raw.details || {},
    escalationReason: String(raw.escalation_reason || "Requires human review."),
    suggestedDecision: (raw.suggested_decision || "review") as "approve" | "reject" | "escalate" | "review",
    confidence: Number(raw.confidence ?? 70),
    policyClause: String(raw.policy_clause || "Standard Operating Procedure"),
    status: (raw.status || "pending") as "pending" | "approved" | "rejected" | "reassigned",
    urgency: (raw.urgency || "medium") as "low" | "medium" | "high" | "critical",
    createdAt: raw.created_at || new Date().toISOString(),
    assignedTo: raw.assigned_to
      ? {
          id: String(raw.assigned_to.id),
          name: String(raw.assigned_to.name),
        }
      : undefined,
  };
}

// ── Agent Action Tool Calls ──────────────────────────────────────────
export function mapAgentActionFromBackend(raw: Partial<BackendAgentAction>): AgentActionToolCall {
  return {
    id: String(raw.id || ""),
    actionType: raw.action_type || "apply_leave",
    title: String(raw.title || "Proposed Action"),
    parameters: raw.parameters || {},
    effect: String(raw.effect || ""),
    state: (raw.state || "proposed") as "proposed" | "running" | "done" | "failed" | "cancelled",
    createdAt: raw.created_at || new Date().toISOString(),
    resultRecord: raw.result_record
      ? {
          type: String(raw.result_record.type),
          id: String(raw.result_record.id),
          label: String(raw.result_record.label),
          url: String(raw.result_record.url),
        }
      : undefined,
    undoable: Boolean(raw.undoable ?? false),
    undone: Boolean(raw.undone ?? false),
    errorMessage: raw.error_message,
  };
}

// ── Audit Log Mappers ────────────────────────────────────────────────
export function mapAuditLogFromBackend(raw: Partial<BackendAuditLogEntry>): AuditLogEntry {
  return {
    id: String(raw.id || ""),
    timestamp: raw.timestamp || new Date().toISOString(),
    workflow: (raw.workflow || "leave") as AutopilotWorkflowId,
    subject: String(raw.subject || ""),
    actionTaken: String(raw.action_taken || ""),
    decision: (raw.decision || "auto_approved") as AuditDecision,
    confidence: Number(raw.confidence ?? 90),
    ruleId: raw.rule_id,
    ruleName: raw.rule_name,
    policyClause: String(raw.policy_clause || "Policy Standard"),
    fullReasoning: String(raw.full_reasoning || ""),
    evidence: raw.evidence || {},
    targetRecord: {
      type: String(raw.target_record?.type || "record"),
      id: String(raw.target_record?.id || ""),
      name: String(raw.target_record?.name || "Item"),
      link: raw.target_record?.link,
    },
    status: (raw.status || "active") as AuditStatus,
    overrideBy: raw.override_by
      ? {
          id: String(raw.override_by.id),
          name: String(raw.override_by.name),
          email: String(raw.override_by.email),
        }
      : undefined,
    overrideReason: raw.override_reason,
    overrideAt: raw.override_at,
    undoBy: raw.undo_by
      ? {
          id: String(raw.undo_by.id),
          name: String(raw.undo_by.name),
        }
      : undefined,
    undoAt: raw.undo_at,
    canUndo: Boolean(raw.can_undo ?? true),
    canOverride: Boolean(raw.can_override ?? true),
  };
}

// ── Proactive Alerts Mappers ─────────────────────────────────────────
export function mapAlertFromBackend(raw: Partial<BackendProactiveAlert>): ProactiveAlert {
  return {
    id: String(raw.id || ""),
    category: (raw.category || "attrition_risk") as AlertCategory,
    severity: (raw.severity || "medium") as AlertSeverity,
    title: String(raw.title || "Alert"),
    description: String(raw.description || ""),
    employee: raw.employee
      ? {
          id: String(raw.employee.id),
          name: String(raw.employee.name),
          department: String(raw.employee.department),
        }
      : undefined,
    evidence: Array.isArray(raw.evidence)
      ? raw.evidence.map((e) => ({ key: String(e.key), value: e.value }))
      : [],
    suggestedNextStep: String(raw.suggested_next_step || ""),
    status: (raw.status || "active") as AlertStatus,
    snoozedUntil: raw.snoozed_until,
    createdAt: raw.created_at || new Date().toISOString(),
    taskId: raw.task_id,
  };
}

// ── Overview Mappers ─────────────────────────────────────────────────
export function mapOverviewFromBackend(raw: Partial<BackendAutopilotOverview>): AutopilotOverview {
  return {
    autoResolvedPercentage: {
      value: Number(raw?.auto_resolved_percentage?.value ?? 0),
      available: Boolean(raw?.auto_resolved_percentage?.available ?? true),
    },
    exceptionsPending: {
      value: Number(raw?.exceptions_pending?.value ?? 0),
      available: Boolean(raw?.exceptions_pending?.available ?? true),
    },
    hoursSaved: {
      value: Number(raw?.hours_saved?.value ?? 0),
      available: Boolean(raw?.hours_saved?.available ?? true),
    },
    overrideRatePercentage: {
      value: Number(raw?.override_rate_percentage?.value ?? 0),
      available: Boolean(raw?.override_rate_percentage?.available ?? true),
    },
    history12Months: Array.isArray(raw?.history_12_months)
      ? raw.history_12_months.map((m) => ({
          month: String(m.month || ""),
          autoResolved: Number(m.auto_resolved ?? 0),
          exceptions: Number(m.escalated ?? 0),
          escalated: Number(m.escalated ?? 0),
          overridden: Number(m.overridden ?? 0),
          hoursSaved: Number(m.hours_saved ?? 0),
        }))
      : [],
  };
}

// ── Onboarding & Payroll Mappers ─────────────────────────────────────
export function mapOnboardingRunFromBackend(raw: Partial<BackendOnboardingRun>): AutoOnboardingRun {
  return {
    id: String(raw.id || ""),
    candidateId: String(raw.candidate_id || ""),
    candidateName: String(raw.candidate_name || "New Hire"),
    jobTitle: String(raw.job_title || ""),
    department: String(raw.department || ""),
    startDate: raw.start_date || new Date().toISOString(),
    status: (raw.status || "in_progress") as AutoOnboardingRun["status"],
    steps: Array.isArray(raw.steps)
      ? raw.steps.map((s) => ({
          id: String(s.id),
          step: s.step as OnboardingStepType,
          label: String(s.label),
          status: s.status as OnboardingStepStatus,
          errorMessage: s.error_message,
          completedAt: s.completed_at,
        }))
      : [],
  };
}

export function mapPayrollStatusFromBackend(raw: Partial<BackendPayrollStatus>): AutoPayrollStatus {
  return {
    runId: String(raw?.run_id || ""),
    month: String(raw?.month || ""),
    year: Number(raw?.year || new Date().getFullYear()),
    overallStatus: (raw?.overall_status || "running") as AutoPayrollStatus["overallStatus"],
    stages: Array.isArray(raw?.stages)
      ? raw.stages.map((st) => ({
          id: st.id as PayrollStageName,
          name: String(st.name),
          status: st.status as PayrollStageStatus,
          summary: String(st.summary || ""),
          anomaliesDetected: Number(st.anomalies_detected ?? 0),
        }))
      : [],
    canApprove: Boolean(raw?.can_approve ?? false),
    reviewedBy: raw?.reviewed_by,
    reviewedAt: raw?.reviewed_at,
  };
}

// ── CSV Formula Injection Sanitizer ──────────────────────────────────
/**
 * Neutralizes potential CSV formula injection attacks by prepending an apostrophe (')
 * if the text begins with dangerous spreadsheet formula triggers: =, +, -, @, \t, \r.
 */
export function sanitizeCsvField(field: unknown): string {
  if (field === null || field === undefined) return "";
  const str = String(field);
  const dangerousChars = ["=", "+", "-", "@", "\t", "\r"];
  if (dangerousChars.some((char) => str.startsWith(char))) {
    return `'${str}`;
  }
  return str;
}

import { describe, expect, it } from "vitest";
import {
  mapAutonomySettingsFromBackend,
  mapAutonomySettingsToBackend,
  mapPolicyRuleFromBackend,
  mapPolicyRuleToBackend,
  mapExceptionFromBackend,
  mapAgentActionFromBackend,
  mapAuditLogFromBackend,
  mapAlertFromBackend,
  mapOverviewFromBackend,
  mapOnboardingRunFromBackend,
  mapPayrollStatusFromBackend,
  sanitizeCsvField,
} from "../utils/mappers";
import { ALWAYS_HUMAN_ACTIONS } from "../types";

describe("Autopilot HR Mappers", () => {
  it("maps autonomy settings from backend with integer paise and fallbacks", () => {
    const raw = {
      workflows: {
        leave: {
          workflow_id: "leave",
          name: "Leave Requests",
          description: "Routine leaves",
          level: "full_auto",
          thresholds: {
            max_leave_days: 4,
            max_expense_amount_paise: 0,
            confidence_minimum: 92,
            auto_reject_below_confidence: 45,
          },
          last_updated: "2026-10-04T10:00:00.000Z",
          updated_by: "HR Admin",
        },
      },
      updated_at: "2026-10-04T10:00:00.000Z",
      updated_by: "HR Admin",
    };

    const mapped = mapAutonomySettingsFromBackend(raw);
    expect(mapped.workflows.leave.level).toBe("full_auto");
    expect(mapped.workflows.leave.thresholds.maxLeaveDays).toBe(4);
    expect(mapped.workflows.leave.thresholds.confidenceMinimum).toBe(92);
    expect(mapped.workflows.expense.thresholds.maxExpenseAmountPaise).toBe(500000); // from fallback
    expect(mapped.restrictedActions).toEqual(ALWAYS_HUMAN_ACTIONS);
  });

  it("converts autonomy settings back to backend snake_case format", () => {
    const initial = mapAutonomySettingsFromBackend({});
    initial.workflows.expense.thresholds.maxExpenseAmountPaise = 750000;
    initial.workflows.expense.level = "full_auto";

    const payload = mapAutonomySettingsToBackend(initial);
    expect(payload.workflows.expense.thresholds.max_expense_amount_paise).toBe(750000);
    expect(payload.workflows.expense.level).toBe("full_auto");
  });

  it("maps policy rules accurately between backend and frontend", () => {
    const rawRule = {
      id: "rule-1",
      name: "Auto-approve short leave",
      workflow: "leave",
      priority: 1,
      is_enabled: true,
      conditions: [{ id: "c-1", field: "days", operator: "lte", value: 2 }],
      consequence: {
        action: "auto_approve",
        reason: "Within threshold",
        confidence: 95,
        policy_clause: "Clause 3",
      },
    };

    const mapped = mapPolicyRuleFromBackend(rawRule);
    expect(mapped.conditions[0].operator).toBe("lte");
    expect(mapped.consequence.confidence).toBe(95);

    const backToBackend = mapPolicyRuleToBackend(mapped);
    expect(backToBackend.consequence?.policy_clause).toBe("Clause 3");
  });

  it("maps exceptions with requester and urgency data", () => {
    const rawExc = {
      id: "exc-1",
      workflow: "expense",
      subject: "Over-limit cab claim",
      request_id: "req-44",
      requester: {
        id: "emp-9",
        name: "Vikram Malhotra",
        email: "vikram@test.com",
        department: "Sales",
      },
      details: { amount_paise: 650000 },
      escalation_reason: "Exceeds ₹5,000 threshold",
      suggested_decision: "review",
      confidence: 75,
      policy_clause: "Travel policy section 2",
      status: "pending",
      urgency: "high",
    };

    const mapped = mapExceptionFromBackend(rawExc);
    expect(mapped.id).toBe("exc-1");
    expect(mapped.requester.name).toBe("Vikram Malhotra");
    expect(mapped.urgency).toBe("high");
    expect(mapped.details.amount_paise).toBe(650000);
  });

  it("maps tool action calls and agent states", () => {
    const rawAction = {
      id: "act-10",
      action_type: "apply_leave",
      title: "Apply 2 days leave",
      parameters: { days: 2 },
      effect: "Leaves balance decremented by 2",
      state: "proposed",
      undoable: true,
      undone: false,
    };

    const mapped = mapAgentActionFromBackend(rawAction);
    expect(mapped.actionType).toBe("apply_leave");
    expect(mapped.state).toBe("proposed");
    expect(mapped.undoable).toBe(true);
  });

  it("maps audit logs and checks undo/override permissions", () => {
    const rawAudit = {
      id: "aud-5",
      timestamp: "2026-10-04T08:00:00Z",
      workflow: "leave",
      subject: "2 days casual leave",
      action_taken: "Approved",
      decision: "auto_approved",
      confidence: 96,
      policy_clause: "Standard Leave Policy",
      full_reasoning: "Rule 1 matched",
      target_record: { type: "leave", id: "l-1", name: "Leave #1" },
      status: "active",
      can_undo: true,
      can_override: true,
    };

    const mapped = mapAuditLogFromBackend(rawAudit);
    expect(mapped.confidence).toBe(96);
    expect(mapped.canUndo).toBe(true);
    expect(mapped.canOverride).toBe(true);
  });

  it("maps proactive alerts and overview metrics", () => {
    const rawAlert = {
      id: "alt-1",
      category: "burnout_signal",
      severity: "critical",
      title: "Excessive Overtime",
      evidence: [{ key: "Hours", value: 65 }],
      status: "active",
    };
    const alert = mapAlertFromBackend(rawAlert);
    expect(alert.severity).toBe("critical");
    expect(alert.evidence[0].key).toBe("Hours");

    const rawOverview = {
      auto_resolved_percentage: { value: 82.5, available: true },
      exceptions_pending: { value: 6, available: true },
      hours_saved: { value: 120, available: false },
      override_rate_percentage: { value: 1.2, available: true },
    };
    const overview = mapOverviewFromBackend(rawOverview);
    expect(overview.autoResolvedPercentage.value).toBe(82.5);
    expect(overview.hoursSaved.available).toBe(false);
  });

  it("maps onboarding run steps and payroll status with maker-checker", () => {
    const rawOnboarding = {
      id: "ob-1",
      candidate_id: "c-100",
      candidate_name: "Sneha Patel",
      job_title: "Product Designer",
      department: "Design",
      status: "has_failures",
      steps: [
        { id: "s-1", step: "documents", label: "NDA and Offer Letter", status: "completed" },
        { id: "s-2", step: "assets", label: "MacBook Pro M3", status: "failed", error_message: "Out of stock" },
      ],
    };
    const onboarding = mapOnboardingRunFromBackend(rawOnboarding);
    expect(onboarding.status).toBe("has_failures");
    expect(onboarding.steps[1].status).toBe("failed");
    expect(onboarding.steps[1].errorMessage).toBe("Out of stock");

    const rawPayroll = {
      run_id: "pr-oct-2026",
      month: "October",
      year: 2026,
      overall_status: "ready_for_review",
      stages: [
        { id: "attendance_sync", name: "Attendance Sync", status: "completed", summary: "All syncs ok" },
      ],
      can_approve: false,
    };
    const payroll = mapPayrollStatusFromBackend(rawPayroll);
    expect(payroll.canApprove).toBe(false);
    expect(payroll.overallStatus).toBe("ready_for_review");
  });

  it("sanitizes CSV formula injection characters", () => {
    expect(sanitizeCsvField("Normal text")).toBe("Normal text");
    expect(sanitizeCsvField("=SUM(A1:A10)")).toBe("'=SUM(A1:A10)");
    expect(sanitizeCsvField("+12345")).toBe("'+12345");
    expect(sanitizeCsvField("-500")).toBe("'-500");
    expect(sanitizeCsvField("@cmd")).toBe("'@cmd");
    expect(sanitizeCsvField("\tTabbed")).toBe("'\tTabbed");
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";
import apiInstance from "@/api/apiInstance";
import { autopilotApi } from "../services/autopilotApi";
import { mapAutonomySettingsFromBackend } from "../utils/mappers";

vi.mock("@/api/apiInstance", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Autopilot HR API Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches settings and maps responses", async () => {
    vi.mocked(apiInstance.get).mockResolvedValueOnce({
      data: {
        data: {
          workflows: {
            leave: {
              workflow_id: "leave",
              name: "Leave Requests",
              level: "full_auto",
              thresholds: {
                max_leave_days: 3,
                max_expense_amount_paise: 0,
                confidence_minimum: 90,
              },
            },
          },
        },
      },
    });

    const settings = await autopilotApi.getSettings();
    expect(apiInstance.get).toHaveBeenCalledWith("/api/v2/autopilot/settings");
    expect(settings.workflows.leave.level).toBe("full_auto");
    expect(settings.workflows.leave.thresholds.maxLeaveDays).toBe(3);
  });

  it("updates settings sending snake_case payload", async () => {
    const local = mapAutonomySettingsFromBackend({});
    local.workflows.expense.thresholds.maxExpenseAmountPaise = 250000;

    vi.mocked(apiInstance.put).mockResolvedValueOnce({
      data: {
        data: {
          workflows: {
            expense: {
              workflow_id: "expense",
              thresholds: { max_expense_amount_paise: 250000 },
            },
          },
        },
      },
    });

    await autopilotApi.updateSettings(local);
    expect(apiInstance.put).toHaveBeenCalledWith(
      "/api/v2/autopilot/settings",
      expect.objectContaining({
        workflows: expect.objectContaining({
          expense: expect.objectContaining({
            thresholds: expect.objectContaining({
              max_expense_amount_paise: 250000,
            }),
          }),
        }),
      }),
    );
  });

  it("submits exception decision with reason validation", async () => {
    vi.mocked(apiInstance.post).mockResolvedValueOnce({
      data: {
        data: {
          id: "exc-99",
          status: "rejected",
          suggested_decision: "reject",
        },
      },
    });

    const res = await autopilotApi.submitExceptionDecision("exc-99", {
      decision: "reject",
      reason: "Missing mandatory doctor note for 5-day sick leave.",
    });

    expect(apiInstance.post).toHaveBeenCalledWith(
      "/api/v2/autopilot/exceptions/exc-99/decision",
      {
        decision: "reject",
        reason: "Missing mandatory doctor note for 5-day sick leave.",
        reassigned_to_user_id: undefined,
      },
    );
    expect(res.status).toBe("rejected");
  });

  it("simulates policy rule evaluation", async () => {
    vi.mocked(apiInstance.post).mockResolvedValueOnce({
      data: {
        data: {
          matched: true,
          action: "auto_approve",
          confidence: 99,
          policy_clause: "Leave Clause 1.2",
          reasoning: "Matched all conditions",
          evaluated_conditions: [
            { field: "days", operator: "lte", expected: 2, actual: 1, passed: true },
          ],
        },
      },
    });

    const result = await autopilotApi.simulateRule({
      workflow: "leave",
      ruleId: "rule-1",
      sampleData: { days: 1 },
    });

    expect(apiInstance.post).toHaveBeenCalledWith(
      "/api/v2/autopilot/rules/simulate",
      expect.objectContaining({ workflow: "leave", rule_id: "rule-1" }),
    );
    expect(result.matched).toBe(true);
    expect(result.evaluatedConditions[0].passed).toBe(true);
  });

  it("confirms and cancels agent tool-call actions", async () => {
    vi.mocked(apiInstance.post).mockResolvedValueOnce({
      data: {
        data: {
          id: "act-1",
          state: "done",
          result_record: { type: "leave", id: "l-1", label: "Leave #1", url: "/leaves" },
        },
      },
    });

    const confirmed = await autopilotApi.confirmAgentAction("act-1");
    expect(apiInstance.post).toHaveBeenCalledWith("/api/v2/autopilot/agent/actions/act-1/confirm");
    expect(confirmed.state).toBe("done");
    expect(confirmed.resultRecord?.url).toBe("/leaves");

    vi.mocked(apiInstance.post).mockResolvedValueOnce({
      data: {
        data: {
          id: "act-1",
          state: "cancelled",
        },
      },
    });

    const cancelled = await autopilotApi.cancelAgentAction("act-1", "User cancelled");
    expect(apiInstance.post).toHaveBeenCalledWith(
      "/api/v2/autopilot/agent/actions/act-1/cancel",
      { reason: "User cancelled" },
    );
    expect(cancelled.state).toBe("cancelled");
  });

  it("retrieves onboarding runs and retries failed step", async () => {
    vi.mocked(apiInstance.get).mockResolvedValueOnce({
      data: {
        data: [
          {
            id: "ob-1",
            candidate_name: "Sneha",
            status: "has_failures",
            steps: [{ id: "step-1", status: "failed" }],
          },
        ],
      },
    });

    const runs = await autopilotApi.getOnboardingRuns();
    expect(runs[0].candidateName).toBe("Sneha");

    vi.mocked(apiInstance.post).mockResolvedValueOnce({
      data: {
        data: {
          id: "ob-1",
          candidate_name: "Sneha",
          status: "in_progress",
          steps: [{ id: "step-1", status: "running" }],
        },
      },
    });

    const retried = await autopilotApi.retryOnboardingStep("ob-1", "step-1");
    expect(apiInstance.post).toHaveBeenCalledWith(
      "/api/v2/autopilot/onboarding/runs/ob-1/retry-step",
      { step_id: "step-1" },
    );
    expect(retried.steps[0].status).toBe("running");
  });
});

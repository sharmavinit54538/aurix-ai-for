import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { autopilotApi } from "../services/autopilotApi";
import PolicyRulesBuilderPage from "../pages/PolicyRulesBuilderPage";
import type { PolicyRule, RuleSimulateResult } from "../types";

vi.mock("../services/autopilotApi", () => ({
  autopilotApi: {
    getRules: vi.fn(),
    createRule: vi.fn(),
    updateRule: vi.fn(),
    deleteRule: vi.fn(),
    toggleRule: vi.fn(),
    simulateRule: vi.fn(),
  },
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({ children, onValueChange, defaultValue, value }: any) => (
    <div data-testid="select" data-value={value || defaultValue}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: any) => <button type="button">{children}</button>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder || "Select value"}</span>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <div data-value={value}>{children}</div>,
}));

const mockRule: PolicyRule = {
  id: "rule-1",
  name: "Auto-Approve Casual Leave <= 2 Days",
  description: "Approves short casual leave when balance is sufficient",
  workflow: "leave",
  priority: 10,
  isEnabled: true,
  conditions: [
    { field: "leave_type", operator: "eq", value: "casual" },
    { field: "days", operator: "lte", value: 2 },
    { field: "balance", operator: "gte", value: "days" },
  ],
  consequence: {
    action: "auto_approve",
    reason: "Short casual leave within balance",
    confidence: 95,
    policyClause: "Leave Policy 2026, Section 4.1",
  },
  createdAt: "2026-10-01T10:00:00.000Z",
  updatedAt: "2026-10-01T10:00:00.000Z",
};

const mockSimulationResult: RuleSimulateResult = {
  matched: true,
  ruleId: "rule-1",
  ruleName: "Auto-Approve Casual Leave <= 2 Days",
  action: "auto_approve",
  confidence: 95,
  policyClause: "Leave Policy 2026, Section 4.1",
  reasoning: "All 3 conditions evaluated to TRUE.",
  evaluatedConditions: [
    { field: "leave_type", operator: "eq", expected: "casual", actual: "casual", passed: true },
    { field: "days", operator: "lte", expected: 2, actual: 2, passed: true },
    { field: "balance", operator: "gte", expected: "days", actual: 12, passed: true },
  ],
};

describe("PolicyRulesBuilderPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders policy rules list with conditions and consequences", async () => {
    vi.mocked(autopilotApi.getRules).mockResolvedValueOnce([mockRule]);

    render(<PolicyRulesBuilderPage />);

    expect(await screen.findByText("Policy Rules Builder")).toBeInTheDocument();
    expect(screen.getByText("Auto-Approve Casual Leave <= 2 Days")).toBeInTheDocument();
    expect(screen.getByText("Leave Policy 2026, Section 4.1")).toBeInTheDocument();
    expect(screen.getByText("Auto Approve")).toBeInTheDocument();
  });

  it("toggles rule active state", async () => {
    vi.mocked(autopilotApi.getRules).mockResolvedValueOnce([mockRule]);
    vi.mocked(autopilotApi.toggleRule).mockResolvedValueOnce({
      ...mockRule,
      isEnabled: false,
    });

    render(<PolicyRulesBuilderPage />);

    expect(await screen.findByText("Auto-Approve Casual Leave <= 2 Days")).toBeInTheDocument();

    const switchBtn = screen.getByRole("switch");
    fireEvent.click(switchBtn);

    await waitFor(() => {
      expect(autopilotApi.toggleRule).toHaveBeenCalledWith("rule-1", false);
    });
  });

  it("runs a dry-run rule simulation and displays simulated decision", async () => {
    vi.mocked(autopilotApi.getRules).mockResolvedValueOnce([mockRule]);
    vi.mocked(autopilotApi.simulateRule).mockResolvedValueOnce(mockSimulationResult);

    render(<PolicyRulesBuilderPage />);

    expect(await screen.findByText("Auto-Approve Casual Leave <= 2 Days")).toBeInTheDocument();

    // Find and click the Dry-Run simulation test button
    const testButtons = screen.getAllByRole("button", { name: /test/i });
    fireEvent.click(testButtons[0]);

    // Now dry-run simulation panel is populated or open
    const runBtn = screen.getByRole("button", { name: /run simulation/i });
    fireEvent.click(runBtn);

    await waitFor(() => {
      expect(autopilotApi.simulateRule).toHaveBeenCalled();
    });

    expect(await screen.findByText(/All 3 conditions evaluated to TRUE/i)).toBeInTheDocument();
  });

  it("displays feature unavailable alert when backend returns 404 or 501", async () => {
    const error404 = new Error("Not Found") as any;
    error404.response = { status: 404 };
    vi.mocked(autopilotApi.getRules).mockRejectedValueOnce(error404);

    render(<PolicyRulesBuilderPage />);

    expect(await screen.findByText("Backend Pending")).toBeInTheDocument();
    expect(screen.getByText(/Feature unavailable — backend pending/i)).toBeInTheDocument();
  });
});

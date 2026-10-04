import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { autopilotApi } from "../services/autopilotApi";
import { AutoOnboardingPanel } from "../components/AutoOnboardingPanel";
import { AutoPayrollPanel } from "../components/AutoPayrollPanel";
import type { AutoOnboardingRun, AutoPayrollRunStatus } from "../types";

vi.mock("../services/autopilotApi", () => ({
  autopilotApi: {
    getOnboardingRuns: vi.fn(),
    retryOnboardingStep: vi.fn(),
    getPayrollRunStatus: vi.fn(),
  },
}));

// Mock Link from @tanstack/react-router
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

const mockOnboardingRun: AutoOnboardingRun = {
  id: "run-onb-101",
  employeeId: "emp-204",
  employeeName: "Aditya Verma",
  role: "Backend Engineer",
  department: "Engineering",
  offerAcceptedAt: "2026-10-02T10:00:00.000Z",
  currentStep: "accounts",
  status: "failed",
  steps: [
    { step: "documents", label: "Document Generation", status: "completed" },
    { step: "assets", label: "Asset Allocation", status: "completed" },
    {
      step: "accounts",
      label: "IT Accounts Provisioning",
      status: "failed",
      error: "Google Workspace API rate limit exceeded.",
      canRetry: true,
    },
    { step: "welcome_mail", label: "Welcome Communication", status: "pending" },
    { step: "training", label: "Induction Modules", status: "pending" },
  ],
};

const mockPayrollStatus: AutoPayrollRunStatus = {
  id: "pay-run-2026-09",
  payrollCycle: "September 2026",
  month: "2026-09",
  status: "ready_for_review",
  canReviewAndApprove: true,
  approvalRoute: "/dashboard/payroll/runs/review",
  makerCheckerNote: "AI can never approve its own payroll run.",
  stages: [
    { stage: "attendance_sync", label: "Attendance Sync", status: "completed" },
    { stage: "variable_inputs", label: "Variable Inputs", status: "completed" },
    { stage: "calculation", label: "Gross-to-Net Computation", status: "completed" },
    { stage: "validation", label: "Compliance Validation", status: "completed" },
    {
      stage: "anomaly_check",
      label: "AI Anomaly Detection",
      status: "completed",
      anomaliesFound: 2,
      summary: "2 outlier salary adjustments flagged for manager review.",
    },
  ],
};

describe("AutoOnboardingPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders automated onboarding pipeline steps and candidate details", async () => {
    vi.mocked(autopilotApi.getOnboardingRuns).mockResolvedValueOnce([mockOnboardingRun]);

    render(<AutoOnboardingPanel />);

    expect(await screen.findByText("Auto-Onboarding Pipelines")).toBeInTheDocument();
    expect(screen.getByText("Aditya Verma")).toBeInTheDocument();
    expect(screen.getByText(/Backend Engineer • Engineering/i)).toBeInTheDocument();
    expect(screen.getByText("Document Generation")).toBeInTheDocument();
    expect(screen.getByText("Asset Allocation")).toBeInTheDocument();
    expect(screen.getByText("IT Accounts Provisioning")).toBeInTheDocument();
  });

  it("retries a failed onboarding step when Retry Step button is clicked", async () => {
    vi.mocked(autopilotApi.getOnboardingRuns).mockResolvedValueOnce([mockOnboardingRun]);
    vi.mocked(autopilotApi.retryOnboardingStep).mockResolvedValueOnce({
      ...mockOnboardingRun,
      steps: mockOnboardingRun.steps.map((s) =>
        s.step === "accounts" ? { ...s, status: "in_progress", error: undefined } : s,
      ),
    });

    render(<AutoOnboardingPanel />);

    expect(await screen.findByText("Aditya Verma")).toBeInTheDocument();

    const retryBtn = screen.getByRole("button", { name: /retry step/i });
    fireEvent.click(retryBtn);

    await waitFor(() => {
      expect(autopilotApi.retryOnboardingStep).toHaveBeenCalledWith(
        "run-onb-101",
        "accounts",
      );
    });
  });

  it("renders feature unavailable alert on 404/501", async () => {
    const error404 = new Error("Not Found") as any;
    error404.response = { status: 404 };
    vi.mocked(autopilotApi.getOnboardingRuns).mockRejectedValueOnce(error404);

    render(<AutoOnboardingPanel />);

    expect(
      await screen.findByText("Feature unavailable — backend pending"),
    ).toBeInTheDocument();
  });
});

describe("AutoPayrollPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders payroll pre-flight stages and strict maker-checker invariant banner", async () => {
    vi.mocked(autopilotApi.getPayrollRunStatus).mockResolvedValueOnce(mockPayrollStatus);

    render(<AutoPayrollPanel />);

    expect(await screen.findByText("Autopilot Payroll Pre-Flight Run")).toBeInTheDocument();
    expect(screen.getByText("Attendance Sync")).toBeInTheDocument();
    expect(screen.getByText("Gross-to-Net Computation")).toBeInTheDocument();
    expect(screen.getByText("AI Anomaly Detection")).toBeInTheDocument();
    expect(screen.getByText(/2 anomalies flagged/i)).toBeInTheDocument();

    // Maker-Checker Hard Safety Invariant Check
    expect(screen.getByText(/Maker-Checker Invariant/i)).toBeInTheDocument();
    expect(
      screen.getByText(/The AI is strictly barred from approving its own payroll run/i),
    ).toBeInTheDocument();

    // Human sign-off button
    const reviewBtns = screen.getAllByRole("link", { name: /review and approve/i });
    expect(reviewBtns.length).toBeGreaterThan(0);
    expect(reviewBtns[0]).toHaveAttribute("href", "/dashboard/payroll/runs/review");
  });

  it("renders feature unavailable alert on 404/501", async () => {
    const error404 = new Error("Not Found") as any;
    error404.response = { status: 404 };
    vi.mocked(autopilotApi.getPayrollRunStatus).mockRejectedValueOnce(error404);

    render(<AutoPayrollPanel />);

    expect(
      await screen.findByText("Feature unavailable — backend pending"),
    ).toBeInTheDocument();
  });
});

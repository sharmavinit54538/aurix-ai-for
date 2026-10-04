import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { autopilotApi } from "../services/autopilotApi";
import ExceptionsInboxPage from "../pages/ExceptionsInboxPage";
import type { AutopilotException } from "../types";

vi.mock("../services/autopilotApi", () => ({
  autopilotApi: {
    getExceptions: vi.fn(),
    submitExceptionDecision: vi.fn(),
  },
}));

const mockException: AutopilotException = {
  id: "exc-1",
  workflow: "leave",
  subject: "Leave Request: Arjun Roy (Casual, 4 days)",
  requestId: "req-101",
  requester: {
    id: "emp-1",
    name: "Arjun Roy",
    email: "arjun@example.com",
    department: "Engineering",
  },
  details: { days: 4 },
  escalationReason: "Exceeds max leave threshold of 2 days for auto-approval.",
  suggestedDecision: "review",
  confidence: 68,
  policyClause: "Leave Policy 2026, Section 4.2",
  status: "pending",
  urgency: "high",
  createdAt: "2026-10-04T05:00:00.000Z",
};

describe("ExceptionsInboxPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders pending exceptions with escalation reason and policy clause", async () => {
    vi.mocked(autopilotApi.getExceptions).mockResolvedValueOnce({
      items: [mockException],
      total: 1,
    });

    render(<ExceptionsInboxPage />);

    expect(
      await screen.findByText("Leave Request: Arjun Roy (Casual, 4 days)"),
    ).toBeInTheDocument();
    expect(screen.getByText("Leave Policy 2026, Section 4.2")).toBeInTheDocument();
    expect(
      screen.getByText("Exceeds max leave threshold of 2 days for auto-approval."),
    ).toBeInTheDocument();
  });

  it("optimistically approves an exception", async () => {
    vi.mocked(autopilotApi.getExceptions).mockResolvedValueOnce({
      items: [mockException],
      total: 1,
    });
    vi.mocked(autopilotApi.submitExceptionDecision).mockResolvedValueOnce({
      ...mockException,
      status: "approved",
    });

    render(<ExceptionsInboxPage />);

    const approveBtn = await screen.findByRole("button", { name: /approve/i });
    fireEvent.click(approveBtn);

    // Card should be optimistically removed
    await waitFor(() => {
      expect(
        screen.queryByText("Leave Request: Arjun Roy (Casual, 4 days)"),
      ).not.toBeInTheDocument();
    });

    expect(autopilotApi.submitExceptionDecision).toHaveBeenCalledWith("exc-1", {
      decision: "approve",
      reason: expect.any(String),
    });
  });

  it("requires at least 10 characters to confirm rejection", async () => {
    vi.mocked(autopilotApi.getExceptions).mockResolvedValueOnce({
      items: [mockException],
      total: 1,
    });
    vi.mocked(autopilotApi.submitExceptionDecision).mockResolvedValueOnce({
      ...mockException,
      status: "rejected",
    });

    render(<ExceptionsInboxPage />);

    const rejectBtn = await screen.findByRole("button", { name: /reject/i });
    fireEvent.click(rejectBtn);

    expect(await screen.findByText("Reject Request")).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/submit with supporting documentation/i);
    const confirmRejectBtn = screen.getByRole("button", { name: /confirm rejection/i });

    // Disabled initially
    expect(confirmRejectBtn).toBeDisabled();

    // Type < 10 characters
    fireEvent.change(textarea, { target: { value: "Short" } });
    expect(confirmRejectBtn).toBeDisabled();

    // Type >= 10 characters
    fireEvent.change(textarea, {
      target: { value: "Please attach relevant medical documentation before re-applying." },
    });
    expect(confirmRejectBtn).not.toBeDisabled();

    fireEvent.click(confirmRejectBtn);

    await waitFor(() => {
      expect(autopilotApi.submitExceptionDecision).toHaveBeenCalledWith("exc-1", {
        decision: "reject",
        reason: "Please attach relevant medical documentation before re-applying.",
      });
    });
  });

  it("rolls back optimistic removal on decision API error", async () => {
    vi.mocked(autopilotApi.getExceptions).mockResolvedValueOnce({
      items: [mockException],
      total: 1,
    });
    vi.mocked(autopilotApi.submitExceptionDecision).mockRejectedValueOnce(
      new Error("Network Error"),
    );

    render(<ExceptionsInboxPage />);

    const approveBtn = await screen.findByRole("button", { name: /approve/i });
    fireEvent.click(approveBtn);

    // Rolled back after failure
    await waitFor(() => {
      expect(
        screen.getByText("Leave Request: Arjun Roy (Casual, 4 days)"),
      ).toBeInTheDocument();
    });
  });

  it("renders zero exceptions empty state", async () => {
    vi.mocked(autopilotApi.getExceptions).mockResolvedValueOnce({
      items: [],
      total: 0,
    });

    render(<ExceptionsInboxPage />);

    expect(await screen.findByText("Zero Exceptions Pending")).toBeInTheDocument();
  });
});

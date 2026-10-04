import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { autopilotApi } from "../services/autopilotApi";
import ActionAuditLogPage from "../pages/ActionAuditLogPage";
import type { AuditLogEntry } from "../types";

vi.mock("../services/autopilotApi", () => ({
  autopilotApi: {
    getAuditLogs: vi.fn(),
    undoAuditAction: vi.fn(),
    overrideAuditAction: vi.fn(),
  },
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({ children }: any) => <div data-testid="select">{children}</div>,
  SelectTrigger: ({ children }: any) => <button type="button">{children}</button>,
  SelectValue: () => <span>Select value</span>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <div data-value={value}>{children}</div>,
}));

const mockAuditEntry: AuditLogEntry = {
  id: "aud-101",
  timestamp: "2026-10-04T05:22:10.000Z",
  workflow: "expense",
  subject: "Expense Claim #EXP-4412 (₹3,200) by Priya Mehta",
  actionTaken: "Auto-approved reimbursement",
  decision: "auto_approved",
  confidence: 94,
  ruleId: "rule-exp-01",
  ruleName: "Standard Travel Meal Reimbursement",
  policyClause: "Travel Policy 2026, Section 3.2",
  fullReasoning: "Receipt verified via OCR. Meal expense is under threshold.",
  evidence: { amount_paise: 320000 },
  targetRecord: { type: "expense", id: "exp-4412", name: "EXP-4412" },
  status: "active",
  canUndo: true,
  canOverride: true,
};

describe("ActionAuditLogPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders audit log entries with decision, confidence, and policy clause", async () => {
    vi.mocked(autopilotApi.getAuditLogs).mockResolvedValueOnce({
      items: [mockAuditEntry],
      total: 1,
    });

    render(<ActionAuditLogPage />);

    expect(
      await screen.findByText("Expense Claim #EXP-4412 (₹3,200) by Priya Mehta"),
    ).toBeInTheDocument();
    expect(screen.getByText("94%")).toBeInTheDocument();
    expect(
      screen.getByText("Standard Travel Meal Reimbursement"),
    ).toBeInTheDocument();
  });

  it("opens detail drawer on row click and displays full reasoning", async () => {
    vi.mocked(autopilotApi.getAuditLogs).mockResolvedValueOnce({
      items: [mockAuditEntry],
      total: 1,
    });

    render(<ActionAuditLogPage />);

    const row = await screen.findByText("Expense Claim #EXP-4412 (₹3,200) by Priya Mehta");
    fireEvent.click(row);

    expect(
      await screen.findByText("Receipt verified via OCR. Meal expense is under threshold."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /undo action/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /override decision/i })).toBeInTheDocument();
  });

  it("submits override with justification >= 10 characters", async () => {
    vi.mocked(autopilotApi.getAuditLogs).mockResolvedValueOnce({
      items: [mockAuditEntry],
      total: 1,
    });
    vi.mocked(autopilotApi.overrideAuditAction).mockResolvedValueOnce({
      ...mockAuditEntry,
      status: "overridden",
      overrideReason: "Overridden because project agreement forbids client meal claims.",
    });

    render(<ActionAuditLogPage />);

    const row = await screen.findByText("Expense Claim #EXP-4412 (₹3,200) by Priya Mehta");
    fireEvent.click(row);

    const overrideBtn = await screen.findByRole("button", { name: /override decision/i });
    fireEvent.click(overrideBtn);

    expect(await screen.findByText("Override Decision")).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/detailed rationale for overriding/i);
    const applyBtn = screen.getByRole("button", { name: /apply override/i });

    expect(applyBtn).toBeDisabled();

    fireEvent.change(textarea, {
      target: { value: "Overridden because project agreement forbids client meal claims." },
    });
    expect(applyBtn).not.toBeDisabled();

    fireEvent.click(applyBtn);

    await waitFor(() => {
      expect(autopilotApi.overrideAuditAction).toHaveBeenCalledWith(
        "aud-101",
        expect.objectContaining({
          reason: "Overridden because project agreement forbids client meal claims.",
        }),
      );
    });
  });

  it("submits undo with reason", async () => {
    vi.mocked(autopilotApi.getAuditLogs).mockResolvedValueOnce({
      items: [mockAuditEntry],
      total: 1,
    });
    vi.mocked(autopilotApi.undoAuditAction).mockResolvedValueOnce({
      ...mockAuditEntry,
      status: "undone",
    });

    render(<ActionAuditLogPage />);

    const row = await screen.findByText("Expense Claim #EXP-4412 (₹3,200) by Priya Mehta");
    fireEvent.click(row);

    const undoBtn = await screen.findByRole("button", { name: /undo action/i });
    fireEvent.click(undoBtn);

    expect(await screen.findByText("Undo AI Action")).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/action executed on obsolete employee balance/i);
    fireEvent.change(textarea, {
      target: { value: "Duplicate slip detected, reversing approval." },
    });

    const confirmUndoBtn = screen.getByRole("button", { name: /confirm undo/i });
    fireEvent.click(confirmUndoBtn);

    await waitFor(() => {
      expect(autopilotApi.undoAuditAction).toHaveBeenCalledWith(
        "aud-101",
        "Duplicate slip detected, reversing approval.",
      );
    });
  });
});

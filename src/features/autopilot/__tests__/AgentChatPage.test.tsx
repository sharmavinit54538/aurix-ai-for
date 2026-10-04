import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { autopilotApi } from "../services/autopilotApi";
import AgentChatPage from "../pages/AgentChatPage";
import type { AgentToolCall } from "../types";

vi.mock("../services/autopilotApi", () => ({
  autopilotApi: {
    sendAgentMessage: vi.fn(),
    confirmAgentAction: vi.fn(),
    cancelAgentAction: vi.fn(),
    undoAuditAction: vi.fn(),
  },
}));

const mockProposedToolCall: AgentToolCall = {
  id: "act-leave-101",
  tool: "apply_leave",
  action: "apply_leave",
  parameters: {
    leave_type: "casual",
    days: 2,
    from: "2026-10-06",
  },
  expectedEffect: "Deducts 2 days from Casual Leave balance and submits to HR for auto-approval.",
  status: "proposed",
};

describe("AgentChatPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the agent chat interface with welcome message and suggestions", () => {
    render(<AgentChatPage />);

    expect(screen.getByText("HR Agent that ACTS")).toBeInTheDocument();
    expect(screen.getByText(/I can autonomously perform HR tasks for you/i)).toBeInTheDocument();
    expect(screen.getByText("Apply 2 days casual leave from Monday")).toBeInTheDocument();
  });

  it("proposes a tool-call confirmation card when user requests an actionable task", async () => {
    vi.mocked(autopilotApi.sendAgentMessage).mockResolvedValueOnce({
      content: "I have prepared the leave request for you. Please confirm below:",
      tool_call: mockProposedToolCall,
    });

    render(<AgentChatPage />);

    const textarea = screen.getByPlaceholderText(/Tell the agent what to do/i);
    fireEvent.change(textarea, { target: { value: "apply 2 days leave from Monday" } });

    const sendBtn = screen.getByRole("button", { name: "" }); // Send button has Send icon
    fireEvent.click(sendBtn);

    expect(await screen.findByText("Action Proposal · Requires Confirmation")).toBeInTheDocument();
    expect(screen.getByText("Apply Leave")).toBeInTheDocument();
    expect(
      screen.getByText("Deducts 2 days from Casual Leave balance and submits to HR for auto-approval."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirm & execute/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("confirms and executes proposed tool call, transitioning to done state with record link and undo button", async () => {
    vi.mocked(autopilotApi.sendAgentMessage).mockResolvedValueOnce({
      content: "Prepared leave request:",
      tool_call: mockProposedToolCall,
    });
    vi.mocked(autopilotApi.confirmAgentAction).mockResolvedValueOnce({
      success: true,
      recordId: "LR-9821",
      recordType: "leave",
      recordUrl: "/dashboard/leaves",
      message: "Leave request #LR-9821 submitted and auto-approved within policy.",
      canUndo: true,
      undoActionId: "aud-9821",
    });

    render(<AgentChatPage />);

    const textarea = screen.getByPlaceholderText(/Tell the agent what to do/i);
    fireEvent.change(textarea, { target: { value: "apply 2 days leave" } });
    fireEvent.click(screen.getByRole("button", { name: "" }));

    const confirmBtn = await screen.findByRole("button", { name: /confirm & execute/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(autopilotApi.confirmAgentAction).toHaveBeenCalledWith("act-leave-101");
    });

    expect(await screen.findByText("Action Executed Successfully")).toBeInTheDocument();
    expect(
      screen.getByText("Leave request #LR-9821 submitted and auto-approved within policy."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /undo action/i })).toBeInTheDocument();
  });

  it("cancels proposed action when Cancel button is clicked", async () => {
    vi.mocked(autopilotApi.sendAgentMessage).mockResolvedValueOnce({
      content: "Prepared leave request:",
      tool_call: mockProposedToolCall,
    });
    vi.mocked(autopilotApi.cancelAgentAction).mockResolvedValueOnce({
      success: true,
      message: "Action cancelled",
    });

    render(<AgentChatPage />);

    const textarea = screen.getByPlaceholderText(/Tell the agent what to do/i);
    fireEvent.change(textarea, { target: { value: "apply 2 days leave" } });
    fireEvent.click(screen.getByRole("button", { name: "" }));

    const cancelBtn = await screen.findByRole("button", { name: /cancel/i });
    fireEvent.click(cancelBtn);

    await waitFor(() => {
      expect(autopilotApi.cancelAgentAction).toHaveBeenCalledWith("act-leave-101");
    });

    expect(await screen.findByText("Action Failed or Cancelled")).toBeInTheDocument();
  });

  it("gracefully displays backend pending state on 404/501", async () => {
    const error404 = new Error("Not Found") as any;
    error404.response = { status: 404 };
    vi.mocked(autopilotApi.sendAgentMessage).mockRejectedValueOnce(error404);

    render(<AgentChatPage />);

    const textarea = screen.getByPlaceholderText(/Tell the agent what to do/i);
    fireEvent.change(textarea, { target: { value: "apply 2 days leave" } });
    fireEvent.click(screen.getByRole("button", { name: "" }));

    expect(
      await screen.findByText(/Feature unavailable — backend pending \(\/api\/v2\/autopilot\/agent\/chat\)/i),
    ).toBeInTheDocument();
  });
});

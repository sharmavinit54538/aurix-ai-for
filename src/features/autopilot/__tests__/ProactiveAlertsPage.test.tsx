import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { autopilotApi } from "../services/autopilotApi";
import ProactiveAlertsPage from "../pages/ProactiveAlertsPage";
import type { AutopilotAlert } from "../types";

vi.mock("../services/autopilotApi", () => ({
  autopilotApi: {
    getAlerts: vi.fn(),
    acknowledgeAlert: vi.fn(),
    snoozeAlert: vi.fn(),
    createAlertTask: vi.fn(),
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

const mockAlert: AutopilotAlert = {
  id: "alt-burnout-101",
  category: "burnout_signal",
  severity: "critical",
  title: "High Burnout Risk: Dev Team Pod B",
  description: "Continuous overtime detected (>55 hrs/wk) across 4 consecutive sprints.",
  evidence: {
    avg_hours_per_week: 58.4,
    unclaimed_leaves_ratio: 0.92,
    weekend_commits_count: 14,
  },
  suggestedAction: "Enforce compensatory off-days and rebalance sprint workload allocations.",
  status: "active",
  createdAt: "2026-10-04T06:00:00.000Z",
};

describe("ProactiveAlertsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders active proactive alerts with evidence and recommended action", async () => {
    vi.mocked(autopilotApi.getAlerts).mockResolvedValueOnce([mockAlert]);

    render(<ProactiveAlertsPage />);

    expect(
      await screen.findByText("High Burnout Risk: Dev Team Pod B"),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Burnout Signal").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Critical").length).toBeGreaterThan(0);
    expect(
      screen.getByText("Enforce compensatory off-days and rebalance sprint workload allocations."),
    ).toBeInTheDocument();
  });

  it("acknowledges an alert", async () => {
    vi.mocked(autopilotApi.getAlerts).mockResolvedValueOnce([mockAlert]);
    vi.mocked(autopilotApi.acknowledgeAlert).mockResolvedValueOnce({
      ...mockAlert,
      status: "acknowledged",
    });

    render(<ProactiveAlertsPage />);

    expect(await screen.findByText("High Burnout Risk: Dev Team Pod B")).toBeInTheDocument();

    const ackBtn = screen.getByRole("button", { name: /^acknowledge$/i });
    fireEvent.click(ackBtn);

    await waitFor(() => {
      expect(autopilotApi.acknowledgeAlert).toHaveBeenCalledWith("alt-burnout-101");
    });
  });

  it("snoozes an alert with chosen duration", async () => {
    vi.mocked(autopilotApi.getAlerts).mockResolvedValueOnce([mockAlert]);
    vi.mocked(autopilotApi.snoozeAlert).mockResolvedValueOnce({
      ...mockAlert,
      status: "snoozed",
    });

    render(<ProactiveAlertsPage />);

    expect(await screen.findByText("High Burnout Risk: Dev Team Pod B")).toBeInTheDocument();

    const snoozeBtn = screen.getByRole("button", { name: /^snooze$/i });
    fireEvent.click(snoozeBtn);

    const confirmSnoozeBtn = screen.getByRole("button", { name: /confirm snooze/i });
    fireEvent.click(confirmSnoozeBtn);

    await waitFor(() => {
      expect(autopilotApi.snoozeAlert).toHaveBeenCalledWith(
        "alt-burnout-101",
        expect.any(String),
      );
    });
  });

  it("creates a follow-up action task from an alert", async () => {
    vi.mocked(autopilotApi.getAlerts).mockResolvedValueOnce([mockAlert]);
    vi.mocked(autopilotApi.createAlertTask).mockResolvedValueOnce({
      taskId: "task-552",
      alert: { ...mockAlert, taskId: "task-552" },
    });

    render(<ProactiveAlertsPage />);

    expect(await screen.findByText("High Burnout Risk: Dev Team Pod B")).toBeInTheDocument();

    const createTaskBtn = screen.getByRole("button", { name: /create task/i });
    fireEvent.click(createTaskBtn);

    const confirmTaskBtn = screen.getByRole("button", { name: /^create task$/i });
    fireEvent.click(confirmTaskBtn);

    await waitFor(() => {
      expect(autopilotApi.createAlertTask).toHaveBeenCalledWith(
        "alt-burnout-101",
        expect.objectContaining({ title: expect.stringContaining("High Burnout Risk") }),
      );
    });
  });

  it("gracefully handles 404/501 without disruptive error banner", async () => {
    const error404 = new Error("Not Found") as any;
    error404.response = { status: 404 };
    vi.mocked(autopilotApi.getAlerts).mockRejectedValueOnce(error404);

    render(<ProactiveAlertsPage />);

    expect(
      screen.queryByText("Feature unavailable — backend pending"),
    ).not.toBeInTheDocument();
  });
});

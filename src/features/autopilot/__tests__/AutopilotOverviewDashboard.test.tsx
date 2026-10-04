import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { autopilotApi } from "../services/autopilotApi";
import AutopilotOverviewDashboard from "../pages/AutopilotOverviewDashboard";
import type { AutopilotOverview } from "../types";

vi.mock("../services/autopilotApi", () => ({
  autopilotApi: {
    getOverview: vi.fn(),
  },
}));

// Mock Link from @tanstack/react-router
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

const mockAutoResolved = {
  available: true,
  value: 88,
  unit: "%",
  changePercent: 4.2,
  description: "Percent of routine requests auto-resolved",
};

const mockOverrideRate = {
  available: false, // Should be omitted per Rule 1 & Rule 7!
  value: 2.1,
  unit: "%",
};

const mockTrendData = [
  {
    month: "2026-08",
    autoResolved: 410,
    exceptions: 35,
    overridden: 8,
    hoursSaved: 290,
  },
  {
    month: "2026-09",
    autoResolved: 480,
    exceptions: 28,
    overridden: 5,
    hoursSaved: 340,
  },
];

const mockOverview: AutopilotOverview = {
  autoResolvedPercent: mockAutoResolved,
  autoResolvedPercentage: mockAutoResolved,
  exceptionsPending: {
    available: true,
    value: 12,
    changePercent: -15,
    description: "Pending human exception triage",
  },
  hoursSaved: {
    available: true,
    value: 340,
    unit: "hrs",
    changePercent: 8,
    description: "HR manual effort saved this month",
  },
  overrideRate: mockOverrideRate,
  overrideRatePercentage: mockOverrideRate,
  timeSeries12Months: mockTrendData,
  history12Months: mockTrendData,
  lastUpdated: "2026-10-04T12:00:00.000Z",
};

describe("AutopilotOverviewDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders real metrics where available: true and strictly omits metrics where available: false", async () => {
    vi.mocked(autopilotApi.getOverview).mockResolvedValueOnce(mockOverview);

    render(<AutopilotOverviewDashboard />);

    expect(await screen.findByText("OneHR Command Center")).toBeInTheDocument();

    // Available metrics must render
    expect(screen.getByText("Requests Auto-Resolved")).toBeInTheDocument();
    expect(screen.getByText("88%")).toBeInTheDocument();
    expect(screen.getByText("Exceptions Pending Triage")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Hours Saved This Month")).toBeInTheDocument();
    expect(screen.getByText("340 hrs")).toBeInTheDocument();

    // Metric marked available: false must NOT be rendered (Rule 1 & Rule 7)
    expect(screen.queryByText("Human Override Rate")).not.toBeInTheDocument();
  });

  it("renders 12-month autonomous time series trend data", async () => {
    vi.mocked(autopilotApi.getOverview).mockResolvedValueOnce(mockOverview);

    render(<AutopilotOverviewDashboard />);

    expect(await screen.findByText("Autonomous Resolution Trends (Last 12 Months)")).toBeInTheDocument();
    expect(screen.getByText("2026-09")).toBeInTheDocument();
  });

  it("displays feature unavailable banner on 404/501", async () => {
    const error404 = new Error("Not Found") as any;
    error404.response = { status: 404 };
    vi.mocked(autopilotApi.getOverview).mockRejectedValueOnce(error404);

    render(<AutopilotOverviewDashboard />);

    expect(
      await screen.findByText("Feature unavailable — backend pending"),
    ).toBeInTheDocument();
  });
});

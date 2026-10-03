import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { executiveApi } from "@/services/executiveApi";
import { ExecutiveRoleDashboardView } from "../components/ExecutiveRoleDashboardView";

// Mock TanStack Router Link
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    Link: ({ to, children, className }: any) => (
      <a href={to} className={className}>
        {children}
      </a>
    ),
  };
});

// Mock recharts responsive container for testing
vi.mock("recharts", async () => {
  const original = await vi.importActual("recharts");
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  };
});

describe("F-08: Executive Dashboards and Analytics Wiring", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("filters out unsourced metrics and items with available: false", async () => {
    vi.spyOn(executiveApi, "getOverview").mockResolvedValueOnce({
      role: "ceo",
      healthScore: 92,
      metrics: [
        { key: "headcount", label: "Active Headcount", value: 148, available: true },
        { key: "payroll_cost", label: "Monthly Payroll", value: "₹28,50,000", available: true },
        { key: "arr", label: "Annual Recurring Revenue", value: "—", available: false },
      ],
      timeSeries: [
        { month: "Jan", headcount: 140, attendanceRate: 94 },
        { month: "Feb", headcount: 148, attendanceRate: 96 },
      ],
      initiatives: [
        { name: "Global HR Expansion", category: "Operations", owner: "CEO", status: "In Progress", progress: 75 },
      ],
    });

    render(<ExecutiveRoleDashboardView role="ceo" />);

    await waitFor(() => {
      expect(screen.getByText("Active Headcount")).toBeInTheDocument();
      expect(screen.getByText("148")).toBeInTheDocument();
      expect(screen.getByText("Monthly Payroll")).toBeInTheDocument();
      // Fabricated ARR metric must not be in the document
      expect(screen.queryByText("Annual Recurring Revenue")).not.toBeInTheDocument();
    });
  });

  it("handles empty tenants gracefully without crashing", async () => {
    vi.spyOn(executiveApi, "getOverview").mockResolvedValueOnce({
      role: "cfo",
      healthScore: 0,
      metrics: [],
      timeSeries: [],
      initiatives: [],
    });

    render(<ExecutiveRoleDashboardView role="cfo" />);

    await waitFor(() => {
      expect(screen.getByText(/No executive KPI metrics available/i)).toBeInTheDocument();
      expect(screen.getByText(/Chief Financial Officer Command Center/i)).toBeInTheDocument();
    });
  });

  it("triggers data reload on refresh", async () => {
    const spy = vi.spyOn(executiveApi, "getOverview").mockResolvedValue({
      role: "cto",
      healthScore: 88,
      metrics: [
        { key: "engineers", label: "Engineering Strength", value: 45, available: true },
      ],
      timeSeries: [],
      initiatives: [],
    });

    render(<ExecutiveRoleDashboardView role="cto" />);

    await waitFor(() => {
      expect(screen.getByText("Engineering Strength")).toBeInTheDocument();
    });

    const refreshBtn = screen.getByRole("button", { name: /Refresh/i });
    fireEvent.click(refreshBtn);

    await waitFor(() => {
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });
});

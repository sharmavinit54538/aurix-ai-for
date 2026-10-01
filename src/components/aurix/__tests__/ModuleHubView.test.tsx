import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { BarChart3, LineChart } from "lucide-react";
import { ModuleHubView, type ModuleItem } from "../ModuleHubView";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, className }: any) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

describe("ModuleHubView", () => {
  const mockModules: ModuleItem[] = [
    {
      id: "reports",
      title: "HR Reports Builder",
      description: "Custom reporting engine for headcount and payroll.",
      icon: BarChart3,
      to: "/dashboard/analytics/reports",
      badge: "Core",
    },
    {
      id: "insights",
      title: "AI Predictive Insights",
      description: "Attrition analytics and burnout risk alerts.",
      icon: LineChart,
      to: "/dashboard/analytics/ai-insights",
    },
  ];

  it("renders header with eyebrow, title, description, and header icon", () => {
    render(
      <ModuleHubView
        eyebrow="Intelligence Center"
        title="Analytics & AI Insights"
        description="Executive analytics dashboards, custom HR report builders."
        headerIcon={LineChart}
        modules={mockModules}
      />
    );

    // Verify header elements
    expect(screen.getByText("Intelligence Center")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Analytics & AI Insights" })).toBeInTheDocument();
    expect(
      screen.getByText("Executive analytics dashboards, custom HR report builders.")
    ).toBeInTheDocument();

    // Verify modules render
    expect(screen.getByText("HR Reports Builder")).toBeInTheDocument();
    expect(screen.getByText("Custom reporting engine for headcount and payroll.")).toBeInTheDocument();
    expect(screen.getByText("AI Predictive Insights")).toBeInTheDocument();
    expect(screen.getByText("Core")).toBeInTheDocument();
  });

  it("renders correctly without header props when not provided", () => {
    render(<ModuleHubView modules={mockModules} />);

    expect(screen.queryByText("Intelligence Center")).not.toBeInTheDocument();
    expect(screen.getByText("HR Reports Builder")).toBeInTheDocument();
  });
});

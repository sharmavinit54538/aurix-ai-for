import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  PAYROLL_MODULES_LIST,
  PAYROLL_INTELLIGENCE_MODULES,
} from "../constants/modules";
import { ModuleCard } from "../components/ModuleCard";
import { PayrollMetricsDashboard } from "../components/PayrollMetricsDashboard";
import type { PayrollDashboardData, PayrollPeriod } from "@/services/payrollApi";

// Mock @tanstack/react-router
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, className, ...props }: any) => (
    <a href={to} className={className} data-testid="router-link" {...props}>
      {children}
    </a>
  ),
  useNavigate: () => vi.fn(),
}));

// Mock Recharts ResponsiveContainer to avoid size issues in jsdom
vi.mock("recharts", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    ResponsiveContainer: ({ children }: any) => (
      <div data-testid="responsive-container" style={{ width: 800, height: 300 }}>
        {children}
      </div>
    ),
  };
});

describe("OFC360 Payroll Module Hub Constants", () => {
  it("defines exactly 30 core payroll modules across 10 rows of 3 columns", () => {
    expect(PAYROLL_MODULES_LIST).toHaveLength(30);

    const rows = new Set(PAYROLL_MODULES_LIST.map((m) => m.row));
    expect(rows.size).toBe(10);

    // Each row should contain exactly 3 modules
    for (let r = 1; r <= 10; r++) {
      const inRow = PAYROLL_MODULES_LIST.filter((m) => m.row === r);
      expect(inRow).toHaveLength(3);
    }
  });

  it("verifies Row 1 contains Payroll Dashboard, Payroll Periods, and Payroll Runs", () => {
    const row1 = PAYROLL_MODULES_LIST.filter((m) => m.row === 1);
    expect(row1.map((m) => m.title)).toEqual([
      "Payroll Dashboard",
      "Payroll Periods",
      "Payroll Runs",
    ]);
  });

  it("defines exactly 10 OFC360 Payroll Intelligence modules", () => {
    expect(PAYROLL_INTELLIGENCE_MODULES).toHaveLength(10);
    const titles = PAYROLL_INTELLIGENCE_MODULES.map((m) => m.title);
    expect(titles).toContain("Payroll Autopilot");
    expect(titles).toContain("Automation Rules");
    expect(titles).toContain("Auto Validation");
    expect(titles).toContain("Auto Error Detection");
    expect(titles).toContain("Auto Approval Workflow");
    expect(titles).toContain("Auto Payment Processing");
    expect(titles).toContain("Auto Payslip Generation");
    expect(titles).toContain("Auto Notifications");
    expect(titles).toContain("Payroll Alerts");
    expect(titles).toContain("AI Payroll Assistant");
  });

  it("ensures every module has a valid non-empty route path and icon", () => {
    const allModules = [...PAYROLL_MODULES_LIST, ...PAYROLL_INTELLIGENCE_MODULES];
    for (const m of allModules) {
      expect(m.to).toBeTruthy();
      expect(m.to.startsWith("/")).toBe(true);
      expect(m.title).toBeTruthy();
      expect(m.description).toBeTruthy();
      expect(m.icon).toBeTruthy();
      expect(m.color).toBeTruthy();
    }
  });
});

describe("ModuleCard Component", () => {
  it("renders module title and description with clickable navigation", () => {
    const testModule = PAYROLL_MODULES_LIST[0];
    render(<ModuleCard module={testModule} />);

    expect(screen.getByText("Payroll Dashboard")).toBeInTheDocument();
    expect(
      screen.getByText(/Central payroll command center showing current payroll status/i)
    ).toBeInTheDocument();
  });

  it("triggers onClick when provided as a button", () => {
    const testModule = PAYROLL_MODULES_LIST[0];
    const handleClick = vi.fn();
    render(<ModuleCard module={testModule} onClick={handleClick} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe("PayrollMetricsDashboard Component", () => {
  const mockPeriods: PayrollPeriod[] = [
    {
      id: "period-apr-2026",
      name: "April 2026",
      startDate: "2026-04-01",
      endDate: "2026-04-30",
      status: "Draft",
      isCurrent: true,
    },
  ];

  const mockData: PayrollDashboardData = {
    period: mockPeriods[0],
    summary: {
      employeeCount: 150,
      grossPayroll: 5000000,
      totalDeductions: 600000,
      netPayroll: 4400000,
      employerCost: 450000,
    },
    status: "Review",
    readiness: {
      isReady: true,
      items: [],
    },
    issues: {
      errors: [],
      warnings: [],
    },
    recentRuns: [
      {
        id: "run-1",
        periodId: "period-apr-2026",
        periodName: "April 2026",
        employeeCount: 150,
        grossPayroll: 5000000,
        netPayroll: 4400000,
        status: "Review",
        runDate: "2026-04-05",
      },
    ],
  };

  it("renders authentic backend metrics and confirms fake KPIs & charts are removed", () => {
    render(
      <PayrollMetricsDashboard
        data={mockData}
        periods={mockPeriods}
        selectedPeriodId="period-apr-2026"
        onPeriodChange={vi.fn()}
        isLoading={false}
        onRefresh={vi.fn()}
      />
    );

    // Authentic KPIs from live backend
    expect(screen.getByText("Total Payroll Cost")).toBeInTheDocument();
    expect(screen.getAllByText("Net Payroll").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Gross Payroll").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Total Deductions")).toBeInTheDocument();
    expect(screen.getByText("Total Employees Paid")).toBeInTheDocument();
    expect(screen.getByText("Pending Payroll")).toBeInTheDocument();
    expect(screen.getByText("Payroll Exceptions")).toBeInTheDocument();
    expect(screen.getByText("Failed Payments")).toBeInTheDocument();
    expect(screen.getByText("Pending Approvals")).toBeInTheDocument();
    expect(screen.getByText("Employer Contributions")).toBeInTheDocument();
    expect(screen.getByText("Average Salary")).toBeInTheDocument();

    // Authentic Chart Heading
    expect(screen.getByText("Payroll Cost Trend")).toBeInTheDocument();

    // Verify all removed fake KPIs and synthetic charts do NOT exist in DOM
    expect(screen.queryByText("Tax / TDS")).not.toBeInTheDocument();
    expect(screen.queryByText("Payroll Processing Time")).not.toBeInTheDocument();
    expect(screen.queryByText("Payment Success Rate")).not.toBeInTheDocument();
    expect(screen.queryByText("Payroll Error Rate")).not.toBeInTheDocument();
    expect(screen.queryByText("Department-wise Payroll Cost")).not.toBeInTheDocument();
    expect(screen.queryByText("Salary Distribution")).not.toBeInTheDocument();
    expect(screen.queryByText("Monthly Payroll Trend")).not.toBeInTheDocument();
  });

  it("renders dashes and empty states when data is null, never fabricated numbers", () => {
    render(
      <PayrollMetricsDashboard
        data={null}
        periods={mockPeriods}
        selectedPeriodId="period-apr-2026"
        onPeriodChange={vi.fn()}
        isLoading={false}
        onRefresh={vi.fn()}
      />
    );

    // Should NOT contain fabricated fallback numbers (e.g. 142 employees, ₹44,50,000, 38 min, 99.4%)
    expect(screen.queryByText("142")).not.toBeInTheDocument();
    expect(screen.queryByText("₹44,50,000")).not.toBeInTheDocument();
    expect(screen.queryByText("38 min")).not.toBeInTheDocument();
    expect(screen.queryByText("99.4%")).not.toBeInTheDocument();

    // Dash "—" must be displayed for missing numbers
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThan(0);

    // Empty states must be shown for chart and table
    expect(screen.getByText("No historical cycle runs available")).toBeInTheDocument();
    expect(screen.getByText("No payroll runs yet")).toBeInTheDocument();
  });
});

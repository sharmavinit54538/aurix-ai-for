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

  it("renders all 18 requested metrics and analytics headings", () => {
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

    // 1. Total Payroll Cost
    expect(screen.getByText("Total Payroll Cost")).toBeInTheDocument();
    // 2. Net Payroll
    expect(screen.getAllByText("Net Payroll").length).toBeGreaterThanOrEqual(1);
    // 3. Gross Payroll
    expect(screen.getAllByText("Gross Payroll").length).toBeGreaterThanOrEqual(1);
    // 4. Total Employees Paid
    expect(screen.getByText("Total Employees Paid")).toBeInTheDocument();
    // 5. Pending Payroll
    expect(screen.getByText("Pending Payroll")).toBeInTheDocument();
    // 6. Payroll Exceptions
    expect(screen.getByText("Payroll Exceptions")).toBeInTheDocument();
    // 7. Failed Payments
    expect(screen.getByText("Failed Payments")).toBeInTheDocument();
    // 8. Pending Approvals
    expect(screen.getByText("Pending Approvals")).toBeInTheDocument();
    // 9. Tax / TDS
    expect(screen.getByText("Tax / TDS")).toBeInTheDocument();
    // 10. Employer Contributions
    expect(screen.getByText("Employer Contributions")).toBeInTheDocument();
    // 11. Average Salary
    expect(screen.getByText("Average Salary")).toBeInTheDocument();
    // 12. Payroll Processing Time
    expect(screen.getByText("Payroll Processing Time")).toBeInTheDocument();
    // 13. Payment Success Rate
    expect(screen.getByText("Payment Success Rate")).toBeInTheDocument();
    // 14. Payroll Error Rate
    expect(screen.getByText("Payroll Error Rate")).toBeInTheDocument();

    // 15. Payroll Cost Trend (Chart Heading)
    expect(screen.getByText("Payroll Cost Trend")).toBeInTheDocument();
    // 16. Department-wise Payroll Cost (Chart Heading)
    expect(screen.getByText("Department-wise Payroll Cost")).toBeInTheDocument();
    // 17. Salary Distribution (Chart Heading)
    expect(screen.getByText("Salary Distribution")).toBeInTheDocument();
    // 18. Monthly Payroll Trend (Chart Heading)
    expect(screen.getByText("Monthly Payroll Trend")).toBeInTheDocument();
  });
});

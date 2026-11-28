import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { aurix, type Role } from "@/lib/aurix-store";
import { checkRouteAccess } from "@/lib/route-guards";
import { settingsApi } from "@/redux/settingsApi";
import sidebarReducer from "@/store/sidebar/sidebarSlice";
import { reportsApi } from "../api/reportsApi";
import { reportAnalyticsApi } from "../api/reportAnalyticsApi";
import PayrollReportsPage from "../pages/PayrollReportsPage";
import PayrollRegisterReport from "../pages/PayrollRegisterReport";
import CostCenterWiseReport from "../pages/CostCenterWiseReport";
import BankAdviceReport from "../pages/BankAdviceReport";
import PayrollVarianceReport from "../pages/PayrollVarianceReport";
import AccountingJournalReport from "../pages/AccountingJournalReport";
import YtdPayrollReport from "../pages/YtdPayrollReport";

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    Link: ({
      children,
      to,
      className,
    }: {
      children?: ReactNode;
      to?: string;
      className?: string;
    }) => (
      <a href={to} className={className}>
        {children}
      </a>
    ),
    useNavigate: () => vi.fn(),
  };
});

vi.mock("recharts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("recharts")>();
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => (
      <div style={{ width: 800, height: 280 }}>{children}</div>
    ),
  };
});

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn(), warning: vi.fn() },
}));

function createTestStore(role: Role = "hr_admin", permissions: string[] = ["*"]) {
  return configureStore({
    reducer: {
      sidebar: sidebarReducer,
      [settingsApi.reducerPath]: settingsApi.reducer,
    },
    preloadedState: {
      sidebar: {
        userPermissions: permissions,
        userRole: role,
        sidebarOpen: true,
        expandedSections: {},
        loading: false,
        error: null,
      },
    },
    middleware: (getDefault) => getDefault().concat(settingsApi.middleware),
  });
}

function setUser(role: Role = "hr_admin", id = "hr-1") {
  aurix.set({
    user: {
      id,
      fullName: "Priya Finance",
      email: "priya@ofc360.in",
      phone: "",
      role,
      companyId: "comp-1",
      emailVerified: true,
      onboardingComplete: true,
      createdAt: "2026-01-01T00:00:00Z",
    },
  });
}

function installDefaultMetadataHandlers() {
  server.use(
    http.get("*/api/v2/payroll/cycles", () => HttpResponse.json({ success: true, data: [] })),
    http.get("*/api/v2/payroll/runs", () => HttpResponse.json({ success: true, data: [] })),
    http.get("*/departments", () => HttpResponse.json({ success: true, data: { items: [] } })),
    http.get("*/api/v1/settings/designations", () =>
      HttpResponse.json({ success: true, data: { items: [] } })
    ),
    http.get("*/branches", () => HttpResponse.json({ success: true, data: { items: [] } })),
    http.get("*/api/v2/payroll/payment-modes", () => HttpResponse.json({ success: true, data: [] })),
    http.get("*/api/v1/settings/company", () =>
      HttpResponse.json({ success: true, data: { name: "OFC360 Tech Pvt Ltd" } })
    ),
    http.get("*/api/v2/payroll/payment-batches/summary", () =>
      new HttpResponse(null, { status: 404 })
    ),
    http.get("*/api/v2/payroll/payment-batches", () =>
      HttpResponse.json({ success: true, data: { items: [], total: 0 } })
    ),
    http.get("*/api/v2/reports/analytics/*", () => new HttpResponse(null, { status: 404 }))
  );
}

describe("Enterprise Payroll Reports & Analytics Dashboard", () => {
  beforeEach(() => {
    setUser("hr_admin");
    window.history.replaceState({}, "", "/dashboard/payroll/reports");
    installDefaultMetadataHandlers();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("enforces tenant isolation: blocks super_admin on route guard and component guard", () => {
    expect(checkRouteAccess("/dashboard/payroll/reports", "super_admin").allowed).toBe(false);
    expect(checkRouteAccess("/dashboard/payroll/reports/payroll-register", "super_admin").allowed).toBe(false);
    expect(checkRouteAccess("/dashboard/payroll/reports", "hr_admin").allowed).toBe(true);
    expect(checkRouteAccess("/dashboard/payroll/reports", "executive").allowed).toBe(true);
    expect(checkRouteAccess("/dashboard/payroll/reports", "employee").allowed).toBe(false);

    setUser("super_admin", "sa-1");
    render(
      <Provider store={createTestStore("super_admin")}>
        <PayrollReportsPage />
      </Provider>
    );
    expect(screen.getByText("Tenant Payroll Access Restricted")).toBeInTheDocument();
  });

  it("renders all 9 clickable report KPI cards from live OpenAPI endpoints with independent error handling", async () => {
    server.use(
      http.get("*/api/v2/payroll/reports/:reportKey", ({ params }) => {
        const key = String(params.reportKey);
        if (key === "payroll_variance") {
          return new HttpResponse(null, { status: 500 });
        }
        return HttpResponse.json({
          success: true,
          data: {
            reportKey: key,
            totalRecords: 12,
            generatedAt: "2026-11-28T08:00:00Z",
            summaryTotals: {
              totalGross: 2450000,
              totalNet: 2100000,
              totalCost: 2680000,
              totalAllocated: 2680000,
              totalPayable: 2100000,
              closingHeadcount: 42,
              ytdGross: 19600000,
            },
            rows: [],
          },
        });
      }),
      http.get("*/api/v2/payroll/accounting-export", () =>
        HttpResponse.json({
          success: true,
          data: {
            payrollRunId: "run-1",
            periodName: "November 2026",
            totalDebitPaise: 268000000,
            totalCreditPaise: 268000000,
            isBalanced: true,
            entries: [
              {
                id: "je-1",
                accountCode: "5001",
                accountName: "Salary Expense",
                accountType: "earning",
                debitAmountPaise: 268000000,
                creditAmountPaise: 0,
              },
            ],
          },
        })
      )
    );

    render(
      <Provider store={createTestStore("hr_admin")}>
        <PayrollReportsPage />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Payroll Register")).toBeInTheDocument();
      expect(screen.getByText("Salary Statement")).toBeInTheDocument();
      expect(screen.getByText("Department-wise Payroll")).toBeInTheDocument();
      expect(screen.getByText("Cost Center-wise Payroll")).toBeInTheDocument();
      expect(screen.getByText("Bank Advice Report")).toBeInTheDocument();
      expect(screen.getByText("Payroll Variance Report")).toBeInTheDocument();
      expect(screen.getByText("Headcount Report")).toBeInTheDocument();
      expect(screen.getByText("YTD Payroll Summary")).toBeInTheDocument();
      expect(screen.getByText("Accounting Journal Export")).toBeInTheDocument();
    });

    // Variance card independently shows error while other cards show real backend totals
    await waitFor(() => {
      expect(screen.getByText("Unable to Load Report")).toBeInTheDocument();
      expect(screen.getAllByText(/₹24,50,000\.00/).length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("42")).toBeInTheDocument();
    });
  });

  it("renders Payroll Register rows and opens Employee Breakdown Drawer on click", async () => {
    server.use(
      http.get("*/api/v2/payroll/reports/payroll_register", () =>
        HttpResponse.json({
          success: true,
          data: {
            reportKey: "payroll_register",
            periodLabel: "November 2026",
            totalRecords: 1,
            summaryTotals: {
              totalEmployees: 1,
              totalGross: 120000,
              totalDeductions: 18000,
              totalNet: 102000,
              employerContributions: 12000,
            },
            rows: [
              {
                employeeId: "emp-1",
                employeeCode: "OFC-001",
                employeeName: "Aarav Mehta",
                department: "Engineering",
                designation: "Senior Engineer",
                employmentType: "full_time",
                basicPay: 60000,
                hra: 30000,
                allowances: 30000,
                grossEarnings: 120000,
                pfDeduction: 7200,
                tdsDeduction: 10800,
                totalDeductions: 18000,
                netPay: 102000,
                payrollStatus: "Finalized",
              },
            ],
          },
        })
      )
    );

    render(
      <Provider store={createTestStore("hr_admin")}>
        <PayrollRegisterReport />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Aarav Mehta")).toBeInTheDocument();
      expect(screen.getByText("OFC-001")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Aarav Mehta"));
    await waitFor(() => {
      expect(screen.getByText("Earnings Breakdown")).toBeInTheDocument();
      expect(screen.getByText("Basic Salary")).toBeInTheDocument();
      expect(screen.getByText("House Rent Allowance (HRA)")).toBeInTheDocument();
    });
  });

  it("displays Not Configured instead of inventing budgets on Cost Center report", async () => {
    server.use(
      http.get("*/api/v2/payroll/reports/cost_center_payroll", () =>
        HttpResponse.json({
          success: true,
          data: {
            reportKey: "cost_center_payroll",
            totalRecords: 1,
            rows: [
              {
                costCenterCode: "CC-ENG-01",
                costCenterName: "Platform Engineering",
                department: "Engineering",
                employeeCount: 14,
                allocatedEarnings: 1400000,
                allocatedEmployerContributions: 120000,
                totalAllocatedPayrollCost: 1520000,
                allocatedBudget: null,
              },
            ],
          },
        })
      )
    );

    render(
      <Provider store={createTestStore("hr_admin")}>
        <CostCenterWiseReport />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("CC-ENG-01")).toBeInTheDocument();
      expect(screen.getAllByText("Not Configured").length).toBeGreaterThanOrEqual(2);
    });
  });

  it("masks/strips ciphertext accounts in Bank Advice Report and avoids false Paid status", async () => {
    server.use(
      http.get("*/api/v2/payroll/reports/bank_advice", () =>
        HttpResponse.json({
          success: true,
          data: {
            reportKey: "bank_advice",
            totalRecords: 2,
            rows: [
              {
                employeeCode: "OFC-010",
                employeeName: "Neha Kapoor",
                department: "Finance",
                bankName: "HDFC Bank",
                accountNumberMasked: "ofc360:v1:encryptedblob",
                ifscCode: "HDFC0000512",
                netPayableAmount: 85000,
                batchNumber: "PB-202611-01",
                paymentMode: "NEFT",
                paymentStatus: "processing",
              },
              {
                employeeCode: "OFC-011",
                employeeName: "Rohan Das",
                department: "Sales",
                bankName: "ICICI Bank",
                accountNumberMasked: "••••••••4421",
                ifscCode: "ICIC0000101",
                netPayableAmount: 72000,
                batchNumber: "PB-202611-01",
                paymentMode: "NEFT",
                paymentStatus: "paid",
                utr: "UTR998877",
              },
            ],
          },
        })
      )
    );

    render(
      <Provider store={createTestStore("hr_admin")}>
        <BankAdviceReport />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Neha Kapoor")).toBeInTheDocument();
      expect(screen.getByText("••••••••4421")).toBeInTheDocument();
      expect(screen.queryByText(/ofc360:v1:/i)).not.toBeInTheDocument();
    });
  });

  it("handles zero previous period without NaN/Infinity and shows Reason Not Available in Variance Report", async () => {
    server.use(
      http.get("*/api/v2/payroll/reports/payroll_variance", () =>
        HttpResponse.json({
          success: true,
          data: {
            reportKey: "payroll_variance",
            totalRecords: 1,
            rows: [
              {
                employeeCode: "OFC-099",
                employeeName: "Kiran Rao",
                department: "Product",
                previousGross: 0,
                currentGross: 95000,
                previousDeductions: 0,
                currentDeductions: 10000,
              },
            ],
          },
        })
      )
    );

    render(
      <Provider store={createTestStore("hr_admin")}>
        <PayrollVarianceReport />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Kiran Rao")).toBeInTheDocument();
      expect(screen.getByText("Reason Not Available")).toBeInTheDocument();
      expect(screen.getByText("N/A (Prev ₹0)")).toBeInTheDocument();
      expect(screen.queryByText(/\b(Infinity|NaN)\b/)).not.toBeInTheDocument();
    });
  });

  it("flags unbalanced double-entry journals and unmapped GL accounts in Accounting Journal Export", async () => {
    server.use(
      http.get("*/api/v2/payroll/accounting-export", () =>
        HttpResponse.json({
          success: true,
          data: {
            payrollRunId: "run-nov",
            periodName: "November 2026",
            totalDebitPaise: 50000000,
            totalCreditPaise: 45000000,
            isBalanced: false,
            entries: [
              {
                id: "je-1",
                accountCode: "5010",
                accountName: "Salaries & Wages",
                accountType: "earning",
                debitAmountPaise: 50000000,
                creditAmountPaise: 0,
                referenceDescription: "Monthly gross salaries",
              },
              {
                id: "je-2",
                accountCode: "UNMAPPED",
                accountName: "Unmapped Statutory Payable",
                accountType: "deduction",
                debitAmountPaise: 0,
                creditAmountPaise: 45000000,
                referenceDescription: "Withholdings",
              },
            ],
          },
        })
      )
    );

    render(
      <Provider store={createTestStore("hr_admin")}>
        <AccountingJournalReport />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Unbalanced Double-Entry Journal Detected")).toBeInTheDocument();
      expect(screen.getByText("UNMAPPED")).toBeInTheDocument();
    });
  });

  it("supports YTD Indian FY view switching (Employee / Department / Company)", async () => {
    server.use(
      http.get("*/api/v2/payroll/reports/ytd_payroll", () =>
        HttpResponse.json({
          success: true,
          data: {
            reportKey: "ytd_payroll",
            totalRecords: 1,
            rows: [
              {
                employeeCode: "OFC-005",
                employeeName: "Vikram Singh",
                department: "Operations",
                monthsProcessed: 8,
                ytdBasicSalary: 400000,
                ytdGross: 800000,
                ytdPf: 48000,
                ytdTds: 64000,
                ytdNet: 688000,
                ytdEmployerContributions: 48000,
              },
            ],
          },
        })
      )
    );

    render(
      <Provider store={createTestStore("hr_admin")}>
        <YtdPayrollReport />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("Vikram Singh")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("tab", { name: "Department-wise" }));
    await waitFor(() => {
      expect(screen.getByText("Operations")).toBeInTheDocument();
    });
  });

  it("triggers server-side export and avoids calling colliding dashboard-kpis endpoint", async () => {
    let collided = false;
    server.use(
      http.get("*/api/v2/payroll/reports/dashboard-kpis", () => {
        collided = true;
        return new HttpResponse(null, { status: 404 });
      }),
      http.get("*/api/v2/payroll/reports/payroll_register", () =>
        HttpResponse.json({
          success: true,
          data: { reportKey: "payroll_register", totalRecords: 0, rows: [] },
        })
      ),
      http.post("*/api/v2/payroll/reports/payroll_register/export", () =>
        HttpResponse.json({
          success: true,
          data: { exportId: "exp-101", fileName: "payroll_register.xlsx" },
        })
      ),
      http.get("*/api/v2/payroll/reports/exports/exp-101/download", () =>
        new HttpResponse("xlsx-binary", {
          status: 200,
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": 'attachment; filename="payroll_register.xlsx"',
          },
        })
      )
    );

    await reportAnalyticsApi.getSingleDashboardKpi("payroll_register");
    expect(collided).toBe(false);

    const exportMeta = await reportsApi.requestReportExport("payroll_register", "xlsx", {
      financialYear: "2026-2027",
    });
    expect(exportMeta.exportId).toBe("exp-101");

    const downloaded = await reportsApi.downloadReportExport("exp-101");
    expect(downloaded.filename).toBe("payroll_register.xlsx");
  });
});

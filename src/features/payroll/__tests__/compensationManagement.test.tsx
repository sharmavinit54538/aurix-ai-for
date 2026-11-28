import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { aurix, type Role } from "@/lib/aurix-store";
import { checkRouteAccess } from "@/lib/route-guards";
import { compensationApi } from "../api/compensationApi";
import EmployeeCompensationPage from "../pages/EmployeeCompensationPage";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn(), warning: vi.fn() },
}));

function setUser(role: Role = "hr_admin", id = "hr-1") {
  aurix.set({
    user: {
      id,
      fullName: "Priya HR",
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

function installDefaultLookups() {
  server.use(
    http.get("*/api/v1/employees", () =>
      HttpResponse.json({
        success: true,
        data: {
          items: [
            {
              id: "11111111-1111-1111-1111-111111111111",
              employee_code: "EMP-001",
              full_name: "Rahul Sharma",
              department_name: "Engineering",
              designation: "Senior Engineer",
              employment_type: "full_time",
              joining_date: "2024-03-15",
            },
            {
              id: "22222222-2222-2222-2222-222222222222",
              employee_code: "EMP-002",
              full_name: "Neha Verma",
              department_name: "Finance",
              designation: "Finance Lead",
              employment_type: "full_time",
              joining_date: "2023-07-01",
            },
          ],
          total: 2,
        },
      })
    ),
    http.get("*/api/v1/payroll/salary-structures", () =>
      HttpResponse.json({
        success: true,
        data: [
          {
            id: "struct-uuid-1",
            code: "STD-ENG",
            name: "Standard Engineering Structure",
            is_active: true,
            effective_date: "2026-04-01",
            currency: "INR",
            components: [
              {
                component_id: "c1",
                code: "BASIC",
                name: "Basic Salary",
                type: "earning",
                calculation_method: "percentage_of_ctc",
                percentage_or_amount: 50,
              },
            ],
          },
        ],
      })
    ),
    http.get("*/api/v1/departments", () =>
      HttpResponse.json({
        success: true,
        data: { items: [{ id: "dept-1", name: "Engineering" }] },
      })
    )
  );
}

describe("Compensation Management — Data Flow, Normalization & Controls", () => {
  beforeEach(() => {
    setUser("hr_admin");
    installDefaultLookups();
  });

  afterEach(() => {
    aurix.set({ user: null });
  });

  it("blocks super_admin from /dashboard/payroll/compensation without calling tenant APIs", () => {
    const guard = checkRouteAccess("/dashboard/payroll/compensation", "super_admin");
    expect(guard.allowed).toBe(false);

    let calledCompApi = false;
    server.use(
      http.get("*/api/v2/payroll/compensations", () => {
        calledCompApi = true;
        return HttpResponse.json({ success: true, data: { items: [], total: 0 } });
      })
    );

    setUser("super_admin", "sa-1");
    render(<EmployeeCompensationPage />);

    expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
    expect(calledCompApi).toBe(false);
  });

  it("normalizes snake_case payloads, hydrates missing master metadata, never shows UUID as employee code, separates monthly gross from CTC/12, and never defaults status to ACTIVE", async () => {
    server.use(
      http.get("*/api/v2/payroll/compensations", () =>
        HttpResponse.json({
          success: true,
          data: {
            total: 3,
            page: 1,
            limit: 20,
            items: [
              {
                id: "comp-1",
                employee_id: "11111111-1111-1111-1111-111111111111",
                // Deliberately omit employee_code (test UUID non-leak + lookup hydration),
                // employee_name, department_name, and salary_structure_name to verify master hydration
                employee_code: "11111111-1111-1111-1111-111111111111",
                salary_structure_id: "struct-uuid-1",
                annual_ctc: 1200000,
                monthly_ctc: 100000,
                monthly_gross: 92000,
                effective_from: "2026-04-01",
                status: "scheduled",
              },
              {
                id: "comp-2",
                employee_id: "22222222-2222-2222-2222-222222222222",
                employee_code: "EMP-002",
                employee_name: "Neha Verma",
                department_name: "Finance",
                salary_structure_id: "struct-uuid-1",
                salary_structure_name: "Executive Structure",
                ctc_annual_paise: 180000000,
                // Omit monthly_gross to ensure frontend NEVER computes CTC / 12 = 150000
                effective_date: "2026-01-15",
                status: "pending_approval",
              },
              {
                id: "comp-3",
                employee_id: "emp-3-uuid",
                employee_code: "EMP-003",
                employee_name: "Aman Patel",
                department_name: "Operations",
                // Unassigned structure and omitted status -> must NOT show ACTIVE
                annual_ctc: null,
                monthly_gross: null,
                effective_from: null,
                status: null,
              },
            ],
          },
        })
      )
    );

    render(<EmployeeCompensationPage />);

    await waitFor(() => {
      expect(screen.getByText("Rahul Sharma")).toBeInTheDocument();
      expect(screen.getByText(/EMP-001/)).toBeInTheDocument();
      expect(screen.getByText("Standard Engineering Structure")).toBeInTheDocument();
      expect(screen.getByText("₹12,00,000.00")).toBeInTheDocument();
      expect(screen.getAllByText("₹92,000.00").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("Scheduled")).toBeInTheDocument();

      expect(screen.getByText("Neha Verma")).toBeInTheDocument();
      expect(screen.getByText("₹18,00,000.00")).toBeInTheDocument();
      expect(screen.getByText("Pending Approval")).toBeInTheDocument();
      // Must NOT compute 18,00,000 / 12 = 1,50,000 as Monthly Gross
      expect(screen.queryByText("₹1,50,000.00")).not.toBeInTheDocument();

      expect(screen.getByText("Aman Patel")).toBeInTheDocument();
      expect(screen.queryByText("11111111-1111-1111-1111-111111111111")).not.toBeInTheDocument();
    });

    // Status for Aman Patel must show Not Assigned (never defaulted to Active)
    expect(screen.queryByText("Active")).not.toBeInTheDocument();
    expect(screen.getAllByText("Not Assigned").length).toBeGreaterThanOrEqual(2);
  });

  it("opens View Details drawer and immutable History modal, and allows checker approval without crashing on string actors", async () => {
    let approvedRevisionId: string | null = null;

    server.use(
      http.get("*/api/v2/payroll/compensations", () =>
        HttpResponse.json({
          success: true,
          data: {
            total: 1,
            page: 1,
            limit: 20,
            items: [
              {
                id: "comp-1",
                employee_id: "11111111-1111-1111-1111-111111111111",
                employee_code: "EMP-001",
                employee_name: "Rahul Sharma",
                department_name: "Engineering",
                salary_structure_id: "struct-uuid-1",
                salary_structure_name: "Standard Engineering Structure",
                annual_ctc: 1200000,
                monthly_ctc: 100000,
                monthly_gross: 92000,
                effective_from: "2026-04-01",
                status: "active",
              },
            ],
          },
        })
      ),
      http.get("*/api/v2/payroll/employees/11111111-1111-1111-1111-111111111111/compensation", () =>
        HttpResponse.json({
          success: true,
          data: {
            id: "comp-1",
            employee_id: "11111111-1111-1111-1111-111111111111",
            employee_code: "EMP-001",
            employee_name: "Rahul Sharma",
            department_name: "Engineering",
            designation: "Senior Engineer",
            employment_type: "full_time",
            joining_date: "2024-03-15",
            salary_structure_id: "struct-uuid-1",
            salary_structure_name: "Standard Engineering Structure",
            annual_ctc: 1200000,
            monthly_ctc: 100000,
            annual_gross: 1104000,
            monthly_gross: 92000,
            fixed_compensation: 1050000,
            variable_compensation: 54000,
            employer_contributions: 96000,
            effective_from: "2026-04-01",
            status: "active",
            components: [
              {
                component_id: "c-basic",
                code: "BASIC",
                name: "Basic Salary",
                type: "earning",
                monthly_amount: 50000,
                annual_amount: 600000,
              },
            ],
            revisions: [
              {
                id: "rev-101",
                revision_number: 2,
                effective_from: "2026-04-01",
                previous_annual_ctc: 1000000,
                revised_annual_ctc: 1200000,
                previous_monthly_gross: 78000,
                revised_monthly_gross: 92000,
                reason: "Annual Performance Review",
                status: "pending_approval",
                revised_by: "Anita HR",
              },
            ],
          },
        })
      ),
      http.post("*/api/v2/payroll/compensation/revisions/rev-101/approve", ({ request }) => {
        approvedRevisionId = request.url.split("/revisions/")[1]?.split("/approve")[0] ?? null;
        return HttpResponse.json({
          success: true,
          data: { id: "rev-101", status: "approved" },
        });
      })
    );

    render(<EmployeeCompensationPage />);

    await waitFor(() => {
      expect(screen.getByText("Rahul Sharma")).toBeInTheDocument();
    });

    // Open View Drawer
    fireEvent.click(screen.getByRole("button", { name: /^View$/i }));
    await waitFor(() => {
      expect(screen.getByText("Basic Salary")).toBeInTheDocument();
      expect(screen.getByText("₹50,000.00")).toBeInTheDocument();
      expect(screen.getAllByText("₹6,00,000.00").length).toBeGreaterThanOrEqual(1);
    });

    // Switch to History from Drawer
    fireEvent.click(screen.getByRole("button", { name: /Revision History/i }));
    await waitFor(() => {
      expect(screen.getByText(/Annual Performance Review/)).toBeInTheDocument();
      expect(screen.getByText("Anita HR")).toBeInTheDocument();
      expect(screen.getByText(/Revision #2/)).toBeInTheDocument();
    });

    // Approve Revision cleanly
    fireEvent.click(screen.getByRole("button", { name: /Approve/i }));
    fireEvent.change(screen.getByPlaceholderText(/Approved per annual appraisal cycle/i), {
      target: { value: "Approved per FY26 budget" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Approve Revision/i }));

    await waitFor(() => {
      expect(approvedRevisionId).toBe("rev-101");
    });
  });

  it("requires confirmation before submitting Revise CTC proposal and warns on retroactive dates", async () => {
    let submittedPayload: Record<string, unknown> | null = null;

    server.use(
      http.get("*/api/v2/payroll/compensations", () =>
        HttpResponse.json({
          success: true,
          data: {
            total: 1,
            page: 1,
            limit: 20,
            items: [
              {
                id: "comp-1",
                employee_id: "11111111-1111-1111-1111-111111111111",
                employee_code: "EMP-001",
                employee_name: "Rahul Sharma",
                department_name: "Engineering",
                salary_structure_id: "struct-uuid-1",
                salary_structure_name: "Standard Engineering Structure",
                annual_ctc: 1200000,
                monthly_gross: 92000,
                effective_from: "2026-04-01",
                status: "active",
              },
            ],
          },
        })
      ),
      http.get("*/api/v2/payroll/employees/11111111-1111-1111-1111-111111111111/compensation", () =>
        HttpResponse.json({
          success: true,
          data: {
            id: "comp-1",
            employee_id: "11111111-1111-1111-1111-111111111111",
            employee_code: "EMP-001",
            employee_name: "Rahul Sharma",
            annual_ctc: 1200000,
            monthly_gross: 92000,
            effective_from: "2026-04-01",
            status: "active",
          },
        })
      ),
      http.post(
        "*/api/v2/payroll/employees/11111111-1111-1111-1111-111111111111/compensation/revisions",
        async ({ request }) => {
          submittedPayload = (await request.json()) as Record<string, unknown>;
          return HttpResponse.json({
            success: true,
            data: { id: "rev-new", status: "pending_approval" },
          });
        }
      )
    );

    render(<EmployeeCompensationPage />);
    await waitFor(() => expect(screen.getByText("Rahul Sharma")).toBeInTheDocument());

    fireEvent.click(screen.getByRole("button", { name: /Revise CTC/i }));
    await waitFor(() => expect(screen.getByText("Revise Employee Compensation")).toBeInTheDocument());

    fireEvent.change(screen.getByLabelText(/Revised Annual CTC/i), {
      target: { value: "1500000" },
    });
    fireEvent.change(screen.getByLabelText(/Effective From Date/i), {
      target: { value: "2026-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/Revision Reason/i), {
      target: { value: "Promotion to Staff Engineer" },
    });

    // Past-date arrears warning appears
    expect(screen.getByText(/Retroactive Revision & Arrears Impact/i)).toBeInTheDocument();

    // First click reveals confirmation banner (never directly mutates without confirmation)
    fireEvent.click(screen.getByRole("button", { name: /Review Revision/i }));
    expect(screen.getByText(/Confirm Submission for Approval/i)).toBeInTheDocument();
    expect(submittedPayload).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /Confirm & Submit Revision/i }));
    await waitFor(() => {
      expect(submittedPayload).not.toBeNull();
      expect(submittedPayload?.newCtcAnnualPaise).toBe(150000000);
      expect(submittedPayload?.reason).toBe("Promotion to Staff Engineer");
    });
  });

  it("displays dashes (never zero) on summary KPI cards when compensation API fails", async () => {
    server.use(
      http.get("*/api/v2/payroll/compensations", () =>
        HttpResponse.json({ message: "Database timeout" }, { status: 500 })
      )
    );

    render(<EmployeeCompensationPage />);

    await waitFor(() => {
      expect(screen.getAllByText(/Unable to Load Compensation/i).length).toBeGreaterThanOrEqual(1);
    });

    // Ensure no synthetic zero appears for Total Annual CTC
    expect(screen.queryByText("₹0.00")).not.toBeInTheDocument();
  });

  it("api normalizer never crashes or coerces missing status to active", async () => {
    server.use(
      http.get("*/api/v2/payroll/compensations", () =>
        HttpResponse.json({
          success: true,
          data: {
            items: [
              {
                id: "c-x",
                employee_id: "emp-x",
                annual_ctc: 600000,
                status: null,
              },
            ],
            total: 1,
          },
        })
      )
    );

    const res = await compensationApi.getEmployeeCompensations();
    expect(res.items).toHaveLength(1);
    expect(res.items[0].status).toBe("unknown");
    expect(res.items[0].ctcAnnualPaise).toBe(60000000);
    expect(res.items[0].grossMonthlyPaise).toBeNull();
  });
});

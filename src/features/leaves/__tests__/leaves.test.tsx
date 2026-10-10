import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import {
  mapLeave,
  mapBalance,
  mapStatus,
  formatDateStr,
  calculateEstimatedDays,
  isLeaveCancellable,
  getSafeInitial,
} from "../mappers";
import { LeavesPage } from "../pages/LeavesPage";
import { ApprovalsList } from "../components/ApprovalsList";
import { HistoryTable } from "../components/HistoryTable";
import { AllBalancesPanel } from "../components/AllBalancesPanel";
import { api } from "@/api";

// Mock @/api
vi.mock("@/api", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

// Mock current role and store
let mockRole: string = "hr_admin";
let mockUser: any = { id: "user-1", fullName: "Admin User", role: "hr_admin" };

vi.mock("@/lib/roles", () => ({
  normalizeRole: (r: string) => r,
}));

vi.mock("@/lib/use-current-role", () => ({
  useCurrentRole: () => mockRole,
}));

vi.mock("@/lib/aurix-store", () => ({
  useAurix: () => ({
    user: mockUser,
    employees: [],
  }),
}));

describe("Leaves Feature Test Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRole = "hr_admin";
    mockUser = { id: "user-1", fullName: "Admin User", role: "hr_admin" };
  });

  // 1. Status mapping & normalization
  describe("1. Status mapping and data normalization", () => {
    it("normalizes uppercase status values to lowercase and casts numeric string days", () => {
      expect(mapStatus("PENDING")).toBe("pending");
      expect(mapStatus("APPROVED")).toBe("approved");
      expect(mapStatus("REJECTED")).toBe("rejected");
      expect(mapStatus("CANCELLED")).toBe("cancelled");
      expect(mapStatus("UNKNOWN")).toBe("pending");
      expect(mapStatus(null)).toBe("pending");

      const rawBackendLeave = {
        id: "leave-101",
        employee_name: "Jane Doe",
        department: "Engineering",
        leave_type: "Casual Leave",
        start_date: "2026-06-01",
        end_date: "2026-06-03",
        total_days: "3.0", // string decimal from backend
        reason: "Family function",
        status: "APPROVED",
        rejection_reason: null,
      };

      const mapped = mapLeave(rawBackendLeave);
      expect(mapped.id).toBe("leave-101");
      expect(mapped.employee_name).toBe("Jane Doe");
      expect(mapped.department).toBe("Engineering");
      expect(mapped.status).toBe("approved");
      expect(mapped.total_days).toBe(3);
      expect(typeof mapped.total_days).toBe("number");
      expect(mapped.rejection_reason).toBeUndefined();
    });

    it("normalizes balance objects with numeric string values", () => {
      const rawBalance = {
        leave_type: "Sick Leave",
        total_days: "12.0",
        used_days: "4.5",
        remaining_days: "7.5",
      };

      const mapped = mapBalance(rawBalance);
      expect(mapped.leave_type).toBe("Sick Leave");
      expect(mapped.total_days).toBe(12);
      expect(mapped.used_days).toBe(4.5);
      expect(mapped.remaining_days).toBe(7.5);
    });

    it("handles null / undefined safely with defaults", () => {
      const mapped = mapLeave(null);
      expect(mapped.id).toBe("");
      expect(mapped.employee_name).toBe("Employee");
      expect(mapped.department).toBe("Staff");
      expect(mapped.status).toBe("pending");
      expect(mapped.total_days).toBe(0);

      const bal = mapBalance(undefined);
      expect(bal.total_days).toBe(0);
      expect(bal.used_days).toBe(0);
      expect(bal.remaining_days).toBe(0);
    });
  });

  // 2. Date formatting has no day shift
  describe("2. Date formatting with no timezone day shift", () => {
    it("formats YYYY-MM-DD as local date without shifting backwards or forwards", () => {
      // 2026-05-15 in UTC could shift to 14 May in negative offsets with new Date("2026-05-15")
      const formatted = formatDateStr("2026-05-15");
      expect(formatted).toBe("15 May 2026");

      const formattedJan = formatDateStr("2026-01-01");
      expect(formattedJan).toBe("1 Jan 2026");

      const formattedDec = formatDateStr("2026-12-31");
      expect(formattedDec).toBe("31 Dec 2026");

      expect(formatDateStr(null)).toBe("—");
      expect(formatDateStr("")).toBe("—");
    });

    it("calculates estimated days correctly inclusive of start and end date", () => {
      expect(calculateEstimatedDays("2026-05-15", "2026-05-15")).toBe(1);
      expect(calculateEstimatedDays("2026-05-15", "2026-05-17")).toBe(3);
      expect(calculateEstimatedDays("2026-05-18", "2026-05-15")).toBe(0); // end before start
      expect(calculateEstimatedDays("", "2026-05-15")).toBe(0);
    });
  });

  // 3. History badge & rejection reason
  describe("3. History badge and rejection reason rendering", () => {
    it("renders badges for approved, pending, and rejected, and shows rejection reason when rejected", () => {
      const mockHistory = [
        {
          id: "req-1",
          employee_name: "Self",
          department: "Eng",
          leave_type: "Casual Leave",
          start_date: "2026-07-01",
          end_date: "2026-07-02",
          total_days: 2,
          reason: "Personal",
          status: "approved" as const,
        },
        {
          id: "req-2",
          employee_name: "Self",
          department: "Eng",
          leave_type: "Sick Leave",
          start_date: "2026-07-10",
          end_date: "2026-07-11",
          total_days: 2,
          reason: "Fever",
          status: "rejected" as const,
          rejection_reason: "Critical sprint deadline",
        },
        {
          id: "req-3",
          employee_name: "Self",
          department: "Eng",
          leave_type: "Vacation Leave",
          start_date: "2026-08-01",
          end_date: "2026-08-05",
          total_days: 5,
          reason: "Holiday",
          status: "pending" as const,
        },
      ];

      render(<HistoryTable history={mockHistory} />);

      expect(screen.getByText("approved")).toBeInTheDocument();
      expect(screen.getByText("rejected")).toBeInTheDocument();
      expect(screen.getByText("pending")).toBeInTheDocument();

      // Verify rejection reason is clearly rendered
      expect(screen.getByText(/Reason:\s*Critical sprint deadline/i)).toBeInTheDocument();
    });

    it("identifies cancellable leave for pending and future approved leaves", () => {
      const today = "2026-05-01";
      expect(
        isLeaveCancellable(
          { status: "pending", start_date: "2026-04-01" },
          today
        )
      ).toBe(true);

      // Future approved is cancellable
      expect(
        isLeaveCancellable(
          { status: "approved", start_date: "2026-05-10" },
          today
        )
      ).toBe(true);

      // Past approved is not cancellable
      expect(
        isLeaveCancellable(
          { status: "approved", start_date: "2026-04-20" },
          today
        )
      ).toBe(false);

      // Rejected is not cancellable
      expect(
        isLeaveCancellable(
          { status: "rejected", start_date: "2026-05-10" },
          today
        )
      ).toBe(false);
    });
  });

  // 4. Approvals show employee_name & department & safe initial
  describe("4. Approvals list displays employee_name and department with safe avatar initial", () => {
    it("displays employee_name and department from backend item", () => {
      const mockApprovals = [
        {
          id: "app-1",
          employee_name: "Alice Walker",
          department: "Product Design",
          leave_type: "Sick Leave",
          start_date: "2026-05-10",
          end_date: "2026-05-11",
          total_days: 2,
          reason: "Medical appointment",
          status: "pending" as const,
        },
      ];

      render(
        <ApprovalsList
          approvals={mockApprovals}
          onRefresh={vi.fn()}
          onApproveClick={vi.fn()}
          onRejectClick={vi.fn()}
        />
      );

      expect(screen.getByText("Alice Walker")).toBeInTheDocument();
      expect(screen.getByText("Product Design")).toBeInTheDocument();
      expect(screen.getByText("A")).toBeInTheDocument(); // initial
    });

    it("safely generates initial when employee_name is missing or empty", () => {
      expect(getSafeInitial("")).toBe("E");
      expect(getSafeInitial("   ")).toBe("E");
      expect(getSafeInitial(null)).toBe("E");
      expect(getSafeInitial(undefined)).toBe("E");
      expect(getSafeInitial("bob")).toBe("B");
    });
  });

  // 5. Double-click approve fires one request
  describe("5. Double-click prevention and loading state on Approve", () => {
    it("prevents duplicate requests when approve is clicked rapidly", async () => {
      const onApproveClick = vi.fn();
      const mockApprovals = [
        {
          id: "app-1",
          employee_name: "Bob Stone",
          department: "Quality Assurance",
          leave_type: "Casual Leave",
          start_date: "2026-05-20",
          end_date: "2026-05-21",
          total_days: 2,
          reason: "Personal work",
          status: "pending" as const,
        },
      ];

      const { rerender } = render(
        <ApprovalsList
          approvals={mockApprovals}
          onRefresh={vi.fn()}
          onApproveClick={onApproveClick}
          onRejectClick={vi.fn()}
          actionLoadingId={null}
        />
      );

      const approveBtn = screen.getByRole("button", { name: /approve/i });
      fireEvent.click(approveBtn);
      expect(onApproveClick).toHaveBeenCalledTimes(1);

      // When actionLoadingId is set to "app-1", both buttons disable
      rerender(
        <ApprovalsList
          approvals={mockApprovals}
          onRefresh={vi.fn()}
          onApproveClick={onApproveClick}
          onRejectClick={vi.fn()}
          actionLoadingId="app-1"
        />
      );

      const disabledBtn = screen.getByRole("button", { name: /approve/i });
      expect(disabledBtn).toBeDisabled();

      fireEvent.click(disabledBtn);
      // Still only 1 call
      expect(onApproveClick).toHaveBeenCalledTimes(1);
    });
  });

  // 6. Tabs hidden for employee role
  describe("6. Role capabilities & tab visibility", () => {
    it("hides Review Requests and All Balances tabs for employee role", async () => {
      mockRole = "employee";
      mockUser = { id: "emp-1", fullName: "Regular Employee", role: "employee" };

      vi.mocked(api.get).mockImplementation(async (path: string) => {
        if (path === "/leaves/balances") {
          return { success: true, data: [] };
        }
        if (path === "/leaves/history") {
          return { success: true, data: [] };
        }
        return { success: true, data: [] };
      });

      render(<LeavesPage />);

      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith("/leaves/balances", {
          headers: { "x-skip-cache": "true" },
        });
      });

      // Employee cannot review and cannot view all balances
      expect(screen.queryByText("Review Requests")).not.toBeInTheDocument();
      expect(screen.queryByText("All Balances")).not.toBeInTheDocument();
    });

    it("shows Review Requests and All Balances tabs for hr_admin", async () => {
      mockRole = "hr_admin";
      mockUser = { id: "hr-1", fullName: "HR Administrator", role: "hr_admin" };

      vi.mocked(api.get).mockResolvedValue({ success: true, data: [] });

      render(<LeavesPage />);

      await waitFor(() => {
        expect(screen.getByText("Review Requests")).toBeInTheDocument();
        expect(screen.getByText("All Balances")).toBeInTheDocument();
      });
    });
  });

  // 7. All Balances uses UUID
  describe("7. All Balances fetches from /leaves/employees and passes UUID to /leaves/balances/{id}", () => {
    it("calls /leaves/balances/{id} with employee UUID", async () => {
      const mockEmployees = [
        {
          id: "3fa85f64-5717-4562-b3fc-2c963f66afa6", // UUID
          employee_code: "EMP-0042",
          full_name: "Sarah Connor",
          department: "Security",
          designation: "Officer",
        },
      ];

      vi.mocked(api.get).mockImplementation(async (path: string) => {
        if (path.startsWith("/leaves/employees")) {
          return { success: true, data: mockEmployees };
        }
        if (path.startsWith("/leaves/balances/")) {
          return {
            success: true,
            data: [
              {
                leave_type: "Casual Leave",
                total_days: 12,
                used_days: 2,
                remaining_days: 10,
              },
            ],
          };
        }
        return { success: true, data: [] };
      });

      render(<AllBalancesPanel />);

      await waitFor(() => {
        expect(screen.getByText("Sarah Connor")).toBeInTheDocument();
      });

      // Click on Sarah Connor's row to view balances
      const viewBtn = screen.getByRole("button", { name: /view balances/i });
      fireEvent.click(viewBtn);

      await waitFor(() => {
        // Assert that the exact UUID was passed to /leaves/balances/{id}, NOT employee_code
        expect(api.get).toHaveBeenCalledWith(
          "/leaves/balances/3fa85f64-5717-4562-b3fc-2c963f66afa6",
          { headers: { "x-skip-cache": "true" } }
        );
      });

      // Verify detailed balances render
      expect(screen.getByText("Viewing balances for Sarah Connor")).toBeInTheDocument();
      expect(screen.getByText("10 remaining")).toBeInTheDocument();
    });
  });

  // 8. Visual Consistency & Token Mapping (Rules 4, 5, 6)
  describe("8. Theme token classes and visual consistency", () => {
    it("returns correct statusBadgeClass for all states", async () => {
      const { statusBadgeClass } = await import("../mappers");
      expect(statusBadgeClass("approved")).toBe(
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      );
      expect(statusBadgeClass("pending")).toBe(
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      );
      expect(statusBadgeClass("rejected")).toBe(
        "bg-destructive/10 text-destructive border-destructive/20"
      );
      expect(statusBadgeClass("cancelled")).toBe(
        "bg-muted text-muted-foreground border-border"
      );
    });

    it("maps 8px dot colors accurately per rule 4", async () => {
      const { getLeaveTypeDot } = await import("../mappers");
      expect(getLeaveTypeDot("Sick Leave")).toBe("bg-amber-500");
      expect(getLeaveTypeDot("Casual Leave")).toBe("bg-emerald-500");
      expect(getLeaveTypeDot("Vacation Leave")).toBe("bg-primary");
      expect(getLeaveTypeDot("Special Leave")).toBe("bg-muted-foreground");
    });
  });
});



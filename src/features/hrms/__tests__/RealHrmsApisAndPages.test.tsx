import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { expensesApi, mapExpenseFromBackend } from "@/services/expensesApi";
import { visitorsApi, mapVisitorFromBackend } from "@/services/visitorsApi";
import { travelApi, mapTravelFromBackend } from "@/services/travelApi";
import { onboardingChecklistApi, mapOnboardingFromBackend } from "@/services/onboardingChecklistApi";
import { offboardingApi, mapOffboardingFromBackend } from "@/services/offboardingApi";
import { hrOpsApi } from "@/services/hrOpsApi";
import { assetsApi, mapAssetFromBackend } from "@/services/assetsApi";
import ExpensesPage from "@/pages/ExpensesPage";
import VisitorsPage from "@/pages/VisitorsPage";
import TravelPage from "@/pages/TravelPage";
import OnboardingChecklistPage from "@/pages/OnboardingChecklistPage";
import OffboardingPage from "@/pages/OffboardingPage";
import HrOpsPage from "@/pages/HrOpsPage";
import DocumentGeneratorPage from "@/pages/DocumentGeneratorPage";

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

// Mock roles
vi.mock("@/lib/roles", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    isHrAdmin: (r?: string | null) => r === "hr_admin",
    isManager: (r?: string | null) => r === "manager",
    isSuperAdmin: (r?: string | null) => r === "super_admin",
  };
});

vi.mock("@/lib/use-current-role", () => ({
  useCurrentRole: () => "hr_admin",
}));

// Mock recharts responsive container for testing environment
vi.mock("recharts", async () => {
  const original = await vi.importActual("recharts");
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  };
});

describe("F-07: Real APIs and HRMS Modules", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("F-07.1 Mappers and Typed APIs", () => {
    it("mapExpenseFromBackend handles snake_case and sets status/category cleanly", () => {
      const mapped = mapExpenseFromBackend({
        id: "exp-123",
        employee_name: "Rahul Verma",
        category: "TRAVEL",
        amount: 4500,
        currency: "INR",
        date: "2026-10-01",
        description: "Flight to Mumbai",
        status: "PENDING",
      });
      expect(mapped.id).toBe("exp-123");
      expect(mapped.employee).toBe("Rahul Verma");
      expect(mapped.category).toBe("travel");
      expect(mapped.amount).toBe(4500);
      expect(mapped.status).toBe("pending");
    });

    it("mapVisitorFromBackend maps visitor properties without placeholders", () => {
      const mapped = mapVisitorFromBackend({
        id: "vis-1",
        name: "Pooja Hegde",
        company: "Acme Corp",
        host_employee: "Dev Lead",
        purpose: "Client Meeting",
        status: "APPROVED",
        pass_code: "VIS-9999",
      });
      expect(mapped.name).toBe("Pooja Hegde");
      expect(mapped.status).toBe("approved");
      expect(mapped.passCode).toBe("VIS-9999");
    });

    it("mapTravelFromBackend maps travel fields and history cleanly", () => {
      const mapped = mapTravelFromBackend({
        id: "tr-10",
        employee_name: "Anita Roy",
        type: "international",
        purpose: "Global Conference",
        destination: "London",
        travel_date: "2026-11-01",
        return_date: "2026-11-05",
        budget: 150000,
        status: "MANAGER-REVIEW",
        history: [{ stage: "draft", at: "2026-10-01T00:00:00.000Z" }],
      });
      expect(mapped.type).toBe("international");
      expect(mapped.destination).toBe("London");
      expect(mapped.status).toBe("manager-review");
      expect(mapped.history.length).toBe(1);
    });

    it("mapOnboardingFromBackend maps tasks and completion", () => {
      const mapped = mapOnboardingFromBackend({
        id: "ob-1",
        employee_name: "Vikram Seth",
        role: "DevOps Engineer",
        tasks: [{ key: "laptop", label: "Laptop assigned", is_completed: true, owner: "IT" }],
      });
      expect(mapped.employee).toBe("Vikram Seth");
      expect(mapped.tasks[0].done).toBe(true);
      expect(mapped.tasks[0].owner).toBe("IT");
    });

    it("mapOffboardingFromBackend maps exit records to offboarding case", () => {
      const mapped = mapOffboardingFromBackend({
        id: "ex-1",
        employee_name: "Karan Johar",
        last_working_day: "2026-10-31",
        stage: "settled",
      });
      expect(mapped.employee).toBe("Karan Johar");
      expect(mapped.status).toBe("completed");
    });

    it("mapAssetFromBackend normalizes asset model and status", () => {
      const mapped = mapAssetFromBackend({
        id: "ast-1",
        asset_tag: "AST-5555",
        name: "MacBook Pro",
        category: "LAPTOP",
        status: "ASSIGNED",
        assigned_to_name: "Neha Sharma",
      });
      expect(mapped.tag).toBe("AST-5555");
      expect(mapped.category).toBe("laptop");
      expect(mapped.status).toBe("assigned");
      expect(mapped.assignedTo).toBe("Neha Sharma");
    });
  });

  describe("F-07.2 Page Integration and UI Rendering", () => {
    it("ExpensesPage renders expenses from API and displays stats", async () => {
      vi.spyOn(expensesApi, "getExpenses").mockResolvedValueOnce({
        items: [
          {
            id: "e-1",
            employee: "Priya Patel",
            category: "meals",
            amount: 1200,
            currency: "INR",
            date: "2026-10-02",
            description: "Client Lunch",
            status: "pending",
            submittedAt: "2026-10-02T10:00:00.000Z",
          },
        ],
        total: 1,
      });

      render(<ExpensesPage />);

      await waitFor(() => {
        expect(screen.getByText("Priya Patel")).toBeInTheDocument();
        expect(screen.getByText("Client Lunch")).toBeInTheDocument();
        expect(screen.getByText("₹1,200")).toBeInTheDocument();
      });
    });

    it("ExpensesPage allows approving a pending expense", async () => {
      vi.spyOn(expensesApi, "getExpenses").mockResolvedValueOnce({
        items: [
          {
            id: "e-1",
            employee: "Priya Patel",
            category: "meals",
            amount: 1200,
            currency: "INR",
            date: "2026-10-02",
            description: "Client Lunch",
            status: "pending",
            submittedAt: "2026-10-02T10:00:00.000Z",
          },
        ],
        total: 1,
      });

      const approveSpy = vi.spyOn(expensesApi, "approveExpense").mockResolvedValueOnce({
        id: "e-1",
        employee: "Priya Patel",
        category: "meals",
        amount: 1200,
        currency: "INR",
        date: "2026-10-02",
        description: "Client Lunch",
        status: "approved",
        submittedAt: "2026-10-02T10:00:00.000Z",
      });

      render(<ExpensesPage />);

      await waitFor(() => {
        expect(screen.getByText("Approve")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Approve"));

      await waitFor(() => {
        expect(approveSpy).toHaveBeenCalledWith("e-1");
      });
    });

    it("VisitorsPage renders live visitor list from API and handles check-in", async () => {
      vi.spyOn(visitorsApi, "getVisitors").mockResolvedValueOnce({
        items: [
          {
            id: "v-1",
            name: "Sunil Grover",
            company: "Tech Mahindra",
            hostEmployee: "Deepak HR",
            purpose: "Consulting",
            expectedDurationMins: 45,
            status: "approved",
            passCode: "VIS-1234",
            createdAt: "2026-10-03T09:00:00.000Z",
          },
        ],
        total: 1,
      });

      const checkInSpy = vi.spyOn(visitorsApi, "checkInVisitor").mockResolvedValueOnce({
        id: "v-1",
        name: "Sunil Grover",
        company: "Tech Mahindra",
        hostEmployee: "Deepak HR",
        purpose: "Consulting",
        expectedDurationMins: 45,
        status: "checked-in",
        passCode: "VIS-1234",
        createdAt: "2026-10-03T09:00:00.000Z",
      });

      render(<VisitorsPage />);

      await waitFor(() => {
        expect(screen.getByText("Sunil Grover")).toBeInTheDocument();
        expect(screen.getByText("Check in")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Check in"));

      await waitFor(() => {
        expect(checkInSpy).toHaveBeenCalledWith("v-1");
      });
    });

    it("TravelPage renders travel requests and allows advancing stage", async () => {
      vi.spyOn(travelApi, "getTravelRequests").mockResolvedValueOnce({
        items: [
          {
            id: "tr-1",
            employee: "Arjun Nair",
            type: "domestic",
            purpose: "Client Pitch",
            destination: "Bengaluru",
            travelDate: "2026-10-10",
            returnDate: "2026-10-12",
            budget: 25000,
            currency: "INR",
            status: "draft",
            history: [{ stage: "draft", at: "2026-10-01T00:00:00.000Z" }],
            createdAt: "2026-10-01T00:00:00.000Z",
          },
        ],
        total: 1,
      });

      const advanceSpy = vi.spyOn(travelApi, "advanceTravelStage").mockResolvedValueOnce({
        id: "tr-1",
        employee: "Arjun Nair",
        type: "domestic",
        purpose: "Client Pitch",
        destination: "Bengaluru",
        travelDate: "2026-10-10",
        returnDate: "2026-10-12",
        budget: 25000,
        currency: "INR",
        status: "manager-review",
        history: [
          { stage: "draft", at: "2026-10-01T00:00:00.000Z" },
          { stage: "manager-review", at: "2026-10-03T00:00:00.000Z" },
        ],
        createdAt: "2026-10-01T00:00:00.000Z",
      });

      render(<TravelPage />);

      await waitFor(() => {
        expect(screen.getByText("Arjun Nair")).toBeInTheDocument();
        expect(screen.getByText("Advance → manager review")).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Advance → manager review"));

      await waitFor(() => {
        expect(advanceSpy).toHaveBeenCalledWith("tr-1", "manager-review");
      });
    });

    it("HrOpsPage renders overview stats from API", async () => {
      vi.spyOn(hrOpsApi, "getOverview").mockResolvedValueOnce({
        timeline: [
          {
            id: "tl-1",
            title: "Annual Strategy Session",
            employeeId: "emp-1",
            employeeName: "Leadership",
            kind: "project",
            date: "2026-10-01",
          },
        ],
        assets: { total: 42, byStatus: { available: 20, assigned: 22 } },
        visitors: { today: 5, total: 150 },
        expenses: { total: 12, byStatus: { approved: 8, pending: 4 } },
        travel: { total: 6, pending: 2 },
        onboarding: { active: 3 },
        offboarding: { active: 2 },
        exits: { inProgress: 1 },
      });

      render(<HrOpsPage />);

      await waitFor(() => {
        expect(screen.getByText("Annual Strategy Session")).toBeInTheDocument();
        expect(screen.getByText("42")).toBeInTheDocument();
      });
    });
  });
});

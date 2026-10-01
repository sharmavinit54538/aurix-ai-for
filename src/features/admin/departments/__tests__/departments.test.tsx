import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DepartmentStatsCards } from "../components/DepartmentStatsCards";
import { DepartmentsDirectoryTab } from "../components/DepartmentsDirectoryTab";
import { mapBackendToFrontend } from "../departmentsThunk";
import type { Department, DepartmentFilters } from "../types";
import { DEFAULT_FILTERS } from "../constants";

const createMockDepartment = (overrides: Partial<Department> = {}): Department => ({
  id: "dept-1",
  name: "Engineering",
  description: "Core engineering team",
  department_code: "ENG-01",
  cost_center: "CC-101",
  departmentHeadId: "mgr-1",
  departmentHeadName: "Alice Smith",
  reportingManagerId: null,
  reportingManagerName: "None",
  office: "New York",
  budget: 500000,
  employeeCapacity: 50,
  currentEmployeeCount: 10,
  extensionNumber: "101",
  status: "active",
  themeColor: "#3b82f6",
  iconName: "Code2",
  parentId: null,
  parentName: "None",
  createdDate: "2025-01-01",
  employeeIds: ["emp-1", "emp-2"],
  openPositions: 2,
  performanceScore: 88,
  attendanceScore: 95,
  hiringStatus: "open",
  recentActivity: [],
  documents: [],
  ...overrides,
});

describe("Departments Feature Tests", () => {
  describe("(a) DepartmentStatsCards", () => {
    it("shows the right numbers for 3 departments (not 0)", () => {
      const mockDepts: Department[] = [
        createMockDepartment({
          id: "dept-1",
          name: "Engineering",
          status: "active",
          currentEmployeeCount: 10,
          openPositions: 2,
          departmentHeadId: "mgr-1",
          departmentHeadName: "Alice",
        }),
        createMockDepartment({
          id: "dept-2",
          name: "Product",
          status: "active",
          currentEmployeeCount: 15,
          openPositions: 0,
          departmentHeadId: "mgr-2",
          departmentHeadName: "Bob",
        }),
        createMockDepartment({
          id: "dept-3",
          name: "Design",
          status: "inactive",
          currentEmployeeCount: 5,
          openPositions: 1,
          departmentHeadId: "mgr-1",
          departmentHeadName: "Alice",
        }),
      ];

      render(<DepartmentStatsCards departments={mockDepts} />);

      // Total Departments: 3
      expect(screen.getByText("Total Departments")).toBeInTheDocument();
      expect(screen.getByText("2 active")).toBeInTheDocument();

      // Active Departments: 2
      expect(screen.getByText("Active Departments")).toBeInTheDocument();
      expect(screen.getByText("1 inactive")).toBeInTheDocument();

      // "2" appears for Active Departments (2) and Total Managers (2)
      const twos = screen.getAllByText("2");
      expect(twos.length).toBe(2);

      // "3" appears for Total Departments (3) and Open Positions (3)
      const threes = screen.getAllByText("3");
      expect(threes.length).toBe(2);

      // Total Employees: 30
      expect(screen.getByText("Total Employees")).toBeInTheDocument();
      expect(screen.getByText("30")).toBeInTheDocument();

      // Average Team Size: 30 / 3 = 10
      expect(screen.getByText("Average Team Size")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();

      // Open Positions: 2 + 0 + 1 = 3
      expect(screen.getByText("Open Positions")).toBeInTheDocument();
      expect(screen.getByText("Across 2 departments")).toBeInTheDocument();
    });

    it("renders loading skeleton while loading instead of 0", () => {
      render(<DepartmentStatsCards departments={[]} loading={true} />);

      expect(screen.getByTestId("department-stats-skeleton")).toBeInTheDocument();
      // Ensure "0" is not rendered as a stat value during loading
      expect(screen.queryByText("Total Departments")).not.toBeInTheDocument();
    });

    it("uses summary totals when provided", () => {
      const summary = {
        totalDepartments: 50,
        activeDepartments: 45,
        inactiveDepartments: 5,
        totalEmployees: 1200,
        totalManagers: 25,
        avgTeamSize: 24,
        openPositions: 30,
        hiringDepartments: 12,
      };

      render(<DepartmentStatsCards departments={[]} summary={summary} />);

      expect(screen.getByText("50")).toBeInTheDocument();
      expect(screen.getByText("45 active")).toBeInTheDocument();
      expect(screen.getByText("1200")).toBeInTheDocument();
      expect(screen.getByText("25")).toBeInTheDocument();
      expect(screen.getByText("24")).toBeInTheDocument();
      expect(screen.getByText("30")).toBeInTheDocument();
      expect(screen.getByText("Across 12 departments")).toBeInTheDocument();
    });
  });

  describe("(b) mapBackendToFrontend removes fake defaults", () => {
    it("returns null for performanceScore, attendanceScore, and employeeCapacity when missing", () => {
      const backendPayload = {
        id: "dept-test-1",
        department_name: "Platform Infra",
        department_code: "INFRA",
        status: "ACTIVE",
      };

      const result = mapBackendToFrontend(backendPayload);

      expect(result.performanceScore).toBeNull();
      expect(result.attendanceScore).toBeNull();
      expect(result.employeeCapacity).toBeNull();
      expect(result.openPositions).toBe(0);
      expect(result.hiringStatus).toBe("closed");
      expect(result.status).toBe("active");
    });

    it("maps existing performanceScore, attendanceScore, and employeeCapacity correctly when provided", () => {
      const backendPayload = {
        id: "dept-test-2",
        department_name: "QA Engineering",
        performance_score: 91,
        attendance_score: 84,
        employee_capacity: 40,
        open_positions: 3,
        hiring_status: "open",
        status: "INACTIVE",
      };

      const result = mapBackendToFrontend(backendPayload);

      expect(result.performanceScore).toBe(91);
      expect(result.attendanceScore).toBe(84);
      expect(result.employeeCapacity).toBe(40);
      expect(result.openPositions).toBe(3);
      expect(result.hiringStatus).toBe("open");
      expect(result.status).toBe("inactive");
    });
  });

  describe("(c) employee count is taken from the backend value", () => {
    it("uses backend employee_count as the single source of truth", () => {
      const backendPayload = {
        id: "dept-test-3",
        department_name: "Customer Support",
        employee_count: 42,
        employee_ids: ["emp-1", "emp-2"],
      };

      const result = mapBackendToFrontend(backendPayload);

      expect(result.currentEmployeeCount).toBe(42);
      expect(result.employeeIds).toEqual(["emp-1", "emp-2"]);
    });

    it("defaults to 0 when employee_count is null or missing", () => {
      const backendPayload = {
        id: "dept-test-4",
        department_name: "Research",
      };

      const result = mapBackendToFrontend(backendPayload);

      expect(result.currentEmployeeCount).toBe(0);
      expect(result.employeeIds).toEqual([]);
    });
  });

  describe("(d) error state renders with a Retry button when fetch fails", () => {
    it("renders the error message and calls onRetry when Retry button is clicked", () => {
      const onRetryMock = vi.fn();
      const mockFilters: DepartmentFilters = { ...DEFAULT_FILTERS };

      render(
        <DepartmentsDirectoryTab
          loading={false}
          error="Network error: Failed to connect to server"
          onRetry={onRetryMock}
          departments={[]}
          processedDepartments={[]}
          paginatedDepartments={[]}
          searchQuery=""
          filters={mockFilters}
          showAdvancedFilters={false}
          sortField="name"
          sortDir="asc"
          currentPage={1}
          perPage={10}
          totalPages={1}
          managers={[]}
          onSearchChange={vi.fn()}
          onToggleAdvancedFilters={vi.fn()}
          onClearFilters={vi.fn()}
          onFiltersChange={vi.fn()}
          onExportCSV={vi.fn()}
          onExportExcel={vi.fn()}
          onExportPDF={vi.fn()}
          onView={vi.fn()}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          onSort={vi.fn()}
          onPerPageChange={vi.fn()}
          onPageChange={vi.fn()}
          onAddClick={vi.fn()}
        />
      );

      expect(screen.getByText("Failed to Load Departments")).toBeInTheDocument();
      expect(screen.getByText("Network error: Failed to connect to server")).toBeInTheDocument();

      const retryBtn = screen.getByRole("button", { name: /retry/i });
      expect(retryBtn).toBeInTheDocument();

      fireEvent.click(retryBtn);
      expect(onRetryMock).toHaveBeenCalledTimes(1);

      // Empty state "Create Department" should NOT be shown
      expect(screen.queryByText("Create Department")).not.toBeInTheDocument();
    });

    it("renders Create Department only when loading=false, error=null, and departments.length=0", () => {
      const mockFilters: DepartmentFilters = { ...DEFAULT_FILTERS };
      const onAddClickMock = vi.fn();

      render(
        <DepartmentsDirectoryTab
          loading={false}
          error={null}
          departments={[]}
          processedDepartments={[]}
          paginatedDepartments={[]}
          searchQuery=""
          filters={mockFilters}
          showAdvancedFilters={false}
          sortField="name"
          sortDir="asc"
          currentPage={1}
          perPage={10}
          totalPages={1}
          managers={[]}
          onSearchChange={vi.fn()}
          onToggleAdvancedFilters={vi.fn()}
          onClearFilters={vi.fn()}
          onFiltersChange={vi.fn()}
          onExportCSV={vi.fn()}
          onExportExcel={vi.fn()}
          onExportPDF={vi.fn()}
          onView={vi.fn()}
          onEdit={vi.fn()}
          onDelete={vi.fn()}
          onSort={vi.fn()}
          onPerPageChange={vi.fn()}
          onPageChange={vi.fn()}
          onAddClick={onAddClickMock}
        />
      );

      expect(screen.getByText("No Departments Yet")).toBeInTheDocument();
      const createBtn = screen.getByRole("button", { name: /create department/i });
      expect(createBtn).toBeInTheDocument();
      fireEvent.click(createBtn);
      expect(onAddClickMock).toHaveBeenCalledTimes(1);
    });
  });
});

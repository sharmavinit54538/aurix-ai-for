import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { HrLettersSection } from "../components/sections/HrLettersSection";
import { documentsApi } from "../api/documentsApi";
import { apiInstance } from "@/api";
import * as rolesModule from "@/lib/roles";
import * as currentRoleModule from "@/lib/use-current-role";

vi.mock("@/api", () => {
  const getMock = vi.fn();
  const postMock = vi.fn();
  return {
    apiInstance: {
      get: getMock,
      post: postMock,
      put: vi.fn(),
      delete: vi.fn(),
    },
    api: {
      get: getMock,
      post: postMock,
    },
  };
});

describe("HrLettersSection - Select Recipient Employee Workflow", () => {
  const priyankaBackendEmp = {
    id: "usr-uuid-336424",
    employee_id: "EMP-336424",
    first_name: "B K",
    last_name: "Priyanka",
    company_email: "priyanka.bk@ofc360.com",
    personal_email: "priyanka@gmail.com",
    phone: "+91 9876543210",
    designation: "Junior QA Tester",
    department: "Quality Assurance",
    joining_date: "2024-03-15",
    reporting_manager_name: "Vikram Sharma",
    branch: "Bengaluru HQ",
    ctc: "450000",
  };

  const rahulBackendEmp = {
    id: "usr-uuid-101010",
    employee_id: "EMP-101010",
    first_name: "Rahul",
    last_name: "Verma",
    company_email: "rahul.verma@ofc360.com",
    phone: "+91 9123456789",
    designation: "Senior Frontend Lead",
    department: "Engineering",
    joining_date: "2022-01-10",
    reporting_manager_name: "Anita Roy",
    branch: "Mumbai Office",
    ctc: "1800000",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(currentRoleModule, "useCurrentRole").mockReturnValue("hr_admin");
  });

  describe("API Client: documentsApi.getEmployees and getEmployeeDetails", () => {
    it("fetches and maps employees from real backend response envelope", async () => {
      vi.mocked(apiInstance.get).mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            items: [priyankaBackendEmp, rahulBackendEmp],
            total: 2,
            page: 1,
            limit: 100,
          },
        },
      } as unknown as import("axios").AxiosResponse);

      const employees = await documentsApi.getEmployees();

      expect(employees).toHaveLength(2);
      expect(employees[0]).toEqual({
        id: "usr-uuid-336424",
        employeeId: "EMP-336424",
        fullName: "B K Priyanka",
        email: "priyanka.bk@ofc360.com",
        phone: "+91 9876543210",
        designation: "Junior QA Tester",
        department: "Quality Assurance",
        joiningDate: "2024-03-15",
        managerName: "Vikram Sharma",
        location: "Bengaluru HQ",
        salary: undefined,
        ctc: "450000",
        bloodGroup: undefined,
        avatarUrl: undefined,
      });

      expect(employees[1].fullName).toBe("Rahul Verma");
      expect(employees[1].employeeId).toBe("EMP-101010");
    });

    it("fetches rich employee details including hierarchy and payroll compensation when not in base record", async () => {
      const priyankaWithoutCompensation = {
        ...priyankaBackendEmp,
        ctc: undefined,
      };

      vi.mocked(apiInstance.get).mockImplementation(((url: string) => {
        if (url === "/employees/usr-uuid-336424") {
          return Promise.resolve({
            data: {
              data: {
                ...priyankaWithoutCompensation,
                branch: "Bengaluru Tech Park",
              },
            },
          });
        }
        if (url === "/hierarchy/usr-uuid-336424") {
          return Promise.resolve({
            data: {
              success: true,
              data: {
                manager: {
                  first_name: "Vikram",
                  last_name: "Sharma",
                  designation: "QA Director",
                },
              },
            },
          });
        }
        if (url === "/api/v2/payroll/employees/usr-uuid-336424/compensation") {
          return Promise.resolve({
            data: {
              success: true,
              data: {
                ctcAnnualFormatted: "4,50,000",
                ctcMonthlyFormatted: "37,500",
              },
            },
          });
        }
        return Promise.reject(new Error("Not found"));
      }) as unknown as typeof apiInstance.get);

      const details = await documentsApi.getEmployeeDetails("usr-uuid-336424");

      expect(details.fullName).toBe("B K Priyanka");
      expect(details.employeeId).toBe("EMP-336424");
      expect(details.managerName).toBe("Vikram Sharma");
      expect(details.reportingStructure).toBe("Vikram Sharma (QA Director)");
      expect(details.ctc).toBe("4,50,000");
    });
  });

  describe("UI Component: HrLettersSection", () => {
    it("renders employee dropdown with real employee options and populates card details", async () => {
      vi.spyOn(documentsApi, "getEmployees").mockResolvedValueOnce([
        {
          id: "usr-uuid-336424",
          employeeId: "EMP-336424",
          fullName: "B K Priyanka",
          email: "priyanka.bk@ofc360.com",
          phone: "+91 9876543210",
          designation: "Junior QA Tester",
          department: "Quality Assurance",
          joiningDate: "2024-03-15",
          managerName: "Vikram Sharma",
          location: "Bengaluru HQ",
          ctc: "450000",
        },
      ]);

      vi.spyOn(documentsApi, "getEmployeeDetails").mockResolvedValueOnce({
        id: "usr-uuid-336424",
        employeeId: "EMP-336424",
        fullName: "B K Priyanka",
        email: "priyanka.bk@ofc360.com",
        phone: "+91 9876543210",
        designation: "Junior QA Tester",
        department: "Quality Assurance",
        joiningDate: "2024-03-15",
        managerName: "Vikram Sharma",
        location: "Bengaluru HQ",
        ctc: "450000",
        reportingStructure: "Vikram Sharma (QA Director)",
      });

      render(<HrLettersSection />);

      // Wait for employee details card to populate
      await waitFor(() => {
        expect(screen.getByText("1. Select Recipient Employee")).toBeInTheDocument();
        expect(screen.getByText("EMP-336424")).toBeInTheDocument();
        expect(screen.getByText("Quality Assurance")).toBeInTheDocument();
        expect(screen.getByText("Junior QA Tester")).toBeInTheDocument();
        expect(screen.getByText("priyanka.bk@ofc360.com")).toBeInTheDocument();
        expect(screen.getByText("Vikram Sharma")).toBeInTheDocument();
      });

      // Annual CTC should be shown for HR Admin in Card 1
      expect(screen.getByText("Annual CTC:")).toBeInTheDocument();
      expect(screen.getAllByText(/4,50,000/).length).toBeGreaterThanOrEqual(1);
    });

    it("displays recoverable error state with Retry button on API failure", async () => {
      vi.spyOn(documentsApi, "getEmployees").mockRejectedValueOnce(
        new Error("Network connection error (500 Internal Server Error)")
      );

      render(<HrLettersSection />);

      await waitFor(() => {
        expect(
          screen.getByText("Failed to load employees from directory")
        ).toBeInTheDocument();
        expect(
          screen.getByText(/Network connection error/i)
        ).toBeInTheDocument();
        expect(screen.getByText("Retry")).toBeInTheDocument();
      });

      // Now mock successful retry
      vi.spyOn(documentsApi, "getEmployees").mockResolvedValueOnce([
        {
          id: "usr-uuid-336424",
          employeeId: "EMP-336424",
          fullName: "B K Priyanka",
          email: "priyanka.bk@ofc360.com",
          phone: "+91 9876543210",
          designation: "Junior QA Tester",
          department: "Quality Assurance",
          joiningDate: "2024-03-15",
          managerName: "Vikram Sharma",
          ctc: "450000",
        },
      ]);

      fireEvent.click(screen.getByText("Retry"));

      await waitFor(() => {
        expect(screen.getByText("EMP-336424")).toBeInTheDocument();
        expect(
          screen.queryByText("Failed to load employees from directory")
        ).not.toBeInTheDocument();
      });
    });

    it("hides confidential salary from regular employee role", async () => {
      vi.spyOn(currentRoleModule, "useCurrentRole").mockReturnValue("employee");

      vi.spyOn(documentsApi, "getEmployees").mockResolvedValueOnce([
        {
          id: "usr-uuid-336424",
          employeeId: "EMP-336424",
          fullName: "B K Priyanka",
          email: "priyanka.bk@ofc360.com",
          phone: "+91 9876543210",
          designation: "Junior QA Tester",
          department: "Quality Assurance",
          joiningDate: "2024-03-15",
          managerName: "Vikram Sharma",
          ctc: "450000",
        },
      ]);

      render(<HrLettersSection />);

      await waitFor(() => {
        expect(screen.getByText("EMP-336424")).toBeInTheDocument();
      });

      // Annual CTC line should NOT be visible to regular employee
      expect(screen.queryByText("Annual CTC:")).not.toBeInTheDocument();
    });

    it("renders empty state message when directory has no active employees", async () => {
      vi.spyOn(documentsApi, "getEmployees").mockResolvedValueOnce([]);

      render(<HrLettersSection />);

      await waitFor(() => {
        expect(screen.getByText("1. Select Recipient Employee")).toBeInTheDocument();
      });

      // Employee details card should not be displayed when empty
      expect(screen.queryByText("Official Email:")).not.toBeInTheDocument();
    });
  });
});

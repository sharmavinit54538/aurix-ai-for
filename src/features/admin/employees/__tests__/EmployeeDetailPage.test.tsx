import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { EmployeeDetailPage } from "../components/EmployeeDetailPage";
import type { Employee } from "../employeesTypes";
import {
  filterExpensesByEmployeeId,
  mapExpenseFromBackend,
} from "@/lib/hrms/expense-helpers";

const EMP_ONE: Employee = {
  id: "11111111-1111-4111-8111-111111111111",
  employeeId: "EMP-101",
  fullName: "Vinit Sharma",
  email: "vinit.one@example.com",
  phone: "9000000001",
  department: "Engineering",
  designation: "Architect",
  joiningDate: "2024-01-15",
  status: "ACTIVE",
};

const EMP_TWO_SAME_NAME: Employee = {
  id: "22222222-2222-4222-8222-222222222222",
  employeeId: "EMP-202",
  fullName: "Vinit Sharma",
  email: "vinit.two@example.com",
  phone: "9000000002",
  department: "Sales",
  designation: "Manager",
  joiningDate: "2024-05-10",
  status: "ACTIVE",
};

describe("EmployeeDetailPage fixes (Expenses v1, Compensation, Documents, Errors)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mapExpenseFromBackend and filterExpensesByEmployeeId handle nested employee objects and isolate same-name records", () => {
    const first = mapExpenseFromBackend({
      id: "exp-1",
      employee_id: EMP_ONE.id,
      expense_date: "2026-11-10",
      category: "TRAVEL",
      amount: 1850,
      currency: "INR",
      description: "Airport shuttle",
      status: "SUBMITTED",
      employee: {
        id: EMP_ONE.id,
        employee_code: EMP_ONE.employeeId,
        name: "Vinit Sharma",
      },
    });
    const second = mapExpenseFromBackend({
      id: "exp-2",
      employee_id: EMP_TWO_SAME_NAME.id,
      expense_date: "2026-11-11",
      category: "MEALS",
      amount: 920,
      currency: "INR",
      description: "Client dinner",
      status: "APPROVED",
      employee: {
        id: EMP_TWO_SAME_NAME.id,
        employee_code: EMP_TWO_SAME_NAME.employeeId,
        name: "Vinit Sharma",
      },
    });

    expect(first.employee).toBe("Vinit Sharma");
    expect(first.employeeId).toBe(EMP_ONE.id);
    expect(first.date).toBe("2026-11-10");
    expect(filterExpensesByEmployeeId([first, second], EMP_ONE.id).map((e) => e.id)).toEqual(["exp-1"]);
  });

  it("calls /api/v1/expenses with stable employee_id, maps compensation/documents, and isolates same-name employees", async () => {
    const requestedUrls: string[] = [];
    let v2ExpensesCalled = false;

    server.use(
      http.get("*/api/v2/expenses*", () => {
        v2ExpensesCalled = true;
        return HttpResponse.json({ detail: "Not Found" }, { status: 404 });
      }),
      http.get("*/api/v1/employees/:id", () =>
        HttpResponse.json({ success: true, data: { id: EMP_ONE.id, first_name: "Vinit", last_name: "Sharma" } }),
      ),
      http.get("*/api/v1/admin/employee-onboarding/:id", () =>
        HttpResponse.json({ success: true, data: {} }),
      ),
      http.get("*/api/v1/documents/employees", () =>
        HttpResponse.json({
          success: true,
          data: [
            {
              id: "doc-1",
              title: "Offer Letter",
              file_name: "offer.pdf",
              file_size: 20480,
              category_name: "Employment",
              status: "VERIFIED",
              file_url: "/documents/employees/doc-1/download",
            },
          ],
        }),
      ),
      http.get("*/api/v1/hierarchy/:id", () =>
        HttpResponse.json({ success: true, data: { reporting_chain: [], direct_reports: [] } }),
      ),
      http.get("*/api/v2/payroll/employees/:id/compensation", () =>
        HttpResponse.json({
          success: true,
          data: {
            ctc_annual_paise: 120000000,
            basic_monthly_paise: 5000000,
            hra_monthly_paise: 2000000,
            special_allowance_monthly_paise: 3000000,
          },
        }),
      ),
      http.get("*/api/v1/leaves/balances/:id", () =>
        HttpResponse.json({ success: true, data: [] }),
      ),
      http.get("*/api/v1/assets", () =>
        HttpResponse.json({ success: true, data: { items: [] } }),
      ),
      http.get("*/api/v1/expenses", ({ request }) => {
        requestedUrls.push(request.url);
        const url = new URL(request.url);
        const empParam = url.searchParams.get("employee_id");
        if (empParam === EMP_ONE.id) {
          return HttpResponse.json({
            success: true,
            data: {
              items: [
                {
                  id: "claim-1",
                  employee_id: EMP_ONE.id,
                  category: "travel",
                  amount: 3200,
                  currency: "INR",
                  expense_date: "2026-11-08",
                  description: "Employee One Flight",
                  status: "submitted",
                  employee: { id: EMP_ONE.id, employee_code: "EMP-101", name: "Vinit Sharma" },
                },
                // Even if another same-named employee's claim slipped in, client ID guard must exclude it
                {
                  id: "claim-2-leak",
                  employee_id: EMP_TWO_SAME_NAME.id,
                  category: "meals",
                  amount: 999,
                  currency: "INR",
                  expense_date: "2026-11-09",
                  description: "Employee Two Secret Lunch",
                  status: "approved",
                  employee: { id: EMP_TWO_SAME_NAME.id, employee_code: "EMP-202", name: "Vinit Sharma" },
                },
              ],
              total: 1,
              page: 1,
              limit: 30,
              has_next: false,
            },
          });
        }
        return HttpResponse.json({ success: true, data: { items: [], total: 0, page: 1, limit: 30, has_next: false } });
      }),
      http.get("*/api/v1/attendance/records", () =>
        HttpResponse.json({ success: true, data: { items: [] } }),
      ),
    );

    render(<EmployeeDetailPage employee={EMP_ONE} onEdit={vi.fn()} />);

    await waitFor(() => {
      expect(requestedUrls.some((u) => u.includes(`employee_id=${EMP_ONE.id}`))).toBe(true);
    });
    expect(v2ExpensesCalled).toBe(false);

    // Check Expenses tab shows only EMP_ONE's expense
    fireEvent.click(screen.getAllByRole("button", { name: /Expenses/i })[0]);
    expect(await screen.findByText(/Employee One Flight/i)).toBeInTheDocument();
    expect(screen.queryByText(/Employee Two Secret Lunch/i)).not.toBeInTheDocument();

    // Check Payroll tab renders snake_case CTC (12,00,000) and monthly gross (1,00,000)
    fireEvent.click(screen.getAllByRole("button", { name: /Payroll/i })[0]);
    expect(await screen.findByText(/12,00,000/)).toBeInTheDocument();
    expect(screen.getByText(/1,00,000/)).toBeInTheDocument();

    // Check Documents tab renders documents from APIResponse list
    fireEvent.click(screen.getAllByRole("button", { name: /Documents/i })[0]);
    expect(await screen.findByText("Offer Letter")).toBeInTheDocument();
    expect(screen.getByText(/20\.0 KB/)).toBeInTheDocument();
  });

  it("keeps genuine API failures visible in Overview and affected tabs", async () => {
    server.use(
      http.get("*/api/v1/employees/:id", () =>
        HttpResponse.json(
          { success: false, message: "Encrypted data cannot be accessed because the required encryption key is unavailable." },
          { status: 503 },
        ),
      ),
      http.get("*/api/v1/admin/employee-onboarding/:id", () =>
        HttpResponse.json({ success: false, message: "Encryption key missing" }, { status: 503 }),
      ),
      http.get("*/api/v1/documents/employees", () =>
        HttpResponse.json({ detail: "column employee_documents.ocr_status does not exist" }, { status: 500 }),
      ),
      http.get("*/api/v1/hierarchy/:id", () =>
        HttpResponse.json({ success: true, data: { reporting_chain: [], direct_reports: [] } }),
      ),
      http.get("*/api/v2/payroll/employees/:id/compensation", () =>
        HttpResponse.json({ success: false, message: "Compensation unavailable" }, { status: 503 }),
      ),
      http.get("*/api/v1/leaves/balances/:id", () =>
        HttpResponse.json({ success: true, data: [] }),
      ),
      http.get("*/api/v1/assets", () =>
        HttpResponse.json({ success: true, data: { items: [] } }),
      ),
      http.get("*/api/v1/expenses", () =>
        HttpResponse.json({ detail: "Expenses backend error" }, { status: 500 }),
      ),
      http.get("*/api/v1/attendance/records", () =>
        HttpResponse.json({ success: true, data: { items: [] } }),
      ),
    );

    render(<EmployeeDetailPage employee={EMP_ONE} onEdit={vi.fn()} />);

    expect(await screen.findByText(/Some employee details could not be loaded/i)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /Expenses/i })[0]);
    expect(await screen.findByText(/Unable to Load Expenses/i)).toBeInTheDocument();
    expect(screen.queryByText("No Expense Claims")).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /Documents/i })[0]);
    expect(await screen.findByText(/Unable to Load Documents/i)).toBeInTheDocument();
    expect(screen.queryByText("No Documents Uploaded")).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /Payroll/i })[0]);
    expect(await screen.findByText(/Unable to Load Payroll Compensation/i)).toBeInTheDocument();
  });
});

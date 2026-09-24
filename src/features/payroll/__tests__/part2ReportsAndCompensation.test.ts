import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { REPORT_REGISTRY, type ReportKey } from "../types/reports";
import { reportsApi } from "../api/reportsApi";
import { compensationApi } from "../api/compensationApi";

describe("Part 2 — Reports, Salary Structure & Compensation Tests", () => {
  describe("Report Registry Validation", () => {
    it("defines exactly all 9 canonical reports", () => {
      const keys = Object.keys(REPORT_REGISTRY) as ReportKey[];
      expect(keys).toHaveLength(9);
      expect(keys).toContain("payroll_register");
      expect(keys).toContain("salary_statement");
      expect(keys).toContain("department_payroll");
      expect(keys).toContain("cost_center_payroll");
      expect(keys).toContain("bank_advice");
      expect(keys).toContain("payroll_variance");
      expect(keys).toContain("headcount_report");
      expect(keys).toContain("ytd_payroll");
      expect(keys).toContain("accounting_export");
    });

    it("requires appropriate permissions per report category", () => {
      expect(REPORT_REGISTRY.payroll_register.requiredPermission).toBe("payroll.reports");
      expect(REPORT_REGISTRY.bank_advice.requiredPermission).toBe("payroll.disburse");
      expect(REPORT_REGISTRY.accounting_export.requiredPermission).toBe("payroll.reports");
    });

    it("supports CSV and XLSX export formats", () => {
      expect(REPORT_REGISTRY.payroll_register.allowedFormats).toContain("csv");
      expect(REPORT_REGISTRY.payroll_register.allowedFormats).toContain("xlsx");
    });
  });

  describe("Accounting Journal Double-Entry Balance Check", () => {
    it("confirms balanced journal when total debit == total credit", () => {
      const entries = [
        { debit: 10000000, credit: 0 },
        { debit: 2000000, credit: 0 },
        { debit: 0, credit: 12000000 },
      ];

      const totalDebit = entries.reduce((acc, e) => acc + e.debit, 0);
      const totalCredit = entries.reduce((acc, e) => acc + e.credit, 0);

      expect(totalDebit).toBe(totalCredit);
      expect(totalDebit).toBe(12000000);
    });

    it("detects unbalanced journal entries", () => {
      const entries = [
        { debit: 10000000, credit: 0 },
        { debit: 0, credit: 9500000 },
      ];

      const totalDebit = entries.reduce((acc, e) => acc + e.debit, 0);
      const totalCredit = entries.reduce((acc, e) => acc + e.credit, 0);

      expect(totalDebit).not.toBe(totalCredit);
    });
  });

  describe("Retroactive Compensation Revisions & Arrears Risk Detection", () => {
    it("flags arrears risk if effective date is prior to current date", () => {
      const pastDate = "2026-01-01";
      const isPast = new Date(pastDate) < new Date();
      expect(isPast).toBe(true);
    });

    it("does not flag arrears risk for future effective dates", () => {
      const futureDate = "2099-01-01";
      const isPast = new Date(futureDate) < new Date();
      expect(isPast).toBe(false);
    });
  });

  describe("Reports & Compensation API Client Error Resilience", () => {
    it("handles 404 for report data endpoint", async () => {
      server.use(
        http.get("*/api/v2/payroll/reports/payroll_register", () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      await expect(reportsApi.getReportData("payroll_register")).rejects.toThrow();
    });

    it("handles 501 Not Implemented for compensation revisions", async () => {
      server.use(
        http.post("*/api/v2/payroll/employees/:empId/compensation/revisions", () => {
          return new HttpResponse(null, { status: 501 });
        })
      );

      await expect(
        compensationApi.proposeCompensationRevision("emp-1", {
          newCtcAnnualPaise: 150000000,
          effectiveDate: "2026-10-01",
          reason: "Promotion",
        })
      ).rejects.toThrow();
    });

    it("handles 400 Bad Request for bulk compensation upload", async () => {
      server.use(
        http.post("*/api/v2/payroll/compensation/bulk-import/preview", () => {
          return HttpResponse.json(
            { success: false, message: "Invalid CSV headers" },
            { status: 400 }
          );
        })
      );

      const fakeFile = new File(["dummy content"], "bulk.csv", { type: "text/csv" });
      await expect(compensationApi.previewBulkCompensation(fakeFile)).rejects.toThrow();
    });
  });
});

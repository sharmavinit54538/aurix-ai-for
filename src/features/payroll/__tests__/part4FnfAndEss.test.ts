import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { fnfApi } from "../api/fnfApi";
import { essApi } from "../api/essApi";
import type { FnfRecord, FnfStatus } from "../types/fnf";

describe("Part 4 — Full & Final Settlement (F&F) & Employee Self-Service (ESS) Tests", () => {
  describe("Full & Final Settlement (F&F) API & Workflow", () => {
    const mockFnfRecord: FnfRecord = {
      id: "fnf-001",
      employeeId: "emp-exit-101",
      employeeName: "Aditi Rao",
      employeeCode: "AUR-101",
      department: "Engineering",
      designation: "Staff Systems Engineer",
      joiningDate: "2023-01-15",
      exitDetails: {
        exitType: "resignation",
        noticePeriodDaysRequired: 60,
        noticePeriodDaysServed: 60,
        shortfallDays: 0,
        resignationDate: "2026-08-01",
        lastWorkingDate: "2026-09-30",
        reason: "Pursuing higher studies abroad",
      },
      earnings: {
        unpaidSalaryDays: 30,
        unpaidSalaryPaise: 15000000,
        leaveEncashmentDays: 14,
        leaveEncashmentPaise: 7000000,
        gratuityPaise: 35000000,
        statutoryBonusPaise: 5000000,
        reimbursementsPaise: 0,
        otherEarningsPaise: 0,
        totalEarningsPaise: 62000000,
        totalEarningsFormatted: "₹6,20,000.00",
      },
      deductions: {
        noticeShortfallRecoveryPaise: 0,
        loanAdvanceRecoveryPaise: 0,
        assetDamageRecoveryPaise: 0,
        pfDeductionPaise: 180000,
        ptDeductionPaise: 20000,
        tdsDeductionPaise: 4500000,
        otherDeductionsPaise: 0,
        totalDeductionsPaise: 4700000,
        totalDeductionsFormatted: "₹47,000.00",
      },
      netSettlementPaise: 57300000,
      netSettlementFormatted: "₹5,73,000.00",
      status: "pending_approval",
      maker: {
        id: "hr-admin-01",
        name: "Rohan Varma",
      },
      checker: null,
      createdAt: "2026-09-15T10:00:00Z",
    };

    it("fetches list of F&F records with pagination and status", async () => {
      server.use(
        http.get("*/api/v2/payroll/full-and-final", () => {
          return HttpResponse.json({
            success: true,
            data: {
              items: [mockFnfRecord],
              total: 1,
              page: 1,
              limit: 20,
            },
          });
        })
      );

      const res = await fnfApi.getFnfRecords();
      expect(res.items).toHaveLength(1);
      expect(res.items[0].id).toBe("fnf-001");
      expect(res.items[0].netSettlementPaise).toBe(57300000);
      expect(res.items[0].status).toBe("pending_approval");
    });

    it("initiates F&F exit request with maker-checker tracking", async () => {
      server.use(
        http.post("*/api/v2/payroll/full-and-final", async ({ request }) => {
          const body = (await request.json()) as any;
          return HttpResponse.json({
            success: true,
            data: {
              ...mockFnfRecord,
              employeeId: body.employeeId,
              status: "draft",
            },
          });
        })
      );

      const created = await fnfApi.initiateFnf({
        employeeId: "emp-exit-101",
        exitDetails: {
          resignationDate: "2026-08-01",
          lastWorkingDate: "2026-09-30",
          exitType: "resignation",
          reason: "Career transition",
          noticePeriodDaysRequired: 60,
          noticePeriodDaysServed: 60,
          shortfallDays: 0,
        },
      });

      expect(created.employeeId).toBe("emp-exit-101");
      expect(created.status).toBe("draft");
    });

    it("approves F&F settlement record", async () => {
      server.use(
        http.post("*/api/v2/payroll/full-and-final/:id/approve", () => {
          return HttpResponse.json({
            success: true,
            data: {
              ...mockFnfRecord,
              status: "approved" as FnfStatus,
              checker: {
                id: "finance-head-01",
                name: "Priya Sharma",
              },
              approvalRemarks: "All assets cleared and approved",
            },
          });
        })
      );

      const approved = await fnfApi.approveFnf("fnf-001", "All assets cleared and approved");
      expect(approved.status).toBe("approved");
      expect(approved.checker?.name).toBe("Priya Sharma");
    });

    it("finalizes approved F&F settlement and prevents duplicate finalization", async () => {
      let finalizeCalls = 0;
      server.use(
        http.post("*/api/v2/payroll/full-and-final/:id/finalize", () => {
          finalizeCalls++;
          if (finalizeCalls > 1) {
            return HttpResponse.json(
              { success: false, message: "Settlement already finalized and locked." },
              { status: 409 }
            );
          }
          return HttpResponse.json({
            success: true,
            data: {
              ...mockFnfRecord,
              status: "finalized" as FnfStatus,
            },
          });
        })
      );

      const finalized = await fnfApi.finalizeFnf("fnf-001");
      expect(finalized.status).toBe("finalized");

      // Attempting to finalize again should reject with 409
      await expect(fnfApi.finalizeFnf("fnf-001")).rejects.toThrow();
    });

    it("downloads backend-generated F&F settlement statement blob", async () => {
      server.use(
        http.get("*/api/v2/payroll/full-and-final/:id/statement/download", () => {
          return new HttpResponse(new Blob(["PDF_BINARY_STREAM"], { type: "application/pdf" }), {
            headers: { "Content-Type": "application/pdf" },
          });
        })
      );

      const blob = await fnfApi.downloadFnfStatement("fnf-001");
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe("application/pdf");
    });
  });

  describe("Employee Self-Service (ESS) Personal Payroll & Isolation", () => {
    const mockEssData = {
      employeeId: "emp-current-me",
      employeeCode: "AUR-882",
      employeeName: "Vikram Sethi",
      department: "Product Engineering",
      designation: "Senior Frontend Engineer",
      latestPayslip: {
        runId: "run-aug-2026",
        periodName: "August 2026",
        payDate: "2026-08-31",
        grossFormatted: "₹1,85,000.00",
        deductionsFormatted: "₹28,500.00",
        netPayFormatted: "₹1,56,500.00",
        netPayPaise: 15650000,
        status: "FINALIZED",
      },
      ytdSummary: {
        financialYear: "2026-2027",
        totalGrossPaise: 92500000,
        totalDeductionsPaise: 14250000,
        totalNetPaise: 78250000,
        totalPfPaise: 900000,
        totalTdsPaise: 12000000,
        grossFormatted: "₹9,25,000.00",
        deductionsFormatted: "₹1,42,500.00",
        netFormatted: "₹7,82,500.00",
      },
      taxOverview: {
        taxRegime: "NEW" as const,
        declaredExemptionsPaise: 7500000,
        projectedAnnualTaxPaise: 28800000,
        taxDeductedSoFarPaise: 12000000,
        remainingTaxPaise: 16800000,
        annualTaxFormatted: "₹2,88,000.00",
        taxDeductedFormatted: "₹1,20,000.00",
      },
      bankDetails: {
        bankName: "HDFC Bank",
        accountNumberMasked: "••••••••4821",
        ifscCode: "HDFC0000123",
        accountHolderName: "Vikram Sethi",
      },
    };

    it("fetches authenticated employee personal dashboard summary", async () => {
      server.use(
        http.get("*/api/v2/payroll/employee/dashboard", () => {
          return HttpResponse.json({
            success: true,
            data: mockEssData,
          });
        })
      );

      const dashboard = await essApi.getMyPayrollDashboard();
      expect(dashboard.employeeId).toBe("emp-current-me");
      expect(dashboard.bankDetails.accountNumberMasked).toBe("••••••••4821");
      expect(dashboard.taxOverview.taxRegime).toBe("NEW");
      expect(dashboard.ytdSummary.totalNetPaise).toBe(78250000);
    });

    it("fetches personal payslips list for self-service user", async () => {
      server.use(
        http.get("*/api/v2/payroll/my-payslips", () => {
          return HttpResponse.json({
            success: true,
            data: {
              items: [
                {
                  id: "ps-01",
                  runId: "run-aug-2026",
                  periodName: "August 2026",
                  payDate: "2026-08-31",
                  grossAmountFormatted: "₹1,85,000.00",
                  netPayFormatted: "₹1,56,500.00",
                  status: "FINALIZED",
                },
                {
                  id: "ps-02",
                  runId: "run-jul-2026",
                  periodName: "July 2026",
                  payDate: "2026-07-31",
                  grossAmountFormatted: "₹1,85,000.00",
                  netPayFormatted: "₹1,56,500.00",
                  status: "FINALIZED",
                },
              ],
              total: 2,
            },
          });
        })
      );

      const payslips = await essApi.getMyPayslips({ page: 1, limit: 10 });
      expect(payslips.items).toHaveLength(2);
      expect(payslips.items[0].periodName).toBe("August 2026");
    });

    it("downloads personal payslip PDF securely", async () => {
      server.use(
        http.get("*/api/v2/payroll/my-payslips/:runId/download", () => {
          return new HttpResponse(new Blob(["PDF_BINARY_PAYSLIP"], { type: "application/pdf" }), {
            headers: { "Content-Type": "application/pdf" },
          });
        })
      );

      const blob = await essApi.downloadMyPayslip("run-aug-2026");
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe("application/pdf");
    });

    it("handles 404 when provision slips endpoint is un-deployed without crashing", async () => {
      server.use(
        http.get("*/api/v2/payroll/employee/provision-slips", () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      await expect(essApi.getMyProvisionSlips()).rejects.toThrow();
    });

    it("denies access with 403 when unauthorized user attempts to view another's payroll", async () => {
      server.use(
        http.get("*/api/v2/payroll/employee/dashboard", () => {
          return HttpResponse.json(
            { success: false, message: "Unauthorized access: you may only access your own payroll." },
            { status: 403 }
          );
        })
      );

      try {
        await essApi.getMyPayrollDashboard();
        expect.unreachable("Should have thrown 403 error");
      } catch (err: any) {
        expect(err.response.status).toBe(403);
        expect(err.response.data.message).toContain("Unauthorized");
      }
    });
  });
});

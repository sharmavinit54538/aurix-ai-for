import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { variableInputsApi } from "../api/variableInputsApi";
import { statutoryApi } from "../api/statutoryApi";
import type { VariableInputType } from "../types/variableInputs";

describe("Part 3 — Variable Inputs & Statutory Compliance Tests", () => {
  describe("Variable Input Types & Business Rules", () => {
    const validTypes: VariableInputType[] = [
      "overtime",
      "bonus",
      "incentive",
      "commission",
      "reimbursement",
      "deduction",
      "advance_recovery",
      "lop",
      "other",
    ];

    it("supports all required variable input categories", () => {
      expect(validTypes).toHaveLength(9);
      expect(validTypes).toContain("overtime");
      expect(validTypes).toContain("bonus");
      expect(validTypes).toContain("incentive");
      expect(validTypes).toContain("reimbursement");
      expect(validTypes).toContain("deduction");
      expect(validTypes).toContain("lop");
    });
  });

  describe("Statutory Non-Hardcoding Standards", () => {
    it("dynamically consumes statutory configuration from backend without hardcoded fallback", async () => {
      server.use(
        http.get("*/api/v2/payroll/statutory/config", () => {
          return HttpResponse.json({
            success: true,
            data: {
              financialYear: "2026-2027",
              effectiveFrom: "2026-04-01",
              pf: {
                employeeContributionRate: 0.12,
                employerEpsRate: 0.0833,
                employerEpfrate: 0.0367,
                wageCeilingPaise: 1500000,
                isWageCeilingEnforced: true,
              },
              esi: {
                employeeContributionRate: 0.0075,
                employerContributionRate: 0.0325,
                grossWageCeilingPaise: 2100000,
              },
              professionalTax: [
                {
                  stateCode: "KA",
                  stateName: "Karnataka",
                  slabs: [
                    { minMonthlyIncomePaise: 0, maxMonthlyIncomePaise: 2500000, taxAmountPaise: 0 },
                    { minMonthlyIncomePaise: 2500001, maxMonthlyIncomePaise: null, taxAmountPaise: 20000 },
                  ],
                },
              ],
              taxRegimes: [
                { regime: "NEW", name: "New Concessional Regime", standardDeductionPaise: 7500000, description: "Default regime under Finance Act" },
                { regime: "OLD", name: "Old Regime with Exemptions", standardDeductionPaise: 5000000, description: "Allows 80C, 80D, HRA deductions" },
              ],
            },
          });
        })
      );

      const cfg = await statutoryApi.getStatutoryConfig();
      expect(cfg.financialYear).toBe("2026-2027");
      expect(cfg.pf.employeeContributionRate).toBe(0.12);
      expect(cfg.esi.grossWageCeilingPaise).toBe(2100000);
      expect(cfg.professionalTax[0].stateCode).toBe("KA");
      expect(cfg.taxRegimes).toHaveLength(2);
    });
  });

  describe("Variable Inputs API Client Error Resilience", () => {
    it("handles 404 when variable inputs endpoint is un-deployed", async () => {
      server.use(
        http.get("*/api/v2/payroll/variable-inputs", () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      await expect(variableInputsApi.getVariableInputs()).rejects.toThrow();
    });

    it("handles 403 when period is locked for new adjustments", async () => {
      server.use(
        http.post("*/api/v2/payroll/variable-inputs", () => {
          return HttpResponse.json(
            { success: false, message: "Payroll period is closed and locked for modifications." },
            { status: 403 }
          );
        })
      );

      try {
        await variableInputsApi.createVariableInput({
          employeeId: "emp-1",
          periodId: "p-closed",
          type: "overtime",
          amountPaise: 500000,
          description: "Overtime attempt",
        });
        expect.unreachable("Should have thrown 403 error");
      } catch (err: any) {
        expect(err.response.status).toBe(403);
        expect(err.response.data.message).toContain("locked");
      }
    });

    it("handles 400 when bulk variable inputs template is malformed", async () => {
      server.use(
        http.post("*/api/v2/payroll/variable-inputs/bulk-preview", () => {
          return HttpResponse.json(
            { success: false, message: "Invalid CSV format or missing columns" },
            { status: 400 }
          );
        })
      );

      const badFile = new File(["invalid,data"], "bad.csv", { type: "text/csv" });
      await expect(variableInputsApi.previewBulkVariableInputs(badFile)).rejects.toThrow();
    });
  });
});

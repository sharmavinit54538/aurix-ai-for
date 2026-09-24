/**
 * Statutory Compliance (India Context) Types.
 *
 * CRITICAL RULE: Never hardcode PF rates, ESI rates, PT slabs, TDS rates, or thresholds.
 * All statutory configurations and calculations are strictly backend-driven.
 */

export type StatutoryComponent = "PF" | "ESI" | "PT" | "TDS";
export type TaxRegime = "OLD" | "NEW";

export interface StatutoryConfig {
  financialYear: string;
  effectiveFrom: string;
  // Backend-provided PF parameters
  pf: {
    employeeContributionRate: number; // e.g. 0.12
    employerEpsRate: number;
    employerEpfrate: number;
    wageCeilingPaise: number; // e.g. 15,000 INR = 1500000 paise
    isWageCeilingEnforced: boolean;
  };
  // Backend-provided ESI parameters
  esi: {
    employeeContributionRate: number; // e.g. 0.0075
    employerContributionRate: number; // e.g. 0.0325
    grossWageCeilingPaise: number; // e.g. 21,000 INR = 2100000 paise
  };
  // State-wise PT slabs provided by backend
  professionalTax: Array<{
    stateCode: string;
    stateName: string;
    slabs: Array<{
      minMonthlyIncomePaise: number;
      maxMonthlyIncomePaise: number | null;
      taxAmountPaise: number;
    }>;
  }>;
  // Income Tax regimes provided by backend
  taxRegimes: Array<{
    regime: TaxRegime;
    name: string;
    standardDeductionPaise: number;
    description: string;
  }>;
}

export interface EmployeeStatutoryRecord {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  // PF
  pfEligible: boolean;
  pfUan?: string | null;
  pfWagesPaise: number;
  employeePfPaise: number;
  employerPfPaise: number;
  // ESI
  esiEligible: boolean;
  esiIpNumber?: string | null;
  esiWagesPaise: number;
  employeeEsiPaise: number;
  employerEsiPaise: number;
  // PT
  ptState: string;
  ptAmountPaise: number;
  // TDS
  taxRegime: TaxRegime;
  projectedAnnualTaxPaise: number;
  monthlyTdsPaise: number;
}

export interface StatutoryPeriodSummary {
  periodId: string;
  periodName: string;
  financialYear: string;
  totalEmployees: number;
  // Totals calculated by backend
  pfTotals: {
    eligibleCount: number;
    totalWagesPaise: number;
    totalEmployeePfPaise: number;
    totalEmployerPfPaise: number;
    formattedTotal: string;
  };
  esiTotals: {
    eligibleCount: number;
    totalWagesPaise: number;
    totalEmployeeEsiPaise: number;
    totalEmployerEsiPaise: number;
    formattedTotal: string;
  };
  ptTotals: {
    coveredCount: number;
    totalPtPaise: number;
    formattedTotal: string;
  };
  tdsTotals: {
    deductedCount: number;
    totalTdsPaise: number;
    formattedTotal: string;
  };
  records: EmployeeStatutoryRecord[];
}

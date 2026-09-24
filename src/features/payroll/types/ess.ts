/**
 * Employee Self-Service (ESS) Payroll Types.
 * Strictly guarantees employee data isolation: employees only access their own records.
 */

export interface EssLatestPayslip {
  runId: string;
  periodName: string;
  payDate?: string | null;
  grossFormatted: string;
  deductionsFormatted: string;
  netPayFormatted: string;
  netPayPaise: number;
  status: string;
  downloadUrl?: string;
}

export interface EssYtdSummary {
  financialYear: string;
  totalGrossPaise: number;
  totalDeductionsPaise: number;
  totalNetPaise: number;
  totalPfPaise: number;
  totalTdsPaise: number;
  grossFormatted: string;
  deductionsFormatted: string;
  netFormatted: string;
}

export interface EssTaxOverview {
  taxRegime: "OLD" | "NEW";
  declaredExemptionsPaise: number;
  projectedAnnualTaxPaise: number;
  taxDeductedSoFarPaise: number;
  remainingTaxPaise: number;
  annualTaxFormatted: string;
  taxDeductedFormatted: string;
}

export interface EssBankDetails {
  bankName: string;
  accountNumberMasked: string; // Only last 4 digits
  ifscCode: string;
  accountHolderName: string;
}

export interface ProvisionSlipRecord {
  provisionId: string;
  runId: string;
  periodName: string;
  generatedAt: string;
  provisionalGrossFormatted: string;
  provisionalNetFormatted: string;
  status: "provisional" | "superseded_by_final";
}

export interface EmployeeSelfServiceData {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  department: string;
  designation: string;
  latestPayslip: EssLatestPayslip | null;
  ytdSummary: EssYtdSummary;
  taxOverview: EssTaxOverview;
  bankDetails: EssBankDetails;
}

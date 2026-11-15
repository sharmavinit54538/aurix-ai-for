/**
 * Salary and currency configuration for Indian compensation structures (INR).
 */
import { paiseToRupees, rupeesToPaise } from "@/lib/format";

/**
 * Parses any Indian currency string or number to a clean numeric value.
 * Strips commas, spaces, currency symbols (₹), and letters.
 * Returns null if the resulting value is not a valid positive number or contains invalid text like "15 LPA".
 */
export function parseINR(value?: string | number | null): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") {
    return isNaN(value) ? null : value;
  }

  const str = String(value).trim();
  if (!str) return null;

  // Reject strings with alphabetic suffixes like "15 LPA" or "10 Lakhs"
  if (/[a-zA-Z]/.test(str)) {
    return null;
  }

  const cleaned = str.replace(/[₹,\s]/g, "").trim();
  if (!cleaned) return null;

  const num = Number(cleaned);
  return isNaN(num) || num < 0 ? null : num;
}

/**
 * Formats a numeric value or INR string with standard Indian grouping (e.g. 1500000 -> "15,00,000").
 */
export function formatINR(value?: string | number | null): string {
  const num = parseINR(value);
  if (num === null) return "";

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Standard corporate Indian salary structure breakdown percentages based on annual CTC.
 */
export interface SalaryBreakupConfig {
  basicPercentage: number; // e.g. 40% of CTC
  hraPercentageOfBasic: number; // e.g. 50% of Basic (20% of CTC)
  employerPfPercentageOfBasic: number; // e.g. 12% of Basic (4.8% of CTC)
}

export const DEFAULT_SALARY_CONFIG: SalaryBreakupConfig = {
  basicPercentage: 0.4, // 40% of CTC
  hraPercentageOfBasic: 0.5, // 50% of Basic
  employerPfPercentageOfBasic: 0.12, // 12% of Basic
};

export interface SalaryBreakup {
  annualCtc: number;
  monthlyCtc: number;
  basicAnnual: number;
  basicMonthly: number;
  hraAnnual: number;
  hraMonthly: number;
  employerPfAnnual: number;
  employerPfMonthly: number;
  specialAllowanceAnnual: number;
  specialAllowanceMonthly: number;
  grossAnnual: number;
  grossMonthly: number;
}

/**
 * Computes an itemized offer-letter salary breakup from annual CTC using integer paise precision.
 */
export function calculateSalaryBreakup(
  annualCtcValue: number | string | null | undefined,
  config: SalaryBreakupConfig = DEFAULT_SALARY_CONFIG
): SalaryBreakup | null {
  const ctc = parseINR(annualCtcValue);
  if (!ctc || ctc <= 0) return null;

  const ctcPaise = rupeesToPaise(ctc);
  const basicAnnualPaise = Math.round(ctcPaise * config.basicPercentage);
  const hraAnnualPaise = Math.round(basicAnnualPaise * config.hraPercentageOfBasic);
  const employerPfAnnualPaise = Math.round(basicAnnualPaise * config.employerPfPercentageOfBasic);
  const specialAllowanceAnnualPaise = Math.max(
    0,
    ctcPaise - (basicAnnualPaise + hraAnnualPaise + employerPfAnnualPaise)
  );

  const basicMonthlyPaise = Math.round(basicAnnualPaise / 12);
  const hraMonthlyPaise = Math.round(hraAnnualPaise / 12);
  const employerPfMonthlyPaise = Math.round(employerPfAnnualPaise / 12);
  const specialAllowanceMonthlyPaise = Math.round(specialAllowanceAnnualPaise / 12);

  const grossAnnualPaise = basicAnnualPaise + hraAnnualPaise + specialAllowanceAnnualPaise;
  const grossMonthlyPaise = basicMonthlyPaise + hraMonthlyPaise + specialAllowanceMonthlyPaise;

  return {
    annualCtc: paiseToRupees(ctcPaise),
    monthlyCtc: Math.round(ctcPaise / 12) / 100,
    basicAnnual: paiseToRupees(basicAnnualPaise),
    basicMonthly: paiseToRupees(basicMonthlyPaise),
    hraAnnual: paiseToRupees(hraAnnualPaise),
    hraMonthly: paiseToRupees(hraMonthlyPaise),
    employerPfAnnual: paiseToRupees(employerPfAnnualPaise),
    employerPfMonthly: paiseToRupees(employerPfMonthlyPaise),
    specialAllowanceAnnual: paiseToRupees(specialAllowanceAnnualPaise),
    specialAllowanceMonthly: paiseToRupees(specialAllowanceMonthlyPaise),
    grossAnnual: paiseToRupees(grossAnnualPaise),
    grossMonthly: paiseToRupees(grossMonthlyPaise),
  };
}

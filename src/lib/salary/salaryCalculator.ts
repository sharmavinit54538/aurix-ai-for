/**
 * OFC360 Salary & Compensation Breakdown Calculator
 *
 * Estimate/Preview helper for Offer Letters and Compensation Planning.
 * Uses integer paise arithmetic internally so fractional rupee CTCs (e.g. ₹1,00,000.07)
 * are never prematurely rounded down and component annual totals sum exactly to annualCTC.
 * Authoritative payroll runs always use backend-computed amounts.
 */

import { paiseToRupees, rupeesToPaise } from "@/lib/format";

export class SalaryComponentItem {
  constructor(
    public readonly annual: number,
    public readonly monthly: number
  ) {}

  valueOf(): number {
    return this.annual;
  }

  toString(): string {
    return this.annual.toString();
  }
}

export interface CalculateSalaryBreakdownOptions {
  annualCTC: number;
  basicPercentage?: number;   // e.g. 40 or 0.40 (default: 40% of annual CTC)
  hraPercentage?: number;     // e.g. 50 or 0.50 (default: 50% of basic salary)
  bonusPercentage?: number;   // e.g. 10 or 0.10 (default: 10% of annual CTC)
  pfPercentage?: number;      // e.g. 12 or 0.12 (default: 12% of basic salary)
  medicalBenefits?: number;   // absolute annual amount (default: min(25,000, 4% of CTC))
}

export interface SalaryBreakdownResult {
  basicSalary: SalaryComponentItem;
  hra: SalaryComponentItem;
  specialAllowance: SalaryComponentItem;
  performanceBonus: SalaryComponentItem;
  employerPF: SalaryComponentItem;
  medicalBenefits: SalaryComponentItem;
  totalAnnualCTC: number;
  monthlyCTC: number;
  componentAnnualTotal: number;
  isValid: boolean;
}

/**
 * Format any number to Indian Rupee (INR) representation with Indian grouping,
 * preserving fractional paise when non-integer instead of truncating/rounding away decimals.
 */
export function formatINR(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "₹ 0";
  }
  const hasFraction = Math.abs(value % 1) > 1e-9;
  return `₹ ${value.toLocaleString("en-IN", {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: hasFraction ? 6 : 0,
  })}`;
}

/**
 * Parse flexible user input (e.g. "6.5", "6.5 LPA", "6.5 Lakhs", "₹6,50,000.50", 100000.07)
 * into a normalized annual CTC in rupees with paise precision preserved.
 */
export function parseAnnualCTC(input: string | number | undefined | null): number {
  if (input === null || input === undefined) return 650000;
  if (typeof input === "number") {
    if (!Number.isFinite(input) || input <= 0) return 650000;
    if (input < 1000) return paiseToRupees(rupeesToPaise(input * 100000));
    return paiseToRupees(rupeesToPaise(input));
  }

  const str = input.trim();
  if (!str) return 650000;

  const cleaned = str.replace(/[^0-9.]/g, "");
  const num = Number(cleaned);
  if (!Number.isFinite(num) || num <= 0) return 650000;

  const isLakhExplicit = /lakh|lpa/i.test(str);
  if (isLakhExplicit || num < 1000) {
    return paiseToRupees(rupeesToPaise(num * 100000));
  }

  return paiseToRupees(rupeesToPaise(num));
}

/**
 * Core Salary Breakdown Engine (Integer Paise Precision)
 * Calculates all components from annualCTC and guarantees exact summation to the paise.
 */
export function calculateSalaryBreakdown(options: CalculateSalaryBreakdownOptions): SalaryBreakdownResult {
  const ctcPaise = Math.max(0, rupeesToPaise(options.annualCTC));
  const annualCTC = paiseToRupees(ctcPaise);

  if (ctcPaise === 0) {
    const zeroItem = new SalaryComponentItem(0, 0);
    return {
      basicSalary: zeroItem,
      hra: zeroItem,
      specialAllowance: zeroItem,
      performanceBonus: zeroItem,
      employerPF: zeroItem,
      medicalBenefits: zeroItem,
      totalAnnualCTC: 0,
      monthlyCTC: 0,
      componentAnnualTotal: 0,
      isValid: true,
    };
  }

  // Normalize percentages (accepts both 40 and 0.40)
  const basicPct = options.basicPercentage !== undefined
    ? (options.basicPercentage > 1 ? options.basicPercentage / 100 : options.basicPercentage)
    : 0.40;

  const hraPct = options.hraPercentage !== undefined
    ? (options.hraPercentage > 1 ? options.hraPercentage / 100 : options.hraPercentage)
    : 0.50;

  const bonusPct = options.bonusPercentage !== undefined
    ? (options.bonusPercentage > 1 ? options.bonusPercentage / 100 : options.bonusPercentage)
    : 0.10;

  const pfPct = options.pfPercentage !== undefined
    ? (options.pfPercentage > 1 ? options.pfPercentage / 100 : options.pfPercentage)
    : 0.12;

  // All calculations performed in integer paise
  const basicPaise = Math.round(ctcPaise * basicPct);
  const hraPaise = Math.round(basicPaise * hraPct);
  const bonusPaise = Math.round(ctcPaise * bonusPct);
  const pfPaise = Math.round(basicPaise * pfPct);

  const medicalPaise = options.medicalBenefits !== undefined
    ? Math.max(0, rupeesToPaise(options.medicalBenefits))
    : Math.min(2500000, Math.max(600000, Math.round(ctcPaise * 0.04)));

  const definedSubtotalPaise = basicPaise + hraPaise + bonusPaise + pfPaise + medicalPaise;
  let finalBasicPaise = basicPaise;
  let finalHraPaise = hraPaise;
  let finalSpecialPaise = ctcPaise - definedSubtotalPaise;

  if (finalSpecialPaise < 0) {
    finalSpecialPaise = 0;
    const remainingPaise = ctcPaise - (bonusPaise + pfPaise + medicalPaise);
    if (remainingPaise > 0) {
      finalBasicPaise = Math.round(remainingPaise / (1 + hraPct));
      finalHraPaise = remainingPaise - finalBasicPaise;
    } else {
      finalBasicPaise = 0;
      finalHraPaise = 0;
    }
  }

  const sumBeforeReconciliation =
    finalBasicPaise + finalHraPaise + finalSpecialPaise + bonusPaise + pfPaise + medicalPaise;
  finalSpecialPaise += ctcPaise - sumBeforeReconciliation;

  const componentAnnualPaiseTotal =
    finalBasicPaise + finalHraPaise + finalSpecialPaise + bonusPaise + pfPaise + medicalPaise;
  const isValid = componentAnnualPaiseTotal === ctcPaise;

  const toMonthly = (paise: number) => Math.round(paise / 12) / 100;

  return {
    basicSalary: new SalaryComponentItem(paiseToRupees(finalBasicPaise), toMonthly(finalBasicPaise)),
    hra: new SalaryComponentItem(paiseToRupees(finalHraPaise), toMonthly(finalHraPaise)),
    specialAllowance: new SalaryComponentItem(paiseToRupees(finalSpecialPaise), toMonthly(finalSpecialPaise)),
    performanceBonus: new SalaryComponentItem(paiseToRupees(bonusPaise), toMonthly(bonusPaise)),
    employerPF: new SalaryComponentItem(paiseToRupees(pfPaise), toMonthly(pfPaise)),
    medicalBenefits: new SalaryComponentItem(paiseToRupees(medicalPaise), toMonthly(medicalPaise)),
    totalAnnualCTC: annualCTC,
    monthlyCTC: toMonthly(ctcPaise),
    componentAnnualTotal: paiseToRupees(componentAnnualPaiseTotal),
    isValid,
  };
}

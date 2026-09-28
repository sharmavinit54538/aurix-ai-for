/**
 * OFC360 Salary & Compensation Breakdown Calculator
 * 
 * Central source of truth for salary structure and Offer Letter compensation calculations.
 * - Single source of truth: annualCTC
 * - Every component is calculated strictly from annualCTC
 * - Component annual totals always sum up EXACTLY to annualCTC
 * - Monthly values are strictly derived from component annual values (annual / 12)
 * - Standard Indian statutory structure: Basic (40%), HRA (50% of Basic), Performance Bonus (10% of CTC),
 *   Employer PF (12% of Basic), Medical Benefits, and Special Allowance as balancing component.
 * - Consistent INR formatting with Indian comma placement (e.g. ₹ 6,50,000, ₹ 54,167).
 */

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
 * Format any number to Indian Rupee (INR) representation with Indian grouping.
 * Examples:
 *   650000   -> "₹ 6,50,000"
 *   54166.67 -> "₹ 54,167"
 *   740000   -> "₹ 7,40,000"
 */
export function formatINR(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "₹ 0";
  }
  const rounded = Math.round(value);
  return `₹ ${rounded.toLocaleString("en-IN")}`;
}

/**
 * Parse flexible user input (e.g. "6.5", "6.5 LPA", "6.5 Lakhs", "₹6,50,000", 650000)
 * into a normalized integer annual CTC in rupees.
 */
export function parseAnnualCTC(input: string | number | undefined | null): number {
  if (input === null || input === undefined) return 650000;
  if (typeof input === "number") {
    if (isNaN(input) || input <= 0) return 650000;
    if (input < 1000) return Math.round(input * 100000);
    return Math.round(input);
  }

  const str = input.trim();
  if (!str) return 650000;

  const cleaned = str.replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);
  if (isNaN(num) || num <= 0) return 650000;

  const isLakhExplicit = /lakh|lpa/i.test(str);
  if (isLakhExplicit || num < 1000) {
    return Math.round(num * 100000);
  }

  return Math.round(num);
}

/**
 * Core Salary Breakdown Engine
 * Calculates all components from annualCTC and guarantees exact summation.
 */
export function calculateSalaryBreakdown(options: CalculateSalaryBreakdownOptions): SalaryBreakdownResult {
  const rawCTC = options.annualCTC;
  const annualCTC = Math.max(0, Math.round(rawCTC || 0));

  // If CTC is 0, return clean zeros
  if (annualCTC === 0) {
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

  // 1. Basic Salary (e.g. 40% of CTC)
  const basicAnnual = Math.round(annualCTC * basicPct);

  // 2. House Rent Allowance (50% of Basic)
  const hraAnnual = Math.round(basicAnnual * hraPct);

  // 3. Annual Performance Bonus (10% of CTC)
  const bonusAnnual = Math.round(annualCTC * bonusPct);

  // 4. Employer PF Contribution (12% of Basic)
  const pfAnnual = Math.round(basicAnnual * pfPct);

  // 5. Medical Insurance & Benefits
  const medicalAnnual = options.medicalBenefits !== undefined
    ? Math.round(options.medicalBenefits)
    : Math.min(25000, Math.max(6000, Math.round(annualCTC * 0.04)));

  // 6. Special & Performance Allowance (Balancing Component)
  const definedSubtotal = basicAnnual + hraAnnual + bonusAnnual + pfAnnual + medicalAnnual;
  const initialSpecialAnnual = annualCTC - definedSubtotal;

  let finalBasic = basicAnnual;
  let finalHra = hraAnnual;
  let finalSpecial = initialSpecialAnnual;

  // If defined subtotal exceeded CTC (only possible on extreme custom percentages or very tiny CTC),
  // safely clamp special allowance to 0 and re-balance components
  if (finalSpecial < 0) {
    finalSpecial = 0;
    const remaining = annualCTC - (bonusAnnual + pfAnnual + medicalAnnual);
    if (remaining > 0) {
      finalBasic = Math.round(remaining / (1 + hraPct));
      finalHra = remaining - finalBasic;
    } else {
      finalBasic = 0;
      finalHra = 0;
    }
  }

  // Safe rounding reconciliation: Ensure SUM(components) === annualCTC exactly
  const sumBeforeReconciliation = finalBasic + finalHra + finalSpecial + bonusAnnual + pfAnnual + medicalAnnual;
  const roundingDifference = annualCTC - sumBeforeReconciliation;
  finalSpecial += roundingDifference;

  const componentAnnualTotal = finalBasic + finalHra + finalSpecial + bonusAnnual + pfAnnual + medicalAnnual;
  const isValid = componentAnnualTotal === annualCTC;

  // Monthly values strictly derived from annual components (componentAnnual / 12)
  const toMonthly = (annual: number) => Math.round((annual / 12) * 100) / 100;

  const monthlyCTC = Math.round((annualCTC / 12) * 100) / 100;

  return {
    basicSalary: new SalaryComponentItem(finalBasic, toMonthly(finalBasic)),
    hra: new SalaryComponentItem(finalHra, toMonthly(finalHra)),
    specialAllowance: new SalaryComponentItem(finalSpecial, toMonthly(finalSpecial)),
    performanceBonus: new SalaryComponentItem(bonusAnnual, toMonthly(bonusAnnual)),
    employerPF: new SalaryComponentItem(pfAnnual, toMonthly(pfAnnual)),
    medicalBenefits: new SalaryComponentItem(medicalAnnual, toMonthly(medicalAnnual)),
    totalAnnualCTC: annualCTC,
    monthlyCTC,
    componentAnnualTotal,
    isValid,
  };
}

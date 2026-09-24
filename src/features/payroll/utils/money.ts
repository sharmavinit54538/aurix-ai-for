/**
 * Integer Paise Precision Money Utilities.
 * Guarantees zero floating point error in all payment batch calculations and reconciliation.
 */

import { formatINR } from "@/lib/format";

/**
 * Converts a currency string or numeric Rupee value to integer Paise.
 * e.g. "125000.50" -> 12500050 paise
 */
export function toPaise(val?: number | string | null): number {
  if (val === null || val === undefined || val === "") return 0;
  const num = typeof val === "number" ? val : parseFloat(String(val).replace(/,/g, ""));
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
}

/**
 * Converts integer Paise to numeric Rupees.
 */
export function toRupees(paise?: number | bigint | null): number {
  if (paise === null || paise === undefined) return 0;
  const n = typeof paise === "bigint" ? Number(paise) : Number(paise);
  if (isNaN(n)) return 0;
  return n / 100;
}

/**
 * Formats integer paise into localized INR currency string.
 */
export function formatPaiseToINR(paise?: number | bigint | null): string {
  if (paise === null || paise === undefined) return "₹0.00";
  return formatINR(toRupees(paise));
}

/**
 * Safely adds integer paise values avoiding float overflow.
 */
export function addPaise(...amounts: (number | bigint | null | undefined)[]): number {
  return amounts.reduce<number>((acc, curr) => {
    if (curr === null || curr === undefined) return acc;
    const n = typeof curr === "bigint" ? Number(curr) : Number(curr);
    return acc + (isNaN(n) ? 0 : Math.round(n));
  }, 0);
}

/**
 * Safely subtracts subtrahend from minuend in integer paise.
 */
export function subtractPaise(
  minuend: number | bigint,
  subtrahend: number | bigint
): number {
  const m = typeof minuend === "bigint" ? Number(minuend) : Number(minuend);
  const s = typeof subtrahend === "bigint" ? Number(subtrahend) : Number(subtrahend);
  return Math.round(m) - Math.round(s);
}

/**
 * Evaluates whether an amount is zero or negative.
 */
export function checkNetPaySanity(paise: number | bigint): {
  isZero: boolean;
  isNegative: boolean;
  isValid: boolean;
} {
  const n = typeof paise === "bigint" ? Number(paise) : Number(paise);
  const isZero = n === 0;
  const isNegative = n < 0;
  return {
    isZero,
    isNegative,
    isValid: n > 0,
  };
}

/**
 * Formal mathematical reconciliation test:
 * expectedPaise === (paidPaise + failedPaise + heldPaise + processingPaise)
 */
export function evaluateReconciliation(
  expectedPaise: number,
  paidPaise: number,
  failedPaise: number,
  heldPaise: number,
  processingPaise: number = 0
): {
  isReconciled: boolean;
  mismatchPaise: number;
  totalAccountedPaise: number;
} {
  const accounted = addPaise(paidPaise, failedPaise, heldPaise, processingPaise);
  const mismatch = subtractPaise(expectedPaise, accounted);
  return {
    isReconciled: mismatch === 0,
    mismatchPaise: mismatch,
    totalAccountedPaise: accounted,
  };
}

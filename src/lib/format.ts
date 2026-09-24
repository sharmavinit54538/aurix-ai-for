/**
 * Central Formatting Utilities for Currency, Banking, and Sensitive Identifiers.
 * Strictly adheres to Indian Rupee (INR) conventions and data masking standards.
 */

/**
 * Formats a Rupee value into Indian currency format (e.g. ₹1,25,000.00).
 */
export function formatINR(val?: number | string | null): string {
  if (val === null || val === undefined || val === "") return "₹0.00";
  const num = typeof val === "number" ? val : parseFloat(String(val).replace(/,/g, ""));
  if (isNaN(num)) return "₹0.00";

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `₹${num.toFixed(2)}`;
  }
}

/**
 * Formats integer paise into Rupee currency format (e.g., 1050000000 paise -> ₹1,05,00,000.00).
 */
export function formatPaise(paise?: number | bigint | null): string {
  if (paise === null || paise === undefined) return "₹0.00";
  const numPaise = typeof paise === "bigint" ? Number(paise) : Number(paise);
  if (isNaN(numPaise)) return "₹0.00";
  return formatINR(numPaise / 100);
}

/**
 * Converts Rupees to integer Paise, preventing floating point inaccuracy.
 */
export function rupeesToPaise(rupees: number | string): number {
  const num = typeof rupees === "number" ? rupees : parseFloat(String(rupees).replace(/,/g, ""));
  if (isNaN(num)) return 0;
  return Math.round(num * 100);
}

/**
 * Converts integer Paise to Rupees number.
 */
export function paiseToRupees(paise: number | bigint): number {
  const num = typeof paise === "bigint" ? Number(paise) : Number(paise);
  if (isNaN(num)) return 0;
  return num / 100;
}

/**
 * Formats integer counts with Indian comma grouping (e.g. 1,420).
 */
export function formatCount(val?: number | string | null): string {
  if (val === null || val === undefined || val === "") return "0";
  const num = typeof val === "number" ? val : parseInt(String(val), 10);
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
}

/**
 * Formats a Date/ISO string to localized readable Indian format (e.g. "24 Sep 2026").
 */
export function formatDate(
  val?: string | Date | null,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!val) return "—";
  try {
    const d = typeof val === "string" ? new Date(val) : val;
    if (isNaN(d.getTime())) return "—";
    const defaultOptions: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...options,
    };
    return new Intl.DateTimeFormat("en-IN", defaultOptions).format(d);
  } catch {
    return String(val);
  }
}

/**
 * Formats a Date/ISO string with time (e.g. "24 Sep 2026, 05:30 PM").
 */
export function formatDateTime(val?: string | Date | null): string {
  return formatDate(val, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Masks bank account number, displaying only the last 4 digits (e.g. ••••••••1234).
 */
export function maskAccountNumber(acc?: string | null): string {
  if (!acc) return "—";
  const str = String(acc).trim();
  if (str.length <= 4) return str;
  return `••••••••${str.slice(-4)}`;
}

/**
 * Masks national identifiers such as PAN or Aadhaar (e.g. AB••••••1A).
 */
export function maskIdentifier(val?: string | null): string {
  if (!val) return "—";
  const str = String(val).trim();
  if (str.length <= 4) return str;
  return `${str.slice(0, 2)}••••••${str.slice(-2)}`;
}

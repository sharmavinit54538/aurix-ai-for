/**
 * Central Formatting Utilities for Currency, Banking, and Sensitive Identifiers.
 * Strictly adheres to Indian Rupee (INR) conventions, decimal precision, and data masking standards.
 */

/**
 * Counts fractional decimal places in a finite number or numeric string (capped to 6).
 */
function detectFractionDigits(raw: string | number): number {
  const s = typeof raw === "number" ? raw.toString() : raw.trim().replace(/[₹,\s]/g, "");
  if (!s) return 2;
  // Handle scientific notation like 1e-6
  const expMatch = s.match(/e-(\d+)$/i);
  if (expMatch) {
    const exp = parseInt(expMatch[1], 10);
    const mantissaParts = s.split(/e/i)[0].split(".");
    const mantissaFrac = mantissaParts[1]?.replace(/0+$/, "").length ?? 0;
    return Math.min(6, Math.max(2, exp + mantissaFrac));
  }
  const dotIdx = s.indexOf(".");
  if (dotIdx === -1) return 2;
  const frac = s.slice(dotIdx + 1).replace(/0+$/, "");
  return Math.min(6, Math.max(2, frac.length));
}

function parseNumericInput(val?: number | string | null): number | null {
  if (val === null || val === undefined || val === "") return null;
  if (typeof val === "number") {
    return Number.isFinite(val) ? val : null;
  }
  const cleaned = String(val).replace(/[₹,\s]/g, "").trim();
  if (!cleaned) return null;
  const num = Number(cleaned);
  return Number.isFinite(num) ? num : null;
}

/**
 * Formats a Rupee value into Indian currency format (e.g. ₹1,25,000.00).
 * Preserves sub-paise precision up to 6 fractional digits when present (e.g. 0.000001 -> ₹0.000001),
 * and defaults null/undefined to "₹0.00" for backward compatibility.
 */
export function formatINR(val?: number | string | null): string {
  const num = parseNumericInput(val);
  if (num === null) return "₹0.00";

  const fracDigits = detectFractionDigits(typeof val === "string" ? val : num);

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: fracDigits,
    }).format(num);
  } catch {
    return `₹${num.toFixed(fracDigits)}`;
  }
}

/**
 * Formats an optional Rupee value into Indian currency format, returning "—" when null/undefined/NaN.
 * Never coerces missing backend metrics to ₹0.00.
 */
export function formatOptionalINR(val?: number | string | null): string {
  const num = parseNumericInput(val);
  if (num === null) return "—";
  return formatINR(typeof val === "string" ? val : num);
}

/**
 * Formats integer paise into Rupee currency format (e.g., 1050000000 paise -> ₹1,05,00,000.00).
 */
export function formatPaise(paise?: number | bigint | null): string {
  if (paise === null || paise === undefined) return "₹0.00";
  const numPaise = typeof paise === "bigint" ? Number(paise) : Number(paise);
  if (!Number.isFinite(numPaise)) return "₹0.00";
  return formatINR(numPaise / 100);
}

/**
 * Converts Rupees to integer Paise using exact decimal-string scaling (no float multiplication error).
 * Supports Indian comma formatting, ₹ symbol, negative values, and scientific notation.
 */
export function rupeesToPaise(rupees: number | string | null | undefined): number {
  if (rupees === null || rupees === undefined || rupees === "") return 0;

  let rawStr: string;
  if (typeof rupees === "number") {
    if (!Number.isFinite(rupees)) return 0;
    // Normalize binary float noise (e.g. 0.1 + 0.2 = 0.30000000000000004) to 12 significant decimals
    rawStr = Math.abs(rupees) < 1e-12 ? "0" : Number(rupees.toPrecision(14)).toString();
  } else {
    rawStr = String(rupees).replace(/[₹,\s]/g, "").trim();
  }

  if (!rawStr) return 0;

  // Handle scientific notation safely
  if (/e/i.test(rawStr)) {
    const n = Number(rawStr);
    if (!Number.isFinite(n)) return 0;
    rawStr = n.toFixed(6);
  }

  const sign = rawStr.startsWith("-") ? -1 : 1;
  const unsigned = rawStr.replace(/^[+-]/, "");
  if (!/^\d*(?:\.\d*)?$/.test(unsigned) || unsigned === ".") return 0;

  const [wholePart = "0", fracPart = ""] = unsigned.split(".");
  const wholeDigits = wholePart.replace(/^0+/, "") || "0";
  const paddedFrac = (fracPart + "00").slice(0, 2);
  const roundingDigit = fracPart.length > 2 ? Number(fracPart[2]) : 0;

  let paiseAbs = Number(wholeDigits) * 100 + Number(paddedFrac);
  if (roundingDigit >= 5) {
    paiseAbs += 1;
  }

  const result = sign * paiseAbs;
  return Object.is(result, -0) ? 0 : result;
}

/**
 * Converts integer Paise to Rupees number.
 */
export function paiseToRupees(paise: number | bigint): number {
  const num = typeof paise === "bigint" ? Number(paise) : Number(paise);
  if (!Number.isFinite(num)) return 0;
  return num / 100;
}

/**
 * Formats integer counts with Indian comma grouping (e.g. 1,420).
 */
export function formatCount(val?: number | string | null): string {
  if (val === null || val === undefined || val === "") return "0";
  const num = typeof val === "number" ? val : parseInt(String(val), 10);
  if (!Number.isFinite(num)) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
}

/**
 * Formats optional integer counts, returning "—" when missing rather than "0".
 */
export function formatOptionalCount(val?: number | string | null): string {
  if (val === null || val === undefined || val === "") return "—";
  const num = typeof val === "number" ? val : Number(String(val).replace(/,/g, ""));
  if (!Number.isFinite(num)) return "—";
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

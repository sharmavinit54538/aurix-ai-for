import { getPeriodsList } from "./getPeriodsList";
import type { PayrollPeriod } from "../types";

/**
 * Fetch all configured payroll periods from the backend (flat array).
 * Thin wrapper around getPeriodsList - single source of truth.
 * Uses /api/v2/payroll/cycles endpoint only (v1 fallback removed).
 */
export async function getPeriods(): Promise<PayrollPeriod[]> {
  const res = await getPeriodsList({ limit: 100 });
  return res.items;
}
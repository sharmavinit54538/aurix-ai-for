import axios from "axios";
import { isNotFoundError } from "./errors";

// ── Helper to extract API data safely ─────────────────────────────────

export function extractData<T = unknown>(res: unknown): T {
  const r = res as { data?: unknown; status?: number; headers?: unknown } | undefined;
  const body =
    r?.data !== undefined && (r?.status !== undefined || r?.headers !== undefined) ? r.data : res;

  if (body == null) return null as unknown as T;

  if (typeof body === "object") {
    const b = body as Record<string, unknown>;
    if ("data" in b && b.data !== undefined) return b.data as T;
    if ("result" in b && b.result !== undefined) return b.result as T;
  }

  return body as T;
}

const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export { MONTH_NAMES };

/**
 * Executes a primary API call with graceful fallback when receiving 404 Not Found.
 */
export async function requestWithFallback<T>(
  primaryFn: () => Promise<T>,
  fallbackFn?: () => Promise<T>,
): Promise<T> {
  try {
    return await primaryFn();
  } catch (err: unknown) {
    if (fallbackFn && isNotFoundError(err)) {
      return await fallbackFn();
    }
    throw err;
  }
}
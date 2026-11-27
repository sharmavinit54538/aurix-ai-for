import axios from "axios";

/** Only transport failures and transient HTTP responses are safe to retry. */
export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= 1 || axios.isCancel(error)) return false;

  const status = axios.isAxiosError(error)
    ? error.response?.status ?? 0
    : error && typeof error === "object" && "status" in error
      ? error.status
      : undefined;

  return (
    typeof status === "number" &&
    [0, 408, 429, 500, 502, 503, 504].includes(status)
  );
}

export function queryRetryDelay(attemptIndex: number): number {
  return Math.min(1000 * 2 ** attemptIndex, 30_000);
}

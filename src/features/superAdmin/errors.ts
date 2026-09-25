import { ApiError } from "@/api/client";

export type ErrorKind = "unauthenticated" | "forbidden" | "network" | "failure";

/** Maps an API failure to the UI state that should be shown for it. */
export function classifyError(error: unknown): { kind: ErrorKind; status: number; message: string } {
  const status = error instanceof ApiError ? error.status : 0;
  const message = error instanceof Error ? error.message : "Unknown error";
  if (status === 401) return { kind: "unauthenticated", status, message };
  if (status === 403) return { kind: "forbidden", status, message };
  if (status === 0) return { kind: "network", status, message };
  return { kind: "failure", status, message };
}

/** True for 401/403 responses — the page should render the access-denied state. */
export function isAuthorizationError(error: unknown): boolean {
  const { kind } = classifyError(error);
  return kind === "unauthenticated" || kind === "forbidden";
}

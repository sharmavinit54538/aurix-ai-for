import { ApiError } from "@/api/client";
import { parseApiError } from "@/api/utils";

export interface FormattedSecurityError {
  status: number;
  title: string;
  message: string;
  fieldErrors: Record<string, string>;
  isAuthError: boolean;
  isForbidden: boolean;
  isNotFound: boolean;
  isRateLimited: boolean;
  isNetworkError: boolean;
}

const STATUS_FALLBACKS: Record<number, { title: string; message: string }> = {
  400: {
    title: "Invalid Request",
    message: "The request could not be processed. Please review your input and try again.",
  },
  401: {
    title: "Session Expired",
    message: "Your authentication session is no longer valid. Please sign in again.",
  },
  403: {
    title: "Insufficient Permissions",
    message: "You do not have permission to perform this security action.",
  },
  404: {
    title: "Record Not Found",
    message: "The requested user or security session could not be found.",
  },
  409: {
    title: "Security State Conflict",
    message: "This security state has already changed or conflicts with an active policy.",
  },
  422: {
    title: "Validation Error",
    message: "One or more required fields failed validation.",
  },
  429: {
    title: "Too Many Requests",
    message: "Rate limit exceeded for this security action. Please wait a moment and try again.",
  },
  500: {
    title: "Server Error",
    message: "An unexpected server error occurred while processing the security request.",
  },
  503: {
    title: "Service Unavailable",
    message: "The security service is temporarily unavailable. Please try again shortly.",
  },
  0: {
    title: "Network Connection Error",
    message: "Unable to reach the OFC360 server. Check your internet connection and retry.",
  },
};

function getNumericStatus(error: unknown): number {
  if (error instanceof ApiError) return error.status;
  if (error && typeof error === "object") {
    const record = error as Record<string, unknown>;
    if (typeof record.status === "number") return record.status;
    if (record.response && typeof record.response === "object") {
      const respStatus = (record.response as Record<string, unknown>).status;
      if (typeof respStatus === "number") return respStatus;
    }
    if (record.error && typeof record.error === "string" && /network|fetch/i.test(record.error)) {
      return 0;
    }
  }
  if (error instanceof Error && /network error|econnrefused|err_network/i.test(error.message)) {
    return 0;
  }
  return 500;
}

/**
 * Formats API errors from both RTK Query `{ status, data }` and Axios/ApiError instances
 * into safe, user-friendly messages and mapped field validation errors.
 */
export function formatSecurityApiError(
  error: unknown,
  defaultMessage = "Security operation failed.",
): FormattedSecurityError {
  const status = getNumericStatus(error);
  const meta = STATUS_FALLBACKS[status] ?? {
    title: "Request Failed",
    message: defaultMessage,
  };

  const parsed = parseApiError(error, "");
  let rawMessage = parsed.message?.trim() || "";
  if (!rawMessage && error instanceof Error) {
    rawMessage = error.message;
  }
  if (/^request failed with status \d+$/i.test(rawMessage) || rawMessage === "An error occurred") {
    rawMessage = "";
  }

  // Avoid surfacing raw technical stack strings
  if (rawMessage && /stack|traceback|syntaxerror|typeerror/i.test(rawMessage)) {
    rawMessage = "";
  }

  const resolvedMessage =
    status === 0
      ? STATUS_FALLBACKS[0].message
      : rawMessage || meta.message || defaultMessage;

  return {
    status,
    title: meta.title,
    message: resolvedMessage,
    fieldErrors: parsed.fieldErrors ?? {},
    isAuthError: status === 401,
    isForbidden: status === 403,
    isNotFound: status === 404,
    isRateLimited: status === 429,
    isNetworkError: status === 0,
  };
}

/** Safely extracts an object record from an API envelope `{ success, data }` or raw payload. */
export function unwrapApiPayload<T = Record<string, unknown>>(raw: unknown): T | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  if (obj.data !== undefined && obj.data !== null && typeof obj.data === "object") {
    return obj.data as T;
  }
  return obj as T;
}

/** Extracts an optional trimmed string from candidate keys. */
export function pickString(obj: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const val = obj[key];
    if (typeof val === "string" && val.trim() !== "") {
      return val.trim();
    }
  }
  return undefined;
}

/** Extracts an optional boolean from candidate keys. */
export function pickBoolean(obj: Record<string, unknown>, ...keys: string[]): boolean | undefined {
  for (const key of keys) {
    const val = obj[key];
    if (typeof val === "boolean") return val;
    if (val === "true") return true;
    if (val === "false") return false;
  }
  return undefined;
}

/** Extracts an optional finite number from candidate keys. */
export function pickNumber(obj: Record<string, unknown>, ...keys: string[]): number | undefined {
  for (const key of keys) {
    const val = obj[key];
    if (typeof val === "number" && Number.isFinite(val)) return val;
    if (typeof val === "string" && val.trim() !== "" && Number.isFinite(Number(val))) {
      return Number(val);
    }
  }
  return undefined;
}

/** Extracts string array (such as MFA backup/recovery codes) without inventing entries. */
export function pickStringArray(obj: Record<string, unknown>, ...keys: string[]): string[] | undefined {
  for (const key of keys) {
    const val = obj[key];
    if (Array.isArray(val)) {
      const cleaned = val.filter((item): item is string => typeof item === "string" && item.trim() !== "");
      if (cleaned.length > 0) return cleaned;
    }
  }
  return undefined;
}

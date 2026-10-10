import { ApiError } from "./client";

/**
 * Extracts field-level validation errors from FastAPI 422 or standard error responses.
 * Moved from announcementsApi.ts for reuse across services.
 */
export function extractValidationErrors(error: unknown): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  if (!error || typeof error !== "object") return fieldErrors;

  const errObj = error as { response?: { data?: unknown }; data?: unknown };
  const data = errObj.response?.data ?? errObj.data;

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    // FastAPI 422: detail array
    if (Array.isArray(record.detail)) {
      for (const item of record.detail) {
        if (item && typeof item === "object") {
          const loc = (item as { loc?: unknown[] }).loc;
          const msg = (item as { msg?: string }).msg;
          if (Array.isArray(loc) && loc.length > 0 && typeof msg === "string") {
            const field = String(loc[loc.length - 1]);
            fieldErrors[field] = msg;
          }
        }
      }
    }

    // OFC360 custom errors array
    if (Array.isArray(record.errors)) {
      for (const item of record.errors) {
        if (item && typeof item === "object") {
          const field = (item as { field?: string }).field;
          const msg = (item as { message?: string }).message;
          if (field && msg) {
            fieldErrors[field] = msg;
          }
        }
      }
    }
  }

  return fieldErrors;
}

export interface ParsedError {
  message: string;
  fieldErrors: Record<string, string>;
  status: number;
}

export function parseApiError(error: unknown, fallbackMessage = "An error occurred"): ParsedError {
  let message: any = fallbackMessage;
  let fieldErrors: Record<string, string> = {};
  let status = 500;

  if (error && typeof error === "object") {
    // If it's a custom ApiError or has response status
    const statusVal = (error as any).status || (error as any).response?.status;
    if (statusVal) status = statusVal;

    const data = (error as any).data || (error as any).response?.data;
    if (data && typeof data === "object") {
      // 1. Check message
      if (typeof data.message === "string" && data.message) {
        message = data.message;
      } 
      // 2. Check detail (could be string or FastAPI detail list)
      else if (data.detail) {
        if (typeof data.detail === "string") {
          message = data.detail;
        } else if (Array.isArray(data.detail)) {
          // FastAPI validation detail: [{"loc": ["body", "personal_email"], "msg": "value is not a valid email"}]
          const firstErr = data.detail[0];
          if (firstErr && typeof firstErr === "object") {
            message = firstErr.msg || fallbackMessage;
          } else if (firstErr) {
            message = String(firstErr);
          }
          
          // Map to fields
          data.detail.forEach((item: any) => {
            if (item && typeof item === "object" && Array.isArray(item.loc) && item.loc.length > 1) {
              const fieldName = item.loc[1]; // e.g. "personal_email" or "phone"
              fieldErrors[fieldName] = String(item.msg || "Invalid value");
            }
          });
        }
      }
      
      // 3. Check errors dictionary/object or array
      if (data.errors) {
        if (typeof data.errors === "string") {
          message = data.errors;
        } else if (Array.isArray(data.errors)) {
          // Array of objects, e.g. [{"field": "personal_email", "message": "Email already in use."}]
          data.errors.forEach((err: any) => {
            if (err && typeof err === "object") {
              const fieldName = err.field || (Array.isArray(err.loc) ? err.loc[1] : null) || "unknown";
              const fieldMsg = err.message || err.msg || "Invalid value";
              fieldErrors[fieldName] = String(fieldMsg);
            }
          });
          const firstErr = data.errors[0];
          if (firstErr && typeof firstErr === "object") {
            const firstMsg = firstErr.message || firstErr.msg;
            if (firstMsg) {
              message = String(firstMsg);
            }
          }
        } else if (typeof data.errors === "object") {
          // Dictionary of field errors: {"phone": "Invalid phone", "email": "already exists"}
          Object.entries(data.errors).forEach(([k, v]) => {
            if (v && typeof v === "object") {
              const obj = v as any;
              fieldErrors[k] = String(obj.message || obj.msg || JSON.stringify(v));
            } else {
              fieldErrors[k] = String(v);
            }
          });
          const firstErrorKey = Object.keys(data.errors)[0];
          if (firstErrorKey) {
            const firstVal = data.errors[firstErrorKey];
            if (firstVal && typeof firstVal === "object") {
              message = String(firstVal.message || firstVal.msg || JSON.stringify(firstVal));
            } else if (firstVal) {
              message = String(firstVal);
            }
          }
        }
      }
    } else if ((error as any).message) {
      message = (error as any).message;
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  // Double safety: ensure message is a primitive string and fieldErrors are strings
  if (message && typeof message === "object") {
    const obj = message as any;
    message = String(obj.message || obj.msg || JSON.stringify(message));
  } else {
    message = String(message || fallbackMessage);
  }

  return { message, fieldErrors, status };
}

export function getErrorMessage(error: unknown, fallback: string): string {
  return parseApiError(error, fallback).message;
}

export function getRejectMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as ParsedError).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  if (typeof payload === "string" && payload.trim()) return payload;
  return fallback;
}

export interface PaginatedList<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Normalizes list responses supporting both `{ items, total, page, limit }`
 * and legacy raw array responses `[ ... ]`.
 */
export function parseListResponse<T>(
  response: unknown,
  defaultPage = 1,
  defaultLimit = 50,
): PaginatedList<T> {
  if (!response) {
    return { items: [], total: 0, page: defaultPage, limit: defaultLimit };
  }

  const raw = (response as any)?.data ?? response;

  if (Array.isArray(raw)) {
    return {
      items: raw as T[],
      total: raw.length,
      page: defaultPage,
      limit: defaultLimit,
    };
  }

  if (typeof raw === "object") {
    const items = Array.isArray(raw.items)
      ? raw.items
      : Array.isArray(raw.data)
        ? raw.data
        : Array.isArray(raw.results)
          ? raw.results
          : [];
    const total = typeof raw.total === "number" ? raw.total : items.length;
    const page = typeof raw.page === "number" ? raw.page : defaultPage;
    const limit = typeof raw.limit === "number" ? raw.limit : defaultLimit;

    return {
      items: items as T[],
      total,
      page,
      limit,
    };
  }

  return { items: [], total: 0, page: defaultPage, limit: defaultLimit };
}

export async function tryApi<T>(call: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await call();
  } catch {
    return fallback;
  }
}


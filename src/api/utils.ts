import { ApiError } from "./client";

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

export async function tryApi<T>(call: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await call();
  } catch {
    return fallback;
  }
}

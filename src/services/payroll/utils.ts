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
 * Parses Content-Disposition header to extract filename.
 * Returns the filename without path, or null if not found.
 */
export function parseContentDisposition(contentDisposition?: string): string | null {
  if (!contentDisposition) return null;
  
  // RFC 5987: filename*=UTF-8''filename.txt
  const rfc5987Match = contentDisposition.match(/filename\*=([^']*)'([^']*)'(.+)/);
  if (rfc5987Match) {
    try {
      return decodeURIComponent(rfc5987Match[3]);
    } catch {
      return rfc5987Match[3];
    }
  }
  
  // Standard: filename="filename.txt"
  const standardMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  if (standardMatch) {
    let filename = standardMatch[1].trim();
    // Remove surrounding quotes
    if ((filename.startsWith('"') && filename.endsWith('"')) ||
        (filename.startsWith("'") && filename.endsWith("'"))) {
      filename = filename.slice(1, -1);
    }
    return filename;
  }
  
  return null;
}

/**
 * Parses Content-Type header to extract MIME type and extension hint.
 */
export function parseContentType(contentType?: string): { mimeType: string; extension?: string } | null {
  if (!contentType) return null;
  
  const mimeType = contentType.split(";")[0].trim().toLowerCase();
  
  // Map common MIME types to extensions
  const mimeToExt: Record<string, string> = {
    "application/pdf": ".pdf",
    "text/csv": ".csv",
    "text/plain": ".txt",
    "application/vnd.ms-excel": ".xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
    "application/zip": ".zip",
    "application/octet-stream": ".bin",
  };
  
  return {
    mimeType,
    extension: mimeToExt[mimeType] || "",
  };
}

/**
 * Generates a filename from Content-Disposition and Content-Type headers.
 * Falls back to a default if neither provides a usable filename.
 */
export function getDownloadFilename(
  contentDisposition?: string,
  contentType?: string,
  defaultName = "download"
): string {
  // Try Content-Disposition first
  const cdFilename = parseContentDisposition(contentDisposition);
  if (cdFilename) return cdFilename;
  
  // Try to derive from Content-Type
  const ctInfo = parseContentType(contentType);
  if (ctInfo?.extension) {
    return `${defaultName}${ctInfo.extension}`;
  }
  
  // Default fallback
  return defaultName;
}

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
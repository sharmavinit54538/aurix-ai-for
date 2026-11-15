/**
 * Download filename & content-type parsing helpers for binary payroll exports.
 * Supports both header-record style `(headers, fallback)` and explicit
 * `(contentDisposition, contentType, fallback)` arguments.
 */

const MIME_TO_EXT: Record<string, string> = {
  "application/pdf": "pdf",
  "text/csv": "csv",
  "application/csv": "csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.ms-excel": "xls",
  "application/json": "json",
  "text/plain": "txt",
  "application/zip": "zip",
};

function sanitizeFilename(raw: string, fallback: string): string {
  // Strip control chars (< 32), path segments, and quotes
  const withoutControl = Array.from(raw)
    .filter((ch) => ch.charCodeAt(0) >= 32)
    .join("");
  const cleaned = withoutControl
    .replace(/["']/g, "")
    .split(/[\\/]/)
    .pop()
    ?.trim();

  if (!cleaned || cleaned === "." || cleaned === "..") {
    return fallback;
  }
  return cleaned.replace(/\.\.+/g, ".");
}

function extractFilenameFromDisposition(contentDisposition?: string | null): string | null {
  if (!contentDisposition) return null;

  // Prefer RFC 5987 filename*=utf-8''...
  const rfc5987 = contentDisposition.match(/filename\*\s*=\s*(?:[^']*'[^']*')([^;\r\n]+)/i);
  if (rfc5987?.[1]) {
    try {
      return decodeURIComponent(rfc5987[1].trim());
    } catch {
      return rfc5987[1].trim();
    }
  }

  // Fallback to standard filename="..." or filename=...
  const quoted = contentDisposition.match(/filename\s*=\s*"([^"]+)"/i);
  if (quoted?.[1]) return quoted[1].trim();

  const unquoted = contentDisposition.match(/filename\s*=\s*([^;\r\n]+)/i);
  if (unquoted?.[1]) return unquoted[1].trim();

  return null;
}

function coerceHeaderString(val: unknown): string | undefined {
  if (typeof val === "string") return val;
  if (Array.isArray(val)) {
    const first = val.find((item) => typeof item === "string");
    return typeof first === "string" ? first : undefined;
  }
  return undefined;
}

export function parseContentType(
  input?: unknown
): { mimeType: string; charset?: string } {
  let raw = "";
  const directStr = coerceHeaderString(input);
  if (directStr !== undefined) {
    raw = directStr;
  } else if (input && typeof input === "object") {
    const record = input as Record<string, unknown>;
    raw = coerceHeaderString(record["content-type"] ?? record["Content-Type"]) || "";
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return { mimeType: "application/octet-stream" };
  }

  const parts = trimmed.split(";").map((p) => p.trim());
  const mimeType = (parts[0] || "application/octet-stream").toLowerCase();
  const charsetPart = parts.find((p) => p.toLowerCase().startsWith("charset="));
  const charset = charsetPart ? charsetPart.split("=")[1]?.replace(/["']/g, "").trim() : undefined;

  return charset ? { mimeType, charset } : { mimeType };
}

export function getDownloadFilename(
  contentDispositionOrHeaders: unknown,
  contentTypeOrFallback?: unknown,
  explicitFallback?: string
): string {
  let contentDisposition: string | undefined;
  let contentType: unknown;
  let fallback = "download";

  if (explicitFallback !== undefined) {
    // 3-arg signature: (contentDisposition, contentType, fallback)
    const directDisp = coerceHeaderString(contentDispositionOrHeaders);
    if (directDisp !== undefined) {
      contentDisposition = directDisp;
    } else if (contentDispositionOrHeaders && typeof contentDispositionOrHeaders === "object") {
      const record = contentDispositionOrHeaders as Record<string, unknown>;
      contentDisposition = coerceHeaderString(
        record["content-disposition"] ?? record["Content-Disposition"]
      );
    }
    contentType = contentTypeOrFallback;
    fallback = explicitFallback;
  } else {
    // 2-arg signature: (headers | contentDisposition, fallback)
    const directDisp = coerceHeaderString(contentDispositionOrHeaders);
    if (directDisp !== undefined) {
      contentDisposition = directDisp;
    } else if (contentDispositionOrHeaders && typeof contentDispositionOrHeaders === "object") {
      const record = contentDispositionOrHeaders as Record<string, unknown>;
      contentDisposition = coerceHeaderString(
        record["content-disposition"] ?? record["Content-Disposition"]
      );
      contentType = coerceHeaderString(record["content-type"] ?? record["Content-Type"]);
    }
    fallback = coerceHeaderString(contentTypeOrFallback) || "download";
  }

  const extracted = extractFilenameFromDisposition(contentDisposition);
  if (extracted) {
    return sanitizeFilename(extracted, fallback);
  }

  const { mimeType } = parseContentType(contentType);
  const ext = MIME_TO_EXT[mimeType];
  if (ext && !fallback.includes(".")) {
    return `${fallback}.${ext}`;
  }
  return fallback;
}

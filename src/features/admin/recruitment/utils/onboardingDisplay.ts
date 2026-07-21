export function humanizeFieldKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatFieldValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) {
    if (value.length === 0) return "—";
    return value.map((item) => formatFieldValue(item)).join(", ");
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => `${humanizeFieldKey(k)}: ${formatFieldValue(v)}`)
      .join(" · ");
  }
  return String(value);
}

export function formatDateTime(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const STATUS_TONE: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-700 ring-amber-500/20 dark:text-amber-300",
  IN_PROGRESS: "bg-sky-500/15 text-sky-600 ring-sky-500/20 dark:text-sky-300",
  COMPLETED: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300",
  REJECTED: "bg-rose-500/15 text-rose-600 ring-rose-500/20 dark:text-rose-300",
  VERIFIED: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300",
};

export function statusBadgeClass(status: unknown): string {
  const key = normalizeScalarString(status).toUpperCase();
  return STATUS_TONE[key] ?? "bg-muted text-muted-foreground ring-border";
}

export function normalizeScalarString(value: unknown, fallback = ""): string {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed && trimmed !== "[object Object]" ? trimmed : fallback;
  }
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    for (const key of ["label", "name", "value", "status", "code", "state", "type"]) {
      const nested = obj[key];
      if (typeof nested === "string" && nested.trim()) return nested.trim();
    }
  }
  return fallback;
}

export function formatStatusLabel(status: unknown): string {
  const text = normalizeScalarString(status);
  if (!text) return "—";
  return text
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatCurrentStep(value?: string | number | null): string {
  if (value === null || value === undefined || value === "") return "—";
  const text = String(value).trim();
  if (!text || text === "—") return "—";
  if (/^\d+$/.test(text)) return `Step ${text}`;
  return text;
}

export function resolveMediaUrl(url?: string | null): string | null {
  if (!url?.trim()) return null;
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  const apiOrigin = ((import.meta.env.VITE_API_URL as string) || "http://localhost:8001")
    .trim()
    .replace(/\/$/, "");
  if (trimmed.startsWith("/")) return `${apiOrigin}${trimmed}`;
  return `${apiOrigin}/${trimmed}`;
}

export function isImageUrl(url?: string | null): boolean {
  if (!url) return false;
  return /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
}

export function getDocumentUrl(doc: {
  file_url?: string;
  download_url?: string;
  document_url?: string;
}): string | null {
  return resolveMediaUrl(doc.file_url ?? doc.download_url ?? doc.document_url ?? null);
}

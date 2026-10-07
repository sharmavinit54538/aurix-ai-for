import type { StatusTone, ValidationBadge, PayrollPreviewEmployee, PayrollStatus } from "../types/payrollPreview.types";

/**
 * Currency Formatter (INR)
 * Operates purely on backend numbers, never computes synthetic math.
 */
export function formatINR(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "—";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "—";
  }
  return new Intl.NumberFormat("en-IN").format(value);
}

/**
 * Status Tone Helper
 */
export function getStatusTone(status: string | null | undefined): StatusTone {
  if (!status) {
    return {
      tone: "muted",
      label: "Unknown",
      badgeClass: "border-border bg-muted/30 text-muted-foreground",
    };
  }
  const s = status.toLowerCase().trim();
  if (s === "completed" || s === "finalized" || s === "approved") {
    return {
      tone: "success",
      label: status,
      badgeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    };
  }
  if (s === "failed" || s.includes("fail") || s.includes("error")) {
    return {
      tone: "danger",
      label: status,
      badgeClass: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    };
  }
  if (s === "provision generated" || s.includes("provision")) {
    return {
      tone: "warning",
      label: status,
      badgeClass: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  }
  if (s === "under review" || s.includes("review")) {
    return {
      tone: "info",
      label: status,
      badgeClass: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
    };
  }
  return {
    tone: "muted",
    label: status,
    badgeClass: "border-border bg-muted/40 text-foreground",
  };
}

/**
 * Validation Badge Helper
 */
export function getValidationBadge(status?: string): ValidationBadge {
  const s = (status || "valid").toLowerCase();
  if (s === "error" || s === "invalid") {
    return {
      label: "Error",
      className: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    };
  }
  if (s === "warning" || s === "warn") {
    return {
      label: "Warning",
      className: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  }
  return {
    label: "Valid",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  };
}

/**
 * Extract unique departments from employee records
 */
export function extractDepartments(employees: PayrollPreviewEmployee[]): string[] {
  const depts = new Set<string>();
  employees.forEach((e) => {
    if (e.department) depts.add(e.department);
  });
  return Array.from(depts);
}

/**
 * Format date for display
 */
export function formatDate(val: string | null | undefined): string {
  if (!val) return "—";
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(val);
  }
}

/**
 * Compute pagination
 */
export function computePagination(
  items: unknown[],
  currentPage: number,
  pageSize: number
): { paginatedItems: unknown[]; totalPages: number } {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const start = (currentPage - 1) * pageSize;
  const paginatedItems = items.slice(start, start + pageSize);
  return { paginatedItems, totalPages };
}
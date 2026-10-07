import type { ValidationStatusBadge, PayrollValidationIssue } from "../types/payrollValidation.types";

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
 * Validation Status Badge Helper
 */
export function getValidationStatusBadge(status?: string | null): ValidationStatusBadge {
  if (!status) {
    return {
      label: "Pending",
      className: "border-border bg-muted/40 text-foreground",
    };
  }
  const s = status.toLowerCase().trim();
  if (s === "passed" || s === "completed" || s === "valid") {
    return {
      label: "Passed",
      className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    };
  }
  if (s === "failed" || s.includes("fail") || s === "error") {
    return {
      label: "Failed",
      className: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    };
  }
  if (s === "warning" || s.includes("warn")) {
    return {
      label: "Warning",
      className: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  }
  if (s === "validating" || s === "in_progress") {
    return {
      label: "Validating",
      className: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
    };
  }
  if (s === "not started" || s === "draft") {
    return {
      label: "Not Started",
      className: "border-border bg-muted/40 text-foreground",
    };
  }
  return {
    label: status,
    className: "border-border bg-muted/40 text-foreground",
  };
}

/**
 * Severity Badge Renderer
 */
export function renderSeverityBadge(severity?: string) {
  const s = (severity || "").toLowerCase().trim();
  if (s === "error" || s === "critical" || s === "fatal") {
    return {
      variant: "destructive",
      className: "text-[10px] font-semibold gap-1 uppercase",
      icon: "XCircle",
      label: s === "critical" ? "Critical" : "Error",
    };
  }
  if (s === "info") {
    return {
      variant: "outline",
      className: "text-[10px] font-medium border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400 gap-1 uppercase",
      icon: "Info",
      label: "Info",
    };
  }
  return {
    variant: "outline",
    className: "text-[10px] font-medium border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 gap-1 uppercase",
    icon: "AlertTriangle",
    label: severity ? severity : "Warning",
  };
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

/**
 * Extract unique categories from issues
 */
export function extractCategories(issues: PayrollValidationIssue[]): string[] {
  if (!issues) return [];
  const cats = new Set<string>();
  issues.forEach((iss) => {
    if (iss.category) cats.add(iss.category);
  });
  return Array.from(cats).sort();
}

/**
 * Extract unique departments from issues
 */
export function extractDepartments(issues: PayrollValidationIssue[]): string[] {
  if (!issues) return [];
  const depts = new Set<string>();
  issues.forEach((iss) => {
    if (iss.department) depts.add(iss.department);
  });
  return Array.from(depts).sort();
}

/**
 * Check if issues have blocking info
 */
export function hasBlockingInfo(issues: PayrollValidationIssue[] | undefined): boolean {
  return Boolean(
    issues?.some((iss) => iss.blocking !== undefined)
  );
}

/**
 * Check if issues have status info
 */
export function hasStatusInfo(issues: PayrollValidationIssue[] | undefined): boolean {
  return Boolean(issues?.some((iss) => iss.status || iss.resolved !== undefined));
}

/**
 * Filter issues based on search query and filters
 */
export function filterIssues(
  issues: PayrollValidationIssue[] | undefined,
  searchQuery: string,
  selectedSeverity: string,
  selectedCategory: string,
  selectedDepartment: string,
  selectedStatus: string,
  selectedBlocking: string,
  hasBlockingInfo: boolean
): PayrollValidationIssue[] {
  if (!issues) return [];
  return issues.filter((iss) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchEmpName = iss.employeeName?.toLowerCase().includes(q);
      const matchEmpId = iss.employeeId?.toLowerCase().includes(q);
      const matchMsg = iss.message?.toLowerCase().includes(q);
      const matchCat = iss.category?.toLowerCase().includes(q);
      const matchComp = iss.component?.toLowerCase().includes(q);
      const matchCode = iss.code?.toLowerCase().includes(q);
      const matchDept = iss.department?.toLowerCase().includes(q);
      if (
        !matchEmpName &&
        !matchEmpId &&
        !matchMsg &&
        !matchCat &&
        !matchComp &&
        !matchCode &&
        !matchDept
      ) {
        return false;
      }
    }

    // Severity filter
    if (selectedSeverity !== "all") {
      const s = (iss.severity || "warning").toLowerCase();
      if (selectedSeverity === "error") {
        if (s !== "error" && s !== "critical" && s !== "fatal") return false;
      } else if (selectedSeverity === "warning") {
        if (s !== "warning" && s !== "advisory") return false;
      } else if (selectedSeverity === "info") {
        if (s !== "info") return false;
      }
    }

    // Category filter
    if (selectedCategory !== "all") {
      if (iss.category !== selectedCategory) {
        return false;
      }
    }

    // Department filter
    if (selectedDepartment !== "all") {
      if (iss.department !== selectedDepartment) {
        return false;
      }
    }

    // Status filter
    if (selectedStatus !== "all") {
      const isResolved = Boolean(iss.resolved || iss.status === "resolved");
      if (selectedStatus === "resolved" && !isResolved) return false;
      if (selectedStatus === "open" && isResolved) return false;
    }

    // Blocking filter
    if (hasBlockingInfo && selectedBlocking !== "all") {
      const isBlocking = Boolean(iss.blocking);
      if (selectedBlocking === "blocking" && !isBlocking) return false;
      if (selectedBlocking === "non_blocking" && isBlocking) return false;
    }

    return true;
  };
}
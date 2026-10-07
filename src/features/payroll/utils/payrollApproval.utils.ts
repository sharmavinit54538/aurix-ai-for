import type { ApprovalStatusTone, ValidationBadge, PayrollReviewData } from "../types/payrollApproval.types";

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
 * Approval Status Tone Helper
 */
export function getApprovalStatusTone(status: string | null | undefined): {
  tone: "success" | "warning" | "danger" | "info" | "muted";
  label: string;
  badgeClass: string;
} {
  if (!status) {
    return {
      tone: "muted",
      label: "Unknown",
      badgeClass: "border-border bg-muted/30 text-muted-foreground",
    };
  }
  const s = status.toLowerCase().trim();
  if (s === "approved" || s === "completed") {
    return {
      tone: "success",
      label: "Approved",
      badgeClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    };
  }
  if (s === "rejected" || s.includes("reject") || s.includes("fail")) {
    return {
      tone: "danger",
      label: "Rejected",
      badgeClass: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    };
  }
  if (s === "under review" || s === "pending approval" || s.includes("review")) {
    return {
      tone: "info",
      label: status,
      badgeClass: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
    };
  }
  if (s === "provision generated" || s.includes("provision")) {
    return {
      tone: "warning",
      label: status,
      badgeClass: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  }
  if (s === "finalized" || s === "closed" || s === "locked") {
    return {
      tone: "muted",
      label: status,
      badgeClass: "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400",
    };
  }
  return {
    tone: "muted",
    label: status,
    badgeClass: "border-border bg-muted/40 text-foreground",
  };
}

export function getValidationBadge(status?: string | null): {
  label: string;
  className: string;
} {
  if (!status) {
    return {
      label: "Pending",
      className: "border-border bg-muted/40 text-muted-foreground",
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
  return {
    label: status,
    className: "border-border bg-muted/40 text-foreground",
  };
}

export function computeChecklistItems(
  reviewData: PayrollReviewData | null,
  isProcessing: boolean,
  hasBlockingErrors: boolean,
  validationBlockingCount: number,
  isFinalized: boolean
): Array<{
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}> {
  if (!reviewData) return [];

  const isCalcDone = !isProcessing && Boolean(reviewData.summary?.employeeCount);
  const isValDone = Boolean(reviewData.validation?.status);
  const isErrorsResolved = !hasBlockingErrors;
  const isStatutoryAvailable = Boolean(reviewData.summary?.totalDeductions != null);
  const isReadyForApproval = isCalcDone && isValDone && isErrorsResolved && !isFinalized;

  return [
    {
      id: "calc",
      title: "Provisional Calculation Completed",
      description: "Backend calculation engine has evaluated gross, allowances, and attendance.",
      completed: isCalcDone,
      required: true,
    },
    {
      id: "val",
      title: "Validation Cycle Executed",
      description: "Server audit rules ran against compliance, salary structures, and tax parameters.",
      completed: isValDone,
      required: true,
    },
    {
      id: "errors",
      title: "Blocking Validation Errors Resolved",
      description: hasBlockingErrors
        ? `${reviewData.validation?.blockingCount ?? 0} blocking error(s) must be addressed before approval sign-off.`
        : "Zero blocking errors reported by backend engine.",
      completed: isErrorsResolved,
      required: true,
    },
    {
      id: "statutory",
      title: "Statutory Deductions Available",
      description: "PF, ESI, Professional Tax, and TDS calculations are present in totals.",
      completed: isStatutoryAvailable,
      required: true,
    },
    {
      id: "readiness",
      title: "Governance Approval Eligibility",
      description: isReadyForApproval
        ? "All prerequisites satisfied. Authorized reviewer may execute sign-off."
        : "Prerequisites incomplete or blocked by validation errors.",
      completed: isReadyForApproval,
      required: true,
    },
  ];
}
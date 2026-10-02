/**
 * Single source of truth for semantic status badge classes across the application.
 */
export function statusBadgeClass(status?: string): string {
  switch ((status ?? "").toLowerCase().trim()) {
    case "approved":
    case "active":
    case "positive":
    case "success":
    case "completed":
    case "paid":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "pending":
    case "warning":
    case "warn":
    case "medium":
    case "in_progress":
    case "processing":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    case "rejected":
    case "failed":
    case "critical":
    case "crit":
    case "high":
    case "overdue":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "cancelled":
    case "inactive":
    case "low":
    case "info":
    case "draft":
    case "default":
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function trendTextClass(positive: boolean): string {
  return positive
    ? "text-emerald-600 dark:text-emerald-400"
    : "text-destructive";
}

/**
 * Shared category color dot mappings for the application.
 * Distinguishes categories ONLY by an 8px dot (h-2 w-2 rounded-full).
 */

export const LEAVE_TYPE_DOT: Record<string, string> = {
  sick: "bg-amber-500",
  "sick leave": "bg-amber-500",
  casual: "bg-emerald-500",
  "casual leave": "bg-emerald-500",
  vacation: "bg-primary",
  "vacation leave": "bg-primary",
};

export const getLeaveTypeDot = (type?: string): string =>
  LEAVE_TYPE_DOT[(type ?? "").toLowerCase().trim()] ?? "bg-muted-foreground";

export const PRIORITY_DOT: Record<string, string> = {
  urgent: "bg-destructive",
  high: "bg-destructive",
  medium: "bg-amber-500",
  low: "bg-muted-foreground",
};

export const getPriorityDot = (priority?: string): string =>
  PRIORITY_DOT[(priority ?? "").toLowerCase().trim()] ?? "bg-muted-foreground";

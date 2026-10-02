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

export const TONE_DOT: Record<string, string> = {
  crit: "bg-destructive",
  critical: "bg-destructive",
  high: "bg-destructive",
  warn: "bg-amber-500",
  warning: "bg-amber-500",
  medium: "bg-amber-500",
  ok: "bg-emerald-500",
  positive: "bg-emerald-500",
  success: "bg-emerald-500",
  low: "bg-muted-foreground",
  info: "bg-muted-foreground",
};

export const getToneDot = (tone?: string): string =>
  TONE_DOT[(tone ?? "").toLowerCase().trim()] ?? "bg-muted-foreground";

export const EVENT_TYPE_DOT: Record<string, string> = {
  meeting: "bg-primary",
  holiday: "bg-emerald-500",
  birthday: "bg-amber-500",
  interview: "bg-primary",
  payroll: "bg-emerald-500",
  event: "bg-muted-foreground",
};

export const getEventTypeDot = (type?: string): string =>
  EVENT_TYPE_DOT[(type ?? "").toLowerCase().trim()] ?? "bg-muted-foreground";


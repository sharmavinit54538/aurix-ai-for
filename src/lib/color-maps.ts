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

export const ASSET_TYPE_DOT: Record<string, string> = {
  laptop: "bg-primary",
  desktop: "bg-primary",
  monitor: "bg-primary",
  phone: "bg-primary",
  accessory: "bg-muted-foreground",
  vehicle: "bg-emerald-500",
  other: "bg-muted-foreground",
};

export const getAssetTypeDot = (type?: string): string =>
  ASSET_TYPE_DOT[(type ?? "").toLowerCase().trim()] ?? "bg-muted-foreground";

export const EXIT_STAGE_DOT: Record<string, string> = {
  requested: "bg-muted-foreground",
  "under-review": "bg-amber-500",
  approved: "bg-emerald-500",
  notice: "bg-primary",
  clearance: "bg-amber-500",
  settlement: "bg-amber-500",
  completed: "bg-emerald-500",
  cancelled: "bg-destructive",
  resignation: "bg-muted-foreground",
  settled: "bg-emerald-500",
};

export const getExitStageDot = (stage?: string): string =>
  EXIT_STAGE_DOT[(stage ?? "").toLowerCase().trim()] ?? "bg-muted-foreground";

export const TIMESHEET_STATUS_DOT: Record<string, string> = {
  approved: "bg-emerald-500",
  pending: "bg-amber-500",
  rejected: "bg-destructive",
  draft: "bg-muted-foreground",
};

export const getTimesheetStatusDot = (status?: string): string =>
  TIMESHEET_STATUS_DOT[(status ?? "").toLowerCase().trim()] ?? "bg-muted-foreground";

export const SHIFT_TYPE_DOT: Record<string, string> = {
  morning: "bg-primary",
  evening: "bg-amber-500",
  night: "bg-primary",
  "off day": "bg-muted-foreground",
  leave: "bg-destructive",
  holiday: "bg-emerald-500",
  training: "bg-primary",
  wfh: "bg-emerald-500",
  overtime: "bg-amber-500",
};

export const getShiftTypeDot = (shift?: string): string =>
  SHIFT_TYPE_DOT[(shift ?? "").toLowerCase().trim()] ?? "bg-muted-foreground";


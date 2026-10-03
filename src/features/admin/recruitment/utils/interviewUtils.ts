import type { Interview } from "../types";

export const userTimeZone =
  typeof Intl !== "undefined" && Intl.DateTimeFormat
    ? Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
    : "UTC";

export function formatLocalDateTime(isoString: string | null | undefined): string {
  if (!isoString) return "Not scheduled";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Not scheduled";
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(date);
  } catch {
    return "Not scheduled";
  }
}

export function formatLocalDate(isoString: string | null | undefined): string {
  if (!isoString) return "Not scheduled";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Not scheduled";
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return "Not scheduled";
  }
}

export function formatLocalTime(isoString: string | null | undefined): string {
  if (!isoString) return "";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(date);
  } catch {
    return "";
  }
}

export function isInterviewOverdue(iv: Interview): boolean {
  if (iv.isOverdue) return true;
  if (!iv.date) return false;
  const scheduledTime = new Date(iv.date).getTime();
  const statusUpper = (iv.status || "").toUpperCase();
  return (
    !isNaN(scheduledTime) &&
    scheduledTime < Date.now() &&
    (statusUpper === "SCHEDULED" || statusUpper === "SCHEDULE")
  );
}

export function buildIsoFromLocal(dateStr: string, timeStr: string): string {
  return new Date(`${dateStr}T${timeStr}`).toISOString();
}

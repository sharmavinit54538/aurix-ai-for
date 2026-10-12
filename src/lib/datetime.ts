import { addDays, parseISO, format as formatDateFns, isValid } from "date-fns";

export const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export type WeekDay = (typeof WEEK_DAYS)[number];

export function toLocalISODate(date = new Date(), timeZone?: string): string {
  const tz = timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(date);
}

export function todayInTz(timeZone?: string): string {
  return toLocalISODate(new Date(), timeZone);
}

export function addDaysISO(dateISO: string, days: number): string {
  const parsed = parseISO(dateISO);
  if (!isValid(parsed)) {
    throw new Error(`Invalid ISO date: ${dateISO}`);
  }
  return formatDateFns(addDays(parsed, days), "yyyy-MM-dd");
}

export function parseHHmm(str: string): { h: number; m: number } | null {
  if (!str || typeof str !== "string") return null;
  const match = str.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return { h, m };
}

export function minutesBetween(startHHmm: string, endHHmm: string): number {
  const start = parseHHmm(startHHmm);
  const end = parseHHmm(endHHmm);
  if (!start || !end) return 0;
  let minutes = (end.h - start.h) * 60 + (end.m - start.m);
  if (minutes <= 0) {
    minutes += 24 * 60;
  }
  return minutes;
}

export function isOvernight(startHHmm: string, endHHmm: string): boolean {
  const start = parseHHmm(startHHmm);
  const end = parseHHmm(endHHmm);
  if (!start || !end) return false;
  const startMin = start.h * 60 + start.m;
  const endMin = end.h * 60 + end.m;
  return endMin <= startMin;
}

export function formatHHmmTo12h(hhmm: string): string {
  const parsed = parseHHmm(hhmm);
  if (!parsed) return hhmm;
  let { h, m } = parsed;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function formatInstant(
  iso: string,
  timeZone?: string,
  options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }
): string {
  const tz = timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  try {
    const date = new Date(iso);
    if (!isValid(date)) return "—";
    return new Intl.DateTimeFormat("en-US", { ...options, timeZone: tz }).format(date);
  } catch {
    return "—";
  }
}

export function weekdayShort(dateISO: string): string {
  const [year, month, day] = dateISO.split("-").map(Number);
  if (!year || !month || !day) return "—";
  const d = new Date(Date.UTC(year, month - 1, day));
  if (!isValid(d)) return "—";
  const idx = d.getUTCDay();
  return WEEK_DAYS[idx] ?? "—";
}

export function parseDateISO(dateISO: string): Date | null {
  const [year, month, day] = dateISO.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatDateLocal(dateISO: string, timeZone?: string): string {
  const tz = timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
  const parsed = parseDateISO(dateISO);
  if (!parsed) return "—";
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsed);
}

export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}
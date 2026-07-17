import type { Stage } from "../types";

export const CHART_COLORS = [
  "oklch(0.65 0.22 285)",
  "oklch(0.7 0.18 200)",
  "oklch(0.74 0.16 140)",
  "oklch(0.75 0.18 60)",
  "oklch(0.68 0.2 25)",
  "oklch(0.62 0.18 320)",
] as const;

export const SHORTLISTED_STAGES: Stage[] = ["assessment", "interview", "technical", "hr"];

export const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

export const HIRING_TREND_MONTHS = 6;

export const RECENT_ACTIVITY_LIMIT = 8;

export const CHART_TOOLTIP_STYLE = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
} as const;

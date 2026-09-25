/** Display formatting for Super Admin data. Missing values render as an em dash. */

export const MISSING_VALUE = "—";

const countFormatter = new Intl.NumberFormat("en-IN");

export function formatCount(value: number | null | undefined): string {
  return typeof value === "number" && Number.isFinite(value) ? countFormatter.format(value) : MISSING_VALUE;
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return MISSING_VALUE;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return MISSING_VALUE;
  return date.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return MISSING_VALUE;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return MISSING_VALUE;
  return date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

export function formatTime(iso: string | null | undefined): string {
  if (!iso) return MISSING_VALUE;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return MISSING_VALUE;
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

const relativeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["week", 7 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
];

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfLocalDay(time: number): number {
  const date = new Date(time);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/** Relative time ("5 minutes ago") computed from a real timestamp. */
export function formatRelativeTime(iso: string | null | undefined, now: number = Date.now()): string {
  if (!iso) return MISSING_VALUE;
  const time = Date.parse(iso);
  if (Number.isNaN(time)) return MISSING_VALUE;
  const diff = time - now;
  // Within a week, count calendar days so "yesterday" always means the previous calendar date.
  if (Math.abs(diff) >= DAY_MS && Math.abs(diff) < 7 * DAY_MS) {
    const calendarDays = Math.round((startOfLocalDay(time) - startOfLocalDay(now)) / DAY_MS);
    return relativeFormatter.format(calendarDays, "day");
  }
  for (const [unit, size] of RELATIVE_UNITS) {
    if (Math.abs(diff) >= size) {
      return relativeFormatter.format(Math.round(diff / size), unit);
    }
  }
  return "just now";
}

export function formatMilliseconds(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return MISSING_VALUE;
  return value < 10 ? `${value.toFixed(1)} ms` : `${Math.round(value)} ms`;
}

/** Human labels for the role values defined by the backend `RoleEnum`. */
const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  hr_admin: "HR Admin",
  admin: "Admin",
  company_admin: "Company Admin",
  hr_manager: "HR Manager",
  manager: "Manager",
  employee: "Employee",
  intern: "Intern",
  it_admin: "IT Admin",
  executive: "Executive",
  ceo: "CEO",
  cto: "CTO",
  cfo: "CFO",
  coo: "COO",
  cmo: "CMO",
  clo: "CLO",
  ciso: "CISO",
  cio: "CIO",
};

export function formatRoleLabel(role: string | null | undefined): string {
  if (!role) return MISSING_VALUE;
  const key = role.trim().toLowerCase();
  return ROLE_LABELS[key] ?? key.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Role filter options — every value accepted by the backend `role` query parameter. */
export const ROLE_FILTER_GROUPS: { label: string; roles: string[] }[] = [
  { label: "Platform", roles: ["super_admin"] },
  { label: "HR administration", roles: ["hr_admin", "admin", "company_admin", "hr_manager"] },
  { label: "Leadership", roles: ["executive", "ceo", "cto", "cfo", "coo", "cmo", "clo", "ciso", "cio"] },
  { label: "Teams", roles: ["manager", "employee", "intern"] },
  { label: "IT", roles: ["it_admin"] },
];

/** "ACTIVE_USER_UPDATE" → "Active user update" for readable audit actions. */
export function formatActionLabel(action: string | null | undefined): string {
  if (!action) return MISSING_VALUE;
  const words = action.trim().replace(/[_-]+/g, " ").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function shortId(id: string | null | undefined): string {
  if (!id) return MISSING_VALUE;
  return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

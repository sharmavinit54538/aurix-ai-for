/**
 * Pure aggregation helpers for the Super Admin analytics screen.
 *
 * Inputs are records returned by the real `/api/v1/super-admin/users` and `/organizations`
 * endpoints; outputs are counts derived from their timestamps and attributes. Nothing here
 * produces values that are not backed by a record.
 */
import type { PlatformOrganization, PlatformUser } from "./types";
import { formatRoleLabel } from "./formatters";

export interface MonthlyCount {
  /** `YYYY-MM` in local time. */
  key: string;
  label: string;
  count: number;
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/** Counts timestamps per calendar month for the `months` most recent months (inclusive of the current one). */
export function buildMonthlyCounts(
  timestamps: (string | null)[],
  months: number,
  now: Date = new Date(),
): MonthlyCount[] {
  const buckets: MonthlyCount[] = [];
  const index = new Map<string, MonthlyCount>();
  for (let offset = months - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const bucket: MonthlyCount = {
      key: monthKey(date),
      label: date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
      count: 0,
    };
    buckets.push(bucket);
    index.set(bucket.key, bucket);
  }

  for (const timestamp of timestamps) {
    if (!timestamp) continue;
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) continue;
    const bucket = index.get(monthKey(date));
    if (bucket) bucket.count += 1;
  }
  return buckets;
}

export interface LabeledCount {
  label: string;
  count: number;
}

export const SIGN_IN_BUCKETS = ["Last 24 hours", "1–7 days ago", "8–30 days ago", "Over 30 days ago", "Never signed in"] as const;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Mutually exclusive sign-in recency buckets derived from each user's last successful sign-in. */
export function bucketSignInRecency(users: PlatformUser[], now: number = Date.now()): LabeledCount[] {
  const counts = new Map<string, number>(SIGN_IN_BUCKETS.map((label) => [label, 0]));
  for (const user of users) {
    const time = user.lastLoginAt ? Date.parse(user.lastLoginAt) : Number.NaN;
    let label: (typeof SIGN_IN_BUCKETS)[number];
    if (Number.isNaN(time)) label = "Never signed in";
    else if (now - time <= DAY_MS) label = "Last 24 hours";
    else if (now - time <= 7 * DAY_MS) label = "1–7 days ago";
    else if (now - time <= 30 * DAY_MS) label = "8–30 days ago";
    else label = "Over 30 days ago";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return SIGN_IN_BUCKETS.map((label) => ({ label, count: counts.get(label) ?? 0 }));
}

/** Users whose last successful sign-in happened within the given number of days. */
export function countSignedInWithin(users: PlatformUser[], days: number, now: number = Date.now()): number {
  return users.filter((user) => {
    if (!user.lastLoginAt) return false;
    const time = Date.parse(user.lastLoginAt);
    return !Number.isNaN(time) && now - time <= days * DAY_MS;
  }).length;
}

/** Exact distribution by stored role value (each user counted once). */
export function countUsersByRole(users: PlatformUser[]): LabeledCount[] {
  const counts = new Map<string, number>();
  for (const user of users) {
    const label = user.role ? formatRoleLabel(user.role) : "Role not set";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

/** Tenants grouped by the plan stored on their subscription/company profile. */
export function countOrganizationsByPlan(organizations: PlatformOrganization[]): LabeledCount[] {
  const counts = new Map<string, number>();
  for (const org of organizations) {
    const label = org.plan ?? "No plan recorded";
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export interface OrganizationSize {
  id: string;
  name: string;
  employees: number;
  users: number | null;
}

/** Largest tenants by active employee records (tenants with no reported size are skipped). */
export function topOrganizationsByWorkforce(organizations: PlatformOrganization[], limit: number): OrganizationSize[] {
  const sized: OrganizationSize[] = [];
  for (const org of organizations) {
    if (typeof org.employeeCount === "number" && org.employeeCount > 0) {
      sized.push({ id: org.id, name: org.name ?? org.id, employees: org.employeeCount, users: org.userCount });
    }
  }
  return sized
    .sort((a, b) => b.employees - a.employees || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export function sumCounts(items: { count: number }[]): number {
  return items.reduce((total, item) => total + item.count, 0);
}

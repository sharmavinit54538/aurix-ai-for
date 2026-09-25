import { describe, it, expect } from "vitest";
import {
  buildMonthlyCounts,
  bucketSignInRecency,
  countOrganizationsByPlan,
  countSignedInWithin,
  countUsersByRole,
  topOrganizationsByWorkforce,
} from "../analytics";
import type { PlatformOrganization, PlatformUser } from "../types";

function user(overrides: Partial<PlatformUser>): PlatformUser {
  return {
    id: overrides.id ?? "u",
    name: null,
    email: null,
    phone: null,
    role: null,
    organizationId: null,
    organizationName: null,
    isActive: true,
    isVerified: null,
    createdAt: null,
    lastLoginAt: null,
    ...overrides,
  };
}

function org(overrides: Partial<PlatformOrganization>): PlatformOrganization {
  return {
    id: overrides.id ?? "o",
    name: null,
    domain: null,
    plan: null,
    status: null,
    userCount: null,
    employeeCount: null,
    primaryHrAdmin: null,
    createdAt: null,
    ...overrides,
  };
}

describe("Super Admin analytics aggregation", () => {
  const now = new Date(2026, 8, 25, 12, 0, 0); // 25 Sep 2026, local time

  it("counts records per calendar month and ignores records outside the window", () => {
    const counts = buildMonthlyCounts(
      [
        new Date(2026, 8, 1).toISOString(),
        new Date(2026, 8, 20).toISOString(),
        new Date(2026, 7, 15).toISOString(),
        new Date(2025, 0, 1).toISOString(), // outside a 3-month window
        null,
        "not-a-date",
      ],
      3,
      now,
    );
    expect(counts.map((c) => [c.key, c.count])).toEqual([
      ["2026-07", 0],
      ["2026-08", 1],
      ["2026-09", 2],
    ]);
  });

  it("places every user in exactly one sign-in recency bucket", () => {
    const at = (hoursAgo: number) => new Date(now.getTime() - hoursAgo * 60 * 60 * 1000).toISOString();
    const users = [
      user({ id: "a", lastLoginAt: at(2) }),
      user({ id: "b", lastLoginAt: at(24 * 3) }),
      user({ id: "c", lastLoginAt: at(24 * 20) }),
      user({ id: "d", lastLoginAt: at(24 * 90) }),
      user({ id: "e", lastLoginAt: null }),
    ];
    const buckets = bucketSignInRecency(users, now.getTime());
    expect(buckets.map((b) => b.count)).toEqual([1, 1, 1, 1, 1]);
    expect(buckets.reduce((sum, b) => sum + b.count, 0)).toBe(users.length);
    expect(countSignedInWithin(users, 7, now.getTime())).toBe(2);
    expect(countSignedInWithin(users, 30, now.getTime())).toBe(3);
  });

  it("groups users by their stored role value and organizations by recorded plan", () => {
    expect(countUsersByRole([user({ role: "employee" }), user({ role: "employee" }), user({ role: "cto" }), user({ role: null })])).toEqual([
      { label: "Employee", count: 2 },
      { label: "CTO", count: 1 },
      { label: "Role not set", count: 1 },
    ]);
    expect(countOrganizationsByPlan([org({ plan: "Growth" }), org({ plan: null }), org({ plan: "Growth" })])).toEqual([
      { label: "Growth", count: 2 },
      { label: "No plan recorded", count: 1 },
    ]);
  });

  it("ranks organizations by active employees and skips tenants without a reported size", () => {
    const ranked = topOrganizationsByWorkforce(
      [
        org({ id: "1", name: "Small", employeeCount: 3, userCount: 4 }),
        org({ id: "2", name: "Large", employeeCount: 40, userCount: null }),
        org({ id: "3", name: "Unknown", employeeCount: null }),
        org({ id: "4", name: "Empty", employeeCount: 0 }),
      ],
      5,
    );
    expect(ranked).toEqual([
      { id: "2", name: "Large", employees: 40, users: null },
      { id: "1", name: "Small", employees: 3, users: 4 },
    ]);
  });
});

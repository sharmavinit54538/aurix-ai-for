import { describe, it, expect } from "vitest";
import { formatCount, formatRelativeTime, formatRoleLabel, MISSING_VALUE } from "../formatters";

describe("Super Admin formatters", () => {
  const now = new Date(2026, 8, 25, 10, 45, 0).getTime(); // 25 Sep 2026 10:45 local

  it("uses calendar days within a week so labels match day groupings", () => {
    const at = (y: number, m: number, d: number, h: number, min = 0) => new Date(y, m, d, h, min).toISOString();
    expect(formatRelativeTime(at(2026, 8, 25, 10, 43), now)).toBe("2 minutes ago");
    expect(formatRelativeTime(at(2026, 8, 24, 14, 43), now)).toBe("20 hours ago");
    expect(formatRelativeTime(at(2026, 8, 24, 9, 43), now)).toBe("yesterday");
    // 35 hours ago falls on the 23rd — two calendar days back, not "yesterday".
    expect(formatRelativeTime(at(2026, 8, 23, 23, 43), now)).toBe("2 days ago");
    expect(formatRelativeTime(at(2026, 7, 25, 10, 45), now)).toBe("last month");
  });

  it("renders missing values as an em dash instead of a number", () => {
    expect(formatCount(null)).toBe(MISSING_VALUE);
    expect(formatCount(undefined)).toBe(MISSING_VALUE);
    expect(formatCount(0)).toBe("0");
    expect(formatCount(123456)).toBe("1,23,456");
    expect(formatRelativeTime(null, now)).toBe(MISSING_VALUE);
  });

  it("labels backend role values", () => {
    expect(formatRoleLabel("hr_admin")).toBe("HR Admin");
    expect(formatRoleLabel("ciso")).toBe("CISO");
    expect(formatRoleLabel("custom_role")).toBe("Custom Role");
    expect(formatRoleLabel(null)).toBe(MISSING_VALUE);
  });
});

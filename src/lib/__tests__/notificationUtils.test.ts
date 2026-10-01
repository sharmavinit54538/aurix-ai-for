import { describe, it, expect } from "vitest";
import {
  isInternalSafeLink,
  formatUnreadBadge,
  formatRelativeTime,
} from "../notification-utils";

describe("Notification Utilities", () => {
  describe("isInternalSafeLink", () => {
    it("accepts valid internal application paths", () => {
      expect(isInternalSafeLink("/dashboard")).toBe(true);
      expect(isInternalSafeLink("/dashboard/payroll")).toBe(true);
      expect(isInternalSafeLink("/dashboard/recruitment/interviews/123")).toBe(true);
      expect(isInternalSafeLink("/dashboard/notifications?tab=alerts")).toBe(true);
      expect(isInternalSafeLink("/settings")).toBe(true);
    });

    it("rejects protocol-relative links (//evil.com)", () => {
      expect(isInternalSafeLink("//evil.com")).toBe(false);
      expect(isInternalSafeLink("//phishing.site/dashboard")).toBe(false);
      expect(isInternalSafeLink("//localhost:3000")).toBe(false);
    });

    it("rejects backslash directory traversal and evasion links", () => {
      expect(isInternalSafeLink("/\\evil.com")).toBe(false);
      expect(isInternalSafeLink("/\\/evil.com")).toBe(false);
    });

    it("rejects full external URLs", () => {
      expect(isInternalSafeLink("https://evil.com/dashboard")).toBe(false);
      expect(isInternalSafeLink("http://attacker.com")).toBe(false);
      expect(isInternalSafeLink("ftp://files.example.com")).toBe(false);
      expect(isInternalSafeLink("javascript:alert(1)")).toBe(false);
    });

    it("rejects empty, null, and non-string inputs", () => {
      expect(isInternalSafeLink("")).toBe(false);
      expect(isInternalSafeLink(null)).toBe(false);
      expect(isInternalSafeLink(undefined)).toBe(false);
      expect(isInternalSafeLink("dashboard")).toBe(false); // missing leading slash
    });
  });

  describe("formatUnreadBadge (99+ cap)", () => {
    it("returns null when count is 0 or negative", () => {
      expect(formatUnreadBadge(0)).toBeNull();
      expect(formatUnreadBadge(-1)).toBeNull();
      expect(formatUnreadBadge(-10)).toBeNull();
    });

    it("returns exact count as string for 1 to 99", () => {
      expect(formatUnreadBadge(1)).toBe("1");
      expect(formatUnreadBadge(5)).toBe("5");
      expect(formatUnreadBadge(42)).toBe("42");
      expect(formatUnreadBadge(99)).toBe("99");
    });

    it("caps count at 99+ for values greater than 99", () => {
      expect(formatUnreadBadge(100)).toBe("99+");
      expect(formatUnreadBadge(150)).toBe("99+");
      expect(formatUnreadBadge(9999)).toBe("99+");
    });
  });

  describe("formatRelativeTime", () => {
    it("formats recent timestamps as 'just now'", () => {
      const now = new Date().toISOString();
      expect(formatRelativeTime(now)).toBe("just now");
    });

    it("formats minutes ago", () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      expect(formatRelativeTime(fiveMinutesAgo)).toBe("5m ago");
    });

    it("formats hours ago", () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 3600 * 1000).toISOString();
      expect(formatRelativeTime(threeHoursAgo)).toBe("3h ago");
    });

    it("formats yesterday", () => {
      const yesterday = new Date(Date.now() - 25 * 3600 * 1000).toISOString();
      expect(formatRelativeTime(yesterday)).toBe("yesterday");
    });

    it("handles invalid inputs gracefully without throwing", () => {
      expect(formatRelativeTime("invalid-date")).toBe("");
    });
  });
});

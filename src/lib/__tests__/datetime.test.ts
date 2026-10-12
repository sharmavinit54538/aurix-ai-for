import { describe, it, expect } from "vitest";
import {
  toLocalISODate,
  todayInTz,
  addDaysISO,
  parseHHmm,
  minutesBetween,
  isOvernight,
  formatHHmmTo12h,
  formatInstant,
  weekdayShort,
  WEEK_DAYS,
} from "../datetime";

describe("datetime utilities", () => {
  describe("toLocalISODate", () => {
    it("returns correct date for Asia/Kolkata at 20:00 UTC on Oct 12 2026", () => {
      const date = new Date("2026-10-12T20:00:00Z");
      expect(toLocalISODate(date, "Asia/Kolkata")).toBe("2026-10-13");
    });

    it("returns correct date for America/Los_Angeles at 20:00 UTC on Oct 12 2026", () => {
      const date = new Date("2026-10-12T20:00:00Z");
      expect(toLocalISODate(date, "America/Los_Angeles")).toBe("2026-10-12");
    });

    it("returns correct date for UTC", () => {
      const date = new Date("2026-10-12T20:00:00Z");
      expect(toLocalISODate(date, "UTC")).toBe("2026-10-12");
    });
  });

  describe("todayInTz", () => {
    it("returns a valid YYYY-MM-DD string", () => {
      const result = todayInTz("UTC");
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("addDaysISO", () => {
    it("adds days correctly", () => {
      expect(addDaysISO("2026-10-12", 1)).toBe("2026-10-13");
      expect(addDaysISO("2026-10-12", -1)).toBe("2026-10-11");
      expect(addDaysISO("2026-12-31", 1)).toBe("2027-01-01");
    });

    it("throws on invalid date", () => {
      expect(() => addDaysISO("invalid", 1)).toThrow();
    });
  });

  describe("parseHHmm", () => {
    it("parses valid 24h times", () => {
      expect(parseHHmm("09:00")).toEqual({ h: 9, m: 0 });
      expect(parseHHmm("23:59")).toEqual({ h: 23, m: 59 });
      expect(parseHHmm("00:00")).toEqual({ h: 0, m: 0 });
      expect(parseHHmm("12:30")).toEqual({ h: 12, m: 30 });
    });

    it("returns null for invalid times", () => {
      expect(parseHHmm("24:00")).toBeNull();
      expect(parseHHmm("09:60")).toBeNull();
      expect(parseHHmm("9:00")).toBeNull();
      expect(parseHHmm("09:0")).toBeNull();
      expect(parseHHmm("abc")).toBeNull();
      expect(parseHHmm("")).toBeNull();
    });
  });

  describe("minutesBetween", () => {
    it("calculates same-day duration", () => {
      expect(minutesBetween("09:00", "18:00")).toBe(540);
      expect(minutesBetween("22:00", "07:00")).toBe(540);
    });

    it("handles overnight shifts", () => {
      expect(minutesBetween("22:00", "07:00")).toBe(540);
      expect(minutesBetween("23:00", "01:00")).toBe(120);
    });

    it("returns 0 for invalid input", () => {
      expect(minutesBetween("invalid", "18:00")).toBe(0);
      expect(minutesBetween("09:00", "invalid")).toBe(0);
    });
  });

  describe("isOvernight", () => {
    it("returns true for overnight shifts", () => {
      expect(isOvernight("22:00", "07:00")).toBe(true);
      expect(isOvernight("23:00", "01:00")).toBe(true);
      expect(isOvernight("18:00", "06:00")).toBe(true);
    });

    it("returns false for same-day shifts", () => {
      expect(isOvernight("09:00", "18:00")).toBe(false);
      expect(isOvernight("10:00", "19:00")).toBe(false);
    });

    it("returns true when end equals start (24h shift)", () => {
      expect(isOvernight("09:00", "09:00")).toBe(true);
    });
  });

  describe("formatHHmmTo12h", () => {
    it("converts 24h to 12h format", () => {
      expect(formatHHmmTo12h("00:00")).toBe("12:00 AM");
      expect(formatHHmmTo12h("12:00")).toBe("12:00 PM");
      expect(formatHHmmTo12h("09:00")).toBe("09:00 AM");
      expect(formatHHmmTo12h("22:00")).toBe("10:00 PM");
      expect(formatHHmmTo12h("13:30")).toBe("01:30 PM");
    });

    it("returns original string for invalid input", () => {
      expect(formatHHmmTo12h("invalid")).toBe("invalid");
    });
  });

  describe("formatInstant", () => {
    it("formats ISO timestamp in given timezone", () => {
      const result = formatInstant("2026-10-12T20:00:00Z", "UTC");
      expect(result).not.toBe("—");
    });

    it("returns — for invalid ISO", () => {
      expect(formatInstant("invalid", "UTC")).toBe("—");
    });
  });

  describe("weekdayShort", () => {
    it("returns correct weekday abbreviation", () => {
      expect(weekdayShort("2026-10-12")).toBe("Mon");
      expect(weekdayShort("2026-10-13")).toBe("Tue");
      expect(weekdayShort("2026-10-17")).toBe("Sat");
      expect(weekdayShort("2026-10-18")).toBe("Sun");
    });

    it("returns — for invalid date", () => {
      expect(weekdayShort("invalid")).toBe("—");
    });
  });

  describe("WEEK_DAYS constant", () => {
    it("has correct order", () => {
      expect(WEEK_DAYS).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
    });
  });
});
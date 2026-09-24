import { describe, it, expect } from "vitest";
import { maskAccountNumber, maskIdentifier, formatINR, formatCount, formatDate } from "@/lib/format";

describe("Security, Data Masking & Format Standards", () => {
  describe("Bank Account Masking", () => {
    it("masks bank account numbers preserving only the last 4 digits", () => {
      expect(maskAccountNumber("50100234567891")).toBe("••••••••7891");
      expect(maskAccountNumber("1234567890")).toBe("••••••••7890");
    });

    it("handles short, empty, null, or undefined values gracefully", () => {
      expect(maskAccountNumber("1234")).toBe("1234");
      expect(maskAccountNumber("")).toBe("—");
      expect(maskAccountNumber(null)).toBe("—");
      expect(maskAccountNumber(undefined)).toBe("—");
    });
  });

  describe("National Identifier (PAN/Aadhaar) Masking", () => {
    it("masks identifier keeping first 2 and last 2 characters", () => {
      expect(maskIdentifier("ABCDE1234F")).toBe("AB••••••4F");
      expect(maskIdentifier("123456789012")).toBe("12••••••12");
    });

    it("handles short or empty values", () => {
      expect(maskIdentifier("AB")).toBe("AB");
      expect(maskIdentifier(null)).toBe("—");
    });
  });

  describe("Indian Numbering Formatting", () => {
    it("formats Indian currency format (INR) with 2 decimals", () => {
      expect(formatINR(0)).toMatch(/₹\s?0\.00/);
      expect(formatINR(1000)).toMatch(/₹\s?1,000\.00/);
      expect(formatINR(100000)).toMatch(/₹\s?1,00,000\.00/); // 1 Lakh
      expect(formatINR(10000000)).toMatch(/₹\s?1,00,00,000\.00/); // 1 Crore
    });

    it("formats counts with Indian comma grouping", () => {
      expect(formatCount(1420)).toBe("1,420");
      expect(formatCount(150000)).toBe("1,50,000");
      expect(formatCount(0)).toBe("0");
      expect(formatCount(null)).toBe("0");
    });

    it("formats dates into readable format", () => {
      const formatted = formatDate("2026-09-24T10:00:00Z");
      expect(formatted).toContain("2026");
      expect(formatted).toContain("Sep");
      expect(formatDate(null)).toBe("—");
    });
  });
});

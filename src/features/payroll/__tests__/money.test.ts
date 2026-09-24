import { describe, it, expect } from "vitest";
import {
  toPaise,
  toRupees,
  formatPaiseToINR,
  addPaise,
  subtractPaise,
  checkNetPaySanity,
  evaluateReconciliation,
} from "../utils/money";

describe("Payroll Money Utilities — Integer Paise Precision", () => {
  describe("Conversions to Paise", () => {
    it("handles 0 rupees correctly", () => {
      expect(toPaise(0)).toBe(0);
      expect(toPaise("0")).toBe(0);
      expect(toPaise("0.00")).toBe(0);
      expect(toPaise(null)).toBe(0);
      expect(toPaise(undefined)).toBe(0);
    });

    it("handles 2 decimal places precision without floating point inaccuracies", () => {
      // 0.1 + 0.2 in JS float is 0.30000000000000004
      expect(toPaise(0.1 + 0.2)).toBe(30);
      expect(toPaise("1450.75")).toBe(145075);
      expect(toPaise(1450.75)).toBe(145075);
    });

    it("handles negative amounts", () => {
      expect(toPaise(-500)).toBe(-50000);
      expect(toPaise("-1250.50")).toBe(-125050);
    });

    it("handles large Lakh values", () => {
      // 5 Lakh = 5,00,000 INR = 50,000,000 paise
      expect(toPaise("5,00,000.00")).toBe(50000000);
      expect(toPaise(500000)).toBe(50000000);
    });

    it("handles large Crore values", () => {
      // 10 Crore = 10,00,00,000 INR = 10,000,000,000 paise (100 million rupees * 100 paise)
      expect(toPaise("10,00,00,000.00")).toBe(10000000000);
      expect(toPaise(100000000)).toBe(10000000000);
    });
  });

  describe("Conversions from Paise to Rupees", () => {
    it("converts integer paise back to rupees", () => {
      expect(toRupees(0)).toBe(0);
      expect(toRupees(100)).toBe(1);
      expect(toRupees(145075)).toBe(1450.75);
      expect(toRupees(50000000)).toBe(500000);
    });
  });

  describe("Addition and Subtraction of Paise", () => {
    it("adds multiple paise values accurately", () => {
      expect(addPaise(10000, 20000, 30000)).toBe(60000);
      expect(addPaise(100, null, 250, undefined)).toBe(350);
    });

    it("subtracts paise accurately", () => {
      expect(subtractPaise(10000, 3500)).toBe(6500);
      expect(subtractPaise(5000, 5000)).toBe(0);
      expect(subtractPaise(3000, 5000)).toBe(-2000);
    });
  });

  describe("Net Pay Sanity Checks", () => {
    it("flags zero net pay", () => {
      const sanity = checkNetPaySanity(0);
      expect(sanity.isZero).toBe(true);
      expect(sanity.isNegative).toBe(false);
      expect(sanity.isValid).toBe(false);
    });

    it("flags negative net pay", () => {
      const sanity = checkNetPaySanity(-150000);
      expect(sanity.isZero).toBe(false);
      expect(sanity.isNegative).toBe(true);
      expect(sanity.isValid).toBe(false);
    });

    it("approves valid positive net pay", () => {
      const sanity = checkNetPaySanity(8500000);
      expect(sanity.isZero).toBe(false);
      expect(sanity.isNegative).toBe(false);
      expect(sanity.isValid).toBe(true);
    });
  });

  describe("Reconciliation Formula Verification", () => {
    it("confirms 100% matched reconciliation: expected == (paid + failed + held + processing)", () => {
      const expected = 10000000; // 1 Lakh in paise
      const paid = 8500000; // 85k
      const failed = 500000; // 5k
      const held = 1000000; // 10k
      const processing = 0;

      const rec = evaluateReconciliation(expected, paid, failed, held, processing);
      expect(rec.isReconciled).toBe(true);
      expect(rec.mismatchPaise).toBe(0);
      expect(rec.totalAccountedPaise).toBe(expected);
    });

    it("detects discrepancy when paise mismatch exists", () => {
      const expected = 10000000;
      const paid = 8000000;
      const failed = 500000;
      const held = 1000000;
      const processing = 0; // sum = 95k, missing 5k

      const rec = evaluateReconciliation(expected, paid, failed, held, processing);
      expect(rec.isReconciled).toBe(false);
      expect(rec.mismatchPaise).toBe(500000);
    });
  });

  describe("Currency Formatting", () => {
    it("formats paise into localized INR string", () => {
      expect(formatPaiseToINR(10000000)).toMatch(/₹\s?1,00,000\.00/);
      expect(formatPaiseToINR(0)).toMatch(/₹\s?0\.00/);
    });
  });
});

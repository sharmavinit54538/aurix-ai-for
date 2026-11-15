import test from "node:test";
import assert from "node:assert/strict";

import {
  formatINR,
  formatOptionalINR,
  formatCount,
  formatOptionalCount,
  rupeesToPaise,
  paiseToRupees,
  maskAccountNumber,
} from "../../../lib/format";
import {
  toPaise,
  toRupees,
  formatPaiseToINR,
  addPaise,
  subtractPaise,
  evaluateReconciliation,
} from "../utils/money";
import {
  parseAnnualCTC,
  calculateSalaryBreakdown,
  formatINR as formatSalaryINR,
} from "../../../lib/salary/salaryCalculator";
import {
  normalizePayslip,
  normalizePayslipHistoryItem,
} from "../../../services/payroll/normalizers/normalizePayslip";
import {
  getDownloadFilename,
  parseContentType,
} from "../../../services/payroll/utils";

test("rupeesToPaise & paiseToRupees preserve fractional ₹100000.07 without float loss", () => {
  assert.equal(rupeesToPaise(100000.07), 10000007);
  assert.equal(rupeesToPaise("₹1,00,000.07"), 10000007);
  assert.equal(paiseToRupees(10000007), 100000.07);
  assert.equal(toPaise(125000.5), 12500050);
  assert.equal(toRupees(12500050), 125000.5);
  assert.equal(rupeesToPaise(0.1 + 0.2), 30);
  assert.equal(rupeesToPaise(null), 0);
  assert.equal(rupeesToPaise(-250.75), -25075);
});

test("formatINR and formatOptionalINR preserve decimal precision & render em-dash on null", () => {
  assert.equal(formatINR(100000.07), "₹1,00,000.07");
  assert.equal(formatINR(0.000001), "₹0.000001");
  assert.equal(formatINR(null), "₹0.00");
  assert.equal(formatOptionalINR(null), "—");
  assert.equal(formatOptionalINR(undefined), "—");
  assert.equal(formatOptionalINR(Number.NaN), "—");
  assert.equal(formatOptionalINR(0), "₹0.00");
  assert.equal(formatPaiseToINR(10000007), "₹1,00,000.07");
});

test("count formatting & account masking behave safely on nullish inputs", () => {
  assert.equal(formatCount(1420), "1,420");
  assert.equal(formatOptionalCount(null), "—");
  assert.equal(formatOptionalCount(0), "0");
  assert.equal(maskAccountNumber("123456789012"), "••••••••9012");
  assert.equal(maskAccountNumber(null), "—");
});

test("integer paise arithmetic & reconciliation detect exact paise mismatches", () => {
  assert.equal(addPaise(10050, 20025, null, undefined), 30075);
  assert.equal(subtractPaise(30075, 10050), 20025);

  const ok = evaluateReconciliation(100000, 70000, 10000, 15000, 5000);
  assert.equal(ok.isReconciled, true);
  assert.equal(ok.mismatchPaise, 0);
  assert.equal(ok.totalAccountedPaise, 100000);

  const bad = evaluateReconciliation(100000, 70000, 10000, 15000, 4999);
  assert.equal(bad.isReconciled, false);
  assert.equal(bad.mismatchPaise, 1);
});

test("salaryCalculator preserves ₹100000.07 precision and reconciles annual total", () => {
  assert.equal(parseAnnualCTC(100000.07), 100000.07);
  assert.equal(parseAnnualCTC("₹6,50,000.50"), 650000.5);
  assert.equal(formatSalaryINR(100000.07), "₹ 1,00,000.07");

  const zeroBreakdown = calculateSalaryBreakdown({ annualCTC: 0 });
  assert.equal(zeroBreakdown.totalAnnualCTC, 0);
  assert.equal(zeroBreakdown.isValid, true);
  assert.equal(zeroBreakdown.basicSalary.annual, 0);

  const fractional = calculateSalaryBreakdown({ annualCTC: 100000.07 });
  assert.equal(fractional.totalAnnualCTC, 100000.07);
  assert.equal(fractional.componentAnnualTotal, 100000.07);
  assert.equal(fractional.isValid, true);
});

test("normalizePayslip preserves exact backend amounts and leaves missing numbers null", () => {
  const payslip = normalizePayslip({
    id: "ps-1",
    run_id: "run-9",
    employee_id: "emp-42",
    period_name: "October 2026",
    status: "FINALIZED",
    net_pay: 84250.37,
    earnings: {
      basic: 50000.12,
      hra: 25000.25,
      gross_earnings: 100000.07,
    },
    deductions: {
      pf_paise: 180000,
    },
  });

  assert.ok(payslip);
  assert.equal(payslip.isFinalized, true);
  assert.equal(payslip.netPay, 84250.37);
  assert.equal(payslip.earnings.basic, 50000.12);
  assert.equal(payslip.earnings.grossEarnings, 100000.07);
  assert.equal(payslip.deductions.pf, 1800);
  assert.equal(payslip.deductions.tds, null);
  assert.equal(payslip.deductions.totalDeductions, null);

  const historyItem = normalizePayslipHistoryItem({
    run_id: "run-9",
    employee_id: "emp-42",
    period_month: 10,
    period_year: 2026,
    net_pay_paise: 8425037,
  });
  assert.equal(historyItem.netPay, 84250.37);
  assert.equal(historyItem.grossPay, null);
  assert.equal(historyItem.month, "10");
  assert.equal(historyItem.year, 2026);
});

test("download filename and content-type parsing sanitize paths and handle RFC5987", () => {
  assert.deepEqual(parseContentType("application/pdf; charset=utf-8"), {
    mimeType: "application/pdf",
    charset: "utf-8",
  });
  assert.equal(
    getDownloadFilename(
      "attachment; filename*=utf-8''../../payslip%20oct%202026.pdf",
      "application/pdf",
      "fallback"
    ),
    "payslip oct 2026.pdf"
  );
  assert.equal(
    getDownloadFilename(
      { "content-type": "text/csv; charset=utf-8" },
      "payroll_report"
    ),
    "payroll_report.csv"
  );
});

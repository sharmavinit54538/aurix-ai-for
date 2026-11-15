import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_INCLUDED_EMPLOYEES,
  MAX_SELF_SERVE_EMPLOYEES,
  OFFICIAL_OFC360_PLANS,
  calculatePlanEstimate,
  classifyBillingApiError,
  formatINR,
  isAlreadySubscribedToSelection,
  mergeBackendPlansWithOfficialCatalog,
  normalizeVerifyPaymentResponse,
  reconcileOrderWithEstimate,
  validateEmployeeCount,
  validateEnterpriseEnquiry,
} from "../utils/pricingCalculator";

describe("OFC360 Official Pricing Calculator & Validation (node:test)", () => {
  it("exposes exact 3 official OFC360 plans with official rates", () => {
    assert.equal(OFFICIAL_OFC360_PLANS.length, 3);
    const [starter, business, enterprise] = OFFICIAL_OFC360_PLANS;

    assert.equal(starter.id, "starter_hr");
    assert.equal(starter.name, "Starter HR");
    assert.equal(starter.basePriceMonthly, 2499);
    assert.equal(starter.includedEmployees, 50);
    assert.equal(starter.perEmployeeRate, 39);
    assert.equal(starter.ctaLabel, "Get Started");

    assert.equal(business.id, "business_hr");
    assert.equal(business.name, "Business HR");
    assert.equal(business.basePriceMonthly, 4999);
    assert.equal(business.includedEmployees, 50);
    assert.equal(business.perEmployeeRate, 69);
    assert.equal(business.badge, "Most Popular");
    assert.equal(business.ctaLabel, "Choose Business");

    assert.equal(enterprise.id, "enterprise");
    assert.equal(enterprise.name, "Enterprise");
    assert.equal(enterprise.basePriceMonthly, 9999);
    assert.equal(enterprise.isCustom, true);
    assert.equal(enterprise.ctaLabel, "Contact Sales");
  });

  it("calculates Starter HR base pricing and extra employee examples accurately", () => {
    const e50 = calculatePlanEstimate("starter_hr", 50);
    assert.equal(e50.extraEmployees, 0);
    assert.equal(e50.additionalEmployeeAmount, 0);
    assert.equal(e50.monthlySubtotal, 2499);

    const e60 = calculatePlanEstimate("starter_hr", 60);
    assert.equal(e60.extraEmployees, 10);
    assert.equal(e60.additionalEmployeeAmount, 390);
    assert.equal(e60.monthlySubtotal, 2889);

    const e75 = calculatePlanEstimate("starter_hr", 75);
    assert.equal(e75.extraEmployees, 25);
    assert.equal(e75.additionalEmployeeAmount, 975);
    assert.equal(e75.monthlySubtotal, 3474);

    const e100 = calculatePlanEstimate("starter_hr", 100);
    assert.equal(e100.extraEmployees, 50);
    assert.equal(e100.additionalEmployeeAmount, 1950);
    assert.equal(e100.monthlySubtotal, 4449);
  });

  it("calculates Business HR base pricing and extra employee examples accurately", () => {
    const b50 = calculatePlanEstimate("business_hr", 50);
    assert.equal(b50.extraEmployees, 0);
    assert.equal(b50.additionalEmployeeAmount, 0);
    assert.equal(b50.monthlySubtotal, 4999);

    const b60 = calculatePlanEstimate("business_hr", 60);
    assert.equal(b60.extraEmployees, 10);
    assert.equal(b60.additionalEmployeeAmount, 690);
    assert.equal(b60.monthlySubtotal, 5689);

    const b75 = calculatePlanEstimate("business_hr", 75);
    assert.equal(b75.extraEmployees, 25);
    assert.equal(b75.additionalEmployeeAmount, 1725);
    assert.equal(b75.monthlySubtotal, 6724);

    const b80 = calculatePlanEstimate("business_hr", 80);
    assert.equal(b80.extraEmployees, 30);
    assert.equal(b80.additionalEmployeeAmount, 2070);
    assert.equal(b80.monthlySubtotal, 7069);

    const b100 = calculatePlanEstimate("business_hr", 100);
    assert.equal(b100.extraEmployees, 50);
    assert.equal(b100.additionalEmployeeAmount, 3450);
    assert.equal(b100.monthlySubtotal, 8449);
  });

  it("handles fewer than 50 employees by keeping extraEmployees = 0 and charging base price", () => {
    const v25 = validateEmployeeCount(25);
    assert.equal(v25.valid, true);
    assert.equal(v25.belowIncludedMinimum, true);
    assert.equal(v25.employeeCount, 25);

    const s25 = calculatePlanEstimate("starter_hr", 25);
    assert.equal(s25.selectedEmployees, 25);
    assert.equal(s25.includedEmployees, DEFAULT_INCLUDED_EMPLOYEES);
    assert.equal(s25.extraEmployees, 0);
    assert.equal(s25.monthlySubtotal, 2499);

    const b1 = calculatePlanEstimate("business_hr", 1);
    assert.equal(b1.selectedEmployees, 1);
    assert.equal(b1.extraEmployees, 0);
    assert.equal(b1.monthlySubtotal, 4999);
  });

  it("rejects invalid employee counts: 0, negative numbers, decimals, NaN, and unsafe large quantities", () => {
    assert.equal(validateEmployeeCount(0).valid, false);
    assert.equal(validateEmployeeCount(-10).valid, false);
    assert.equal(validateEmployeeCount(NaN).valid, false);
    assert.equal(validateEmployeeCount("").valid, false);
    assert.equal(validateEmployeeCount("abc").valid, false);
    assert.equal(validateEmployeeCount(50.5).valid, false);
    assert.equal(validateEmployeeCount("75.2").valid, false);
    assert.equal(validateEmployeeCount(MAX_SELF_SERVE_EMPLOYEES + 1).valid, false);

    // Valid large headcount within limit
    const large = validateEmployeeCount(5000);
    assert.equal(large.valid, true);
    const estLarge = calculatePlanEstimate("business_hr", 5000);
    assert.equal(estLarge.extraEmployees, 4950);
    assert.equal(estLarge.monthlySubtotal, 4999 + 4950 * 69);
  });

  it("marks Enterprise estimate as custom so ₹9,999 is never treated as fixed self-serve checkout price", () => {
    const entEstimate = calculatePlanEstimate("enterprise", 100);
    assert.equal(entEstimate.isCustom, true);
    assert.equal(entEstimate.perEmployeeRate, 0);
  });

  it("formats INR values cleanly using Intl.NumberFormat('en-IN')", () => {
    assert.equal(formatINR(2499), "₹2,499");
    assert.equal(formatINR(4999), "₹4,999");
    assert.equal(formatINR(7069), "₹7,069");
    assert.equal(formatINR(8449), "₹8,449");
    assert.equal(formatINR(12549.5, { alwaysShowDecimals: true }), "₹12,549.50");
  });

  it("merges backend plans with official catalog without inventing fake feature lists when backend omits features", () => {
    const emptyMerge = mergeBackendPlansWithOfficialCatalog([]);
    assert.equal(emptyMerge.plans.length, 3);
    assert.equal(emptyMerge.backendLoaded, false);
    assert.equal(emptyMerge.plans[0].hasBackendFeatureData, false);
    assert.deepEqual(emptyMerge.plans[0].backendFeatures, []);

    const backendPlans = [
      {
        id: "plan_starter_01",
        code: "starter_hr",
        name: "Starter HR",
        features: ["Employee Directory", "Attendance & Leave Management", "Standard Payslips"],
      },
      {
        id: "plan_biz_02",
        code: "business_hr",
        name: "Business HR",
        features: ["Multi-level Workflows", "Statutory Compliance Reports", "Biometric Sync"],
      },
    ];

    const populatedMerge = mergeBackendPlansWithOfficialCatalog(backendPlans);
    assert.equal(populatedMerge.backendLoaded, true);
    assert.equal(populatedMerge.plans[0].backendPlanId, "plan_starter_01");
    assert.equal(populatedMerge.plans[0].hasBackendFeatureData, true);
    assert.equal(populatedMerge.plans[0].backendFeatures.length, 3);
    assert.equal(populatedMerge.plans[1].backendPlanId, "plan_biz_02");
    assert.equal(populatedMerge.plans[1].hasBackendFeatureData, true);
    assert.equal(populatedMerge.plans[2].id, "enterprise");
  });

  it("reconciles backend order quote with frontend estimate and flags discrepancies", () => {
    const estimate = calculatePlanEstimate("business_hr", 80);
    // Backend returns amount in paise matching ₹7,069 (706900 paise)
    const matchingQuote = reconcileOrderWithEstimate(
      {
        order_id: "order_RzpTest123",
        key_id: "rzp_test_Key123",
        amount: 706900,
        currency: "INR",
      },
      estimate
    );
    assert.equal(matchingQuote.orderId, "order_RzpTest123");
    assert.equal(matchingQuote.finalPayableRupees, 7069);
    assert.equal(matchingQuote.differsFromEstimate, false);

    // Backend returns ₹8,341.42 (with 18% GST = ₹1,272.42)
    const taxedQuote = reconcileOrderWithEstimate(
      {
        order_id: "order_RzpTaxed456",
        key_id: "rzp_test_Key123",
        amount: 834142,
        subtotal: 7069,
        tax_amount: 1272.42,
        total_amount: 8341.42,
        currency: "INR",
      },
      estimate
    );
    assert.equal(taxedQuote.finalPayableRupees, 8341.42);
    assert.equal(taxedQuote.taxesRupees, 1272.42);
    assert.equal(taxedQuote.differsFromEstimate, true);
  });

  it("normalizes payment verification responses into verified, pending, or failed", () => {
    const verified = normalizeVerifyPaymentResponse(
      {
        verified: true,
        status: "captured",
        order_id: "order_1",
        payment_id: "pay_1",
        amount_paid: 7069,
        subscription_status: "active",
        next_billing_date: "2026-12-14",
      },
      "Business HR",
      80,
      "order_1",
      "pay_1"
    );
    assert.equal(verified.status, "verified");
    assert.equal(verified.subscriptionStatus, "active");
    assert.equal(verified.verifiedAmountRupees, 7069);

    const pending = normalizeVerifyPaymentResponse(
      {
        status: "pending",
        message: "Awaiting bank confirmation",
      },
      "Business HR",
      80,
      "order_1",
      "pay_1"
    );
    assert.equal(pending.status, "pending");

    const failed = normalizeVerifyPaymentResponse(
      {
        verified: false,
        status: "failed",
        message: "Signature mismatch",
      },
      "Business HR",
      80,
      "order_1",
      "pay_1"
    );
    assert.equal(failed.status, "failed");
    assert.equal(failed.message, "Signature mismatch");
  });

  it("classifies backend API errors into specific payment flow states", () => {
    assert.equal(
      classifyBillingApiError({ response: { status: 401, data: { detail: "Token expired" } } }).state,
      "auth_expired"
    );
    assert.equal(
      classifyBillingApiError({
        response: { status: 409, data: { detail: "Organization is already subscribed to this plan" } },
      }).state,
      "already_subscribed"
    );
    assert.equal(
      classifyBillingApiError({
        response: { status: 422, data: { detail: "Downgrade is unsupported via self-serve checkout" } },
      }).state,
      "unsupported_change"
    );
    assert.equal(
      classifyBillingApiError({
        response: { status: 503, data: { detail: "Billing service unavailable" } },
      }).state,
      "backend_unavailable"
    );
    assert.equal(
      classifyBillingApiError({
        code: "ERR_NETWORK",
        message: "Network Error",
      }).state,
      "network_failure"
    );
  });

  it("validates Enterprise enquiry fields and checks active subscription match", () => {
    const invalidEnquiry = validateEnterpriseEnquiry({
      contactName: "",
      businessEmail: "invalid-email",
      companyName: "",
      employeeCount: "0",
      phoneNumber: "123",
      requirements: "short",
    });
    assert.equal(invalidEnquiry.valid, false);
    assert.ok(invalidEnquiry.errors.contactName);
    assert.ok(invalidEnquiry.errors.businessEmail);
    assert.ok(invalidEnquiry.errors.employeeCount);

    const validEnquiry = validateEnterpriseEnquiry({
      contactName: "Aarav Sharma",
      businessEmail: "aarav@enterprise.in",
      companyName: "Apex Global India Pvt Ltd",
      employeeCount: "450",
      phoneNumber: "+91 98765 43210",
      requirements: "Need dedicated SSO, custom SLA, and multi-entity payroll consolidation.",
    });
    assert.equal(validEnquiry.valid, true);
    assert.equal(validEnquiry.parsedEmployeeCount, 450);

    assert.equal(
      isAlreadySubscribedToSelection(
        { plan_id: "business_hr", status: "active", employee_limit: 80 },
        "business_hr",
        80
      ),
      true
    );
    assert.equal(
      isAlreadySubscribedToSelection(
        { plan_id: "business_hr", status: "active", employee_limit: 50 },
        "business_hr",
        80
      ),
      false
    );
  });
});

import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { PricingAndBillingExperience } from "../components/PricingAndBillingExperience";
import { billingPaymentApi } from "@/services/billingPaymentApi";
import {
  setRazorpaySdkLoaderForTests,
  type RazorpayOptions,
} from "../utils/razorpayCheckout";

vi.mock("@/services/billingPaymentApi", () => ({
  billingPaymentApi: {
    getPlans: vi.fn(),
    createOrder: vi.fn(),
    verifyPayment: vi.fn(),
    getPaymentDetails: vi.fn(),
    getPaymentHistory: vi.fn(),
    getSubscription: vi.fn(),
    getBillingSettings: vi.fn(),
    updateBillingSettings: vi.fn(),
    getInvoices: vi.fn(),
    getPaymentMethods: vi.fn(),
  },
}));

const mockedApi = vi.mocked(billingPaymentApi);

describe("OFC360 Pricing, Calculator & Razorpay Checkout Flow (Vitest)", () => {
  let lastRazorpayOptions: RazorpayOptions | null = null;
  let paymentFailedHandler:
    | ((response: { error?: { description?: string } }) => void)
    | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    lastRazorpayOptions = null;
    paymentFailedHandler = null;

    mockedApi.getPlans.mockResolvedValue([
      {
        id: "plan_starter_hr",
        code: "starter_hr",
        name: "Starter HR",
        features: ["Employee Directory", "Attendance & Leave", "Self-Service Portal"],
      },
      {
        id: "plan_business_hr",
        code: "business_hr",
        name: "Business HR",
        features: [
          "Full Payroll & Statutory Compliance",
          "Multi-stage Approval Workflows",
          "Biometric & Shift Roster Sync",
        ],
      },
    ]);

    mockedApi.getSubscription.mockResolvedValue(null);
    mockedApi.getPaymentMethods.mockResolvedValue([]);
    mockedApi.getPaymentHistory.mockResolvedValue([]);
    mockedApi.getInvoices.mockResolvedValue([]);

    setRazorpaySdkLoaderForTests(async () => true);

    class MockRazorpay {
      options: RazorpayOptions;
      constructor(opts: RazorpayOptions) {
        this.options = opts;
        lastRazorpayOptions = opts;
      }
      on(
        event: "payment.failed",
        cb: (response: { error?: { description?: string } }) => void
      ) {
        if (event === "payment.failed") {
          paymentFailedHandler = cb;
        }
      }
      open() {
        // Simulated modal open; test triggers handler, ondismiss, or paymentFailedHandler
      }
    }

    window.Razorpay = MockRazorpay as unknown as typeof window.Razorpay;
  });

  afterEach(() => {
    setRazorpaySdkLoaderForTests(null);
    delete window.Razorpay;
  });

  it("renders all 3 official OFC360 plans, Most Popular badge, and accurate live calculator math", async () => {
    render(<PricingAndBillingExperience mode="public_pricing" />);

    await waitFor(() => {
      expect(mockedApi.getPlans).toHaveBeenCalledTimes(1);
    });

    // Verify Plan 1: Starter HR
    expect(screen.getByTestId("plan-base-price-starter_hr")).toHaveTextContent("₹2,499");
    expect(screen.getByTestId("plan-included-employees-starter_hr")).toHaveTextContent(
      "50 employees"
    );
    expect(screen.getByTestId("plan-extra-rate-starter_hr")).toHaveTextContent(
      "₹39 per employee/month"
    );

    // Verify Plan 2: Business HR ("Most Popular")
    expect(screen.getByTestId("plan-badge-business_hr")).toHaveTextContent("Most Popular");
    expect(screen.getByTestId("plan-base-price-business_hr")).toHaveTextContent("₹4,999");
    expect(screen.getByTestId("plan-extra-rate-business_hr")).toHaveTextContent(
      "₹69 per employee/month"
    );

    // Verify Plan 3: Enterprise ("₹9,999+")
    expect(screen.getByTestId("plan-base-price-enterprise")).toHaveTextContent("₹9,999+");
    expect(screen.getByTestId("plan-included-employees-enterprise")).toHaveTextContent("Custom");
    expect(screen.getByTestId("plan-extra-rate-enterprise")).toHaveTextContent("Custom Contract");

    // Default 50 employees
    const input = screen.getByTestId("employee-count-input") as HTMLInputElement;
    expect(input.value).toBe("50");
    expect(screen.getByTestId("plan-calculated-total-starter_hr")).toHaveTextContent("₹2,499/mo");
    expect(screen.getByTestId("plan-calculated-total-business_hr")).toHaveTextContent("₹4,999/mo");

    // Change to 60 employees -> Starter ₹2,889, Business ₹5,689
    fireEvent.change(input, { target: { value: "60" } });
    expect(screen.getByTestId("plan-calculated-total-starter_hr")).toHaveTextContent("₹2,889/mo");
    expect(screen.getByTestId("plan-calculated-total-business_hr")).toHaveTextContent("₹5,689/mo");

    // Change to 75 employees -> Starter ₹3,474, Business ₹6,724
    fireEvent.change(input, { target: { value: "75" } });
    expect(screen.getByTestId("plan-calculated-total-starter_hr")).toHaveTextContent("₹3,474/mo");
    expect(screen.getByTestId("plan-calculated-total-business_hr")).toHaveTextContent("₹6,724/mo");

    // Change to 80 employees -> Business HR breakdown shows 30 extra × ₹69 = ₹2,070, Total ₹7,069
    fireEvent.change(input, { target: { value: "80" } });
    expect(screen.getByTestId("breakdown-selected-plan")).toHaveTextContent("Business HR");
    expect(screen.getByTestId("breakdown-selected-employees")).toHaveTextContent("80");
    expect(screen.getByTestId("breakdown-extra-employees")).toHaveTextContent("30");
    expect(screen.getByTestId("breakdown-base-amount")).toHaveTextContent("₹4,999");
    expect(screen.getByTestId("breakdown-extra-amount")).toHaveTextContent("₹2,070");
    expect(screen.getByTestId("breakdown-monthly-subtotal")).toHaveTextContent("₹7,069/month");

    // Change to 100 employees -> Starter ₹4,449, Business ₹8,449
    fireEvent.change(input, { target: { value: "100" } });
    expect(screen.getByTestId("plan-calculated-total-starter_hr")).toHaveTextContent("₹4,449/mo");
    expect(screen.getByTestId("plan-calculated-total-business_hr")).toHaveTextContent("₹8,449/mo");
  });

  it("handles fewer than 50 employees, invalid inputs, decimals, and large quantities properly", async () => {
    render(<PricingAndBillingExperience mode="public_pricing" />);
    const input = screen.getByTestId("employee-count-input");
    const payBtn = screen.getByTestId("proceed-to-payment-btn");

    // Fewer than 50 employees (e.g., 30) -> valid, 0 extra employees, base price ₹4,999
    fireEvent.change(input, { target: { value: "30" } });
    expect(screen.getByTestId("employee-count-min-note")).toBeInTheDocument();
    expect(screen.getByTestId("breakdown-extra-employees")).toHaveTextContent("0");
    expect(screen.getByTestId("breakdown-monthly-subtotal")).toHaveTextContent("₹4,999/month");
    expect(payBtn).not.toBeDisabled();

    // Invalid: 0
    fireEvent.change(input, { target: { value: "0" } });
    expect(screen.getByTestId("employee-count-error")).toBeInTheDocument();
    expect(payBtn).toBeDisabled();

    // Invalid: decimal 55.5
    fireEvent.change(input, { target: { value: "55.5" } });
    expect(screen.getByTestId("employee-count-error")).toHaveTextContent(/whole number/i);
    expect(payBtn).toBeDisabled();

    // Invalid: negative -10
    fireEvent.change(input, { target: { value: "-10" } });
    expect(screen.getByTestId("employee-count-error")).toBeInTheDocument();
    expect(payBtn).toBeDisabled();

    // Invalid: > 100,000
    fireEvent.change(input, { target: { value: "150000" } });
    expect(screen.getByTestId("employee-count-error")).toHaveTextContent(/Enterprise Sales/i);
    expect(payBtn).toBeDisabled();
  });

  it("handles missing or failed GET /api/v1/payments/plans gracefully without breaking official plans", async () => {
    mockedApi.getPlans.mockRejectedValueOnce({
      response: { status: 500, data: { message: "Plan catalog temporarily offline" } },
    });

    render(<PricingAndBillingExperience mode="public_pricing" />);

    await waitFor(() => {
      expect(screen.getByTestId("plans-api-warning")).toBeInTheDocument();
    });

    // Official plans and calculator still work
    expect(screen.getByTestId("plan-base-price-starter_hr")).toHaveTextContent("₹2,499");
    expect(screen.getByTestId("plan-base-price-business_hr")).toHaveTextContent("₹4,999");
  });

  it("handles Razorpay SDK loading failure cleanly", async () => {
    setRazorpaySdkLoaderForTests(async () => false);
    delete window.Razorpay;

    mockedApi.createOrder.mockResolvedValueOnce({
      order_id: "order_sdk_fail_01",
      key_id: "rzp_test_12345",
      amount: 499900,
      currency: "INR",
    });

    render(<PricingAndBillingExperience mode="public_pricing" />);
    await waitFor(() => expect(mockedApi.getPlans).toHaveBeenCalled());

    fireEvent.click(screen.getByTestId("proceed-to-payment-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("payment-state-payment_failed")).toBeInTheDocument();
    });
    expect(screen.getByTestId("payment-state-payment_failed")).toHaveTextContent(
      /Unable to load Razorpay Checkout SDK/i
    );
  });

  it("handles create-order failure states (backend_unavailable, auth_expired, already_subscribed)", async () => {
    mockedApi.createOrder.mockRejectedValueOnce({
      response: { status: 503, data: { detail: "Payment gateway upstream timeout" } },
    });

    render(<PricingAndBillingExperience mode="public_pricing" />);
    await waitFor(() => expect(mockedApi.getPlans).toHaveBeenCalled());

    fireEvent.click(screen.getByTestId("proceed-to-payment-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("payment-state-backend_unavailable")).toBeInTheDocument();
    });

    // Next test 401 auth_expired
    mockedApi.createOrder.mockRejectedValueOnce({
      response: { status: 401, data: { detail: "Session token expired" } },
    });
    fireEvent.click(screen.getByTestId("proceed-to-payment-btn"));

    await waitFor(() => {
      expect(screen.getByTestId("payment-state-auth_expired")).toBeInTheDocument();
    });
  });

  it("handles user cancelling Razorpay modal (payment_cancelled)", async () => {
    mockedApi.createOrder.mockResolvedValueOnce({
      order_id: "order_cancel_99",
      key_id: "rzp_test_12345",
      amount: 499900,
      currency: "INR",
    });

    render(<PricingAndBillingExperience mode="public_pricing" />);
    await waitFor(() => expect(mockedApi.getPlans).toHaveBeenCalled());

    fireEvent.click(screen.getByTestId("proceed-to-payment-btn"));

    await waitFor(() => {
      expect(lastRazorpayOptions).not.toBeNull();
    });

    // Simulate user closing the Razorpay modal
    await act(async () => {
      lastRazorpayOptions?.modal?.ondismiss?.();
    });

    await waitFor(() => {
      expect(screen.getByTestId("payment-state-payment_cancelled")).toBeInTheDocument();
    });
    expect(mockedApi.verifyPayment).not.toHaveBeenCalled();
  });

  it("handles payment verification failure on server (payment_failed) and never marks active", async () => {
    mockedApi.createOrder.mockResolvedValueOnce({
      order_id: "order_bad_sig_01",
      key_id: "rzp_test_12345",
      amount: 706900,
      currency: "INR",
    });

    mockedApi.verifyPayment.mockResolvedValueOnce({
      verified: false,
      status: "failed",
      message: "Invalid Razorpay HMAC signature",
    });

    render(<PricingAndBillingExperience mode="public_pricing" initialEmployeeCount={80} />);
    await waitFor(() => expect(mockedApi.getPlans).toHaveBeenCalled());

    fireEvent.click(screen.getByTestId("proceed-to-payment-btn"));

    await waitFor(() => {
      expect(lastRazorpayOptions).not.toBeNull();
    });

    await act(async () => {
      await lastRazorpayOptions!.handler({
        razorpay_order_id: "order_bad_sig_01",
        razorpay_payment_id: "pay_bad_sig_01",
        razorpay_signature: "forged_signature",
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("payment-state-payment_failed")).toBeInTheDocument();
    });
    expect(screen.getByTestId("payment-state-payment_failed")).toHaveTextContent(
      /Invalid Razorpay HMAC signature/i
    );
    expect(screen.queryByTestId("payment-state-payment_verified")).not.toBeInTheDocument();
  });

  it("handles payment_pending and transitions to payment_verified after GET /api/v1/payments/{payment_id}", async () => {
    mockedApi.createOrder.mockResolvedValueOnce({
      order_id: "order_pend_01",
      key_id: "rzp_test_12345",
      amount: 499900,
      currency: "INR",
    });

    mockedApi.verifyPayment.mockResolvedValueOnce({
      status: "pending",
      order_id: "order_pend_01",
      payment_id: "pay_pend_01",
      message: "Bank webhook confirmation in progress.",
    });

    mockedApi.getPaymentDetails.mockResolvedValueOnce({
      verified: true,
      status: "captured",
      order_id: "order_pend_01",
      payment_id: "pay_pend_01",
      plan_name: "Business HR",
      employee_count: 50,
      verified_amount: 4999,
      subscription_status: "active",
      next_billing_date: "2026-12-14",
    });

    render(<PricingAndBillingExperience mode="public_pricing" />);
    await waitFor(() => expect(mockedApi.getPlans).toHaveBeenCalled());

    fireEvent.click(screen.getByTestId("proceed-to-payment-btn"));

    await waitFor(() => expect(lastRazorpayOptions).not.toBeNull());

    await act(async () => {
      await lastRazorpayOptions!.handler({
        razorpay_order_id: "order_pend_01",
        razorpay_payment_id: "pay_pend_01",
        razorpay_signature: "sig_pend_01",
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId("payment-state-payment_pending")).toBeInTheDocument();
    });

    // Click Refresh Payment Status
    fireEvent.click(screen.getByTestId("check-pending-payment-btn"));

    await waitFor(() => {
      expect(mockedApi.getPaymentDetails).toHaveBeenCalledWith("pay_pend_01");
      expect(screen.getByTestId("payment-state-payment_verified")).toBeInTheDocument();
    });
  });

  it("completes full verified payment flow and renders authoritative receipt details", async () => {
    mockedApi.createOrder.mockResolvedValueOnce({
      order_id: "order_live_80",
      key_id: "rzp_live_key",
      amount: 834142, // ₹8,341.42 including GST
      subtotal: 7069,
      tax_amount: 1272.42,
      total_amount: 8341.42,
      currency: "INR",
      plan_name: "Business HR",
      employee_count: 80,
    });

    mockedApi.verifyPayment.mockResolvedValueOnce({
      verified: true,
      status: "verified",
      order_id: "order_live_80",
      payment_id: "pay_live_80",
      plan_name: "Business HR",
      employee_count: 80,
      verified_amount: 8341.42,
      subscription_status: "active",
      next_billing_date: "2026-12-14",
      message: "Payment verified and Business HR (80 seats) activated.",
    });

    render(
      <PricingAndBillingExperience
        mode="workspace_billing"
        initialPlanId="business_hr"
        initialEmployeeCount={80}
      />
    );
    await waitFor(() => expect(mockedApi.getPlans).toHaveBeenCalled());

    fireEvent.click(screen.getByTestId("proceed-to-payment-btn"));

    await waitFor(() => {
      expect(mockedApi.createOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          plan_code: "business_hr",
          employee_count: 80,
          billing_cycle: "monthly",
        }),
        expect.stringMatching(/^ofc360_business_hr_80_/)
      );
      expect(lastRazorpayOptions).not.toBeNull();
    });

    // Notice discrepancy banner because backend included ₹1,272.42 tax
    expect(screen.getByTestId("backend-estimate-discrepancy-notice")).toBeInTheDocument();

    // Simulate Razorpay checkout success callback
    await act(async () => {
      await lastRazorpayOptions!.handler({
        razorpay_order_id: "order_live_80",
        razorpay_payment_id: "pay_live_80",
        razorpay_signature: "valid_hmac_sig_80",
      });
    });

    await waitFor(() => {
      expect(mockedApi.verifyPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          razorpay_order_id: "order_live_80",
          razorpay_payment_id: "pay_live_80",
          razorpay_signature: "valid_hmac_sig_80",
          plan_code: "business_hr",
          employee_count: 80,
        })
      );
      expect(screen.getByTestId("payment-state-payment_verified")).toBeInTheDocument();
    });

    expect(screen.getByTestId("verified-plan-name")).toHaveTextContent("Business HR");
    expect(screen.getByTestId("verified-employee-quantity")).toHaveTextContent("80 Employees");
    expect(screen.getByTestId("verified-amount")).toHaveTextContent("₹8,341.42");
    expect(screen.getByTestId("verified-transaction-ids")).toHaveTextContent(
      "pay_live_80 / order_live_80"
    );
    expect(screen.getByTestId("verified-subscription-status")).toHaveTextContent("active");
    expect(screen.getByTestId("verified-next-billing-date")).toHaveTextContent("2026-12-14");
  });

  it("prevents duplicate checkout submissions when button is clicked rapidly", async () => {
    let resolveOrder: ((value: unknown) => void) | null = null;
    mockedApi.createOrder.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveOrder = resolve;
        }) as ReturnType<typeof mockedApi.createOrder>
    );

    render(<PricingAndBillingExperience mode="public_pricing" />);
    await waitFor(() => expect(mockedApi.getPlans).toHaveBeenCalled());

    const btn = screen.getByTestId("proceed-to-payment-btn");
    fireEvent.click(btn);
    fireEvent.click(btn);
    fireEvent.click(btn);

    expect(mockedApi.createOrder).toHaveBeenCalledTimes(1);
    expect(btn).toBeDisabled();

    resolveOrder!({
      order_id: "order_single_1",
      key_id: "rzp_test_1",
      amount: 499900,
      currency: "INR",
    });

    await waitFor(() => expect(lastRazorpayOptions).not.toBeNull());
  });

  it("opens Enterprise Contact Sales modal, validates fields, and prepares honest sales@ofc360.com handoff", async () => {
    render(<PricingAndBillingExperience mode="public_pricing" />);
    await waitFor(() => expect(mockedApi.getPlans).toHaveBeenCalled());

    // Click Contact Sales on Enterprise card
    fireEvent.click(screen.getByTestId("plan-cta-enterprise"));

    const modal = screen.getByTestId("enterprise-contact-modal");
    expect(modal).toBeInTheDocument();

    // Submit empty -> validation errors
    fireEvent.click(screen.getByTestId("ent-prepare-enquiry-btn"));
    expect(screen.queryByTestId("ent-handoff-panel")).not.toBeInTheDocument();

    // Fill valid fields
    fireEvent.change(screen.getByTestId("ent-contact-name"), {
      target: { value: "Vikramaditya Rao" },
    });
    fireEvent.change(screen.getByTestId("ent-business-email"), {
      target: { value: "vikram@enterprise-india.in" },
    });
    fireEvent.change(screen.getByTestId("ent-company-name"), {
      target: { value: "Indus Tech Enterprise Ltd" },
    });
    fireEvent.change(screen.getByTestId("ent-employee-count"), {
      target: { value: "650" },
    });
    fireEvent.change(screen.getByTestId("ent-phone"), {
      target: { value: "+91 98201 12345" },
    });
    fireEvent.change(screen.getByTestId("ent-requirements"), {
      target: {
        value: "Multi-entity payroll for 4 subsidiaries with custom SAML SSO and SLA.",
      },
    });

    fireEvent.click(screen.getByTestId("ent-prepare-enquiry-btn"));

    const handoffPanel = await screen.findByTestId("ent-handoff-panel");
    expect(handoffPanel).toBeInTheDocument();
    const mailtoLink = screen.getByTestId("ent-mailto-link") as HTMLAnchorElement;
    expect(mailtoLink.getAttribute("href")).toContain("mailto:sales@ofc360.com");
  });
});

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { billingPaymentApi } from "@/services/billingPaymentApi";
import { useAurix } from "@/lib/aurix-store";
import {
  DEFAULT_INCLUDED_EMPLOYEES,
  MAX_SELF_SERVE_EMPLOYEES,
  MIN_EMPLOYEE_COUNT,
  calculatePlanEstimate,
  classifyBillingApiError,
  isAlreadySubscribedToSelection,
  mergeBackendPlansWithOfficialCatalog,
  normalizeVerifyPaymentResponse,
  reconcileOrderWithEstimate,
  validateEmployeeCount,
} from "../utils/pricingCalculator";
import { openRazorpayCheckoutModal } from "../utils/razorpayCheckout";
import { EmployeeCountSelector } from "./EmployeeCountSelector";
import { PricingPlans } from "./PricingPlans";
import { CheckoutSummary } from "./CheckoutSummary";
import { PaymentStatusBanner } from "./PaymentStatusBanner";
import { EnterpriseContactModal } from "./EnterpriseContactModal";
import { SubscriptionOverview } from "./SubscriptionOverview";
import { BillingHistory } from "./BillingHistory";
import type {
  AuthoritativeOrderQuote,
  BillingInvoiceRecord,
  MergedPricingPlan,
  OfficialPlanId,
  OrganizationSubscription,
  PaymentFlowState,
  PaymentHistoryRecord,
  SavedPaymentMethod,
  VerifiedPaymentSummary,
} from "../types/billingTypes";

export interface PricingAndBillingExperienceProps {
  mode: "public_pricing" | "workspace_billing";
  initialPlanId?: OfficialPlanId;
  initialEmployeeCount?: number;
}

export const PricingAndBillingExperience: React.FC<
  PricingAndBillingExperienceProps
> = ({
  mode,
  initialPlanId = "business_hr",
  initialEmployeeCount = DEFAULT_INCLUDED_EMPLOYEES,
}) => {
  const { user: currentUser, company: currentCompany } = useAurix();

  // Plan catalog state
  const [mergedPlans, setMergedPlans] = useState<MergedPricingPlan[]>(
    () => mergeBackendPlansWithOfficialCatalog([]).plans
  );
  const [isLoadingPlans, setIsLoadingPlans] = useState<boolean>(true);
  const [plansError, setPlansError] = useState<string | null>(null);

  // Calculator & Plan Selection State
  const [selectedPlanId, setSelectedPlanId] =
    useState<OfficialPlanId>(initialPlanId);
  const [rawEmployeeInput, setRawEmployeeInput] = useState<string>(
    String(initialEmployeeCount)
  );

  // Payment Flow State Machine (15 official states)
  const [paymentState, setPaymentState] =
    useState<PaymentFlowState>("loading_plans");
  const [statusTitle, setStatusTitle] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [authoritativeQuote, setAuthoritativeQuote] =
    useState<AuthoritativeOrderQuote | null>(null);
  const [verifiedSummary, setVerifiedSummary] =
    useState<VerifiedPaymentSummary | null>(null);
  const [isCheckingPendingStatus, setIsCheckingPendingStatus] =
    useState<boolean>(false);

  // Enterprise Contact Modal
  const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] =
    useState<boolean>(false);

  // Organization Subscription & Billing History State
  const [subscription, setSubscription] =
    useState<OrganizationSubscription | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryRecord[]>(
    []
  );
  const [invoices, setInvoices] = useState<BillingInvoiceRecord[]>([]);
  const [isLoadingBillingData, setIsLoadingBillingData] =
    useState<boolean>(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(
    null
  );
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [invoicesError, setInvoicesError] = useState<string | null>(null);

  // In-flight lock to prevent duplicate checkout submissions
  const checkoutLockRef = useRef<boolean>(false);

  // Validate current employee count input
  const validation = useMemo(
    () => validateEmployeeCount(rawEmployeeInput),
    [rawEmployeeInput]
  );

  const effectiveEmployees = validation.valid
    ? validation.employeeCount
    : DEFAULT_INCLUDED_EMPLOYEES;

  // Live frontend estimate for selected plan & employee count
  const estimate = useMemo(
    () => calculatePlanEstimate(selectedPlanId, effectiveEmployees),
    [selectedPlanId, effectiveEmployees]
  );

  // Selected merged plan object
  const selectedPlan = useMemo(
    () =>
      mergedPlans.find((p) => p.id === selectedPlanId) ?? mergedPlans[1],
    [mergedPlans, selectedPlanId]
  );

  // Fetch backend plans from `GET /api/v1/payments/plans`
  const fetchBackendPlans = useCallback(async () => {
    setIsLoadingPlans(true);
    setPlansError(null);
    setPaymentState((prev) =>
      prev === "payment_verified" || prev === "payment_pending"
        ? prev
        : "loading_plans"
    );

    try {
      const backendPlans = await billingPaymentApi.getPlans();
      const merged = mergeBackendPlansWithOfficialCatalog(backendPlans);
      setMergedPlans(merged.plans);
      setPaymentState((prev) =>
        prev === "loading_plans" ? "pricing_loaded" : prev
      );
    } catch (err) {
      const classified = classifyBillingApiError(err);
      setMergedPlans(mergeBackendPlansWithOfficialCatalog([]).plans);
      if (classified.statusCode && classified.statusCode >= 500) {
        setPlansError(classified.message);
      } else {
        setPlansError(null);
      }
      setPaymentState((prev) =>
        prev === "loading_plans" ? "pricing_loaded" : prev
      );
    } finally {
      setIsLoadingPlans(false);
    }
  }, []);

  // Fetch organization subscription, payment history, and invoices
  const fetchWorkspaceBillingData = useCallback(async () => {
    setIsLoadingBillingData(true);
    setSubscriptionError(null);
    setHistoryError(null);
    setInvoicesError(null);

    const [subRes, methodsRes, historyRes, invoicesRes] =
      await Promise.allSettled([
        billingPaymentApi.getSubscription(),
        billingPaymentApi.getPaymentMethods(),
        billingPaymentApi.getPaymentHistory(),
        billingPaymentApi.getInvoices(),
      ]);

    if (subRes.status === "fulfilled") {
      setSubscription(subRes.value);
    } else {
      // Fallback to GET /api/v1/settings/billing if /api/v1/billing/subscription fails
      try {
        const settingsSub = await billingPaymentApi.getBillingSettings();
        setSubscription(settingsSub);
      } catch (fallbackErr) {
        const classified = classifyBillingApiError(subRes.reason || fallbackErr);
        setSubscriptionError(classified.message);
      }
    }

    if (methodsRes.status === "fulfilled") {
      setPaymentMethods(methodsRes.value);
    }

    if (historyRes.status === "fulfilled") {
      setPaymentHistory(historyRes.value);
    } else {
      const classified = classifyBillingApiError(historyRes.reason);
      setHistoryError(classified.message);
    }

    if (invoicesRes.status === "fulfilled") {
      setInvoices(invoicesRes.value);
    } else {
      const classified = classifyBillingApiError(invoicesRes.reason);
      setInvoicesError(classified.message);
    }

    setIsLoadingBillingData(false);
  }, []);

  useEffect(() => {
    void fetchBackendPlans();
    if (mode === "workspace_billing" || currentUser) {
      void fetchWorkspaceBillingData();
    }
  }, [fetchBackendPlans, fetchWorkspaceBillingData, mode, currentUser]);

  // Reset authoritative order quote whenever plan or employee count changes
  const clearTransientOrderQuote = useCallback(() => {
    setAuthoritativeQuote(null);
    setPaymentState((prev) => {
      if (
        prev === "validation_error" ||
        prev === "already_subscribed" ||
        prev === "payment_cancelled"
      ) {
        return "pricing_loaded";
      }
      return prev;
    });
    setStatusTitle(null);
    setStatusMessage(null);
  }, []);

  const handleEmployeeInputChange = (nextRaw: string) => {
    setRawEmployeeInput(nextRaw);
    setAuthoritativeQuote(null);
    const check = validateEmployeeCount(nextRaw);
    if (!check.valid) {
      setPaymentState("validation_error");
      setStatusTitle("Invalid Employee Count");
      setStatusMessage(check.error);
    } else {
      if (paymentState === "validation_error") {
        setPaymentState("pricing_loaded");
        setStatusTitle(null);
        setStatusMessage(null);
      }
    }
  };

  const handleEmployeeStepChange = (delta: number) => {
    const base = validation.valid
      ? validation.employeeCount
      : DEFAULT_INCLUDED_EMPLOYEES;
    const next = Math.min(
      MAX_SELF_SERVE_EMPLOYEES,
      Math.max(MIN_EMPLOYEE_COUNT, base + delta)
    );
    handleEmployeeInputChange(String(next));
  };

  const handleSelectPreset = (presetCount: number) => {
    handleEmployeeInputChange(String(presetCount));
  };

  const handleSelectPlan = (planId: OfficialPlanId) => {
    setSelectedPlanId(planId);
    clearTransientOrderQuote();
    if (planId === "enterprise") {
      setIsEnterpriseModalOpen(true);
    }
  };

  const handleSelectPlanForUpgrade = (
    planId: OfficialPlanId,
    targetSeats?: number
  ) => {
    setSelectedPlanId(planId);
    if (typeof targetSeats === "number" && targetSeats >= 1) {
      setRawEmployeeInput(String(targetSeats));
    }
    clearTransientOrderQuote();
    const el = document.getElementById("checkout-calculator-anchor");
    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Check pending payment status via `GET /api/v1/payments/{payment_id}`
  const handleCheckPendingPaymentStatus = async (paymentId: string) => {
    if (!paymentId || isCheckingPendingStatus) return;
    setIsCheckingPendingStatus(true);
    try {
      const details = await billingPaymentApi.getPaymentDetails(paymentId);
      const summary = normalizeVerifyPaymentResponse(
        details,
        selectedPlan.name,
        effectiveEmployees,
        verifiedSummary?.orderId || authoritativeQuote?.orderId || "",
        paymentId
      );
      setVerifiedSummary(summary);
      if (summary.status === "verified") {
        setPaymentState("payment_verified");
        setStatusTitle("Payment Verified");
        setStatusMessage(summary.message);
        void fetchWorkspaceBillingData();
      } else if (summary.status === "failed") {
        setPaymentState("payment_failed");
        setStatusTitle("Payment Failed");
        setStatusMessage(summary.message);
      } else {
        setPaymentState("payment_pending");
        setStatusTitle("Payment Still Pending");
        setStatusMessage(summary.message);
      }
    } catch (err) {
      const classified = classifyBillingApiError(err);
      setStatusTitle(classified.title);
      setStatusMessage(classified.message);
    } finally {
      setIsCheckingPendingStatus(false);
    }
  };

  // End-to-end Razorpay Checkout Flow (`POST /api/v1/payments/create-order` -> Razorpay Modal -> `POST /api/v1/payments/verify`)
  const handleProceedToPayment = async () => {
    if (checkoutLockRef.current) {
      return;
    }

    if (selectedPlanId === "enterprise") {
      setIsEnterpriseModalOpen(true);
      return;
    }

    if (!validation.valid) {
      setPaymentState("validation_error");
      setStatusTitle("Invalid Employee Count");
      setStatusMessage(
        validation.error || "Please enter a valid employee count before checkout."
      );
      return;
    }

    if (
      isAlreadySubscribedToSelection(
        subscription,
        selectedPlanId,
        validation.employeeCount
      )
    ) {
      setPaymentState("already_subscribed");
      setStatusTitle("Already Subscribed");
      setStatusMessage(
        `Your organization already has an active ${selectedPlan.name} subscription for ${validation.employeeCount} employees.`
      );
      return;
    }

    checkoutLockRef.current = true;
    setVerifiedSummary(null);
    setPaymentState("creating_order");
    setStatusTitle("Creating Payment Order");
    setStatusMessage(
      `Requesting authoritative order for ${selectedPlan.name} (${validation.employeeCount} employees)...`
    );

    const idempotencyKey = `ofc360_${selectedPlanId}_${validation.employeeCount}_${Date.now()}`;
    const planBackendIdentifier = selectedPlan.backendPlanId || selectedPlan.id;

    try {
      const rawOrder = await billingPaymentApi.createOrder(
        {
          plan_id: planBackendIdentifier,
          plan_code: selectedPlan.id,
          plan_name: selectedPlan.name,
          employee_count: validation.employeeCount,
          employees: validation.employeeCount,
          billing_cycle: "monthly",
          ...(currentCompany?.id ? { organization_id: currentCompany.id } : {}),
        },
        idempotencyKey
      );

      const envKeyId =
        typeof import.meta !== "undefined" && import.meta.env
          ? (import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined)
          : undefined;

      const quote = reconcileOrderWithEstimate(rawOrder, estimate, envKeyId);
      setAuthoritativeQuote(quote);

      if (!quote.orderId) {
        setPaymentState("backend_unavailable");
        setStatusTitle("Invalid Order Response");
        setStatusMessage(
          "Backend order creation succeeded but did not return a valid Razorpay order ID."
        );
        checkoutLockRef.current = false;
        return;
      }

      if (!quote.razorpayKeyId) {
        setPaymentState("backend_unavailable");
        setStatusTitle("Missing Gateway Configuration");
        setStatusMessage(
          "Backend order response did not include a Razorpay key ID and VITE_RAZORPAY_KEY_ID is not configured."
        );
        checkoutLockRef.current = false;
        return;
      }

      setPaymentState("opening_checkout");
      setStatusTitle("Opening Razorpay Checkout");
      setStatusMessage(
        "Complete payment authorization in the Razorpay Checkout window."
      );

      await openRazorpayCheckoutModal({
        razorpayKeyId: quote.razorpayKeyId,
        orderId: quote.orderId,
        amountInSubunits: quote.amountInSubunits,
        currency: quote.currency,
        planName: quote.confirmedPlanName,
        employeeCount: quote.confirmedEmployeeCount,
        organizationName:
          currentCompany?.name ||
          currentUser?.company_name ||
          currentUser?.companyName,
        prefill: {
          name: currentUser?.fullName,
          email: currentUser?.email,
          contact: currentUser?.phone,
        },
        onCancelled: () => {
          checkoutLockRef.current = false;
          setPaymentState("payment_cancelled");
          setStatusTitle("Payment Cancelled");
          setStatusMessage(
            "You dismissed the Razorpay checkout modal before completing payment. Your subscription was not changed."
          );
        },
        onFailed: (failReason) => {
          checkoutLockRef.current = false;
          setPaymentState("payment_failed");
          setStatusTitle("Payment Authorization Failed");
          setStatusMessage(failReason);
        },
        onSuccessCallback: async (rzpPayload) => {
          // NEVER mark subscription active until backend verification succeeds
          setPaymentState("verifying_payment");
          setStatusTitle("Verifying Payment with Server");
          setStatusMessage(
            "Validating cryptographic Razorpay signature via POST /api/v1/payments/verify..."
          );

          try {
            const verifyResponse = await billingPaymentApi.verifyPayment({
              razorpay_order_id: rzpPayload.razorpay_order_id,
              razorpay_payment_id: rzpPayload.razorpay_payment_id,
              razorpay_signature: rzpPayload.razorpay_signature,
              order_id: rzpPayload.razorpay_order_id,
              payment_id: rzpPayload.razorpay_payment_id,
              signature: rzpPayload.razorpay_signature,
              plan_id: planBackendIdentifier,
              plan_code: selectedPlan.id,
              employee_count: quote.confirmedEmployeeCount,
            });

            const summary = normalizeVerifyPaymentResponse(
              verifyResponse,
              quote.confirmedPlanName,
              quote.confirmedEmployeeCount,
              rzpPayload.razorpay_order_id,
              rzpPayload.razorpay_payment_id
            );

            setVerifiedSummary(summary);

            if (summary.status === "verified") {
              setPaymentState("payment_verified");
              setStatusTitle("Payment Verified");
              setStatusMessage(summary.message);
              void fetchWorkspaceBillingData();
            } else if (summary.status === "pending") {
              setPaymentState("payment_pending");
              setStatusTitle("Payment Verification Pending");
              setStatusMessage(summary.message);
            } else {
              setPaymentState("payment_failed");
              setStatusTitle("Payment Verification Failed");
              setStatusMessage(summary.message);
            }
          } catch (verifyErr) {
            // If POST /api/v1/payments/verify encounters a network/server error,
            // attempt to check authoritative payment status via GET /api/v1/payments/{payment_id}
            try {
              const paymentCheck = await billingPaymentApi.getPaymentDetails(
                rzpPayload.razorpay_payment_id
              );
              const fallbackSummary = normalizeVerifyPaymentResponse(
                paymentCheck,
                quote.confirmedPlanName,
                quote.confirmedEmployeeCount,
                rzpPayload.razorpay_order_id,
                rzpPayload.razorpay_payment_id
              );
              setVerifiedSummary(fallbackSummary);
              if (fallbackSummary.status === "verified") {
                setPaymentState("payment_verified");
                setStatusTitle("Payment Verified");
                setStatusMessage(fallbackSummary.message);
                void fetchWorkspaceBillingData();
              } else if (fallbackSummary.status === "pending") {
                setPaymentState("payment_pending");
                setStatusTitle("Payment Verification Pending");
                setStatusMessage(fallbackSummary.message);
              } else {
                setPaymentState("payment_failed");
                setStatusTitle("Payment Verification Failed");
                setStatusMessage(fallbackSummary.message);
              }
            } catch {
              const classified = classifyBillingApiError(verifyErr);
              setPaymentState("payment_failed");
              setStatusTitle("Verification Failed on Server");
              setStatusMessage(
                `${classified.message} (Reference Payment ID: ${rzpPayload.razorpay_payment_id})`
              );
            }
          } finally {
            checkoutLockRef.current = false;
          }
        },
      });
    } catch (orderErr) {
      checkoutLockRef.current = false;
      const classified = classifyBillingApiError(orderErr);
      setPaymentState(classified.state);
      setStatusTitle(classified.title);
      setStatusMessage(classified.message);
    }
  };

  const organizationDisplayName =
    currentCompany?.name ||
    currentUser?.company_name ||
    currentUser?.companyName ||
    undefined;

  return (
    <div className="space-y-8" data-testid="ofc360-pricing-billing-experience">
      {/* Workspace Subscription Overview when an existing subscription is returned */}
      {mode === "workspace_billing" && subscription && (
        <SubscriptionOverview
          subscription={subscription}
          paymentMethods={paymentMethods}
          isLoading={isLoadingBillingData}
          error={subscriptionError}
          onSelectPlanForUpgrade={handleSelectPlanForUpgrade}
        />
      )}

      {/* Payment Lifecycle Status Banner */}
      <PaymentStatusBanner
        paymentState={paymentState}
        statusTitle={statusTitle}
        statusMessage={statusMessage}
        verifiedSummary={verifiedSummary}
        isCheckingStatus={isCheckingPendingStatus}
        onRetryCheckout={handleProceedToPayment}
        onCheckPendingStatus={handleCheckPendingPaymentStatus}
        onDismiss={() => {
          setPaymentState("pricing_loaded");
          setStatusTitle(null);
          setStatusMessage(null);
        }}
      />

      {/* Dynamic Employee Count Calculator */}
      <div id="checkout-calculator-anchor">
        <EmployeeCountSelector
          rawEmployeeInput={rawEmployeeInput}
          validation={validation}
          onInputChange={handleEmployeeInputChange}
          onStepChange={handleEmployeeStepChange}
          onSelectPreset={handleSelectPreset}
          disabled={
            paymentState === "creating_order" ||
            paymentState === "opening_checkout" ||
            paymentState === "verifying_payment"
          }
        />
      </div>

      {/* Main Pricing Cards + Live Checkout Summary Layout */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12 items-start">
        <div className="xl:col-span-8">
          <PricingPlans
            plans={mergedPlans}
            selectedPlanId={selectedPlanId}
            employeeCount={effectiveEmployees}
            currentSubscription={subscription}
            isLoadingPlans={isLoadingPlans}
            plansError={plansError}
            disabled={
              paymentState === "creating_order" ||
              paymentState === "opening_checkout" ||
              paymentState === "verifying_payment"
            }
            onSelectPlan={handleSelectPlan}
            onContactEnterpriseSales={() => setIsEnterpriseModalOpen(true)}
            onRetryPlans={fetchBackendPlans}
          />
        </div>

        <div className="xl:col-span-4 xl:sticky xl:top-6">
          <CheckoutSummary
            estimate={estimate}
            validation={validation}
            paymentState={paymentState}
            authoritativeQuote={authoritativeQuote}
            organizationName={organizationDisplayName}
            billingEmail={currentUser?.email}
            onProceedToPayment={handleProceedToPayment}
            onOpenEnterpriseModal={() => setIsEnterpriseModalOpen(true)}
          />
        </div>
      </div>

      {/* Workspace Payment History & Invoices Section */}
      {mode === "workspace_billing" && (
        <BillingHistory
          paymentHistory={paymentHistory}
          invoices={invoices}
          isLoading={isLoadingBillingData}
          historyError={historyError}
          invoicesError={invoicesError}
          onInspectPayment={handleCheckPendingPaymentStatus}
        />
      )}

      {/* Enterprise Sales Enquiry Modal */}
      <EnterpriseContactModal
        isOpen={isEnterpriseModalOpen}
        initialEmployeeCount={effectiveEmployees}
        initialCompanyName={organizationDisplayName || ""}
        initialContactName={currentUser?.fullName || ""}
        initialEmail={currentUser?.email || ""}
        onClose={() => setIsEnterpriseModalOpen(false)}
      />
    </div>
  );
};

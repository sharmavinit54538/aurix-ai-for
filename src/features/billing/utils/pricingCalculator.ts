import type {
  AuthoritativeOrderQuote,
  BackendPlanRecord,
  CreatePaymentOrderResponse,
  EmployeeCountValidationResult,
  EnterpriseEnquiryFormInput,
  EnterpriseEnquiryValidationResult,
  MergedPricingPlan,
  OfficialPlanId,
  OrganizationSubscription,
  PaymentFlowState,
  PricingBreakdownEstimate,
  PricingPlanDefinition,
  VerifiedPaymentSummary,
  VerifyPaymentResponse,
} from "../types/billingTypes";

export const DEFAULT_INCLUDED_EMPLOYEES = 50;
export const MIN_EMPLOYEE_COUNT = 1;
export const MAX_SELF_SERVE_EMPLOYEES = 100_000;

export const OFFICIAL_OFC360_PLANS: readonly PricingPlanDefinition[] = [
  {
    id: "starter_hr",
    name: "Starter HR",
    tagline: "Core workforce operations, attendance, and directory for growing teams.",
    basePriceMonthly: 2499,
    basePriceDisplay: "₹2,499",
    billingPeriod: "month",
    includedEmployees: 50,
    perEmployeeRate: 39,
    additionalEmployeeDisplay: "₹39 per employee/month",
    ctaLabel: "Get Started",
    isPopular: false,
    isCustom: false,
  },
  {
    id: "business_hr",
    name: "Business HR",
    tagline: "Full-cycle HR governance, payroll compliance, and multi-stage approvals.",
    basePriceMonthly: 4999,
    basePriceDisplay: "₹4,999",
    billingPeriod: "month",
    includedEmployees: 50,
    perEmployeeRate: 69,
    additionalEmployeeDisplay: "₹69 per employee/month",
    ctaLabel: "Choose Business",
    badge: "Most Popular",
    isPopular: true,
    isCustom: false,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Custom SLAs, multi-entity architecture, dedicated rollout, and custom contracts.",
    basePriceMonthly: 9999,
    basePriceDisplay: "₹9,999+",
    billingPeriod: "month",
    includedEmployees: "Custom",
    perEmployeeRate: null,
    additionalEmployeeDisplay: "Custom Contract",
    ctaLabel: "Contact Sales",
    isPopular: false,
    isCustom: true,
  },
] as const;

const inrWholeFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const inrPreciseFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatINR(amount: number | null | undefined, options?: { alwaysShowDecimals?: boolean }): string {
  if (amount === null || amount === undefined || !Number.isFinite(amount)) {
    return "—";
  }
  const hasFraction = Math.abs(amount - Math.trunc(amount)) > 0.0001;
  if (options?.alwaysShowDecimals || hasFraction) {
    return inrPreciseFormatter.format(amount);
  }
  return inrWholeFormatter.format(amount);
}

export function validateEmployeeCount(
  rawInput: string | number | null | undefined,
): EmployeeCountValidationResult {
  if (rawInput === null || rawInput === undefined) {
    return {
      valid: false,
      employeeCount: DEFAULT_INCLUDED_EMPLOYEES,
      error: "Please enter a valid employee count.",
      belowIncludedMinimum: false,
    };
  }

  const trimmed = typeof rawInput === "string" ? rawInput.trim() : String(rawInput);
  if (trimmed.length === 0) {
    return {
      valid: false,
      employeeCount: DEFAULT_INCLUDED_EMPLOYEES,
      error: "Employee count is required.",
      belowIncludedMinimum: false,
    };
  }

  // Reject decimal strings or scientific notation before numeric coercion
  if (typeof rawInput === "string" && !/^-?\d+$/.test(trimmed)) {
    const asNumber = Number(trimmed);
    if (Number.isFinite(asNumber) && !Number.isInteger(asNumber)) {
      return {
        valid: false,
        employeeCount: DEFAULT_INCLUDED_EMPLOYEES,
        error: "Employee count must be a whole number (decimals are not allowed).",
        belowIncludedMinimum: false,
      };
    }
    return {
      valid: false,
      employeeCount: DEFAULT_INCLUDED_EMPLOYEES,
      error: "Enter a valid numeric employee count.",
      belowIncludedMinimum: false,
    };
  }

  const parsed = typeof rawInput === "number" ? rawInput : Number(trimmed);

  if (!Number.isFinite(parsed) || Number.isNaN(parsed)) {
    return {
      valid: false,
      employeeCount: DEFAULT_INCLUDED_EMPLOYEES,
      error: "Enter a valid numeric employee count.",
      belowIncludedMinimum: false,
    };
  }

  if (!Number.isInteger(parsed)) {
    return {
      valid: false,
      employeeCount: DEFAULT_INCLUDED_EMPLOYEES,
      error: "Employee count must be a whole number (decimals are not allowed).",
      belowIncludedMinimum: false,
    };
  }

  if (parsed < MIN_EMPLOYEE_COUNT) {
    return {
      valid: false,
      employeeCount: DEFAULT_INCLUDED_EMPLOYEES,
      error: "Employee count must be at least 1 employee.",
      belowIncludedMinimum: false,
    };
  }

  if (!Number.isSafeInteger(parsed) || parsed > MAX_SELF_SERVE_EMPLOYEES) {
    return {
      valid: false,
      employeeCount: MAX_SELF_SERVE_EMPLOYEES,
      error: `For organizations above ${MAX_SELF_SERVE_EMPLOYEES.toLocaleString("en-IN")} employees, please contact Enterprise Sales.`,
      belowIncludedMinimum: false,
    };
  }

  return {
    valid: true,
    employeeCount: parsed,
    error: null,
    belowIncludedMinimum: parsed < DEFAULT_INCLUDED_EMPLOYEES,
  };
}

export function calculatePlanEstimate(
  planId: OfficialPlanId,
  rawEmployeeCount: number,
): PricingBreakdownEstimate {
  const plan =
    OFFICIAL_OFC360_PLANS.find((p) => p.id === planId) ?? OFFICIAL_OFC360_PLANS[1];

  const validation = validateEmployeeCount(rawEmployeeCount);
  const safeCount = validation.valid
    ? validation.employeeCount
    : DEFAULT_INCLUDED_EMPLOYEES;

  if (plan.isCustom || plan.id === "enterprise") {
    return {
      planId: "enterprise",
      planName: plan.name,
      isCustom: true,
      includedEmployees: DEFAULT_INCLUDED_EMPLOYEES,
      selectedEmployees: safeCount,
      extraEmployees: 0,
      basePlanAmount: plan.basePriceMonthly,
      perEmployeeRate: 0,
      additionalEmployeeAmount: 0,
      monthlySubtotal: plan.basePriceMonthly,
      belowIncludedMinimum: safeCount < DEFAULT_INCLUDED_EMPLOYEES,
    };
  }

  const included =
    typeof plan.includedEmployees === "number"
      ? plan.includedEmployees
      : DEFAULT_INCLUDED_EMPLOYEES;
  const perEmployeeRate = plan.perEmployeeRate ?? 0;
  const extraEmployees = Math.max(0, safeCount - included);
  const additionalEmployeeAmount = extraEmployees * perEmployeeRate;
  const monthlySubtotal = plan.basePriceMonthly + additionalEmployeeAmount;

  return {
    planId: plan.id,
    planName: plan.name,
    isCustom: false,
    includedEmployees: included,
    selectedEmployees: safeCount,
    extraEmployees,
    basePlanAmount: plan.basePriceMonthly,
    perEmployeeRate,
    additionalEmployeeAmount,
    monthlySubtotal,
    belowIncludedMinimum: safeCount < included,
  };
}

function matchOfficialPlanId(raw: BackendPlanRecord): OfficialPlanId | null {
  const candidates = [raw.id, raw.plan_id, raw.code, raw.slug, raw.name]
    .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
    .map((v) => v.trim().toLowerCase());

  for (const token of candidates) {
    if (token.includes("starter") || token === "basic" || token === "growth") {
      return "starter_hr";
    }
    if (token.includes("business") || token.includes("pro") || token.includes("scale")) {
      return "business_hr";
    }
    if (token.includes("enterprise") || token.includes("custom")) {
      return "enterprise";
    }
  }
  return null;
}

function extractRawPlansArray(payload: unknown): BackendPlanRecord[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload as BackendPlanRecord[];
  if (typeof payload === "object" && payload !== null) {
    const record = payload as Record<string, unknown>;
    if (Array.isArray(record.plans)) return record.plans as BackendPlanRecord[];
    if (Array.isArray(record.items)) return record.items as BackendPlanRecord[];
    if (Array.isArray(record.data)) return record.data as BackendPlanRecord[];
    if (typeof record.data === "object" && record.data !== null) {
      const inner = record.data as Record<string, unknown>;
      if (Array.isArray(inner.plans)) return inner.plans as BackendPlanRecord[];
      if (Array.isArray(inner.items)) return inner.items as BackendPlanRecord[];
    }
  }
  return [];
}

function extractBackendFeatures(raw: BackendPlanRecord | undefined): {
  features: string[];
  flags: Record<string, boolean>;
} {
  if (!raw) return { features: [], flags: {} };
  const features: string[] = [];
  const flags: Record<string, boolean> = {};

  if (Array.isArray(raw.features)) {
    for (const item of raw.features) {
      if (typeof item === "string" && item.trim().length > 0) {
        features.push(item.trim());
      }
    }
  }

  if (Array.isArray(raw.entitlements)) {
    for (const item of raw.entitlements) {
      if (typeof item === "string" && item.trim().length > 0 && !features.includes(item.trim())) {
        features.push(item.trim());
      }
    }
  } else if (raw.entitlements && typeof raw.entitlements === "object") {
    for (const [key, val] of Object.entries(raw.entitlements)) {
      const enabled = Boolean(val);
      flags[key] = enabled;
      if (enabled) {
        const readable = key
          .replace(/_enabled$/i, "")
          .replace(/[_-]+/g, " ")
          .replace(/\b\w/g, (m) => m.toUpperCase());
        if (!features.includes(readable)) {
          features.push(readable);
        }
      }
    }
  }

  return { features, flags };
}

export function mergeBackendPlansWithOfficialCatalog(
  rawBackendResponse: unknown,
): {
  plans: MergedPricingPlan[];
  backendLoaded: boolean;
} {
  const rawList = extractRawPlansArray(rawBackendResponse);
  const byOfficialId = new Map<OfficialPlanId, BackendPlanRecord>();

  for (const item of rawList) {
    const matchedId = matchOfficialPlanId(item);
    if (matchedId && !byOfficialId.has(matchedId)) {
      byOfficialId.set(matchedId, item);
    }
  }

  const merged: MergedPricingPlan[] = OFFICIAL_OFC360_PLANS.map((official) => {
    const backendMatch = byOfficialId.get(official.id);
    const { features, flags } = extractBackendFeatures(backendMatch);
    const backendId =
      backendMatch?.id ||
      backendMatch?.plan_id ||
      backendMatch?.code ||
      backendMatch?.slug ||
      null;

    return {
      ...official,
      backendPlanId: backendId ? String(backendId) : null,
      backendFeatures: features,
      backendEntitlementFlags: flags,
      hasBackendFeatureData: features.length > 0,
      backendDescription:
        typeof backendMatch?.description === "string" &&
        backendMatch.description.trim().length > 0
          ? backendMatch.description.trim()
          : undefined,
      isActiveOnBackend:
        backendMatch?.is_active !== undefined ? Boolean(backendMatch.is_active) : true,
    };
  });

  return {
    plans: merged,
    backendLoaded: rawList.length > 0,
  };
}

export function reconcileOrderWithEstimate(
  rawOrder: CreatePaymentOrderResponse | Record<string, unknown>,
  estimate: PricingBreakdownEstimate,
  fallbackRazorpayKey?: string | null,
): AuthoritativeOrderQuote {
  const order = (rawOrder || {}) as CreatePaymentOrderResponse;
  const orderId = String(
    order.razorpay_order_id || order.order_id || order.id || "",
  ).trim();

  const razorpayKeyId =
    String(
      order.razorpay_key_id || order.key_id || order.key || fallbackRazorpayKey || "",
    ).trim() || null;

  const currency = String(order.currency || "INR").toUpperCase();

  let finalPayableRupees: number | null = null;
  let amountInSubunits: number | null = null;

  if (typeof order.final_amount === "number" && Number.isFinite(order.final_amount)) {
    finalPayableRupees = order.final_amount;
  } else if (typeof order.total_amount === "number" && Number.isFinite(order.total_amount)) {
    finalPayableRupees = order.total_amount;
  } else if (typeof order.amount_inr === "number" && Number.isFinite(order.amount_inr)) {
    finalPayableRupees = order.amount_inr;
  }

  if (typeof order.amount_paise === "number" && Number.isFinite(order.amount_paise)) {
    amountInSubunits = Math.round(order.amount_paise);
    if (finalPayableRupees === null) {
      finalPayableRupees = amountInSubunits / 100;
    }
  } else if (typeof order.amount === "number" && Number.isFinite(order.amount)) {
    // Standard Razorpay order `amount` is in paise (100 paise = ₹1).
    // If the backend also returned `final_amount`/`amount_inr`, use that to disambiguate,
    // or if `amount >= estimate.monthlySubtotal * 50`, treat `amount` as paise.
    if (finalPayableRupees !== null) {
      amountInSubunits =
        Math.abs(order.amount - finalPayableRupees * 100) < 5
          ? Math.round(order.amount)
          : Math.round(finalPayableRupees * 100);
    } else if (order.amount >= estimate.monthlySubtotal * 20) {
      amountInSubunits = Math.round(order.amount);
      finalPayableRupees = amountInSubunits / 100;
    } else {
      finalPayableRupees = order.amount;
      amountInSubunits = Math.round(order.amount * 100);
    }
  }

  if (finalPayableRupees === null) {
    throw new Error(
      "Backend order response did not include an authoritative payable amount.",
    );
  }

  if (amountInSubunits === null) {
    amountInSubunits = Math.round(finalPayableRupees * 100);
  }

  const taxesRupees =
    typeof order.tax_amount === "number"
      ? order.tax_amount
      : typeof order.taxes === "number"
        ? order.taxes
        : typeof order.gst_amount === "number"
          ? order.gst_amount
          : null;

  const discountRupees =
    typeof order.discount_amount === "number" ? order.discount_amount : null;

  const subtotalRupees =
    typeof order.subtotal === "number" ? order.subtotal : null;

  const delta = Math.abs(finalPayableRupees - estimate.monthlySubtotal);
  const differsFromEstimate = delta >= 0.01;

  let differenceReason: string | null = null;
  if (differsFromEstimate) {
    if (taxesRupees && taxesRupees > 0 && discountRupees && discountRupees > 0) {
      differenceReason =
        "Final amount includes backend-calculated taxes and applicable adjustments.";
    } else if (taxesRupees && taxesRupees > 0) {
      differenceReason = "Final amount includes backend-calculated taxes.";
    } else if (discountRupees && discountRupees > 0) {
      differenceReason = "Final amount reflects a backend-applied discount or proration.";
    } else {
      differenceReason =
        "Final payable amount was adjusted by the backend billing engine (taxes, proration, or plan rules).";
    }
  }

  return {
    orderId,
    razorpayKeyId,
    currency,
    amountInSubunits,
    finalPayableRupees,
    subtotalRupees,
    taxesRupees,
    discountRupees,
    estimatedSubtotalRupees: estimate.monthlySubtotal,
    differsFromEstimate,
    differenceReason,
    confirmedEmployeeCount:
      typeof order.employee_count === "number" && order.employee_count > 0
        ? order.employee_count
        : estimate.selectedEmployees,
    confirmedPlanName: order.plan_name || estimate.planName,
  };
}

export function normalizeVerifyPaymentResponse(
  raw: VerifyPaymentResponse | Record<string, unknown>,
  fallbackPlanName: string,
  fallbackEmployees: number,
  fallbackOrderId: string,
  fallbackPaymentId: string,
): VerifiedPaymentSummary {
  const data = (raw || {}) as VerifyPaymentResponse;
  const rawStatus = String(
    data.payment_status || data.status || (data.verified === true ? "verified" : ""),
  )
    .trim()
    .toLowerCase();

  let status: "verified" | "pending" | "failed" = "pending";
  if (
    data.verified === true ||
    rawStatus === "verified" ||
    rawStatus === "captured" ||
    rawStatus === "paid" ||
    rawStatus === "success" ||
    rawStatus === "active" ||
    rawStatus === "completed"
  ) {
    status = "verified";
  } else if (
    data.verified === false ||
    rawStatus === "failed" ||
    rawStatus === "rejected" ||
    rawStatus === "error" ||
    rawStatus === "invalid_signature"
  ) {
    status = "failed";
  } else {
    status = "pending";
  }

  const rawAmount =
    typeof data.verified_amount === "number"
      ? data.verified_amount
      : typeof data.amount_paid === "number"
        ? data.amount_paid
        : typeof data.amount === "number"
          ? data.amount
          : null;

  return {
    status,
    planName: String(data.plan_name || fallbackPlanName),
    employeeQuantity:
      typeof data.employee_count === "number" && data.employee_count > 0
        ? data.employee_count
        : fallbackEmployees,
    verifiedAmountRupees: rawAmount,
    currency: String(data.currency || "INR").toUpperCase(),
    paymentId: String(data.razorpay_payment_id || data.payment_id || fallbackPaymentId),
    orderId: String(data.razorpay_order_id || data.order_id || fallbackOrderId),
    transactionReference: data.transaction_reference ? String(data.transaction_reference) : null,
    subscriptionId: data.subscription_id ? String(data.subscription_id) : null,
    subscriptionStatus: data.subscription_status ? String(data.subscription_status) : null,
    nextBillingDate: data.next_billing_date ? String(data.next_billing_date) : null,
    paidAt: data.paid_at ? String(data.paid_at) : null,
    message:
      data.message ||
      (status === "verified"
        ? "Payment signature and order verified by OFC360 billing server."
        : status === "pending"
          ? "Payment is awaiting final confirmation from the payment gateway."
          : "Payment verification failed on the server."),
  };
}

export function isAlreadySubscribedToSelection(
  subscription: OrganizationSubscription | null | undefined,
  planId: OfficialPlanId,
  employeeCount: number,
): boolean {
  if (!subscription) return false;
  const subStatus = String(
    subscription.status || subscription.access_status || subscription.payment_status || "",
  )
    .trim()
    .toLowerCase();
  if (subStatus !== "active" && subStatus !== "paid" && subStatus !== "verified") {
    return false;
  }

  const rawPlan = String(
    subscription.plan_id || subscription.plan_name || subscription.plan || "",
  )
    .trim()
    .toLowerCase();

  const matchesPlan =
    (planId === "starter_hr" && rawPlan.includes("starter")) ||
    (planId === "business_hr" && rawPlan.includes("business")) ||
    (planId === "enterprise" && rawPlan.includes("enterprise"));

  if (!matchesPlan) return false;

  const currentLimit =
    subscription.employee_limit ??
    subscription.max_employees ??
    subscription.maxLicenses ??
    subscription.seats ??
    0;

  return Number(currentLimit) === employeeCount;
}

export function classifyBillingApiError(error: unknown): {
  state: PaymentFlowState;
  title: string;
  message: string;
  statusCode?: number;
} {
  if (!error) {
    return {
      state: "backend_unavailable",
      title: "Service Unavailable",
      message: "Unable to communicate with the billing service.",
    };
  }

  const errObj = error as {
    response?: {
      status?: number;
      data?: { message?: string; detail?: string; error?: string; code?: string };
    };
    code?: string;
    message?: string;
  };

  const status = errObj.response?.status;
  const serverMsg =
    errObj.response?.data?.message ||
    errObj.response?.data?.detail ||
    errObj.response?.data?.error ||
    errObj.message ||
    "";
  const lowerMsg = String(serverMsg).toLowerCase();

  if (status === 401 || status === 403 || lowerMsg.includes("authentication") || lowerMsg.includes("token expired")) {
    return {
      state: "auth_expired",
      statusCode: status,
      title: "Authentication Required",
      message:
        serverMsg ||
        "Your organization session has expired or lacks billing authorization. Please sign in again to continue checkout.",
    };
  }

  if (status === 409 || lowerMsg.includes("already subscribed") || lowerMsg.includes("active subscription")) {
    return {
      state: "already_subscribed",
      statusCode: status,
      title: "Already Subscribed",
      message:
        serverMsg ||
        "Your organization already has an active subscription for this plan and employee limit.",
    };
  }

  if (
    status === 422 ||
    lowerMsg.includes("downgrade") ||
    lowerMsg.includes("upgrade not supported") ||
    lowerMsg.includes("not supported")
  ) {
    return {
      state: "unsupported_change",
      statusCode: status,
      title: "Plan Change Not Supported",
      message:
        serverMsg ||
        "This subscription transition is not supported directly via self-serve checkout.",
    };
  }

  if (
    !status &&
    (errObj.code === "ERR_NETWORK" ||
      lowerMsg.includes("network error") ||
      lowerMsg.includes("failed to fetch"))
  ) {
    return {
      state: "network_failure",
      title: "Network Connection Failure",
      message:
        "Could not reach the OFC360 billing server. Please check your internet connection and try again.",
    };
  }

  return {
    state: "backend_unavailable",
    statusCode: status,
    title: "Billing Service Unavailable",
    message:
      serverMsg ||
      "The billing backend is temporarily unavailable. No payment order was created and you have not been charged.",
  };
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d][\d\s()-]{6,19}$/;

export function validateEnterpriseEnquiry(
  input: EnterpriseEnquiryFormInput,
): EnterpriseEnquiryValidationResult {
  const errors: Partial<Record<keyof EnterpriseEnquiryFormInput, string>> = {};

  if (!input.contactName || input.contactName.trim().length < 2) {
    errors.contactName = "Enter your full name.";
  }

  if (!input.businessEmail || !EMAIL_REGEX.test(input.businessEmail.trim())) {
    errors.businessEmail = "Enter a valid work email address.";
  }

  if (!input.companyName || input.companyName.trim().length < 2) {
    errors.companyName = "Enter your organization name.";
  }

  const countCheck = validateEmployeeCount(input.employeeCount);
  if (!countCheck.valid) {
    errors.employeeCount = countCheck.error || "Enter a valid employee headcount.";
  }

  if (!input.phoneNumber || !PHONE_REGEX.test(input.phoneNumber.trim())) {
    errors.phoneNumber = "Enter a valid contact phone number.";
  }

  if (!input.requirements || input.requirements.trim().length < 10) {
    errors.requirements = "Briefly describe your deployment or compliance requirements (min 10 characters).";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    parsedEmployeeCount: countCheck.valid ? countCheck.employeeCount : null,
  };
}

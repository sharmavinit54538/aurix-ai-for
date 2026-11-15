import type { RazorpaySuccessPayload } from "@/features/billing/types/billingTypes";

export interface RazorpayErrorPayload {
  code?: string;
  description?: string;
  source?: string;
  step?: string;
  reason?: string;
  metadata?: {
    order_id?: string;
    payment_id?: string;
  };
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler: (response: RazorpaySuccessPayload) => void;
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    confirm_close?: boolean;
  };
}

export interface RazorpayInstance {
  open: () => void;
  on: (
    event: "payment.failed",
    callback: (response: { error?: RazorpayErrorPayload }) => void
  ) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const RAZORPAY_SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let sdkLoadPromise: Promise<boolean> | null = null;
let sdkLoaderOverrideForTests: (() => Promise<boolean>) | null = null;

/**
 * Allows automated tests to override Razorpay script loading deterministically.
 */
export function setRazorpaySdkLoaderForTests(
  loader: (() => Promise<boolean>) | null
): void {
  sdkLoaderOverrideForTests = loader;
  sdkLoadPromise = null;
}

/**
 * Dynamically loads the official Razorpay Checkout SDK (`https://checkout.razorpay.com/v1/checkout.js`).
 * Returns true if `window.Razorpay` is available, false otherwise.
 */
export function loadRazorpaySdk(): Promise<boolean> {
  if (sdkLoaderOverrideForTests) {
    return sdkLoaderOverrideForTests();
  }

  if (typeof window === "undefined") {
    return Promise.resolve(false);
  }

  if (typeof window.Razorpay === "function") {
    return Promise.resolve(true);
  }

  if (sdkLoadPromise) {
    return sdkLoadPromise;
  }

  sdkLoadPromise = new Promise<boolean>((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${RAZORPAY_SCRIPT_SRC}"]`
    );

    if (existingScript) {
      if (typeof window.Razorpay === "function") {
        resolve(true);
        return;
      }
      existingScript.addEventListener("load", () => {
        resolve(typeof window.Razorpay === "function");
      });
      existingScript.addEventListener("error", () => {
        sdkLoadPromise = null;
        resolve(false);
      });
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => {
      resolve(typeof window.Razorpay === "function");
    };
    script.onerror = () => {
      sdkLoadPromise = null;
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return sdkLoadPromise;
}

export interface OpenRazorpayCheckoutParams {
  razorpayKeyId: string;
  orderId: string;
  amountInSubunits: number;
  currency: string;
  planName: string;
  employeeCount: number;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  organizationName?: string;
  onSuccessCallback: (payload: RazorpaySuccessPayload) => void;
  onCancelled: () => void;
  onFailed: (message: string, details?: RazorpayErrorPayload) => void;
}

/**
 * Opens the Razorpay Checkout modal using backend-provided order parameters.
 * Never invents order IDs or keys; requires backend-confirmed values.
 */
export async function openRazorpayCheckoutModal(
  params: OpenRazorpayCheckoutParams
): Promise<void> {
  const {
    razorpayKeyId,
    orderId,
    amountInSubunits,
    currency,
    planName,
    employeeCount,
    prefill,
    organizationName,
    onSuccessCallback,
    onCancelled,
    onFailed,
  } = params;

  if (!orderId || !orderId.trim()) {
    onFailed("Backend order ID was not provided. Cannot open payment gateway.");
    return;
  }

  if (!razorpayKeyId || !razorpayKeyId.trim()) {
    onFailed(
      "Razorpay public key ID was not returned by backend order creation or environment configuration."
    );
    return;
  }

  if (!Number.isFinite(amountInSubunits) || amountInSubunits <= 0) {
    onFailed("Invalid order payable amount returned by backend.");
    return;
  }

  const sdkReady = await loadRazorpaySdk();
  if (!sdkReady || typeof window === "undefined" || typeof window.Razorpay !== "function") {
    onFailed(
      "Unable to load Razorpay Checkout SDK. Please check your internet connection or ad-blocker and try again."
    );
    return;
  }

  let settled = false;

  const options: RazorpayOptions = {
    key: razorpayKeyId.trim(),
    amount: Math.round(amountInSubunits),
    currency: currency || "INR",
    name: "OFC360",
    description: `${planName} Subscription (${employeeCount} Employees)`,
    order_id: orderId.trim(),
    prefill: {
      name: prefill?.name || undefined,
      email: prefill?.email || undefined,
      contact: prefill?.contact || undefined,
    },
    notes: {
      plan_name: planName,
      employee_count: String(employeeCount),
      ...(organizationName ? { organization: organizationName } : {}),
    },
    theme: {
      color: "#6366f1",
    },
    handler: (response: RazorpaySuccessPayload) => {
      settled = true;
      if (
        !response ||
        !response.razorpay_order_id ||
        !response.razorpay_payment_id ||
        !response.razorpay_signature
      ) {
        onFailed(
          "Payment gateway returned an incomplete verification payload. Please contact billing support with your transaction reference."
        );
        return;
      }
      onSuccessCallback(response);
    },
    modal: {
      escape: true,
      confirm_close: true,
      ondismiss: () => {
        if (!settled) {
          settled = true;
          onCancelled();
        }
      },
    },
  };

  try {
    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      settled = true;
      const err = response?.error;
      const reason =
        err?.description ||
        err?.reason ||
        "Payment authorization failed in Razorpay Checkout.";
      onFailed(reason, err);
    });
    rzp.open();
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to initialize Razorpay Checkout window.";
    onFailed(message);
  }
}

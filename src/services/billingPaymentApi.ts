import apiInstance from "@/api/apiInstance";
import type {
  BackendPlanRecord,
  BillingInvoiceRecord,
  CreatePaymentOrderRequest,
  CreatePaymentOrderResponse,
  OrganizationSubscription,
  PaymentHistoryRecord,
  SavedPaymentMethod,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from "@/features/billing/types/billingTypes";

function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of ["plans", "items", "data", "results", "invoices", "payments", "history", "payment_methods"]) {
      if (Array.isArray(obj[key])) {
        return obj[key] as T[];
      }
    }
  }
  return [];
}

function unwrapObject<T extends object>(data: unknown): T | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  const obj = data as Record<string, unknown>;
  if (obj.data && typeof obj.data === "object" && !Array.isArray(obj.data)) {
    return obj.data as T;
  }
  if (obj.subscription && typeof obj.subscription === "object" && !Array.isArray(obj.subscription)) {
    return obj.subscription as T;
  }
  return obj as unknown as T;
}

export const billingPaymentApi = {
  /**
   * GET /api/v1/payments/plans
   * Fetches backend plan definitions & feature entitlements.
   */
  async getPlans(): Promise<BackendPlanRecord[]> {
    const res = await apiInstance.get("/api/v1/payments/plans", { timeout: 4500 });
    return unwrapList<BackendPlanRecord>(res.data);
  },

  /**
   * POST /api/v1/payments/create-order
   * Creates an authoritative Razorpay order on the backend.
   */
  async createOrder(
    payload: CreatePaymentOrderRequest,
    idempotencyKey?: string
  ): Promise<CreatePaymentOrderResponse> {
    const headers: Record<string, string> = {};
    if (idempotencyKey) {
      headers["X-Idempotency-Key"] = idempotencyKey;
    }
    const res = await apiInstance.post<CreatePaymentOrderResponse>(
      "/api/v1/payments/create-order",
      payload,
      { headers, timeout: 10000 }
    );
    return (unwrapObject<CreatePaymentOrderResponse>(res.data) ?? res.data) as CreatePaymentOrderResponse;
  },

  /**
   * POST /api/v1/payments/verify
   * Verifies Razorpay signature & order settlement with backend.
   */
  async verifyPayment(payload: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    const res = await apiInstance.post<VerifyPaymentResponse>(
      "/api/v1/payments/verify",
      payload,
      { timeout: 10000 }
    );
    return (unwrapObject<VerifyPaymentResponse>(res.data) ?? res.data) as VerifyPaymentResponse;
  },

  /**
   * GET /api/v1/payments/{payment_id}
   * Fetches authoritative status for a specific payment.
   */
  async getPaymentDetails(paymentId: string): Promise<VerifyPaymentResponse> {
    const safeId = encodeURIComponent(paymentId.trim());
    const res = await apiInstance.get<VerifyPaymentResponse>(`/api/v1/payments/${safeId}`, {
      timeout: 8000,
    });
    return (unwrapObject<VerifyPaymentResponse>(res.data) ?? res.data) as VerifyPaymentResponse;
  },

  /**
   * GET /api/v1/payments/history
   * Fetches organization payment transaction history.
   */
  async getPaymentHistory(): Promise<PaymentHistoryRecord[]> {
    const res = await apiInstance.get("/api/v1/payments/history", { timeout: 4500 });
    return unwrapList<PaymentHistoryRecord>(res.data);
  },

  /**
   * GET /api/v1/billing/subscription
   * Fetches current organization subscription details.
   */
  async getSubscription(): Promise<OrganizationSubscription | null> {
    const res = await apiInstance.get("/api/v1/billing/subscription", { timeout: 4500 });
    return unwrapObject<OrganizationSubscription>(res.data);
  },

  /**
   * GET /api/v1/settings/billing
   * Fetches organization billing settings & subscription profile.
   */
  async getBillingSettings(): Promise<OrganizationSubscription | null> {
    const res = await apiInstance.get("/api/v1/settings/billing", { timeout: 4500 });
    return unwrapObject<OrganizationSubscription>(res.data);
  },

  /**
   * PUT /api/v1/settings/billing
   * Updates organization billing settings supported by backend.
   */
  async updateBillingSettings(
    payload: Record<string, unknown>
  ): Promise<OrganizationSubscription | null> {
    const res = await apiInstance.put("/api/v1/settings/billing", payload, { timeout: 8000 });
    return unwrapObject<OrganizationSubscription>(res.data);
  },

  /**
   * GET /api/v1/billing/invoices
   * Fetches organization billing invoices.
   */
  async getInvoices(): Promise<BillingInvoiceRecord[]> {
    const res = await apiInstance.get("/api/v1/billing/invoices", { timeout: 4500 });
    return unwrapList<BillingInvoiceRecord>(res.data);
  },

  /**
   * GET /api/v1/billing/payment-methods
   * Fetches saved organization payment methods.
   */
  async getPaymentMethods(): Promise<SavedPaymentMethod[]> {
    const res = await apiInstance.get("/api/v1/billing/payment-methods", { timeout: 4500 });
    return unwrapList<SavedPaymentMethod>(res.data);
  },
};

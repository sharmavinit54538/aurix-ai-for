export type OfficialPlanId = "starter_hr" | "business_hr" | "enterprise";

export type PaymentFlowState =
  | "loading_plans"
  | "pricing_loaded"
  | "validation_error"
  | "creating_order"
  | "opening_checkout"
  | "payment_cancelled"
  | "payment_failed"
  | "verifying_payment"
  | "payment_pending"
  | "payment_verified"
  | "backend_unavailable"
  | "network_failure"
  | "auth_expired"
  | "already_subscribed"
  | "unsupported_change";

export interface PricingPlanDefinition {
  id: OfficialPlanId;
  name: string;
  tagline: string;
  basePriceMonthly: number;
  basePriceDisplay: string;
  billingPeriod: "month";
  includedEmployees: number | "Custom";
  perEmployeeRate: number | null;
  additionalEmployeeDisplay: string;
  ctaLabel: string;
  badge?: string;
  isPopular?: boolean;
  isCustom?: boolean;
}

export interface BackendPlanRecord {
  id?: string;
  plan_id?: string;
  code?: string;
  slug?: string;
  name?: string;
  description?: string;
  price?: number;
  base_price?: number;
  billing_cycle?: string;
  included_employees?: number;
  max_employees?: number;
  per_employee_rate?: number;
  additional_employee_rate?: number;
  features?: string[];
  entitlements?: string[] | Record<string, boolean>;
  is_active?: boolean;
  currency?: string;
}

export interface MergedPricingPlan extends PricingPlanDefinition {
  backendPlanId: string | null;
  backendFeatures: string[];
  backendEntitlementFlags: Record<string, boolean>;
  hasBackendFeatureData: boolean;
  backendDescription?: string;
  isActiveOnBackend: boolean;
}

export interface EmployeeCountValidationResult {
  valid: boolean;
  employeeCount: number;
  error: string | null;
  belowIncludedMinimum: boolean;
}

export interface PricingBreakdownEstimate {
  planId: OfficialPlanId;
  planName: string;
  isCustom: boolean;
  includedEmployees: number;
  selectedEmployees: number;
  extraEmployees: number;
  basePlanAmount: number;
  perEmployeeRate: number;
  additionalEmployeeAmount: number;
  monthlySubtotal: number;
  belowIncludedMinimum: boolean;
}

export interface CreatePaymentOrderRequest {
  plan_id: string;
  plan_code: OfficialPlanId;
  plan_name: string;
  employee_count: number;
  employees: number;
  billing_cycle: "monthly";
  organization_id?: string;
}

export interface CreatePaymentOrderResponse {
  order_id?: string;
  razorpay_order_id?: string;
  id?: string;
  key_id?: string;
  razorpay_key_id?: string;
  key?: string;
  amount?: number;
  amount_paise?: number;
  amount_inr?: number;
  base_amount?: number;
  additional_employee_amount?: number;
  subtotal?: number;
  tax_amount?: number;
  taxes?: number;
  gst_amount?: number;
  discount_amount?: number;
  final_amount?: number;
  total_amount?: number;
  currency?: string;
  plan_id?: string;
  plan_name?: string;
  employee_count?: number;
  receipt?: string;
  status?: string;
  notes?: Record<string, string | number>;
  message?: string;
}

export interface AuthoritativeOrderQuote {
  orderId: string;
  razorpayKeyId: string | null;
  currency: string;
  amountInSubunits: number;
  finalPayableRupees: number;
  subtotalRupees: number | null;
  taxesRupees: number | null;
  discountRupees: number | null;
  estimatedSubtotalRupees: number;
  differsFromEstimate: boolean;
  differenceReason: string | null;
  confirmedEmployeeCount: number;
  confirmedPlanName: string;
}

export interface RazorpaySuccessPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  order_id: string;
  payment_id: string;
  signature: string;
  plan_id: string;
  plan_code: OfficialPlanId;
  employee_count: number;
}

export interface VerifyPaymentResponse {
  verified?: boolean;
  success?: boolean;
  status?: string;
  payment_status?: string;
  payment_id?: string;
  razorpay_payment_id?: string;
  order_id?: string;
  razorpay_order_id?: string;
  transaction_reference?: string;
  plan_id?: string;
  plan_name?: string;
  employee_count?: number;
  amount?: number;
  amount_paid?: number;
  verified_amount?: number;
  currency?: string;
  subscription_id?: string;
  subscription_status?: string;
  next_billing_date?: string;
  paid_at?: string;
  message?: string;
}

export interface VerifiedPaymentSummary {
  status: "verified" | "pending" | "failed";
  planName: string;
  employeeQuantity: number;
  verifiedAmountRupees: number | null;
  currency: string;
  paymentId: string;
  orderId: string;
  transactionReference: string | null;
  subscriptionId: string | null;
  subscriptionStatus: string | null;
  nextBillingDate: string | null;
  paidAt: string | null;
  message: string;
}

export interface OrganizationSubscription {
  id?: string;
  subscription_id?: string;
  organization_id?: string;
  company_id?: string;
  plan?: string;
  plan_id?: string;
  plan_name?: string;
  status?: string;
  access_status?: string;
  payment_status?: string;
  billing_cycle?: string;
  billingCycle?: string;
  employee_limit?: number;
  max_employees?: number;
  maxLicenses?: number;
  seats?: number;
  active_employees?: number;
  used_seats?: number;
  usedSeats?: number;
  activeLicenses?: number;
  base_amount?: number;
  amount?: number;
  mrr?: number;
  currency?: string;
  next_billing_date?: string;
  nextBillingDate?: string;
  current_period_start?: string;
  current_period_end?: string;
  auto_renew?: boolean;
  autoRenew?: boolean;
  payment_method?: string;
  paymentMethod?: string;
  can_upgrade?: boolean;
  can_cancel?: boolean;
  can_update_seats?: boolean;
}

export interface PaymentHistoryRecord {
  id: string;
  payment_id?: string;
  order_id?: string;
  invoice_number?: string;
  plan_name?: string;
  employee_count?: number;
  amount: number;
  currency: string;
  status: string;
  gateway?: string;
  payment_method?: string;
  created_at?: string;
  payment_date?: string;
  transaction_reference?: string;
}

export interface BillingInvoiceRecord {
  id: string;
  invoice_number: string;
  date: string;
  amount: number;
  currency: string;
  status: string;
  billing_cycle?: string;
  plan_name?: string;
  pdf_url?: string;
  download_url?: string;
}

export interface SavedPaymentMethod {
  id: string;
  type: string;
  brand?: string;
  last4?: string;
  upi_id?: string;
  bank?: string;
  is_default?: boolean;
  expiry_month?: number;
  expiry_year?: number;
}

export interface EnterpriseEnquiryFormInput {
  contactName: string;
  businessEmail: string;
  companyName: string;
  employeeCount: string;
  phoneNumber: string;
  requirements: string;
}

export interface EnterpriseEnquiryValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof EnterpriseEnquiryFormInput, string>>;
  parsedEmployeeCount: number | null;
}

export type ExpenseCategory =
  | "Travel"
  | "Food"
  | "Accommodation"
  | "Fuel"
  | "Internet"
  | "Phone"
  | "Medical"
  | "Training"
  | "Office Supplies"
  | "Client Meeting"
  | "Entertainment"
  | "Relocation"
  | "Other";

export type ApprovalStatus =
  | "SUBMITTED"
  | "MANAGER_APPROVED"
  | "FINANCE_APPROVED"
  | "PAYROLL_APPROVED"
  | "REJECTED"
  | "CHANGES_REQUESTED";

export type PaymentStatus = "UNPAID" | "PROCESSING" | "PAID" | "SCHEDULED_PAYROLL";

export type ReimbursementsSubmodelTabId =
  | "dashboard"
  | "create_claim"
  | "drafts"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "paid"
  | "categories"
  | "travel"
  | "food"
  | "medical"
  | "fuel"
  | "internet"
  | "wfh"
  | "policies"
  | "tax_gst"
  | "ocr_scanner"
  | "fraud_ai"
  | "reports"
  | "audit_logs";

export interface ReceiptDocument {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: "PDF" | "JPEG" | "PNG" | "HEIC";
  fileSize: string;
  uploadedAt: string;
  ocrVerified: boolean;
  extractedAmount?: number;
  extractedVendor?: string;
  extractedDate?: string;
  extractedGst?: string;
}

export interface ApprovalStep {
  role: "Employee" | "Reporting Manager" | "Finance Manager" | "Payroll Admin" | "Payment Disbursed";
  name: string;
  avatar?: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | "SKIPPED";
  timestamp?: string;
  comment?: string;
}

export interface ReimbursementClaim {
  id: string;
  claimNumber: string; // e.g. "CLM-2026-0841"
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  avatar?: string;
  department: string;
  designation: string;
  expenseCategory: ExpenseCategory;
  expenseDate: string;
  submittedDate: string;
  claimAmount: number;
  approvedAmount: number;
  currency: string;
  taxAmount: number;
  businessPurpose: string;
  costCenter: string;
  project: string;
  location: string;
  vendorName?: string;
  paymentMode?: string;
  billNumber?: string;
  gstNumber?: string;
  paymentStatus: PaymentStatus;
  approvalStatus: ApprovalStatus;
  approvalStage: "MANAGER" | "FINANCE" | "PAYROLL" | "COMPLETED";
  approvalWorkflow: ApprovalStep[];
  receipts: ReceiptDocument[];
  payrollCycle?: string;
  payrollEntryId?: string;
  createdOn: string;
  updatedOn: string;
  policyWarnings: string[];
  aiRiskScore?: "LOW" | "MEDIUM" | "HIGH";
}

export interface ReimbursementsSummaryKPIs {
  totalClaims: number;
  pendingApproval: number;
  approved: number;
  rejected: number;
  processing: number;
  paid: number;
  totalAmount: number;
  averageClaim: number;
  monthlyExpense: number;
  departmentExpense: number;
}

export interface ReimbursementsFilters {
  search: string;
  employee: string;
  employeeId: string;
  department: string;
  designation: string;
  expenseCategory: string;
  claimStatus: string;
  paymentStatus: string;
  financialYear: string;
  month: string;
  minAmount?: number;
  maxAmount?: number;
  page: number;
  limit: number;
  sortBy: string;
  sortDir: "asc" | "desc";
}

export interface ReimbursementAuditLog {
  id: string;
  claimId: string;
  claimNumber: string;
  action: "CREATE" | "APPROVE" | "REJECT" | "REQUEST_CHANGES" | "PROCESS_PAYMENT" | "ADD_PAYROLL_ENTRY";
  actorName: string;
  actorRole: string;
  timestamp: string;
  details: string;
  ipAddress: string;
}

export interface ReimbursementAIInsight {
  id: string;
  title: string;
  type: "DUPLICATE" | "OUT_OF_POLICY" | "FRAUD_RISK" | "MISSING_RECEIPT" | "HIGH_EXPENSE" | "BUDGET_FORECAST";
  severity: "CRITICAL" | "WARNING" | "INFO" | "SUCCESS";
  claimId?: string;
  employeeName: string;
  description: string;
  impactAmount: number;
  recommendation: string;
}

import type { PayrollReviewData, PayrollStatus } from "@/services/payrollApi";

export interface ApprovalPageProps {
  runId: string;
}

export interface ApprovalSubNavigationProps {
  runId: string;
}

export interface ApprovalPageHeaderProps {
  runId: string;
  reviewData: any;
  statusTone: any;
  valBadge: any;
  canApprovePayroll: boolean;
  canRejectNow: boolean;
  canApproveNow: boolean;
  loadingReview: boolean;
  isApproved: boolean;
  isFinalized: boolean;
  isProcessing: boolean;
  hasBlockingErrors: boolean;
  hasBlockingErrors: boolean;
  onNavigateToValidation: () => void;
  onNavigateToPreview: () => void;
  onOpenApprovalModal: () => void;
  onOpenRejectionModal: () => void;
}

export interface ApprovalSummaryCardsProps {
  reviewData: any;
}

export interface ApprovalApprovedBannerProps {
  reviewData: any;
  runId: string;
  formatDate: (val: string | null | undefined) => string;
}

export interface ApprovalRejectedBannerProps {
  reviewData: any;
  formatDate: (val: string | null | undefined) => string;
}

export interface ApprovalSummaryCardsProps {
  reviewData: any;
  formatCount: (value: number | null | undefined) => string;
  formatINR: (value: number | null | undefined) => string;
}

export interface ApprovalValidationCardProps {
  reviewData: any;
  runId: string;
  valBadge: any;
  hasBlockingErrors: boolean;
  validationBlockingCount: number;
  formatCount: (value: number | null | undefined) => string;
  onNavigateToValidation: () => void;
}

export interface ApprovalEmployeeCardProps {
  reviewData: any;
  runId: string;
  formatCount: (value: number | null | undefined) => string;
  formatINR: (value: number | null | undefined) => string;
}

export interface ApprovalAuditTrailProps {
  reviewData: any;
  formatDate: (val: string | null | undefined) => string;
}

export interface ApprovalChecklistProps {
  checklistItems: any[];
}

export interface ApprovalGovernanceBoxProps {
  canApprovePayroll: boolean;
  canApproveNow: boolean;
  isApproved: boolean;
  isFinalized: boolean;
  isProcessing: boolean;
  hasBlockingErrors: boolean;
  canRejectNow: boolean;
  onOpenApprovalModal: () => void;
  onOpenRejectionModal: () => void;
}

export interface ApprovalModalProps {
  open: boolean;
  onClose: () => void;
  runId: string;
  reviewData: any;
  isApproving: boolean;
  approvalComments: string;
  setApprovalComments: (comments: string) => void;
  onConfirm: () => void;
  isApproving: boolean;
}

export interface RejectionModalProps {
  open: boolean;
  onClose: () => void;
  runId: string;
  reviewData: any;
  isRejecting: boolean;
  rejectionReason: string;
  setRejectionReason: (reason: string) => void;
  rejectionComments: string;
  setRejectionComments: (comments: string) => void;
  onConfirm: () => void;
  isRejecting: boolean;
}

export interface ApprovalStatusTone {
  tone: "success" | "warning" | "danger" | "info" | "muted";
  label: string;
  badgeClass: string;
}

export interface ValidationBadge {
  label: string;
  className: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

export const APPROVAL_STATUS_MAP = {
  approved: { tone: "success", label: "Approved", class: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  rejected: { tone: "danger", label: "Rejected", class: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  "under review": { tone: "info", label: "Under Review", class: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400" },
  "provision generated": { tone: "warning", label: "Provision Generated", class: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  finalized: { tone: "muted", label: "Finalized", class: "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400" },
} as const;

export const VALIDATION_STATUS_MAP = {
  passed: { label: "Passed", class: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  failed: { label: "Failed", class: "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  warning: { label: "Warning", class: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400" },
} as const;

export const CHECKLIST_ITEMS_DEFAULTS = [
  {
    id: "calc",
    title: "Provisional Calculation Completed",
    description: "Backend calculation engine has evaluated gross, allowances, and attendance.",
  },
  {
    id: "val",
    title: "Validation Cycle Executed",
    description: "Server audit rules ran against compliance, salary structures, and tax parameters.",
  },
  {
    id: "errors",
    title: "Blocking Validation Errors Resolved",
    description: "All blocking errors must be addressed before approval sign-off.",
  },
  {
    id: "statutory",
    title: "Statutory Deductions Available",
    description: "PF, ESI, Professional Tax, and TDS calculations are present in totals.",
  },
  {
    id: "readiness",
    title: "Governance Approval Eligibility",
    description: "All prerequisites satisfied. Authorized reviewer may execute sign-off.",
  },
] as const;
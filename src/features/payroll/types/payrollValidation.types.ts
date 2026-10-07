import type { PayrollValidationSummary, PayrollValidationIssue } from "@/services/payrollApi";
import { getValidationStatusBadge } from "../utils/payrollValidation.utils";

export type { PayrollValidationIssue };

export interface ValidationPageProps {
  runId: string;
}

export interface ValidationSubNavigationProps {
  runId: string;
}

export interface ValidationPageHeaderProps {
  runId: string;
  validationData: PayrollValidationSummary | null;
  statusBadge: ReturnType<typeof getValidationStatusBadge>;
  canRunPayroll: boolean;
  onNavigateToPreview: () => void;
  onNavigateToApproval: () => void;
  onRecalculate: () => void;
  onRevalidate: () => void;
}

export interface ValidationSummaryCardsProps {
  validationData: PayrollValidationSummary | null;
  statusBadge: ReturnType<typeof getValidationStatusBadge>;
}

export interface ValidationFiltersProps {
  searchQuery: string;
  selectedSeverity: string;
  selectedCategory: string;
  selectedDepartment: string;
  selectedStatus: string;
  selectedBlocking: string;
  pageSize: number;
  availableCategories: string[];
  availableDepartments: string[];
  hasStatusInfo: boolean;
  hasBlockingInfo: boolean;
  onSearchChange: (query: string) => void;
  onSeverityChange: (severity: string) => void;
  onCategoryChange: (category: string) => void;
  onDepartmentChange: (department: string) => void;
  onStatusChange: (status: string) => void;
  onBlockingChange: (blocking: string) => void;
  onPageSizeChange: (size: number) => void;
  onClearSearch: () => void;
}

export interface ValidationIssueTableProps {
  paginatedIssues: PayrollValidationIssue[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
  filteredIssuesCount: number;
  runId: string;
  onPageChange: (page: number) => void;
  onViewIssue: (issue: PayrollValidationIssue) => void;
  onViewPayroll: (employeeId: string) => void;
}

export interface ValidationIssueSheetProps {
  issue: PayrollValidationIssue | null;
  open: boolean;
  onClose: () => void;
  runId: string;
  onOpenEmployeePayroll: (employeeId: string) => void;
}

export interface RevalidateDialogProps {
  open: boolean;
  onClose: () => void;
  runId: string;
  isValidating: boolean;
  onConfirm: () => void;
}

export interface RecalculateDialogProps {
  open: boolean;
  onClose: () => void;
  runId: string;
  isRecalculating: boolean;
  onConfirm: () => void;
}

export interface ValidationStatusBadge {
  label: string;
  className: string;
}

export type SeverityOption = "all" | "error" | "warning" | "info";
export type CategoryOption = string;
export type DepartmentOption = string;
export type StatusOption = "all" | "open" | "resolved";
export type BlockingOption = "all" | "blocking" | "non_blocking";

export const SEVERITY_OPTIONS: { value: "all" | "error" | "warning" | "info"; label: string }[] = [
  { value: "all", label: "All Severity" },
  { value: "error", label: "Errors Only" },
  { value: "warning", label: "Warnings Only" },
  { value: "info", label: "Info Only" },
] as const;

export const STATUS_OPTIONS: { value: "all" | "open" | "resolved"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "open", label: "Open" },
  { value: "resolved", label: "Resolved" },
] as const;

export const BLOCKING_OPTIONS: { value: "all" | "blocking" | "non_blocking"; label: string }[] = [
  { value: "all", label: "All Impact" },
  { value: "blocking", label: "Blocking Only" },
  { value: "non_blocking", label: "Non-Blocking Only" },
] as const;

export const PAGE_SIZE_OPTIONS = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
] as const;
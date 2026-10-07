import type { PayrollPreviewData, PayrollPreviewEmployee, PayrollStatus } from "@/services/payrollApi";

export type { PayrollPreviewEmployee, PayrollStatus };

export interface PayrollPreviewPageProps {
  runId: string;
}

export interface PayrollPreviewHeaderProps {
  runId: string;
  previewData: PayrollPreviewData | null;
  statusTone: StatusTone;
  loadingPreview: boolean;
  isUnavailable: boolean;
  apiError: string | null;
  canRunPayroll: boolean;
  onRefresh: () => void;
  onRecalculate: () => void;
  onNavigateToValidation: () => void;
  onNavigateToApproval: () => void;
}

export interface PayrollSummaryCardsProps {
  previewData: PayrollPreviewData | null;
}

export interface PayrollValidationPanelProps {
  previewData: PayrollPreviewData | null;
  runId: string;
  onNavigateToValidation: () => void;
}

export interface PayrollEmployeeTableProps {
  employees: PayrollPreviewEmployee[];
  totalEmployees: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  loadingEmployees: boolean;
  employeesError: string | null;
  searchQuery: string;
  selectedDept: string;
  selectedValidation: string;
  sortBy: string;
  sortDir: "asc" | "desc";
  availableDepartments: string[];
  onSearchChange: (query: string) => void;
  onDeptChange: (dept: string) => void;
  onValidationChange: (validation: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSort: (field: string) => void;
  onViewDetail: (emp: PayrollPreviewEmployee) => void;
  onRetry: () => void;
}

export interface PayrollFiltersProps {
  searchQuery: string;
  selectedDept: string;
  selectedValidation: string;
  availableDepartments: string[];
  pageSize: number;
  onSearchChange: (query: string) => void;
  onDeptChange: (dept: string) => void;
  onValidationChange: (validation: string) => void;
  onPageSizeChange: (size: number) => void;
  onClearSearch: () => void;
}

export interface PayrollPaginationProps {
  currentPage: number;
  totalPages: number;
  totalEmployees: number;
  pageSize: number;
  loading: boolean;
  onPageChange: (page: number) => void;
}

export interface EmployeeDetailSheetProps {
  employee: PayrollPreviewEmployee | null;
  open: boolean;
  onClose: () => void;
  loading: boolean;
  runId: string;
  onOpenFullDetail: (employee: PayrollPreviewEmployee) => void;
}

export interface RecalculateDialogProps {
  open: boolean;
  onClose: () => void;
  runId: string;
  previewData: PayrollPreviewData | null;
  isRecalculating: boolean;
  onConfirm: () => void;
}

export interface StatusTone {
  tone: "success" | "warning" | "danger" | "info" | "muted";
  label: string;
  badgeClass: string;
}

export interface ValidationBadge {
  label: string;
  className: string;
}

export type SortDirection = "asc" | "desc";

export interface TableSortConfig {
  sortBy: string;
  sortDir: SortDirection;
}

export interface PayrollPreviewFiltersState {
  searchQuery: string;
  selectedDept: string;
  selectedValidation: string;
  currentPage: number;
  pageSize: number;
  sortBy: string;
  sortDir: SortDirection;
}

export const VALIDATION_STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "valid", label: "Valid Only" },
  { value: "warning", label: "Warnings" },
  { value: "error", label: "Errors" },
] as const;

export const PAGE_SIZE_OPTIONS = [
  { value: "10", label: "10" },
  { value: "25", label: "25" },
  { value: "50", label: "50" },
] as const;
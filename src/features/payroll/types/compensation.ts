/**
 * Salary Structure, Pay Component Master & Compensation Types.
 * Backend is the source of truth for financial structures, formulas, and salary calculations.
 */

export type ComponentType = "earning" | "deduction" | "employer_contribution";
export type CalculationMethod = "flat" | "percentage_of_basic" | "percentage_of_ctc" | "formula";

export type CompensationStatus =
  | "active"
  | "inactive"
  | "scheduled"
  | "expired"
  | "pending_approval"
  | "superseded"
  | "draft"
  | "historical"
  | "not_assigned"
  | "unknown";

export interface PayComponent {
  id: string;
  code: string;
  name: string;
  type: ComponentType;
  taxable: boolean;
  statutory: boolean;
  calculationMethod: CalculationMethod;
  formulaDescription?: string;
  defaultPercentage?: number;
  isActive: boolean;
  effectiveDate: string;
  description?: string;
}

export interface StructureComponentLine {
  componentId: string;
  code: string;
  name: string;
  type: ComponentType;
  calculationMethod: CalculationMethod;
  percentageOrAmount?: number;
  formula?: string;
  isMandatory?: boolean;
}

export interface SalaryStructureTemplate {
  id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  effectiveDate: string;
  currency: string;
  components: StructureComponentLine[];
  assignedEmployeesCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface EmployeeCompensationComponent {
  componentId: string;
  code: string;
  name: string;
  type: ComponentType;
  calculationMethod?: CalculationMethod | string;
  percentageOrAmount?: number | null;
  isTaxable?: boolean;
  isStatutory?: boolean;
  monthlyAmountPaise: number | null;
  annualAmountPaise: number | null;
  monthlyFormatted: string;
  annualFormatted: string;
}

export interface CompensationRevisionRecord {
  id: string;
  revisionNumber: number;
  effectiveDate: string;
  revisionDate?: string | null;
  previousCtcPaise: number | null;
  newCtcPaise: number | null;
  previousCtcFormatted: string;
  newCtcFormatted: string;
  previousMonthlyGrossPaise?: number | null;
  newMonthlyGrossPaise?: number | null;
  previousMonthlyGrossFormatted?: string;
  newMonthlyGrossFormatted?: string;
  revisionAmountPaise?: number | null;
  revisionAmountFormatted?: string;
  changePercentage: number | null;
  previousStructureName?: string | null;
  newStructureName?: string | null;
  reason: string;
  notes?: string | null;
  status: "draft" | "pending_approval" | "approved" | "rejected" | string;
  hasArrearsRisk: boolean;
  arrearsEstimatedMonths?: number;
  maker: {
    id: string;
    name: string;
    email: string;
  };
  checker?: {
    id: string;
    name: string;
    email: string;
  } | null;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
}

export interface EmployeeCompensation {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  profileImage?: string;
  departmentId?: string;
  department: string;
  designation: string;
  employmentType?: string;
  joiningDate?: string;
  structureId: string;
  structureCode?: string;
  structureName: string;
  currency: string;
  ctcAnnualPaise: number | null;
  ctcMonthlyPaise: number | null;
  grossAnnualPaise: number | null;
  grossMonthlyPaise: number | null;
  fixedPayPaise: number | null;
  variablePayPaise: number | null;
  employerContributionsPaise: number | null;
  ctcAnnualFormatted: string;
  ctcMonthlyFormatted: string;
  grossAnnualFormatted: string;
  grossMonthlyFormatted: string;
  fixedPayFormatted: string;
  variablePayFormatted: string;
  employerContributionsFormatted: string;
  effectiveDate: string;
  effectiveTo?: string | null;
  lastRevisionDate?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  status: CompensationStatus;
  statusRaw?: string | null;
  components: EmployeeCompensationComponent[];
  revisions: CompensationRevisionRecord[];
}

export interface CompensationSummaryMetrics {
  totalEmployees: number | null;
  assignedEmployees: number | null;
  totalAnnualCtcPaise: number | null;
  totalMonthlyGrossPaise: number | null;
  averageAnnualCtcPaise: number | null;
  pendingRevisions: number | null;
  unassignedEmployees: number | null;
  structuresInUse: number | null;
  source: "backend_summary" | "dataset_computed" | "unavailable";
}

export interface EmployeeCompensationListParams {
  page?: number;
  limit?: number;
  department?: string;
  designation?: string;
  employmentType?: string;
  structureId?: string;
  status?: string;
  effectiveFrom?: string;
  effectiveTo?: string;
  minAnnualCtc?: number;
  maxAnnualCtc?: number;
  minMonthlyGross?: number;
  maxMonthlyGross?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  search?: string;
}

export interface EmployeeCompensationListResult {
  items: EmployeeCompensation[];
  total: number;
  page: number;
  limit: number;
  summary: CompensationSummaryMetrics | null;
}

export interface CompensationMasterEmployee {
  id: string;
  employeeCode: string;
  fullName: string;
  department?: string;
  departmentId?: string;
  designation?: string;
  employmentType?: string;
  joiningDate?: string;
  profileImage?: string;
}

export interface BulkCompensationRowError {
  rowNumber: number;
  employeeCode: string;
  componentCode: string;
  errorCode: string;
  errorMessage: string;
}

export interface BulkCompensationPreviewResult {
  previewToken: string;
  fileName: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  affectedEmployeesCount: number;
  totalNewCtcPaise: number;
  totalNewCtcFormatted: string;
  errors: BulkCompensationRowError[];
}

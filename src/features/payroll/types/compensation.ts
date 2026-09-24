/**
 * Salary Structure, Pay Component Master & Compensation Types.
 * Backend is the source of truth for financial structures, formulas, and salary calculations.
 */

import { z } from "zod";

export type ComponentType = "earning" | "deduction" | "employer_contribution";
export type CalculationMethod = "flat" | "percentage_of_basic" | "percentage_of_ctc" | "formula";

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
  monthlyAmountPaise: number;
  annualAmountPaise: number;
  monthlyFormatted: string;
  annualFormatted: string;
}

export interface CompensationRevisionRecord {
  id: string;
  revisionNumber: number;
  effectiveDate: string;
  previousCtcPaise: number;
  newCtcPaise: number;
  previousCtcFormatted: string;
  newCtcFormatted: string;
  changePercentage: number;
  reason: string;
  status: "draft" | "pending_approval" | "approved" | "rejected";
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
  department: string;
  designation: string;
  structureId: string;
  structureName: string;
  ctcAnnualPaise: number;
  ctcMonthlyPaise: number;
  ctcAnnualFormatted: string;
  ctcMonthlyFormatted: string;
  effectiveDate: string;
  status: "active" | "draft" | "pending_approval" | "historical";
  components: EmployeeCompensationComponent[];
  revisions: CompensationRevisionRecord[];
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

/**
 * Payroll 9-Step Lifecycle Types and State Definitions.
 *
 * Steps:
 * 1. Period
 * 2. Run
 * 3. Validation
 * 4. Preview
 * 5. Employee Detail
 * 6. Review & Approval
 * 7. Finalization
 * 8. Payslips
 * 9. Payment
 */

export type PayrollStepId =
  | "period"
  | "run"
  | "validation"
  | "preview"
  | "employee_detail"
  | "review_approval"
  | "finalization"
  | "payslips"
  | "payment";

export type StepState = "completed" | "active" | "upcoming" | "disabled";

export interface PayrollStepItem {
  id: PayrollStepId;
  stepNumber: number;
  label: string;
  description: string;
  state: StepState;
  route?: string;
  isClickable: boolean;
  requiredPermission?: string;
}

export interface PayrollStepperProps {
  currentStep: PayrollStepId;
  runId?: string;
  employeeId?: string;
  batchId?: string;
  runStatus?: string;
  onStepClick?: (stepId: PayrollStepId, route?: string) => void;
  className?: string;
}

export const PAYROLL_LIFECYCLE_STEPS: ReadonlyArray<{
  id: PayrollStepId;
  stepNumber: number;
  label: string;
  description: string;
  getPath: (runId?: string, employeeId?: string, batchId?: string) => string;
}> = [
  {
    id: "period",
    stepNumber: 1,
    label: "Period",
    description: "Cycle Setup & Dates",
    getPath: () => "/dashboard/payroll/periods",
  },
  {
    id: "run",
    stepNumber: 2,
    label: "Run",
    description: "Calculation Engine",
    getPath: (runId) => (runId ? `/dashboard/payroll/runs/${runId}/processing` : "/dashboard/payroll"),
  },
  {
    id: "validation",
    stepNumber: 3,
    label: "Validation",
    description: "Rule & Error Check",
    getPath: (runId) => (runId ? `/dashboard/payroll/runs/${runId}/validation` : "/dashboard/payroll"),
  },
  {
    id: "preview",
    stepNumber: 4,
    label: "Preview",
    description: "Provisional Numbers",
    getPath: (runId) => (runId ? `/dashboard/payroll/runs/${runId}/preview` : "/dashboard/payroll"),
  },
  {
    id: "employee_detail",
    stepNumber: 5,
    label: "Employee Detail",
    description: "Salary Breakdown",
    getPath: (runId, empId) =>
      runId && empId
        ? `/dashboard/payroll/runs/${runId}/employees/${empId}`
        : runId
        ? `/dashboard/payroll/runs/${runId}/preview`
        : "/dashboard/payroll",
  },
  {
    id: "review_approval",
    stepNumber: 6,
    label: "Review & Approval",
    description: "Governance Sign-off",
    getPath: (runId) => (runId ? `/dashboard/payroll/runs/${runId}/approval` : "/dashboard/payroll"),
  },
  {
    id: "finalization",
    stepNumber: 7,
    label: "Finalization",
    description: "Lock & Seal Pay Run",
    getPath: (runId) => (runId ? `/dashboard/payroll/runs/${runId}/finalize` : "/dashboard/payroll"),
  },
  {
    id: "payslips",
    stepNumber: 8,
    label: "Payslips",
    description: "Generation & Delivery",
    getPath: (runId, empId) =>
      runId && empId
        ? `/dashboard/payroll/runs/${runId}/employees/${empId}/payslip`
        : "/dashboard/payroll/payslips",
  },
  {
    id: "payment",
    stepNumber: 9,
    label: "Payment",
    description: "Disbursement & Bank",
    getPath: (runId, _empId, batchId) =>
      batchId
        ? `/dashboard/payroll/payments/${batchId}`
        : runId
        ? `/dashboard/payroll/runs/${runId}/payment`
        : "/dashboard/payroll/payments",
  },
] as const;

import {
  buildValidationIssues,
  generatePayrollEmployees,
  type PayrollEmployeeRow,
  type PayrollRowStatus,
  type ValidationIssue,
  type WorkflowStepId,
} from "../data/salaryProcessingData";

export type CycleStatus =
  | "idle"
  | "generating"
  | "draft"
  | "validating"
  | "in_review"
  | "locked"
  | "pending_approval"
  | "approved";

export interface PayrollRunSnapshot {
  cycleKey: string;
  month: string;
  year: string;
  payrollType: string;
  rows: PayrollEmployeeRow[];
  resolvedIssueIds: string[];
  currentStep: WorkflowStepId;
  completedSteps: WorkflowStepId[];
  cycleStatus: CycleStatus;
  savedAt: string;
}

const STORAGE_KEY = "aurix:payroll-runs:v1";
export const ENTERPRISE_EMPLOYEE_COUNT = 2847;
const SAMPLE_SIZE = 96;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function buildCycleKey(month: string, year: string, payrollType: string) {
  return `${month}-${year}-${payrollType}`;
}

export function buildCycleLabel(month: string, year: string, payrollType: string) {
  return `${month.slice(0, 3)} ${year} · ${payrollType}`;
}

export async function simulateSalaryRunGeneration(
  cycleKey: string,
  onProgress: (processed: number, total: number) => void,
): Promise<PayrollEmployeeRow[]> {
  const steps = 24;
  for (let i = 1; i <= steps; i += 1) {
    await delay(60 + Math.random() * 50);
    onProgress(Math.floor((ENTERPRISE_EMPLOYEE_COUNT * i) / steps), ENTERPRISE_EMPLOYEE_COUNT);
  }

  return generatePayrollEmployees(SAMPLE_SIZE, cycleKey).map((row) => ({
    ...row,
    payrollStatus: "draft" as PayrollRowStatus,
  }));
}

export async function simulateRevalidation(): Promise<void> {
  await delay(1200);
}

export function getActiveIssues(
  rows: PayrollEmployeeRow[],
  resolvedIssueIds: Set<string>,
): ValidationIssue[] {
  return buildValidationIssues(rows).filter((issue) => !resolvedIssueIds.has(issue.id));
}

export function resolveIssueForEmployee(
  rows: PayrollEmployeeRow[],
  issue: ValidationIssue,
): PayrollEmployeeRow[] {
  return rows.map((row) =>
    row.employeeId === issue.employeeId
      ? {
          ...row,
          validationStatus: "valid",
          payrollStatus: row.payrollStatus === "draft" ? "validated" : row.payrollStatus,
        }
      : row,
  );
}

export function applyValidatedStatuses(rows: PayrollEmployeeRow[]): PayrollEmployeeRow[] {
  return rows.map((row) => ({
    ...row,
    payrollStatus:
      row.validationStatus === "valid" && row.payrollStatus === "draft"
        ? "validated"
        : row.payrollStatus,
  }));
}

export function applyLockedStatuses(rows: PayrollEmployeeRow[]): PayrollEmployeeRow[] {
  return rows.map((row) => ({ ...row, payrollStatus: "locked" as PayrollRowStatus }));
}

export function applyApprovedStatuses(rows: PayrollEmployeeRow[]): PayrollEmployeeRow[] {
  return rows.map((row) => ({ ...row, payrollStatus: "approved" as PayrollRowStatus }));
}

export function computeCompletedSteps(
  cycleStatus: CycleStatus,
  hasRun: boolean,
  errorCount: number,
): WorkflowStepId[] {
  if (!hasRun) return [];

  const steps: WorkflowStepId[] = ["generate"];

  if (cycleStatus === "validating" || errorCount > 0) {
    return steps;
  }

  steps.push("validate");

  if (["in_review", "locked", "pending_approval", "approved"].includes(cycleStatus)) {
    steps.push("review");
  }

  if (["locked", "pending_approval", "approved"].includes(cycleStatus)) {
    steps.push("lock");
  }

  if (["pending_approval", "approved"].includes(cycleStatus)) {
    steps.push("approval");
  }

  if (cycleStatus === "approved") {
    steps.push("bank-transfer", "payslips");
  }

  return steps;
}

export function deriveCurrentStep(
  cycleStatus: CycleStatus,
  hasRun: boolean,
  errorCount: number,
): WorkflowStepId {
  if (!hasRun) return "generate";
  if (cycleStatus === "generating") return "generate";
  if (cycleStatus === "draft" || cycleStatus === "validating" || errorCount > 0) return "validate";
  if (cycleStatus === "in_review") return "review";
  if (cycleStatus === "locked") return "approval";
  if (cycleStatus === "pending_approval") return "bank-transfer";
  if (cycleStatus === "approved") return "payslips";
  return "validate";
}

export function derivePayrollStatusLabel(cycleStatus: CycleStatus): string {
  const labels: Record<CycleStatus, string> = {
    idle: "Not Started",
    generating: "Generating…",
    draft: "Draft",
    validating: "Validating",
    in_review: "In Review",
    locked: "Locked",
    pending_approval: "Pending Approval",
    approved: "Approved",
  };
  return labels[cycleStatus];
}

export function loadDraft(cycleKey: string): PayrollRunSnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const store = JSON.parse(raw) as Record<string, PayrollRunSnapshot>;
    return store[cycleKey] ?? null;
  } catch {
    return null;
  }
}

export function saveDraft(snapshot: PayrollRunSnapshot): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const store = raw ? (JSON.parse(raw) as Record<string, PayrollRunSnapshot>) : {};
    store[snapshot.cycleKey] = snapshot;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore storage failures in demo mode
  }
}

export function exportRowsToCsv(rows: PayrollEmployeeRow[], filename: string): void {
  const headers = [
    "Employee ID",
    "Name",
    "Department",
    "Designation",
    "Working Days",
    "Present Days",
    "OT Hours",
    "Bonus",
    "Deductions",
    "Gross",
    "Net",
    "Validation",
    "Status",
  ];
  const lines = rows.map((row) =>
    [
      row.employeeId,
      row.fullName,
      row.department,
      row.designation,
      row.workingDays,
      row.presentDays,
      row.overtimeHours,
      row.bonus,
      row.deductions,
      row.grossSalary,
      row.netSalary,
      row.validationStatus,
      row.payrollStatus,
    ].join(","),
  );
  const csv = [headers.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

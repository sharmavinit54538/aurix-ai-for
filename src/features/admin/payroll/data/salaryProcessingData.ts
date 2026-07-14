export type ValidationStatus = "valid" | "warning" | "error";
export type PayrollRowStatus = "draft" | "validated" | "locked" | "approved";
export type WorkflowStepId =
  | "generate"
  | "validate"
  | "review"
  | "lock"
  | "approval"
  | "bank-transfer"
  | "payslips";

export type IssueSeverity = "critical" | "warning" | "info";

export interface PayrollEmployeeRow {
  id: string;
  employeeId: string;
  fullName: string;
  department: string;
  designation: string;
  workingDays: number;
  presentDays: number;
  overtimeHours: number;
  bonus: number;
  deductions: number;
  grossSalary: number;
  netSalary: number;
  validationStatus: ValidationStatus;
  payrollStatus: PayrollRowStatus;
}

export interface ValidationIssue {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  severity: IssueSeverity;
  description: string;
}

export interface PayrollSummaryMetrics {
  totalEmployees: number;
  employeesProcessed: number;
  grossPayroll: number;
  netPayroll: number;
  totalDeductions: number;
  validationErrors: number;
  pendingReviews: number;
  payrollStatus: "Draft" | "Validating" | "In Review" | "Ready to Lock";
  bonusTotal: number;
  employerContribution: number;
  averageSalary: number;
}

const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Sales",
  "Marketing",
  "Finance",
  "Human Resources",
  "Operations",
  "Customer Success",
  "Legal",
  "Design",
];

const DESIGNATIONS = [
  "Software Engineer",
  "Senior Engineer",
  "Engineering Manager",
  "Product Manager",
  "Account Executive",
  "Marketing Specialist",
  "Financial Analyst",
  "HR Business Partner",
  "Operations Lead",
  "Customer Success Manager",
  "Legal Counsel",
  "UX Designer",
];

const FIRST_NAMES = [
  "Aisha", "Marcus", "Priya", "Daniel", "Sofia", "James", "Mei", "Omar",
  "Elena", "Raj", "Chloe", "David", "Fatima", "Noah", "Yuki", "Carlos",
  "Amara", "Ethan", "Leila", "Vikram", "Hannah", "Lucas", "Nadia", "Ben",
  "Ananya", "Michael", "Zara", "Thomas", "Grace", "Ahmed", "Isabella", "Ryan",
  "Keiko", "Samuel", "Maya", "Chris", "Olivia", "Arjun", "Emma", "Jordan",
];

const LAST_NAMES = [
  "Chen", "Williams", "Patel", "Okonkwo", "Martinez", "Thompson", "Kim",
  "Hassan", "Novak", "Sharma", "Brooks", "Nguyen", "Al-Rashid", "Fischer",
  "Tanaka", "Reyes", "Johnson", "Park", "Singh", "Dubois", "Anderson",
  "Silva", "Khan", "Murphy", "Yamamoto", "Garcia", "O'Brien", "Ali",
  "Robinson", "Lee", "Cohen", "Wright", "Das", "Miller", "Ibrahim", "Clark",
];

const ISSUE_TEMPLATES: Array<Omit<ValidationIssue, "id" | "employeeId" | "employeeName">> = [
  { type: "Missing Attendance", severity: "critical", description: "Attendance records incomplete for 3 working days." },
  { type: "Missing Bank Details", severity: "critical", description: "Primary bank account not configured for disbursement." },
  { type: "Salary Structure Missing", severity: "critical", description: "No active salary structure assigned for this cycle." },
  { type: "Duplicate Payroll", severity: "warning", description: "A payroll entry already exists for this employee in Jul 2026." },
  { type: "Salary Variance", severity: "warning", description: "Net salary deviates by 18% from the previous month." },
  { type: "Missing PAN", severity: "warning", description: "Tax identification (PAN) is not on file." },
  { type: "PF Details Missing", severity: "info", description: "Provident fund account number is pending verification." },
];

function hashSeed(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h << 5) - h + value.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function pick<T>(items: T[], seed: number, index: number) {
  return items[(seed + index) % items.length];
}

export function generatePayrollEmployees(count = 96): PayrollEmployeeRow[] {
  return Array.from({ length: count }, (_, index) => {
    const seed = hashSeed(`payroll-${index}`);
    const firstName = pick(FIRST_NAMES, seed, index);
    const lastName = pick(LAST_NAMES, seed, index + 3);
    const department = pick(DEPARTMENTS, seed, index + 7);
    const designation = pick(DESIGNATIONS, seed, index + 11);
    const workingDays = 22;
    const presentDays = workingDays - (seed % 4);
    const overtimeHours = seed % 9;
    const baseSalary = 4200 + (seed % 7800) + Math.floor(index / 12) * 120;
    const bonus = seed % 5 === 0 ? 250 + (seed % 800) : seed % 7 === 0 ? 150 : 0;
    const deductions = Math.round(baseSalary * (0.12 + (seed % 8) / 100)) + (seed % 3 === 0 ? 45 : 0);
    const grossSalary = baseSalary + bonus + overtimeHours * 28;
    const netSalary = grossSalary - deductions;

    const validationRoll = seed % 10;
    const validationStatus: ValidationStatus =
      validationRoll === 0 ? "error" : validationRoll <= 2 ? "warning" : "valid";

    const statusRoll = seed % 12;
    const payrollStatus: PayrollRowStatus =
      statusRoll === 0
        ? "approved"
        : statusRoll <= 2
          ? "locked"
          : statusRoll <= 5
            ? "validated"
            : "draft";

    return {
      id: `emp-${index + 1}`,
      employeeId: `EMP-${String(10000 + index).slice(1)}`,
      fullName: `${firstName} ${lastName}`,
      department,
      designation,
      workingDays,
      presentDays,
      overtimeHours,
      bonus,
      deductions,
      grossSalary,
      netSalary,
      validationStatus,
      payrollStatus,
    };
  });
}

export function buildValidationIssues(rows: PayrollEmployeeRow[]): ValidationIssue[] {
  return rows
    .filter((row) => row.validationStatus !== "valid")
    .slice(0, 18)
    .map((row, index) => {
      const template = ISSUE_TEMPLATES[index % ISSUE_TEMPLATES.length];
      return {
        id: `issue-${row.id}-${index}`,
        employeeId: row.employeeId,
        employeeName: row.fullName,
        ...template,
        severity:
          row.validationStatus === "error"
            ? "critical"
            : template.severity === "critical"
              ? "warning"
              : template.severity,
      };
    });
}

export function computeSummaryMetrics(rows: PayrollEmployeeRow[]): PayrollSummaryMetrics {
  const grossPayroll = rows.reduce((sum, row) => sum + row.grossSalary, 0);
  const netPayroll = rows.reduce((sum, row) => sum + row.netSalary, 0);
  const totalDeductions = rows.reduce((sum, row) => sum + row.deductions, 0);
  const bonusTotal = rows.reduce((sum, row) => sum + row.bonus, 0);
  const validationErrors = rows.filter((row) => row.validationStatus === "error").length;
  const pendingReviews = rows.filter(
    (row) => row.validationStatus !== "valid" || row.payrollStatus === "draft",
  ).length;
  const employeesProcessed = rows.filter((row) => row.payrollStatus !== "draft").length;

  return {
    totalEmployees: 2847,
    employeesProcessed,
    grossPayroll,
    netPayroll,
    totalDeductions,
    validationErrors,
    pendingReviews,
    payrollStatus: validationErrors > 0 ? "Validating" : "In Review",
    bonusTotal,
    employerContribution: Math.round(grossPayroll * 0.042),
    averageSalary: Math.round(netPayroll / rows.length),
  };
}

export function buildDepartmentPayroll(rows: PayrollEmployeeRow[]) {
  const map = new Map<string, number>();
  rows.forEach((row) => {
    map.set(row.department, (map.get(row.department) ?? 0) + row.netSalary);
  });
  return Array.from(map.entries())
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function buildSalaryComponents(rows: PayrollEmployeeRow[]) {
  const gross = rows.reduce((s, r) => s + r.grossSalary - r.bonus - r.overtimeHours * 28, 0);
  const bonus = rows.reduce((s, r) => s + r.bonus, 0);
  const overtime = rows.reduce((s, r) => s + r.overtimeHours * 28, 0);
  const deductions = rows.reduce((s, r) => s + r.deductions, 0);
  return [
    { name: "Base Salary", value: gross },
    { name: "Bonus", value: bonus },
    { name: "Overtime", value: overtime },
    { name: "Deductions", value: deductions },
  ];
}

export function buildPayrollDistribution(rows: PayrollEmployeeRow[]) {
  const buckets = [
    { range: "< $4K", min: 0, max: 4000, count: 0 },
    { range: "$4K–$6K", min: 4000, max: 6000, count: 0 },
    { range: "$6K–$8K", min: 6000, max: 8000, count: 0 },
    { range: "$8K–$10K", min: 8000, max: 10000, count: 0 },
    { range: "> $10K", min: 10000, max: Infinity, count: 0 },
  ];
  rows.forEach((row) => {
    const bucket = buckets.find((b) => row.netSalary >= b.min && row.netSalary < b.max);
    if (bucket) bucket.count += 1;
  });
  return buckets.map(({ range, count }) => ({ range, count }));
}

export function buildIssueBreakdown(issues: ValidationIssue[]) {
  const map = new Map<string, number>();
  issues.forEach((issue) => {
    map.set(issue.type, (map.get(issue.type) ?? 0) + 1);
  });
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

export const WORKFLOW_STEPS: Array<{ id: WorkflowStepId; label: string }> = [
  { id: "generate", label: "Generate Salary Run" },
  { id: "validate", label: "Validate Payroll" },
  { id: "review", label: "Review Payroll" },
  { id: "lock", label: "Lock Payroll" },
  { id: "approval", label: "Approval" },
  { id: "bank-transfer", label: "Bank Transfer" },
  { id: "payslips", label: "Payslips" },
];

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const PAYROLL_TYPES = ["Regular Monthly", "Off-Cycle", "Bonus Run", "Final Settlement"];

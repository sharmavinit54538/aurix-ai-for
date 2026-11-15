export type PayrollStatus =
  | "Draft"
  | "draft"
  | "Processing"
  | "processing"
  | "Validated"
  | "validated"
  | "Review"
  | "Under Review"
  | "Approved"
  | "approved"
  | "Finalized"
  | "finalized"
  | "Closed"
  | "Locked"
  | "Paid"
  | "paid"
  | "Failed"
  | "Cancelled"
  | string;

export interface PayrollPeriod {
  id: string;
  name: string;
  month?: string;
  year?: number;
  periodMonth?: number;
  periodYear?: number;
  startDate: string;
  endDate: string;
  payDate?: string;
  status: PayrollStatus;
  isCurrent?: boolean;
  isLocked?: boolean;
  totalEmployees?: number | null;
  employeeCount?: number | null;
  totalGrossPay?: number | null;
  totalNetPay?: number | null;
  runId?: string | null;
  remarks?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface PayrollRun {
  id: string;
  periodId: string;
  periodName?: string;
  status: PayrollStatus;
  employeeCount?: number | null;
  grossPayroll?: number | null;
  totalDeductions?: number | null;
  netPayroll?: number | null;
  employerCost?: number | null;
  runDate?: string | null;
  createdAt?: string | null;
}

export interface PayrollRunStep {
  id: string;
  name: string;
  status: string;
  details?: string | null;
}

export interface PayrollRunStatus {
  runId: string;
  jobId?: string | null;
  periodId?: string | null;
  periodName?: string | null;
  status: PayrollStatus;
  progress?: number | null;
  currentStep?: string | null;
  employees?: {
    total?: number | null;
    processed?: number | null;
    failed?: number | null;
  } | null;
  steps?: PayrollRunStep[];
  validationIssues?: PayrollValidationIssue[];
  error?: {
    message?: string;
    code?: string;
  } | null;
}

export interface PayrollValidationIssue {
  id: string;
  employeeId?: string;
  employeeName?: string;
  department?: string;
  severity: "error" | "critical" | "fatal" | "warning" | "advisory" | "info" | string;
  category?: string;
  component?: string;
  code?: string;
  message?: string;
  description?: string;
  blocking?: boolean;
  status?: string;
  resolved?: boolean;
  source?: string;
  resolution?: string;
  detectedAt?: string;
}

export interface PayrollValidationSummary {
  runId?: string;
  periodId?: string;
  periodName?: string;
  status?: PayrollStatus;
  totalIssues: number;
  errorsCount: number;
  warningsCount: number;
  infoCount?: number;
  blockingCount?: number;
  affectedEmployeesCount?: number;
  criticalIssues?: number;
  warnings?: number;
  resolvedIssues?: number;
  lastValidatedAt?: string | null;
  issues: PayrollValidationIssue[];
}

export interface PayrollEmployeeAttendance {
  workingDays?: number | null;
  paidDays?: number | null;
  presentDays?: number | null;
  leaveDays?: number | null;
  lopDays?: number | null;
  unpaidDays?: number | null;
  holidays?: number | null;
  weeklyOffs?: number | null;
  overtimeHours?: number | null;
}

export interface PayrollEmployeeEarnings {
  basic?: number | null;
  hra?: number | null;
  specialAllowance?: number | null;
  conveyance?: number | null;
  overtime?: number | null;
  bonus?: number | null;
  incentives?: number | null;
  allowances?: number | null;
  other?: number | null;
}

export interface PayrollEmployeeDeductions {
  pf?: number | null;
  esi?: number | null;
  pt?: number | null;
  tds?: number | null;
  incomeTax?: number | null;
  loan?: number | null;
  advance?: number | null;
  other?: number | null;
}

export interface PayrollEmployeeRecord {
  id: string;
  employeeId: string;
  name: string;
  role?: string;
  department?: string | null;
  designation?: string | null;
  employmentStatus?: string | null;
  joiningDate?: string | null;
  location?: string | null;
  periodName?: string | null;
  runStatus?: PayrollStatus | null;
  financialYear?: string | null;
  status: string;
  validationStatus?: "valid" | "warning" | "error" | string;
  issuesCount?: number;
  grossEarnings: number | null;
  totalDeductions: number | null;
  netPay: number | null;
  employerContribution?: number | null;
  attendance?: PayrollEmployeeAttendance | null;
  earnings?: PayrollEmployeeEarnings | null;
  deductions?: PayrollEmployeeDeductions | null;
  statutory?: {
    employee?: { epf?: number | null; esi?: number | null; pt?: number | null } | null;
    employer?: { epf?: number | null; esi?: number | null; eps?: number | null } | null;
  } | null;
  bankInfo?: {
    bankName?: string | null;
    accountNumber?: string | null;
    ifscCode?: string | null;
  } | null;
  salaryStructure?: {
    name?: string | null;
    effectiveDate?: string | null;
    basic?: number | null;
  } | null;
  ytd?: {
    gross?: number | null;
    deductions?: number | null;
    tax?: number | null;
    netPay?: number | null;
  } | null;
  previousComparison?: {
    previousGross?: number | null;
    currentGross?: number | null;
    previousNetPay?: number | null;
    currentNetPay?: number | null;
  } | null;
  issues?: PayrollValidationIssue[];
  audit?: {
    calculatedAt?: string | null;
    version?: string | null;
    lastRecalculatedAt?: string | null;
  } | null;
}

export interface PayrollPreviewEmployee extends PayrollEmployeeRecord {
  basicSalary?: number | null;
  basic?: number | null;
  hra?: number | null;
  allowances?: number | null;
  pf?: number | null;
  tax?: number | null;
  other_deductions?: number | null;
  days_worked?: number | null;
  lop_days?: number | null;
}

export interface PayrollSummaryMetrics {
  employeeCount: number | null;
  grossPayroll: number | null;
  totalEarnings?: number | null;
  totalDeductions: number | null;
  netPayroll: number | null;
  employerCost: number | null;
}

export interface PayrollPreviewData {
  runId: string;
  periodId?: string;
  periodName?: string;
  status: PayrollStatus;
  lastCalculatedAt?: string | null;
  summary: PayrollSummaryMetrics;
  validation?: {
    status?: string;
    totalIssues?: number;
    errorsCount?: number;
    warningsCount?: number;
    errors: PayrollValidationIssue[];
    warnings: PayrollValidationIssue[];
  } | null;
  employees?: PayrollPreviewEmployee[];
}

export interface PayrollAuditEntry {
  action: string;
  userName?: string | null;
  user?: string | null;
  comment?: string | null;
  timestamp?: string | null;
}

export interface PayrollReviewData {
  runId: string;
  periodId?: string;
  periodName?: string;
  status: PayrollStatus;
  lastUpdatedAt?: string | null;
  summary: PayrollSummaryMetrics;
  validation?: {
    status?: string | null;
    totalIssues?: number;
    errorsCount?: number;
    warningsCount?: number;
    blockingCount?: number | null;
    affectedEmployeesCount?: number;
  } | null;
  approval?: {
    status?: string | null;
    approvedBy?: string | null;
    approvedByName?: string | null;
    approvedAt?: string | null;
    rejectedBy?: string | null;
    rejectedByName?: string | null;
    rejectedAt?: string | null;
    rejectionReason?: string | null;
    comments?: string | null;
  } | null;
  auditLog?: PayrollAuditEntry[];
}

export interface PayrollFinalizationData {
  runId: string;
  periodId?: string;
  periodName?: string;
  status: PayrollStatus;
  isFinalized?: boolean;
  isLocked?: boolean;
  approvalStatus?: string | null;
  lastUpdatedAt?: string | null;
  summary: PayrollSummaryMetrics;
  validation?: {
    status?: string | null;
    errorsCount?: number;
    blockingCount?: number | null;
  } | null;
  approval?: {
    status?: string | null;
  } | null;
  finalization?: {
    finalizedBy?: string | null;
    finalizedByName?: string | null;
    finalizedAt?: string | null;
    referenceNumber?: string | null;
    finalizationNotes?: string | null;
  } | null;
}

export interface PayrollDashboardReadinessItem {
  id: string;
  label: string;
  status: "Ready" | "Warning" | "Error" | string;
  message?: string;
}

export interface PayrollDashboardData {
  period?: PayrollPeriod | null;
  active_run?: PayrollRun | null;
  status?: PayrollStatus;
  summary: PayrollSummaryMetrics;
  readiness?: {
    isReady: boolean;
    items: PayrollDashboardReadinessItem[];
  } | null;
  issues?: {
    errors: PayrollValidationIssue[];
    warnings: PayrollValidationIssue[];
  } | null;
  recentRuns: PayrollRun[];
}

export interface PayslipHistoryItem {
  id: string;
  runId?: string;
  employeeId?: string;
  employeeName?: string;
  payslipNumber?: string;
  periodName: string;
  month: string;
  year: number;
  netPay: number | null;
  grossPay?: number | null;
  totalDeductions?: number | null;
  status?: string;
  finalizedAt?: string;
  paymentDate?: string;
  downloadUrl?: string;
}

export interface PayrollPayslipData {
  id: string;
  runId: string;
  employeeId: string;
  employeeName?: string;
  payslipNumber?: string | null;
  referenceNumber?: string | null;
  status: PayrollStatus;
  isFinalized: boolean;
  periodName: string;
  financialYear?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  finalizedAt?: string | null;
  finalizedByName?: string | null;
  paymentDate?: string | null;
  netPay: number | null;
  netPayInWords?: string | null;
  employee: {
    id: string;
    name: string;
    department?: string | null;
    designation?: string | null;
    location?: string | null;
    joiningDate?: string | null;
    pan?: string | null;
    uan?: string | null;
    pfNumber?: string | null;
    esiNumber?: string | null;
    bankInfo?: {
      bankName?: string | null;
      accountNumber?: string | null;
      ifscCode?: string | null;
      accountHolderName?: string | null;
    } | null;
  };
  attendance: {
    workingDays: number | null;
    paidDays: number | null;
    presentDays: number | null;
    leaveDays: number | null;
    lopDays: number | null;
    holidays: number | null;
    weeklyOffs: number | null;
    overtimeHours: number | null;
  };
  earnings: {
    basic: number | null;
    hra: number | null;
    conveyance: number | null;
    specialAllowance: number | null;
    medicalAllowance: number | null;
    otherAllowances: number | null;
    overtime: number | null;
    bonus: number | null;
    incentives: number | null;
    arrears: number | null;
    reimbursements: number | null;
    otherEarnings: number | null;
    grossEarnings: number | null;
  };
  deductions: {
    pf: number | null;
    esi: number | null;
    pt: number | null;
    tds: number | null;
    loan: number | null;
    advance: number | null;
    otherDeductions: number | null;
    totalDeductions: number | null;
  };
  employerContributions?: {
    pf: number | null;
    esi: number | null;
    eps: number | null;
    edli: number | null;
  } | null;
  statutory?: {
    employerPf: number | null;
    employerEsi: number | null;
    eps: number | null;
    edli: number | null;
  } | null;
  ytd?: {
    grossEarnings: number | null;
    taxableIncome: number | null;
    tds: number | null;
    netPay: number | null;
  } | null;
  earningsBreakdown?: { name: string; amount: number }[];
  deductionsBreakdown?: { name: string; amount: number }[];
}

export interface PayslipItem {
  id: string;
  runId?: string;
  employeeId?: string;
  employeeName?: string;
  periodName?: string;
  netPay?: number | null;
  grossEarnings?: number | null;
  totalDeductions?: number | null;
  status?: string;
}

export interface PaymentBatch {
  id: string;
  runId?: string;
  batchNumber?: string;
  status: string;
  totalAmount?: number | null;
  employeeCount?: number | null;
  createdAt?: string | null;
}

export interface SalaryComponent {
  id: string;
  name: string;
  code: string;
  type: "earning" | "deduction" | "employer_contribution" | string;
  isTaxable?: boolean;
  isStatutory?: boolean;
}

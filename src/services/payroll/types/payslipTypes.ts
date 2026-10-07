export interface PayrollPayslipEmployeeInfo {
  id: string;
  name: string;
  department?: string | null;
  designation?: string | null;
  location?: string | null;
  joiningDate?: string | null;
  employmentStatus?: string | null;
  pan?: string | null;
  uan?: string | null;
  pfNumber?: string | null;
  esiNumber?: string | null;
  bankInfo?: {
    bankName?: string | null;
    accountNumber?: string | null;
    ifscCode?: string | null;
    paymentMode?: string | null;
  } | null;
}

export interface PayrollPayslipEarnings {
  basic?: number | null;
  hra?: number | null;
  conveyance?: number | null;
  specialAllowance?: number | null;
  medicalAllowance?: number | null;
  otherAllowances?: number | null;
  overtime?: number | null;
  bonus?: number | null;
  incentives?: number | null;
  arrears?: number | null;
  reimbursements?: number | null;
  otherEarnings?: number | null;
  grossEarnings?: number | null;
  components?: Array<{
    name: string;
    amount: number | null;
    type?: string | null;
    frequency?: string | null;
  }>;
}

export interface PayrollPayslipDeductions {
  pf?: number | null;
  esi?: number | null;
  pt?: number | null;
  tds?: number | null;
  loan?: number | null;
  advance?: number | null;
  otherDeductions?: number | null;
  totalDeductions?: number | null;
  components?: Array<{
    name: string;
    amount: number | null;
    type?: string | null;
  }>;
}

export interface PayrollPayslipStatutory {
  employeePf?: number | null;
  employerPf?: number | null;
  employeeEsi?: number | null;
  employerEsi?: number | null;
  pt?: number | null;
  tds?: number | null;
  eps?: number | null;
  edli?: number | null;
  other?: Record<string, unknown> | number | null;
}

export interface PayrollPayslipEmployerContributions {
  pf?: number | null;
  esi?: number | null;
  eps?: number | null;
  edli?: number | null;
  total?: number | null;
  components?: Array<{ name: string; amount: number | null }>;
}

export interface PayrollPayslipAttendance {
  workingDays?: number | null;
  paidDays?: number | null;
  lopDays?: number | null;
  leaveDays?: number | null;
  presentDays?: number | null;
  holidays?: number | null;
  weeklyOffs?: number | null;
  overtimeHours?: number | null;
  [key: string]: unknown;
}

export interface PayrollPayslipYTD {
  grossEarnings?: number | null;
  taxableIncome?: number | null;
  tds?: number | null;
  employeePf?: number | null;
  employerPf?: number | null;
  esi?: number | null;
  netPay?: number | null;
  [key: string]: unknown;
}

export interface PayrollPayslipDocument {
  pdfUrl?: string | null;
  downloadUrl?: string | null;
  documentId?: string | null;
  hasDocument?: boolean;
  mimeType?: string | null;
}

export interface PayrollPayslipData {
  id: string;
  runId: string;
  employeeId: string;
  payslipNumber?: string | null;
  referenceNumber?: string | null;
  periodName?: string | null;
  periodId?: string | null;
  financialYear?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  paymentDate?: string | null;
  finalizedAt?: string | null;
  finalizedByName?: string | null;
  status: string;
  isFinalized: boolean;
  isLocked?: boolean;
  employee: PayrollPayslipEmployeeInfo;
  attendance: PayrollPayslipAttendance;
  earnings: PayrollPayslipEarnings;
  deductions: PayrollPayslipDeductions;
  statutory?: PayrollPayslipStatutory | null;
  employerContributions?: PayrollPayslipEmployerContributions | null;
  netPay: number | null;
  netPayInWords?: string | null;
  salaryStructure?: {
    name?: string | null;
    effectiveDate?: string | null;
    components?: Record<string, unknown> | null;
  } | null;
  ytd?: PayrollPayslipYTD | null;
  document?: PayrollPayslipDocument | null;
  notes?: string | null;
  [key: string]: unknown;
}

export interface PayslipHistoryItem {
  id: string;
  runId?: string | null;
  employeeId?: string | null;
  employeeName?: string | null;
  department?: string | null;
  periodName?: string | null;
  financialYear?: string | null;
  payslipNumber?: string | null;
  netPay?: number | null;
  grossEarnings?: number | null;
  totalDeductions?: number | null;
  status?: string | null;
  isFinalized?: boolean;
  finalizedAt?: string | null;
  paymentDate?: string | null;
  hasDocument?: boolean;
  [key: string]: unknown;
}

export interface GeneratePayslipsPayload {
  employeeIds?: string[];
  force?: boolean;
  format?: "pdf" | "html" | string;
}

export interface GeneratePayslipsResponse {
  success: boolean;
  message?: string;
  generatedCount?: number;
  totalCount?: number;
  documentIds?: string[];
  [key: string]: unknown;
}
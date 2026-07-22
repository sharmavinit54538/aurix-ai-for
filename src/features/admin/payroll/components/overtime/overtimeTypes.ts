export type OvertimeCategory =
  | "Regular Overtime"
  | "Weekend Overtime"
  | "Holiday Overtime"
  | "Night Shift"
  | "Emergency Overtime"
  | "On Call"
  | "Double Pay"
  | "Triple Pay"
  | "Custom Categories";

export type ApprovalStatus =
  | "PENDING_MANAGER"
  | "PENDING_HR"
  | "PENDING_PAYROLL"
  | "PENDING_FINANCE"
  | "APPROVED"
  | "REJECTED";

export type PayrollStatus = "UNPAID" | "SCHEDULED_PAYROLL" | "PAID";

export type CalculationMethod = "MULTIPLIER" | "HOURLY_RATE" | "FIXED" | "FORMULA";

export type ShiftName =
  | "Morning Shift"
  | "Evening Shift"
  | "Night Shift"
  | "Rotational Shift"
  | "Custom Shift";

export interface ApprovalStep {
  role: "Employee" | "Reporting Manager" | "HR Manager" | "Payroll Admin" | "Finance Manager";
  name: string;
  avatar?: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  timestamp?: string;
  comment?: string;
}

export interface OvertimeRecord {
  id: string;
  requestCode: string; // e.g. "OT-2026-701"
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  avatar?: string;
  department: string;
  designation: string;
  location: string;
  shift: ShiftName;
  date: string;
  clockIn: string; // e.g. "09:00 AM"
  clockOut: string; // e.g. "09:30 PM"
  scheduledHours: number; // e.g. 8.0
  workedHours: number; // e.g. 11.5
  breakHours: number; // e.g. 1.0
  overtimeHours: number; // e.g. 2.5
  category: OvertimeCategory;
  calculationMethod: CalculationMethod;
  hourlyRate: number; // e.g. ₹450/hr
  multiplier: number; // e.g. 1.5x, 2.0x, 3.0x
  overtimeAmount: number;
  approvalStatus: ApprovalStatus;
  payrollStatus: PayrollStatus;
  payrollCycle?: string;
  approvalStage: "EMPLOYEE" | "MANAGER" | "HR" | "PAYROLL" | "FINANCE" | "PROCESSED";
  approvalWorkflow: ApprovalStep[];
  createdOn: string;
  updatedOn: string;
  createdBy: string;
}

export interface OvertimeSummaryKPIs {
  totalOvertimeHours: number;
  approvedHours: number;
  pendingRequests: number;
  rejectedRequests: number;
  totalOvertimeCost: number;
  averageOtHours: number;
  weekendOvertimeHours: number;
  holidayOvertimeHours: number;
  nightShiftHours: number;
  complianceAlerts: number;
}

export interface OvertimeFilters {
  search: string;
  employee: string;
  employeeId: string;
  department: string;
  designation: string;
  location: string;
  shift: string;
  manager: string;
  payrollCycle: string;
  approvalStatus: string;
  compensationStatus: string;
  overtimeType: string;
  page: number;
  limit: number;
  sortBy: string;
  sortDir: "asc" | "desc";
}

export interface OvertimeAuditLog {
  id: string;
  overtimeId: string;
  requestCode: string;
  action: "CREATE" | "APPROVE" | "REJECT" | "RECALCULATE" | "SYNC_ATTENDANCE" | "ADD_PAYROLL";
  actorName: string;
  actorRole: string;
  timestamp: string;
  details: string;
  ipAddress: string;
}

export interface OvertimeAIInsight {
  id: string;
  title: string;
  type: "BURNOUT_DETECTION" | "ABNORMAL_OVERTIME" | "COST_FORECAST" | "COMPLIANCE_RISK" | "ATTENDANCE_ANOMALY";
  severity: "CRITICAL" | "WARNING" | "INFO" | "SUCCESS";
  employeeName?: string;
  description: string;
  impactMetric: string;
  recommendation: string;
}

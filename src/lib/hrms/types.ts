export type ID = string;

export type TimelineEventKind =
  | "joining"
  | "promotion"
  | "department-change"
  | "salary-revision"
  | "attendance"
  | "leave"
  | "performance"
  | "training"
  | "certification"
  | "award"
  | "warning"
  | "project"
  | "exit";

export interface TimelineEvent {
  id: ID;
  employeeId: ID;
  employeeName: string;
  kind: TimelineEventKind;
  title: string;
  description?: string;
  date: string; // ISO
  meta?: Record<string, string | number>;
}

export type AssetStatus = "available" | "assigned" | "under-repair" | "lost" | "expired" | "retired";
export type AssetCategory = "laptop" | "desktop" | "monitor" | "phone" | "accessory" | "vehicle" | "other";

export interface AssetAssignmentHistory {
  id: string;
  employee: string;
  department: string;
  assignDate: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  notes?: string;
}

export interface AssetMaintenanceRecord {
  id: string;
  requestDate: string;
  serviceDate: string;
  vendor: string;
  cost: number;
  notes?: string;
}

export interface AssetTimelineEvent {
  id: string;
  event: 'Created' | 'Assigned' | 'Returned' | 'Transferred' | 'Repaired' | 'Lost' | 'Retired';
  performedBy: string;
  timestamp: string;
  notes?: string;
}

export interface Asset {
  id: ID;
  tag: string;
  name: string;
  category: AssetCategory;
  serial: string;
  vendor: string;
  purchaseDate: string;
  warrantyUntil: string;
  status: AssetStatus;
  assignedTo?: string;
  assignedAt?: string;
  nextMaintenance?: string;
  notes?: string;
  brand?: string;
  model?: string;
  purchaseCost?: number;
  location?: string;
  description?: string;
  imageUrl?: string;
  assignmentHistory?: AssetAssignmentHistory[];
  maintenanceHistory?: AssetMaintenanceRecord[];
  timeline?: AssetTimelineEvent[];
}

export type VisitorStatus = "pending" | "approved" | "checked-in" | "checked-out" | "rejected";

export interface Visitor {
  id: ID;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  hostEmployee: string;
  purpose: string;
  expectedDurationMins: number;
  checkInAt?: string;
  checkOutAt?: string;
  status: VisitorStatus;
  passCode: string;
  createdAt: string;
}

export type ExpenseStatus = "pending" | "approved" | "rejected" | "paid" | "changes-requested";
export type ExpenseCategory = "travel" | "meals" | "lodging" | "supplies" | "training" | "client" | "other";

export interface Expense {
  id: ID;
  employee: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  date: string;
  description: string;
  receiptName?: string;
  status: ExpenseStatus;
  managerNote?: string;
  paidAt?: string;
  submittedAt: string;
}

export type TravelStatus =
  | "draft"
  | "manager-review"
  | "hr-review"
  | "finance-review"
  | "approved"
  | "rejected";

export interface TravelRequest {
  id: ID;
  employee: string;
  type: "domestic" | "international";
  purpose: string;
  destination: string;
  travelDate: string;
  returnDate: string;
  hotel?: string;
  transportation?: string;
  budget: number;
  currency: string;
  status: TravelStatus;
  history: { stage: TravelStatus; at: string; note?: string }[];
  createdAt: string;
}

export interface ExitChecklistItem {
  key: string;
  label: string;
  done: boolean;
  doneAt?: string;
}

export interface ExitApprovalHistory {
  stage: 'manager' | 'hr';
  status: 'approved' | 'rejected';
  approver: string;
  timestamp: string;
  comments?: string;
}

export interface ExitAssetReturn {
  id: string;
  assetId: string;
  assetName: string;
  category: string;
  serial: string;
  status: 'pending' | 'returned' | 'damaged' | 'missing';
  returnDate?: string;
  condition?: string;
  remarks?: string;
}

export interface ExitDepartmentClearance {
  department: 'HR' | 'IT' | 'Finance' | 'Admin' | 'Manager';
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  comments?: string;
}

export interface ExitSettlementDetails {
  pendingSalary: number;
  leaveEncashment: number;
  bonus: number;
  incentives: number;
  deductions: number;
  assetRecovery: number;
  totalAmount: number;
  status: 'pending' | 'approved' | 'paid';
}

export interface ExitInterviewDetails {
  reason: string;
  rating: number;
  managerFeedback: string;
  companyFeedback: string;
  suggestions: string;
}

export interface ExitTimelineEvent {
  id: string;
  event: string;
  performedBy: string;
  timestamp: string;
  notes?: string;
}

export type ExitStage = string;

export interface ExitCase {
  id: ID;
  employee: string;
  role: string;
  resignedAt: string;
  noticeDays: number;
  lastWorkingDay: string;
  reason: string;
  stage: ExitStage | 'requested' | 'under-review' | 'approved' | 'clearance' | 'settlement' | 'completed' | 'cancelled';
  checklist: ExitChecklistItem[];
  exitInterview?: string;
  finalSettlement?: number;
  documents: { name: string; issued: boolean }[];
  employeeId?: string;
  department?: string;
  designation?: string;
  joiningDate?: string;
  managerName?: string;
  remainingDays?: number;
  managerApprovalStatus?: 'pending' | 'approved' | 'rejected';
  hrApprovalStatus?: 'pending' | 'approved' | 'rejected';
  managerComments?: string;
  hrComments?: string;
  rejectionReason?: string;
  approvalHistory?: ExitApprovalHistory[];
  assignedAssets?: ExitAssetReturn[];
  clearanceWorkflow?: ExitDepartmentClearance[];
  settlementDetails?: ExitSettlementDetails;
  interviewDetails?: ExitInterviewDetails;
  timeline?: ExitTimelineEvent[];
}

export interface OnboardingTask {
  key: string;
  label: string;
  done: boolean;
  owner: string;
}

export interface OnboardingCase {
  id: ID;
  employee: string;
  role: string;
  joinDate: string;
  manager: string;
  tasks: OnboardingTask[];
}

export interface OffboardingCase {
  id: ID;
  employee: string;
  lastWorkingDay: string;
  status: "in-progress" | "completed";
  tasks: OnboardingTask[];
  documents: { name: string; ready: boolean }[];
}

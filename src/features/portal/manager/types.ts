// ============================================================
// Aurix HR — Manager Dashboard — Type Definitions
// ============================================================

export interface ManagerKpi {
  id: string;
  label: string;
  value: string | number;
  change: string;
  changeType: "up" | "down" | "neutral";
  accent: string;
  bgAccent: string;
  spark: { v: number }[];
}

export type EmployeeStatus = "present" | "absent" | "leave" | "wfh" | "late";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: EmployeeStatus;
  avatar: string;
  location: "office" | "remote";
  performanceScore: number;
  joinDate: string;
}

export interface AttendanceRecord {
  id: string;
  name: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "present" | "late" | "wfh" | "absent" | "half-day";
  regularisationRequired: boolean;
  overtime?: string;
}

export interface LeaveRequest {
  id: string;
  name: string;
  type: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
  urgent: boolean;
}

export interface GoalProgress {
  id?: string;
  goal: string;
  owner: string;
  progress: number;
  dueDate: string;
  priority: "high" | "medium" | "low";
}

export interface HiringRequest {
  id: string;
  role: string;
  department: string;
  status: "pending" | "approved" | "interviewing" | "offer";
  applicants: number;
  targetDate: string;
  priority: "high" | "medium" | "low";
}

export interface ManagerNotification {
  id: string;
  type: "approval" | "joiner" | "exit" | "document" | "alert";
  title: string;
  detail: string;
  time: string;
  urgent: boolean;
}

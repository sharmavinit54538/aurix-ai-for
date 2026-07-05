// ============================================================
// Aurix HR — Manager Dashboard — Data Schema
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

export const MANAGER_KPI: ManagerKpi[] = [];

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

export const TEAM_MEMBERS: TeamMember[] = [];
export const DEPT_DISTRIBUTION: any[] = [];
export const ATTENDANCE_SUMMARY: any[] = [];
export const WEEKLY_TEAM_ATTENDANCE: any[] = [];

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

export const ATTENDANCE_RECORDS: AttendanceRecord[] = [];

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

export const LEAVE_REQUESTS: LeaveRequest[] = [];

export interface GoalProgress {
  id?: string;
  goal: string;
  owner: string;
  progress: number;
  dueDate: string;
  priority: "high" | "medium" | "low";
}

export const TEAM_GOALS: GoalProgress[] = [];
export const PERF_MONTHLY: any[] = [];
export const TOP_PERFORMERS: any[] = [];
export const LOW_PERFORMERS: any[] = [];

export interface HiringRequest {
  id: string;
  role: string;
  department: string;
  status: "pending" | "approved" | "interviewing" | "offer";
  applicants: number;
  targetDate: string;
  priority: "high" | "medium" | "low";
}

export const HIRING_REQUESTS: HiringRequest[] = [];
export const MANAGER_INTERVIEWS: any[] = [];
export const CANDIDATE_PIPELINE: any[] = [];
export const TEAM_ASSET_SUMMARY: any[] = [];
export const TEAM_ASSETS: any[] = [];
export const AI_TEAM_INSIGHTS: any[] = [];

export interface ManagerNotification {
  id: string;
  type: "approval" | "joiner" | "exit" | "document" | "alert";
  title: string;
  detail: string;
  time: string;
  urgent: boolean;
}

export const MANAGER_NOTIFICATIONS: ManagerNotification[] = [];

export const MANAGER_REPORTS = [
  { label: "Team Attendance", color: "from-teal-600 to-cyan-600", link: "/dashboard/attendance" },
  { label: "Team Performance", color: "from-violet-600 to-purple-600", link: "/dashboard/performance" },
  { label: "Leave Summary", color: "from-amber-600 to-orange-600", link: "/dashboard/leaves" },
  { label: "Productivity", color: "from-blue-600 to-indigo-600", link: "/dashboard/reports" },
  { label: "Hiring Status", color: "from-emerald-600 to-teal-600", link: "/dashboard/recruitment" },
  { label: "Asset Report", color: "from-slate-600 to-gray-700", link: "/dashboard/assets" },
];

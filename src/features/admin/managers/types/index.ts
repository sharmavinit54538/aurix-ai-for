// ─── Manager Types ───────────────────────────────────────────────────────────

export type ManagerStatus = "PROBATION" | "CONFIRMED" | "NOTICE_PERIOD";
export type EmploymentType = "full_time" | "part_time" | "contract" | "intern";
export type ManagerRole = "team_lead" | "senior_manager" | "department_head" | "vp" | "director" | "c_level";
export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export interface ManagerPermissions {
  canApproveLeave: boolean;
  canApproveAttendance: boolean;
  canManageEmployees: boolean;
  canViewPayroll: boolean;
  canEditDepartments: boolean;
  canInviteUsers: boolean;
  canManageRecruitment: boolean;
  canManagePerformance: boolean;
}

export interface Manager {
  id: string;
  /** Business manager code from API `manager_id` (e.g. MGR-202607-0009). */
  managerId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  gender: Gender;
  profileImage?: string;
  department: string;
  designation: string;
  managerRole: ManagerRole;
  reportingManagerId: string | null;
  /** Reporting manager business code from API `reportingManagerId` (e.g. MGR-101). */
  reportingManagerCode: string;
  reportingManagerName: string;
  office: string;
  workLocation: "on_site" | "remote" | "hybrid";
  joiningDate: string;
  employmentType: EmploymentType;
  bloodGroup: string;
  maritalStatus: string;
  shift: string;
  salary?: number;
  status: ManagerStatus;
  teamSize: number;
  teamIds: string[];
  permissions: ManagerPermissions;
  lastActive: string;
  // Profile drawer extras
  attendanceSummary: { present: number; absent: number; late: number; leave: number };
  leaveBalance: { annual: number; sick: number; casual: number };
  performanceScore: number;
  recentActivity: { id: string; action: string; timestamp: string }[];
}

export interface ManagerFilters {
  department: string;
  status: string;
  employmentType: string;
  office: string;
  teamSize: string;
  joiningFrom: string;
  joiningTo: string;
}

export type SortField = "fullName" | "department" | "teamSize" | "joiningDate" | "lastActive" | "status";
export type SortDir = "asc" | "desc";

export interface ImportRow {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: string;
  [key: string]: string;
}

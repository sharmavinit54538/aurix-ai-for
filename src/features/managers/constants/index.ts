import type {
  Manager,
  ManagerPermissions,
  ManagerFilters,
} from "../types";

// ─── Default Permission Set ───────────────────────────────────────────────────
export const DEFAULT_PERMISSIONS: ManagerPermissions = {
  canApproveLeave: true,
  canApproveAttendance: true,
  canManageEmployees: true,
  canViewPayroll: false,
  canEditDepartments: false,
  canInviteUsers: false,
  canManageRecruitment: false,
  canManagePerformance: true,
};

// ─── Select Options ───────────────────────────────────────────────────────────
export const DEPARTMENTS = [
  "Engineering", "Product", "Design", "Marketing", "Sales",
  "HR", "Finance", "Operations", "Legal", "Customer Success",
  "Data & Analytics", "IT Infrastructure",
];

export const OFFICES = [
  "San Francisco HQ", "Bengaluru Tech Park", "London Office",
  "Singapore Hub", "New York Branch", "Dubai Office", "Remote",
];

export const SHIFTS = [
  "General (9 AM – 6 PM)", "Morning (6 AM – 3 PM)",
  "Evening (3 PM – 12 AM)", "Night (12 AM – 9 AM)", "Flexible",
];

export const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "on_leave", label: "On Leave" },
  { value: "probation", label: "Probation" },
];

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "intern", label: "Intern" },
];

export const MANAGER_ROLE_OPTIONS = [
  { value: "team_lead", label: "Team Lead" },
  { value: "senior_manager", label: "Senior Manager" },
  { value: "department_head", label: "Department Head" },
  { value: "vp", label: "Vice President" },
  { value: "director", label: "Director" },
  { value: "c_level", label: "C-Level" },
];

export const WORK_LOCATION_OPTIONS = [
  { value: "on_site", label: "On Site" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
];

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

export const TEAM_SIZE_FILTER_OPTIONS = [
  { value: "all", label: "Any Size" },
  { value: "1-5", label: "1–5 members" },
  { value: "6-10", label: "6–10 members" },
  { value: "11-20", label: "11–20 members" },
  { value: "20+", label: "20+ members" },
];

export const PERMISSION_LABELS: Record<keyof ManagerPermissions, string> = {
  canApproveLeave: "Can approve leave",
  canApproveAttendance: "Can approve attendance",
  canManageEmployees: "Can manage employees",
  canViewPayroll: "Can view payroll",
  canEditDepartments: "Can edit departments",
  canInviteUsers: "Can invite users",
  canManageRecruitment: "Can manage recruitment",
  canManagePerformance: "Can manage performance",
};

export const DEFAULT_FILTERS: ManagerFilters = {
  department: "all",
  status: "all",
  employmentType: "all",
  office: "all",
  teamSize: "all",
  joiningFrom: "",
  joiningTo: "",
};

// ─── Seed Data ────────────────────────────────────────────────────────────────
export const SEED_MANAGERS: Manager[] = [];

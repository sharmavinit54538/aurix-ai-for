import type {
  Manager,
  ManagerPermissions,
  ManagerFilters,
} from "../types";
import type { ManagerFormState } from "../managersTypes";

// ─── Default Permission Set ───────────────────────────────────────────────────
export const DEFAULT_PERMISSIONS: ManagerPermissions = {
  canApproveLeave: false,
  canApproveAttendance: false,
  canManageEmployees: false,
  canViewPayroll: false,
  canEditDepartments: false,
  canInviteUsers: false,
  canManageRecruitment: false,
  canManagePerformance: false,
};

export const DEFAULT_MANAGER_FORM_STATE: ManagerFormState = {
  first_name: "",
  last_name: "",
  personal_email: "",
  phone: "",
  reporting_to: "",
  department: "",
  designation: "",
  joining_date: "",
  profile_photo_url: "",
  gender: "",
  date_of_birth: "",
  company_email: "",
  alternate_phone: "",
  blood_group: "",
  marital_status: "",
  branch: "",
  work_location: "",
  employment_type: "FULL_TIME",
  employment_status: "PROBATION",
  shift: "General",
  probation_period_months: 0,
  ctc: 0,
  basic_salary: 0,
  hra: 0,
  bonus: 0,
  pf: 0,
  esi: 0,
  professional_tax: 0,
  role: "manager",
  leave_group: "",
  permissions: {
    can_approve_leave: false,
    can_approve_attendance: false,
    can_manage_employees: false,
    can_view_payroll: false,
    can_edit_departments: false,
    can_invite_users: false,
    can_manage_recruitment: false,
    can_manage_performance: false
  },
  addresses: [],
  documents: [],
  education: [],
  experience: [],
  skills: [],
  emergency_contacts: [],
};

// ─── Select Options ───────────────────────────────────────────────────────────
export const DEPARTMENTS = [
  {
    value: "Management",
    label: "Management",
  },
  {
    value: "Engineering",
    label: "Engineering",
    options: ["Developer", "Tester", "Designer"],
  },
  {
    value: "Sales&Marketing",
    label: "Sales & Marketing",
  },
  {
    value: "Core",
    label: "Core",
    options: ["CEO", "CTO", "Director", "CPO", "CMO"],
  },
];

export const OFFICES = [
  "San Francisco HQ", "Bengaluru Tech Park", "London Office",
  "Singapore Hub", "New York Branch", "Dubai Office", "Remote",
];

export const SHIFT_OPTIONS = [
  { value: "General", label: "General (9 AM – 6 PM)" },
  { value: "Morning", label: "Morning (6 AM – 3 PM)" },
  { value: "Evening", label: "Evening (3 PM – 12 AM)" },
  { value: "Night", label: "Night (12 AM – 9 AM)" },
  { value: "Flexible", label: "Flexible" },
] as const;

/** Shift values for API payloads and legacy imports */
export const SHIFTS = SHIFT_OPTIONS.map((opt) => opt.value);


export const STATUS_OPTIONS = [
  { value: "PROBATION", label: "Probation" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "NOTICE_PERIOD", label: "Notice Period" },
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

export const MANAGER_FORM_EMPLOYMENT_TYPE_OPTIONS = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERN", label: "Intern" },
] as const;

export const MANAGER_FORM_WORK_LOCATION_OPTIONS = [
  { value: "ON_SITE", label: "On Site" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
] as const;

export const MANAGER_FORM_PERMISSION_FIELDS = [
  { key: "can_approve_leave", label: "Can approve leave" },
  { key: "can_approve_attendance", label: "Can approve attendance" },
  { key: "can_manage_employees", label: "Can manage employees" },
  { key: "can_view_payroll", label: "Can view payroll" },
  { key: "can_edit_departments", label: "Can edit departments" },
  { key: "can_invite_users", label: "Can invite users" },
  { key: "can_manage_recruitment", label: "Can manage recruitment" },
  { key: "can_manage_performance", label: "Can manage performance" },
] as const;

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

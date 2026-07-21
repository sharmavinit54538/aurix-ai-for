import type { Manager, ManagerFilters, SortDir, SortField } from "../types";
import type { ManagerFormState } from "../managersTypes";
import { DEFAULT_MANAGER_FORM_STATE, GENDER_OPTIONS, SHIFT_OPTIONS } from "../constants";
import { resolveDepartmentValue } from "@/features/admin/employees/utils/departmentOptions";

// ─── Validators ───────────────────────────────────────────────────────────────
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return phone.trim().length >= 7;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateManagerForm(
  form: ManagerFormState,
  existingManagers: Manager[],
  isEdit: boolean,
  editingId?: string,
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!form.first_name?.trim()) errors.first_name = "First name is required";
  if (!form.last_name?.trim()) errors.last_name = "Last name is required";
  if (!form.personal_email?.trim()) errors.personal_email = "Email is required";
  else if (!validateEmail(form.personal_email)) errors.personal_email = "Invalid email address";
  if (!form.phone?.trim()) errors.phone = "Phone is required";
  else if (!validatePhone(form.phone)) errors.phone = "Invalid phone number";
  if (!form.department?.trim()) errors.department = "Department is required";
  if (!form.designation?.trim()) errors.designation = "Designation is required";
  if (!form.date_of_birth?.trim()) errors.date_of_birth = "Date of birth is required";
  if (!form.gender?.trim()) errors.gender = "Gender is required";
  if (!form.branch?.trim()) errors.branch = "Office location is required";
  if (!form.work_location?.trim()) errors.work_location = "Work location is required";
  if (!form.joining_date?.trim()) errors.joining_date = "Joining date is required";

  if (form.personal_email) {
    const dup = existingManagers.find(
      (m) =>
        m.email.toLowerCase() === form.personal_email.toLowerCase() &&
        (!isEdit || m.id !== editingId),
    );
    if (dup) errors.personal_email = "Email already registered";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

const EMPLOYMENT_TYPE_FROM_MANAGER: Record<Manager["employmentType"], string> = {
  full_time: "FULL_TIME",
  part_time: "PART_TIME",
  contract: "CONTRACT",
  intern: "INTERN",
};

function resolveShiftValue(shift: string): string {
  const match = SHIFT_OPTIONS.find((opt) => opt.value === shift || opt.label === shift);
  return match?.value ?? shift;
}

/** Normalizes API gender strings (e.g. `"FEMALE"`) to form option values (e.g. `"female"`). */
export function resolveGenderValue(gender?: string | null): string {
  if (!gender?.trim()) return "";

  const normalized = gender.trim().toLowerCase().replace(/\s+/g, "_");
  const match = GENDER_OPTIONS.find(
    (opt) =>
      opt.value === normalized ||
      opt.label.toLowerCase().replace(/\s+/g, "_") === normalized,
  );
  return match?.value ?? normalized;
}

const WORK_LOCATION_FROM_MANAGER: Record<Manager["workLocation"], string> = {
  on_site: "ON_SITE",
  remote: "REMOTE",
  hybrid: "HYBRID",
};

/** Normalizes API date strings to `YYYY-MM-DD` for HTML date inputs. */
export function toDateInputValue(value?: string | null): string {
  if (!value?.trim()) return "";

  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const isoDate = trimmed.split("T")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return isoDate;

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }

  return trimmed;
}

/** Reads a display/id string from API scalars or nested `{ id, name, label, value }` objects. */
export function readApiScalar(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }
  if (typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    return String(
      obj.name ??
        obj.label ??
        obj.title ??
        obj.value ??
        obj.code ??
        obj.id ??
        obj.user_id ??
        obj.employee_id ??
        "",
    ).trim();
  }
  return "";
}

/** Flattens common nested API envelopes (`employee`, `user`, `manager`, etc.). */
export function unwrapManagerApiRecord(raw: Record<string, unknown>): Record<string, unknown> {
  const nested = raw.employee ?? raw.user ?? raw.manager ?? raw.profile ?? raw.data;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    return { ...raw, ...(nested as Record<string, unknown>) };
  }
  return raw;
}

function resolveGenderFromApi(value: unknown): string {
  return resolveGenderValue(readApiScalar(value));
}

function resolveDepartmentFromApi(raw: Record<string, unknown>): string {
  const candidate =
    readApiScalar(raw.department) ||
    readApiScalar(raw.department_name) ||
    readApiScalar(raw.departmentName);
  return resolveDepartmentValue(candidate) ?? candidate;
}

function resolveBranchFromApi(raw: Record<string, unknown>): string {
  return (
    readApiScalar(raw.branch) ||
    readApiScalar(raw.branch_name) ||
    readApiScalar(raw.office) ||
    readApiScalar(raw.office_location) ||
    readApiScalar(raw.officeLocation) ||
    ""
  );
}

function resolveWorkLocationFormValue(raw: Record<string, unknown>): string {
  const value = readApiScalar(raw.work_location ?? raw.workLocation);
  if (!value) return "";

  const normalized = value.toLowerCase().replace(/[\s-]+/g, "_");
  const map: Record<string, string> = {
    on_site: "ON_SITE",
    onsite: "ON_SITE",
    remote: "REMOTE",
    wfh: "REMOTE",
    work_from_home: "REMOTE",
    hybrid: "HYBRID",
  };

  if (map[normalized]) return map[normalized];

  const upper = value.toUpperCase();
  if (upper === "ON_SITE" || upper === "REMOTE" || upper === "HYBRID") return upper;
  return upper;
}

function resolveReportingToId(raw: Record<string, unknown>): string {
  const reportingTo =
    raw.reporting_to ??
    raw.reportingTo ??
    raw.reporting_manager ??
    raw.reportingManager;

  if (reportingTo && typeof reportingTo === "object") {
    const obj = reportingTo as Record<string, unknown>;
    return String(obj.id ?? obj.user_id ?? obj.employee_id ?? "").trim();
  }
  if (reportingTo != null && reportingTo !== "") {
    return String(reportingTo).trim();
  }
  if (raw.reporting_manager_id != null) return String(raw.reporting_manager_id).trim();
  return "";
}

function resolveReportingToName(raw: Record<string, unknown>): string {
  const reportingTo =
    raw.reporting_to ??
    raw.reportingTo ??
    raw.reporting_manager ??
    raw.reportingManager;

  if (reportingTo && typeof reportingTo === "object") {
    const obj = reportingTo as Record<string, unknown>;
    const firstName = readApiScalar(obj.first_name ?? obj.firstName);
    const lastName = readApiScalar(obj.last_name ?? obj.lastName);
    const fullName =
      readApiScalar(obj.full_name ?? obj.fullName ?? obj.name) ||
      `${firstName} ${lastName}`.trim();
    return fullName;
  }

  return readApiScalar(raw.reporting_manager_name ?? raw.reportingManagerName);
}

function mapApiPermissions(raw: unknown): ManagerFormState["permissions"] {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_MANAGER_FORM_STATE.permissions };
  }
  const p = raw as Record<string, unknown>;
  return {
    can_approve_leave: Boolean(p.can_approve_leave ?? p.canApproveLeave),
    can_approve_attendance: Boolean(p.can_approve_attendance ?? p.canApproveAttendance),
    can_manage_employees: Boolean(p.can_manage_employees ?? p.canManageEmployees),
    can_view_payroll: Boolean(p.can_view_payroll ?? p.canViewPayroll),
    can_edit_departments: Boolean(p.can_edit_departments ?? p.canEditDepartments),
    can_invite_users: Boolean(p.can_invite_users ?? p.canInviteUsers),
    can_manage_recruitment: Boolean(p.can_manage_recruitment ?? p.canManageRecruitment),
    can_manage_performance: Boolean(p.can_manage_performance ?? p.canManagePerformance),
  };
}

/** Maps a full `/managers/{id}` API response into edit form state. */
export function apiManagerToFormState(raw: Record<string, unknown>): ManagerFormState {
  const data = unwrapManagerApiRecord(raw);

  return {
    ...DEFAULT_MANAGER_FORM_STATE,
    first_name: readApiScalar(data.first_name ?? data.firstName),
    last_name: readApiScalar(data.last_name ?? data.lastName),
    personal_email: readApiScalar(data.personal_email ?? data.personalEmail ?? data.email),
    company_email: readApiScalar(data.company_email ?? data.companyEmail),
    phone: readApiScalar(data.phone),
    alternate_phone: readApiScalar(data.alternate_phone ?? data.alternatePhone),
    reporting_to: resolveReportingToId(data),
    department: resolveDepartmentFromApi(data),
    designation: readApiScalar(data.designation),
    joining_date: toDateInputValue(readApiScalar(data.joining_date ?? data.joiningDate)),
    profile_photo_url: readApiScalar(
      data.profile_photo_url ?? data.profilePhotoUrl ?? data.profile_image ?? data.profileImage,
    ),
    gender: resolveGenderFromApi(data.gender),
    date_of_birth: toDateInputValue(
      readApiScalar(data.date_of_birth ?? data.dob ?? data.dateOfBirth),
    ),
    blood_group: readApiScalar(data.blood_group ?? data.bloodGroup),
    marital_status: readApiScalar(data.marital_status ?? data.maritalStatus),
    branch: resolveBranchFromApi(data),
    work_location: resolveWorkLocationFormValue(data),
    employment_type: readApiScalar(data.employment_type ?? data.employmentType).toUpperCase() || "FULL_TIME",
    employment_status: readApiScalar(data.employment_status ?? data.status).toUpperCase() || "PROBATION",
    shift: resolveShiftValue(readApiScalar(data.shift) || "General"),
    probation_period_months: Number(data.probation_period_months ?? 0),
    ctc: Number(data.ctc ?? data.salary ?? 0),
    basic_salary: Number(data.basic_salary ?? 0),
    hra: Number(data.hra ?? 0),
    bonus: Number(data.bonus ?? 0),
    pf: Number(data.pf ?? 0),
    esi: Number(data.esi ?? 0),
    professional_tax: Number(data.professional_tax ?? 0),
    role: readApiScalar(data.role) || "manager",
    leave_group: readApiScalar(data.leave_group ?? data.leaveGroup),
    permissions: mapApiPermissions(data.permissions),
    addresses: Array.isArray(data.addresses) ? data.addresses : [],
    documents: Array.isArray(data.documents) ? data.documents : [],
    education: Array.isArray(data.education) ? data.education : [],
    experience: Array.isArray(data.experience) ? data.experience : [],
    skills: Array.isArray(data.skills) ? data.skills : [],
    emergency_contacts: Array.isArray(data.emergency_contacts ?? data.emergencyContacts)
      ? ((data.emergency_contacts ?? data.emergencyContacts) as unknown[])
      : [],
  };
}

/** Reporting manager display name from a detail API payload (for select fallbacks). */
export function resolveReportingManagerNameFromApi(raw: Record<string, unknown>): string {
  return resolveReportingToName(unwrapManagerApiRecord(raw));
}

export function managerToFormState(manager: Manager): ManagerFormState {
  return {
    ...DEFAULT_MANAGER_FORM_STATE,
    first_name: manager.firstName,
    last_name: manager.lastName,
    personal_email: manager.email,
    company_email: manager.email,
    phone: manager.phone,
    reporting_to: manager.reportingManagerId ?? "",
    department: manager.department,
    designation: manager.designation,
    joining_date: toDateInputValue(manager.joiningDate),
    profile_photo_url: manager.profileImage ?? "",
    gender: resolveGenderValue(manager.gender),
    date_of_birth: toDateInputValue(manager.dob),
    blood_group: manager.bloodGroup ?? "",
    marital_status: manager.maritalStatus ?? "",
    branch: manager.office,
    work_location: WORK_LOCATION_FROM_MANAGER[manager.workLocation] ?? manager.workLocation.toUpperCase(),
    employment_type: EMPLOYMENT_TYPE_FROM_MANAGER[manager.employmentType],
    employment_status: manager.status,
    shift: resolveShiftValue(manager.shift),
    probation_period_months: manager.status === "PROBATION" ? 3 : 0,
    ctc: manager.salary ?? 0,
    permissions: {
        can_approve_leave: manager.permissions.canApproveLeave,
        can_approve_attendance: manager.permissions.canApproveAttendance,
        can_manage_employees: manager.permissions.canManageEmployees,
        can_view_payroll: manager.permissions.canViewPayroll,
        can_edit_departments: manager.permissions.canEditDepartments,
        can_invite_users: manager.permissions.canInviteUsers,
        can_manage_recruitment: manager.permissions.canManageRecruitment,
        can_manage_performance: manager.permissions.canManagePerformance,
    },
  };
}

export function mapApiFieldErrors(fieldErrors: Record<string, string>): Record<string, string> {
  return { ...fieldErrors };
}

// ─── Filtering & Sorting ──────────────────────────────────────────────────────
export function applyFilters(
  managers: Manager[],
  query: string,
  filters: ManagerFilters,
): Manager[] {
  const q = query.toLowerCase().trim();

  return managers.filter((m) => {
    // Search
    if (q) {
      const match =
        m.fullName.toLowerCase().includes(q) ||
        m.managerId.toLowerCase().includes(q) ||
        m.employeeId.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Department filter
    if (filters.department !== "all" && m.department !== filters.department) return false;

    // Status filter
    if (filters.status !== "all" && m.status !== filters.status) return false;

    // Employment type filter
    if (filters.employmentType !== "all" && m.employmentType !== filters.employmentType) return false;

    // Office filter
    if (filters.office !== "all" && m.office !== filters.office) return false;

    // Team size filter
    if (filters.teamSize !== "all") {
      const ts = m.teamSize;
      if (filters.teamSize === "1-5" && !(ts >= 1 && ts <= 5)) return false;
      if (filters.teamSize === "6-10" && !(ts >= 6 && ts <= 10)) return false;
      if (filters.teamSize === "11-20" && !(ts >= 11 && ts <= 20)) return false;
      if (filters.teamSize === "20+" && ts <= 20) return false;
    }

    // Joining date range
    if (filters.joiningFrom && m.joiningDate < filters.joiningFrom) return false;
    if (filters.joiningTo && m.joiningDate > filters.joiningTo) return false;

    return true;
  });
}

export function applySorting(
  managers: Manager[],
  field: SortField,
  dir: SortDir,
): Manager[] {
  return [...managers].sort((a, b) => {
    let va: string | number;
    let vb: string | number;

    switch (field) {
      case "fullName": va = a.fullName; vb = b.fullName; break;
      case "department": va = a.department; vb = b.department; break;
      case "teamSize": va = a.teamSize; vb = b.teamSize; break;
      case "joiningDate": va = a.joiningDate; vb = b.joiningDate; break;
      case "lastActive": va = a.lastActive; vb = b.lastActive; break;
      case "status": va = a.status; vb = b.status; break;
      default: va = a.fullName; vb = b.fullName;
    }

    if (typeof va === "number" && typeof vb === "number") {
      return dir === "asc" ? va - vb : vb - va;
    }
    const cmp = String(va).localeCompare(String(vb));
    return dir === "asc" ? cmp : -cmp;
  });
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  return items.slice((page - 1) * perPage, page * perPage);
}

export function getVisiblePages(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage]);
  if (currentPage > 1) pages.add(currentPage - 1);
  if (currentPage < totalPages) pages.add(currentPage + 1);
  return Array.from(pages).sort((a, b) => a - b);
}

// ─── CSV Builder ──────────────────────────────────────────────────────────────
export function buildCSV(managers: Manager[]): string {
  const headers = [
    "Employee ID", "Full Name", "Email", "Phone",
    "Department", "Designation", "Role", "Status",
    "Employment Type", "Office", "Work Location",
    "Team Size", "Joining Date", "Last Active",
  ];
  const rows = managers.map((m) =>
    [
      m.employeeId, m.fullName, m.email, m.phone,
      m.department, m.designation, m.managerRole, m.status,
      m.employmentType, m.office, m.workLocation,
      m.teamSize, m.joiningDate, m.lastActive,
    ]
      .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}

// ─── Avatar colour ────────────────────────────────────────────────────────────
export function avatarHue(name?: string | null): number {
  const safe = name ?? "";
  return Array.from(safe).reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
}

// ─── Label helpers ────────────────────────────────────────────────────────────
export function labelFor(value: string, options: { value: string; label: string }[]): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function fmtDate(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("T")[0].split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}

export function fmtRelative(iso: string): string {
  if (!iso) return "—";
  const then = new Date(iso);
  const now = new Date("2026-06-25T18:00:00"); // static to avoid SSR mismatch
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return fmtDate(iso);
}

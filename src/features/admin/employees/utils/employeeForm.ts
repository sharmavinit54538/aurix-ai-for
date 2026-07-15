import type {
  CreateEmployeePayload,
  Employee,
  EmployeeAddress,
  EmployeeBankAccount,
  EmployeeDocument,
  EmployeeEducation,
  EmployeeEmergencyContact,
  EmployeeExperience,
  EmployeeFormState,
  EmployeeSkill,
  UpdateEmployeePayload,
} from "../employeesTypes";
import { SHIFT_OPTIONS } from "@/features/admin/managers/constants";
import {
  readApiScalar,
  resolveGenderValue,
  toDateInputValue,
  unwrapManagerApiRecord,
} from "@/features/admin/managers/utils";
import { resolveDepartmentValue } from "./departmentOptions";

export const EMPTY_ADDRESS: EmployeeAddress = {
  address_type: "CURRENT",
  address_line_1: "",
  address_line_2: "",
  city: "",
  state: "",
  country: "India",
  pincode: "",
  is_same_as_current: false,
};

export const EMPTY_DOCUMENT: EmployeeDocument = {
  document_type: "",
  document_number: "",
  document_url: "",
  expiry_date: "",
};

export const EMPTY_EDUCATION: EmployeeEducation = {
  degree: "",
  institution: "",
  field_of_study: "",
  start_year: 0,
  end_year: 0,
  grade: "",
  certificate_url: "",
};

export const EMPTY_EXPERIENCE: EmployeeExperience = {
  company_name: "",
  designation: "",
  employment_type: "FULL_TIME",
  start_date: "",
  end_date: "",
  is_current: false,
  description: "",
};

export const EMPTY_SKILL: EmployeeSkill = {
  skill_name: "",
  proficiency: "",
  years_of_experience: 0,
};

export const EMPTY_EMERGENCY_CONTACT: EmployeeEmergencyContact = {
  name: "",
  relation: "",
  phone: "",
  alternate_phone: "",
  email: "",
  address: "",
};

export const EMPTY_BANK_ACCOUNT: EmployeeBankAccount = {
  bank_name: "",
  account_holder_name: "",
  account_number: "",
  ifsc_code: "",
  account_type: "SAVINGS",
  is_primary: false,
};

export const DEFAULT_EMPLOYEE_FORM_STATE: EmployeeFormState = {
  first_name: "",
  last_name: "",
  personal_email: "",
  phone: "",
  department: "",
  designation: "",
  employment_type: "FULL_TIME",
  joining_date: "",
  profile_photo_url: "",
  gender: "",
  date_of_birth: "",
  company_email: "",
  alternate_phone: "",
  blood_group: "",
  marital_status: "",
  team: "",
  reporting_manager_id: "",
  branch: "",
  work_location: "",
  shift: "General",
  ctc: 0,
  basic_salary: 0,
  hra: 0,
  bonus: 0,
  pf: 0,
  esi: 0,
  professional_tax: 0,
  leave_group: "",
  addresses: [],
  documents: [],
  education: [],
  experience: [],
  skills: [],
  emergency_contacts: [],
  bank_accounts: [],
};

export function createEmptyEmployeeForm(): EmployeeFormState {
  return { ...DEFAULT_EMPLOYEE_FORM_STATE };
}

function resolveShiftValue(shift: string): string {
  const match = SHIFT_OPTIONS.find((opt) => opt.value === shift || opt.label === shift);
  return match?.value ?? shift;
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

function resolveReportingManagerId(raw: Record<string, unknown>): string {
  const reportingTo =
    raw.reporting_manager_id ??
    raw.reporting_manager ??
    raw.reportingManager ??
    raw.reporting_to ??
    raw.reportingTo;

  if (reportingTo && typeof reportingTo === "object") {
    const obj = reportingTo as Record<string, unknown>;
    return String(obj.id ?? obj.user_id ?? obj.employee_id ?? "").trim();
  }
  if (reportingTo != null && reportingTo !== "") {
    return String(reportingTo).trim();
  }
  return "";
}

/** Maps a full `/employees/{id}` API response into edit form state. */
export function apiEmployeeToFormState(raw: Record<string, unknown>): EmployeeFormState {
  const data = unwrapManagerApiRecord(raw);
  const id = readApiScalar(data.id);

  return {
    ...DEFAULT_EMPLOYEE_FORM_STATE,
    id: id || undefined,
    first_name: readApiScalar(data.first_name ?? data.firstName),
    last_name: readApiScalar(data.last_name ?? data.lastName),
    personal_email: readApiScalar(data.personal_email ?? data.personalEmail ?? data.email),
    company_email: readApiScalar(data.company_email ?? data.companyEmail),
    phone: readApiScalar(data.phone),
    alternate_phone: readApiScalar(data.alternate_phone ?? data.alternatePhone),
    department: resolveDepartmentFromApi(data),
    designation: readApiScalar(data.designation),
    employment_type: readApiScalar(data.employment_type ?? data.employmentType).toUpperCase() || "FULL_TIME",
    joining_date: toDateInputValue(readApiScalar(data.joining_date ?? data.joiningDate)),
    profile_photo_url: readApiScalar(
      data.profile_photo_url ?? data.profilePhotoUrl ?? data.profile_image ?? data.profileImage,
    ),
    gender: resolveGenderValue(readApiScalar(data.gender)),
    date_of_birth: toDateInputValue(
      readApiScalar(data.date_of_birth ?? data.dob ?? data.dateOfBirth),
    ),
    blood_group: readApiScalar(data.blood_group ?? data.bloodGroup),
    marital_status: readApiScalar(data.marital_status ?? data.maritalStatus),
    team: readApiScalar(data.team),
    reporting_manager_id: resolveReportingManagerId(data),
    branch: resolveBranchFromApi(data),
    work_location: resolveWorkLocationFormValue(data),
    shift: resolveShiftValue(readApiScalar(data.shift) || "General"),
    ctc: Number(data.ctc ?? 0),
    basic_salary: Number(data.basic_salary ?? 0),
    hra: Number(data.hra ?? 0),
    bonus: Number(data.bonus ?? 0),
    pf: Number(data.pf ?? 0),
    esi: Number(data.esi ?? 0),
    professional_tax: Number(data.professional_tax ?? 0),
    leave_group: readApiScalar(data.leave_group ?? data.leaveGroup),
    addresses: Array.isArray(data.addresses) ? (data.addresses as EmployeeAddress[]) : [],
    documents: Array.isArray(data.documents) ? (data.documents as EmployeeDocument[]) : [],
    education: Array.isArray(data.education) ? (data.education as EmployeeEducation[]) : [],
    experience: Array.isArray(data.experience) ? (data.experience as EmployeeExperience[]) : [],
    skills: Array.isArray(data.skills) ? (data.skills as EmployeeSkill[]) : [],
    emergency_contacts: Array.isArray(data.emergency_contacts ?? data.emergencyContacts)
      ? ((data.emergency_contacts ?? data.emergencyContacts) as EmployeeEmergencyContact[])
      : [],
    bank_accounts: Array.isArray(data.bank_accounts ?? data.bankAccounts)
      ? ((data.bank_accounts ?? data.bankAccounts) as EmployeeBankAccount[])
      : [],
  };
}

export function employeeToFormState(employee: Employee): EmployeeFormState {
  const names = employee.fullName.trim().split(/\s+/);
  return {
    ...DEFAULT_EMPLOYEE_FORM_STATE,
    id: employee.id || undefined,
    first_name: names[0] || "",
    last_name: names.slice(1).join(" ") || "",
    personal_email: employee.personal_email || employee.email,
    company_email: employee.company_email,
    phone: employee.phone,
    department: employee.department,
    designation: employee.designation,
    joining_date: employee.joiningDate,
    shift: employee.shift || "General",
  };
}

function stripEmptyStrings<T extends Record<string, unknown>>(payload: T): T {
  const result = { ...payload };
  for (const key of Object.keys(result)) {
    if (result[key] === "") {
      delete result[key];
    }
  }
  return result;
}

function hasValue(values: unknown[]): boolean {
  return values.some((value) => {
    if (typeof value === "string") return value.trim() !== "";
    if (typeof value === "number") return value > 0;
    if (typeof value === "boolean") return value;
    return value != null;
  });
}

function sanitizePayload(form: EmployeeFormState): CreateEmployeePayload {
  const { id: _id, ...payload } = form;
  return stripEmptyStrings({
    ...payload,
    role: "employee",
    reporting_manager_id: form.reporting_manager_id || undefined,
    addresses: form.addresses.filter((item) =>
      hasValue([
        item.address_line_1,
        item.address_line_2,
        item.city,
        item.state,
        item.pincode,
      ]),
    ),
    documents: form.documents.filter((item) =>
      hasValue([item.document_type, item.document_number, item.document_url]),
    ),
    education: form.education.filter((item) =>
      hasValue([item.degree, item.institution, item.field_of_study, item.grade]),
    ),
    experience: form.experience.filter((item) =>
      hasValue([item.company_name, item.designation, item.description]),
    ),
    skills: form.skills.filter((item) =>
      hasValue([item.skill_name, item.proficiency, item.years_of_experience]),
    ),
    emergency_contacts: form.emergency_contacts.filter((item) =>
      hasValue([item.name, item.relation, item.phone, item.email]),
    ),
    bank_accounts: form.bank_accounts.filter((item) =>
      hasValue([item.bank_name, item.account_holder_name, item.account_number, item.ifsc_code]),
    ),
  }) as CreateEmployeePayload;
}

export function formToCreatePayload(form: EmployeeFormState): CreateEmployeePayload {
  return sanitizePayload(form);
}

export function formToUpdatePayload(form: EmployeeFormState): UpdateEmployeePayload {
  return sanitizePayload(form);
}

export function validateEmployeeForm(form: EmployeeFormState): { valid: boolean; message?: string } {
  if (!form.first_name.trim() || !form.last_name.trim()) {
    return { valid: false, message: "First name and last name are required" };
  }
  if (!form.personal_email.trim()) {
    return { valid: false, message: "Personal email is required" };
  }
  if (!form.phone.trim()) {
    return { valid: false, message: "Phone number is required" };
  }
  if (!form.department.trim()) {
    return { valid: false, message: "Department is required" };
  }
  if (!form.designation.trim()) {
    return { valid: false, message: "Designation is required" };
  }
  if (!form.joining_date) {
    return { valid: false, message: "Joining date is required" };
  }
  return { valid: true };
}

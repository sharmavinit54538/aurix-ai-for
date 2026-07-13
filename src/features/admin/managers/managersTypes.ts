import type { Manager } from "./types";

export type { Manager } from "./types";

export interface ManagerFormState {
  first_name: string;
  last_name: string;
  personal_email: string;
  phone: string;
  reporting_to: string;
  department: string;
  designation: string;
  joining_date: string;
  profile_photo_url: string;
  gender: string;
  date_of_birth: string;
  company_email: string;
  alternate_phone: string;
  blood_group: string;
  marital_status: string;
  branch: string;
  work_location: string;
  employment_type: string;
  employment_status: string;
  shift: string;
  probation_period_months: number;
  ctc: number;
  basic_salary: number;
  hra: number;
  bonus: number;
  pf: number;
  esi: number;
  professional_tax: number;
  role: string;
  leave_group: string;
  permissions: {
    can_approve_leave: boolean;
    can_approve_attendance: boolean;
    can_manage_employees: boolean;
    can_view_payroll: boolean;
    can_edit_departments: boolean;
    can_invite_users: boolean;
    can_manage_recruitment: boolean;
    can_manage_performance: boolean;
  }
  addresses: unknown[];
  documents: unknown[];
  education: unknown[];
  experience: unknown[];
  skills: unknown[];
  emergency_contacts: unknown[];
}

export type ManagerApiPayload = ManagerFormState;

export interface FetchManagersParams {
  search?: string;
  page?: number;
  limit?: number;
  silent?: boolean;
}

export interface FetchManagersResult {
  items: Manager[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ManagersState {
  managers: Manager[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  managerForm: ManagerFormState;
  selectedManager: Manager | null;
  selectedManagerForm: ManagerFormState | null;
  selectedManagerLoading: boolean;
  selectedManagerError: string | null;
}

export type SaveManagerResult =
  | { success: true }
  | { success: false; message: string; fieldErrors: Record<string, string> };

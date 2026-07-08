export interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  managerName?: string;
  shift?: string;
  status?: string;
  activationToken?: string;
  activationTokenExpiresAt?: string;
}

export interface EmployeesState {
  employees: Employee[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface FetchEmployeesParams {
  search?: string;
  department?: string;
  designation?: string;
  shift?: string;
  status?: string;
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
}

export interface CreateEmployeePayload {
  first_name: string;
  last_name: string;
  personal_email: string;
  company_email: string;
  phone: string;
  department: string;
  designation: string;
  joining_date: string;
  employee_id: string;
  employment_type: string;
  employment_status: string;
  role: string;
  shift: string;
}

export interface UpdateEmployeePayload {
  first_name: string;
  last_name: string;
  personal_email: string;
  company_email?: string;
  phone?: string;
  department: string;
  designation: string;
  joining_date?: string;
  shift?: string;
}

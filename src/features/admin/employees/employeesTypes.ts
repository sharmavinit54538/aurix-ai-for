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
  role?: string;
  activationToken?: string;
  activationTokenExpiresAt?: string;

  // Complete Employee Information fields
  firstName?: string;
  lastName?: string;
  personalEmail?: string;
  companyEmail?: string;
  employmentType?: string;
  employmentStatus?: string;
  workLocation?: string;
  workMode?: string;
  officeLocation?: string;
  gender?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  maritalStatus?: string;
  nationality?: string;
  preferredLanguage?: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
  currentAddress?: string;
  permanentAddress?: string;
  reportingManagerId?: string;
  reportingManagerName?: string;
  reportingChain?: Array<{ id?: string; name: string; designation?: string; department?: string }>;
  probationPeriodMonths?: number;
  profilePhotoUrl?: string;
  avatarUrl?: string;
  salary?: string | number;
  ctc?: string | number;
  panNumber?: string;
  aadhaarNumber?: string;
  bankName?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  branch?: string;
  uanNumber?: string;
  esiNumber?: string;
  aboutMe?: string;
  bio?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  facebookUrl?: string;
  raw?: Record<string, unknown>;
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
  role?: string;
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

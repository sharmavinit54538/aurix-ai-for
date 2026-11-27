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
  dob?: string;
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
  orgLevel?: number;
  directReportsCount?: number;
  probationPeriodMonths?: number;
  profilePhotoUrl?: string;
  avatarUrl?: string;
  salary?: number;
  ctc?: number;
  sendOnboardingInvite?: boolean;
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
  selectedEmployee: Employee | null;
  employeeDetailLoading: boolean;
  statistics: EmployeeStatistics | null;
  statisticsLoading: boolean;
  onboardingStatus: EmployeeOnboardingStatus | null;
  onboardingStatusLoading: boolean;
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

export interface EmployeeCreateRequest {
  first_name: string;
  last_name: string;
  personal_email: string;
  company_email?: string;
  phone: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  date_of_birth?: string;
  department: string;
  designation: string;
  reporting_manager_id?: string | null;
  joining_date: string;
  employee_id?: string;
  employment_type?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
  work_mode?: "OFFICE" | "REMOTE" | "HYBRID";
  probation_period_months?: number;
  shift?: string;
  work_location?: string;
  ctc?: number;
  salary?: number;
  role?: string;
  send_onboarding_invite?: boolean;
}

export interface EmployeeUpdateRequest {
  first_name?: string;
  last_name?: string;
  personal_email?: string;
  company_email?: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  date_of_birth?: string;
  department?: string;
  designation?: string;
  reporting_manager_id?: string | null;
  joining_date?: string;
  employee_id?: string;
  employment_type?: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN";
  work_mode?: "OFFICE" | "REMOTE" | "HYBRID";
  probation_period_months?: number;
  shift?: string;
  work_location?: string;
  ctc?: number;
  salary?: number;
  role?: string;
  send_onboarding_invite?: boolean;
}

export interface EmployeeListResponse {
  items: Employee[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface EmployeeStatistics {
  total_employees: number;
  active_employees: number;
  invited_employees: number;
  inactive_employees: number;
  disabled_employees: number;
  department_distribution: Record<string, number>;
  onboarding_stats?: {
    pending: number;
    in_progress: number;
    completed: number;
    failed: number;
  };
}

export interface EmployeeOnboardingStatus {
  employee_id: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  steps_completed: number;
  total_steps: number;
  pending_documents: string[];
  completed_at?: string;
}

export interface DeactivateEmployeeRequest {
  reason: string;
}

export interface InvitationValidationResponse {
  valid: boolean;
  employee_id?: string;
  employee_email?: string;
  employee_name?: string;
  expires_at?: string;
  message?: string;
}

export interface ActivateEmployeeResponse {
  success: boolean;
  message?: string;
  user_created?: boolean;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

export interface SendInvitationResponse {
  success: boolean;
  message?: string;
  invitation_sent?: boolean;
}

export interface EmployeeImportResponse {
  success: boolean;
  message?: string;
  imported: number;
  failed: number;
  errors?: Array<{ row: number; field: string; message: string }>;
  download_url?: string;
}

export interface EmployeeExportResponse {
  url: string;
  filename: string;
}

export interface ApproveEmployeeResponse {
  success: boolean;
  message?: string;
  employee?: Employee;
}

export interface RejectEmployeeResponse {
  success: boolean;
  message?: string;
  employee?: Employee;
}

export interface OnboardingStatusResponse {
  employee_id: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  steps_completed: number;
  total_steps: number;
  pending_documents: string[];
  completed_at?: string;
  invitation_status?: "SENT" | "VIEWED" | "EXPIRED" | "ACCEPTED";
  account_activation?: "PENDING" | "COMPLETED";
  profile_completion?: number;
  document_verification?: "NOT_STARTED" | "IN_PROGRESS" | "VERIFIED" | "FAILED";
  approval_status?: "PENDING" | "APPROVED" | "REJECTED";
}
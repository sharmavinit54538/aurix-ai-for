import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiInstance } from "@/api";
import { parseApiError, type ParsedError } from "@/api/utils";
import type {
  Employee,
  FetchEmployeesParams,
  EmployeeCreateRequest,
  EmployeeUpdateRequest,
  EmployeeListResponse,
  EmployeeStatistics,
  EmployeeOnboardingStatus,
  DeactivateEmployeeRequest,
  InvitationValidationResponse,
  ActivateEmployeeResponse,
  ResetPasswordResponse,
  SendInvitationResponse,
  EmployeeImportResponse,
  EmployeeExportResponse,
} from "./employeesTypes";

function mapEmployee(emp: Record<string, unknown>): Employee {
  const firstName = String(emp.first_name ?? "");
  const lastName = String(emp.last_name ?? "");
  const fullNameCalculated = `${firstName} ${lastName}`.trim();
  const fullName = fullNameCalculated || String(emp.full_name ?? emp.name ?? "Employee");

  const manager =
    emp.reporting_manager_name ||
    emp.manager_name ||
    (typeof emp.manager === "object" && emp.manager
      ? (emp.manager as Record<string, unknown>).name || (emp.manager as Record<string, unknown>).full_name
      : emp.manager) ||
    "";

  const rawJoiningDate = emp.joining_date || emp.created_at;
  const joiningDate = rawJoiningDate ? String(rawJoiningDate).split("T")[0] : "";

  const location = String(
    emp.work_location ||
      emp.office_location ||
      emp.branch ||
      emp.location ||
      emp.city ||
      "",
  );

  return {
    id: String(emp.id ?? ""),
    employeeId: String(emp.employee_id ?? emp.employee_code ?? emp.id ?? ""),
    fullName,
    email: String(emp.company_email ?? emp.work_email ?? emp.email ?? emp.personal_email ?? ""),
    phone: String(emp.phone ?? emp.phone_number ?? ""),
    department: String(emp.department ?? ""),
    designation: String(emp.designation ?? emp.title ?? emp.role ?? ""),
    joiningDate,
    managerName: String(manager || ""),
    shift: String(emp.shift ?? "General Shift (09:30 - 18:30)"),
    status: String(emp.status ?? "INVITED"),
    role: String(emp.role ?? "employee"),
    activationToken: emp.activation_token as string | undefined,
    activationTokenExpiresAt: emp.activation_token_expires_at as string | undefined,

    // Comprehensive employee details
    firstName,
    lastName,
    personalEmail: emp.personal_email ? String(emp.personal_email) : undefined,
    companyEmail: emp.company_email ? String(emp.company_email) : undefined,
    employmentType: emp.employment_type ? String(emp.employment_type) : undefined,
    employmentStatus: emp.employment_status ? String(emp.employment_status) : undefined,
    workLocation: location || undefined,
    workMode: emp.work_mode ? String(emp.work_mode) : undefined,
    officeLocation: emp.office_location ? String(emp.office_location) : location || undefined,
    gender: emp.gender ? String(emp.gender) : undefined,
    dateOfBirth: emp.date_of_birth || emp.dob ? String(emp.date_of_birth || emp.dob).split("T")[0] : undefined,
    bloodGroup: emp.blood_group ? String(emp.blood_group) : undefined,
    maritalStatus: emp.marital_status ? String(emp.marital_status) : undefined,
    nationality: emp.nationality ? String(emp.nationality) : undefined,
    preferredLanguage: emp.preferred_language ? String(emp.preferred_language) : undefined,
    emergencyContactName: emp.emergency_contact_name ? String(emp.emergency_contact_name) : undefined,
    emergencyContactRelation: emp.emergency_contact_relation ? String(emp.emergency_contact_relation) : undefined,
    emergencyContactPhone: emp.emergency_contact_phone ? String(emp.emergency_contact_phone) : undefined,
    currentAddress: emp.current_address_line1
      ? [emp.current_address_line1, emp.current_address_line2, emp.current_city, emp.current_state, emp.current_pincode].filter(Boolean).join(", ")
      : emp.address ? String(emp.address) : undefined,
    permanentAddress: emp.permanent_address_line1
      ? [emp.permanent_address_line1, emp.permanent_address_line2, emp.permanent_city, emp.permanent_state, emp.permanent_pincode].filter(Boolean).join(", ")
      : undefined,
    reportingManagerId: emp.reporting_manager_id ? String(emp.reporting_manager_id) : undefined,
    reportingManagerName: String(manager || ""),
    probationPeriodMonths: emp.probation_period_months !== undefined ? Number(emp.probation_period_months) : undefined,
    profilePhotoUrl: (emp.profile_photo_url || emp.avatar_url || emp.avatar) ? String(emp.profile_photo_url || emp.avatar_url || emp.avatar) : undefined,
    avatarUrl: (emp.avatar_url || emp.profile_photo_url || emp.avatar) ? String(emp.avatar_url || emp.profile_photo_url || emp.avatar) : undefined,
    salary: emp.salary !== undefined ? Number(emp.salary) : undefined,
    ctc: emp.ctc !== undefined ? Number(emp.ctc) : emp.ctc_annual !== undefined ? Number(emp.ctc_annual) : undefined,
    sendOnboardingInvite: emp.send_onboarding_invite !== undefined ? Boolean(emp.send_onboarding_invite) : true,
    panNumber: emp.pan_number ? String(emp.pan_number) : undefined,
    aadhaarNumber: emp.aadhaar_number ? String(emp.aadhaar_number) : undefined,
    bankName: emp.bank_name ? String(emp.bank_name) : undefined,
    bankAccountNumber: emp.bank_account_number || emp.account_number ? String(emp.bank_account_number || emp.account_number) : undefined,
    ifscCode: emp.ifsc_code ? String(emp.ifsc_code) : undefined,
    branch: emp.branch ? String(emp.branch) : undefined,
    uanNumber: emp.uan_number || emp.uan ? String(emp.uan_number || emp.uan) : undefined,
    esiNumber: emp.esi_number || emp.esi ? String(emp.esi_number || emp.esi) : undefined,
    aboutMe: emp.about_me || emp.bio || emp.about ? String(emp.about_me || emp.bio || emp.about) : undefined,
    bio: emp.bio || emp.about_me ? String(emp.bio || emp.about_me) : undefined,
    notes: emp.notes ? String(emp.notes) : undefined,
    createdAt: emp.created_at ? String(emp.created_at).split("T")[0] : undefined,
    updatedAt: emp.updated_at ? String(emp.updated_at).split("T")[0] : undefined,
    linkedinUrl: emp.linkedin_url || emp.linkedin ? String(emp.linkedin_url || emp.linkedin) : undefined,
    twitterUrl: emp.twitter_url || emp.twitter ? String(emp.twitter_url || emp.twitter) : undefined,
    facebookUrl: emp.facebook_url || emp.facebook ? String(emp.facebook_url || emp.facebook) : undefined,
    raw: emp,
  };
}

export const fetchEmployees = createAsyncThunk<
  EmployeeListResponse,
  FetchEmployeesParams | void,
  { rejectValue: ParsedError }
>("employees/fetchEmployees", async (params, thunkAPI) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.department && params.department !== "all") {
      searchParams.set("department", params.department);
    }
    if (params?.designation && params.designation !== "all") {
      searchParams.set("designation", params.designation);
    }
    if (params?.shift && params.shift !== "all") {
      searchParams.set("shift", params.shift);
    }
    if (params?.status && params.status !== "all") {
      searchParams.set("status", params.status);
    }
    if (params?.role && params.role !== "all") {
      searchParams.set("role", params.role);
    }
    if (params?.sort) {
      searchParams.set("sort", params.sort);
    }
    if (params?.order) {
      searchParams.set("order", params.order);
    }
    if (params?.page) {
      searchParams.set("page", String(params.page));
    }
    if (params?.limit) {
      searchParams.set("limit", String(params.limit));
    }

    const response = await apiInstance.get(`/employees?${searchParams.toString()}`);
    const data = response.data?.data ?? response.data ?? {};
    const items = data.items ?? data ?? [];
    return {
      items: Array.isArray(items) ? items.map((item: Record<string, unknown>) => mapEmployee(item)) : [],
      total: Number(data.total ?? 0),
      page: Number(data.page ?? 1),
      limit: Number(data.limit ?? 10),
      pages: Number(data.pages ?? data.total_pages ?? 0),
      total_pages: Number(data.total_pages ?? data.pages ?? 0),
      has_next: Boolean(data.has_next ?? false),
      has_previous: Boolean(data.has_previous ?? false),
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to fetch employees"));
  }
});

export const fetchEmployeeById = createAsyncThunk<
  Employee,
  string,
  { rejectValue: ParsedError }
>("employees/fetchEmployeeById", async (id, thunkAPI) => {
  try {
    const response = await apiInstance.get(`/employees/${id}`);
    const data = response.data?.data ?? response.data ?? {};
    return mapEmployee(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to fetch employee"));
  }
});

export const createEmployee = createAsyncThunk<
  Employee,
  EmployeeCreateRequest,
  { rejectValue: ParsedError }
>("employees/createEmployee", async (payload, thunkAPI) => {
  try {
    const response = await apiInstance.post("/employees", payload);
    const data = response.data?.data ?? response.data ?? {};
    return mapEmployee(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to add employee"));
  }
});

export const updateEmployee = createAsyncThunk<
  Employee,
  { id: string; payload: EmployeeUpdateRequest },
  { rejectValue: ParsedError }
>("employees/updateEmployee", async ({ id, payload }, thunkAPI) => {
  try {
    const response = await apiInstance.put(`/employees/${id}`, payload);
    const data = response.data?.data ?? response.data ?? {};
    return mapEmployee(data);
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to update employee"));
  }
});

export const deleteEmployee = createAsyncThunk<
  string,
  string,
  { rejectValue: ParsedError }
>("employees/deleteEmployee", async (id, thunkAPI) => {
  try {
    await apiInstance.delete(`/employees/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to remove employee"));
  }
});

export const resendEmployeeInvite = createAsyncThunk<
  SendInvitationResponse,
  string,
  { rejectValue: ParsedError }
>("employees/resendEmployeeInvite", async (id, thunkAPI) => {
  try {
    const response = await apiInstance.post(`/employees/${id}/send-invite`);
    return response.data?.data ?? response.data ?? { success: true, message: "Invitation sent" };
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to resend invitation"));
  }
});

export const deactivateEmployee = createAsyncThunk<
  { success: boolean; message?: string },
  { id: string; reason: string },
  { rejectValue: ParsedError }
>("employees/deactivateEmployee", async ({ id, reason }, thunkAPI) => {
  try {
    const payload: DeactivateEmployeeRequest = { reason };
    const response = await apiInstance.post(`/employees/${id}/deactivate`, payload);
    return response.data?.data ?? response.data ?? { success: true, message: "Employee deactivated" };
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to deactivate employee"));
  }
});

export const activateEmployee = createAsyncThunk<
  ActivateEmployeeResponse,
  string,
  { rejectValue: ParsedError }
>("employees/activateEmployee", async (id, thunkAPI) => {
  try {
    const response = await apiInstance.post(`/employees/${id}/activate-by-admin`);
    return response.data?.data ?? response.data ?? { success: true, message: "Employee activated" };
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to activate employee"));
  }
});

export const resetEmployeePassword = createAsyncThunk<
  ResetPasswordResponse,
  string,
  { rejectValue: ParsedError }
>("employees/resetEmployeePassword", async (id, thunkAPI) => {
  try {
    const response = await apiInstance.post(`/employees/${id}/reset-password`);
    return response.data?.data ?? response.data ?? { success: true, message: "Password reset email sent" };
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to reset password"));
  }
});

export const fetchEmployeeStatistics = createAsyncThunk<
  EmployeeStatistics,
  void,
  { rejectValue: ParsedError }
>("employees/fetchEmployeeStatistics", async (_, thunkAPI) => {
  try {
    const response = await apiInstance.get("/employees/stats");
    return response.data?.data ?? response.data ?? {};
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to fetch employee statistics"));
  }
});

export const fetchEmployeeOnboardingStatus = createAsyncThunk<
  EmployeeOnboardingStatus,
  string,
  { rejectValue: ParsedError }
>("employees/fetchEmployeeOnboardingStatus", async (id, thunkAPI) => {
  try {
    const response = await apiInstance.get(`/employees/${id}/onboarding-status`);
    return response.data?.data ?? response.data ?? {};
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to fetch onboarding status"));
  }
});

export const validateEmployeeInvitation = createAsyncThunk<
  InvitationValidationResponse,
  string,
  { rejectValue: ParsedError }
>("employees/validateEmployeeInvitation", async (token, thunkAPI) => {
  try {
    const response = await apiInstance.get("/employees/validate-invitation", {
      params: { token },
    });
    return response.data?.data ?? response.data ?? { valid: false };
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to validate invitation"));
  }
});

export const activateEmployeeByToken = createAsyncThunk<
  ActivateEmployeeResponse,
  { token: string; password: string },
  { rejectValue: ParsedError }
>("employees/activateEmployeeByToken", async ({ token, password }, thunkAPI) => {
  try {
    const response = await apiInstance.post("/employees/activate", { token, password });
    return response.data?.data ?? response.data ?? { success: false, message: "Activation failed" };
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to activate account"));
  }
});
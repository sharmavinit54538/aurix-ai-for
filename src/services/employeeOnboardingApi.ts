import { api } from "@/api";
import { getFileUrl } from "@/lib/utils";

export interface PersonalInfoInput {
  first_name: string;
  middle_name?: string;
  last_name: string;
  profile_photo_url?: string;
  gender: string;
  date_of_birth: string;
  marital_status: string;
  blood_group?: string;
  nationality: string;
  father_name: string;
  mother_name: string;
  spouse_name?: string;
  personal_email: string;
  phone: string;
  
  current_address_line1: string;
  current_address_line2?: string;
  current_city: string;
  current_state: string;
  current_country: string;
  current_pincode: string;

  permanent_address_line1: string;
  permanent_address_line2?: string;
  permanent_city: string;
  permanent_state: string;
  permanent_country: string;
  permanent_pincode: string;
  is_same_address: boolean;

  emergency_contact_name: string;
  emergency_contact_relation: string;
  emergency_contact_phone: string;
  preferred_language: string;
}

export interface IdentityVerificationInput {
  aadhaar_number: string;
  pan_number: string;
  passport_number?: string;
  driving_license?: string;
  voter_id?: string;
}

export interface EmploymentDetailsInput {
  employee_id: string;
  department: string;
  designation: string;
  reporting_manager_id?: string;
  employment_type: string;
  work_location?: string;
  joining_date: string;
  probation_period_months: number;
  shift?: string;
  work_mode: string;
  office_location?: string;
  business_unit?: string;
  cost_center_id?: string;
  employee_category?: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  field_of_study?: string;
  start_year: number;
  end_year: number;
  grade?: string;
  certificate_url?: string;
}

export interface ExperienceItem {
  company_name: string;
  designation: string;
  employment_type?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
  ctc?: number;
  manager_name?: string;
  reason_for_leaving?: string;
  experience_certificate_url?: string;
  relieving_letter_url?: string;
  salary_slip_url?: string;
}

export interface BankDetailsInput {
  bank_name: string;
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  branch?: string;
  upi_id?: string;
  cancelled_cheque_url?: string;
  passbook_url?: string;
}

export interface TaxNomineeInput {
  tax_regime: string;
  uan_number?: string;
  pf_number?: string;
  esic_number?: string;
  professional_tax?: number;
  nominee_name: string;
  nominee_relation: string;
  nominee_aadhaar?: string;
  nominee_dob?: string;
}

export interface PolicyAcceptanceItem {
  policy_name: string;
  accepted: boolean;
  digital_signature: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  current_step: number;
  onboarding_completed: boolean;
  data: T;
}

export const employeeOnboardingApi = {
  getStatus: () =>
    api.get<ApiResponse<any>>("employee-onboarding/status"),

  getProgress: () =>
    api.get<ApiResponse<any>>("employee-onboarding/progress"),

  saveStep1: (data: PersonalInfoInput) =>
    api.put<ApiResponse<any>>("employee-onboarding/step/1", data),

  saveStep2: (data: IdentityVerificationInput) =>
    api.put<ApiResponse<any>>("employee-onboarding/step/2", data),

  saveStep3: (data: EmploymentDetailsInput) =>
    api.put<ApiResponse<any>>("employee-onboarding/step/3", data),

  saveStep4: (data: { education_records: EducationItem[] }) =>
    api.put<ApiResponse<any>>("employee-onboarding/step/4", data),

  saveStep5: (data: { experience_records: ExperienceItem[] }) =>
    api.put<ApiResponse<any>>("employee-onboarding/step/5", data),

  saveStep6: (data: BankDetailsInput) =>
    api.put<ApiResponse<any>>("employee-onboarding/step/6", data),

  saveStep7: (data: TaxNomineeInput) =>
    api.put<ApiResponse<any>>("employee-onboarding/step/7", data),

  saveStep8: () =>
    api.put<ApiResponse<any>>("employee-onboarding/step/8"),

  saveStep9: (data: { acceptances: PolicyAcceptanceItem[] }) =>
    api.put<ApiResponse<any>>("employee-onboarding/step/9", data),

  complete: () =>
    api.post<ApiResponse<any>>("employee-onboarding/complete"),

  saveDraft: (currentStep: number, draftData: any) =>
    api.post<ApiResponse<any>>("employee-onboarding/draft", {
      current_step: currentStep,
      draft_data: draftData,
    }),

  uploadFile: async (file: File, documentType: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("document_type", documentType);
    const res = await api.post<ApiResponse<any>>("employee-onboarding/step/8/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data?.url && typeof res.data.url === "string") {
      res.data.url = getFileUrl(res.data.url);
    }
    return res;
  },



  deleteFile: (docId: string) =>
    api.delete<ApiResponse<any>>(`employee-onboarding/step/8/document/${docId}`),
};

export const adminOnboardingApi = {
  listProgress: (filters: { department?: string; location?: string; status?: string; search?: string } = {}) => {
    const query = new URLSearchParams(filters as any).toString();
    return api.get<any>(`admin/employee-onboarding?${query}`);
  },

  getDetails: (employeeId: string) =>
    api.get<any>(`admin/employee-onboarding/${employeeId}`),

  verifyDocument: (employeeId: string, docId: string, status: "VERIFIED" | "REJECTED", comments?: string) =>
    api.put<any>(`admin/employee-onboarding/${employeeId}/document/${docId}/verify`, { status, comments }),
};

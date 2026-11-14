import apiInstance from "@/api/apiInstance";

export interface OnboardingStepData {
  step: number;
  completed: boolean;
  data?: Record<string, any>;
}

export interface ListProgressParams {
  status?: string;
  department?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface OnboardingProgressItem {
  id: string;
  employee_id: string;
  employee_name: string;
  full_name?: string;
  email: string;
  department: string;
  designation: string;
  joining_date: string;
  current_step: string;
  completion_percentage: number;
  progress_percentage?: number;
  status: "COMPLETED" | "IN_PROGRESS" | "PENDING" | string;
  missing_documents: string[];
  submitted_at?: string;
}

export interface OnboardingDocumentItem {
  id: string;
  document_type: string;
  name: string;
  file_url?: string;
  verification_status: "VERIFIED" | "PENDING" | "REJECTED" | string;
  rejection_reason?: string | null;
  uploaded_at?: string;
}

export interface OnboardingDetails {
  id: string;
  employee_id: string;
  employee_name: string;
  email: string;
  department: string;
  designation: string;
  joining_date: string;
  progress_percentage: number;
  completion_percentage: number;
  current_step: string;
  status: "pending" | "in_progress" | "completed" | "COMPLETED" | "IN_PROGRESS" | string;
  steps: OnboardingStepData[];
  personal_information?: Record<string, any>;
  identity_details?: Record<string, any>;
  bank_details?: Record<string, any>;
  employment_details?: Record<string, any>;
  documents?: OnboardingDocumentItem[];
}

export const employeeOnboardingApi = {
  getStatus: async (): Promise<OnboardingDetails> => {
    const res = await apiInstance.get("/onboarding/employee/status");
    return res.data?.data ?? res.data;
  },
  saveStep: async (step: number, data: any) => {
    const res = await apiInstance.post(`/onboarding/employee/steps/${step}`, data);
    return res.data?.data ?? res.data ?? { success: true };
  },
  completeOnboarding: async () => {
    const res = await apiInstance.post("/onboarding/employee/complete", {});
    return res.data?.data ?? res.data ?? { success: true };
  },
  uploadDocument: async (formData: FormData) => {
    const res = await apiInstance.post(
      "/onboarding/employee/documents",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return res.data?.data ?? res.data;
  },
};

export const adminOnboardingApi = {
  listProgress: async (
    params?: ListProgressParams,
  ): Promise<OnboardingProgressItem[]> => {
    const res = await apiInstance.get("/onboarding/admin/progress", { params });
    const payload = res.data?.data ?? res.data;
    return Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.items)
        ? payload.items
        : [];
  },

  getDetails: async (employeeId: string): Promise<OnboardingDetails> => {
    const res = await apiInstance.get(
      `/onboarding/admin/employees/${encodeURIComponent(employeeId)}`,
    );
    return res.data?.data ?? res.data;
  },

  verifyDocument: async (
    employeeId: string,
    documentId: string,
    status: "VERIFIED" | "REJECTED",
    comment?: string,
  ) => {
    const res = await apiInstance.post(
      `/onboarding/admin/employees/${encodeURIComponent(employeeId)}/documents/${encodeURIComponent(documentId)}/verify`,
      { status, comment },
    );
    return res.data?.data ?? res.data ?? { success: true };
  },

  sendReminder: async (id: string) => {
    const res = await apiInstance.post(
      `/onboarding/admin/employees/${encodeURIComponent(id)}/remind`,
      {},
    );
    return res.data?.data ?? res.data ?? { success: true };
  },

  verifyStep: async (id: string, step: number) => {
    const res = await apiInstance.post(
      `/onboarding/admin/employees/${encodeURIComponent(id)}/steps/${step}/verify`,
      {},
    );
    return res.data?.data ?? res.data ?? { success: true };
  },
};

export default employeeOnboardingApi;

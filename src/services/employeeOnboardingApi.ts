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

let onboardingProgressItems: OnboardingProgressItem[] = [
  {
    id: "onb-1",
    employee_id: "EMP-1001",
    employee_name: "Alex Vance",
    full_name: "Alex Vance",
    email: "alex.vance@aurix.ai",
    department: "Engineering",
    designation: "VP of Engineering",
    joining_date: "2025-01-15",
    current_step: "Completed",
    completion_percentage: 100,
    progress_percentage: 100,
    status: "COMPLETED",
    missing_documents: [],
    submitted_at: "2025-01-14T10:00:00Z",
  },
  {
    id: "onb-2",
    employee_id: "EMP-1003",
    employee_name: "Marcus Sterling",
    full_name: "Marcus Sterling",
    email: "marcus.s@aurix.ai",
    department: "AI Research",
    designation: "Principal AI Scientist",
    joining_date: "2025-06-01",
    current_step: "Document Verification",
    completion_percentage: 85,
    progress_percentage: 85,
    status: "IN_PROGRESS",
    missing_documents: ["Previous Relieving Letter"],
    submitted_at: "2025-05-29T14:20:00Z",
  },
  {
    id: "onb-3",
    employee_id: "EMP-1005",
    employee_name: "Ananya Verma",
    full_name: "Ananya Verma",
    email: "ananya.verma@aurix.ai",
    department: "AI Research",
    designation: "Senior Staff AI Engineer",
    joining_date: "2026-11-25",
    current_step: "Bank & Statutory Details",
    completion_percentage: 60,
    progress_percentage: 60,
    status: "IN_PROGRESS",
    missing_documents: ["PAN Card", "Cancelled Cheque"],
    submitted_at: "2026-11-10T09:15:00Z",
  },
];

let onboardingDocsByEmployee: Record<string, OnboardingDocumentItem[]> = {
  "EMP-1001": [
    {
      id: "doc-101",
      document_type: "PAN Card",
      name: "Alex_Vance_PAN.pdf",
      verification_status: "VERIFIED",
      uploaded_at: "2025-01-12",
    },
    {
      id: "doc-102",
      document_type: "Aadhaar Card",
      name: "Alex_Vance_Aadhaar.pdf",
      verification_status: "VERIFIED",
      uploaded_at: "2025-01-12",
    },
  ],
  "EMP-1003": [
    {
      id: "doc-201",
      document_type: "PAN Card",
      name: "Marcus_Sterling_PAN.pdf",
      verification_status: "VERIFIED",
      uploaded_at: "2025-05-28",
    },
    {
      id: "doc-202",
      document_type: "Degree Certificate",
      name: "Marcus_PhD_Certificate.pdf",
      verification_status: "PENDING",
      uploaded_at: "2025-05-29",
    },
  ],
  "EMP-1005": [
    {
      id: "doc-301",
      document_type: "Identity Proof",
      name: "Ananya_Verma_Aadhaar.pdf",
      verification_status: "PENDING",
      uploaded_at: "2026-11-10",
    },
  ],
};

export const employeeOnboardingApi = {
  getStatus: async (): Promise<OnboardingDetails> => ({
    id: "onb-1",
    employee_id: "EMP-1001",
    employee_name: "Alex Vance",
    email: "alex.vance@aurix.ai",
    department: "Engineering",
    designation: "VP of Engineering",
    joining_date: "2025-01-15",
    progress_percentage: 100,
    completion_percentage: 100,
    current_step: "Completed",
    status: "COMPLETED",
    steps: [],
  }),
  saveStep: async (_step: number, _data: any) => ({ success: true }),
  completeOnboarding: async () => ({ success: true }),
  uploadDocument: async (_formData: any) => ({ success: true, url: "" }),
};

export const adminOnboardingApi = {
  listProgress: async (params?: ListProgressParams): Promise<OnboardingProgressItem[]> => {
    let list = [...onboardingProgressItems];
    if (params?.status && params.status !== "all") {
      list = list.filter((i) => i.status.toUpperCase() === params.status!.toUpperCase());
    }
    if (params?.department && params.department !== "all") {
      list = list.filter((i) => i.department.toLowerCase() === params.department!.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (i) =>
          i.employee_name.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q) ||
          i.employee_id.toLowerCase().includes(q),
      );
    }
    return list;
  },

  getDetails: async (employeeId: string): Promise<OnboardingDetails> => {
    const found =
      onboardingProgressItems.find(
        (i) => i.employee_id === employeeId || i.id === employeeId,
      ) || onboardingProgressItems[0];

    const docs = onboardingDocsByEmployee[found.employee_id] || [];

    return {
      id: found.id,
      employee_id: found.employee_id,
      employee_name: found.employee_name,
      email: found.email,
      department: found.department,
      designation: found.designation,
      joining_date: found.joining_date,
      progress_percentage: found.completion_percentage,
      completion_percentage: found.completion_percentage,
      current_step: found.current_step,
      status: found.status,
      steps: [
        { step: 1, completed: true, data: { label: "Personal Information" } },
        { step: 2, completed: true, data: { label: "Identity Verification" } },
        { step: 3, completed: found.completion_percentage >= 80, data: { label: "Bank & Tax" } },
        { step: 4, completed: found.completion_percentage === 100, data: { label: "Documents" } },
      ],
      personal_information: {
        gender: "Male",
        date_of_birth: "1992-05-14",
        nationality: "Indian",
        blood_group: "O+",
      },
      identity_details: {
        pan_number: "ABCDE1234F",
        aadhaar_number: "987654321098",
      },
      bank_details: {
        bank_name: "HDFC Bank",
        account_number: "5010029384756",
        ifsc_code: "HDFC0001234",
      },
      employment_details: {
        work_mode: "Hybrid",
        work_location: "Bengaluru · Global HQ",
        probation_period_months: 3,
      },
      documents: docs,
    };
  },

  verifyDocument: async (
    employeeId: string,
    documentId: string,
    status: "VERIFIED" | "REJECTED",
    comment?: string,
  ) => {
    const list = onboardingDocsByEmployee[employeeId] || [];
    onboardingDocsByEmployee[employeeId] = list.map((d) =>
      d.id === documentId
        ? { ...d, verification_status: status, rejection_reason: comment || null }
        : d,
    );
    return { success: true };
  },

  sendReminder: async (_id: string) => ({ success: true }),
  verifyStep: async (_id: string, _step: number) => ({ success: true }),
};

export default employeeOnboardingApi;

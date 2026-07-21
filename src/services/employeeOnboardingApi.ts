import apiInstance from "@/api/apiInstance";
import { normalizeScalarString } from "@/features/admin/recruitment/utils/onboardingDisplay";

export type OnboardingStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REJECTED"
  | string;

export type DocumentVerificationStatus =
  | "PENDING"
  | "VERIFIED"
  | "REJECTED"
  | string;

export interface OnboardingProgressItem {
  employee_id: string;
  employee_code?: string;
  name: string;
  department: string;
  designation: string;
  joining_date?: string;
  work_location?: string;
  status: OnboardingStatus;
  current_step: string;
  completion_percentage: number;
  missing_documents: string[];
}

export interface ListProgressParams {
  status?: string;
  department?: string;
  location?: string;
  search?: string;
}

export interface OnboardingDocument {
  id: string;
  name: string;
  document_type?: string;
  file_url?: string;
  download_url?: string;
  document_url?: string;
  verification_status: DocumentVerificationStatus;
  rejection_comment?: string | null;
  updated_at?: string;
  uploaded_at?: string;
}

export interface PolicyAcceptance {
  id?: string;
  policy_name?: string;
  name?: string;
  accepted?: boolean;
  accepted_at?: string;
  version?: string;
}

export interface OnboardingDetails {
  employee_id: string;
  name: string;
  status: OnboardingStatus;
  current_step: string;
  completion_percentage: number;
  onboarding_completed?: boolean;
  verification_status?: string;
  personal_information?: Record<string, unknown>;
  identity_details?: Record<string, unknown>;
  employment_details?: Record<string, unknown>;
  education?: Array<Record<string, unknown>>;
  experience?: Array<Record<string, unknown>>;
  bank_details?: Record<string, unknown>;
  tax_payroll?: Record<string, unknown>;
  documents?: OnboardingDocument[];
  policy_acceptances?: PolicyAcceptance[];
}

interface ApiEnvelope<T = unknown> {
  success?: boolean;
  message?: string;
  current_step?: number;
  onboarding_completed?: boolean;
  data?: T;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function readName(raw: Record<string, unknown>): string {
  if (typeof raw.name === "string" && raw.name.trim()) return raw.name.trim();
  if (typeof raw.full_name === "string" && raw.full_name.trim()) return raw.full_name.trim();

  const personal = asRecord(raw.personal_info);
  const firstName = String(personal?.first_name ?? raw.first_name ?? "").trim();
  const lastName = String(personal?.last_name ?? raw.last_name ?? "").trim();
  return `${firstName} ${lastName}`.trim() || "Unknown";
}

function readStatusBlock(raw: Record<string, unknown>): Record<string, unknown> | null {
  const status = asRecord(raw.status);
  if (
    status &&
    ("current_step" in status ||
      "onboarding_completed" in status ||
      "completion_percentage" in status ||
      "steps_completed" in status)
  ) {
    return status;
  }
  return asRecord(raw.onboarding_status) ?? asRecord(raw.onboarding);
}

function readEmployment(raw: Record<string, unknown>): Record<string, unknown> | null {
  return (
    asRecord(raw.employment) ??
    asRecord(raw.employment_info) ??
    asRecord(raw.employment_details) ??
    null
  );
}

function readOnboardingCompleted(raw: Record<string, unknown>): boolean {
  const block = readStatusBlock(raw);
  if (block?.onboarding_completed === true) return true;
  return raw.onboarding_completed === true;
}

function readCompletionPercentage(raw: Record<string, unknown>): number {
  const block = readStatusBlock(raw);
  const value =
    block?.completion_percentage ??
    raw.completion_percentage ??
    raw.completionPercentage;
  return Number(value ?? 0);
}

function readStatus(raw: Record<string, unknown>): OnboardingStatus {
  if (typeof raw.status === "string" && raw.status.trim()) return raw.status.trim();

  const block = readStatusBlock(raw);
  if (block) {
    if (block.onboarding_completed === true) return "COMPLETED";
    const step = block.current_step;
    if (step !== null && step !== undefined && Number(step) > 0) return "IN_PROGRESS";
    return "PENDING";
  }

  const direct = normalizeScalarString(raw.status);
  if (direct) return direct;

  if (readOnboardingCompleted(raw)) return "COMPLETED";
  const step = readCurrentStep(raw);
  if (step && Number(step) > 0) return "IN_PROGRESS";
  return "PENDING";
}

function readCurrentStep(raw: Record<string, unknown>): string {
  const block = readStatusBlock(raw);
  const value =
    raw.current_step ??
    raw.currentStep ??
    raw.step ??
    block?.current_step ??
    block?.currentStep;

  if (value === null || value === undefined || value === "") return "";
  return String(value);
}

function readMissingDocuments(raw: Record<string, unknown>): string[] {
  const docs = asArray(raw.missing_documents).map((item) => {
    if (typeof item === "string") return item;
    if (item && typeof item === "object") {
      const doc = item as Record<string, unknown>;
      return String(doc.name ?? doc.document_type ?? doc.type ?? "Document");
    }
    return String(item);
  }).filter(Boolean);

  if (docs.length > 0) return docs;

  const block = readStatusBlock(raw);
  const steps = asRecord(block?.steps_completed);
  if (!steps) return [];

  return Object.entries(steps)
    .filter(([, done]) => done === false)
    .map(([key]) => key.replace(/_/g, " "));
}

function mapDocument(raw: unknown): OnboardingDocument | null {
  const doc = asRecord(raw);
  if (!doc) return null;

  const id = String(doc.id ?? doc.doc_id ?? doc.document_id ?? "");
  if (!id) return null;

  return {
    id,
    name: String(doc.title ?? doc.name ?? doc.document_name ?? doc.file_name ?? "Document"),
    document_type: doc.document_type ? String(doc.document_type) : doc.type ? String(doc.type) : undefined,
    file_url: doc.file_url ? String(doc.file_url) : doc.document_url ? String(doc.document_url) : doc.url ? String(doc.url) : undefined,
    download_url: doc.download_url ? String(doc.download_url) : undefined,
    document_url: doc.document_url ? String(doc.document_url) : undefined,
    verification_status: normalizeScalarString(
      doc.verification_status ?? doc.status,
      "PENDING",
    ),
    rejection_comment:
      typeof doc.rejection_comment === "string"
        ? doc.rejection_comment
        : typeof doc.comments === "string"
          ? doc.comments
          : null,
    updated_at: doc.updated_at ? String(doc.updated_at) : doc.created_at ? String(doc.created_at) : undefined,
    uploaded_at: doc.uploaded_at ? String(doc.uploaded_at) : doc.created_at ? String(doc.created_at) : undefined,
  };
}

export function mapProgressListItem(raw: Record<string, unknown>): OnboardingProgressItem {
  // Admin list API returns flat rows:
  // employee_id, employee_code, name, department, designation, status,
  // current_step, completion_percentage, missing_documents, ...
  const personal = asRecord(raw.personal_info);
  const employment = readEmployment(raw);

  return {
    employee_id: String(raw.employee_id ?? raw.id ?? ""),
    employee_code: raw.employee_code ? String(raw.employee_code) : undefined,
    name: readName(raw),
    department: String(
      raw.department ?? employment?.department ?? personal?.department ?? "",
    ),
    designation: String(
      raw.designation ?? raw.designation_name ?? employment?.designation ?? "",
    ),
    joining_date: raw.joining_date ? String(raw.joining_date) : undefined,
    work_location: raw.work_location ? String(raw.work_location) : undefined,
    status: readStatus(raw),
    current_step: readCurrentStep(raw),
    completion_percentage: readCompletionPercentage(raw),
    missing_documents: readMissingDocuments(raw),
  };
}

export function mapOnboardingDetails(
  envelope: ApiEnvelope<Record<string, unknown>> | Record<string, unknown>,
): OnboardingDetails {
  const root = asRecord(envelope) ?? {};
  const payload = asRecord(root.data) ?? root;
  const personal = asRecord(payload.personal_info);
  const employment = readEmployment(payload);
  const statusSource = { ...payload, ...root };

  const documents = asArray(payload.documents ?? payload.uploaded_documents)
    .map(mapDocument)
    .filter((doc): doc is OnboardingDocument => doc !== null);

  const policyAcceptances = asArray(payload.policies ?? payload.policy_acceptances).map((item) => {
    const policy = asRecord(item) ?? {};
    return {
      id: policy.id ? String(policy.id) : undefined,
      policy_name: policy.policy_name ? String(policy.policy_name) : undefined,
      name: policy.name ? String(policy.name) : undefined,
      accepted:
        typeof policy.accepted === "boolean"
          ? policy.accepted
          : Boolean(policy.accepted_at),
      accepted_at: policy.accepted_at ? String(policy.accepted_at) : undefined,
      version: policy.policy_version
        ? String(policy.policy_version)
        : policy.version
          ? String(policy.version)
          : undefined,
    };
  });

  return {
    employee_id: String(
      root.employee_id ?? payload.employee_id ?? employment?.employee_id ?? "",
    ),
    name: readName(payload),
    status: readStatus(statusSource),
    current_step: readCurrentStep(statusSource),
    completion_percentage: readCompletionPercentage(statusSource),
    onboarding_completed: readOnboardingCompleted(statusSource),
    verification_status: normalizeScalarString(payload.verification_status) || undefined,
    personal_information: personal ?? undefined,
    identity_details:
      asRecord(payload.identity) ??
      asRecord(payload.identity_info) ??
      asRecord(payload.identity_verification) ??
      asRecord(payload.identity_details) ??
      undefined,
    employment_details: employment ?? undefined,
    education: asArray(payload.education)
      .map((item) => asRecord(item))
      .filter((item): item is Record<string, unknown> => item !== null),
    experience: asArray(payload.experience)
      .map((item) => asRecord(item))
      .filter((item): item is Record<string, unknown> => item !== null),
    bank_details:
      asRecord(payload.bank) ??
      asRecord(payload.bank_details) ??
      asRecord(payload.bank_info) ??
      undefined,
    tax_payroll:
      asRecord(payload.tax_payroll) ??
      asRecord(payload.tax_and_payroll) ??
      asRecord(payload.payroll_details) ??
      undefined,
    documents,
    policy_acceptances: policyAcceptances,
  };
}

function buildListQuery(params?: ListProgressParams): string {
  const searchParams = new URLSearchParams();
  if (params?.status && params.status !== "all") searchParams.set("status", params.status);
  if (params?.department && params.department !== "all") searchParams.set("department", params.department);
  if (params?.location && params.location !== "all") searchParams.set("location", params.location);
  if (params?.search?.trim()) searchParams.set("search", params.search.trim());
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export const adminOnboardingApi = {
  /** Admin list: GET /admin/employee-onboarding */
  async listProgress(params?: ListProgressParams): Promise<OnboardingProgressItem[]> {
    const res = await apiInstance.get(`/admin/employee-onboarding${buildListQuery(params)}`);
    const body = res.data as ApiEnvelope<unknown[] | Record<string, unknown>>;
    const rows = asArray(body?.data);
    return rows
      .map((item) => asRecord(item))
      .filter((item): item is Record<string, unknown> => item !== null)
      .map(mapProgressListItem)
      .filter((item) => item.employee_id);
  },

  /** Admin details: GET /admin/employee-onboarding/{employee_id} */
  async getDetails(employeeId: string): Promise<OnboardingDetails> {
    const res = await apiInstance.get(`/admin/employee-onboarding/${employeeId}`);
    return mapOnboardingDetails(res.data as ApiEnvelope<Record<string, unknown>>);
  },

  /** Admin verify: PUT /admin/employee-onboarding/{employee_id}/document/{doc_id}/verify */
  async verifyDocument(
    employeeId: string,
    documentId: string,
    status: "VERIFIED" | "REJECTED",
    comment?: string,
  ): Promise<void> {
    await apiInstance.put(`/admin/employee-onboarding/${employeeId}/document/${documentId}/verify`, {
      status,
      comments: comment ?? null,  
    });
  },
};

export default adminOnboardingApi;

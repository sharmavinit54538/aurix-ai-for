export type CategoryGroup =
  | "Employee Documents"
  | "Education"
  | "Employment"
  | "Company Documents"
  | "HR Letters"
  | "Employee ID Cards";

export const CATEGORY_GROUPS: CategoryGroup[] = [
  "Employee Documents",
  "Education",
  "Employment",
  "Company Documents",
  "HR Letters",
  "Employee ID Cards",
];

export interface BackendCategory {
  id: string;
  name: string;
  code?: string;
  group: CategoryGroup | string;
  is_company?: boolean;
}

export type DocumentSource = "employee" | "company";

export type DocumentStatus = "VERIFIED" | "PENDING" | "REJECTED" | "Expired" | "Published";

export interface BackendDocumentItem {
  id: string;
  employee_id?: string;
  employee_name?: string;
  employee_code?: string;
  category_id?: string;
  category_name?: string;
  category_group?: string;
  category?: { id?: string; name?: string; group?: string };
  employee?: { first_name?: string; last_name?: string; full_name?: string; employee_id?: string };
  uploaded_by?: string;
  uploaded_by_name?: string;
  verified_by?: string;
  verified_at?: string;
  is_verified?: boolean;
  status?: string;
  status_field?: string;
  file_size?: number;
  file_url?: string;
  download_url?: string;
  document_url?: string;
  url?: string;
  file_path?: string;
  file_name?: string;
  title?: string;
  name?: string;
  document_type?: string;
  document_number?: string;
  type?: string;
  description?: string;
  issue_date?: string;
  expiry_date?: string;
  visibility?: string;
  department?: string;
  branch?: string;
  tags?: string;
  created_at?: string;
  updated_at?: string;
  rejection_reason?: string;
  rejection_comments?: string;
  comments?: string;
  last_review?: string;
}

export interface DocumentItem {
  id: string;
  source: DocumentSource;
  title: string;
  fileName: string;
  employeeId?: string;
  employeeName?: string;
  employeeCode?: string;
  categoryId?: string;
  categoryName: string;
  categoryGroup: CategoryGroup;
  documentType?: string;
  documentNumber?: string;
  uploadedByName: string;
  uploadedAt: string;
  issueDate?: string;
  expiryDate?: string;
  isExpired: boolean;
  status: DocumentStatus;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  fileSize: string;
  fileSizeBytes?: number;
  fileType: "pdf" | "jpg" | "png" | "docx" | "doc" | "other";
  fileUrl?: string;
  description?: string;
  rejectionReason?: string;
  department?: string;
  branch?: string;
  visibility?: string;
  tags?: string;
  lastReview?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface BackendListResponse<T = BackendDocumentItem> {
  data?: T[];
  items?: T[];
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    has_more?: boolean;
    hasMore?: boolean;
  };
  total?: number;
  page?: number;
  limit?: number;
}

export interface DocumentListResult {
  items: DocumentItem[];
  meta: PaginationMeta;
}

export type DocumentsTabKey =
  | "all"
  | "employee-docs"
  | "company-docs"
  | "hr-letters"
  | "id-cards"
  | "templates"
  | "verification"
  | "expiry"
  | "activity"
  | "Employee Documents"
  | "Company Documents"
  | "Pending"
  | "Verified"
  | "Rejected"
  | "Expired";

export interface DocumentFilters {
  tab: DocumentsTabKey;
  search?: string;
  employeeId?: string;
  categoryId?: string;
  documentType?: string;
  status?: string;
  verificationStatus?: "ALL" | "PENDING" | "VERIFIED" | "REJECTED";
  expiryWindow?: "all" | "expired" | "7d" | "30d" | "60d" | "valid";
  sortBy?: "created_at" | "title" | "expiry_date" | "employee_name";
  order?: "asc" | "desc";
  page: number;
  limit: number;
}

export interface DocumentSummary {
  total: number;
  verified: number;
  pending: number;
  rejected: number;
  expiring: number;
  expired: number;
}

export type DocumentAuditEventAction =
  | "Document Uploaded"
  | "Document Viewed"
  | "Document Downloaded"
  | "Document Verified"
  | "Document Rejected"
  | "Document Re-uploaded"
  | "Document Deleted"
  | "Letter Generated"
  | "Letter Downloaded"
  | "Letter Sent"
  | "Template Created"
  | "Template Updated"
  | "ID Card Generated"
  | "ID Card Replaced"
  | string;

export interface DocumentActivityItem {
  id: string;
  documentId: string;
  documentName: string;
  action: DocumentAuditEventAction;
  performedBy: string;
  timestamp: string;
  details?: string;
  employeeName?: string;
  employeeId?: string;
}

export interface UploadEmployeePayload {
  file: File;
  employeeId: string;
  categoryId: string;
  title: string;
  documentType?: string;
  documentNumber?: string;
  description?: string;
  issueDate?: string;
  expiryDate?: string;
  visibility?: "PRIVATE" | "MANAGER_ONLY" | "HR_ONLY" | "COMPANY";
  statusField?: string;
  tags?: string;
}

export interface UploadCompanyPayload {
  file: File;
  categoryId: string;
  title: string;
  description?: string;
  department?: string;
  branch?: string;
  visibility?: string;
}

export interface GenerateDocumentPayload {
  templateId: string;
  employeeId?: string;
  fields: Record<string, string>;
}

export interface DocumentTemplateConfig {
  id: string;
  title: string;
  categoryGroup: CategoryGroup;
  fields: Array<{ key: string; label: string; placeholder: string; required?: boolean }>;
}

// ── Reusable Document Template System ─────────────────────────────────────────

export interface TemplatePlaceholder {
  key: string;
  label: string;
  description: string;
  example: string;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  category: string;
  code: string;
  description?: string;
  subject?: string;
  content: string;
  variables: string[];
  isActive: boolean;
  isDefault?: boolean;
  createdAt: string;
  updatedAt?: string;
}

// ── HR Letters Types & Generation ───────────────────────────────────────────

export type HrLetterCategory =
  | "JOINING & EMPLOYMENT"
  | "SALARY & COMPENSATION"
  | "EMPLOYMENT VERIFICATION"
  | "ROLE & TRANSFER"
  | "LEAVE & ABSENCE"
  | "WARNING & DISCIPLINARY"
  | "EXIT & SEPARATION"
  | "GENERAL HR";

export interface LetterTypeDefinition {
  id: string;
  title: string;
  category: HrLetterCategory;
  description: string;
  defaultTemplateId: string;
  requiredFields: Array<{
    key: string;
    label: string;
    type?: "text" | "number" | "date" | "textarea" | "select";
    placeholder?: string;
    required: boolean;
    defaultValue?: string;
    options?: string[];
  }>;
}

export interface GeneratedLetterRecord {
  id: string;
  letterTypeId: string;
  letterTitle: string;
  category: HrLetterCategory;
  employeeId: string;
  employeeName: string;
  employeeCode?: string;
  generatedBy: string;
  generatedAt: string;
  status: "Draft" | "Generated" | "Sent" | "Archived";
  content: string;
  savedDocumentId?: string;
  fields: Record<string, string>;
}

// ── Employee ID Cards Types ──────────────────────────────────────────────────

export type IdCardStatus = "Active" | "Inactive" | "Expired" | "Replaced";

export type IdCardTheme = "navy" | "slate" | "emerald" | "purple";

export interface EmployeeIdCardData {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  designation: string;
  department: string;
  joiningDate: string;
  bloodGroup?: string;
  photoUrl?: string;
  companyName: string;
  companyAddress: string;
  emergencyContact: string;
  employeeContact: string;
  email: string;
  authorizedSignatoryName: string;
  qrPayload: string;
  terms: string;
  theme: IdCardTheme;
  status: IdCardStatus;
  issueDate: string;
  expiryDate?: string;
  generatedAt: string;
  cardVersion: number;
}

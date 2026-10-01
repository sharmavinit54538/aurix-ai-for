export type CategoryGroup =
  | "Employee Documents"
  | "Education"
  | "Employment"
  | "Company Documents";

export const CATEGORY_GROUPS: CategoryGroup[] = [
  "Employee Documents",
  "Education",
  "Employment",
  "Company Documents",
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
  employee?: { first_name?: string; last_name?: string; full_name?: string };
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

export interface DocumentFilters {
  tab: "all" | "Employee Documents" | "Company Documents" | "Pending" | "Verified" | "Rejected" | "Expired";
  search?: string;
  categoryId?: string;
  status?: string;
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

export interface DocumentActivityItem {
  id: string;
  documentId: string;
  documentName: string;
  action: "Uploaded" | "Verified" | "Rejected" | "Downloaded" | "Updated" | "ReuploadRequested" | string;
  performedBy: string;
  timestamp: string;
  details?: string;
}

export interface UploadEmployeePayload {
  file: File;
  employeeId: string;
  categoryId: string;
  title: string;
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

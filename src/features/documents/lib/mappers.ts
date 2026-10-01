import type {
  BackendCategory,
  BackendDocumentItem,
  DocumentItem,
  DocumentSource,
  DocumentStatus,
} from "./types";
import { normalizeCategoryGroup } from "./categoryMap";

export function formatFileSize(bytes?: number | null): string {
  if (bytes === null || bytes === undefined || isNaN(bytes) || bytes <= 0) {
    return "—";
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function detectFileType(
  fileName?: string | null,
  fileUrl?: string | null,
  mimeType?: string | null
): "pdf" | "jpg" | "png" | "docx" | "doc" | "other" {
  const checkStr = `${fileName || ""} ${fileUrl || ""} ${mimeType || ""}`.toLowerCase();

  if (checkStr.includes(".pdf") || checkStr.includes("application/pdf")) {
    return "pdf";
  }
  if (checkStr.includes(".png") || checkStr.includes("image/png")) {
    return "png";
  }
  if (
    checkStr.includes(".jpg") ||
    checkStr.includes(".jpeg") ||
    checkStr.includes("image/jpeg") ||
    checkStr.includes("image/jpg")
  ) {
    return "jpg";
  }
  if (
    checkStr.includes(".docx") ||
    checkStr.includes("application/vnd.openxmlformats-officedocument.wordprocessingml")
  ) {
    return "docx";
  }
  if (checkStr.includes(".doc") || checkStr.includes("application/msword")) {
    return "doc";
  }

  return "other";
}

export function isDocumentExpired(expiryDate?: string | null): boolean {
  if (!expiryDate) return false;
  const t = new Date(expiryDate).getTime();
  if (isNaN(t)) return false;
  // End of the expiry day
  const endOfDay = new Date(expiryDate);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay.getTime() < Date.now();
}

export function mapDocumentStatus(
  backendDoc: BackendDocumentItem,
  source: DocumentSource
): DocumentStatus {
  if (source === "company") {
    return "Published";
  }

  const rawStatus = (backendDoc.status || backendDoc.status_field || "").toUpperCase();
  const isVerified = Boolean(backendDoc.is_verified || rawStatus === "VERIFIED");

  if (isDocumentExpired(backendDoc.expiry_date)) {
    return "Expired";
  }

  if (isVerified) {
    return "VERIFIED";
  }

  if (rawStatus === "REJECTED") {
    return "REJECTED";
  }

  return "PENDING";
}

export function mapBackendDocument(
  d: BackendDocumentItem,
  source: DocumentSource,
  categoriesMap?: Map<string, BackendCategory>
): DocumentItem {
  const categoryId = d.category_id || d.category?.id;
  const matchedCategory = categoryId && categoriesMap ? categoriesMap.get(categoryId) : undefined;

  const categoryName =
    matchedCategory?.name ||
    d.category_name ||
    d.category?.name ||
    (source === "company" ? "Company Policy" : "General Document");

  const categoryGroup = normalizeCategoryGroup(
    matchedCategory?.group || d.category_group || d.category?.group,
    source === "company" || matchedCategory?.is_company
  );

  const employeeName =
    d.employee_name ||
    (d.employee
      ? [d.employee.first_name, d.employee.last_name].filter(Boolean).join(" ").trim() ||
        d.employee.full_name
      : undefined);

  const title =
    d.title ||
    d.name ||
    d.document_type ||
    d.type ||
    (source === "company" ? "Company Document" : "Employee Document");

  const fileName = d.file_name || d.name || title;
  const fileUrl = d.file_url || d.download_url || d.document_url || d.url || d.file_path;

  const rawDate = d.created_at || d.updated_at;
  const uploadedAt = rawDate ? rawDate.split("T")[0] : "—";
  const issueDate = d.issue_date ? d.issue_date.split("T")[0] : undefined;
  const expiryDate = d.expiry_date ? d.expiry_date.split("T")[0] : undefined;

  const status = mapDocumentStatus(d, source);
  const isVerified = source === "employee" && (status === "VERIFIED" || Boolean(d.is_verified));

  return {
    id: String(d.id),
    source,
    title,
    fileName,
    employeeId: d.employee_id,
    employeeName: employeeName || (source === "company" ? "Company-wide" : "—"),
    employeeCode: d.employee_code,
    categoryId,
    categoryName,
    categoryGroup,
    uploadedByName: d.uploaded_by_name || d.uploaded_by || "—",
    uploadedAt,
    issueDate,
    expiryDate,
    isExpired: isDocumentExpired(d.expiry_date),
    status,
    isVerified,
    verifiedBy: d.verified_by,
    verifiedAt: d.verified_at,
    fileSize: formatFileSize(d.file_size),
    fileSizeBytes: d.file_size,
    fileType: detectFileType(fileName, fileUrl),
    fileUrl,
    description: d.description,
    rejectionReason: d.rejection_reason || d.rejection_comments || d.comments,
    department: d.department,
    branch: d.branch,
    visibility: d.visibility,
    tags: d.tags,
    lastReview: d.last_review,
  };
}

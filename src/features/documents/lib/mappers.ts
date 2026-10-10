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

/**
 * Parses a date-only string (YYYY-MM-DD) as a local calendar date,
 * avoiding UTC midnight conversion issues in US timezones.
 */
export function parseLocalDate(dateStr?: string | null): Date | null {
  if (!dateStr || typeof dateStr !== "string") return null;
  const trimmed = dateStr.trim();
  const dateOnlyMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (dateOnlyMatch) {
    const year = parseInt(dateOnlyMatch[1], 10);
    const month = parseInt(dateOnlyMatch[2], 10) - 1;
    const day = parseInt(dateOnlyMatch[3], 10);
    return new Date(year, month, day);
  }

  const d = new Date(trimmed);
  if (isNaN(d.getTime())) return null;
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/**
 * Calculates the calendar day difference between targetDate and baseDate (target - base).
 */
export function getCalendarDayDifference(targetDate: Date, baseDate = new Date()): number {
  const targetMidnight = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const baseMidnight = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const diffMs = targetMidnight.getTime() - baseMidnight.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Returns the calendar days remaining until expiry (0 = today, < 0 = expired, > 0 = days left).
 */
export function getExpiryDiffDays(expiryDate?: string | null, baseDate = new Date()): number | null {
  const parsed = parseLocalDate(expiryDate);
  if (!parsed) return null;
  return getCalendarDayDifference(parsed, baseDate);
}

/**
 * Returns true if the document expiry date has passed before today.
 * Documents expiring today (diffDays === 0) are valid until end of day.
 */
export function isDocumentExpired(expiryDate?: string | null, baseDate = new Date()): boolean {
  const diff = getExpiryDiffDays(expiryDate, baseDate);
  if (diff === null) return false;
  return diff < 0;
}

/**
 * Shared helper for filtering documents against expiry windows based on local calendar days.
 */
export function matchesExpiryWindow(expiryDate?: string | null, window?: string, baseDate = new Date()): boolean {
  if (!window || window === "all") return true;
  if (!expiryDate) return window === "valid";

  const diffDays = getExpiryDiffDays(expiryDate, baseDate);
  if (diffDays === null) return true;

  if (window === "expired") return diffDays < 0;
  if (window === "7d") return diffDays >= 0 && diffDays <= 7;
  if (window === "30d") return diffDays >= 0 && diffDays <= 30;
  if (window === "60d") return diffDays >= 0 && diffDays <= 60;
  if (window === "valid") return diffDays > 60;

  return true;
}

export function detectFileType(
  fileName?: string | null,
  fileUrl?: string | null,
  mimeType?: string | null
): "pdf" | "jpg" | "png" | "docx" | "doc" | "other" {
  const mime = (mimeType || "").toLowerCase().trim();

  if (mime) {
    if (mime.includes("application/pdf")) return "pdf";
    if (mime.includes("image/png")) return "png";
    if (mime.includes("image/jpeg") || mime.includes("image/jpg")) return "jpg";
    if (mime.includes("application/vnd.openxmlformats-officedocument.wordprocessingml")) return "docx";
    if (mime.includes("application/msword")) return "doc";
  }

  // Check file name first, then file URL - anchored regex to avoid false matches
  const candidates = [fileName || "", fileUrl || ""];

  for (const str of candidates) {
    if (!str) continue;
    if (/\.pdf($|\?|#)/i.test(str)) return "pdf";
    if (/\.png($|\?|#)/i.test(str)) return "png";
    if (/\.(jpe?g)($|\?|#)/i.test(str)) return "jpg";
    if (/\.docx($|\?|#)/i.test(str)) return "docx";
    if (/\.doc($|\?|#)/i.test(str)) return "doc";
  }

  return "other";
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

  // 1. REJECTED status must always remain REJECTED (highest priority)
  if (rawStatus === "REJECTED") {
    return "REJECTED";
  }

  // 2. Unverified / Pending status stays PENDING
  if (rawStatus === "PENDING" || (!isVerified && rawStatus !== "VERIFIED")) {
    return "PENDING";
  }

  // 3. Verified documents that are expired show as Expired
  if (isVerified && isDocumentExpired(backendDoc.expiry_date)) {
    return "Expired";
  }

  // 4. Verified documents
  if (isVerified) {
    return "VERIFIED";
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
  // isVerified must be false when the document is expired or rejected
  const isVerified = source === "employee" && status === "VERIFIED";

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
    fileType: detectFileType(fileName, fileUrl, d.mime_type || d.content_type || d.mimeType || d.contentType),
    fileUrl,
    description: d.description,
    documentType: d.document_type || d.type || undefined,
    documentNumber: d.document_number || undefined,
    rejectionReason: d.rejection_reason || d.rejection_comments || d.comments,
    department: d.department,
    branch: d.branch,
    visibility: d.visibility,
    tags: d.tags,
    lastReview: d.last_review,
  };
}

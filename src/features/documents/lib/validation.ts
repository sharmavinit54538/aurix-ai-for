export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg", ".docx", ".doc"];

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateDocumentFile(file: File | null | undefined): FileValidationResult {
  if (!file) {
    return { valid: false, error: "Please select or drop a file to upload." };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 10 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`,
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: "Selected file is empty (0 bytes). Please choose a valid document.",
    };
  }

  // Check extension
  const fileName = file.name || "";
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot === -1) {
    return {
      valid: false,
      error: "File has no extension. Allowed formats: PDF, PNG, JPG, JPEG, DOCX.",
    };
  }

  const ext = fileName.slice(lastDot).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `File format "${ext}" is not supported. Allowed: PDF, PNG, JPG, JPEG, DOCX.`,
    };
  }

  return { valid: true };
}

export interface DatesValidationResult {
  valid: boolean;
  error?: string;
}

export function validateDocumentDates(
  issueDate?: string | null,
  expiryDate?: string | null
): DatesValidationResult {
  if (!expiryDate || !expiryDate.trim()) {
    return { valid: true };
  }

  if (!issueDate || !issueDate.trim()) {
    return { valid: true };
  }

  const issueTime = new Date(issueDate).getTime();
  const expiryTime = new Date(expiryDate).getTime();

  if (Number.isNaN(issueTime) || Number.isNaN(expiryTime)) {
    return { valid: true };
  }

  if (expiryTime < issueTime) {
    return {
      valid: false,
      error: "Expiry date cannot be earlier than the issue date.",
    };
  }

  return { valid: true };
}

export function validateTitle(title: string | null | undefined): { valid: boolean; error?: string } {
  if (!title || !title.trim()) {
    return { valid: false, error: "Document title is required." };
  }
  if (title.trim().length > 255) {
    return { valid: false, error: "Title must be 255 characters or fewer." };
  }
  return { valid: true };
}

export function validateComments(
  comments: string | null | undefined,
  fieldLabel = "Comments"
): { valid: boolean; error?: string } {
  const trimmed = comments?.trim() ?? "";
  if (!trimmed) {
    return { valid: false, error: `${fieldLabel} are required.` };
  }
  if (trimmed.length > 1000) {
    return { valid: false, error: `${fieldLabel} must be 1000 characters or fewer.` };
  }
  return { valid: true };
}

/**
 * Extracts a safe download filename from Content-Disposition header,
 * or derives it from fallback name and document type.
 */
export function extractFilenameFromHeader(
  contentDisposition?: string | null,
  fallbackName = "document",
  fallbackType?: string
): string {
  if (contentDisposition) {
    // Check filename*=UTF-8''... (RFC 5987)
    const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8Match && utf8Match[1]) {
      try {
        return decodeURIComponent(utf8Match[1].replace(/["']/g, ""));
      } catch {
        // Fall through
      }
    }

    // Standard filename="..."
    const standardMatch = contentDisposition.match(/filename=["']?([^"';]+)["']?/i);
    if (standardMatch && standardMatch[1]) {
      return standardMatch[1].trim();
    }
  }

  // Ensure fallback has an appropriate extension
  let safeName = fallbackName.trim() || "document";
  const hasExt = /\.[a-zA-Z0-9]{2,5}$/.test(safeName);

  if (!hasExt) {
    const ext = fallbackType?.toLowerCase();
    if (ext === "pdf" || ext?.includes("pdf")) {
      safeName = `${safeName}.pdf`;
    } else if (ext === "png" || ext?.includes("png")) {
      safeName = `${safeName}.png`;
    } else if (ext === "jpg" || ext === "jpeg" || ext?.includes("jpeg")) {
      safeName = `${safeName}.jpg`;
    } else if (ext === "docx" || ext?.includes("word")) {
      safeName = `${safeName}.docx`;
    }
  }

  return safeName;
}

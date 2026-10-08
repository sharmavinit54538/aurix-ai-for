import { normalizeRole } from "@/lib/roles";
import type { DocumentItem, DocumentSource, DocumentsTabKey } from "./types";

export type DocumentAction =
  | "view"
  | "upload"
  | "verify"
  | "reject"
  | "requestReupload"
  | "delete"
  | "generate"
  | "download"
  | "manageTemplates"
  | "generateIdCard"
  | "viewVerificationQueue"
  | "viewAuditLogs";

export interface DocumentPermissionContext {
  isOwnDocument?: boolean;
  isVerified?: boolean;
  status?: string;
  source?: DocumentSource;
}

export function canDo(
  roleInput: string | null | undefined,
  action: DocumentAction,
  context?: DocumentPermissionContext
): boolean {
  const role = normalizeRole(roleInput);

  switch (role) {
    case "super_admin":
    case "hr_admin":
      return true;

    case "executive":
      // Executive is strictly read-only
      return action === "view" || action === "download" || action === "viewAuditLogs";

    case "manager":
      // Manager is read-only for reports / company documents
      return action === "view" || action === "download";

    case "employee": {
      if (action === "view" || action === "download") {
        return true;
      }
      if (action === "upload") {
        return true;
      }
      if (action === "delete") {
        // Employee can delete only own unverified documents
        if (context?.source === "company") return false;
        const isOwn = context?.isOwnDocument ?? true;
        const isVerified =
          context?.isVerified === true ||
          context?.status === "VERIFIED" ||
          context?.status === "Verified";
        return isOwn && !isVerified;
      }
      // Employee cannot verify, reject, request reupload, generate letters for others, or manage templates
      return false;
    }

    case "it_admin":
    case "recruiter":
    default:
      // it_admin and recruiter have no access to employee documents
      return false;
  }
}

/** Check if the given role is allowed to access the /dashboard/resources/documents route at all */
export function canAccessDocumentsRoute(roleInput: string | null | undefined): boolean {
  const role = normalizeRole(roleInput);
  if (!role) return false;
  return ["super_admin", "hr_admin", "executive", "manager", "employee"].includes(role);
}

/** Helper to determine if an employee can perform a reupload on a document */
export function canEmployeeReupload(doc: DocumentItem): boolean {
  if (doc.source === "company") return false;
  const statusUpper = (doc.status || "").toUpperCase();
  return (
    statusUpper === "REJECTED" ||
    statusUpper === "REUPLOAD_REQUESTED" ||
    Boolean(doc.rejectionReason)
  );
}

/** Check if the given role can access a specific major Documents tab */
export function canAccessSection(
  roleInput: string | null | undefined,
  section: DocumentsTabKey
): boolean {
  const role = normalizeRole(roleInput);
  if (!role) return false;

  // Super Admin and HR Admin have full access to all sections
  if (role === "super_admin" || role === "hr_admin") return true;

  switch (section) {
    case "employee-docs":
    case "Employee Documents":
      return ["executive", "manager", "employee"].includes(role);

    case "company-docs":
    case "Company Documents":
      return ["executive", "manager", "employee"].includes(role);

    case "hr-letters":
      // HR Admin / Super Admin can generate; Employee can view their own letters
      return ["employee"].includes(role);

    case "id-cards":
      // Employee can view & download their own ID card
      return ["employee"].includes(role);

    case "templates":
      return false; // HR Admin / Super Admin only

    case "verification":
    case "Pending":
      return false; // HR Admin / Super Admin only

    case "expiry":
    case "Expired":
      return ["executive"].includes(role);

    case "activity":
      return ["executive"].includes(role);

    default:
      return true;
  }
}

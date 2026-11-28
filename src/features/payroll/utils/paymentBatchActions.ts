import { hasPermission } from "@/store/sidebar/sidebarSelectors";
import { normalizeRole, type AppRole } from "@/lib/roles";
import type { PaymentBatch, PaymentBatchStatus } from "../types/payment";

export type PaymentActionId =
  | "view_details"
  | "manage_batch"
  | "edit_batch"
  | "view_employees"
  | "view_successful_payments"
  | "view_failed_payments"
  | "view_failure_reason"
  | "view_held_employees"
  | "validate_batch"
  | "submit_for_approval"
  | "approve_batch"
  | "reject_batch"
  | "generate_bank_file"
  | "download_bank_file"
  | "export_report"
  | "download_reconciliation_report"
  | "submit_to_bank"
  | "track_status"
  | "view_transactions"
  | "reconcile_payment"
  | "retry_failed"
  | "release_held"
  | "view_approval_history"
  | "view_audit_log"
  | "cancel_batch"
  | "delete_draft";

export type PaymentActionGroup =
  | "management"
  | "approval"
  | "downloads"
  | "operations"
  | "history"
  | "restricted";

export interface ResolvedPaymentAction {
  id: PaymentActionId;
  label: string;
  group: PaymentActionGroup;
  disabled?: boolean;
  disabledReason?: string;
  destructive?: boolean;
  requiresConfirmation?: boolean;
}

export interface ActionResolutionContext {
  role: AppRole | string | null;
  permissions: string[];
  currentUserId?: string;
}

const TENANT_PAYROLL_ROLES = new Set<AppRole>([
  "hr_admin",
  "it_admin",
  "executive",
  "manager",
]);

function normalizePaymentActorRole(rawRole: AppRole | string | null): AppRole | null {
  if (!rawRole) return null;
  const canonical = normalizeRole(String(rawRole));
  if (canonical) return canonical;
  const cleaned = String(rawRole).trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (cleaned === "admin" || cleaned === "company_admin" || cleaned === "payroll_admin" || cleaned === "finance_admin") {
    return "hr_admin";
  }
  return null;
}

function buildCapabilityFlags(role: AppRole, permissions: string[]) {
  const normalizedPerms = (permissions || []).map((p) => String(p).trim()).filter(Boolean);
  const permSet = new Set(normalizedPerms);
  const isWildcard =
    normalizedPerms.length === 0 ||
    permSet.has("*") ||
    permSet.has("all") ||
    permSet.has("payroll:*") ||
    permSet.has("payroll.payments.*") ||
    permSet.has("payroll.admin") ||
    permSet.has("payroll:admin");

  const hasGranularPaymentPerms = normalizedPerms.some((p) => p.startsWith("payroll.payments."));
  const isAdminLevel = role === "hr_admin" || role === "it_admin" || role === "executive";

  if (isWildcard) {
    return {
      isAdminLevel,
      canView: true,
      canEdit: isAdminLevel,
      canValidate: isAdminLevel,
      canApprove: isAdminLevel,
      canExport: true,
      canSubmit: isAdminLevel,
      canReconcile: isAdminLevel,
      canCancel: isAdminLevel,
      canDelete: isAdminLevel,
    };
  }

  if (hasGranularPaymentPerms) {
    return {
      isAdminLevel,
      canView: hasPermission("payroll.payments.view", normalizedPerms),
      canEdit: hasPermission("payroll.payments.edit", normalizedPerms),
      canValidate: hasPermission("payroll.payments.validate", normalizedPerms),
      canApprove: hasPermission("payroll.payments.approve", normalizedPerms),
      canExport: hasPermission("payroll.payments.export", normalizedPerms),
      canSubmit: hasPermission("payroll.payments.submit", normalizedPerms),
      canReconcile: hasPermission("payroll.payments.reconcile", normalizedPerms),
      canCancel: isAdminLevel && hasPermission("payroll.payments.cancel", normalizedPerms),
      canDelete: isAdminLevel && hasPermission("payroll.payments.delete", normalizedPerms),
    };
  }

  // Standard OFC360 backend /sidebar/permissions emits coarse domain keys
  // (e.g. "payroll:read", "exports:read", "reports:read") without granular
  // payroll.payments.* scopes. Respect role boundaries paired with backend policy.
  if (isAdminLevel) {
    return {
      isAdminLevel,
      canView: true,
      canEdit: true,
      canValidate: true,
      canApprove: true,
      canExport: true,
      canSubmit: true,
      canReconcile: true,
      canCancel: true,
      canDelete: true,
    };
  }

  // Manager: read/track/audit access; approvals/exports only if granted
  const hasExport = permSet.has("exports:read") || permSet.has("reports:read") || permSet.has("payroll.payments.export");
  const hasApprove = permSet.has("payroll.approve") || permSet.has("payroll:approve") || permSet.has("payroll:write");
  return {
    isAdminLevel: false,
    canView: true,
    canEdit: false,
    canValidate: false,
    canApprove: hasApprove,
    canExport: hasExport,
    canSubmit: false,
    canReconcile: false,
    canCancel: false,
    canDelete: false,
  };
}

/**
 * Resolves dynamically permitted grouped menu actions for a payment batch based on:
 * - Backend batch workflow status
 * - Authenticated tenant role & Redux permissions
 * - Maker-checker segregation of duties
 * - Held / failed / payment state flags
 */
export function resolvePaymentBatchActions(
  batch: PaymentBatch,
  ctx: ActionResolutionContext
): ResolvedPaymentAction[] {
  const role = normalizePaymentActorRole(ctx.role);
  const { permissions, currentUserId } = ctx;

  if (!role || role === "super_admin" || !TENANT_PAYROLL_ROLES.has(role)) {
    return [];
  }

  const {
    canView,
    canEdit,
    canValidate,
    canApprove,
    canExport,
    canSubmit,
    canReconcile,
    canCancel,
    canDelete,
  } = buildCapabilityFlags(role, permissions);

  const isCreator = Boolean(
    currentUserId && batch.createdBy?.id && currentUserId === batch.createdBy.id
  );
  const status: PaymentBatchStatus = batch.status || "draft";
  const heldCount = batch.heldCount ?? 0;
  const failedCount = batch.failedCount ?? 0;

  const actions: ResolvedPaymentAction[] = [];

  if (!canView) return [];

  switch (status) {
    case "draft":
    case "validation_failed":
    case "rejected": {
      actions.push({ id: "view_details", label: "View Batch Details", group: "management" });
      if (canEdit) {
        actions.push({
          id: "edit_batch",
          label: status === "draft" ? "Edit Batch" : "Edit Draft Batch",
          group: "management",
        });
      }
      actions.push({ id: "view_employees", label: "View Employee Payments", group: "management" });
      if (canValidate) {
        actions.push({ id: "validate_batch", label: "Validate Batch", group: "management" });
      }
      if (status === "rejected") {
        actions.push({
          id: "view_approval_history",
          label: "View Approval History",
          group: "history",
        });
      }
      if (status !== "draft" && canCancel) {
        actions.push({
          id: "cancel_batch",
          label: "Cancel Batch",
          group: "restricted",
          destructive: true,
          requiresConfirmation: true,
        });
      }
      if (canDelete) {
        actions.push({
          id: "delete_draft",
          label: "Delete Draft Batch",
          group: "restricted",
          destructive: true,
          requiresConfirmation: true,
        });
      }
      break;
    }

    case "validating": {
      actions.push({ id: "view_details", label: "View Batch Details", group: "management" });
      actions.push({ id: "view_employees", label: "View Employee Payments", group: "management" });
      break;
    }

    case "validated": {
      actions.push({ id: "view_details", label: "View Batch Details", group: "management" });
      actions.push({ id: "manage_batch", label: "Manage Payment Batch", group: "management" });
      actions.push({ id: "view_employees", label: "View Employee Payments", group: "management" });
      if (canEdit) {
        actions.push({
          id: "submit_for_approval",
          label: "Submit for Approval",
          group: "approval",
          requiresConfirmation: true,
        });
      }
      if (canExport) {
        actions.push({
          id: "export_report",
          label: "Export Payment Report",
          group: "downloads",
        });
      }
      if (canCancel) {
        actions.push({
          id: "cancel_batch",
          label: "Cancel Batch",
          group: "restricted",
          destructive: true,
          requiresConfirmation: true,
        });
      }
      break;
    }

    case "pending_approval": {
      actions.push({ id: "view_details", label: "View Batch Details", group: "management" });
      actions.push({ id: "view_employees", label: "View Employee Payments", group: "management" });
      if (canApprove) {
        actions.push({
          id: "approve_batch",
          label: "Approve Batch",
          group: "approval",
          disabled: isCreator,
          disabledReason: isCreator ? "Maker-checker: batch creator cannot approve" : undefined,
          requiresConfirmation: true,
        });
        actions.push({
          id: "reject_batch",
          label: "Reject Batch",
          group: "approval",
          destructive: true,
          requiresConfirmation: true,
        });
      }
      actions.push({
        id: "view_approval_history",
        label: "View Approval History",
        group: "history",
      });
      if (canCancel) {
        actions.push({
          id: "cancel_batch",
          label: "Cancel Batch",
          group: "restricted",
          destructive: true,
          requiresConfirmation: true,
        });
      }
      break;
    }

    case "approved": {
      actions.push({ id: "view_details", label: "View Batch Details", group: "management" });
      actions.push({ id: "view_employees", label: "View Employee Payments", group: "management" });
      if (heldCount > 0) {
        actions.push({
          id: "view_held_employees",
          label: `View Held Employees (${heldCount})`,
          group: "management",
        });
        if (canEdit) {
          actions.push({
            id: "release_held",
            label: "Release Held Payments",
            group: "operations",
            requiresConfirmation: true,
          });
        }
      }
      if (canSubmit || canExport) {
        actions.push({
          id: "generate_bank_file",
          label: "Generate Bank File",
          group: "downloads",
        });
      }
      if (canExport) {
        actions.push({
          id: "export_report",
          label: "Export Payment Report",
          group: "downloads",
        });
      }
      actions.push({
        id: "view_approval_history",
        label: "View Approval History",
        group: "history",
      });
      if (canCancel) {
        actions.push({
          id: "cancel_batch",
          label: "Cancel Batch",
          group: "restricted",
          destructive: true,
          requiresConfirmation: true,
        });
      }
      break;
    }

    case "file_generated": {
      actions.push({ id: "view_details", label: "View Batch Details", group: "management" });
      actions.push({ id: "view_employees", label: "View Employee Payments", group: "management" });
      if (heldCount > 0) {
        actions.push({
          id: "view_held_employees",
          label: `View Held Employees (${heldCount})`,
          group: "management",
        });
        if (canEdit) {
          actions.push({
            id: "release_held",
            label: "Release Held Payments",
            group: "operations",
            requiresConfirmation: true,
          });
        }
      }
      if (canExport) {
        actions.push({ id: "download_bank_file", label: "Download Bank File", group: "downloads" });
        actions.push({ id: "generate_bank_file", label: "Generate Bank File", group: "downloads" });
        actions.push({ id: "export_report", label: "Export Payment Report", group: "downloads" });
      }
      if (canSubmit) {
        actions.push({
          id: "submit_to_bank",
          label: "Submit to Bank",
          group: "operations",
          requiresConfirmation: true,
        });
      }
      if (canCancel) {
        actions.push({
          id: "cancel_batch",
          label: "Cancel Batch",
          group: "restricted",
          destructive: true,
          requiresConfirmation: true,
        });
      }
      break;
    }

    case "submitted":
    case "processing": {
      actions.push({ id: "view_details", label: "View Batch Details", group: "management" });
      actions.push({ id: "view_employees", label: "View Employee Payments", group: "management" });
      actions.push({ id: "track_status", label: "Track Payment Status", group: "operations" });
      actions.push({ id: "view_transactions", label: "View Transaction Details", group: "operations" });
      if (canReconcile) {
        actions.push({ id: "reconcile_payment", label: "Reconcile Payment", group: "operations" });
      }
      if (canExport) {
        actions.push({ id: "download_bank_file", label: "Download Bank File", group: "downloads" });
        actions.push({ id: "export_report", label: "Export Payment Report", group: "downloads" });
      }
      actions.push({ id: "view_audit_log", label: "View Audit History", group: "history" });
      break;
    }

    case "partial": {
      actions.push({ id: "view_employees", label: "View Employee Payments", group: "management" });
      actions.push({
        id: "view_successful_payments",
        label: "View Successful Payments",
        group: "management",
      });
      actions.push({
        id: "view_failed_payments",
        label: "View Failed Payments",
        group: "management",
      });
      actions.push({
        id: "view_held_employees",
        label: heldCount > 0 ? `View Held Employees (${heldCount})` : "View Held Employees",
        group: "management",
      });
      if (canSubmit && failedCount > 0) {
        actions.push({
          id: "retry_failed",
          label: "Retry Failed Payments",
          group: "operations",
          requiresConfirmation: true,
        });
      }
      if (canEdit && heldCount > 0) {
        actions.push({
          id: "release_held",
          label: "Release Held Payments",
          group: "operations",
          requiresConfirmation: true,
        });
      }
      if (canReconcile) {
        actions.push({ id: "reconcile_payment", label: "Reconcile Payment", group: "operations" });
      }
      actions.push({ id: "view_transactions", label: "View Transaction Details", group: "operations" });
      if (canExport) {
        actions.push({ id: "export_report", label: "Export Payment Report", group: "downloads" });
      }
      actions.push({ id: "view_audit_log", label: "View Audit History", group: "history" });
      break;
    }

    case "failed": {
      actions.push({ id: "view_details", label: "View Batch Details", group: "management" });
      actions.push({ id: "view_failure_reason", label: "View Failure Reason", group: "management" });
      actions.push({
        id: "view_failed_payments",
        label: "View Failed Employee Payments",
        group: "management",
      });
      if (canSubmit) {
        actions.push({
          id: "retry_failed",
          label: "Retry Failed Payments",
          group: "operations",
          requiresConfirmation: true,
        });
      }
      actions.push({ id: "view_transactions", label: "View Transaction Details", group: "operations" });
      if (canReconcile) {
        actions.push({ id: "reconcile_payment", label: "Reconcile Payment", group: "operations" });
      }
      actions.push({ id: "view_audit_log", label: "View Audit History", group: "history" });
      break;
    }

    case "paid": {
      actions.push({ id: "view_details", label: "View Batch Details", group: "management" });
      actions.push({ id: "view_employees", label: "View Employee Payments", group: "management" });
      actions.push({ id: "view_transactions", label: "View Transaction Details", group: "operations" });
      if (canReconcile) {
        actions.push({ id: "reconcile_payment", label: "Reconcile Payment", group: "operations" });
      }
      if (canExport) {
        actions.push({ id: "export_report", label: "Download Payment Report", group: "downloads" });
        actions.push({
          id: "download_reconciliation_report",
          label: "Download Reconciliation Report",
          group: "downloads",
        });
      }
      actions.push({ id: "view_audit_log", label: "View Audit History", group: "history" });
      break;
    }

    case "reconciled":
    case "closed": {
      actions.push({ id: "view_details", label: "View Batch Details", group: "management" });
      actions.push({ id: "view_employees", label: "View Employee Payments", group: "management" });
      actions.push({ id: "view_transactions", label: "View Transaction Details", group: "operations" });
      if (canExport) {
        actions.push({ id: "export_report", label: "Download Payment Report", group: "downloads" });
        actions.push({
          id: "download_reconciliation_report",
          label: "Download Reconciliation Report",
          group: "downloads",
        });
      }
      actions.push({
        id: "view_approval_history",
        label: "View Approval History",
        group: "history",
      });
      actions.push({ id: "view_audit_log", label: "View Audit History", group: "history" });
      break;
    }

    case "cancelled": {
      actions.push({ id: "view_details", label: "View Batch Details", group: "management" });
      actions.push({ id: "view_audit_log", label: "View Audit History", group: "history" });
      break;
    }

    default: {
      actions.push({ id: "view_details", label: "View Batch Details", group: "management" });
      actions.push({ id: "view_employees", label: "View Employee Payments", group: "management" });
      break;
    }
  }

  return actions;
}

export function groupPaymentActions(
  actions: ResolvedPaymentAction[]
): Array<{ group: PaymentActionGroup; items: ResolvedPaymentAction[] }> {
  const order: PaymentActionGroup[] = [
    "management",
    "approval",
    "downloads",
    "operations",
    "history",
    "restricted",
  ];
  return order
    .map((group) => ({
      group,
      items: actions.filter((a) => a.group === group),
    }))
    .filter((bucket) => bucket.items.length > 0);
}

/**
 * Extracts a descriptive, user-facing error message across FastAPI HTTP & Axios errors.
 */
export function getHttpErrorMessage(err: any, fallback = "Payment operation failed"): string {
  if (!err) return fallback;
  if (err?.code === "ECONNABORTED" || err?.message?.toLowerCase?.().includes("timeout")) {
    return "Request timed out. Verify current batch status before retrying.";
  }
  const status = err?.response?.status;
  const data = err?.response?.data;
  const detail = data?.detail;
  const serverMsg =
    (typeof detail === "object" && detail?.message) ||
    (typeof detail === "string" ? detail : null) ||
    data?.message ||
    data?.error?.message;

  if (serverMsg) return serverMsg;

  switch (status) {
    case 400:
      return "Invalid payment request parameters. Check your inputs and try again.";
    case 401:
      return "Your session has expired. Please sign in again.";
    case 403:
      return "You do not have permission to perform this payroll payment action.";
    case 404:
      return "Payment batch or resource was not found.";
    case 409:
      return "This payment batch state changed or conflicts with an active rule. Refreshing data.";
    case 422:
      return "Payment data failed validation rules. Review employee bank details.";
    case 429:
      return "Too many payment requests. Please wait a moment and try again.";
    case 500:
      return "Server encountered an error processing the payment operation.";
    default:
      return err?.message || fallback;
  }
}

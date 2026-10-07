import type {
  PayrollAuditRecord,
} from "../../types";

export function extractReviewAuditLog(rawObj: Record<string, unknown>): PayrollAuditRecord[] | null {
  const rawAudit = rawObj.auditLog || rawObj.audit_log || rawObj.history || rawObj.timeline;
  if (!Array.isArray(rawAudit)) return null;

  return (rawAudit as unknown[]).map((item: unknown) => {
    const it = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
    return {
      action: String(it.action || it.event || "Update"),
      user: (it.user || it.user_id || null) as string | null,
      userName: (it.userName || it.user_name || it.name || null) as string | null,
      timestamp: (it.timestamp || it.created_at || it.createdAt || null) as string | null,
      comment: (it.comment || it.message || it.notes || null) as string | null,
      previousStatus: (it.previousStatus || it.previous_status || null) as string | null,
      newStatus: (it.newStatus || it.new_status || null) as string | null,
      ...it,
    };
  });
}
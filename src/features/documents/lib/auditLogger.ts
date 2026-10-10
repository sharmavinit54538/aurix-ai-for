import { aurix } from "@/lib/aurix-store";
import type { DocumentActivityItem, DocumentAuditEventAction } from "./types";

const LOCAL_AUDIT_KEY = "ofc360_documents_audit_log";

let auditIdCounter = 0;

function getLocalAuditEntries(): DocumentActivityItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(LOCAL_AUDIT_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalAuditEntries(entries: DocumentActivityItem[]) {
  if (typeof window === "undefined") return;
  try {
    // Keep last 100 entries in session
    sessionStorage.setItem(LOCAL_AUDIT_KEY, JSON.stringify(entries.slice(0, 100)));
  } catch {
    // Ignore storage errors
  }
}

// In-memory subscribers for immediate UI updates
const listeners = new Set<() => void>();

export function subscribeToAuditLog(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function logDocumentAuditEvent(params: {
  action: DocumentAuditEventAction;
  documentName: string;
  documentId?: string;
  employeeName?: string;
  employeeId?: string;
  details?: string;
}): DocumentActivityItem {
  const user = aurix.get().user;
  const performedBy = user?.fullName || "HR Administrator";

  auditIdCounter += 1;
  const newEntry: DocumentActivityItem = {
    id: `audit_${Date.now()}_${auditIdCounter}`,
    documentId: params.documentId || "doc_action",
    documentName: params.documentName,
    action: params.action,
    performedBy,
    timestamp: new Date().toISOString(),
    details: params.details,
    employeeName: params.employeeName,
    employeeId: params.employeeId,
  };

  const existing = getLocalAuditEntries();
  const updated = [newEntry, ...existing];
  saveLocalAuditEntries(updated);

  // Notify active subscribers
  listeners.forEach((fn) => fn());

  return newEntry;
}

export function getCombinedAuditActivities(backendActivities: DocumentActivityItem[]): DocumentActivityItem[] {
  const local = getLocalAuditEntries();
  const seenIds = new Set(backendActivities.map((b) => b.id));

  // Merge unique local entries on top
  const merged = [
    ...local.filter((l) => !seenIds.has(l.id)),
    ...backendActivities,
  ];

  // Sort descending by timestamp
  return merged.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

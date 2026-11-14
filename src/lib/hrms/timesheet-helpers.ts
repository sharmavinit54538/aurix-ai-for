export type TimesheetStatus = "draft" | "pending" | "approved" | "rejected";

export interface TimeRowData {
  id: string;
  projectId: string;
  hours: number[];
  description: string;
}

export interface TimesheetHistoryRecord {
  id: string;
  weekRange: string;
  totalHours: number;
  status: TimesheetStatus;
  submittedOn: string;
  approvedBy: string;
  rejectionReason?: string;
}

export interface PendingApprovalRecord {
  id: string;
  employeeName: string;
  department: string;
  weekRange: string;
  totalHours: number;
  status: "pending" | "approved" | "rejected";
  details: { project: string; hours: number; desc: string }[];
}

export function normalizeTimesheetStatus(rawStatus: unknown): TimesheetStatus {
  if (typeof rawStatus !== "string") return "draft";
  const normalized = rawStatus.trim().toLowerCase();
  if (
    normalized === "draft" ||
    normalized === "pending" ||
    normalized === "approved" ||
    normalized === "rejected"
  ) {
    return normalized;
  }
  return "draft";
}

export function extractTimesheetList<T = any>(res: unknown): T[] {
  if (Array.isArray(res)) return res as T[];
  if (!res || typeof res !== "object") return [];
  const obj = res as Record<string, unknown>;
  if (Array.isArray(obj.data)) return obj.data as T[];
  if (obj.data && typeof obj.data === "object") {
    const nested = obj.data as Record<string, unknown>;
    if (Array.isArray(nested.items)) return nested.items as T[];
    if (Array.isArray(nested.records)) return nested.records as T[];
  }
  if (Array.isArray(obj.items)) return obj.items as T[];
  return [];
}

export function sumEntryHours(entry: Record<string, any> | null | undefined): number {
  if (!entry || typeof entry !== "object") return 0;
  return (
    (parseFloat(entry.monday_hours) || 0) +
    (parseFloat(entry.tuesday_hours) || 0) +
    (parseFloat(entry.wednesday_hours) || 0) +
    (parseFloat(entry.thursday_hours) || 0) +
    (parseFloat(entry.friday_hours) || 0) +
    (parseFloat(entry.saturday_hours) || 0) +
    (parseFloat(entry.sunday_hours) || 0)
  );
}

export function mapTimesheetEntries(
  entries: unknown,
  defaultProjectId: string,
  createId: () => string,
): TimeRowData[] {
  if (!Array.isArray(entries) || entries.length === 0) {
    return [
      {
        id: createId(),
        projectId: defaultProjectId,
        hours: [0, 0, 0, 0, 0, 0, 0],
        description: "",
      },
    ];
  }

  return entries.map((e: any, index: number) => ({
    id: String(e?.id || `${createId()}_${index}`),
    projectId: String(e?.project_id || e?.projectId || defaultProjectId),
    hours: Array.isArray(e?.hours) && e.hours.length === 7
      ? e.hours.map((h: any) => parseFloat(h) || 0)
      : [
          parseFloat(e?.monday_hours) || 0,
          parseFloat(e?.tuesday_hours) || 0,
          parseFloat(e?.wednesday_hours) || 0,
          parseFloat(e?.thursday_hours) || 0,
          parseFloat(e?.friday_hours) || 0,
          parseFloat(e?.saturday_hours) || 0,
          parseFloat(e?.sunday_hours) || 0,
        ],
    description: String(e?.description || ""),
  }));
}

export function formatWeekRangeFromDate(startInput: string | Date): string {
  const parsed = startInput instanceof Date ? new Date(startInput) : new Date(startInput || Date.now());
  const startOfWeek = Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const format = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${format(startOfWeek)} – ${format(endOfWeek)}, ${endOfWeek.getFullYear()}`;
}

export function mapTimesheetHistoryRecords(res: unknown): TimesheetHistoryRecord[] {
  const list = extractTimesheetList<any>(res);
  return list.map((t: any, idx: number) => {
    const entries = Array.isArray(t?.entries) ? t.entries : [];
    const totalHours =
      typeof t?.total_hours === "number"
        ? t.total_hours
        : entries.reduce((sum: number, e: any) => sum + sumEntryHours(e), 0);

    return {
      id: String(t?.id || `ts-hist-${idx}`),
      weekRange: t?.week_range || formatWeekRangeFromDate(t?.week_start_date),
      totalHours,
      status: normalizeTimesheetStatus(t?.status),
      submittedOn: t?.submitted_at
        ? new Date(t.submitted_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "—",
      approvedBy: t?.approved_by_name || (t?.approved_by_id ? "Manager" : "—"),
      rejectionReason: t?.rejection_reason || undefined,
    };
  });
}

export function mapPendingApprovalRecords(
  res: unknown,
  projects: { id: string; name: string }[],
): PendingApprovalRecord[] {
  const list = extractTimesheetList<any>(res);
  return list.map((t: any, idx: number) => {
    const entries = Array.isArray(t?.entries) ? t.entries : [];
    const rawStatus = normalizeTimesheetStatus(t?.status);
    const approvalStatus: "pending" | "approved" | "rejected" =
      rawStatus === "approved" || rawStatus === "rejected" ? rawStatus : "pending";

    return {
      id: String(t?.id || `ts-pending-${idx}`),
      employeeName: String(t?.employee?.fullName || t?.employee_name || "Employee"),
      department: String(t?.employee?.department || t?.department || "Operations"),
      weekRange: t?.week_range || formatWeekRangeFromDate(t?.week_start_date),
      totalHours:
        typeof t?.total_hours === "number"
          ? t.total_hours
          : entries.reduce((sum: number, e: any) => sum + sumEntryHours(e), 0),
      status: approvalStatus,
      details: entries.map((e: any) => ({
        project:
          projects.find((p) => p.id === e?.project_id)?.name ||
          String(e?.project_id || "General Operations"),
        hours: sumEntryHours(e),
        desc: String(e?.description || ""),
      })),
    };
  });
}

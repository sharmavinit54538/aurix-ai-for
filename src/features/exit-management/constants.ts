import { statusBadgeClass } from "@/lib/status-styles";

export const STAGE_FILTERS = [
  { id: "all", label: "All Requests" },
  { id: "requested", label: "Requested" },
  { id: "under-review", label: "Under Review" },
  { id: "approved", label: "Approved" },
  { id: "notice", label: "Notice Period" },
  { id: "clearance", label: "Clearance Pending" },
  { id: "settlement", label: "Settlement Pending" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
] as const;

export const STAGE_BADGES: Record<string, { label: string }> = {
  requested: { label: "Requested" },
  "under-review": { label: "Under Review" },
  approved: { label: "Approved" },
  notice: { label: "Notice Period" },
  clearance: { label: "Clearance" },
  settlement: { label: "Settlement" },
  completed: { label: "Completed" },
  cancelled: { label: "Cancelled" },
  resignation: { label: "Resignation" },
  interview: { label: "Interview Scheduled" },
  assets: { label: "Assets Verification" },
  hr: { label: "HR Clearance" },
  manager: { label: "Manager Clearance" },
  it: { label: "IT Clearance" },
  finance: { label: "Finance Clearance" },
  settled: { label: "Settled" },
};

export const getExitBadge = (stage: string): string => {
  switch (stage) {
    case "completed":
    case "settled":
    case "approved":
      return statusBadgeClass("approved");
    case "under-review":
    case "notice":
    case "clearance":
    case "settlement":
    case "interview":
    case "assets":
    case "hr":
    case "manager":
    case "it":
    case "finance":
      return statusBadgeClass("warning");
    case "cancelled":
    case "rejected":
      return statusBadgeClass("critical");
    case "requested":
    case "resignation":
    default:
      return statusBadgeClass("info");
  }
};

export const STATS_CARDS = [
  { key: "total", title: "Total Requests" },
  { key: "approvals", title: "Pending Approvals" },
  { key: "notice", title: "Notice Period" },
  { key: "clearance", title: "Clearance Pending" },
  { key: "settlement", title: "Settlement Pending" },
  { key: "completed", title: "Completed Exits" },
] as const;

export const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

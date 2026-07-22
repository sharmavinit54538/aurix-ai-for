import type { AssetCategory, AssetStatus } from "@/lib/hrms/types";

export const CATEGORIES: { value: AssetCategory; label: string }[] = [
  { value: "laptop", label: "Laptops" },
  { value: "desktop", label: "Desktops" },
  { value: "monitor", label: "Monitors" },
  { value: "phone", label: "Phones" },
  { value: "accessory", label: "Accessories" },
  { value: "vehicle", label: "Vehicles" },
  { value: "other", label: "Other Equipment" },
];

export const STATUSES: { value: AssetStatus; label: string; color: string; bg: string }[] = [
  { value: "available", label: "Available", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { value: "assigned", label: "Assigned", color: "text-blue-500", bg: "bg-blue-500/10" },
  { value: "under-repair", label: "Under Repair", color: "text-amber-500", bg: "bg-amber-500/10" },
  { value: "lost", label: "Lost", color: "text-rose-500", bg: "bg-rose-500/10" },
  {
    value: "expired",
    label: "Expired/Retired",
    color: "text-neutral-500",
    bg: "bg-neutral-500/10",
  },
  { value: "retired", label: "Retired", color: "text-purple-500", bg: "bg-purple-500/10" },
];

export const CHART_COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#3b82f6", "#6b7280"];

export const STATUS_TABS = [
  { id: "all", label: "All Assets" },
  { id: "available", label: "Available" },
  { id: "assigned", label: "Assigned" },
  { id: "under-repair", label: "In Repair" },
  { id: "lost", label: "Lost" },
  { id: "retired", label: "Decommissioned" },
];

export const ASSET_TAG_PREFIX: Record<AssetCategory, string> = {
  laptop: "LAP",
  desktop: "DKT",
  monitor: "MON",
  phone: "PHN",
  accessory: "ACC",
  vehicle: "VEH",
  other: "AST",
};

export const ITEMS_PER_PAGE = 8;

// Reference "now" used across warranty checks (kept consistent with original page logic)
export const REFERENCE_NOW = new Date("2026-06-28").getTime();
export const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

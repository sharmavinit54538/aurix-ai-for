import { statusBadgeClass } from "@/lib/status-styles";
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

export const STATUSES: { value: AssetStatus; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "assigned", label: "Assigned" },
  { value: "under-repair", label: "Under Repair" },
  { value: "lost", label: "Lost" },
  { value: "expired", label: "Expired/Retired" },
  { value: "retired", label: "Retired" },
];

export const getAssetStatusBadge = (status: AssetStatus | string) => {
  switch (status) {
    case "available":
      return statusBadgeClass("approved");
    case "under-repair":
      return statusBadgeClass("warning");
    case "lost":
      return statusBadgeClass("critical");
    case "assigned":
      return statusBadgeClass("default");
    case "retired":
    case "expired":
    default:
      return statusBadgeClass("inactive");
  }
};

export const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

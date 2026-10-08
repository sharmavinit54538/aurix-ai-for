import type {
  Asset,
  AssetCategory,
  AssetStatus,
  AssetAssignmentHistory,
  AssetMaintenanceRecord,
  AssetTimelineEvent,
} from "@/lib/hrms/types";

declare module "@/lib/hrms/types" {
  interface Asset {
    assignedToId?: string;
  }
}

export type {
  Asset,
  AssetCategory,
  AssetStatus,
  AssetAssignmentHistory,
  AssetMaintenanceRecord,
  AssetTimelineEvent,
};

export interface AssetStats {
  total: number;
  available: number;
  assigned: number;
  repair: number;
  lost: number;
  expiring: number;
}

export interface AssetAlert {
  id: string;
  type: "warning" | "error" | "info";
  message: string;
  asset?: Asset;
}

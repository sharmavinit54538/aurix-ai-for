import type {
  ExitCase,
  ExitStage,
  ExitAssetReturn,
  ExitDepartmentClearance,
  ExitSettlementDetails,
  ExitInterviewDetails,
  ExitTimelineEvent,
} from "@/lib/hrms/types";

export type {
  ExitCase,
  ExitStage,
  ExitAssetReturn,
  ExitDepartmentClearance,
  ExitSettlementDetails,
  ExitInterviewDetails,
  ExitTimelineEvent,
};

export interface ExitStats {
  total: number;
  approvals: number;
  notice: number;
  clearance: number;
  settlement: number;
  completed: number;
}

export interface ExitAlert {
  id: string;
  type: "warning" | "error" | "info";
  message: string;
  exitCase?: ExitCase;
}

export interface AttritionChartPoint {
  department: string;
  "Exit Count": number;
}

export interface MonthlyTrendPoint {
  name: string;
  value: number;
}

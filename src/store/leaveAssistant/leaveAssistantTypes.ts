export interface LeaveAssistantKpiItem {
  label: string;
  score: number | string | null;
  trend?: number;
  hint?: string;
  icon?: string;
  invert?: boolean;
}

export interface LeaveForecastItem {
  w: string;
  leaves: number;
  req?: number;
  conf?: number;
}

export interface LeaveTypeDistributionItem {
  t: string;
  days: number;
  type?: string;
  pct?: number;
}

export interface LeaveAssistantSummary {
  pendingRequests: number | null;
  approvalSuggestions: number | null;
  conflictsDetected: number | null;
  teamAvailability: string | number | null;
  lastAnalysis?: string | null;
}

export interface LeaveAssistantCharts {
  leaveForecast: LeaveForecastItem[];
  leaveTypeDistribution: LeaveTypeDistributionItem[];
}

export interface LeaveAssistantDashboardData {
  summary?: LeaveAssistantSummary;
  kpi?: LeaveAssistantKpiItem[];
  charts?: LeaveAssistantCharts;
  leaveForecast?: LeaveForecastItem[];
  leaveTypeDistribution?: LeaveTypeDistributionItem[];
}

export interface LeaveAssistantState {
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  summary: LeaveAssistantSummary | null;
  kpi: LeaveAssistantKpiItem[];
  charts: LeaveAssistantCharts | null;
}

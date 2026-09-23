export interface EmployeeHealthKpiItem {
  label: string;
  score: number | string;
  trend?: number;
  hint?: string;
  icon?: string;
  invert?: boolean;
}

export interface BurnoutRiskTrendItem {
  w: string;
  risk: number;
}

export interface OvertimeByTeamItem {
  t: string;
  ot: number;
}

export interface EmployeeHealthSummary {
  wellbeingScore: number;
  burnoutRisk: number;
  avgWorkload: string | number;
  otHours: number;
  lastAnalysis?: string;
}

export interface EmployeeHealthCharts {
  burnoutRiskTrend: BurnoutRiskTrendItem[];
  overtimeByTeam: OvertimeByTeamItem[];
}

export interface EmployeeHealthDashboardData {
  summary?: EmployeeHealthSummary;
  kpi?: EmployeeHealthKpiItem[];
  charts?: EmployeeHealthCharts;
  burnoutRiskTrend?: BurnoutRiskTrendItem[];
  overtimeByTeam?: OvertimeByTeamItem[];
}

export interface EmployeeHealthState {
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  summary: EmployeeHealthSummary | null;
  kpi: EmployeeHealthKpiItem[];
  charts: EmployeeHealthCharts | null;
}

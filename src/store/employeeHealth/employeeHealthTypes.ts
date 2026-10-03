export interface EmployeeHealthKpiItem {
  label: string;
  score: number | string | null;
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
  wellbeingScore: number | null;
  burnoutRisk: number | null;
  avgWorkload: string | number | null;
  otHours: number | null;
  lastAnalysis?: string | null;
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

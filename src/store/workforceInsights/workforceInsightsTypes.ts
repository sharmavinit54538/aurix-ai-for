export interface WorkforceInsightsKpiItem {
  label: string;
  score: number | string;
  trend?: number;
  hint?: string;
  icon?: string;
  invert?: boolean;
}

export interface HeadcountTrendItem {
  m: string;
  hc: number;
}

export interface DepartmentComparisonItem {
  d: string;
  prod: number;
  risk: number;
}

export interface WorkforceInsightsSummary {
  workforceHealth: number;
  attritionRisk: string | number;
  productivityScore: number;
  headcount: number;
  riskSignalsCount?: number;
  lastAnalysis?: string;
}

export interface WorkforceInsightsCharts {
  headcountTrends: HeadcountTrendItem[];
  departmentComparison: DepartmentComparisonItem[];
}

export interface WorkforceInsightsDashboardData {
  summary?: WorkforceInsightsSummary;
  kpi?: WorkforceInsightsKpiItem[];
  charts?: WorkforceInsightsCharts;
  headcountTrends?: HeadcountTrendItem[];
  departmentComparison?: DepartmentComparisonItem[];
}

export interface WorkforceInsightsState {
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  summary: WorkforceInsightsSummary | null;
  kpi: WorkforceInsightsKpiItem[];
  charts: WorkforceInsightsCharts | null;
}

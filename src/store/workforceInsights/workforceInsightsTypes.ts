export interface WorkforceInsightsKpiItem {
  label: string;
  score: number | string | null;
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
  workforceHealth: number | null;
  attritionRisk: string | number | null;
  productivityScore: number | null;
  headcount: number | null;
  riskSignalsCount?: number | null;
  lastAnalysis?: string | null;
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

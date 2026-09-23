export interface PerformanceCoachKpiItem {
  label: string;
  score: number | string;
  trend?: number;
  hint?: string;
  icon?: string;
  invert?: boolean;
}

export interface PerformanceTrendItem {
  q: string;
  team: number;
  top: number;
}

export interface KpiAttainmentItem {
  f: string;
  att: number;
}

export interface PerformanceCoachSummary {
  avgPerformance: number;
  topPerformers: number;
  skillGaps: number;
  promotionPicks: number;
  lastAnalysis?: string;
}

export interface PerformanceCoachCharts {
  performanceTrend: PerformanceTrendItem[];
  kpiAttainment: KpiAttainmentItem[];
}

export interface PerformanceCoachDashboardData {
  summary?: PerformanceCoachSummary;
  kpi?: PerformanceCoachKpiItem[];
  charts?: PerformanceCoachCharts;
  performanceTrend?: PerformanceTrendItem[];
  kpiAttainment?: KpiAttainmentItem[];
}

export interface PerformanceCoachState {
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  summary: PerformanceCoachSummary | null;
  kpi: PerformanceCoachKpiItem[];
  charts: PerformanceCoachCharts | null;
}

export interface PerformanceCoachKpiItem {
  label: string;
  score: number | string | null;
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
  avgPerformance: number | null;
  topPerformers: number | null;
  skillGaps: number | null;
  promotionPicks: number | null;
  lastAnalysis?: string | null;
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

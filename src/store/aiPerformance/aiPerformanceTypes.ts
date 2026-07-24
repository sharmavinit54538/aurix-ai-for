export interface PerformanceDashboardKpis {
  averageScore: number | null;
  topPerformers: number | null;
  skillGaps: number | null;
  promotionPicks: number | null;
  averageScoreTrend?: number | null;
  topPerformersTrend?: number | null;
  skillGapsTrend?: number | null;
  promotionPicksTrend?: number | null;
}

export interface PerformanceChartPoint {
  label: string;
  value: number;
  secondary?: number;
}

export interface PerformanceTrendsData {
  period?: string;
  points: PerformanceChartPoint[];
}

export interface KpiAttainmentItem {
  label: string;
  attainment: number;
  target?: number;
  achieved?: number;
  trend?: string;
}

export interface KpiAttainmentData {
  period?: string;
  overall?: number | null;
  items: KpiAttainmentItem[];
}

export interface TopPerformerItem {
  id?: string;
  name: string;
  department?: string;
  role?: string;
  score: number;
  growth?: string;
  attainmentPct?: number;
}

export interface TopPerformersData {
  total: number | null;
  employees: TopPerformerItem[];
  teams: TopPerformerItem[];
  departments: TopPerformerItem[];
  managers: TopPerformerItem[];
}

export interface SkillGapItem {
  skill: string;
  have: number;
  need: number;
  gap?: number;
  recommendation?: string;
  department?: string;
  role?: string;
  employeeName?: string;
}

export interface SkillGapsData {
  total: number | null;
  items: SkillGapItem[];
}

export interface PromotionRecommendationItem {
  id?: string;
  name: string;
  department?: string;
  currentRole?: string;
  recommendedRole?: string;
  readiness?: number | null;
  reason?: string;
}

export interface PromotionRecommendationsData {
  total: number | null;
  items: PromotionRecommendationItem[];
}

export interface CoachingSuggestionItem {
  id?: string;
  employeeName?: string;
  department?: string;
  title: string;
  suggestion: string;
  focusArea?: string;
  priority?: string;
}

export interface CoachingSuggestionsData {
  total: number | null;
  items: CoachingSuggestionItem[];
}

export interface PerformanceAnalyticsData {
  summary?: string;
  avgScore?: number | null;
  kpiCompletionRate?: number | null;
  reviewedCount?: number | null;
  departmentBreakdown?: Array<{ department: string; avgScore: number; headcount?: number }>;
  quarterlyTrend?: Array<{ label: string; score: number }>;
}

export interface EmployeePerformanceProfile {
  id: string;
  name?: string;
  department?: string;
  score?: number | null;
  breakdown?: Array<{ label: string; score: number }>;
  [key: string]: unknown;
}

export interface AIPerformanceDashboardData {
  dashboard: PerformanceDashboardKpis | null;
  trends: PerformanceTrendsData | null;
  kpiAttainment: KpiAttainmentData | null;
  topPerformers: TopPerformersData;
  skillGaps: SkillGapsData;
  promotions: PromotionRecommendationsData;
  coaching: CoachingSuggestionsData;
  analytics: PerformanceAnalyticsData | null;
}

export interface AIPerformanceState {
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  actionLoading: boolean;
  actionError: string | null;
  dashboard: PerformanceDashboardKpis | null;
  trends: PerformanceTrendsData | null;
  kpiAttainment: KpiAttainmentData | null;
  topPerformers: TopPerformersData;
  skillGaps: SkillGapsData;
  promotions: PromotionRecommendationsData;
  coaching: CoachingSuggestionsData;
  analytics: PerformanceAnalyticsData | null;
  selectedEmployee: EmployeePerformanceProfile | null;
}

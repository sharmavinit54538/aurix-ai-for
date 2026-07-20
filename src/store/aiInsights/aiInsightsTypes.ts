export interface KpiItem {
  label: string;
  score: number;
  trend: number;
  hint: string;
  icon?: string;
  invert?: boolean;
}

export interface AttritionItem {
  id?: string;
  name: string;
  dept: string;
  risk: number;
  reason: string;
  action: string;
}

export interface BurnoutItem {
  id?: string;
  name: string;
  overtime: number;
  leave: number;
  score: number;
}

export interface AttendanceInsightItem {
  id?: string;
  title: string;
  count: number;
  tone: "warn" | "info" | "crit" | string;
  note: string;
}

export interface CandidateMatchItem {
  id?: string;
  name: string;
  role: string;
  match: number;
  readiness: number;
}

export interface TopPerformerItem {
  id?: string;
  name: string;
  dept: string;
  score: number;
  growth: string;
}

export interface SupportPerformerItem {
  id?: string;
  name: string;
  dept: string;
  score: number;
  coach: string;
}

export interface SkillGapItem {
  skill: string;
  have: number;
  need: number;
}

export interface PayrollAlertItem {
  id?: string;
  title: string;
  who: string;
  severity: "Critical" | "Medium" | "Low" | string;
  delta: string;
}

export interface PayrollTrendItem {
  m: string;
  cost: number;
}

export interface HeadcountForecastItem {
  month: string;
  current: number;
  forecast: number;
}

export interface HiringDemandItem {
  dept: string;
  open: number;
  demand: number;
}

export interface SatisfactionTrendItem {
  m: string;
  s: number;
}

export interface AlertItem {
  id?: string;
  title: string;
  note: string;
  severity: "Critical" | "Medium" | "Low" | string;
  icon?: string;
}

export interface DocumentItem {
  id?: string;
  label: string;
  type?: string;
}

export interface AIInsightsCharts {
  skillGap: SkillGapItem[];
  payrollTrend: PayrollTrendItem[];
  headcountForecast: HeadcountForecastItem[];
  hiringDemand: HiringDemandItem[];
  satisfactionTrend: SatisfactionTrendItem[];
}

export interface RecruitmentData {
  openPositions: number;
  recommendedCandidatesCount: number;
  pipelineHealth: string;
  candidates: CandidateMatchItem[];
}

export interface PerformanceData {
  topPerformers: TopPerformerItem[];
  supportPerformers: SupportPerformerItem[];
  skillGap: SkillGapItem[];
}

export interface PayrollData {
  payrollHealth: number;
  savingsOpportunities: string;
  anomaliesDetected: number;
  alerts: PayrollAlertItem[];
  trend: PayrollTrendItem[];
}

export interface SummaryData {
  totalInsights: number;
  actionedCount: number;
  criticalAlertsCount: number;
  healthScoreDelta: number;
}

export interface AIInsightsDashboardData {
  summary?: SummaryData;
  kpi?: KpiItem[];
  attrition?: AttritionItem[];
  burnout?: BurnoutItem[];
  attendance?: AttendanceInsightItem[];
  recruitment?: RecruitmentData;
  performance?: PerformanceData;
  payroll?: PayrollData;
  charts?: AIInsightsCharts;
  alerts?: AlertItem[];
  recommendations?: string[];
  documents?: DocumentItem[];
}

export interface AIInsightsState {
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  dashboard: SummaryData | null;
  kpi: KpiItem[];
  attrition: AttritionItem[];
  burnout: BurnoutItem[];
  attendance: AttendanceInsightItem[];
  recruitment: RecruitmentData | null;
  performance: PerformanceData | null;
  payroll: PayrollData | null;
  charts: AIInsightsCharts | null;
  alerts: AlertItem[];
  recommendations: string[];
  documents: DocumentItem[];
}

export interface RecruiterKpiItem {
  label: string;
  score: number | string;
  trend?: number;
  hint?: string;
  icon?: string;
  invert?: boolean;
}

export interface CandidateFunnelItem {
  w: string;
  applied: number;
  shortlist: number;
  offers: number;
}

export interface JdMatchDistributionItem {
  band: string;
  n: number;
}

export interface RecruiterSummary {
  openRoles: number;
  candidatesScreened: number | string;
  topMatches: number;
  timeToHire: string | number;
  jdMatchAvg?: string;
  lastAnalysis?: string;
}

export interface RecruiterCharts {
  candidateFunnel: CandidateFunnelItem[];
  jdMatchDistribution: JdMatchDistributionItem[];
}

export interface RecruiterDashboardData {
  summary?: RecruiterSummary;
  kpi?: RecruiterKpiItem[];
  charts?: RecruiterCharts;
  candidateFunnel?: CandidateFunnelItem[];
  jdMatchDistribution?: JdMatchDistributionItem[];
}

export interface RecruiterState {
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  summary: RecruiterSummary | null;
  kpi: RecruiterKpiItem[];
  charts: RecruiterCharts | null;
}

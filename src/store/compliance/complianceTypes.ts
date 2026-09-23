export interface ComplianceKpiItem {
  label: string;
  score: number | string;
  trend?: number;
  hint?: string;
  icon?: string;
  invert?: boolean;
}

export interface ComplianceTrendItem {
  m: string;
  score: number;
}

export interface RiskByCategoryItem {
  c: string;
  n: number;
}

export interface ComplianceRiskItem {
  id?: string;
  category: string;
  count?: number;
  severity?: "Critical" | "High" | "Medium" | "Low" | string;
  description?: string;
}

export interface ComplianceSummary {
  complianceScore: number;
  openRisks: number;
  missingDocs: number;
  auditReadiness: number;
  lastAnalysis?: string;
}

export interface ComplianceCharts {
  complianceTrend: ComplianceTrendItem[];
  risksByCategory: RiskByCategoryItem[];
}

export interface ComplianceDashboardData {
  summary?: ComplianceSummary;
  kpi?: ComplianceKpiItem[];
  risks?: ComplianceRiskItem[];
  charts?: ComplianceCharts;
  complianceTrend?: ComplianceTrendItem[];
  risksByCategory?: RiskByCategoryItem[];
}

export interface ComplianceState {
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  summary: ComplianceSummary | null;
  kpi: ComplianceKpiItem[];
  risks: ComplianceRiskItem[];
  charts: ComplianceCharts | null;
}

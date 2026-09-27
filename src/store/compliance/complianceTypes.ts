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

export interface ComplianceDashboardResponse {
  complianceScore: number;
  openRisks: number;
  missingDocs: number;
  auditReadiness: string | number;
  complianceTrend: Array<Record<string, unknown>>;
  risksByCategory: Array<Record<string, unknown>>;
  complianceChecks?: Array<Record<string, unknown>>;
  laborLawStatus?: Record<string, unknown>;
  recommendations?: string[];
  alerts?: Array<Record<string, unknown>>;
  compliance_score?: number;
  open_risks?: number;
  missing_docs?: number;
  audit_readiness?: string | number;
  compliance_trend?: Array<Record<string, unknown>>;
  risks_by_category?: Array<Record<string, unknown>>;
  compliance_checks?: Array<Record<string, unknown>>;
  labor_law_status?: Record<string, unknown>;
  policy_violations?: number;
  expired_documents?: number;
  critical_risks?: number;
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

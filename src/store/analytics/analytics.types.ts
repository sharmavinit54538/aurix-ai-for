/**
 * OFC360 Analytics Hub Types & Interfaces
 * Production Ready TypeScript Definitions
 */

// ── Common & Pagination Types ─────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  category?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages?: number;
}

export interface APIError {
  message: string;
  status?: number;
  fieldErrors?: Record<string, string>;
  code?: string;
}

export interface SectionState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  lastUpdated: string | null;
}

// ── 1. Analytics Overview & Summary ───────────────────────────────

export interface AnalyticsOverview {
  totalEmployees: number;
  activeHeadcount: number;
  totalPayrollCost: number;
  turnoverRate: number;
  complianceScore: number;
  riskIndex: number;
  sentimentScore: number;
  lastUpdated?: string;
  summary?: string;
  departmentBreakdown?: Array<{ department: string; count: number; cost: number }>;
  metrics?: Record<string, unknown>;
}

export interface AnalyticsSummary {
  period: string;
  headline: string;
  keyFindings: string[];
  riskSummary?: string;
  opportunities?: string[];
  dataPoints?: Record<string, number | string>;
}

// ── 2. Reports Engine ─────────────────────────────────────────────

export interface Report {
  id: string;
  title: string;
  category: "headcount" | "payroll" | "turnover" | "compliance" | "custom" | string;
  description?: string;
  status: "ready" | "generating" | "failed" | "draft" | string;
  format: "pdf" | "csv" | "xlsx" | "json" | string;
  filters?: Record<string, unknown>;
  createdAt: string;
  updatedAt?: string;
  generatedAt?: string;
  fileUrl?: string;
  sizeBytes?: number;
}

export interface ReportRequest {
  title: string;
  category: string;
  description?: string;
  format?: "pdf" | "csv" | "xlsx" | "json" | string;
  filters?: Record<string, unknown>;
  dateRange?: { startDate: string; endDate: string };
  department?: string;
  [key: string]: unknown;
}

export interface ReportResult {
  reportId: string;
  title: string;
  status: string;
  downloadUrl?: string;
  summary?: string;
  rowsCount?: number;
  generatedAt: string;
  data?: unknown;
}

export interface GenerateReportPayload {
  reportId?: string;
  title?: string;
  category?: string;
  format?: "pdf" | "csv" | "xlsx" | "json" | string;
  filters?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
}

export interface ExportReportPayload {
  reportId: string;
  format?: "pdf" | "csv" | "xlsx" | string;
}

// ── 3. Core HR Metrics ────────────────────────────────────────────

export interface HeadcountMetrics {
  totalHeadcount: number;
  fullTime: number;
  partTime: number;
  contractors: number;
  growthMoM: number;
  byDepartment: Array<{ department: string; count: number; percentage: number }>;
  monthlyTrend: Array<{ month: string; headcount: number; hires: number; departures: number }>;
}

export interface PayrollCostMetrics {
  totalCost: number;
  averageSalary: number;
  overtimeSpend: number;
  benefitsCost: number;
  variancePercentage: number;
  byDepartment: Array<{ department: string; totalCost: number; averageCost: number }>;
  trend: Array<{ month: string; amount: number }>;
}

export interface TurnoverMetrics {
  rate: number;
  voluntaryRate: number;
  involuntaryRate: number;
  retentionRate: number;
  averageTenureMonths: number;
  byDepartment: Array<{ department: string; turnoverRate: number; exits: number }>;
  topReasons?: Array<{ reason: string; count: number }>;
}

export interface ComplianceMetrics {
  overallScore: number;
  statutoryComplianceRate: number;
  auditReadinessScore: number;
  pendingAuditsCount: number;
  flaggedViolationsCount: number;
  standards: Array<{ name: string; score: number; status: "compliant" | "warning" | "non_compliant" | string }>;
}

// ── 4. AI Predictive Analytics ────────────────────────────────────

export interface PredictiveInsight {
  id: string;
  title: string;
  category: "attrition" | "burnout" | "cost" | "performance" | string;
  confidenceScore: number;
  impactLevel: "low" | "medium" | "high" | "critical" | string;
  description: string;
  suggestedActions: string[];
  createdAt: string;
}

export interface AnalyzePredictivePayload {
  department?: string;
  timeHorizonMonths?: number;
  focusArea?: string;
}

export interface AttritionPrediction {
  projectedAttritionRate: number;
  atRiskEmployeesCount: number;
  highRiskDepartments: Array<{ department: string; riskPercentage: number }>;
  primaryDrivers: Array<{ driver: string; weight: number }>;
  predictions: Array<{
    employeeId: string;
    employeeName?: string;
    department: string;
    riskScore: number;
    riskLevel: "low" | "medium" | "high" | string;
    primaryReason: string;
  }>;
}

export interface PredictAttritionPayload {
  department?: string;
  riskThreshold?: number;
}

export interface SentimentInsight {
  overallSentiment: "positive" | "neutral" | "negative" | string;
  sentimentScore: number; // 0-100
  engagementIndex: number;
  positiveThemes: string[];
  concernAreas: string[];
  departmentBreakdown: Array<{ department: string; score: number; trend: number }>;
}

export interface AnalyzeSentimentPayload {
  department?: string;
  surveyId?: string;
  timeframe?: string;
}

export interface BurnoutRiskInsight {
  riskIndex: number; // 0-100
  employeesAtRiskCount: number;
  overtimeAlertsCount: number;
  excessiveHoursFlags: number;
  criticalDepartments: Array<{ department: string; riskLevel: string; affectedCount: number }>;
  recommendations: string[];
}

export interface AnalyzeBurnoutPayload {
  department?: string;
  thresholdHours?: number;
}

export interface SalaryBenchmark {
  role: string;
  department?: string;
  marketMedian: number;
  marketP25: number;
  marketP75: number;
  companyAverage: number;
  compaRatio: number;
  competitiveness: "above" | "at" | "below" | string;
  recommendation?: string;
}

export interface AnalyzeSalaryPayload {
  role?: string;
  department?: string;
  region?: string;
}

// ── Complete Redux State Structure ────────────────────────────────

export interface AnalyticsState {
  overview: SectionState<AnalyticsOverview>;
  summary: SectionState<AnalyticsSummary>;
  reports: SectionState<Report[]>;
  selectedReport: SectionState<Report>;
  headcount: SectionState<HeadcountMetrics>;
  payrollCosts: SectionState<PayrollCostMetrics>;
  turnoverRates: SectionState<TurnoverMetrics>;
  complianceMetrics: SectionState<ComplianceMetrics>;
  predictiveInsights: SectionState<PredictiveInsight[]>;
  attrition: SectionState<AttritionPrediction>;
  sentiment: SectionState<SentimentInsight>;
  burnoutRisk: SectionState<BurnoutRiskInsight>;
  salaryBenchmarks: SectionState<SalaryBenchmark[]>;

  // Loading & export states
  exportLoading: boolean;
  operationLoading: Record<string, boolean>;
  operationErrors: Record<string, string | null>;
  operationSuccess: Record<string, boolean>;
}

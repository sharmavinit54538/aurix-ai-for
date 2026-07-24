export interface PayrollDashboardKpis {
  monthlyPayroll: number | null;
  previousMonthPayroll?: number | null;
  forecastNext: number | null;
  healthScore: number | null;
  employeesPaid: number | null;
  pendingPayroll: number | null;
  processingStatus?: string;
  anomalies?: number | null;
  monthlyPayrollTrend?: number | null;
  forecastTrend?: number | null;
  healthScoreTrend?: number | null;
  anomaliesTrend?: number | null;
  currency?: string;
}

export interface PayrollChartPoint {
  label: string;
  value: number;
  secondary?: number;
  growthPct?: number;
  [key: string]: string | number | undefined;
}

export interface PayrollForecastData {
  period?: string;
  nextMonth?: number | null;
  actualPayroll?: number | null;
  forecastPayroll?: number | null;
  growthPct?: number | null;
  confidenceScore?: number | null;
  points: PayrollChartPoint[];
}

export interface PayrollCostAnalysisData {
  period?: string;
  totalCost?: number | null;
  summary?: string;
  costDrivers?: string[];
  items: PayrollChartPoint[];
  salaryDistribution?: PayrollChartPoint[];
}

export interface PayrollCostByDepartmentData {
  period?: string;
  total?: number | null;
  items: Array<{
    department: string;
    cost: number;
    avgSalary?: number;
    headcount?: number;
    overtimeCost?: number;
  }>;
}

export interface SalaryBenchmarkItem {
  role: string;
  department?: string;
  internal?: number | null;
  market?: number | null;
  deltaPct?: number | null;
  status?: string;
}

export interface SalaryBenchmarkingData {
  total: number | null;
  items: SalaryBenchmarkItem[];
  summary?: string;
}

export interface PayrollAnomalyItem {
  id?: string;
  title: string;
  employeeName?: string;
  department?: string;
  severity?: string;
  amount?: number | null;
  note?: string;
}

export interface PayrollAnomaliesData {
  total: number | null;
  items: PayrollAnomalyItem[];
}

export interface PayrollFraudItem {
  id?: string;
  title: string;
  employeeName?: string;
  department?: string;
  risk?: string;
  score?: number | null;
  note?: string;
  recommendation?: string;
}

export interface PayrollFraudData {
  total: number | null;
  items: PayrollFraudItem[];
}

export interface PayrollHealthScoreData {
  score: number | null;
  reliability?: number | null;
  accuracy?: number | null;
  onTime?: number | null;
  compliance?: number | null;
  taxAccuracy?: number | null;
  errorRate?: number | null;
  failedPayrollCount?: number | null;
  summary?: string;
  insights?: string[];
}

export interface PayrollAnalyticsData {
  summary?: string;
  totalCost?: number | null;
  avgCostPerEmployee?: number | null;
  departmentBreakdown?: Array<{ department: string; cost: number; headcount?: number }>;
  monthlyTrend?: PayrollChartPoint[];
  costDistribution?: PayrollChartPoint[];
}

export interface EmployeePayrollProfile {
  id: string;
  name?: string;
  department?: string;
  grossPay?: number | null;
  netPay?: number | null;
  [key: string]: unknown;
}

export interface AIPayrollDashboardData {
  dashboard: PayrollDashboardKpis | null;
  forecast: PayrollForecastData | null;
  costAnalysis: PayrollCostAnalysisData | null;
  costByDepartment: PayrollCostByDepartmentData | null;
  benchmarking: SalaryBenchmarkingData;
  anomalies: PayrollAnomaliesData;
  fraud: PayrollFraudData;
  healthScore: PayrollHealthScoreData | null;
  analytics: PayrollAnalyticsData | null;
}

export interface AIPayrollState {
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  actionLoading: boolean;
  actionError: string | null;
  dashboard: PayrollDashboardKpis | null;
  forecast: PayrollForecastData | null;
  costAnalysis: PayrollCostAnalysisData | null;
  costByDepartment: PayrollCostByDepartmentData | null;
  benchmarking: SalaryBenchmarkingData;
  anomalies: PayrollAnomaliesData;
  fraud: PayrollFraudData;
  healthScore: PayrollHealthScoreData | null;
  analytics: PayrollAnalyticsData | null;
  selectedEmployee: EmployeePayrollProfile | null;
}

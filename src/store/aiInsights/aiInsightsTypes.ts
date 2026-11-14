export interface KpiItem {
  id?: string;
  title?: string;
  label?: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  subtitle?: string;
  category?: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type?: string;
  status?: string;
  size?: string;
}

export interface PayrollAlertItem {
  id: string;
  message: string;
  severity: "high" | "medium" | "low";
}

export interface AIInsightsDashboardData {
  summary?: {
    totalEmployees?: number;
    healthScore?: number;
    attritionRisk?: string;
    overallMood?: string;
  };
  kpis?: KpiItem[];
  alerts?: any[];
  attendance?: any[];
  attrition?: any[];
  burnout?: any[];
  candidates?: any[];
  documents?: DocumentItem[];
  headcountForecast?: any[];
  hiringDemand?: any[];
  payroll?: any[];
  payrollAlerts?: PayrollAlertItem[];
  payrollTrend?: any[];
  recruitment?: any[];
  recommendations?: any[];
  satisfactionTrend?: any[];
  skillGap?: any[];
  supportPerformers?: any[];
  topPerformers?: any[];
  hasDataFlag?: boolean;
  partial?: boolean;
  partialErrors?: any[];
}

export interface AIInsightsState {
  data: AIInsightsDashboardData | null;
  loading: boolean;
  error: string | null;
}

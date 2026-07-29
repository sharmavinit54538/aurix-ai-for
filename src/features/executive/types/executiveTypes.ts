export type ExecutiveRole = "ceo" | "cto" | "cfo" | "cio" | "coo" | "cmo";

export type DateRangeType = "today" | "week" | "month" | "quarter" | "year";

export interface KpiMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  subtext: string;
  iconName: string;
  color: string;
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface AiInsightItem {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium" | "low" | "success";
  actionText?: string;
  category: string;
  timestamp: string;
}

export interface ExecutiveTableRow {
  id: string;
  name: string;
  category: string;
  status: string;
  owner: string;
  value: string;
  date: string;
  progress?: number;
}

export interface ExecutiveDashboardData {
  role: ExecutiveRole;
  title: string;
  subtitle: string;
  healthScore: number;
  kpis: KpiMetric[];
  charts: {
    title: string;
    description: string;
    type: "area" | "bar" | "line" | "pie" | "radial";
    data: ChartDataPoint[];
    dataKeys: { key: string; color: string; label: string }[];
  }[];
  tableData: {
    title: string;
    description: string;
    headers: { key: string; label: string }[];
    rows: ExecutiveTableRow[];
  };
  aiInsights: AiInsightItem[];
  okrs?: { title: string; target: string; current: number; owner: string }[];
}

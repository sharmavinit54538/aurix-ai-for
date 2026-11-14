export interface HeadcountMetric {
  month: string;
  headcount: number;
  hires?: number;
  exits?: number;
}

export interface DepartmentMetric {
  department: string;
  headcount: number;
  budget?: number;
  utilization?: number;
}

export interface TenureMetric {
  range: string;
  count: number;
}

export interface TurnoverMetric {
  month: string;
  rate: number;
  voluntary?: number;
  involuntary?: number;
}

export interface PayrollCostMetric {
  month: string;
  gross: number;
  net: number;
  tax?: number;
}

export interface ComplianceMetric {
  category: string;
  score: number;
  status: string;
}

export interface ReportsFilterParams {
  start_date?: string;
  end_date?: string;
  department?: string;
  location?: string;
}

export const reportsAnalyticsApi = {
  getSummary: async (_params?: ReportsFilterParams) => ({
    headcount: 48,
    attrition_rate: 4.2,
    avg_tenure_years: 2.8,
    payroll_cost: 425000,
    departments: [
      { department: "Engineering", headcount: 22, budget: 210000, utilization: 94 },
      { department: "Product", headcount: 10, budget: 95000, utilization: 91 },
      { department: "Operations", headcount: 16, budget: 120000, utilization: 89 },
    ] as DepartmentMetric[],
    headcount_trend: [
      { month: "Sep", headcount: 44, hires: 3, exits: 1 },
      { month: "Oct", headcount: 46, hires: 2, exits: 0 },
      { month: "Nov", headcount: 48, hires: 2, exits: 0 },
    ] as HeadcountMetric[],
    tenure_distribution: [
      { range: "< 1 Year", count: 12 },
      { range: "1-3 Years", count: 24 },
      { range: "3+ Years", count: 12 },
    ] as TenureMetric[],
    turnover_trend: [
      { month: "Sep", rate: 4.5, voluntary: 1, involuntary: 0 },
      { month: "Oct", rate: 4.3, voluntary: 0, involuntary: 0 },
      { month: "Nov", rate: 4.2, voluntary: 0, involuntary: 0 },
    ] as TurnoverMetric[],
    payroll_costs: [
      { month: "Sep", gross: 405000, net: 340000, tax: 65000 },
      { month: "Oct", gross: 415000, net: 348000, tax: 67000 },
      { month: "Nov", gross: 425000, net: 357000, tax: 68000 },
    ] as PayrollCostMetric[],
    compliance_metrics: [
      { category: "Statutory Filings", score: 98, status: "Compliant" },
      { category: "Document Verification", score: 95, status: "Compliant" },
    ] as ComplianceMetric[],
  }),
  exportReport: async (_type: string) => ({ success: true }),
};
export default reportsAnalyticsApi;

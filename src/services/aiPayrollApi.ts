import apiInstance from "@/api/apiInstance";
import type {
  AIPayrollDashboardData,
  EmployeePayrollProfile,
  PayrollAnalyticsData,
  PayrollAnomaliesData,
  PayrollAnomalyItem,
  PayrollChartPoint,
  PayrollCostAnalysisData,
  PayrollCostByDepartmentData,
  PayrollDashboardKpis,
  PayrollForecastData,
  PayrollFraudData,
  PayrollFraudItem,
  PayrollHealthScoreData,
  SalaryBenchmarkItem,
  SalaryBenchmarkingData,
} from "@/store/aiPayroll/aiPayrollTypes";

type AnyRecord = Record<string, unknown>;

function isRecord(value: unknown): value is AnyRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function unwrap(payload: unknown): unknown {
  if (!isRecord(payload)) return payload;
  if ("success" in payload && "data" in payload) return payload.data ?? payload;
  return payload;
}

function pick(obj: AnyRecord | null | undefined, ...keys: string[]): unknown {
  if (!obj) return undefined;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return undefined;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return null;
}

function asString(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function asOptionalId(value: unknown): string | undefined {
  if (value == null) return undefined;
  const id = asString(value);
  return id || undefined;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

const emptyBenchmarking = (): SalaryBenchmarkingData => ({ total: null, items: [] });
const emptyAnomalies = (): PayrollAnomaliesData => ({ total: null, items: [] });
const emptyFraud = (): PayrollFraudData => ({ total: null, items: [] });

function normalizeChartPoints(raw: unknown, valueKeys: string[]): PayrollChartPoint[] {
  const points: PayrollChartPoint[] = [];
  asArray(raw).forEach((item, index) => {
    if (!isRecord(item)) {
      const value = asNumber(item);
      if (value != null) points.push({ label: `P${index + 1}`, value });
      return;
    }
    const label = asString(
      pick(item, "label", "m", "month", "period", "name", "date", "quarter", "week"),
      `P${index + 1}`,
    );
    const value = asNumber(pick(item, ...valueKeys)) ?? 0;
    const secondary = asNumber(
      pick(item, "forecast", "secondary", "projected", "target", "budget"),
    );
    points.push({
      label,
      value,
      ...(secondary != null ? { secondary } : {}),
    });
  });
  return points;
}

export function normalizePayrollDashboard(raw: unknown): PayrollDashboardKpis | null {
  const data = unwrap(raw);
  if (!isRecord(data)) return null;
  const kpis = isRecord(data.kpis) ? data.kpis : isRecord(data.dashboard) ? (data.dashboard as AnyRecord) : data;

  return {
    monthlyPayroll: asNumber(
      pick(
        kpis,
        "monthly_payroll",
        "monthlyPayroll",
        "total_payroll",
        "totalPayroll",
        "payroll_amount",
        "payrollAmount",
        "current_payroll",
      ),
    ),
    previousMonthPayroll: asNumber(
      pick(kpis, "previous_month_payroll", "previousMonthPayroll", "previous_payroll"),
    ),
    forecastNext: asNumber(
      pick(
        kpis,
        "forecast_next_month",
        "forecastNextMonth",
        "forecast_next",
        "forecastNext",
        "next_month_forecast",
        "nextMonthForecast",
        "forecast",
        "projected_payroll",
      ),
    ),
    healthScore: asNumber(
      pick(
        kpis,
        "payroll_health_score",
        "payrollHealthScore",
        "health_score",
        "healthScore",
        "payroll_health",
        "payrollHealth",
        "score",
      ),
    ),
    employeesPaid: asNumber(
      pick(
        kpis,
        "total_employees_paid",
        "totalEmployeesPaid",
        "employees_paid",
        "employeesPaid",
        "paid_employees",
        "paidEmployees",
        "employee_count",
      ),
    ),
    pendingPayroll: asNumber(
      pick(kpis, "pending_payroll", "pendingPayroll", "pending", "pending_count", "pendingCount"),
    ),
    processingStatus:
      asString(pick(kpis, "payroll_processing_status", "payrollProcessingStatus", "processing_status"), "") ||
      undefined,
    anomalies: asNumber(
      pick(kpis, "anomalies", "anomalies_count", "anomaliesCount", "total_anomalies", "totalAnomalies"),
    ),
    monthlyPayrollTrend: asNumber(
      pick(kpis, "payroll_growth_pct", "payrollGrowthPct", "monthly_payroll_trend", "monthlyPayrollTrend", "payroll_trend"),
    ),
    forecastTrend: asNumber(pick(kpis, "forecast_trend", "forecastTrend")),
    healthScoreTrend: asNumber(pick(kpis, "health_score_trend", "healthScoreTrend")),
    anomaliesTrend: asNumber(pick(kpis, "anomalies_trend", "anomaliesTrend")),
    currency: asString(pick(kpis, "currency", "currency_code", "currencyCode"), "") || undefined,
  };
}

export function normalizeForecast(raw: unknown): PayrollForecastData | null {
  const data = unwrap(raw);
  if (!data) return null;

  const root = isRecord(data) ? data : null;
  const list = asArray(
    root ? pick(root, "data", "items", "points", "series", "forecast", "months") : data,
  );
  const points: PayrollChartPoint[] = [];

  list.forEach((item, index) => {
    if (!isRecord(item)) {
      const value = asNumber(item);
      if (value != null) points.push({ label: `P${index + 1}`, value });
      return;
    }

    const label = asString(
      pick(item, "label", "m", "month", "period", "name", "date", "quarter", "week"),
      `P${index + 1}`,
    );
    const actual =
      asNumber(
        pick(item, "actual_payroll", "actualPayroll", "actual", "cost", "amount", "value", "payroll"),
      ) ?? 0;
    const forecast =
      asNumber(
        pick(item, "forecast_payroll", "forecastPayroll", "forecast", "projected", "predicted", "secondary"),
      ) ?? undefined;
    const growthPct = asNumber(pick(item, "growth_pct", "growthPct", "growth"));

    points.push({
      label,
      value: actual,
      ...(forecast != null ? { secondary: forecast } : {}),
      ...(growthPct != null ? { growthPct } : {}),
    });
  });

  if (!points.length && !root) return null;

  const forecastPayroll = root
    ? asNumber(pick(root, "forecast_payroll", "forecastPayroll", "next_month", "nextMonth", "forecast_next"))
    : null;

  return {
    period: root ? asString(pick(root, "period", "range", "label"), "") || undefined : undefined,
    nextMonth: forecastPayroll,
    actualPayroll: root ? asNumber(pick(root, "actual_payroll", "actualPayroll")) : null,
    forecastPayroll,
    growthPct: root ? asNumber(pick(root, "growth_pct", "growthPct")) : null,
    confidenceScore: root
      ? asNumber(pick(root, "confidence_score", "confidenceScore", "confidence"))
      : null,
    points,
  };
}

export function normalizeCostAnalysis(raw: unknown): PayrollCostAnalysisData | null {
  const data = unwrap(raw);
  if (!data) return null;

  const root = isRecord(data) ? data : null;
  if (!root) return null;

  const costDrivers = asArray(pick(root, "cost_drivers", "costDrivers"))
    .map((driver) => asString(driver))
    .filter(Boolean);

  const trendItems = normalizeChartPoints(
    pick(root, "cost_trend", "costTrend", "trend"),
    ["cost", "amount", "value", "total", "spend"],
  );

  const distributionItems = asArray(pick(root, "salary_distribution", "salaryDistribution")).flatMap(
    (item) => {
      if (!isRecord(item)) return [];
      return [
        {
          label: asString(pick(item, "range", "label", "band", "name"), ""),
          value: asNumber(pick(item, "percentage", "pct", "value", "percent")) ?? 0,
        },
      ].filter((entry) => entry.label);
    },
  );

  const breakdownRaw = pick(root, "payroll_breakdown", "payrollBreakdown", "breakdown");
  const breakdownItems: PayrollChartPoint[] = [];
  if (isRecord(breakdownRaw)) {
    Object.entries(breakdownRaw).forEach(([label, value]) => {
      const amount = asNumber(value);
      if (amount != null) breakdownItems.push({ label, value: amount });
    });
  }

  const items =
    trendItems.length > 0
      ? trendItems
      : breakdownItems.length > 0
        ? breakdownItems
        : distributionItems;

  return {
    period: asString(pick(root, "period", "range"), "") || undefined,
    totalCost: asNumber(
      pick(root, "total_payroll_cost", "totalPayrollCost", "total_cost", "totalCost", "total", "amount"),
    ),
    summary: costDrivers[0] || asString(pick(root, "summary", "insight", "message", "note"), "") || undefined,
    costDrivers: costDrivers.length ? costDrivers : undefined,
    items,
    salaryDistribution: distributionItems.length ? distributionItems : undefined,
  };
}

export function normalizeCostByDepartment(raw: unknown): PayrollCostByDepartmentData | null {
  const data = unwrap(raw);
  if (!data) return null;

  const root = isRecord(data) ? data : null;
  const list = asArray(
    root
      ? pick(root, "department_costs", "departmentCosts", "items", "data", "departments", "breakdown", "results")
      : data,
  );
  const items: Array<{
    department: string;
    cost: number;
    avgSalary?: number;
    headcount?: number;
    overtimeCost?: number;
  }> = [];

  list.forEach((item, index) => {
    if (!isRecord(item)) return;
    const department = asString(
      pick(item, "department", "dept", "name", "label", "d"),
      `Dept ${index + 1}`,
    );
    const cost =
      asNumber(
        pick(item, "total_cost", "totalCost", "cost", "amount", "value", "total", "payroll", "payroll_cost"),
      ) ?? 0;
    const headcount = asNumber(pick(item, "headcount", "count", "employees", "employee_count"));
    const avgSalary = asNumber(pick(item, "avg_salary", "avgSalary", "average_salary"));
    const overtimeCost = asNumber(pick(item, "overtime_cost", "overtimeCost", "ot_cost"));
    items.push({
      department,
      cost,
      ...(avgSalary != null ? { avgSalary } : {}),
      ...(headcount != null ? { headcount } : {}),
      ...(overtimeCost != null ? { overtimeCost } : {}),
    });
  });

  if (!items.length && !root) return null;

  return {
    period: root ? asString(pick(root, "period", "range"), "") || undefined : undefined,
    total: root
      ? asNumber(pick(root, "total_payroll_cost", "totalPayrollCost", "total", "total_cost", "totalCost"))
      : null,
    items,
  };
}

export function normalizeBenchmarking(raw: unknown): SalaryBenchmarkingData {
  const data = unwrap(raw);
  if (!data) return emptyBenchmarking();

  const root = isRecord(data) ? data : null;
  const list = asArray(
    root ? pick(root, "items", "data", "benchmarks", "roles", "results") : data,
  );
  const items: SalaryBenchmarkItem[] = [];

  list.forEach((item, index) => {
    if (!isRecord(item)) return;
    items.push({
      role: asString(pick(item, "role", "title", "position", "job_title", "name", "label"), `Role ${index + 1}`),
      department: asString(pick(item, "department", "dept"), "") || undefined,
      internal: asNumber(pick(item, "internal", "internal_salary", "internalSalary", "company", "current")),
      market: asNumber(pick(item, "market", "market_salary", "marketSalary", "benchmark", "external")),
      deltaPct: asNumber(pick(item, "delta_pct", "deltaPct", "variance_pct", "variancePct", "gap_pct", "gap")),
      status: asString(pick(item, "status", "band", "equity"), "") || undefined,
    });
  });

  return {
    total:
      (root
        ? asNumber(
            pick(
              root,
              "total_employees_analyzed",
              "totalEmployeesAnalyzed",
              "total",
              "count",
              "total_roles",
              "roles_count",
            ),
          )
        : null) ?? (items.length || null),
    items,
    summary: root ? asString(pick(root, "summary", "insight", "message"), "") || undefined : undefined,
  };
}

export function normalizeAnomalies(raw: unknown): PayrollAnomaliesData {
  const data = unwrap(raw);
  if (!data) return emptyAnomalies();

  const root = isRecord(data) ? data : null;
  const list = asArray(
    root ? pick(root, "anomalies", "items", "data", "results", "alerts") : data,
  );
  const items: PayrollAnomalyItem[] = [];

  list.forEach((item, index) => {
    if (!isRecord(item)) return;
    items.push({
      id: asOptionalId(pick(item, "id", "anomaly_id")),
      title: asString(
        pick(item, "title", "type", "name", "label", "anomaly_type", "anomalyType"),
        `Anomaly ${index + 1}`,
      ),
      employeeName: asString(pick(item, "employee_name", "employeeName", "name", "who"), "") || undefined,
      department: asString(pick(item, "department", "dept"), "") || undefined,
      severity: asString(pick(item, "severity", "level", "priority", "risk", "risk_level"), "") || undefined,
      amount: asNumber(pick(item, "amount", "delta", "variance", "value")),
      note: asString(pick(item, "note", "reason", "details", "description", "message"), "") || undefined,
    });
  });

  return {
    total:
      (root
        ? asNumber(pick(root, "total_anomalies", "totalAnomalies", "total", "count", "anomalies_count", "anomaliesCount"))
        : null) ?? items.length,
    items,
  };
}

export function normalizeFraud(raw: unknown): PayrollFraudData {
  const data = unwrap(raw);
  if (!data) return emptyFraud();

  const root = isRecord(data) ? data : null;
  const list = asArray(
    root ? pick(root, "fraud_flags", "fraudFlags", "items", "fraud", "alerts", "data", "results", "flags") : data,
  );
  const items: PayrollFraudItem[] = [];

  list.forEach((item, index) => {
    if (!isRecord(item)) return;
    const fraudType = asString(
      pick(item, "fraud_type", "fraudType", "title", "type", "name", "label"),
      `Fraud flag ${index + 1}`,
    );
    items.push({
      id: asOptionalId(pick(item, "id", "fraud_id", "employee_id", "employeeId")),
      title: fraudType.replace(/_/g, " "),
      employeeName: asString(pick(item, "employee_name", "employeeName", "name"), "") || undefined,
      department: asString(pick(item, "department", "dept"), "") || undefined,
      risk: asString(pick(item, "risk_level", "riskLevel", "risk", "severity", "level", "priority"), "") || undefined,
      score: asNumber(pick(item, "score", "risk_score", "riskScore", "confidence")),
      note:
        asString(pick(item, "description", "note", "reason", "details", "message"), "") || undefined,
      recommendation:
        asString(pick(item, "recommendation", "action", "suggested_action"), "") || undefined,
    });
  });

  return {
    total:
      (root
        ? asNumber(
            pick(root, "total_fraud_flags", "totalFraudFlags", "total", "count", "total_flags", "fraud_count", "flags_count"),
          )
        : null) ?? items.length,
    items,
  };
}

export function normalizeHealthScore(raw: unknown): PayrollHealthScoreData | null {
  const data = unwrap(raw);
  if (!isRecord(data)) {
    const score = asNumber(data);
    return score != null ? { score } : null;
  }

  const insights = asArray(pick(data, "insights", "notes", "recommendations"))
    .map((insight) => asString(insight))
    .filter(Boolean);

  return {
    score: asNumber(
      pick(
        data,
        "health_score",
        "healthScore",
        "payroll_health_score",
        "score",
        "overall_score",
        "overallScore",
        "payroll_health",
      ),
    ),
    reliability: asNumber(pick(data, "reliability", "reliability_score")),
    accuracy: asNumber(pick(data, "accuracy_score", "accuracyScore", "accuracy")),
    onTime: asNumber(
      pick(data, "processing_time_score", "processingTimeScore", "on_time", "onTime", "timeliness", "on_time_score"),
    ),
    compliance: asNumber(pick(data, "compliance_score", "complianceScore", "compliance")),
    taxAccuracy: asNumber(pick(data, "tax_accuracy_score", "taxAccuracyScore")),
    errorRate: asNumber(pick(data, "error_rate", "errorRate")),
    failedPayrollCount: asNumber(pick(data, "failed_payroll_count", "failedPayrollCount")),
    summary:
      insights[0] || asString(pick(data, "summary", "insight", "message", "note"), "") || undefined,
    insights: insights.length ? insights : undefined,
  };
}

export function normalizeAnalytics(raw: unknown): PayrollAnalyticsData | null {
  const data = unwrap(raw);
  if (!isRecord(data)) return null;

  const departmentBreakdown = asArray(
    pick(data, "department_breakdown", "departmentBreakdown", "departments"),
  ).flatMap((item) => {
    if (!isRecord(item)) return [];
    const headcount = asNumber(pick(item, "headcount", "count"));
    return [
      {
        department: asString(pick(item, "department", "dept", "name"), "Unknown"),
        cost:
          asNumber(pick(item, "total_cost", "totalCost", "cost", "amount", "value", "total", "payroll_cost")) ?? 0,
        ...(headcount != null ? { headcount } : {}),
      },
    ];
  });

  const monthlyTrend = asArray(pick(data, "monthly_trend", "monthlyTrend", "trend", "points")).flatMap(
    (item, index) => {
      if (!isRecord(item)) return [];
      return [
        {
          label: asString(pick(item, "month", "label", "period", "name"), `P${index + 1}`),
          value:
            asNumber(
              pick(item, "payroll_cost", "payrollCost", "cost", "amount", "value", "payroll", "actual"),
            ) ?? 0,
        },
      ];
    },
  );

  const costDistribution = asArray(
    pick(data, "cost_distribution", "costDistribution"),
  ).flatMap((item) => {
    if (!isRecord(item)) return [];
    return [
      {
        label: asString(pick(item, "category", "label", "name"), ""),
        value: asNumber(pick(item, "percentage", "pct", "value", "percent")) ?? 0,
      },
    ].filter((entry) => entry.label);
  });

  return {
    summary: asString(pick(data, "summary", "insight", "message", "note"), "") || undefined,
    totalCost: asNumber(
      pick(data, "total_payroll_cost", "totalPayrollCost", "total_cost", "totalCost", "total", "payroll_cost"),
    ),
    avgCostPerEmployee: asNumber(
      pick(data, "avg_cost_per_employee", "avgCostPerEmployee", "average_cost", "cost_per_employee"),
    ),
    departmentBreakdown: departmentBreakdown.length ? departmentBreakdown : undefined,
    monthlyTrend: monthlyTrend.length ? monthlyTrend : undefined,
    costDistribution: costDistribution.length ? costDistribution : undefined,
  };
}

export function normalizeEmployeeProfile(raw: unknown): EmployeePayrollProfile | null {
  const data = unwrap(raw);
  if (!isRecord(data)) return null;

  const id = asOptionalId(pick(data, "id", "employee_id", "employeeId"));
  if (!id) return null;

  return {
    ...data,
    id,
    name: asString(pick(data, "name", "employee_name", "employeeName"), "") || undefined,
    department: asString(pick(data, "department", "dept"), "") || undefined,
    grossPay: asNumber(pick(data, "gross_pay", "grossPay", "gross", "salary")),
    netPay: asNumber(pick(data, "net_pay", "netPay", "net", "take_home")),
  };
}

export function normalizePayrollDashboardBundle(raw: unknown): AIPayrollDashboardData {
  const data = unwrap(raw);
  if (!isRecord(data)) {
    return {
      dashboard: null,
      forecast: null,
      costAnalysis: null,
      costByDepartment: null,
      benchmarking: emptyBenchmarking(),
      anomalies: emptyAnomalies(),
      fraud: emptyFraud(),
      healthScore: null,
      analytics: null,
    };
  }

  return {
    dashboard: normalizePayrollDashboard(pick(data, "dashboard", "kpis", "kpi") ?? data),
    forecast: normalizeForecast(pick(data, "forecast", "payroll_forecast")),
    costAnalysis: normalizeCostAnalysis(pick(data, "cost_analysis", "costAnalysis")),
    costByDepartment: normalizeCostByDepartment(
      pick(data, "cost_by_department", "costByDepartment", "departments"),
    ),
    benchmarking: normalizeBenchmarking(pick(data, "benchmarking", "salary_benchmarking")),
    anomalies: normalizeAnomalies(pick(data, "anomalies", "payroll_anomalies")),
    fraud: normalizeFraud(pick(data, "fraud", "fraud_detection", "fraudDetection")),
    healthScore: normalizeHealthScore(pick(data, "health_score", "healthScore")),
    analytics: normalizeAnalytics(pick(data, "analytics", "payroll_analytics")),
  };
}

async function getEndpoint<T>(path: string, normalize: (raw: unknown) => T): Promise<T> {
  const response = await apiInstance.get(path);
  return normalize(response.data ?? response);
}

async function postEndpoint<T>(path: string, body: unknown, normalize: (raw: unknown) => T): Promise<T> {
  const response = await apiInstance.post(path, body ?? {});
  return normalize(response.data ?? response);
}

export const aiPayrollApi = {
  async getDashboard(): Promise<AIPayrollDashboardData> {
    return getEndpoint("/ai/payroll/dashboard", (raw) => {
      const combined = normalizePayrollDashboardBundle(raw);
      if (
        combined.forecast ||
        combined.costAnalysis ||
        combined.costByDepartment ||
        combined.benchmarking.items.length > 0 ||
        combined.benchmarking.total != null ||
        combined.anomalies.items.length > 0 ||
        combined.anomalies.total != null ||
        combined.fraud.items.length > 0 ||
        combined.fraud.total != null ||
        combined.healthScore ||
        combined.analytics
      ) {
        return combined;
      }

      return {
        ...combined,
        dashboard: normalizePayrollDashboard(raw) ?? combined.dashboard,
      };
    });
  },

  async getDashboardKpis(): Promise<PayrollDashboardKpis | null> {
    return getEndpoint("/ai/payroll/dashboard", normalizePayrollDashboard);
  },

  async getForecast(): Promise<PayrollForecastData | null> {
    return getEndpoint("/ai/payroll/forecast", normalizeForecast);
  },

  async getCostAnalysis(): Promise<PayrollCostAnalysisData | null> {
    return getEndpoint("/ai/payroll/cost-analysis", normalizeCostAnalysis);
  },

  async getCostByDepartment(): Promise<PayrollCostByDepartmentData | null> {
    return getEndpoint("/ai/payroll/cost-by-department", normalizeCostByDepartment);
  },

  async getBenchmarking(): Promise<SalaryBenchmarkingData> {
    return getEndpoint("/ai/payroll/benchmarking", normalizeBenchmarking);
  },

  async getAnomalies(): Promise<PayrollAnomaliesData> {
    return getEndpoint("/ai/payroll/anomalies", normalizeAnomalies);
  },

  async getFraudDetection(): Promise<PayrollFraudData> {
    return getEndpoint("/ai/payroll/fraud-detection", normalizeFraud);
  },

  async getHealthScore(): Promise<PayrollHealthScoreData | null> {
    return getEndpoint("/ai/payroll/health-score", normalizeHealthScore);
  },

  async getAnalytics(): Promise<PayrollAnalyticsData | null> {
    return getEndpoint("/ai/payroll/analytics", normalizeAnalytics);
  },

  async getEmployeeProfile(employeeId: string): Promise<EmployeePayrollProfile | null> {
    return getEndpoint(`/ai/payroll/employee/${employeeId}`, normalizeEmployeeProfile);
  },

  async generateForecast(payload: Record<string, unknown> = {}): Promise<PayrollForecastData | null> {
    return postEndpoint("/ai/payroll/forecast", payload, normalizeForecast);
  },

  async analyze(payload: Record<string, unknown> = {}): Promise<unknown> {
    return postEndpoint("/ai/payroll/analyze", payload, unwrap);
  },

  async detectAnomalies(payload: Record<string, unknown> = {}): Promise<PayrollAnomaliesData> {
    return postEndpoint("/ai/payroll/detect-anomalies", payload, normalizeAnomalies);
  },

  async detectFraud(payload: Record<string, unknown> = {}): Promise<PayrollFraudData> {
    return postEndpoint("/ai/payroll/detect-fraud", payload, normalizeFraud);
  },
};

export default aiPayrollApi;

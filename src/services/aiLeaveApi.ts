import apiInstance from "@/api/apiInstance";
import type {
  AILeaveDashboardData,
  LeaveAnalyticsData,
  LeaveApprovalSuggestionItem,
  LeaveApprovalSuggestionsData,
  LeaveChartPoint,
  LeaveConflictItem,
  LeaveConflictsData,
  LeaveDashboardKpis,
  LeaveDistributionData,
  LeaveForecastData,
  LeaveRequestDetails,
  LeaveTeamAvailabilityData,
  LeaveTeamAvailabilityItem,
  LeaveTrendsData,
} from "@/store/aiLeave/aiLeaveTypes";

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

function normalizeChartPoints(
  raw: unknown,
  labelKeys: string[],
  valueKeys: string[],
): LeaveChartPoint[] {
  const points: LeaveChartPoint[] = [];

  asArray(raw).forEach((item, index) => {
    if (!isRecord(item)) {
      const value = asNumber(item);
      if (value != null) points.push({ label: `Point ${index + 1}`, value });
      return;
    }

    const label = asString(pick(item, ...labelKeys), `Point ${index + 1}`);
    const value =
      asNumber(pick(item, ...valueKeys)) ??
      asNumber(pick(item, "value", "count", "total", "days", "leaves", "amount")) ??
      0;

    points.push({ label, value });
  });

  return points;
}

function riskRank(level: string | undefined): number {
  const value = (level || "").toUpperCase();
  if (value === "CRITICAL") return 4;
  if (value === "HIGH") return 3;
  if (value === "MEDIUM") return 2;
  if (value === "LOW") return 1;
  return 0;
}

export function normalizeLeaveDashboard(raw: unknown): LeaveDashboardKpis | null {
  const data = unwrap(raw);
  if (!isRecord(data)) return null;

  const kpis = isRecord(data.kpis) ? data.kpis : isRecord(data.dashboard) ? (data.dashboard as AnyRecord) : data;

  return {
    pending: asNumber(
      pick(
        kpis,
        "pending_leave_requests",
        "pendingLeaveRequests",
        "pending",
        "pending_requests",
        "pendingRequests",
        "pending_count",
        "pendingCount",
      ),
    ),
    approved: asNumber(
      pick(kpis, "approved_requests", "approvedRequests", "approved", "approved_count", "approvedCount"),
    ),
    rejected: asNumber(
      pick(kpis, "rejected_requests", "rejectedRequests", "rejected", "rejected_count", "rejectedCount"),
    ),
    teamAvailability: asNumber(
      pick(
        kpis,
        "team_availability_percentage",
        "teamAvailabilityPercentage",
        "team_availability",
        "teamAvailability",
        "availability",
        "availability_percentage",
        "availabilityPercentage",
      ),
    ),
    employeesOnLeave: asNumber(
      pick(
        kpis,
        "employees_on_leave_today",
        "employeesOnLeaveToday",
        "employees_on_leave",
        "employeesOnLeave",
        "on_leave",
        "onLeave",
        "currently_on_leave",
        "currentlyOnLeave",
      ),
    ),
    approvalSuggestions: asNumber(
      pick(
        kpis,
        "approval_suggestions_count",
        "approvalSuggestionsCount",
        "approval_suggestions",
        "approvalSuggestions",
        "suggestions",
        "suggestion_count",
      ),
    ),
    conflicts: asNumber(
      pick(
        kpis,
        "leave_conflicts_count",
        "leaveConflictsCount",
        "conflicts",
        "conflicts_detected",
        "conflictsDetected",
        "conflict_count",
      ),
    ),
    averageApprovalTimeHours: asNumber(
      pick(kpis, "average_approval_time_hours", "averageApprovalTimeHours", "avg_approval_time_hours"),
    ),
    pendingTrend: asNumber(pick(kpis, "pending_trend", "pendingTrend")),
    approvedTrend: asNumber(pick(kpis, "approved_trend", "approvedTrend")),
    rejectedTrend: asNumber(pick(kpis, "rejected_trend", "rejectedTrend")),
    availabilityTrend: asNumber(pick(kpis, "availability_trend", "availabilityTrend")),
  };
}

export function normalizeForecast(raw: unknown): LeaveForecastData | null {
  const data = unwrap(raw);
  if (!data) return null;

  const root = isRecord(data) ? data : null;
  const list = asArray(root ? pick(root, "data", "items", "forecast", "points", "series", "weeks") : data);
  const points: LeaveChartPoint[] = [];

  list.forEach((item, index) => {
    if (!isRecord(item)) {
      const value = asNumber(item);
      if (value != null) points.push({ label: `W${index + 1}`, value });
      return;
    }

    points.push({
      label: asString(
        pick(item, "period_label", "periodLabel", "label", "w", "week", "month", "date", "period", "name"),
        `W${index + 1}`,
      ),
      value:
        asNumber(
          pick(
            item,
            "expected_leave_days",
            "expectedLeaveDays",
            "leaves",
            "forecast",
            "forecasted_leaves",
            "forecastedLeaves",
            "value",
            "count",
            "days",
          ),
        ) ?? 0,
      peakRisk: asString(pick(item, "peak_risk_level", "peakRiskLevel", "peak_risk", "risk"), "") || undefined,
      department:
        asString(pick(item, "affected_department", "affectedDepartment", "department", "dept"), "") || undefined,
    });
  });

  if (!points.length && !root) return null;

  const peakRisk =
    points.reduce<string | undefined>((best, point) => {
      if (!point.peakRisk) return best;
      if (!best || riskRank(point.peakRisk) > riskRank(best)) return point.peakRisk;
      return best;
    }, undefined) ||
    (root
      ? asString(pick(root, "peak_risk", "peakRisk", "risk", "risk_level", "riskLevel"), "") || undefined
      : undefined);

  return {
    period: root ? asString(pick(root, "period", "range", "timeframe"), "") || undefined : undefined,
    groupBy: root ? asString(pick(root, "group_by", "groupBy"), "") || undefined : undefined,
    peakRisk,
    points,
  };
}

export function normalizeDistribution(raw: unknown): LeaveDistributionData | null {
  const data = unwrap(raw);
  if (!data) return null;

  const root = isRecord(data) ? data : null;
  const list = asArray(root ? pick(root, "distribution", "data", "items", "types") : data);
  const items: LeaveChartPoint[] = [];

  list.forEach((item, index) => {
    if (!isRecord(item)) return;
    items.push({
      label: asString(pick(item, "leave_type", "leaveType", "type", "label", "t", "name"), `Type ${index + 1}`),
      value:
        asNumber(pick(item, "days_taken", "daysTaken", "days", "value", "count", "total", "percentage")) ?? 0,
      count: asNumber(pick(item, "count", "total")) ?? undefined,
      percentage: asNumber(pick(item, "percentage", "pct")) ?? undefined,
    });
  });

  if (!items.length && !root) return null;

  return {
    totalLeaves: root
      ? asNumber(pick(root, "total_leaves", "totalLeaves", "total", "count"))
      : items.reduce((sum, item) => sum + (item.count ?? 0), 0),
    items,
  };
}

export function normalizeApprovalSuggestions(raw: unknown): LeaveApprovalSuggestionsData {
  const data = unwrap(raw);
  const empty: LeaveApprovalSuggestionsData = { total: null, items: [] };
  if (!data) return empty;

  const root = isRecord(data) ? data : null;
  const list = asArray(root ? pick(root, "items", "suggestions", "data", "results") : data);
  const items: LeaveApprovalSuggestionItem[] = [];

  list.forEach((item, index) => {
    if (!isRecord(item)) return;
    items.push({
      id: asOptionalId(pick(item, "leave_request_id", "leaveRequestId", "id")),
      employeeId: asOptionalId(pick(item, "employee_id", "employeeId")),
      employeeName: asString(
        pick(item, "employee_name", "employeeName", "name", "employee"),
        `Employee ${index + 1}`,
      ),
      department: asString(pick(item, "department", "dept"), "") || undefined,
      leaveType: asString(pick(item, "leave_type", "leaveType", "type"), "") || undefined,
      startDate: asString(pick(item, "start_date", "startDate"), "") || undefined,
      endDate: asString(pick(item, "end_date", "endDate"), "") || undefined,
      days: asNumber(pick(item, "total_days", "totalDays", "days", "duration")) ?? undefined,
      suggestion: asString(
        pick(item, "recommendation", "suggestion", "action", "decision"),
        "Review",
      ),
      confidence: asNumber(pick(item, "confidence_score", "confidenceScore", "confidence", "score")),
      reason: asString(pick(item, "reason", "rationale", "details", "note", "message"), "") || undefined,
      leaveBalanceRemaining: asNumber(
        pick(item, "leave_balance_remaining", "leaveBalanceRemaining", "balance_remaining"),
      ),
      teamAvailabilityPct: asNumber(
        pick(item, "team_availability_pct", "teamAvailabilityPct", "team_availability"),
      ),
    });
  });

  return {
    total:
      (root
        ? asNumber(
            pick(root, "total_pending", "totalPending", "total", "count", "total_suggestions", "totalSuggestions"),
          )
        : null) ?? items.length,
    items,
  };
}

export function normalizeConflicts(raw: unknown): LeaveConflictsData {
  const data = unwrap(raw);
  const empty: LeaveConflictsData = { total: null, items: [] };
  if (!data) return empty;

  const root = isRecord(data) ? data : null;
  const list = asArray(root ? pick(root, "items", "conflicts", "data", "results") : data);
  const items: LeaveConflictItem[] = [];

  list.forEach((item, index) => {
    if (!isRecord(item)) return;
    const employeesRaw = pick(item, "affected_employees", "affectedEmployees", "employees", "employee_names");
    items.push({
      id: asOptionalId(pick(item, "id", "conflict_id", "conflictId")),
      title: asString(
        pick(item, "conflict_type", "conflictType", "title", "name", "type"),
        `Conflict ${index + 1}`,
      ),
      department: asString(pick(item, "department", "dept", "team"), "") || undefined,
      severity: asString(pick(item, "severity", "risk_level", "riskLevel", "level"), "") || undefined,
      note:
        asString(pick(item, "description", "note", "details", "message", "reason"), "") || undefined,
      resolution:
        asString(pick(item, "suggested_resolution", "suggestedResolution", "resolution"), "") || undefined,
      employees: asArray(employeesRaw).map((name) => asString(name)).filter(Boolean),
    });
  });

  return {
    total:
      (root
        ? asNumber(pick(root, "total_conflicts", "totalConflicts", "total", "count", "conflicts_detected"))
        : null) ?? items.length,
    items,
  };
}

export function normalizeTeamAvailability(raw: unknown): LeaveTeamAvailabilityData | null {
  const data = unwrap(raw);
  if (!data) return null;

  if (Array.isArray(data)) {
    const items: LeaveTeamAvailabilityItem[] = [];
    data.forEach((item) => {
      if (!isRecord(item)) return;
      items.push({
        department: asString(pick(item, "department", "dept", "team", "name", "label"), "Unknown"),
        availability:
          asNumber(
            pick(
              item,
              "available_pct",
              "availablePct",
              "availability",
              "availability_percentage",
              "availabilityPercentage",
              "pct",
              "value",
            ),
          ) ?? 0,
        onLeave: asNumber(pick(item, "on_leave", "onLeave", "employees_on_leave")) ?? undefined,
        headcount: asNumber(pick(item, "headcount", "total", "employees")) ?? undefined,
      });
    });
    return { overall: null, items, shifts: [] };
  }

  if (!isRecord(data)) return null;

  const items: LeaveTeamAvailabilityItem[] = [];
  asArray(
    pick(data, "department_breakdown", "departmentBreakdown", "items", "departments", "teams", "data", "metrics"),
  ).forEach((item) => {
    if (!isRecord(item)) return;
    items.push({
      department: asString(pick(item, "department", "dept", "team", "name", "label"), "Unknown"),
      availability:
        asNumber(
          pick(
            item,
            "available_pct",
            "availablePct",
            "availability",
            "availability_percentage",
            "availabilityPercentage",
            "pct",
            "value",
          ),
        ) ?? 0,
      onLeave: asNumber(pick(item, "on_leave", "onLeave", "employees_on_leave")) ?? undefined,
      headcount: asNumber(pick(item, "headcount", "total", "employees")) ?? undefined,
    });
  });

  const shifts: Array<{ shift: string; availability: number }> = [];
  asArray(pick(data, "shift_breakdown", "shiftBreakdown", "shifts")).forEach((item) => {
    if (!isRecord(item)) return;
    shifts.push({
      shift: asString(pick(item, "shift", "name", "label"), "Shift"),
      availability: asNumber(pick(item, "available_pct", "availablePct", "availability", "pct")) ?? 0,
    });
  });

  return {
    overall: asNumber(
      pick(
        data,
        "availability_percentage",
        "availabilityPercentage",
        "overall",
        "overall_availability",
        "overallAvailability",
        "team_availability",
        "teamAvailability",
        "availability",
      ),
    ),
    totalEmployees: asNumber(pick(data, "total_employees", "totalEmployees")),
    availableCount: asNumber(pick(data, "available_count", "availableCount")),
    onLeaveCount: asNumber(pick(data, "on_leave_count", "onLeaveCount")),
    items,
    shifts,
  };
}

export function normalizeTrends(raw: unknown): LeaveTrendsData | null {
  const data = unwrap(raw);
  if (!data) return null;

  const root = isRecord(data) ? data : null;
  const list = asArray(root ? pick(root, "data", "items", "points", "series", "trends") : data);
  const points: LeaveChartPoint[] = [];

  list.forEach((item, index) => {
    if (!isRecord(item)) {
      const value = asNumber(item);
      if (value != null) points.push({ label: `Point ${index + 1}`, value });
      return;
    }

    points.push({
      label: asString(pick(item, "label", "m", "month", "week", "date", "period", "name"), `Point ${index + 1}`),
      value:
        asNumber(
          pick(item, "leave_count", "leaveCount", "days_sum", "daysSum", "leaves", "value", "count", "days", "total"),
        ) ?? 0,
      count: asNumber(pick(item, "leave_count", "leaveCount", "count")) ?? undefined,
    });
  });

  if (!points.length && !root) return null;

  return {
    period: root ? asString(pick(root, "period", "range"), "") || undefined : undefined,
    points,
  };
}

export function normalizeAnalytics(raw: unknown): LeaveAnalyticsData | null {
  const data = unwrap(raw);
  if (!isRecord(data)) return null;

  return {
    totalRequests: asNumber(pick(data, "total_requests", "totalRequests", "total", "count")),
    avgDuration: asNumber(pick(data, "avg_duration", "avgDuration", "average_duration", "averageDuration")),
    utilizationRate: asNumber(
      pick(data, "utilization_rate", "utilizationRate", "utilization", "leave_utilization"),
    ),
    peakMonth: asString(pick(data, "peak_month", "peakMonth", "peak_period"), "") || undefined,
    summary: asString(pick(data, "summary", "insight", "message", "note"), "") || undefined,
  };
}

export function normalizeLeaveRequest(raw: unknown): LeaveRequestDetails | null {
  const data = unwrap(raw);
  if (!isRecord(data)) return null;

  const id = asOptionalId(pick(data, "id", "leave_request_id", "leaveRequestId"));
  if (!id) return null;

  return {
    ...data,
    id,
    employeeName: asString(pick(data, "employee_name", "employeeName", "name"), "") || undefined,
    department: asString(pick(data, "department", "dept"), "") || undefined,
    leaveType: asString(pick(data, "leave_type", "leaveType", "type"), "") || undefined,
    status: asString(pick(data, "status"), "") || undefined,
    startDate: asString(pick(data, "start_date", "startDate", "from"), "") || undefined,
    endDate: asString(pick(data, "end_date", "endDate", "to"), "") || undefined,
    days: asNumber(pick(data, "days", "duration", "total_days")),
    reason: asString(pick(data, "reason", "notes", "comment"), "") || undefined,
  };
}

export function normalizeLeaveDashboardBundle(raw: unknown): AILeaveDashboardData {
  const data = unwrap(raw);
  if (!isRecord(data)) {
    return {
      dashboard: null,
      forecast: null,
      distribution: null,
      approvalSuggestions: { total: null, items: [] },
      conflicts: { total: null, items: [] },
      teamAvailability: null,
      trends: null,
      analytics: null,
    };
  }

  return {
    dashboard: normalizeLeaveDashboard(pick(data, "dashboard", "kpis", "kpi") ?? data),
    forecast: normalizeForecast(pick(data, "forecast", "leave_forecast")),
    distribution: normalizeDistribution(pick(data, "distribution", "leave_distribution")),
    approvalSuggestions: normalizeApprovalSuggestions(
      pick(data, "approval_suggestions", "approvalSuggestions", "suggestions"),
    ),
    conflicts: normalizeConflicts(pick(data, "conflicts", "leave_conflicts")),
    teamAvailability: normalizeTeamAvailability(
      pick(data, "team_availability", "teamAvailability", "availability"),
    ),
    trends: normalizeTrends(pick(data, "trends", "leave_trends")),
    analytics: normalizeAnalytics(pick(data, "analytics", "leave_analytics")),
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

export const aiLeaveApi = {
  async getDashboard(): Promise<AILeaveDashboardData> {
    return getEndpoint("/ai/leave/dashboard", (raw) => {
      const combined = normalizeLeaveDashboardBundle(raw);
      if (
        combined.forecast ||
        combined.distribution ||
        combined.approvalSuggestions.items.length > 0 ||
        combined.approvalSuggestions.total != null ||
        combined.conflicts.items.length > 0 ||
        combined.conflicts.total != null ||
        combined.teamAvailability ||
        combined.trends ||
        combined.analytics
      ) {
        return combined;
      }

      return {
        ...combined,
        dashboard: normalizeLeaveDashboard(raw) ?? combined.dashboard,
      };
    });
  },

  async getDashboardKpis(): Promise<LeaveDashboardKpis | null> {
    return getEndpoint("/ai/leave/dashboard", normalizeLeaveDashboard);
  },

  async getForecast(): Promise<LeaveForecastData | null> {
    return getEndpoint("/ai/leave/forecast", normalizeForecast);
  },

  async getDistribution(): Promise<LeaveDistributionData | null> {
    return getEndpoint("/ai/leave/distribution", normalizeDistribution);
  },

  async getApprovalSuggestions(): Promise<LeaveApprovalSuggestionsData> {
    return getEndpoint("/ai/leave/approval-suggestions", normalizeApprovalSuggestions);
  },

  async getConflicts(): Promise<LeaveConflictsData> {
    return getEndpoint("/ai/leave/conflicts", normalizeConflicts);
  },

  async getTeamAvailability(): Promise<LeaveTeamAvailabilityData | null> {
    return getEndpoint("/ai/leave/team-availability", normalizeTeamAvailability);
  },

  async getTrends(): Promise<LeaveTrendsData | null> {
    return getEndpoint("/ai/leave/trends", normalizeTrends);
  },

  async getAnalytics(): Promise<LeaveAnalyticsData | null> {
    return getEndpoint("/ai/leave/analytics", normalizeAnalytics);
  },

  async getRequestDetails(leaveRequestId: string): Promise<LeaveRequestDetails | null> {
    return getEndpoint(`/ai/leave/request/${leaveRequestId}`, normalizeLeaveRequest);
  },

  async analyzeLeave(payload: Record<string, unknown> = {}): Promise<unknown> {
    return postEndpoint("/ai/leave/analyze", payload, unwrap);
  },

  async generateForecast(payload: Record<string, unknown> = {}): Promise<LeaveForecastData | null> {
    return postEndpoint("/ai/leave/forecast", payload, normalizeForecast);
  },

  async generateSuggestions(payload: Record<string, unknown> = {}): Promise<LeaveApprovalSuggestionsData> {
    return postEndpoint("/ai/leave/generate-suggestions", payload, normalizeApprovalSuggestions);
  },

  async detectConflicts(payload: Record<string, unknown> = {}): Promise<LeaveConflictsData> {
    return postEndpoint("/ai/leave/detect-conflicts", payload, normalizeConflicts);
  },
};

export default aiLeaveApi;

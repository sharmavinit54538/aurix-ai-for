import apiInstance from "@/api/apiInstance";
import type {
  ComplianceCharts,
  ComplianceDashboardData,
  ComplianceKpiItem,
  ComplianceRiskItem,
  ComplianceSummary,
  ComplianceTrendItem,
  RiskByCategoryItem,
} from "@/store/compliance/complianceTypes";

export function normalizeRiskByCategoryItems(raw: unknown): RiskByCategoryItem[] {
  if (!raw) return [];
  const body: any =
    typeof raw === "object" && raw !== null && "data" in (raw as Record<string, unknown>)
      ? (raw as Record<string, unknown>).data
      : raw;
  if (!body) return [];

  // If array already
  if (Array.isArray(body)) {
    return body.map((r: any) => ({
      c: String(r.c ?? r.category ?? r.risk_category ?? r.name ?? "General"),
      n: Number(r.n ?? r.risk_count ?? r.riskCount ?? r.count ?? 1),
    }));
  }

  // If object with risks_by_category or risksByCategory
  const catList = body.risks_by_category ?? body.risksByCategory;
  if (Array.isArray(catList)) {
    return catList.map((r: any) => ({
      c: String(r.c ?? r.category ?? r.risk_category ?? r.name ?? "General"),
      n: Number(r.n ?? r.risk_count ?? r.riskCount ?? r.count ?? 1),
    }));
  }

  // If object with risks array (e.g. RiskDetectionResponse: { risks: RiskItem[] })
  if (Array.isArray(body.risks)) {
    const categoryCounts: Record<string, number> = {};
    for (const item of body.risks) {
      const cat = String(item.risk_category ?? item.category ?? item.title ?? "General");
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }
    return Object.entries(categoryCounts).map(([c, n]) => ({ c, n }));
  }

  return [];
}

export function normalizeComplianceDashboardData(
  data: Partial<ComplianceDashboardData & ComplianceSummary & Record<string, unknown>> | null | undefined,
): ComplianceDashboardData {
  if (!data || typeof data !== "object") {
    return {
      summary: undefined,
      kpi: [],
      risks: [],
      charts: undefined,
    };
  }

  // Unwrap if nested data.data exists
  const raw: Record<string, unknown> =
    (data as any).data !== undefined && typeof (data as any).data === "object"
      ? (data as any).data
      : data;

  // Handle summary: reads camelCase and snake_case duplicate fields
  let summary: ComplianceSummary | undefined = undefined;
  if (raw.summary && typeof raw.summary === "object") {
    const s = raw.summary as Record<string, unknown>;
    const rawReadiness = s.auditReadiness ?? s.audit_readiness;
    summary = {
      complianceScore: Number(s.complianceScore ?? s.compliance_score ?? 0),
      openRisks: Number(s.openRisks ?? s.open_risks ?? 0),
      missingDocs: Number(s.missingDocs ?? s.missing_docs ?? 0),
      auditReadiness:
        typeof rawReadiness === "string"
          ? parseFloat(rawReadiness) || 0
          : Number(rawReadiness ?? 0),
      lastAnalysis: s.lastAnalysis ? String(s.lastAnalysis) : undefined,
    };
  } else if (
    raw.complianceScore !== undefined ||
    raw.compliance_score !== undefined ||
    raw.openRisks !== undefined ||
    raw.open_risks !== undefined ||
    raw.missingDocs !== undefined ||
    raw.missing_docs !== undefined ||
    raw.auditReadiness !== undefined ||
    raw.audit_readiness !== undefined
  ) {
    const rawReadiness = raw.auditReadiness ?? raw.audit_readiness;
    summary = {
      complianceScore: Number(raw.complianceScore ?? raw.compliance_score ?? 0),
      openRisks: Number(raw.openRisks ?? raw.open_risks ?? 0),
      missingDocs: Number(raw.missingDocs ?? raw.missing_docs ?? 0),
      auditReadiness:
        typeof rawReadiness === "string"
          ? parseFloat(rawReadiness) || 0
          : Number(rawReadiness ?? 0),
      lastAnalysis: raw.lastAnalysis ? String(raw.lastAnalysis) : undefined,
    };
  }

  // Trend normalization: support { m, score } as well as { month, compliance_score }
  const rawCharts = raw.charts as Record<string, unknown> | undefined;
  const rawTrend = Array.isArray(rawCharts?.complianceTrend)
    ? (rawCharts!.complianceTrend as unknown[])
    : Array.isArray(raw.complianceTrend)
    ? (raw.complianceTrend as unknown[])
    : Array.isArray(raw.compliance_trend)
    ? (raw.compliance_trend as unknown[])
    : [];

  const complianceTrend: ComplianceTrendItem[] = rawTrend.map((t: any) => ({
    m: String(t.m ?? t.month ?? t.label ?? t.period ?? ""),
    score: Number(t.score ?? t.compliance_score ?? t.complianceScore ?? t.value ?? 0),
  }));

  // Risks by category normalization: support { c, n } as well as { category, risk_count }
  const rawRisks = Array.isArray(rawCharts?.risksByCategory)
    ? (rawCharts!.risksByCategory as unknown[])
    : Array.isArray(raw.risksByCategory)
    ? (raw.risksByCategory as unknown[])
    : Array.isArray(raw.risks_by_category)
    ? (raw.risks_by_category as unknown[])
    : [];

  const risksByCategory: RiskByCategoryItem[] = rawRisks.map((r: any) => ({
    c: String(r.c ?? r.category ?? r.risk_category ?? r.name ?? ""),
    n: Number(r.n ?? r.risk_count ?? r.riskCount ?? r.count ?? 0),
  }));

  const charts: ComplianceCharts = {
    complianceTrend,
    risksByCategory,
  };

  const kpi: ComplianceKpiItem[] = Array.isArray(raw.kpi) ? (raw.kpi as ComplianceKpiItem[]) : [];
  const risks: ComplianceRiskItem[] = Array.isArray(raw.risks)
    ? (raw.risks as ComplianceRiskItem[])
    : [];

  return {
    summary,
    kpi,
    risks,
    charts,
    complianceTrend,
    risksByCategory,
  };
}

export const complianceApi = {
  async getDashboard(): Promise<ComplianceDashboardData> {
    const response = await apiInstance.get("/ai/compliance/dashboard");
    const data = response.data?.data ?? response.data;
    return normalizeComplianceDashboardData(data);
  },

  async getRisks(): Promise<RiskByCategoryItem[]> {
    const response = await apiInstance.get("/ai/compliance/risks");
    const data = response.data?.data ?? response.data;
    return normalizeRiskByCategoryItems(data);
  },
};

export default complianceApi;

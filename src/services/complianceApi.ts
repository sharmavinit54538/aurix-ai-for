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

export function normalizeComplianceDashboardData(
  data: Partial<ComplianceDashboardData & ComplianceSummary> | null | undefined,
): ComplianceDashboardData {
  if (!data || typeof data !== "object") {
    return {
      summary: undefined,
      kpi: [],
      risks: [],
      charts: undefined,
    };
  }

  // Handle summary either as nested data.summary or top-level properties
  let summary: ComplianceSummary | undefined = undefined;
  if (data.summary && typeof data.summary === "object") {
    summary = {
      complianceScore: Number(data.summary.complianceScore ?? 0),
      openRisks: Number(data.summary.openRisks ?? 0),
      missingDocs: Number(data.summary.missingDocs ?? 0),
      auditReadiness: Number(data.summary.auditReadiness ?? 0),
      lastAnalysis: data.summary.lastAnalysis,
    };
  } else if (
    data.complianceScore !== undefined ||
    data.openRisks !== undefined ||
    data.missingDocs !== undefined ||
    data.auditReadiness !== undefined
  ) {
    summary = {
      complianceScore: Number(data.complianceScore ?? 0),
      openRisks: Number(data.openRisks ?? 0),
      missingDocs: Number(data.missingDocs ?? 0),
      auditReadiness: Number(data.auditReadiness ?? 0),
      lastAnalysis: data.lastAnalysis,
    };
  }

  const complianceTrend: ComplianceTrendItem[] = Array.isArray(data.charts?.complianceTrend)
    ? data.charts!.complianceTrend
    : Array.isArray(data.complianceTrend)
    ? data.complianceTrend
    : [];

  const risksByCategory: RiskByCategoryItem[] = Array.isArray(data.charts?.risksByCategory)
    ? data.charts!.risksByCategory
    : Array.isArray(data.risksByCategory)
    ? data.risksByCategory
    : [];

  const charts: ComplianceCharts = {
    complianceTrend,
    risksByCategory,
  };

  return {
    summary,
    kpi: Array.isArray(data.kpi) ? data.kpi : [],
    risks: Array.isArray(data.risks) ? data.risks : [],
    charts,
  };
}

export const complianceApi = {
  async getDashboard(): Promise<ComplianceDashboardData> {
    const response = await apiInstance.get("/compliance/dashboard");
    const data = response.data?.data ?? response.data;
    return normalizeComplianceDashboardData(data);
  },

  async getKpi(): Promise<ComplianceKpiItem[]> {
    const response = await apiInstance.get("/compliance/kpi");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  async getRisks(): Promise<RiskByCategoryItem[]> {
    const response = await apiInstance.get("/compliance/risks");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },

  async getTrend(): Promise<ComplianceTrendItem[]> {
    const response = await apiInstance.get("/compliance/trend");
    const data = response.data?.data ?? response.data;
    return Array.isArray(data) ? data : [];
  },
};

export default complianceApi;

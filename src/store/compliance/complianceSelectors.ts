import type { RootState } from "@/redux/store";

export const selectComplianceLoading = (state: RootState) => state.compliance?.loading ?? false;
export const selectComplianceError = (state: RootState) => state.compliance?.error ?? null;
export const selectComplianceKPIs = (state: RootState) => state.compliance?.data?.kpis ?? [];
export const selectComplianceSummary = (state: RootState) => state.compliance?.data?.summary ?? {};
export const selectComplianceTrend = (state: RootState) => state.compliance?.data?.trend ?? [];
export const selectComplianceRisksByCategory = (state: RootState) => state.compliance?.data?.risksByCategory ?? [];
export const selectComplianceLastUpdated = (state: RootState) => state.compliance?.data?.lastUpdated ?? null;

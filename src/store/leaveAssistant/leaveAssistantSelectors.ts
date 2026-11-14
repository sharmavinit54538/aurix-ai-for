import type { RootState } from "@/redux/store";

export const selectLeaveAssistantLoading = (state: RootState) => state.leaveAssistant?.loading ?? false;
export const selectLeaveAssistantError = (state: RootState) => state.leaveAssistant?.error ?? null;
export const selectLeaveAssistantKPIs = (state: RootState) => state.leaveAssistant?.data?.kpis ?? [];
export const selectLeaveAssistantSummary = (state: RootState) => state.leaveAssistant?.data?.summary ?? {};
export const selectLeaveAssistantForecast = (state: RootState) => state.leaveAssistant?.data?.forecast ?? [];
export const selectLeaveAssistantDistribution = (state: RootState) => state.leaveAssistant?.data?.distribution ?? [];
export const selectLeaveAssistantLastUpdated = (state: RootState) => state.leaveAssistant?.data?.lastUpdated ?? null;

import type { RootState } from "@/redux/store";

export const selectEmployeeHealthLoading = (state: RootState) => state.employeeHealth?.loading ?? false;
export const selectEmployeeHealthError = (state: RootState) => state.employeeHealth?.error ?? null;
export const selectEmployeeHealthKPIs = (state: RootState) => state.employeeHealth?.data?.kpis ?? [];
export const selectEmployeeHealthSummary = (state: RootState) => state.employeeHealth?.data?.summary ?? {};
export const selectEmployeeHealthBurnoutTrend = (state: RootState) => state.employeeHealth?.data?.burnoutTrend ?? [];
export const selectEmployeeHealthOvertimeByTeam = (state: RootState) => state.employeeHealth?.data?.overtimeByTeam ?? [];
export const selectEmployeeHealthLastUpdated = (state: RootState) => state.employeeHealth?.data?.lastUpdated ?? null;

/**
 * Statutory Compliance API Service (India Context).
 *
 * All rates, ceilings, state PT slabs, and tax computations are authoritative backend responses.
 */

import apiInstance from "@/api/apiInstance";
import type {
  StatutoryConfig,
  StatutoryPeriodSummary,
  StatutoryComponent,
} from "../types/statutory";

export const statutoryApi = {
  /**
   * Fetch government statutory configuration rules from backend.
   */
  async getStatutoryConfig(): Promise<StatutoryConfig> {
    const res = await apiInstance.get<{
      success: boolean;
      data: StatutoryConfig;
    }>("/api/v2/payroll/statutory/config", {
      headers: { "Cache-Control": "no-store" },
    });
    return res.data.data;
  },

  /**
   * Fetch statutory deduction summary for a payroll period.
   */
  async getStatutorySummary(
    periodId?: string,
    component?: StatutoryComponent
  ): Promise<StatutoryPeriodSummary> {
    const res = await apiInstance.get<{
      success: boolean;
      data: StatutoryPeriodSummary;
    }>("/api/v2/payroll/statutory/summary", {
      params: { periodId, component },
      headers: { "Cache-Control": "no-store" },
    });
    return res.data.data;
  },

  /**
   * Request backend generation of official statutory filing reports (e.g. PF ECR text file, ESI return).
   */
  async requestStatutoryReport(
    component: StatutoryComponent,
    periodId: string,
    format: "csv" | "txt" | "xlsx"
  ): Promise<Blob> {
    const res = await apiInstance.post(
      `/api/v2/payroll/statutory/reports/${component}`,
      { periodId, format },
      {
        responseType: "blob",
        headers: { "Cache-Control": "no-store" },
      }
    );
    return res.data as Blob;
  },
};

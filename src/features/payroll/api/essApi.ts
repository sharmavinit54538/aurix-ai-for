/**
 * Employee Self-Service (ESS) Payroll API Service.
 * Ensures strict security: employees can only fetch their own payroll, payslips, and tax declarations.
 */

import apiInstance from "@/api/apiInstance";
import type { EmployeeSelfServiceData, ProvisionSlipRecord } from "../types/ess";

export interface MyPayslipItem {
  id: string;
  runId: string;
  periodName: string;
  payDate?: string | null;
  grossAmountFormatted: string;
  netPayFormatted: string;
  status: string;
  downloadUrl?: string;
}

export const essApi = {
  /**
   * Fetch current user's personal payroll summary (strict self-access).
   */
  async getMyPayrollDashboard(): Promise<EmployeeSelfServiceData> {
    const res = await apiInstance.get<{
      success: boolean;
      data: EmployeeSelfServiceData;
    }>("/api/v2/payroll/employee/dashboard", {
      headers: { "Cache-Control": "no-store" },
    });
    return res.data.data;
  },

  /**
   * List personal payslip history for current employee.
   */
  async getMyPayslips(params?: {
    page?: number;
    limit?: number;
  }): Promise<{ items: MyPayslipItem[]; total: number }> {
    const res = await apiInstance.get<{
      success: boolean;
      data: { items: MyPayslipItem[]; total: number };
    }>("/api/v2/payroll/my-payslips", {
      params,
      headers: { "Cache-Control": "no-store" },
    });
    return res.data.data;
  },

  /**
   * Fetch personal provisional payslips (if supported by backend).
   */
  async getMyProvisionSlips(): Promise<ProvisionSlipRecord[]> {
    const res = await apiInstance.get<{
      success: boolean;
      data: ProvisionSlipRecord[];
    }>("/api/v2/payroll/employee/provision-slips", {
      headers: { "Cache-Control": "no-store" },
    });
    return res.data.data || [];
  },

  /**
   * Download own payslip PDF.
   */
  async downloadMyPayslip(runId: string): Promise<Blob> {
    const res = await apiInstance.get(
      `/api/v2/payroll/my-payslips/${runId}/download`,
      {
        responseType: "blob",
        headers: { "Cache-Control": "no-store" },
      }
    );
    return res.data as Blob;
  },
};

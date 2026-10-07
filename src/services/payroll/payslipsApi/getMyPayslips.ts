import apiInstance from "@/api/apiInstance";
import { extractData } from "../utils";
import type { PayslipHistoryItem } from "../types";
import { requestWithFallback } from "../utils";

/**
 * Fetch current user's payslips for self-service portal.
 * GET /api/v2/payroll/my-payslips
 */
export async function getMyPayslips(
  params?: { page?: number; limit?: number },
): Promise<{ items: PayslipHistoryItem[]; total: number }> {
  const queryParams: Record<string, unknown> = {};
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;

  return requestWithFallback(
    async () => {
      const res = await apiInstance.get("/api/v2/payroll/my-payslips", {
        params: queryParams,
        headers: { "Cache-Control": "no-cache" },
        skipCache: true,
      });
      const data = extractData<Record<string, unknown>>(res);
      const rawItems: Record<string, unknown>[] = Array.isArray(data)
        ? (data as Record<string, unknown>[])
        : Array.isArray(data?.items)
          ? (data.items as Record<string, unknown>[])
          : Array.isArray(data?.records)
            ? (data.records as Record<string, unknown>[])
            : [];
      return {
        items: rawItems.map((r: Record<string, unknown>) => ({
          id:
            (typeof r.id === "string" ? r.id : typeof r.payslipId === "string" ? r.payslipId : null) ||
            `${(typeof r.runId === "string" ? r.runId : typeof r.run_id === "string" ? r.run_id : null) || ""}_me`,
          runId: typeof r.runId === "string" ? r.runId : typeof r.run_id === "string" ? r.run_id : null,
          employeeId:
            typeof r.employeeId === "string" ? r.employeeId : typeof r.employee_id === "string" ? r.employee_id : null,
          periodName:
            typeof r.periodName === "string" ? r.periodName : typeof r.period_name === "string" ? r.period_name : null,
          payslipNumber:
            typeof r.payslipNumber === "string"
              ? r.payslipNumber
              : typeof r.payslip_number === "string"
                ? r.payslip_number
                : null,
          netPay: r.netPay != null ? Number(r.netPay) : null,
          grossEarnings: r.grossEarnings != null ? Number(r.grossEarnings) : null,
          totalDeductions: r.totalDeductions != null ? Number(r.totalDeductions) : null,
          status: typeof r.status === "string" ? r.status : "—",
          isFinalized: Boolean(r.isFinalized ?? false),
          finalizedAt:
            typeof r.finalizedAt === "string" ? r.finalizedAt : typeof r.finalized_at === "string" ? r.finalized_at : null,
          paymentDate:
            typeof r.paymentDate === "string" ? r.paymentDate : typeof r.payment_date === "string" ? r.payment_date : null,
          hasDocument: Boolean(r.hasDocument || r.pdfUrl || r.downloadUrl),
        })),
        total: typeof data?.total === "number" ? data.total : rawItems.length,
      };
    },
    async () => {
      const fbRes = await apiInstance.get("/payroll/my-payslips", {
        params: queryParams,
        headers: { "Cache-Control": "no-cache" },
        skipCache: true,
      });
      const fbData = extractData<Record<string, unknown>>(fbRes);
      const fbItems: Record<string, unknown>[] = Array.isArray(fbData)
        ? (fbData as Record<string, unknown>[])
        : Array.isArray(fbData?.items)
          ? (fbData.items as Record<string, unknown>[])
          : Array.isArray(fbData?.records)
            ? (fbData.records as Record<string, unknown>[])
            : [];
      return {
        items: fbItems.map((r: Record<string, unknown>) => ({
          id:
            (typeof r.id === "string" ? r.id : typeof r.payslipId === "string" ? r.payslipId : null) ||
            `${(typeof r.runId === "string" ? r.runId : typeof r.run_id === "string" ? r.run_id : null) || ""}_me`,
          runId: typeof r.runId === "string" ? r.runId : typeof r.run_id === "string" ? r.run_id : null,
          employeeId:
            typeof r.employeeId === "string" ? r.employeeId : typeof r.employee_id === "string" ? r.employee_id : null,
          periodName:
            typeof r.periodName === "string" ? r.periodName : typeof r.period_name === "string" ? r.period_name : null,
          payslipNumber:
            typeof r.payslipNumber === "string"
              ? r.payslipNumber
              : typeof r.payslip_number === "string"
                ? r.payslip_number
                : null,
          netPay: r.netPay != null ? Number(r.netPay) : null,
          grossEarnings: r.grossEarnings != null ? Number(r.grossEarnings) : null,
          totalDeductions: r.totalDeductions != null ? Number(r.totalDeductions) : null,
          status: typeof r.status === "string" ? r.status : "—",
          isFinalized: Boolean(r.isFinalized ?? false),
          finalizedAt:
            typeof r.finalizedAt === "string" ? r.finalizedAt : typeof r.finalized_at === "string" ? r.finalized_at : null,
          paymentDate:
            typeof r.paymentDate === "string" ? r.paymentDate : typeof r.payment_date === "string" ? r.payment_date : null,
          hasDocument: Boolean(r.hasDocument || r.pdfUrl || r.downloadUrl),
        })),
        total: typeof fbData?.total === "number" ? fbData.total : fbItems.length,
      };
    }
  );
}
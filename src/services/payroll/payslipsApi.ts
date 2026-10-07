import apiInstance from "@/api/apiInstance";
import axios from "axios";
import { extractData } from "./utils";
import { normalizePayrollPayslipData } from "./normalizers";
import type {
  PayrollPayslipData,
  GeneratePayslipsPayload,
  GeneratePayslipsResponse,
  PayslipHistoryItem,
  PayrollPreviewEmployee,
  PayrollFinalizationData,
} from "./types";
import { getRunEmployeeDetail } from "./previewApi";
import { getPayrollFinalization } from "./finalizationApi";
import { generateIdempotencyKey } from "@/features/payroll/utils/idempotency";
import { requestWithFallback } from "./utils";
import { PayrollNotFoundError } from "./errors";

/**
 * Fetch official final payslip data for a specific employee in a finalized run.
 * Primary: GET /api/v2/payroll/runs/{runId}/employees/{employeeId}/payslip
 * Fallback: Synthesizes authoritative calculation & finalization metadata.
 */
export async function getPayslip(runId: string, employeeId: string): Promise<PayrollPayslipData> {
  const requestConfig = {
    headers: { "Cache-Control": "no-cache" },
    skipCache: true,
  };

  // Primary: GET /api/v2/payroll/runs/{runId}/employees/{employeeId}/payslip
  try {
    const res = await apiInstance.get(
      `/api/v2/payroll/runs/${runId}/employees/${employeeId}/payslip`,
      requestConfig,
    );
    const data = extractData(res);
    if (data && typeof data === "object") {
      return normalizePayrollPayslipData(runId, employeeId, data);
    }
  } catch (err: unknown) {
    if (!axios.isAxiosError(err) || err.response?.status !== 404) {
      throw err;
    }
  }

  // Fallback 1: GET /api/v2/payroll/payslips/{runId}/{employeeId}
  try {
    const res1 = await apiInstance.get(
      `/api/v2/payroll/payslips/${runId}/${employeeId}`,
      requestConfig,
    );
    const data1 = extractData(res1);
    if (data1 && typeof data1 === "object") {
      return normalizePayrollPayslipData(runId, employeeId, data1);
    }
  } catch (err: unknown) {
    if (!axios.isAxiosError(err) || err.response?.status !== 404) {
      throw err;
    }
  }

  // Fallback 2: Retrieve employee detail and run finalization status from backend
  const [empData, finalData] = await Promise.all([
    getRunEmployeeDetail(runId, employeeId),
    getPayrollFinalization(runId).catch(() => null),
  ]);

  if (!empData) {
    throw new PayrollNotFoundError();
  }

  return normalizePayrollPayslipData(runId, employeeId, {}, empData, finalData);
}

/**
 * Fetch payslip by unique payslip ID or reference.
 * Canonical in OpenAPI: GET /api/v1/payroll/payslips/{payslip_id}
 */
export async function getPayslipById(payslipId: string): Promise<PayrollPayslipData> {
  return requestWithFallback(
    async () => {
      const res = await apiInstance.get(`/api/v1/payroll/payslips/${payslipId}`, {
        headers: { "Cache-Control": "no-cache" },
        skipCache: true,
      });
      const data = extractData<Record<string, unknown>>(res);
      const runId = typeof data?.runId === "string" ? data.runId : "";
      const employeeId = typeof data?.employeeId === "string" ? data.employeeId : "";
      return normalizePayrollPayslipData(runId, employeeId, data);
    },
    async () => {
      const fbRes = await apiInstance.get(`/payroll/payslips/${payslipId}`, {
        headers: { "Cache-Control": "no-cache" },
        skipCache: true,
      });
      const fbData = extractData<Record<string, unknown>>(fbRes);
      const fbRunId = typeof fbData?.runId === "string" ? fbData.runId : "";
      const fbEmpId = typeof fbData?.employeeId === "string" ? fbData.employeeId : "";
      return normalizePayrollPayslipData(fbRunId, fbEmpId, fbData);
    }
  );
}

/**
 * Download the official backend generated payslip document as a Blob.
 * GET /api/v2/payroll/runs/{runId}/employees/{employeeId}/payslip/download
 */
export async function downloadPayslip(runId: string, employeeId: string): Promise<Blob> {
  return requestWithFallback(
    async () => {
      const res = await apiInstance.get<Blob>(
        `/api/v2/payroll/runs/${runId}/employees/${employeeId}/payslip/download`,
        {
          responseType: "blob",
          headers: { "Cache-Control": "no-cache" },
        },
      );
      return res.data;
    },
    async () => {
      const fbRes = await apiInstance.get<Blob>(
        `/payroll/runs/${runId}/employees/${employeeId}/payslip/download`,
        { responseType: "blob" },
      );
      return fbRes.data;
    }
  );
}

/**
 * Generate payslips batch or single for a finalized run via backend.
 * POST /api/v2/payroll/runs/{runId}/payslips/generate
 */
export async function generatePayslips(
  runId: string,
  payload?: GeneratePayslipsPayload,
): Promise<GeneratePayslipsResponse> {
  const headers = {
    "Idempotency-Key": generateIdempotencyKey(),
    "Cache-Control": "no-cache",
  };

  return requestWithFallback(
    async () => {
      const res = await apiInstance.post(
        `/api/v2/payroll/runs/${runId}/payslips/generate`,
        payload ?? {},
        { headers },
      );
      const data = extractData<Record<string, unknown>>(res);
      return {
        success: Boolean(data?.success ?? false),
        message: typeof data?.message === "string" ? data.message : "Final payslips generated successfully.",
        generatedCount:
          typeof data?.generatedCount === "number"
            ? data.generatedCount
            : typeof data?.count === "number"
              ? data.count
              : undefined,
        totalCount: typeof data?.totalCount === "number" ? data.totalCount : undefined,
        ...data,
      };
    },
    async () => {
      const fbRes = await apiInstance.post(
        `/payroll/runs/${runId}/payslips/generate`,
        payload ?? {},
        { headers },
      );
      const fbData = extractData<Record<string, unknown>>(fbRes);
      return {
        success: Boolean(fbData?.success ?? false),
        message: typeof fbData?.message === "string" ? fbData.message : "Final payslips generated successfully.",
        ...fbData,
      };
    }
  );
}

/**
 * Fetch employee payslip history.
 * GET /api/v2/payroll/employees/{employeeId}/payslips
 */
export async function getEmployeePayslipHistory(
  employeeId: string,
  params?: { page?: number; limit?: number },
): Promise<{ items: PayslipHistoryItem[]; total: number }> {
  const queryParams: Record<string, unknown> = {};
  if (params?.page) queryParams.page = params.page;
  if (params?.limit) queryParams.limit = params.limit;

  return requestWithFallback(
    async () => {
      const res = await apiInstance.get(`/api/v2/payroll/employees/${employeeId}/payslips`, {
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
            `${(typeof r.runId === "string" ? r.runId : typeof r.run_id === "string" ? r.run_id : null) || ""}_${employeeId}`,
          runId: typeof r.runId === "string" ? r.runId : typeof r.run_id === "string" ? r.run_id : null,
          employeeId:
            (typeof r.employeeId === "string" ? r.employeeId : typeof r.employee_id === "string" ? r.employee_id : null) ||
            employeeId,
          employeeName: typeof r.employeeName === "string" ? r.employeeName : typeof r.name === "string" ? r.name : null,
          department: typeof r.department === "string" ? r.department : null,
          periodName:
            typeof r.periodName === "string" ? r.periodName : typeof r.period_name === "string" ? r.period_name : null,
          financialYear:
            typeof r.financialYear === "string"
              ? r.financialYear
              : typeof r.financial_year === "string"
                ? r.financial_year
                : null,
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
      const fbRes = await apiInstance.get(`/payroll/employees/${employeeId}/payslips`, {
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
            `${(typeof r.runId === "string" ? r.runId : typeof r.run_id === "string" ? r.run_id : null) || ""}_${employeeId}`,
          runId: typeof r.runId === "string" ? r.runId : typeof r.run_id === "string" ? r.run_id : null,
          employeeId:
            (typeof r.employeeId === "string" ? r.employeeId : typeof r.employee_id === "string" ? r.employee_id : null) ||
            employeeId,
          employeeName: typeof r.employeeName === "string" ? r.employeeName : typeof r.name === "string" ? r.name : null,
          department: typeof r.department === "string" ? r.department : null,
          periodName:
            typeof r.periodName === "string" ? r.periodName : typeof r.period_name === "string" ? r.period_name : null,
          financialYear:
            typeof r.financialYear === "string"
              ? r.financialYear
              : typeof r.financial_year === "string"
                ? r.financial_year
                : null,
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
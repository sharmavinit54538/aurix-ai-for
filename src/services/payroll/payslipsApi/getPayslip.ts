import apiInstance from "@/api/apiInstance";
import axios from "axios";
import { extractData } from "../utils";
import { normalizePayrollPayslipData } from "../normalizers";
import type {
  PayrollPayslipData,
  PayrollPreviewEmployee,
  PayrollFinalizationData,
} from "../types";
import { getRunEmployeeDetail } from "../previewApi";
import { getPayrollFinalization } from "../finalizationApi";
import { PayrollNotFoundError } from "../errors";

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
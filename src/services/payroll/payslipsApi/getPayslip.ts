import apiInstance from "@/api/apiInstance";
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
    if (err && typeof err === "object" && "response" in err) {
      const axiosErr = err as { response?: { status?: number } };
      if (axiosErr.response?.status !== 404) {
        throw err;
      }
    } else {
      throw err;
    }
  }

  // Fallback: Retrieve employee detail and run finalization status from backend
  const [empData, finalData] = await Promise.all([
    getRunEmployeeDetail(runId, employeeId),
    getPayrollFinalization(runId).catch(() => null),
  ]);

  if (!empData) {
    throw new PayrollNotFoundError();
  }

  return normalizePayrollPayslipData(runId, employeeId, {}, empData, finalData);
}
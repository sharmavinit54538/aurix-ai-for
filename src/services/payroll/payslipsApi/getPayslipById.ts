import apiInstance from "@/api/apiInstance";
import { extractData } from "../utils";
import { normalizePayrollPayslipData } from "../normalizers";
import type { PayrollPayslipData } from "../types";
import { requestWithFallback } from "../utils";

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
import apiInstance from "@/api/apiInstance";
import { requestWithFallback } from "../utils";

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
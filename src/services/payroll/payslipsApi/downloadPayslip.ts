import apiInstance from "@/api/apiInstance";
import { requestWithFallback, getDownloadFilename, parseContentType } from "../utils";

/**
 * Download the official backend generated payslip document as a Blob with filename.
 * GET /api/v2/payroll/runs/{runId}/employees/{employeeId}/payslip/download
 */
export async function downloadPayslip(
  runId: string,
  employeeId: string
): Promise<{ blob: Blob; filename: string; mimeType: string }> {
  const primaryFn = async () => {
    const res = await apiInstance.get<Blob>(
      `/api/v2/payroll/runs/${runId}/employees/${employeeId}/payslip/download`,
      {
        responseType: "blob",
        headers: { "Cache-Control": "no-cache" },
      },
    );
    const contentDisposition = res.headers["content-disposition"];
    const contentType = res.headers["content-type"];
    const filename = getDownloadFilename(contentDisposition, contentType, `payslip-${runId}-${employeeId}`);
    const mimeType = parseContentType(contentType)?.mimeType || "application/octet-stream";
    return { blob: res.data, filename, mimeType };
  };

  const fallbackFn = async () => {
    const res = await apiInstance.get<Blob>(
      `/payroll/runs/${runId}/employees/${employeeId}/payslip/download`,
      { responseType: "blob" },
    );
    const contentDisposition = res.headers["content-disposition"];
    const contentType = res.headers["content-type"];
    const filename = getDownloadFilename(contentDisposition, contentType, `payslip-${runId}-${employeeId}`);
    const mimeType = parseContentType(contentType)?.mimeType || "application/octet-stream";
    return { blob: res.data, filename, mimeType };
  };

  return requestWithFallback(primaryFn, fallbackFn);
}
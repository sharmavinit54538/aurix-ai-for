/**
 * Full & Final Settlement (F&F) API Service.
 * Backend owns all severance calculations, encashment, recoveries, and settlement finalization.
 */

import apiInstance from "@/api/apiInstance";
import { generateIdempotencyKey } from "../utils/idempotency";
import { getDownloadFilename, parseContentType } from "@/services/payroll/utils";
import type { FnfRecord, FnfExitDetails } from "../types/fnf";

export interface InitiateFnfPayload {
  employeeId: string;
  exitDetails: FnfExitDetails;
  remarks?: string;
}

export const fnfApi = {
  async getFnfRecords(params?: {
    status?: string;
    department?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: FnfRecord[]; total: number; page: number; limit: number }> {
    const res = await apiInstance.get<{
      success: boolean;
      data: { items: FnfRecord[]; total: number; page: number; limit: number };
    }>("/api/v2/payroll/full-and-final", {
      params,
      headers: { "Cache-Control": "no-store" },
    });
    return res.data.data;
  },

  async getFnfDetail(fnfId: string): Promise<FnfRecord> {
    const res = await apiInstance.get<{
      success: boolean;
      data: FnfRecord;
    }>(`/api/v2/payroll/full-and-final/${fnfId}`, {
      headers: { "Cache-Control": "no-store" },
    });
    return res.data.data;
  },

  async initiateFnf(payload: InitiateFnfPayload): Promise<FnfRecord> {
    const res = await apiInstance.post<{
      success: boolean;
      data: FnfRecord;
    }>("/api/v2/payroll/full-and-final", payload, {
      headers: {
        "Idempotency-Key": generateIdempotencyKey(),
        "Cache-Control": "no-store",
      },
    });
    return res.data.data;
  },

  async approveFnf(fnfId: string, remarks: string): Promise<FnfRecord> {
    const res = await apiInstance.post<{
      success: boolean;
      data: FnfRecord;
    }>(
      `/api/v2/payroll/full-and-final/${fnfId}/approve`,
      { remarks },
      {
        headers: {
          "Idempotency-Key": generateIdempotencyKey(),
          "Cache-Control": "no-store",
        },
      }
    );
    return res.data.data;
  },

  async rejectFnf(fnfId: string, reason: string): Promise<FnfRecord> {
    const res = await apiInstance.post<{
      success: boolean;
      data: FnfRecord;
    }>(
      `/api/v2/payroll/full-and-final/${fnfId}/reject`,
      { reason },
      {
        headers: {
          "Idempotency-Key": generateIdempotencyKey(),
          "Cache-Control": "no-store",
        },
      }
    );
    return res.data.data;
  },

  async finalizeFnf(
    fnfId: string,
    notes?: string
  ): Promise<FnfRecord> {
    const res = await apiInstance.post<{
      success: boolean;
      data: FnfRecord;
    }>(
      `/api/v2/payroll/full-and-final/${fnfId}/finalize`,
      { notes },
      {
        headers: {
          "Idempotency-Key": generateIdempotencyKey(),
          "Cache-Control": "no-store",
        },
      }
    );
    return res.data.data;
  },

  async downloadFnfStatement(fnfId: string): Promise<{ blob: Blob; filename: string; mimeType: string }> {
    const res = await apiInstance.get(
      `/api/v2/payroll/full-and-final/${fnfId}/statement/download`,
      {
        responseType: "blob",
        headers: { "Cache-Control": "no-store" },
      }
    );
    const contentDisposition = res.headers["content-disposition"];
    const contentType = res.headers["content-type"];
    const filename = getDownloadFilename(contentDisposition, contentType, `fnf-statement-${fnfId}`);
    const mimeType = parseContentType(contentType)?.mimeType || "application/octet-stream";
    return { blob: res.data as Blob, filename, mimeType };
  },
};

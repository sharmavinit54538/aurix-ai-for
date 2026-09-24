/**
 * Variable Payroll Inputs API Service.
 * Handles one-time earnings, overtime, incentives, commissions, LOP and adjustments.
 */

import apiInstance from "@/api/apiInstance";
import { generateIdempotencyKey } from "../utils/idempotency";
import type {
  VariablePayrollInput,
  VariableInputType,
  BulkVariableInputPreviewResult,
} from "../types/variableInputs";

export interface CreateVariableInputPayload {
  employeeId: string;
  periodId: string;
  type: VariableInputType;
  amountPaise: number;
  units?: number;
  ratePerUnitPaise?: number;
  description: string;
}

export const variableInputsApi = {
  async getVariableInputs(params?: {
    periodId?: string;
    type?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ items: VariablePayrollInput[]; total: number; page: number; limit: number }> {
    const res = await apiInstance.get<{
      success: boolean;
      data: { items: VariablePayrollInput[]; total: number; page: number; limit: number };
    }>("/api/v2/payroll/variable-inputs", {
      params,
      headers: { "Cache-Control": "no-store" },
    });
    return res.data.data;
  },

  async createVariableInput(payload: CreateVariableInputPayload): Promise<VariablePayrollInput> {
    const res = await apiInstance.post<{
      success: boolean;
      data: VariablePayrollInput;
    }>("/api/v2/payroll/variable-inputs", payload, {
      headers: {
        "Idempotency-Key": generateIdempotencyKey(),
        "Cache-Control": "no-store",
      },
    });
    return res.data.data;
  },

  async approveVariableInput(id: string, remarks?: string): Promise<VariablePayrollInput> {
    const res = await apiInstance.post<{
      success: boolean;
      data: VariablePayrollInput;
    }>(
      `/api/v2/payroll/variable-inputs/${id}/approve`,
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

  async rejectVariableInput(id: string, reason: string): Promise<VariablePayrollInput> {
    const res = await apiInstance.post<{
      success: boolean;
      data: VariablePayrollInput;
    }>(
      `/api/v2/payroll/variable-inputs/${id}/reject`,
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

  async previewBulkVariableInputs(file: File): Promise<BulkVariableInputPreviewResult> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiInstance.post<{
      success: boolean;
      data: BulkVariableInputPreviewResult;
    }>("/api/v2/payroll/variable-inputs/bulk-preview", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Cache-Control": "no-store",
      },
    });
    return res.data.data;
  },

  async applyBulkVariableInputs(
    previewToken: string
  ): Promise<{ appliedCount: number; message: string }> {
    const res = await apiInstance.post<{
      success: boolean;
      data: { appliedCount: number; message: string };
    }>(
      "/api/v2/payroll/variable-inputs/bulk-apply",
      { previewToken },
      {
        headers: {
          "Idempotency-Key": generateIdempotencyKey(),
          "Cache-Control": "no-store",
        },
      }
    );
    return res.data.data;
  },
};

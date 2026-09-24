/**
 * Salary Structure & Compensation Management API.
 * Handles Pay Component Master, Salary Structure Templates, Employee Compensation,
 * Revisions with Maker-Checker, and Bulk Compensation Import.
 */

import apiInstance from "@/api/apiInstance";
import { generateIdempotencyKey } from "../utils/idempotency";
import type {
  PayComponent,
  SalaryStructureTemplate,
  EmployeeCompensation,
  CompensationRevisionRecord,
  BulkCompensationPreviewResult,
} from "../types/compensation";

export interface CreatePayComponentPayload {
  code: string;
  name: string;
  type: "earning" | "deduction" | "employer_contribution";
  taxable: boolean;
  statutory: boolean;
  calculationMethod: "flat" | "percentage_of_basic" | "percentage_of_ctc" | "formula";
  defaultPercentage?: number;
  description?: string;
  effectiveDate: string;
}

export interface CreateSalaryStructurePayload {
  code: string;
  name: string;
  description?: string;
  effectiveDate: string;
  components: Array<{
    componentId: string;
    calculationMethod: string;
    percentageOrAmount?: number;
    formula?: string;
    isMandatory?: boolean;
  }>;
}

export interface ProposeRevisionPayload {
  newCtcAnnualPaise: number;
  effectiveDate: string;
  reason: string;
  notes?: string;
}

export const compensationApi = {
  // ── Pay Component Master ──────────────────────────────────────────
  async getPayComponents(): Promise<PayComponent[]> {
    const res = await apiInstance.get<{ success: boolean; data: PayComponent[] }>(
      "/api/v2/payroll/pay-components",
      { headers: { "Cache-Control": "no-store" } }
    );
    return res.data.data || [];
  },

  async createPayComponent(payload: CreatePayComponentPayload): Promise<PayComponent> {
    const res = await apiInstance.post<{ success: boolean; data: PayComponent }>(
      "/api/v2/payroll/pay-components",
      payload,
      {
        headers: {
          "Idempotency-Key": generateIdempotencyKey(),
          "Cache-Control": "no-store",
        },
      }
    );
    return res.data.data;
  },

  // ── Salary Structure Templates ────────────────────────────────────
  async getSalaryStructures(): Promise<SalaryStructureTemplate[]> {
    const res = await apiInstance.get<{
      success: boolean;
      data: SalaryStructureTemplate[];
    }>("/api/v2/payroll/salary-structures", {
      headers: { "Cache-Control": "no-store" },
    });
    return res.data.data || [];
  },

  async createSalaryStructure(
    payload: CreateSalaryStructurePayload
  ): Promise<SalaryStructureTemplate> {
    const res = await apiInstance.post<{
      success: boolean;
      data: SalaryStructureTemplate[];
    }>("/api/v2/payroll/salary-structures", payload, {
      headers: {
        "Idempotency-Key": generateIdempotencyKey(),
        "Cache-Control": "no-store",
      },
    });
    return (res.data.data as any) || res.data;
  },

  // ── Employee Compensation & Revisions ─────────────────────────────
  async getEmployeeCompensations(params?: {
    page?: number;
    limit?: number;
    department?: string;
    search?: string;
  }): Promise<{ items: EmployeeCompensation[]; total: number; page: number; limit: number }> {
    const res = await apiInstance.get<{
      success: boolean;
      data: { items: EmployeeCompensation[]; total: number; page: number; limit: number };
    }>("/api/v2/payroll/compensations", {
      params,
      headers: { "Cache-Control": "no-store" },
    });
    return res.data.data;
  },

  async getEmployeeCompensationDetail(employeeId: string): Promise<EmployeeCompensation> {
    const res = await apiInstance.get<{
      success: boolean;
      data: EmployeeCompensation;
    }>(`/api/v2/payroll/employees/${employeeId}/compensation`, {
      headers: { "Cache-Control": "no-store" },
    });
    return res.data.data;
  },

  async proposeCompensationRevision(
    employeeId: string,
    payload: ProposeRevisionPayload
  ): Promise<CompensationRevisionRecord> {
    const res = await apiInstance.post<{
      success: boolean;
      data: CompensationRevisionRecord;
    }>(
      `/api/v2/payroll/employees/${employeeId}/compensation/revisions`,
      payload,
      {
        headers: {
          "Idempotency-Key": generateIdempotencyKey(),
          "Cache-Control": "no-store",
        },
      }
    );
    return res.data.data;
  },

  async approveCompensationRevision(
    revisionId: string,
    remarks: string
  ): Promise<CompensationRevisionRecord> {
    const res = await apiInstance.post<{
      success: boolean;
      data: CompensationRevisionRecord;
    }>(
      `/api/v2/payroll/compensation/revisions/${revisionId}/approve`,
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

  async rejectCompensationRevision(
    revisionId: string,
    reason: string
  ): Promise<CompensationRevisionRecord> {
    const res = await apiInstance.post<{
      success: boolean;
      data: CompensationRevisionRecord;
    }>(
      `/api/v2/payroll/compensation/revisions/${revisionId}/reject`,
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

  // ── Bulk Compensation Import ──────────────────────────────────────
  async previewBulkCompensation(file: File): Promise<BulkCompensationPreviewResult> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiInstance.post<{
      success: boolean;
      data: BulkCompensationPreviewResult;
    }>("/api/v2/payroll/compensation/bulk-import/preview", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Cache-Control": "no-store",
      },
    });
    return res.data.data;
  },

  async applyBulkCompensation(
    previewToken: string
  ): Promise<{ appliedCount: number; message: string }> {
    const res = await apiInstance.post<{
      success: boolean;
      data: { appliedCount: number; message: string };
    }>(
      "/api/v2/payroll/compensation/bulk-import/apply",
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

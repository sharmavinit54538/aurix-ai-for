import { apiInstance } from "@/api";
import { payrollApi, type PayslipHistoryItem } from "./payrollApi";

export type EmployeeDocumentStatus = "PENDING" | "VERIFIED" | "REJECTED" | string;

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  categoryId: string | null;
  category: string | null;
  title: string | null;
  type: string | null;
  description: string | null;
  fileName: string | null;
  fileSize: number | null;
  expiryDate: string | null;
  uploadedAt: string | null;
  status: EmployeeDocumentStatus;
  rejectionReason: string | null;
  tags: string | null;
  fileUrl?: string | null;
}

export interface DocumentCategory {
  id: string;
  name: string;
}

export interface ProvisionSlip {
  id: string;
  slipNumber: string | null;
  periodName: string | null;
  employeeName: string | null;
  provisionedAmount: number | null;
  generatedAt: string | null;
  status: string | null;
  downloadUrl: string | null;
}

/** A direct view of authentic Payroll API records for the legacy employee portal export. */
export interface SalarySlipRecord {
  id: string;
  runId: string | null;
  employeeId: string | null;
  employeeName: string | null;
  periodName: string | null;
  payslipNumber: string | null;
  grossSalary: number | null;
  deductions: number | null;
  netSalary: number | null;
  generatedDate: string | null;
  status: string;
  hasDocument: boolean;
}

export interface UploadEmployeeDocumentPayload {
  employeeId: string;
  categoryId: string;
  name: string;
  type: string;
  description?: string;
  expiryDate?: string;
  file: File;
}

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function unwrapData(value: unknown): unknown {
  if (!isRecord(value)) return value;
  if ("data" in value && value.data !== undefined) return unwrapData(value.data);
  if ("result" in value && value.result !== undefined) return unwrapData(value.result);
  return value;
}

function asList(value: unknown): UnknownRecord[] {
  const data = unwrapData(value);
  if (Array.isArray(data)) return data.filter(isRecord);
  if (!isRecord(data)) return [];

  for (const key of ["items", "records", "results"]) {
    if (Array.isArray(data[key])) return data[key].filter(isRecord);
  }
  return [];
}

function asString(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  return String(value);
}

function asNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const result = Number(value);
  return Number.isFinite(result) ? result : null;
}

function tagValue(tags: string | null, key: string): string | null {
  if (!tags) return null;
  const match = tags.match(new RegExp(`(?:^|[,;\\s])${key}:([^,;\\s]+)`, "i"));
  return match?.[1]?.replace(/[-_]/g, " ") ?? null;
}

function mapEmployeeDocument(data: UnknownRecord): EmployeeDocument {
  const tags = asString(data.tags);
  const categoryValue = isRecord(data.category) ? data.category.name : data.category_name;
  const typeValue = data.document_type ?? data.type ?? tagValue(tags, "type");
  const fileUrl = asString(data.document_url ?? data.file_path ?? data.file_url ?? data.download_url);

  return {
    id: String(data.id ?? ""),
    employeeId: String(data.employee_id ?? data.employeeId ?? ""),
    categoryId: asString(data.category_id ?? data.categoryId),
    category: asString(categoryValue ?? tagValue(tags, "category")),
    title: asString(data.title ?? data.name),
    type: asString(typeValue),
    description: asString(data.description),
    fileName: asString(data.file_name ?? data.fileName),
    fileSize: asNumber(data.file_size ?? data.fileSize),
    expiryDate: asString(data.expiry_date ?? data.expiryDate),
    uploadedAt: asString(data.created_at ?? data.uploaded_at ?? data.uploadedAt),
    status: String(data.status ?? data.status_field ?? "").toUpperCase(),
    rejectionReason: asString(
      data.rejection_reason ?? data.rejectionReason ?? data.review_comment ?? data.comments,
    ),
    tags,
    fileUrl,
  };
}

function mapProvisionSlip(data: UnknownRecord): ProvisionSlip {
  return {
    id: String(data.id ?? data.provision_slip_id ?? ""),
    slipNumber: asString(data.provision_slip_number ?? data.slip_number ?? data.reference_number),
    periodName: asString(data.period_name ?? data.periodName ?? data.pay_period),
    employeeName: asString(data.employee_name ?? data.employeeName),
    provisionedAmount: asNumber(
      data.provisioned_amount ?? data.provisionAmount ?? data.amount,
    ),
    generatedAt: asString(data.generated_at ?? data.generatedAt ?? data.created_at),
    status: asString(data.status),
    downloadUrl: asString(data.download_url ?? data.downloadUrl ?? data.document_url),
  };
}

export const myDocumentsApi = {
  /**
   * Uses the authenticated request token and scopes the query to the signed-in employee.
   * The API must also enforce employee ownership server-side.
   */
  async listMyDocuments(employeeId: string, search?: string): Promise<EmployeeDocument[]> {
    const response = await apiInstance.get("/documents/employees", {
      params: {
        employee_id: employeeId,
        search: search?.trim() || undefined,
        page: 1,
        limit: 100,
      },
      headers: { "Cache-Control": "no-cache" },
      skipCache: true,
    });

    // This is a second safety guard in the client; it is not a substitute for API authorization.
    return asList(response.data)
      .map(mapEmployeeDocument)
      .filter((document) => document.id && document.employeeId === employeeId);
  },

  async listCategories(): Promise<DocumentCategory[]> {
    const response = await apiInstance.get("/documents/categories", {
      headers: { "Cache-Control": "no-cache" },
      skipCache: true,
    });
    return asList(response.data)
      .map((cat) => ({
        id: String(cat.id ?? cat.category_id ?? ""),
        name: String(cat.name ?? cat.title ?? ""),
      }))
      .filter((cat) => cat.id && cat.name);
  },

  async uploadMyDocument(payload: UploadEmployeeDocumentPayload): Promise<void> {
    const form = new FormData();
    form.append("file", payload.file);
    form.append("employee_id", payload.employeeId);
    form.append("category_id", payload.categoryId);
    form.append("title", payload.name);
    form.append("description", payload.description ?? "");
    form.append("expiry_date", payload.expiryDate ?? "");
    form.append("visibility", "PRIVATE");
    form.append("status_field", "PENDING");
    form.append("tags", `employee-self-service,type:${payload.type},category:${payload.categoryId}`);

    await apiInstance.post("/documents/employees", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async reuploadMyDocument(
    documentId: string,
    payload: Omit<UploadEmployeeDocumentPayload, "employeeId" | "categoryId">,
  ): Promise<void> {
    const form = new FormData();
    form.append("file", payload.file);
    form.append("title", payload.name);
    form.append("description", payload.description ?? "");
    form.append("expiry_date", payload.expiryDate ?? "");
    form.append("status_field", "PENDING");
    form.append("tags", `employee-self-service,type:${payload.type}`);

    await apiInstance.put(`/documents/employees/${documentId}`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async deleteMyDocument(documentId: string): Promise<void> {
    await apiInstance.delete(`/documents/employees/${documentId}`);
  },

  async downloadMyDocument(documentId: string): Promise<Blob> {
    const response = await apiInstance.get(`/documents/employees/${documentId}/download`, {
      responseType: "blob",
      headers: { Accept: "application/octet-stream" },
    });
    return response.data as Blob;
  },

  /** Reuses the authenticated payroll history endpoint; never synthesizes a salary-slip row. */
  async listMySalarySlips(): Promise<SalarySlipRecord[]> {
    const response = await payrollApi.getMyPayslips({ limit: 100 });
    return response.items.map((item: PayslipHistoryItem) => ({
      id: item.id,
      runId: item.runId ?? null,
      employeeId: item.employeeId ?? null,
      employeeName: item.employeeName ?? null,
      periodName: item.periodName ?? null,
      payslipNumber: item.payslipNumber ?? null,
      grossSalary: item.grossEarnings ?? null,
      deductions: item.totalDeductions ?? null,
      netSalary: item.netPay ?? null,
      generatedDate: item.finalizedAt ?? null,
      status: item.status ?? "",
      hasDocument: item.hasDocument === true,
    }));
  },

  async downloadMySalarySlip(runId: string, employeeId: string): Promise<Blob> {
    return payrollApi.downloadPayslip(runId, employeeId);
  },

  /** The payroll service scopes this resource from the authenticated session. */
  async listMyProvisionSlips(_employeeId?: string): Promise<ProvisionSlip[]> {
    const response = await apiInstance.get("/api/v2/payroll/my-provision-slips", {
      headers: { "Cache-Control": "no-cache" },
      skipCache: true,
    });
    return asList(response.data).map(mapProvisionSlip).filter((slip) => slip.id);
  },

  async downloadMyProvisionSlip(slip: ProvisionSlip): Promise<Blob> {
    if (slip.downloadUrl) {
      const response = await apiInstance.get(slip.downloadUrl, { responseType: "blob" });
      return response.data as Blob;
    }
    const response = await apiInstance.get(`/api/v2/payroll/provision-slips/${slip.id}/pdf`, {
      responseType: "blob",
    });
    return response.data as Blob;
  },
};

export function triggerFileDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export default myDocumentsApi;

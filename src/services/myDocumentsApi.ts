import { apiInstance } from "@/api";

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
    status: String(data.status ?? data.status_field ?? "PENDING").toUpperCase(),
    rejectionReason: asString(
      data.rejection_reason ?? data.rejectionReason ?? data.review_comment ?? data.comments,
    ),
    tags,
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

function addDocumentMetadata(form: FormData, payload: Omit<UploadEmployeeDocumentPayload, "file">) {
  form.append("title", payload.name);
  form.append("description", payload.description ?? "");
  form.append("expiry_date", payload.expiryDate ?? "");
  form.append("visibility", "PRIVATE");
  form.append("status_field", "PENDING");
  // The existing document schema stores employee-entered type/category metadata in tags.
  form.append("tags", `employee-self-service,type:${payload.type},category:${payload.categoryId}`);
}

export const myDocumentsApi = {
  /**
   * Uses the authenticated request token and scopes the query to the signed-in employee.
   * The API must also enforce the same ownership check server-side.
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

    // Keep an additional client-side guard; authorization is still enforced by the API.
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
      .map((category) => ({
        id: String(category.id ?? category.category_id ?? ""),
        name: String(category.name ?? category.title ?? ""),
      }))
      .filter((category) => category.id && category.name);
  },

  async uploadMyDocument(payload: UploadEmployeeDocumentPayload): Promise<void> {
    const form = new FormData();
    form.append("file", payload.file);
    form.append("employee_id", payload.employeeId);
    form.append("category_id", payload.categoryId);
    addDocumentMetadata(form, payload);
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

  /** The payroll API resolves the employee from the authenticated session. */
  async listMyProvisionSlips(): Promise<ProvisionSlip[]> {
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

export default myDocumentsApi;

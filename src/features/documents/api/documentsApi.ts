import { apiInstance } from "@/api";
import { getMergedStandardCategories } from "../lib/categoryMap";
import { logDocumentAuditEvent, getCombinedAuditActivities } from "../lib/auditLogger";
import type {
  BackendCategory,
  BackendDocumentItem,
  BackendListResponse,
  DocumentActivityItem,
  DocumentSummary,
  DocumentTemplate,
  UploadCompanyPayload,
  UploadEmployeePayload,
} from "../lib/types";

export interface ListDocumentsParams {
  employee_id?: string;
  category_id?: string;
  status?: string;
  search?: string;
  sort_by?: string;
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export const documentsApi = {
  // ── Categories ─────────────────────────────────────────────────────────────
  async getCategories(): Promise<BackendCategory[]> {
    try {
      const res = await apiInstance.get("/documents/categories", {
        headers: { "Cache-Control": "no-cache" },
        skipCache: true,
      });
      const raw = res.data?.data ?? res.data ?? [];
      const parsed: BackendCategory[] = Array.isArray(raw)
        ? raw
            .map((item: Record<string, unknown>) => ({
              id: String(item.id ?? item.category_id ?? ""),
              name: String(item.name ?? item.title ?? ""),
              code: item.code ? String(item.code) : undefined,
              group: String(item.group ?? item.category_group ?? "Employee Documents"),
              is_company: Boolean(item.is_company),
            }))
            .filter((c: BackendCategory) => c.id && c.name)
        : [];

      return getMergedStandardCategories(parsed);
    } catch {
      // Gracefully fall back to standard required production categories
      return getMergedStandardCategories([]);
    }
  },

  // ── Employee Documents Listing ─────────────────────────────────────────────
  async getEmployeeDocuments(
    params: ListDocumentsParams
  ): Promise<BackendListResponse<BackendDocumentItem>> {
    const res = await apiInstance.get("/documents/employees", {
      params: {
        employee_id: params.employee_id || undefined,
        category_id: params.category_id || undefined,
        status: params.status || undefined,
        search: params.search?.trim() || undefined,
        sort_by: params.sort_by || undefined,
        order: params.order || undefined,
        page: params.page ?? 1,
        limit: Math.min(params.limit ?? 10, 100),
      },
      headers: { "Cache-Control": "no-cache" },
      skipCache: true,
    });

    const body = res.data;
    const items = body?.data?.items ?? body?.data ?? body?.items ?? [];
    const meta = body?.meta ?? body?.data?.meta ?? {
      total: Array.isArray(items) ? items.length : 0,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      has_more: false,
    };

    return {
      data: Array.isArray(items) ? items : [],
      meta: {
        total: meta.total ?? (Array.isArray(items) ? items.length : 0),
        page: meta.page ?? (params.page ?? 1),
        limit: meta.limit ?? (params.limit ?? 10),
        has_more: Boolean(meta.has_more ?? meta.hasMore),
      },
    };
  },

  // ── Company Documents Listing ──────────────────────────────────────────────
  async getCompanyDocuments(
    params: ListDocumentsParams
  ): Promise<BackendListResponse<BackendDocumentItem>> {
    const res = await apiInstance.get("/documents/company", {
      params: {
        category_id: params.category_id || undefined,
        search: params.search?.trim() || undefined,
        sort_by: params.sort_by || undefined,
        order: params.order || undefined,
        page: params.page ?? 1,
        limit: Math.min(params.limit ?? 10, 100),
      },
      headers: { "Cache-Control": "no-cache" },
      skipCache: true,
    });

    const body = res.data;
    const items = body?.data?.items ?? body?.data ?? body?.items ?? [];
    const meta = body?.meta ?? body?.data?.meta ?? {
      total: Array.isArray(items) ? items.length : 0,
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      has_more: false,
    };

    return {
      data: Array.isArray(items) ? items : [],
      meta: {
        total: meta.total ?? (Array.isArray(items) ? items.length : 0),
        page: meta.page ?? (params.page ?? 1),
        limit: meta.limit ?? (params.limit ?? 10),
        has_more: Boolean(meta.has_more ?? meta.hasMore),
      },
    };
  },

  // ── Upload Employee Document ───────────────────────────────────────────────
  async uploadEmployeeDocument(payload: UploadEmployeePayload): Promise<BackendDocumentItem> {
    const form = new FormData();
    form.append("file", payload.file);
    form.append("employee_id", payload.employeeId);
    form.append("category_id", payload.categoryId);
    form.append("title", payload.title);
    if (payload.documentType) form.append("document_type", payload.documentType);
    if (payload.documentNumber) form.append("document_number", payload.documentNumber);
    if (payload.description) form.append("description", payload.description);
    if (payload.issueDate) form.append("issue_date", payload.issueDate);
    if (payload.expiryDate) form.append("expiry_date", payload.expiryDate);
    if (payload.visibility) form.append("visibility", payload.visibility);
    if (payload.statusField) form.append("status_field", payload.statusField);
    if (payload.tags) form.append("tags", payload.tags);

    const res = await apiInstance.post("/documents/employees", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const uploaded = res.data?.data ?? res.data;

    // Record audit event
    logDocumentAuditEvent({
      action: "Document Uploaded",
      documentName: payload.title,
      documentId: String(uploaded?.id || ""),
      employeeId: payload.employeeId,
      details: `Uploaded under category ID: ${payload.categoryId}${payload.documentNumber ? ` (Doc #${payload.documentNumber})` : ""}`,
    });

    return uploaded;
  },

  // ── Upload Company Document ────────────────────────────────────────────────
  async uploadCompanyDocument(payload: UploadCompanyPayload): Promise<BackendDocumentItem> {
    const form = new FormData();
    form.append("file", payload.file);
    form.append("category_id", payload.categoryId);
    form.append("title", payload.title);
    if (payload.description) form.append("description", payload.description);
    if (payload.department) form.append("department", payload.department);
    if (payload.branch) form.append("branch", payload.branch);
    if (payload.visibility) form.append("visibility", payload.visibility);

    const res = await apiInstance.post("/documents/company", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const uploaded = res.data?.data ?? res.data;

    // Record audit event
    logDocumentAuditEvent({
      action: "Document Uploaded",
      documentName: payload.title,
      documentId: String(uploaded?.id || ""),
      details: `Company document uploaded for ${payload.department || "Company-wide"}`,
    });

    return uploaded;
  },

  // ── Verification Workflow (Employee Documents Only) ────────────────────────
  async verifyDocument(id: string, comments?: string, documentName = "Document", employeeName?: string): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.patch(`/documents/${id}/verify`, {
      comments: comments || "",
    });

    logDocumentAuditEvent({
      action: "Document Verified",
      documentId: id,
      documentName,
      employeeName,
      details: comments ? `Verification notes: ${comments}` : "Verified and approved.",
    });

    return { success: true, message: res.data?.message || "Document verified successfully." };
  },

  async rejectDocument(id: string, comments: string, documentName = "Document", employeeName?: string): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.patch(`/documents/${id}/reject`, {
      comments,
    });

    logDocumentAuditEvent({
      action: "Document Rejected",
      documentId: id,
      documentName,
      employeeName,
      details: `Rejection reason: ${comments}`,
    });

    return { success: true, message: res.data?.message || "Document rejected." };
  },

  async requestReupload(id: string, comments: string, documentName = "Document", employeeName?: string): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.patch(`/documents/${id}/request-reupload`, {
      comments,
    });

    logDocumentAuditEvent({
      action: "Document Re-uploaded",
      documentId: id,
      documentName,
      employeeName,
      details: `Re-upload requested: ${comments}`,
    });

    return { success: true, message: res.data?.message || "Re-upload requested successfully." };
  },

  // ── Delete ─────────────────────────────────────────────────────────────────
  async deleteEmployeeDocument(id: string, documentName = "Document"): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.delete(`/documents/employees/${id}`);

    logDocumentAuditEvent({
      action: "Document Deleted",
      documentId: id,
      documentName,
      details: "Deleted from employee personnel records.",
    });

    return { success: true, message: res.data?.message || "Document deleted successfully." };
  },

  async deleteCompanyDocument(id: string, documentName = "Company Document"): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.delete(`/documents/company/${id}`);

    logDocumentAuditEvent({
      action: "Document Deleted",
      documentId: id,
      documentName,
      details: "Deleted from company repository.",
    });

    return { success: true, message: res.data?.message || "Company document deleted successfully." };
  },

  // ── Download (Authenticated Blob) ──────────────────────────────────────────
  async downloadDocument(
    id: string,
    source: "employee" | "company",
    documentName = "Document"
  ): Promise<{ blob: Blob; contentDisposition?: string }> {
    const path =
      source === "company"
        ? `/documents/company/${id}/download`
        : `/documents/employees/${id}/download`;

    const res = await apiInstance.get(path, {
      params: { download: true },
      responseType: "blob",
      headers: { Accept: "application/octet-stream, application/pdf, image/*, */*" },
    });

    logDocumentAuditEvent({
      action: "Document Downloaded",
      documentId: id,
      documentName,
      details: `Downloaded as ${source} document.`,
    });

    return {
      blob: res.data as Blob,
      contentDisposition: res.headers?.["content-disposition"] || res.headers?.["Content-Disposition"],
    };
  },

  // ── Summary & Expiring Stats ───────────────────────────────────────────────
  async getDocumentSummary(): Promise<DocumentSummary> {
    try {
      const res = await apiInstance.get("/documents/summary", {
        headers: { "Cache-Control": "no-cache" },
        skipCache: true,
      });
      const data = res.data?.data ?? res.data ?? {};
      return {
        total: Number(data.total ?? 0),
        verified: Number(data.verified ?? 0),
        pending: Number(data.pending ?? 0),
        rejected: Number(data.rejected ?? 0),
        expiring: Number(data.expiring ?? data.expiring_soon ?? 0),
        expired: Number(data.expired ?? 0),
      };
    } catch {
      return { total: 0, verified: 0, pending: 0, rejected: 0, expiring: 0, expired: 0 };
    }
  },

  async getExpiringDocuments(): Promise<BackendDocumentItem[]> {
    try {
      const res = await apiInstance.get("/documents/expiring", {
        headers: { "Cache-Control": "no-cache" },
        skipCache: true,
      });
      const items = res.data?.data?.items ?? res.data?.data ?? res.data ?? [];
      return Array.isArray(items) ? items : [];
    } catch {
      return [];
    }
  },

  async getExpiredDocuments(): Promise<BackendDocumentItem[]> {
    try {
      const res = await apiInstance.get("/documents/expired", {
        headers: { "Cache-Control": "no-cache" },
        skipCache: true,
      });
      const items = res.data?.data?.items ?? res.data?.data ?? res.data ?? [];
      return Array.isArray(items) ? items : [];
    } catch {
      return [];
    }
  },

  // ── Activity Log ───────────────────────────────────────────────────────────
  async getDocumentActivity(page = 1, limit = 20): Promise<{ items: DocumentActivityItem[]; total: number }> {
    let backendItems: DocumentActivityItem[] = [];
    let total = 0;

    try {
      const res = await apiInstance.get("/documents/activity", {
        params: { page, limit },
        headers: { "Cache-Control": "no-cache" },
        skipCache: true,
      });
      const body = res.data;
      const rawItems = body?.data?.items ?? body?.data ?? body?.items ?? [];
      if (Array.isArray(rawItems)) {
        backendItems = rawItems.map((item: Record<string, unknown>) => ({
          id: String(item.id || Math.random().toString(36).slice(2)),
          documentId: String(item.document_id || item.documentId || ""),
          documentName: String(item.document_name || item.documentName || item.title || "Document"),
          action: String(item.action || "Updated"),
          performedBy: String(item.performed_by || item.performedBy || item.user_name || "System"),
          timestamp: String(item.timestamp || item.created_at || new Date().toISOString()),
          details: item.details ? String(item.details) : undefined,
          employeeName: item.employee_name ? String(item.employee_name) : undefined,
          employeeId: item.employee_id ? String(item.employee_id) : undefined,
        }));
        total = body?.meta?.total ?? backendItems.length;
      }
    } catch {
      // Backend activity endpoint pending - continue with combined local session activities
    }

    const combined = getCombinedAuditActivities(backendItems);
    return {
      items: combined.slice((page - 1) * limit, page * limit),
      total: Math.max(total, combined.length),
    };
  },

  // ── Document Templates ─────────────────────────────────────────────────────
  async listTemplates(): Promise<DocumentTemplate[]> {
    try {
      const res = await apiInstance.get("/document-templates", {
        headers: { "Cache-Control": "no-cache" },
        skipCache: true,
      });
      const raw = res.data?.data?.items ?? res.data?.data ?? res.data ?? [];
      if (!Array.isArray(raw)) return [];
      return raw.map((item: Record<string, unknown>) => ({
        id: String(item.id || ""),
        title: String(item.title || item.name || "Template"),
        category: String(item.category || item.category_name || "General"),
        code: String(item.code || item.template_code || "TPL"),
        description: item.description ? String(item.description) : undefined,
        subject: item.subject ? String(item.subject) : undefined,
        content: String(item.content || item.body || item.template_text || ""),
        variables: Array.isArray(item.variables) ? (item.variables as string[]) : [],
        isActive: item.is_active !== false && item.status !== "INACTIVE",
        isDefault: Boolean(item.is_default),
        createdAt: String(item.created_at || new Date().toISOString()),
        updatedAt: item.updated_at ? String(item.updated_at) : undefined,
      }));
    } catch {
      return [];
    }
  },

  async createTemplate(payload: {
    title: string;
    category: string;
    code: string;
    content: string;
    description?: string;
    subject?: string;
    variables?: string[];
    is_active?: boolean;
    is_default?: boolean;
  }): Promise<DocumentTemplate> {
    const res = await apiInstance.post("/document-templates", payload);
    const data = res.data?.data ?? res.data;

    logDocumentAuditEvent({
      action: "Template Created",
      documentName: payload.title,
      documentId: String(data?.id || ""),
      details: `Created new template in category ${payload.category}`,
    });

    return data;
  },

  async generateFromTemplate(
    templateId: string,
    payload: { employee_id?: string; parameters: Record<string, string> }
  ): Promise<{ content?: string; download_url?: string }> {
    const res = await apiInstance.post(`/document-templates/${templateId}/generate`, payload);
    return res.data?.data ?? res.data;
  },

  // ── HR Document Generator ──────────────────────────────────────────────────
  async generateDocument(payload: {
    template_id: string;
    employee_id?: string;
    employee_name?: string;
    parameters: Record<string, string>;
  }): Promise<{ content?: string; file_url?: string; preview_text?: string }> {
    const res = await apiInstance.post("/documents/generate", payload);
    const data = res.data?.data ?? res.data;

    logDocumentAuditEvent({
      action: "Letter Generated",
      documentName: payload.template_id,
      employeeId: payload.employee_id,
      employeeName: payload.employee_name,
      details: `Generated letter for ${payload.employee_name || "employee"}`,
    });

    return data;
  },

  // ── Active Employee Listing (Directory for letter generator & ID card) ──────
  async getEmployees(search?: string): Promise<Array<{
    id: string;
    fullName: string;
    employeeId: string;
    email: string;
    phone: string;
    designation: string;
    department: string;
    joiningDate: string;
    managerName?: string;
    location?: string;
    salary?: string;
    ctc?: string;
    bloodGroup?: string;
    avatarUrl?: string;
  }>> {
    try {
      const res = await apiInstance.get("/employees", {
        params: { search: search?.trim() || undefined, limit: 100 },
      });
      const raw = res.data?.data?.items ?? res.data?.data ?? res.data ?? [];
      if (!Array.isArray(raw)) return [];

      return raw.map((e: Record<string, unknown>) => ({
        id: String(e.id || e.employee_id || ""),
        fullName:
          [e.first_name, e.last_name].filter(Boolean).join(" ").trim() ||
          String(e.full_name || e.name || "Employee"),
        employeeId: String(e.employee_id || e.employee_code || e.id || ""),
        email: String(e.email || ""),
        phone: String(e.phone || e.phone_number || ""),
        designation: String(e.designation || e.role || e.title || "Team Member"),
        department: String(e.department || "Operations"),
        joiningDate: String(e.joining_date || e.created_at || "2024-01-15").split("T")[0],
        managerName: e.manager_name ? String(e.manager_name) : undefined,
        location: String(e.location || e.branch || e.city || "Headquarters"),
        salary: e.salary ? String(e.salary) : undefined,
        ctc: e.ctc ? String(e.ctc) : undefined,
        bloodGroup: e.blood_group ? String(e.blood_group) : undefined,
        avatarUrl: e.avatar_url ? String(e.avatar_url) : undefined,
      }));
    } catch {
      return [];
    }
  },
};

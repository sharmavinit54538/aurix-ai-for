import { apiInstance } from "@/api";
import type {
  BackendCategory,
  BackendDocumentItem,
  BackendListResponse,
  DocumentActivityItem,
  DocumentSummary,
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
    const res = await apiInstance.get("/documents/categories", {
      headers: { "Cache-Control": "no-cache" },
      skipCache: true,
    });
    const raw = res.data?.data ?? res.data ?? [];
    if (!Array.isArray(raw)) return [];
    return raw
      .map((item: Record<string, unknown>) => ({
        id: String(item.id ?? item.category_id ?? ""),
        name: String(item.name ?? item.title ?? ""),
        code: item.code ? String(item.code) : undefined,
        group: String(item.group ?? item.category_group ?? "Employee Documents"),
        is_company: Boolean(item.is_company),
      }))
      .filter((c: BackendCategory) => c.id && c.name);
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
    if (payload.description) form.append("description", payload.description);
    if (payload.issueDate) form.append("issue_date", payload.issueDate);
    if (payload.expiryDate) form.append("expiry_date", payload.expiryDate);
    if (payload.visibility) form.append("visibility", payload.visibility);
    if (payload.statusField) form.append("status_field", payload.statusField);
    if (payload.tags) form.append("tags", payload.tags);

    const res = await apiInstance.post("/documents/employees", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data ?? res.data;
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
    return res.data?.data ?? res.data;
  },

  // ── Verification Workflow (Employee Documents Only) ────────────────────────
  async verifyDocument(id: string, comments?: string): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.patch(`/documents/${id}/verify`, {
      comments: comments || "",
    });
    return { success: true, message: res.data?.message || "Document verified successfully." };
  },

  async rejectDocument(id: string, comments: string): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.patch(`/documents/${id}/reject`, {
      comments,
    });
    return { success: true, message: res.data?.message || "Document rejected." };
  },

  async requestReupload(id: string, comments: string): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.patch(`/documents/${id}/request-reupload`, {
      comments,
    });
    return { success: true, message: res.data?.message || "Re-upload requested successfully." };
  },

  // ── Delete ─────────────────────────────────────────────────────────────────
  async deleteEmployeeDocument(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.delete(`/documents/employees/${id}`);
    return { success: true, message: res.data?.message || "Document deleted successfully." };
  },

  async deleteCompanyDocument(id: string): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.delete(`/documents/company/${id}`);
    return { success: true, message: res.data?.message || "Company document deleted successfully." };
  },

  // ── Download (Authenticated Blob) ──────────────────────────────────────────
  async downloadDocument(
    id: string,
    source: "employee" | "company"
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
      // TODO: Backend /documents/summary endpoint pending or not available yet.
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
      // TODO: Backend /documents/expiring endpoint pending or not available yet.
      return [];
    }
  },

  // ── Activity Log ───────────────────────────────────────────────────────────
  async getDocumentActivity(page = 1, limit = 10): Promise<{ items: DocumentActivityItem[]; total: number }> {
    try {
      const res = await apiInstance.get("/documents/activity", {
        params: { page, limit },
        headers: { "Cache-Control": "no-cache" },
        skipCache: true,
      });
      const body = res.data;
      const rawItems = body?.data?.items ?? body?.data ?? body?.items ?? [];
      if (!Array.isArray(rawItems)) return { items: [], total: 0 };

      const items: DocumentActivityItem[] = rawItems.map((item: Record<string, unknown>) => ({
        id: String(item.id || Math.random().toString(36).slice(2)),
        documentId: String(item.document_id || item.documentId || ""),
        documentName: String(item.document_name || item.documentName || item.title || "Document"),
        action: String(item.action || "Updated"),
        performedBy: String(item.performed_by || item.performedBy || item.user_name || "System"),
        timestamp: String(item.timestamp || item.created_at || new Date().toISOString()),
        details: item.details ? String(item.details) : undefined,
      }));

      return {
        items,
        total: body?.meta?.total ?? items.length,
      };
    } catch {
      // TODO: Backend /documents/activity endpoint pending or not available yet.
      return { items: [], total: 0 };
    }
  },

  // ── AI Document Generator ──────────────────────────────────────────────────
  async generateDocument(payload: {
    template_id: string;
    employee_id?: string;
    parameters: Record<string, string>;
  }): Promise<{ preview_text?: string; file_url?: string }> {
    // TODO: Backend /documents/generate endpoint pending.
    const res = await apiInstance.post("/documents/generate", payload);
    return res.data?.data ?? res.data;
  },
};

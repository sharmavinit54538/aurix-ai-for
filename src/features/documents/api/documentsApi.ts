import { apiInstance } from "@/api";
import { getMergedStandardCategories } from "../lib/categoryMap";
import { logDocumentAuditEvent, getCombinedAuditActivities } from "../lib/auditLogger";
import { settingsApi } from "@/services/settingsApi";
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
  document_type?: string;
  expiry_window?: string;
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
  },

  // ── Employee Documents Listing ─────────────────────────────────────────────
  async getEmployeeDocuments(
    params: ListDocumentsParams
  ): Promise<BackendListResponse<BackendDocumentItem>> {
    const res = await apiInstance.get("/documents/employees", {
      params: {
        employee_id: params.employee_id || undefined,
        category_id: params.category_id || undefined,
        document_type: params.document_type || undefined,
        expiry_window: params.expiry_window || undefined,
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
  async verifyDocument(
    id: string,
    comments?: string,
    documentName = "Document",
    employeeName?: string
  ): Promise<{ success: boolean; message?: string }> {
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

  async rejectDocument(
    id: string,
    comments: string,
    documentName = "Document",
    employeeName?: string
  ): Promise<{ success: boolean; message?: string }> {
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

  async requestReupload(
    id: string,
    comments: string,
    documentName = "Document",
    employeeName?: string
  ): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.patch(`/documents/${id}/request-reupload`, {
      comments,
    });

    logDocumentAuditEvent({
      action: "Re-upload Requested",
      documentId: id,
      documentName,
      employeeName,
      details: `Re-upload requested: ${comments}`,
    });

    return { success: true, message: res.data?.message || "Re-upload requested successfully." };
  },

  // ── Delete ─────────────────────────────────────────────────────────────────
  async deleteEmployeeDocument(
    id: string,
    documentName = "Document"
  ): Promise<{ success: boolean; message?: string }> {
    const res = await apiInstance.delete(`/documents/employees/${id}`);

    logDocumentAuditEvent({
      action: "Document Deleted",
      documentId: id,
      documentName,
      details: "Deleted from employee personnel records.",
    });

    return { success: true, message: res.data?.message || "Document deleted successfully." };
  },

  async deleteCompanyDocument(
    id: string,
    documentName = "Company Document"
  ): Promise<{ success: boolean; message?: string }> {
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
    documentName = "Document",
    options?: { log?: boolean }
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

    if (options?.log !== false) {
      logDocumentAuditEvent({
        action: "Document Downloaded",
        documentId: id,
        documentName,
        details: `Downloaded as ${source} document.`,
      });
    }

    return {
      blob: res.data as Blob,
      contentDisposition: res.headers?.["content-disposition"] || res.headers?.["Content-Disposition"],
    };
  },

  // ── Summary & Expiring Stats ───────────────────────────────────────────────
  async getDocumentSummary(): Promise<DocumentSummary> {
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
  },

  async getExpiringDocuments(): Promise<BackendDocumentItem[]> {
    const res = await apiInstance.get("/documents/expiring", {
      headers: { "Cache-Control": "no-cache" },
      skipCache: true,
    });
    const items = res.data?.data?.items ?? res.data?.data ?? res.data ?? [];
    return Array.isArray(items) ? items : [];
  },

  async getExpiredDocuments(): Promise<BackendDocumentItem[]> {
    const res = await apiInstance.get("/documents/expired", {
      headers: { "Cache-Control": "no-cache" },
      skipCache: true,
    });
    const items = res.data?.data?.items ?? res.data?.data ?? res.data ?? [];
    return Array.isArray(items) ? items : [];
  },

  // ── Activity Log ───────────────────────────────────────────────────────────
  async getDocumentActivity(
    page = 1,
    limit = 20
  ): Promise<{ items: DocumentActivityItem[]; total: number; isLocalFallback?: boolean; serverUnavailable?: boolean }> {
    let backendItems: DocumentActivityItem[] = [];
    let total = 0;
    let isLocalFallback = false;
    let serverUnavailable = false;

try {
        // Try to fetch audit logs filtered for document events
        const res = await settingsApi.getAuditLogs({
          page,
          limit,
          module: "documents",
        });
        const rawItems: Record<string, unknown>[] = Array.isArray(res.items) ? (res.items as unknown as Record<string, unknown>[]) : [];
        if (rawItems.length > 0) {
          backendItems = rawItems.map((item: Record<string, unknown>, idx: number) => {
          const docId = String(item.document_id || item.documentId || item.id || "");
          const timestamp = String(item.timestamp || item.created_at || new Date().toISOString());
          const stableId = String(item.id || item._id || `act_${docId}_${timestamp}_${idx}`);

          return {
            id: stableId,
            documentId: docId || "doc",
            documentName: String(item.document_name || item.documentName || item.title || item.action || "Document"),
            action: String(item.action || "Updated"),
            performedBy: String(item.user || item.performed_by || item.performedBy || item.user_name || "System"),
            timestamp,
            details: item.details ? String(item.details) : undefined,
            employeeName: item.employee_name ? String(item.employee_name) : undefined,
            employeeId: item.employee_id ? String(item.employee_id) : undefined,
          };
        });
        total = res.total ?? backendItems.length;
      } else {
        isLocalFallback = true;
      }
    } catch (err: unknown) {
      const errObj = err as { response?: { status?: number } };
      if (errObj?.response?.status === 404 || errObj?.response?.status === 501) {
        // Server audit log endpoint not available
        serverUnavailable = true;
      }
      isLocalFallback = true;
    }

    const combined = getCombinedAuditActivities(backendItems);
    return {
      items: combined.slice((page - 1) * limit, page * limit),
      total: Math.max(total, combined.length),
      isLocalFallback,
      serverUnavailable,
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
    reportingStructure?: string;
  }>> {
    try {
      const res = await apiInstance.get("/employees", {
        params: { search: search?.trim() || undefined, limit: 100 },
      });
      const body = res.data;
      const raw = body?.data?.items ?? body?.items ?? (Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : []);
      if (!Array.isArray(raw)) return [];

      return raw.map((e: Record<string, unknown>) => {
        const id = String(e.id || e.employee_id || "");
        const empCode = String(e.employee_id || e.employee_code || e.code || e.id || "");
        const nameParts = [e.first_name, e.last_name].filter(Boolean).map(String).join(" ").trim();
        const fullName = nameParts || String(e.full_name || e.name || "Employee");
        const email = String(e.company_email || e.personal_email || e.work_email || e.email || "");
        const phone = String(e.phone || e.phone_number || e.mobile || "");
        const designation = String(e.designation || e.role || e.title || e.position || "");
        const department = String(e.department || e.dept || "");
        const rawDate = e.joining_date || e.hire_date || e.created_at;
        const joiningDate = rawDate ? String(rawDate).split("T")[0] : "";
        const managerName = String(
          e.reporting_manager_name ||
          e.manager_name ||
          (typeof e.manager === "object" && e.manager ? (e.manager as Record<string, unknown>).name || (e.manager as Record<string, unknown>).full_name : e.manager) ||
          ""
        );
        const location = String(e.branch || e.location || e.city || e.work_location || "");
        const ctc = e.ctc
          ? String(e.ctc)
          : e.ctc_annual
          ? String(e.ctc_annual)
          : e.ctc_annual_paise
          ? String(Math.round(Number(e.ctc_annual_paise) / 100))
          : undefined;
        const salary = e.salary ? String(e.salary) : undefined;
        const bloodGroup = e.blood_group ? String(e.blood_group) : undefined;
        const avatarUrl = (e.avatar_url || e.profile_photo_url) ? String(e.avatar_url || e.profile_photo_url) : undefined;

        return {
          id: id || empCode,
          fullName,
          employeeId: empCode,
          email,
          phone,
          designation,
          department,
          joiningDate,
          managerName: managerName || undefined,
          location: location || undefined,
          salary,
          ctc,
          bloodGroup,
          avatarUrl,
        };
      });
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { detail?: string; message?: string } }; message?: string };
      const msg = errObj?.response?.data?.detail || errObj?.response?.data?.message || errObj?.message || "Failed to fetch employees";
      throw new Error(msg);
    }
  },

  // ── Single Employee Detail (with reporting structure & compensation) ────────
  async getEmployeeDetails(id: string): Promise<{
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
    reportingStructure?: string;
  }> {
    let rawEmp: Record<string, unknown> = {};

    try {
      const res = await apiInstance.get(`/employees/${id}`);
      rawEmp = ((res.data?.data ?? res.data) || {}) as Record<string, unknown>;
    } catch {
      // In case /employees/{id} is not supported or returns 404, fallback to searching list
      try {
        const listRes = await apiInstance.get("/employees", { params: { search: id, limit: 10 } });
        const listRaw = listRes.data?.data?.items ?? listRes.data?.items ?? listRes.data?.data ?? listRes.data ?? [];
        if (Array.isArray(listRaw)) {
          const match = listRaw.find(
            (e: Record<string, unknown>) => String(e.id) === String(id) || String(e.employee_id) === String(id)
          );
          if (match) rawEmp = match;
        }
      } catch {
        // Fallback gracefully
      }
    }

    let managerName = String(
      rawEmp.reporting_manager_name ||
      rawEmp.manager_name ||
      (typeof rawEmp.manager === "object" && rawEmp.manager
        ? (rawEmp.manager as Record<string, unknown>).name || (rawEmp.manager as Record<string, unknown>).full_name
        : rawEmp.manager) ||
      ""
    );
    let reportingStructure = "";

    try {
      const hierRes = await apiInstance.get(`/hierarchy/${id}`);
      const hierData = hierRes.data?.data ?? hierRes.data;
      if (hierData?.manager) {
        const mgr = hierData.manager;
        const mgrFullName = [mgr.first_name, mgr.last_name].filter(Boolean).join(" ").trim() || mgr.name;
        if (mgrFullName) {
          managerName = mgrFullName;
          reportingStructure = `${mgrFullName}${mgr.designation ? ` (${mgr.designation})` : ""}`;
        }
      } else if (hierData?.reporting_chain && Array.isArray(hierData.reporting_chain) && hierData.reporting_chain.length > 0) {
        const chain = hierData.reporting_chain;
        const topMgr = chain[0];
        const topName = [topMgr.first_name, topMgr.last_name].filter(Boolean).join(" ").trim() || topMgr.name;
        if (topName) {
          managerName = topName;
          reportingStructure = topName;
        }
      }
    } catch {
      // Hierarchy endpoint might be unavailable or 404; safe fallback
    }

    let ctc = rawEmp.ctc
      ? String(rawEmp.ctc)
      : rawEmp.ctc_annual
      ? String(rawEmp.ctc_annual)
      : rawEmp.ctc_annual_paise
      ? String(Math.round(Number(rawEmp.ctc_annual_paise) / 100))
      : undefined;
    let salary = rawEmp.salary ? String(rawEmp.salary) : undefined;

    if (!ctc) {
      try {
        const compRes = await apiInstance.get(`/api/v2/payroll/employees/${id}/compensation`, {
          headers: { "Cache-Control": "no-store" },
        });
        const compData = compRes.data?.data ?? compRes.data;
        if (compData?.ctcAnnualFormatted) {
          ctc = String(compData.ctcAnnualFormatted);
        } else if (compData?.ctcAnnualPaise) {
          ctc = String(Math.round(Number(compData.ctcAnnualPaise) / 100));
        }
        if (compData?.ctcMonthlyFormatted && !salary) {
          salary = String(compData.ctcMonthlyFormatted);
        }
      } catch {
        // Payroll / compensation may be restricted by role (403); safe fallback
      }
    }

    const nameParts = [rawEmp.first_name, rawEmp.last_name].filter(Boolean).map(String).join(" ").trim();
    const fullName = nameParts || String(rawEmp.full_name || rawEmp.name || "Employee");
    const empCode = String(rawEmp.employee_id || rawEmp.employee_code || id);
    const rawDate = rawEmp.joining_date || rawEmp.created_at;
    const joiningDate = rawDate ? String(rawDate).split("T")[0] : "";
    const location = String(rawEmp.branch || rawEmp.location || rawEmp.city || rawEmp.work_location || "");

    return {
      id: String(rawEmp.id || id),
      fullName,
      employeeId: empCode,
      email: String(rawEmp.company_email || rawEmp.personal_email || rawEmp.work_email || rawEmp.email || ""),
      phone: String(rawEmp.phone || rawEmp.phone_number || ""),
      designation: String(rawEmp.designation || rawEmp.role || rawEmp.title || ""),
      department: String(rawEmp.department || ""),
      joiningDate,
      managerName: managerName || undefined,
      reportingStructure: reportingStructure || managerName || undefined,
      location: location || undefined,
      salary,
      ctc,
      bloodGroup: rawEmp.blood_group ? String(rawEmp.blood_group) : undefined,
      avatarUrl: (rawEmp.avatar_url || rawEmp.profile_photo_url) ? String(rawEmp.avatar_url || rawEmp.profile_photo_url) : undefined,
    };
  },
};

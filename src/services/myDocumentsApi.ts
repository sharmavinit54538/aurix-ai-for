import apiInstance from "@/api/apiInstance";

export type DocumentCategory =
  | "Identity"
  | "Education"
  | "Employment"
  | "Tax & Compliance"
  | "Other"
  | string;

export interface EmployeeDocument {
  id: string;
  name: string;
  title?: string;
  category: DocumentCategory;
  file_type?: string;
  file_size?: string;
  status: "verified" | "pending" | "rejected" | string;
  uploaded_at: string;
  file_url?: string;
  rejection_reason?: string;
}

export type MyDocumentItem = EmployeeDocument;

export interface ProvisionSlip {
  id: string;
  asset_name: string;
  asset_tag: string;
  category: string;
  assigned_date: string;
  status: string;
}

export const myDocumentsApi = {
  getDocuments: async (): Promise<EmployeeDocument[]> => {
    const res = await apiInstance.get("/documents/my");
    const d = res.data?.data ?? res.data;
    return Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
  },
  getSalarySlips: async (): Promise<any[]> => {
    const res = await apiInstance.get("/documents/my/salary-slips");
    const d = res.data?.data ?? res.data;
    return Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
  },
  getProvisionSlips: async (): Promise<ProvisionSlip[]> => {
    const res = await apiInstance.get("/documents/my/provision-slips");
    const d = res.data?.data ?? res.data;
    return Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
  },
  uploadDocument: async (payload: unknown) => {
    const res = await apiInstance.post("/documents/my", payload);
    return res.data?.data ?? res.data;
  },
  reuploadDocument: async (id: string, payload: unknown) => {
    const res = await apiInstance.put(`/documents/my/${id}`, payload);
    return res.data?.data ?? res.data;
  },
  deleteDocument: async (id: string) => {
    const res = await apiInstance.delete(`/documents/my/${id}`);
    return res.data?.data ?? res.data ?? { success: true };
  },
};

export default myDocumentsApi;

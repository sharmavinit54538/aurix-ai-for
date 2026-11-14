export type DocumentCategory = "Identity" | "Education" | "Employment" | "Tax & Compliance" | "Other" | string;

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
  getDocuments: async (): Promise<EmployeeDocument[]> => [
    {
      id: "doc-1",
      name: "Employment_Contract_Signed.pdf",
      title: "Employment Contract",
      category: "Employment",
      file_type: "pdf",
      file_size: "420 KB",
      status: "verified",
      uploaded_at: new Date().toISOString(),
    },
  ],
  getSalarySlips: async (): Promise<any[]> => [],
  getProvisionSlips: async (): Promise<ProvisionSlip[]> => [],
  uploadDocument: async (_payload: unknown) => ({ id: `doc-${Date.now()}`, status: "pending" }),
  reuploadDocument: async (_id: string, _payload: unknown) => ({ success: true }),
  deleteDocument: async (_id: string) => ({ success: true }),
};
export default myDocumentsApi;

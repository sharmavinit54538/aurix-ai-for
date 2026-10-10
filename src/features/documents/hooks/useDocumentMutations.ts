import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/utils";
import { documentsApi } from "../api/documentsApi";
import { DOCUMENTS_LIST_QUERY_KEY } from "./useDocumentsList";
import { DOCUMENTS_SUMMARY_QUERY_KEY, DOCUMENTS_EXPIRING_QUERY_KEY } from "./useDocumentSummary";
import { DOCUMENTS_ACTIVITY_QUERY_KEY } from "./useDocumentActivity";
import type { UploadCompanyPayload, UploadEmployeePayload } from "../lib/types";

interface DocumentMutationParams {
  id: string;
  comments?: string;
  documentName?: string;
  employeeName?: string;
}

interface DeleteMutationParams {
  id: string;
  source: "employee" | "company";
  documentName?: string;
}

export function useDocumentMutations() {
  const queryClient = useQueryClient();

  const invalidateDocumentQueries = () => {
    queryClient.invalidateQueries({ queryKey: DOCUMENTS_LIST_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: DOCUMENTS_SUMMARY_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: DOCUMENTS_EXPIRING_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: DOCUMENTS_ACTIVITY_QUERY_KEY });
  };

  // 1. Verify
  const verifyMutation = useMutation({
    mutationFn: ({ id, comments, documentName, employeeName }: DocumentMutationParams) =>
      documentsApi.verifyDocument(id, comments ?? "", documentName ?? "Document", employeeName),
    onSuccess: (res) => {
      toast.success(res.message || "Document verified and approved!");
      invalidateDocumentQueries();
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to verify document."));
    },
  });

  // 2. Reject
  const rejectMutation = useMutation({
    mutationFn: ({ id, comments, documentName, employeeName }: DocumentMutationParams) =>
      documentsApi.rejectDocument(id, comments ?? "", documentName ?? "Document", employeeName),
    onSuccess: (res) => {
      toast.warning(res.message || "Document rejected.");
      invalidateDocumentQueries();
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to reject document."));
    },
  });

  // 3. Request Reupload
  const reuploadMutation = useMutation({
    mutationFn: ({ id, comments, documentName, employeeName }: DocumentMutationParams) =>
      documentsApi.requestReupload(id, comments ?? "", documentName ?? "Document", employeeName),
    onSuccess: (res) => {
      toast.info(res.message || "Re-upload requested successfully.");
      invalidateDocumentQueries();
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to request document re-upload."));
    },
  });

  // 4. Delete
  const deleteMutation = useMutation({
    mutationFn: ({ id, source, documentName }: DeleteMutationParams) =>
      source === "company"
        ? documentsApi.deleteCompanyDocument(id, documentName ?? "Company Document")
        : documentsApi.deleteEmployeeDocument(id, documentName ?? "Document"),
    onSuccess: (res) => {
      toast.success(res.message || "Document deleted successfully.");
      invalidateDocumentQueries();
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to delete document."));
    },
  });

  // 5. Upload Employee
  const uploadEmployeeMutation = useMutation({
    mutationFn: (payload: UploadEmployeePayload) => documentsApi.uploadEmployeeDocument(payload),
    onSuccess: () => {
      toast.success("Employee document uploaded successfully!");
      invalidateDocumentQueries();
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to upload document."));
    },
  });

  // 6. Upload Company
  const uploadCompanyMutation = useMutation({
    mutationFn: (payload: UploadCompanyPayload) => documentsApi.uploadCompanyDocument(payload),
    onSuccess: () => {
      toast.success("Company document uploaded successfully!");
      invalidateDocumentQueries();
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err, "Failed to upload company document."));
    },
  });

  return {
    verifyDocument: verifyMutation.mutateAsync,
    isVerifying: verifyMutation.isPending,

    rejectDocument: rejectMutation.mutateAsync,
    isRejecting: rejectMutation.isPending,

    requestReupload: reuploadMutation.mutateAsync,
    isRequestingReupload: reuploadMutation.isPending,

    deleteDocument: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,

    uploadEmployeeDocument: uploadEmployeeMutation.mutateAsync,
    isUploadingEmployee: uploadEmployeeMutation.isPending,

    uploadCompanyDocument: uploadCompanyMutation.mutateAsync,
    isUploadingCompany: uploadCompanyMutation.isPending,

    isUploading: uploadEmployeeMutation.isPending || uploadCompanyMutation.isPending,
  };
}

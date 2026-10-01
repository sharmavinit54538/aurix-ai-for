import React, { useState, useCallback } from "react";
import { useAurix } from "@/lib/aurix-store";
import { canDo } from "@/features/documents/lib/permissions";
import { useCurrentEmployeeProfile } from "@/features/documents/hooks/useCurrentEmployeeProfile";
import { useDocumentCategories } from "@/features/documents/hooks/useDocumentCategories";
import { useDocumentSummary } from "@/features/documents/hooks/useDocumentSummary";
import { useDocumentsList } from "@/features/documents/hooks/useDocumentsList";
import { useDocumentMutations } from "@/features/documents/hooks/useDocumentMutations";
import { DocumentsToolbar } from "@/features/documents/components/DocumentsToolbar";
import { DocumentsStatsCards } from "@/features/documents/components/DocumentsStatsCards";
import { DocumentsTable } from "@/features/documents/components/DocumentsTable";
import { DocumentPreviewSheet } from "@/features/documents/components/DocumentPreviewSheet";
import { UploadDocumentDialog } from "@/features/documents/components/UploadDocumentDialog";
import { RejectDialog } from "@/features/documents/components/RejectDialog";
import { ReuploadDialog } from "@/features/documents/components/ReuploadDialog";
import { DeleteDialog } from "@/features/documents/components/DeleteDialog";
import { DocumentGeneratorDialog } from "@/features/documents/components/DocumentGeneratorDialog";
import { ActivityLog } from "@/features/documents/components/ActivityLog";
import type { DocumentFilters, DocumentItem } from "@/features/documents/lib/types";

export function DocumentsPage() {
  const ws = useAurix();
  const userRole = ws.user?.role;

  // Step 0: Resolve caller employee profile UUID
  const { employeeProfileId, isEmployeeRole } = useCurrentEmployeeProfile();

  // Categories
  const {
    categories,
    categoriesMap,
    groupedCategories,
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useDocumentCategories();

  // Summary & Expiring Stats
  const {
    summary,
    expiringDocs,
    isLoading: isLoadingSummary,
    refetch: refetchSummary,
  } = useDocumentSummary();

  // Table Filters State (Server Pagination, Search, Tabs, Sorting)
  const [filters, setFilters] = useState<DocumentFilters>({
    tab: "all",
    search: "",
    page: 1,
    limit: 10,
    sortBy: "created_at",
    order: "desc",
  });

  const handleFilterChange = useCallback((partial: Partial<DocumentFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...partial,
      page: partial.page ?? (partial.tab !== undefined || partial.search !== undefined ? 1 : prev.page),
    }));
  }, []);

  const handleSortChange = useCallback((sortBy: DocumentFilters["sortBy"]) => {
    setFilters((prev) => {
      if (prev.sortBy === sortBy) {
        return { ...prev, order: prev.order === "asc" ? "desc" : "asc", page: 1 };
      }
      return { ...prev, sortBy, order: "desc", page: 1 };
    });
  }, []);

  // Server-side Document Listing
  const {
    items: docs,
    meta,
    isLoading: isLoadingDocs,
    isError: isDocsError,
    hasPartialError,
    refetch: refetchDocs,
  } = useDocumentsList({
    filters,
    categoriesMap,
    currentEmployeeProfileId: employeeProfileId,
    isEmployeeRole,
  });

  // Mutations
  const {
    verifyDocument,
    isVerifying,
    rejectDocument,
    isRejecting,
    requestReupload,
    isRequestingReupload,
    deleteDocument,
    isDeleting,
    uploadEmployeeDocument,
    uploadCompanyDocument,
    isUploading,
  } = useDocumentMutations();

  // Modals & Sheets State
  const [uploadOpen, setUploadOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);
  const [rejectDoc, setRejectDoc] = useState<DocumentItem | null>(null);
  const [reuploadDoc, setReuploadDoc] = useState<DocumentItem | null>(null);
  const [deleteDoc, setDeleteDoc] = useState<DocumentItem | null>(null);

  // RBAC Permission checks
  const canUpload = canDo(userRole, "upload");
  const canGenerate = canDo(userRole, "generate");

  // Handler for direct download from row
  const handleDownloadRow = async (doc: DocumentItem) => {
    setPreviewDoc(doc);
  };

  const handleVerify = async (doc: DocumentItem) => {
    await verifyDocument({ id: doc.id });
    if (previewDoc?.id === doc.id) {
      setPreviewDoc((prev) => (prev ? { ...prev, status: "VERIFIED", isVerified: true } : null));
    }
  };

  const handleConfirmReject = async (id: string, comments: string) => {
    await rejectDocument({ id, comments });
    if (previewDoc?.id === id) {
      setPreviewDoc((prev) =>
        prev ? { ...prev, status: "REJECTED", rejectionReason: comments } : null
      );
    }
  };

  const handleConfirmReupload = async (id: string, comments: string) => {
    await requestReupload({ id, comments });
    if (previewDoc?.id === id) {
      setPreviewDoc((prev) =>
        prev ? { ...prev, status: "PENDING", rejectionReason: comments } : null
      );
    }
  };

  const handleConfirmDelete = async (doc: DocumentItem) => {
    await deleteDocument({ id: doc.id, source: doc.source });
    if (previewDoc?.id === doc.id) {
      setPreviewDoc(null);
    }
  };

  const handleRetryAll = () => {
    refetchDocs();
    refetchSummary();
    if (isCategoriesError) refetchCategories();
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP ACTIONS, TABS, SEARCH, AND ALERTS */}
      <DocumentsToolbar
        filters={filters}
        onFilterChange={handleFilterChange}
        onOpenUpload={() => setUploadOpen(true)}
        onOpenGenerator={canGenerate ? () => setGenerateOpen(true) : undefined}
        canUpload={canUpload}
        canGenerate={canGenerate}
        categoriesLoaded={!isLoadingCategories && !isCategoriesError && categories.length > 0}
        pendingCount={summary.pending}
        expiringDocs={expiringDocs}
        isEmployeeRole={isEmployeeRole}
      />

      {/* 2. STATS CARDS */}
      <DocumentsStatsCards summary={summary} isLoading={isLoadingSummary} />

      {/* 3. SERVER-PAGINATED DATA TABLE */}
      <DocumentsTable
        items={docs}
        meta={meta}
        filters={filters}
        isLoading={isLoadingDocs}
        isError={isDocsError}
        hasPartialError={hasPartialError}
        onRetry={handleRetryAll}
        onPageChange={(newPage) => handleFilterChange({ page: newPage })}
        onSortChange={handleSortChange}
        onSelectPreview={(doc) => setPreviewDoc(doc)}
        onSelectDelete={(doc) => setDeleteDoc(doc)}
        onDownload={handleDownloadRow}
        userRole={userRole}
        currentEmployeeProfileId={employeeProfileId}
      />

      {/* 4. ACTIVITY AUDIT LOG */}
      <ActivityLog />

      {/* 5. UPLOAD DOCUMENT DIALOG */}
      <UploadDocumentDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        categories={categories}
        groupedCategories={groupedCategories}
        currentEmployeeProfileId={employeeProfileId}
        isEmployeeRole={isEmployeeRole}
        onUploadEmployee={uploadEmployeeDocument}
        onUploadCompany={uploadCompanyDocument}
        isUploading={isUploading}
      />

      {/* 6. AI DOCUMENT GENERATOR DIALOG */}
      {canGenerate && (
        <DocumentGeneratorDialog
          open={generateOpen}
          onOpenChange={setGenerateOpen}
        />
      )}

      {/* 7. PREVIEW SLIDE-OUT SHEET */}
      <DocumentPreviewSheet
        doc={previewDoc}
        open={Boolean(previewDoc)}
        onOpenChange={(open) => {
          if (!open) setPreviewDoc(null);
        }}
        onVerify={handleVerify}
        onRejectPrompt={(doc) => setRejectDoc(doc)}
        onRequestReuploadPrompt={(doc) => setReuploadDoc(doc)}
        isVerifying={isVerifying}
        userRole={userRole}
      />

      {/* 8. REJECT DIALOG */}
      <RejectDialog
        open={Boolean(rejectDoc)}
        onOpenChange={(open) => {
          if (!open) setRejectDoc(null);
        }}
        targetDoc={rejectDoc}
        onConfirmReject={handleConfirmReject}
        isRejecting={isRejecting}
      />

      {/* 9. RE-UPLOAD DIALOG */}
      <ReuploadDialog
        open={Boolean(reuploadDoc)}
        onOpenChange={(open) => {
          if (!open) setReuploadDoc(null);
        }}
        targetDoc={reuploadDoc}
        onConfirmReupload={handleConfirmReupload}
        isRequesting={isRequestingReupload}
      />

      {/* 10. DELETE CONFIRMATION DIALOG */}
      <DeleteDialog
        open={Boolean(deleteDoc)}
        onOpenChange={(open) => {
          if (!open) setDeleteDoc(null);
        }}
        targetDoc={deleteDoc}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default DocumentsPage;

import { useState } from "react";
import { Upload, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAurix } from "@/lib/aurix-store";
import {
  type ActiveTab,
  useEmployeeDocumentsData,
  useEmployeeDocumentsActions,
  EmployeeDocumentsStats,
  EmployeeDocumentsTabs,
  EmployeeDocumentsTable,
  SalarySlipsTable,
  ProvisionSlipsTable,
  UploadDocumentModal,
  ReuploadDocumentModal,
  DocumentPreviewModal,
  SalarySlipDetailModal,
  ProvisionSlipDetailModal,
  DeleteDocumentModal,
} from "../documents";

export function EmployeeDocumentsPage() {
  const ws = useAurix();
  const currentUserName = ws.user?.fullName || "Employee";

  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    documents,
    salarySlips,
    provisionSlips,
    categories,
    employeeId,
    isLoadingDocs,
    isLoadingSalary,
    isLoadingProvision,
    loadError,
    fetchDocuments,
    summaryMetrics,
    filteredDocuments,
    filteredSalarySlips,
    filteredProvisionSlips,
  } = useEmployeeDocumentsData(activeTab, searchQuery);

  const {
    uploadOpen,
    setUploadOpen,
    reuploadOpen,
    setReuploadOpen,
    previewOpen,
    deleteOpen,
    setDeleteOpen,
    selectedDoc,
    setSelectedDoc,
    previewBlobUrl,
    isPreviewLoading,
    selectedSlip,
    setSelectedSlip,
    slipModalOpen,
    setSlipModalOpen,
    selectedProvision,
    setSelectedProvision,
    provisionModalOpen,
    setProvisionModalOpen,
    uploadName,
    setUploadName,
    uploadCategory,
    uploadType,
    setUploadType,
    uploadCustomType,
    setUploadCustomType,
    uploadExpiry,
    setUploadExpiry,
    uploadDesc,
    setUploadDesc,
    setUploadFile,
    fileInputRef,
    setReuploadFile,
    isSubmittingUpload,
    isSubmittingReupload,
    reuploadInputRef,
    handleOpenUploadModal,
    handleCategoryChange,
    handleUploadSubmit,
    handleOpenReupload,
    handleReuploadSubmit,
    handleViewDocument,
    handleClosePreview,
    handleDownloadDocument,
    handleConfirmDelete,
    handleDownloadSalarySlip,
    handleDownloadProvisionSlip,
  } = useEmployeeDocumentsActions(employeeId, categories, fetchDocuments);

  return (
    <div className="min-h-screen space-y-6 p-4 sm:p-6 lg:p-8 bg-background text-foreground">
      {/* ── Page Header Action ──────────────────────────────────────── */}
      <div className="flex justify-end">
        <div className="flex items-center gap-3">
          <Button
            onClick={handleOpenUploadModal}
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:from-blue-700 hover:to-indigo-700"
          >
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* ── Error Banner ───────────────────────────────────────────── */}
      {loadError && (
        <Card className="border-rose-500/30 bg-rose-500/10">
          <CardContent className="flex items-center justify-between p-4 text-sm text-rose-400">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>{loadError}</span>
            </div>
            <Button
              onClick={fetchDocuments}
              variant="outline"
              size="sm"
              className="border-rose-500/40 text-rose-300 hover:bg-rose-500/20"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Summary Cards ──────────────────────────────────────────── */}
      <EmployeeDocumentsStats metrics={summaryMetrics} />

      {/* ── Main Content Area ──────────────────────────────────────── */}
      <Card className="border-border bg-card/60 backdrop-blur-xl">
        <EmployeeDocumentsTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalDocs={documents.length}
          salarySlipsCount={salarySlips.length}
          provisionSlipsCount={provisionSlips.length}
          summaryMetrics={summaryMetrics}
          filteredDocsCount={filteredDocuments.length}
          filteredSalarySlipsCount={filteredSalarySlips.length}
          filteredProvisionSlipsCount={filteredProvisionSlips.length}
        />

        <CardContent className="p-0">
          {activeTab === "salary-slips" ? (
            <SalarySlipsTable
              isLoadingSalary={isLoadingSalary}
              filteredSalarySlips={filteredSalarySlips}
              onViewSlip={(slip) => {
                setSelectedSlip(slip);
                setSlipModalOpen(true);
              }}
              onDownloadSlip={handleDownloadSalarySlip}
            />
          ) : activeTab === "provision-slips" ? (
            <ProvisionSlipsTable
              isLoadingProvision={isLoadingProvision}
              filteredProvisionSlips={filteredProvisionSlips}
              currentUserName={currentUserName}
              onViewProvision={(slip) => {
                setSelectedProvision(slip);
                setProvisionModalOpen(true);
              }}
              onDownloadProvision={handleDownloadProvisionSlip}
            />
          ) : (
            <EmployeeDocumentsTable
              isLoadingDocs={isLoadingDocs}
              documentsCount={documents.length}
              filteredDocuments={filteredDocuments}
              onOpenUploadModal={handleOpenUploadModal}
              onViewDocument={handleViewDocument}
              onDownloadDocument={handleDownloadDocument}
              onOpenReupload={handleOpenReupload}
              onDeleteDocument={(doc) => {
                setSelectedDoc(doc);
                setDeleteOpen(true);
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* ── Modals ─────────────────────────────────────────────────── */}
      <UploadDocumentModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        uploadName={uploadName}
        setUploadName={setUploadName}
        uploadCategory={uploadCategory}
        handleCategoryChange={handleCategoryChange}
        uploadType={uploadType}
        setUploadType={setUploadType}
        uploadCustomType={uploadCustomType}
        setUploadCustomType={setUploadCustomType}
        uploadExpiry={uploadExpiry}
        setUploadExpiry={setUploadExpiry}
        uploadDesc={uploadDesc}
        setUploadDesc={setUploadDesc}
        setUploadFile={setUploadFile}
        fileInputRef={fileInputRef}
        isSubmittingUpload={isSubmittingUpload}
        handleUploadSubmit={handleUploadSubmit}
      />

      <ReuploadDocumentModal
        open={reuploadOpen}
        onOpenChange={setReuploadOpen}
        selectedDoc={selectedDoc}
        reuploadInputRef={reuploadInputRef}
        setReuploadFile={setReuploadFile}
        isSubmittingReupload={isSubmittingReupload}
        handleReuploadSubmit={handleReuploadSubmit}
      />

      <DocumentPreviewModal
        open={previewOpen}
        onClose={handleClosePreview}
        selectedDoc={selectedDoc}
        isPreviewLoading={isPreviewLoading}
        previewBlobUrl={previewBlobUrl}
        onDownload={handleDownloadDocument}
      />

      <SalarySlipDetailModal
        open={slipModalOpen}
        onOpenChange={setSlipModalOpen}
        selectedSlip={selectedSlip}
        onDownload={handleDownloadSalarySlip}
      />

      <ProvisionSlipDetailModal
        open={provisionModalOpen}
        onOpenChange={setProvisionModalOpen}
        selectedProvision={selectedProvision}
        currentUserName={currentUserName}
        onDownload={handleDownloadProvisionSlip}
      />

      <DeleteDocumentModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        selectedDoc={selectedDoc}
        onConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
}

export default EmployeeDocumentsPage;

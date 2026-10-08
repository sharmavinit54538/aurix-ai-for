import { useState, useRef } from "react";
import { toast } from "sonner";
import { myDocumentsApi, triggerFileDownload } from "@/services/myDocumentsApi";
import { CATEGORY_MAP } from "../constants";
import type {
  EmployeeDocument,
  DocumentCategory,
  SalarySlipRecord,
  ProvisionSlip,
} from "../types";

export function useEmployeeDocumentsActions(
  employeeId: string,
  categories: DocumentCategory[],
  fetchDocuments: () => Promise<void>
) {
  // Modals State
  const [uploadOpen, setUploadOpen] = useState(false);
  const [reuploadOpen, setReuploadOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<EmployeeDocument | null>(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState<boolean>(false);

  // Salary Slip Preview State
  const [selectedSlip, setSelectedSlip] = useState<SalarySlipRecord | null>(null);
  const [slipModalOpen, setSlipModalOpen] = useState<boolean>(false);

  // Provision Slip Preview State
  const [selectedProvision, setSelectedProvision] = useState<ProvisionSlip | null>(null);
  const [provisionModalOpen, setProvisionModalOpen] = useState<boolean>(false);

  // Upload Form State
  const [uploadName, setUploadName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Identity");
  const [uploadType, setUploadType] = useState("Aadhaar Card");
  const [uploadCustomType, setUploadCustomType] = useState("");
  const [uploadExpiry, setUploadExpiry] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isSubmittingUpload, setIsSubmittingUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Re-upload Form State
  const [reuploadFile, setReuploadFile] = useState<File | null>(null);
  const [isSubmittingReupload, setIsSubmittingReupload] = useState(false);
  const reuploadInputRef = useRef<HTMLInputElement | null>(null);

  // ── Upload Handlers ───────────────────────────────────────────────
  const handleOpenUploadModal = () => {
    setUploadName("");
    setUploadCategory("Identity");
    setUploadType(CATEGORY_MAP["Identity"]?.[0] || "Aadhaar Card");
    setUploadCustomType("");
    setUploadExpiry("");
    setUploadDesc("");
    setUploadFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setUploadOpen(true);
  };

  const handleCategoryChange = (catName: string) => {
    setUploadCategory(catName);
    const types = CATEGORY_MAP[catName] || [];
    setUploadType(types[0] || "Other");
    setUploadCustomType("");
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error("Please select a file to upload.");
      return;
    }
    if (!uploadName.trim()) {
      toast.error("Please enter a document name.");
      return;
    }

    const resolvedCat = categories.find(
      (c) => c.name.toLowerCase() === uploadCategory.toLowerCase()
    );
    const categoryId = resolvedCat ? resolvedCat.id : uploadCategory.toLowerCase();
    const finalType =
      uploadType === "Other" && uploadCustomType.trim() ? uploadCustomType.trim() : uploadType;

    setIsSubmittingUpload(true);
    try {
      await myDocumentsApi.uploadMyDocument({
        employeeId,
        categoryId,
        name: uploadName.trim(),
        type: finalType,
        description: uploadDesc.trim() || undefined,
        expiryDate: uploadExpiry || undefined,
        file: uploadFile,
      });

      toast.success("Document uploaded successfully. Status: Pending Verification.");
      setUploadOpen(false);
      await fetchDocuments();
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Failed to upload document. Please verify file format and size.";
      toast.error(errMsg);
    } finally {
      setIsSubmittingUpload(false);
    }
  };

  // ── Re-upload Handler (for Rejected Documents) ───────────────────
  const handleOpenReupload = (doc: EmployeeDocument) => {
    setSelectedDoc(doc);
    setReuploadFile(null);
    if (reuploadInputRef.current) reuploadInputRef.current.value = "";
    setReuploadOpen(true);
  };

  const handleReuploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc) return;
    if (!reuploadFile) {
      toast.error("Please select a revised file to upload.");
      return;
    }

    setIsSubmittingReupload(true);
    try {
      await myDocumentsApi.reuploadMyDocument(selectedDoc.id, {
        name: selectedDoc.title || selectedDoc.fileName || "Revised Document",
        type: selectedDoc.type || "Document",
        description: selectedDoc.description || undefined,
        expiryDate: selectedDoc.expiryDate || undefined,
        file: reuploadFile,
      });

      toast.success("Revised document re-uploaded successfully. Status: Pending Verification.");
      setReuploadOpen(false);
      await fetchDocuments();
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Failed to re-upload document. Please try again.";
      toast.error(errMsg);
    } finally {
      setIsSubmittingReupload(false);
    }
  };

  // ── View / Preview Document ──────────────────────────────────────
  const handleViewDocument = async (doc: EmployeeDocument) => {
    setSelectedDoc(doc);
    setPreviewOpen(true);
    setIsPreviewLoading(true);

    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }

    try {
      const blob = await myDocumentsApi.downloadMyDocument(doc.id);
      const url = URL.createObjectURL(blob);
      setPreviewBlobUrl(url);
    } catch {
      if (doc.fileUrl) {
        setPreviewBlobUrl(doc.fileUrl);
      } else {
        toast.error("Unable to load document preview stream.");
      }
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    if (previewBlobUrl) {
      URL.revokeObjectURL(previewBlobUrl);
      setPreviewBlobUrl(null);
    }
    setSelectedDoc(null);
  };

  // ── Download Document ────────────────────────────────────────────
  const handleDownloadDocument = async (doc: EmployeeDocument) => {
    const toastId = toast.loading(`Downloading ${doc.title || "document"}...`);
    try {
      const blob = await myDocumentsApi.downloadMyDocument(doc.id);
      const ext = (doc.fileName || "").split(".").pop() || "pdf";
      const downloadName = (doc.fileName || `${doc.title || "document"}.${ext}`).replace(
        /[/\\?%*:|"<>]/g,
        "-"
      );
      triggerFileDownload(blob, downloadName);
      toast.success("Document downloaded successfully.", { id: toastId });
    } catch {
      toast.error("Failed to download document from backend storage.", { id: toastId });
    }
  };

  // ── Delete Document ──────────────────────────────────────────────
  const handleConfirmDelete = async () => {
    if (!selectedDoc) return;
    const toastId = toast.loading("Deleting document...");
    try {
      await myDocumentsApi.deleteMyDocument(selectedDoc.id);
      toast.success("Document deleted successfully.", { id: toastId });
      setDeleteOpen(false);
      setSelectedDoc(null);
      await fetchDocuments();
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Failed to delete document. You may not have permission to delete this record.";
      toast.error(errMsg, { id: toastId });
    }
  };

  // ── Download Salary Slip ─────────────────────────────────────────
  const handleDownloadSalarySlip = async (slip: SalarySlipRecord) => {
    const toastId = toast.loading(`Downloading payslip for ${slip.periodName}...`);
    try {
      const blob = await myDocumentsApi.downloadMySalarySlip(
        slip.runId || "",
        slip.employeeId || employeeId
      );
      const filename = `Payslip_${slip.periodName?.replace(/\s+/g, "_") || "slip"}_${slip.payslipNumber || ""}.pdf`;
      triggerFileDownload(blob, filename);
      toast.success("Salary slip downloaded successfully.", { id: toastId });
    } catch {
      toast.error("Unable to download salary slip PDF.", { id: toastId });
    }
  };

  // ── Download Provision Slip ──────────────────────────────────────
  const handleDownloadProvisionSlip = async (slip: ProvisionSlip) => {
    const toastId = toast.loading(`Downloading provision slip for ${slip.periodName}...`);
    try {
      const blob = await myDocumentsApi.downloadMyProvisionSlip(slip);
      const filename = `ProvisionSlip_${slip.periodName?.replace(/\s+/g, "_") || "slip"}_${slip.slipNumber || ""}.pdf`;
      triggerFileDownload(blob, filename);
      toast.success("Provision slip downloaded successfully.", { id: toastId });
    } catch {
      toast.error("Unable to download provision slip.", { id: toastId });
    }
  };

  return {
    uploadOpen, setUploadOpen,
    reuploadOpen, setReuploadOpen,
    previewOpen, setPreviewOpen,
    deleteOpen, setDeleteOpen,
    selectedDoc, setSelectedDoc,
    previewBlobUrl,
    isPreviewLoading,
    selectedSlip, setSelectedSlip,
    slipModalOpen, setSlipModalOpen,
    selectedProvision, setSelectedProvision,
    provisionModalOpen, setProvisionModalOpen,
    uploadName, setUploadName,
    uploadCategory, setUploadCategory,
    uploadType, setUploadType,
    uploadCustomType, setUploadCustomType,
    uploadExpiry, setUploadExpiry,
    uploadDesc, setUploadDesc,
    uploadFile, setUploadFile,
    isSubmittingUpload,
    fileInputRef,
    reuploadFile, setReuploadFile,
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
  };
}

import React, { useRef, useState } from "react";
import { Upload, Eye, Trash2, CheckCircle, AlertCircle, FileText, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { employeeOnboardingApi } from "@/services/employeeOnboardingApi";
import { getFileUrl } from "@/lib/utils";


interface DocumentUploadCardProps {
  title: string;
  documentType: string;
  required?: boolean;
  existingDoc?: {
    id: string;
    document_url: string;
    status: string;
  } | null;
  onUploadSuccess: () => void;
  onDeleteSuccess: () => void;
}

export function DocumentUploadCard({
  title,
  documentType,
  required = false,
  existingDoc,
  onUploadSuccess,
  onDeleteSuccess,
}: DocumentUploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    setUploading(true);
    setProgress(20);

    try {
      setProgress(50);
      const response = await employeeOnboardingApi.uploadFile(file, documentType);
      setProgress(100);
      if (response.success) {
        toast.success(`${title} uploaded successfully.`);
        onUploadSuccess();
      } else {
        toast.error(response.message || "Failed to upload file.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred during file upload.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!existingDoc) return;
    try {
      const response = await employeeOnboardingApi.deleteFile(existingDoc.id);
      if (response.success) {
        toast.success("Document removed.");
        onDeleteSuccess();
      } else {
        toast.error(response.message || "Failed to delete document.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while deleting the document.");
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="h-3 w-3" /> Verified by HR
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-3 w-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-3 w-3" /> Pending Verification
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col rounded-xl bg-card/60 p-5 border border-border/40 backdrop-blur-md shadow-md transition-all hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-bold text-foreground">
            {title} {required && <span className="text-destructive">*</span>}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Supported formats: PDF, PNG, JPG, JPEG, WEBP, DOCX (Max 10MB)
          </p>
        </div>
        {existingDoc && getStatusBadge(existingDoc.status)}
      </div>

      <div className="mt-4 flex-1">
        {existingDoc ? (
          <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/40 p-3">
            <FileText className="h-8 w-8 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {title} File
              </p>
              <div className="flex gap-2 mt-1">
                <a
                  href={getFileUrl(existingDoc.document_url)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <Eye className="h-3.5 w-3.5" /> Preview
                </a>
                <a
                  href={getFileUrl(existingDoc.document_url)}
                  download
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>

              </div>
            </div>
            {existingDoc.status !== "VERIFIED" && (
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={triggerUpload}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={triggerUpload}
            className="flex flex-col items-center justify-center border-2 border-dashed border-border/60 hover:border-primary/50 bg-muted/20 hover:bg-muted/30 rounded-lg p-6 cursor-pointer transition-all"
          >
            {uploading ? (
              <div className="w-full space-y-2 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm font-semibold text-foreground">Uploading File... {progress}%</p>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-bold text-foreground">Drag & Drop or Click to Upload</p>
                <p className="text-xs text-muted-foreground mt-1">Choose file from local disk</p>
              </>
            )}
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.png,.jpg,.jpeg,.webp,.docx"
        className="hidden"
      />
    </div>
  );
}

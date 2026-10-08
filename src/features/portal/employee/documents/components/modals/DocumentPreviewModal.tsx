import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, FileText } from "lucide-react";
import type { EmployeeDocument } from "../../types";

interface DocumentPreviewModalProps {
  open: boolean;
  onClose: () => void;
  selectedDoc: EmployeeDocument | null;
  isPreviewLoading: boolean;
  previewBlobUrl: string | null;
  onDownload: (doc: EmployeeDocument) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  open,
  onClose,
  selectedDoc,
  isPreviewLoading,
  previewBlobUrl,
  onDownload,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pr-6">
            <span className="truncate">{selectedDoc?.title || "Document Preview"}</span>
            {selectedDoc && (
              <Button
                onClick={() => onDownload(selectedDoc)}
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs h-8"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </Button>
            )}
          </DialogTitle>
          <DialogDescription>
            Category: {selectedDoc?.category || "General"} · Type: {selectedDoc?.type || "Document"}
            {selectedDoc?.uploadedAt &&
              ` · Uploaded: ${new Date(selectedDoc.uploadedAt).toLocaleDateString()}`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-[400px] max-h-[650px] overflow-auto rounded-lg border border-border bg-muted/20 p-2 flex items-center justify-center">
          {isPreviewLoading ? (
            <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground text-sm py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <span>Loading document stream from backend storage...</span>
            </div>
          ) : previewBlobUrl ? (
            selectedDoc?.fileName?.toLowerCase().endsWith(".pdf") ||
            selectedDoc?.fileUrl?.toLowerCase().endsWith(".pdf") ||
            !selectedDoc?.fileName?.match(/\.(png|jpe?g|webp|gif)$/i) ? (
              <iframe
                src={previewBlobUrl}
                title="Document Preview"
                className="w-full h-[550px] rounded border-0"
              />
            ) : (
              <img
                src={previewBlobUrl}
                alt={selectedDoc?.title || "Document"}
                className="max-h-[550px] max-w-full object-contain rounded"
              />
            )
          ) : (
            <div className="text-center py-12 space-y-2">
              <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto" />
              <p className="text-sm text-muted-foreground">
                Preview not directly displayable in browser.
              </p>
              {selectedDoc && (
                <Button
                  onClick={() => onDownload(selectedDoc)}
                  size="sm"
                  className="gap-1.5 mt-2"
                >
                  <Download className="h-3.5 w-3.5" /> Download Stored File
                </Button>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="pt-2 flex justify-between items-center sm:justify-between">
          <div className="text-xs text-muted-foreground">
            Status: <span className="font-semibold text-foreground">{selectedDoc?.status}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

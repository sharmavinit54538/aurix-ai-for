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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Upload, AlertCircle } from "lucide-react";
import type { EmployeeDocument } from "../../types";

interface ReuploadDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDoc: EmployeeDocument | null;
  reuploadInputRef: React.RefObject<HTMLInputElement | null>;
  setReuploadFile: (file: File | null) => void;
  isSubmittingReupload: boolean;
  handleReuploadSubmit: (e: React.FormEvent) => void;
}

export const ReuploadDocumentModal: React.FC<ReuploadDocumentModalProps> = ({
  open,
  onOpenChange,
  selectedDoc,
  reuploadInputRef,
  setReuploadFile,
  isSubmittingReupload,
  handleReuploadSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Re-upload Document</DialogTitle>
          <DialogDescription>
            This document was rejected by HR. Please review the reason below and upload a corrected
            file.
          </DialogDescription>
        </DialogHeader>

        {selectedDoc?.rejectionReason && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
            <div className="font-semibold flex items-center gap-1.5 mb-1">
              <AlertCircle className="h-3.5 w-3.5" /> Rejection Reason from HR:
            </div>
            <p className="leading-relaxed">{selectedDoc.rejectionReason}</p>
          </div>
        )}

        <form onSubmit={handleReuploadSubmit} className="space-y-4 pt-2">
          <div>
            <Label className="text-xs font-semibold">Document</Label>
            <div className="mt-1 text-xs font-medium text-foreground">
              {selectedDoc?.title || selectedDoc?.fileName}
            </div>
            <div className="text-[11px] text-muted-foreground">
              Category: {selectedDoc?.category || "General"} · Type:{" "}
              {selectedDoc?.type || "Document"}
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold">Select Clear / Corrected File *</Label>
            <Input
              ref={reuploadInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.docx"
              onChange={(e) => setReuploadFile(e.target.files?.[0] || null)}
              className="mt-1 text-xs cursor-pointer"
              required
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Supported formats: PDF, PNG, JPG, DOCX (Max 10MB)
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmittingReupload}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-primary text-primary-foreground gap-1.5"
              disabled={isSubmittingReupload}
            >
              {isSubmittingReupload ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5" /> Submit Re-upload
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

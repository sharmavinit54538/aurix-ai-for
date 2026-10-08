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
import { AlertTriangle, Trash2 } from "lucide-react";
import type { EmployeeDocument } from "../../types";

interface DeleteDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDoc: EmployeeDocument | null;
  onConfirmDelete: () => void;
}

export const DeleteDocumentModal: React.FC<DeleteDocumentModalProps> = ({
  open,
  onOpenChange,
  selectedDoc,
  onConfirmDelete,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rose-500">
            <AlertTriangle className="h-5 w-5" /> Confirm Document Deletion
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              "{selectedDoc?.title || selectedDoc?.fileName}"
            </span>
            ? This will remove the document permanently from your employee records.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0 pt-2">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={onConfirmDelete}
            className="gap-1.5"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete Document
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

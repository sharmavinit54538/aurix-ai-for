import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { DocumentItem } from "../lib/types";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetDoc: DocumentItem | null;
  onConfirmDelete: (doc: DocumentItem) => Promise<void>;
  isDeleting: boolean;
}

export const DeleteDialog: React.FC<DeleteDialogProps> = ({
  open,
  onOpenChange,
  targetDoc,
  onConfirmDelete,
  isDeleting,
}) => {
  const handleDelete = async () => {
    if (!targetDoc) return;
    try {
      await onConfirmDelete(targetDoc);
      onOpenChange(false);
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-background border-border shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-foreground">
            Delete Document
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Are you sure you want to permanently delete{" "}
            <strong className="text-foreground">{targetDoc?.title}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
            className="h-9 border-border bg-transparent cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="h-9 bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
          >
            {isDeleting ? "Deleting..." : "Delete Permanently"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

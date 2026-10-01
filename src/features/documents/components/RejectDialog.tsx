import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { validateComments } from "../lib/validation";
import type { DocumentItem } from "../lib/types";

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetDoc: DocumentItem | null;
  onConfirmReject: (id: string, comments: string) => Promise<void>;
  isRejecting: boolean;
}

export const RejectDialog: React.FC<RejectDialogProps> = ({
  open,
  onOpenChange,
  targetDoc,
  onConfirmReject,
  isRejecting,
}) => {
  const [comments, setComments] = useState("");
  const [error, setError] = useState<string | null>(null);

  const charCount = comments.length;
  const maxChars = 1000;

  const handleSubmit = async () => {
    if (!targetDoc) return;
    const val = validateComments(comments, "Rejection reason");
    if (!val.valid) {
      setError(val.error || "Please enter a reason.");
      return;
    }

    try {
      await onConfirmReject(targetDoc.id, comments.trim());
      onOpenChange(false);
      setComments("");
      setError(null);
    } catch {
      // Error handled in mutation toast
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-foreground">
            Reject Document
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Please provide a specific compliance reason for rejecting{" "}
            <strong className="text-foreground">{targetDoc?.title}</strong>. The employee will see this feedback.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Textarea
            value={comments}
            onChange={(e) => {
              setComments(e.target.value);
              if (error) setError(null);
            }}
            maxLength={maxChars}
            placeholder="e.g. Document image is blurred, expiration date has passed, or official seal is cut off..."
            className="min-h-[100px] border-border text-xs"
            aria-label="Rejection comments"
          />

          <div className="flex justify-between items-center text-[10px] text-muted-foreground">
            <span>{error ? <span className="text-rose-500">{error}</span> : "Required field (1–1000 characters)"}</span>
            <span className={charCount > maxChars ? "text-rose-500 font-bold" : ""}>
              {charCount}/{maxChars}
            </span>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isRejecting}
            onClick={() => onOpenChange(false)}
            className="h-9 border-border bg-transparent cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isRejecting || !comments.trim()}
            onClick={handleSubmit}
            className="h-9 bg-rose-600 text-white hover:bg-rose-700 cursor-pointer"
          >
            {isRejecting ? "Rejecting..." : "Confirm Rejection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

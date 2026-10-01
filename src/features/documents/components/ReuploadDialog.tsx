import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { validateComments } from "../lib/validation";
import type { DocumentItem } from "../lib/types";

interface ReuploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetDoc: DocumentItem | null;
  onConfirmReupload: (id: string, comments: string) => Promise<void>;
  isRequesting: boolean;
}

export const ReuploadDialog: React.FC<ReuploadDialogProps> = ({
  open,
  onOpenChange,
  targetDoc,
  onConfirmReupload,
  isRequesting,
}) => {
  const [comments, setComments] = useState("Re-upload requested. Please supply a clear copy.");
  const [error, setError] = useState<string | null>(null);

  const charCount = comments.length;
  const maxChars = 1000;

  const handleSubmit = async () => {
    if (!targetDoc) return;
    const val = validateComments(comments, "Re-upload instructions");
    if (!val.valid) {
      setError(val.error || "Please enter re-upload instructions.");
      return;
    }

    try {
      await onConfirmReupload(targetDoc.id, comments.trim());
      onOpenChange(false);
      setError(null);
    } catch {
      // Error handled in mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl p-6">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-foreground">
            Request Document Re-upload
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Provide instructions for the employee regarding why a re-upload of{" "}
            <strong className="text-foreground">{targetDoc?.title}</strong> is needed.
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
            placeholder="e.g. Please provide a clear color scan showing both sides with all four corners visible."
            className="min-h-[100px] border-border text-xs"
            aria-label="Re-upload instructions"
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
            disabled={isRequesting}
            onClick={() => onOpenChange(false)}
            className="h-9 border-border bg-transparent cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isRequesting || !comments.trim()}
            onClick={handleSubmit}
            className="h-9 bg-amber-600 text-white hover:bg-amber-700 cursor-pointer"
          >
            {isRequesting ? "Submitting..." : "Send Re-upload Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

import React from "react";
import { AlertCircle, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnsavedChangesBannerProps {
  isDirty: boolean;
  submitting: boolean;
  onReset: () => void;
  onSave: () => void;
  className?: string;
}

export function UnsavedChangesBanner({
  isDirty,
  submitting,
  onReset,
  onSave,
  className = "",
}: UnsavedChangesBannerProps) {
  if (!isDirty) return null;

  return (
    <div
      className={`sticky bottom-4 z-30 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/40 bg-card/95 p-3.5 shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 ${className}`}
      role="region"
      aria-label="Unsaved changes warning"
    >
      <div className="flex items-center gap-2.5">
        <div className="grid h-7 w-7 place-items-center rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0">
          <AlertCircle className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">You have unsaved changes</p>
          <p className="text-[11px] text-muted-foreground">
            Remember to save before navigating to another section.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={submitting}
          className="h-8 gap-1.5 text-xs cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Discard
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onSave}
          disabled={submitting}
          className="h-8 gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs"
        >
          <Save className="h-3.5 w-3.5" />
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

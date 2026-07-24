import { Button } from "@/components/ui/button";
import { RefreshCw, Save } from "lucide-react";

interface StickySaveBarProps {
  isDirty: boolean;
  submitting: boolean;
  onReset: () => void;
}

export function StickySaveBar({ isDirty, submitting, onReset }: StickySaveBarProps) {
  if (!isDirty) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between border-t border-border bg-card/80 p-4 px-6 backdrop-blur-xl md:left-[256px]">
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-foreground">You have unsaved changes</span>
        <span className="text-xs text-muted-foreground">Please save or discard your modifications before leaving this page.</span>
      </div>
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="sm" onClick={onReset} disabled={submitting}>
          Discard Changes
        </Button>
        <Button type="submit" size="sm" disabled={submitting}>
          {submitting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}

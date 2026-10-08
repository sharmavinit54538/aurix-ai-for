import { PowerOff, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { ExitCase } from "../../types";

interface ExitDetailSheetFooterProps {
  detailCase: ExitCase;
  onDeactivatePrompt: (exit: ExitCase) => void;
}

export function ExitDetailSheetFooter({
  detailCase,
  onDeactivatePrompt,
}: ExitDetailSheetFooterProps) {
  const canDeactivate = detailCase.stage !== "completed" && detailCase.stage !== "cancelled";

  return (
    <div className="p-4 border-t border-border bg-muted/10 shrink-0 flex gap-2 justify-end">
      {canDeactivate && (
        <Button
          variant="outline"
          onClick={() => onDeactivatePrompt(detailCase)}
          className="h-9 text-xs border-border bg-transparent hover:bg-destructive/10 hover:text-destructive cursor-pointer gap-1.5"
        >
          <PowerOff className="h-3.5 w-3.5" />
          Deactivate Login
        </Button>
      )}
      <Button
        variant="outline"
        onClick={() => {
          toast.success("Exit report exported as PDF.");
        }}
        className="h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer gap-1.5"
      >
        <FileText className="h-3.5 w-3.5" />
        Print PDF Summary
      </Button>
    </div>
  );
}

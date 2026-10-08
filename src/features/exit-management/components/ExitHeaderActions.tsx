import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExitHeaderActionsProps {
  onExport: () => void;
  onCreateClick: () => void;
}

export function ExitHeaderActions({ onExport, onCreateClick }: ExitHeaderActionsProps) {
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onExport}
        className="h-8 gap-1.5 text-xs cursor-pointer"
      >
        <Download className="h-3.5 w-3.5" />
        Export
      </Button>
      <Button
        size="sm"
        onClick={onCreateClick}
        className="h-8 gap-1.5 text-xs cursor-pointer"
      >
        <Plus className="h-3.5 w-3.5" />
        Create Exit Request
      </Button>
    </div>
  );
}

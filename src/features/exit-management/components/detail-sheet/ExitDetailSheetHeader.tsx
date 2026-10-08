import { Badge } from "@/components/ui/badge";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { STAGE_BADGES, getExitBadge } from "../../constants";
import type { ExitCase } from "../../types";

interface ExitDetailSheetHeaderProps {
  detailCase: ExitCase;
}

export function ExitDetailSheetHeader({ detailCase }: ExitDetailSheetHeaderProps) {
  const badge = STAGE_BADGES[detailCase.stage] || { label: detailCase.stage };

  return (
    <SheetHeader className="p-5 border-b border-border bg-muted/10 shrink-0 text-left">
      <div className="flex items-center justify-between">
        <Badge
          variant="outline"
          className="text-[10px] uppercase font-bold text-muted-foreground border-border"
        >
          {detailCase.department || "Operations"}
        </Badge>
        <Badge
          className={`${getExitBadge(detailCase.stage)} border shadow-none text-xs font-bold`}
        >
          {badge.label}
        </Badge>
      </div>
      <SheetTitle
        className="font-display text-base font-bold text-foreground mt-2 truncate text-left"
        title={detailCase.employee}
      >
        {detailCase.employee} ({detailCase.employeeId})
      </SheetTitle>
      <SheetDescription className="text-xs text-muted-foreground text-left mt-0.5">
        Resigned Date: {detailCase.resignedAt} &bull; LWD: {detailCase.lastWorkingDay}
      </SheetDescription>
    </SheetHeader>
  );
}

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { STAGE_BADGES, getExitBadge } from "../../constants";
import type { ExitCase } from "../../types";

interface ExitPipelineTableRowProps {
  exit: ExitCase;
  onRowClick: (exit: ExitCase) => void;
  onApprove: (exit: ExitCase, stageType: "manager" | "hr") => void;
  onReject: (exit: ExitCase) => void;
  onStartClearance: (exit: ExitCase) => void;
  onDeactivatePrompt: (exit: ExitCase) => void;
}

export function ExitPipelineTableRow({
  exit,
  onRowClick,
  onApprove,
  onReject,
  onStartClearance,
  onDeactivatePrompt,
}: ExitPipelineTableRowProps) {
  const badge = STAGE_BADGES[exit.stage] || { label: exit.stage };

  return (
    <TableRow
      key={exit.id}
      className="group border-t border-border transition-colors hover:bg-accent/20 cursor-pointer"
      onClick={() => onRowClick(exit)}
    >
      <TableCell className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-foreground font-bold text-xs">
            {exit.employee
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </span>
          <div className="font-semibold text-foreground truncate max-w-[150px]">
            {exit.employee}
          </div>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 font-mono text-xs text-foreground/80">
        {exit.employeeId || "—"}
      </TableCell>
      <TableCell className="px-4 py-3 text-xs text-muted-foreground">
        {exit.department || "Operations"}
      </TableCell>
      <TableCell className="px-4 py-3 text-xs text-foreground/80">
        {exit.managerName || "—"}
      </TableCell>
      <TableCell className="px-4 py-3 text-xs text-muted-foreground">
        {exit.resignedAt}
      </TableCell>
      <TableCell className="px-4 py-3 text-xs font-semibold text-foreground/95">
        {exit.lastWorkingDay}
      </TableCell>
      <TableCell className="px-4 py-3 text-center text-xs text-muted-foreground">
        {exit.noticeDays}
      </TableCell>
      <TableCell className="px-4 py-3 text-center text-xs font-semibold">
        {exit.remainingDays !== undefined ? (
          <span
            className={
              exit.remainingDays <= 15 && exit.remainingDays > 0
                ? "text-foreground font-bold"
                : "text-foreground"
            }
          >
            {exit.remainingDays} days
          </span>
        ) : (
          "—"
        )}
      </TableCell>
      <TableCell className="px-4 py-3 text-center">
        <Badge
          className={`${getExitBadge(exit.stage)} border shadow-none text-[11px] font-semibold`}
        >
          {badge.label}
        </Badge>
      </TableCell>
      <TableCell
        className="px-4 py-3 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end gap-1 opacity-80 group-hover:opacity-100">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onRowClick(exit)}
            className="h-7 text-[10px] border-border cursor-pointer hover:bg-accent/65"
          >
            View
          </Button>
          {exit.stage === "requested" && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onApprove(exit, "hr")}
                className="h-7 text-[10px] text-emerald-600 dark:text-emerald-400 border-border cursor-pointer"
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReject(exit)}
                className="h-7 text-[10px] text-destructive border-destructive/30 cursor-pointer"
              >
                Reject
              </Button>
            </>
          )}
          {exit.stage === "notice" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStartClearance(exit)}
              className="h-7 text-[10px] text-emerald-600 dark:text-emerald-400 border-border cursor-pointer"
            >
              Clearance
            </Button>
          )}
          {exit.stage === "settlement" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDeactivatePrompt(exit)}
              className="h-7 text-[10px] text-destructive border-destructive/30 cursor-pointer"
              title="Mark Completed & Archive"
            >
              Archive
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

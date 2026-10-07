import { Eye, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { renderSeverityBadge } from "../../../utils/payrollValidation.utils";

interface ValidationIssueRowProps {
  issue: any;
  runId: string;
  onViewIssue: (issue: any) => void;
  onViewPayroll: (employeeId: string) => void;
}

export function ValidationIssueRow({
  issue,
  runId,
  onViewIssue,
  onViewPayroll,
}: ValidationIssueRowProps) {
  const badge = renderSeverityBadge(issue.severity);

  return (
    <TableRow
      key={issue.id}
      className="text-xs hover:bg-muted/30 cursor-pointer"
      onClick={() => onViewIssue(issue)}
    >
      <TableCell>
        <Badge variant={badge.variant as any} className={badge.className}>
          {badge.label}
        </Badge>
      </TableCell>

      <TableCell className="font-medium text-foreground">
        {issue.employeeName || issue.employeeId ? (
          <div>
            <div className="flex items-center gap-1.5">
              <span>{issue.employeeName || "—"}</span>
              {issue.department ? (
                <Badge
                  variant="outline"
                  className="text-[9px] bg-muted/40 font-normal px-1.5 py-0"
                >
                  {issue.department}
                </Badge>
              ) : null}
            </div>
            {issue.employeeId ? (
              <div className="font-mono text-[10px] text-muted-foreground">
                {issue.employeeId}
              </div>
            ) : null}
          </div>
        ) : (
          <span className="text-muted-foreground italic">Run-Level Check</span>
        )}
      </TableCell>

      <TableCell className="max-w-md">
        <div className="line-clamp-2 text-foreground font-normal leading-relaxed">
          {issue.message}
        </div>
        {issue.code ? (
          <div className="font-mono text-[9px] text-muted-foreground mt-0.5">
            Rule: {issue.code}
          </div>
        ) : null}
      </TableCell>

      <TableCell>
        <Badge
          variant="outline"
          className="text-[10px] bg-muted/40 font-normal"
        >
          {issue.category || "General"}
        </Badge>
      </TableCell>

      <TableCell className="text-muted-foreground">
        {issue.component || "—"}
      </TableCell>

      <TableCell>
        {issue.blocking !== undefined ? (
          issue.blocking ? (
            <Badge
              variant="outline"
              className="text-[9px] border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold"
            >
              Blocking
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-[9px] border-border bg-muted/40 text-muted-foreground"
            >
              Non-blocking
            </Badge>
          )
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>

      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
        {issue.employeeId ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              onViewPayroll(issue.employeeId)
            }
            className="h-7 text-xs text-primary hover:text-primary gap-1"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>View Payroll</span>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
          >
            <Info className="h-3.5 w-3.5" />
            <span>Details</span>
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { statusBadgeClass } from "@/lib/status-styles";
import type { ExitCase } from "../../../types";

interface DeptClearanceTableProps {
  detailCase: ExitCase;
  onDeptClearanceStatus: (
    exit: ExitCase,
    dept: "HR" | "IT" | "Finance" | "Admin" | "Manager",
    status: "approved" | "rejected",
    comments: string,
  ) => void;
}

export function DeptClearanceTable({
  detailCase,
  onDeptClearanceStatus,
}: DeptClearanceTableProps) {
  const clearanceList = detailCase.clearanceWorkflow || [];

  return (
    <div className="space-y-2 text-left">
      <Label className="text-xs font-semibold text-muted-foreground">
        Department-wise clearance sign-offs
      </Label>
      <div className="rounded-xl border border-border bg-card p-0 overflow-hidden">
        <Table className="text-xs border-collapse">
          <TableHeader className="bg-muted/10 border-b border-border">
            <TableRow>
              <TableHead className="px-3 py-2 w-[120px]">Department</TableHead>
              <TableHead className="px-3 py-2">Clearance Status</TableHead>
              <TableHead className="px-3 py-2">Approver Comments</TableHead>
              <TableHead className="px-3 py-2 text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clearanceList.map((clear) => (
              <TableRow key={clear.department} className="border-t border-border">
                <TableCell className="px-3 py-2 font-bold">{clear.department}</TableCell>
                <TableCell className="px-3 py-2">
                  {clear.status === "approved" ? (
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold ${statusBadgeClass("approved")}`}
                    >
                      Cleared
                    </Badge>
                  ) : clear.status === "rejected" ? (
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20 font-semibold text-[10px]">
                      Flagged
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold ${statusBadgeClass("warning")}`}
                    >
                      Clearance Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell
                  className="px-3 py-2 text-muted-foreground text-[11px] truncate max-w-[150px]"
                  title={clear.comments}
                >
                  {clear.comments || "—"}
                </TableCell>
                <TableCell className="px-3 py-2 text-right">
                  {clear.status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        onDeptClearanceStatus(
                          detailCase,
                          clear.department as any,
                          "approved",
                          "Dues checks compiled.",
                        )
                      }
                      className="h-6 text-[9px] px-1.5 border-border cursor-pointer hover:bg-muted"
                    >
                      Approve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

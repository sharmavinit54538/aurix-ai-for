import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AssetAssignmentHistory } from "@/lib/hrms/types";

interface AssetAssignmentHistoryTableProps {
  history: AssetAssignmentHistory[];
}

export function AssetAssignmentHistoryTable({ history }: AssetAssignmentHistoryTableProps) {
  return (
    <div className="space-y-2 text-left">
      <Label className="text-xs font-semibold text-muted-foreground">Assignment History Logs</Label>
      <div className="rounded-xl border border-border bg-card/40 p-0 overflow-hidden">
        <Table className="text-[11px] border-collapse">
          <TableHeader className="bg-muted/10 border-b border-border">
            <TableRow>
              <TableHead className="px-3 py-2 w-[120px]">Employee</TableHead>
              <TableHead className="px-3 py-2">Department</TableHead>
              <TableHead className="px-3 py-2">Assign Date</TableHead>
              <TableHead className="px-3 py-2">Return Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground italic">
                  No allocation logs recorded.
                </TableCell>
              </TableRow>
            ) : (
              history.map((hist) => (
                <TableRow key={hist.id} className="border-t border-border">
                  <TableCell className="px-3 py-2 font-semibold">{hist.employee}</TableCell>
                  <TableCell className="px-3 py-2 text-muted-foreground">{hist.department}</TableCell>
                  <TableCell className="px-3 py-2 text-muted-foreground">{hist.assignDate}</TableCell>
                  <TableCell className="px-3 py-2">
                    {hist.actualReturnDate ? (
                      <span className="text-emerald-500">{hist.actualReturnDate}</span>
                    ) : (
                      <span className="text-amber-500 font-semibold">Active</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

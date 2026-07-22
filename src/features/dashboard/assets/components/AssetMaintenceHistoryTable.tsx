import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AssetMaintenanceRecord } from "@/lib/hrms/types";

interface AssetMaintenanceHistoryTableProps {
  history: AssetMaintenanceRecord[];
}

export function AssetMaintenanceHistoryTable({ history }: AssetMaintenanceHistoryTableProps) {
  return (
    <div className="space-y-2 text-left">
      <Label className="text-xs font-semibold text-muted-foreground">Maintenance Repair logs</Label>
      <div className="rounded-xl border border-border bg-card/40 p-0 overflow-hidden">
        <Table className="text-[11px] border-collapse">
          <TableHeader className="bg-muted/10 border-b border-border">
            <TableRow>
              <TableHead className="px-3 py-2 w-[100px]">Service Date</TableHead>
              <TableHead className="px-3 py-2">Vendor Partner</TableHead>
              <TableHead className="px-3 py-2 text-right">Cost</TableHead>
              <TableHead className="px-3 py-2">Issues / Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground italic">
                  No maintenance history logs found.
                </TableCell>
              </TableRow>
            ) : (
              history.map((mr) => (
                <TableRow key={mr.id} className="border-t border-border">
                  <TableCell className="px-3 py-2 font-mono">{mr.serviceDate}</TableCell>
                  <TableCell className="px-3 py-2 text-muted-foreground">{mr.vendor}</TableCell>
                  <TableCell className="px-3 py-2 text-right text-amber-500 font-semibold">${mr.cost}</TableCell>
                  <TableCell className="px-3 py-2 text-muted-foreground truncate max-w-[120px]" title={mr.notes}>
                    {mr.notes || "—"}
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

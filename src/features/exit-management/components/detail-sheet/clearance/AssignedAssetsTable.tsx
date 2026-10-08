import { CheckCircle2 } from "lucide-react";
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

interface AssignedAssetsTableProps {
  detailCase: ExitCase;
  onAssetReturnStatus: (
    exit: ExitCase,
    recordId: string,
    status: "returned" | "damaged" | "missing",
    remarks: string,
  ) => void;
}

export function AssignedAssetsTable({
  detailCase,
  onAssetReturnStatus,
}: AssignedAssetsTableProps) {
  const assets = detailCase.assignedAssets || [];
  const allReturned = assets.length > 0 && assets.every((a) => a.status === "returned");

  return (
    <div className="space-y-2 text-left">
      <div className="flex justify-between items-center">
        <Label className="text-xs font-semibold text-muted-foreground">
          Assigned hardware inventory clearance
        </Label>
        {allReturned && (
          <span className="text-[11px] font-bold text-foreground flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> Asset Clearance Completed
          </span>
        )}
      </div>
      <div className="rounded-xl border border-border bg-card p-0 overflow-hidden">
        <Table className="text-xs border-collapse">
          <TableHeader className="bg-muted/10 border-b border-border">
            <TableRow>
              <TableHead className="px-3 py-2 w-[160px]">Hardware Asset</TableHead>
              <TableHead className="px-3 py-2">Serial</TableHead>
              <TableHead className="px-3 py-2 text-center">Status</TableHead>
              <TableHead className="px-3 py-2 text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground italic">
                  No assets registered under checkout.
                </TableCell>
              </TableRow>
            ) : (
              assets.map((ast) => (
                <TableRow key={ast.id} className="border-t border-border">
                  <TableCell className="px-3 py-2">
                    <div className="font-semibold">{ast.assetName}</div>
                    <span className="text-[10px] text-muted-foreground capitalize">
                      {ast.category}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-2 font-mono text-[11px] text-muted-foreground">
                    {ast.serial}
                  </TableCell>
                  <TableCell className="px-3 py-2 text-center">
                    {ast.status === "returned" ? (
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${statusBadgeClass("approved")}`}
                      >
                        Returned
                      </Badge>
                    ) : ast.status === "damaged" ? (
                      <Badge className="bg-destructive/10 text-destructive border-destructive/20 font-semibold text-[10px]">
                        Damaged
                      </Badge>
                    ) : ast.status === "missing" ? (
                      <Badge className="bg-destructive/10 text-destructive border-destructive/20 font-semibold text-[10px]">
                        Missing
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${statusBadgeClass("warning")}`}
                      >
                        Pending Return
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="px-3 py-2 text-right">
                    {ast.status === "pending" && (
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            onAssetReturnStatus(
                              detailCase,
                              ast.id,
                              "returned",
                              "Good condition.",
                            )
                          }
                          className="h-6 text-[9px] px-1.5 border-border cursor-pointer hover:bg-muted"
                        >
                          Return
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            onAssetReturnStatus(
                              detailCase,
                              ast.id,
                              "damaged",
                              "Screen scratch",
                            )
                          }
                          className="h-6 text-[9px] px-1.5 border-border cursor-pointer hover:bg-destructive/10 text-destructive"
                        >
                          Damage
                        </Button>
                      </div>
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

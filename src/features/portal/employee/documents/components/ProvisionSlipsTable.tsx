import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, FileText, Eye, Download } from "lucide-react";
import type { ProvisionSlip } from "../types";

interface ProvisionSlipsTableProps {
  isLoadingProvision: boolean;
  filteredProvisionSlips: ProvisionSlip[];
  currentUserName?: string;
  onViewProvision: (slip: ProvisionSlip) => void;
  onDownloadProvision: (slip: ProvisionSlip) => void;
}

export const ProvisionSlipsTable: React.FC<ProvisionSlipsTableProps> = ({
  isLoadingProvision,
  filteredProvisionSlips,
  currentUserName,
  onViewProvision,
  onDownloadProvision,
}) => {
  if (isLoadingProvision) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        Loading provision slips from backend...
      </div>
    );
  }

  if (filteredProvisionSlips.length === 0) {
    return (
      <div className="py-16 text-center space-y-3">
        <FileText className="h-10 w-10 text-muted-foreground/40 mx-auto" />
        <h3 className="font-semibold text-base">No Provision Slips Available</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Your provision slips will appear here once they are generated.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="text-xs font-semibold">Provision Slip Number</TableHead>
            <TableHead className="text-xs font-semibold">Pay Period / Month</TableHead>
            <TableHead className="text-xs font-semibold">Employee Name</TableHead>
            <TableHead className="text-xs font-semibold text-right">Provisioned Amount</TableHead>
            <TableHead className="text-xs font-semibold">Generated Date</TableHead>
            <TableHead className="text-xs font-semibold">Status</TableHead>
            <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProvisionSlips.map((slip) => (
            <TableRow key={slip.id} className="hover:bg-muted/20">
              <TableCell className="font-mono text-xs font-medium">
                {slip.slipNumber || `PRV-${slip.id.slice(0, 8).toUpperCase()}`}
              </TableCell>
              <TableCell className="text-xs font-medium">{slip.periodName || "—"}</TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {slip.employeeName || currentUserName}
              </TableCell>
              <TableCell className="text-xs text-right font-bold text-amber-500">
                {slip.provisionedAmount != null
                  ? `₹${slip.provisionedAmount.toLocaleString("en-IN")}`
                  : "—"}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {slip.generatedAt
                  ? new Date(slip.generatedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </TableCell>
              <TableCell className="text-xs">
                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[11px] capitalize">
                  {slip.status || "Provisional"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    onClick={() => onViewProvision(slip)}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" /> View
                  </Button>
                  <Button
                    onClick={() => onDownloadProvision(slip)}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Download className="h-3.5 w-3.5 mr-1" /> Download
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

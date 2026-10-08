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
import { RefreshCw, FileSpreadsheet, Receipt, Eye, Download } from "lucide-react";
import type { SalarySlipRecord } from "../types";

interface SalarySlipsTableProps {
  isLoadingSalary: boolean;
  filteredSalarySlips: SalarySlipRecord[];
  onViewSlip: (slip: SalarySlipRecord) => void;
  onDownloadSlip: (slip: SalarySlipRecord) => void;
}

export const SalarySlipsTable: React.FC<SalarySlipsTableProps> = ({
  isLoadingSalary,
  filteredSalarySlips,
  onViewSlip,
  onDownloadSlip,
}) => {
  if (isLoadingSalary) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        Loading salary slips from payroll backend...
      </div>
    );
  }

  if (filteredSalarySlips.length === 0) {
    return (
      <div className="py-16 text-center space-y-3">
        <FileSpreadsheet className="h-10 w-10 text-muted-foreground/40 mx-auto" />
        <h3 className="font-semibold text-base">No Salary Slips Available</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Your salary slips will appear here once official payroll runs are finalized and
          disbursed.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead className="text-xs font-semibold">Pay Period / Month</TableHead>
            <TableHead className="text-xs font-semibold">Payslip Number</TableHead>
            <TableHead className="text-xs font-semibold text-right">Gross Salary</TableHead>
            <TableHead className="text-xs font-semibold text-right">Deductions</TableHead>
            <TableHead className="text-xs font-semibold text-right">Net Salary</TableHead>
            <TableHead className="text-xs font-semibold">Generated Date</TableHead>
            <TableHead className="text-xs font-semibold">Status</TableHead>
            <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSalarySlips.map((slip) => (
            <TableRow key={slip.id} className="hover:bg-muted/20">
              <TableCell className="font-medium text-xs">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{slip.periodName}</span>
                </div>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground font-mono">
                {slip.payslipNumber || "—"}
              </TableCell>
              <TableCell className="text-xs text-right font-medium">
                {slip.grossSalary != null ? `₹${slip.grossSalary.toLocaleString("en-IN")}` : "—"}
              </TableCell>
              <TableCell className="text-xs text-right font-medium text-rose-500">
                {slip.deductions != null ? `₹${slip.deductions.toLocaleString("en-IN")}` : "—"}
              </TableCell>
              <TableCell className="text-xs text-right font-bold text-emerald-500">
                {slip.netSalary != null ? `₹${slip.netSalary.toLocaleString("en-IN")}` : "—"}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {slip.generatedDate
                  ? new Date(slip.generatedDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </TableCell>
              <TableCell className="text-xs">
                <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[11px] capitalize">
                  {slip.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <Button
                    onClick={() => onViewSlip(slip)}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                    title="View Details"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" /> View
                  </Button>
                  <Button
                    onClick={() => onDownloadSlip(slip)}
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                    title="Download Payslip PDF"
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

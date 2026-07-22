import React from "react";
import { Eye, RefreshCw, CheckCircle, FileText, Download, MoreHorizontal, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BankTransferItem } from "@/services/bankTransfersApi";

interface BankTransfersTableProps {
  items: BankTransferItem[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onViewDetails: (item: BankTransferItem) => void;
  onRetry: (item: BankTransferItem) => void;
  onMarkPaid: (item: BankTransferItem) => void;
  isReadOnly?: boolean;
}

export const BankTransfersTable: React.FC<BankTransfersTableProps> = ({
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onViewDetails,
  onRetry,
  onMarkPaid,
  isReadOnly = false,
}) => {
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  return (
    <div className="p-6 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md space-y-4 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-muted/40 text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
            <tr>
              <th className="p-3 w-10">
                <Checkbox checked={isAllSelected} onCheckedChange={onToggleSelectAll} />
              </th>
              <th className="p-3">Employee</th>
              <th className="p-3">Department</th>
              <th className="p-3">Bank Name</th>
              <th className="p-3">Masked Account Number</th>
              <th className="p-3">IFSC Code</th>
              <th className="p-3">Net Salary</th>
              <th className="p-3">Batch Code</th>
              <th className="p-3">Reference No</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-medium">
            {items.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-8 text-center text-xs text-muted-foreground">
                  No salary disbursement records found matching filters.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-muted/20 transition-colors ${
                      isSelected ? "bg-cyan-500/10" : ""
                    }`}
                  >
                    <td className="p-3">
                      <Checkbox checked={isSelected} onCheckedChange={() => onToggleSelect(item.id)} />
                    </td>
                    <td className="p-3 font-semibold text-foreground">
                      <div>{item.employee_name}</div>
                      <div className="text-[10px] font-normal text-muted-foreground">{item.employee_id}</div>
                    </td>
                    <td className="p-3 text-muted-foreground">
                      <div>{item.department}</div>
                      <div className="text-[10px] text-muted-foreground/70">{item.designation}</div>
                    </td>
                    <td className="p-3 font-medium text-foreground">{item.bank_name}</td>
                    <td className="p-3 font-mono text-muted-foreground">{item.masked_account_number}</td>
                    <td className="p-3 font-mono text-muted-foreground">{item.ifsc}</td>
                    <td className="p-3 font-bold text-foreground">₹{item.net_salary.toLocaleString("en-IN")}</td>
                    <td className="p-3 font-mono text-[11px] text-muted-foreground">{item.batch_code}</td>
                    <td className="p-3 font-mono text-[11px] text-muted-foreground">{item.reference_number}</td>
                    <td className="p-3">
                      <Badge
                        className={
                          item.payment_status === "COMPLETED"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : item.payment_status === "PROCESSING"
                            ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/30"
                            : item.payment_status === "FAILED"
                            ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
                            : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                        }
                      >
                        {item.payment_status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs">
                          <DropdownMenuItem onClick={() => onViewDetails(item)}>
                            <Eye className="h-3.5 w-3.5 mr-2 text-cyan-400" />
                            View Details
                          </DropdownMenuItem>
                          {item.payment_status === "FAILED" && !isReadOnly && (
                            <DropdownMenuItem onClick={() => onRetry(item)}>
                              <RefreshCw className="h-3.5 w-3.5 mr-2 text-amber-400" />
                              Retry Transfer
                            </DropdownMenuItem>
                          )}
                          {item.payment_status !== "COMPLETED" && !isReadOnly && (
                            <DropdownMenuItem onClick={() => onMarkPaid(item)}>
                              <CheckCircle className="h-3.5 w-3.5 mr-2 text-emerald-400" />
                              Mark as Paid
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

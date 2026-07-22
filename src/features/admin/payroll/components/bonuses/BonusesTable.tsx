import React, { useState, useMemo } from "react";
import {
  MoreVertical,
  Eye,
  Edit,
  Check,
  X,
  Calculator,
  CreditCard,
  FileText,
  History,
  ArrowUpDown,
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BonusAward } from "./bonusesTypes";

interface BonusesTableProps {
  data: BonusAward[];
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onView: (bonus: BonusAward) => void;
  onEdit: (bonus: BonusAward) => void;
  onApprove: (bonus: BonusAward) => void;
  onReject: (bonus: BonusAward) => void;
  onRecalculate: (bonus: BonusAward) => void;
  onAddPayrollEntry: (bonus: BonusAward) => void;
  onGenerateLetter: (bonus: BonusAward) => void;
  onViewLogs: (bonus: BonusAward) => void;
}

export const BonusesTable: React.FC<BonusesTableProps> = ({
  data,
  selectedIds,
  onSelectToggle,
  onSelectAll,
  onView,
  onEdit,
  onApprove,
  onReject,
  onRecalculate,
  onAddPayrollEntry,
  onGenerateLetter,
  onViewLogs,
}) => {
  const [sortField, setSortField] = useState<keyof BonusAward>("updatedOn");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: keyof BonusAward) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / itemsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage]);

  const allSelected = data.length > 0 && selectedIds.length === data.length;

  const getApprovalBadge = (status: BonusAward["approvalStatus"]) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 gap-1"><ShieldCheck className="w-3 h-3" /> Approved</Badge>;
      case "PENDING_HR":
      case "PENDING_COMP":
      case "PENDING_FINANCE":
      case "PENDING_CFO":
      case "PENDING_CEO":
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 gap-1 animate-pulse">Governance Review</Badge>;
      case "REJECTED":
        return <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30 gap-1">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: BonusAward["paymentStatus"]) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30">Disbursed (Paid)</Badge>;
      case "SCHEDULED_PAYROLL":
        return <Badge className="bg-cyan-500/10 text-cyan-300 border-cyan-500/30 font-mono">Salary Cycle</Badge>;
      default:
        return <Badge variant="outline" className="text-slate-400">Unpaid</Badge>;
    }
  };

  if (data.length === 0) {
    return (
      <div className="bns-card p-12 flex flex-col items-center justify-center text-center my-4">
        <div className="p-4 rounded-full bg-slate-800/60 border border-white/10 text-slate-400 mb-3">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-white">No Bonus Awards Found</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md">
          No employee bonus awards match your filter criteria or search query. Try resetting filters or award a new bonus.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bns-table-wrapper">
        <table className="bns-table">
          <thead>
            <tr>
              <th className="w-10 text-center">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(ch) => onSelectAll(!!ch)}
                />
              </th>
              <th onClick={() => handleSort("bonusCode")} className="cursor-pointer">
                <div className="flex items-center gap-1.5">
                  Code & Cycle <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th onClick={() => handleSort("employeeName")} className="cursor-pointer">
                <div className="flex items-center gap-1.5">
                  Employee & ID <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th>Dept & Role</th>
              <th>Bonus Category</th>
              <th>Rating</th>
              <th onClick={() => handleSort("bonusAmount")} className="cursor-pointer text-right">
                <div className="flex items-center justify-end gap-1.5">
                  Bonus Amount <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="text-right">Net Payout</th>
              <th>Approval</th>
              <th>Payment</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => {
              const isSelected = selectedIds.includes(row.id);

              return (
                <tr key={row.id} className={isSelected ? "bg-amber-950/20" : ""}>
                  {/* Checkbox */}
                  <td className="text-center">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onSelectToggle(row.id)}
                    />
                  </td>

                  {/* Bonus Code & Cycle */}
                  <td>
                    <div className="flex flex-col gap-0.5">
                      <span
                        onClick={() => onView(row)}
                        className="font-mono font-semibold text-amber-400 hover:underline cursor-pointer text-xs"
                      >
                        {row.bonusCode}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate max-w-[140px]">{row.bonusCycle}</span>
                    </div>
                  </td>

                  {/* Employee Name & ID */}
                  <td>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-200">{row.employeeName}</span>
                      <span className="font-mono text-[10px] text-slate-400">{row.employeeCode}</span>
                    </div>
                  </td>

                  {/* Dept & Role */}
                  <td>
                    <div className="flex flex-col">
                      <span className="text-slate-300 font-medium">{row.department}</span>
                      <span className="text-[10px] text-slate-400">{row.designation}</span>
                    </div>
                  </td>

                  {/* Bonus Type */}
                  <td>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {row.bonusType}
                    </span>
                  </td>

                  {/* Performance Rating */}
                  <td>
                    <div className="flex items-center gap-1 font-mono text-xs font-bold text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-white/5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {row.performanceRating} / 5.0
                    </div>
                  </td>

                  {/* Bonus Amount */}
                  <td className="text-right font-mono font-bold text-white text-xs">
                    ₹{row.bonusAmount.toLocaleString("en-IN")}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      TDS Tax: ₹{row.taxImpact.toLocaleString("en-IN")}
                    </span>
                  </td>

                  {/* Net Payout */}
                  <td className="text-right font-mono font-bold text-emerald-400 text-xs">
                    ₹{row.netPayout.toLocaleString("en-IN")}
                  </td>

                  {/* Approval Status */}
                  <td>{getApprovalBadge(row.approvalStatus)}</td>

                  {/* Payment Status */}
                  <td>{getPaymentBadge(row.paymentStatus)}</td>

                  {/* Actions */}
                  <td className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-xs text-slate-200 w-52">
                        <DropdownMenuItem onClick={() => onView(row)} className="gap-2 cursor-pointer">
                          <Eye className="w-3.5 h-3.5 text-blue-400" /> View Award Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(row)} className="gap-2 cursor-pointer">
                          <Edit className="w-3.5 h-3.5 text-amber-400" /> Edit Bonus Formula
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onApprove(row)} className="gap-2 cursor-pointer">
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Approve Governance
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onReject(row)} className="gap-2 cursor-pointer text-rose-400">
                          <X className="w-3.5 h-3.5" /> Reject Award
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRecalculate(row)} className="gap-2 cursor-pointer">
                          <Calculator className="w-3.5 h-3.5 text-purple-400" /> Recalculate Formula
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem onClick={() => onAddPayrollEntry(row)} className="gap-2 cursor-pointer">
                          <CreditCard className="w-3.5 h-3.5 text-cyan-400" /> Add to Payroll Run
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onGenerateLetter(row)} className="gap-2 cursor-pointer">
                          <FileText className="w-3.5 h-3.5 text-emerald-400" /> Generate Award Letter
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onViewLogs(row)} className="gap-2 cursor-pointer">
                          <History className="w-3.5 h-3.5 text-slate-400" /> Audit Logs
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-2 pt-1 text-xs text-slate-400">
        <div>
          Showing <span className="text-white font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
          <span className="text-white font-medium">{Math.min(currentPage * itemsPerPage, sortedData.length)}</span> of{" "}
          <span className="text-white font-medium">{sortedData.length}</span> bonus awards
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="h-8 border-white/10 bg-slate-900 text-slate-300 gap-1 text-xs"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </Button>

          <span className="px-2 font-mono text-slate-300">
            {currentPage} / {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="h-8 border-white/10 bg-slate-900 text-slate-300 gap-1 text-xs"
          >
            Next <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

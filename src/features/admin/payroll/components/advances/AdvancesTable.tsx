import React, { useState, useMemo } from "react";
import {
  MoreVertical,
  Eye,
  Edit,
  Check,
  X,
  CreditCard,
  Layers,
  Sliders,
  CheckCircle2,
  History,
  ArrowUpDown,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  HandCoins,
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
import { SalaryAdvanceRequest } from "./advancesTypes";

interface AdvancesTableProps {
  data: SalaryAdvanceRequest[];
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onView: (advance: SalaryAdvanceRequest) => void;
  onEdit: (advance: SalaryAdvanceRequest) => void;
  onApprove: (advance: SalaryAdvanceRequest) => void;
  onReject: (advance: SalaryAdvanceRequest) => void;
  onDisburse: (advance: SalaryAdvanceRequest) => void;
  onGenerateRecoveryPlan: (advance: SalaryAdvanceRequest) => void;
  onCloseAdvance: (advance: SalaryAdvanceRequest) => void;
  onViewLogs: (advance: SalaryAdvanceRequest) => void;
}

export const AdvancesTable: React.FC<AdvancesTableProps> = ({
  data,
  selectedIds,
  onSelectToggle,
  onSelectAll,
  onView,
  onEdit,
  onApprove,
  onReject,
  onDisburse,
  onGenerateRecoveryPlan,
  onCloseAdvance,
  onViewLogs,
}) => {
  const [sortField, setSortField] = useState<keyof SalaryAdvanceRequest>("updatedOn");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: keyof SalaryAdvanceRequest) => {
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

  const getApprovalBadge = (status: SalaryAdvanceRequest["approvalStatus"]) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 gap-1"><ShieldCheck className="w-3 h-3" /> Approved</Badge>;
      case "PENDING_MANAGER":
      case "PENDING_HR":
      case "PENDING_FINANCE":
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 gap-1 animate-pulse">Governance Review</Badge>;
      case "REJECTED":
        return <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30 gap-1">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: SalaryAdvanceRequest["paymentStatus"]) => {
    switch (status) {
      case "DISBURSED":
        return <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30">Disbursed (Bank)</Badge>;
      case "FAILED":
        return <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30">Failed</Badge>;
      default:
        return <Badge variant="outline" className="text-slate-400">Unpaid</Badge>;
    }
  };

  if (data.length === 0) {
    return (
      <div className="adv-card p-12 flex flex-col items-center justify-center text-center my-4">
        <div className="p-4 rounded-full bg-slate-800/60 border border-white/10 text-slate-400 mb-3">
          <HandCoins className="w-8 h-8 text-cyan-400" />
        </div>
        <h3 className="text-base font-semibold text-white">No Salary Advance Requests Found</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md">
          No employee salary advance requests match your filter criteria. Try resetting filters or create a new request.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="adv-table-wrapper">
        <table className="adv-table">
          <thead>
            <tr>
              <th className="w-10 text-center">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(ch) => onSelectAll(!!ch)}
                />
              </th>
              <th onClick={() => handleSort("advanceCode")} className="cursor-pointer">
                <div className="flex items-center gap-1.5">
                  Advance Code <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th onClick={() => handleSort("employeeName")} className="cursor-pointer">
                <div className="flex items-center gap-1.5">
                  Employee & Dept <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th>Advance Type</th>
              <th onClick={() => handleSort("requestedAmount")} className="cursor-pointer text-right">
                <div className="flex items-center justify-end gap-1.5">
                  Approved Amount <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="text-right">Outstanding Balance</th>
              <th>Recovery Progress</th>
              <th>Approval</th>
              <th>Payment</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => {
              const isSelected = selectedIds.includes(row.id);
              const recoveryPct = row.approvedAmount > 0 ? Math.round((row.recoveredAmount / row.approvedAmount) * 100) : 0;

              return (
                <tr key={row.id} className={isSelected ? "bg-cyan-950/20" : ""}>
                  {/* Checkbox */}
                  <td className="text-center">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onSelectToggle(row.id)}
                    />
                  </td>

                  {/* Code & Date */}
                  <td>
                    <div className="flex flex-col gap-0.5">
                      <span
                        onClick={() => onView(row)}
                        className="font-mono font-semibold text-cyan-400 hover:underline cursor-pointer text-xs"
                      >
                        {row.advanceCode}
                      </span>
                      <span className="text-[10px] text-slate-400">{row.createdOn}</span>
                    </div>
                  </td>

                  {/* Employee & Dept */}
                  <td>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-200">{row.employeeName}</span>
                      <span className="text-[10px] text-slate-400">{row.department} — {row.employeeCode}</span>
                    </div>
                  </td>

                  {/* Advance Type */}
                  <td>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {row.advanceType}
                    </span>
                  </td>

                  {/* Approved Amount */}
                  <td className="text-right font-mono font-bold text-white text-xs">
                    ₹{row.approvedAmount.toLocaleString("en-IN")}
                  </td>

                  {/* Outstanding Balance */}
                  <td className="text-right font-mono font-bold text-amber-400 text-xs">
                    ₹{row.outstandingBalance.toLocaleString("en-IN")}
                  </td>

                  {/* Recovery Progress Bar */}
                  <td>
                    <div className="space-y-1 w-28">
                      <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono">
                        <span>{recoveryPct}%</span>
                        <span>₹{row.recoveredAmount.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="recovery-progress-bar">
                        <div className="recovery-progress-fill" style={{ width: `${recoveryPct}%` }} />
                      </div>
                    </div>
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
                      <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-xs text-slate-200 w-56">
                        <DropdownMenuItem onClick={() => onView(row)} className="gap-2 cursor-pointer">
                          <Eye className="w-3.5 h-3.5 text-blue-400" /> View Details & Schedule
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(row)} className="gap-2 cursor-pointer">
                          <Edit className="w-3.5 h-3.5 text-amber-400" /> Edit Financial Terms
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onApprove(row)} className="gap-2 cursor-pointer">
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Approve Advance
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onReject(row)} className="gap-2 cursor-pointer text-rose-400">
                          <X className="w-3.5 h-3.5" /> Reject Request
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDisburse(row)} className="gap-2 cursor-pointer">
                          <CreditCard className="w-3.5 h-3.5 text-indigo-400" /> Disburse via Bank
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onGenerateRecoveryPlan(row)} className="gap-2 cursor-pointer">
                          <Layers className="w-3.5 h-3.5 text-purple-400" /> Adjust Installments Plan
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem onClick={() => onCloseAdvance(row)} className="gap-2 cursor-pointer text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Close Advance Early
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
          <span className="text-white font-medium">{sortedData.length}</span> advance requests
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

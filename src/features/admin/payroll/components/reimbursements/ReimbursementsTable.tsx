import React, { useState, useMemo } from "react";
import {
  MoreVertical,
  Eye,
  Check,
  X,
  CreditCard,
  Download,
  History,
  ArrowUpDown,
  FileText,
  AlertTriangle,
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
import { ReimbursementClaim } from "./reimbursementsTypes";

interface ReimbursementsTableProps {
  data: ReimbursementClaim[];
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onView: (claim: ReimbursementClaim) => void;
  onApprove: (claim: ReimbursementClaim) => void;
  onReject: (claim: ReimbursementClaim) => void;
  onRequestChanges: (claim: ReimbursementClaim) => void;
  onProcessPayment: (claim: ReimbursementClaim) => void;
  onAddPayrollEntry: (claim: ReimbursementClaim) => void;
  onDownloadReceipt: (claim: ReimbursementClaim) => void;
  onViewLogs: (claim: ReimbursementClaim) => void;
}

export const ReimbursementsTable: React.FC<ReimbursementsTableProps> = ({
  data,
  selectedIds,
  onSelectToggle,
  onSelectAll,
  onView,
  onApprove,
  onReject,
  onRequestChanges,
  onProcessPayment,
  onAddPayrollEntry,
  onDownloadReceipt,
  onViewLogs,
}) => {
  const [sortField, setSortField] = useState<keyof ReimbursementClaim>("submittedDate");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: keyof ReimbursementClaim) => {
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

  const getApprovalBadge = (status: ReimbursementClaim["approvalStatus"]) => {
    switch (status) {
      case "PAYROLL_APPROVED":
      case "FINANCE_APPROVED":
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 gap-1"><ShieldCheck className="w-3 h-3" /> Approved</Badge>;
      case "SUBMITTED":
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 gap-1 animate-pulse">Pending Review</Badge>;
      case "REJECTED":
        return <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30 gap-1">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: ReimbursementClaim["paymentStatus"]) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30">Paid (Direct)</Badge>;
      case "SCHEDULED_PAYROLL":
        return <Badge className="bg-cyan-500/10 text-cyan-300 border-cyan-500/30 font-mono">Payroll Run</Badge>;
      case "PROCESSING":
        return <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/30">Processing</Badge>;
      default:
        return <Badge variant="outline" className="text-slate-400">Unpaid</Badge>;
    }
  };

  if (data.length === 0) {
    return (
      <div className="reimb-card p-12 flex flex-col items-center justify-center text-center my-4">
        <div className="p-4 rounded-full bg-slate-800/60 border border-white/10 text-slate-400 mb-3">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-white">No Reimbursement Claims Found</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md">
          No employee reimbursement claims match your filter criteria or search query. Try clearing search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="reimb-table-wrapper">
        <table className="reimb-table">
          <thead>
            <tr>
              <th className="w-10 text-center">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(ch) => onSelectAll(!!ch)}
                />
              </th>
              <th onClick={() => handleSort("claimNumber")} className="cursor-pointer">
                <div className="flex items-center gap-1.5">
                  Claim ID <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th onClick={() => handleSort("employeeName")} className="cursor-pointer">
                <div className="flex items-center gap-1.5">
                  Employee & ID <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th>Dept & Role</th>
              <th>Category</th>
              <th>Expense Date</th>
              <th onClick={() => handleSort("claimAmount")} className="cursor-pointer text-right">
                <div className="flex items-center justify-end gap-1.5">
                  Claim Amount <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th>Approval</th>
              <th>Payment</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => {
              const isSelected = selectedIds.includes(row.id);

              return (
                <tr key={row.id} className={isSelected ? "bg-blue-950/20" : ""}>
                  {/* Checkbox */}
                  <td className="text-center">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onSelectToggle(row.id)}
                    />
                  </td>

                  {/* Claim ID */}
                  <td>
                    <div className="flex flex-col gap-0.5">
                      <span
                        onClick={() => onView(row)}
                        className="font-mono font-semibold text-blue-400 hover:underline cursor-pointer text-xs"
                      >
                        {row.claimNumber}
                      </span>
                      <span className="text-[10px] text-slate-500">Sub: {row.submittedDate}</span>
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

                  {/* Category */}
                  <td>
                    <span className="category-pill text-blue-300">
                      {row.expenseCategory}
                    </span>
                  </td>

                  {/* Expense Date */}
                  <td>
                    <span className="text-[11px] text-slate-300">{row.expenseDate}</span>
                  </td>

                  {/* Claim Amount */}
                  <td className="text-right font-mono font-bold text-white text-xs">
                    ₹{row.claimAmount.toLocaleString("en-IN")}
                    {row.receipts.length > 0 && (
                      <span className="block text-[10px] text-emerald-400 font-normal">
                        {row.receipts.length} Receipt(s) OCR ✓
                      </span>
                    )}
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
                      <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-xs text-slate-200 w-48">
                        <DropdownMenuItem onClick={() => onView(row)} className="gap-2 cursor-pointer">
                          <Eye className="w-3.5 h-3.5 text-blue-400" /> View Claim Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onApprove(row)} className="gap-2 cursor-pointer">
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Approve Claim
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onReject(row)} className="gap-2 cursor-pointer text-rose-400">
                          <X className="w-3.5 h-3.5" /> Reject Claim
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRequestChanges(row)} className="gap-2 cursor-pointer">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Request Changes
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem onClick={() => onAddPayrollEntry(row)} className="gap-2 cursor-pointer">
                          <CreditCard className="w-3.5 h-3.5 text-cyan-400" /> Add to Payroll Run
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onProcessPayment(row)} className="gap-2 cursor-pointer">
                          <CreditCard className="w-3.5 h-3.5 text-indigo-400" /> Direct Bank Disbursal
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDownloadReceipt(row)} className="gap-2 cursor-pointer">
                          <Download className="w-3.5 h-3.5 text-slate-400" /> Download Receipts
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
          <span className="text-white font-medium">{sortedData.length}</span> reimbursement claims
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

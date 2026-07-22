import React, { useState, useMemo } from "react";
import {
  MoreVertical,
  Eye,
  Edit,
  Check,
  X,
  Calculator,
  CreditCard,
  History,
  ArrowUpDown,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Timer,
  Clock,
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
import { OvertimeRecord } from "./overtimeTypes";

interface OvertimeTableProps {
  data: OvertimeRecord[];
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onView: (record: OvertimeRecord) => void;
  onEdit: (record: OvertimeRecord) => void;
  onApprove: (record: OvertimeRecord) => void;
  onReject: (record: OvertimeRecord) => void;
  onRecalculate: (record: OvertimeRecord) => void;
  onAddPayrollEntry: (record: OvertimeRecord) => void;
  onViewTimeline: (record: OvertimeRecord) => void;
  onViewLogs: (record: OvertimeRecord) => void;
}

export const OvertimeTable: React.FC<OvertimeTableProps> = ({
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
  onViewTimeline,
  onViewLogs,
}) => {
  const [sortField, setSortField] = useState<keyof OvertimeRecord>("updatedOn");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: keyof OvertimeRecord) => {
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

  const getApprovalBadge = (status: OvertimeRecord["approvalStatus"]) => {
    switch (status) {
      case "APPROVED":
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 gap-1"><ShieldCheck className="w-3 h-3" /> Approved</Badge>;
      case "PENDING_MANAGER":
      case "PENDING_HR":
      case "PENDING_PAYROLL":
      case "PENDING_FINANCE":
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 gap-1 animate-pulse">Governance Review</Badge>;
      case "REJECTED":
        return <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30 gap-1">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPayrollBadge = (status: OvertimeRecord["payrollStatus"]) => {
    switch (status) {
      case "SCHEDULED_PAYROLL":
        return <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/30 font-mono">Scheduled</Badge>;
      case "PAID":
        return <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30">Paid</Badge>;
      default:
        return <Badge variant="outline" className="text-slate-400">Unpaid</Badge>;
    }
  };

  const getMultiplierBadge = (mult: number) => {
    if (mult >= 3.0) {
      return <span className="multiplier-pill bg-rose-500/10 text-rose-400 border border-rose-500/30">3.0x Triple</span>;
    } else if (mult >= 2.0) {
      return <span className="multiplier-pill bg-amber-500/10 text-amber-400 border border-amber-500/30">2.0x Double</span>;
    }
    return <span className="multiplier-pill bg-blue-500/10 text-blue-400 border border-blue-500/30">1.5x Standard</span>;
  };

  if (data.length === 0) {
    return (
      <div className="ot-card p-12 flex flex-col items-center justify-center text-center my-4">
        <div className="p-4 rounded-full bg-slate-800/60 border border-white/10 text-slate-400 mb-3">
          <Timer className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-base font-semibold text-white">No Overtime Records Found</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md">
          No employee overtime claims match your filter criteria. Try adjusting filters or record a new overtime claim.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="ot-table-wrapper">
        <table className="ot-table">
          <thead>
            <tr>
              <th className="w-10 text-center">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(ch) => onSelectAll(!!ch)}
                />
              </th>
              <th onClick={() => handleSort("requestCode")} className="cursor-pointer">
                <div className="flex items-center gap-1.5">
                  Code & Date <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th onClick={() => handleSort("employeeName")} className="cursor-pointer">
                <div className="flex items-center gap-1.5">
                  Employee & Dept <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th>Shift & Punches</th>
              <th onClick={() => handleSort("overtimeHours")} className="cursor-pointer text-center">
                <div className="flex items-center justify-center gap-1.5">
                  OT Hours <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th>Category & Multiplier</th>
              <th onClick={() => handleSort("overtimeAmount")} className="cursor-pointer text-right">
                <div className="flex items-center justify-end gap-1.5">
                  OT Amount <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th>Approval</th>
              <th>Payroll</th>
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

                  {/* Code & Date */}
                  <td>
                    <div className="flex flex-col gap-0.5">
                      <span
                        onClick={() => onView(row)}
                        className="font-mono font-semibold text-blue-400 hover:underline cursor-pointer text-xs"
                      >
                        {row.requestCode}
                      </span>
                      <span className="text-[10px] text-slate-400">{row.date}</span>
                    </div>
                  </td>

                  {/* Employee & Dept */}
                  <td>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-200">{row.employeeName}</span>
                      <span className="text-[10px] text-slate-400">{row.department} — {row.employeeCode}</span>
                    </div>
                  </td>

                  {/* Shift & Punches */}
                  <td>
                    <div className="flex flex-col text-[11px]">
                      <span className="text-slate-300 font-medium">{row.shift}</span>
                      <span className="font-mono text-[10px] text-slate-400">{row.clockIn} - {row.clockOut}</span>
                    </div>
                  </td>

                  {/* OT Hours */}
                  <td className="text-center font-mono text-xs font-bold text-amber-300">
                    {row.overtimeHours} hrs
                  </td>

                  {/* Category & Multiplier */}
                  <td>
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-[11px] font-semibold text-slate-300">{row.category}</span>
                      {getMultiplierBadge(row.multiplier)}
                    </div>
                  </td>

                  {/* OT Amount */}
                  <td className="text-right font-mono font-bold text-emerald-400 text-xs">
                    ₹{row.overtimeAmount.toLocaleString("en-IN")}
                    <span className="block text-[10px] text-slate-400 font-normal">₹{row.hourlyRate}/hr</span>
                  </td>

                  {/* Approval Status */}
                  <td>{getApprovalBadge(row.approvalStatus)}</td>

                  {/* Payroll Status */}
                  <td>{getPayrollBadge(row.payrollStatus)}</td>

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
                          <Eye className="w-3.5 h-3.5 text-blue-400" /> View Record Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onViewTimeline(row)} className="gap-2 cursor-pointer">
                          <Clock className="w-3.5 h-3.5 text-cyan-400" /> Attendance Timeline
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(row)} className="gap-2 cursor-pointer">
                          <Edit className="w-3.5 h-3.5 text-amber-400" /> Edit Hours & Multiplier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onApprove(row)} className="gap-2 cursor-pointer">
                          <Check className="w-3.5 h-3.5 text-emerald-400" /> Approve Overtime
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onReject(row)} className="gap-2 cursor-pointer text-rose-400">
                          <X className="w-3.5 h-3.5" /> Reject Claim
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRecalculate(row)} className="gap-2 cursor-pointer">
                          <Calculator className="w-3.5 h-3.5 text-purple-400" /> Recalculate Formula
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem onClick={() => onAddPayrollEntry(row)} className="gap-2 cursor-pointer">
                          <CreditCard className="w-3.5 h-3.5 text-purple-400" /> Add to Payroll Run
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
          <span className="text-white font-medium">{sortedData.length}</span> overtime records
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

import React, { useState, useMemo } from "react";
import {
  MoreVertical,
  Eye,
  Edit,
  Users,
  Play,
  CheckCircle2,
  XCircle,
  Archive,
  History,
  ArrowUpDown,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  MinusCircle,
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
import { DeductionRule } from "./deductionsTypes";

interface DeductionsTableProps {
  data: DeductionRule[];
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onView: (rule: DeductionRule) => void;
  onEdit: (rule: DeductionRule) => void;
  onAssignEmployees: (rule: DeductionRule) => void;
  onPreviewImpact: (rule: DeductionRule) => void;
  onToggleStatus: (rule: DeductionRule) => void;
  onArchive: (rule: DeductionRule) => void;
  onViewLogs: (rule: DeductionRule) => void;
}

export const DeductionsTable: React.FC<DeductionsTableProps> = ({
  data,
  selectedIds,
  onSelectToggle,
  onSelectAll,
  onView,
  onEdit,
  onAssignEmployees,
  onPreviewImpact,
  onToggleStatus,
  onArchive,
  onViewLogs,
}) => {
  const [sortField, setSortField] = useState<keyof DeductionRule>("updatedOn");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: keyof DeductionRule) => {
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

  const getCategoryGroupBadge = (grp: DeductionRule["categoryGroup"]) => {
    switch (grp) {
      case "STATUTORY":
        return <Badge className="bg-purple-500/10 text-purple-300 border-purple-500/30 gap-1"><ShieldCheck className="w-3 h-3 text-purple-400" /> Statutory</Badge>;
      case "VOLUNTARY":
        return <Badge className="bg-blue-500/10 text-blue-300 border-blue-500/30">Voluntary Policy</Badge>;
      case "RECOVERY":
        return <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/30">Loan & Recovery</Badge>;
      case "PENALTY":
        return <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30">Penalty Rule</Badge>;
      default:
        return <Badge variant="outline" className="text-slate-300">Custom Rule</Badge>;
    }
  };

  const getStatusBadge = (status: DeductionRule["status"]) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">Active</Badge>;
      case "INACTIVE":
        return <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/30">Inactive</Badge>;
      default:
        return <Badge variant="outline" className="text-slate-500">Archived</Badge>;
    }
  };

  if (data.length === 0) {
    return (
      <div className="ded-card p-12 flex flex-col items-center justify-center text-center my-4">
        <div className="p-4 rounded-full bg-slate-800/60 border border-white/10 text-slate-400 mb-3">
          <MinusCircle className="w-8 h-8 text-rose-400" />
        </div>
        <h3 className="text-base font-semibold text-white">No Deduction Rules Found</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md">
          No deduction rules match your filter criteria. Try adjusting filters or create a new deduction policy rule.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="ded-table-wrapper">
        <table className="ded-table">
          <thead>
            <tr>
              <th className="w-10 text-center">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(ch) => onSelectAll(!!ch)}
                />
              </th>
              <th onClick={() => handleSort("name")} className="cursor-pointer">
                <div className="flex items-center gap-1.5">
                  Deduction Rule Name <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th>Category Group</th>
              <th>Method</th>
              <th onClick={() => handleSort("employeeCount")} className="cursor-pointer text-center">
                <div className="flex items-center justify-center gap-1.5">
                  Assigned Scope <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th>Amount / Formula Expression</th>
              <th>Effective Date</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => {
              const isSelected = selectedIds.includes(row.id);

              return (
                <tr key={row.id} className={isSelected ? "bg-rose-950/20" : ""}>
                  {/* Checkbox */}
                  <td className="text-center">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onSelectToggle(row.id)}
                    />
                  </td>

                  {/* Name & Code */}
                  <td>
                    <div className="flex flex-col gap-0.5">
                      <span
                        onClick={() => onView(row)}
                        className="font-semibold text-white hover:text-rose-300 hover:underline cursor-pointer text-xs"
                      >
                        {row.name}
                      </span>
                      <span className="font-mono text-[10px] text-rose-300">{row.code} — {row.category}</span>
                    </div>
                  </td>

                  {/* Category Group */}
                  <td>{getCategoryGroupBadge(row.categoryGroup)}</td>

                  {/* Method */}
                  <td>
                    <span className="font-mono text-[11px] text-blue-300 bg-slate-900 px-2 py-0.5 rounded border border-white/5 font-semibold">
                      {row.calculationMethod}
                    </span>
                  </td>

                  {/* Employee Count */}
                  <td className="text-center font-mono text-xs font-bold text-slate-200">
                    {row.employeeCount} Staff
                  </td>

                  {/* Formula Expression */}
                  <td>
                    <span className="font-mono text-[11px] text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-emerald-500/20 truncate max-w-[200px] block">
                      {row.formulaExpression}
                    </span>
                  </td>

                  {/* Effective Date */}
                  <td className="font-mono text-xs text-slate-300">{row.effectiveDate}</td>

                  {/* Status */}
                  <td>{getStatusBadge(row.status)}</td>

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
                          <Eye className="w-3.5 h-3.5 text-blue-400" /> View Rule Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(row)} className="gap-2 cursor-pointer">
                          <Edit className="w-3.5 h-3.5 text-amber-400" /> Edit Formula Specs
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAssignEmployees(row)} className="gap-2 cursor-pointer">
                          <Users className="w-3.5 h-3.5 text-purple-400" /> Assign Employees Scope
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPreviewImpact(row)} className="gap-2 cursor-pointer">
                          <Play className="w-3.5 h-3.5 text-emerald-400" /> Preview Payroll Impact
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem onClick={() => onToggleStatus(row)} className="gap-2 cursor-pointer">
                          {row.status === "ACTIVE" ? (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-400" /> Deactivate Rule
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Activate Rule
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onArchive(row)} className="gap-2 cursor-pointer text-slate-400">
                          <Archive className="w-3.5 h-3.5" /> Archive Policy Rule
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
          <span className="text-white font-medium">{sortedData.length}</span> deduction rules
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

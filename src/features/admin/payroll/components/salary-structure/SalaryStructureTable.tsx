import React, { useState, useMemo } from "react";
import {
  MoreVertical,
  Eye,
  Edit,
  Copy,
  GitCompare,
  UserPlus,
  CheckCircle2,
  XCircle,
  Archive,
  History,
  ArrowUpDown,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SalaryStructure } from "./salaryStructureTypes";

interface SalaryStructureTableProps {
  data: SalaryStructure[];
  onView: (structure: SalaryStructure) => void;
  onEdit: (structure: SalaryStructure) => void;
  onClone: (structure: SalaryStructure) => void;
  onCompare: (structure: SalaryStructure) => void;
  onAssign: (structure: SalaryStructure) => void;
  onToggleStatus: (structure: SalaryStructure) => void;
  onArchive: (structure: SalaryStructure) => void;
  onViewLogs: (structure: SalaryStructure) => void;
}

export const SalaryStructureTable: React.FC<SalaryStructureTableProps> = ({
  data,
  onView,
  onEdit,
  onClone,
  onCompare,
  onAssign,
  onToggleStatus,
  onArchive,
  onViewLogs,
}) => {
  const [sortField, setSortField] = useState<keyof SalaryStructure>("updatedOn");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: keyof SalaryStructure) => {
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

  const getStatusBadge = (status: SalaryStructure["status"]) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 gap-1"><CheckCircle2 className="w-3 h-3" /> Active</Badge>;
      case "DRAFT":
        return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/30 gap-1">Draft</Badge>;
      case "PENDING_APPROVAL":
        return <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 gap-1 animate-pulse">Pending Approval</Badge>;
      case "ARCHIVED":
        return <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/30 gap-1">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (data.length === 0) {
    return (
      <div className="salary-card p-12 flex flex-col items-center justify-center text-center my-4">
        <div className="p-4 rounded-full bg-slate-800/60 border border-white/10 text-slate-400 mb-3">
          <Layers className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-white">No Salary Structures Found</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-md">
          No salary structure templates match your filter criteria or search query. Try clearing filters or create a new template.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="salary-table-wrapper">
        <table className="salary-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("name")} className="cursor-pointer">
                <div className="flex items-center gap-1.5">
                  Structure & Code <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th onClick={() => handleSort("salaryGrade")} className="cursor-pointer">
                <div className="flex items-center gap-1.5">
                  Grade & Band <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th>Dept & Role</th>
              <th>Location</th>
              <th onClick={() => handleSort("annualCtc")} className="cursor-pointer text-right">
                <div className="flex items-center justify-end gap-1.5">
                  Annual CTC <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th onClick={() => handleSort("employeesAssigned")} className="cursor-pointer text-center">
                <div className="flex items-center justify-center gap-1.5">
                  Assigned <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th>Gross & Net Formulas</th>
              <th>Effective</th>
              <th>Version</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row.id}>
                {/* Structure Name & Code */}
                <td>
                  <div className="flex flex-col gap-0.5">
                    <span
                      onClick={() => onView(row)}
                      className="font-semibold text-blue-400 hover:underline cursor-pointer text-xs"
                    >
                      {row.name}
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 flex items-center gap-1.5">
                      {row.code}
                      {row.complianceWarnings.length > 0 && (
                        <span title={row.complianceWarnings[0]}>
                          <ShieldAlert className="w-3 h-3 text-amber-400" />
                        </span>
                      )}
                    </span>
                  </div>
                </td>

                {/* Grade & Band */}
                <td>
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-200">{row.salaryGrade}</span>
                    <span className="text-[11px] text-slate-400">{row.salaryBand}</span>
                  </div>
                </td>

                {/* Dept & Role */}
                <td>
                  <div className="flex flex-col">
                    <span className="text-slate-300 font-medium">{row.department}</span>
                    <span className="text-[11px] text-slate-400">{row.designation}</span>
                  </div>
                </td>

                {/* Location */}
                <td>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-white/5">
                    {row.location}
                  </span>
                </td>

                {/* CTC */}
                <td className="text-right font-mono font-semibold text-white">
                  ₹{(row.annualCtc / 100000).toFixed(2)}L
                  <span className="block text-[10px] text-slate-400 font-normal">
                    ₹{Math.round(row.annualCtc / 12).toLocaleString("en-IN")}/pm
                  </span>
                </td>

                {/* Employees Assigned */}
                <td className="text-center">
                  <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {row.employeesAssigned} emp
                  </span>
                </td>

                {/* Formulas */}
                <td>
                  <div className="space-y-1 max-w-[200px]">
                    <div className="font-mono text-[10px] text-emerald-400 truncate bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      G: {row.grossSalaryFormula}
                    </div>
                    <div className="font-mono text-[10px] text-cyan-400 truncate bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/20">
                      N: {row.netSalaryFormula}
                    </div>
                  </div>
                </td>

                {/* Effective From */}
                <td>
                  <span className="text-[11px] text-slate-400">{row.effectiveFrom}</span>
                </td>

                {/* Version */}
                <td>
                  <Badge variant="outline" className="font-mono text-[11px] text-blue-300 border-blue-500/30 bg-blue-500/10">
                    {row.version}
                  </Badge>
                </td>

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
                    <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-xs text-slate-200 w-44">
                      <DropdownMenuItem onClick={() => onView(row)} className="gap-2 cursor-pointer">
                        <Eye className="w-3.5 h-3.5 text-blue-400" /> View Breakdown
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(row)} className="gap-2 cursor-pointer">
                        <Edit className="w-3.5 h-3.5 text-amber-400" /> Edit Structure
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onClone(row)} className="gap-2 cursor-pointer">
                        <Copy className="w-3.5 h-3.5 text-emerald-400" /> Clone Template
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onCompare(row)} className="gap-2 cursor-pointer">
                        <GitCompare className="w-3.5 h-3.5 text-purple-400" /> Compare Versions
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAssign(row)} className="gap-2 cursor-pointer">
                        <UserPlus className="w-3.5 h-3.5 text-cyan-400" /> Assign Employees
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10" />
                      <DropdownMenuItem onClick={() => onToggleStatus(row)} className="gap-2 cursor-pointer">
                        {row.status === "ACTIVE" ? (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-400" /> Deactivate
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewLogs(row)} className="gap-2 cursor-pointer">
                        <History className="w-3.5 h-3.5 text-slate-400" /> Audit Logs
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onArchive(row)} className="gap-2 cursor-pointer text-rose-400">
                        <Archive className="w-3.5 h-3.5" /> Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-2 pt-1 text-xs text-slate-400">
        <div>
          Showing <span className="text-white font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
          <span className="text-white font-medium">{Math.min(currentPage * itemsPerPage, sortedData.length)}</span> of{" "}
          <span className="text-white font-medium">{sortedData.length}</span> salary structures
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

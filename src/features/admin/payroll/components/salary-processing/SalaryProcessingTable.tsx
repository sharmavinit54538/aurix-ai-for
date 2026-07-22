import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Edit3,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  Download,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Coins,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeSalaryDetail } from "./SalaryDetailDrawer";

export interface SalaryProcessingTableProps {
  data: EmployeeSalaryDetail[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onViewDetail: (employee: EmployeeSalaryDetail) => void;
  onRecalculateRow: (id: string) => void;
}

export const SalaryProcessingTable: React.FC<SalaryProcessingTableProps> = ({
  data,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onViewDetail,
  onRecalculateRow,
}) => {
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [sortField, setSortField] = useState<keyof EmployeeSalaryDetail>("netSalary");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filtered & Sorted Data
  const filteredData = useMemo(() => {
    return data
      .filter((emp) => {
        const matchesSearch =
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.department.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = selectedDept === "ALL" || emp.department === selectedDept;
        const matchesStatus = selectedStatus === "ALL" || emp.status === selectedStatus;
        return matchesSearch && matchesDept && matchesStatus;
      })
      .sort((a, b) => {
        const valA = a[sortField] ?? "";
        const valB = b[sortField] ?? "";
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [data, searchQuery, selectedDept, selectedStatus, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  const isAllSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedIds.includes(item.id));

  const handleSort = (field: keyof EmployeeSalaryDetail) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedDept("ALL");
    setSelectedStatus("ALL");
  };

  return (
    <div className="sp-card space-y-4 p-5">
      {/* ── Filter Bar & Search ── */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search employee by name, ID, or department..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="sp-input h-9 w-full rounded-xl pl-9 pr-3 text-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Department */}
          <Select
            value={selectedDept}
            onValueChange={(val) => {
              setSelectedDept(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[160px] border-white/10 bg-white/[0.03] text-xs text-slate-200">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#121a2f]">
              <SelectItem value="ALL">All Departments</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Product">Product</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
            </SelectContent>
          </Select>

          {/* Status */}
          <Select
            value={selectedStatus}
            onValueChange={(val) => {
              setSelectedStatus(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-9 w-[150px] border-white/10 bg-white/[0.03] text-xs text-slate-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#121a2f]">
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="CALCULATED">Calculated</SelectItem>
              <SelectItem value="VALIDATED">Validated</SelectItem>
              <SelectItem value="HOLD">Hold</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset */}
          {(searchQuery || selectedDept !== "ALL" || selectedStatus !== "ALL") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-9 px-2.5 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* ── Enterprise Data Grid Table ── */}
      <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-[#0c1322]">
        <table className="w-full text-left border-collapse text-xs">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="p-3 w-10 text-center">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={onToggleSelectAll}
                  className="border-white/20"
                />
              </th>
              <th
                className="p-3 cursor-pointer hover:text-white"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  <span>Employee</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="p-3">Department</th>
              <th
                className="p-3 cursor-pointer hover:text-white text-right"
                onClick={() => handleSort("grossSalary")}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Gross Pay</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="p-3 text-right">Allowances</th>
              <th className="p-3 text-right">Deductions</th>
              <th className="p-3 text-right">TDS Tax</th>
              <th
                className="p-3 cursor-pointer hover:text-white text-right"
                onClick={() => handleSort("netSalary")}
              >
                <div className="flex items-center justify-end gap-1 text-indigo-300">
                  <span>Net Salary</span>
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center w-24">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-white/[0.04] text-slate-300">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-slate-500">
                  No employee salary records found matching your filters.
                </td>
              </tr>
            ) : (
              paginatedData.map((emp) => {
                const isSelected = selectedIds.includes(emp.id);

                return (
                  <tr
                    key={emp.id}
                    className={`transition-colors hover:bg-white/[0.03] ${
                      isSelected ? "bg-indigo-500/[0.06]" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-3 text-center">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleSelect(emp.id)}
                        className="border-white/20"
                      />
                    </td>

                    {/* Employee Profile */}
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-xs font-bold text-indigo-400">
                          {emp.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-white truncate max-w-[150px]">
                            {emp.name}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">
                            {emp.employeeCode}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department & Designation */}
                    <td className="p-3">
                      <div className="font-medium text-slate-200">{emp.department}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                        {emp.designation}
                      </div>
                    </td>

                    {/* Gross */}
                    <td className="p-3 text-right font-medium text-slate-200 font-mono">
                      ₹{emp.grossSalary.toLocaleString("en-IN")}
                    </td>

                    {/* Allowances */}
                    <td className="p-3 text-right font-medium text-emerald-400/90 font-mono">
                      +₹{(emp.hra + emp.specialAllowance + emp.bonus + emp.overtimePay).toLocaleString("en-IN")}
                    </td>

                    {/* Deductions */}
                    <td className="p-3 text-right font-medium text-rose-400/90 font-mono">
                      -₹{emp.totalDeductions.toLocaleString("en-IN")}
                    </td>

                    {/* Tax */}
                    <td className="p-3 text-right font-medium text-amber-400/90 font-mono">
                      ₹{emp.tdsDeduction.toLocaleString("en-IN")}
                    </td>

                    {/* Net Salary */}
                    <td className="p-3 text-right">
                      <span className="font-bold text-white font-mono text-sm bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                        ₹{emp.netSalary.toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                          emp.status === "VALIDATED"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : emp.status === "HOLD"
                            ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                            : "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    {/* Row Actions */}
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewDetail(emp)}
                          className="h-7 w-7 text-slate-400 hover:bg-white/10 hover:text-white"
                          title="View Salary Breakdown"
                        >
                          <Eye className="h-3.5 w-3.5 text-indigo-400" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRecalculateRow(emp.id)}
                          className="h-7 w-7 text-slate-400 hover:bg-white/10 hover:text-white"
                          title="Recalculate"
                        >
                          <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Table Footer & Pagination ── */}
      <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
        <div>
          Showing {paginatedData.length} of {filteredData.length} employee records
          {selectedIds.length > 0 && (
            <span className="ml-2 text-indigo-400 font-semibold">
              ({selectedIds.length} selected)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="h-8 border-white/10 bg-white/[0.03] text-xs text-slate-300 disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5 mr-1" />
            Previous
          </Button>

          <span className="text-xs font-semibold text-white px-2">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="h-8 border-white/10 bg-white/[0.03] text-xs text-slate-300 disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Edit2,
  Trash2,
  Eye,
  ArrowUpDown,
  Building2,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  HelpCircle,
} from "lucide-react";
import type { Department, SortField, SortDir } from "../types";
import { STATUS_OPTIONS } from "../constants";
import { fmtDate, fmtBudget } from "../utils";
import * as LucideIcons from "lucide-react";

interface DepartmentsTableProps {
  departments: Department[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onView: (dept: Department) => void;
  onEdit: (dept: Department) => void;
  onDelete: (dept: Department) => void;
  sortField: SortField;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
}

export function DepartmentsTable({
  departments,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onView,
  onEdit,
  onDelete,
  sortField,
  sortDir,
  onSort,
}: DepartmentsTableProps) {
  const allSelected = useMemo(() => {
    return departments.length > 0 && selectedIds.length === departments.length;
  }, [departments, selectedIds]);

  const isSomeSelected = useMemo(() => {
    return selectedIds.length > 0 && selectedIds.length < departments.length;
  }, [departments, selectedIds]);

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onSort(field)}
        className="-ml-3 h-8 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:bg-muted/50"
      >
        {children}
        <ArrowUpDown className="ml-1.5 h-3.5 w-3.5" />
      </Button>
    );
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card/30 overflow-hidden shadow-sm">
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <Table className="relative">
          <TableHeader className="bg-muted/10 border-b border-border/60 sticky top-0 bg-background/95 backdrop-blur z-10">
            <TableRow>
              <TableHead className="w-[50px] pl-4">
                <Checkbox
                  checked={allSelected ? true : isSomeSelected ? "indeterminate" : false}
                  onCheckedChange={(checked) => onSelectAll(!!checked)}
                  aria-label="Select all departments"
                  className="cursor-pointer"
                />
              </TableHead>
              <TableHead className="min-w-[220px]">
                <SortHeader field="name">Department Name</SortHeader>
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <SortHeader field="code">Dept Code</SortHeader>
              </TableHead>
              <TableHead className="min-w-[150px]">
                <SortHeader field="departmentHeadName">Department Head</SortHeader>
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Reporting To
              </TableHead>
              <TableHead className="min-w-[120px]">
                <SortHeader field="currentEmployeeCount">Total Employees</SortHeader>
              </TableHead>
              <TableHead className="min-w-[120px]">
                <SortHeader field="openPositions">Open Positions</SortHeader>
              </TableHead>
              <TableHead className="min-w-[120px]">
                <SortHeader field="budget">Annual Budget</SortHeader>
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Office Location
              </TableHead>
              <TableHead className="min-w-[140px]">
                <SortHeader field="createdDate">Created Date</SortHeader>
              </TableHead>
              <TableHead className="min-w-[110px]">
                <SortHeader field="status">Status</SortHeader>
              </TableHead>
              <TableHead className="w-[80px] text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.map((d) => {
              const isSelected = selectedIds.includes(d.id);
              const statusOpt = STATUS_OPTIONS.find((s) => s.value === d.status);
              
              // Load Lucide icon
              const IconComponent = (LucideIcons as any)[d.iconName] || Building2;

              return (
                <TableRow
                  key={d.id}
                  className={`group/row border-b border-border/50 transition-colors hover:bg-muted/15 cursor-pointer ${
                    isSelected ? "bg-muted/10" : ""
                  }`}
                  onClick={() => onView(d)}
                >
                  {/* Checkbox */}
                  <TableCell
                    className="pl-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => onSelectRow(d.id, !!checked)}
                      aria-label={`Select ${d.name}`}
                      className="cursor-pointer"
                    />
                  </TableCell>

                  {/* Icon + Department Name */}
                  <TableCell className="py-3 font-medium text-foreground">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${d.themeColor}, ${d.themeColor}cc)`,
                        }}
                      >
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate hover:underline">
                          {d.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          CC ID: {d.costCenter || "—"}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Code */}
                  <TableCell className="py-3 text-xs font-mono font-bold text-muted-foreground">
                    {d.code}
                  </TableCell>

                  {/* Department Head */}
                  <TableCell className="py-3 text-xs font-semibold text-foreground">
                    {d.departmentHeadName}
                  </TableCell>

                  {/* Reporting Manager */}
                  <TableCell className="py-3 text-xs text-muted-foreground">
                    {d.reportingManagerName}
                  </TableCell>

                  {/* Total Employees */}
                  <TableCell className="py-3 text-xs text-foreground font-semibold">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-muted-foreground/50" />
                      <span>
                        {d.currentEmployeeCount} /{" "}
                        <span className="text-[10px] text-muted-foreground">{d.employeeCapacity} Cap</span>
                      </span>
                    </div>
                  </TableCell>

                  {/* Open Positions */}
                  <TableCell className="py-3 text-xs font-semibold">
                    {d.openPositions > 0 ? (
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] px-2 py-0">
                        {d.openPositions} hiring
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground/60 italic text-[11px]">Filled</span>
                    )}
                  </TableCell>

                  {/* Budget */}
                  <TableCell className="py-3 text-xs text-foreground font-semibold">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-muted-foreground/50" />
                      {fmtBudget(d.budget)}
                    </div>
                  </TableCell>

                  {/* Office Location */}
                  <TableCell className="py-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 truncate max-w-[120px]">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground/50" />
                      {d.office}
                    </div>
                  </TableCell>

                  {/* Created Date */}
                  <TableCell className="py-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground/50" />
                      {fmtDate(d.createdDate)}
                    </div>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="py-3">
                    <Badge
                      variant="outline"
                      className={`px-2 py-0.5 text-[10px] font-semibold border ${
                        statusOpt?.color || "text-slate-500 bg-slate-500/10 border-slate-500/20"
                      }`}
                    >
                      {statusOpt?.label || d.status}
                    </Badge>
                  </TableCell>

                  {/* Actions Dropdown */}
                  <TableCell
                    className="py-3 text-right pr-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 rounded-lg hover:bg-muted/50 cursor-pointer"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl border-border bg-card">
                        <DropdownMenuItem
                          onClick={() => onView(d)}
                          className="text-xs flex items-center gap-2 cursor-pointer py-2"
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEdit(d)}
                          className="text-xs flex items-center gap-2 cursor-pointer py-2"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                          Edit Department
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(d)}
                          className="text-xs flex items-center gap-2 cursor-pointer py-2 text-rose-500 hover:bg-rose-500/10 focus:text-rose-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete Department
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

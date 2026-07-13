import React, { useMemo } from "react";
import {
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
  Building,
  MapPin,
  Calendar,
  Users,
} from "lucide-react";
import type { Manager, SortField, SortDir } from "../types";
import { EMPLOYMENT_TYPE_OPTIONS, STATUS_OPTIONS } from "../constants";
import { fmtDate, fmtRelative, labelFor, avatarHue } from "../utils";

interface ManagersTableProps {
  managers: Manager[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onView: (manager: Manager) => void;
  onEdit: (manager: Manager) => void;
  onDelete: (manager: Manager) => void;
  sortField: SortField;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
}

export function ManagersTable({
  managers,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onView,
  onEdit,
  onDelete,
  sortField,
  sortDir,
  onSort,
}: ManagersTableProps) {
  const allSelected = useMemo(() => {
    return managers.length > 0 && selectedIds.length === managers.length;
  }, [managers, selectedIds]);

  const isSomeSelected = useMemo(() => {
    return selectedIds.length > 0 && selectedIds.length < managers.length;
  }, [managers, selectedIds]);

  const statusColors: Record<Manager["status"], string> = {
    active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    probation: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    inactive: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    on_leave: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  const statusLabels: Record<Manager["status"], string> = {
    active: "Active",
    probation: "Probation",
    inactive: "Inactive",
    on_leave: "On Leave",
  };

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
    <div className="w-full max-w-full overflow-x-auto">
      <table className="w-full min-w-[1100px] caption-bottom text-sm">
          <TableHeader className="bg-muted/10 border-b border-border/60">
            <TableRow>
              <TableHead className="w-[50px] pl-4">
                <Checkbox
                  checked={allSelected ? true : isSomeSelected ? "indeterminate" : false}
                  onCheckedChange={(checked) => onSelectAll(!!checked)}
                  aria-label="Select all managers"
                  className="cursor-pointer"
                />
              </TableHead>
              <TableHead className="min-w-[200px]">
                <SortHeader field="fullName">Full Name</SortHeader>
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Employee ID
              </TableHead>
              <TableHead className="min-w-[150px]">
                <SortHeader field="department">Department</SortHeader>
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Designation
              </TableHead>
              <TableHead className="min-w-[110px]">
                <SortHeader field="teamSize">Team Size</SortHeader>
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Reporting To
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Office Location
              </TableHead>
              <TableHead className="min-w-[140px]">
                <SortHeader field="joiningDate">Joining Date</SortHeader>
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Employment
              </TableHead>
              <TableHead className="min-w-[110px]">
                <SortHeader field="status">Status</SortHeader>
              </TableHead>
              <TableHead className="min-w-[130px]">
                <SortHeader field="lastActive">Last Active</SortHeader>
              </TableHead>
              <TableHead className="w-[80px] text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managers.map((m) => {
              const displayName = m.fullName || "Manager";
              const hue = avatarHue(displayName);
              const initials = displayName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("");
              const isSelected = selectedIds.includes(m.id);

              return (
                <TableRow
                  key={m.id}
                  className={`group/row border-b border-border/50 transition-colors hover:bg-muted/15 cursor-pointer ${
                    isSelected ? "bg-muted/10" : ""
                  }`}
                  onClick={() => onView(m)}
                >
                  {/* Checkbox */}
                  <TableCell
                    className="pl-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => onSelectRow(m.id, !!checked)}
                      aria-label={`Select ${m.fullName}`}
                      className="cursor-pointer"
                    />
                  </TableCell>

                  {/* Avatar + Name */}
                  <TableCell className="py-3 font-medium text-foreground">
                    <div className="flex items-center gap-3">
                      {m.profileImage ? (
                        <img
                          src={m.profileImage}
                          alt={m.fullName}
                          className="h-9 w-9 rounded-xl object-cover border border-border/80 shadow-sm"
                        />
                      ) : (
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white shadow-inner"
                          style={{
                            background: `linear-gradient(135deg, hsl(${hue}, 65%, 55%), hsl(${(hue + 45) % 360}, 70%, 45%))`,
                          }}
                        >
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate hover:underline">
                          {m.fullName}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          {m.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Employee ID */}
                  <TableCell className="py-3 text-xs font-mono font-medium text-muted-foreground">
                    {m.employeeId}
                  </TableCell>

                  {/* Department */}
                  <TableCell className="py-3 text-xs font-semibold text-foreground">
                    <div className="flex items-center gap-1">
                      <Building className="h-3.5 w-3.5 text-muted-foreground/60" />
                      {m.department}
                    </div>
                  </TableCell>

                  {/* Designation */}
                  <TableCell className="py-3 text-xs text-muted-foreground">
                    {m.designation}
                  </TableCell>

                  {/* Team Size */}
                  <TableCell className="py-3 text-xs text-foreground font-semibold">
                    <div className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-muted-foreground/50" />
                      {m.teamSize} reports
                    </div>
                  </TableCell>

                  {/* Reporting To */}
                  <TableCell className="py-3 text-xs text-muted-foreground">
                    {m.reportingManagerName}
                  </TableCell>

                  {/* Office Location */}
                  <TableCell className="py-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 truncate max-w-[120px]">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground/50" />
                      {m.office}
                    </div>
                  </TableCell>

                  {/* Joining Date */}
                  <TableCell className="py-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground/50" />
                      {fmtDate(m.joiningDate)}
                    </div>
                  </TableCell>

                  {/* Employment Type */}
                  <TableCell className="py-3 text-xs text-muted-foreground">
                    {labelFor(m.employmentType, EMPLOYMENT_TYPE_OPTIONS)}
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell className="py-3">
                    <Badge variant="outline" className={`px-2 py-0.5 text-[10px] font-semibold border ${statusColors[m.status]}`}>
                      {statusLabels[m.status]}
                    </Badge>
                  </TableCell>

                  {/* Last Active */}
                  <TableCell className="py-3 text-xs text-muted-foreground">
                    {fmtRelative(m.lastActive)}
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
                          onClick={() => onView(m)}
                          className="text-xs flex items-center gap-2 cursor-pointer py-2"
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEdit(m)}
                          className="text-xs flex items-center gap-2 cursor-pointer py-2"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                          Edit Manager
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(m)}
                          className="text-xs flex items-center gap-2 cursor-pointer py-2 text-rose-500 hover:bg-rose-500/10 focus:text-rose-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete Manager
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
      </table>
    </div>
  );
}

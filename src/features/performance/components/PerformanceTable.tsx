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
import { Progress } from "@/components/ui/progress";
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
  Calendar,
  Users,
  Target,
  Trophy,
} from "lucide-react";
import type { PerformanceReview, SortField, SortDir } from "../types";
import { RATING_BADGES, REVIEW_STATUS_OPTIONS } from "../constants";
import { fmtDate } from "../utils";

interface PerformanceTableProps {
  reviews: PerformanceReview[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectRow: (id: string, checked: boolean) => void;
  onView: (review: PerformanceReview) => void;
  onEdit: (review: PerformanceReview) => void;
  onDelete: (review: PerformanceReview) => void;
  sortField: SortField;
  sortDir: SortDir;
  onSort: (field: SortField) => void;
}

export function PerformanceTable({
  reviews,
  selectedIds,
  onSelectAll,
  onSelectRow,
  onView,
  onEdit,
  onDelete,
  sortField,
  sortDir,
  onSort,
}: PerformanceTableProps) {
  const allSelected = useMemo(() => {
    return reviews.length > 0 && selectedIds.length === reviews.length;
  }, [reviews, selectedIds]);

  const isSomeSelected = useMemo(() => {
    return selectedIds.length > 0 && selectedIds.length < reviews.length;
  }, [reviews, selectedIds]);

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

  const getPromotionBadge = (status: PerformanceReview["promotionStatus"]) => {
    switch (status) {
      case "promoted":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px]">Promoted</Badge>;
      case "recommended":
        return <Badge className="bg-purple-500/10 text-purple-500 border border-purple-500/20 text-[10px]">Recommended</Badge>;
      case "eligible":
        return <Badge className="bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[10px]">Eligible</Badge>;
      default:
        return <span className="text-muted-foreground/60 text-xs">—</span>;
    }
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
                  aria-label="Select all performance rows"
                  className="cursor-pointer"
                />
              </TableHead>
              <TableHead className="min-w-[200px]">
                <SortHeader field="employeeName">Employee</SortHeader>
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <SortHeader field="employeeIdCode">Employee ID</SortHeader>
              </TableHead>
              <TableHead className="min-w-[150px]">
                <SortHeader field="department">Department</SortHeader>
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Manager
              </TableHead>
              <TableHead className="min-w-[110px]">
                <SortHeader field="overallRating">Rating Score</SortHeader>
              </TableHead>
              <TableHead className="min-w-[130px]">
                <SortHeader field="goalProgress">Goal Progress</SortHeader>
              </TableHead>
              <TableHead className="min-w-[110px]">
                <SortHeader field="kpiScore">KPI Score</SortHeader>
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Attendance
              </TableHead>
              <TableHead className="min-w-[110px]">
                <SortHeader field="reviewStatus">Status</SortHeader>
              </TableHead>
              <TableHead className="min-w-[130px]">
                <SortHeader field="lastReview">Last Review</SortHeader>
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Next Review
              </TableHead>
              <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Promotion Status
              </TableHead>
              <TableHead className="w-[80px] text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((r) => {
              const isSelected = selectedIds.includes(r.id);
              const initials = r.employeeName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("");
              const hue = Array.from(r.employeeName).reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

              const badgeDetails = RATING_BADGES[r.overallRating] || {
                label: "Unknown",
                color: "text-slate-500 bg-slate-500/10 border-slate-500/20",
              };
              
              const statusDetails = REVIEW_STATUS_OPTIONS.find((s) => s.value === r.reviewStatus) || {
                color: "text-slate-500 bg-slate-500/10 border-slate-500/20",
              };

              return (
                <TableRow
                  key={r.id}
                  className={`group/row border-b border-border/50 transition-colors hover:bg-muted/15 cursor-pointer ${
                    isSelected ? "bg-muted/10" : ""
                  }`}
                  onClick={() => onView(r)}
                >
                  {/* Checkbox */}
                  <TableCell
                    className="pl-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => onSelectRow(r.id, !!checked)}
                      aria-label={`Select ${r.employeeName}`}
                      className="cursor-pointer"
                    />
                  </TableCell>

                  {/* Avatar + Employee Name */}
                  <TableCell className="py-3 font-medium text-foreground">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white shadow-inner flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, hsl(${hue}, 60%, 55%), hsl(${(hue + 45) % 360}, 65%, 45%))`,
                        }}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate hover:underline">
                          {r.employeeName}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate">
                          {r.designation}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Employee ID */}
                  <TableCell className="py-3 text-xs font-mono font-medium text-muted-foreground">
                    {r.employeeIdCode}
                  </TableCell>

                  {/* Department */}
                  <TableCell className="py-3 text-xs font-semibold text-foreground">
                    <div className="flex items-center gap-1">
                      <Building className="h-3.5 w-3.5 text-muted-foreground/60" />
                      {r.department}
                    </div>
                  </TableCell>

                  {/* Manager */}
                  <TableCell className="py-3 text-xs text-muted-foreground">
                    {r.managerName}
                  </TableCell>

                  {/* Performance Score Rating Badge */}
                  <TableCell className="py-3">
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className={`px-2 py-0.5 text-[10px] font-semibold border ${badgeDetails.color} justify-center w-fit`}>
                        {r.overallRating} ★ {badgeDetails.label}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* Goal Progress bar */}
                  <TableCell className="py-3">
                    <div className="flex items-center gap-2 max-w-[100px]">
                      <Progress value={r.goalProgress} className="h-1.5 flex-1" />
                      <span className="text-[10px] font-bold text-foreground font-mono">{r.goalProgress}%</span>
                    </div>
                  </TableCell>

                  {/* KPI Score */}
                  <TableCell className="py-3 text-xs font-semibold text-foreground">
                    <div className="flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5 text-muted-foreground/50" />
                      <span>{r.kpiScore}%</span>
                    </div>
                  </TableCell>

                  {/* Attendance Score */}
                  <TableCell className="py-3 text-xs text-muted-foreground font-mono font-medium">
                    {r.attendance}/5
                  </TableCell>

                  {/* Review Status */}
                  <TableCell className="py-3">
                    <Badge variant="outline" className={`px-2 py-0.5 text-[10px] font-semibold border ${statusDetails.color}`}>
                      {r.reviewStatus.replace("_", " ").toUpperCase()}
                    </Badge>
                  </TableCell>

                  {/* Last Review */}
                  <TableCell className="py-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground/50" />
                      {fmtDate(r.lastReview)}
                    </div>
                  </TableCell>

                  {/* Next Review */}
                  <TableCell className="py-3 text-xs text-muted-foreground">
                    {fmtDate(r.nextReview)}
                  </TableCell>

                  {/* Promotion status */}
                  <TableCell className="py-3">
                    {getPromotionBadge(r.promotionStatus)}
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
                          onClick={() => onView(r)}
                          className="text-xs flex items-center gap-2 cursor-pointer py-2"
                        >
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onEdit(r)}
                          className="text-xs flex items-center gap-2 cursor-pointer py-2"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                          Edit Review
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(r)}
                          className="text-xs flex items-center gap-2 cursor-pointer py-2 text-rose-500 hover:bg-rose-500/10 focus:text-rose-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete Review
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

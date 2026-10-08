import React from "react";
import { Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { STAGE_FILTERS, STAGE_BADGES, getExitBadge } from "../constants";
import type { ExitCase } from "../types";

interface ExitRequestsPipelineProps {
  q: string;
  setQ: (val: string) => void;
  activeFilter: string;
  setActiveFilter: (val: string) => void;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  paginatedExits: ExitCase[];
  onRowClick: (exit: ExitCase) => void;
  onApprove: (exit: ExitCase, stageType: "manager" | "hr") => void;
  onReject: (exit: ExitCase) => void;
  onStartClearance: (exit: ExitCase) => void;
  onDeactivatePrompt: (exit: ExitCase) => void;
}

export function ExitRequestsPipeline({
  q,
  setQ,
  activeFilter,
  setActiveFilter,
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedExits,
  onRowClick,
  onApprove,
  onReject,
  onStartClearance,
  onDeactivatePrompt,
}: ExitRequestsPipelineProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card">
        {/* Filter / Search bars */}
        <div className="flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search employee, ID, designation..."
              className="h-9 pl-9 border-border bg-background/50 focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {STAGE_FILTERS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold border transition-colors cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background/40 border-border hover:bg-accent/60 text-muted-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table list */}
        {paginatedExits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-muted/50 border border-border text-muted-foreground">
              <LogOut className="h-6 w-6" />
            </div>
            <p className="font-semibold text-foreground">No exits found</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Adjust your filters or submit a resignation exit request.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[1000px] border-collapse">
              <TableHeader className="bg-muted/10 text-xs font-medium uppercase tracking-wider border-b border-border">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="px-4 py-3">Employee</TableHead>
                  <TableHead className="px-4 py-3">Employee ID</TableHead>
                  <TableHead className="px-4 py-3">Department</TableHead>
                  <TableHead className="px-4 py-3">Reporting Manager</TableHead>
                  <TableHead className="px-4 py-3">Resignation Date</TableHead>
                  <TableHead className="px-4 py-3">Last Working Day</TableHead>
                  <TableHead className="px-4 py-3 text-center">Notice Days</TableHead>
                  <TableHead className="px-4 py-3 text-center">Remaining Days</TableHead>
                  <TableHead className="px-4 py-3 text-center">Status</TableHead>
                  <TableHead className="px-4 py-3 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedExits.map((exit) => {
                  const badge = STAGE_BADGES[exit.stage] || {
                    label: exit.stage,
                  };
                  return (
                    <TableRow
                      key={exit.id}
                      className="group border-t border-border transition-colors hover:bg-accent/20 cursor-pointer"
                      onClick={() => onRowClick(exit)}
                    >
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-foreground font-bold text-xs">
                            {exit.employee
                              .split(" ")
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join("")}
                          </span>
                          <div className="font-semibold text-foreground truncate max-w-[150px]">
                            {exit.employee}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 font-mono text-xs text-foreground/80">
                        {exit.employeeId || "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                        {exit.department || "Operations"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs text-foreground/80">
                        {exit.managerName || "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                        {exit.resignedAt}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs font-semibold text-foreground/95">
                        {exit.lastWorkingDay}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center text-xs text-muted-foreground">
                        {exit.noticeDays}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center text-xs font-semibold">
                        {exit.remainingDays !== undefined ? (
                          <span
                            className={
                              exit.remainingDays <= 15 && exit.remainingDays > 0
                                ? "text-foreground font-bold"
                                : "text-foreground"
                            }
                          >
                            {exit.remainingDays} days
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <Badge
                          className={`${getExitBadge(exit.stage)} border shadow-none text-[11px] font-semibold`}
                        >
                          {badge.label}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className="px-4 py-3 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex justify-end gap-1 opacity-80 group-hover:opacity-100">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onRowClick(exit)}
                            className="h-7 text-[10px] border-border cursor-pointer hover:bg-accent/65"
                          >
                            View
                          </Button>
                          {exit.stage === "requested" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onApprove(exit, "hr")}
                                className="h-7 text-[10px] text-emerald-600 dark:text-emerald-400 border-border cursor-pointer"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onReject(exit)}
                                className="h-7 text-[10px] text-destructive border-destructive/30 cursor-pointer"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {exit.stage === "notice" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onStartClearance(exit)}
                              className="h-7 text-[10px] text-emerald-600 dark:text-emerald-400 border-border cursor-pointer"
                            >
                              Clearance
                            </Button>
                          )}
                          {exit.stage === "settlement" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onDeactivatePrompt(exit)}
                              className="h-7 text-[10px] text-destructive border-destructive/30 cursor-pointer"
                              title="Mark Completed & Archive"
                            >
                              Archive
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <span className="text-xs text-muted-foreground">
              Showing Page{" "}
              <strong className="font-semibold text-foreground">{currentPage}</strong> of{" "}
              <strong className="font-semibold text-foreground">{totalPages}</strong>
            </span>
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
                className="h-8 border-border hover:bg-accent/60 cursor-pointer"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
                className="h-8 border-border hover:bg-accent/60 cursor-pointer"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
